use std::process::abort;

pub mod ecmascript {
    pub extern crate swc_ecma_ast as ast;
    pub extern crate swc_ecma_utils as utils;
    pub extern crate swc_ecma_visit as visit;
}

#[doc(hidden)]
pub mod rt;

#[cold]
#[inline(never)]
pub fn throw_str(s: &str) -> ! {
    eprintln!("{}", s);
    abort()
}
