use std::iter::repeat_with;

use swc_common::{util::take::Take, BytePos, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    find_pat_ids, is_valid_prop_ident,
    number::{parse_canonical_index, ToJsString},
    private_ident,
};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

use super::Optimizer;
use crate::compress::optimize::is_left_access_to_arguments;

/// Matches Terser's `index < argnames.length + 5` condition.
const MAX_INJECTED_PARAMS: usize = 5;

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
            mutation_positions: find_arguments_mutations(&f.body),
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
    mutation_positions: Vec<BytePos>,
}

impl<'a> ArgReplacer<'a> {
    /// Materializes only a bounded number of missing parameters.
    fn inject_params_if_within_limit(&mut self, idx: usize) {
        if idx < self.params.len() || self.keep_fargs {
            return;
        }
        let Some(required_len) = idx.checked_add(1) else {
            return;
        };
        let new_args = required_len - self.params.len();

        if new_args > MAX_INJECTED_PARAMS {
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

    /// Returns whether a loop contains a mutation of `arguments`.
    fn loop_contains_arguments_mutation<N>(&self, n: &N) -> bool
    where
        N: Spanned,
    {
        let span = n.span();
        let first_in_span = self
            .mutation_positions
            .partition_point(|position| *position < span.lo);

        matches!(
            self.mutation_positions.get(first_in_span),
            Some(position) if *position < span.hi
        )
    }

    /// Disables replacements before visiting a loop which mutates `arguments`.
    ///
    /// A loop can read an `arguments` property before mutating it. Replacing
    /// the read with a parameter would then use the stale parameter value
    /// on a later iteration, so the whole loop must be preserved before its
    /// first visit.
    fn visit_mut_loop<N>(&mut self, n: &mut N)
    where
        N: Spanned + VisitMutWith<Self>,
    {
        if self.prevent {
            return;
        }

        if self.loop_contains_arguments_mutation(n) {
            self.prevent = true;
        }

        n.visit_mut_children_with(self);
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

    fn visit_mut_do_while_stmt(&mut self, n: &mut DoWhileStmt) {
        self.visit_mut_loop(n);
    }

    fn visit_mut_for_in_stmt(&mut self, n: &mut ForInStmt) {
        self.visit_mut_loop(n);
    }

    fn visit_mut_for_of_stmt(&mut self, n: &mut ForOfStmt) {
        self.visit_mut_loop(n);
    }

    fn visit_mut_for_stmt(&mut self, n: &mut ForStmt) {
        self.visit_mut_loop(n);
    }

    fn visit_mut_unary_expr(&mut self, n: &mut UnaryExpr) {
        if n.op != op!("delete") || !is_access_to_arguments(&n.arg) {
            n.visit_mut_children_with(self);
            return;
        }

        // Visit the member expression's children without passing the deleted
        // access through `visit_mut_expr`, which would replace it with a
        // parameter binding.
        n.arg.visit_mut_children_with(self);
        self.prevent = true;
    }

    fn visit_mut_update_expr(&mut self, n: &mut UpdateExpr) {
        if !is_access_to_arguments(&n.arg) {
            n.visit_mut_children_with(self);
            return;
        }

        // An update mutates the arguments object, so preserve its direct
        // member access and stop substituting subsequent arguments accesses.
        n.arg.visit_mut_children_with(self);
        self.prevent = true;
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        if self.prevent {
            return;
        }

        n.visit_mut_children_with(self);

        let Some(idx) = argument_access_index(n) else {
            return;
        };

        self.inject_params_if_within_limit(idx);

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

    fn visit_mut_while_stmt(&mut self, n: &mut WhileStmt) {
        self.visit_mut_loop(n);
    }
}

/// Finds the source positions of mutations of the current function's
/// `arguments` object.
#[derive(Default)]
struct ArgumentsMutationFinder {
    positions: Vec<BytePos>,
}

impl Visit for ArgumentsMutationFinder {
    noop_visit_type!(fail);

    /// Nested functions own a distinct `arguments` object.
    fn visit_function(&mut self, _: &Function) {}

    fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}

    fn visit_assign_expr(&mut self, n: &AssignExpr) {
        if is_left_access_to_arguments(&n.left) {
            self.positions.push(n.span.lo);
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_unary_expr(&mut self, n: &UnaryExpr) {
        if n.op == op!("delete") && is_access_to_arguments(&n.arg) {
            self.positions.push(n.span.lo);
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_update_expr(&mut self, n: &UpdateExpr) {
        if is_access_to_arguments(&n.arg) {
            self.positions.push(n.span.lo);
            return;
        }

        n.visit_children_with(self);
    }
}

fn find_arguments_mutations(n: &impl VisitWith<ArgumentsMutationFinder>) -> Vec<BytePos> {
    let mut finder = ArgumentsMutationFinder::default();
    n.visit_with(&mut finder);
    finder.positions.sort_unstable();
    finder.positions
}

/// Returns true if `expr` directly accesses a property of `arguments`.
fn is_access_to_arguments(expr: &Expr) -> bool {
    let Expr::Member(MemberExpr { obj, .. }) = expr else {
        return false;
    };

    matches!(&**obj, Expr::Ident(Ident { sym, .. }) if &**sym == "arguments")
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
