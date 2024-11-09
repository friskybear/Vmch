use std::{net::SocketAddr, sync::Arc};

use actix_files::Files;
use actix_web::{
    get, middleware,
    web::{self, Data, Path},
    App, HttpRequest, HttpResponse, HttpServer, Responder,
};
use actix_ws::{Message, Session};
use hashbrown::HashMap;
use parking_lot::Mutex;
use rand::seq::SliceRandom;
use serde_json::Value;
use surrealdb::{
    engine::remote::ws::{Client, Ws},
    Surreal,
};
use uuid::Uuid;
mod ws;
use ws::ws;

type Sessions = Mutex<(HashMap<SocketAddr, Uuid>, HashMap<Uuid, Session>)>;

mod error {
    use actix_web::{HttpResponse, ResponseError};
    use thiserror::Error;

    #[derive(Error, Debug)]
    pub enum Error {
        #[error("database error")]
        Db(String),
    }

    impl ResponseError for Error {
        fn error_response(&self) -> HttpResponse {
            match self {
                Error::Db(e) => HttpResponse::InternalServerError().body(e.to_string()),
            }
        }
    }

    impl From<surrealdb::Error> for Error {
        fn from(error: surrealdb::Error) -> Self {
            eprintln!("{error}");
            Self::Db(error.to_string())
        }
    }
}

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
            .app_data(web::Data::new(db.clone()))
    })
    .bind(("127.0.0.1", 8080))
    .unwrap()
    .run()
    .await
    .unwrap();
}
