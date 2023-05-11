use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut};

pub fn explicit_resource_management() -> impl Fold + VisitMut {
    as_folder(ExplicitResourceManagement)
}

struct ExplicitResourceManagement;

impl VisitMut for ExplicitResourceManagement {
    noop_visit_mut_type!();
}
