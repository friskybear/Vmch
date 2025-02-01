use chrono::Utc;
use model::{Admin, Category, Doctor, Log, Notification, Payment, Session, Withdrawal};
use rand::rngs::OsRng;
use rand::{thread_rng, Rng};
use serde_json::json;
use sha2::Digest;
use std::sync::LazyLock;
use surrealdb::engine::remote::ws::Client;
use surrealdb::opt::auth::Root;
use surrealdb::sql::RecordAccess;
use surrealdb::{sql, RecordId, Surreal};
static DB: LazyLock<Surreal<Client>> = LazyLock::new(Surreal::init);
mod model;
use crate::model::User;
async fn create_fake_data() {
    let mut server = std::process::Command::new("../SurrealDb.exe")
        .args(["start", "memory", "-A", "--user", "root", "--pass", "root"])
        .spawn()
        .expect("Failed to start SurrealDB server");

    // Give the server a moment to start up
    tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;
    DB.connect::<surrealdb::engine::remote::ws::Ws>("127.0.0.1:8000")
        .await
        .unwrap();

    DB.use_ns("test").use_db("test").await.unwrap();
    DB.signin(Root {
        username: "root",
        password: "root",
    })
    .await
    .unwrap();
    DB.query(db_init).await.unwrap();

    // Generate fake data for each table
    generate_users().await;
    generate_categories().await;
    generate_doctors().await;
    generate_admins().await;
    generate_sessions().await;
    generate_payments().await;
    generate_withdrawals().await;
    generate_notifications().await;
    generate_logs().await;
    server.wait();
}

async fn generate_users() {
    for i in 0..=10 {
        let mut name = mockd::name::full();
        let mut national_code = thread_rng().gen_range(1000000000u64..9999999999).to_string();
        let mut phone_number = mockd::contact::phone();
        let mut email = mockd::contact::email();
        let mut rand_string = mockd::words::word().as_bytes().to_vec();
        let mut salt = b"my secret password for hash generation";
        let mut config = argon2::Config::default();
        let mut password_hash =
            argon2::hash_encoded(rand_string.as_slice(), salt.as_slice(), &config).unwrap();
        let mut password_hash = format!("{:x}", sha2::Sha256::digest(password_hash.as_bytes()));
        let mut wallet_balance = thread_rng().gen_range(40000..1000000);
        let mut birth_date = mockd::datetime::date_range(
            "2000-04-23T19:30:12Z".to_string(),
            "2005-10-02T19:30:12Z".to_string(),
        );
        let mut birth_date = surrealdb::Datetime::from(birth_date);
        let mut gender = if mockd::bool_rand::bool() {
            "man"
        } else {
            "woman"
        };
        if i == 10 {
            name = "Test User".to_string();
            national_code = "1234567890".to_string();
            phone_number = "+989123456789".to_string();
            email = "user@test.com".to_string();
            salt = b"my secret password for hash generation";
            config = argon2::Config::default();
            password_hash = argon2::hash_encoded(b"123456789", salt.as_slice(), &config).unwrap();
            password_hash = format!("{:x}", sha2::Sha256::digest(password_hash.as_bytes()));
            wallet_balance = 50000;
            birth_date = surrealdb::Datetime::from(
                chrono::DateTime::parse_from_rfc3339("2002-04-23T19:30:12Z")
                    .unwrap()
                    .to_utc(),
            );
            gender = "man";
        }

        let result = DB
            .query("CREATE users SET id = $id, full_name = $full_name, national_code = $national_code, phone_number = $phone_number, email = $email, password_hash = $password_hash, wallet_balance = $wallet_balance, birth_date = $birth_date, gender = $gender")
            .bind(("full_name", name))
            .bind(("national_code", national_code))
            .bind(("phone_number", phone_number))
            .bind(("email", email))
            .bind(("password_hash", password_hash))
            .bind(("wallet_balance", wallet_balance))
            .bind(("birth_date", birth_date))
            .bind(("gender", gender))
            .bind(("id", i))
            .await
            .unwrap();
    }
}

