use crate::{
    pass::Pass,
    util::{alias_ident_for, prepend, undefined, ExprFactory, StmtLike},
};
use ast::*;
use std::{iter, mem};
use swc_common::{util::move_map::MoveMap, Fold, FoldWith, Span, Spanned, DUMMY_SP};

#[cfg(test)]
mod tests;

pub fn spread() -> impl Pass {
    Spread
}

/// es2015 - `SpreadElement`
#[derive(Default, Clone)]
struct Spread;

#[derive(Default)]
struct ActualFolder {
    vars: Vec<VarDeclarator>,
}

impl<T> Fold<Vec<T>> for Spread
where
    T: StmtLike + FoldWith<ActualFolder> + FoldWith<Self>,
{
    fn fold(&mut self, items: Vec<T>) -> Vec<T> {
        let mut folder = ActualFolder::default();
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

impl Fold<Expr> for ActualFolder {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = e.fold_children(self);

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

                concat_args(span, elems.into_iter(), true)
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

                let args_array = concat_args(span, args.into_iter().map(Some), false);
                let apply = MemberExpr {
                    span: DUMMY_SP,
                    obj: callee.as_callee(),
                    prop: box Ident::new(js_word!("apply"), span).into(),
                    computed: false,
                };

                Expr::Call(CallExpr {
                    span,
                    callee: apply.as_callee(),
                    args: iter::once(this.as_arg())
                        .chain(iter::once(args_array.as_arg()))
                        .collect(),
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

                let args = concat_args(span, args.into_iter().map(Some), true);

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

fn concat_args(
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
                                        callee: member_expr!(DUMMY_SP, Array.prototype.slice.call)
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
                                return *expr;
                            }
                            // [].concat(arr) is shorter than _toConsumableArray(arr)
                            if args_len == 1 {
                                return Expr::Call(CallExpr {
                                    span: DUMMY_SP,
                                    callee: ArrayLit {
                                        span: DUMMY_SP,
                                        elems: vec![],
                                    }
                                    .member(quote_ident!("concat"))
                                    .as_callee(),
                                    args: vec![expr.as_arg()],
                                    type_args: Default::default(),
                                });
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
