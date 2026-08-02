use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::Mutex;
use tauri::{AppHandle, Emitter, State};
use tauri_plugin_opener::OpenerExt;
use tauri_plugin_shell::process::{CommandChild, CommandEvent};
use tauri_plugin_shell::ShellExt;

/// Tracks the live yt-dlp child process for each active download id, so a
/// download can be paused or cancelled by killing its process. Wrapped in a
/// Mutex because Tauri commands may run concurrently.
#[derive(Default)]
pub struct ProcessRegistry {
    children: Mutex<HashMap<String, CommandChild>>,
}

impl ProcessRegistry {
    fn insert(&self, id: String, child: CommandChild) {
        if let Ok(mut map) = self.children.lock() {
            map.insert(id, child);
        }
    }

    fn take(&self, id: &str) -> Option<CommandChild> {
        self.children.lock().ok().and_then(|mut map| map.remove(id))
    }
}

/// A single selectable format returned by yt-dlp for a media URL.
#[derive(Debug, Clone, Serialize)]
pub struct MediaFormat {
    pub format_id: String,
    pub ext: String,
    pub resolution: Option<String>,
    pub height: Option<u32>,
    pub fps: Option<f64>,
    pub vcodec: Option<String>,
    pub acodec: Option<String>,
    pub tbr: Option<f64>,
    pub dynamic_range: Option<String>,
    pub filesize_bytes: Option<u64>,
    pub note: Option<String>,
    pub has_video: bool,
    pub has_audio: bool,
}

/// A subtitle track available for a media URL.
#[derive(Debug, Clone, Serialize)]
pub struct SubtitleTrack {
    pub language: String,
    pub ext: Option<String>,
    pub auto_generated: bool,
}

/// Metadata resolved for a media URL before a download begins.
#[derive(Debug, Serialize)]
pub struct MediaInfo {
    pub title: String,
    pub description: Option<String>,
    pub duration_seconds: Option<u32>,
    pub uploader: Option<String>,
    pub channel: Option<String>,
    pub thumbnail: Option<String>,
    pub upload_date: Option<String>,
    pub view_count: Option<u64>,
    pub like_count: Option<u64>,
    pub is_live: bool,
    pub age_limit: Option<u32>,
    pub is_playlist: bool,
    pub formats: Vec<MediaFormat>,
    pub subtitles: Vec<SubtitleTrack>,
    pub source: String,
}

/// Raw yt-dlp `--dump-single-json` output (only the fields we consume).
#[derive(Debug, Deserialize)]
struct YtDlpInfo {
    title: Option<String>,
    description: Option<String>,
    duration: Option<f64>,
    uploader: Option<String>,
    channel: Option<String>,
    thumbnail: Option<String>,
    upload_date: Option<String>,
    view_count: Option<u64>,
    like_count: Option<u64>,
    #[serde(default)]
    is_live: bool,
    age_limit: Option<u32>,
    #[serde(rename = "_type")]
    entry_type: Option<String>,
    #[serde(default)]
    formats: Vec<YtDlpFormat>,
    #[serde(default)]
    subtitles: std::collections::HashMap<String, Vec<YtDlpSubtitle>>,
    #[serde(default)]
    automatic_captions: std::collections::HashMap<String, Vec<YtDlpSubtitle>>,
}

#[derive(Debug, Deserialize)]
struct YtDlpSubtitle {
    ext: Option<String>,
}

#[derive(Debug, Deserialize)]
struct YtDlpFormat {
    #[serde(default)]
    format_id: String,
    ext: Option<String>,
    resolution: Option<String>,
    height: Option<u32>,
    fps: Option<f64>,
    filesize: Option<u64>,
    filesize_approx: Option<u64>,
    format_note: Option<String>,
    vcodec: Option<String>,
    acodec: Option<String>,
    tbr: Option<f64>,
    dynamic_range: Option<String>,
}

