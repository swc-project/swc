use swc_common::DUMMY_SP;
use swc_ecma_ast::Invalid;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

pub(super) fn is_required<T: VisitWith<RegeneratorVisitor>>(node: &T) -> bool {
    let mut v = RegeneratorVisitor { found: false };
    node.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);
    v.found
}

pub(super) struct RegeneratorVisitor {
    found: bool,
}

/// TODO
impl Visit for RegeneratorVisitor {
    noop_visit_type!();
}
