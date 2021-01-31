use super::Optimizer;
use swc_ecma_ast::*;

/// Methods related to the option `arguments`.
impl Optimizer {
    ///
    /// - `arguments['foo']` => `arguments.foo`
    pub(super) fn optimize_computed_access_to_arguments(&mut self, e: &mut Expr) {
        if !self.options.arguments {
            return;
        }

        let member = match e {
            Expr::Member(member) => member,
            _ => return,
        };

        if !member.computed {
            return;
        }

        match &*member.prop {
            Expr::Lit(Lit::Str(prop)) => {
                self.changed = true;
                log::trace!("arguments: Optimizing computed access to arguments");
                member.computed = false;
                member.prop = Box::new(Expr::Ident(Ident {
                    span: prop.span,
                    sym: prop.value.clone(),
                    type_ann: None,
                    optional: false,
                }))
            }
            _ => {}
        }
    }
}
