use rustc_hash::FxHashMap;
use swc_common::{Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::quote_ident;

use crate::context::TraverseCtx;

/// Enum member values (or None if it can't be evaluated at build time) keyed
/// by names
type PrevMembers = FxHashMap<Id, Option<ConstantValue>>;

pub struct TypeScriptEnum {
    enums: FxHashMap<Id, PrevMembers>,
}

impl TypeScriptEnum {
    pub fn new() -> Self {
        Self {
            enums: FxHashMap::default(),
        }
    }
}

impl Default for TypeScriptEnum {
    fn default() -> Self {
        Self::new()
    }
}

impl TypeScriptEnum {
    /// Entry point for transforming enum declarations within statements.
    ///
    /// This method is called by the TypeScript transform to handle enum
    /// declarations.
    pub fn enter_statement(&mut self, _stmt: &mut Stmt, _ctx: &mut TraverseCtx) {
        // Enum transformations are now handled at a higher level
        // in the TypeScript module via enter_program
    }

    /// ```TypeScript
    /// enum Foo {
    ///   X = 1,
    ///   Y
    /// }
    /// ```
    /// ```JavaScript
    /// var Foo = ((Foo) => {
    ///   Foo[Foo["X"] = 1] = "X";
    ///   Foo[Foo["Y"] = 2] = "Y";
    ///   return Foo;
    /// })(Foo || {});
    /// ```
    fn transform_ts_enum(
        &mut self,
        decl: &mut Box<TsEnumDecl>,
        export_span: Option<Span>,
    ) -> Option<Stmt> {
        if decl.declare {
            return None;
        }

        let is_export = export_span.is_some();
        let enum_name = decl.id.sym.clone();
        let enum_id = decl.id.to_id();

        // Check if enum has potential side effects
        let has_potential_side_effect = decl.members.iter().any(|member| {
            member
                .init
                .as_ref()
                .map_or(false, |init| matches!(**init, Expr::New(_) | Expr::Call(_)))
        });

        // Transform enum members
        let statements = self.transform_ts_enum_members(&mut decl.members, &enum_name);

        // Create IIFE: ((Foo) => { ... })(Foo || {})
        let params = vec![Param {
            span: DUMMY_SP,
            decorators: vec![],
            pat: Pat::Ident(BindingIdent {
                id: quote_ident!(enum_name.clone()),
                type_ann: None,
            }),
        }];

        let body = BlockStmt {
            span: decl.span,
            stmts: statements,
        };

        let callee = Expr::Arrow(ArrowExpr {
            span: DUMMY_SP,
            params,
            body: Box::new(BlockStmtOrExpr::BlockStmt(body)),
            is_async: false,
            is_generator: false,
            type_params: None,
            return_type: None,
        });

        // Foo || {}
        let arguments = vec![ExprOrSpread {
            spread: None,
            expr: Box::new(Expr::Bin(BinExpr {
                span: DUMMY_SP,
                op: BinaryOp::LogicalOr,
                left: Box::new(Expr::Ident(quote_ident!(enum_name.clone()))),
                right: Box::new(Expr::Object(ObjectLit {
                    span: DUMMY_SP,
                    props: vec![],
                })),
            })),
        }];

        let call_expression = Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: Callee::Expr(Box::new(callee)),
            args: arguments,
            type_args: None,
        });

        // Create variable declaration
        let kind = if is_export {
            VarDeclKind::Let
        } else {
            VarDeclKind::Var
        };

        let decls = vec![VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(BindingIdent {
                id: decl.id.clone(),
                type_ann: None,
            }),
            init: Some(Box::new(call_expression)),
            definite: false,
        }];

        let variable_declaration = VarDecl {
            span: decl.span,
            kind,
            declare: false,
            decls,
        };

        if export_span.is_some() {
            Some(Stmt::Decl(Decl::Var(Box::new(variable_declaration))))
        } else {
            Some(Stmt::Decl(Decl::Var(Box::new(variable_declaration))))
        }
    }

    fn transform_ts_enum_members(
        &mut self,
        members: &mut Vec<TsEnumMember>,
        enum_name: &str,
    ) -> Vec<Stmt> {
        let mut statements = Vec::new();

        // If enum member has no initializer, its value will be the previous member
        // value + 1, if it's the first member, it will be `0`.
        let mut prev_constant_number = Some(-1.0);
        let enum_id = (enum_name.to_string().into(), Default::default());
        let mut previous_enum_members = self.enums.entry(enum_id.clone()).or_default().clone();

        let mut prev_member_name: Option<String> = None;

        for member in members.iter_mut() {
            let member_name = match &member.id {
                TsEnumMemberId::Ident(ident) => ident.sym.to_string(),
                TsEnumMemberId::Str(s) => s.value.to_string(),
            };

            let member_id = (member_name.clone().into(), Default::default());

            let init = if let Some(initializer) = &mut member.init {
                let constant_value =
                    self.computed_constant_value(initializer, &previous_enum_members);

                previous_enum_members.insert(member_id.clone(), constant_value);

                match constant_value {
                    None => {
                        prev_constant_number = None;
                        // TODO: Rename identifier references in the initializer
                        *initializer.clone()
                    }
                    Some(constant_value) => match constant_value {
                        ConstantValue::Number(v) => {
                            prev_constant_number = Some(v);
                            Self::get_initializer_expr(v)
                        }
                        ConstantValue::String(str) => {
                            prev_constant_number = None;
                            Expr::Lit(Lit::Str(Str {
                                span: DUMMY_SP,
                                value: str.into(),
                                raw: None,
                            }))
                        }
                    },
                }
            } else if let Some(value) = prev_constant_number {
                let value = value + 1.0;
                prev_constant_number = Some(value);
                previous_enum_members.insert(member_id.clone(), Some(ConstantValue::Number(value)));
                Self::get_number_literal_expression(value)
            } else if let Some(ref prev_name) = prev_member_name {
                previous_enum_members.insert(member_id.clone(), None);

                // 1 + Foo["x"]
                let self_ref = Expr::Member(MemberExpr {
                    span: DUMMY_SP,
                    obj: Box::new(Expr::Ident(quote_ident!(enum_name.to_string()))),
                    prop: MemberProp::Computed(ComputedPropName {
                        span: DUMMY_SP,
                        expr: Box::new(Expr::Lit(Lit::Str(Str {
                            span: DUMMY_SP,
                            value: prev_name.clone().into(),
                            raw: None,
                        }))),
                    }),
                });

                Expr::Bin(BinExpr {
                    span: DUMMY_SP,
                    op: BinaryOp::Add,
                    left: Box::new(Self::get_number_literal_expression(1.0)),
                    right: Box::new(self_ref),
                })
            } else {
                previous_enum_members.insert(member_id.clone(), Some(ConstantValue::Number(0.0)));
                Self::get_number_literal_expression(0.0)
            };

            let is_str = matches!(init, Expr::Lit(Lit::Str(_)));

            // Foo["x"] = init
            let member_expr = MemberExpr {
                span: DUMMY_SP,
                obj: Box::new(Expr::Ident(quote_ident!(enum_name.to_string()))),
                prop: MemberProp::Computed(ComputedPropName {
                    span: DUMMY_SP,
                    expr: Box::new(Expr::Lit(Lit::Str(Str {
                        span: DUMMY_SP,
                        value: member_name.clone().into(),
                        raw: None,
                    }))),
                }),
            };

            let mut expr = Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: AssignOp::Assign,
                left: AssignTarget::Simple(SimpleAssignTarget::Member(member_expr)),
                right: Box::new(init),
            });

            // Foo[Foo["x"] = init] = "x"
            if !is_str {
                let member_expr = MemberExpr {
                    span: DUMMY_SP,
                    obj: Box::new(Expr::Ident(quote_ident!(enum_name.to_string()))),
                    prop: MemberProp::Computed(ComputedPropName {
                        span: DUMMY_SP,
                        expr: Box::new(expr),
                    }),
                };

                expr = Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: AssignTarget::Simple(SimpleAssignTarget::Member(member_expr)),
                    right: Box::new(Expr::Lit(Lit::Str(Str {
                        span: DUMMY_SP,
                        value: member_name.clone().into(),
                        raw: None,
                    }))),
                });
            }

            prev_member_name = Some(member_name);
            statements.push(Stmt::Expr(ExprStmt {
                span: member.span,
                expr: Box::new(expr),
            }));
        }

        self.enums.insert(enum_id, previous_enum_members);

        // return Foo;
        statements.push(Stmt::Return(ReturnStmt {
            span: DUMMY_SP,
            arg: Some(Box::new(Expr::Ident(quote_ident!(enum_name.to_string())))),
        }));

        statements
    }

    fn get_number_literal_expression(value: f64) -> Expr {
        Expr::Lit(Lit::Num(Number {
            span: DUMMY_SP,
            value,
            raw: None,
        }))
    }

    fn get_initializer_expr(value: f64) -> Expr {
        let is_negative = value < 0.0;

        // Infinity
        let expr = if value.is_infinite() {
            Expr::Ident(quote_ident!("Infinity"))
        } else {
            let value = if is_negative { -value } else { value };
            Self::get_number_literal_expression(value)
        };

        if is_negative {
            Expr::Unary(UnaryExpr {
                span: DUMMY_SP,
                op: UnaryOp::Minus,
                arg: Box::new(expr),
            })
        } else {
            expr
        }
    }
}

