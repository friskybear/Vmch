use std::{io::Read, str::FromStr};

use actix_web::{
    delete, get, post,
    web::{Data, Path, Payload, Query},
    HttpResponse, Responder,
};
use derive_more::derive::Display;
use hashbrown::HashMap;
use itertools::Itertools;
use log::{info, RecordBuilder};
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use sha2::Digest;
use surrealdb::{engine::remote::ws::Client, RecordId, Surreal};

use crate::error;
use crate::{
    model::{self, *},
    Sessions,
};
#[derive(Deserialize, Serialize)]
struct Category {
    body_part: Vec<String>,
    gender: String,
    name: String,
    title: String,
    en_description: String,
    fa_description: String,
}
#[derive(Deserialize, Serialize)]
struct CategoryQuery {
    gender: Option<String>,
    order: Option<String>,
    search_bar: Option<String>,
    page: u32,
}
#[derive(Deserialize, Serialize, Debug)]
struct SearchDoctor {
    full_name: String,
    specialization: String,
    profile_image: String,
    consultation_fee: i32,
    availability: i32,
    medical_code: String,
    status: String,
    rate: Option<f32>,
}
#[get("/search/category/{category}")]
async fn get_doctors_by_category(
    category: Path<String>,
    query: Query<CategoryQuery>,
    db: Data<Surreal<Client>>,
) -> Result<impl Responder, error::Error> {
    let str = if query.search_bar.is_some() {
        "string::similarity::fuzzy(full_name, $search_bar1) AS score,"
    } else {
        ""
    };
    let category_all = if category.as_str() == "all" {
        ""
    } else {
        "category.title = $category and "
    };
    let mut query_str = format!("select full_name, specialization, profile_image, consultation_fee, availability,medical_code, status,{} (select math::mean(rating) as rate from sessions where doctor = $parent.id and rating != NONE)[0].rate as rate from doctors where {} status = 'active' and availability > 0",str,category_all);
    if let Some(gender) = query.gender.clone() {
        query_str.push_str(" and gender = $gender");
    }
    if let Some(search_bar) = query.search_bar.clone() {
        query_str.push_str(" and full_name ?~ $search_bar");
    }
    if query.search_bar.is_some() || query.order.is_some() {
        query_str.push_str(" order by ");
        if query.search_bar.is_some() {
            query_str.push_str(" score DESC ");
        }
        if let Some(order) = query.order.clone() {
            if order.to_ascii_lowercase() == "asc" {
                if query.search_bar.is_some() && query.order.is_some() {
                    query_str.push_str(", ");
                }
                query_str.push_str(" consultation_fee ASC");
            } else if order.to_ascii_lowercase() == "desc" {
                if query.search_bar.is_some() && query.order.is_some() {
                    query_str.push_str(", ");
                }
                query_str.push_str(" consultation_fee DESC");
            }
        }
    }

    query_str.push_str(" limit 40 start $page");
    query_str.push(';');
    let mut result = db.query(query_str).bind(("page", (query.page - 1) * 40));
    if "all" != category.to_string() {
        result = result.bind(("category", category.to_string()));
    }
    if let Some(gender) = query.gender.clone() {
        result = result.bind(("gender", gender))
    }
    if let Some(search_bar) = query.search_bar.clone() {
        result = result.bind(("search_bar", search_bar.clone()));
        result = result.bind(("search_bar1", search_bar));
    }

    let mut result = result.await?;
    let res: Vec<SearchDoctor> = result.take(0).unwrap();
    Ok(HttpResponse::Ok().json(res))
}

