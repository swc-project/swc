use self::scope::Scope;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;

mod scope;

/// Create a hygiene optimizer.
///
/// Hygiene optimizer removes span hygiene without renaming if it's ok to do so.
pub fn hygiene_optimizer() -> impl 'static + VisitMut {
    Optimizer {
        scope: Scope::root(),
    }
}

struct Optimizer<'a> {
    scope: Scope<'a>,
}

impl VisitMut for Optimizer<'_> {
    noop_visit_mut_type!();
}
