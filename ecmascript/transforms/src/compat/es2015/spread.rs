use crate::util::{alias_ident_for, is_literal, prepend, undefined, ExprFactory, StmtLike};
use serde::Deserialize;
use std::mem;
use swc_atoms::js_word;
use swc_common::{util::move_map::MoveMap, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, FoldWith};

pub fn spread(c: Config) -> impl Fold {
    Spread { c }
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    pub loose: bool,
}

/// es2015 - `SpreadElement`
#[derive(Default)]
struct Spread {
    c: Config,
}

noop_fold_type!(Spread);

#[derive(Default)]
struct ActualFolder {
    c: Config,
    vars: Vec<VarDeclarator>,
}

noop_fold_type!(ActualFolder);

impl<T> Fold for Spread
where
    T: StmtLike + FoldWith<ActualFolder> + FoldWith<Self>,
{
    fn fold(&mut self, items: Vec<T>) -> Vec<T> {
        let mut folder = ActualFolder {
            c: self.c,
            vars: vec![],
        };
        let mut items = items.move_map(|item| item.fold_with(&mut folder));
        if !folder.vars.is_empty() {
            prepend(
                &mut items,
                T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: mem::replace(&mut folder.vars, vec![]),
                }))),
            );
        }

        items
    }
}

impl Fold for ActualFolder {
    fn fold_expr(&mut self, e: Expr) -> Expr {
        let e = validate!(e.fold_children_with(self));

        match e {
            Expr::Array(ArrayLit { span, elems }) => {
                if !elems.iter().any(|e| match e {
                    Some(ExprOrSpread {
                        spread: Some(_), ..
                    }) => true,
                    _ => false,
                }) {
                    return Expr::Array(ArrayLit { span, elems });
                }

                self.concat_args(span, elems.into_iter(), true)
            }

            // super(...spread) should be removed by es2015::classes pass
            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(callee),
                args,
                span,
                type_args,
            }) => {
                let has_spread = args
                    .iter()
                    .any(|ExprOrSpread { spread, .. }| spread.is_some());
                if !has_spread {
                    return Expr::Call(CallExpr {
                        callee: ExprOrSuper::Expr(callee),
                        args,
                        span,
                        type_args,
                    });
                }
                let (this, callee) = match *callee {
                    Expr::Member(MemberExpr {
                        obj: ExprOrSuper::Super(Super { span, .. }),
                        ..
                    }) => (box Expr::This(ThisExpr { span }), callee),

                    Expr::Member(MemberExpr {
                        obj: ExprOrSuper::Expr(ref expr @ box Expr::This(..)),
                        ..
                    }) => (expr.clone(), callee),

                    // Injected variables can be accessed without any side effect
                    Expr::Member(MemberExpr {
                        obj: ExprOrSuper::Expr(box Expr::Ident(ref i)),
                        ..
                    }) if i.span.is_dummy() => (box Expr::Ident(i.clone()), callee),

                    Expr::Ident(Ident { span, .. }) => (undefined(span), callee),

                    Expr::Member(MemberExpr {
                        span,
                        obj: ExprOrSuper::Expr(expr),
                        prop,
                        computed,
                    }) => {
                        let ident = alias_ident_for(&expr, "_instance");
                        self.vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            definite: false,
                            name: Pat::Ident(ident.clone()),
                            // Initialized by paren exprssion.
                            init: None,
                        });

                        let this = box Expr::Ident(ident.clone());
                        let callee = Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Pat(box Pat::Ident(ident)),
                            op: op!("="),
                            right: expr,
                        });
                        (
                            this,
                            box Expr::Member(MemberExpr {
                                span,
                                obj: callee.as_obj(),
                                prop,
                                computed,
                            }),
                        )
                    }

                    // https://github.com/swc-project/swc/issues/400
                    // _ => (undefined(callee.span()), callee),
                    _ => (
                        box Expr::This(ThisExpr {
                            span: callee.span(),
                        }),
                        callee,
                    ),
                };

                let args_array = if is_literal(&args) {
                    Expr::Array(ArrayLit {
                        span,
                        elems: expand_literal_args(args.into_iter().map(Some)),
                    })
                } else {
                    self.concat_args(span, args.into_iter().map(Some), false)
                };
                let apply = MemberExpr {
                    span: DUMMY_SP,
                    obj: callee.as_callee(),
                    prop: box Ident::new(js_word!("apply"), span).into(),
                    computed: false,
                };

                Expr::Call(CallExpr {
                    span,
                    callee: apply.as_callee(),
                    args: vec![this.as_arg(), args_array.as_arg()],
                    type_args: None,
                })
            }
            Expr::New(NewExpr {
                callee,
                args: Some(args),
                span,
                type_args,
            }) => {
                let has_spread = args
                    .iter()
                    .any(|ExprOrSpread { spread, .. }| spread.is_some());
                if !has_spread {
                    return Expr::New(NewExpr {
                        span,
                        callee,
                        args: Some(args),
                        type_args,
                    });
                }

                let args = self.concat_args(span, args.into_iter().map(Some), true);

                Expr::Call(CallExpr {
                    span,
                    callee: helper!(construct, "construct"),
                    args: vec![callee.as_arg(), args.as_arg()],
                    type_args: Default::default(),
                })
            }
            _ => e,
        }
    }
}

