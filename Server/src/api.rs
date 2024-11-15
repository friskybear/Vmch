use actix_web::{
    get,
    web::{Data, Path, Query},
    HttpResponse, Responder,
};
use derive_more::derive::Display;
use serde::{Deserialize, Serialize};
use serde_json::Value;
use surrealdb::{engine::remote::ws::Client, Surreal};

use crate::error;

#[get("/search/category/{category}")]
async fn get_doctors_by_category(
    category: Path<String>,
    db: Data<Surreal<Client>>,
) -> Result<impl Responder, error::Error> {
    let mut result = db
        .query("select full_name, specialization, profile_image, consultation_fee, availability, status, (select math::mean(rating) as rate from sessions where doctor = $parent.id and rating != NONE)[0].rate as rate from doctors where category.name = $category and status = 'active' and availability > 0;")
        .bind(("category", category.into_inner()))
        .await?;
    let res: Vec<Value> = result.take(0).unwrap();
    Ok(HttpResponse::Ok().json(res))
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
