mod comments;
mod source_map;
pub use comments::CommentsVecPtr;
#[cfg(feature = "plugin-mode")]
pub use comments::PluginCommentsProxy;
#[cfg(feature = "plugin-rt")]
pub use comments::{HostCommentsStorage, COMMENTS};
#[cfg(feature = "plugin-mode")]
pub use source_map::PluginSourceMapProxy;
