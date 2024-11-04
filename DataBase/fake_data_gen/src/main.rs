use std::sync::LazyLock;

use chrono::Utc;
use model::{Admin, Category, Doctor, Log, Notification, Payment, Session, Withdrawal};
use rand::{thread_rng, Rng};
use serde_json::json;
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
    for i in 0..10 {
        let name = format!("User {}", rand::thread_rng().gen_range(1..=100));
        let national_code = format!(
            "{:10}",
            rand::thread_rng().gen_range(1_000_000_000_i64..9_999_999_999_i64)
        );
        let phone_number = format!(
            "09{}",
            rand::thread_rng().gen_range(100_000_000..999_999_999)
        );
        let email = format!("user{}@example.com", rand::thread_rng().gen_range(1..=100));
        let password_hash = "hashed_password";
        let wallet_balance = rand::thread_rng().gen_range(40000..1000000);

        let mut result = DB
            .query("CREATE users SET id = $id, full_name = $full_name, national_code = $national_code, phone_number = $phone_number, email = $email, password_hash = $password_hash, wallet_balance = $wallet_balance")
            .bind(("full_name", name))
            .bind(("national_code", national_code))
            .bind(("phone_number", phone_number))
            .bind(("email", email))
            .bind(("password_hash", password_hash))
            .bind(("wallet_balance", wallet_balance))
            .bind(("id", i))
            .await
            .unwrap();
    }
}

async fn generate_doctors() {
    for i in 0..10 {
        let category_id = thread_rng().gen_range(0..3);
        let full_name = format!("Doctor {}", rand::thread_rng().gen_range(1..=100));
        let medical_code = format!(
            "MC{:06}",
            rand::thread_rng().gen_range(1_000_000..9_999_999)
        );
        let national_code = format!(
            "{:10}",
            rand::thread_rng().gen_range(1_000_000_000i64..9_999_999_999)
        );
        let phone_number = format!(
            "09{}",
            rand::thread_rng().gen_range(100_000_000..999_999_999)
        );
        let email = format!(
            "doctor{}@example.com",
            rand::thread_rng().gen_range(1..=100)
        );
        let password_hash = "hashed_password";
        let specialization = "General";
        let category = RecordId::from_table_key("categories", thread_rng().gen_range(0..3));
        let profile_image = "https://picsum.photos/300/400";
        let consultation_fee = rand::thread_rng().gen_range(20000..250000);
        let admin_commission_percentage = 15;
        let wallet_balance = rand::thread_rng().gen_range(40000..1000000);
        let status = "active";
        let availability = 10;
        let card_number = vec![
            "1234 5678 9101 1121".to_string(),
            "2445 5635 9251 1621".to_string(),
        ];

        let mut result = DB
            .query("CREATE doctors SET id = $id, full_name = $full_name, medical_code = $medical_code, national_code = $national_code, phone_number = $phone_number, email = $email, password_hash = $password_hash, specialization = $specialization, category = $category, profile_image = $profile_image, consultation_fee = $consultation_fee, admin_commission_percentage = $admin_commission_percentage, wallet_balance = $wallet_balance, status = $status, availability = $availability, card_number = $card_number")
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
            .bind(("id", i))
            .await
            .unwrap();
    }
}

async fn generate_admins() {
    for i in 0..3 {
        let full_name = format!("Admin {}", rand::thread_rng().gen_range(1..=3));
        let email = format!("admin{}@example.com", rand::thread_rng().gen_range(1..=3));
        let password_hash = "hashed_password";

        let mut result = DB
            .query("CREATE admins SET id = $id, full_name = $full_name, email = $email, password_hash = $password_hash")
            .bind(("full_name", full_name))
            .bind(("email", email))
            .bind(("password_hash", password_hash))
            .bind(("id", i))
            .await
            .unwrap();
    }
}

async fn generate_categories() {
    let categories = vec!["Cardiology", "Neurology", "Pediatrics"];
    for (i, category) in categories.into_iter().enumerate() {
        let mut result = DB
            .query("CREATE categories SET id = $id, name = $name")
            .bind(("name", category))
            .bind(("id", i))
            .await
            .unwrap();
    }
}

async fn generate_sessions() {
    for i in 0..10 {
        let doctor = RecordId::from_table_key("doctors", thread_rng().gen_range(0..10));
        let patient = RecordId::from_table_key("users", thread_rng().gen_range(0..10));
        let status = "new";
        let fee_paid = rand::thread_rng().gen_range(10000..250000);
        let admin_share = rand::thread_rng().gen_range(0..50);

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
        let amount = rand::thread_rng().gen_range(10000..250000);
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
        let amount = rand::thread_rng().gen_range(50..500);
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
DEFINE TABLE users SCHEMAFULL;
DEFINE FIELD full_name ON users TYPE string;
DEFINE FIELD national_code ON users TYPE string;
DEFINE FIELD phone_number ON users TYPE string;
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
DEFINE FIELD password_hash ON admins TYPE string;
DEFINE FIELD created_at ON admins TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON admins TYPE datetime VALUE time::now() DEFAULT time::now();

DEFINE TABLE sessions SCHEMAFULL;
DEFINE FIELD doctor ON sessions TYPE record<doctors>;
DEFINE FIELD patient ON sessions TYPE record<users>;
DEFINE FIELD status ON sessions TYPE string DEFAULT 'new' ASSERT $value IN ['new', 'waiting' ,'answered', 'ended'];
DEFINE FIELD end_time ON sessions TYPE option<datetime>;
DEFINE FIELD rating ON sessions TYPE option<number>;
DEFINE FIELD feedback ON sessions TYPE option<string>;
DEFINE FIELD fee_paid ON sessions TYPE number DEFAULT 0;
DEFINE FIELD admin_share ON sessions TYPE number DEFAULT 0;
DEFINE FIELD created_at ON sessions TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON sessions TYPE datetime VALUE time::now() DEFAULT time::now();

-- Create Categories Table
DEFINE TABLE categories SCHEMAFULL;
DEFINE FIELD name ON categories TYPE string;
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
DEFINE FIELD admin ON notifications TYPE option<record<doctors>>;
DEFINE FIELD user ON notifications TYPE option<record<users>>;
DEFINE FIELD message ON notifications TYPE string;
DEFINE FIELD type ON notifications TYPE string ASSERT $value IN ['performance', 'session', 'general'];
DEFINE FIELD status ON notifications TYPE string ASSERT $value IN ['new', 'read'];
DEFINE FIELD created_at ON notifications TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON notifications TYPE datetime VALUE time::now() DEFAULT time::now();

-- Create Logs Table
DEFINE TABLE logs SCHEMAFULL;
DEFINE FIELD admin ON logs TYPE record<admins>;
DEFINE FIELD action ON logs TYPE string;
DEFINE FIELD details ON logs TYPE string;
DEFINE FIELD created_at ON logs TYPE datetime DEFAULT time::now() READONLY;
DEFINE FIELD updated_at ON logs TYPE datetime VALUE time::now() DEFAULT time::now();
"#;