#[derive(Debug, Clone)]
enum ConstantValue {
    Number(f64),
    String(String),
}

impl TypeScriptEnum {
    /// Evaluate the expression to a constant value.
    /// Refer to [babel](https://github.com/babel/babel/blob/610897a9a96c5e344e77ca9665df7613d2f88358/packages/babel-plugin-transform-typescript/src/enum.ts#L241C1-L394C2)
    fn computed_constant_value(
        &self,
        expr: &Expr,
        prev_members: &PrevMembers,
    ) -> Option<ConstantValue> {
        self.evaluate(expr, prev_members)
    }

    fn evaluate_ref(&self, expr: &Expr, prev_members: &PrevMembers) -> Option<ConstantValue> {
        match expr {
            Expr::Member(member_expr) => {
                let Expr::Ident(ident) = &*member_expr.obj else {
                    return None;
                };
                let members = self.enums.get(&ident.to_id())?;
                let property_name = match &member_expr.prop {
                    MemberProp::Ident(ident) => ident.sym.to_string(),
                    MemberProp::Computed(computed) => {
                        if let Expr::Lit(Lit::Str(s)) = &*computed.expr {
                            s.value.to_string()
                        } else {
                            return None;
                        }
                    }
                    _ => return None,
                };
                let property_id = (property_name.into(), Default::default());
                *members.get(&property_id)?
            }
            Expr::Ident(ident) => {
                if ident.sym == *"Infinity" {
                    return Some(ConstantValue::Number(f64::INFINITY));
                } else if ident.sym == *"NaN" {
                    return Some(ConstantValue::Number(f64::NAN));
                }

                if let Some(value) = prev_members.get(&ident.to_id()) {
                    return *value;
                }

                None
            }
            _ => None,
        }
    }

