#![feature(box_syntax)]
#![feature(box_patterns)]
#![feature(const_fn)]
#![feature(specialization)]
#![feature(never_type)]
// #![feature(nll)]
#![feature(try_from)]
#![feature(try_trait)]
#![deny(unreachable_patterns)]
#![deny(unsafe_code)]

extern crate either;
extern crate parser_macros;
#[macro_use]
extern crate slog;
#[macro_use(js_word)]
extern crate swc_atoms;
extern crate swc_common;
extern crate swc_ecma_ast as ast;
#[macro_use]
extern crate swc_macros;
#[cfg(test)]
#[macro_use]
extern crate testing;
extern crate unicode_xid;
pub use self::{
    lexer::input::{Input, SourceFileInput},
    parser::*,
};
use slog::Logger;
use swc_common::errors::Handler;

#[macro_use]
mod macros;
mod error;
mod lexer;
mod parser;
mod token;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct Config {
    /// Support numeric separator.
    pub num_sep: bool,

    /// Support function bind expression.
    pub fn_bind: bool,
}

/// Syntatic context.
#[derive(Debug, Clone, Copy, Default)]
struct Context {
    /// Is in module code?
    module: bool,
    strict: bool,
    include_in_expr: bool,
    /// If true, await expression is parsed, and "await" is treated as a
    /// keyword.
    in_async: bool,
    /// If true, yield expression is parsed, and "yield" is treated as a
    /// keyword.
    in_generator: bool,

    in_function: bool,

    in_parameters: bool,
}

#[derive(Clone, Copy)]
pub struct Session<'a> {
    pub cfg: Config,
    pub logger: &'a Logger,
    pub handler: &'a Handler,
}

#[cfg(test)]
fn with_test_sess<F, Ret>(src: &'static str, f: F) -> Ret
where
    F: FnOnce(Session, SourceFileInput) -> Ret,
{
    use std::rc::Rc;
    use swc_common::{FileName, FilePathMapping, SourceMap};

    let cm = Rc::new(SourceMap::new(FilePathMapping::empty()));
    let fm = cm.new_source_file(FileName::Real("testing".into()), src.into());

    let handler = ::swc_common::errors::Handler::with_tty_emitter(
        ::swc_common::errors::ColorConfig::Auto,
        true,
        false,
        Some(cm),
    );

    let logger = ::testing::logger().new(o!("src" => src));

    f(
        Session {
            handler: &handler,
            logger: &logger,
            cfg: Default::default(),
        },
        (&*fm).into(),
    )
}
