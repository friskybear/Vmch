use std::sync::Arc;

use actix_files::Files;
use actix_web::{middleware, web, App, HttpRequest, HttpResponse, HttpServer, Responder};
use actix_ws::{Message, Session};
use hashbrown::HashMap;
use parking_lot::Mutex;
use uuid::Uuid;
type Sessions = Arc<Mutex<HashMap<Uuid, Session>>>;

async fn ws(
    req: HttpRequest,
    body: web::Payload,
    connected_users: web::Data<Sessions>,
) -> actix_web::Result<impl Responder> {
    let (response, session, mut msg_stream) = actix_ws::handle(&req, body)?;

    actix_web::rt::spawn(async move {
        // find user in data base and insert uuid,session into connected user
        while let Some(Ok(msg)) = msg_stream.recv().await {
            match msg {
                Message::Text(msg) => {
                    println!("Got text: {msg}");
                }
                //TODO! fix the match
                _ => break,
            }
        }
    });

    Ok(response)
}

#[actix_web::main]
async fn main() {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));
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
            .app_data(web::Data::new(Arc::new(Mutex::new(
                HashMap::<Uuid, Session>::new(),
            ))))
    })
    .bind(("127.0.0.1", 8080))
    .unwrap()
    .run()
    .await
    .unwrap();
}
