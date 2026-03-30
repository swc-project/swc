use std::collections::{HashMap, HashSet};

use swc_ecma_ast::{AssignTarget, Callee, Expr, MemberProp, Pat, Stmt};
use swc_ecma_visit::{Visit, VisitWith};

use crate::hir::HirFunction;

/// Infers mutable aliasing effects.
pub fn infer_mutation_aliasing_effects(hir: &mut HirFunction) {
    let Some(body) = hir.function.body.as_ref() else {
        return;
    };

    let mut aliases = HashMap::<String, String>::new();
    for stmt in &body.stmts {
        let Stmt::Decl(swc_ecma_ast::Decl::Var(var_decl)) = stmt else {
            continue;
        };
        for decl in &var_decl.decls {
            let Pat::Ident(binding) = &decl.name else {
                continue;
            };
            let Some(init) = &decl.init else {
                continue;
            };
            let Expr::Ident(rhs) = &**init else {
                continue;
            };
            aliases.insert(binding.id.sym.to_string(), rhs.sym.to_string());
        }
    }

    struct MutatedCollector<'a> {
        aliases: &'a HashMap<String, String>,
        mutated: HashSet<String>,
    }

    impl MutatedCollector<'_> {
        fn mark(&mut self, name: &str) {
            self.mutated.insert(name.to_string());
            let mut cursor = name;
            while let Some(base) = self.aliases.get(cursor) {
                if !self.mutated.insert(base.clone()) {
                    break;
                }
                cursor = base;
            }
        }
    }

    impl Visit for MutatedCollector<'_> {
        fn visit_assign_expr(&mut self, assign: &swc_ecma_ast::AssignExpr) {
            match &assign.left {
                AssignTarget::Simple(swc_ecma_ast::SimpleAssignTarget::Ident(binding)) => {
                    self.mark(binding.id.sym.as_ref());
                }
                AssignTarget::Simple(swc_ecma_ast::SimpleAssignTarget::Member(member)) => {
                    if let Expr::Ident(obj) = &*member.obj {
                        self.mark(obj.sym.as_ref());
                    }
                }
                _ => {}
            }
            assign.visit_children_with(self);
        }

        fn visit_update_expr(&mut self, update: &swc_ecma_ast::UpdateExpr) {
            match &*update.arg {
                Expr::Ident(ident) => self.mark(ident.sym.as_ref()),
                Expr::Member(member) => {
                    if let Expr::Ident(obj) = &*member.obj {
                        self.mark(obj.sym.as_ref());
                    }
                }
                _ => {}
            }
            update.visit_children_with(self);
        }

        fn visit_call_expr(&mut self, call: &swc_ecma_ast::CallExpr) {
            let Callee::Expr(callee) = &call.callee else {
                call.visit_children_with(self);
                return;
            };
            let Expr::Member(member) = &**callee else {
                call.visit_children_with(self);
                return;
            };
            let Some(method) = member_method_name(member) else {
                call.visit_children_with(self);
                return;
            };
            if !is_known_mutating_method(method) {
                call.visit_children_with(self);
                return;
            }
            if let Expr::Ident(obj) = &*member.obj {
                self.mark(obj.sym.as_ref());
            }
            call.visit_children_with(self);
        }
    }

    let mut collector = MutatedCollector {
        aliases: &aliases,
        mutated: hir.metadata.mutated_bindings.clone(),
    };
    body.visit_with(&mut collector);
    hir.metadata.mutated_bindings = collector.mutated;
}

fn member_method_name(member: &swc_ecma_ast::MemberExpr) -> Option<&str> {
    match &member.prop {
        MemberProp::Ident(ident) => Some(ident.sym.as_ref()),
        MemberProp::Computed(computed) => {
            let Expr::Lit(swc_ecma_ast::Lit::Str(str_lit)) = &*computed.expr else {
                return None;
            };
            str_lit.value.as_str()
        }
        MemberProp::PrivateName(_) => None,
    }
}

fn is_known_mutating_method(name: &str) -> bool {
    matches!(
        name,
        "push"
            | "pop"
            | "shift"
            | "unshift"
            | "splice"
            | "sort"
            | "reverse"
            | "copyWithin"
            | "fill"
            | "add"
            | "set"
            | "delete"
            | "clear"
    )
}
