//! Self-loading target carrier. All native image bytes are verified before the
//! OS loader sees them; N-API registration is forwarded without wrapping
//! exports.

mod legacy;
mod napi;

use std::sync::Mutex;

use libloading::Library;
use swc_native_addon::{
    cache::{self, CacheMode, Materialized},
    format::Payload,
    platform, replacement, Error, ErrorKind, Result,
};

include!(concat!(env!("OUT_DIR"), "/payload.rs"));

struct Loaded {
    register: napi::Register,
    _library: Library,
    _materialized: Materialized,
}

// Statics are deliberately never dropped. Addon callbacks can survive the
// original registration call and other Node environments in the same process.
// A Windows temporary's deletion handle is closed by process teardown.
static LOADED: Mutex<Option<Loaded>> = Mutex::new(None);
static IMAGE_ANCHOR: u8 = 0;

fn replacement_carrier(
    mode: &CacheMode,
    resolve: impl FnOnce() -> Result<std::path::PathBuf>,
) -> Option<std::path::PathBuf> {
    if *mode == CacheMode::Temporary {
        return None;
    }
    match resolve() {
        Ok(path) => Some(path),
        Err(error) => {
            tracing::debug!(%error, "native carrier path unavailable; using cache");
            None
        }
    }
}

fn initialize() -> Result<napi::Register> {
    let mut loaded = LOADED.lock().map_err(|_| {
        Error::new(
            ErrorKind::Load,
            "native loader initialization lock was poisoned",
        )
    })?;
    if let Some(loaded) = loaded.as_ref() {
        return Ok(loaded.register);
    }
    let payload = Payload::parse(PAYLOAD)?;
    let mode = CacheMode::from_env()?;
    let replacement = if let Some(carrier) = replacement_carrier(&mode, || unsafe {
        platform::carrier_path((&IMAGE_ANCHOR as *const u8).cast())
    }) {
        // Compression and replacement are optional. Integrity is rechecked in
        // the cache path; no fallback ever loads an unverified original buffer.
        match replacement::try_replace(&payload, &carrier) {
            Ok(replacement) => replacement,
            Err(error) => {
                tracing::debug!(path = %carrier.display(), %error, "native self-replacement unavailable; using cache");
                None
            }
        }
    } else {
        None
    };
    let mut materialized = match replacement {
        Some(file) => file,
        None => cache::materialize(&payload, &mode)?,
    };
    #[cfg(unix)]
    let library = unsafe {
        libloading::os::unix::Library::open(
            Some(materialized.path()),
            libloading::os::unix::RTLD_NOW | libloading::os::unix::RTLD_LOCAL,
        )
        .map(Library::from)
    };
    #[cfg(windows)]
    let library = unsafe { Library::new(materialized.path()) };
    let library = library.map_err(|e| {
        Error::new(
            ErrorKind::Load,
            format!("load verified addon {}: {e}", materialized.path().display()),
        )
    })?;
    let register = *unsafe { library.get::<napi::Register>(b"napi_register_module_v1\0") }
        .map_err(|e| {
            Error::new(
                ErrorKind::Load,
                format!("verified addon has no napi_register_module_v1: {e}"),
            )
        })?;
    if register as usize == napi_register_module_v1 as *const () as usize {
        return Err(Error::new(
            ErrorKind::Load,
            "raw addon registration resolved back to the carrier",
        ));
    }
    materialized.loaded()?;
    *loaded = Some(Loaded {
        register,
        _library: library,
        _materialized: materialized,
    });
    Ok(register)
}

/// The raw packages already target N-API 3, supported by their Node minimums.
#[no_mangle]
pub extern "C" fn node_api_module_get_api_version_v1() -> i32 {
    3
}

/// Forward each environment independently, including a raw initializer
/// returning a different exports value or null with a pending JavaScript
/// exception.
///
/// # Safety
/// Node must pass a live `napi_env` and its associated initial exports value.
#[no_mangle]
pub unsafe extern "C" fn napi_register_module_v1(
    env: napi::Env,
    exports: napi::Value,
) -> napi::Value {
    let api = match napi::Api::load() {
        Ok(api) => api,
        Err(error) => {
            // This can only occur outside the supported Node ABI: without even
            // napi_throw_error there is no legal way to create a JS exception.
            eprintln!("SWC native addon cannot initialize its N-API host: {error}");
            std::process::abort();
        }
    };
    let initialized = std::panic::catch_unwind(initialize);
    match initialized {
        Ok(Ok(register)) => register(env, exports),
        Ok(Err(error)) => api.throw(env, &error),
        Err(_) => api.throw(
            env,
            &Error::new(ErrorKind::Load, "native loader initialization panicked"),
        ),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn temporary_mode_skips_carrier_resolution() {
        assert!(replacement_carrier(&CacheMode::Temporary, || -> Result<_> {
            panic!("temporary mode must not resolve the carrier")
        })
        .is_none());
    }

    #[test]
    fn unavailable_carrier_disables_replacement() {
        assert!(replacement_carrier(&CacheMode::Default, || {
            Err(Error::new(ErrorKind::Load, "carrier is unavailable"))
        })
        .is_none());
    }
}