#[get("/categories")]
async fn get_categories(db: Data<Surreal<Client>>) -> Result<impl Responder, error::Error> {
    let mut result = db
        .query("select gender,title,name,body_part,en_description,fa_description from categories;")
        .await?;
    let res: Vec<Category> = result.take(0).unwrap();
    let mut result: HashMap<String, HashMap<String, Vec<HashMap<String, String>>>> = HashMap::new();
    for category in res {
        let gender_entry = result
            .entry(category.gender.clone())
            .or_insert_with(HashMap::new);
        for part in category.body_part {
            let body_part_entry = gender_entry.entry(part.clone()).or_insert_with(Vec::new);
            body_part_entry.push(HashMap::from([
                ("name".to_string(), category.name.clone()),
                ("title".to_string(), category.title.clone()),
                (
                    "en_description".to_string(),
                    category.en_description.clone(),
                ),
                (
                    "fa_description".to_string(),
                    category.fa_description.clone(),
                ),
            ]));
        }
    }
    Ok(HttpResponse::Ok().json(&result))
}

#[derive(Serialize, Deserialize, Debug)]
struct Guest {
    name: String,
    gender: String,
    national_code: i32,
    phone_number: String,
}
#[derive(Serialize, Deserialize, Debug)]
struct Session {
    medical_code: String,
    user_id: String,
    guest_data: Option<Guest>,
}
#[derive(Serialize, Deserialize, Debug)]
struct DoctorPrice {
    id: RecordId,
    consultation_fee: i32,
    admin_commission_percentage: i32,
}
#[post("/add_session")]
pub async fn add_session(
    db: Data<Surreal<Client>>,
    data: actix_web::web::Json<Session>,
) -> Result<impl Responder, error::Error> {
    let data = data.into_inner();
    let mut result = db.query("select id , consultation_fee ,admin_commission_percentage from doctors where medical_code = $medical_code").bind(("medical_code", data.medical_code)).await?;
    let doctor_prices: Vec<DoctorPrice> = result.take(0).unwrap();
    let doctor_prices = doctor_prices.into_iter().next().unwrap();
    println!("{:?}", RecordId::from_str(data.user_id.as_str()).unwrap());
    let mut result = db
        .query("select value wallet_balance from $user_id;")
        .bind((
            "user_id",
            RecordId::from_str(data.user_id.as_str()).unwrap(),
        ))
        .await?;
    let user_balance: Vec<i32> = result.take(0).unwrap();
    let user_balance = user_balance.into_iter().next().unwrap();
    if user_balance < doctor_prices.consultation_fee {
        return Ok(HttpResponse::Unauthorized().json("Unauthorized"));
    }

    let mut guest_query = "";
    if let Some(ref guest) = data.guest_data {
        guest_query = " target_full_name = $guest_name , target_national_code = $guest_national_code , target_gender = $guest_gender , phone_number = $phone_number,";
    }
    let query = format!("CREATE sessions SET doctor = $doctor,{} patient = $patient, status = $status, fee_paid = $fee_paid, admin_share = $admin_share",guest_query);
    let mut result = db
        .query(query)
        .bind(("doctor", doctor_prices.id.clone()))
        .bind((
            "patient",
            RecordId::from_str(data.user_id.clone().as_str()).unwrap(),
        ))
        .bind(("status", "new"))
        .bind(("fee_paid", doctor_prices.consultation_fee))
        .bind(("admin_share", doctor_prices.admin_commission_percentage));
    if let Some(ref guest) = data.guest_data {
        result = result
            .bind(("guest_name", guest.name.clone()))
            .bind(("guest_national_code", guest.national_code))
            .bind(("guest_gender", guest.gender.clone()))
            .bind(("phone_number", guest.phone_number.clone()))
    }
    let mut result = result.await?;
    println!("yp");
    info!("user {result:?}");
    let session: Vec<model::Session> = result.take(0).unwrap();
    let session = session.into_iter().next().unwrap();
    info!("session{session:?}");
    let mut result = db
        .query("UPDATE users SET wallet_balance = wallet_balance - $fee WHERE id = $user_id")
        .bind(("fee", doctor_prices.consultation_fee))
        .bind((
            "user_id",
            RecordId::from_str(data.user_id.clone().as_str()).unwrap(),
        ))
        .await?;
    info!("{result:?}");
    let mut result = db
        .query("UPDATE doctors SET wallet_balance = wallet_balance + $fee WHERE id = $doctor_id")
        .bind((
            "fee",
            doctor_prices.consultation_fee
                - (doctor_prices.consultation_fee * doctor_prices.admin_commission_percentage)
                    / 100,
        ))
        .bind(("doctor_id", doctor_prices.id))
        .await?;
    info!(" 2 L::: {result:?}");

    Ok(HttpResponse::Ok().json(session))
}

