use std::mem;

use serde::Deserialize;
use swc_atoms::js_word;
use swc_common::{util::take::Take, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{ext::ExprRefExt, helper, perf::Check};
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{
    alias_ident_for, member_expr, prepend_stmt, quote_ident, undefined, ExprFactory, StmtLike,
};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitMutWith, VisitWith,
};
use swc_trace_macro::swc_trace;

pub fn spread(c: Config) -> impl Fold + VisitMut {
    as_folder(Spread {
        c,
        vars: Default::default(),
    })
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
    vars: Vec<VarDeclarator>,
}

#[swc_trace]
#[fast_path(SpreadFinder)]
impl VisitMut for Spread {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_like(n);
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.visit_mut_stmt_like(n);
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::Array(ArrayLit { span, elems }) => {
                if !elems.iter().any(|e| {
                    matches!(
                        e,
                        Some(ExprOrSpread {
                            spread: Some(_),
                            ..
                        })
                    )
                }) {
                    return;
                }

                *e = self.concat_args(*span, elems.take().into_iter(), true);
            }

            // super(...spread) should be removed by es2015::classes pass
            Expr::Call(CallExpr {
                callee: Callee::Expr(callee),
                args,
                span,
                ..
            }) => {
                let has_spread = args
                    .iter()
                    .any(|ExprOrSpread { spread, .. }| spread.is_some());
                if !has_spread {
                    return;
                }

                let (this, callee_updated) = match &**callee {
                    Expr::SuperProp(SuperPropExpr {
                        obj: Super { span, .. },
                        ..
                    }) => (Box::new(Expr::This(ThisExpr { span: *span })), None),

                    Expr::Member(MemberExpr { obj, .. }) if obj.is_this() => (obj.clone(), None),

                    // Injected variables can be accessed without any side effect
                    Expr::Member(MemberExpr { obj, .. })
                        if obj.as_ident().is_some() && obj.as_ident().unwrap().span.is_dummy() =>
                    {
                        (Box::new(Expr::Ident(obj.as_ident().unwrap().clone())), None)
                    }

                    Expr::Ident(Ident { span, .. }) => (undefined(*span), None),

                    Expr::Member(MemberExpr { span, obj, prop }) => {
                        let ident = alias_ident_for(obj, "_instance");
                        self.vars.push(VarDeclarator {
                            span: DUMMY_SP,
                            definite: false,
                            // Initialized by paren expression.
                            name: ident.clone().into(),
                            // Initialized by paren expression.
                            init: None,
                        });

                        let this = Box::new(Expr::Ident(ident.clone()));
                        let callee = Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Pat(ident.into()),
                            op: op!("="),
                            right: obj.clone(),
                        });
                        (
                            this,
                            Some(Box::new(Expr::Member(MemberExpr {
                                span: *span,
                                obj: callee.into(),
                                prop: prop.clone(),
                            }))),
                        )
                    }

                    // https://github.com/swc-project/swc/issues/400
                    // _ => (undefined(callee.span()), callee),
                    _ => (
                        Box::new(Expr::This(ThisExpr {
                            span: callee.span(),
                        })),
                        None,
                    ),
                };

                let args_array = if args.iter().all(|e| {
                    matches!(e, ExprOrSpread { spread: None, .. })
                        || matches!(e, ExprOrSpread { expr, .. } if expr.is_array())
                }) {
                    Expr::Array(ArrayLit {
                        span: *span,
                        elems: expand_literal_args(args.take().into_iter().map(Some)),
                    })
                } else {
                    self.concat_args(*span, args.take().into_iter().map(Some), false)
                };

                let apply = MemberExpr {
                    span: DUMMY_SP,
                    obj: callee_updated.unwrap_or_else(|| callee.take()),
                    prop: MemberProp::Ident(Ident::new(js_word!("apply"), *span)),
                };

                *e = Expr::Call(CallExpr {
                    span: *span,
                    callee: apply.as_callee(),
                    args: vec![this.as_arg(), args_array.as_arg()],
                    type_args: None,
                })
            }
            Expr::New(NewExpr {
                callee,
                args: Some(args),
                span,
                ..
            }) => {
                let has_spread = args
                    .iter()
                    .any(|ExprOrSpread { spread, .. }| spread.is_some());
                if !has_spread {
                    return;
                }

                let args = self.concat_args(*span, args.take().into_iter().map(Some), true);

                *e = Expr::Call(CallExpr {
                    span: *span,
                    callee: helper!(construct, "construct"),
                    args: vec![callee.take().as_arg(), args.as_arg()],
                    type_args: Default::default(),
                });
            }
            _ => {}
        };
    }
}

