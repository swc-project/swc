//! Small OS adapters. Cache coordination is scoped to file handles so process
//! death releases locks without PID files, stale-lock timeouts, or polling.

#[cfg(unix)]
mod unix;
#[cfg(windows)]
mod windows;

#[cfg(unix)]
pub use unix::*;
#[cfg(windows)]
pub use windows::*;
