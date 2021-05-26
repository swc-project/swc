use super::Optimizer;
use std::mem::take;
use swc_atoms::js_word;
use swc_atoms::JsWord;
use swc_common::Spanned;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::ExprExt;
use swc_ecma_utils::Type;
use swc_ecma_utils::Value::Known;

impl Optimizer<'_> {
    /// Converts template literals to string if `exprs` of [Tpl] is empty.
    pub(super) fn convert_tpl_to_str(&mut self, e: &mut Expr) {
        match e {
            Expr::Tpl(t) if t.quasis.len() == 1 && t.exprs.is_empty() => {
                if let Some(c) = &t.quasis[0].cooked {
                    if c.value.chars().all(|c| match c {
                        '\u{0020}'..='\u{007e}' => true,
                        _ => false,
                    }) {
                        *e = Expr::Lit(Lit::Str(c.clone()));
                    }
                }
            }
            _ => {}
        }
    }

    pub(super) fn optimize_expr_in_str_ctx_unsafely(&mut self, e: &mut Expr) {
        if !self.options.unsafe_passes {
            return;
        }

        match e {
            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(callee),
                args,
                ..
            }) => {
                if args.iter().any(|arg| arg.expr.may_have_side_effects()) {
                    return;
                }

                match &**callee {
                    Expr::Ident(Ident {
                        sym: js_word!("RegExp"),
                        ..
                    }) if self.options.unsafe_regexp => {
                        if args.len() != 1 {
                            return;
                        }

                        self.optimize_expr_in_str_ctx(&mut args[0].expr);

                        match &*args[0].expr {
                            Expr::Lit(Lit::Str(..)) => {
                                self.changed = true;
                                log::trace!(
                                    "strings: Unsafely reduced `RegExp` call in a string context"
                                );

                                *e = *args[0].expr.take();
                                return;
                            }

                            _ => {}
                        }
                    }
                    _ => {}
                }
            }

            _ => {}
        }
    }

    /// Convert expressions to string literal if possible.
    pub(super) fn optimize_expr_in_str_ctx(&mut self, n: &mut Expr) {
        match n {
            Expr::Lit(Lit::Str(..)) => return,
            Expr::Paren(e) => {
                self.optimize_expr_in_str_ctx(&mut e.expr);
                match &*e.expr {
                    Expr::Lit(Lit::Str(..)) => {
                        *n = *e.expr.take();
                        self.changed = true;
                        log::trace!("string: Removed a paren in a string context");
                    }
                    _ => {}
                }

                return;
            }
            _ => {}
        }

        let span = n.span();
        let value = n.as_string();
        if let Known(value) = value {
            self.changed = true;
            log::trace!(
                "strings: Converted an expression into a string literal (in string context)"
            );
            *n = Expr::Lit(Lit::Str(Str {
                span,
                value: value.into(),
                has_escape: false,
                kind: Default::default(),
            }));
            return;
        }

        match n {
            Expr::Lit(Lit::Num(v)) => {
                self.changed = true;
                log::trace!(
                    "strings: Converted a numeric literal ({}) into a string literal (in string \
                     context)",
                    v.value
                );

                *n = Expr::Lit(Lit::Str(Str {
                    span: v.span,
                    value: format!("{:?}", v.value).into(),
                    has_escape: false,
                    kind: Default::default(),
                }));
                return;
            }

            Expr::Lit(Lit::Regex(v)) => {
                if !self.options.evaluate {
                    return;
                }
                self.changed = true;
                log::trace!(
                    "strings: Converted a regex (/{}/{}) into a string literal (in string context)",
                    v.exp,
                    v.flags
                );

                *n = Expr::Lit(Lit::Str(Str {
                    span: v.span,
                    value: format!("/{}/{}", v.exp, v.flags).into(),
                    has_escape: false,
                    kind: Default::default(),
                }));
                return;
            }

            Expr::Ident(i) => {
                if !self.options.evaluate || !self.options.reduce_vars {
                    return;
                }
                if self
                    .data
                    .as_ref()
                    .and_then(|data| data.vars.get(&i.to_id()))
                    .map(|v| v.assign_count == 0)
                    .unwrap_or(false)
                {
                    self.changed = true;
                    log::trace!(
                        "strings: Converting a reference ({}{:?}) into `undefined` (in string \
                         context)",
                        i.sym,
                        i.span.ctxt
                    );

                    *n = Expr::Lit(Lit::Str(Str {
                        span: i.span,
                        value: js_word!("undefined"),
                        has_escape: false,
                        kind: Default::default(),
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

        let mut quasis = vec![];
        let mut exprs = vec![];
        let mut cur = String::new();
        let mut cur_raw = String::new();

        for i in 0..(tpl.exprs.len() + tpl.quasis.len()) {
            if i % 2 == 0 {
                let i = i / 2;
                let q = tpl.quasis[i].take();

                cur.push_str(&q.cooked.unwrap().value);
                cur_raw.push_str(&q.raw.value);
            } else {
                let i = i / 2;
                let e = tpl.exprs[i].take();

                match *e {
                    Expr::Lit(Lit::Str(s)) => {
                        cur.push_str(&s.value);
                        cur_raw.push_str(&s.value);
                    }
                    _ => {
                        quasis.push(TplElement {
                            span: DUMMY_SP,
                            tail: true,
                            cooked: Some(Str {
                                span: DUMMY_SP,
                                value: take(&mut cur).into(),
                                has_escape: false,
                                kind: Default::default(),
                            }),
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
            cooked: Some(Str {
                span: DUMMY_SP,
                value: cur.into(),
                has_escape: false,
                kind: Default::default(),
            }),
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

                    log::trace!(
                        "template: Concatted a string (`{}`) on rhs of `+` to a template literal",
                        rs.value
                    );
                    let l_str = l_last.cooked.as_mut().unwrap();

                    let new: JsWord = format!("{}{}", l_str.value, rs.value).into();
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

                    log::trace!(
                        "template: Prepended a string (`{}`) on lhs of `+` to a template literal",
                        ls.value
                    );
                    let r_str = r_first.cooked.as_mut().unwrap();

                    let new: JsWord = format!("{}{}", ls.value, r_str.value).into();
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

                    let r_str = r_first.cooked.as_mut().unwrap();

                    let new: JsWord =
                        format!("{}{}", l_last.cooked.unwrap().value, r_str.value).into();
                    r_str.value = new.clone();
                    r_first.raw.value = new;
                }

                l.quasis.extend(rt.quasis.take());
                l.exprs.extend(rt.exprs.take());
                // Remove r
                r.take();

                debug_assert!(l.quasis.len() == l.exprs.len() + 1, "{:?} is invalid", l);
                self.changed = true;
                log::trace!("strings: Merged to template literals");
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

                                    self.changed = true;
                                    log::trace!(
                                        "string: Concatting `{} + {}` to `{}`",
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
                                self.changed = true;
                                log::trace!(
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
                                log::trace!(
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
