use std::mem;

use serde::Deserialize;
use swc_common::{util::take::Take, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{ext::ExprRefExt, helper, perf::Check};
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{
    alias_ident_for, member_expr, prepend_stmt, quote_ident, ExprFactory, StmtLike,
};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, visit_mut_pass, Visit, VisitMut, VisitMutWith, VisitWith,
};
use swc_trace_macro::swc_trace;

pub fn spread(c: Config) -> impl Pass {
    visit_mut_pass(Spread {
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
    noop_visit_mut_type!(fail);

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
                    }) => (ThisExpr { span: *span }.into(), None),

                    Expr::Member(MemberExpr { obj, .. }) if obj.is_this() => (obj.clone(), None),

                    // Injected variables can be accessed without any side effect
                    Expr::Member(MemberExpr { obj, .. })
                        if obj.as_ident().is_some() && obj.as_ident().unwrap().span.is_dummy() =>
                    {
                        (obj.as_ident().unwrap().clone().into(), None)
                    }

                    Expr::Ident(Ident { span, .. }) => (Expr::undefined(*span), None),

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

                        let this = ident.clone().into();
                        let callee: Expr = AssignExpr {
                            span: DUMMY_SP,
                            left: ident.into(),
                            op: op!("="),
                            right: obj.clone(),
                        }
                        .into();
                        (
                            this,
                            Some(
                                MemberExpr {
                                    span: *span,
                                    obj: callee.into(),
                                    prop: prop.clone(),
                                }
                                .into(),
                            ),
                        )
                    }

                    // https://github.com/swc-project/swc/issues/400
                    // _ => (undefined(callee.span()), callee),
                    _ => (
                        ThisExpr {
                            span: callee.span(),
                        }
                        .into(),
                        None,
                    ),
                };

                let args_array = if args.iter().all(|e| {
                    matches!(e, ExprOrSpread { spread: None, .. })
                        || matches!(e, ExprOrSpread { expr, .. } if expr.is_array())
                }) {
                    ArrayLit {
                        span: *span,
                        elems: expand_literal_args(args.take().into_iter().map(Some)),
                    }
                    .into()
                } else {
                    self.concat_args(*span, args.take().into_iter().map(Some), false)
                };

                let apply = MemberExpr {
                    span: DUMMY_SP,
                    obj: callee_updated.unwrap_or_else(|| callee.take()),
                    prop: quote_ident!("apply").into(),
                };

                *e = CallExpr {
                    span: *span,
                    callee: apply.as_callee(),
                    args: vec![this.as_arg(), args_array.as_arg()],
                    ..Default::default()
                }
                .into()
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

                *e = CallExpr {
                    span: *span,
                    callee: helper!(construct),
                    args: vec![callee.take().as_arg(), args.as_arg()],
                    ..Default::default()
                }
                .into();
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
                T::from(
                    VarDecl {
                        kind: VarDeclKind::Var,
                        decls: self.vars.take(),
                        ..Default::default()
                    }
                    .into(),
                ),
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
        args: impl ExactSizeIterator<Item = Option<ExprOrSpread>>,
        need_array: bool,
    ) -> Expr {
        //
        // []
        //
        let mut first_arr = None;

        let mut tmp_arr = Vec::new();
        let mut buf = Vec::new();
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

        // Shorthand [].concat(arr1, arr2) should be used under loose mode.
        // Array.prototype.concat has the lovely feature by which arrays passed
        // to it are depth-1 flattened. This effectively implements the loose
        // spread. But if any arrays that are not being spread are present, they
        // will be incorrectly flattened. The solution is to wrap every
        // contiguous slice of non-spread args in an array, which will protect
        // array args from being flattened.
        if self.c.loose {
            let mut arg_list = Vec::new();
            let mut current_elems = Vec::new();
            for arg in args.flatten() {
                let expr = arg.expr;
                match arg.spread {
                    Some(_) => {
                        if !current_elems.is_empty() {
                            arg_list.push(
                                ArrayLit {
                                    span: DUMMY_SP,
                                    elems: current_elems,
                                }
                                .as_arg(),
                            );
                            current_elems = Vec::new();
                        }
                        arg_list.push(expr.as_arg());
                    }
                    None => {
                        current_elems.push(Some(expr.as_arg()));
                    }
                }
            }
            if !current_elems.is_empty() {
                arg_list.push(
                    ArrayLit {
                        span: DUMMY_SP,
                        elems: current_elems,
                    }
                    .as_arg(),
                );
            }

            return CallExpr {
                span: DUMMY_SP,
                callee: ArrayLit {
                    span: DUMMY_SP,
                    elems: Vec::new(),
                }
                .make_member(quote_ident!("concat"))
                .as_callee(),
                args: arg_list,
                ..Default::default()
            }
            .into();
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
                            ..Default::default()
                        }
                    } else {
                        CallExpr {
                            span,
                            callee: helper!(to_consumable_array),
                            args: vec![expr.as_arg()],
                            ..Default::default()
                        }
                    }
                }

                match spread {
                    // ...b -> toConsumableArray(b)
                    Some(span) => {
                        //
                        make_arr!();

                        buf.push(match *expr {
                            Expr::Ident(Ident { ref sym, .. }) if &**sym == "arguments" => {
                                if args_len == 1 {
                                    if need_array {
                                        return CallExpr {
                                            span,
                                            callee: member_expr!(
                                                Default::default(),
                                                DUMMY_SP,
                                                Array.prototype.slice.call
                                            )
                                            .as_callee(),
                                            args: vec![expr.as_arg()],
                                            ..Default::default()
                                        }
                                        .into();
                                    } else {
                                        return *expr;
                                    }
                                } else {
                                    CallExpr {
                                        span,
                                        callee: member_expr!(
                                            Default::default(),
                                            DUMMY_SP,
                                            Array.prototype.slice.call
                                        )
                                        .as_callee(),
                                        args: vec![expr.as_arg()],
                                        ..Default::default()
                                    }
                                    .as_arg()
                                }
                            }
                            _ => {
                                if args_len == 1 && !need_array {
                                    return if self.c.loose {
                                        *expr
                                    } else {
                                        to_consumable_array(expr, span).into()
                                    };
                                }
                                // [].concat(arr) is shorter than _to_consumable_array(arr)
                                if args_len == 1 {
                                    return if self.c.loose {
                                        CallExpr {
                                            span: DUMMY_SP,
                                            callee: ArrayLit {
                                                span: DUMMY_SP,
                                                elems: Vec::new(),
                                            }
                                            .make_member(quote_ident!("concat"))
                                            .as_callee(),
                                            args: vec![expr.as_arg()],
                                            ..Default::default()
                                        }
                                        .into()
                                    } else {
                                        to_consumable_array(expr, span).into()
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
                .make_member(IdentName::new("concat".into(), DUMMY_SP))
                .as_callee();

            return CallExpr {
                span,
                callee,
                args: buf,
                ..Default::default()
            }
            .into();
        }

        CallExpr {
            // TODO
            span,

            callee: first_arr
                .take()
                .unwrap_or_else(|| {
                    // No arg

                    // assert!(args.is_empty());
                    Expr::Array(ArrayLit {
                        span,
                        elems: Vec::new(),
                    })
                })
                .make_member(IdentName::new("concat".into(), span))
                .as_callee(),

            args: buf,
            ..Default::default()
        }
        .into()
    }
}

#[tracing::instrument(level = "info", skip_all)]
fn expand_literal_args(
    args: impl ExactSizeIterator<Item = Option<ExprOrSpread>>,
) -> Vec<Option<ExprOrSpread>> {
    fn expand(
        buf: &mut Vec<Option<ExprOrSpread>>,
        args: impl ExactSizeIterator<Item = Option<ExprOrSpread>>,
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
    noop_visit_type!(fail);

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
