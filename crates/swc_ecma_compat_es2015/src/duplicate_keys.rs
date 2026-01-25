use rustc_hash::FxHashSet;
use swc_atoms::{Atom, Wtf8Atom};
use swc_common::Spanned;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_utils::quote_str;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

pub fn duplicate_keys() -> impl Pass {
    let mut options = swc_ecma_transformer::Options::default();
    options.env.es2015.duplicate_keys = true;
    options.into_pass()
}
