use swc_atoms::js_word;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_minifier_utils::compress_util::is_valid_identifier;
use swc_ecma_utils::{prop_name_eq, ExprExt};

use super::Pure;

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

    /// Converts `{ a: 1 }.a` into `1`.
    pub(super) fn handle_property_access(&mut self, e: &mut Expr) {
        if !self.options.props {
            return;
        }

        if self.ctx.is_update_arg {
            return;
        }

        if self.ctx.is_callee {
            return;
        }

        let me = match e {
            Expr::Member(m) => m,
            _ => return,
        };

        let key = match &me.prop {
            MemberProp::Ident(prop) => prop,
            _ => return,
        };

        let obj = match &mut *me.obj {
            Expr::Object(o) => o,
            _ => return,
        };

        let duplicate_prop = obj
            .props
            .iter()
            .filter(|prop| match prop {
                PropOrSpread::Spread(_) => false,
                PropOrSpread::Prop(p) => match &**p {
                    Prop::Shorthand(p) => p.sym == key.sym,
                    Prop::KeyValue(p) => prop_name_eq(&p.key, &key.sym),
                    Prop::Assign(p) => p.key.sym == key.sym,
                    Prop::Getter(p) => prop_name_eq(&p.key, &key.sym),
                    Prop::Setter(p) => prop_name_eq(&p.key, &key.sym),
                    Prop::Method(p) => prop_name_eq(&p.key, &key.sym),
                },
            })
            .count()
            != 1;
        if duplicate_prop {
            return;
        }

        if obj.props.iter().any(|prop| match prop {
            PropOrSpread::Spread(_) => false,
            PropOrSpread::Prop(p) => match &**p {
                Prop::Shorthand(..) => false,
                Prop::KeyValue(p) => {
                    p.key.is_computed()
                        || p.value.may_have_side_effects(&self.expr_ctx)
                        || deeply_contains_this_expr(&p.value)
                }
                Prop::Assign(p) => {
                    p.value.may_have_side_effects(&self.expr_ctx)
                        || deeply_contains_this_expr(&p.value)
                }
                Prop::Getter(p) => p.key.is_computed(),
                Prop::Setter(p) => p.key.is_computed(),
                Prop::Method(p) => p.key.is_computed(),
            },
        }) {
            return;
        }

        for prop in &obj.props {
            match prop {
                PropOrSpread::Spread(_) => {}
                PropOrSpread::Prop(p) => match &**p {
                    Prop::Shorthand(_) => {}
                    Prop::KeyValue(p) => {
                        if prop_name_eq(&p.key, &key.sym) {
                            report_change!(
                                "properties: Inlining a key-value property `{}`",
                                key.sym
                            );
                            self.changed = true;
                            *e = *p.value.clone();
                            return;
                        }
                    }
                    Prop::Assign(_) => {}
                    Prop::Getter(_) => {}
                    Prop::Setter(_) => {}
                    Prop::Method(_) => {}
                },
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
