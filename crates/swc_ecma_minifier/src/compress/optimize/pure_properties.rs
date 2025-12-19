use swc_atoms::Atom;
use swc_ecma_ast::*;

use super::Optimizer;
use crate::compress::util::is_valid_identifier;

impl Optimizer<'_> {
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
            Expr::Lit(Lit::Str(s)) => {
                let value = s.value.as_str()?;
                if value.is_reserved()
                    || value.is_reserved_in_es3()
                    || is_valid_identifier(value, true)
                {
                    self.changed = true;
                    report_change!(
                        "properties: Computed member => member expr with identifier as a prop"
                    );

                    Some(IdentName {
                        span: s.span,
                        // SAFETY: We just checked that s.value is valid UTF-8.
                        sym: unsafe { Atom::from_wtf8_unchecked(s.value.clone()) },
                    })
                } else {
                    None
                }
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
                    let Some(value) = s.value.as_str() else {
                        return;
                    };
                    if value == "constructor" || value == "__proto__" {
                        return;
                    }

                    if value.is_reserved()
                        || value.is_reserved_in_es3()
                        || is_valid_identifier(value, false)
                    {
                        *p = PropName::Ident(IdentName::new(
                            // SAFETY: reserved words and valid identifiers are valid UTF-8.
                            unsafe { Atom::from_wtf8_unchecked(s.value.clone()) },
                            s.span,
                        ));
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
            let Some(value) = s.value.as_str() else {
                return;
            };
            if value.is_reserved()
                || value.is_reserved_in_es3()
                || is_valid_identifier(value, false)
            {
                self.changed = true;
                report_change!("misc: Optimizing string property name");
                *name = PropName::Ident(IdentName {
                    span: s.span,
                    // SAFETY: reserved words and valid identifiers are valid UTF-8.
                    sym: unsafe { Atom::from_wtf8_unchecked(s.value.clone()) },
                });
                return;
            }

            if (!value.starts_with('0') && !value.starts_with('+')) || value.len() <= 1 {
                if let Ok(v) = value.parse::<u32>() {
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
                let value = s.value.as_str()?;
                if value.is_empty()
                    || value.starts_with(|c: char| c.is_ascii_digit())
                    || value
                        .contains(|c: char| !matches!(c, '0'..='9' | 'a'..='z' | 'A'..='Z' | '$'))
                {
                    return None;
                }

                self.changed = true;

                Some(IdentName::new(
                    // SAFETY: We just checked that s.value is valid UTF-8.
                    unsafe { Atom::from_wtf8_unchecked(s.value.clone()) },
                    s.span,
                ))
            }
            _ => None,
        }
    }
}
