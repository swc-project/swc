//! Node 10.0 predates lookup of napi_register_module_v1 by symbol. Its original
//! napi_module_register entry point is required even though all APIs used by
//! the initializer itself exist there. New Node versions also accept this hook.
//!
//! Constructors only register metadata. Decompression, IO, and native loading
//! stay in the initializer, outside the Windows loader lock.
//! See ../NOTICE for the Node.js MIT attribution of this public ABI adaptation.

use std::{
    ffi::{c_char, c_void},
    ptr,
};

use crate::napi::Register;

#[repr(C)]
struct Module {
    version: i32,
    flags: u32,
    filename: *const c_char,
    register: Register,
    name: *const c_char,
    private: *mut c_void,
    reserved: [*mut c_void; 4],
}

static mut MODULE: Module = Module {
    version: 1,
    flags: 0,
    filename: b"swc-native-carrier\0".as_ptr().cast(),
    register: crate::napi_register_module_v1,
    name: b"swc_native_carrier\0".as_ptr().cast(),
    private: ptr::null_mut(),
    reserved: [ptr::null_mut(); 4],
};

unsafe extern "C" fn register() {
    #[cfg(unix)]
    let process = libloading::os::unix::Library::this();
    #[cfg(windows)]
    let process = match libloading::os::windows::Library::this() {
        Ok(process) => process,
        Err(_) => return,
    };
    // Test executables are not Node hosts. They can link the rlib without
    // registering anything; Node always exports this original N-API function.
    if let Ok(register) =
        process.get::<unsafe extern "C" fn(*mut Module)>(b"napi_module_register\0")
    {
        register(ptr::addr_of_mut!(MODULE));
    }
}

#[used]
#[cfg_attr(target_os = "linux", link_section = ".init_array")]
#[cfg_attr(target_os = "macos", link_section = "__DATA,__mod_init_func")]
#[cfg_attr(windows, link_section = ".CRT$XCU")]
static INITIALIZER: unsafe extern "C" fn() = register;
