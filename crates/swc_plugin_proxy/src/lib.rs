mod comments;
mod memory_interop;
mod metadata;
mod source_map;
#[cfg(feature = "plugin-mode")]
pub use comments::PluginCommentsProxy;
#[cfg(feature = "plugin-rt")]
pub use comments::{HostCommentsStorage, COMMENTS};
pub use memory_interop::AllocatedBytesPtr;
#[cfg(feature = "plugin-mode")]
pub use metadata::TransformPluginProgramMetadata;
#[cfg(feature = "plugin-mode")]
pub use source_map::PluginSourceMapProxy;
