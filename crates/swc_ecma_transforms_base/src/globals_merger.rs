use std::sync::Arc;

use rustc_hash::FxHashMap;
use swc_common::{Globals, SyntaxContext};
use swc_ecma_ast::Module;

pub fn merge_globals(globals: Vec<Arc<Globals>>, modules: &[Module]) -> MergeResult {}

#[derive(Debug)]
pub struct MergeResult {
    pub ctxts: FxHashMap<SyntaxContext, SyntaxContext>,
}
