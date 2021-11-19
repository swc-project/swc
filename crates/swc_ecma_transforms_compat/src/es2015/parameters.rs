use arrayvec::ArrayVec;
use swc_common::{util::take::Take, Mark, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Parallel;
use swc_ecma_transforms_macros::parallel;
use swc_ecma_utils::{
    contains_this_expr, member_expr, prepend, prepend_stmts, private_ident, quote_ident,
    ExprFactory,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn parameters() -> impl 'static + Fold {
    as_folder(Params::default())
}

#[derive(Clone, Default)]
struct Params {
    /// Used ti store `this, in case if `arguments` is used and we should
    /// transform an arrow expression to a function expression.
    vars: Vec<VarDeclarator>,
}
// prevent_recurse!(Params, Pat);

impl Parallel for Params {
    fn create(&self) -> Self {
        Params {
            vars: Default::default(),
        }
    }

    fn merge(&mut self, other: Self) {
        self.vars.extend(other.vars);
    }

    fn after_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        if !self.vars.is_empty() {
            prepend(
                stmts,
                Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: Default::default(),
                    decls: self.vars.take(),
                })),
            )
        }
    }

    fn after_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        if !self.vars.is_empty() {
            prepend(
                stmts,
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: Default::default(),
                    decls: self.vars.take(),
                }))),
            )
        }
    }
}

impl Params {
    fn visit_mut_fn_like(&mut self, ps: &mut Vec<Param>, body: &mut BlockStmt) {
        let mut params = vec![];
        let mut decls = vec![];
        let mut unpack_rest = None;
        let mut decls_after_unpack = vec![];

        for (i, param) in ps.drain(..).enumerate() {
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
        prepend_stmts(&mut body.stmts, iter.into_iter());

        *ps = params;
    }
}

#[parallel]
impl VisitMut for Params {
    noop_visit_mut_type!();

