//! Plugin support.
//!
//! We need to replace operations related to thread-local variables in
//! `swc_common`.

/// DO NOT USE THIS. This is internal API.
pub trait Runtime {}

#[cfg(feature = "plugin-mode")]
scoped_tls::scoped_thread_local!(
    /// DO NOT USE THIS VARIABLE. This is internal API.
    pub static RT: Box<dyn Runtime>
);
