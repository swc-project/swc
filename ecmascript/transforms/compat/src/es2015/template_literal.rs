use std::{iter, mem};
use swc_atoms::js_word;
use swc_common::{BytePos, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::is_literal;
use swc_ecma_utils::prepend_stmts;
use swc_ecma_utils::private_ident;
use swc_ecma_utils::quote_ident;
use swc_ecma_utils::ExprFactory;
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

pub fn template_literal() -> impl Fold {
    TemplateLiteral {
        added: Default::default(),
    }
}

struct TemplateLiteral {
    added: Vec<Stmt>,
}

impl Fold for TemplateLiteral {
    noop_fold_type!();

    fn fold_expr(&mut self, e: Expr) -> Expr {
        let e = e.fold_children_with(self);

        match e {
            Expr::Tpl(Tpl {
                span,
                exprs,
                quasis,
                ..
            }) => {
                assert_eq!(quasis.len(), exprs.len() + 1);

                // TODO: Optimize

                // This makes result of addition string
                let mut obj: Box<Expr> = Box::new(
                    Lit::Str({
                        let should_remove_kind =
                            quasis[0].raw.value.contains('\r') || quasis[0].raw.value.contains('`');

                        let mut s = quasis[0]
                            .cooked
                            .clone()
                            .unwrap_or_else(|| quasis[0].raw.clone());

                        // See https://github.com/swc-project/swc/issues/1488
                        //
                        // This is hack to prevent '\\`'. Hack is used to avoid breaking
                        // change of ast crate.
                        if should_remove_kind {
                            s.kind = Default::default();
                            s.has_escape = false;
                        }

                        s
                    })
                    .into(),
                );

                let len = quasis.len() + exprs.len();

                let mut args = vec![];
                let mut quasis = quasis.into_iter();
                let mut exprs = exprs.into_iter();

                for i in 0..len {
                    if i == 0 {
                        quasis.next();
                        continue;
                    }
                    let last = i == len - 1;

                    let expr = if i % 2 == 0 {
                        // Quasis

                        match quasis.next() {
                            Some(TplElement { cooked, raw, .. }) => {
                                let should_remove_kind =
                                    raw.value.contains('\r') || raw.value.contains('`');
                                let mut s = cooked.unwrap_or_else(|| raw);
                                // See https://github.com/swc-project/swc/issues/1488
                                //
                                // This is hack to prevent '\\`'. Hack is used to avoid breaking
                                // change of ast crate.
                                if should_remove_kind {
                                    s.kind = Default::default();
                                }
                                Box::new(Lit::Str(s).into())
                            }
                            _ => unreachable!(),
                        }
                    } else {
                        // Expression
                        exprs.next().unwrap()
                    };

                    // obj = box Expr::Bin(BinExpr {
                    //     span: expr.span(),
                    //     left: obj,
                    //     op: op!(bin, "+"),
                    //     right: expr.into(),
                    // });
                    let expr_span = expr.span();

                    // We can optimize if expression is a literal or ident
                    let is_lit = is_literal(&expr);

                    if is_lit {
                        let is_empty = match *expr {
                            Expr::Lit(Lit::Str(Str {
                                value: js_word!(""),
                                ..
                            })) => true,
                            _ => false,
                        };

                        if !is_empty && args.is_empty() {
                            if let Expr::Lit(Lit::Str(Str {
                                span,
                                value,
                                has_escape,
                                kind,
                            })) = *obj
                            {
                                match *expr {
                                    Expr::Lit(Lit::Str(Str {
                                        span: r_span,
                                        value: r_value,
                                        has_escape: r_has_escape,
                                        kind: _,
                                    })) => {
                                        obj = Box::new(Expr::Lit(Lit::Str(Str {
                                            span: span.with_hi(r_span.hi()),
                                            value: format!("{}{}", value, r_value).into(),
                                            has_escape: has_escape || r_has_escape,
                                            kind: Default::default(),
                                        })));
                                        continue;
                                    }
                                    _ => {
                                        obj = Box::new(Expr::Lit(Lit::Str(Str {
                                            span,
                                            value,
                                            has_escape,
                                            kind,
                                        })));
                                    }
                                }
                            }
                        }

                        if !is_empty {
                            args.push(ExprOrSpread { expr, spread: None });
                        }

                        if last && !args.is_empty() {
                            obj = Box::new(Expr::Call(CallExpr {
                                span: span.with_hi(expr_span.hi() + BytePos(1)),
                                callee: ExprOrSuper::Expr(Box::new(Expr::Member(MemberExpr {
                                    span: DUMMY_SP,
                                    obj: ExprOrSuper::Expr(obj),
                                    prop: Box::new(Expr::Ident(Ident::new(
                                        js_word!("concat"),
                                        expr_span,
                                    ))),

                                    computed: false,
                                }))),
                                args: mem::replace(&mut args, vec![]),
                                type_args: Default::default(),
                            }));
                        }
                    } else {
                        if !args.is_empty() {
                            obj = Box::new(Expr::Call(CallExpr {
                                span: span.with_hi(expr_span.hi() + BytePos(1)),
                                callee: ExprOrSuper::Expr(Box::new(Expr::Member(MemberExpr {
                                    span: DUMMY_SP,
                                    obj: ExprOrSuper::Expr(obj),
                                    prop: Box::new(Expr::Ident(Ident::new(
                                        js_word!("concat"),
                                        expr_span,
                                    ))),

                                    computed: false,
                                }))),
                                args: mem::replace(&mut args, vec![]),
                                type_args: Default::default(),
                            }));
                        }
                        debug_assert!(args.is_empty());

                        args.push(ExprOrSpread { expr, spread: None });
                    }
                }

                //                if !args.is_empty() {
                //                    obj = box validate!(Expr::Call(CallExpr {
                //                        span: span.with_hi(expr_span.hi() + BytePos(1)),
                //                        callee: ExprOrSuper::Expr(box Expr::Member(MemberExpr
                // {                            span: DUMMY_SP,
                //                            obj: ExprOrSuper::Expr(validate!(obj)),
                //                            prop: box
                // Expr::Ident(Ident::new(js_word!("concat"), expr_span)),
                //
                //                            computed: false,
                //                        })),
                //                        args: mem::replace(&mut args, vec![]),
                //                        type_args: Default::default(),
                //                    }));
                //                }

                *obj
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
                                    callee: helper!(
                                        tagged_template_literal,
                                        "taggedTemplateLiteral"
                                    ),
                                    args: {
                                        let has_escape = quasis.iter().any(|s| {
                                            s.cooked.as_ref().map(|s| s.has_escape).unwrap_or(true)
                                        });

                                        let raw = if has_escape {
                                            Some(
                                                ArrayLit {
                                                    span: DUMMY_SP,
                                                    elems: quasis
                                                        .iter()
                                                        .cloned()
                                                        .map(|elem| Lit::Str(elem.raw).as_arg())
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
                                                    .into_iter()
                                                    .map(|elem| {
                                                        Lit::Str(elem.cooked.unwrap_or(elem.raw))
                                                            .as_arg()
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

                Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: tag.as_callee(),
                    args: iter::once(
                        Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: fn_ident.as_callee(),
                            args: vec![],
                            type_args: Default::default(),
                        })
                        .as_arg(),
                    )
                    .chain(exprs.into_iter().map(|e| e.as_arg()))
                    .collect(),
                    type_args: Default::default(),
                })
            }

            _ => e,
        }
    }

    fn fold_module(&mut self, m: Module) -> Module {
        let mut body = m.body.fold_children_with(self);

        prepend_stmts(&mut body, self.added.drain(..).map(ModuleItem::from_stmt));

        Module { body, ..m }
    }

    fn fold_script(&mut self, m: Script) -> Script {
        let mut body = m.body.fold_children_with(self);

        prepend_stmts(&mut body, self.added.drain(..));

        Script { body, ..m }
    }
}