async fn generate_doctors() {
    let mut rng = thread_rng();
    for i in 0..=200 {
        let mut category_id = rng.gen_range(0..2);
        let mut full_name = mockd::name::full();
        let mut medical_code = rng.gen_range(1_000_000..9_999_999).to_string();
        let mut national_code = thread_rng().gen_range(1000000000u64..9999999999).to_string();
        let mut phone_number = mockd::contact::phone();
        let mut email = mockd::contact::email();
        let rand_string = mockd::words::word().as_bytes().to_vec();
        let mut salt = b"my secret password for hash generation";
        let mut config = argon2::Config::default();
        let password_hash =
            argon2::hash_encoded(rand_string.as_slice(), salt.as_slice(), &config).unwrap();
        let mut password_hash = format!("{:x}", sha2::Sha256::digest(password_hash.as_bytes()));

        let mut specialization = "General";
        let mut category = RecordId::from_table_key("categories", category_id);
        let mut profile_image = "https://picsum.photos/300/400";
        let mut consultation_fee = rng.gen_range(20000..250000);
        let mut admin_commission_percentage = 15;
        let mut wallet_balance = rng.gen_range(40000..1000000);
        let mut status = "active";
        let mut availability = rng.gen_range(1..10);
        let mut card_number = vec![
            "1234 5678 9101 1121".to_string(),
            "2445 5635 9251 1621".to_string(),
        ];
        let birth_date = mockd::datetime::date_range(
            "2000-04-23T19:30:12Z".to_string(),
            "2005-10-02T19:30:12Z".to_string(),
        );
        let mut birth_date = surrealdb::Datetime::from(birth_date);

        let mut gender = if mockd::bool_rand::bool() {
            "man"
        } else {
            "woman"
        };
        if i == 10 {
            full_name = "Test Doctor".to_string();
            medical_code = "1234567890".to_string();
            national_code = "1234567891".to_string();
            phone_number = "+989123456789".to_string();
            email = "doctor@test.com".to_string();
            salt = b"my secret password for hash generation";
            config = argon2::Config::default();
            password_hash = argon2::hash_encoded(b"123456789", salt.as_slice(), &config).unwrap();
            password_hash = format!("{:x}", sha2::Sha256::digest(password_hash.as_bytes()));
            specialization = "Skin";
            category = RecordId::from_table_key("categories", 1);
            profile_image = "https://picsum.photos/300/400";
            consultation_fee = 30000;
            admin_commission_percentage = 15;
            wallet_balance = 50000;
            status = "active";
            availability = 10;
            card_number = vec![
                "1234 5678 9101 1121".to_string(),
                "2445 5635 9251 1621".to_string(),
            ];
            birth_date = surrealdb::Datetime::from(
                chrono::DateTime::parse_from_rfc3339("2000-04-23T19:30:12Z")
                    .unwrap()
                    .to_utc(),
            );
            gender = "man";
        }

        let  result = DB
            .query("CREATE doctors SET id = $id, full_name = $full_name, medical_code = $medical_code, national_code = $national_code, phone_number = $phone_number, email = $email, password_hash = $password_hash, specialization = $specialization, category = $category, profile_image = $profile_image, consultation_fee = $consultation_fee, admin_commission_percentage = $admin_commission_percentage, wallet_balance = $wallet_balance, status = $status, availability = $availability, card_number = $card_number, birth_date = $birth_date, gender = $gender")
            .bind(("full_name", full_name))
            .bind(("medical_code", medical_code))
            .bind(("national_code", national_code))
            .bind(("phone_number", phone_number))
            .bind(("email", email))
            .bind(("password_hash", password_hash))
            .bind(("specialization", specialization))
            .bind(("category", category))
            .bind(("profile_image", profile_image))
            .bind(("consultation_fee", consultation_fee))
            .bind(("admin_commission_percentage", admin_commission_percentage))
            .bind(("wallet_balance", wallet_balance))
            .bind(("status", status))
            .bind(("availability", availability))
            .bind(("card_number", card_number))
            .bind(("birth_date", birth_date))
            .bind(("gender", gender))
            .bind(("id", i))
            .await
            .unwrap();
    }
}

async fn generate_admins() {
    for i in 0..=3 {
        let mut full_name = mockd::name::full() + " Admin";
        let mut email = mockd::contact::email();
        let mut national_code = thread_rng().gen_range(1000000000u64..9999999999).to_string();
        let rand_string = mockd::words::word().as_bytes().to_vec();
        let mut salt = b"my secret password for hash generation";
        let mut config = argon2::Config::default();
        let password_hash =
            argon2::hash_encoded(rand_string.as_slice(), salt.as_slice(), &config).unwrap();
        let mut password_hash = format!("{:x}", sha2::Sha256::digest(password_hash.as_bytes()));

        let birth_date = mockd::datetime::date_range(
            "2000-04-23T19:30:12Z".to_string(),
            "2005-10-02T19:30:12Z".to_string(),
        );
        let mut birth_date = surrealdb::Datetime::from(birth_date);

        let mut gender = if mockd::bool_rand::bool() {
            "man"
        } else {
            "woman"
        };
        if i == 3 {
            full_name = "Test Admin".to_string();
            national_code = "1234567892".to_string();
            email = "admin@test.com".to_string();
            salt = b"my secret password for hash generation";
            config = argon2::Config::default();
            password_hash = argon2::hash_encoded(b"123456789", salt.as_slice(), &config).unwrap();
            password_hash = format!("{:x}", sha2::Sha256::digest(password_hash.as_bytes()));
            birth_date = surrealdb::Datetime::from(
                chrono::DateTime::parse_from_rfc3339("2002-04-23T19:30:12Z")
                    .unwrap()
                    .to_utc(),
            );
            gender = "man";
        }

        let result = DB
            .query("CREATE admins SET id = $id, full_name = $full_name, email = $email, password_hash = $password_hash, birth_date = $birth_date, gender = $gender, national_code = $national_code")
            .bind(("full_name", full_name))
            .bind(("national_code", national_code))
            .bind(("email", email))
            .bind(("password_hash", password_hash))
            .bind(("birth_date", birth_date))
            .bind(("gender", gender))
            .bind(("id", i))
            .await
            .unwrap();
    }
}

