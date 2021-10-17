use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

pub trait Check: Visit + Default {
    fn should_handle(&self) -> bool;
}

pub fn should_work<C, T>(n: &T) -> bool
where
    C: Check,
    T: VisitWith<C>,
{
    let mut checker = C::default();
    n.visit_with(&Invalid { span: DUMMY_SP }, &mut checker);
    checker.should_handle()
}

pub trait Parallel {
    /// Used to create visitor.
    fn create(&self) -> Self;

    fn merge(&mut self, other: Self);

    /// Invoked after visiting [Stmt]s, possibly in parallel.
    ///
    /// Note: This is called before invoking `merge`.
    fn after_stmts(&mut self, _stmts: &mut Vec<Stmt>) {}

    /// Invoked after visiting [ModuleItem]s, possibly in parallel.
    ///
    /// Note: This is called before invoking `merge`.
    fn after_module_items(&mut self, _stmts: &mut Vec<ModuleItem>) {}
}
