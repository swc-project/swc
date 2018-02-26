use std::env;
use std::path::PathBuf;
use std::sync::Arc;

pub fn manifest_dir() -> PathBuf {
    env::var("CARGO_MANIFEST_DIR")
        .map(PathBuf::from)
        .unwrap_or_else(|err| panic!("failed to read `CARGO_MANIFEST_DIR`: {}", err))
}

/// This directory is per-crate.
pub fn test_results_dir() -> Arc<PathBuf> {
    fn detect() -> PathBuf {
        manifest_dir().join("target").join("swc-test-results")
    }

    lazy_static! {
        static ref DIR: Arc<PathBuf> = Arc::new(detect());
    }

    DIR.clone()
}
