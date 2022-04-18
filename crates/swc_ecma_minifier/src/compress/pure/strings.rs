use std::mem::take;

use swc_atoms::{js_word, JsWord};
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, Type, Value};

use super::Pure;

impl Pure<'_> {
    /// Converts template literals to string if `exprs` of [Tpl] is empty.
    pub(super) fn convert_tpl_to_str(&mut self, e: &mut Expr) {
        match e {
            Expr::Tpl(t) if t.quasis.len() == 1 && t.exprs.is_empty() => {
                let c = &t.quasis[0].raw;

                if c.chars().all(|c| match c {
                    '\u{0020}'..='\u{007e}' => true,
                    '\n' | '\r' => self.ctx.force_str_for_tpl,
                    _ => false,
                }) && (self.ctx.force_str_for_tpl || (!c.contains("\\n") && !c.contains("\\r")))
                    && !c.contains("\\0")
                    && !c.contains("\\x")
                {
                    let value = c
                        .replace("\\`", "`")
                        .replace("\\$", "$")
                        .replace("\\n", "\n")
                        .replace("\\r", "\r")
                        .replace("\\\\", "\\");

                    *e = Expr::Lit(Lit::Str(Str {
                        span: t.span,
                        raw: None,
                        value: value.into(),
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
        let has_str_lit = tpl
            .exprs
            .iter()
            .any(|expr| matches!(&**expr, Expr::Lit(Lit::Str(..))));
        if !has_str_lit {
            return;
        }

        trace_op!("compress_tpl");

        let mut quasis = vec![];
        let mut exprs = vec![];
        let mut cur_raw = String::new();

        for i in 0..(tpl.exprs.len() + tpl.quasis.len()) {
            if i % 2 == 0 {
                let i = i / 2;
                let q = tpl.quasis[i].take();

                cur_raw.push_str(&q.raw);
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
                            raw: take(&mut cur_raw).into(),
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
            raw: cur_raw.into(),
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

                    report_change!(
                        "template: Concatted a string (`{}`) on rhs of `+` to a template literal",
                        rs.value
                    );

                    if let Some(cooked) = &mut l_last.cooked {
                        *cooked = format!("{}{}", cooked, rs.value.replace('\\', "\\\\")).into()
                    }

                    let new: JsWord =
                        format!("{}{}", l_last.raw, rs.value.replace('\\', "\\\\")).into();
                    l_last.raw = new;

                    r.take();
                }
            }

            (Expr::Lit(Lit::Str(ls)), Expr::Tpl(r)) => {
                // Append
                if let Some(r_first) = r.quasis.first_mut() {
                    self.changed = true;

                    report_change!(
                        "template: Prepended a string (`{}`) on lhs of `+` to a template literal",
                        ls.value
                    );

                    if let Some(cooked) = &mut r_first.cooked {
                        *cooked = format!("{}{}", ls.value.replace('\\', "\\\\"), cooked).into()
                    }

                    let new: JsWord =
                        format!("{}{}", ls.value.replace('\\', "\\\\"), r_first.raw).into();
                    r_first.raw = new;

                    l.take();
                }
            }

            (Expr::Tpl(l), Expr::Tpl(rt)) => {
                // We prepend the last quasis of l to the first quasis of r.
                // After doing so, we can append all data of r to l.

                {
                    let l_last = l.quasis.pop().unwrap();
                    let mut r_first = rt.quasis.first_mut().unwrap();
                    let new: JsWord = format!("{}{}", l_last.raw, r_first.raw).into();

                    r_first.raw = new;
                }

                l.quasis.extend(rt.quasis.take());
                l.exprs.extend(rt.exprs.take());
                // Remove r
                r.take();

                debug_assert!(l.quasis.len() == l.exprs.len() + 1, "{:?} is invalid", l);
                self.changed = true;
                report_change!("strings: Merged to template literals");
            }
            _ => {}
        }
    }

    ///
    /// - `a + 'foo' + 'bar'` => `a + 'foobar'`
    pub(super) fn concat_str(&mut self, e: &mut Expr) {
        if let Expr::Bin(
            bin @ BinExpr {
                op: op!(bin, "+"), ..
            },
        ) = e
        {
            if let Expr::Bin(
                left @ BinExpr {
                    op: op!(bin, "+"), ..
                },
            ) = &mut *bin.left
            {
                let type_of_second = left.right.get_type();
                let type_of_third = bin.right.get_type();

                if let Value::Known(Type::Str) = type_of_second {
                    if let Value::Known(Type::Str) = type_of_third {
                        if let Value::Known(second_str) = left.right.as_string() {
                            if let Value::Known(third_str) = bin.right.as_string() {
                                let new_str = format!("{}{}", second_str, third_str);
                                let left_span = left.span;

                                self.changed = true;
                                report_change!(
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
                                        raw: None,
                                        value: new_str.into(),
                                    }))),
                                });
                            }
                        }
                    }
                }
            }
        }
    }

    pub(super) fn drop_useless_addition_of_str(&mut self, e: &mut Expr) {
        if let Expr::Bin(BinExpr {
            op: op!(bin, "+"),
            left,
            right,
            ..
        }) = e
        {
            let lt = left.get_type();
            let rt = right.get_type();
            if let Value::Known(Type::Str) = lt {
                if let Value::Known(Type::Str) = rt {
                    if let Expr::Lit(Lit::Str(Str {
                        value: js_word!(""),
                        ..
                    })) = &**left
                    {
                        self.changed = true;
                        report_change!(
                            "string: Dropping empty string literal (in lhs) because it does not \
                             changes type"
                        );

                        *e = *right.take();
                        return;
                    }

                    if let Expr::Lit(Lit::Str(Str {
                        value: js_word!(""),
                        ..
                    })) = &**right
                    {
                        self.changed = true;
                        report_change!(
                            "string: Dropping empty string literal (in rhs) because it does not \
                             changes type"
                        );

                        *e = *left.take();
                    }
                }
            }
        }
    }
}
