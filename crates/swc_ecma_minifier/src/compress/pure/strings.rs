use std::{borrow::Cow, mem::take};

use swc_atoms::{js_word, Atom, JsWord};
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, Type, Value};
use Value::Known;

use super::Pure;

impl Pure<'_> {
    /// This only handles `'foo' + ('bar' + baz) because others are handled by
    /// expression simplifier.
    pub(super) fn eval_str_addition(&mut self, e: &mut Expr) {
        let (span, l_l, r_l, r_r) = match e {
            Expr::Bin(
                e @ BinExpr {
                    op: op!(bin, "+"), ..
                },
            ) => match &mut *e.right {
                Expr::Bin(
                    r @ BinExpr {
                        op: op!(bin, "+"), ..
                    },
                ) => (e.span, &mut *e.left, &mut *r.left, &mut r.right),
                _ => return,
            },
            _ => return,
        };

        match l_l.get_type() {
            Known(Type::Str) => {}
            _ => return,
        }
        match r_l.get_type() {
            Known(Type::Str) => {}
            _ => return,
        }

        let lls = l_l.as_pure_string(&self.expr_ctx);
        let rls = r_l.as_pure_string(&self.expr_ctx);

        if let (Known(lls), Known(rls)) = (lls, rls) {
            self.changed = true;
            report_change!("evaluate: 'foo' + ('bar' + baz) => 'foobar' + baz");

            let s = lls.into_owned() + &*rls;
            *e = Expr::Bin(BinExpr {
                span,
                op: op!(bin, "+"),
                left: s.into(),
                right: r_r.take(),
            });
        }
    }

    pub(super) fn eval_tpl_as_str(&mut self, e: &mut Expr) {
        if !self.options.evaluate {
            return;
        }

        fn need_unsafe(e: &Expr) -> bool {
            match e {
                Expr::Lit(..) => false,
                Expr::Bin(e) => need_unsafe(&e.left) || need_unsafe(&e.right),
                _ => true,
            }
        }

        let tpl = match e {
            Expr::Tpl(e) => e,
            _ => return,
        };

        if tpl.quasis.len() == 2
            && (tpl.quasis[0].cooked.is_some() || !tpl.quasis[0].raw.contains('\\'))
            && tpl.quasis[1].raw.is_empty()
        {
            if !self.options.unsafe_passes && need_unsafe(&tpl.exprs[0]) {
                return;
            }

            self.changed = true;
            report_change!("evaluating a template to a string");
            *e = Expr::Bin(BinExpr {
                span: tpl.span,
                op: op!(bin, "+"),
                left: tpl.quasis[0]
                    .cooked
                    .clone()
                    .unwrap_or_else(|| tpl.quasis[0].raw.clone())
                    .into(),
                right: tpl.exprs[0].take(),
            });
        }
    }

    pub(super) fn eval_nested_tpl(&mut self, e: &mut Expr) {
        let tpl = match e {
            Expr::Tpl(e) => e,
            _ => return,
        };

        if !tpl.exprs.iter().any(|e| match &**e {
            Expr::Tpl(t) => t
                .quasis
                .iter()
                .all(|q| q.cooked.is_some() && !q.raw.contains('\\')),
            _ => false,
        }) {
            return;
        }

        self.changed = true;
        report_change!("evaluating nested template literals");

        let mut new_tpl = Tpl {
            span: tpl.span,
            quasis: Default::default(),
            exprs: Default::default(),
        };
        let mut cur_str_value = String::new();

        for idx in 0..(tpl.quasis.len() + tpl.exprs.len()) {
            if idx % 2 == 0 {
                let q = tpl.quasis[idx / 2].take();

                cur_str_value.push_str(q.cooked.as_deref().unwrap_or(&*q.raw));
            } else {
                let mut e = tpl.exprs[idx / 2].take();
                self.eval_nested_tpl(&mut e);

                match *e {
                    Expr::Tpl(mut e) => {
                        // We loop again
                        //
                        // I think we can merge this code...
                        for idx in 0..(e.quasis.len() + e.exprs.len()) {
                            if idx % 2 == 0 {
                                let q = e.quasis[idx / 2].take();

                                cur_str_value.push_str(q.cooked.as_deref().unwrap_or(&*q.raw));
                            } else {
                                let s = Atom::from(&*cur_str_value);
                                cur_str_value.clear();

                                new_tpl.quasis.push(TplElement {
                                    span: DUMMY_SP,
                                    tail: false,
                                    cooked: Some(s.clone()),
                                    raw: s,
                                });

                                let e = e.exprs[idx / 2].take();

                                new_tpl.exprs.push(e);
                            }
                        }
                    }
                    _ => {
                        let s = Atom::from(&*cur_str_value);
                        cur_str_value.clear();

                        new_tpl.quasis.push(TplElement {
                            span: DUMMY_SP,
                            tail: false,
                            cooked: Some(s.clone()),
                            raw: s,
                        });

                        new_tpl.exprs.push(e);
                    }
                }
            }
        }

        let s = Atom::from(&*cur_str_value);
        new_tpl.quasis.push(TplElement {
            span: DUMMY_SP,
            tail: false,
            cooked: Some(s.clone()),
            raw: s,
        });

        *e = Expr::Tpl(new_tpl);
    }

    /// Converts template literals to string if `exprs` of [Tpl] is empty.
    pub(super) fn convert_tpl_to_str(&mut self, e: &mut Expr) {
        match e {
            Expr::Tpl(t) if t.quasis.len() == 1 && t.exprs.is_empty() => {
                let c = &t.quasis[0].raw;

                if c.chars().all(|c| match c {
                    '\u{0020}'..='\u{007e}' => true,
                    '\n' | '\r' => self.config.force_str_for_tpl,
                    _ => false,
                }) && (self.config.force_str_for_tpl
                    || c.contains("\\`")
                    || (!c.contains("\\n") && !c.contains("\\r")))
                    && !c.contains("\\0")
                    && !c.contains("\\x")
                    && !c.contains("\\u")
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
        let mut cur_cooked = String::new();

        for i in 0..(tpl.exprs.len() + tpl.quasis.len()) {
            if i % 2 == 0 {
                let i = i / 2;
                let q = tpl.quasis[i].take();

                cur_raw.push_str(&q.raw);
                if let Some(cooked) = q.cooked {
                    cur_cooked.push_str(&cooked);
                }
            } else {
                let i = i / 2;
                let e = tpl.exprs[i].take();

                match *e {
                    Expr::Lit(Lit::Str(s)) => {
                        cur_raw.push_str(&convert_str_value_to_tpl_raw(&s.value));
                        cur_cooked.push_str(&convert_str_value_to_tpl_cooked(&s.value));
                    }
                    _ => {
                        quasis.push(TplElement {
                            span: DUMMY_SP,
                            tail: true,
                            cooked: Some(Atom::from(&*cur_cooked)),
                            raw: take(&mut cur_raw).into(),
                        });

                        exprs.push(e);
                    }
                }
            }
        }

        report_change!("compressing template literals");

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
                        *cooked =
                            format!("{}{}", cooked, convert_str_value_to_tpl_cooked(&rs.value))
                                .into();
                    }

                    let new: Atom =
                        format!("{}{}", l_last.raw, convert_str_value_to_tpl_raw(&rs.value)).into();
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
                        *cooked =
                            format!("{}{}", convert_str_value_to_tpl_cooked(&ls.value), cooked)
                                .into()
                    }

                    let new: Atom =
                        format!("{}{}", convert_str_value_to_tpl_raw(&ls.value), r_first.raw)
                            .into();
                    r_first.raw = new;

                    l.take();
                }
            }

            (Expr::Tpl(l), Expr::Tpl(rt)) => {
                // We prepend the last quasis of l to the first quasis of r.
                // After doing so, we can append all data of r to l.

                {
                    let l_last = l.quasis.pop().unwrap();
                    let r_first = rt.quasis.first_mut().unwrap();
                    let new: Atom = format!("{}{}", l_last.raw, r_first.raw).into();

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
                        if let Value::Known(second_str) = left.right.as_pure_string(&self.expr_ctx)
                        {
                            if let Value::Known(third_str) =
                                bin.right.as_pure_string(&self.expr_ctx)
                            {
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

pub(super) fn convert_str_value_to_tpl_cooked(value: &JsWord) -> Cow<str> {
    value
        .replace('\\', "\\\\")
        .replace('`', "\\`")
        .replace('$', "\\$")
        .into()
}

pub(super) fn convert_str_value_to_tpl_raw(value: &JsWord) -> Cow<str> {
    value
        .replace('\\', "\\\\")
        .replace('`', "\\`")
        .replace('$', "\\$")
        .replace('\n', "\\n")
        .replace('\r', "\\r")
        .into()
}
