use swc_ecma_visit::{noop_visit_mut_type, VisitMut};

pub(super) fn block_scoped_vars() -> impl VisitMut {
    BlockScopedVars::default()
}

#[derive(Default)]
struct BlockScopedVars {}

impl VisitMut for BlockScopedVars {
    noop_visit_mut_type!();
}
