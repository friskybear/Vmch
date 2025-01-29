use std::time::Instant;

use serde_json::Value;
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
