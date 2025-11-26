//! Test262 test discovery
//!
//! Discovers and loads test262 test files from the filesystem.

use std::path::{Path, PathBuf};

use walkdir::WalkDir;

/// Discovers test262 test files
pub struct TestDiscovery {
    test_root: PathBuf,
}

impl TestDiscovery {
    /// Create a new test discovery instance
    ///
    /// # Arguments
    ///
    /// * `test_root` - Root directory of test262 tests (e.g., "test262/test")
    pub fn new(test_root: PathBuf) -> Self {
        Self { test_root }
    }

    /// Discover all test files in the test root
    ///
    /// Returns paths to all `.js` test files, excluding:
    /// - harness files
    /// - fixtures
    /// - staging tests (proposals not yet stage 4)
    pub fn discover_all(&self) -> Vec<PathBuf> {
        self.discover_with_filter(|_| true)
    }

    /// Discover test files with a custom filter
    ///
    /// # Arguments
    ///
    /// * `filter` - Function to filter paths (return `true` to include)
    pub fn discover_with_filter<F>(&self, filter: F) -> Vec<PathBuf>
    where
        F: Fn(&Path) -> bool,
    {
        WalkDir::new(&self.test_root)
            .into_iter()
            .filter_map(Result::ok)
            .filter(|entry| {
                let path = entry.path();

                // Only include .js files
                if !path.extension().is_some_and(|ext| ext == "js") {
                    return false;
                }

                // Exclude harness and fixture directories
                if self.should_exclude(path) {
                    return false;
                }

                // Apply custom filter
                filter(path)
            })
            .map(|entry| entry.path().to_path_buf())
            .collect()
    }

    /// Check if a path should be excluded
    fn should_exclude(&self, path: &Path) -> bool {
        let path_str = path.to_string_lossy();

        // Exclude staging tests (not yet stage 4)
        if path_str.contains("/staging/") || path_str.contains("\\staging\\") {
            return true;
        }

        // Exclude markdown files
        if path_str.ends_with(".md") {
            return true;
        }

        // Exclude fixtures
        if path_str.contains("_FIXTURE") {
            return true;
        }

        false
    }

    /// Get the test root path
    pub fn test_root(&self) -> &Path {
        &self.test_root
    }
}

/// Helper function to get default test262 root path
///
/// Searches for the workspace root by walking up the directory tree,
/// then returns `test262/test` relative to that.
pub fn default_test262_root() -> PathBuf {
    find_workspace_root()
        .expect("Failed to find workspace root")
        .join("test262")
        .join("test")
}

/// Find the workspace root by walking up the directory tree
///
/// Looks for a Cargo.toml with [workspace] section
fn find_workspace_root() -> Option<PathBuf> {
    let mut current = std::env::current_dir().ok()?;

    loop {
        let cargo_toml = current.join("Cargo.toml");
        if cargo_toml.exists() {
            // Check if this is a workspace root by reading the Cargo.toml
            if let Ok(contents) = std::fs::read_to_string(&cargo_toml) {
                if contents.contains("[workspace]") {
                    return Some(current);
                }
            }
        }

        // Move up one directory
        if !current.pop() {
            break;
        }
    }

    None
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_should_exclude() {
        let discovery = TestDiscovery::new(PathBuf::from("test262/test"));

        // Should exclude staging
        assert!(discovery.should_exclude(Path::new("test262/test/staging/proposal.js")));

        // Should exclude fixtures
        assert!(discovery.should_exclude(Path::new("test262/test/_FIXTURES/file.js")));
        assert!(discovery.should_exclude(Path::new("test262/test/some_FIXTURE.js")));

        // Should exclude markdown
        assert!(discovery.should_exclude(Path::new("test262/test/README.md")));

        // Should NOT exclude harness tests (they are real test files)
        assert!(!discovery.should_exclude(Path::new("test262/test/harness/assert.js")));

        // Should not exclude normal tests
        assert!(!discovery.should_exclude(Path::new("test262/test/language/test.js")));
    }
}
