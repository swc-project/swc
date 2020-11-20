use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn jsx() -> impl Fold {
    as_folder(Jsx {})
}

/// See: https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
struct Jsx {}

impl VisitMut for Jsx {
    noop_visit_mut_type!();
}
