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
pub use swc_ecma_transforms_base::hygiene;
pub use swc_ecma_transforms_base::resolver;

#[macro_use]
mod macros;
#[macro_use]
mod quote;
pub mod compat;
mod const_modules;
pub mod modules;
pub mod optimization;
pub mod pass;
mod perf;
pub mod proposals;
pub mod react;
pub mod typescript;
