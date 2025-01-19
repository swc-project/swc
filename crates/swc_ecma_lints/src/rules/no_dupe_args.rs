use std::collections::hash_map::Entry;

use swc_common::{collections::AHashMap, errors::HANDLER};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    for_each_binding_ident,
    parallel::{cpu_count, Parallel, ParallelExt},
};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::rule::{visitor_rule, Rule};

pub fn no_dupe_args() -> Box<dyn Rule> {
    visitor_rule(NoDupeArgs)
}

#[derive(Debug, Default)]
struct NoDupeArgs;

impl Parallel for NoDupeArgs {
    fn create(&self) -> Self {
        Self
    }

    fn merge(&mut self, _: Self) {}
}

#[cold]
fn error(first: &BindingIdent, second: &BindingIdent) {
    HANDLER.with(|handler| {
        handler
            .struct_span_err(
                second.span,
                &format!(
                    "the name `{}` is bound more than once in this parameter list",
                    first.sym
                ),
            )
            .span_label(first.span, "previous definition here".to_string())
            .span_label(second.span, "used as parameter more than once".to_string())
            .emit();
    });
}

/// This has time complexity of O(n^2), but it's fine as the number of paramters
/// is usually small.
macro_rules! check {
    ($node:expr) => {{
        // This vector allocates only if there are duplicate parameters.
        // This is used to handle the case where the same parameter is used 3 or more
        // times.
        let mut done = Vec::new();

        let mut hash_mode = false;

        let mut i1 = 0;
        for_each_binding_ident($node, |id1| {
            i1 += 1;

            if !hash_mode {
                let mut i2 = 0;
                for_each_binding_ident($node, |id2| {
                    i2 += 1;

                    if hash_mode {
                        return;
                    } else if i2 >= 100 {
                        // While iterating for the first `id1`, we detect that there are more than
                        // 100 identifiers. We switch to hash mode.
                        hash_mode = true;
                    }

                    if i1 >= i2 || done.contains(&i1) {
                        return;
                    }

                    if id1.ctxt == id2.ctxt && id1.sym == id2.sym {
                        done.push(i1);

                        error(id1, id2);
                    }
                });
            }
        });

        if hash_mode {
            let mut map = AHashMap::default();

            for_each_binding_ident($node, |id| {
                //
                match map.entry((id.sym.clone(), id.ctxt)) {
                    Entry::Occupied(v) => {
                        error(v.get(), id);
                    }

                    Entry::Vacant(v) => {
                        v.insert(id.clone());
                    }
                }
            });
        }
    }};
}

impl Visit for NoDupeArgs {
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, f: &ArrowExpr) {
        check!(&f.params);

        f.visit_children_with(self);
    }

    fn visit_class_members(&mut self, members: &[ClassMember]) {
        self.maybe_par(cpu_count(), members, |v, member| {
            member.visit_with(v);
        });
    }

    fn visit_constructor(&mut self, f: &Constructor) {
        check!(&f.params);

        f.visit_children_with(self);
    }

    fn visit_expr_or_spreads(&mut self, n: &[ExprOrSpread]) {
        self.maybe_par(cpu_count(), n, |v, n| {
            n.visit_with(v);
        });
    }

    fn visit_exprs(&mut self, exprs: &[Box<Expr>]) {
        self.maybe_par(cpu_count(), exprs, |v, expr| {
            expr.visit_with(v);
        });
    }

    fn visit_function(&mut self, f: &Function) {
        check!(&f.params);

        f.visit_children_with(self);
    }

    fn visit_module_items(&mut self, items: &[ModuleItem]) {
        self.maybe_par(cpu_count(), items, |v, item| {
            item.visit_with(v);
        });
    }

    fn visit_opt_vec_expr_or_spreads(&mut self, n: &[Option<ExprOrSpread>]) {
        self.maybe_par(cpu_count(), n, |v, n| {
            n.visit_with(v);
        });
    }

    fn visit_prop_or_spreads(&mut self, n: &[PropOrSpread]) {
        self.maybe_par(cpu_count(), n, |v, n| {
            n.visit_with(v);
        });
    }

    fn visit_stmts(&mut self, stmts: &[Stmt]) {
        self.maybe_par(cpu_count(), stmts, |v, stmt| {
            stmt.visit_with(v);
        });
    }
}
