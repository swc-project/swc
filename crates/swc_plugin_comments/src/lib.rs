mod host_comments_storage;
#[cfg(feature = "plugin-rt")]
pub use host_comments_storage::{HostCommentsStorage, COMMENTS};

mod plugin_comments_proxy;
#[cfg(feature = "plugin-mode")]
pub use plugin_comments_proxy::PluginCommentsProxy;
