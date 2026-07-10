#[cfg(unix)]
use std::time::{SystemTime, UNIX_EPOCH};
use std::{
    env,
    ffi::{CStr, CString},
    fs::{self, File},
    io::{self, Read},
    os::raw::c_char,
    path::{Path, PathBuf},
    ptr,
};

use decmpfs::{compress_bytes, Gate, Outcome};
use libloading::Library;
use napi_sys::{napi_env, napi_value};
use sha2::{Digest, Sha512};

mod pressed_data {
    include!(concat!(env!("OUT_DIR"), "/pressed_data.rs"));
}

const MAGIC_MARKER: &[u8; 32] = b"__SMOL_PRESSED_DATA_MAGIC_MARKER";
const CACHE_KEY_LEN: usize = 16;
const PLATFORM_METADATA_LEN: usize = 3;
const INTEGRITY_HASH_LEN: usize = 64;
const SMOL_CONFIG_FLAG_LEN: usize = 1;
const SMOL_CONFIG_BINARY_LEN: usize = 1192;
const MAX_DECOMPRESSED: u64 = 512 * 1024 * 1024;
const HEADER_LEN: usize = MAGIC_MARKER.len()
    + 16
    + CACHE_KEY_LEN
    + PLATFORM_METADATA_LEN
    + INTEGRITY_HASH_LEN
    + SMOL_CONFIG_FLAG_LEN;

type RegisterModule = unsafe extern "C" fn(napi_env, napi_value) -> napi_value;

#[derive(Debug, Clone, PartialEq, Eq)]
struct PressedDataMetadata {
    compressed_len: u64,
    uncompressed_len: u64,
    compressed_sha512: [u8; INTEGRITY_HASH_LEN],
    raw_sha512: Option<[u8; INTEGRITY_HASH_LEN]>,
}

impl PressedDataMetadata {
    fn cache_key(&self) -> String {
        hex::encode(self.raw_sha512.unwrap_or(self.compressed_sha512))
    }
}

/// Node-API registration entrypoint exported by the compressed binding loader.
///
/// # Safety
///
/// Node.js must call this function with a valid `napi_env` and `exports` value
/// for the addon being initialized. The loader forwards both values to the
/// original addon entrypoint after materializing and dynamically loading it.
#[no_mangle]
pub unsafe extern "C" fn napi_register_module_v1(env: napi_env, exports: napi_value) -> napi_value {
    setup_napi();

    match register_original_addon(env, exports) {
        Ok(exports) => exports,
        Err(err) => {
            unsafe {
                throw_napi_error(env, &err);
            }
            exports
        }
    }
}

fn register_original_addon(env: napi_env, exports: napi_value) -> Result<napi_value, String> {
    let metadata = parse_pressed_data_metadata(&pressed_data::PRESSED_DATA).ok_or_else(|| {
        "SWC native binding loader did not contain a valid pressed-data payload".to_string()
    })?;
    let self_path = unsafe { module_file_name(env)? };
    let cache_path = cache_path_for(&cache_root(), &self_path, &metadata);

    if cache_path.exists() {
        match verify_cached_raw_addon(&cache_path, &metadata) {
            Ok(true) => match unsafe { load_and_register(&cache_path, env, exports) } {
                Ok(exports) => {
                    debug_log(format_args!(
                        "loaded native binding cache {}",
                        cache_path.display()
                    ));
                    return Ok(exports);
                }
                Err(err) => {
                    debug_log(format_args!(
                        "failed to load native binding cache {}: {err}",
                        cache_path.display()
                    ));
                    let _ = fs::remove_file(&cache_path);
                }
            },
            Ok(false) => {
                debug_log(format_args!(
                    "discarding invalid native binding cache {}",
                    cache_path.display()
                ));
                let _ = fs::remove_file(&cache_path);
            }
            Err(err) => {
                debug_log(format_args!(
                    "failed to verify native binding cache {}: {err}",
                    cache_path.display()
                ));
                let _ = fs::remove_file(&cache_path);
            }
        }
    }

    let raw = decmpfs::addon::decode_pressed_data(&pressed_data::PRESSED_DATA)
        .ok_or_else(|| "failed to verify or decompress SWC native binding payload".to_string())?;

    #[cfg(unix)]
    if !env_flag("SWC_NATIVE_BINDING_DISABLE_SELF_REPLACE") {
        match try_self_replace(&self_path, &raw) {
            Ok(true) => debug_log(format_args!(
                "self-replaced native binding {}; loading cache for current process",
                self_path.display()
            )),
            Ok(false) => {}
            Err(err) => debug_log(format_args!(
                "self-replace native binding path {} failed: {err}",
                self_path.display()
            )),
        }
    }

    write_cache_addon(&cache_path, &raw)?;
    unsafe { load_and_register(&cache_path, env, exports) }
}

