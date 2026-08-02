use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};
use tauri::tray::{TrayIconBuilder, TrayIconEvent};
use tauri::{AppHandle, Emitter, Manager, Runtime};

/// Builds the tray menu and installs the tray icon.
///
/// Menu actions that touch the download queue are forwarded to the frontend as
/// events rather than handled here: the queue, its concurrency rules and its
/// state machine all live in TypeScript, and duplicating that logic in Rust
/// would be a second source of truth.
pub fn setup_tray<R: Runtime>(app: &AppHandle<R>) -> tauri::Result<()> {
    let show = MenuItem::with_id(app, "show", "Show window", true, None::<&str>)?;
    let hide = MenuItem::with_id(app, "hide", "Hide window", true, None::<&str>)?;
    let pause_all = MenuItem::with_id(app, "pause-all", "Pause all downloads", true, None::<&str>)?;
    let resume_all = MenuItem::with_id(app, "resume-all", "Resume all downloads", true, None::<&str>)?;
    let cancel_all = MenuItem::with_id(app, "cancel-all", "Cancel all downloads", true, None::<&str>)?;
    let open_folder = MenuItem::with_id(app, "open-folder", "Open downloads folder", true, None::<&str>)?;
    let history = MenuItem::with_id(app, "history", "Open history", true, None::<&str>)?;
    let settings = MenuItem::with_id(app, "settings", "Settings", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let separator = PredefinedMenuItem::separator(app)?;

    let menu = Menu::with_items(
        app,
        &[
            &show,
            &hide,
            &separator,
            &pause_all,
            &resume_all,
            &cancel_all,
            &separator,
            &open_folder,
            &history,
            &settings,
            &separator,
            &quit,
        ],
    )?;

    let mut builder = TrayIconBuilder::with_id("main")
        .tooltip("Universal Downloader")
        .menu(&menu);

    // Use the window icon when available; a tray without an icon is still
    // better than a panic if the icon can't be resolved.
    if let Some(icon) = app.default_window_icon() {
        builder = builder.icon(icon.clone());
    }

    builder
        .on_menu_event(|app, event| match event.id().as_ref() {
            "show" => show_main_window(app),
            "hide" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.hide();
                }
            }
            "quit" => app.exit(0),
            // Queue and navigation actions belong to the frontend.
            other => {
                let _ = app.emit("tray://action", other.to_string());
                show_main_window(app);
            }
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click { .. } = event {
                show_main_window(tray.app_handle());
            }
        })
        .build(app)?;

    Ok(())
}

/// Brings the main window to the foreground, restoring it if minimised.
fn show_main_window<R: Runtime>(app: &AppHandle<R>) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();
    }
}

/// Updates the tray tooltip to reflect queue activity.
///
/// Called from the frontend so the summary always matches what the user sees
/// in the dashboard, rather than being recomputed from a second source.
#[tauri::command]
pub fn update_tray_status<R: Runtime>(app: AppHandle<R>, summary: String) -> Result<(), String> {
    if let Some(tray) = app.tray_by_id("main") {
        tray.set_tooltip(Some(&summary))
            .map_err(|e| format!("Failed to update tray: {e}"))?;
    }
    Ok(())
}