/// A single progress tick emitted to the frontend during a download.
#[derive(Debug, Clone, Serialize)]
pub struct DownloadProgress {
    pub id: String,
    pub percent: f64,
    pub downloaded_bytes: f64,
    pub total_bytes: f64,
    pub speed: Option<String>,
    pub eta: Option<String>,
}

/// Shape yt-dlp writes via `--progress-template` (a JSON line per tick).
#[derive(Debug, Deserialize)]
struct RawProgress {
    #[serde(default)]
    downloaded_bytes: f64,
    #[serde(default)]
    total_bytes: f64,
    speed: Option<String>,
    eta: Option<String>,
}

const PROGRESS_TEMPLATE: &str = "download:{\"downloaded_bytes\":%(progress.downloaded_bytes)d,\"total_bytes\":%(progress.total_bytes)d,\"speed\":\"%(progress.speed)s\",\"eta\":\"%(progress.eta)s\"}";

/// Builds a clear, actionable message when a tool can't be launched.
///
/// A raw OS error like "program not found" doesn't tell the user what to do,
/// so this explains the likely cause (not installed or not on PATH) and points
/// at the setting that fixes it.
fn launch_failure_message(tool: &str, raw: &str) -> String {
    let lower = raw.to_ascii_lowercase();
    if lower.contains("not found")
        || lower.contains("no such file")
        || lower.contains("cannot find")
        || lower.contains("os error 2")
        || lower.contains("os error 3")
    {
        format!(
            "{tool} could not be found. Install it and make sure it's on your PATH, \
             or set its full path in Settings → Advanced. ({raw})"
        )
    } else {
        format!("Failed to launch {tool}: {raw}")
    }
}

/// Resolves which yt-dlp/ffmpeg binary to run.
///
/// GUI apps on Windows and macOS often inherit a minimal PATH that doesn't
/// include where package managers install tools, so relying on the bare name
/// fails even when the tool is installed. This resolver therefore:
///   1. uses an explicit user-provided path verbatim (the user is in control);
///   2. otherwise tries the bare name (works when PATH is complete);
///   3. otherwise searches the common install locations per platform.
///
/// `name` is the bare executable ("yt-dlp" or "ffmpeg"); `custom` is the
/// user's override from Settings, or empty.
pub fn resolve_binary_named(name: &str, custom: &str) -> String {
    let trimmed = custom.trim();
    if !trimmed.is_empty() {
        return trimmed.to_string();
    }

    // If the bare name resolves on PATH, use it — cheapest and most correct.
    if which_on_path(name).is_some() {
        return name.to_string();
    }

    // Otherwise probe well-known install locations. First hit wins; if none
    // match, fall back to the bare name so the error message is meaningful.
    find_in_common_locations(name).unwrap_or_else(|| name.to_string())
}

/// Backwards-compatible helper for yt-dlp callers.
fn resolve_binary(custom: &str) -> String {
    resolve_binary_named("yt-dlp", custom)
}

/// Returns the full path if `name` can be found on the current PATH.
fn which_on_path(name: &str) -> Option<String> {
    let path_var = std::env::var_os("PATH")?;
    let exe_names = executable_names(name);

    for dir in std::env::split_paths(&path_var) {
        for exe in &exe_names {
            let candidate = dir.join(exe);
            if candidate.is_file() {
                return Some(candidate.to_string_lossy().into_owned());
            }
        }
    }
    None
}

