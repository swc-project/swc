use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{prepend_stmt, private_ident};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn decorator_2022_03() -> impl VisitMut + Fold {
    as_folder(Decorator202203::default())
}

#[derive(Debug, Default)]
struct Decorator202203 {
    /// Variables without initializer.
    extra_vars: Vec<VarDeclarator>,
    extra_stmts: Vec<Stmt>,
}

impl VisitMut for Decorator202203 {
    noop_visit_mut_type!();

    fn visit_mut_class_member(&mut self, n: &mut ClassMember) {
        n.visit_mut_children_with(self);

        match n {
            ClassMember::PrivateProp(p) => {
                if p.decorators.is_empty() {
                    return;
                }

                let init = private_ident!(format!("_init_{}", p.key.id.sym));

                self.extra_vars.push(VarDeclarator {
                    span: p.span,
                    name: Pat::Ident(init.into()),
                    init: None,
                    definite: false,
                });
            }

            ClassMember::PrivateMethod(m) => {}

            _ => {}
        }
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        n.visit_mut_children_with(self);

        if !self.extra_vars.is_empty() {
            prepend_stmt(
                n,
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: self.extra_vars.take(),
                    declare: false,
                }
                .into(),
            );
        }
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        n.visit_mut_children_with(self);

        if !self.extra_vars.is_empty() {
            prepend_stmt(
                n,
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: self.extra_vars.take(),
                    declare: false,
                }
                .into(),
            );
        }
    }
}
