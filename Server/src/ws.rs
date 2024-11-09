use std::{net::SocketAddr, sync::Arc};

use actix_files::Files;
use actix_web::{middleware, web, App, HttpRequest, HttpResponse, HttpServer, Responder};
use actix_ws::{Message, Session};
use hashbrown::HashMap;
use parking_lot::Mutex;
use serde_json::Value;
use uuid::Uuid;

use crate::Sessions;

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
                        match json["reason"].as_str().unwrap() {
                            "ping" => {
                                let _ = session.text("pong").await;
                            }
                            "logged_in" => {
                                if let Some(uuid) = json["uuid"].as_str() {
                                    if let Ok(uuid) = Uuid::parse_str(uuid) {
                                        let _ = session.text("connected").await;
                                        let mut lock = connected_users.lock();

                                        lock.1.insert(uuid, session.clone());
                                        lock.0.insert(req.peer_addr().unwrap(), uuid);
                                    }
                                }
                            }
                            _ => {}
                        }
                    }
                }
                Message::Close(_) => {
                    let mut lock = connected_users.lock();
                    if let Some(uuid) = lock.0.get(&req.peer_addr().unwrap()).cloned() {
                        lock.1.remove(&uuid);
                        lock.0.remove(&req.peer_addr().unwrap());
                    }
                }
                _ => break,
            }
        }
    });

    Ok(response)
}