/// Searches platform-specific install locations for a binary.
fn find_in_common_locations(name: &str) -> Option<String> {
    let exe_names = executable_names(name);
    let mut dirs: Vec<std::path::PathBuf> = Vec::new();

    // User-level locations (resolved from the home directory).
    if let Some(home) = home_dir() {
        #[cfg(target_os = "windows")]
        {
            dirs.push(home.join("AppData\\Local\\Microsoft\\WinGet\\Links"));
            dirs.push(home.join("AppData\\Roaming\\Python\\Scripts"));
            dirs.push(home.join("scoop\\shims"));
            dirs.push(home.join("AppData\\Local\\Programs"));
        }
        #[cfg(not(target_os = "windows"))]
        {
            dirs.push(home.join(".local/bin"));
            dirs.push(home.join("bin"));
        }
    }

    // System-level locations.
    #[cfg(target_os = "windows")]
    {
        dirs.push(std::path::PathBuf::from("C:\\ProgramData\\chocolatey\\bin"));
        dirs.push(std::path::PathBuf::from("C:\\Program Files\\yt-dlp"));
        dirs.push(std::path::PathBuf::from("C:\\ffmpeg\\bin"));
    }
    #[cfg(not(target_os = "windows"))]
    {
        // Homebrew (Apple Silicon and Intel), MacPorts, and standard Unix bins.
        dirs.push(std::path::PathBuf::from("/opt/homebrew/bin"));
        dirs.push(std::path::PathBuf::from("/usr/local/bin"));
        dirs.push(std::path::PathBuf::from("/opt/local/bin"));
        dirs.push(std::path::PathBuf::from("/usr/bin"));
        dirs.push(std::path::PathBuf::from("/bin"));
        dirs.push(std::path::PathBuf::from("/snap/bin"));
    }

    for dir in dirs {
        for exe in &exe_names {
            let candidate = dir.join(exe);
            if candidate.is_file() {
                return Some(candidate.to_string_lossy().into_owned());
            }
        }
    }

    // WinGet installs into per-package folders with variable names, e.g.
    // AppData\Local\Microsoft\WinGet\Packages\<pkg>\<build>\bin\ffmpeg.exe.
    // The WinGet\Links shims above don't always cover these, so scan the
    // Packages tree (two levels deep, plus an optional bin/) for the binary.
    #[cfg(target_os = "windows")]
    if let Some(home) = home_dir() {
        let packages = home.join("AppData\\Local\\Microsoft\\WinGet\\Packages");
        if let Some(found) = search_winget_packages(&packages, &exe_names) {
            return Some(found);
        }
    }

    None
}

/// Scans WinGet's Packages directory for a binary. WinGet lays out packages as
/// `Packages/<package-id>/<build-dir>/[bin/]<exe>`, with variable middle names,
/// so we walk each package dir, each build dir inside it, and an optional `bin`
/// subfolder — shallow and bounded, never a full recursive walk.
#[cfg(target_os = "windows")]
fn search_winget_packages(
    packages: &std::path::Path,
    exe_names: &[String],
) -> Option<String> {
    let package_dirs = std::fs::read_dir(packages).ok()?;
    for package in package_dirs.flatten() {
        let package_path = package.path();
        if !package_path.is_dir() {
            continue;
        }
        let build_dirs = match std::fs::read_dir(&package_path) {
            Ok(d) => d,
            Err(_) => continue,
        };
        for build in build_dirs.flatten() {
            let build_path = build.path();
            if !build_path.is_dir() {
                continue;
            }
            for exe in exe_names {
                // Directly inside the build dir, or inside its bin/ subfolder.
                for candidate in [build_path.join(exe), build_path.join("bin").join(exe)] {
                    if candidate.is_file() {
                        return Some(candidate.to_string_lossy().into_owned());
                    }
                }
            }
        }
    }
    None
}

/// The candidate filenames for a tool on the current platform.
fn executable_names(name: &str) -> Vec<String> {
    #[cfg(target_os = "windows")]
    {
        // yt-dlp ships as yt-dlp.exe; also allow the bare name just in case.
        vec![format!("{name}.exe"), name.to_string()]
    }
    #[cfg(not(target_os = "windows"))]
    {
        vec![name.to_string()]
    }
}

