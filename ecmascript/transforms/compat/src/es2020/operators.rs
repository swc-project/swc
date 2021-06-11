use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut};

pub fn operators() -> impl Fold {
    as_folder(Operators)
}

struct Operators;

impl VisitMut for Operators {
    noop_visit_mut_type!();
}
