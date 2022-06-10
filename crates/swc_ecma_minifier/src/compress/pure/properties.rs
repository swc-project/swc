use swc_atoms::js_word;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;

use super::Pure;
use crate::compress::util::is_valid_identifier;

impl Pure<'_> {
    pub(super) fn optimize_property_of_member_expr(
        &mut self,
        obj: Option<&Expr>,
        c: &mut ComputedPropName,
    ) -> Option<Ident> {
        if !self.options.props {
            return None;
        }
        if let Some(obj) = obj {
            match obj {
                Expr::Array(..) | Expr::Await(..) | Expr::Yield(..) | Expr::Lit(..) => return None,
                _ => {}
            }
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

                Some(Ident {
                    span: s.span.with_ctxt(SyntaxContext::empty()),
                    sym: s.value.clone(),
                    optional: false,
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
                        *p = PropName::Ident(Ident::new(
                            s.value.clone(),
                            s.span.with_ctxt(SyntaxContext::empty()),
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
            if s.value.is_reserved()
                || s.value.is_reserved_in_es3()
                || is_valid_identifier(&s.value, false)
            {
                self.changed = true;
                report_change!("misc: Optimizing string property name");
                *name = PropName::Ident(Ident {
                    span: s.span,
                    sym: s.value.clone(),
                    optional: false,
                });
            }
        }
    }

    pub(super) fn handle_known_computed_member_expr(
        &mut self,
        c: &mut ComputedPropName,
    ) -> Option<Ident> {
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

                Some(Ident::new(
                    s.value.clone(),
                    s.span.with_ctxt(SyntaxContext::empty()),
                ))
            }
            _ => None,
        }
    }
}
