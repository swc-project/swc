//! Integration tests for swc_ecma_transformer

use swc_atoms::atom;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_hooks::{VisitMutHook, VisitMutWithHook};
use swc_ecma_transformer::{Transformer, TransformerBuilder, TraverseCtx};
use swc_ecma_visit::VisitMutWith;

/// Test that the transformer correctly calls hooks in order
#[test]
fn test_hook_execution_order() {
    use std::{cell::RefCell, rc::Rc};

    let log = Rc::new(RefCell::new(Vec::new()));

    #[derive(Clone)]
    struct LoggingHook {
        name: String,
        log: Rc<RefCell<Vec<String>>>,
    }

    impl VisitMutHook<TraverseCtx> for LoggingHook {
        fn enter_expr(&mut self, _expr: &mut Expr, _ctx: &mut TraverseCtx) {
            self.log.borrow_mut().push(format!("{}_enter", self.name));
        }

        fn exit_expr(&mut self, _expr: &mut Expr, _ctx: &mut TraverseCtx) {
            self.log.borrow_mut().push(format!("{}_exit", self.name));
        }
    }

    let ctx = TraverseCtx::default();
    let hook1 = LoggingHook {
        name: "hook1".to_string(),
        log: log.clone(),
    };
    let hook2 = LoggingHook {
        name: "hook2".to_string(),
        log: log.clone(),
    };

    let mut transformer = TransformerBuilder::new(ctx, hook1).with_hook(hook2).build();

    let mut expr = Expr::Lit(Lit::Null(Null { span: DUMMY_SP }));
    expr.visit_mut_with(&mut transformer);

    let events = log.borrow();
    assert_eq!(
        &*events,
        &["hook1_enter", "hook2_enter", "hook2_exit", "hook1_exit"]
    );
}

/// Test that transformations are actually applied
#[test]
fn test_actual_transformation() {
    struct IdentReplacer;

    impl VisitMutHook<TraverseCtx> for IdentReplacer {
        fn enter_ident(&mut self, ident: &mut Ident, _ctx: &mut TraverseCtx) {
            if &*ident.sym == "foo" {
                ident.sym = atom!("bar");
            }
        }
    }

    let ctx = TraverseCtx::default();
    let hook = IdentReplacer;
    let mut transformer = VisitMutWithHook { hook, context: ctx };

    let mut ident = Ident::new(atom!("foo"), DUMMY_SP, Default::default());
    ident.visit_mut_with(&mut transformer);

    assert_eq!(&*ident.sym, "bar");
}

/// Test that context utilities work correctly
#[test]
fn test_context_utilities() {
    struct UidGenerator {
        generated: Vec<String>,
    }

    impl VisitMutHook<TraverseCtx> for UidGenerator {
        fn enter_expr(&mut self, _expr: &mut Expr, ctx: &mut TraverseCtx) {
            let uid = ctx.generate_uid("temp");
            self.generated.push(uid.to_string());
        }
    }

    let ctx = TraverseCtx::default();
    let hook = UidGenerator {
        generated: Vec::new(),
    };
    let mut transformer = VisitMutWithHook { hook, context: ctx };

    // Create an expression tree with multiple nodes
    let mut expr = Expr::Bin(BinExpr {
        span: DUMMY_SP,
        op: BinaryOp::Add,
        left: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
        right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
    });

    expr.visit_mut_with(&mut transformer);

    let generated = &transformer.hook.generated;
    assert_eq!(generated.len(), 3); // Binary expr + 2 literals
    assert_eq!(generated[0], "_temp_0");
    assert_eq!(generated[1], "_temp_1");
    assert_eq!(generated[2], "_temp_2");
}

/// Test that multiple hooks can cooperate
#[test]
fn test_multiple_hooks_cooperation() {
    struct CounterHook {
        count: usize,
    }

    impl VisitMutHook<TraverseCtx> for CounterHook {
        fn enter_expr(&mut self, _expr: &mut Expr, _ctx: &mut TraverseCtx) {
            self.count += 1;
        }
    }

    struct ReplacerHook;

    impl VisitMutHook<TraverseCtx> for ReplacerHook {
        fn enter_ident(&mut self, ident: &mut Ident, _ctx: &mut TraverseCtx) {
            if &*ident.sym == "test" {
                ident.sym = atom!("replaced");
            }
        }
    }

    let ctx = TraverseCtx::default();
    let counter = CounterHook { count: 0 };
    let replacer = ReplacerHook;

    let mut transformer = TransformerBuilder::new(ctx, counter)
        .with_hook(replacer)
        .build();

    // Create an identifier expression
    let mut expr = Expr::Ident(Ident::new(atom!("test"), DUMMY_SP, Default::default()));
    expr.visit_mut_with(&mut transformer);

    // Counter should have counted the expression
    assert_eq!(transformer.hook.first.count, 1);

    // Replacer should have replaced the identifier
    if let Expr::Ident(ident) = expr {
        assert_eq!(&*ident.sym, "replaced");
    } else {
        panic!("Expected Ident expression");
    }
}