async fn generate_categories() {
    let doctor_categories = vec![
        ("man", "head", vec![
            ("متخصص مغز و اعصاب", "Neurologist",
             "Specializes in diagnosing and treating neurological disorders like migraines, epilepsy, and multiple sclerosis.",
             "متخصص در تشخیص و درمان اختلالات عصبی مانند میگرن، صرع و ام‌اس."),
            ("متخصص گوش و حلق و بینی", "ENT Specialist",
             "Treats conditions such as sinusitis, ear infections, and hearing loss.",
             "درمان بیماری‌هایی مانند سینوزیت، عفونت‌های گوش و کاهش شنوایی."),
            ("متخصص روانپزشکی", "Psychiatrist",
             "Focuses on mental health conditions like anxiety, depression, and bipolar disorder.",
             "متمرکز بر درمان مشکلات روانی مانند اضطراب، افسردگی و اختلال دوقطبی."),
            ("متخصص چشم پزشکی", "Ophthalmologist",
             "Handles eye problems such as cataracts, glaucoma, and vision correction.",
             "تشخیص و درمان مشکلات چشمی مانند آب‌مروارید، گلوکوم و اصلاح بینایی."),
            ("متخصص جراحی مغز و اعصاب", "Neurosurgeon",
             "Performs surgeries for brain tumors, spinal injuries, and nerve compression.",
             "انجام جراحی برای تومورهای مغزی، آسیب‌های نخاعی و فشردگی عصب."),
        ]),
        ("man", "chest", vec![
            ("متخصص قلب و عروق", "Cardiologist",
             "Diagnoses and treats heart-related conditions such as coronary artery disease and arrhythmias.",
             "تشخیص و درمان بیماری‌های قلبی مانند بیماری عروق کرونری و آریتمی."),
            ("متخصص ریه", "Pulmonologist",
             "Focuses on respiratory issues including asthma, COPD, and lung infections.",
             "درمان مشکلات تنفسی مانند آسم، COPD و عفونت‌های ریوی."),
            ("متخصص داخلی", "Internist",
             "Provides comprehensive care for chronic illnesses such as hypertension and diabetes.",
             "ارائه مراقبت‌های جامع برای بیماری‌های مزمن مانند فشارخون و دیابت."),
            ("متخصص جراحی قفسه سینه", "Thoracic Surgeon",
             "Performs surgeries for conditions like lung cancer and esophageal disorders.",
             "انجام جراحی برای سرطان ریه و اختلالات مری."),
        ]),
        ("man", "stomach", vec![
            ("متخصص گوارش و کبد", "Gastroenterologist",
             "Treats digestive system issues including ulcers, IBS, and liver diseases.",
             "درمان مشکلات دستگاه گوارش مانند زخم معده، IBS و بیماری‌های کبدی."),
            ("متخصص تغذیه", "Nutritionist",
             "Advises on dietary plans to manage weight and nutritional deficiencies.",
             "مشاوره تغذیه‌ای برای مدیریت وزن و کمبودهای تغذیه‌ای."),
            ("متخصص جراحی عمومی", "General Surgeon",
             "Handles surgeries like appendectomies and hernia repairs.",
             "انجام جراحی‌هایی مانند آپاندکتومی و ترمیم فتق."),
        ]),
        ("man", "below-abdomen", vec![
            ("متخصص کلیه و مجاری ادراری", "Urologist",
             "Diagnoses and treats urinary tract infections, kidney stones, and bladder issues.",
             "تشخیص و درمان عفونت‌های ادراری، سنگ کلیه و مشکلات مثانه."),
            ("متخصص غدد", "Endocrinologist",
             "Focuses on hormonal disorders such as diabetes and thyroid dysfunction.",
             "مدیریت اختلالات هورمونی مانند دیابت و مشکلات تیروئید."),
            ("متخصص جراحی کلیه و مجاری ادراری", "Urological Surgeon",
             "Performs surgeries for kidney and urinary tract disorders.",
             "انجام جراحی برای اختلالات کلیه و دستگاه ادراری."),
        ]),
        ("man", "feet", vec![
            ("متخصص ارتوپدی", "Orthopedist",
             "Treats bone fractures, joint pain, and arthritis.",
             "درمان شکستگی‌های استخوان، درد مفاصل و آرتریت."),
            ("متخصص طب فیزیکی و توانبخشی", "Physical Medicine and Rehabilitation Specialist",
             "Focuses on recovery from injuries and improving mobility.",
             "تمرکز بر بهبود پس از آسیب‌ها و افزایش تحرک."),
            ("متخصص جراحی پا و مچ پا", "Foot and Ankle Surgeon",
             "Handles surgeries for fractures, sprains, and deformities.",
             "انجام جراحی برای شکستگی‌ها، پیچ‌خوردگی‌ها و ناهنجاری‌ها."),
        ]),
        ("man", "hand", vec![
            ("متخصص ارتوپدی", "Orthopedist",
             "Deals with hand injuries, fractures, and arthritis.",
             "درمان آسیب‌های دست، شکستگی‌ها و آرتریت."),
            ("متخصص جراحی دست", "Hand Surgeon",
             "Specializes in surgeries for hand and wrist issues.",
             "تخصص در جراحی دست و مچ دست."),
            ("متخصص توانبخشی", "Rehabilitation Specialist",
             "Helps with functional recovery post-injury or surgery.",
             "کمک به بهبود عملکرد پس از آسیب یا جراحی."),
        ]),
        ("woman", "head", vec![
            ("متخصص مغز و اعصاب", "Neurologist",
             "Specializes in diagnosing and treating neurological disorders like migraines, epilepsy, and multiple sclerosis.",
             "متخصص در تشخیص و درمان اختلالات عصبی مانند میگرن، صرع و ام‌اس."),
            ("متخصص گوش و حلق و بینی", "ENT Specialist",
             "Treats conditions such as sinusitis, ear infections, and hearing loss.",
             "درمان بیماری‌هایی مانند سینوزیت، عفونت‌های گوش و کاهش شنوایی."),
            ("متخصص روانپزشکی", "Psychiatrist",
             "Focuses on mental health conditions like anxiety, depression, and bipolar disorder.",
             "متمرکز بر درمان مشکلات روانی مانند اضطراب، افسردگی و اختلال دوقطبی."),
            ("متخصص چشم پزشکی", "Ophthalmologist",
             "Handles eye problems such as cataracts, glaucoma, and vision correction.",
             "تشخیص و درمان مشکلات چشمی مانند آب‌مروارید، گلوکوم و اصلاح بینایی."),
            ("متخصص جراحی مغز و اعصاب", "Neurosurgeon",
             "Performs surgeries for brain tumors, spinal injuries, and nerve compression.",
             "انجام جراحی برای تومورهای مغزی، آسیب‌های نخاعی و فشردگی عصب."),
        ]),
        ("woman", "chest", vec![
            ("متخصص قلب و عروق", "Cardiologist",
             "Diagnoses and treats heart-related conditions such as coronary artery disease and arrhythmias.",
             "تشخیص و درمان بیماری‌های قلبی مانند بیماری عروق کرونری و آریتمی."),
            ("متخصص ریه", "Pulmonologist",
             "Focuses on respiratory issues including asthma, COPD, and lung infections.",
             "درمان مشکلات تنفسی مانند آسم، COPD و عفونت‌های ریوی."),
            ("متخصص داخلی", "Internist",
             "Provides comprehensive care for chronic illnesses such as hypertension and diabetes.",
             "ارائه مراقبت‌های جامع برای بیماری‌های مزمن مانند فشارخون و دیابت."),
            ("متخصص جراحی قفسه سینه", "Thoracic Surgeon",
             "Performs surgeries for conditions like lung cancer and esophageal disorders.",
             "انجام جراحی برای سرطان ریه و اختلالات مری."),
            ("متخصص پستان", "Breast Specialist",
             "Treats breast-related issues such as lumps, cancer, and infections.",
             "درمان مشکلات مربوط به پستان مانند توده‌ها، سرطان و عفونت‌ها."),
        ]),
        ("woman", "stomach", vec![
            ("متخصص گوارش و کبد", "Gastroenterologist",
             "Treats digestive system issues including ulcers, IBS, and liver diseases.",
             "درمان مشکلات دستگاه گوارش مانند زخم معده، IBS و بیماری‌های کبدی."),
            ("متخصص تغذیه", "Nutritionist",
             "Advises on dietary plans to manage weight and nutritional deficiencies.",
             "مشاوره تغذیه‌ای برای مدیریت وزن و کمبودهای تغذیه‌ای."),
            ("متخصص جراحی عمومی", "General Surgeon",
             "Handles surgeries like appendectomies and hernia repairs.",
             "انجام جراحی‌هایی مانند آپاندکتومی و ترمیم فتق."),
        ]),

   ("woman", "below-abdomen", vec![
       ("متخصص کلیه و مجاری ادراری", "Urologist",
        "Diagnoses and treats urinary tract infections, kidney stones, and bladder issues.",
        "تشخیص و درمان عفونت‌های ادراری، سنگ کلیه و مشکلات مثانه."),
        ("متخصص زنان و زایمان", "Gynecologist",
        "Focuses on women's health, including pregnancy, menstrual disorders, and menopause.",
        "تمرکز بر سلامت زنان شامل بارداری، اختلالات قاعدگی و یائسگی."),
       ("متخصص غدد", "Endocrinologist",
        "Focuses on hormonal disorders such as diabetes and thyroid dysfunction.",
        "مدیریت اختلالات هورمونی مانند دیابت و مشکلات تیروئید."),
       ("متخصص جراحی کلیه و مجاری ادراری", "Urological Surgeon",
        "Performs surgeries for kidney and urinary tract disorders.",
        "انجام جراحی برای اختلالات کلیه و دستگاه ادراری."),
   ]),
   ("woman", "feet", vec![
       ("متخصص ارتوپدی", "Orthopedist",
        "Treats bone fractures, joint pain, and arthritis.",
        "درمان شکستگی‌های استخوان، درد مفاصل و آرتریت."),
       ("متخصص طب فیزیکی و توانبخشی", "Physical Medicine and Rehabilitation Specialist",
        "Focuses on recovery from injuries and improving mobility.",
        "تمرکز بر بهبود پس از آسیب‌ها و افزایش تحرک."),
       ("متخصص جراحی پا و مچ پا", "Foot and Ankle Surgeon",
        "Handles surgeries for fractures, sprains, and deformities.",
        "انجام جراحی برای شکستگی‌ها، پیچ‌خوردگی‌ها و ناهنجاری‌ها."),
   ]),
   ("woman", "hand", vec![
       ("متخصص ارتوپدی", "Orthopedist",
        "Deals with hand injuries, fractures, and arthritis.",
        "درمان آسیب‌های دست، شکستگی‌ها و آرتریت."),
       ("متخصص جراحی دست", "Hand Surgeon",
        "Specializes in surgeries for hand and wrist issues.",
        "تخصص در جراحی دست و مچ دست."),
       ("متخصص توانبخشی", "Rehabilitation Specialist",
        "Helps with functional recovery post-injury or surgery.",
        "کمک به بهبود عملکرد پس از آسیب یا جراحی."),
   ]),
   ("child", "head", vec![
    ("متخصص مغز و اعصاب کودکان", "Pediatric Neurologist",
     "Specializes in neurological disorders in children, including epilepsy and developmental delays.",
     "متخصص در اختلالات عصبی کودکان از جمله صرع و تأخیرات رشدی."),
    ("متخصص گوش و حلق و بینی کودکان", "Pediatric ENT Specialist",
     "Treats ear infections, tonsillitis, and hearing issues in children.",
     "درمان عفونت‌های گوش، التهاب لوزه و مشکلات شنوایی در کودکان."),
    ("متخصص روانپزشکی کودکان", "Pediatric Psychiatrist",
     "Focuses on mental health issues in children, including anxiety and ADHD.",
     "تمرکز بر مشکلات روانی کودکان از جمله اضطراب و ADHD."),
    ("متخصص چشم پزشکی کودکان", "Pediatric Ophthalmologist",
     "Handles vision problems, lazy eye, and congenital eye conditions in children.",
     "درمان مشکلات بینایی، تنبلی چشم و بیماری‌های مادرزادی چشمی در کودکان."),
]),
("child", "chest", vec![
    ("متخصص قلب و عروق کودکان", "Pediatric Cardiologist",
     "Diagnoses and treats heart conditions in children, such as congenital heart defects.",
     "تشخیص و درمان بیماری‌های قلبی کودکان مانند نقایص مادرزادی قلب."),
    ("متخصص ریه کودکان", "Pediatric Pulmonologist",
     "Focuses on respiratory issues like asthma, bronchitis, and pneumonia in children.",
     "درمان مشکلات تنفسی کودکان مانند آسم، برونشیت و ذات‌الریه."),
    ("متخصص داخلی کودکان", "Pediatric Internist",
     "Provides care for chronic conditions such as diabetes and autoimmune diseases in children.",
     "ارائه مراقبت برای بیماری‌های مزمن مانند دیابت و بیماری‌های خودایمنی در کودکان."),
]),
("child", "stomach", vec![
    ("متخصص گوارش و کبد کودکان", "Pediatric Gastroenterologist",
     "Treats digestive and liver disorders in children, including reflux and hepatitis.",
     "درمان اختلالات گوارشی و کبدی در کودکان مانند رفلاکس و هپاتیت."),
    ("متخصص تغذیه کودکان", "Pediatric Nutritionist",
     "Advises on proper nutrition and managing dietary deficiencies in children.",
     "مشاوره در زمینه تغذیه مناسب و مدیریت کمبودهای تغذیه‌ای در کودکان."),
    ("متخصص جراحی کودکان", "Pediatric Surgeon",
     "Performs surgeries for appendicitis, hernias, and congenital abnormalities in children.",
     "انجام جراحی‌هایی مانند آپاندیسیت، فتق و ناهنجاری‌های مادرزادی در کودکان."),
]),
("child", "below-abdomen", vec![
    ("متخصص کلیه و مجاری ادراری کودکان", "Pediatric Urologist",
     "Diagnoses and treats urinary and kidney issues in children, such as UTIs and bedwetting.",
     "تشخیص و درمان مشکلات ادراری و کلیوی کودکان مانند عفونت‌های ادراری و شب‌ادراری."),
    ("متخصص غدد کودکان", "Pediatric Endocrinologist",
     "Focuses on hormonal disorders in children, including growth problems and diabetes.",
     "مدیریت اختلالات هورمونی کودکان مانند مشکلات رشد و دیابت."),
]),
("child", "feet", vec![
    ("متخصص ارتوپدی کودکان", "Pediatric Orthopedist",
     "Treats bone and joint problems in children, including fractures and scoliosis.",
     "درمان مشکلات استخوان و مفاصل کودکان مانند شکستگی‌ها و اسکولیوز."),
    ("متخصص طب فیزیکی و توانبخشی کودکان", "Pediatric Physical Medicine and Rehabilitation Specialist",
     "Focuses on improving mobility and recovery after injuries in children.",
     "تمرکز بر بهبود تحرک و بازیابی پس از آسیب‌ها در کودکان."),
]),
("child", "hand", vec![
    ("متخصص ارتوپدی کودکان", "Pediatric Orthopedist",
     "Handles hand and arm fractures, deformities, and joint problems in children.",
     "درمان شکستگی‌ها، ناهنجاری‌ها و مشکلات مفاصل دست و بازوی کودکان."),
    ("متخصص جراحی دست کودکان", "Pediatric Hand Surgeon",
     "Performs surgeries for congenital and acquired hand conditions in children.",
     "انجام جراحی برای مشکلات مادرزادی و اکتسابی دست در کودکان."),
    ("متخصص طب فیزیکی و توانبخشی کودکان", "Pediatric Physical Medicine and Rehabilitation Specialist",
     "Helps children recover functional abilities after injuries or surgeries.",
     "کمک به بازیابی توانایی‌های عملکردی کودکان پس از آسیب‌ها یا جراحی‌ها."),
]),
];
    let mut i = 0usize;
    for (gender, body_part, categories) in doctor_categories.into_iter() {
        for (name, title, en_description, fa_description) in categories.into_iter() {
            let _result = DB
                .query("CREATE categories SET id = $id ,gender = $gender, body_part = $body_part, name = $name, title = $title, en_description = $en_description, fa_description = $fa_description")
                .bind(("gender", gender))
                .bind(("body_part", vec![body_part]))
                .bind(("name", name))
                .bind(("title", title))
                .bind(("en_description", en_description))
                .bind(("fa_description", fa_description))
                .bind(("id", i))
                .await
                .unwrap();
            i += 1;
        }
    }
}

