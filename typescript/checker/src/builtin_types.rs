use crate::ty::TypeRef;
use lazy_static::lazy_static;
use std::borrow::Cow;
use swc_atoms::JsWord;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ts_checker_macros::builtin;

builtin!(ES5, "./lib/es5.d.ts");
builtin!(ES2015, "./lib/es2015.d.ts");

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum Lib {
    Dom,
    Es5,
    Es2015Promise,
}

pub fn get(libs: &[Lib], sym: &JsWord) -> Option<TypeRef<'static>> {
    Some(Cow::Borrowed(match *sym {
        _ => return None,
    }))
}