/// Best-effort home directory without pulling in an extra dependency.
fn home_dir() -> Option<std::path::PathBuf> {
    #[cfg(target_os = "windows")]
    {
        std::env::var_os("USERPROFILE").map(std::path::PathBuf::from)
    }
    #[cfg(not(target_os = "windows"))]
    {
        std::env::var_os("HOME").map(std::path::PathBuf::from)
    }
}

/// Extracts the output file path from a yt-dlp output line, if present.
///
/// yt-dlp announces the file it writes in a few recognisable shapes. The merge
/// line is the most authoritative (it names the final container), so callers
/// should keep the *last* path seen over a run. Returns an owned path string.
fn extract_output_path(line: &str) -> Option<String> {
    let lower = line.to_ascii_lowercase();

    // [Merger] Merging formats into "/path/file.mkv"
    if lower.contains("[merger]") {
        if let Some(start) = line.find('"') {
            if let Some(end) = line[start + 1..].find('"') {
                return Some(line[start + 1..start + 1 + end].to_string());
            }
        }
    }

    // [download] Destination: /path/file.mp4
    if let Some(rest) = line.strip_prefix("[download] Destination: ") {
        let path = rest.trim();
        if !path.is_empty() {
            return Some(path.to_string());
        }
    }

    // [download] /path/file.mp4 has already been downloaded
    if lower.starts_with("[download] ") && lower.contains("has already been downloaded") {
        let inner = &line["[download] ".len()..];
        if let Some(idx) = inner.find(" has already been downloaded") {
            let path = inner[..idx].trim();
            if !path.is_empty() {
                return Some(path.to_string());
            }
        }
    }

    // [ExtractAudio] Destination: /path/file.mp3
    if let Some(rest) = line.strip_prefix("[ExtractAudio] Destination: ") {
        let path = rest.trim();
        if !path.is_empty() {
            return Some(path.to_string());
        }
    }

    None
}

/// A coarse phase of the download pipeline, derived from yt-dlp's output.
#[derive(Debug, Clone, Serialize)]
pub struct DownloadPhase {
    pub id: String,
    /// Stable phase key the frontend maps to an icon and label.
    pub phase: String,
    /// The raw line that produced this phase, useful for the live log.
    pub detail: String,
}

/// A single line of provider output, forwarded to the per-download live log.
#[derive(Debug, Clone, Serialize)]
pub struct DownloadLog {
    pub id: String,
    /// `info`, `warning` or `error`.
    pub level: String,
    pub message: String,
}

/// Maps a yt-dlp output line to a pipeline phase.
///
/// yt-dlp announces its stages as bracketed prefixes on stdout. Only lines we
/// recognise produce a phase; everything else returns `None` so the caller can
/// treat it as an ordinary log line.
fn detect_phase(line: &str) -> Option<&'static str> {
    let lower = line.to_ascii_lowercase();

    if lower.contains("[merger]") {
        return Some("merging");
    }
    if lower.contains("[extractaudio]") {
        return Some("extracting-audio");
    }
    if lower.contains("[embedsubtitle]") || lower.contains("[embedsubs]") {
        return Some("embedding-subtitles");
    }
    if lower.contains("[embedthumbnail]") {
        return Some("embedding-thumbnail");
    }
    if lower.contains("[metadata]") {
        return Some("embedding-metadata");
    }
    if lower.contains("[videoconvertor]") || lower.contains("[videoremuxer]") {
        return Some("converting");
    }
    if lower.contains("[fixup") {
        return Some("finalizing");
    }
    if lower.contains("[info]") {
        return Some("preparing");
    }
    if lower.starts_with("[download] destination") {
        return Some("downloading");
    }
    if lower.contains("[youtube]") || lower.contains("[generic]") {
        return Some("connecting");
    }
    None
}

