use swc_ecma_hooks::VisitMutHook;

use crate::{
    hook_utils::{HookBuilder, NoopHook, OptionalHook},
    TraverseCtx,
};

mod class_properties;
mod class_static_block;
mod private_property_in_object;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2022Options {
    pub class_properties: bool,

    pub class_static_block: bool,

    pub private_property_in_object: bool,
}

pub fn hook(options: Es2022Options) -> impl VisitMutHook<TraverseCtx> {
    let hook = HookBuilder::new(NoopHook);

    let hook = hook.chain(OptionalHook(if options.class_static_block {
        Some(self::class_static_block::hook())
    } else {
        None
    }));

    let hook = hook.chain(OptionalHook(if options.private_property_in_object {
        Some(self::private_property_in_object::hook())
    } else {
        None
    }));

    hook.build()
}
