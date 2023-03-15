use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn decorator_2022_03() -> impl VisitMut + Fold {
    as_folder(Decorator202203::default())
}

#[derive(Debug, Default)]
struct Decorator202203 {
    stmts_for_constuctor: Vec<Stmt>,
}

impl VisitMut for Decorator202203 {
    noop_visit_mut_type!();

    fn visit_mut_class_member(&mut self, n: &mut ClassMember) {
        n.visit_mut_children_with(self);

        match n {
            ClassMember::PrivateProp(p) => {}

            ClassMember::PrivateMethod(m) => {}

            _ => {}
        }
    }
}
