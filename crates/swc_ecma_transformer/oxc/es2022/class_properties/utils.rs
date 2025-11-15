//! ES2022: Class Properties
//! Utility functions.

use std::path::Path;

use oxc_ast::ast::*;
use oxc_span::SPAN;
use oxc_traverse::BoundIdentifier;

use crate::context::TraverseCtx;

/// Create `var` declaration.
pub(super) fn create_variable_declaration<'a>(
    binding: &BoundIdentifier<'a>,
    init: Expression<'a>,
    ctx: &TraverseCtx<'a>,
) -> Statement<'a> {
    let kind = VariableDeclarationKind::Var;
    let declarator = ctx.ast.variable_declarator(
        SPAN,
        kind,
        binding.create_binding_pattern(ctx),
        Some(init),
        false,
    );
    Statement::from(ctx.ast.declaration_variable(SPAN, kind, ctx.ast.vec1(declarator), false))
}

/// Convert an iterator of `Expression`s into an iterator of `Statement::ExpressionStatement`s.
pub(super) fn exprs_into_stmts<'a, E>(
    exprs: E,
    ctx: &TraverseCtx<'a>,
) -> impl Iterator<Item = Statement<'a>>
where
    E: IntoIterator<Item = Expression<'a>>,
{
    exprs.into_iter().map(|expr| ctx.ast.statement_expression(SPAN, expr))
}

/// Create `IdentifierName` for `_`.
pub(super) fn create_underscore_ident_name<'a>(ctx: &TraverseCtx<'a>) -> IdentifierName<'a> {
    ctx.ast.identifier_name(SPAN, Atom::from("_"))
}

/// Debug assert that an `Expression` is not `ParenthesizedExpression` or TS syntax
/// (e.g. `TSAsExpression`).
//
// `#[inline(always)]` because this is a no-op in release mode
#[expect(clippy::inline_always)]
#[inline(always)]
pub(super) fn debug_assert_expr_is_not_parenthesis_or_typescript_syntax(
    expr: &Expression,
    path: &Path,
) {
    debug_assert!(
        !(matches!(expr, Expression::ParenthesizedExpression(_)) || expr.is_typescript_syntax()),
        "Should not be: {expr:?} in {}",
        path.display()
    );
}
