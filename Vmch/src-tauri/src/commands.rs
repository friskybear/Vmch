use std::{sync::LazyLock, time::Duration};

use parking_lot::Mutex;
use tauri::{Emitter, Manager, Runtime};
use tokio::time::sleep;
pub static IS_API: LazyLock<Mutex<bool>> = LazyLock::new(|| Mutex::new(false));

#[tauri::command]
pub async fn reconnect<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    if let Some(window) = app.get_webview_window("splashscreen") {
        window.emit("connection_status", "fail").unwrap();
    }

    Ok(())
}

#[tauri::command]
pub async fn connected<R: Runtime>(app: tauri::AppHandle<R>) -> Result<(), String> {
    let window = match app.get_webview_window("splashscreen") {
        Some(window) => window,
        None => return Ok(()),
    };
    window.emit("connection_status", "success").unwrap();
    sleep(Duration::from_secs(3)).await;
    let mut api = IS_API.lock();
    *api = true;
    drop(api);
    match window.close() {
        Ok(_) => app.get_webview_window("main").unwrap().show().unwrap(),
        Err(e) => return Err(format!("Failed to close window: {}", e)),
    };

    Ok(())
}
