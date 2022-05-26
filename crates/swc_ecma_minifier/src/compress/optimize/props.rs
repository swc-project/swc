use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::{contains_this_expr, prop_name_eq, ExprExt};

use super::Optimizer;
use crate::{mode::Mode, util::deeply_contains_this_expr};

/// Methods related to the option `hoist_props`.
impl<M> Optimizer<'_, M>
where
    M: Mode,
{
    /// Store values of properties so we can replace property accesses with the
    /// values.
    pub(super) fn store_var_for_prop_hoisting(&mut self, n: &mut VarDeclarator) {
        if !self.options.hoist_props {
            return;
        }
        if self.ctx.is_exported {
            return;
        }

        if let Pat::Ident(name) = &mut n.name {
            if self.options.top_retain.contains(&name.id.sym) {
                return;
            }

            // If a variable is initialized multiple time, we currently don't do anything
            // smart.
            if !self
                .data
                .vars
                .get(&name.to_id())
                .map(|v| {
                    !v.mutated
                        && v.mutation_by_call_count == 0
                        && !v.used_as_arg
                        && !v.used_in_cond
                        && !v.reassigned()
                        && !v.is_infected()
                })
                .unwrap_or(false)
            {
                log_abort!("[x] bad usage");
                return;
            }

            // We should abort if unknown property is used.
            let mut unknown_used_props = self
                .data
                .vars
                .get(&name.to_id())
                .map(|v| v.accessed_props.clone())
                .unwrap_or_default();

            if let Some(Expr::Object(init)) = n.init.as_deref() {
                for prop in &init.props {
                    let prop = match prop {
                        PropOrSpread::Spread(_) => continue,
                        PropOrSpread::Prop(prop) => prop,
                    };

                    if let Prop::KeyValue(p) = &**prop {
                        match &*p.value {
                            Expr::Lit(..) | Expr::Arrow(..) => {}
                            Expr::Fn(f) => {
                                if contains_this_expr(&f.function.body) {
                                    continue;
                                }
                            }
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
                }
            }

            if !unknown_used_props.is_empty() {
                log_abort!("[x] unknown used props: {:?}", unknown_used_props);
                return;
            }

            if let Some(init) = n.init.as_deref() {
                self.mode.store(name.to_id(), init);
            }

            if let Some(Expr::Object(init)) = n.init.as_deref_mut() {
                for prop in &mut init.props {
                    let prop = match prop {
                        PropOrSpread::Spread(_) => continue,
                        PropOrSpread::Prop(prop) => prop,
                    };

                    if let Prop::KeyValue(p) = &mut **prop {
                        self.vars.inline_with_multi_replacer(&mut p.value);

                        let value = match &*p.value {
                            Expr::Lit(..) => p.value.clone(),
                            Expr::Fn(..) | Expr::Arrow(..) => {
                                if self.options.hoist_props {
                                    p.value.clone()
                                } else {
                                    continue;
                                }
                            }
                            _ => continue,
                        };

                        match &p.key {
                            PropName::Str(s) => {
                                trace_op!(
                                    "hoist_props: Storing a variable (`{}`) to inline properties",
                                    name.id
                                );
                                self.simple_props
                                    .insert((name.to_id(), s.value.clone()), value);
                            }
                            PropName::Ident(i) => {
                                trace_op!(
                                    "hoist_props: Storing a variable(`{}`) to inline properties",
                                    name.id
                                );
                                self.simple_props
                                    .insert((name.to_id(), i.sym.clone()), value);
                            }
                            _ => {}
                        }
                    }
                }
            }

            // If the variable is used multiple time, just ignore it.
            if !self
                .data
                .vars
                .get(&name.to_id())
                .map(|v| {
                    v.ref_count == 1
                        && v.has_property_access
                        && !v.mutated
                        && v.mutation_by_call_count == 0
                        && v.is_fn_local
                        && !v.executed_multiple_time
                        && !v.used_as_arg
                        && !v.used_in_cond
                })
                .unwrap_or(false)
            {
                return;
            }

            let init = match n.init.take() {
                Some(v) => v,
                None => return,
            };

            if let Expr::This(..) = &*init {
                n.init = Some(init);
                return;
            }

            match self.vars_for_prop_hoisting.insert(name.to_id(), init) {
                Some(prev) => {
                    panic!(
                        "two variable with same name and same span hygiene is invalid\nPrevious \
                         value: {:?}",
                        prev
                    );
                }
                None => {
                    trace_op!(
                        "hoist_props: Stored {}{:?} to inline property access",
                        name.id.sym,
                        name.id.span.ctxt
                    );
                }
            }
        }
    }

    /// Replace property accesses to known values.
    pub(super) fn replace_props(&mut self, e: &mut Expr) {
        let member = match e {
            Expr::Member(m) => m,
            _ => return,
        };
        if let Expr::Ident(obj) = &*member.obj {
            if let MemberProp::Ident(prop) = &member.prop {
                if let Some(mut value) = self
                    .simple_props
                    .get(&(obj.to_id(), prop.sym.clone()))
                    .cloned()
                {
                    if let Expr::Fn(f) = &mut *value {
                        f.function.span = DUMMY_SP;
                    }

                    report_change!("hoist_props: Inlining `{}.{}`", obj.sym, prop.sym);
                    self.changed = true;
                    *e = *value;
                    return;
                }
            }

            if let Some(value) = self.vars_for_prop_hoisting.remove(&obj.to_id()) {
                member.obj = value;
                self.changed = true;
                report_change!("hoist_props: Inlined a property");
            }
        }
    }
}

impl<M> Optimizer<'_, M>
where
    M: Mode,
{
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
}
