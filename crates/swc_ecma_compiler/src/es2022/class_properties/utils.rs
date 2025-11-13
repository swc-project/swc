//! ES2022: Class Properties
//! Utility functions.

use swc_common::DUMMY_SP;
use swc_ecma_ast::*;

use crate::context::TraverseCtx;

/// Create `var` declaration from identifier name and initializer expression.
pub(super) fn create_variable_declaration<'a>(
    name: &str,
    init: Box<Expr>,
    _ctx: &TraverseCtx<'_>,
) -> VarDeclarator {
    VarDeclarator {
        span: DUMMY_SP,
        name: Pat::Ident(BindingIdent {
            id: Ident::new(name.into(), DUMMY_SP, Default::default()),
            type_ann: None,
        }),
        init: Some(init),
        definite: false,
    }
}

/// Convert an iterator of `Expr`s into an iterator of `Stmt::Expr`s.
pub(super) fn exprs_into_stmts<E>(exprs: E) -> impl Iterator<Item = Stmt>
where
    E: IntoIterator<Item = Box<Expr>>,
{
    exprs.into_iter().map(|expr| {
        Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr,
        })
    })
}

/// Create `IdentifierName` for `_`.
pub(super) fn create_underscore_ident_name() -> Ident {
    Ident::new("_".into(), DUMMY_SP, Default::default())
}

/// Debug assert that an `Expr` is not `Paren` or TS syntax (e.g. `TsAsExpr`).
///
/// `#[inline(always)]` because this is a no-op in release mode
#[expect(clippy::inline_always)]
#[inline(always)]
pub(super) fn debug_assert_expr_is_not_parenthesis_or_typescript_syntax(
    expr: &Expr,
    _path: &std::path::Path,
) {
    debug_assert!(
        !matches!(
            expr,
            Expr::Paren(_)
                | Expr::TsAs(_)
                | Expr::TsTypeAssertion(_)
                | Expr::TsConstAssertion(_)
                | Expr::TsNonNull(_)
                | Expr::TsInstantiation(_)
                | Expr::TsSatisfies(_)
        ),
        "Should not be a parenthesis or TypeScript syntax expression: {expr:?} in {}",
        _path.display()
    );
}