async fn generate_sessions() {
    for i in 0..10 {
        let doctor = RecordId::from_table_key("doctors", thread_rng().gen_range(0..10));
        let patient = RecordId::from_table_key("users", thread_rng().gen_range(0..10));
        let status = "new";
        let fee_paid = thread_rng().gen_range(10000..250000);
        let admin_share = thread_rng().gen_range(0..50);

        let mut result = DB
            .query("CREATE sessions SET id = $id, doctor = $doctor, patient = $patient, status = $status, fee_paid = $fee_paid, admin_share = $admin_share")
            .bind(("doctor", doctor))
            .bind(("patient", patient))
            .bind(("status", status))
            .bind(("fee_paid", fee_paid))
            .bind(("admin_share", admin_share))
            .bind(("id", i))
            .await
            .unwrap();
    }
}

async fn generate_payments() {
    for i in 0..10 {
        let user = RecordId::from_table_key("users", 1);
        let doctor = RecordId::from_table_key("doctors", 1);
        let amount = thread_rng().gen_range(10000..250000);
        let payment_method = "wallet";
        let status = "completed";

        let mut result = DB
            .query("CREATE payments SET id = $id, user = $user, doctor = $doctor, amount = $amount, payment_method = $payment_method, status = $status")
            .bind(("user", user))
            .bind(("doctor", doctor))
            .bind(("amount", amount))
            .bind(("payment_method", payment_method))
            .bind(("status", status))
            .bind(("id", i))
            .await
            .unwrap();
    }
}

