#![deny(unused)]

pub use self::{
    fixer::fixer,
    hygiene::hygiene,
    resolver::{resolver, resolver_with_mark},
};
pub use swc_ecma_transforms_base::fixer;
pub use swc_ecma_transforms_base::helpers;
pub use swc_ecma_transforms_base::hygiene;
pub use swc_ecma_transforms_base::pass;
pub use swc_ecma_transforms_base::perf;
pub use swc_ecma_transforms_base::resolver;
pub use swc_ecma_transforms_compat as compat;
pub use swc_ecma_transforms_module as modules;
pub use swc_ecma_transforms_optimization as optimization;
#[cfg(feature = "const-modules")]
pub use swc_ecma_transforms_optimization::const_modules;
pub use swc_ecma_transforms_proposal as proposals;
pub use swc_ecma_transforms_react as react;
pub use swc_ecma_transforms_typescript as typescript;
