#![cfg_attr(test, feature(test))]
#![recursion_limit = "1024"]
#![deny(unused)]

#[macro_use]
extern crate swc_ecma_utils;

#[cfg(feature = "const-modules")]
pub use self::const_modules::const_modules;
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

mod const_modules;
pub mod modules;
pub mod optimization;
pub mod proposals;
pub mod react;
pub mod typescript;
