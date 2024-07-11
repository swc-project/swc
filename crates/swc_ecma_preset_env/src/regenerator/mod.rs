use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

pub(super) fn is_required<T: VisitWith<RegeneratorVisitor>>(node: &T) -> bool {
    let mut v = RegeneratorVisitor { found: false };
    node.visit_with(&mut v);
    v.found
}

pub(super) struct RegeneratorVisitor {
    found: bool,
}

/// TODO
impl Visit for RegeneratorVisitor {
    standard_only_visit!();
}
