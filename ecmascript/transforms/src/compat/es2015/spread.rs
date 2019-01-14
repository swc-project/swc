use crate::{helpers::Helpers, util::ExprFactory};
use ast::*;
use std::{
    iter, mem,
    sync::{atomic::Ordering, Arc},
};
use swc_common::{Fold, FoldWith, Span, DUMMY_SP};

/// es2015 - `SpreadElement`
#[derive(Default, Clone)]
pub struct Spread {
    pub helpers: Arc<Helpers>,
}

impl Fold<Expr> for Spread {
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

                let args_array = concat_args(&self.helpers, span, elems.into_iter());

                return args_array;
            }
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
                let args_array = concat_args(&self.helpers, span, args.into_iter().map(Some));
                //
                // f.apply(undefined, args)
                //
                callee.apply(
                    span,
                    quote_expr!(DUMMY_SP, undefined),
                    vec![args_array.as_arg()],
                )
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

                let args = concat_args(
                    &self.helpers,
                    span,
                    iter::once(quote_expr!(span, null).as_arg())
                        .chain(args)
                        .map(Some),
                );

                //
                // f.apply(undefined, args)
                //

                Expr::New(NewExpr {
                    span,
                    callee: box member_expr!(span, Function.prototype.bind)
                        .apply(span, callee, vec![args.as_arg()])
                        .wrap_with_paren(),
                    args: Some(vec![]),
                    type_args,
                })
            }
            _ => e,
        }
    }
}

fn concat_args(
    helpers: &Helpers,
    span: Span,
    args: impl Iterator<Item = Option<ExprOrSpread>>,
) -> Expr {
    //
    // []
    //
    let mut first_arr = None;

    let mut tmp_arr = vec![];
    let mut buf = vec![];

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

                    helpers.to_consumable_array.store(true, Ordering::Relaxed);

                    buf.push(
                        Expr::Call(CallExpr {
                            span,
                            callee: quote_ident!("_toConsumableArray").as_callee(),
                            args: vec![expr.as_arg()],
                            type_args: Default::default(),
                        })
                        .as_arg(),
                    );
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

        callee: MemberExpr {
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
        }
        .as_callee(),

        args: buf,
        type_args: Default::default(),
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        Spread::default(),
        call,
        "ca(a, b, c, ...d, e)",
        "ca.apply(undefined, [a, b, c].concat(_toConsumableArray(d), [e]));"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        Spread::default(),
        call_multi_spread,
        "ca(a, b, ...d, e, f, ...h)",
        "ca.apply(undefined, [a, b].concat(_toConsumableArray(d), [e, f], _toConsumableArray(h)));"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        Spread::default(),
        call_noop,
        "ca(a, b, c, d, e)",
        "ca(a, b, c, d, e);"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        Spread::default(),
        array,
        "[a, b, c, ...d, e]",
        "[a, b, c].concat(_toConsumableArray(d), [e])"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        Spread::default(),
        array_empty,
        "[a,, b, c, ...d,,, e]",
        "[a,, b, c].concat(_toConsumableArray(d), [,, e])"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        Spread::default(),
        new,
        "new C(a, b, c, ...d, e)",
        "new (Function.prototype.bind.apply(C, [null, a, b, c].concat(_toConsumableArray(d), \
         [e])))();"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        Spread::default(),
        new_noop,
        "new C(a, b, c, c, d, e)",
        "new C(a, b, c, c, d, e);"
    );
}
