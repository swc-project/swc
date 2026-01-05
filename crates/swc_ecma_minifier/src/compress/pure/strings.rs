use std::{borrow::Cow, iter::zip, mem::take};

use swc_atoms::{
    wtf8::{Wtf8, Wtf8Buf},
    Atom, Wtf8Atom,
};
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

        match l_l.get_type(self.expr_ctx) {
            Known(Type::Str) => {}
            _ => return,
        }
        match r_l.get_type(self.expr_ctx) {
            Known(Type::Str) => {}
            _ => return,
        }

        let lls = l_l.as_pure_string(self.expr_ctx);
        let rls = r_l.as_pure_string(self.expr_ctx);

        if let (Known(lls), Known(rls)) = (lls, rls) {
            self.changed = true;
            report_change!("evaluate: 'foo' + ('bar' + baz) => 'foobar' + baz");

            let s = lls.into_owned() + &*rls;
            *e = BinExpr {
                span,
                op: op!(bin, "+"),
                left: s.into(),
                right: r_r.take(),
            }
            .into();
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
            *e = BinExpr {
                span: tpl.span,
                op: op!(bin, "+"),
                left: tpl.quasis[0]
                    .cooked
                    .clone()
                    .unwrap_or_else(|| tpl.quasis[0].raw.clone().into())
                    .into(),
                right: tpl.exprs[0].take(),
            }
            .into();
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
        let mut cur_cooked_str = Wtf8Buf::new();
        let mut cur_raw_str = String::new();
        let mut q_iter = tpl.quasis.take().into_iter();
        let e_iter = tpl.exprs.take().into_iter();

        macro_rules! push_str {
            ($e:expr) => {
                if let Some(cooked) = $e.cooked {
                    cur_cooked_str.push_wtf8(&cooked);
                } else {
                    cur_cooked_str.push_wtf8(&Str::from_tpl_raw(&$e));
                }
                cur_raw_str.push_str(&$e.raw);
            };
        }

        macro_rules! end_str {
            () => {
                let cooked = Wtf8Atom::from(&*cur_cooked_str);
                let raw = Atom::from(&*cur_raw_str);
                cur_cooked_str.clear();
                cur_raw_str.clear();
                new_tpl.quasis.push(TplElement {
                    span: DUMMY_SP,
                    tail: false,
                    cooked: Some(cooked),
                    raw,
                });
            };
        }

        // Consume quasis first to make sure it align with exprs
        // quasis.len() == exprs.len() + 1
        if let Some(q) = q_iter.next() {
            push_str!(q);
        }

        for (q, mut e) in zip(q_iter, e_iter) {
            self.eval_nested_tpl(&mut e);
            match *e {
                Expr::Tpl(mut tpl) => {
                    // For evaluated template only the first
                    // and the last quasi could be concat with
                    // outside quasis.
                    let mut quasis_taken = tpl.quasis.take();
                    let l = quasis_taken.len();

                    // Store the first quasi for later concat
                    let first = quasis_taken[0].take();
                    push_str!(first);

                    if l > 1 {
                        // If there are more than one quasi
                        // Concat first with outside quasis
                        end_str!();

                        // Store the last quasi for later concat
                        let last = quasis_taken.pop().unwrap();
                        push_str!(last);

                        // Append the rest of quasis and exprs to new_tpl
                        new_tpl.quasis.extend(quasis_taken.into_iter().skip(1));
                        new_tpl.exprs.extend(tpl.exprs.into_iter());
                    }
                }
                _ => {
                    end_str!();

                    new_tpl.exprs.push(e);
                }
            }
            push_str!(q);
        }

        end_str!();

        *e = new_tpl.into();
    }

    /// Converts template literals to string if `exprs` of [Tpl] is empty.
    pub(super) fn convert_tpl_to_str(&mut self, e: &mut Expr) {
        match e {
            Expr::Tpl(t) if t.quasis.len() == 1 && t.exprs.is_empty() => {
                if let Some(cooked) = &t.quasis[0].cooked {
                    if let Some(value) = cooked.as_str() {
                        if value.chars().all(|c| match c {
                            '\n' | '\r' => self.config.force_str_for_tpl,
                            _ => true,
                        }) {
                            report_change!("converting a template literal to a string literal");

                            *e = Lit::Str(Str {
                                span: t.span,
                                raw: None,
                                value: cooked.clone(),
                            })
                            .into();
                        }
                        return;
                    }
                }

                let c = &t.quasis[0].raw;
                if c.chars().all(|c| match c {
                    '\n' | '\r' => self.config.force_str_for_tpl,
                    _ => true,
                }) {
                    let value = Str::from_tpl_raw(&t.quasis[0]);

                    report_change!("converting a template literal to a string literal");

                    *e = Lit::Str(Str {
                        span: t.span,
                        raw: None,
                        value,
                    })
                    .into();
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

        let mut quasis = Vec::new();
        let mut exprs = Vec::new();
        let mut cur_raw = String::new();
        let mut cur_cooked = Some(Wtf8Buf::new());

        for i in 0..(tpl.exprs.len() + tpl.quasis.len()) {
            if i % 2 == 0 {
                let i = i / 2;
                let q = tpl.quasis[i].clone();

                if q.cooked.is_some() {
                    if let Some(cur_cooked) = &mut cur_cooked {
                        cur_cooked.push_str("");
                    }
                } else {
                    // If cooked is None, it means that the template literal contains invalid escape
                    // sequences.
                    cur_cooked = None;
                }
            } else {
                let i = i / 2;
                let e = &tpl.exprs[i];

                match &**e {
                    Expr::Lit(Lit::Str(s)) => {
                        if cur_cooked.is_none() && s.raw.is_none() {
                            return;
                        }

                        if let Some(cur_cooked) = &mut cur_cooked {
                            cur_cooked.push_str("");
                        }
                    }
                    _ => {
                        cur_cooked = Some(Wtf8Buf::new());
                    }
                }
            }
        }

        cur_cooked = Some(Default::default());

        for i in 0..(tpl.exprs.len() + tpl.quasis.len()) {
            if i % 2 == 0 {
                let i = i / 2;
                let q = tpl.quasis[i].take();

                cur_raw.push_str(&q.raw);
                if let Some(cooked) = q.cooked {
                    if let Some(cur_cooked) = &mut cur_cooked {
                        cur_cooked.push_wtf8(&cooked);
                    }
                } else {
                    // If cooked is None, it means that the template literal contains invalid escape
                    // sequences.
                    cur_cooked = None;
                }
            } else {
                let i = i / 2;
                let e = tpl.exprs[i].take();

                match *e {
                    Expr::Lit(Lit::Str(s)) => {
                        if let Some(cur_cooked) = &mut cur_cooked {
                            cur_cooked.push_wtf8(&Cow::Borrowed(&s.value));
                        }

                        if let Some(raw) = &s.raw {
                            if raw.len() >= 2 {
                                // Exclude quotes
                                cur_raw
                                    .push_str(&convert_str_raw_to_tpl_raw(&raw[1..raw.len() - 1]));
                            }
                        } else {
                            cur_raw.push_str(&convert_str_value_to_tpl_raw(&s.value));
                        }
                    }
                    _ => {
                        quasis.push(TplElement {
                            span: DUMMY_SP,
                            tail: true,
                            cooked: cur_cooked.take().map(From::from),
                            raw: take(&mut cur_raw).into(),
                        });
                        cur_cooked = Some(Wtf8Buf::new());

                        exprs.push(e);
                    }
                }
            }
        }

        report_change!("compressing template literals");

        quasis.push(TplElement {
            span: DUMMY_SP,
            tail: true,
            cooked: cur_cooked.map(From::from),
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
                if let Some(raw) = &rs.raw {
                    if raw.len() <= 2 {
                        return;
                    }
                }

                // Append
                if let Some(l_last) = l.quasis.last_mut() {
                    self.changed = true;

                    report_change!(
                        "template: Concatted a string (`{:?}`) on rhs of `+` to a template literal",
                        rs.value
                    );

                    if let Some(cooked) = &mut l_last.cooked {
                        let mut c = Wtf8Buf::from(&*cooked);
                        c.push_wtf8(&Cow::Borrowed(&rs.value));
                        *cooked = c.into();
                    }

                    l_last.raw = format!(
                        "{}{}",
                        l_last.raw,
                        rs.raw
                            .clone()
                            .map(|s| convert_str_raw_to_tpl_raw(&s[1..s.len() - 1]))
                            .unwrap_or_else(|| convert_str_value_to_tpl_raw(&rs.value).into())
                    )
                    .into();

                    r.take();
                }
            }

            (Expr::Lit(Lit::Str(ls)), Expr::Tpl(r)) => {
                if let Some(raw) = &ls.raw {
                    if raw.len() <= 2 {
                        return;
                    }
                }

                // Append
                if let Some(r_first) = r.quasis.first_mut() {
                    self.changed = true;

                    report_change!(
                        "template: Prepended a string (`{:?}`) on lhs of `+` to a template literal",
                        ls.value
                    );

                    if let Some(cooked) = &mut r_first.cooked {
                        let mut c = Wtf8Buf::new();
                        c.push_wtf8(&Cow::Borrowed(&ls.value));
                        c.push_wtf8(&*cooked);
                        *cooked = c.into();
                    }

                    let new: Atom = format!(
                        "{}{}",
                        ls.raw
                            .clone()
                            .map(|s| convert_str_raw_to_tpl_raw(&s[1..s.len() - 1]))
                            .unwrap_or_else(|| convert_str_value_to_tpl_raw(&ls.value).into()),
                        r_first.raw
                    )
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

                debug_assert!(l.quasis.len() == l.exprs.len() + 1, "{l:?} is invalid");
                self.changed = true;
                report_change!("strings: Merged two template literals");
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
                let type_of_second = left.right.get_type(self.expr_ctx);
                let type_of_third = bin.right.get_type(self.expr_ctx);

                if let Value::Known(Type::Str) = type_of_second {
                    if let Value::Known(Type::Str) = type_of_third {
                        if let Value::Known(second_str) = left.right.as_pure_wtf8(self.expr_ctx) {
                            if let Value::Known(third_str) = bin.right.as_pure_wtf8(self.expr_ctx) {
                                #[cfg(feature = "debug")]
                                let debug_second_str = second_str.clone();

                                let new_str = second_str.into_owned() + &*third_str;
                                let left_span = left.span;

                                self.changed = true;
                                report_change!(
                                    "strings: Concatting `{:?} + {:?}` to `{:?}`",
                                    debug_second_str,
                                    third_str,
                                    new_str
                                );

                                *e = BinExpr {
                                    span: bin.span,
                                    op: op!(bin, "+"),
                                    left: left.left.take(),
                                    right: Lit::Str(Str {
                                        span: left_span,
                                        raw: None,
                                        value: new_str.into(),
                                    })
                                    .into(),
                                }
                                .into();
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
            let lt = left.get_type(self.expr_ctx);
            let rt = right.get_type(self.expr_ctx);
            if let Value::Known(Type::Str) = lt {
                if let Value::Known(Type::Str) = rt {
                    match &**left {
                        Expr::Lit(Lit::Str(Str { value, .. })) if value.is_empty() => {
                            self.changed = true;
                            report_change!(
                                "string: Dropping empty string literal (in lhs) because it does \
                                 not changes type"
                            );

                            *e = *right.take();
                            return;
                        }
                        _ => (),
                    }

                    match &**right {
                        Expr::Lit(Lit::Str(Str { value, .. })) if value.is_empty() => {
                            self.changed = true;
                            report_change!(
                                "string: Dropping empty string literal (in rhs) because it does \
                                 not changes type"
                            );

                            *e = *left.take();
                        }
                        _ => (),
                    }
                }
            }
        }
    }
}

pub(super) fn convert_str_value_to_tpl_raw(value: &Wtf8) -> Cow<str> {
    let mut result = String::default();

    let iter = value.code_points();
    for code_point in iter {
        if let Some(ch) = code_point.to_char() {
            match ch {
                '\\' => {
                    result.push_str("\\\\");
                }
                '`' => {
                    result.push_str("\\`");
                }
                '$' => {
                    result.push_str("\\$");
                }
                '\n' => {
                    result.push_str("\\n");
                }
                '\r' => {
                    result.push_str("\\r");
                }
                _ => result.push(ch),
            }
        } else {
            result.push_str(&format!("\\u{:04X}", code_point.to_u32()));
        }
    }

    result.into()
}

pub(super) fn convert_str_raw_to_tpl_raw(value: &str) -> Atom {
    value.replace('`', "\\`").replace('$', "\\$").into()
}
