use super::Optimizer;
use crate::mode::Mode;
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;

/// Methods related to the option `hoist_props`.
impl<M> Optimizer<'_, M>
where
    M: Mode,
{
    /// Store values of properties so we can replace property accesses with the
    /// values.
    pub(super) fn store_var_for_prop_hoisting(&mut self, n: &mut VarDeclarator) {
        if !self.options.hoist_props && !self.options.reduce_vars {
            return;
        }

        match &mut n.name {
            Pat::Ident(name) => {
                // If a variable is initialized multiple time, we currently don't do anything
                // smart.
                if !self
                    .data
                    .as_ref()
                    .and_then(|data| {
                        data.vars
                            .get(&name.to_id())
                            .map(|v| !v.mutated && !v.reassigned && !v.is_infected())
                    })
                    .unwrap_or(false)
                {
                    return;
                }

                // We should abort if unknown property is used.
                let mut unknown_used_props = self
                    .data
                    .as_ref()
                    .and_then(|data| {
                        data.vars
                            .get(&name.to_id())
                            .map(|v| v.accessed_props.clone())
                    })
                    .unwrap_or_default();

                match n.init.as_deref() {
                    Some(Expr::Object(init)) => {
                        for prop in &init.props {
                            let prop = match prop {
                                PropOrSpread::Spread(_) => continue,
                                PropOrSpread::Prop(prop) => prop,
                            };

                            match &**prop {
                                Prop::KeyValue(p) => {
                                    match &*p.value {
                                        Expr::Lit(..) => {}
                                        _ => continue,
                                    };

                                    match &p.key {
                                        PropName::Str(s) => {
                                            unknown_used_props.remove(&s.value);
                                        }
                                        PropName::Ident(i) => {
                                            unknown_used_props.remove(&i.sym);
                                        }
                                        _ => {}
                                    }
                                }
                                _ => {}
                            }
                        }
                    }
                    _ => {}
                }

                if !unknown_used_props.is_empty() {
                    return;
                }

                match n.init.as_deref() {
                    Some(Expr::Object(init)) => {
                        for prop in &init.props {
                            let prop = match prop {
                                PropOrSpread::Spread(_) => continue,
                                PropOrSpread::Prop(prop) => prop,
                            };

                            match &**prop {
                                Prop::KeyValue(p) => {
                                    let value = match &*p.value {
                                        Expr::Lit(..) => p.value.clone(),
                                        _ => continue,
                                    };

                                    match &p.key {
                                        PropName::Str(s) => {
                                            tracing::trace!(
                                                "hoist_props: Storing a variable (`{}`) to inline \
                                                 properties",
                                                name.id
                                            );
                                            self.simple_props
                                                .insert((name.to_id(), s.value.clone()), value);
                                        }
                                        PropName::Ident(i) => {
                                            tracing::trace!(
                                                "hoist_props: Storing a variable(`{}`) to inline \
                                                 properties",
                                                name.id
                                            );
                                            self.simple_props
                                                .insert((name.to_id(), i.sym.clone()), value);
                                        }
                                        _ => {}
                                    }
                                }
                                _ => {}
                            }
                        }
                    }
                    _ => {}
                }

                // If the variable is used multiple time, just ignore it.
                if !self
                    .data
                    .as_ref()
                    .and_then(|data| {
                        data.vars.get(&name.to_id()).map(|v| {
                            v.ref_count == 1
                                && v.has_property_access
                                && v.is_fn_local
                                && !v.used_in_loop
                                && !v.used_in_cond
                        })
                    })
                    .unwrap_or(false)
                {
                    return;
                }

                let init = match n.init.take() {
                    Some(v) => v,
                    None => return,
                };

                match &*init {
                    Expr::This(..) => {
                        n.init = Some(init);
                        return;
                    }

                    _ => {}
                }

                match self.vars_for_prop_hoisting.insert(name.to_id(), init) {
                    Some(prev) => {
                        panic!(
                            "two variable with same name and same span hygiene is \
                             invalid\nPrevious value: {:?}",
                            prev
                        );
                    }
                    None => {
                        tracing::debug!(
                            "hoist_props: Stored {}{:?} to inline property access",
                            name.id.sym,
                            name.id.span.ctxt
                        );
                    }
                }
            }
            _ => {}
        }
    }

    /// Replace property accesses to known values.
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
                        tracing::debug!("hoist_props: Inlined a property");
                        return;
                    }

                    if member.computed {
                        return;
                    }

                    match &*member.prop {
                        Expr::Ident(prop) => {
                            if let Some(value) =
                                self.simple_props.get(&(obj.to_id(), prop.sym.clone()))
                            {
                                tracing::debug!("hoist_props: Inlining `{}.{}`", obj.sym, prop.sym);
                                self.changed = true;
                                *e = *value.clone()
                            }
                        }
                        _ => {}
                    }
                }
                _ => {}
            },
        }
    }
}
