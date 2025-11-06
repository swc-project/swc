use swc_atoms::atom;
use swc_common::{Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{CompositeHook, VisitMutHook, VisitMutWith, VisitMutWithHook};

#[derive(Debug, Default)]
struct Hook {
    name: String,
    depth: usize,
    count: usize,
}

impl VisitMutHook for Hook {
    fn enter_span(&mut self, _span: &mut Span) {
        println!(
            "enter_span: name={}, depth={}, count={}",
            self.name, self.depth, self.count
        );
        self.depth += 1;
        self.count += 1;
    }

    fn exit_span(&mut self, _span: &mut Span) {
        self.depth -= 1;
        println!(
            "exit_span: name={}, depth={}, count={}",
            self.name, self.depth, self.count
        );
    }
}

#[test]
fn compose_visit() {
    let hook1 = Hook {
        name: "hook1".to_string(),
        ..Default::default()
    };
    let hook2 = Hook {
        name: "hook2".to_string(),
        ..Default::default()
    };

    let hook = CompositeHook {
        first: hook1,
        second: hook2,
    };

    let mut node = Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: Callee::Expr(
            AwaitExpr {
                span: DUMMY_SP,
                arg: Ident::new_no_ctxt(atom!("foo"), DUMMY_SP).into(),
            }
            .into(),
        ),
        ..Default::default()
    });

    let mut visitor = VisitMutWithHook { hook };

    node.visit_mut_with(&mut visitor);

    assert_eq!(visitor.hook.first.depth, 0);
    assert_eq!(visitor.hook.first.count, 3);
    assert_eq!(visitor.hook.second.depth, 0);
    assert_eq!(visitor.hook.second.count, 3);
}
