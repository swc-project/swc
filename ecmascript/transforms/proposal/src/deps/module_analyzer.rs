use fxhash::FxHashMap;
use std::sync::Arc;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::Id;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitWith;

/// Helper struct to help implementing dependency analyzer.
#[derive(Debug)]
pub struct ModuleData {
    pub metadata_types: Arc<FxHashMap<Id, Box<Expr>>>,
}

pub fn analyze(module: &Module) -> ModuleData {
    let mut v = Analyzer::default();
    module.visit_with(&Invalid { span: DUMMY_SP }, &mut v);

    ModuleData {
        metadata_types: v.metadata_types.into(),
    }
}

#[derive(Debug, Default)]
struct Analyzer {
    metadata_types: FxHashMap<Id, Box<Expr>>,
}

impl Visit for Analyzer {}