/// Test visiting a module
#[test]
fn test_visit_module() {
    struct StmtCounter {
        count: usize,
    }

    impl VisitMutHook<TraverseCtx> for StmtCounter {
        fn enter_stmt(&mut self, _stmt: &mut Stmt, _ctx: &mut TraverseCtx) {
            self.count += 1;
        }
    }

    let ctx = TraverseCtx::default();
    let hook = StmtCounter { count: 0 };
    let mut transformer = VisitMutWithHook { hook, context: ctx };

    let mut module = Module {
        span: DUMMY_SP,
        body: vec![
            ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP })),
            ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP })),
        ],
        shebang: None,
    };

    module.visit_mut_with(&mut transformer);

    assert_eq!(transformer.hook.count, 2);
}

/// Test visiting a program
#[test]
fn test_visit_program() {
    struct ExprCounter {
        count: usize,
    }

    impl VisitMutHook<TraverseCtx> for ExprCounter {
        fn enter_expr(&mut self, _expr: &mut Expr, _ctx: &mut TraverseCtx) {
            self.count += 1;
        }
    }

    let ctx = TraverseCtx::default();
    let hook = ExprCounter { count: 0 };
    let mut transformer = VisitMutWithHook { hook, context: ctx };

    let mut program = Program::Module(Module {
        span: DUMMY_SP,
        body: vec![ModuleItem::Stmt(Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
        }))],
        shebang: None,
    });

    program.visit_mut_with(&mut transformer);

    assert_eq!(transformer.hook.count, 1);
}

/// Test that enter and exit are called in correct order
#[test]
fn test_enter_exit_order() {
    use std::cell::RefCell;

    struct OrderChecker {
        events: RefCell<Vec<String>>,
    }

    impl VisitMutHook<TraverseCtx> for OrderChecker {
        fn enter_expr(&mut self, expr: &mut Expr, _ctx: &mut TraverseCtx) {
            let name = match expr {
                Expr::Bin(_) => "bin",
                Expr::Lit(_) => "lit",
                _ => "other",
            };
            self.events.borrow_mut().push(format!("enter_{name}"));
        }

        fn exit_expr(&mut self, expr: &mut Expr, _ctx: &mut TraverseCtx) {
            let name = match expr {
                Expr::Bin(_) => "bin",
                Expr::Lit(_) => "lit",
                _ => "other",
            };
            self.events.borrow_mut().push(format!("exit_{name}"));
        }
    }

    let ctx = TraverseCtx::default();
    let hook = OrderChecker {
        events: RefCell::new(Vec::new()),
    };
    let mut transformer = VisitMutWithHook { hook, context: ctx };

    // Binary expression with two literals
    let mut expr = Expr::Bin(BinExpr {
        span: DUMMY_SP,
        op: BinaryOp::Add,
        left: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
        right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
    });

    expr.visit_mut_with(&mut transformer);

    let events = transformer.hook.events.borrow();
    assert_eq!(
        &*events,
        &[
            "enter_bin",
            "enter_lit",
            "exit_lit",
            "enter_lit",
            "exit_lit",
            "exit_bin"
        ]
    );
}

/// Test that context's create_unique_ident works
#[test]
fn test_create_unique_ident() {
    struct IdentCreator {
        created: Vec<Ident>,
    }

    impl VisitMutHook<TraverseCtx> for IdentCreator {
        fn enter_expr(&mut self, _expr: &mut Expr, ctx: &mut TraverseCtx) {
            self.created.push(ctx.create_unique_ident("tmp"));
        }
    }

    let ctx = TraverseCtx::default();
    let hook = IdentCreator {
        created: Vec::new(),
    };
    let mut transformer = VisitMutWithHook { hook, context: ctx };

    let mut expr = Expr::Bin(BinExpr {
        span: DUMMY_SP,
        op: BinaryOp::Add,
        left: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
        right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
    });

    expr.visit_mut_with(&mut transformer);

    let created = &transformer.hook.created;
    assert_eq!(created.len(), 3);
    assert_eq!(&*created[0].sym, "_tmp_0");
    assert_eq!(&*created[1].sym, "_tmp_1");
    assert_eq!(&*created[2].sym, "_tmp_2");

    // All should have the same context from the mark
    assert_eq!(created[0].ctxt, created[1].ctxt);
    assert_eq!(created[1].ctxt, created[2].ctxt);
}
