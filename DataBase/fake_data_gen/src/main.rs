use std::sync::LazyLock;

use chrono::Utc;
use model::{Admin, Category, Doctor, Log, Notification, Payment, Session, Withdrawal};
use rand::{thread_rng, Rng};
use serde_json::json;
use surrealdb::engine::remote::ws::Client;
use surrealdb::opt::auth::Root;
use surrealdb::{sql, RecordId, Surreal};
static DB: LazyLock<Surreal<Client>> = LazyLock::new(Surreal::init);
mod model;
use crate::model::User;
async fn create_fake_data() {
    // let server = std::process::Command::new("../SurrealDb.exe")
    //     .args(["start", "memory", "-A", "--user", "root", "--pass", "root"])
    //     .spawn()
    //     .expect("Failed to start SurrealDB server");

    // // Give the server a moment to start up
    // tokio::time::sleep(tokio::time::Duration::from_secs(3)).await;
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

    // Generate fake data for each table
    generate_users().await;
    generate_doctors().await;
    generate_admins().await;
    generate_categories().await;
    generate_sessions().await;
    generate_payments().await;
    generate_withdrawals().await;
    generate_notifications().await;
    generate_logs().await;
}

async fn generate_users() {
    for i in 0..10 {
        let user = json!({
            "full_name": format!("User {}", rand::thread_rng().gen_range(1..=100)),
            "national_code": format!("{:10}", rand::thread_rng().gen_range(1_000_000_000_i64..9_999_999_999_i64)),
            "phone_number": format!("09{}", rand::thread_rng().gen_range(100_000_000..999_999_999)),
            "email": format!("user{}@example.com", rand::thread_rng().gen_range(1..=100)),
            "password_hash": "hashed_password",
            "wallet_balance": rand::thread_rng().gen_range(40000..1000000),
        });

        let user: Option<User> = DB.create(("users", i)).content(user).await.unwrap();
    }
}

async fn generate_doctors() {
    for i in 0..10 {
        let doctor = json!({
            "full_name": format!("Doctor {}", rand::thread_rng().gen_range(1..=100)),
            "medical_code": format!("MC{:06}", rand::thread_rng().gen_range(1_000_000..9_999_999)),
            "national_code": format!("{:10}", rand::thread_rng().gen_range(1_000_000_000i64..9_999_999_999)),
            "phone_number": format!("09{}", rand::thread_rng().gen_range(100_000_000..999_999_999)),
            "email": format!("doctor{}@example.com", rand::thread_rng().gen_range(1..=100)),
            "password_hash": "hashed_password",
            "specialization": "General",
            "category": RecordId::from_table_key("categories",1),
            "profile_image": "https://picsum.photos/300/400",
            "consultation_fee": rand::thread_rng().gen_range(20000..250000),
            "admin_commission_percentage": 15,
            "wallet_balance": rand::thread_rng().gen_range(40000..1000000),
            "status": "active",
            "availability": 10,
            "card_number": vec!["1234 5678 9101 1121".to_string(),"2445 5635 9251 1621".to_string()],
        });

        let log: Option<Doctor> = DB.create(("doctors", i)).content(doctor).await.unwrap();
    }
}

async fn generate_admins() {
    for i in 0..3 {
        let admin = json!({
            "full_name": format!("Admin {}", rand::thread_rng().gen_range(1..=3)),
            "email": format!("admin{}@example.com", rand::thread_rng().gen_range(1..=3)),
            "password_hash": "hashed_password",
        });

        let admin: Option<Admin> = DB.create(("admins", i)).content(admin).await.unwrap();
    }
}

async fn generate_categories() {
    let categories = vec!["Cardiology", "Neurology", "Pediatrics"];
    for (i, category) in categories.iter().enumerate() {
        let category_data = json!({
            "name": category,
        });

        let categories: Option<Category> = DB
            .create(("categories", i as i64))
            .content(category_data)
            .await
            .unwrap();
    }
}

async fn generate_sessions() {
    for i in 0..10 {
        let session = json!({
            "doctor": RecordId::from_table_key("doctors",thread_rng().gen_range(0..10)),
            "patiant": RecordId::from_table_key("users",thread_rng().gen_range(0..10)),
            "status": "new",
            "fee_paid": rand::thread_rng().gen_range(10000..250000),
            "admin_share": rand::thread_rng().gen_range(0..50),
        });

        let session: Option<Session> = DB.create(("sessions", i)).content(session).await.unwrap();
    }
}

async fn generate_payments() {
    for i in 0..10 {
        let payment = json!({
            "user": RecordId::from_table_key("users",1),
            "doctor": RecordId::from_table_key("doctors",1),
            "amount": rand::thread_rng().gen_range(10000..250000),
            "payment_method": "wallet",
            "status": "completed",
        });

        let payment: Option<Payment> = DB.create(("payments", i)).content(payment).await.unwrap();
    }
}

async fn generate_withdrawals() {
    for i in 0..5 {
        let withdrawal = json!({
            "doctor": RecordId::from_table_key("doctors",1),
            "amount": rand::thread_rng().gen_range(50..500),
            "status": "approved",
        });

        let withdrawal: Option<Withdrawal> = DB
            .create(("withdrawals", i))
            .content(withdrawal)
            .await
            .unwrap();
    }
}

async fn generate_notifications() {
    for i in 0..10 {
        let notification = json!({
            "user": RecordId::from_table_key("users",1),
            "message": "Your appointment has been confirmed.",
            "type": "session",
            "status": "new",
        });

        let notification: Option<Notification> = DB
            .create(("notifications", i))
            .content(notification)
            .await
            .unwrap();
    }
}

async fn generate_logs() {
    for i in 0..5 {
        let log = json!({
            "admin": RecordId::from_table_key("admins",1),
            "action": "Login",
            "details": "Admin logged in",
        });

        let log: Option<Log> = DB.create(("logs", i)).content(log).await.unwrap();
    }
}

#[tokio::main]
async fn main() {
    create_fake_data().await;
}