    fn evaluate(&self, expr: &Expr, prev_members: &PrevMembers) -> Option<ConstantValue> {
        match expr {
            Expr::Ident(_) | Expr::Member(_) => self.evaluate_ref(expr, prev_members),
            Expr::Bin(bin_expr) => self.eval_binary_expression(bin_expr, prev_members),
            Expr::Unary(unary_expr) => self.eval_unary_expression(unary_expr, prev_members),
            Expr::Lit(Lit::Num(num)) => Some(ConstantValue::Number(num.value)),
            Expr::Lit(Lit::Str(s)) => Some(ConstantValue::String(s.value.to_string())),
            Expr::Tpl(tpl) => {
                if tpl.exprs.is_empty() {
                    // Simple template literal with no expressions
                    if let Some(quasi) = tpl.quasis.first() {
                        return Some(ConstantValue::String(quasi.raw.to_string()));
                    }
                }

                let mut value = String::new();
                for (i, quasi) in tpl.quasis.iter().enumerate() {
                    value.push_str(&quasi.raw);
                    if i < tpl.exprs.len() {
                        match self.evaluate(&tpl.exprs[i], prev_members)? {
                            ConstantValue::String(s) => value.push_str(&s),
                            ConstantValue::Number(num) => value.push_str(&num.to_string()),
                        }
                    }
                }
                Some(ConstantValue::String(value))
            }
            Expr::Paren(paren) => self.evaluate(&paren.expr, prev_members),
            _ => None,
        }
    }

