use swc_ecma_hooks::VisitMutHook;

use crate::{
    hook_utils::{HookBuilder, NoopHook},
    TraverseCtx,
};

mod edge_default_param;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct BugfixOptions {
    /// Enable edge default param transformation
    ///
    /// Converts destructured parameters with default values to non-shorthand
    /// syntax. This fixes the only arguments-related bug in ES
    /// Modules-supporting browsers (Edge 16 & 17).
    pub edge_default_param: bool,
}

impl BugfixOptions {
    /// Returns true if any transform is enabled.
    pub fn is_enabled(&self) -> bool {
        self.edge_default_param
    }
}

pub fn hook(options: BugfixOptions) -> impl VisitMutHook<TraverseCtx> {
    let hook = HookBuilder::new(NoopHook);

    // Edge default param: ({ a = 1 }) => a -> ({ a: a = 1 }) => a
    let hook = hook.chain(if options.edge_default_param {
        Some(self::edge_default_param::hook())
    } else {
        None
    });

    hook.build()
}
