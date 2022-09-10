#![cfg_attr(not(feature = "__rkyv"), allow(warnings))]

mod comments;
mod memory_interop;
mod metadata;
mod source_map;
#[cfg(feature = "__plugin_mode")]
pub use comments::PluginCommentsProxy;
#[cfg(feature = "__plugin_rt")]
pub use comments::{HostCommentsStorage, COMMENTS};
pub use memory_interop::AllocatedBytesPtr;
#[cfg(feature = "__plugin_mode")]
pub use metadata::TransformPluginProgramMetadata;
#[cfg(feature = "__plugin_mode")]
pub use source_map::PluginSourceMapProxy;
