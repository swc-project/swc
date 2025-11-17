//! Integration tests for optional chaining transformation.

use std::{io, path::PathBuf, sync::Arc};

use swc_common::{errors::Handler, sync::Lrc, FileName, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_parser::{Parser, StringInput, Syntax};
use swc_ecma_transformer::{es2020::OptionalChaining, TransformCtx};

fn create_test_ctx() -> TransformCtx {
    let source_map_lrc = Lrc::new(SourceMap::default());
    let source_file = source_map_lrc.new_source_file(Lrc::new(FileName::Anon), "test".to_string());

    let handler = Lrc::new(Handler::with_emitter_writer(
        Box::new(io::sink()),
        Some(source_map_lrc.clone()),
    ));

    TransformCtx::new(
        PathBuf::from("test.js"),
        Arc::new(source_file.src.to_string()),
        source_map_lrc.clone(),
        handler,
    )
}

fn parse_expr(code: &str) -> Expr {
    let source_map = Lrc::new(SourceMap::default());
    let source_file = source_map.new_source_file(Lrc::new(FileName::Anon), code.to_string());

    let mut parser = Parser::new(Syntax::default(), StringInput::from(&*source_file), None);

    *parser.parse_expr().expect("Failed to parse expression")
}

fn transform_expr(expr: &mut Expr) {
    let mut transformer = OptionalChaining::new();
    let mut ctx = create_test_ctx();

    let module = Module {
        span: swc_common::DUMMY_SP,
        body: vec![ModuleItem::Stmt(Stmt::Expr(ExprStmt {
            span: swc_common::DUMMY_SP,
            expr: Box::new(expr.clone()),
        }))],
        shebang: None,
    };

    let mut program = Program::Module(module);
    transformer.transform_program(&mut program, &mut ctx);

    if let Program::Module(m) = program {
        if let Some(ModuleItem::Stmt(Stmt::Expr(expr_stmt))) = m.body.first() {
            *expr = *expr_stmt.expr.clone();
        }
    }
}

#[test]
fn test_optional_member_simple() {
    // obj?.prop should become a conditional expression
    let mut expr = parse_expr("obj?.prop");
    transform_expr(&mut expr);

    // Result should be a conditional expression
    assert!(matches!(expr, Expr::Cond(_)));
}

#[test]
fn test_optional_call_simple() {
    // func?.() should become a conditional expression
    let mut expr = parse_expr("func?.()");
    transform_expr(&mut expr);

    // Result should be a conditional expression
    assert!(matches!(expr, Expr::Cond(_)));
}

#[test]
fn test_optional_computed_member() {
    // obj?.[key] should become a conditional expression
    let mut expr = parse_expr("obj?.[key]");
    transform_expr(&mut expr);

    // Result should be a conditional expression
    assert!(matches!(expr, Expr::Cond(_)));
}

#[test]
fn test_non_optional_unchanged() {
    // obj.prop should remain unchanged
    let original = parse_expr("obj.prop");
    let mut expr = original.clone();
    transform_expr(&mut expr);

    // Should still be a member expression
    assert!(matches!(expr, Expr::Member(_)));
}
