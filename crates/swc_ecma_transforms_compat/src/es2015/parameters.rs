use std::mem;

use arrayvec::ArrayVec;
use serde::Deserialize;
use swc_atoms::js_word;
use swc_common::{util::take::Take, Mark, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
// use swc_ecma_transforms_base::perf::Parallel;
// use swc_ecma_transforms_macros::parallel;
use swc_ecma_utils::{
    function::{init_this, FunctionWrapper, WrapperState},
    member_expr, prepend, prepend_stmts, private_ident, quote_ident, undefined, ExprFactory,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
use tracing::trace;

pub fn parameters(c: Config) -> impl 'static + Fold {
    as_folder(Params {
        c,
        ..Default::default()
    })
}

#[derive(Clone, Default)]
struct Params {
    /// Used to store `this, in case if `arguments` is used and we should
    /// transform an arrow expression to a function expression.
    state: WrapperState,
    in_subclass: bool,
    c: Config,
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub ignore_function_length: bool,
}

// impl Parallel for Params {
//     fn create(&self) -> Self {
//         Params {
//             state: Default::default(),
//             c: self.c,
//         }
//     }

//     fn merge(&mut self, other: Self) {
//         self.state.merge(other.state);
//     }

//     fn after_stmts(&mut self, stmts: &mut Vec<Stmt>) {
//         let decls = self.state.take().to_stmt();
//         if let Some(decls) = decls {
//             prepend(stmts, decls)
//         }
//     }

//     fn after_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
//         let decls = self.state.take().to_stmt();
//         if let Some(decls) = decls {
//             prepend(stmts, ModuleItem::Stmt(decls))
//         }
//     }
// }

impl Params {
    fn visit_mut_fn_like(&mut self, ps: &mut Vec<Param>, body: &mut BlockStmt, is_setter: bool) {
        let mut params = vec![];
        let mut decls = vec![];
        let mut loose_stmt = vec![];
        let mut unpack_rest = None;
        let mut decls_after_unpack = vec![];

        let mut after_default = false;

        for (i, param) in ps.drain(..).enumerate() {
            let span = param.span();

            match param.pat {
                Pat::Ident(..) => {
                    if after_default && !self.c.ignore_function_length {
                        decls.push(VarDeclarator {
                            span,
                            name: param.pat,
                            init: Some(Box::new(check_arg_len_or_undef(i))),
                            definite: false,
                        })
                    } else {
                        params.push(param)
                    }
                }
                Pat::Array(..) | Pat::Object(..) => {
                    if after_default && !self.c.ignore_function_length {
                        decls.push(VarDeclarator {
                            span,
                            name: param.pat,
                            init: Some(Box::new(check_arg_len_or_undef(i))),
                            definite: false,
                        })
                    } else {
                        let binding = private_ident!(span, "param");

                        params.push(Param {
                            pat: Pat::Ident(binding.clone().into()),
                            ..param
                        });
                        let decl = VarDeclarator {
                            span,
                            name: param.pat,
                            init: Some(Box::new(Expr::Ident(binding))),
                            definite: false,
                        };
                        if self.c.ignore_function_length {
                            loose_stmt.push(Stmt::Decl(Decl::Var(VarDecl {
                                span,
                                kind: VarDeclKind::Let,
                                decls: vec![decl],
                                declare: false,
                            })))
                        } else {
                            decls.push(decl)
                        }
                    }
                }
                Pat::Assign(AssignPat { left, right, .. }) => {
                    // arguments.length will always be 1 in setter
                    if !(self.c.ignore_function_length || is_setter) {
                        after_default = true;
                        // access non-existent element in `arguments` is expensive
                        decls.push(VarDeclarator {
                            span,
                            name: *left,
                            init: Some(Box::new(Expr::Cond(CondExpr {
                                span,
                                test: Box::new(Expr::Bin(BinExpr {
                                    left: Box::new(check_arg_len(i)),
                                    op: BinaryOp::LogicalAnd,
                                    right: Box::new(Expr::Bin(BinExpr {
                                        left: Box::new(make_arg_nth(i)),
                                        op: BinaryOp::NotEqEq,
                                        right: undefined(DUMMY_SP),
                                        span: DUMMY_SP,
                                    })),
                                    span,
                                })),
                                cons: Box::new(make_arg_nth(i)),
                                alt: right,
                            }))),
                            definite: false,
                        })
                    } else {
                        if let Pat::Ident(ident) = left.as_ref() {
                            params.push(Param {
                                span,
                                pat: Pat::Ident(ident.clone()),
                                decorators: Vec::new(),
                            });
                            loose_stmt.push(Stmt::If(IfStmt {
                                span,
                                test: Box::new(Expr::Bin(BinExpr {
                                    span: DUMMY_SP,
                                    left: Box::new(Expr::Ident(ident.id.clone())),
                                    op: op!("==="),
                                    right: undefined(DUMMY_SP),
                                })),
                                cons: Box::new(Stmt::Expr(ExprStmt {
                                    span,
                                    expr: Box::new(Expr::Assign(AssignExpr {
                                        span,
                                        left: PatOrExpr::Pat(left),
                                        op: AssignOp::Assign,
                                        right,
                                    })),
                                })),
                                alt: None,
                            }))
                        } else {
                            let binding = private_ident!(span, "param");
                            params.push(Param {
                                span: DUMMY_SP,
                                decorators: Default::default(),
                                pat: Pat::Ident(binding.clone().into()),
                            });
                            loose_stmt.push(Stmt::Decl(Decl::Var(VarDecl {
                                span,
                                kind: VarDeclKind::Let,
                                decls: vec![VarDeclarator {
                                    span,
                                    name: *left,
                                    init: Some(Box::new(Expr::Cond(CondExpr {
                                        span,
                                        test: Box::new(Expr::Bin(BinExpr {
                                            span: DUMMY_SP,
                                            left: Box::new(Expr::Ident(binding.clone())),
                                            op: BinaryOp::EqEqEq,
                                            right: undefined(DUMMY_SP),
                                        })),
                                        cons: right,
                                        alt: Box::new(Expr::Ident(binding)),
                                    }))),
                                    definite: false,
                                }],
                                declare: false,
                            })))
                        }
                    }
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
                _ => unreachable!(),
            }
        }

        let mut iter: ArrayVec<_, 3> = Default::default();

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
        if (is_setter || self.c.ignore_function_length) && !loose_stmt.is_empty() {
            loose_stmt.extend(iter);
            prepend_stmts(&mut body.stmts, loose_stmt.into_iter());
        } else {
            prepend_stmts(&mut body.stmts, iter.into_iter());
        };

        *ps = params;
    }
}

impl VisitMut for Params {
    noop_visit_mut_type!();

    fn visit_mut_block_stmt_or_expr(&mut self, body: &mut BlockStmtOrExpr) {
        let old_rep = self.state.take();

        body.visit_mut_children_with(self);

        let decls = mem::replace(&mut self.state, old_rep).to_stmt();

        if let Some(decls) = decls {
            if let BlockStmtOrExpr::Expr(v) = body {
                let mut stmts = vec![];
                prepend(&mut stmts, decls);
                stmts.push(Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(v.take()),
                }));
                *body = BlockStmtOrExpr::BlockStmt(BlockStmt {
                    span: DUMMY_SP,
                    stmts,
                });
            }
        }
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

        self.visit_mut_fn_like(&mut params, &mut f.body, false);

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
        trace!("visit_mut_constructor(parmas.len() = {})", f.params.len());
        f.params.visit_mut_with(self);

        if let Some(BlockStmt { span: _, stmts }) = &mut f.body {
            let old_rep = self.state.take();

            stmts.visit_mut_children_with(self);

            if self.in_subclass {
                let (decl, this_id) = mem::replace(&mut self.state, old_rep).to_stmt_in_subclass();

                if let Some(stmt) = decl {
                    if let Some(this_id) = this_id {
                        init_this(stmts, &this_id)
                    }
                    prepend(stmts, stmt);
                }
            } else {
                let decl = mem::replace(&mut self.state, old_rep).to_stmt();

                if let Some(stmt) = decl {
                    prepend(stmts, stmt);
                }
            }
        }

        trace!(
            "visit_mut_constructor(parmas.len() = {}, after)",
            f.params.len()
        );
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        match e {
            Expr::Arrow(f) => {
                f.visit_mut_children_with(self);

                let was_expr = match f.body {
                    BlockStmtOrExpr::Expr(..) => true,
                    _ => false,
                };

                let need_arrow_to_function = f.params.iter().any(|p| match p {
                    Pat::Rest(..) => true,
                    Pat::Assign(..) => !self.c.ignore_function_length,
                    _ => false,
                });

                // this needs to happen before rest parameter transform
                if need_arrow_to_function {
                    f.visit_mut_children_with(&mut FunctionWrapper::new(&mut self.state));
                }

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

                self.visit_mut_fn_like(&mut params, &mut body, false);

                if need_arrow_to_function {
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
            _ => e.visit_mut_children_with(self),
        }
    }

    fn visit_mut_function(&mut self, f: &mut Function) {
        if f.body.is_none() {
            return;
        }

        f.visit_mut_children_with(self);

        let mut body = f.body.take().unwrap();
        self.visit_mut_fn_like(&mut f.params, &mut body, false);

        f.body = Some(body);
    }

    fn visit_mut_getter_prop(&mut self, f: &mut GetterProp) {
        if f.body.is_none() {
            return;
        }

        f.visit_mut_children_with(self);

        let mut params = vec![];
        let mut body = f.body.take().unwrap();
        self.visit_mut_fn_like(&mut params, &mut body, false);
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
        self.visit_mut_fn_like(&mut params, &mut body, true);

        debug_assert!(params.len() == 1);

        f.param = params.pop().unwrap().pat;
        f.body = Some(body);
    }

    fn visit_mut_class(&mut self, c: &mut Class) {
        if c.super_class.is_some() {
            self.in_subclass = true;
        }
        c.visit_mut_children_with(self);
        self.in_subclass = false;
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        stmts.visit_mut_children_with(self);

        let decl = self.state.take().to_stmt();

        if let Some(stmt) = decl {
            prepend(stmts, ModuleItem::Stmt(stmt));
        }
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        let old_rep = self.state.take();

        stmts.visit_mut_children_with(self);

        let decl = mem::replace(&mut self.state, old_rep).to_stmt();

        if let Some(stmt) = decl {
            prepend(stmts, stmt);
        }
    }
}

fn make_arg_nth(n: usize) -> Expr {
    Expr::Ident(Ident::new(js_word!("arguments"), DUMMY_SP)).computed_member(Expr::Lit(Lit::Num(
        Number {
            span: DUMMY_SP,
            value: n as f64,
        },
    )))
}

fn check_arg_len(n: usize) -> Expr {
    Expr::Bin(BinExpr {
        left: Box::new(
            Expr::Ident(Ident::new(js_word!("arguments"), DUMMY_SP))
                .make_member(Ident::new(js_word!("length"), DUMMY_SP)),
        ),
        op: BinaryOp::Gt,
        right: Box::new(Expr::Lit(Lit::Num(Number {
            span: DUMMY_SP,
            value: n as f64,
        }))),
        span: DUMMY_SP,
    })
}

fn check_arg_len_or_undef(n: usize) -> Expr {
    Expr::Cond(CondExpr {
        test: Box::new(check_arg_len(n)),
        cons: Box::new(make_arg_nth(n)),
        alt: undefined(DUMMY_SP),
        span: DUMMY_SP,
    })
}
