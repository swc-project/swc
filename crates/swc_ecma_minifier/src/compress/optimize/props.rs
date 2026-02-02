use std::borrow::Borrow;

use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{contains_this_expr, private_ident, prop_name_eq, ExprExt};

use super::{unused::PropertyAccessOpts, BitCtx, Optimizer};
use crate::{program_data::VarUsageInfoFlags, util::deeply_contains_this_expr};

/// Methods related to the option `hoist_props`.
impl Optimizer<'_> {
    pub(super) fn hoist_props_of_var(
        &mut self,
        n: &mut VarDeclarator,
    ) -> Option<Vec<VarDeclarator>> {
        if !self.options.hoist_props {
            log_abort!("hoist_props: option is disabled");
            return None;
        }
        if self.ctx.bit_ctx.contains(BitCtx::IsExported) {
            log_abort!("hoist_props: Exported variable is not hoisted");
            return None;
        }
        if self.ctx.in_top_level() && !self.options.top_level() {
            log_abort!("hoist_props: Top-level variable is not hoisted");
            return None;
        }

        if let Pat::Ident(name) = &mut n.name {
            if name.id.ctxt == self.marks.top_level_ctxt
                && self.options.top_retain.contains(&name.id.sym)
            {
                log_abort!("hoist_props: Variable `{}` is retained", name.id.sym);
                return None;
            }

            if !self.may_add_ident() {
                return None;
            }

            // If a variable is initialized multiple time, we currently don't do anything
            // smart.
            let usage = self.data.vars.get(&name.to_id())?;
            if usage.mutated()
                || usage.flags.intersects(
                    VarUsageInfoFlags::USED_ABOVE_DECL
                        .union(VarUsageInfoFlags::USED_AS_REF)
                        .union(VarUsageInfoFlags::USED_AS_ARG)
                        .union(VarUsageInfoFlags::INDEXED_WITH_DYNAMIC_KEY)
                        .union(VarUsageInfoFlags::USED_RECURSIVELY),
                )
            {
                log_abort!("hoist_props: Variable `{}` is not a candidate", name.id);
                return None;
            }

            if usage.accessed_props.is_empty() {
                log_abort!(
                    "hoist_props: Variable `{}` is not accessed with known keys",
                    name.id
                );
                return None;
            }

            let accessed_props_count: u32 = usage.accessed_props.values().sum();
            if accessed_props_count < usage.ref_count {
                log_abort!(
                    "hoist_props: Variable `{}` is directly used without accessing its properties",
                    name.id
                );
                return None;
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
                        PropOrSpread::Spread(_) => return None,
                        PropOrSpread::Prop(prop) => prop,
                        #[cfg(swc_ast_unknown)]
                        _ => panic!("unable to access unknown nodes"),
                    };

                    match &**prop {
                        Prop::KeyValue(p) => {
                            if !is_expr_fine_for_hoist_props(&p.value) {
                                return None;
                            }

                            match &p.key {
                                PropName::Str(s) => {
                                    if let Some(v) = unknown_used_props.get_mut(&s.value) {
                                        *v = 0;
                                    }
                                }
                                PropName::Ident(i) => {
                                    if let Some(v) = unknown_used_props.get_mut(i.sym.borrow()) {
                                        *v = 0;
                                    }
                                }
                                _ => return None,
                            }
                        }
                        Prop::Shorthand(p) => {
                            if let Some(v) = unknown_used_props.get_mut(p.sym.borrow()) {
                                *v = 0;
                            }
                        }
                        _ => return None,
                    }
                }
            } else {
                if self.mode.should_be_very_correct() {
                    return None;
                }
            }

            if !unknown_used_props.iter().all(|(_, v)| *v == 0) {
                log_abort!("[x] unknown used props: {:?}", unknown_used_props);
                return None;
            }

            if let Some(init) = n.init.as_deref() {
                self.mode.store(name.to_id(), init);
            }

            let mut new_vars = Vec::new();

            let object = n.init.as_mut()?.as_mut_object()?;

            self.changed = true;
            report_change!(
                "hoist_props: Hoisting properties of a variable `{}`",
                name.id.sym
            );

            for prop in &mut object.props {
                let prop = match prop {
                    PropOrSpread::Spread(_) => unreachable!(),
                    PropOrSpread::Prop(prop) => prop,
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                };

                let value = match &mut **prop {
                    Prop::KeyValue(p) => p.value.take(),
                    Prop::Shorthand(p) => p.clone().into(),
                    _ => unreachable!(),
                };

                let (key, suffix) = match &**prop {
                    Prop::KeyValue(p) => match &p.key {
                        PropName::Ident(i) => (i.sym.clone().into(), i.sym.clone()),
                        PropName::Str(s) => (
                            s.value.clone(),
                            s.value
                                .code_points()
                                .map(|c| {
                                    c.to_char()
                                        .filter(|&c| Ident::is_valid_start(c))
                                        .unwrap_or('$')
                                })
                                .collect::<String>()
                                .into(),
                        ),
                        _ => unreachable!(),
                    },
                    Prop::Shorthand(p) => (p.sym.clone().into(), p.sym.clone()),
                    _ => unreachable!(),
                };

                let new_var_name = private_ident!(format!("{}_{}", name.id.sym, suffix));

                let new_var = VarDeclarator {
                    span: DUMMY_SP,
                    name: new_var_name.clone().into(),
                    init: Some(value),
                    definite: false,
                };

                self.vars
                    .hoisted_props
                    .insert((name.to_id(), key), new_var_name);

                new_vars.push(new_var);
            }
            // Mark the variable as dropped.
            n.name.take();

            return Some(new_vars);
        }

        None
    }

    pub(super) fn replace_props(&mut self, e: &mut Expr) {
        let member = match e {
            Expr::Member(m) => m,
            Expr::OptChain(m) => match &mut *m.base {
                OptChainBase::Member(m) => m,
                _ => return,
            },
            _ => return,
        };
        if let Expr::Ident(obj) = &*member.obj {
            let sym = match &member.prop {
                MemberProp::Ident(i) => i.sym.borrow(),
                MemberProp::Computed(e) => match &*e.expr {
                    Expr::Lit(Lit::Str(s)) => &s.value,
                    _ => return,
                },
                _ => return,
            };

            if let Some(value) = self
                .vars
                .hoisted_props
                .get(&(obj.to_id(), sym.clone()))
                .cloned()
            {
                report_change!("hoist_props: Inlining `{}.{:?}`", obj.sym, sym);
                self.changed = true;
                *e = value.into();
            }
        }
    }
}

