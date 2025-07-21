use swc_ecma_ast::Pass;

#[derive(Debug)]
pub struct Compiler {}

impl Pass for Compiler {
    fn process(&mut self, _program: &mut swc_ecma_ast::Program) {}
}