impl ActualFolder {
    fn concat_args(
        &self,
        span: Span,
        args: impl ExactSizeIterator + Iterator<Item = Option<ExprOrSpread>>,
        need_array: bool,
    ) -> Expr {
        //
        // []
        //
        let mut first_arr = None;

        let mut tmp_arr = vec![];
        let mut buf = vec![];
        let args_len = args.len();

        macro_rules! make_arr {
            () => {
                let elems = mem::replace(&mut tmp_arr, vec![]);
                match first_arr {
                    Some(_) => {
                        if !elems.is_empty() {
                            buf.push(Expr::Array(ArrayLit { span, elems }).as_arg());
                        }
                    }
                    None => {
                        first_arr = Some(Expr::Array(ArrayLit { span, elems }));
                    }
                }
            };
        }

        for arg in args {
            if let Some(arg) = arg {
                let ExprOrSpread { expr, spread } = arg;

                match spread {
                    // ...b -> toConsumableArray(b)
                    Some(span) => {
                        //
                        make_arr!();

                        buf.push(match *expr {
                            Expr::Ident(Ident {
                                sym: js_word!("arguments"),
                                ..
                            }) => {
                                if args_len == 1 {
                                    if need_array {
                                        return Expr::Call(CallExpr {
                                            span,
                                            callee: member_expr!(
                                                DUMMY_SP,
                                                Array.prototype.slice.call
                                            )
                                            .as_callee(),
                                            args: vec![expr.as_arg()],
                                            type_args: Default::default(),
                                        });
                                    } else {
                                        return *expr;
                                    }
                                } else {
                                    Expr::Call(CallExpr {
                                        span,
                                        callee: member_expr!(DUMMY_SP, Array.prototype.slice.call)
                                            .as_callee(),
                                        args: vec![expr.as_arg()],
                                        type_args: Default::default(),
                                    })
                                    .as_arg()
                                }
                            }
                            _ => {
                                if args_len == 1 && !need_array {
                                    return if self.c.loose {
                                        *expr
                                    } else {
                                        Expr::Call(CallExpr {
                                            span,
                                            callee: helper!(
                                                to_consumable_array,
                                                "toConsumableArray"
                                            ),
                                            args: vec![expr.as_arg()],
                                            type_args: Default::default(),
                                        })
                                    };
                                }
                                // [].concat(arr) is shorter than _toConsumableArray(arr)
                                if args_len == 1 {
                                    return if self.c.loose {
                                        Expr::Call(CallExpr {
                                            span: DUMMY_SP,
                                            callee: ArrayLit {
                                                span: DUMMY_SP,
                                                elems: vec![],
                                            }
                                            .member(quote_ident!("concat"))
                                            .as_callee(),
                                            args: vec![expr.as_arg()],
                                            type_args: Default::default(),
                                        })
                                    } else {
                                        Expr::Call(CallExpr {
                                            span,
                                            callee: helper!(
                                                to_consumable_array,
                                                "toConsumableArray"
                                            ),
                                            args: vec![expr.as_arg()],
                                            type_args: Default::default(),
                                        })
                                    };
                                }

                                Expr::Call(CallExpr {
                                    span,
                                    callee: helper!(to_consumable_array, "toConsumableArray"),
                                    args: vec![expr.as_arg()],
                                    type_args: Default::default(),
                                })
                                .as_arg()
                            }
                        });
                    }
                    None => tmp_arr.push(Some(expr.as_arg())),
                }
            } else {
                tmp_arr.push(None);
            }
        }
        make_arr!();

        if !buf.is_empty()
            && match first_arr {
                None => true,
                Some(Expr::Array(ref arr)) if arr.elems.is_empty() => true,
                _ => false,
            }
        {
            let callee = buf
                .remove(0)
                .expr
                .member(Ident::new(js_word!("concat"), DUMMY_SP))
                .as_callee();

            if buf[0].spread.is_none() {
                return Expr::Call(CallExpr {
                    span,
                    callee,
                    args: buf,
                    type_args: Default::default(),
                });
            } else {
                return Expr::Call(CallExpr {
                    span,
                    callee,
                    args: buf,
                    type_args: Default::default(),
                });
            }
        }

        Expr::Call(CallExpr {
            // TODO
            span,

            callee: first_arr
                .take()
                .unwrap_or_else(|| {
                    // No arg

                    // assert!(args.is_empty());
                    Expr::Array(ArrayLit {
                        span,
                        elems: vec![],
                    })
                })
                .member(Ident::new(js_word!("concat"), span))
                .as_callee(),

            args: buf,
            type_args: Default::default(),
        })
    }
}

fn expand_literal_args(
    args: impl ExactSizeIterator + Iterator<Item = Option<ExprOrSpread>>,
) -> Vec<Option<ExprOrSpread>> {
    fn expand(
        buf: &mut Vec<Option<ExprOrSpread>>,
        args: impl ExactSizeIterator + Iterator<Item = Option<ExprOrSpread>>,
    ) {
        for arg in args {
            match arg {
                Some(ExprOrSpread {
                    spread: Some(..),
                    expr: box Expr::Array(arr),
                }) => expand(buf, arr.elems.into_iter()),
                _ => buf.push(arg),
            }
        }
    }

    let mut buf = Vec::with_capacity(args.len() + 4);
    expand(&mut buf, args);
    buf
}
