use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;

pub(super) fn property_hoister() -> Hoister {
    Hoister {}
}

pub(super) struct Hoister {}

impl VisitMut for Hoister {
    noop_visit_mut_type!();
}
