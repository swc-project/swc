use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

mod class_static_block;
mod private_property_in_object;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2022Options {
    pub class_static_block: bool,

    pub private_property_in_object: bool,
}

pub fn hook(options: Es2022Options) -> impl VisitMutHook<TraverseCtx> {
    Es2022Pass { options }
}

struct Es2022Pass {
    options: Es2022Options,
}

impl VisitMutHook<TraverseCtx> for Es2022Pass {}
