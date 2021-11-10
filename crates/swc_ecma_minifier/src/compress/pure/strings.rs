use super::Pure;
use crate::mode::Mode;
use std::mem::take;
use swc_atoms::{js_word, JsWord};
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, Type, Value};

impl<M> Pure<'_, M>
where
    M: Mode,
{
    /// Converts template literals to string if `exprs` of [Tpl] is empty.
    pub(super) fn convert_tpl_to_str(&mut self, e: &mut Expr) {
        match e {
            Expr::Tpl(t) if t.quasis.len() == 1 && t.exprs.is_empty() => {
                let c = &t.quasis[0].raw;

                if c.value.chars().all(|c| match c {
                    '\u{0020}'..='\u{007e}' => true,
                    '\n' | '\r' => M::force_str_for_tpl(),
                    _ => false,
                }) && (M::force_str_for_tpl()
                    || (!c.value.contains("\\n") && !c.value.contains("\\r")))
                    && !c.value.contains("\\0")
                {
                    *e = Expr::Lit(Lit::Str(Str {
                        value: c
                            .value
                            .replace("\\`", "`")
                            .replace("\\$", "$")
                            .replace("\\n", "\n")
                            .replace("\\r", "\r")
                            .replace("\\\\", "\\")
                            .into(),
                        ..c.clone()
                    }));
                }
            }
            _ => {}
        }
    }

    /// This compresses a template literal by inlining string literals in
    /// expresions into quasis.
    ///
    /// Note that this pass only cares about string literals and conversion to a
    /// string literal should be done before calling this pass.
    pub(super) fn compress_tpl(&mut self, tpl: &mut Tpl) {
        debug_assert_eq!(tpl.exprs.len() + 1, tpl.quasis.len());
        let has_str_lit = tpl.exprs.iter().any(|expr| match &**expr {
            Expr::Lit(Lit::Str(..)) => true,
            _ => false,
        });
        if !has_str_lit {
            return;
        }

        if cfg!(feature = "debug") {
            tracing::debug!("compress_tpl");
        }

        let mut quasis = vec![];
        let mut exprs = vec![];
        let mut cur_raw = String::new();

        for i in 0..(tpl.exprs.len() + tpl.quasis.len()) {
            if i % 2 == 0 {
                let i = i / 2;
                let q = tpl.quasis[i].take();

                cur_raw.push_str(&q.raw.value);
            } else {
                let i = i / 2;
                let e = tpl.exprs[i].take();

                match *e {
                    Expr::Lit(Lit::Str(s)) => {
                        cur_raw.push_str(&s.value);
                    }
                    _ => {
                        quasis.push(TplElement {
                            span: DUMMY_SP,
                            tail: true,
                            cooked: None,
                            raw: Str {
                                span: DUMMY_SP,
                                value: take(&mut cur_raw).into(),
                                has_escape: false,
                                kind: Default::default(),
                            },
                        });

                        exprs.push(e);
                    }
                }
            }
        }

        quasis.push(TplElement {
            span: DUMMY_SP,
            tail: true,
            cooked: None,
            raw: Str {
                span: DUMMY_SP,
                value: cur_raw.into(),
                has_escape: false,
                kind: Default::default(),
            },
        });

        debug_assert_eq!(exprs.len() + 1, quasis.len());

        tpl.quasis = quasis;
        tpl.exprs = exprs;
    }

    /// Called for binary operations with `+`.
    pub(super) fn concat_tpl(&mut self, l: &mut Expr, r: &mut Expr) {
        match (&mut *l, &mut *r) {
            (Expr::Tpl(l), Expr::Lit(Lit::Str(rs))) => {
                // Append
                if let Some(l_last) = l.quasis.last_mut() {
                    self.changed = true;

                    tracing::debug!(
                        "template: Concatted a string (`{}`) on rhs of `+` to a template literal",
                        rs.value
                    );
                    let l_str = &mut l_last.raw;

                    let new: JsWord =
                        format!("{}{}", l_str.value, rs.value.replace("\\", "\\\\")).into();
                    l_str.value = new.clone();
                    l_last.raw.value = new;

                    r.take();
                    return;
                }
            }

            (Expr::Lit(Lit::Str(ls)), Expr::Tpl(r)) => {
                // Append
                if let Some(r_first) = r.quasis.first_mut() {
                    self.changed = true;

                    tracing::debug!(
                        "template: Prepended a string (`{}`) on lhs of `+` to a template literal",
                        ls.value
                    );
                    let r_str = &mut r_first.raw;

                    let new: JsWord =
                        format!("{}{}", ls.value.replace("\\", "\\\\"), r_str.value).into();
                    r_str.value = new.clone();
                    r_first.raw.value = new;

                    l.take();
                    return;
                }
            }

            (Expr::Tpl(l), Expr::Tpl(rt)) => {
                // We prepend the last quasis of l to the first quasis of r.
                // After doing so, we can append all data of r to l.

                {
                    let l_last = l.quasis.pop().unwrap();
                    let mut r_first = rt.quasis.first_mut().unwrap();

                    let r_str = &mut r_first.raw;

                    let new: JsWord = format!("{}{}", l_last.raw.value, r_str.value).into();
                    r_str.value = new.clone();
                    r_first.raw.value = new;
                }

                l.quasis.extend(rt.quasis.take());
                l.exprs.extend(rt.exprs.take());
                // Remove r
                r.take();

                debug_assert!(l.quasis.len() == l.exprs.len() + 1, "{:?} is invalid", l);
                self.changed = true;
                tracing::debug!("strings: Merged to template literals");
            }

            _ => {}
        }
    }

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
                    left @ BinExpr {
                        op: op!(bin, "+"), ..
                    },
                ) => {
                    let type_of_second = left.right.get_type();
                    let type_of_third = bin.right.get_type();

                    if let Value::Known(Type::Str) = type_of_second {
                        if let Value::Known(Type::Str) = type_of_third {
                            if let Value::Known(second_str) = left.right.as_string() {
                                if let Value::Known(third_str) = bin.right.as_string() {
                                    let new_str = format!("{}{}", second_str, third_str);
                                    let left_span = left.span;

                                    self.changed = true;
                                    tracing::debug!(
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
                if let Value::Known(Type::Str) = lt {
                    if let Value::Known(Type::Str) = rt {
                        match &**left {
                            Expr::Lit(Lit::Str(Str {
                                value: js_word!(""),
                                ..
                            })) => {
                                self.changed = true;
                                tracing::debug!(
                                    "string: Dropping empty string literal (in lhs) because it \
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
                                self.changed = true;
                                tracing::debug!(
                                    "string: Dropping empty string literal (in rhs) because it \
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