fn parse_pressed_data_metadata(data: &[u8]) -> Option<PressedDataMetadata> {
    if data.len() < HEADER_LEN {
        return None;
    }
    if &data[..MAGIC_MARKER.len()] != MAGIC_MARKER.as_slice() {
        return None;
    }

    let compressed_len = read_u64_le(data, MAGIC_MARKER.len())?;
    let uncompressed_len = read_u64_le(data, MAGIC_MARKER.len() + 8)?;
    if compressed_len == 0
        || uncompressed_len == 0
        || compressed_len > MAX_DECOMPRESSED
        || uncompressed_len > MAX_DECOMPRESSED
    {
        return None;
    }

    let integrity_offset = MAGIC_MARKER.len() + 16 + CACHE_KEY_LEN + PLATFORM_METADATA_LEN;
    let integrity = data.get(integrity_offset..integrity_offset + INTEGRITY_HASH_LEN)?;
    let mut compressed_sha512 = [0; INTEGRITY_HASH_LEN];
    compressed_sha512.copy_from_slice(integrity);

    let config_flag_offset = integrity_offset + INTEGRITY_HASH_LEN;
    let has_config = *data.get(config_flag_offset)?;
    let payload_offset = config_flag_offset
        .checked_add(SMOL_CONFIG_FLAG_LEN)?
        .checked_add(if has_config == 0 {
            0
        } else {
            SMOL_CONFIG_BINARY_LEN
        })?;
    let raw_hash_offset = payload_offset.checked_add(compressed_len as usize)?;
    data.get(payload_offset..raw_hash_offset)?;
    let raw_sha512 = data
        .get(raw_hash_offset..raw_hash_offset + INTEGRITY_HASH_LEN)
        .map(|integrity| {
            let mut raw_sha512 = [0; INTEGRITY_HASH_LEN];
            raw_sha512.copy_from_slice(integrity);
            raw_sha512
        });

    Some(PressedDataMetadata {
        compressed_len,
        uncompressed_len,
        compressed_sha512,
        raw_sha512,
    })
}

fn read_u64_le(buf: &[u8], at: usize) -> Option<u64> {
    let bytes = buf.get(at..at + 8)?;
    let mut arr = [0; 8];
    arr.copy_from_slice(bytes);
    Some(u64::from_le_bytes(arr))
}

fn cache_root() -> PathBuf {
    if let Some(dir) = env::var_os("SWC_NATIVE_BINDING_CACHE_DIR").filter(|v| !v.is_empty()) {
        return PathBuf::from(dir);
    }

    #[cfg(target_os = "macos")]
    {
        if let Some(home) = env::var_os("HOME").filter(|v| !v.is_empty()) {
            return PathBuf::from(home)
                .join("Library")
                .join("Caches")
                .join("swc")
                .join("native-bindings");
        }
    }

    #[cfg(windows)]
    {
        if let Some(local_app_data) = env::var_os("LOCALAPPDATA").filter(|v| !v.is_empty()) {
            return PathBuf::from(local_app_data)
                .join("swc")
                .join("native-bindings");
        }
        if let Some(user_profile) = env::var_os("USERPROFILE").filter(|v| !v.is_empty()) {
            return PathBuf::from(user_profile)
                .join("AppData")
                .join("Local")
                .join("swc")
                .join("native-bindings");
        }
    }

    #[cfg(all(unix, not(target_os = "macos")))]
    {
        if let Some(xdg) = env::var_os("XDG_CACHE_HOME").filter(|v| !v.is_empty()) {
            return PathBuf::from(xdg).join("swc").join("native-bindings");
        }
        if let Some(home) = env::var_os("HOME").filter(|v| !v.is_empty()) {
            return PathBuf::from(home)
                .join(".cache")
                .join("swc")
                .join("native-bindings");
        }
    }

    env::temp_dir().join("swc-native-bindings")
}

