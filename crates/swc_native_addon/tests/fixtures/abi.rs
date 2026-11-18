//! A real stripped native image with an observable registration ABI. Its result
//! deliberately differs from exports; do not pass synthetic pointers to Node.
use std::{ffi::c_void, sync::atomic::{AtomicUsize, Ordering}};

static ENV: AtomicUsize = AtomicUsize::new(0);
static EXPORTS: AtomicUsize = AtomicUsize::new(0);

#[no_mangle]
pub extern "C" fn napi_register_module_v1(env: *mut c_void, exports: *mut c_void) -> *mut c_void {
    ENV.store(env as usize, Ordering::SeqCst);
    EXPORTS.store(exports as usize, Ordering::SeqCst);
    0x3456_usize as *mut c_void
}

#[no_mangle]
pub extern "C" fn observed_env() -> usize { ENV.load(Ordering::SeqCst) }
#[no_mangle]
pub extern "C" fn observed_exports() -> usize { EXPORTS.load(Ordering::SeqCst) }