#[get("/search/name/{name}")]
async fn get_doctors_by_name(
    name: Path<String>,
    db: Data<Surreal<Client>>,
) -> Result<impl Responder, error::Error> {
    let mut result = db
        .query("select full_name, specialization, profile_image, consultation_fee, availability, status, (select math::mean(rating) as rate from sessions where doctor = $parent.id and rating != NONE)[0].rate as rate from doctors where name @@ $name and status = 'active' and availability > 0;")
        .bind(("name", name.into_inner()))
        .await?;
    let res: Vec<Value> = result.take(0).unwrap();
    Ok(HttpResponse::Ok().json(res))
}

#[get("/search/medical_code/{medical_code}")]
async fn get_doctors_by_medical_code(
    medical_code: Path<String>,
    db: Data<Surreal<Client>>,
) -> Result<impl Responder, error::Error> {
    let mut result = db
        .query("select full_name, medical_code, national_code, phone_number, email, specialization, category.name as category, profile_image, consultation_fee, admin_commission_percentage, wallet_balance, status, availability, card_number, created_at, updated_at, (select math::mean(rating) as rate from sessions where doctor = $parent.id and rating != NONE)[0].rate as rate from doctors where medical_code = $medical_code;")
        .bind(("medical_code", medical_code.into_inner()))
        .await?;
    let res: Vec<Value> = result.take(0).unwrap();
    Ok(HttpResponse::Ok().json(res))
}

#[derive(Serialize, Deserialize, Debug)]
struct SignIn {
    email: String,
    password: String,
}
#[post("/sign_in")]
async fn sign_in(
    db: Data<Surreal<Client>>,
    data: actix_web::web::Json<SignIn>,
) -> Result<impl Responder, error::Error> {
    info!("{:?}", data);
    let SignIn { email, password } = data.into_inner();
    let password = format!("{:x}", sha2::Sha256::digest(password.as_bytes()));
    info!("{:?}", email);
    let mut result = db
        .query("select * from users where email = $email and password_hash = $password;")
        .bind(("email", email.clone()))
        .bind(("password", password.clone()))
        .await?;
    let res: Vec<User> = result.take(0).unwrap();
    info!("{:?}", res);
    if res.is_empty() {
        let mut result2 = db
            .query("select * from doctors where email = $email and password_hash = $password;")
            .bind(("email", email.clone()))
            .bind(("password", password.clone()))
            .await?;
        let res2: Vec<Doctor> = result2.take(0).unwrap();
        info!("{:?}", res2);
        if !res2.is_empty() {
            let doctor = res2.first().unwrap().clone();
            let mut category = db
                .query("select value string::concat(category.title,'-', category.name) from $id;")
                .bind(("id", doctor.id.clone()))
                .await?;
            let category_result: Vec<String> = category.take(0).unwrap();

            let doctor_json = json!({
                "Doctor": {
                    "id": doctor.id.to_string(),
                    "fullName": doctor.full_name,
                    "email": doctor.email,
                    "nationalCode": doctor.national_code,
                    "phoneNumber": doctor.phone_number,
                    "birthDate": doctor.birth_date,
                    "gender": doctor.gender,
                    "walletBalance": doctor.wallet_balance,
                    "role": "doctor",
                    "medicalCode": doctor.medical_code,
                    "specialization": doctor.specialization,
                    "category": category_result.first().unwrap().clone(),
                    "profileImage": doctor.profile_image,
                    "consultationFee": doctor.consultation_fee,
                    "adminCommissionPercentage": doctor.admin_commission_percentage,
                    "status": doctor.status,
                    "availability": doctor.availability,
                    "cardNumber": doctor.card_number,
                }
            });
            return Ok(HttpResponse::Ok().json(doctor_json));
        }
        let mut result3 = db
            .query("select * from admins where email = $email and password_hash = $password;")
            .bind(("email", email))
            .bind(("password", password))
            .await?;
        let res3: Vec<Admin> = result3.take(0).unwrap();
        info!("{:?}", res3);
        if !res3.is_empty() {
            let admin = res3.first().unwrap();
            let admin_json = json!({
                "Admin": {
                    "id": admin.id.to_string(),
                    "fullName": admin.full_name,
                    "email": admin.email,
                    "role": "admin",
                    "nationalCode": admin.national_code,
                    "birthDate": admin.birth_date,
                    "gender": admin.gender,
                    "role": "Admin",
                }
            });
            return Ok(HttpResponse::Ok().json(admin_json));
        }
        return Ok(HttpResponse::Unauthorized().json("Unauthorized"));
    }
    let user = res.first().unwrap();
    let user_json = json!({
        "Patient": {
            "id": user.id.to_string(),
            "fullName": user.full_name,
            "email": user.email,
            "nationalCode": user.national_code,
            "phoneNumber": user.phone_number,
            "birthDate": user.birth_date,
            "gender": user.gender,
            "walletBalance": user.wallet_balance,
            "role": "patient",
                }
    });
    Ok(HttpResponse::Ok().json(user_json))
}

