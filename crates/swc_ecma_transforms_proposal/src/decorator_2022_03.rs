use std::iter::once;

use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{prepend_stmt, private_ident, ExprFactory};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn decorator_2022_03() -> impl VisitMut + Fold {
    as_folder(Decorator202203::default())
}

#[derive(Debug, Default)]
struct Decorator202203 {
    /// Variables without initializer.
    extra_vars: Vec<VarDeclarator>,
    /// Injected into static blocks.
    extra_stmts: Vec<Stmt>,
}

impl VisitMut for Decorator202203 {
    noop_visit_mut_type!();

    fn visit_mut_class(&mut self, n: &mut Class) {
        let old_stmts = self.extra_stmts.take();

        n.visit_mut_children_with(self);

        if !self.extra_stmts.is_empty() {
            n.body.insert(
                0,
                ClassMember::StaticBlock(StaticBlock {
                    span: DUMMY_SP,
                    body: BlockStmt {
                        span: DUMMY_SP,
                        stmts: self.extra_stmts.take(),
                    },
                }),
            );
        }

        self.extra_stmts = old_stmts;
    }

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
                    name: Pat::Ident(init.clone().into()),
                    init: None,
                    definite: false,
                });

                p.value = Some(Box::new(Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: init.as_callee(),
                    args: once(ThisExpr { span: DUMMY_SP }.as_arg())
                        .chain(p.value.take().map(|v| v.as_arg()))
                        .collect(),
                    type_args: Default::default(),
                })));
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
