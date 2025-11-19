use swc_ecma_ast::*;
use swc_ecma_visit::VisitMutWith;

pub struct TraverseCtx {}

pub struct Transformer {}

impl Pass for Transformer {
    fn process(&mut self, program: &mut Program) {
        let hook = {};
        let ctx = TraverseCtx {};

        let mut visitor = swc_ecma_hooks::VisitMutWithHook { hook, context: ctx };

        program.visit_mut_with(&mut visitor);
    }
}
