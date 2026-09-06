use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprCtx, ExprExt, Type, Value};

/// Concatenates nonempty join groups after the caller has handled nullish
/// values and checked whether replacing join's coercions is permitted.
pub(super) fn join_to_concat(
    mut parts: Vec<Box<Expr>>,
    expr_ctx: ExprCtx,
    unsafe_passes: bool,
) -> Expr {
    // Reuse the groups' allocation as a worklist, with the next operand last.
    parts.reverse();
    let mut result = parts.pop().expect("join must have at least one group");
    let mut result_is_string = result.get_type(expr_ctx) == Value::Known(Type::Str);

    // A string in either of the first two positions guarantees concatenation.
    // A later string cannot prevent the first addition from being numeric, and
    // a singleton still needs coercion unless it already produces a string.
    if !result_is_string
        && !parts
            .last()
            .is_some_and(|part| part.get_type(expr_ctx) == Value::Known(Type::Str))
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
        let part_is_string = part.get_type(expr_ctx) == Value::Known(Type::Str);
        // Preserve the established safe-mode grouping. Join-specific
        // reassociation accompanies the unsafe expression-only folds.
        let can_flatten = unsafe_passes
            && matches!(
                &*part,
                Expr::Bin(BinExpr {
                    op: BinaryOp::Add,
                    left,
                    ..
                }) if part_is_string
                    && (result_is_string || left.get_type(expr_ctx) == Value::Known(Type::Str))
            );

        // Both the original inner addition and the new first addition must
        // concatenate. Thus foo + ("bar" + baz) can be flattened, whereas
        // foo + (bar + "baz") must retain its numeric-addition boundary.
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

    *result
}
