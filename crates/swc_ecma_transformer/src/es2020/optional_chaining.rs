//! Optional chaining operator transformation.
//!
//! Transforms optional chaining syntax (`?.`) into null/undefined checks.
//!
//! # Examples
//!
//! ## Optional Member Expression
//!
//! Input:
//! ```js
//! obj?.prop
//! ```
//!
//! Output:
//! ```js
//! obj === null || obj === void 0 ? void 0 : obj.prop
//! ```
//!
//! ## Optional Call Expression
//!
//! Input:
//! ```js
//! func?.()
//! ```
//!
//! Output:
//! ```js
//! func === null || func === void 0 ? void 0 : func()
//! ```
//!
//! ## Nested Optional Chaining
//!
//! Input:
//! ```js
//! obj?.a?.b
//! ```
//!
//! Output:
//! ```js
//! obj === null || obj === void 0 ? void 0 : (_obj$a = obj.a) === null || _obj$a === void 0 ? void 0 : _obj$a.b
//! ```

use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_visit::{VisitMut, VisitMutWith};

use crate::TransformCtx;

/// Optional chaining transformer.
pub struct OptionalChaining {
    /// Counter for generating unique temporary variable names.
    temp_var_counter: usize,
}

impl OptionalChaining {
    /// Creates a new optional chaining transformer.
    pub fn new() -> Self {
        Self {
            temp_var_counter: 0,
        }
    }

    /// Transforms a program, converting all optional chaining expressions.
    pub fn transform_program(&mut self, program: &mut Program, _ctx: &mut TransformCtx) {
        program.visit_mut_with(self);
    }

    /// Generates a unique temporary variable name.
    fn generate_temp_var(&mut self) -> Ident {
        let name = format!("_temp{}", self.temp_var_counter);
        self.temp_var_counter += 1;
        Ident {
            span: DUMMY_SP,
            ctxt: Default::default(),
            sym: name.into(),
            optional: false,
        }
    }

    /// Creates a null check expression: `expr === null || expr === void 0`
    fn create_null_check(&self, expr: Box<Expr>) -> Box<Expr> {
        Box::new(Expr::Bin(BinExpr {
            span: DUMMY_SP,
            op: BinaryOp::LogicalOr,
            left: Box::new(Expr::Bin(BinExpr {
                span: DUMMY_SP,
                op: BinaryOp::EqEqEq,
                left: expr.clone(),
                right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
            })),
            right: Box::new(Expr::Bin(BinExpr {
                span: DUMMY_SP,
                op: BinaryOp::EqEqEq,
                left: expr,
                right: Box::new(Expr::Unary(UnaryExpr {
                    span: DUMMY_SP,
                    op: UnaryOp::Void,
                    arg: Box::new(Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: 0.0,
                        raw: None,
                    }))),
                })),
            })),
        }))
    }

    /// Creates `void 0` expression (undefined).
    fn create_void_zero(&self) -> Box<Expr> {
        Box::new(Expr::Unary(UnaryExpr {
            span: DUMMY_SP,
            op: UnaryOp::Void,
            arg: Box::new(Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: 0.0,
                raw: None,
            }))),
        }))
    }

    /// Transforms an optional member expression.
    fn transform_optional_member(
        &mut self,
        obj: Box<Expr>,
        prop: MemberProp,
        optional: bool,
    ) -> Box<Expr> {
        if !optional {
            // Not optional, return as regular member expression
            return Box::new(Expr::Member(MemberExpr {
                span: DUMMY_SP,
                obj,
                prop,
            }));
        }

        // Check if we need a temporary variable (for complex expressions)
        let (check_expr, access_expr) = if self.needs_temp_var(&obj) {
            let temp_var = self.generate_temp_var();
            let temp_ident = Box::new(Expr::Ident(temp_var.clone()));

            // Create assignment: (_temp = obj)
            let assign_expr = Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: AssignOp::Assign,
                left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent::from(temp_var))),
                right: obj,
            }));

            (assign_expr, temp_ident)
        } else {
            (obj.clone(), obj)
        };

        // Create: check === null || check === void 0 ? void 0 : access.prop
        Box::new(Expr::Cond(CondExpr {
            span: DUMMY_SP,
            test: self.create_null_check(check_expr),
            cons: self.create_void_zero(),
            alt: Box::new(Expr::Member(MemberExpr {
                span: DUMMY_SP,
                obj: access_expr,
                prop,
            })),
        }))
    }

    /// Transforms an optional call expression.
    fn transform_optional_call(
        &mut self,
        callee: Callee,
        args: Vec<ExprOrSpread>,
        optional: bool,
    ) -> Box<Expr> {
        if !optional {
            // Not optional, return as regular call
            return Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee,
                args,
                ..Default::default()
            }));
        }

        match callee {
            Callee::Expr(expr) => {
                // Check if we need a temporary variable
                let (check_expr, call_expr) = if self.needs_temp_var(&expr) {
                    let temp_var = self.generate_temp_var();
                    let temp_ident = Box::new(Expr::Ident(temp_var.clone()));

                    let assign_expr = Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        op: AssignOp::Assign,
                        left: AssignTarget::Simple(SimpleAssignTarget::Ident(BindingIdent::from(
                            temp_var,
                        ))),
                        right: expr,
                    }));

                    (assign_expr, temp_ident)
                } else {
                    (expr.clone(), expr)
                };

                // Create: check === null || check === void 0 ? void 0 : call(args)
                Box::new(Expr::Cond(CondExpr {
                    span: DUMMY_SP,
                    test: self.create_null_check(check_expr),
                    cons: self.create_void_zero(),
                    alt: Box::new(Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: Callee::Expr(call_expr),
                        args,
                        ..Default::default()
                    })),
                }))
            }
            _ => {
                // For other callee types, just return a regular call
                Box::new(Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee,
                    args,
                    ..Default::default()
                }))
            }
        }
    }

    /// Checks if an expression needs a temporary variable to avoid
    /// re-evaluation.
    fn needs_temp_var(&self, expr: &Expr) -> bool {
        !matches!(expr, Expr::Ident(_) | Expr::This(_) | Expr::Lit(_))
    }
}

