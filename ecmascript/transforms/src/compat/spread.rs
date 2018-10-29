use super::helpers::Helpers;
use std::sync::{atomic::Ordering, Arc};
use swc_common::{Fold, FoldWith, Span};
use swc_ecma_ast::*;

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
            Expr::Call(CallExpr { callee, args, span }) => {
                // TODO: [a].concat instead of [].concat(a)

                let has_spread = args
                    .iter()
                    .any(|ExprOrSpread { spread, .. }| spread.is_some());
                if !has_spread {
                    return Expr::Call(CallExpr { callee, args, span });
                }

                let args = concat_args(&self.helpers, span, args);
                //
                // f.apply(undefined, args)
                //
                Expr::Call(CallExpr {
                    // TODO
                    span,

                    callee: ExprOrSuper::Expr(box Expr::Member(MemberExpr {
                        // TODO
                        span,

                        obj: callee,
                        prop: box Expr::Ident(Ident::new(js_word!("apply"), span)),
                        computed: false,
                    })),
                    args: vec![
                        ExprOrSpread {
                            expr: box Expr::Ident(Ident::new(js_word!("undefined"), span)),
                            spread: None,
                        },
                        ExprOrSpread {
                            expr: box args,
                            spread: None,
                        },
                    ],
                })
            }
            Expr::New(NewExpr { .. }) => unimplemented!(),
            _ => e,
        }
    }
}

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
