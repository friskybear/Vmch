use chrono::Utc;
use serde::{Deserialize, Serialize};
use surrealdb::RecordId;

#[derive(Serialize, Deserialize)]
pub struct User {
    full_name: String,
    national_code: String,
    phone_number: String,
    email: String,
    password_hash: String,
    wallet_balance: f64,
    created_at: chrono::DateTime<Utc>,
    updated_at: chrono::DateTime<Utc>,
}

#[derive(Serialize, Deserialize)]
pub struct Doctor {
    full_name: String,
    medical_code: String,
    national_code: String,
    phone_number: String,
    email: String,
    password_hash: String,
    specialization: String,
    category: RecordId,
    profile_image: String,
    consultation_fee: f64,
    admin_commission_percentage: f64,
    wallet_balance: f64,
    status: String,
    availability: i32,
    card_number: Vec<String>,
    created_at: chrono::DateTime<Utc>,
    updated_at: chrono::DateTime<Utc>,
}

#[derive(Serialize, Deserialize)]
pub struct Admin {
    full_name: String,
    email: String,
    password_hash: String,
    created_at: chrono::DateTime<Utc>,
    updated_at: chrono::DateTime<Utc>,
}

#[derive(Serialize, Deserialize)]
pub struct Session {
    doctor: RecordId,
    patiant: RecordId,
    status: String,
    end_time: Option<String>,
    rating: Option<f64>,
    feedback: Option<String>,
    fee_paid: f64,
    admin_share: f64,
    created_at: chrono::DateTime<Utc>,
    updated_at: chrono::DateTime<Utc>,
}

#[derive(Serialize, Deserialize)]
pub struct Category {
    name: String,
    created_at: chrono::DateTime<Utc>,
    updated_at: chrono::DateTime<Utc>,
}

#[derive(Serialize, Deserialize)]
pub struct Payment {
    user: RecordId,
    doctor: RecordId,
    amount: f64,
    payment_method: String,
    status: String,
    created_at: chrono::DateTime<Utc>,
    updated_at: chrono::DateTime<Utc>,
}

#[derive(Serialize, Deserialize)]
pub struct Withdrawal {
    doctor: Option<RecordId>,
    user: Option<RecordId>,
    amount: f64,
    status: String,
    created_at: chrono::DateTime<Utc>,
    updated_at: chrono::DateTime<Utc>,
}

#[derive(Serialize, Deserialize)]
pub struct Notification {
    doctor: Option<RecordId>,
    admin: Option<RecordId>,
    user: Option<RecordId>,
    message: String,
    type_: String,
    status: String,
    created_at: chrono::DateTime<Utc>,
    updated_at: chrono::DateTime<Utc>,
}

#[derive(Serialize, Deserialize)]
pub struct Log {
    admin: RecordId,
    action: String,
    details: String,
    created_at: chrono::DateTime<Utc>,
    updated_at: chrono::DateTime<Utc>,
}
