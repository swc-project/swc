pub use self::import_assertions::import_assertions;
use swc_ecma_visit::{Fold, VisitMut};

pub mod import_assertions;

pub fn experimental() -> impl Fold + VisitMut {
    import_assertions()
}
