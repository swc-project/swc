//! Only original N-API functions are used here. No generated napi-rs module
//! initialization or newer path-discovery API is linked into the carrier.

use std::ffi::{c_char, c_void, CString};

use swc_native_addon::{Error, ErrorKind, Result};

pub type Env = *mut c_void;
pub type Value = *mut c_void;
pub type Register = unsafe extern "C" fn(Env, Value) -> Value;
type ThrowError = unsafe extern "C" fn(Env, *const c_char, *const c_char) -> i32;
type FatalError = unsafe extern "C" fn(*const c_char, usize, *const c_char, usize);

pub struct Api {
    throw_error: ThrowError,
    fatal_error: FatalError,
}

impl Api {
    pub unsafe fn load() -> Result<Self> {
        #[cfg(unix)]
        let process = libloading::os::unix::Library::this();
        #[cfg(windows)]
        let process = libloading::os::windows::Library::this()
            .map_err(|e| Error::new(ErrorKind::Load, format!("open Node process symbols: {e}")))?;
        let throw_error = *process
            .get::<ThrowError>(b"napi_throw_error\0")
            .map_err(|e| {
                Error::new(
                    ErrorKind::Load,
                    format!("Node must expose napi_throw_error: {e}"),
                )
            })?;
        let fatal_error = *process
            .get::<FatalError>(b"napi_fatal_error\0")
            .map_err(|e| {
                Error::new(
                    ErrorKind::Load,
                    format!("Node must expose napi_fatal_error: {e}"),
                )
            })?;
        Ok(Self {
            throw_error,
            fatal_error,
        })
    }

    pub unsafe fn throw(&self, env: Env, error: &Error) -> Value {
        let code = CString::new(error.kind.code()).unwrap();
        let message = format!(
            "SWC native addon: {error}. Reinstall the native package if its payload is damaged; \
             check SWC_NATIVE_BINDING_CACHE and directory permissions for materialization \
             failures."
        );
        let message = CString::new(message.replace('\0', "?")).unwrap();
        if (self.throw_error)(env, code.as_ptr(), message.as_ptr()) != 0 {
            // A functioning Node host always provides the original throw API.
            // If it cannot create an exception, returning exports would falsely
            // report success. N-API's original fatal API is the last resort.
            let location = b"swc native loader";
            (self.fatal_error)(
                location.as_ptr().cast(),
                location.len(),
                message.as_ptr(),
                message.as_bytes().len(),
            );
        }
        std::ptr::null_mut()
    }
}
