use swc_atoms::Atom;
use swc_common::DUMMY_SP;
use swc_es_ast::{AstStore, Expr, ExprStmt, Id, Ident, OptChainExpr, Program, ProgramKind, Stmt};
use swc_es_codegen::{emit_program, CodegenError, NodeKind};

#[test]
fn returns_missing_node_error_for_invalid_store_reference() {
    let mut store = AstStore::default();
    let missing_stmt = Id::<Stmt>::try_from_raw(1).expect("raw id should be constructible");

    let program = store.alloc_program(Program {
        span: DUMMY_SP,
        kind: ProgramKind::Script,
        body: vec![missing_stmt],
    });

    let err = emit_program(&store, program).expect_err("emission should fail");
    assert_eq!(
        err,
        CodegenError::MissingNode {
            kind: NodeKind::Stmt,
            raw_id: 1,
        }
    );
}

#[test]
fn returns_invalid_ast_error_for_malformed_optional_chain() {
    let mut store = AstStore::default();

    let base = store.alloc_expr(Expr::Ident(Ident::new(DUMMY_SP, Atom::new("base"))));
    let malformed = store.alloc_expr(Expr::OptChain(OptChainExpr {
        span: DUMMY_SP,
        base,
    }));
    let stmt = store.alloc_stmt(Stmt::Expr(ExprStmt {
        span: DUMMY_SP,
        expr: malformed,
    }));
    let program = store.alloc_program(Program {
        span: DUMMY_SP,
        kind: ProgramKind::Script,
        body: vec![stmt],
    });

    let err = emit_program(&store, program).expect_err("emission should fail");
    match err {
        CodegenError::InvalidAst { context } => {
            assert!(
                context.contains("optional chain"),
                "unexpected invalid-ast context: {context}"
            );
        }
        _ => panic!("expected invalid ast error, got {err:?}"),
    }
}