async fn generate_withdrawals() {
    for i in 0..5 {
        let doctor = RecordId::from_table_key("doctors", 1);
        let amount = thread_rng().gen_range(50..500);
        let status = "approved";

        let mut result = DB
            .query("CREATE withdrawals SET id = $id, doctor = $doctor, amount = $amount, status = $status")
            .bind(("doctor", doctor))
            .bind(("amount", amount))
            .bind(("status", status))
            .bind(("id", i))
            .await
            .unwrap();
    }
}

async fn generate_notifications() {
    for i in 0..10 {
        let user = RecordId::from_table_key("users", 1);
        let message = "Your appointment has been confirmed.";
        let notification_type = "session";
        let status = "new";

        let mut result = DB
            .query("CREATE notifications SET id = $id, user = $user, message = $message, type = $type, status = $status")
            .bind(("user", user))
            .bind(("message", message))
            .bind(("type", notification_type))
            .bind(("status", status))
            .bind(("id", i))
            .await
            .unwrap();
    }
}

async fn generate_logs() {
    for i in 0..5 {
        let admin = RecordId::from_table_key("admins", 1);
        let action = "Login";
        let details = "Admin logged in";

        let mut result = DB
            .query("CREATE logs SET id = $id, admin = $admin, action = $action, details = $details")
            .bind(("admin", admin))
            .bind(("action", action))
            .bind(("details", details))
            .bind(("id", i))
            .await
            .unwrap();
    }
}

