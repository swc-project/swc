//! Functions for syntax_pos::hygiene imported into the guests (plugin) runtime
//! allows interop between host's state to plugin. When guest calls these fn,
//! it'll be executed in host's memory space.
pub(crate) mod handler;
pub(crate) mod hygiene;
pub(crate) mod set_transform_result;
