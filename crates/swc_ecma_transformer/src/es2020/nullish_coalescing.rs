//! ES2020: Nullish Coalescing Operator
//!
//! This plugin transforms the nullish coalescing operator (`??`) to conditional
//! expressions.
//!
//! > This plugin is included in `preset-env`, in ES2020
//!
//! ## Example
//!
//! Input:
//! ```js
//! foo ?? bar
//! foo.x ?? bar
//! foo() ?? bar
//! ```
//!
//! Output:
//! ```js
//! foo !== null && foo !== void 0 ? foo : bar
//! var _foo;
//! (_foo = foo.x) !== null && _foo !== void 0 ? _foo : bar
//! var _foo2;
//! (_foo2 = foo()) !== null && _foo2 !== void 0 ? _foo2 : bar
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-nullish-coalescing-operator](https://babel.dev/docs/babel-plugin-transform-nullish-coalescing-operator).
//!
//! ## References:
//!
//! * Babel plugin implementation: <https://github.com/babel/babel/blob/main/packages/babel-plugin-transform-nullish-coalescing-operator>
//! * Oxc implementation: <https://github.com/oxc-project/oxc/blob/main/crates/oxc_transformer/src/es2020/nullish_coalescing_operator.rs>
//! * Nullish coalescing TC39 proposal: <https://github.com/tc39/proposal-nullish-coalescing>
//! * Nullish coalescing specification: <https://tc39.es/ecma262/#prod-CoalesceExpression>

use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::{utils, TraverseCtx};

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    NullishCoalescingPass::default()
}

#[derive(Default)]
struct NullishCoalescingPass {
    cur_stmt_address: Option<*const Stmt>,
}

impl VisitMutHook<TraverseCtx> for NullishCoalescingPass {
    fn enter_expr(&mut self, expr: &mut Expr, ctx: &mut TraverseCtx) {
        // Transform `left ?? right` to conditional expression
        if let Expr::Bin(bin_expr) = expr {
            if bin_expr.op == BinaryOp::NullishCoalescing {
                self.transform_nullish_coalescing(expr, ctx);
            }
        }
    }

    fn enter_stmt(&mut self, stmt: &mut Stmt, _ctx: &mut TraverseCtx) {
        self.cur_stmt_address = Some(stmt as *const Stmt);
    }

    fn exit_stmt(&mut self, _stmt: &mut Stmt, _ctx: &mut TraverseCtx) {
        self.cur_stmt_address = None;
    }
}

impl NullishCoalescingPass {
    /// Transform nullish coalescing expression
    ///
    /// Transforms `left ?? right` based on whether left has side effects:
    /// - No side effects: `left !== null && left !== void 0 ? left : right`
    /// - Has side effects: `var _left; (_left = left) !== null && _left !==
    ///   void 0 ? _left : right`
    fn transform_nullish_coalescing(&self, expr: &mut Expr, ctx: &mut TraverseCtx) {
        let Expr::Bin(bin_expr) = expr else {
            return;
        };

        let left = bin_expr.left.take();
        let right = bin_expr.right.take();

        // Check if left side needs memoization (has potential side effects)
        let needs_temp = may_have_side_effects(&left);

        if needs_temp {
            // Generate a temp variable name and create a private identifier
            let temp_name = utils::generate_temp_var_name(&left);
            let temp_ident = utils::create_private_ident(&temp_name);

            // Inject variable declaration: var _temp;
            ctx.statement_injector.insert_before(
                self.cur_stmt_address.unwrap(),
                Stmt::Decl(Decl::Var(Box::new(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(temp_ident.clone().into()),
                        init: None,
                        definite: false,
                    }],
                    ..Default::default()
                }))),
            );

            // Create: (_temp = left) !== null && _temp !== void 0 ? _temp : right
            let assignment = Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: AssignOp::Assign,
                left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                    id: temp_ident.clone(),
                    type_ann: None,
                })),
                right: left,
            });

            *expr = create_nullish_check(
                Box::new(assignment),
                Box::new(Expr::Ident(temp_ident.clone())),
                Box::new(Expr::Ident(temp_ident)),
                right,
            );
        } else {
            // No memoization needed: left !== null && left !== void 0 ? left : right
            *expr = create_nullish_check(left.clone(), left.clone(), left, right);
        }
    }
}

/// Create the nullish check conditional expression
///
/// Creates: `test_expr !== null && check_expr !== void 0 ? consequent :
/// alternate`
fn create_nullish_check(
    test_expr: Box<Expr>,
    check_expr: Box<Expr>,
    consequent: Box<Expr>,
    alternate: Box<Expr>,
) -> Expr {
    // test_expr !== null
    let null_check = Expr::Bin(BinExpr {
        span: DUMMY_SP,
        op: BinaryOp::NotEqEq,
        left: test_expr,
        right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
    });

    // check_expr !== void 0
    let undefined_check = Expr::Bin(BinExpr {
        span: DUMMY_SP,
        op: BinaryOp::NotEqEq,
        left: check_expr,
        right: Box::new(Expr::Unary(UnaryExpr {
            span: DUMMY_SP,
            op: UnaryOp::Void,
            arg: Box::new(Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: 0.0,
                raw: None,
            }))),
        })),
    });

    // null_check && undefined_check
    let test = Expr::Bin(BinExpr {
        span: DUMMY_SP,
        op: BinaryOp::LogicalAnd,
        left: Box::new(null_check),
        right: Box::new(undefined_check),
    });

    // test ? consequent : alternate
    Expr::Cond(CondExpr {
        span: DUMMY_SP,
        test: Box::new(test),
        cons: consequent,
        alt: alternate,
    })
}

/// Check if an expression may have side effects
///
/// Returns true if the expression could have side effects and needs to be
/// memoized to avoid evaluating it multiple times.
fn may_have_side_effects(expr: &Expr) -> bool {
    match expr {
        // Safe expressions that don't have side effects
        Expr::Lit(_) | Expr::Ident(_) | Expr::This(_) | Expr::PrivateName(_) => false,

        // Member expressions are safe only if both object and property are safe
        Expr::Member(member) => {
            // Check if the object might have side effects
            if may_have_side_effects(&member.obj) {
                return true;
            }
            // Computed properties might have side effects
            matches!(member.prop, MemberProp::Computed(_))
        }

        // All other expressions potentially have side effects
        _ => true,
    }
}
