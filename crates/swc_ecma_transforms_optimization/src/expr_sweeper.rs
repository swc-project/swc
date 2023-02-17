use swc_ecma_visit::{noop_visit_mut_type, VisitMut};

/// DCE, but for unused expressions.
pub fn expr_sweeper() -> impl VisitMut {
    ExprSweeper::default()
}

#[derive(Debug, Default)]
struct ExprSweeper {}

impl VisitMut for ExprSweeper {
    noop_visit_mut_type!();
}
