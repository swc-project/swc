use arrayvec::ArrayVec;
use swc_common::{Mark, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::member_expr;
use swc_ecma_utils::prepend_stmts;
use swc_ecma_utils::private_ident;
use swc_ecma_utils::quote_ident;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

pub fn parameters() -> impl 'static + Fold {
    Params
}

#[derive(Clone, Copy)]
struct Params;
// prevent_recurse!(Params, Pat);

impl Params {
    fn fold_fn_like(&mut self, ps: Vec<Param>, body: BlockStmt) -> (Vec<Param>, BlockStmt) {
        let mut params = vec![];
        let mut decls = vec![];
        let mut unpack_rest = None;
        let mut decls_after_unpack = vec![];

        for (i, param) in ps.into_iter().enumerate() {
            let span = param.span();

            match param.pat {
                Pat::Ident(..) => params.push(param),
                Pat::Array(..) | Pat::Object(..) => {
                    let binding = private_ident!(span, "param");

                    params.push(Param {
                        pat: Pat::Ident(binding.clone().into()),
                        ..param
                    });
                    decls.push(VarDeclarator {
                        span,
                        name: param.pat,
                        init: Some(Box::new(Expr::Ident(binding))),
                        definite: false,
                    })
                }
                Pat::Assign(..) => {
                    let binding = private_ident!(span, "param");

                    params.push(Param {
                        span: DUMMY_SP,
                        decorators: Default::default(),
                        pat: Pat::Ident(binding.clone().into()),
                    });
                    // This expands to invalid code, but is fixed by destructing pass
                    decls.push(VarDeclarator {
                        span,
                        name: param.pat,
                        init: Some(Box::new(Expr::Ident(binding))),
                        definite: false,
                    })
                }
                Pat::Rest(RestPat { arg, .. }) => {
                    // Inject a for statement
                    //
                    // for(var _len = arguments.length, a1 = new Array(_len), _key = 0; _key <
                    // _len; _key++){
                    //      a1[_key] = arguments[_key];
                    // }
                    assert!(unpack_rest.is_none());

                    // TODO: Optimize (use `arguments` instead of rest argument)

                    let mark = Mark::fresh(Mark::root());
                    let idx_ident = quote_ident!(span.apply_mark(mark), "_key");
                    let len_ident = quote_ident!(span.apply_mark(mark), "_len");

                    let arg = match *arg {
                        Pat::Ident(ident) => ident.id,
                        arg => {
                            let tmp_ident = quote_ident!(span.apply_mark(mark), "_tmp");
                            decls_after_unpack.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: arg,
                                init: Some(Box::new(tmp_ident.clone().into())),
                                definite: false,
                            });
                            tmp_ident
                        }
                    };

                    let make_minus_i = |ident: &Ident, min_zero: bool| -> Expr {
                        if i == 0 {
                            // `len`
                            ident.clone().into()
                        } else {
                            // `len - $i`
                            let bin: Expr = BinExpr {
                                span,
                                left: Box::new(Expr::Ident(ident.clone())),
                                op: op!(bin, "-"),
                                right: Box::new(Expr::Lit(Lit::Num(Number {
                                    span,
                                    value: i as f64,
                                }))),
                            }
                            .into();
                            if !min_zero {
                                return bin;
                            }

                            Expr::Cond(CondExpr {
                                span,
                                test: Box::new(
                                    BinExpr {
                                        span,
                                        left: Box::new(len_ident.clone().into()),
                                        op: op!(">"),
                                        right: Box::new(Expr::Lit(Lit::Num(Number {
                                            span,
                                            value: i as _,
                                        }))),
                                    }
                                    .into(),
                                ),
                                cons: Box::new(bin),
                                alt: Box::new(Expr::Lit(Lit::Num(Number { span, value: 0.0 }))),
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
                                    name: Pat::Ident(len_ident.clone().into()),
                                    init: Some(member_expr!(span, arguments.length)),
                                    definite: false,
                                },
                                // a1 = new Array(_len - $i)
                                VarDeclarator {
                                    span,
                                    name: Pat::Ident(arg.clone().into()),
                                    init: Some(Box::new(Expr::New(NewExpr {
                                        span,
                                        callee: Box::new(quote_ident!("Array").into()),
                                        args: Some(vec![{
                                            // `len` or  `len - $i`
                                            make_minus_i(&len_ident, true).as_arg()
                                        }]),
                                        type_args: Default::default(),
                                    }))),
                                    definite: false,
                                },
                                // _key = 0
                                VarDeclarator {
                                    span,
                                    name: Pat::Ident(idx_ident.clone().into()),
                                    init: Some(Box::new(Expr::Lit(Lit::Num(Number {
                                        span,
                                        value: i as f64,
                                    })))),
                                    definite: false,
                                },
                            ],
                            declare: false,
                        })),
                        // `_key < _len`
                        test: Some(Box::new(Expr::Bin(BinExpr {
                            span,
                            left: Box::new(idx_ident.clone().into()),
                            op: op!("<"),
                            right: Box::new(len_ident.clone().into()),
                        }))),
                        // _key++
                        update: Some(Box::new(Expr::Update(UpdateExpr {
                            span,
                            op: op!("++"),
                            prefix: false,
                            arg: Box::new(idx_ident.clone().into()),
                        }))),
                        body: Box::new(Stmt::Block(BlockStmt {
                            span,
                            stmts: vec![{
                                let prop = Box::new(Expr::Ident(idx_ident.clone()));
                                // a1[_key - i] = arguments[_key];
                                let expr = AssignExpr {
                                    span,
                                    left: PatOrExpr::Expr(Box::new(
                                        arg.computed_member(make_minus_i(&idx_ident, false)),
                                    )),
                                    op: op!("="),
                                    right: Box::new(
                                        MemberExpr {
                                            span: DUMMY_SP,
                                            obj: ExprOrSuper::Expr(Box::new(
                                                quote_ident!(span, "arguments").into(),
                                            )),
                                            computed: true,
                                            prop,
                                        }
                                        .into(),
                                    ),
                                }
                                .into_stmt();

                                expr
                            }],
                        })),
                    }))
                }
                _ => params.push(param),
            }
        }

        let mut stmts = body.stmts;
        let mut iter: ArrayVec<[_; 3]> = Default::default();

        if !decls.is_empty() {
            iter.push(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Let,
                decls,
                declare: false,
            })))
        }
        iter.extend(unpack_rest);
        if !decls_after_unpack.is_empty() {
            iter.push(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Let,
                decls: decls_after_unpack,
                declare: false,
            })));
        }
        prepend_stmts(&mut stmts, iter.into_iter());

        (
            params,
            BlockStmt {
                span: DUMMY_SP,
                stmts,
            },
        )
    }
}

impl Fold for Params {
    noop_fold_type!();

    impl_fold_fn!();
}