/// Rejects output templates that could escape the output directory. The
/// frontend validates too, but this is the security boundary — never trust
/// values that crossed the IPC layer.
fn validate_template(template: &str) -> Result<(), String> {
    if template.trim().is_empty() {
        return Err("Output template must not be empty".into());
    }
    if template.starts_with('/') || template.contains(':') {
        return Err("Output template must be a relative path".into());
    }
    if template.split('/').any(|segment| segment == "..") {
        return Err("Output template must not contain '..'".into());
    }
    Ok(())
}

/// Rejects output directories that are relative or contain parent-directory
/// segments, preventing path traversal from untrusted input.
fn validate_output_dir(dir: &str) -> Result<(), String> {
    let path = std::path::Path::new(dir);
    if !path.is_absolute() {
        return Err("Output directory must be an absolute path".into());
    }
    if path
        .components()
        .any(|c| matches!(c, std::path::Component::ParentDir))
    {
        return Err("Output directory must not contain '..'".into());
    }
    // Create the directory if it doesn't exist yet, so a saved default folder
    // that was since removed doesn't fail the download.
    if !path.exists() {
        std::fs::create_dir_all(path)
            .map_err(|e| format!("Could not create the output folder: {e}"))?;
    }
    Ok(())
}

/// Returns true when yt-dlp reports a real codec (not the literal "none").
fn codec_present(codec: &Option<String>) -> bool {
    matches!(codec.as_deref(), Some(c) if c != "none")
}

impl From<YtDlpFormat> for MediaFormat {
    fn from(f: YtDlpFormat) -> Self {
        MediaFormat {
            has_video: codec_present(&f.vcodec),
            has_audio: codec_present(&f.acodec),
            format_id: f.format_id,
            ext: f.ext.unwrap_or_else(|| "?".into()),
            resolution: f.resolution,
            height: f.height,
            fps: f.fps,
            vcodec: f.vcodec.filter(|c| c != "none"),
            acodec: f.acodec.filter(|c| c != "none"),
            tbr: f.tbr,
            dynamic_range: f.dynamic_range.filter(|d| d != "SDR" && !d.is_empty()),
            filesize_bytes: f.filesize.or(f.filesize_approx),
            note: f.format_note,
        }
    }
}

/// Flattens yt-dlp's subtitle maps into a single list, marking auto-captions.
fn collect_subtitles(
    subs: std::collections::HashMap<String, Vec<YtDlpSubtitle>>,
    auto: bool,
) -> Vec<SubtitleTrack> {
    subs.into_iter()
        .map(|(language, tracks)| SubtitleTrack {
            ext: tracks.into_iter().next().and_then(|t| t.ext),
            language,
            auto_generated: auto,
        })
        .collect()
}

/// Resolves metadata and available formats for a media URL by invoking
/// `yt-dlp --dump-single-json`.
///
/// Returns a readable error if yt-dlp is missing, the URL is unsupported,
/// or the JSON cannot be parsed.
#[tauri::command]
pub async fn probe_media(
    app: AppHandle,
    url: String,
    yt_dlp_path: String,
) -> Result<MediaInfo, String> {
    let trimmed = url.trim().to_string();
    if trimmed.is_empty() {
        return Err("URL cannot be empty".into());
    }

    let output = app
        .shell()
        .command(resolve_binary(&yt_dlp_path))
        .args([
            "--dump-single-json",
            "--no-playlist",
            // Bound the probe so an unresponsive host surfaces an error instead
            // of leaving the card spinning in `probing` forever.
            "--socket-timeout",
            "30",
            &trimmed,
        ])
        .output()
        .await
        .map_err(|e| launch_failure_message("yt-dlp", &e.to_string()))?;

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        return Err(first_meaningful_line(&stderr));
    }

    let info: YtDlpInfo = serde_json::from_slice(&output.stdout)
        .map_err(|e| format!("Could not parse media info: {e}"))?;

    let is_playlist = info.entry_type.as_deref() == Some("playlist");

    let mut subtitles = collect_subtitles(info.subtitles, false);
    subtitles.extend(collect_subtitles(info.automatic_captions, true));

    let formats = info
        .formats
        .into_iter()
        .map(MediaFormat::from)
        .filter(|f| f.has_video || f.has_audio)
        .collect();

    Ok(MediaInfo {
        title: info.title.unwrap_or_else(|| "Untitled media".into()),
        description: info.description,
        duration_seconds: info.duration.map(|d| d as u32),
        uploader: info.uploader,
        channel: info.channel,
        thumbnail: info.thumbnail,
        upload_date: info.upload_date,
        view_count: info.view_count,
        like_count: info.like_count,
        is_live: info.is_live,
        age_limit: info.age_limit,
        is_playlist,
        formats,
        subtitles,
        source: trimmed,
    })
}

