mod api;
mod error;
mod model;
mod ws;
type Sessions = Mutex<HashMap<String, String>>;
use actix_files::Files;
use actix_web::{
    get, middleware,
    web::{self, Data, Path},
    App, HttpRequest, HttpResponse, HttpServer, Responder,
};
use actix_ws::{Message, Session};
use api::{
    add_session, delete_entity, deposit, end_session, get_admins, get_categories,
    get_categories_structured, get_doctors, get_doctors_by_category, get_doctors_by_medical_code,
    get_doctors_by_name, get_messages, get_notifications, get_session_with_id, get_sessions,
    get_users, new_doctor, new_notification, rate_session, send_message, sign_in, sign_up, test,
    upsert_admin, upsert_doctor, upsert_user, withdraw,
};
use hashbrown::HashMap;
use parking_lot::Mutex;
use rand::seq::SliceRandom;
use serde_json::Value;
use std::{net::SocketAddr, sync::Arc, time::Duration};
use surrealdb::{
    engine::remote::ws::{Client, Ws},
    RecordId, Surreal,
};
use uuid::Uuid;
use ws::ws;

use actix_jobs::{run_forever, Job, Scheduler};

struct MyJob {
    db: Surreal<Client>,
}

impl Job for MyJob {
    fn cron(&self) -> &str {
        "* */1 * * * * *" // every hour
    }

    fn run(&mut self) {
        let db = self.db.clone();
        actix_rt::spawn(async move {
            let mut res = db
                .query(
                    "UPDATE sessions
                    SET status = 'ended', end_time = time::now()
                    WHERE status = 'waiting' AND updated_at < time::now() - 72h;",
                )
                .await
                .unwrap();
            let res: Vec<model::Session> = res.take(0).unwrap();
            for session in res.iter() {
                let mut res = db
                    .query(
                        "UPDATE doctors
                        SET availability = availability + 1 where id = $id;",
                    )
                    .bind(("id", session.id.clone()))
                    .await
                    .unwrap();
                new_notification(
                    db.clone(),
                    RecordId::from_table_key("admins", 0),
                    "session".to_string(),
                    format!("session with id {} ended due to inactivity", session.id),
                    "new".to_string(),
                )
                .await;
                new_notification(
                    db.clone(),
                    session
                        .doctor
                        .clone()
                        .unwrap_or(RecordId::from_table_key("doctor", "unknown")),
                    "session".to_string(),
                    format!("session with id {} ended due to inactivity", session.id),
                    "new".to_string(),
                )
                .await;
                new_notification(
                    db.clone(),
                    session
                        .patient
                        .clone()
                        .unwrap_or(RecordId::from_table_key("patients", "unknown")),
                    "session".to_string(),
                    format!("session with id {} ended due to inactivity", session.id),
                    "new".to_string(),
                )
                .await;
            }
        });
    }
}

#[actix_web::main]
async fn main() {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
    let mut scheduler = Scheduler::new();

    let db: Surreal<Client> = Surreal::init();
    db.connect::<Ws>("localhost:8000").await.unwrap();
    db.use_db("test").await.unwrap();
    db.use_ns("test").await.unwrap();
    db.signin(surrealdb::opt::auth::Root {
        username: "root",
        password: "root",
    })
    .await
    .unwrap();
    scheduler.add(Box::new(MyJob { db: db.clone() }));

    run_forever(scheduler);
    HttpServer::new(move || {
        App::new()
            .wrap(middleware::NormalizePath::trim())
            .wrap(middleware::Logger::default())
            .service(Files::new("/static", "./static").prefer_utf8(true))
            .route("/ws", web::get().to(ws))
            .route(
                "/Health",
                actix_web::web::get().to(|| async { HttpResponse::Ok().body("ok") }),
            )
            .app_data(web::Data::new(Mutex::new(HashMap::<String, String>::new())))
            .service(get_doctors_by_category)
            .service(get_doctors_by_name)
            .service(get_doctors_by_medical_code)
            .service(test)
            .service(get_categories)
            .service(sign_in)
            .service(sign_up)
            .service(add_session)
            .service(get_admins)
            .service(get_doctors)
            .service(get_users)
            .service(upsert_admin)
            .service(upsert_user)
            .service(upsert_doctor)
            .service(delete_entity)
            .service(get_categories_structured)
            .service(withdraw)
            .service(deposit)
            .service(get_sessions)
            .service(get_notifications)
            .service(new_doctor)
            .service(get_session_with_id)
            .service(rate_session)
            .service(get_messages)
            .service(send_message)
            .service(end_session)
            .app_data(web::Data::new(db.clone()))
    })
    .bind(("127.0.0.1", 9000))
    .unwrap()
    .run()
    .await
    .unwrap();
}
