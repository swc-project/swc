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
#[cfg(feature = "swc_ecma_transforms_compat")]
pub use swc_ecma_transforms_compat as compat;
#[cfg(feature = "swc_ecma_transforms_module")]
pub use swc_ecma_transforms_module as modules;
#[cfg(feature = "swc_ecma_transforms_optimization")]
pub use swc_ecma_transforms_optimization as optimization;
#[cfg(feature = "swc_ecma_transforms_optimization")]
pub use swc_ecma_transforms_optimization::const_modules;
#[cfg(feature = "swc_ecma_transforms_proposal")]
pub use swc_ecma_transforms_proposal as proposals;
#[cfg(feature = "swc_ecma_transforms_react")]
pub use swc_ecma_transforms_react as react;
#[cfg(feature = "swc_ecma_transforms_typescript")]
pub use swc_ecma_transforms_typescript as typescript;