    fn visit_mut_block_stmt_or_expr(&mut self, body: &mut BlockStmtOrExpr) {
        body.visit_mut_children_with(self);

        if self.vars.is_empty() {
            return;
        }

        match body {
            BlockStmtOrExpr::Expr(v) => {
                let mut stmts = vec![];
                prepend(
                    &mut stmts,
                    Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: Default::default(),
                        decls: self.vars.take(),
                    })),
                );
                stmts.push(Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(v.take()),
                }));
                *body = BlockStmtOrExpr::BlockStmt(BlockStmt {
                    span: DUMMY_SP,
                    stmts,
                });
            }
            _ => {}
        };
    }

    fn visit_mut_catch_clause(&mut self, f: &mut CatchClause) {
        f.visit_mut_children_with(self);

        let mut params = vec![];
        if f.param.is_some() {
            params.push(Param {
                span: DUMMY_SP,
                decorators: vec![],
                pat: f.param.take().unwrap(),
            });
        }

        self.visit_mut_fn_like(&mut params, &mut f.body);

        assert!(
            params.len() == 0 || params.len() == 1,
            "fold_fn_like should return 0 ~ 1 parameter while handling catch clause"
        );

        let param = if params.is_empty() {
            None
        } else {
            Some(params.pop().unwrap())
        };

        f.param = param.map(|param| param.pat);
    }

    fn visit_mut_constructor(&mut self, f: &mut Constructor) {
        if f.body.is_none() {
            return;
        }

        f.visit_mut_children_with(self);

        let mut params = f
            .params
            .take()
            .into_iter()
            .map(|pat| match pat {
                ParamOrTsParamProp::Param(p) => p,
                _ => {
                    unreachable!("TsParameterProperty should be removed by typescript::strip pass")
                }
            })
            .collect();

        let mut body = f.body.take().unwrap();
        self.visit_mut_fn_like(&mut params, &mut body);

        f.params = params.into_iter().map(ParamOrTsParamProp::Param).collect();
        f.body = Some(body);
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        let mut vars = self.vars.take();

        e.visit_mut_children_with(self);

        vars.extend(self.vars.take());
        self.vars = vars;

        match e {
            Expr::Arrow(f) => {
                f.visit_mut_children_with(self);

                let was_expr = match f.body {
                    BlockStmtOrExpr::Expr(..) => true,
                    _ => false,
                };

                let need_arrow_to_function = f.params.iter().any(|p| match p {
                    Pat::Rest(..) => true,
                    _ => false,
                });

                let body_span = f.body.span();
                let mut params = f
                    .params
                    .take()
                    .into_iter()
                    .map(|pat| Param {
                        span: DUMMY_SP,
                        decorators: Default::default(),
                        pat,
                    })
                    .collect();

                let mut body = match f.body.take() {
                    BlockStmtOrExpr::BlockStmt(block) => block,
                    BlockStmtOrExpr::Expr(expr) => BlockStmt {
                        span: body_span,
                        stmts: vec![Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(expr),
                        })],
                    },
                };

                self.visit_mut_fn_like(&mut params, &mut body);

                if need_arrow_to_function {
                    // We are converting an arrow expression to a function expression, and we
                    // should handle usage of this.
                    if contains_this_expr(&body) {
                        // Replace this to `self`.
                        let this_ident = private_ident!("self");
                        self.vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(this_ident.clone().into()),
                            init: Some(Box::new(Expr::This(ThisExpr { span: DUMMY_SP }))),
                            definite: Default::default(),
                        });

                        // this -> `self`
                        body.visit_mut_with(&mut ThisReplacer { to: &this_ident })
                    }

                    *e = Expr::Fn(FnExpr {
                        ident: None,
                        function: Function {
                            params,
                            decorators: Default::default(),
                            span: f.span,
                            body: Some(body),
                            is_generator: f.is_generator,
                            is_async: f.is_async,
                            type_params: Default::default(),
                            return_type: Default::default(),
                        },
                    });
                    return;
                }

                let body = if was_expr
                    && body.stmts.len() == 1
                    && match body.stmts[0] {
                        Stmt::Return(ReturnStmt { arg: Some(..), .. }) => true,
                        _ => false,
                    } {
                    match body.stmts.pop().unwrap() {
                        Stmt::Return(ReturnStmt { arg: Some(arg), .. }) => {
                            BlockStmtOrExpr::Expr(arg)
                        }
                        _ => unreachable!(),
                    }
                } else {
                    BlockStmtOrExpr::BlockStmt(body)
                };

                *e = Expr::Arrow(ArrowExpr {
                    params: params.into_iter().map(|param| param.pat).collect(),
                    body,
                    span: f.span,
                    is_async: f.is_async,
                    is_generator: f.is_generator,
                    type_params: f.type_params.take(),
                    return_type: f.return_type.take(),
                });
            }
            _ => {}
        }
    }

    fn visit_mut_function(&mut self, f: &mut Function) {
        if f.body.is_none() {
            return;
        }

        f.visit_mut_children_with(self);

        let mut body = f.body.take().unwrap();
        self.visit_mut_fn_like(&mut f.params, &mut body);

        f.body = Some(body);
    }

    fn visit_mut_getter_prop(&mut self, f: &mut GetterProp) {
        if f.body.is_none() {
            return;
        }

        f.visit_mut_children_with(self);

        let mut params = vec![];
        let mut body = f.body.take().unwrap();
        self.visit_mut_fn_like(&mut params, &mut body);
        debug_assert_eq!(params, vec![]);

        f.body = Some(body);
    }

    fn visit_mut_setter_prop(&mut self, f: &mut SetterProp) {
        if f.body.is_none() {
            return;
        }

        f.visit_mut_children_with(self);

        let mut params = vec![Param {
            span: DUMMY_SP,
            decorators: Default::default(),
            pat: f.param.take(),
        }];

        let mut body = f.body.take().unwrap();
        self.visit_mut_fn_like(&mut params, &mut body);

        debug_assert!(params.len() == 1);

        f.param = params.pop().unwrap().pat;
        f.body = Some(body);
    }
}

struct ThisReplacer<'a> {
    to: &'a Ident,
}

impl VisitMut for ThisReplacer<'_> {
    noop_visit_mut_type!();

    fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {}

    fn visit_mut_constructor(&mut self, _: &mut Constructor) {}

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::This(..) => {
                *e = Expr::Ident(self.to.clone());
            }

            _ => {}
        }
    }

    fn visit_mut_function(&mut self, _: &mut Function) {}

    /// Don't recurse into fn
    fn visit_mut_getter_prop(&mut self, n: &mut GetterProp) {
        n.key.visit_mut_with(self);
    }

    /// Don't recurse into fn
    fn visit_mut_method_prop(&mut self, n: &mut MethodProp) {
        n.key.visit_mut_with(self);
        n.function.visit_mut_with(self);
    }

    /// Don't recurse into fn
    fn visit_mut_setter_prop(&mut self, n: &mut SetterProp) {
        n.key.visit_mut_with(self);
        n.param.visit_mut_with(self);
    }
}
