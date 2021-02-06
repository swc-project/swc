use super::Optimizer;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;

/// Methods related to the option `computed_props`.
impl Optimizer<'_> {
    pub(super) fn optimize_computed_prop_name_as_normal(&mut self, p: &mut PropName) {
        if !self.options.computed_props {
            return;
        }

        match p {
            PropName::Computed(c) => match &mut *c.expr {
                Expr::Lit(Lit::Str(s)) => {
                    if s.value == *"constructor" || s.value == *"__proto__" {
                        return;
                    }

                    if s.value.is_empty() || s.value.starts_with(|c: char| c.is_numeric()) {
                        *p = PropName::Str(s.clone());
                    } else {
                        *p = PropName::Ident(Ident::new(
                            s.value.clone(),
                            s.span.with_ctxt(SyntaxContext::empty()),
                        ));
                    }

                    return;
                }
                Expr::Lit(Lit::Num(n)) => {
                    *p = PropName::Num(n.clone());
                    return;
                }
                _ => {}
            },
            _ => {}
        }
    }
}
