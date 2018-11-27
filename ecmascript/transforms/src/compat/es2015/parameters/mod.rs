use ast::*;
use crate::util::ExprFactory;
use swc_common::{Fold, FoldWith, Mark, Spanned, DUMMY_SP};

#[cfg(test)]
mod tests;

pub fn parameters() -> impl Fold<Module> {
    Params
}

struct Params;

impl Params {
    fn fold_fn_like(&mut self, ps: Vec<Pat>, body: BlockStmt) -> (Vec<Pat>, BlockStmt) {
        let mut params = vec![];
        let mut decls = vec![];
        let mut unpack_rest = None;

        for (i, param) in ps.into_iter().enumerate() {
            let span = param.span();

            match param {
                Pat::Ident(..) => params.push(param),
                Pat::Array(..) | Pat::Object(..) => {
                    let mark = Mark::fresh(Mark::root());
                    let binding = quote_ident!(span.apply_mark(mark), "param");

                    params.push(Pat::Ident(binding.clone()));
                    decls.push(VarDeclarator {
                        span,
                        name: param,
                        init: Some(box Expr::Ident(binding)),
                    })
                }
                Pat::Assign(..) => {
                    let mark = Mark::fresh(Mark::root());
                    let binding = quote_ident!(span.apply_mark(mark), "param");

                    params.push(Pat::Ident(binding.clone()));
                    // This expands to invalid code, but is fixed by destructing pass
                    decls.push(VarDeclarator {
                        span,
                        name: param,
                        init: Some(box Expr::Ident(binding)),
                    })
                }
                Pat::Rest(RestPat { dot3_token: _, arg }) => {
                    // Inject a for statement
                    //
                    // for(var _len = arguments.length, a1 = new Array(_len), _key = 0; _key <
                    // _len; _key++){
                    //      a1[_key] = arguments[_key];
                    // }
                    assert!(unpack_rest.is_none());
                    let mark = Mark::fresh(Mark::root());
                    let idx_ident = quote_ident!(span.apply_mark(mark), "_key");
                    let len_ident = quote_ident!(span.apply_mark(mark), "_len");

                    let arg = match *arg {
                        Pat::Ident(ident) => ident,
                        _ => unreachable!("unknown rest pattern `...{:?}`", arg),
                    };

                    let make_minus_i = |ident: &Ident, min_zero: bool| -> Expr {
                        if i == 0 {
                            // `len`
                            ident.clone().into()
                        } else {
                            // `len - $i`
                            let bin: Expr = BinExpr {
                                span,
                                left: box Expr::Ident(ident.clone()),
                                op: op!(bin, "-"),
                                right: box Expr::Lit(Lit::Num(Number {
                                    span,
                                    value: i as f64,
                                })),
                            }
                            .into();
                            if !min_zero {
                                return bin;
                            }

                            Expr::Cond(CondExpr {
                                span,
                                test: box BinExpr {
                                    span,
                                    left: box len_ident.clone().into(),
                                    op: op!(">"),
                                    right: box Expr::Lit(Lit::Num(Number {
                                        span,
                                        value: i as _,
                                    })),
                                }
                                .into(),
                                cons: box bin,
                                alt: box Expr::Lit(Lit::Num(Number { span, value: 0.0 })),
                            })
                        }
                    };

                    unpack_rest = Some(Stmt::For(ForStmt {
                        span,
                        init: Some(VarDeclOrExpr::VarDecl(VarDecl {
                            kind: VarDeclKind::Let,
                            span,
                            decls: vec![
                                // _len = arguments.length - i
                                VarDeclarator {
                                    span,
                                    name: Pat::Ident(len_ident.clone()),
                                    init: Some(member_expr!(span, arguments.length)),
                                },
                                // a1 = new Array(_len - $i)
                                VarDeclarator {
                                    span,
                                    name: Pat::Ident(arg.clone()),
                                    init: Some(box Expr::New(NewExpr {
                                        span,
                                        callee: box quote_ident!("Array").into(),
                                        args: Some(vec![{
                                            // `len` or  `len - $i`
                                            make_minus_i(&len_ident, true).as_arg()
                                        }]),
                                    })),
                                },
                                // _key = 0
                                VarDeclarator {
                                    span,
                                    name: Pat::Ident(idx_ident.clone().into()),
                                    init: Some(box Expr::Lit(Lit::Num(Number {
                                        span,
                                        value: i as f64,
                                    }))),
                                },
                            ],
                        })),
                        // `_key < _len`
                        test: Some(box Expr::Bin(BinExpr {
                            span,
                            left: box idx_ident.clone().into(),
                            op: op!("<"),
                            right: box len_ident.clone().into(),
                        })),
                        // _key++
                        update: Some(box Expr::Update(UpdateExpr {
                            span,
                            op: op!("++"),
                            prefix: false,
                            arg: box idx_ident.clone().into(),
                        })),
                        body: box Stmt::Block(BlockStmt {
                            span,
                            stmts: vec![{
                                let prop = box Expr::Ident(idx_ident.clone());
                                // a1[_key - i] = arguments[_key];
                                Stmt::Expr(box Expr::Assign(AssignExpr {
                                    span,
                                    left: PatOrExpr::Expr(
                                        box MemberExpr {
                                            span,
                                            obj: ExprOrSuper::Expr(box Expr::Ident(arg)),
                                            computed: true,
                                            prop: box make_minus_i(&idx_ident, false),
                                        }
                                        .into(),
                                    ),
                                    op: op!("="),
                                    right: box MemberExpr {
                                        span,
                                        obj: ExprOrSuper::Expr(
                                            box quote_ident!(span, "arguments").into(),
                                        ),
                                        computed: true,
                                        prop,
                                    }
                                    .into(),
                                }))
                            }],
                        }),
                    }))
                }
                _ => params.push(param),
            }
        }

        let stmts = if decls.is_empty() {
            None
        } else {
            Some(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Let,
                decls,
            })))
        }
        .into_iter()
        .chain(unpack_rest)
        .chain(body.stmts)
        .collect();

        (
            params,
            BlockStmt {
                span: DUMMY_SP,
                stmts,
            },
        )
    }
}

impl Fold<SetterProp> for Params {
    fn fold(&mut self, f: SetterProp) -> SetterProp {
        let f = f.fold_children(self);

        let (mut params, body) = self.fold_fn_like(vec![f.param], f.body);
        assert!(params.len() == 1);
        // TODO(kdy1): Remove this. Ideally this should be handle by then()
        let body = body.fold_with(&mut crate::compat::es2015::destructuring());

        let param = params.pop().unwrap();
        SetterProp { param, body, ..f }
    }
}

impl Fold<Function> for Params {
    fn fold(&mut self, f: Function) -> Function {
        let f = f.fold_children(self);

        let (params, body) = self.fold_fn_like(f.params, f.body);

        Function { params, body, ..f }
    }
}
