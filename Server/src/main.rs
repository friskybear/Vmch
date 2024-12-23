mod api;
mod error;
mod ws;
type Sessions = Mutex<(HashMap<SocketAddr, Uuid>, HashMap<Uuid, Session>)>;
use actix_files::Files;
use actix_web::{
    get, middleware,
    web::{self, Data, Path},
    App, HttpRequest, HttpResponse, HttpServer, Responder,
};
use actix_ws::{Message, Session};
use api::{get_doctors_by_category, get_doctors_by_medical_code, get_doctors_by_name, test};
use hashbrown::HashMap;
use parking_lot::Mutex;
use rand::seq::SliceRandom;
use serde_json::Value;
use std::{net::SocketAddr, sync::Arc};
use surrealdb::{
    engine::remote::ws::{Client, Ws},
    Surreal,
};
use uuid::Uuid;
use ws::ws;

#[actix_web::main]
async fn main() {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

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
    HttpServer::new(move || {
        App::new()
            .wrap(middleware::NormalizePath::trim())
            .wrap(middleware::Logger::default())
            .service(Files::new("/static", "./Images").prefer_utf8(true))
            .route("/ws", web::get().to(ws))
            .route(
                "/Health",
                actix_web::web::get().to(|| async { HttpResponse::Ok().body("ok") }),
            )
            .app_data(web::Data::new(Mutex::new((
                HashMap::<SocketAddr, Uuid>::new(),
                HashMap::<Uuid, Session>::new(),
            ))))
            .service(get_doctors_by_category)
            .service(get_doctors_by_name)
            .service(get_doctors_by_medical_code)
            .service(test)
            .app_data(web::Data::new(db.clone()))
    })
    .bind(("127.0.0.1", 8080))
    .unwrap()
    .run()
    .await
    .unwrap();
}
