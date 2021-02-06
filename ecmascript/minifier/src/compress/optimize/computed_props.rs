use super::Optimizer;
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

                    *p = PropName::Str(s.clone());
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
