use std::{iter, mem};

use serde::Deserialize;
use swc_atoms::js_word;
use swc_common::{util::take::Take, BytePos, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    is_literal, prepend_stmts, private_ident, quote_ident, undefined, ExprFactory, StmtLike,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

#[tracing::instrument(level = "info", skip_all)]
pub fn template_literal(c: Config) -> impl Fold + VisitMut {
    as_folder(TemplateLiteral {
        c,
        ..Default::default()
    })
}

#[derive(Default)]
struct TemplateLiteral {
    added: Vec<Stmt>,
    c: Config,
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub ignore_to_primitive: bool,
    #[serde(default)]
    pub mutable_template: bool,
}

#[swc_trace]
impl VisitMut for TemplateLiteral {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Tpl(Tpl {
                span,
                exprs,
                quasis,
                ..
            }) => {
                assert_eq!(quasis.len(), exprs.len() + 1);

                // This makes result of addition string
                let mut obj: Box<Expr> = Box::new(
                    Lit::Str({
                        let s = quasis[0]
                            .cooked
                            .clone()
                            .unwrap_or_else(|| quasis[0].raw.clone());

                        Str {
                            span: quasis[0].span,
                            value: s,
                            raw: None,
                        }
                    })
                    .into(),
                );

                let len = quasis.len() + exprs.len();

                let mut args = vec![];
                let mut quasis = quasis.iter_mut();
                let mut exprs = exprs.take().into_iter();

                for i in 0..len {
                    if i == 0 {
                        quasis.next();
                        continue;
                    }
                    let last = i == len - 1;

                    let expr = if i % 2 == 0 {
                        // Quasis
                        match quasis.next() {
                            Some(TplElement {
                                span, cooked, raw, ..
                            }) => {
                                let s = cooked.clone().unwrap_or_else(|| raw.clone());

                                Box::new(
                                    Lit::Str(Str {
                                        span: *span,
                                        value: s,
                                        raw: None,
                                    })
                                    .into(),
                                )
                            }
                            _ => unreachable!(),
                        }
                    } else {
                        // Expression
                        exprs.next().unwrap()
                    };

                    let expr_span = expr.span();

                    // We can optimize if expression is a literal or ident
                    let is_lit = is_literal(&expr);

                    if is_lit {
                        let is_empty = matches!(
                            *expr,
                            Expr::Lit(Lit::Str(Str {
                                value: js_word!(""),
                                ..
                            }))
                        );

                        if !is_empty && args.is_empty() {
                            if let Expr::Lit(Lit::Str(Str { span, value, raw })) = *obj {
                                match *expr {
                                    Expr::Lit(Lit::Str(Str {
                                        span: r_span,
                                        value: r_value,
                                        ..
                                    })) => {
                                        obj = Box::new(Expr::Lit(Lit::Str(Str {
                                            span: span.with_hi(r_span.hi()),
                                            raw: None,
                                            value: format!("{}{}", value, r_value).into(),
                                        })));
                                        continue;
                                    }
                                    _ => {
                                        obj =
                                            Box::new(Expr::Lit(Lit::Str(Str { span, raw, value })));
                                    }
                                }
                            }
                        }

                        if !is_empty {
                            args.push(expr);
                        }

                        if last && !args.is_empty() {
                            obj = if self.c.ignore_to_primitive {
                                let args = mem::take(&mut args);
                                for arg in args {
                                    obj = Box::new(Expr::Bin(BinExpr {
                                        span: span.with_hi(expr_span.hi() + BytePos(1)),
                                        op: op!(bin, "+"),
                                        left: obj,
                                        right: arg,
                                    }))
                                }
                                obj
                            } else {
                                Box::new(Expr::Call(CallExpr {
                                    span: span.with_hi(expr_span.hi() + BytePos(1)),
                                    callee: MemberExpr {
                                        span: DUMMY_SP,
                                        obj,
                                        prop: MemberProp::Ident(Ident::new(
                                            js_word!("concat"),
                                            expr_span,
                                        )),
                                    }
                                    .as_callee(),
                                    args: mem::take(&mut args)
                                        .into_iter()
                                        .map(|expr| expr.as_arg())
                                        .collect(),
                                    type_args: Default::default(),
                                }))
                            }
                        }
                    } else {
                        if !args.is_empty() {
                            obj = if self.c.ignore_to_primitive {
                                let args = mem::take(&mut args);
                                let len = args.len();
                                for arg in args {
                                    // for `${asd}a`
                                    if let Expr::Lit(Lit::Str(s)) = obj.as_ref() {
                                        if s.value.len() == 0 && len == 2 {
                                            obj = arg;
                                            continue;
                                        }
                                    }
                                    obj = Box::new(Expr::Bin(BinExpr {
                                        span: span.with_hi(expr_span.hi() + BytePos(1)),
                                        op: op!(bin, "+"),
                                        left: obj,
                                        right: arg,
                                    }))
                                }
                                obj
                            } else {
                                Box::new(Expr::Call(CallExpr {
                                    span: span.with_hi(expr_span.hi() + BytePos(1)),
                                    callee: MemberExpr {
                                        span: DUMMY_SP,
                                        obj,
                                        prop: MemberProp::Ident(Ident::new(
                                            js_word!("concat"),
                                            expr_span,
                                        )),
                                    }
                                    .as_callee(),
                                    args: mem::take(&mut args)
                                        .into_iter()
                                        .map(|expr| expr.as_arg())
                                        .collect(),
                                    type_args: Default::default(),
                                }))
                            };
                        }
                        debug_assert!(args.is_empty());

                        args.push(expr);
                    }
                }

                *e = *obj
            }

            Expr::TaggedTpl(TaggedTpl {
                tag,
                tpl: Tpl { exprs, quasis, .. },
                ..
            }) => {
                assert_eq!(quasis.len(), exprs.len() + 1);

                let fn_ident = private_ident!("_templateObject");

                let f = Function {
                    span: DUMMY_SP,
                    is_async: false,
                    is_generator: false,
                    params: vec![],
                    body: {
                        // const data = _taggedTemplateLiteral(["first", "second"]);
                        let data_decl = VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Const,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: quote_ident!("data").into(),
                                definite: false,
                                init: Some(Box::new(Expr::Call(CallExpr {
                                    span: DUMMY_SP,
                                    callee: if self.c.mutable_template {
                                        helper!(
                                            tagged_template_literal_loose,
                                            "taggedTemplateLiteralLoose"
                                        )
                                    } else {
                                        helper!(tagged_template_literal, "taggedTemplateLiteral")
                                    },
                                    args: {
                                        let has_escape =
                                            quasis.iter().any(|s| s.raw.contains('\\'));

                                        let raw = if has_escape {
                                            Some(
                                                ArrayLit {
                                                    span: DUMMY_SP,
                                                    elems: quasis
                                                        .iter()
                                                        .cloned()
                                                        .map(|elem| elem.raw.as_arg())
                                                        .map(Some)
                                                        .collect(),
                                                }
                                                .as_arg(),
                                            )
                                        } else {
                                            None
                                        };

                                        iter::once(
                                            ArrayLit {
                                                span: DUMMY_SP,
                                                elems: quasis
                                                    .take()
                                                    .into_iter()
                                                    .map(|elem| match elem.cooked {
                                                        Some(cooked) => cooked.as_arg(),
                                                        None => undefined(DUMMY_SP).as_arg(),
                                                    })
                                                    .map(Some)
                                                    .collect(),
                                            }
                                            .as_arg(),
                                        )
                                        .chain(raw)
                                        .collect()
                                    },
                                    type_args: Default::default(),
                                }))),
                            }],
                        };

                        // _templateObject2 = function () {
                        //     return data;
                        // };
                        let assign_expr = {
                            Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(Box::new(fn_ident.clone().into())),
                                op: op!("="),
                                right: Box::new(Expr::Fn(FnExpr {
                                    ident: None,
                                    function: Function {
                                        span: DUMMY_SP,
                                        is_async: false,
                                        is_generator: false,
                                        params: vec![],
                                        body: Some(BlockStmt {
                                            span: DUMMY_SP,
                                            stmts: vec![Stmt::Return(ReturnStmt {
                                                span: DUMMY_SP,
                                                arg: Some(Box::new(quote_ident!("data").into())),
                                            })],
                                        }),
                                        decorators: Default::default(),
                                        type_params: Default::default(),
                                        return_type: Default::default(),
                                    },
                                })),
                            })
                        };

                        Some(BlockStmt {
                            span: DUMMY_SP,

                            stmts: vec![
                                Stmt::Decl(Decl::Var(data_decl)),
                                assign_expr.into_stmt(),
                                Stmt::Return(ReturnStmt {
                                    span: DUMMY_SP,
                                    arg: Some(Box::new(quote_ident!("data").into())),
                                }),
                            ],
                        })
                    },
                    decorators: Default::default(),
                    type_params: Default::default(),
                    return_type: Default::default(),
                };
                self.added.push(Stmt::Decl(Decl::Fn(FnDecl {
                    declare: false,
                    ident: fn_ident.clone(),
                    function: f,
                })));

                *e = Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: tag.take().as_callee(),
                    args: iter::once(
                        CallExpr {
                            span: DUMMY_SP,
                            callee: fn_ident.as_callee(),
                            args: vec![],
                            type_args: Default::default(),
                        }
                        .as_arg(),
                    )
                    .chain(exprs.take().into_iter().map(|e| e.as_arg()))
                    .collect(),
                    type_args: Default::default(),
                })
            }

            _ => {}
        }
    }

    fn visit_mut_module(&mut self, m: &mut Module) {
        m.visit_mut_children_with(self);

        prepend_stmts(&mut m.body, self.added.drain(..).map(ModuleItem::from_stmt));
    }

    fn visit_mut_script(&mut self, m: &mut Script) {
        m.visit_mut_children_with(self);

        prepend_stmts(&mut m.body, self.added.drain(..));
    }
}
