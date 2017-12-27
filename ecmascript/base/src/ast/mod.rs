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
use swc_atoms;
use swc_common::Span;
use swc_macros::ast_node;

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
#[ast_node]
pub struct Ident {
    pub span: Span,
    #[fold(ignore)]
    pub sym: swc_atoms::JsIdent,
}