fn is_expr_fine_for_hoist_props(value: &Expr) -> bool {
    match value {
        Expr::Ident(..) | Expr::Lit(..) | Expr::Arrow(..) | Expr::Class(..) => true,

        Expr::Fn(f) => !contains_this_expr(&f.function.body),

        Expr::Unary(u) => match u.op {
            op!("void") | op!("typeof") | op!("!") => is_expr_fine_for_hoist_props(&u.arg),
            _ => false,
        },

        Expr::Array(a) => a.elems.iter().all(|elem| match elem {
            Some(elem) => elem.spread.is_none() && is_expr_fine_for_hoist_props(&elem.expr),
            None => true,
        }),

        Expr::Object(o) => o.props.iter().all(|prop| match prop {
            PropOrSpread::Spread(_) => false,
            PropOrSpread::Prop(p) => match &**p {
                Prop::Shorthand(..) => true,
                Prop::KeyValue(p) => is_expr_fine_for_hoist_props(&p.value),
                _ => false,
            },
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }),

        _ => false,
    }
}

impl Optimizer<'_> {
    /// Converts `{ a: 1 }.a` into `1`.
    pub(super) fn handle_property_access(&mut self, e: &mut Expr) {
        if !self.options.props {
            return;
        }

        if self
            .ctx
            .bit_ctx
            .intersects(BitCtx::IsUpdateArg | BitCtx::IsCallee | BitCtx::IsExactLhsOfAssign)
        {
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
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                },
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            })
            .count()
            != 1;
        if duplicate_prop {
            return;
        }

        if obj.props.iter().any(|prop| match prop {
            PropOrSpread::Spread(s) => self.should_preserve_property_access(
                &s.expr,
                PropertyAccessOpts {
                    allow_getter: false,
                    only_ident: false,
                },
            ),
            PropOrSpread::Prop(p) => match &**p {
                Prop::Shorthand(..) => false,
                Prop::KeyValue(p) => {
                    p.key.is_computed()
                        || p.value.may_have_side_effects(self.ctx.expr_ctx)
                        || deeply_contains_this_expr(&p.value)
                }
                Prop::Assign(p) => {
                    p.value.may_have_side_effects(self.ctx.expr_ctx)
                        || deeply_contains_this_expr(&p.value)
                }
                Prop::Getter(p) => p.key.is_computed(),
                Prop::Setter(p) => p.key.is_computed(),
                Prop::Method(p) => p.key.is_computed(),
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            },
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }) {
            log_abort!("Property accesses should not be inlined to preserve side effects");
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
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                },
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            }
        }
    }
}