#[tokio::main]
async fn main() {
    create_fake_data().await;
}

const db_init: &str = r#"
use ns test;
use db test;
DEFINE TABLE users SCHEMAFULL;
DEFINE FIELD full_name ON users TYPE string;
DEFINE FIELD national_code ON users TYPE string;
DEFINE FIELD phone_number ON users TYPE string;
DEFINE FIELD birth_date ON users TYPE datetime;
DEFINE FIELD gender ON users TYPE string ASSERT $value IN ['man','woman'];
DEFINE FIELD email ON users TYPE string;
DEFINE FIELD password_hash ON users TYPE string;
DEFINE FIELD wallet_balance ON users TYPE number DEFAULT 0;
DEFINE FIELD created_at ON users TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON users TYPE datetime VALUE time::now() DEFAULT time::now();

DEFINE TABLE doctors SCHEMAFULL;
DEFINE FIELD full_name ON doctors TYPE string;
DEFINE FIELD medical_code ON doctors TYPE string;
DEFINE FIELD national_code ON doctors TYPE string;
DEFINE FIELD phone_number ON doctors TYPE string;
DEFINE FIELD email ON doctors TYPE string;
DEFINE FIELD password_hash ON doctors TYPE string;
DEFINE FIELD birth_date ON doctors TYPE datetime;
DEFINE ANALYZER name_analyzer TOKENIZERS blank FILTERS lowercase;
DEFINE INDEX full_name_index ON TABLE doctors FIELDS full_name SEARCH ANALYZER name_analyzer BM25;
DEFINE FIELD gender ON doctors TYPE string ASSERT $value IN ['man','woman'];
DEFINE FIELD specialization ON doctors TYPE string;
DEFINE FIELD category ON doctors TYPE record<categories>;
DEFINE FIELD profile_image ON doctors TYPE string;
DEFINE FIELD consultation_fee ON doctors TYPE number;
DEFINE FIELD admin_commission_percentage ON doctors TYPE number;
DEFINE FIELD wallet_balance ON doctors TYPE number DEFAULT 0;
DEFINE FIELD status ON doctors TYPE string ASSERT $value IN ['active', 'disabled'];
DEFINE FIELD availability ON doctors TYPE number DEFAULT 10;
DEFINE FIELD card_number ON doctors TYPE array<string>;
DEFINE FIELD created_at ON doctors TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON doctors TYPE datetime VALUE time::now() DEFAULT time::now();

