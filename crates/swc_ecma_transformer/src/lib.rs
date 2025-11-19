use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_visit::{visit_mut_pass, VisitMut, VisitMutWith};

pub struct TraverseCtx {}

pub fn transform_pass<H: VisitMutHook<TraverseCtx>>(hook: H) -> impl Pass {
    let ctx = TraverseCtx {};

    visit_mut_pass(Transformer { hook, context: ctx })
}

struct Transformer<H>
where
    H: VisitMutHook<TraverseCtx>,
{
    hook: H,
    context: TraverseCtx,
}

impl<H> VisitMut for Transformer<H>
where
    H: VisitMutHook<TraverseCtx>,
{
    fn visit_mut_program(&mut self, program: &mut Program) {
        self.hook.enter_program(program, &mut self.context);
        program.visit_mut_children_with(self);
        self.hook.exit_program(program, &mut self.context);
    }
}