#[swc_trace]
impl Spread {
    fn visit_mut_stmt_like<T>(&mut self, items: &mut Vec<T>)
    where
        T: StmtLike,
        Vec<T>: VisitMutWith<Self>,
    {
        let orig = self.vars.take();

        items.visit_mut_children_with(self);

        if !self.vars.is_empty() {
            prepend_stmt(
                items,
                T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: self.vars.take(),
                }))),
            );
        }

        self.vars = orig;
    }
}

#[swc_trace]
impl Spread {
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
                let elems = mem::take(&mut tmp_arr);
                match first_arr {
                    Some(_) => {
                        if !elems.is_empty() {
                            buf.push(ArrayLit { span, elems }.as_arg());
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

                fn to_consumable_array(expr: Box<Expr>, span: Span) -> CallExpr {
                    if matches!(*expr, Expr::Lit(Lit::Str(..))) {
                        CallExpr {
                            span,
                            callee: quote_ident!("Array")
                                .make_member(quote_ident!("from"))
                                .as_callee(),
                            args: vec![expr.as_arg()],
                            type_args: Default::default(),
                        }
                    } else {
                        CallExpr {
                            span,
                            callee: helper!(to_consumable_array, "toConsumableArray"),
                            args: vec![expr.as_arg()],
                            type_args: Default::default(),
                        }
                    }
                }

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
                                    CallExpr {
                                        span,
                                        callee: member_expr!(DUMMY_SP, Array.prototype.slice.call)
                                            .as_callee(),
                                        args: vec![expr.as_arg()],
                                        type_args: Default::default(),
                                    }
                                    .as_arg()
                                }
                            }
                            _ => {
                                if args_len == 1 && !need_array {
                                    return if self.c.loose {
                                        *expr
                                    } else {
                                        Expr::Call(to_consumable_array(expr, span))
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
                                            .make_member(quote_ident!("concat"))
                                            .as_callee(),
                                            args: vec![expr.as_arg()],
                                            type_args: Default::default(),
                                        })
                                    } else {
                                        Expr::Call(to_consumable_array(expr, span))
                                    };
                                }

                                to_consumable_array(expr, span).as_arg()
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
                .make_member(Ident::new(js_word!("concat"), DUMMY_SP))
                .as_callee();

            return Expr::Call(CallExpr {
                span,
                callee,
                args: buf,
                type_args: Default::default(),
            });
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
                .make_member(Ident::new(js_word!("concat"), span))
                .as_callee(),

            args: buf,
            type_args: Default::default(),
        })
    }
}

#[tracing::instrument(level = "info", skip_all)]
fn expand_literal_args(
    args: impl ExactSizeIterator + Iterator<Item = Option<ExprOrSpread>>,
) -> Vec<Option<ExprOrSpread>> {
    fn expand(
        buf: &mut Vec<Option<ExprOrSpread>>,
        args: impl ExactSizeIterator + Iterator<Item = Option<ExprOrSpread>>,
    ) {
        for mut arg in args {
            if let Some(ExprOrSpread {
                spread: Some(spread_span),
                expr,
            }) = arg
            {
                match *expr {
                    Expr::Array(arr) => {
                        expand(buf, arr.elems.into_iter());
                        continue;
                    }
                    _ => {
                        arg = Some(ExprOrSpread {
                            spread: Some(spread_span),
                            expr,
                        })
                    }
                }
            }

            buf.push(arg)
        }
    }

    let mut buf = Vec::with_capacity(args.len() + 4);
    expand(&mut buf, args);
    buf
}

#[derive(Default)]
struct SpreadFinder {
    found: bool,
}

impl Visit for SpreadFinder {
    noop_visit_type!();

    fn visit_expr_or_spread(&mut self, n: &ExprOrSpread) {
        n.visit_children_with(self);

        self.found |= n.spread.is_some();
    }
}

impl Check for SpreadFinder {
    fn should_handle(&self) -> bool {
        self.found
    }
}
