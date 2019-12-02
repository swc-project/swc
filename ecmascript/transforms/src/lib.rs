#![feature(box_patterns)]
#![feature(box_syntax)]
#![feature(try_trait)]
#![feature(specialization)]
#![feature(core_intrinsics)]
#![feature(nll)]
#![feature(trace_macros)]
#![cfg_attr(test, feature(test))]
#![recursion_limit = "1024"]

pub use self::{
    const_modules::const_modules, fixer::fixer, hygiene::hygiene, inline_globals::InlineGlobals,
    resolver::resolver, simplify::simplifier,
};

#[macro_use]
mod macros;
#[cfg(test)]
#[macro_use]
mod tests;
#[macro_use]
mod quote;
#[macro_use]
pub mod helpers;
#[macro_use]
mod hygiene;
pub mod compat;
mod const_modules;
pub mod debug;
mod fixer;
mod inline_globals;
pub mod modules;
pub mod optimization;
pub mod pass;
pub mod proposals;
pub mod react;
mod resolver;
pub mod scope;
mod simplify;
pub mod typescript;
pub mod util;
