//! Minimal dependency-free N-API 1 fixture. Resolve host functions at runtime so
//! the same source builds with Rust 1.73 on Unix and Windows without node.lib.
use std::ffi::{c_char, c_void};
type Value = *mut c_void;
type Env = *mut c_void;
type Callback = unsafe extern "C" fn(Env, *mut c_void) -> Value;

unsafe fn symbol(name: &[u8]) -> *mut c_void {
    #[cfg(unix)]
    {
        #[cfg_attr(target_os = "linux", link(name = "dl"))]
        extern "C" { fn dlsym(handle: *mut c_void, symbol: *const c_char) -> *mut c_void; }
        #[cfg(target_os = "macos")]
        let handle = -2_isize as *mut c_void;
        #[cfg(not(target_os = "macos"))]
        let handle = std::ptr::null_mut();
        dlsym(handle, name.as_ptr().cast())
    }
    #[cfg(windows)]
    {
        #[link(name = "kernel32")]
        extern "system" {
            fn GetModuleHandleW(name: *const u16) -> *mut c_void;
            fn GetProcAddress(module: *mut c_void, name: *const c_char) -> *mut c_void;
        }
        GetProcAddress(GetModuleHandleW(std::ptr::null()), name.as_ptr().cast())
    }
}

unsafe extern "C" fn answer(env: Env, _: *mut c_void) -> Value {
    let create: unsafe extern "C" fn(Env, i32, *mut Value) -> i32 = std::mem::transmute(symbol(b"napi_create_int32\0"));
    let mut result = std::ptr::null_mut();
    assert_eq!(create(env, 42, &mut result), 0);
    result
}

#[no_mangle]
pub unsafe extern "C" fn napi_register_module_v1(env: Env, exports: Value) -> Value {
    if std::env::var_os("SWC_TEST_RAW_THROW").is_some() {
        let throw: unsafe extern "C" fn(Env, *const c_char, *const c_char) -> i32 = std::mem::transmute(symbol(b"napi_throw_error\0"));
        throw(env, b"RAW_FIXTURE\0".as_ptr().cast(), b"raw registration failed\0".as_ptr().cast());
        return std::ptr::null_mut();
    }
    let object: unsafe extern "C" fn(Env, *mut Value) -> i32 = std::mem::transmute(symbol(b"napi_create_object\0"));
    let set: unsafe extern "C" fn(Env, Value, *const c_char, Value) -> i32 = std::mem::transmute(symbol(b"napi_set_named_property\0"));
    let function: unsafe extern "C" fn(Env, *const c_char, usize, Callback, *mut c_void, *mut Value) -> i32 = std::mem::transmute(symbol(b"napi_create_function\0"));
    let mut result = std::ptr::null_mut();
    let mut callback = std::ptr::null_mut();
    assert_eq!(object(env, &mut result), 0);
    assert_eq!(function(env, b"answer\0".as_ptr().cast(), 6, answer, std::ptr::null_mut(), &mut callback), 0);
    assert_eq!(set(env, result, b"answer\0".as_ptr().cast(), callback), 0);
    assert_eq!(set(env, result, b"initial\0".as_ptr().cast(), exports), 0);
    result
}