fn cache_path_for(root: &Path, module_path: &Path, metadata: &PressedDataMetadata) -> PathBuf {
    let addon_name = module_path
        .file_stem()
        .and_then(|name| name.to_str())
        .filter(|name| !name.is_empty())
        .unwrap_or("swc-native-binding");
    root.join("v1")
        .join(format!("{addon_name}-{}.node", metadata.cache_key()))
}

fn verify_cached_raw_addon(path: &Path, metadata: &PressedDataMetadata) -> Result<bool, String> {
    let file = match File::open(path) {
        Ok(file) => file,
        Err(err) if err.kind() == io::ErrorKind::NotFound => return Ok(false),
        Err(err) => {
            return Err(format!(
                "failed to open native binding cache {}: {err}",
                path.display()
            ))
        }
    };
    let file_metadata = file.metadata().map_err(|err| {
        format!(
            "failed to stat native binding cache {}: {err}",
            path.display()
        )
    })?;

    if !file_metadata.is_file() || file_metadata.len() != metadata.uncompressed_len {
        return Ok(false);
    }

    let Some(raw_sha512) = &metadata.raw_sha512 else {
        return Ok(false);
    };

    raw_addon_sha512_matches(file, raw_sha512)
}

fn raw_addon_sha512_matches<R>(
    mut reader: R,
    expected: &[u8; INTEGRITY_HASH_LEN],
) -> Result<bool, String>
where
    R: Read,
{
    let mut hasher = Sha512::new();
    let mut buf = [0u8; 64 * 1024];
    loop {
        let read = reader
            .read(&mut buf)
            .map_err(|err| format!("failed to hash native binding cache: {err}"))?;
        if read == 0 {
            break;
        }
        hasher.update(&buf[..read]);
    }
    let actual = hasher.finalize();
    Ok(actual[..] == expected[..])
}

#[cfg(unix)]
fn try_self_replace(self_path: &Path, raw: &[u8]) -> Result<bool, String> {
    let parent = match self_path.parent() {
        Some(parent) => parent,
        None => return Ok(false),
    };
    let file_name = match self_path.file_name().and_then(|name| name.to_str()) {
        Some(file_name) => file_name,
        None => return Ok(false),
    };

    let unique = SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|duration| duration.as_nanos())
        .unwrap_or_default();
    let tmp = parent.join(format!(
        ".{file_name}.swc-native-{}-{unique}.node",
        std::process::id()
    ));

    let outcome = compress_bytes(&tmp, raw, &Gate::any())
        .map_err(|err| format!("failed to write OS-compressed sibling addon: {err}"))?;
    debug_log(format_args!(
        "self-replace temp {} outcome {outcome:?}",
        tmp.display()
    ));

    if !is_os_compressed_outcome(&outcome) {
        let _ = fs::remove_file(&tmp);
        return Ok(false);
    }

    match fs::rename(&tmp, self_path) {
        Ok(()) => Ok(true),
        Err(err) => {
            let _ = fs::remove_file(&tmp);
            if is_non_fatal_replace_error(&err) {
                debug_log(format_args!(
                    "self-replace rename {} -> {} skipped: {err}",
                    tmp.display(),
                    self_path.display()
                ));
                Ok(false)
            } else {
                Err(format!(
                    "failed to replace {} with {}: {err}",
                    self_path.display(),
                    tmp.display()
                ))
            }
        }
    }
}

