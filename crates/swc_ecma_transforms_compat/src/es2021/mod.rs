use swc_ecma_visit::{Fold, VisitMut};

pub use self::logical_assignments::logical_assignments;

mod logical_assignments;

#[tracing::instrument(level = "trace", skip_all)]
pub fn es2021() -> impl Fold + VisitMut {
    logical_assignments()
}
