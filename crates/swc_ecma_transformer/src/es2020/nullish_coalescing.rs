//! ES2020: Nullish Coalescing Operator
//!
//! This plugin transforms the nullish coalescing operator (`??`) and nullish
//! coalescing assignment operator (`??=`) to conditional expressions.
//!
//! > This plugin is included in `preset-env`, in ES2020
//!
//! ## Example
//!
//! Input:
//! ```js
//! var foo = object.foo ?? "default";
//! x ??= 5;
//! ```
//!
//! Output:
//! ```js
//! var _object$foo;
//! var foo = (_object$foo = object.foo) !== null && _object$foo !== void 0
//!   ? _object$foo
//!   : "default";
//! x = x !== null && x !== void 0 ? x : 5;
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-nullish-coalescing-operator](https://babel.dev/docs/babel-plugin-transform-nullish-coalescing-operator).
//!
//! ## References:
//!
//! * Babel plugin implementation: <https://github.com/babel/babel/blob/v7.26.2/packages/babel-plugin-transform-nullish-coalescing-operator>
//! * Nullish coalescing TC39 proposal: <https://github.com/tc39/proposal-nullish-coalescing>
//! * Nullish coalescing specification: <https://tc39.es/ecma262/#sec-binary-logical-operators>

use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::{alias_ident_for_simple_assign_tatget, alias_if_required};

use crate::TraverseCtx;

/// Creates a nullish coalescing transformation hook.
///
/// The `no_document_all` parameter controls whether to use a simplified
/// transformation for environments that don't support `document.all`:
/// - `true`: `a ?? b` -> `a != null ? a : b`
/// - `false`: `a ?? b` -> `a !== null && a !== void 0 ? a : b`
pub fn hook(no_document_all: bool) -> impl VisitMutHook<TraverseCtx> {
    NullishCoalescingPass {
        no_document_all,
        stmt_ptr: None,
        stmt_ptr_stack: vec![],
    }
}

struct NullishCoalescingPass {
    no_document_all: bool,
    stmt_ptr: Option<*const Stmt>,
    stmt_ptr_stack: Vec<*const Stmt>,
}

impl VisitMutHook<TraverseCtx> for NullishCoalescingPass {
    fn enter_expr(&mut self, expr: &mut Expr, ctx: &mut TraverseCtx) {
        match expr {
            // Transform `left ?? right`
            Expr::Bin(bin_expr) if bin_expr.op == BinaryOp::NullishCoalescing => {
                self.transform_nullish_coalescing(expr, ctx);
            }
            // Note: `left ??= right` is transformed by es2021/logical_assignment_operators
            // to `left ?? (left = right)`, which we then transform as a binary expression above
            _ => {}
        }
    }

    fn enter_stmt(&mut self, stmt: &mut Stmt, _ctx: &mut TraverseCtx) {
        self.stmt_ptr = Some(stmt as *const Stmt);
        self.stmt_ptr_stack.push(stmt as *const Stmt);
    }

    fn exit_stmt(&mut self, _stmt: &mut Stmt, _ctx: &mut TraverseCtx) {
        self.stmt_ptr = None;
        self.stmt_ptr = self.stmt_ptr_stack.pop();
    }
}

impl NullishCoalescingPass {
    /// Transform `left ?? right` to a conditional expression
    ///
    /// Depending on the complexity of the left side:
    /// - Simple (ident, this, literal): `left !== null && left !== void 0 ?
    ///   left : right`
    /// - Complex: `(_ref = left) !== null && _ref !== void 0 ? _ref : right`
    fn transform_nullish_coalescing(&mut self, expr: &mut Expr, ctx: &mut TraverseCtx) {
        let Expr::Bin(bin_expr) = expr else {
            return;
        };

        let left = bin_expr.left.take();
        let right = bin_expr.right.take();

        // Determine if we need to create a temporary variable
        let (alias_ident, needs_temp) = alias_if_required(&left, "ref");

        if needs_temp {
            // Inject variable declaration for temporary variable
            ctx.statement_injector.insert_before(
                self.stmt_ptr.unwrap(),
                Stmt::Decl(Decl::Var(Box::new(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(alias_ident.clone().into()),
                        init: None,
                        definite: false,
                    }],
                    ..Default::default()
                }))),
            );
        }

        // Create the test expression and consequent
        let (test_expr, cons_expr) = if needs_temp {
            // Complex left side: (_ref = left) !== null && _ref !== void 0 ? _ref : right
            let assign_expr = Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: AssignOp::Assign,
                left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                    id: alias_ident.clone(),
                    type_ann: None,
                })),
                right: left,
            }));

            let test = create_nullish_test(self.no_document_all, assign_expr, &alias_ident);
            let cons = Box::new(Expr::Ident(alias_ident));

            (test, cons)
        } else {
            // Simple left side: left !== null && left !== void 0 ? left : right
            let test = create_nullish_test(self.no_document_all, left.clone(), &alias_ident);
            let cons = left;

            (test, cons)
        };

        *expr = Expr::Cond(CondExpr {
            span: DUMMY_SP,
            test: test_expr,
            cons: cons_expr,
            alt: right,
        });
    }

    /// Transform `left ??= right` to assignment with conditional
    ///
    /// Depending on the type of left side:
    /// - Identifier: `x ??= 5` -> `x = x !== null && x !== void 0 ? x : 5`
    /// - Member/Super: Needs temporary variables to avoid side effects
    fn transform_nullish_coalescing_assign(&mut self, expr: &mut Expr, ctx: &mut TraverseCtx) {
        let Expr::Assign(assign_expr) = expr else {
            return;
        };

        match &mut assign_expr.left {
            // Simple identifier: `x ??= right` -> `x = x !== null && x !== void 0 ? x : right`
            AssignTarget::Simple(SimpleAssignTarget::Ident(ident)) => {
                let ident_ref = ident.id.clone();
                let right = assign_expr.right.take();

                let test = create_nullish_test(
                    self.no_document_all,
                    Box::new(Expr::Ident(ident_ref.clone())),
                    &ident_ref,
                );

                *expr = Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                        id: ident_ref.clone(),
                        type_ann: None,
                    })),
                    right: Box::new(Expr::Cond(CondExpr {
                        span: DUMMY_SP,
                        test,
                        cons: Box::new(Expr::Ident(ident_ref)),
                        alt: right,
                    })),
                });
            }
            // Member expression or super property: needs temporary variable
            AssignTarget::Simple(left) => {
                let alias = alias_ident_for_simple_assign_tatget(left, "refs");

                // Inject variable declaration
                ctx.statement_injector.insert_before(
                    self.stmt_ptr.unwrap(),
                    Stmt::Decl(Decl::Var(Box::new(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(alias.clone().into()),
                            init: None,
                            definite: false,
                        }],
                        ..Default::default()
                    }))),
                );

                let right = assign_expr.right.take();
                let left_clone = left.clone();

                // Create: (_ref = left) !== null && _ref !== void 0 ? _ref : (left = right)
                let assign_to_temp = Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                        id: alias.clone(),
                        type_ann: None,
                    })),
                    right: left.take().into(),
                }));

                let test = create_nullish_test(self.no_document_all, assign_to_temp, &alias);

                let cons = Box::new(Expr::Ident(alias.clone()));

                let alt = Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: AssignTarget::Simple(left_clone),
                    right,
                }));

                // Final: _ref = (_ref = left) !== null && _ref !== void 0 ? _ref : (left =
                // right)
                *expr = Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent {
                        id: alias,
                        type_ann: None,
                    })),
                    right: Box::new(Expr::Cond(CondExpr {
                        span: DUMMY_SP,
                        test,
                        cons,
                        alt,
                    })),
                });
            }
            _ => {}
        }
    }
}

/// Create a test expression for nullish check
///
/// Returns:
/// - If `no_document_all` is true: `test_expr != null`
/// - If `no_document_all` is false: `test_expr !== null && alias !== void 0`
fn create_nullish_test(no_document_all: bool, test_expr: Box<Expr>, alias: &Ident) -> Box<Expr> {
    if no_document_all {
        // Simplified: test_expr != null
        Box::new(Expr::Bin(BinExpr {
            span: DUMMY_SP,
            left: test_expr,
            op: BinaryOp::NotEq,
            right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
        }))
    } else {
        // Standard: test_expr !== null && alias !== void 0
        Box::new(Expr::Bin(BinExpr {
            span: DUMMY_SP,
            left: Box::new(Expr::Bin(BinExpr {
                span: DUMMY_SP,
                left: test_expr,
                op: BinaryOp::NotEqEq,
                right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
            })),
            op: BinaryOp::LogicalAnd,
            right: Box::new(Expr::Bin(BinExpr {
                span: DUMMY_SP,
                left: Box::new(Expr::Ident(alias.clone())),
                op: BinaryOp::NotEqEq,
                right: Expr::undefined(DUMMY_SP),
            })),
        }))
    }
}
