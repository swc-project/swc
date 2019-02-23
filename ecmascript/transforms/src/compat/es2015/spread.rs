use crate::{
    pass::Pass,
    util::{ExprFactory, StmtLike},
};
use ast::*;
use std::{iter, mem};
use swc_common::{Fold, FoldWith, Span, DUMMY_SP};

pub fn spread() -> impl Pass + Clone {
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
        items
            .into_iter()
            .flat_map(|item| {
                let item = item.fold_with(&mut folder);

                let var = if !folder.vars.is_empty() {
                    Some(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Var,
                        declare: false,
                        decls: mem::replace(&mut folder.vars, vec![]),
                    }))))
                } else {
                    None
                };

                var.into_iter().chain(iter::once(item))
            })
            .collect()
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

                let args_array = concat_args(span, elems.into_iter());

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
                let args_array = concat_args(span, args.into_iter().map(Some));
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
                    callee: box member_expr!(span, Function.prototype.bind).apply(
                        span,
                        callee,
                        vec![args.as_arg()],
                    ),
                    args: Some(vec![]),
                    type_args,
                })
            }
            _ => e,
        }
    }
}

fn concat_args(span: Span, args: impl Iterator<Item = Option<ExprOrSpread>>) -> Expr {
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

                    buf.push(
                        Expr::Call(CallExpr {
                            span,
                            callee: helper!(to_consumable_array, "toConsumableArray"),
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

#[cfg(test)]
mod tests {
    use super::*;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| Spread,
        issue_270,
        "instance[name](...args);",
        "var _instance;
(_instance = instance)[name].apply(_instance, args);"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| Spread,
        call,
        "ca(a, b, c, ...d, e)",
        "ca.apply(undefined, [a, b, c].concat(_toConsumableArray(d), [e]));"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| Spread,
        call_multi_spread,
        "ca(a, b, ...d, e, f, ...h)",
        "ca.apply(undefined, [a, b].concat(_toConsumableArray(d), [e, f], _toConsumableArray(h)));"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| Spread,
        call_noop,
        "ca(a, b, c, d, e)",
        "ca(a, b, c, d, e);"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| Spread,
        array,
        "[a, b, c, ...d, e]",
        "[a, b, c].concat(_toConsumableArray(d), [e])"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| Spread,
        array_empty,
        "[a,, b, c, ...d,,, e]",
        "[a,, b, c].concat(_toConsumableArray(d), [,, e])"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| Spread,
        new,
        "new C(a, b, c, ...d, e)",
        "new Function.prototype.bind.apply(C, [null, a, b, c].concat(_toConsumableArray(d), \
         [e]))();",
        ok_if_code_eq
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| Spread,
        new_noop,
        "new C(a, b, c, c, d, e)",
        "new C(a, b, c, c, d, e);"
    );
}
