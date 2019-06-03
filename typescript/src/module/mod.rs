use crate::errors::Error;
use swc_common::FoldWith;
use swc_ecma_ast::Module;

#[derive(Default)]
struct Analyzer {
    info: Info,
}

#[derive(Default)]
pub struct Info {
    pub imports: Vec<ImportInfo>,
    pub exports: Vec<ExportInfo>,
    pub errors: Vec<Error>,
}

pub struct ImportInfo {}

pub struct ExportInfo {}

/// Analyzes a module.
///
/// Constants are propagated, and
pub fn analyze_module(m: Module) -> (Module, Info) {
    let mut a = Analyzer::default();
    let m = m.fold_with(&mut a);

    (m, a.info)
}
