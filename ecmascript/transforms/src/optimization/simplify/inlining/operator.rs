use fxhash::FxHashSet;
use swc_ecma_utils::Id;

/// Analyzed information
pub(super) struct Analysis {
    pub no_inline: FxHashSet<Id>,
}

pub(super) struct Operator {
    pub data: Analysis,
}
