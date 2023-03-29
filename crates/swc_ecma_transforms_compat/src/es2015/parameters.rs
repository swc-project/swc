use std::mem;

use arrayvec::ArrayVec;
use serde::Deserialize;
use swc_atoms::js_word;
use swc_common::{util::take::Take, Mark, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
// use swc_ecma_transforms_base::perf::Parallel;
// use swc_ecma_transforms_macros::parallel;
use swc_ecma_utils::{
    function::{init_this, FnEnvHoister},
    member_expr, prepend_stmt, prepend_stmts, private_ident, quote_ident, undefined, ExprFactory,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;
use tracing::trace;

#[tracing::instrument(level = "info", skip_all)]
pub fn parameters(c: Config, unresolved_mark: Mark) -> impl 'static + Fold {
    let unresolved_ctxt = SyntaxContext::empty().apply_mark(unresolved_mark);
    as_folder(Params {
        c,
        unresolved_ctxt,
        hoister: FnEnvHoister::new(unresolved_ctxt),
        ..Default::default()
    })
}

#[derive(Default)]
struct Params {
    /// Used to store `this, in case if `arguments` is used and we should
    /// transform an arrow expression to a function expression.
    hoister: FnEnvHoister,
    unresolved_ctxt: SyntaxContext,
    in_subclass: bool,
    in_prop: bool,
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

#[swc_trace]
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
                            pat: binding.clone().into(),
                            ..param
                        });
                        let decl = VarDeclarator {
                            span,
                            name: param.pat,
                            init: Some(Box::new(Expr::Ident(binding))),
                            definite: false,
                        };
                        if self.c.ignore_function_length {
                            loose_stmt.push(
                                VarDecl {
                                    span,
                                    kind: VarDeclKind::Let,
                                    decls: vec![decl],
                                    declare: false,
                                }
                                .into(),
                            )
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
                                    op: op!("&&"),
                                    right: Box::new(Expr::Bin(BinExpr {
                                        left: Box::new(make_arg_nth(i)),
                                        op: op!("!=="),
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
                    } else if let Pat::Ident(ident) = left.as_ref() {
                        params.push(Param {
                            span,
                            pat: ident.clone().into(),
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
                                    op: op!("="),
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
                            pat: binding.clone().into(),
                        });
                        loose_stmt.push(
                            VarDecl {
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
                                            op: op!("==="),
                                            right: undefined(DUMMY_SP),
                                        })),
                                        cons: right,
                                        alt: Box::new(Expr::Ident(binding)),
                                    }))),
                                    definite: false,
                                }],
                                declare: false,
                            }
                            .into(),
                        )
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
                                    raw: None,
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
                                            raw: None,
                                        }))),
                                    }
                                    .into(),
                                ),
                                cons: Box::new(bin),
                                alt: 0.into(),
                            })
                        }
                    };

                    unpack_rest = Some(Stmt::For(ForStmt {
                        span,
                        init: Some(
                            VarDecl {
                                kind: VarDeclKind::Var,
                                span,
                                decls: vec![
                                    // _len = arguments.length - i
                                    VarDeclarator {
                                        span,
                                        name: len_ident.clone().into(),
                                        init: Some(member_expr!(span, arguments.length)),
                                        definite: false,
                                    },
                                    // a1 = new Array(_len - $i)
                                    VarDeclarator {
                                        span,
                                        name: arg.clone().into(),
                                        init: Some(Box::new(Expr::New(NewExpr {
                                            span,
                                            callee: Box::new(
                                                quote_ident!(
                                                    DUMMY_SP.with_ctxt(self.unresolved_ctxt),
                                                    "Array"
                                                )
                                                .into(),
                                            ),
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
                                        name: idx_ident.clone().into(),
                                        init: Some(Box::new(Expr::Lit(Lit::Num(Number {
                                            span,
                                            value: i as f64,
                                            raw: None,
                                        })))),
                                        definite: false,
                                    },
                                ],
                                declare: false,
                            }
                            .into(),
                        ),
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

                                AssignExpr {
                                    span,
                                    left: PatOrExpr::Expr(Box::new(
                                        arg.computed_member(make_minus_i(&idx_ident, false)),
                                    )),
                                    op: op!("="),
                                    right: Box::new(
                                        MemberExpr {
                                            span: DUMMY_SP,
                                            obj: Box::new(quote_ident!(span, "arguments").into()),
                                            prop: MemberProp::Computed(ComputedPropName {
                                                span,
                                                expr: prop,
                                            }),
                                        }
                                        .into(),
                                    ),
                                }
                                .into_stmt()
                            }],
                        })),
                    }))
                }
                _ => unreachable!(),
            }
        }

        let mut iter: ArrayVec<_, 3> = Default::default();

        if !decls.is_empty() {
            iter.push(
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Let,
                    decls,
                    declare: false,
                }
                .into(),
            )
        }
        iter.extend(unpack_rest);
        if !decls_after_unpack.is_empty() {
            iter.push(
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Let,
                    decls: decls_after_unpack,
                    declare: false,
                }
                .into(),
            );
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

#[swc_trace]
impl VisitMut for Params {
    noop_visit_mut_type!();

    // generally speaking, there won't be class field in here, but Safari 14.1
    // still has bugs in parameters
    fn visit_mut_class_prop(&mut self, prop: &mut ClassProp) {
        prop.key.visit_mut_children_with(self);

        let old_in_prop = self.in_prop;
        self.in_prop = !prop.is_static;
        prop.value.visit_mut_with(self);
        self.in_prop = old_in_prop;
    }

