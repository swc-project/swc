use swc_common::{chain, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{NodeRef, Visit, VisitWith};

#[test]
fn should_visit_program() {
    struct Pass1<'a>(&'a mut usize);
    struct Pass2;

    impl<'a> Visit for Pass1<'a> {
        fn visit_program(&mut self, _program: &Program) {
            *self.0 += 1;
        }
    }

    impl Visit for Pass2 {}

    let n = Program::Module(Module {
        span: DUMMY_SP,
        body: Vec::new(),
        shebang: None,
    });

    let mut counter = 0;
    let p1 = Pass1(&mut counter);
    let p2 = Pass2;
    let mut pass = chain!(p1, p2);
    n.visit_with(&mut pass);

    assert_eq!(counter, 1);
}

#[test]
fn traverse_lookup() {
    let node = Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: Callee::Expr(
            AwaitExpr {
                span: DUMMY_SP,
                arg: Ident::new_no_ctxt("foo".into(), DUMMY_SP).into(),
            }
            .into(),
        ),
        args: Vec::new(),
        ..Default::default()
    });

    let node_ref = NodeRef::from(&node);
    let iter = node_ref.experimental_traverse();

    let mut has_await = false;

    for node in iter {
        has_await |= matches!(node, NodeRef::AwaitExpr(..));
    }

    assert!(has_await);
}