impl Default for OptionalChaining {
    fn default() -> Self {
        Self::new()
    }
}

impl VisitMut for OptionalChaining {
    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        // Visit children first
        expr.visit_mut_children_with(self);

        // Transform optional chaining expressions
        if let Expr::OptChain(opt_chain) = expr {
            match opt_chain.base.as_ref() {
                OptChainBase::Member(member_expr) => {
                    *expr = *self.transform_optional_member(
                        member_expr.obj.clone(),
                        member_expr.prop.clone(),
                        opt_chain.optional,
                    );
                }
                OptChainBase::Call(opt_call) => {
                    *expr = *self.transform_optional_call(
                        Callee::Expr(opt_call.callee.clone()),
                        opt_call.args.clone(),
                        opt_chain.optional,
                    );
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use std::{io, path::PathBuf, sync::Arc};

    use swc_common::{errors::Handler, sync::Lrc, FileName, SourceMap};

    use super::*;
    use crate::TransformCtx;

    fn create_test_ctx() -> TransformCtx {
        let source_map_lrc = Lrc::new(SourceMap::default());
        let source_file =
            source_map_lrc.new_source_file(Lrc::new(FileName::Anon), "const x = 1;".to_string());

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

    #[test]
    fn test_optional_chaining_creation() {
        let transformer = OptionalChaining::new();
        assert_eq!(transformer.temp_var_counter, 0);
    }

    #[test]
    fn test_needs_temp_var() {
        let transformer = OptionalChaining::new();

        // Identifiers don't need temp vars
        let ident = Expr::Ident(Ident {
            span: DUMMY_SP,
            ctxt: Default::default(),
            sym: "foo".into(),
            optional: false,
        });
        assert!(!transformer.needs_temp_var(&ident));

        // This doesn't need temp var
        let this_expr = Expr::This(ThisExpr { span: DUMMY_SP });
        assert!(!transformer.needs_temp_var(&this_expr));

        // Member expressions need temp vars
        let member = Expr::Member(MemberExpr {
            span: DUMMY_SP,
            obj: Box::new(ident.clone()),
            prop: MemberProp::Ident(IdentName {
                span: DUMMY_SP,
                sym: "bar".into(),
            }),
        });
        assert!(transformer.needs_temp_var(&member));
    }

    #[test]
    fn test_create_null_check() {
        let transformer = OptionalChaining::new();
        let ident = Box::new(Expr::Ident(Ident {
            span: DUMMY_SP,
            ctxt: Default::default(),
            sym: "foo".into(),
            optional: false,
        }));

        let check = transformer.create_null_check(ident);

        // Should be a binary OR expression
        if let Expr::Bin(bin_expr) = *check {
            assert_eq!(bin_expr.op, BinaryOp::LogicalOr);
        } else {
            panic!("Expected binary expression");
        }
    }

    #[test]
    fn test_transform_program() {
        let mut transformer = OptionalChaining::new();
        let mut ctx = create_test_ctx();

        let mut program = Program::Module(Module {
            span: DUMMY_SP,
            body: vec![],
            shebang: None,
        });

        transformer.transform_program(&mut program, &mut ctx);
        // Should not panic
    }
}
