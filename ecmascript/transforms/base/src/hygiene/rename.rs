use super::usage_analyzer::Data;
use swc_atoms::JsWord;
use swc_common::collections::AHashMap;
use swc_ecma_utils::Id;
use swc_ecma_visit::{noop_visit_type, Visit};

#[derive(Debug, Default)]
pub struct RenameOps {
    pub rename: AHashMap<Id, JsWord>,
}

pub struct RenameAnalyzer<'a> {
    pub data: &'a Data,
    pub ops: RenameOps,
}

impl Visit for RenameAnalyzer<'_> {
    noop_visit_type!();
}
