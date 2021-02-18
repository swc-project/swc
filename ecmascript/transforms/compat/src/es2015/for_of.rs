use serde::Deserialize;
use swc_atoms::js_word;
use swc_common::{Mark, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::alias_if_required;
use swc_ecma_utils::member_expr;
use swc_ecma_utils::prepend;
use swc_ecma_utils::private_ident;
use swc_ecma_utils::quote_ident;
use swc_ecma_utils::ExprFactory;
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, Node, Visit, VisitWith};

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
pub fn for_of(c: Config) -> impl Fold {
    ForOf { c }
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    pub assume_array: bool,
}

struct ForOf {
    c: Config,
}

/// Real folder.
struct Actual {
    c: Config,
    ///```js
    /// var _iteratorNormalCompletion = true;
    /// var _didIteratorError = false;
    /// var _iteratorError = undefined;
    /// ```
    top_level_vars: Vec<VarDeclarator>,
}

impl Actual {
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
                name: Pat::Ident(i.clone().into()),
                init: Some(Box::new(Expr::Lit(Lit::Num(Number {
                    span: DUMMY_SP,
                    value: 0f64,
                })))),
                definite: false,
            });

            if aliased {
                decls.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(arr.clone().into()),
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
                        "Variable declarator of for of loop cannot contain multiple entires"
                    );
                    prepend(
                        &mut body.stmts,
                        Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: var.kind,
                            declare: false,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: var.decls.into_iter().next().unwrap().name,
                                init: Some(Box::new(Expr::Ident(arr.clone()).computed_member(i))),
                                definite: false,
                            }],
                        })),
                    )
                }

                VarDeclOrPat::Pat(pat) => prepend(
                    &mut body.stmts,
                    AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Pat(Box::new(pat)),
                        op: op!("="),
                        right: Box::new(Expr::Ident(arr.clone()).computed_member(i)),
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
            name: Pat::Ident(normal_completion_ident.clone().into()),
            init: Some(Box::new(Expr::Lit(Lit::Bool(Bool {
                span: DUMMY_SP,
                value: true,
            })))),
            definite: false,
        });
        let error_flag_ident = Ident::new("_didIteratorError".into(), var_span);
        self.top_level_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(error_flag_ident.clone().into()),
            init: Some(Box::new(Expr::Lit(Lit::Bool(Bool {
                span: DUMMY_SP,
                value: false,
            })))),
            definite: false,
        });
        let error_ident = Ident::new("_iteratorError".into(), var_span);
        self.top_level_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(error_ident.clone().into()),
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
                        name: Pat::Ident(iterator.clone().into()),
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
                        name: Pat::Ident(step.clone().into()),
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
                        left: PatOrExpr::Pat(Box::new(Pat::Ident(step.into()))),
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

                    let iteration_normal_completion = Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Pat(Box::new(Pat::Ident(
                            normal_completion_ident.clone().into(),
                        ))),
                        op: op!("="),
                        right: Box::new(step_expr.make_member(quote_ident!("done"))),
                    }));

                    iteration_normal_completion
                },
            }))),

            // `_iteratorNormalCompletion = true`
            update: Some(Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                left: PatOrExpr::Pat(Box::new(Pat::Ident(normal_completion_ident.clone().into()))),
                op: op!("="),
                right: Box::new(Expr::Lit(Lit::Bool(Bool {
                    span: DUMMY_SP,
                    value: true,
                }))),
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
                param: Some(Pat::Ident(quote_ident!("err").into())),
                // _didIteratorError = true;
                // _iteratorError = err;
                body: BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![
                        // _didIteratorError = true;
                        AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Pat(Box::new(Pat::Ident(
                                error_flag_ident.clone().into(),
                            ))),
                            op: op!("="),
                            right: Box::new(Expr::Lit(Lit::Bool(Bool {
                                span: DUMMY_SP,
                                value: true,
                            }))),
                        }
                        .into_stmt(),
                        // _iteratorError = err;
                        AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Pat(Box::new(Pat::Ident(error_ident.clone().into()))),
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

impl Fold for Actual {
    noop_fold_type!();

    fn fold_stmt(&mut self, stmt: Stmt) -> Stmt {
        match stmt {
            Stmt::Labeled(LabeledStmt { span, label, body }) => {
                // Handle label
                match *body {
                    Stmt::ForOf(stmt) => self.fold_for_stmt(Some(label), stmt),
                    _ => Stmt::Labeled(LabeledStmt {
                        span,
                        label,
                        body: body.fold_children_with(self),
                    }),
                }
            }
            Stmt::ForOf(stmt) => self.fold_for_stmt(None, stmt),
            _ => stmt.fold_children_with(self),
        }
    }
}

/// ```js
/// 
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
                            right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
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

impl Fold for ForOf {
    noop_fold_type!();

    fn fold_module_items(&mut self, n: Vec<ModuleItem>) -> Vec<ModuleItem> {
        self.fold_stmt_like(n)
    }

    fn fold_stmts(&mut self, n: Vec<Stmt>) -> Vec<Stmt> {
        self.fold_stmt_like(n)
    }
}

impl ForOf {
    fn fold_stmt_like<T>(&mut self, stmts: Vec<T>) -> Vec<T>
    where
        T: StmtLike + VisitWith<ForOfFinder>,
        Vec<T>: FoldWith<Self> + VisitWith<ForOfFinder>,
    {
        if !contains_for_of(&stmts) {
            return stmts;
        }

        let stmts = stmts.fold_children_with(self);

        let mut buf = Vec::with_capacity(stmts.len());

        for stmt in stmts {
            match stmt.try_into_stmt() {
                Err(module_item) => buf.push(module_item),
                Ok(stmt) => {
                    let mut folder = Actual {
                        c: self.c,
                        top_level_vars: Default::default(),
                    };
                    let stmt = stmt.fold_with(&mut folder);

                    // Add variable declaration
                    // e.g. var ref
                    if !folder.top_level_vars.is_empty() {
                        buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: folder.top_level_vars,
                            declare: false,
                        }))));
                    }

                    buf.push(T::from_stmt(stmt));
                }
            }
        }

        buf
    }
}

fn contains_for_of<N>(node: &N) -> bool
where
    N: VisitWith<ForOfFinder>,
{
    let mut v = ForOfFinder { found: false };
    node.visit_with(&Invalid { span: DUMMY_SP } as _, &mut v);
    v.found
}

struct ForOfFinder {
    found: bool,
}

impl Visit for ForOfFinder {
    noop_visit_type!();

    fn visit_for_of_stmt(&mut self, _: &ForOfStmt, _: &dyn Node) {
        self.found = true;
    }
}
