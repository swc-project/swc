use swc_ecma_visit::{as_folder, Fold, VisitMut};

pub fn decorator_2022_03() -> impl VisitMut + Fold {
    as_folder(Decorator202203 {})
}

struct Decorator202203 {}

impl VisitMut for Decorator202203 {}
