use anyhow::Error;
use swc_common::FileName;
use swc_ecma_ast::Expr;

pub trait Hook: swc_common::sync::Sync + swc_common::sync::Send {
    fn get_import_meta_url(&self, file: &FileName) -> Result<Expr, Error>;
}
