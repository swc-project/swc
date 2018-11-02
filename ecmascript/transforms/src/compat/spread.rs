use super::helpers::Helpers;
use std::{
    iter,
    mem::swap,
    sync::{atomic::Ordering, Arc},
};
use swc_common::{Fold, FoldWith, Span};
use swc_ecma_ast::*;
use util::ExprFactory;

/// es2015 - `SpreadElement`
#[derive(Debug, Clone, Default)]
pub struct SpreadElement {
    helpers: Arc<Helpers>,
}

impl Fold<Expr> for SpreadElement {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = e.fold_children(self);

        match e {
            Expr::Array(ArrayLit { .. }) => unimplemented!(),
            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(callee),
                args,
                span,
            }) => {
                let has_spread = args
                    .iter()
                    .any(|ExprOrSpread { spread, .. }| spread.is_some());
                if !has_spread {
                    return Expr::Call(CallExpr {
                        callee: ExprOrSuper::Expr(callee),
                        args,
                        span,
                    });
                }

                let args_array = concat_args(&self.helpers, span, args);
                //
                // f.apply(undefined, args)
                //
                callee.apply(span, expr!(span, undefined), vec![args_array.as_arg()])
            }
            Expr::New(NewExpr {
                callee,
                args: Some(args),
                span,
            }) => {
                let has_spread = args
                    .iter()
                    .any(|ExprOrSpread { spread, .. }| spread.is_some());
                if !has_spread {
                    return Expr::New(NewExpr {
                        callee,
                        args: Some(args),
                        span,
                    });
                }

                let args = concat_args(&self.helpers, span, args);

                //
                // f.apply(undefined, args)
                //

                Expr::New(NewExpr {
                    span,
                    callee: box member_expr!(span, Function.prototype.bind)
                        .apply(
                            span,
                            callee,
                            vec![expr!(span, null).as_arg()]
                                .into_iter()
                                .chain(iter::once(args.as_arg()))
                                .collect(),
                        )
                        .wrap_with_paren(),
                    args: Some(vec![]),
                })
            }
            _ => e,
        }
    }
}

/// TODO: [a].concat instead of [].concat(a)
fn concat_args(helpers: &Helpers, span: Span, args: Vec<ExprOrSpread>) -> Expr {
    //
    // []
    //
    let mut first_arr = None;

    let mut tmp_arr = vec![];
    let mut buf = vec![];

    macro_rules! make_arr {
        () => {
            println!("make_arr: {:?}", tmp_arr.len());

            let elems = ::std::mem::replace(&mut tmp_arr, vec![]);
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
        let ExprOrSpread { expr, spread } = arg;

        match spread {
            // ...b -> toConsumableArray(b)
            Some(span) => {
                //
                make_arr!();

                helpers.to_consumable_array.store(true, Ordering::SeqCst);

                buf.push(
                    Expr::Call(CallExpr {
                        span,
                        callee: ExprOrSuper::Expr(
                            box Ident::new(js_word!("_toConsumableArray"), span).into(),
                        ),
                        args: vec![ExprOrSpread { expr, spread: None }],
                    })
                    .as_arg(),
                );
            }
            None => tmp_arr.push(Some(ExprOrSpread { expr, spread: None })),
        }
    }
    make_arr!();

    Expr::Call(CallExpr {
        // TODO
        span,

        callee: ExprOrSuper::Expr(box Expr::Member(MemberExpr {
            // TODO: Mark
            span,
            prop: box Expr::Ident(Ident::new(js_word!("concat"), span)),
            obj: ExprOrSuper::Expr(box first_arr.take().unwrap_or_else(|| {
                // No arg

                // assert!(args.is_empty());

                Expr::Array(ArrayLit {
                    span,
                    elems: vec![],
                })
            })),
            computed: false,
        })),

        args: buf,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    test!(
        SpreadElement::default(),
        call,
        "ca(a, b, c, ...d, e)",
        "ca.apply(undefined, [a, b, c].concat(_toConsumableArray(d), [e]));"
    );

    test!(
        SpreadElement::default(),
        call_multi_spread,
        "ca(a, b, ...d, e, f, ...h)",
        "ca.apply(undefined, [a, b].concat(_toConsumableArray(d), [e, f], _toConsumableArray(h)));"
    );

    test!(
        SpreadElement::default(),
        call_noop,
        "ca(a, b, c, d, e)",
        "ca(a, b, c, d, e);"
    );

    test!(
        SpreadElement::default(),
        new,
        "new C(a, b, c, ...d, e)",
        "new (Function.prototype.bind.apply(C, [null].concat([a, b, c], _toConsumableArray(d), \
         [e])))();"
    );

    test!(
        SpreadElement::default(),
        new_noop,
        "new C(a, b, c, c, d, e)",
        "new C(a, b, c, c, d, e);"
    );
}
