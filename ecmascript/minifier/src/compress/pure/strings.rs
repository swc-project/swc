use super::Pure;
use swc_atoms::js_word;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::{ExprExt, Type, Value::Known};

impl Pure<'_> {
    ///
    /// - `a + 'foo' + 'bar'` => `a + 'foobar'`
    pub(super) fn concat_str(&mut self, e: &mut Expr) {
        match e {
            Expr::Bin(
                bin @ BinExpr {
                    op: op!(bin, "+"), ..
                },
            ) => match &mut *bin.left {
                Expr::Bin(
                    left
                    @ BinExpr {
                        op: op!(bin, "+"), ..
                    },
                ) => {
                    let type_of_second = left.right.get_type();
                    let type_of_third = bin.right.get_type();

                    if let Known(Type::Str) = type_of_second {
                        if let Known(Type::Str) = type_of_third {
                            if let Known(second_str) = left.right.as_string() {
                                if let Known(third_str) = bin.right.as_string() {
                                    let new_str = format!("{}{}", second_str, third_str);
                                    let left_span = left.span;

                                    log::debug!(
                                        "strings: Concatting `{} + {}` to `{}`",
                                        second_str,
                                        third_str,
                                        new_str
                                    );

                                    *e = Expr::Bin(BinExpr {
                                        span: bin.span,
                                        op: op!(bin, "+"),
                                        left: left.left.take(),
                                        right: Box::new(Expr::Lit(Lit::Str(Str {
                                            span: left_span,
                                            value: new_str.into(),
                                            has_escape: false,
                                            kind: Default::default(),
                                        }))),
                                    });
                                    return;
                                }
                            }
                        }
                    }
                }
                _ => {}
            },
            _ => {}
        }
    }

    pub(super) fn drop_useless_addition_of_str(&mut self, e: &mut Expr) {
        match e {
            Expr::Bin(BinExpr {
                op: op!(bin, "+"),
                left,
                right,
                ..
            }) => {
                let lt = left.get_type();
                let rt = right.get_type();
                if let Known(Type::Str) = lt {
                    if let Known(Type::Str) = rt {
                        match &**left {
                            Expr::Lit(Lit::Str(Str {
                                value: js_word!(""),
                                ..
                            })) => {
                                log::debug!(
                                    "strings: Dropping empty string literal (in lhs) because it \
                                     does not changes type"
                                );

                                *e = *right.take();
                                return;
                            }
                            _ => {}
                        }

                        match &**right {
                            Expr::Lit(Lit::Str(Str {
                                value: js_word!(""),
                                ..
                            })) => {
                                log::debug!(
                                    "strings: Dropping empty string literal (in rhs) because it \
                                     does not changes type"
                                );

                                *e = *left.take();
                                return;
                            }
                            _ => {}
                        }
                    }
                }
            }
            _ => {}
        }
    }
}