fn write_cache_addon(cache_path: &Path, raw: &[u8]) -> Result<(), String> {
    if let Some(parent) = cache_path.parent() {
        fs::create_dir_all(parent).map_err(|err| {
            format!(
                "failed to create native binding cache directory {}: {err}",
                parent.display()
            )
        })?;
    }
    let outcome = compress_bytes(cache_path, raw, &Gate::any()).map_err(|err| {
        format!(
            "failed to write native binding cache {}: {err}",
            cache_path.display()
        )
    })?;
    debug_log(format_args!(
        "wrote native binding cache {} outcome {outcome:?}",
        cache_path.display()
    ));
    Ok(())
}

fn is_os_compressed_outcome(outcome: &Outcome) -> bool {
    matches!(
        outcome,
        Outcome::Compressed { .. } | Outcome::NoGain { .. } | Outcome::AlreadyCompressed { .. }
    )
}

#[cfg(unix)]
fn is_non_fatal_replace_error(err: &io::Error) -> bool {
    matches!(
        err.kind(),
        io::ErrorKind::PermissionDenied
            | io::ErrorKind::AlreadyExists
            | io::ErrorKind::NotFound
            | io::ErrorKind::Unsupported
    )
}

unsafe fn load_and_register(
    path: &Path,
    env: napi_env,
    exports: napi_value,
) -> Result<napi_value, String> {
    let library = unsafe { Library::new(path) }
        .map_err(|err| format!("failed to load native binding {}: {err}", path.display()))?;
    let register: RegisterModule = unsafe {
        *library
            .get::<RegisterModule>(b"napi_register_module_v1\0")
            .map_err(|err| {
                format!(
                    "failed to resolve napi_register_module_v1 from {}: {err}",
                    path.display()
                )
            })?
    };
    let exports = unsafe { register(env, exports) };
    Box::leak(Box::new(library));
    Ok(exports)
}

unsafe fn module_file_name(env: napi_env) -> Result<PathBuf, String> {
    let mut result: *const c_char = ptr::null();
    let status = unsafe { napi_sys::node_api_get_module_file_name(env, &mut result) };
    if status != napi_sys::Status::napi_ok || result.is_null() {
        return Err(format!(
            "node_api_get_module_file_name failed with N-API status {status}"
        ));
    }

    let path = unsafe { CStr::from_ptr(result) }
        .to_string_lossy()
        .into_owned();
    Ok(module_path_from_node_file_name(&path))
}

fn module_path_from_node_file_name(file_name: &str) -> PathBuf {
    file_url_to_path(file_name).unwrap_or_else(|| PathBuf::from(file_name))
}

fn file_url_to_path(file_name: &str) -> Option<PathBuf> {
    let rest = file_name.strip_prefix("file://")?;
    let path_storage;
    let path = if rest.starts_with('/') {
        rest
    } else if let Some(rest) = rest.strip_prefix("localhost/") {
        path_storage = format!("/{rest}");
        path_storage.as_str()
    } else {
        return None;
    };

    Some(bytes_to_path_buf(percent_decode(path.as_bytes())?))
}

fn percent_decode(bytes: &[u8]) -> Option<Vec<u8>> {
    let mut decoded = Vec::with_capacity(bytes.len());
    let mut i = 0;
    while i < bytes.len() {
        if bytes[i] == b'%' {
            let hi = hex_digit(*bytes.get(i + 1)?)?;
            let lo = hex_digit(*bytes.get(i + 2)?)?;
            decoded.push((hi << 4) | lo);
            i += 3;
        } else {
            decoded.push(bytes[i]);
            i += 1;
        }
    }
    Some(decoded)
}

fn hex_digit(byte: u8) -> Option<u8> {
    match byte {
        b'0'..=b'9' => Some(byte - b'0'),
        b'a'..=b'f' => Some(byte - b'a' + 10),
        b'A'..=b'F' => Some(byte - b'A' + 10),
        _ => None,
    }
}

