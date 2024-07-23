use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::{ParExplode, Parallel};
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

impl ParExplode for ExampleVisitMut {
    fn after_one_stmt(&mut self, _: &mut Vec<Stmt>) {}

    fn after_one_module_item(&mut self, _: &mut Vec<ModuleItem>) {}
}

#[parallel(explode)]
impl VisitMut for ExampleVisitMut {}

#[derive(Default, Clone, Copy)]
struct ExampleFold;

impl Parallel for ExampleFold {
    fn merge(&mut self, _: Self) {}

    fn create(&self) -> Self {
        Self
    }
}

impl ParExplode for ExampleFold {
    fn after_one_stmt(&mut self, _: &mut Vec<swc_ecma_ast::Stmt>) {}

    fn after_one_module_item(&mut self, _: &mut Vec<ModuleItem>) {}
}

#[parallel(explode)]
impl Fold for ExampleFold {}

#[test]
fn test_1() {
    let _ = ExampleFold;

    let _ = ExampleVisitMut;
}
