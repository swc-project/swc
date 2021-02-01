use super::Optimizer;
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;

/// Methods related to the option `hoist_props`.
impl Optimizer {
    pub(super) fn store_var_for_prop_hoisting(&mut self, n: &mut VarDeclarator) {
        if !self.options.hoist_props && !self.options.reduce_vars {
            return;
        }

        match &mut n.name {
            Pat::Ident(name) => {
                // If the variable is used multiple time, just ignore it.
                if !self
                    .data
                    .as_ref()
                    .and_then(|data| {
                        data.vars
                            .get(&name.to_id())
                            .map(|v| v.ref_count == 1 && v.has_property_access)
                    })
                    .unwrap_or(false)
                {
                    return;
                }

                let init = match n.init.take() {
                    Some(v) => v,
                    None => return,
                };

                match self.vars_for_prop_hoisting.insert(name.to_id(), init) {
                    Some(prev) => {
                        panic!(
                            "two variable with same name and same span hygiene is \
                             invalid\nPrevious value: {:?}",
                            prev
                        );
                    }
                    None => {}
                }
            }
            _ => {}
        }
    }

    pub(super) fn replace_props(&mut self, e: &mut Expr) {
        let member = match e {
            Expr::Member(m) => m,
            _ => return,
        };

        match &member.obj {
            ExprOrSuper::Super(_) => {}
            ExprOrSuper::Expr(obj) => match &**obj {
                Expr::Ident(obj) => {
                    if let Some(value) = self.vars_for_prop_hoisting.remove(&obj.to_id()) {
                        member.obj = ExprOrSuper::Expr(value);
                        self.changed = true;
                        log::trace!("hoist_props: Inlined a property");
                        return;
                    }
                }
                _ => {}
            },
        }
    }
}
