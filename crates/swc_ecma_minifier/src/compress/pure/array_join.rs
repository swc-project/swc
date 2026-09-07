use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprCtx, ExprExt, Type, Value};

/// Returns whether evaluating `expr` produces a string value before the next
/// join element is evaluated, without relying on deferred object coercion.
fn produces_string(expr_ctx: ExprCtx, expr: &Expr) -> bool {
    matches!(expr, Expr::Lit(Lit::Str(..)) | Expr::Tpl(..))
        || matches!(expr, Expr::Bin(BinExpr { op: BinaryOp::Add, .. }) if expr.get_type(expr_ctx) == Value::Known(Type::Str))
}

/// Whether reassociating an addition can coerce its left value before an
/// effectful right operand. `join` evaluates all elements before coercion, so
/// this shape cannot be represented by a flattened concatenation.
fn has_unsafe_join_reassociation(expr_ctx: ExprCtx, expr: &Expr) -> bool {
    match expr {
        Expr::Paren(paren) => has_unsafe_join_reassociation(expr_ctx, &paren.expr),
        Expr::Bin(BinExpr {
            op: BinaryOp::Add,
            left,
            right,
            ..
        }) => {
            (!produces_string(expr_ctx, left) && right.may_have_side_effects(expr_ctx))
                || has_unsafe_join_reassociation(expr_ctx, left)
                || has_unsafe_join_reassociation(expr_ctx, right)
        }
        _ => false,
    }
}

/// Concatenates nonempty join groups after the caller has handled nullish
/// values and checked whether replacing join's coercions is permitted.
pub(super) fn join_to_concat(
    mut parts: Vec<Box<Expr>>,
    expr_ctx: ExprCtx,
    unsafe_passes: bool,
) -> Option<Expr> {
    if unsafe_passes
        && parts
            .iter()
            .any(|part| has_unsafe_join_reassociation(expr_ctx, part))
    {
        return None;
    }

    // Reuse the groups' allocation as a worklist, with the next operand last.
    parts.reverse();
    let mut result = parts.pop().expect("join must have at least one group");
    let mut result_is_string = produces_string(expr_ctx, &result);

    // A string in either of the first two positions guarantees concatenation.
    // A later string cannot prevent the first addition from being numeric, and
    // a singleton still needs coercion unless it already produces a string.
    if !result_is_string
        && !parts
            .last()
            .is_some_and(|part| produces_string(expr_ctx, part))
    {
        result = Box::new(Expr::Bin(BinExpr {
            span: DUMMY_SP,
            op: op!(bin, "+"),
            left: Box::new(Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: "".into(),
                raw: None,
            }))),
            right: result,
        }));
        result_is_string = true;
    }

    // Keep the accumulated type instead of repeatedly walking an increasingly
    // long left operand. The worklist also avoids recursion for nested additions.
    while let Some(part) = parts.pop() {
        let part_is_string = produces_string(expr_ctx, &part);
        if unsafe_passes
            && !result_is_string
            && matches!(&*result, Expr::Object(..))
            && matches!(
                &*part,
                Expr::Bin(BinExpr {
                    op: BinaryOp::Add,
                    ..
                })
            )
            && part_is_string
        {
            // A later compression pass may reassociate this addition and coerce
            // the accumulated value before evaluating the nested right operand.
            return None;
        }

        // Preserve the established safe-mode grouping. Join-specific
        // reassociation accompanies the unsafe expression-only folds.
        let can_flatten = unsafe_passes
            && matches!(
                &*part,
                Expr::Bin(BinExpr {
                    op: BinaryOp::Add,
                    left,
                    right,
                    ..
                }) if result_is_string
                    && part_is_string
                    && (produces_string(expr_ctx, left)
                        || !right.may_have_side_effects(expr_ctx))
            );

        // Flatten only after the accumulated result is already a string, and
        // only when it cannot move an observable coercion before a later
        // operand. Keeping the addition grouped preserves join's evaluation
        // order for object-valued element operands.
        if can_flatten {
            let Expr::Bin(bin) = *part else {
                unreachable!()
            };
            parts.push(bin.right);
            parts.push(bin.left);
            continue;
        }

        result = Box::new(Expr::Bin(BinExpr {
            span: DUMMY_SP,
            op: op!(bin, "+"),
            left: result,
            right: part,
        }));
        result_is_string |= part_is_string;
    }

    Some(*result)
}
