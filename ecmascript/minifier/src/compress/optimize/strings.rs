use super::Optimizer;
use std::mem::take;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;

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
        match (l, &mut *r) {
            (Expr::Tpl(l), Expr::Lit(Lit::Str(rs))) => {
                // Append
                if let Some(l_last) = l.quasis.last_mut() {
                    self.changed = true;

                    log::trace!("template: Concatted a string on rhs of `+` to a template literal");
                    let l_str = l_last.cooked.as_mut().unwrap();
                    l_str.value = format!("{}{}", l_str.value, rs.value).into();

                    r.take();
                    return;
                }
            }
            _ => {}
        }
    }
}
