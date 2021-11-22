use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitMut, VisitMutWith, VisitWith};

/// Do **not** implement this trait by yourself.
///
/// This is not a public API and may change in the future without major version
/// bump.
pub trait ProgramLike: Sized {
    fn apply_visit<V>(&self, v: &mut V)
    where
        V: Visit;

    fn apply_visit_mut<V>(&mut self, v: &mut V)
    where
        V: VisitMut;
}

impl ProgramLike for Module {
    fn apply_visit<V>(&self, v: &mut V)
    where
        V: Visit,
    {
        self.visit_with(&Invalid { span: DUMMY_SP }, v)
    }

    fn apply_visit_mut<V>(&mut self, v: &mut V)
    where
        V: VisitMut,
    {
        self.visit_mut_with(v);
    }
}

impl ProgramLike for Script {
    fn apply_visit<V>(&self, v: &mut V)
    where
        V: Visit,
    {
        self.visit_with(&Invalid { span: DUMMY_SP }, v)
    }

    fn apply_visit_mut<V>(&mut self, v: &mut V)
    where
        V: VisitMut,
    {
        self.visit_mut_with(v);
    }
}
