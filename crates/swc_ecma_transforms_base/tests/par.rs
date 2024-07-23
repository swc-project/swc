use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_transforms_macros::parallel;
use swc_ecma_visit::{Fold, VisitMut};

#[derive(Default, Clone, Copy)]
struct ExampleVisitMut;

impl Parallel for ExampleVisitMut {
    fn merge(&mut self, _: Self) {}

    fn create(&self) -> Self {
        Self
    }
}

#[parallel]
impl VisitMut for ExampleVisitMut {}

#[derive(Default, Clone, Copy)]
struct ExampleFold;

impl Parallel for ExampleFold {
    fn merge(&mut self, _: Self) {}

    fn create(&self) -> Self {
        Self
    }
}

#[parallel]
impl Fold for ExampleFold {}

#[test]
fn test() {
    let _ = ExampleFold;
    let _ = ExampleVisitMut;
}
