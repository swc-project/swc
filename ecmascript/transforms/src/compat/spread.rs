use super::helpers::Helpers;
use std::{
    iter,
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
    let arr = Expr::Array(ArrayLit {
        elems: vec![],
        span,
    });
    Expr::Call(CallExpr {
        // TODO
        span,

        callee: ExprOrSuper::Expr(box Expr::Member(MemberExpr {
            // TODO: Mark
            span,
            prop: box Expr::Ident(Ident::new(js_word!("concat"), span)),
            obj: ExprOrSuper::Expr(box arr),
            computed: false,
        })),

        args: args
            .into_iter()
            .map(|ExprOrSpread { expr, spread }| {
                // ...b -> toConsumableArray(b)
                match spread {
                    Some(span) => {
                        helpers.to_consumable_array.store(true, Ordering::SeqCst);

                        ExprOrSpread {
                            expr: box Expr::Call(CallExpr {
                                span,
                                callee: ExprOrSuper::Expr(
                                    box Ident::new(js_word!("_toConsumableArray"), span).into(),
                                ),
                                args: vec![ExprOrSpread { expr, spread: None }],
                            }),
                            spread: None,
                        }
                    }
                    None => ExprOrSpread { expr, spread: None },
                }
            })
            .collect(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    test!(
        SpreadElement::default(),
        base,
        "var re = ca(a, b, c,, ...d,,, e)",
        "var re = ca.applyt(undefined, [].concat(a, b, c,, toCosumableArray(d),,, e)"
    );

    test!(
        SpreadElement::default(),
        no_spread,
        "var re = ca(a, b, c,, d,,, e)",
        "var re = ca(a, b, c,, d,,, e);"
    );
}
