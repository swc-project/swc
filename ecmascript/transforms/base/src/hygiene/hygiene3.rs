//! Third one

use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut};

pub fn hygiene3() -> impl Fold + VisitMut {
    as_folder(Renaming)
}

struct Renaming;

impl VisitMut for Renaming {
    noop_visit_mut_type!();
}
