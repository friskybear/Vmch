use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: surrealdb::RecordId,
    pub full_name: String,
    pub national_code: String,
    pub phone_number: String,
    pub birth_date: surrealdb::Datetime,
    pub gender: String,
    pub email: String,
    pub password_hash: String,
    pub wallet_balance: i64,
    pub created_at: surrealdb::Datetime,
    pub updated_at: surrealdb::Datetime,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewUser {
    pub id: Option<String>,
    pub full_name: String,
    pub national_code: String,
    pub phone_number: String,
    pub birth_date: String,
    pub gender: String,
    pub email: String,
    pub password_hash: String,
    pub wallet_balance: i64,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Doctor {
    pub id: surrealdb::RecordId,
    pub full_name: String,
    pub medical_code: String,
    pub national_code: String,
    pub phone_number: String,
    pub email: String,
    pub password_hash: String,
    pub birth_date: surrealdb::Datetime,
    pub gender: String,
    pub specialization: String,
    pub category: Option<surrealdb::RecordId>,
    pub profile_image: String,
    pub consultation_fee: i32,
    pub admin_commission_percentage: i32,
    pub wallet_balance: i32,
    pub status: String,
    pub availability: i32,
    pub card_number: Vec<String>,
    pub created_at: surrealdb::Datetime,
    pub updated_at: surrealdb::Datetime,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewDoctor {
    pub id: Option<String>,
    pub full_name: String,
    pub medical_code: String,
    pub national_code: String,
    pub phone_number: String,
    pub email: String,
    pub password_hash: String,
    pub birth_date: String,
    pub gender: String,
    pub specialization: String,
    pub category: String,
    pub profile_image: String,
    pub consultation_fee: i32,
    pub admin_commission_percentage: i32,
    pub wallet_balance: i32,
    pub status: String,
    pub availability: i32,
    pub card_number: Vec<String>,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Admin {
    pub id: surrealdb::RecordId,
    pub full_name: String,
    pub email: String,
    pub birth_date: surrealdb::Datetime,
    pub national_code: String,
    pub gender: String,
    pub password_hash: String,
    pub created_at: surrealdb::Datetime,
    pub updated_at: surrealdb::Datetime,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct NewAdmin {
    pub id: Option<String>,
    pub full_name: String,
    pub email: String,
    pub birth_date: String,
    pub national_code: String,
    pub gender: String,
    pub password_hash: String,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Session {
    pub id: surrealdb::RecordId,
    pub doctor: Option<surrealdb::RecordId>,
    pub patient: Option<surrealdb::RecordId>,
    pub target_full_name: Option<String>,
    pub target_national_code: Option<String>,
    pub target_birth_date: Option<surrealdb::Datetime>,
    pub target_gender: Option<String>,
    pub target_phone_number: Option<String>,
    pub messages: Option<Vec<surrealdb::RecordId>>,
    pub status: String,
    pub end_time: Option<surrealdb::Datetime>,
    pub rating: Option<i32>,
    pub feedback: Option<String>,
    pub fee_paid: i32,
    pub admin_share: i32,
    pub created_at: surrealdb::Datetime,
    pub updated_at: surrealdb::Datetime,
}
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Message {
    pub id: surrealdb::RecordId,
    pub sender: Option<surrealdb::RecordId>,
    pub receiver: Option<surrealdb::RecordId>,
    pub content: String,
    pub created_at: surrealdb::Datetime,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Category {
    pub id: surrealdb::RecordId,
    pub name: String,
    pub title: String,
    pub gender: String,
    pub body_part: Vec<String>,
    pub en_description: String,
    pub fa_description: String,
    pub created_at: surrealdb::Datetime,
    pub updated_at: surrealdb::Datetime,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Payment {
    pub id: surrealdb::RecordId,
    pub user: Option<surrealdb::RecordId>,
    pub doctor: Option<surrealdb::RecordId>,
    pub amount: i32,
    pub payment_method: String,
    pub status: String,
    pub created_at: surrealdb::Datetime,
    pub updated_at: surrealdb::Datetime,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Withdrawal {
    pub id: surrealdb::RecordId,
    pub doctor: Option<surrealdb::RecordId>,
    pub user: Option<surrealdb::RecordId>,
    pub amount: i32,
    pub status: String,
    pub created_at: surrealdb::Datetime,
    pub updated_at: surrealdb::Datetime,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Notification {
    pub id: surrealdb::RecordId,
    pub doctor: Option<surrealdb::RecordId>,
    pub admin: Option<surrealdb::RecordId>,
    pub user: Option<surrealdb::RecordId>,
    pub message: String,
    pub type_: String,
    pub status: String,
    pub created_at: surrealdb::Datetime,
    pub updated_at: surrealdb::Datetime,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Log {
    pub id: surrealdb::RecordId,
    pub admin: surrealdb::RecordId,
    pub action: String,
    pub details: String,
    pub created_at: surrealdb::Datetime,
    pub updated_at: surrealdb::Datetime,
}
