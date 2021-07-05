use std::{ffi::CString, os::raw::c_char};

/// `(ast_json, options_json) -> transformed_ast_json`
pub type LibFn = unsafe extern "C" fn(*const c_char, *const c_char) -> CString;

#[macro_export]
macro_rules! export_transform {
    ($name:path) => {};
}
