use serde::Deserialize;
use swc_atoms::js_word;
use swc_common::{util::take::Take, Mark, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    alias_if_required, member_expr, prepend_stmt, private_ident, quote_ident, ExprFactory,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
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
#[tracing::instrument(level = "info", skip_all)]
pub fn for_of(c: Config) -> impl Fold + VisitMut {
    as_folder(ForOf {
        c,
        top_level_vars: Default::default(),
    })
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
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
        if self.c.assume_array {
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

            let test = Some(Box::new(Expr::Bin(BinExpr {
                span: DUMMY_SP,
                left: Box::new(Expr::Ident(i.clone())),
                op: op!("<"),
                right: Box::new(arr.clone().make_member(quote_ident!("length"))),
            })));
            let update = Some(Box::new(Expr::Update(UpdateExpr {
                span: DUMMY_SP,
                prefix: false,
                op: op!("++"),
                arg: Box::new(Expr::Ident(i.clone())),
            })));

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
                },
            };

            match left {
                VarDeclOrPat::VarDecl(var) => {
                    assert_eq!(
                        var.decls.len(),
                        1,
                        "Variable declarator of for of loop cannot contain multiple entries"
                    );
                    prepend_stmt(
                        &mut body.stmts,
                        Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: var.kind,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: var.decls.into_iter().next().unwrap().name,
                                init: Some(Box::new(Expr::Ident(arr).computed_member(i))),
                                definite: false,
                            }],
                        })),
                    )
                }

                VarDeclOrPat::Pat(pat) => prepend_stmt(
                    &mut body.stmts,
                    AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Pat(Box::new(pat)),
                        op: op!("="),
                        right: Box::new(Expr::Ident(arr).computed_member(i)),
                    }
                    .into_stmt(),
                ),
            }

            let stmt = Stmt::For(ForStmt {
                span,
                init: Some(VarDeclOrExpr::VarDecl(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Let,
                    declare: false,
                    decls,
                })),
                test,
                update,
                body: Box::new(Stmt::Block(body)),
            });

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

        let var_span = left.span().apply_mark(Mark::fresh(Mark::root()));

        let mut body = match *body {
            Stmt::Block(block) => block,
            body => BlockStmt {
                span: DUMMY_SP,
                stmts: vec![body],
            },
        };

        let step = quote_ident!(var_span, "_step");
        let step_value = Box::new(step.clone().make_member(quote_ident!("value")));
        body.stmts.insert(
            0,
            match left {
                VarDeclOrPat::VarDecl(mut var) => {
                    assert_eq!(var.decls.len(), 1);
                    Stmt::Decl(Decl::Var(VarDecl {
                        span: var.span,
                        kind: var.kind,
                        decls: vec![VarDeclarator {
                            init: Some(step_value),
                            ..var.decls.pop().unwrap()
                        }],
                        declare: false,
                    }))
                }
                VarDeclOrPat::Pat(pat) => AssignExpr {
                    span: DUMMY_SP,
                    left: PatOrExpr::Pat(Box::new(pat)),
                    op: op!("="),
                    right: step_value,
                }
                .into_stmt(),
            },
        );

        let iterator = quote_ident!(var_span, "_iterator");
        // `_iterator.return`
        let iterator_return = Box::new(iterator.clone().make_member(quote_ident!("return")));

        let normal_completion_ident = Ident::new("_iteratorNormalCompletion".into(), var_span);
        self.top_level_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: normal_completion_ident.clone().into(),
            init: Some(true.into()),
            definite: false,
        });
        let error_flag_ident = Ident::new("_didIteratorError".into(), var_span);
        self.top_level_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: error_flag_ident.clone().into(),
            init: Some(false.into()),
            definite: false,
        });
        let error_ident = Ident::new("_iteratorError".into(), var_span);
        self.top_level_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: error_ident.clone().into(),
            init: Some(Box::new(Expr::Ident(Ident::new(
                js_word!("undefined"),
                DUMMY_SP,
            )))),
            definite: false,
        });

        let for_stmt = ForStmt {
            span,
            init: Some(VarDeclOrExpr::VarDecl(VarDecl {
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
                                .computed_member(*member_expr!(DUMMY_SP, Symbol.iterator))
                                .as_callee(),
                            args: vec![],
                            type_args: Default::default(),
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
            })),
            // !(_iteratorNormalCompletion = (_step = _iterator.next()).done)
            test: Some(Box::new(Expr::Unary(UnaryExpr {
                span: DUMMY_SP,
                op: op!("!"),
                arg: {
                    let step_expr = Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Pat(step.into()),
                        op: op!("="),
                        // `_iterator.next()`
                        right: Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            // `_iterator.next`
                            callee: iterator.make_member(quote_ident!("next")).as_callee(),
                            args: vec![],
                            type_args: Default::default(),
                        })),
                    }));

                    Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Pat(normal_completion_ident.clone().into()),
                        op: op!("="),
                        right: Box::new(step_expr.make_member(quote_ident!("done"))),
                    }))
                },
            }))),

            // `_iteratorNormalCompletion = true`
            update: Some(Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                left: PatOrExpr::Pat(normal_completion_ident.clone().into()),
                op: op!("="),
                right: true.into(),
            }))),
            body: Box::new(Stmt::Block(body)),
        }
        .into();

        let for_stmt = match label {
            Some(label) => Stmt::Labeled(LabeledStmt {
                span,
                label,
                body: Box::new(for_stmt),
            }),
            None => for_stmt,
        };

        Stmt::Try(TryStmt {
            span: DUMMY_SP,
            block: BlockStmt {
                span: DUMMY_SP,
                stmts: vec![for_stmt],
            },
            handler: Some(CatchClause {
                span: DUMMY_SP,
                param: Some(quote_ident!("err").into()),
                // _didIteratorError = true;
                // _iteratorError = err;
                body: BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![
                        // _didIteratorError = true;
                        AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Pat(error_flag_ident.clone().into()),
                            op: op!("="),
                            right: true.into(),
                        }
                        .into_stmt(),
                        // _iteratorError = err;
                        AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Pat(error_ident.clone().into()),
                            op: op!("="),
                            right: Box::new(Expr::Ident(quote_ident!("err"))),
                        }
                        .into_stmt(),
                    ],
                },
            }),
            finalizer: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![make_finally_block(
                    iterator_return,
                    &normal_completion_ident,
                    error_flag_ident,
                    error_ident,
                )],
            }),
        })
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
    Stmt::Try(TryStmt {
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
                            args: vec![],
                            type_args: Default::default(),
                        }
                        .into_stmt()],
                    })),
                    alt: None,
                }),
            ],
        },
        handler: None,
        finalizer: Some(BlockStmt {
            span: DUMMY_SP,

            stmts: vec![
                // if (_didIteratorError) {
                //   throw _iteratorError;
                // }
                Stmt::If(IfStmt {
                    span: DUMMY_SP,
                    test: Box::new(Expr::Ident(error_flag_ident)),
                    cons: Box::new(Stmt::Block(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![Stmt::Throw(ThrowStmt {
                            span: DUMMY_SP,
                            arg: Box::new(Expr::Ident(error_ident)),
                        })],
                    })),
                    alt: None,
                }),
            ],
        }),
    })
}

#[swc_trace]
impl VisitMut for ForOf {
    noop_visit_mut_type!();

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
                        body.visit_mut_children_with(self);
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
