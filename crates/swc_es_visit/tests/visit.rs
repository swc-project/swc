use swc_common::DUMMY_SP;
use swc_es_ast::{
    AstStore, BinaryExpr, BinaryOp, Expr, ExprStmt, Lit, NumberLit, Program, ProgramKind, Stmt,
};
use swc_es_visit::{Visit, VisitWith};

#[derive(Default)]
struct Counter {
    exprs: usize,
    stmts: usize,
}

impl Visit for Counter {
    fn visit_expr_node(&mut self, _store: &AstStore, _node: &Expr) {
        self.exprs += 1;
    }

    fn visit_stmt_node(&mut self, _store: &AstStore, _node: &Stmt) {
        self.stmts += 1;
    }
}

#[test]
fn walks_program_nodes() {
    let mut store = AstStore::default();
    let one = store.alloc_expr(Expr::Lit(Lit::Num(NumberLit {
        span: DUMMY_SP,
        value: 1.0,
    })));
    let two = store.alloc_expr(Expr::Lit(Lit::Num(NumberLit {
        span: DUMMY_SP,
        value: 2.0,
    })));
    let sum = store.alloc_expr(Expr::Binary(BinaryExpr {
        span: DUMMY_SP,
        op: BinaryOp::Add,
        left: one,
        right: two,
    }));
    let stmt = store.alloc_stmt(Stmt::Expr(ExprStmt {
        span: DUMMY_SP,
        expr: sum,
    }));
    let program = store.alloc_program(Program {
        span: DUMMY_SP,
        kind: ProgramKind::Script,
        body: vec![stmt],
        shebang: None,
        directives: Vec::new(),
    });

    let mut counter = Counter::default();
    program.visit_with(&store, &mut counter);

    assert_eq!(counter.stmts, 1);
    assert_eq!(counter.exprs, 3);
}
