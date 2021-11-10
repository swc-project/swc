pub use self::logical_assignments::logical_assignments;
use swc_ecma_visit::{Fold, VisitMut};

mod logical_assignments;

pub fn es2021() -> impl Fold + VisitMut {
    logical_assignments()
}