#[derive(Serialize, Deserialize)]
struct SignUp {
    birth_date: String,
    full_name: String,
    gender: String,
    national_code: String,
    phone_number: String,
    email: String,
    password_hash: String,
}
#[post("/sign_up")]
async fn sign_up(
    db: Data<Surreal<Client>>,
    data: actix_web::web::Json<SignUp>,
) -> Result<impl Responder, error::Error> {
    let SignUp {
        birth_date,
        full_name,
        gender,
        national_code,
        phone_number,
        email,
        password_hash,
    } = data.into_inner();
    let password_hash = format!("{:x}", sha2::Sha256::digest(password_hash.as_bytes()));
    let birth_date = surrealdb::Datetime::from(
        chrono::DateTime::parse_from_rfc3339(birth_date.as_str())
            .unwrap()
            .to_utc(),
    );

    let mut result = db
        .query("select email from users where email = $email or national_code = $national_code;")
        .bind(("email", email.clone()))
        .bind(("national_code", national_code.clone()))
        .await?;
    let res: Vec<Value> = result.take(0).unwrap();
    if !res.is_empty() {
        return Ok(HttpResponse::Conflict().json("Conflict"));
    }

    let mut result2 = db
        .query("insert into users (full_name, national_code, phone_number, email, password_hash, birth_date, gender) values ($full_name, $national_code, $phone_number, $email, $password, $birth_date, $gender);")
        .bind(("full_name", full_name))
        .bind(("national_code", national_code))
        .bind(("phone_number", phone_number))
        .bind(("email", email))
        .bind(("password", password_hash))
        .bind(("birth_date", birth_date))
        .bind(("gender", gender))
        .await?;

    if !result2.take_errors().is_empty() {
        return Ok(HttpResponse::InternalServerError().json("Internal Server Error"));
    }
    let users = result2.take::<Vec<User>>(0).unwrap();
    let user = users.first().unwrap();
    let user_json = json!({
        "Patient": {
            "id": user.id.to_string(),
            "fullName": user.full_name,
            "email": user.email,
            "nationalCode": user.national_code,
            "phoneNumber": user.phone_number,
            "birthDate": user.birth_date,
            "gender": user.gender,
            "walletBalance": user.wallet_balance,
            "role": "patient",
                }
    });

    Ok(HttpResponse::Ok().json(user_json))
}

