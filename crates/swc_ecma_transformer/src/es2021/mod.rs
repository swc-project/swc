mod logical_assignment_operators;

use swc_ecma_hooks::VisitMutHook;

use crate::{
    hook_utils::{HookBuilder, NoopHook},
    TraverseCtx,
};

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2021Options {
    pub logical_assignment_operators: bool,
}

impl Es2021Options {
    /// Returns true if any transform is enabled.
    pub fn is_enabled(&self) -> bool {
        self.logical_assignment_operators
    }
}

pub fn hook(options: Es2021Options) -> impl VisitMutHook<TraverseCtx> {
    let hook = HookBuilder::new(NoopHook);

    let hook = hook.chain(if options.logical_assignment_operators {
        Some(self::logical_assignment_operators::hook())
    } else {
        None
    });

    hook.build()
}
