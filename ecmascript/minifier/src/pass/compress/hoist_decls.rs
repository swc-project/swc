use swc_ecma_ast::*;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

pub(super) fn decl_hoister() -> Hoister {
    Hoister {}
}

pub(super) struct Hoister {}

impl Hoister {}

impl VisitMut for Hoister {
    noop_visit_mut_type!();

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        stmts.visit_mut_children_with(self);

        // TODO: Hoist vars, ignoring side-effect-free items like fn decl.
    }

    fn visit_mut_module_items(&mut self, stmts: &mut Vec<ModuleItem>) {
        // TODO: Hoist vars, ignoring side-effect-free items like fn decl.

        // TODO: Merge vars
        stmts.visit_mut_children_with(self);
    }
}
