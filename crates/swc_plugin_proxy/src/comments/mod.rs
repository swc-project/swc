mod host_comments_storage;
mod plugin_comments_proxy;

#[cfg(feature = "__plugin_rt")]
pub use host_comments_storage::{HostCommentsStorage, COMMENTS};
#[cfg(feature = "__plugin_mode")]
pub use plugin_comments_proxy::PluginCommentsProxy;