fn bytes_to_path_buf(bytes: Vec<u8>) -> PathBuf {
    #[cfg(unix)]
    {
        use std::os::unix::ffi::OsStringExt;

        PathBuf::from(std::ffi::OsString::from_vec(bytes))
    }

    #[cfg(windows)]
    {
        let mut path = String::from_utf8_lossy(&bytes).into_owned();
        let bytes = path.as_bytes();
        if bytes.get(0) == Some(&b'/') && bytes.get(2) == Some(&b':') {
            path.remove(0);
        }
        PathBuf::from(path.replace('/', "\\"))
    }

    #[cfg(not(any(unix, windows)))]
    {
        PathBuf::from(String::from_utf8_lossy(&bytes).into_owned())
    }
}

unsafe fn throw_napi_error(env: napi_env, msg: &str) {
    let msg = sanitize_cstring(msg);
    let _ = unsafe { napi_sys::napi_throw_error(env, ptr::null(), msg.as_ptr()) };
}

fn sanitize_cstring(value: &str) -> CString {
    let mut bytes = value.as_bytes().to_vec();
    for byte in &mut bytes {
        if *byte == 0 {
            *byte = b' ';
        }
    }
    CString::new(bytes)
        .unwrap_or_else(|_| CString::new("SWC native binding loader failed").unwrap())
}

fn env_flag(name: &str) -> bool {
    env::var_os(name).as_deref() == Some(std::ffi::OsStr::new("1"))
}

fn debug_log(args: std::fmt::Arguments<'_>) {
    if env_flag("SWC_NATIVE_BINDING_DEBUG") {
        eprintln!("[swc-native-binding] {args}");
    }
}

#[cfg(target_env = "msvc")]
fn setup_napi() {
    static NAPI_HOST: std::sync::OnceLock<Library> = std::sync::OnceLock::new();
    let _ = NAPI_HOST.get_or_init(|| unsafe { napi_sys::setup() });
}

#[cfg(not(target_env = "msvc"))]
fn setup_napi() {}

#[cfg(test)]
mod tests {
    use super::*;

    fn valid_pressed_data_header() -> Vec<u8> {
        let compressed_len = 4u64;
        let uncompressed_len = 8u64;
        let mut data = Vec::new();
        data.extend_from_slice(MAGIC_MARKER);
        data.extend_from_slice(&compressed_len.to_le_bytes());
        data.extend_from_slice(&uncompressed_len.to_le_bytes());
        data.extend_from_slice(&[0x42; CACHE_KEY_LEN]);
        data.extend_from_slice(&[0; PLATFORM_METADATA_LEN]);
        data.extend_from_slice(&[0x7f; INTEGRITY_HASH_LEN]);
        data.push(0);
        data.extend_from_slice(&[1, 2, 3, 4]);
        data
    }

    #[test]
    fn parses_pressed_data_metadata() {
        let metadata = parse_pressed_data_metadata(&valid_pressed_data_header()).unwrap();

        assert_eq!(metadata.compressed_len, 4);
        assert_eq!(metadata.uncompressed_len, 8);
        assert_eq!(metadata.compressed_sha512, [0x7f; INTEGRITY_HASH_LEN]);
        assert!(metadata.raw_sha512.is_none());
    }

    #[test]
    fn parses_raw_sha512_extension() {
        let mut data = valid_pressed_data_header();
        data.extend_from_slice(&[0x80; INTEGRITY_HASH_LEN]);
        let metadata = parse_pressed_data_metadata(&data).unwrap();

        assert_eq!(metadata.raw_sha512, Some([0x80; INTEGRITY_HASH_LEN]));
    }

    #[test]
    fn rejects_short_pressed_data() {
        assert!(parse_pressed_data_metadata(&valid_pressed_data_header()[..16]).is_none());
    }

