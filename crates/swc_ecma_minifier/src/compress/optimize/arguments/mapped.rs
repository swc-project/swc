use rustc_hash::FxHashSet;
use swc_ecma_ast::*;
use swc_ecma_utils::contains_arguments;
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

use super::{argument_access_index, argument_member_index, Optimizer};
use crate::program_data::ScopeData;

impl Optimizer<'_> {
    /// Rewrites both sides of a mapped arguments alias when its call is known.
    pub(in super::super) fn optimize_mapped_arguments_of_iife(&mut self, call: &mut CallExpr) {
        if !self.options.arguments || self.ctx.expr_ctx.in_strict {
            return;
        }
        let Callee::Expr(callee) = &mut call.callee else {
            return;
        };
        let Expr::Fn(FnExpr {
            ident: None,
            function,
        }) = &mut **callee
        else {
            return;
        };
        let Some(body) = &mut function.body else {
            return;
        };
        if !self.data.used_arguments(function.ctxt)
            || self.data.get_scope(function.ctxt).is_some_and(|scope| {
                scope.intersects(ScopeData::HAS_EVAL_CALL.union(ScopeData::HAS_WITH_STMT))
            })
            || body
                .stmts
                .iter()
                .take_while(|stmt| stmt.can_precede_directive())
                .any(Stmt::is_use_strict)
            || call.args.len() < function.params.len()
            || call.args.iter().any(|arg| arg.spread.is_some())
        {
            return;
        }

        let mut ids = FxHashSet::default();
        let mut params = Vec::with_capacity(function.params.len());
        for param in &function.params {
            let Pat::Ident(param) = &param.pat else {
                return;
            };
            if param.sym == "arguments" || !ids.insert((&param.sym, param.ctxt)) {
                return;
            }
            params.push(&param.id);
        }

        // Only supplied, simple, unique sloppy-mode formals have mapped slots.
        // A body `var` redeclaration reuses that binding and preserves the map;
        // duplicate formals and omitted actual arguments do not share this rule.
        let mut usage = MappedArgumentsUsage {
            param_count: params.len(),
            safe: true,
            used: false,
        };
        body.visit_with(&mut usage);
        if !usage.safe || !usage.used {
            return;
        }

        // Run after body optimization: the next compressor iteration must
        // analyze the new parameter assignments before propagating their values.
        body.visit_mut_with(&mut MappedArgumentsReplacer { params: &params });
        self.changed = true;
        report_change!("arguments: Replacing proven mapped reads and writes");
    }
}

/// Accepts only uses that cannot expose or disconnect the arguments mapping.
struct MappedArgumentsUsage {
    param_count: usize,
    safe: bool,
    used: bool,
}

impl Visit for MappedArgumentsUsage {
    noop_visit_type!(fail);

    fn visit_expr(&mut self, expr: &Expr) {
        if self.safe {
            expr.visit_children_with(self);
        }
    }

    fn visit_ident(&mut self, ident: &Ident) {
        // Canonical indexed accesses are handled without visiting their object.
        // Any other occurrence may shadow, replace, or expose the object.
        if ident.sym == "arguments" {
            self.safe = false;
        }
    }

    fn visit_member_expr(&mut self, member: &MemberExpr) {
        if argument_member_index(member).is_some_and(|index| index < self.param_count) {
            self.used = true;
        } else {
            member.visit_children_with(self);
        }
    }

    fn visit_unary_expr(&mut self, expr: &UnaryExpr) {
        if expr.op == op!("delete") && contains_arguments(&expr.arg) {
            self.safe = false;
            return;
        }
        expr.visit_children_with(self);
    }

    fn visit_callee(&mut self, callee: &Callee) {
        if let Callee::Expr(expr) = callee {
            if argument_access_index(expr).is_some() {
                // A member call binds `this` to the arguments object.
                self.safe = false;
                return;
            }
        }
        callee.visit_children_with(self);
    }

    fn visit_opt_call(&mut self, call: &OptCall) {
        if argument_access_index(&call.callee).is_some() {
            self.safe = false;
            return;
        }
        call.visit_children_with(self);
    }

    fn visit_tagged_tpl(&mut self, tpl: &TaggedTpl) {
        if argument_access_index(&tpl.tag).is_some() {
            self.safe = false;
            return;
        }
        tpl.visit_children_with(self);
    }

    fn visit_arrow_expr(&mut self, arrow: &ArrowExpr) {
        // Arrows capture this arguments object and may disconnect its mapping.
        if contains_arguments(arrow) {
            self.safe = false;
        }
    }

    fn visit_function(&mut self, _: &Function) {}

    fn visit_constructor(&mut self, _: &Constructor) {}
}

struct MappedArgumentsReplacer<'a> {
    params: &'a [&'a Ident],
}

impl VisitMut for MappedArgumentsReplacer<'_> {
    noop_visit_mut_type!(fail);

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        if let Some(index) = argument_access_index(expr) {
            *expr = self.params[index].clone().into();
            return;
        }
        expr.visit_mut_children_with(self);
    }

    fn visit_mut_simple_assign_target(&mut self, target: &mut SimpleAssignTarget) {
        if let SimpleAssignTarget::Member(member) = target {
            if let Some(index) = argument_member_index(member) {
                *target = self.params[index].clone().into();
                return;
            }
        }
        target.visit_mut_children_with(self);
    }

    fn visit_mut_arrow_expr(&mut self, _: &mut ArrowExpr) {}

    fn visit_mut_function(&mut self, _: &mut Function) {}

    fn visit_mut_constructor(&mut self, _: &mut Constructor) {}
}
