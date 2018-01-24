#![feature(box_syntax)]
#![feature(box_patterns)]
#![feature(specialization)]
#![feature(never_type)]
#![feature(proc_macro)]
#![deny(unreachable_patterns)]

extern crate swc_atoms;
extern crate swc_common;
#[macro_use]
extern crate swc_macros;

pub use self::class::*;
pub use self::decl::*;
pub use self::expr::*;
pub use self::function::*;
pub use self::lit::*;
pub use self::module::*;
pub use self::module_decl::*;
pub use self::operators::*;
pub use self::pat::*;
pub use self::prop::*;
pub use self::stmt::*;
use std::fmt::{self, Debug, Display, Formatter};
use std::io::{self, Write};
use swc_atoms::JsWord;
use swc_common::{Span, Spanned};
use swc_common::ToCode;
use swc_macros::AstNode;

mod macros;
mod class;
mod decl;
mod expr;
mod function;
mod lit;
mod module_decl;
mod module;
mod operators;
mod pat;
mod prop;
mod stmt;

/// Ident with span.
#[derive(AstNode, Fold, Clone, PartialEq)]
pub struct Ident {
    pub span: Span,
    #[fold(ignore)]
    pub sym: JsWord,
}

impl ToCode for Ident {
    fn to_code<W: io::Write>(&self, mut w: W) -> io::Result<()> {
        w.write(&self.sym[..].as_bytes())?;
        Ok(())
    }
}

impl Debug for Ident {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        f.debug_tuple("Ident")
            .field(&DebugUsingDisplay(&self.sym))
            .field(&self.span)
            .finish()
    }
}

struct DebugUsingDisplay<T: Display>(T);
impl<T: Display> Debug for DebugUsingDisplay<T> {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        Display::fmt(&self.0, f)
    }
}

impl Spanned<JsWord> for Ident {
    fn from_unspanned(sym: JsWord, span: Span) -> Self {
        Ident { span, sym }
    }
}