/// Downloads a media URL to `output_dir` using the given `format_id` (falls
/// back to yt-dlp's default when empty), streaming progress to the frontend
/// via `download://progress` events keyed by `id`.
#[tauri::command]
pub async fn download_media(
    app: AppHandle,
    registry: State<'_, ProcessRegistry>,
    id: String,
    url: String,
    extra_args: Vec<String>,
    output_template: String,
    output_dir: String,
    yt_dlp_path: String,
    ffmpeg_path: String,
) -> Result<Option<String>, String> {
    validate_output_dir(&output_dir)?;
    validate_template(&output_template)?;
    let output_path = format!("{output_dir}/{output_template}");

    let mut args: Vec<String> = vec![
        "--newline".into(),
        "--continue".into(),
        "--progress-template".into(),
        PROGRESS_TEMPLATE.into(),
        "-o".into(),
        output_path,
    ];

    // Point yt-dlp at an ffmpeg build. Use the user's path if set; otherwise
    // try to locate one in the common install locations, so merging and audio
    // extraction work even when ffmpeg isn't on the GUI process's PATH.
    let resolved_ffmpeg = if ffmpeg_path.trim().is_empty() {
        find_in_common_locations("ffmpeg")
    } else {
        Some(ffmpeg_path.trim().to_string())
    };
    if let Some(ffmpeg) = resolved_ffmpeg {
        args.push("--ffmpeg-location".into());
        args.push(ffmpeg);
    }

    // Caller-supplied options (format, playlist, audio, subs, cookies, …).
    // Rewrite a relative --download-archive value to an absolute path inside the
    // output directory: yt-dlp resolves it against the process working
    // directory otherwise, which is unpredictable for a GUI app.
    let mut extra = extra_args;
    for i in 0..extra.len() {
        if extra[i] == "--download-archive" && i + 1 < extra.len() {
            let file = std::path::Path::new(&extra[i + 1]);
            if file.is_relative() {
                let name = file
                    .file_name()
                    .and_then(|n| n.to_str())
                    .unwrap_or("archive.txt");
                extra[i + 1] = format!("{output_dir}/{name}");
            }
        }
    }
    args.extend(extra);
    args.push(url);

    let (mut rx, child) = app
        .shell()
        .command(resolve_binary(&yt_dlp_path))
        .args(args)
        .spawn()
        .map_err(|e| launch_failure_message("yt-dlp", &e.to_string()))?;

    registry.insert(id.clone(), child);

    let mut last_error: Option<String> = None;
    let mut out_path: Option<String> = None;

    while let Some(event) = rx.recv().await {
        match event {
            CommandEvent::Stdout(line) => {
                let text = String::from_utf8_lossy(&line);
                let trimmed = text.trim();

                if let Some(progress) = parse_progress(&id, trimmed) {
                    let _ = app.emit("download://progress", progress);
                    continue;
                }

                if trimmed.is_empty() {
                    continue;
                }

                // Track the destination file; the last one seen wins (the merge
                // step names the final container).
                if let Some(path) = extract_output_path(trimmed) {
                    out_path = Some(path);
                }

                if let Some(phase) = detect_phase(trimmed) {
                    let _ = app.emit(
                        "download://phase",
                        DownloadPhase {
                            id: id.clone(),
                            phase: phase.to_string(),
                            detail: trimmed.to_string(),
                        },
                    );
                }

                let _ = app.emit(
                    "download://log",
                    DownloadLog {
                        id: id.clone(),
                        level: "info".into(),
                        message: trimmed.to_string(),
                    },
                );
            }
            CommandEvent::Stderr(line) => {
                let text = String::from_utf8_lossy(&line);
                let trimmed = text.trim();
                if !trimmed.is_empty() {
                    let level = if trimmed.to_ascii_lowercase().starts_with("warning") {
                        "warning"
                    } else {
                        "error"
                    };
                    let _ = app.emit(
                        "download://log",
                        DownloadLog {
                            id: id.clone(),
                            level: level.into(),
                            message: trimmed.to_string(),
                        },
                    );
                    if level == "error" {
                        last_error = Some(trimmed.to_string());
                    }
                }
            }
            CommandEvent::Error(err) => {
                last_error = Some(err);
            }
            CommandEvent::Terminated(payload) => {
                registry.take(&id);
                // Exit code 0 = success. A killed process (pause/cancel) has a
                // non-zero code; the caller distinguishes those via the state
                // it already holds, so we only surface real yt-dlp failures.
                if payload.code != Some(0) {
                    return Err(last_error.unwrap_or_else(|| "Download stopped".into()));
                }
            }
            _ => {}
        }
    }

    registry.take(&id);
    Ok(out_path)
}