#[derive(Deserialize, Display)]
struct Info {
    username: String,
}

#[get("/test")]
async fn test(asd: Query<Info>) -> Result<impl Responder, error::Error> {
    let stre = asd.0;
    println!("{}", stre);
    Ok(HttpResponse::Ok().json(stre.username))
}

#[get("/search/admins")]
async fn get_admins(
    db: Data<Surreal<Client>>,
    query: Query<CategoryQuery>,
) -> Result<impl Responder, error::Error> {
    let mut search_query = "";
    let mut score = "";
    let mut order = "";
    let mut omit = "";
    let mut end = "";
    if let Some(search_bar) = query.search_bar.clone() {
        if let Ok(n) = search_bar.parse::<i32>() {
            search_query = "where national_code ?~ $search_bar";
            score = ",string::similarity::fuzzy(national_code, $search_bar) AS score";
        } else {
            search_query = "where full_name ?~ $search_bar";
            score = ",string::similarity::fuzzy(full_name, $search_bar) AS score";
        }
        order = " order by score DESC";
        omit = "select * omit score from (";
        end = " )";
    }
    let mut query_str = format!(
        "{}select *{} from admins {} {} limit 40 start $page {};",
        omit, score, search_query, order, end
    );
    let mut result = db
        .query(query_str.clone())
        .bind(("search_bar", query.search_bar.clone()))
        .bind(("page", query.page - 1))
        .await?;
    let res: Vec<Admin> = result.take(0).unwrap();
    let res = res
        .iter()
        .map(|admin| {
            json!({
                "id": admin.id.to_string(),
                "full_name": admin.full_name,
                "email": admin.email,
                "birth_date": admin.birth_date,
                "national_code": admin.national_code,
                "gender": admin.gender,
                "password_hash": admin.password_hash,
                "created_at": admin.created_at,
                "updated_at": admin.updated_at
            })
        })
        .collect_vec();
    Ok(HttpResponse::Ok().json(res))
}

#[post("/upsert_admin")]
async fn upsert_admin(
    db: Data<Surreal<Client>>,
    data: actix_web::web::Json<NewAdmin>,
) -> Result<impl Responder, error::Error> {
    let NewAdmin {
        id,
        full_name,
        email,
        birth_date,
        national_code,
        gender,
        password_hash,
        created_at,
        updated_at,
    } = data.into_inner();
    println!("{id:?}");
    let mut str = "";
    if let Some(_id) = id.clone() {
        str = "where id = $id";
    }
    let query = format!("upsert admins set full_name = $full_name, email = $email, birth_date = $birth_date, national_code = $national_code, gender = $gender, password_hash = $password_hash {};",str);
    let mut result = db
        .query(query.clone())
        .bind(("full_name", full_name))
        .bind(("email", email))
        .bind((
            "birth_date",
            surrealdb::Datetime::from(
                chrono::DateTime::parse_from_rfc3339(birth_date.as_str())
                    .unwrap()
                    .to_utc(),
            ),
        ))
        .bind(("national_code", national_code))
        .bind(("gender", gender))
        .bind(("password_hash", password_hash));
    if let Some(_id) = id {
        result = result.bind(("id", RecordId::from_str(_id.as_str()).unwrap()));
    }

    let mut result = result.await?;

    let result: Vec<Admin> = result.take(0).unwrap();
    Ok(HttpResponse::Ok().json(result.first().as_ref().unwrap()))
}

