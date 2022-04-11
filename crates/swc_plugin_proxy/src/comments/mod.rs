mod host_comments_storage;
mod plugin_comments_proxy;

#[cfg(feature = "plugin-rt")]
pub use host_comments_storage::{HostCommentsStorage, COMMENTS};
pub use plugin_comments_proxy::CommentsVecPtr;
#[cfg(feature = "plugin-mode")]
pub use plugin_comments_proxy::PluginCommentsProxy;
