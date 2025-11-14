use swc_ecma_hooks::VisitMutHook;

use crate::context::TraverseCtx;

mod options;

pub use options::ProposalOptions;

/// Transform for ECMAScript proposal features.
///
/// This module contains transforms for features that are in the proposal stage
/// but not yet part of the official ECMAScript standard.
pub struct Proposals {
    #[expect(unused)]
    options: ProposalOptions,
}

impl Proposals {
    pub fn new(options: ProposalOptions) -> Self {
        Self { options }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for Proposals {
    // Currently no proposals are implemented.
    // When proposal transforms are added, they will be invoked here.
}
