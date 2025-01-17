fn main() {
    std::env::set_current_dir(format!(
        "{}\\DataBase\\fake_data_gen",
        std::env::current_dir().unwrap().to_string_lossy()
    ))
    .unwrap();
    let mut x = std::process::Command::new("cargo")
        .arg("run")
        .spawn()
        .expect("Failed to spawn terminal");

    std::env::set_current_dir(std::env::current_dir().unwrap().parent().unwrap()).unwrap();
    std::env::set_current_dir(std::env::current_dir().unwrap().parent().unwrap()).unwrap();
    std::env::set_current_dir(format!(
        "{}\\Server",
        std::env::current_dir().unwrap().to_string_lossy()
    ))
    .unwrap();
    let mut y = std::process::Command::new("cargo")
        .arg("run")
        .spawn()
        .expect("Failed to spawn terminal for Server");
    y.wait().unwrap();
    x.wait().unwrap();
}
