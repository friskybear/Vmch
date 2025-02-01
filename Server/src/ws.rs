use std::{
    net::SocketAddr,
    sync::{Arc, LazyLock},
};

use actix_files::Files;
use actix_web::{middleware, web, App, HttpRequest, HttpResponse, HttpServer, Responder};
use actix_ws::{Message, Session};
use hashbrown::HashMap;
use itertools::Itertools;
use parking_lot::Mutex;
use serde_json::Value;
use uuid::Uuid;

use crate::Sessions;
pub static CONNECTED_USERS: LazyLock<tokio::sync::Mutex<HashMap<String, actix_ws::Session>>> =
    LazyLock::new(|| tokio::sync::Mutex::new(HashMap::new()));
pub async fn ws(
    req: HttpRequest,
    body: web::Payload,
    connected_users: web::Data<Sessions>,
) -> actix_web::Result<impl Responder> {
    let (response, mut session, mut msg_stream) = actix_ws::handle(&req, body)?;
    actix_web::rt::spawn(async move {
        // find user in data base and insert uuid,session into connected user
        while let Some(Ok(msg)) = msg_stream.recv().await {
            match msg {
                Message::Text(msg) => {
                    if let Ok(json) = serde_json::from_str(&msg) as Result<Value, _> {
                        println!("lo {msg:?}");
                        match json["reason"].as_str().unwrap() {
                            "ping" => {
                                let _ = session.text("pong").await;
                            }
                            "logged_in" => {
                                if let Some(uuid) = json["id"].as_str() {
                                    let _ = session.text("connected").await;
                                    let mut lock = CONNECTED_USERS.lock().await;
                                    println!("uu:{:?}", lock.keys().collect_vec());
                                    *lock.entry(uuid.to_string()).or_insert(session.clone()) =
                                        session.clone();
                                    println!("{:?}", lock.keys().collect_vec());
                                }
                            }
                            _ => {}
                        }
                    }
                }
                Message::Close(_) => {
                    let mut lock = CONNECTED_USERS.lock().await;
                    // println!("adisidasassadmsakldsandklsa");
                    // if let Some(uuid) = lock.get(se) {
                    //     lock.1.remove(&uuid);
                    //     lock.0.remove(&req.peer_addr().unwrap());
                    // }
                }
                _ => break,
            }
        }
    });

    Ok(response)
}
