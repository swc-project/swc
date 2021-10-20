use super::{
    ops::Operator,
    usage_analyzer::{Data, UsageAnalyzer},
};
use crate::hygiene::{unique_scope::unique_scope, usage_analyzer::CurScope};
use swc_common::{chain, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith, VisitWith};

pub fn hygiene3() -> impl Fold + VisitMut {}