#[get("/search/doctors")]
async fn get_doctors(
    db: Data<Surreal<Client>>,
    query: Query<CategoryQuery>,
) -> Result<impl Responder, error::Error> {
    let mut search_query = "";
    let mut score = "";
    let mut order = "";
    let mut omit = "";
    let mut end = "";
    if let Some(search_bar) = query.search_bar.clone() {
        if let Ok(n) = search_bar.parse::<i32>() {
            search_query = "where medical_code ?~ $search_bar";
            score = ",string::similarity::fuzzy(medical_code, $search_bar) AS score";
        } else {
            search_query = "where full_name ?~ $search_bar";
            score = ",string::similarity::fuzzy(full_name, $search_bar) AS score";
        }
        order = " order by score DESC";
        omit = "select * omit score from (";
        end = " )";
    }
    let mut query_str = format!(
        "{}select *{} from doctors {} {} limit 40 start $page {};",
        omit, score, search_query, order, end
    );
    let mut result = db
        .query(query_str.clone())
        .bind(("search_bar", query.search_bar.clone()))
        .bind(("page", query.page - 1))
        .await?;
    let res: Vec<Doctor> = result.take(0).unwrap();
    let res = res
        .iter()
        .map(|doctor| {
            json!({
                "id": doctor.id.to_string(),
                "full_name": doctor.full_name,
                "medical_code": doctor.medical_code,
                "national_code": doctor.national_code,
                "phone_number": doctor.phone_number,
                "password_hash": doctor.password_hash,
                "email": doctor.email,
                "birth_date": doctor.birth_date,
                "gender": doctor.gender,
                "specialization": doctor.specialization,
                "profile_image": doctor.profile_image,
                "consultation_fee": doctor.consultation_fee,
                "admin_commission_percentage": doctor.admin_commission_percentage,
                "wallet_balance": doctor.wallet_balance,
                "status": doctor.status,
                "availability": doctor.availability,
                "card_number": doctor.card_number,
                "created_at": doctor.created_at,
                "updated_at": doctor.updated_at,
            })
        })
        .collect_vec();
    Ok(HttpResponse::Ok().json(res))
}
#[post("/upsert_doctor")]
async fn upsert_doctor(
    db: Data<Surreal<Client>>,
    data: actix_web::web::Json<NewDoctor>,
) -> Result<impl Responder, error::Error> {
    let NewDoctor {
        id,
        full_name,
        medical_code,
        national_code,
        phone_number,
        email,
        password_hash,
        birth_date,
        gender,
        specialization,
        category,
        profile_image,
        consultation_fee,
        admin_commission_percentage,
        wallet_balance,
        status,
        availability,
        card_number,
        created_at,
        updated_at,
    } = data.into_inner();
    println!("{id:?}");
    let mut str = "";
    if let Some(_id) = id.clone() {
        str = "where id = $id";
    }
    let query = format!("upsert doctors set full_name = $full_name, medical_code = $medical_code, national_code = $national_code, phone_number = $phone_number, email = $email, password_hash = $password_hash, birth_date = $birth_date, gender = $gender, specialization = $specialization, category = $category, profile_image = $profile_image, consultation_fee = $consultation_fee, admin_commission_percentage = $admin_commission_percentage, wallet_balance = $wallet_balance, status = $status, availability = $availability, card_number = $card_number {};",str);
    let mut result = db
        .query(query.clone())
        .bind(("full_name", full_name))
        .bind(("medical_code", medical_code))
        .bind(("national_code", national_code))
        .bind(("phone_number", phone_number))
        .bind(("email", email))
        .bind(("password_hash", password_hash))
        .bind((
            "birth_date",
            surrealdb::Datetime::from(
                chrono::DateTime::parse_from_rfc3339(birth_date.as_str())
                    .unwrap()
                    .to_utc(),
            ),
        ))
        .bind(("gender", gender))
        .bind(("specialization", specialization))
        .bind(("category", category))
        .bind(("profile_image", profile_image))
        .bind(("consultation_fee", consultation_fee))
        .bind(("admin_commission_percentage", admin_commission_percentage))
        .bind(("wallet_balance", wallet_balance))
        .bind(("status", status))
        .bind(("availability", availability))
        .bind(("card_number", card_number));
    if let Some(_id) = id {
        result = result.bind(("id", RecordId::from_str(_id.as_str()).unwrap()));
    }

    let mut result = result.await?;

    let result: Vec<Doctor> = result.take(0).unwrap();
    Ok(HttpResponse::Ok().json(result.first().as_ref().unwrap()))
}

