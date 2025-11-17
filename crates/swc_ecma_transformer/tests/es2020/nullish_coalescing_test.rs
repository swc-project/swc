//! Integration tests for nullish coalescing transformation.

use std::{io, path::PathBuf, sync::Arc};

use swc_common::{errors::Handler, sync::Lrc, FileName, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_parser::{Parser, StringInput, Syntax};
use swc_ecma_transformer::{es2020::NullishCoalescing, TransformCtx};

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
    let mut transformer = NullishCoalescing::new();
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
fn test_nullish_coalescing_simple() {
    // x ?? "default" should become a conditional expression
    let mut expr = parse_expr("x ?? \"default\"");
    transform_expr(&mut expr);

    // Result should be a conditional expression
    assert!(matches!(expr, Expr::Cond(_)));
}

#[test]
fn test_nullish_coalescing_with_number() {
    // x ?? 0 should become a conditional expression
    let mut expr = parse_expr("x ?? 0");
    transform_expr(&mut expr);

    // Result should be a conditional expression
    assert!(matches!(expr, Expr::Cond(_)));
}

#[test]
fn test_nullish_coalescing_complex_left() {
    // obj.prop ?? "default" should use a temp variable
    let mut expr = parse_expr("obj.prop ?? \"default\"");
    transform_expr(&mut expr);

    // Result should be a conditional expression
    assert!(matches!(expr, Expr::Cond(_)));
}

#[test]
fn test_logical_or_unchanged() {
    // x || "default" should remain unchanged
    let original = parse_expr("x || \"default\"");
    let mut expr = original.clone();
    transform_expr(&mut expr);

    // Should still be a binary expression with LogicalOr
    if let Expr::Bin(bin_expr) = expr {
        assert_eq!(bin_expr.op, BinaryOp::LogicalOr);
    } else {
        panic!("Expected binary expression");
    }
}

#[test]
fn test_nullish_coalescing_chained() {
    // x ?? y ?? "default" should transform both operators
    let mut expr = parse_expr("x ?? y ?? \"default\"");
    transform_expr(&mut expr);

    // Result should be a conditional expression
    assert!(matches!(expr, Expr::Cond(_)));
}