DEFINE TABLE admins SCHEMAFULL;
DEFINE FIELD full_name ON admins TYPE string;
DEFINE FIELD email ON admins TYPE string;
DEFINE FIELD birth_date ON admins TYPE datetime;
DEFINE FIELD national_code ON admins TYPE string;
DEFINE FIELD gender ON admins TYPE string ASSERT $value IN ['man','woman'];
DEFINE FIELD password_hash ON admins TYPE string;
DEFINE FIELD created_at ON admins TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON admins TYPE datetime VALUE time::now() DEFAULT time::now();

DEFINE TABLE sessions SCHEMAFULL;
DEFINE FIELD doctor ON sessions TYPE record<doctors>;
DEFINE FIELD patient ON sessions TYPE record<users>;
DEFINE FIELD target_full_name ON sessions TYPE option<string>;
DEFINE FIELD target_national_code ON sessions TYPE option<string>;
DEFINE FIELD target_birth_date ON sessions TYPE option<datetime>;
DEFINE FIELD target_gender ON sessions TYPE option<string> ASSERT $value IN ['man','woman'];
DEFINE FIELD target_phone_number ON sessions TYPE option<string>;
DEFINE FIELD messages ON sessions TYPE array<record<messages>> DEFAULT [];
DEFINE FIELD status ON sessions TYPE string DEFAULT 'new' ASSERT $value IN ['new', 'waiting' ,'answered', 'ended'];
DEFINE FIELD end_time ON sessions TYPE option<datetime>;
DEFINE FIELD rating ON sessions TYPE option<number>;
DEFINE FIELD feedback ON sessions TYPE option<string>;
DEFINE FIELD fee_paid ON sessions TYPE number DEFAULT 0;
DEFINE FIELD admin_share ON sessions TYPE number DEFAULT 0;
DEFINE FIELD created_at ON sessions TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON sessions TYPE datetime VALUE time::now() DEFAULT time::now();