#[get("/search/users")]
async fn get_users(
    db: Data<Surreal<Client>>,
    query: Query<CategoryQuery>,
) -> Result<impl Responder, error::Error> {
    let mut search_query = "";
    let mut score = "";
    let mut order = "";
    let mut omit = "";
    let mut end = "";
    if let Some(search_bar) = query.search_bar.clone() {
        if let Ok(n) = search_bar.parse::<i32>() {
            search_query = "where national_code ?~ $search_bar";
            score = ",string::similarity::fuzzy(national_code, $search_bar) AS score";
        } else {
            search_query = "where full_name ?~ $search_bar";
            score = ",string::similarity::fuzzy(full_name, $search_bar) AS score";
        }
        order = " order by score DESC";
        omit = "select * omit score from (";
        end = " )";
    }
    let mut query_str = format!(
        "{}select *{} from users {} {} limit 40 start $page {};",
        omit, score, search_query, order, end
    );
    let mut result = db
        .query(query_str.clone())
        .bind(("search_bar", query.search_bar.clone()))
        .bind(("page", query.page - 1))
        .await?;
    let res: Vec<User> = result.take(0).unwrap();
    let res = res
        .iter()
        .map(|user| {
            json!({
                "id": user.id.to_string(),
                "full_name": user.full_name,
                "national_code": user.national_code,
                "phone_number": user.phone_number,
                "birth_date": user.birth_date,
                "gender": user.gender,
                "email": user.email,
                "password_hash": user.password_hash,
                "wallet_balance": user.wallet_balance,
                "created_at": user.created_at,
                "updated_at": user.updated_at,
            })
        })
        .collect_vec();
    Ok(HttpResponse::Ok().json(res))
}
#[post("/upsert_user")]
async fn upsert_user(
    db: Data<Surreal<Client>>,
    data: actix_web::web::Json<NewUser>,
) -> Result<impl Responder, error::Error> {
    let NewUser {
        id,
        full_name,
        national_code,
        phone_number,
        email,
        password_hash,
        birth_date,
        gender,
        wallet_balance,
        created_at,
        updated_at,
    } = data.into_inner();
    println!("{id:?}");
    let mut str = "";
    if let Some(_id) = id.clone() {
        str = "where id = $id";
    }
    let query = format!("upsert users set full_name = $full_name, national_code = $national_code, phone_number = $phone_number, email = $email, password_hash = $password_hash, birth_date = $birth_date, gender = $gender, wallet_balance = $wallet_balance {};",str);
    let mut result = db
        .query(query.clone())
        .bind(("full_name", full_name))
        .bind(("national_code", national_code))
        .bind(("phone_number", phone_number))
        .bind(("email", email))
        .bind(("password_hash", password_hash))
        .bind((
            "birth_date",
            surrealdb::Datetime::from(
                chrono::DateTime::parse_from_rfc3339(birth_date.as_str())
                    .unwrap()
                    .to_utc(),
            ),
        ))
        .bind(("gender", gender))
        .bind(("wallet_balance", wallet_balance));
    if let Some(_id) = id {
        result = result.bind(("id", RecordId::from_str(_id.as_str()).unwrap()));
    }

    let mut result = result.await?;

    let result: Vec<User> = result.take(0).unwrap();
    Ok(HttpResponse::Ok().json(result.first().as_ref().unwrap()))
}
#[delete("/delete_user/{id}")]
async fn delete_entity(
    db: Data<Surreal<Client>>,
    path: actix_web::web::Path<String>,
) -> Result<impl Responder, error::Error> {
    let id = path.into_inner();
    let query = "delete $id;";
    let mut result = db
        .query(query)
        .bind(("id", RecordId::from_str(id.as_str()).unwrap()))
        .await?;
    let result: Vec<Value> = result.take(0).unwrap();
    Ok(HttpResponse::Ok().json(result.first().as_ref().unwrap()))
}
