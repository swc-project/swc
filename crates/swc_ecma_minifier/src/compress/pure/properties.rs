use swc_atoms::js_word;
use swc_ecma_ast::*;

use super::Pure;
use crate::compress::util::is_valid_identifier;

impl Pure<'_> {
    pub(super) fn optimize_property_of_member_expr(
        &mut self,
        obj: Option<&Expr>,
        c: &mut ComputedPropName,
    ) -> Option<IdentName> {
        if !self.options.props {
            return None;
        }
        if let Some(Expr::Array(..) | Expr::Await(..) | Expr::Yield(..) | Expr::Lit(..)) = obj {
            return None;
        }

        match &*c.expr {
            Expr::Lit(Lit::Str(s))
                if s.value.is_reserved()
                    || s.value.is_reserved_in_es3()
                    || is_valid_identifier(&s.value, true) =>
            {
                self.changed = true;
                report_change!(
                    "properties: Computed member => member expr with identifier as a prop"
                );

                Some(IdentName {
                    span: s.span,
                    sym: s.value.clone(),
                })
            }

            _ => None,
        }
    }

    /// If a key of is `'str'` (like `{ 'str': 1 }`) change it to [Ident] like
    /// (`{ str: 1, }`)
    pub(super) fn optimize_computed_prop_name_as_normal(&mut self, p: &mut PropName) {
        if !self.options.computed_props {
            return;
        }

        if let PropName::Computed(c) = p {
            match &mut *c.expr {
                Expr::Lit(Lit::Str(s)) => {
                    if s.value == *"constructor" || s.value == *"__proto__" {
                        return;
                    }

                    if s.value.is_reserved()
                        || s.value.is_reserved_in_es3()
                        || is_valid_identifier(&s.value, false)
                    {
                        *p = PropName::Ident(IdentName::new(s.value.clone(), s.span));
                    } else {
                        *p = PropName::Str(s.clone());
                    }
                }
                Expr::Lit(Lit::Num(n)) => {
                    if n.value.is_sign_positive() {
                        *p = PropName::Num(n.clone());
                    }
                }
                _ => {}
            }
        }
    }

    pub(super) fn optimize_prop_name(&mut self, name: &mut PropName) {
        if let PropName::Str(s) = name {
            if s.value.is_reserved()
                || s.value.is_reserved_in_es3()
                || is_valid_identifier(&s.value, false)
            {
                self.changed = true;
                report_change!("misc: Optimizing string property name");
                *name = PropName::Ident(IdentName {
                    span: s.span,
                    sym: s.value.clone(),
                });
                return;
            }

            if (!s.value.starts_with('0') && !s.value.starts_with('+')) || s.value.len() <= 1 {
                if let Ok(v) = s.value.parse::<u32>() {
                    self.changed = true;
                    report_change!("misc: Optimizing numeric property name");
                    *name = PropName::Num(Number {
                        span: s.span,
                        value: v as _,
                        raw: None,
                    });
                }
            }
        }
    }

    pub(super) fn handle_known_computed_member_expr(
        &mut self,
        c: &mut ComputedPropName,
    ) -> Option<IdentName> {
        if !self.options.props || !self.options.evaluate {
            return None;
        }

        match &*c.expr {
            Expr::Lit(Lit::Str(s)) => {
                if s.value == js_word!("")
                    || s.value.starts_with(|c: char| c.is_ascii_digit())
                    || s.value
                        .contains(|c: char| !matches!(c, '0'..='9' | 'a'..='z' | 'A'..='Z' | '$'))
                {
                    return None;
                }

                self.changed = true;

                Some(IdentName::new(s.value.clone(), s.span))
            }
            _ => None,
        }
    }
}
