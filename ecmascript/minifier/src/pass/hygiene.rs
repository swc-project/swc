use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;

/// Create a hygiene optimizer.
///
/// Hygiene optimizer removes span hygiene without renaming if it's ok to do so.
pub fn hygiene_optimizer() -> impl VisitMut {
    Optimizer
}

struct Optimizer;

impl VisitMut for Optimizer {
    noop_visit_mut_type!();
}