    fn eval_binary_expression(
        &self,
        expr: &BinExpr,
        prev_members: &PrevMembers,
    ) -> Option<ConstantValue> {
        let left = self.evaluate(&expr.left, prev_members)?;
        let right = self.evaluate(&expr.right, prev_members)?;

        if matches!(expr.op, BinaryOp::Add)
            && (matches!(left, ConstantValue::String(_))
                || matches!(right, ConstantValue::String(_)))
        {
            let left_string = match left {
                ConstantValue::String(s) => s,
                ConstantValue::Number(v) => v.to_string(),
            };

            let right_string = match right {
                ConstantValue::String(s) => s,
                ConstantValue::Number(v) => v.to_string(),
            };

            return Some(ConstantValue::String(format!(
                "{}{}",
                left_string, right_string
            )));
        }

        let left = match left {
            ConstantValue::Number(v) => v,
            ConstantValue::String(_) => return None,
        };

        let right = match right {
            ConstantValue::Number(v) => v,
            ConstantValue::String(_) => return None,
        };

        match expr.op {
            BinaryOp::RShift => Some(ConstantValue::Number(
                ((left as i32).wrapping_shr((right as u32) & 0x1f)) as f64,
            )),
            BinaryOp::ZeroFillRShift => Some(ConstantValue::Number(
                ((left as u32).wrapping_shr((right as u32) & 0x1f)) as f64,
            )),
            BinaryOp::LShift => Some(ConstantValue::Number(
                ((left as i32).wrapping_shl((right as u32) & 0x1f)) as f64,
            )),
            BinaryOp::BitXor => Some(ConstantValue::Number(
                ((left as i32) ^ (right as i32)) as f64,
            )),
            BinaryOp::BitOr => Some(ConstantValue::Number(
                ((left as i32) | (right as i32)) as f64,
            )),
            BinaryOp::BitAnd => Some(ConstantValue::Number(
                ((left as i32) & (right as i32)) as f64,
            )),
            BinaryOp::Mul => Some(ConstantValue::Number(left * right)),
            BinaryOp::Div => Some(ConstantValue::Number(left / right)),
            BinaryOp::Add => Some(ConstantValue::Number(left + right)),
            BinaryOp::Sub => Some(ConstantValue::Number(left - right)),
            BinaryOp::Mod => Some(ConstantValue::Number(left % right)),
            BinaryOp::Exp => Some(ConstantValue::Number(left.powf(right))),
            _ => None,
        }
    }

    fn eval_unary_expression(
        &self,
        expr: &UnaryExpr,
        prev_members: &PrevMembers,
    ) -> Option<ConstantValue> {
        let value = self.evaluate(&expr.arg, prev_members)?;

        let value = match value {
            ConstantValue::Number(value) => value,
            ConstantValue::String(_) => {
                let value = if expr.op == UnaryOp::Minus {
                    ConstantValue::Number(f64::NAN)
                } else if expr.op == UnaryOp::Tilde {
                    ConstantValue::Number(-1.0)
                } else {
                    value
                };
                return Some(value);
            }
        };

        match expr.op {
            UnaryOp::Plus => Some(ConstantValue::Number(value)),
            UnaryOp::Minus => Some(ConstantValue::Number(-value)),
            UnaryOp::Tilde => Some(ConstantValue::Number((!(value as i32)) as f64)),
            _ => None,
        }
    }
}
