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

/// Keep tempfile's exclusive randomized naming, but establish the explicit
/// user owner and private DACL at creation on Windows, including elevated
/// tokens.
pub(crate) fn temporary_file(
    directory: &std::path::Path,
    prefix: &str,
    suffix: &str,
) -> std::io::Result<tempfile::NamedTempFile> {
    let mut builder = tempfile::Builder::new();
    builder.prefix(prefix).suffix(suffix);
    #[cfg(windows)]
    return builder.make_in(directory, new_private_file);
    #[cfg(unix)]
    builder.tempfile_in(directory)
}
