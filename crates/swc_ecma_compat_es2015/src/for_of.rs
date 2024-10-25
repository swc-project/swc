use std::mem::take;

use serde::Deserialize;
use swc_common::{util::take::Take, Mark, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{
    helper,
    perf::{ParExplode, Parallel},
};
use swc_ecma_transforms_macros::parallel;
use swc_ecma_utils::{
    alias_if_required, member_expr, prepend_stmt, private_ident, quote_ident, ExprFactory,
};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

/// `@babel/plugin-transform-for-of`
///
/// ## In
///
/// ```js
/// for (var i of foo) {}
/// ```
///
/// ## Out
///
/// ```js
/// var _iteratorNormalCompletion = true;
/// var _didIteratorError = false;
/// var _iteratorError = undefined;
///
/// try {
///   for (var _iterator = foo[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
///     var i = _step.value;
///   }
/// } catch (err) {
///   _didIteratorError = true;
///   _iteratorError = err;
/// } finally {
///   try {
///     if (!_iteratorNormalCompletion && _iterator.return != null) {
///       _iterator.return();
///     }
///   } finally {
///     if (_didIteratorError) {
///       throw _iteratorError;
///     }
///   }
/// }
/// ```
pub fn for_of(c: Config) -> impl Pass {
    visit_mut_pass(ForOf {
        c,
        top_level_vars: Default::default(),
    })
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    pub loose: bool,
    pub assume_array: bool,
}

struct ForOf {
    c: Config,

    ///```js
    /// var _iteratorNormalCompletion = true;
    /// var _didIteratorError = false;
    /// var _iteratorError = undefined;
    /// ```
    top_level_vars: Vec<VarDeclarator>,
}

#[swc_trace]
impl ForOf {
    fn fold_for_stmt(
        &mut self,
        label: Option<Ident>,
        ForOfStmt {
            span,
            left,
            right,
            body,
            ..
        }: ForOfStmt,
    ) -> Stmt {
        if right.is_array() || (self.c.assume_array && !self.c.loose) {
            // Convert to normal for loop if rhs is array
            //
            // babel's output:
            //
            //    for(var _i = 0, _t = t; _i < _t.length; _i++){
            //        let o = _t[_i];
            //        const t = o;
            //    }

            let (arr, aliased) = alias_if_required(&right, "_iter");

            let i = private_ident!("_i");

            let test = Some(
                BinExpr {
                    span: DUMMY_SP,
                    left: Box::new(i.clone().into()),
                    op: op!("<"),
                    right: arr.clone().make_member(quote_ident!("length")).into(),
                }
                .into(),
            );
            let update = Some(
                UpdateExpr {
                    span: DUMMY_SP,
                    prefix: false,
                    op: op!("++"),
                    arg: Box::new(i.clone().into()),
                }
                .into(),
            );

            let mut decls = Vec::with_capacity(2);
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: i.clone().into(),
                init: Some(0.into()),
                definite: false,
            });

            if aliased {
                decls.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: arr.clone().into(),
                    init: Some(right),
                    definite: false,
                });
            }

            let mut body = match *body {
                Stmt::Block(b) => b,
                _ => BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![*body],
                    ..Default::default()
                },
            };

            match left {
                ForHead::VarDecl(var) => {
                    assert_eq!(
                        var.decls.len(),
                        1,
                        "Variable declarator of for of loop cannot contain multiple entries"
                    );
                    prepend_stmt(
                        &mut body.stmts,
                        VarDecl {
                            span: DUMMY_SP,
                            kind: var.kind,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: var.decls.into_iter().next().unwrap().name,
                                init: Some(arr.computed_member(i).into()),
                                definite: false,
                            }],
                            ..Default::default()
                        }
                        .into(),
                    )
                }

                ForHead::Pat(pat) => prepend_stmt(
                    &mut body.stmts,
                    AssignExpr {
                        span: DUMMY_SP,
                        left: pat.try_into().unwrap(),
                        op: op!("="),
                        right: arr.computed_member(i).into(),
                    }
                    .into_stmt(),
                ),

                ForHead::UsingDecl(..) => {
                    unreachable!("using declaration must be removed by previous pass")
                }
            }

            let stmt = ForStmt {
                span,
                init: Some(
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Let,
                        declare: false,
                        decls,
                        ..Default::default()
                    }
                    .into(),
                ),
                test,
                update,
                body: Box::new(Stmt::Block(body)),
            }
            .into();

            return match label {
                Some(label) => LabeledStmt {
                    span,
                    label,
                    body: Box::new(stmt),
                }
                .into(),
                _ => stmt,
            };
        }

        // Loose mode
        if self.c.loose {
            let iterator = private_ident!("_iterator");
            let step = private_ident!("_step");

            let decls = vec![
                VarDeclarator {
                    span: DUMMY_SP,
                    name: iterator.clone().into(),
                    init: Some(Box::new(Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(create_for_of_iterator_helper_loose),
                        args: vec![right.as_arg()],
                        ..Default::default()
                    }))),
                    definite: Default::default(),
                },
                VarDeclarator {
                    span: DUMMY_SP,
                    name: step.clone().into(),
                    init: None,
                    definite: Default::default(),
                },
            ];

            let mut body = match *body {
                Stmt::Block(b) => b,
                _ => BlockStmt {
                    stmts: vec![*body],
                    ..Default::default()
                },
            };

            match left {
                ForHead::VarDecl(var) => {
                    assert_eq!(
                        var.decls.len(),
                        1,
                        "Variable declarator of for of loop cannot contain multiple entries"
                    );
                    prepend_stmt(
                        &mut body.stmts,
                        VarDecl {
                            kind: var.kind,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: var.decls.into_iter().next().unwrap().name,
                                init: Some(step.clone().make_member(quote_ident!("value")).into()),
                                definite: false,
                            }],
                            ..Default::default()
                        }
                        .into(),
                    )
                }

                ForHead::Pat(pat) => prepend_stmt(
                    &mut body.stmts,
                    AssignExpr {
                        span: DUMMY_SP,
                        left: pat.try_into().unwrap(),
                        op: op!("="),
                        right: step.clone().make_member(quote_ident!("value")).into(),
                    }
                    .into_stmt(),
                ),

                ForHead::UsingDecl(..) => {
                    unreachable!("using declaration must be removed by previous pass")
                }
            }

            // !(_step = _iterator()).done;
            let test = UnaryExpr {
                span: DUMMY_SP,
                op: op!("!"),
                arg: AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: step.into(),
                    right: CallExpr {
                        span: DUMMY_SP,
                        callee: iterator.as_callee(),
                        args: Vec::new(),
                        ..Default::default()
                    }
                    .into(),
                }
                .make_member(quote_ident!("done"))
                .into(),
            }
            .into();

            let stmt = ForStmt {
                span,
                init: Some(
                    VarDecl {
                        kind: VarDeclKind::Var,
                        decls,
                        ..Default::default()
                    }
                    .into(),
                ),
                test: Some(test),
                update: None,
                body: Box::new(Stmt::Block(body)),
            }
            .into();
            return match label {
                Some(label) => LabeledStmt {
                    span,
                    label,
                    body: Box::new(stmt),
                }
                .into(),
                _ => stmt,
            };
        }

        let var_span = left.span();
        let var_ctxt = SyntaxContext::empty().apply_mark(Mark::fresh(Mark::root()));

        let mut body = match *body {
            Stmt::Block(block) => block,
            body => BlockStmt {
                span: DUMMY_SP,
                stmts: vec![body],
                ..Default::default()
            },
        };

        let step = quote_ident!(var_ctxt, var_span, "_step");
        let step_value = step.clone().make_member(quote_ident!("value"));
        body.stmts.insert(
            0,
            match left {
                ForHead::VarDecl(mut var) => {
                    assert_eq!(var.decls.len(), 1);
                    VarDecl {
                        span: var.span,
                        kind: var.kind,
                        decls: vec![VarDeclarator {
                            init: Some(step_value.into()),
                            ..var.decls.pop().unwrap()
                        }],
                        declare: false,
                        ..Default::default()
                    }
                    .into()
                }
                ForHead::Pat(pat) => AssignExpr {
                    span: DUMMY_SP,
                    left: pat.try_into().unwrap(),
                    op: op!("="),
                    right: step_value.into(),
                }
                .into_stmt(),

                ForHead::UsingDecl(..) => {
                    unreachable!("using declaration must be removed by previous pass")
                }
            },
        );

        let iterator = quote_ident!(var_ctxt, var_span, "_iterator");
        // `_iterator.return`
        let iterator_return = iterator.clone().make_member(quote_ident!("return")).into();

        let normal_completion_ident =
            Ident::new("_iteratorNormalCompletion".into(), var_span, var_ctxt);
        self.top_level_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: normal_completion_ident.clone().into(),
            init: Some(true.into()),
            definite: false,
        });
        let error_flag_ident = Ident::new("_didIteratorError".into(), var_span, var_ctxt);
        self.top_level_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: error_flag_ident.clone().into(),
            init: Some(false.into()),
            definite: false,
        });
        let error_ident = Ident::new("_iteratorError".into(), var_span, var_ctxt);
        self.top_level_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: error_ident.clone().into(),
            init: Some(Ident::new_no_ctxt("undefined".into(), DUMMY_SP).into()),
            definite: false,
        });

        let for_stmt = ForStmt {
            span,
            init: Some(
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: vec![
                        VarDeclarator {
                            span: DUMMY_SP,
                            name: iterator.clone().into(),
                            init: Some(Box::new(Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: right
                                    .computed_member(member_expr!(
                                        Default::default(),
                                        Default::default(),
                                        Symbol.iterator
                                    ))
                                    .as_callee(),
                                args: Vec::new(),
                                ..Default::default()
                            }))),
                            definite: false,
                        },
                        VarDeclarator {
                            span: DUMMY_SP,
                            name: step.clone().into(),
                            init: None,
                            definite: false,
                        },
                    ],
                    ..Default::default()
                }
                .into(),
            ),
            // !(_iteratorNormalCompletion = (_step = _iterator.next()).done)
            test: Some(
                UnaryExpr {
                    span: DUMMY_SP,
                    op: op!("!"),
                    arg: {
                        let step_expr: Expr = AssignExpr {
                            span: DUMMY_SP,
                            left: step.into(),
                            op: op!("="),
                            // `_iterator.next()`
                            right: Box::new(Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                // `_iterator.next`
                                callee: iterator.make_member(quote_ident!("next")).as_callee(),
                                args: Vec::new(),
                                ..Default::default()
                            })),
                        }
                        .into();

                        Box::new(
                            AssignExpr {
                                span: DUMMY_SP,
                                left: normal_completion_ident.clone().into(),
                                op: op!("="),
                                right: step_expr.make_member(quote_ident!("done")).into(),
                            }
                            .into(),
                        )
                    },
                }
                .into(),
            ),

            // `_iteratorNormalCompletion = true`
            update: Some(
                AssignExpr {
                    span: DUMMY_SP,
                    left: normal_completion_ident.clone().into(),
                    op: op!("="),
                    right: true.into(),
                }
                .into(),
            ),
            body: Box::new(body.into()),
        }
        .into();

        let for_stmt = match label {
            Some(label) => LabeledStmt {
                span,
                label,
                body: Box::new(for_stmt),
            }
            .into(),
            None => for_stmt,
        };

        TryStmt {
            span: DUMMY_SP,
            block: BlockStmt {
                span: DUMMY_SP,
                stmts: vec![for_stmt],
                ..Default::default()
            },
            handler: Some(CatchClause {
                span: DUMMY_SP,
                param: Some(quote_ident!("err").into()),
                // _didIteratorError = true;
                // _iteratorError = err;
                body: BlockStmt {
                    stmts: vec![
                        // _didIteratorError = true;
                        AssignExpr {
                            span: DUMMY_SP,
                            left: error_flag_ident.clone().into(),
                            op: op!("="),
                            right: true.into(),
                        }
                        .into_stmt(),
                        // _iteratorError = err;
                        AssignExpr {
                            span: DUMMY_SP,
                            left: error_ident.clone().into(),
                            op: op!("="),
                            right: Box::new(Expr::Ident(quote_ident!("err").into())),
                        }
                        .into_stmt(),
                    ],
                    ..Default::default()
                },
            }),
            finalizer: Some(BlockStmt {
                stmts: vec![make_finally_block(
                    iterator_return,
                    &normal_completion_ident,
                    error_flag_ident,
                    error_ident,
                )],
                ..Default::default()
            }),
        }
        .into()
    }
}

