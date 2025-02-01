use std::{
    io::{Read, Write},
    time::Instant,
};

use base64::prelude::*;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use tauri::{Emitter, Manager, PhysicalSize, Runtime, State};

use crate::AppData;

#[tauri::command]
pub async fn splash(state: State<'_, tokio::sync::Mutex<AppData>>) -> Result<bool, String> {
    if state.lock().await.show_splash_screen {
        state.lock().await.show_splash_screen = false;
        return Ok(true);
    }
    Ok(false)
}

#[tauri::command]
pub async fn exit_splash_desktop<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    #[cfg(not(any(target_os = "ios", target_os = "android")))]
    {
        let window = match app.get_webview_window("main") {
            Some(window) => window,
            None => return Ok(()),
        };
        window
            .set_size(PhysicalSize::new(1280.0, 720.0))
            .expect("Failed to set window size");
        window
            .set_min_size(Some(PhysicalSize::new(300.0, 650.0)))
            .unwrap();
        window.center().unwrap();
        window
            .set_decorations(true)
            .expect("Failed to set window decorations");
    }

    Ok(())
}

#[tauri::command]
pub async fn fetch(url: String) -> Result<Value, String> {
    match surf::get(url).await {
        Ok(mut data) => match data.body_json::<Value>().await {
            Ok(json) => {
                println!("{data:?}");
                Ok(json)
            }
            Err(e) => {
                println!("{e:?}");
                Err(e.to_string())
            }
        },
        Err(e) => {
            println!("{e:?}");
            Err(e.to_string())
        }
    }
}
#[tauri::command]
pub async fn post(url: String, payload: Value) -> Result<Value, String> {
    println!("{payload:?}");
    match surf::post(url).body_json(&payload).unwrap().await {
        Ok(mut data) => match data.body_json::<Value>().await {
            Ok(json) => Ok(json),
            Err(e) => Err(e.to_string()),
        },
        Err(e) => Err(e.to_string()),
    }
}
#[tauri::command]
pub async fn argon2(password: String) -> Result<String, String> {
    let salt = b"my secret password for hash generation";
    let config = argon2::Config::default();
    let password_hash =
        argon2::hash_encoded(password.as_bytes(), salt.as_slice(), &config).unwrap();
    Ok(password_hash)
}
#[tauri::command]
pub async fn fetch_text(url: String) -> Result<String, String> {
    match surf::get(url).await {
        Ok(mut data) => match data.body_string().await {
            Ok(str) => Ok(str),
            Err(e) => Err(e.to_string()),
        },
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub async fn emit_event<R: Runtime>(
    event: String,
    payload: String,
    window: tauri::Window<R>,
) -> Result<(), String> {
    let _ = window.emit(&event, payload);
    Ok(())
}

#[derive(Serialize, Deserialize)]
struct Message {
    id: String,
    content: String,
    sender: Sender,
    receiver: String,
    created_at: String,
}
#[derive(Serialize, Deserialize)]
struct Sender {
    id: String,
    full_name: String,
}
#[tauri::command]
pub async fn get_messages(url: String, messages: Vec<String>) -> Result<Value, String> {
    if messages.is_empty() {
        return Ok(json!([]));
    }
    let mut messages: Vec<Message> =
        serde_json::from_value(post(url, json!({"messages": messages})).await.unwrap()).unwrap();
    for message in &mut messages {
        let mut decompressed = Vec::new();
        let mut decompressor = brotli::DecompressorWriter::new(&mut decompressed, 4096);
        decompressor
            .write_all(&BASE64_URL_SAFE.decode(message.content.as_str()).unwrap())
            .unwrap();
        drop(decompressor);
        message.content = String::from_utf8(decompressed).unwrap();
    }

    Ok(json!(messages))
}
#[tauri::command]
pub async fn send_message(
    url: String,
    id: String,
    content: String,
    sender: String,
    receiver: String,
) {
    let mut compressed = Vec::new();
    let mut compressor = brotli::CompressorWriter::new(&mut compressed, 4096, 11, 22);
    compressor.write_all(content.as_bytes()).unwrap();
    drop(compressor);
    post(
        url,
        json!(
            {
                "id": id,
                "content": BASE64_URL_SAFE.encode(compressed),
                "sender": sender,
                "receiver": receiver
            }
        ),
    )
    .await
    .unwrap();
}