    // same for private prop
    fn visit_mut_private_prop(&mut self, prop: &mut PrivateProp) {
        let old_in_prop = self.in_prop;
        self.in_prop = !prop.is_static;
        prop.value.visit_mut_with(self);
        self.in_prop = old_in_prop;
    }

    fn visit_mut_block_stmt_or_expr(&mut self, body: &mut BlockStmtOrExpr) {
        let old_rep = self.hoister.take();

        body.visit_mut_children_with(self);

        let decls = mem::replace(&mut self.hoister, old_rep).to_stmt();

        if let Some(decls) = decls {
            if let BlockStmtOrExpr::Expr(v) = body {
                let mut stmts = vec![];
                prepend_stmt(&mut stmts, decls);
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
            params.is_empty() || params.len() == 1,
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
            let old_rep = self.hoister.take();

            stmts.visit_mut_children_with(self);

            if self.in_subclass {
                let (decl, this_id) =
                    mem::replace(&mut self.hoister, old_rep).to_stmt_in_subclass();

                if let Some(stmt) = decl {
                    if let Some(this_id) = this_id {
                        init_this(stmts, &this_id)
                    }
                    prepend_stmt(stmts, stmt);
                }
            } else {
                let decl = mem::replace(&mut self.hoister, old_rep).to_stmt();

                if let Some(stmt) = decl {
                    prepend_stmt(stmts, stmt);
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

                let was_expr = f.body.is_expr();

                let need_arrow_to_function = f.params.iter().any(|p| match p {
                    Pat::Rest(..) => true,
                    Pat::Assign(..) => !self.c.ignore_function_length,
                    _ => false,
                });

                let mut local_vars = None;

                // this needs to happen before rest parameter transform
                if need_arrow_to_function {
                    if !self.in_prop {
                        f.visit_mut_children_with(&mut self.hoister)
                    } else {
                        let mut hoister = FnEnvHoister::new(self.unresolved_ctxt);
                        f.visit_mut_children_with(&mut hoister);
                        local_vars = hoister.to_stmt();
                    }
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

                let mut body = match *f.body.take() {
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
                    let func: Expr = Function {
                        params,
                        decorators: Default::default(),
                        span: f.span,
                        body: Some(body),
                        is_generator: f.is_generator,
                        is_async: f.is_async,
                        type_params: Default::default(),
                        return_type: Default::default(),
                    }
                    .into();
                    *e = match (self.in_prop, local_vars) {
                        (true, Some(var_decl)) => Expr::Arrow(ArrowExpr {
                            span: f.span,
                            params: Vec::new(),
                            is_async: false,
                            is_generator: false,
                            body: Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
                                span: f.span,
                                stmts: vec![
                                    var_decl,
                                    Stmt::Return(ReturnStmt {
                                        span: f.span,
                                        arg: Some(Box::new(func)),
                                    }),
                                ],
                            })),
                            type_params: Default::default(),
                            return_type: Default::default(),
                        })
                        .as_iife()
                        .into(),
                        _ => func,
                    };
                    return;
                }

                let body = if was_expr
                    && body.stmts.len() == 1
                    && matches!(
                        body.stmts[0],
                        Stmt::Return(ReturnStmt { arg: Some(..), .. })
                    ) {
                    match body.stmts.pop().unwrap() {
                        Stmt::Return(ReturnStmt { arg: Some(arg), .. }) => {
                            Box::new(BlockStmtOrExpr::Expr(arg))
                        }
                        _ => unreachable!(),
                    }
                } else {
                    Box::new(BlockStmtOrExpr::BlockStmt(body))
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

        let old_in_subclass = self.in_subclass;
        let old_in_prop = self.in_prop;
        self.in_subclass = false;
        self.in_prop = false;

        f.visit_mut_children_with(self);

        let mut body = f.body.take().unwrap();
        self.visit_mut_fn_like(&mut f.params, &mut body, false);

        f.body = Some(body);

        self.in_subclass = old_in_subclass;
        self.in_prop = old_in_prop;
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
            pat: *f.param.take(),
        }];

        let mut body = f.body.take().unwrap();
        self.visit_mut_fn_like(&mut params, &mut body, true);

        debug_assert!(params.len() == 1);

        f.param = Box::new(params.pop().unwrap().pat);
        f.body = Some(body);
    }

    fn visit_mut_class(&mut self, c: &mut Class) {
        let old_in_subclass = self.in_subclass;
        let old_in_prop = self.in_prop;

        self.in_subclass = c.super_class.is_some();
        self.in_prop = false;
        c.visit_mut_children_with(self);

        self.in_subclass = old_in_subclass;
        self.in_prop = old_in_prop;
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        stmts.visit_mut_children_with(self);

        let decl = self.hoister.take().to_stmt();

        if let Some(stmt) = decl {
            prepend_stmt(stmts, ModuleItem::Stmt(stmt));
        }
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        let old_rep = self.hoister.take();

        stmts.visit_mut_children_with(self);

        let decl = mem::replace(&mut self.hoister, old_rep).to_stmt();

        if let Some(stmt) = decl {
            prepend_stmt(stmts, stmt);
        }
    }
}

fn make_arg_nth(n: usize) -> Expr {
    Expr::Ident(Ident::new(js_word!("arguments"), DUMMY_SP)).computed_member(n)
}

fn check_arg_len(n: usize) -> Expr {
    Expr::Bin(BinExpr {
        left: Box::new(
            Expr::Ident(Ident::new(js_word!("arguments"), DUMMY_SP))
                .make_member(Ident::new(js_word!("length"), DUMMY_SP)),
        ),
        op: op!(">"),
        right: n.into(),
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
