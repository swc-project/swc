use swc_ecma_ast::*;
use swc_ecma_hooks::{VisitMutHook, VisitMutWithHook};
use swc_ecma_visit::visit_mut_pass;

use crate::hook_utils::{HookBuilder, NoopHook};
pub use crate::options::*;

mod es2015;
mod es2016;
mod es2017;
mod es2018;
mod es2019;
mod es2021;
mod es2022;
mod es2026;
mod hook_utils;
mod jsx;
mod options;
mod typescript;

pub struct TraverseCtx {}

pub fn transform_hook(options: Options) -> impl VisitMutHook<TraverseCtx> {
    let builder = HookBuilder::new(NoopHook);

    macro_rules! add {
        ($cond:expr, $hook:expr) => {
            let builder = builder.chain(OptionalHook {
                enabled: $cond,
                hook: $hook,
            });
        };
    }

    builder.build()
}

pub fn hook_pass<H: VisitMutHook<TraverseCtx>>(hook: H) -> impl Pass {
    let ctx = TraverseCtx {};

    visit_mut_pass(VisitMutWithHook { hook, context: ctx })
}
