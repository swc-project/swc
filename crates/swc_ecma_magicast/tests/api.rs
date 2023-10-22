use swc_common::Span;
use swc_ecma_ast::Module;
use swc_ecma_magicast::ProgramNode;

#[test]
fn test1() {
    let root = ProgramNode::new(swc_ecma_ast::Program::Module(Module {
        span: Span::default(),
        body: Vec::new(),
        shebang: None,
    }));

    root.as_module().exports().default().ensure();

    root.as_module().imports().named("foo");

    root.as_module().imports().from("foo").ensure();
}
