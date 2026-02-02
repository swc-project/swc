use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

mod optional_catch_binding;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2019Options {
    pub optional_catch_binding: bool,
}

impl Es2019Options {
    /// Returns true if any transform is enabled.
    pub fn is_enabled(&self) -> bool {
        self.optional_catch_binding
    }
}

pub(crate) fn hook(options: Es2019Options) -> impl VisitMutHook<TraverseCtx> {
    if options.optional_catch_binding {
        Some(self::optional_catch_binding::hook())
    } else {
        None
    }
}
