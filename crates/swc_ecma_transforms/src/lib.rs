#![deny(clippy::all)]
#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(unused)]

pub use swc_ecma_transforms_base::{
    assumptions::Assumptions, feature, fixer, helpers, hygiene, perf, resolver,
};
// TODO: May remove these reexports once swc_core directly reexports all
#[cfg(feature = "swc_ecma_transforms_compat")]
#[cfg_attr(docsrs, doc(cfg(feature = "compat")))]
pub use swc_ecma_transforms_compat as compat;
#[cfg(feature = "swc_ecma_transforms_module")]
#[cfg_attr(docsrs, doc(cfg(feature = "module")))]
pub use swc_ecma_transforms_module as modules;
#[cfg(feature = "swc_ecma_transforms_optimization")]
#[cfg_attr(docsrs, doc(cfg(feature = "optimization")))]
pub use swc_ecma_transforms_optimization as optimization;
#[cfg(feature = "swc_ecma_transforms_optimization")]
#[cfg_attr(docsrs, doc(cfg(feature = "optimization")))]
pub use swc_ecma_transforms_optimization::const_modules;
#[cfg(feature = "swc_ecma_transforms_proposal")]
#[cfg_attr(docsrs, doc(cfg(feature = "proposal")))]
pub use swc_ecma_transforms_proposal as proposals;
#[cfg(feature = "swc_ecma_transforms_react")]
pub use swc_ecma_transforms_react as react;
#[cfg_attr(docsrs, doc(cfg(feature = "react")))]
#[cfg(feature = "swc_ecma_transforms_typescript")]
#[cfg_attr(docsrs, doc(cfg(feature = "typescript")))]
pub use swc_ecma_transforms_typescript as typescript;

pub use self::{fixer::fixer, hygiene::hygiene};
