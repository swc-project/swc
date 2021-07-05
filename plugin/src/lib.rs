#![feature(cstring_from_vec_with_nul)]

pub extern crate swc_ecma_ast as ast;
pub extern crate swc_ecma_visit as visit;

use ast::Program;
use serde::de::DeserializeOwned;
use std::{
    ffi::{CStr, CString},
    os::raw::c_char,
};
use swc_ecma_visit::Fold;
use swc_ecma_visit::FoldWith;

/// `(ast_json, options_json) -> transformed_ast_json`
pub type LibFn = unsafe extern "C" fn(*const c_char, *const c_char) -> CString;

/// Export a `Fold`
#[macro_export]
macro_rules! export_transform {
    ($name:path) => {};
}

/// Not a public api.
///
///
/// Invoked
#[doc(hidden)]
pub fn invoke_transform_plugin<P, O, F>(
    ast_json: *const c_char,
    opts_json: *const c_char,
    plugin: P,
) -> CString
where
    P: FnOnce(O) -> F,
    F: Fold,
    O: DeserializeOwned,
{
    let ast_str = unsafe {
        CStr::from_ptr(ast_json)
            .to_str()
            .expect("swc passed invalid ast: failed to convert ast to &str")
    };
    let opts_str = unsafe {
        CStr::from_ptr(opts_json)
            .to_str()
            .expect("swc passed invalid options: failed to convert ast to &str")
    };

    let program: Program = serde_json::from_str(&ast_str)
        .expect("faild pass invalid ast: failed to parse json as swc_ecma_ast::Program");

    let options: O = serde_json::from_str(&opts_str)
        .expect("faild pass invalid options: failed to parse json as option of the pass");

    let mut folder = plugin(options);

    let program = program.fold_with(&mut folder);

    let ast = serde_json::to_vec(&program).expect("failed to serialize output of plugin");

    let s = CString::from_vec_with_nul(ast)
        .expect("the ast generated from plugin should be convertable to CString");

    s
}
