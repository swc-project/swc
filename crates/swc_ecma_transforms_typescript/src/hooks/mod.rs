pub mod context;
mod hook_utils;
mod strip_import_export;
mod strip_type;
mod transform;
mod typescript_visitor;

pub use context::TypeScriptCtx;
use hook_utils::{HookBuilder, NoopHook};
use swc_ecma_hooks::VisitMutHook;
pub use typescript_visitor::TypeScriptVisitMutWithHook;

use crate::Config;

/// Create the main TypeScript hook that composes all sub-hooks
pub fn typescript_hook(config: Config) -> impl VisitMutHook<TypeScriptCtx> {
    let hook = HookBuilder::new(NoopHook);

    // Chain hooks in the correct order:
    // 1. StripImportExport (optional, based on verbatim_module_syntax)
    // 2. StripType
    // 3. Transform
    let hook = hook.chain_optional(if !config.verbatim_module_syntax {
        Some(strip_import_export::hook())
    } else {
        None
    });

    let hook = hook.chain(strip_type::hook());
    let hook = hook.chain(transform::hook());

    hook.build()
}
