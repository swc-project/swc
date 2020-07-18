use crate::util::{alias_if_required, prepend, ExprFactory, StmtLike};
use serde::Deserialize;
use swc_atoms::js_word;
use swc_common::{Mark, Spanned, DUMMY_SP};
use swc_ecma_ast::*;

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

noop_fold_type!(ForOf);

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

            let test = Some(box Expr::Bin(BinExpr {
                span: DUMMY_SP,
                left: box Expr::Ident(i.clone()),
                op: op!("<"),
                right: box arr.clone().member(quote_ident!("length")),
            }));
            let update = Some(box Expr::Update(UpdateExpr {
                span: DUMMY_SP,
                prefix: false,
                op: op!("++"),
                arg: box Expr::Ident(i.clone()),
            }));

            let mut decls = Vec::with_capacity(2);
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(i.clone()),
                init: Some(box Expr::Lit(Lit::Num(Number {
                    span: DUMMY_SP,
                    value: 0f64,
                }))),
                definite: false,
            });

            if aliased {
                decls.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(arr.clone()),
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
                                init: Some(box Expr::Ident(arr.clone()).computed_member(i)),
                                definite: false,
                            }],
                        })),
                    )
                }

                VarDeclOrPat::Pat(pat) => prepend(
                    &mut body.stmts,
                    AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Pat(box pat),
                        op: op!("="),
                        right: box Expr::Ident(arr.clone()).computed_member(i),
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
                body: box Stmt::Block(body),
            });

            return match label {
                Some(label) => LabeledStmt {
                    span,
                    label,
                    body: box stmt,
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
        let step_value = box step.clone().member(quote_ident!("value"));
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
                    left: PatOrExpr::Pat(box pat),
                    op: op!("="),
                    right: step_value,
                }
                .into_stmt(),
            },
        );

        let iterator = quote_ident!(var_span, "_iterator");
        // `_iterator.return`
        let iterator_return = box iterator.clone().member(quote_ident!("return"));

        let normal_completion_ident = Ident::new("_iteratorNormalCompletion".into(), var_span);
        self.top_level_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(normal_completion_ident.clone()),
            init: Some(box Expr::Lit(Lit::Bool(Bool {
                span: DUMMY_SP,
                value: true,
            }))),
            definite: false,
        });
        let error_flag_ident = Ident::new("_didIteratorError".into(), var_span);
        self.top_level_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(error_flag_ident.clone()),
            init: Some(box Expr::Lit(Lit::Bool(Bool {
                span: DUMMY_SP,
                value: false,
            }))),
            definite: false,
        });
        let error_ident = Ident::new("_iteratorError".into(), var_span);
        self.top_level_vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(error_ident.clone()),
            init: Some(box Expr::Ident(Ident::new(js_word!("undefined"), DUMMY_SP))),
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
                        name: Pat::Ident(iterator.clone()),
                        init: Some(box Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: right
                                .computed_member(*member_expr!(DUMMY_SP, Symbol.iterator))
                                .as_callee(),
                            args: vec![],
                            type_args: Default::default(),
                        })),
                        definite: false,
                    },
                    VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(step.clone()),
                        init: None,
                        definite: false,
                    },
                ],
            })),
            // !(_iteratorNormalCompletion = (_step = _iterator.next()).done)
            test: Some(box Expr::Unary(UnaryExpr {
                span: DUMMY_SP,
                op: op!("!"),
                arg: {
                    let step_expr = box Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Pat(box Pat::Ident(step)),
                        op: op!("="),
                        // `_iterator.next()`
                        right: box Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            // `_iterator.next`
                            callee: iterator.member(quote_ident!("next")).as_callee(),
                            args: vec![],
                            type_args: Default::default(),
                        }),
                    });

                    let iteration_normal_completion = box Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Pat(box Pat::Ident(normal_completion_ident.clone())),
                        op: op!("="),
                        right: box step_expr.member(quote_ident!("done")),
                    });

                    iteration_normal_completion
                },
            })),

            // `_iteratorNormalCompletion = true`
            update: Some(box Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                left: PatOrExpr::Pat(box Pat::Ident(normal_completion_ident.clone())),
                op: op!("="),
                right: box Expr::Lit(Lit::Bool(Bool {
                    span: DUMMY_SP,
                    value: true,
                })),
            })),
            body: box Stmt::Block(body),
        }
        .into();

        let for_stmt = match label {
            Some(label) => Stmt::Labeled(LabeledStmt {
                span,
                label,
                body: box for_stmt,
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
                param: Some(Pat::Ident(quote_ident!("err"))),
                // _didIteratorError = true;
                // _iteratorError = err;
                body: BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![
                        // _didIteratorError = true;
                        AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Pat(box Pat::Ident(error_flag_ident.clone())),
                            op: op!("="),
                            right: box Expr::Lit(Lit::Bool(Bool {
                                span: DUMMY_SP,
                                value: true,
                            })),
                        }
                        .into_stmt(),
                        // _iteratorError = err;
                        AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Pat(box Pat::Ident(error_ident.clone())),
                            op: op!("="),
                            right: box Expr::Ident(quote_ident!("err")),
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

impl Fold<Stmt> for Actual {
    fn fold(&mut self, stmt: Stmt) -> Stmt {
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
                    test: box Expr::Bin(BinExpr {
                        span: DUMMY_SP,
                        left: box Expr::Unary(UnaryExpr {
                            span: DUMMY_SP,
                            op: op!("!"),
                            arg: box Expr::Ident(normal_completion_ident.clone()),
                        }),
                        op: op!("&&"),
                        right: box Expr::Bin(BinExpr {
                            span: DUMMY_SP,
                            left: iterator_return.clone(),
                            op: op!("!="),
                            right: box Expr::Lit(Lit::Null(Null { span: DUMMY_SP })),
                        }),
                    }),
                    cons: box Stmt::Block(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![CallExpr {
                            span: DUMMY_SP,
                            callee: iterator_return.as_callee(),
                            args: vec![],
                            type_args: Default::default(),
                        }
                        .into_stmt()],
                    }),
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
                    test: box Expr::Ident(error_flag_ident),
                    cons: box Stmt::Block(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![Stmt::Throw(ThrowStmt {
                            span: DUMMY_SP,
                            arg: box Expr::Ident(error_ident),
                        })],
                    }),
                    alt: None,
                }),
            ],
        }),
    })
}

impl<T: StmtLike + VisitWith<ForOfFinder>> Fold<Vec<T>> for ForOf
where
    Vec<T>: FoldWith<Self>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
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
    node.visit_with(&mut v);
    v.found
}

struct ForOfFinder {
    found: bool,
}

impl Visit<ForOfStmt> for ForOfFinder {
    fn visit(&mut self, _: &ForOfStmt) {
        self.found = true;
    }
}
