mod commands;
use commands::*;
use tauri::Manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
struct AppData {
    show_splash_screen: bool,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_os::init())
        .manage(tokio::sync::Mutex::new(AppData {
            show_splash_screen: true,
        }))
        .setup(|app| {
            app.get_webview_window("main").unwrap().open_devtools();

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            exit_splash_desktop,
            splash,
            fetch,
            fetch_text,
            emit_event,
            post,
            argon2,
            get_messages,
            send_message
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
