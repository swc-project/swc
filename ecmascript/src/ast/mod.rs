pub use self::class::*;
pub use self::decl::*;
pub use self::expr::*;
pub use self::function::*;
pub use self::lit::*;
pub use self::module::*;
pub use self::module_decl::*;
pub use self::pat::*;
pub use self::prop::*;
pub use self::stmt::*;
use std::fmt::{self, Debug, Display, Formatter};
use swc_atoms::JsWord;
use swc_common::{Span, Spanned};
use swc_macros::{AstNode, Deserialize, EqIgnoreSpan, Serialize};

mod class;
mod decl;
mod expr;
mod function;
mod lit;
mod module;
mod module_decl;
mod pat;
mod prop;
mod stmt;

/// Ident with span.
#[derive(AstNode, EqIgnoreSpan, Serialize, Deserialize, Clone, PartialEq)]
pub struct Ident {
    pub span: Span,
    #[fold(ignore)]
    pub sym: JsWord,
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

impl Spanned for Ident {
    type Item = JsWord;
    fn from_unspanned(sym: JsWord, span: Span) -> Self {
        Ident { span, sym }
    }
}
