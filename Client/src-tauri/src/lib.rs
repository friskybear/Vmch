// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn get_current_dir() -> String {
    std::env::current_dir()
        .unwrap()
        .parent()
        .unwrap()
        .to_string_lossy()
        .to_string()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![get_current_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
