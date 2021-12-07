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
    n.visit_with(&mut checker);
    checker.should_handle()
}

pub trait Parallel {
    /// Used to create visitor.
    fn create(&self) -> Self;

    /// This can be called in anytime.
    fn merge(&mut self, other: Self);

    /// Invoked after visiting all [Stmt]s, possibly in parallel.
    fn after_stmts(&mut self, _stmts: &mut Vec<Stmt>) {}

    /// Invoked after visiting all [ModuleItem]s, possibly in parallel.
    fn after_module_items(&mut self, _stmts: &mut Vec<ModuleItem>) {}
}

pub trait ParExplode: Parallel {
    /// Invoked after visiting each statements.
    ///
    /// Implementor should not delete/prepend to `stmts`.
    fn after_one_stmt(&mut self, stmts: &mut Vec<Stmt>);

    /// Invoked after visiting each statements.
    ///
    /// Implementor should not delete/prepend to `stmts`.
    fn after_one_module_item(&mut self, stmts: &mut Vec<ModuleItem>);
}
