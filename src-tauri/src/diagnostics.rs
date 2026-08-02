use crate::commands::resolve_binary_named;
use tauri::AppHandle;
use tauri_plugin_shell::ShellExt;

/// Runs a tool with a version flag and returns its first output line.
///
/// Kept separate from the download commands because diagnostics must never
/// fail the app: a missing binary is a reportable condition, not an error the
/// caller has to handle specially. The binary is resolved with the same
/// robust logic downloads use, so a tool installed outside the GUI's PATH is
/// still detected.
async fn tool_version(
    app: &AppHandle,
    binary: &str,
    args: &[&str],
) -> Result<String, String> {
    let output = app
        .shell()
        .command(binary)
        .args(args)
        .output()
        .await
        .map_err(|e| format!("{binary} could not be started: {e}"))?;

    if !output.status.success() {
        return Err(format!("{binary} exited with an error"));
    }

    let text = String::from_utf8_lossy(&output.stdout);
    Ok(text.lines().next().unwrap_or("unknown").trim().to_string())
}

/// Reports the installed yt-dlp version. An empty `path` uses PATH plus the
/// common install locations.
#[tauri::command]
pub async fn yt_dlp_version(app: AppHandle, path: String) -> Result<String, String> {
    let binary = resolve_binary_named("yt-dlp", &path);
    tool_version(&app, &binary, &["--version"]).await
}

/// Reports the installed FFmpeg version. An empty `path` uses PATH plus the
/// common install locations.
#[tauri::command]
pub async fn ffmpeg_version(app: AppHandle, path: String) -> Result<String, String> {
    let binary = resolve_binary_named("ffmpeg", &path);
    tool_version(&app, &binary, &["-version"]).await
}