/// Stops an active download by killing its yt-dlp process. Used for both pause
/// and cancel — the difference is intent, tracked by the frontend. A partial
/// file is left on disk so a later resume can `--continue` it. Returns Ok even
/// if the id has no live process (already finished).
#[tauri::command]
pub fn stop_download(registry: State<'_, ProcessRegistry>, id: String) -> Result<(), String> {
    if let Some(child) = registry.take(&id) {
        child.kill().map_err(|e| format!("Failed to stop download: {e}"))?;
    }
    Ok(())
}

/// Opens a file or folder in the OS default handler (file manager, player).
/// The path is validated to be absolute and free of parent-directory segments.
#[tauri::command]
pub async fn open_path(app: AppHandle, path: String) -> Result<(), String> {
    let p = std::path::Path::new(&path);
    if !p.is_absolute()
        || p.components()
            .any(|c| matches!(c, std::path::Component::ParentDir))
    {
        return Err("Invalid path".into());
    }
    app.opener()
        .open_path(path, None::<&str>)
        .map_err(|e| format!("Failed to open path: {e}"))
}

/// Parses one yt-dlp progress line into a `DownloadProgress` for `id`.
/// Returns `None` for lines that are not progress JSON.
fn parse_progress(id: &str, line: &str) -> Option<DownloadProgress> {
    let raw: RawProgress = serde_json::from_str(line).ok()?;
    let percent = if raw.total_bytes > 0.0 {
        (raw.downloaded_bytes / raw.total_bytes) * 100.0
    } else {
        0.0
    };

    Some(DownloadProgress {
        id: id.to_string(),
        percent,
        downloaded_bytes: raw.downloaded_bytes,
        total_bytes: raw.total_bytes,
        speed: clean_optional(raw.speed),
        eta: clean_optional(raw.eta),
    })
}

/// yt-dlp writes the literal string "NA" for unknown template values.
fn clean_optional(value: Option<String>) -> Option<String> {
    value.filter(|v| v != "NA" && !v.is_empty())
}

/// Extracts the first non-empty, non-warning line from yt-dlp's stderr so
/// the frontend shows something actionable instead of a wall of text.
fn first_meaningful_line(stderr: &str) -> String {
    stderr
        .lines()
        .map(str::trim)
        .find(|line| !line.is_empty() && !line.starts_with("WARNING"))
        .unwrap_or("yt-dlp failed to resolve this URL")
        .to_string()
}
