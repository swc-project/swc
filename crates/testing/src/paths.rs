use once_cell::sync::Lazy;
use std::{env, path::PathBuf, sync::Arc};

pub fn manifest_dir() -> PathBuf {
    env::var("CARGO_MANIFEST_DIR")
        .map(PathBuf::from)
        .map(|p| {
            p.canonicalize()
                .expect("failed to canonicalize `CARGO_MANIFEST_DIR`")
        })
        .unwrap_or_else(|err| panic!("failed to read `CARGO_MANIFEST_DIR`: {}", err))
}

/// This directory is per-crate.
pub fn test_results_dir() -> Arc<PathBuf> {
    fn detect() -> PathBuf {
        manifest_dir().join("target").join("swc-test-results")
    }

    static DIR: Lazy<Arc<PathBuf>> = Lazy::new(|| Arc::new(detect()));

    DIR.clone()
}
