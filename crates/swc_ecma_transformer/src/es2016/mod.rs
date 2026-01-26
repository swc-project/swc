use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

mod exponentiation_operator;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2016Options {
    pub exponentiation_operator: bool,
}

impl Es2016Options {
    /// Returns true if any transform is enabled.
    pub fn is_enabled(&self) -> bool {
        self.exponentiation_operator
    }
}

pub fn hook(options: Es2016Options) -> impl VisitMutHook<TraverseCtx> {
    if options.exponentiation_operator {
        Some(self::exponentiation_operator::hook())
    } else {
        None
    }
}