/// ```js
///   try {
///     if (!_iteratorNormalCompletion && _iterator.return != null) {
///       _iterator.return();
///     }
///   } finally {
///     if (_didIteratorError) {
///       throw _iteratorError;
///     }
///   }
/// ```
#[tracing::instrument(level = "info", skip_all)]
fn make_finally_block(
    iterator_return: Box<Expr>,
    normal_completion_ident: &Ident,
    error_flag_ident: Ident,
    error_ident: Ident,
) -> Stmt {
    TryStmt {
        span: DUMMY_SP,
        block: BlockStmt {
            span: DUMMY_SP,
            stmts: vec![
                // if (!_iteratorNormalCompletion && _iterator.return !=
                // null) {
                //   _iterator.return();
                // }
                Stmt::If(IfStmt {
                    span: DUMMY_SP,
                    test: Box::new(Expr::Bin(BinExpr {
                        span: DUMMY_SP,
                        left: Box::new(Expr::Unary(UnaryExpr {
                            span: DUMMY_SP,
                            op: op!("!"),
                            arg: Box::new(Expr::Ident(normal_completion_ident.clone())),
                        })),
                        op: op!("&&"),
                        right: Box::new(Expr::Bin(BinExpr {
                            span: DUMMY_SP,
                            left: iterator_return.clone(),
                            op: op!("!="),
                            right: Null { span: DUMMY_SP }.into(),
                        })),
                    })),
                    cons: Box::new(Stmt::Block(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![CallExpr {
                            span: DUMMY_SP,
                            callee: iterator_return.as_callee(),
                            args: Vec::new(),
                            ..Default::default()
                        }
                        .into_stmt()],
                        ..Default::default()
                    })),
                    alt: None,
                }),
            ],
            ..Default::default()
        },
        handler: None,
        finalizer: Some(BlockStmt {
            stmts: vec![
                // if (_didIteratorError) {
                //   throw _iteratorError;
                // }
                Stmt::If(IfStmt {
                    span: DUMMY_SP,
                    test: Box::new(Expr::Ident(error_flag_ident)),
                    cons: Box::new(Stmt::Block(BlockStmt {
                        stmts: vec![Stmt::Throw(ThrowStmt {
                            span: DUMMY_SP,
                            arg: Box::new(Expr::Ident(error_ident)),
                        })],
                        ..Default::default()
                    })),
                    alt: None,
                }),
            ],
            ..Default::default()
        }),
    }
    .into()
}

