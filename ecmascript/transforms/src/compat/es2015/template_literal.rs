use crate::util::{ExprFactory, StmtLike};
use ast::*;
use std::iter;
use swc_atoms::js_word;
use swc_common::{BytePos, Fold, FoldWith, Spanned, DUMMY_SP};
#[cfg(test)]
mod tests;

#[derive(Default, Clone)]
pub struct TemplateLiteral {
    added: Vec<Stmt>,
}

impl<T: StmtLike> Fold<Vec<T>> for TemplateLiteral
where
    T: FoldWith<Self>,
    Vec<T>: FoldWith<Self>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        let mut buf = Vec::with_capacity(stmts.len());

        for stmt in stmts {
            let stmt = stmt.fold_with(self);
            buf.extend(self.added.drain(..).map(T::from_stmt));
            buf.push(stmt);
        }

        buf
    }
}

impl Fold<Expr> for TemplateLiteral {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = validate!(e);

        let e = e.fold_children(self);
        let e = validate!(e);

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
                let mut obj: Box<Expr> = box Lit::Str(
                    quasis[0]
                        .cooked
                        .clone()
                        .unwrap_or_else(|| quasis[0].raw.clone()),
                )
                .into();

                let len = quasis.len() + exprs.len();

                let mut quasis = quasis.into_iter();
                let mut exprs = exprs.into_iter();

                for i in 0..len {
                    if i == 0 {
                        quasis.next();
                        continue;
                    }

                    let expr = if i % 2 == 0 {
                        // Quasis

                        match quasis.next() {
                            // Skip empty ones
                            Some(TplElement {
                                raw:
                                    Str {
                                        value: js_word!(""),
                                        ..
                                    },
                                ..
                            }) => continue,
                            Some(TplElement { cooked, raw, .. }) => {
                                box Lit::Str(cooked.unwrap_or_else(|| raw)).into()
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

                    obj = box validate!(Expr::Call(CallExpr {
                        span: span.with_hi(expr.span().hi() + BytePos(1)),
                        callee: ExprOrSuper::Expr(box Expr::Member(MemberExpr {
                            span: DUMMY_SP,
                            obj: ExprOrSuper::Expr(validate!(obj)),
                            prop: box Expr::Ident(Ident::new(js_word!("concat"), expr.span())),

                            computed: false,
                        })),
                        args: vec![ExprOrSpread { expr, spread: None }],
                        type_args: Default::default(),
                    }));
                }
                validate!(*obj)
            }

            Expr::TaggedTpl(TaggedTpl {
                tag, exprs, quasis, ..
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
                                init: Some(box Expr::Call(CallExpr {
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
                                })),
                            }],
                        };

                        // _templateObject2 = function () {
                        //     return data;
                        // };
                        let assign_expr = {
                            Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(box fn_ident.clone().into()),
                                op: op!("="),
                                right: box Expr::Fn(FnExpr {
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
                                                arg: Some(box quote_ident!("data").into()),
                                            })],
                                        }),
                                        decorators: Default::default(),
                                        type_params: Default::default(),
                                        return_type: Default::default(),
                                    },
                                }),
                            })
                        };

                        Some(BlockStmt {
                            span: DUMMY_SP,

                            stmts: vec![
                                Stmt::Decl(Decl::Var(data_decl)),
                                Stmt::Expr(box assign_expr),
                                Stmt::Return(ReturnStmt {
                                    span: DUMMY_SP,
                                    arg: Some(box quote_ident!("data").into()),
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

                validate!(Expr::Call(CallExpr {
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
                }))
            }

            _ => e,
        }
    }
}