-- Create Messages Table
DEFINE TABLE messages SCHEMAFULL;
DEFINE FIELD sender ON messages TYPE record<users|doctors|admins>;
DEFINE FIELD receiver ON messages TYPE record<doctors|users>;
DEFINE FIELD content ON messages TYPE string;
DEFINE FIELD created_at ON messages TYPE datetime DEFAULT time::now() READONLY;


-- Create Categories Table
DEFINE TABLE categories SCHEMAFULL;
DEFINE FIELD name ON categories TYPE string;
DEFINE FIELD title ON categories TYPE string;
DEFINE FIELD gender ON categories TYPE string ASSERT $value IN ['man', 'woman', 'child'];
DEFINE FIELD body_part ON categories TYPE array<string> ASSERT $value ALLINSIDE ['head', 'hand', 'chest', 'stomach', 'below-abdomen', 'feet'];
DEFINE FIELD en_description ON categories TYPE string;
DEFINE FIELD fa_description ON categories TYPE string;
DEFINE FIELD created_at ON categories TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON categories TYPE datetime VALUE time::now() DEFAULT time::now();

-- Create Payments Table
DEFINE TABLE payments SCHEMAFULL;
DEFINE FIELD user ON payments TYPE record<users>;
DEFINE FIELD doctor ON payments TYPE record<doctors>;
DEFINE FIELD amount ON payments TYPE number;
DEFINE FIELD payment_method ON payments TYPE string ASSERT $value IN ['wallet', 'direct'];
DEFINE FIELD status ON payments TYPE string ASSERT $value IN ['pending', 'completed', 'failed'];
DEFINE FIELD created_at ON payments TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON payments TYPE datetime VALUE time::now() DEFAULT time::now();

-- Create Withdrawals Table
DEFINE TABLE withdrawals SCHEMAFULL;
DEFINE FIELD doctor ON withdrawals TYPE option<record<doctors>>;
DEFINE FIELD user ON withdrawals TYPE option<record<users>>;
DEFINE FIELD amount ON withdrawals TYPE number;
DEFINE FIELD status ON withdrawals TYPE string ASSERT $value IN ['pending', 'approved', 'denied'];
DEFINE FIELD created_at ON withdrawals TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON withdrawals TYPE datetime VALUE time::now() DEFAULT time::now();

-- Create Notifications Table
DEFINE TABLE notifications SCHEMAFULL;
DEFINE FIELD doctor ON notifications TYPE option<record<doctors>>;
DEFINE FIELD admin ON notifications TYPE option<record<admins>>;
DEFINE FIELD user ON notifications TYPE option<record<users>>;
DEFINE FIELD message ON notifications TYPE string;
DEFINE FIELD type_ ON notifications TYPE string ASSERT $value IN ['performance', 'session', 'general','new_doctor'];
DEFINE FIELD status ON notifications TYPE string ASSERT $value IN ['new', 'read'];
DEFINE FIELD created_at ON notifications TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON notifications TYPE datetime VALUE time::now() DEFAULT time::now();

-- Create Logs Table
DEFINE TABLE logs SCHEMAFULL;
DEFINE FIELD action ON logs TYPE string;
DEFINE FIELD details ON logs TYPE string;
DEFINE FIELD created_at ON logs TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON logs TYPE datetime VALUE time::now() DEFAULT time::now();
"#;
