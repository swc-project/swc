#![cfg(feature = "serde-impl")]

use swc_atoms::Atom;
use swc_common::DUMMY_SP;
use swc_es_ast::{
    AstStore, BinaryExpr, BinaryOp, Expr, ExprStmt, Lit, NumberLit, Program, ProgramKind, Stmt,
};

#[test]
fn roundtrip_store_ids_with_serde() {
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
    let program = Program {
        span: DUMMY_SP,
        kind: ProgramKind::Script,
        body: vec![stmt],
    };

    let json = serde_json::to_string(&program).expect("program should serialize");
    let deserialized: Program = serde_json::from_str(&json).expect("program should deserialize");

    assert_eq!(deserialized.kind, ProgramKind::Script);
    assert_eq!(deserialized.body, vec![stmt]);

    let ident_json = serde_json::to_string(&Atom::new("a")).expect("atom should serialize");
    let ident: Atom = serde_json::from_str(&ident_json).expect("atom should deserialize");
    assert_eq!(ident, Atom::new("a"));

    let _ = store.alloc_program(deserialized);
}
