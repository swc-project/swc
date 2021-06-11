use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{ext::MapWithMut, perf::Check};
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::prepend;
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Node, Visit, VisitMut, VisitMutWith,
};

pub fn operators() -> impl Fold {
    as_folder(Operators::default())
}

#[derive(Debug, Default)]
struct Operators {
    vars: Vec<VarDeclarator>,
}

#[fast_path(OperatorFinder)]
impl VisitMut for Operators {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        n.visit_mut_children_with(self);
    }

    fn visit_mut_module(&mut self, n: &mut Module) {
        n.visit_mut_children_with(self);

        if !self.vars.is_empty() {
            prepend(
                &mut n.body,
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: self.vars.take(),
                }))),
            )
        }
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        n.visit_mut_children_with(self);

        if !self.vars.is_empty() {
            prepend(
                &mut n.body,
                Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: self.vars.take(),
                })),
            )
        }
    }
}

#[derive(Default)]
struct OperatorFinder {
    found: bool,
}

impl Visit for OperatorFinder {
    noop_visit_type!();

    fn visit_assign_op(&mut self, n: &AssignOp, _: &dyn Node) {
        self.found |= *n == op!("||=");
    }
}

impl Check for OperatorFinder {
    fn should_handle(&self) -> bool {
        self.found
    }
}
