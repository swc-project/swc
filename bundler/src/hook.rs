use anyhow::Error;
use swc_common::{FileName, Span};
use swc_ecma_ast::Expr;

/// Note: As this is rarely used, it's recommended to pass it as a trait object.
pub trait Hook: swc_common::sync::Sync + swc_common::sync::Send {
    fn get_import_meta_url(&self, span: Span, file: &FileName) -> Result<Expr, Error>;
}
