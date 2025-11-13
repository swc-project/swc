//! Utilities to duplicate expressions.

use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;

use crate::context::{TransformCtx, TraverseCtx};

impl TransformCtx {
    /// Duplicate expression to be used twice.
    ///
    /// If `expr` may have side effects, create a temp var `_expr` and assign to
    /// it.
    ///
    /// * `this` -> `this`, `this`
    /// * Bound identifier `foo` -> `foo`, `foo`
    /// * Unbound identifier `foo` -> `_foo = foo`, `_foo`
    /// * Anything else `foo()` -> `_foo = foo()`, `_foo`
    ///
    /// If `mutated_symbol_needs_temp_var` is `true`, temp var will be created
    /// for a bound identifier, if it's mutated (assigned to) anywhere in
    /// AST.
    ///
    /// Returns 2 `Expr`s. The first may be an `AssignExpr`,
    /// and must be inserted into output first.
    pub(crate) fn duplicate_expression<'a>(
        &self,
        expr: Expr,
        mutated_symbol_needs_temp_var: bool,
        ctx: &mut TraverseCtx<'a>,
    ) -> (Expr, Expr) {
        let (maybe_assignment, references) =
            self.duplicate_expression_multiple::<1>(expr, mutated_symbol_needs_temp_var, ctx);
        let [reference] = references;
        (maybe_assignment, reference)
    }

    /// Duplicate expression to be used 3 times.
    ///
    /// If `expr` may have side effects, create a temp var `_expr` and assign to
    /// it.
    ///
    /// * `this` -> `this`, `this`, `this`
    /// * Bound identifier `foo` -> `foo`, `foo`, `foo`
    /// * Unbound identifier `foo` -> `_foo = foo`, `_foo`, `_foo`
    /// * Anything else `foo()` -> `_foo = foo()`, `_foo`, `_foo`
    ///
    /// If `mutated_symbol_needs_temp_var` is `true`, temp var will be created
    /// for a bound identifier, if it's mutated (assigned to) anywhere in
    /// AST.
    ///
    /// Returns 3 `Expr`s. The first may be an `AssignExpr`,
    /// and must be inserted into output first.
    pub(crate) fn duplicate_expression_twice<'a>(
        &self,
        expr: Expr,
        mutated_symbol_needs_temp_var: bool,
        ctx: &mut TraverseCtx<'a>,
    ) -> (Expr, Expr, Expr) {
        let (maybe_assignment, references) =
            self.duplicate_expression_multiple::<2>(expr, mutated_symbol_needs_temp_var, ctx);
        let [reference1, reference2] = references;
        (maybe_assignment, reference1, reference2)
    }

    /// Duplicate expression `N + 1` times.
    ///
    /// If `expr` may have side effects, create a temp var `_expr` and assign to
    /// it.
    ///
    /// * `this` -> `this`, [`this`; N]
    /// * Bound identifier `foo` -> `foo`, [`foo`; N]
    /// * Unbound identifier `foo` -> `_foo = foo`, [`_foo`; N]
    /// * Anything else `foo()` -> `_foo = foo()`, [`_foo`; N]
    ///
    /// If `mutated_symbol_needs_temp_var` is `true`, temp var will be created
    /// for a bound identifier, if it's mutated (assigned to) anywhere in
    /// AST.
    ///
    /// Returns `N + 1` x `Expr`s. The first may be an
    /// `AssignExpr`, and must be inserted into output first.
    pub(crate) fn duplicate_expression_multiple<'a, const N: usize>(
        &self,
        expr: Expr,
        mutated_symbol_needs_temp_var: bool,
        _ctx: &mut TraverseCtx<'a>,
    ) -> (Expr, [Expr; N]) {
        // TODO: Handle if in a function's params
        match &expr {
            Expr::Ident(ident) => {
                // TODO: Implement proper semantic analysis for identifiers
                // For now, if mutated_symbol_needs_temp_var is false, we can duplicate
                if !mutated_symbol_needs_temp_var {
                    let references = create_array(|| Expr::Ident(ident.clone()));
                    return (expr, references);
                }
                // Otherwise fall through to temp var creation
            }
            // Reading any of these cannot have side effects, so no need for temp var
            Expr::This(_)
            | Expr::Lit(Lit::Bool(_))
            | Expr::Lit(Lit::Null(_))
            | Expr::Lit(Lit::Num(_))
            | Expr::Lit(Lit::BigInt(_))
            | Expr::Lit(Lit::Regex(_))
            | Expr::Lit(Lit::Str(_)) => {
                let references = create_array(|| expr.clone());
                return (expr, references);
            }
            // Template literal cannot have side effects if it has no expressions.
            // If it *does* have expressions, but they're all literals, then also cannot have side
            // effects, but don't bother checking for that as it shouldn't occur in real
            // world code. Why would you write "`x${9}z`" when you can just write
            // "`x9z`"? Note: "`x${foo}`" *can* have side effects if `foo` is an object
            // with a `toString` method.
            Expr::Tpl(tpl) if tpl.exprs.is_empty() => {
                let references = create_array(|| expr.clone());
                return (expr, references);
            }
            // Anything else requires temp var
            _ => {}
        }

        // Create temp var
        let temp_name = format!("_temp{}", self.var_declarations.get_next_temp_id());
        let temp_ident = Ident::new(temp_name.into(), DUMMY_SP, SyntaxContext::empty());

        let assignment = Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: op!("="),
            left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent::from(
                temp_ident.clone(),
            ))),
            right: Box::new(expr),
        });

        let references = create_array(|| Expr::Ident(temp_ident.clone()));

        (assignment, references)
    }
}

/// Create array of length `N`, with each item initialized with provided
/// function `init`.
///
/// Implementation based on:
/// * <https://github.com/rust-lang/rust/issues/62875#issuecomment-513834029>
/// * <https://github.com/rust-lang/rust/issues/61956>
//
// `#[inline]` so compiler can inline `init()`, and it may unroll the loop if `init` is simple
// enough.
#[inline]
fn create_array<const N: usize, T, I: FnMut() -> T>(mut init: I) -> [T; N] {
    use std::{
        mem::{ManuallyDrop, MaybeUninit},
        ptr,
    };

    let mut array: [MaybeUninit<T>; N] = [const { MaybeUninit::uninit() }; N];
    for elem in &mut array {
        elem.write(init());
    }
    // Wrapping in `ManuallyDrop` should not be necessary because `MaybeUninit` does
    // not impl `Drop`, but do it anyway just to make sure, as it's mentioned in
    // issues above.
    let mut array = ManuallyDrop::new(array);
    // SAFETY: All elements of array are initialized.
    // `[MaybeUninit<T>; N]` and `[T; N]` have same layout.
    unsafe { ptr::from_mut(&mut array).cast::<[T; N]>().read() }
}
