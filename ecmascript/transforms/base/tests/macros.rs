use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_transforms_macros::parallel;
use swc_ecma_visit::VisitMut;

#[derive(Default, Clone, Copy)]
struct Example;

impl Parallel for Example {
    fn merge(&mut self, _: Self) {}

    fn create(&self) -> Self {
        Self
    }
}

#[parallel]
impl VisitMut for Example {}
