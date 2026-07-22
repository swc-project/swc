use std::iter::repeat_with;

use swc_common::{util::take::Take, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    find_pat_ids, is_valid_prop_ident,
    number::{parse_canonical_index, ToJsString},
    private_ident,
};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use super::Optimizer;
use crate::{compress::optimize::is_left_access_to_arguments, util::size::SizeWithCtxt};

/// Methods related to the option `arguments`.
impl Optimizer<'_> {
    ///
    /// - `arguments['foo']` => `arguments.foo`
    pub(super) fn optimize_str_access_to_arguments(&mut self, e: &mut Expr) {
        if !self.options.arguments {
            return;
        }

        match e {
            Expr::Member(MemberExpr { prop, .. }) => {
                if let MemberProp::Computed(c) = prop {
                    if let Expr::Lit(Lit::Str(s)) = &mut *c.expr {
                        let Some(value) = s.value.as_str() else {
                            return;
                        };

                        if !value.starts_with(|c: char| c.is_ascii_alphabetic()) {
                            return;
                        }

                        if !is_valid_prop_ident(value) {
                            return;
                        }

                        self.changed = true;
                        report_change!("arguments: Optimizing computed access to arguments");

                        let name = s.take().value;
                        *prop = MemberProp::Ident(IdentName {
                            span: s.span,
                            // SAFETY: s.value is guaranteed to be valid UTF-8 sequence from above.
                            sym: name.try_into_atom().unwrap(),
                        })
                    }
                }
            }

            Expr::SuperProp(SuperPropExpr { prop, .. }) => {
                if let SuperProp::Computed(c) = prop {
                    if let Expr::Lit(Lit::Str(s)) = &mut *c.expr {
                        let Some(value) = s.value.as_str() else {
                            return;
                        };
                        if !value.starts_with(|c: char| c.is_ascii_alphabetic()) {
                            return;
                        }

                        if !is_valid_prop_ident(value) {
                            return;
                        }

                        self.changed = true;
                        report_change!("arguments: Optimizing computed access to arguments");

                        let name = s.take().value;
                        *prop = SuperProp::Ident(IdentName {
                            span: s.span,
                            // SAFETY: s.value is guaranteed to be valid UTF-8 sequence from above.
                            sym: name.try_into_atom().unwrap(),
                        })
                    }
                }
            }

            _ => (),
        };
    }

    pub(super) fn optimize_usage_of_arguments(&mut self, f: &mut Function) {
        if !self.options.arguments {
            return;
        }

        if f.params.iter().any(|param| match &param.pat {
            Pat::Ident(BindingIdent {
                id: Ident { sym, .. },
                ..
            }) if &**sym == "arguments" => true,
            Pat::Ident(i) => self
                .data
                .vars
                .get(&i.id.to_id())
                .map(|v| v.declared_count >= 2)
                .unwrap_or(false),
            _ => true,
        }) {
            return;
        }

        {
            // If a function has a variable named `arguments`, we abort.
            let data: Vec<Id> = find_pat_ids(&f.body);
            if data.iter().any(|id| {
                if id.0 == "arguments" {
                    return true;
                }
                false
            }) {
                return;
            }
        }

        let mut v = ArgReplacer {
            params: &mut f.params,
            changed: false,
            keep_fargs: self.options.keep_fargs,
            prevent: false,
            unresolved_ctxt: self.ctx.expr_ctx.unresolved_ctxt,
        };

        // Visit the body twice to keep parameter injection local to each access.
        f.body.visit_mut_children_with(&mut v);
        f.body.visit_mut_children_with(&mut v);

        self.changed |= v.changed;
    }
}

struct ArgReplacer<'a> {
    params: &'a mut Vec<Param>,
    changed: bool,
    keep_fargs: bool,
    prevent: bool,
    unresolved_ctxt: SyntaxContext,
}

impl ArgReplacer<'_> {
    /// Materializes parameters only when replacing this access does not grow
    /// the estimated output size.
    fn inject_params_if_profitable(&mut self, idx: usize, max_growth: usize) {
        if idx < self.params.len() || self.keep_fargs {
            return;
        }
        let Some(required_len) = idx.checked_add(1) else {
            return;
        };
        let new_args = required_len - self.params.len();
        let Some(growth) = injected_params_size(self.params.len(), new_args) else {
            return;
        };

        if growth > max_growth {
            return;
        }

        self.changed = true;
        report_change!("arguments: Injecting {} parameters", new_args);
        let mut start = self.params.len();
        self.params.extend(
            repeat_with(|| {
                let p = Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: private_ident!(format!("argument_{}", start)).into(),
                };
                start += 1;
                p
            })
            .take(new_args),
        )
    }
}

impl VisitMut for ArgReplacer<'_> {
    noop_visit_mut_type!(fail);

    /// Noop.
    fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {}

    fn visit_mut_assign_expr(&mut self, n: &mut AssignExpr) {
        n.visit_mut_children_with(self);

        if is_left_access_to_arguments(&n.left) {
            self.prevent = true;
        }
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        if self.prevent {
            return;
        }

        n.visit_mut_children_with(self);

        let Some(idx) = argument_access_index(n) else {
            return;
        };
        let max_growth = n.size(self.unresolved_ctxt).saturating_sub(1);

        self.inject_params_if_profitable(idx, max_growth);

        if let Some(param) = self.params.get(idx) {
            if let Pat::Ident(i) = &param.pat {
                self.changed = true;
                report_change!("arguments: Replacing access to arguments to normal reference");
                *n = i.id.clone().into();
            }
        }
    }

    /// Noop.
    fn visit_mut_function(&mut self, _: &mut Function) {}

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        if self.prevent {
            return;
        }

        n.obj.visit_mut_with(self);

        if let MemberProp::Computed(c) = &mut n.prop {
            c.visit_mut_with(self);
        }
    }

    fn visit_mut_super_prop_expr(&mut self, n: &mut SuperPropExpr) {
        if self.prevent {
            return;
        }

        if let SuperProp::Computed(c) = &mut n.prop {
            c.visit_mut_with(self);
        }
    }
}

/// Estimates the bytes added to a parameter list by single-byte generated
/// bindings and their separators.
fn injected_params_size(existing: usize, added: usize) -> Option<usize> {
    let separators = if existing == 0 {
        added.checked_sub(1)?
    } else {
        added
    };

    added.checked_add(separators)
}

/// Returns an `arguments` index only when the property key is already in its
/// canonical non-negative integer spelling.
fn argument_access_index(expr: &Expr) -> Option<usize> {
    let Expr::Member(MemberExpr {
        obj,
        prop: MemberProp::Computed(computed),
        ..
    }) = expr
    else {
        return None;
    };
    let Expr::Ident(Ident { sym, .. }) = &**obj else {
        return None;
    };

    if &**sym != "arguments" {
        return None;
    }

    match &*computed.expr {
        Expr::Lit(Lit::Str(Str { value, .. })) => parse_canonical_index(value.as_str()?),
        Expr::Lit(Lit::Num(Number { value, .. })) => parse_canonical_index(&value.to_js_string()),
        _ => None,
    }
}
