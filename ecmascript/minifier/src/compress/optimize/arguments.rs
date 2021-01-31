use std::iter::repeat_with;

use crate::analyzer::analyze;

use super::Optimizer;
use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::private_ident;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

/// Methods related to the option `arguments`.
impl Optimizer {
    ///
    /// - `arguments['foo']` => `arguments.foo`
    pub(super) fn optimize_str_access_to_arguments(&mut self, e: &mut Expr) {
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
                if !prop.value.starts_with(|c: char| c.is_ascii_alphabetic()) {
                    return;
                }

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

    pub(super) fn optimize_usage_of_arguments(&mut self, f: &mut Function) {
        if !self.options.arguments {
            return;
        }

        if f.params.iter().any(|param| match param.pat {
            Pat::Ident(Ident {
                sym: js_word!("arguments"),
                ..
            }) => true,
            Pat::Ident(..) => false,
            _ => true,
        }) {
            return;
        }

        {
            // If a function has a variable named `arguments`, we abort.
            let data = analyze(&f.body);
            for (id, var) in &data.vars {
                if id.0 == js_word!("arguments") && var.declared {
                    return;
                }
            }
        }

        let mut v = ArgReplacer {
            params: &mut f.params,
            changed: false,
        };

        f.body.visit_mut_children_with(&mut v);

        self.changed |= v.changed;
    }
}

struct ArgReplacer<'a> {
    params: &'a mut Vec<Param>,
    changed: bool,
}

impl ArgReplacer<'_> {
    fn ensure_param_idx(&mut self, idx: usize) {
        if idx < self.params.len() {
            return;
        }
        let new_args = idx + 1 - self.params.len();

        self.changed = true;
        log::trace!("arguments: Injecting {} parameters", new_args);
        let mut start = self.params.len();
        self.params.extend(
            repeat_with(|| {
                let p = Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: Pat::Ident(private_ident!(format!("argument_{}", start))),
                };
                start += 1;
                p
            })
            .take(new_args),
        )
    }
}

impl VisitMut for ArgReplacer<'_> {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        n.visit_mut_children_with(self);

        match n {
            Expr::Member(member) => {
                if member.computed {
                    match &member.obj {
                        ExprOrSuper::Expr(obj) => match &**obj {
                            Expr::Ident(Ident {
                                sym: js_word!("arguments"),
                                ..
                            }) => match &*member.prop {
                                Expr::Lit(Lit::Str(Str { value, .. })) => {
                                    let idx = value.parse::<usize>();
                                    let idx = match idx {
                                        Ok(v) => v,
                                        _ => return,
                                    };

                                    self.ensure_param_idx(idx);

                                    if let Some(param) = self.params.get(idx) {
                                        match &param.pat {
                                            Pat::Ident(i) => {
                                                self.changed = true;
                                                *n = Expr::Ident(i.clone());
                                                return;
                                            }
                                            _ => {}
                                        }
                                    }
                                }
                                Expr::Lit(Lit::Num(Number { value, .. })) => {
                                    if value.fract() != 0.0 {
                                        // We ignores non-integer values.
                                        return;
                                    }

                                    let idx = value.round() as i64 as usize;

                                    self.ensure_param_idx(idx);

                                    //
                                    if let Some(param) = self.params.get(idx) {
                                        match &param.pat {
                                            Pat::Ident(i) => {
                                                log::trace!(
                                                    "arguments: Replacing access to arguments to \
                                                     normal reference",
                                                );
                                                self.changed = true;
                                                *n = Expr::Ident(i.clone());
                                                return;
                                            }
                                            _ => {}
                                        }
                                    }
                                }
                                _ => {}
                            },
                            _ => {}
                        },
                        _ => {}
                    }
                }
            }
            _ => {}
        }
    }

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        n.obj.visit_mut_with(self);

        if n.computed {
            n.prop.visit_mut_with(self);
        }
    }

    /// Noop.
    fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {}

    /// Noop.
    fn visit_mut_function(&mut self, _: &mut Function) {}
}
