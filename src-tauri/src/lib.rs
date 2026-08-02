mod commands;
mod diagnostics;
mod tray;

use commands::ProcessRegistry;

/// Bootstraps and runs the Tauri application, wiring up plugins, shared state,
/// the tray and the command handlers exposed to the frontend.
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_autostart::init(
            tauri_plugin_autostart::MacosLauncher::LaunchAgent,
            None,
        ))
        .manage(ProcessRegistry::default())
        .setup(|app| {
            // A tray failure (missing icon, unsupported platform) must not stop
            // the app from starting — the window is what matters. Log and go on.
            if let Err(err) = tray::setup_tray(app.handle()) {
                eprintln!("Tray setup failed (continuing without tray): {err}");
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::probe_media,
            commands::download_media,
            commands::stop_download,
            commands::open_path,
            diagnostics::yt_dlp_version,
            diagnostics::ffmpeg_version,
            tray::update_tray_status,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
