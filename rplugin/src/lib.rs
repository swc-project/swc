//! AST processing plugin system.
//!
//! Designed as a general crate, to support using it from other libraries too.
//! This depends on the [abi_stable] crate.
//!
//! # Why new crate?
//!
//! I (kdy1) wants to pass the AST data to plugin without having to change the
//! type of AST nodes.
//!
//! e.g. Using [RBox](abi_stable::std_types::RBox) instead of
//! [Box](std::boxed::Box) is not an acceptable option, as many users already
//! use swc as a crate.
//!
//! Instead, we just use proc-macro to convert ast into something that can be
//! passed directly to the plugin, using [StableAbi][abi_stable::StableAbi]. In
//! plugin, we convert it back to normal AST before processing, so the plugin
//! authors can use exactly same code as core transforms. Of course, this is
//! slow, but it's only slow if it's compared to the changing type. It's much
//! faster than serializing/deserializing.
//!
//! In short, we do
//!
//! `Normal AST -> Plugin AST -> Normal AST -> plugin -> Normal AST -> Plugin
//! AST -> Normal AST`

use abi_stable::StableAbi;

pub trait UnstableAst {
    type Stable: StableAbi;

    fn from_stable(n: Self::Stable) -> Self;

    fn into_stable(self) -> Self::Stable;
}
