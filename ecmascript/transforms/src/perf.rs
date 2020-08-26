use swc_common::DUMMY_SP;
use swc_ecma_ast::Invalid;
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