    #[test]
    fn rejects_wrong_magic() {
        let mut data = valid_pressed_data_header();
        data[0] = b'x';

        assert!(parse_pressed_data_metadata(&data).is_none());
    }

    #[test]
    fn rejects_oversized_payload_claim() {
        let mut data = valid_pressed_data_header();
        let at = MAGIC_MARKER.len() + 8;
        data[at..at + 8].copy_from_slice(&(MAX_DECOMPRESSED + 1).to_le_bytes());

        assert!(parse_pressed_data_metadata(&data).is_none());
    }

    #[test]
    fn derives_cache_path_from_module_name_and_hash() {
        let metadata = parse_pressed_data_metadata(&valid_pressed_data_header()).unwrap();
        let path = cache_path_for(
            Path::new("/tmp/swc-cache"),
            Path::new("/project/node_modules/@swc/core/swc.darwin-arm64.node"),
            &metadata,
        );

        assert_eq!(path.parent().unwrap(), Path::new("/tmp/swc-cache/v1"));
        assert!(path
            .file_name()
            .unwrap()
            .to_string_lossy()
            .starts_with("swc.darwin-arm64-7f7f7f"));
    }

    #[test]
    fn self_replace_only_accepts_os_compressed_outcomes() {
        assert!(is_os_compressed_outcome(&Outcome::Compressed {
            before: 128,
            after: 64
        }));
        assert!(is_os_compressed_outcome(&Outcome::NoGain {
            before: 128,
            after: 128
        }));
        assert!(!is_os_compressed_outcome(&Outcome::Unsupported {
            reason: decmpfs::UnsupportedReason::Filesystem,
        }));
    }

    #[test]
    fn verifies_cached_raw_addon_hash() {
        let dir = env::temp_dir().join(format!(
            "swc-native-binding-cache-test-{}-{}",
            std::process::id(),
            std::time::SystemTime::now()
                .duration_since(std::time::UNIX_EPOCH)
                .unwrap()
                .as_nanos()
        ));
        fs::create_dir_all(&dir).unwrap();
        let path = dir.join("addon.node");
        let raw = b"verified raw addon bytes";
        fs::write(&path, raw).unwrap();

        let mut sha512 = [0u8; INTEGRITY_HASH_LEN];
        sha512.copy_from_slice(&Sha512::digest(raw));
        let metadata = PressedDataMetadata {
            compressed_len: 1,
            uncompressed_len: raw.len() as u64,
            compressed_sha512: [0u8; INTEGRITY_HASH_LEN],
            raw_sha512: Some(sha512),
        };

        assert!(verify_cached_raw_addon(&path, &metadata).unwrap());

        let tampered = b"tampered raw addon bytes";
        assert_eq!(tampered.len(), raw.len());
        fs::write(&path, tampered).unwrap();
        assert!(!verify_cached_raw_addon(&path, &metadata).unwrap());

        fs::remove_dir_all(dir).unwrap();
    }

    #[test]
    fn rejects_cache_when_raw_hash_is_absent() {
        let raw = b"verified raw addon bytes";
        let metadata = PressedDataMetadata {
            compressed_len: 1,
            uncompressed_len: raw.len() as u64,
            compressed_sha512: [0u8; INTEGRITY_HASH_LEN],
            raw_sha512: None,
        };

        assert!(!verify_cached_raw_addon(Path::new("/missing/addon.node"), &metadata).unwrap());
    }

    #[cfg(unix)]
    #[test]
    fn decodes_file_url_module_file_name() {
        assert_eq!(
            module_path_from_node_file_name("file:///tmp/swc%20core/swc.darwin-arm64.node"),
            PathBuf::from("/tmp/swc core/swc.darwin-arm64.node")
        );
    }

    #[test]
    fn preserves_plain_module_file_name() {
        assert_eq!(
            module_path_from_node_file_name("/tmp/swc/swc.darwin-arm64.node"),
            PathBuf::from("/tmp/swc/swc.darwin-arm64.node")
        );
    }
}