impl Parallel for ForOf {
    fn create(&self) -> Self {
        ForOf {
            c: self.c,
            top_level_vars: Default::default(),
        }
    }

    fn merge(&mut self, other: Self) {
        self.top_level_vars.extend(other.top_level_vars);
    }
}

#[swc_trace]
impl ParExplode for ForOf {
    fn after_one_stmt(&mut self, stmts: &mut Vec<Stmt>) {
        // Add variable declaration
        // e.g. var ref
        if !self.top_level_vars.is_empty() {
            stmts.push(
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: take(&mut self.top_level_vars),
                    declare: false,
                    ..Default::default()
                }
                .into(),
            );
        }
    }

    fn after_one_module_item(&mut self, stmts: &mut Vec<ModuleItem>) {
        // Add variable declaration
        // e.g. var ref
        if !self.top_level_vars.is_empty() {
            stmts.push(
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: take(&mut self.top_level_vars),
                    declare: false,
                    ..Default::default()
                }
                .into(),
            );
        }
    }
}

#[swc_trace]
#[parallel(explode)]
impl VisitMut for ForOf {
    noop_visit_mut_type!(fail);

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        match s {
            Stmt::Labeled(LabeledStmt { label, body, .. }) => {
                // Handle label
                match &mut **body {
                    Stmt::ForOf(stmt) => {
                        stmt.visit_mut_children_with(self);

                        *s = self.fold_for_stmt(Some(label.clone()), stmt.take());
                    }
                    _ => {
                        body.visit_mut_with(self);
                    }
                }
            }
            Stmt::ForOf(stmt) => {
                stmt.visit_mut_children_with(self);

                *s = self.fold_for_stmt(None, stmt.take())
            }
            _ => s.visit_mut_children_with(self),
        }
    }
}
