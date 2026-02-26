use swc_atoms::Atom;
use swc_common::DUMMY_SP;
use swc_es_ast::{
    AstStore, BinaryExpr, BinaryOp, Expr, ExprStmt, Ident, Lit, NumberLit, Program, ProgramKind,
    Stmt,
};

#[test]
fn builds_program_with_arena_handles() {
    let mut store = AstStore::default();

    let left = store.alloc_expr(Expr::Lit(Lit::Num(NumberLit {
        span: DUMMY_SP,
        value: 1.0,
    })));
    let right = store.alloc_expr(Expr::Lit(Lit::Num(NumberLit {
        span: DUMMY_SP,
        value: 2.0,
    })));
    let sum = store.alloc_expr(Expr::Binary(BinaryExpr {
        span: DUMMY_SP,
        op: BinaryOp::Add,
        left,
        right,
    }));
    let stmt = store.alloc_stmt(Stmt::Expr(ExprStmt {
        span: DUMMY_SP,
        expr: sum,
    }));
    let program = store.alloc_program(Program {
        span: DUMMY_SP,
        kind: ProgramKind::Script,
        body: vec![stmt],
    });

    assert!(matches!(store.expr(sum), Some(Expr::Binary(_))));

    let root = store.program(program).expect("program should exist");
    assert_eq!(root.body, vec![stmt]);
}

#[test]
fn binding_and_reference_can_share_ident_shape() {
    let mut store = AstStore::default();

    let ident = Ident::new(DUMMY_SP, Atom::new("a"));
    let expr = store.alloc_expr(Expr::Ident(ident.clone()));

    let read_back = store.expr(expr).expect("expr should exist");
    assert_eq!(read_back, &Expr::Ident(ident));
}
