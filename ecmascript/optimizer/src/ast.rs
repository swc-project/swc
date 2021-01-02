use swc_ecma_ast::*;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

/// Make every statements `identifiable` by marking all spans.
///
/// This requires [swc_common::GLOBALS] to be set.
pub(crate) fn prepare(m: &mut Module) {
    m.visit_mut_with(&mut Preparer)
}

struct Preparer;

impl VisitMut for Preparer {
    noop_visit_mut_type!();

    /// Noop. This is performance optimization.
    fn visit_mut_lit(&mut self, _: &mut Lit) {}
}
