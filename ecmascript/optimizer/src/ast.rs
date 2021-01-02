use swc_common::Mark;
use swc_common::Span;
use swc_common::GLOBALS;
use swc_ecma_ast::*;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

/// Make every statements `identifiable` by marking all spans.
///
/// This requires [swc_common::GLOBALS] to be set and same instance of
/// [swc_common::Globals] should be used for [prepare] and [clean].
pub(crate) fn prepare(m: &mut Module) {
    debug_assert!(
        GLOBALS.is_set(),
        "swc_common::GLOBALS should be set before calling optimizer::ast::prepare"
    );

    m.visit_mut_with(&mut MarkModifier { remove_mode: false })
}

/// Make every statements `identifiable` by marking all spans.
///
/// This requires [swc_common::GLOBALS] to be set and same instance of
/// [swc_common::Globals] should be used for [prepare] and [clean].
pub(crate) fn clean_up(m: &mut Module) {
    debug_assert!(
        GLOBALS.is_set(),
        "swc_common::GLOBALS should be set before calling optimizer::ast::clean_up"
    );

    m.visit_mut_with(&mut MarkModifier { remove_mode: true })
}

/// This struct applies a mark to or remove the mark from all useful span nodes.
///
/// This is shared between marking process and removing process to ensure that
/// we only remove marks applied by this pass.
struct MarkModifier {
    remove_mode: bool,
}

impl VisitMut for MarkModifier {
    noop_visit_mut_type!();

    fn visit_mut_span(&mut self, span: &mut Span) {
        if self.remove_mode {
            let mark = span.remove_mark();
            debug_assert_eq!(
                mark.parent(),
                Mark::root(),
                "optimizer::ast::clean_up should be only called for prepared modules, which is \
                 created by calling optimizer::ast::prepare"
            );
        } else {
            let mark = Mark::fresh(Mark::root());
            *span = span.apply_mark(mark);
        }
    }

    /// Noop. This is required for correctness, as simply marking everything
    /// breaks span hygiene.
    fn visit_mut_ident(&mut self, _: &mut Ident) {}

    /// Noop. This is performance optimization.
    fn visit_mut_lit(&mut self, _: &mut Lit) {}
}
