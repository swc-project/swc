//! Test262 test suite
//!
//! Manages a collection of test cases and executes them in parallel.

use std::{
    fs,
    panic::RefUnwindSafe,
    path::{Path, PathBuf},
    sync::{
        atomic::{AtomicUsize, Ordering},
        Arc,
    },
};

use rayon::prelude::*;

use crate::{case::Test262Case, discovery::TestDiscovery, metadata::Test262Metadata};

/// Test262 test suite
///
/// Manages discovery, loading, and execution of test262 tests.
///
/// # Type Parameter
///
/// * `T` - The test case type (must implement `Test262Case`)
///
/// # Example
///
/// ```rust,no_run
/// use swc_test262::Suite;
///
/// // Assuming you have a ParserTest262Case type
/// let suite = Suite::<ParserTest262Case>::new();
/// let report = suite.run();
/// println!("Passed: {}/{}", report.passed, report.total);
/// ```
pub struct Suite<T: Test262Case> {
    test_root: PathBuf,
    test_cases: Vec<T>,
}

impl<T: Test262Case + RefUnwindSafe> Suite<T> {
    /// Create a new test suite with default test root
    ///
    /// Uses `test262/test` as the test root directory.
    pub fn new() -> Self {
        let test_root = crate::discovery::default_test262_root();
        Self::with_root(test_root)
    }

    /// Create a new test suite with custom test root
    pub fn with_root(test_root: PathBuf) -> Self {
        Self {
            test_root,
            test_cases: Vec::new(),
        }
    }

    /// Load all test cases from the test root
    ///
    /// This discovers all test files, parses their metadata, and creates test
    /// case instances.
    pub fn load(&mut self) {
        let discovery = TestDiscovery::new(self.test_root.clone());
        let paths = discovery.discover_all();

        println!("Discovered {} test files", paths.len());

        // Load test cases in parallel
        let test_cases: Vec<T> = paths
            .par_iter()
            .filter_map(|path| {
                match self.load_test_case(path) {
                    Ok(case) => {
                        // Skip if the test case says so
                        if case.skip_test_case() {
                            None
                        } else {
                            Some(case)
                        }
                    }
                    Err(err) => {
                        eprintln!("Failed to load {}: {}", path.display(), err);
                        None
                    }
                }
            })
            .collect();

        println!("Loaded {} test cases (after filtering)", test_cases.len());
        self.test_cases = test_cases;
    }

    /// Load a single test case from a file
    fn load_test_case(&self, path: &Path) -> Result<T, Box<dyn std::error::Error>> {
        let code = fs::read_to_string(path)?;
        let meta = Test262Metadata::parse(&code)?;
        let relative_path = path
            .strip_prefix(&self.test_root)
            .unwrap_or(path)
            .to_path_buf();

        Ok(T::new(relative_path, code, meta))
    }

    /// Run all test cases in parallel
    ///
    /// Returns a conformance report with test results.
    pub fn run(&self) -> ConformanceReport {
        let passed = Arc::new(AtomicUsize::new(0));
        let failed = Arc::new(AtomicUsize::new(0));
        let skipped = Arc::new(AtomicUsize::new(0));

        let failures: Vec<_> = self
            .test_cases
            .par_iter()
            .filter_map(|case| {
                if case.skip_test_case() {
                    skipped.fetch_add(1, Ordering::Relaxed);
                    return None;
                }

                let result = std::panic::catch_unwind(|| {
                    case.run();
                });

                match (result, case.should_fail()) {
                    (Ok(()), false) => {
                        // Test passed as expected
                        passed.fetch_add(1, Ordering::Relaxed);
                        None
                    }
                    (Err(_), true) => {
                        // Test failed as expected (negative test)
                        passed.fetch_add(1, Ordering::Relaxed);
                        None
                    }
                    (Ok(()), true) => {
                        // Test should have failed but didn't
                        failed.fetch_add(1, Ordering::Relaxed);
                        Some(FailureDetail {
                            path: case.path().clone(),
                            reason: "Test should have failed but passed".to_string(),
                        })
                    }
                    (Err(err), false) => {
                        // Test failed unexpectedly
                        failed.fetch_add(1, Ordering::Relaxed);

                        // Try to extract panic message from Any
                        let reason = if let Some(s) = err.downcast_ref::<&str>() {
                            (*s).to_string()
                        } else if let Some(s) = err.downcast_ref::<String>() {
                            s.clone()
                        } else {
                            "Test panicked with unknown error".to_string()
                        };

                        Some(FailureDetail {
                            path: case.path().clone(),
                            reason,
                        })
                    }
                }
            })
            .collect();

        ConformanceReport {
            total: self.test_cases.len(),
            passed: passed.load(Ordering::Relaxed),
            failed: failed.load(Ordering::Relaxed),
            skipped: skipped.load(Ordering::Relaxed),
            failures,
        }
    }

    /// Get the number of loaded test cases
    pub fn len(&self) -> usize {
        self.test_cases.len()
    }

    /// Check if the suite is empty
    pub fn is_empty(&self) -> bool {
        self.test_cases.is_empty()
    }
}

impl<T: Test262Case + RefUnwindSafe> Default for Suite<T> {
    fn default() -> Self {
        Self::new()
    }
}

/// Conformance report for a test suite run
#[derive(Debug, Clone)]
pub struct ConformanceReport {
    /// Total number of tests
    pub total: usize,

    /// Number of tests that passed
    pub passed: usize,

    /// Number of tests that failed
    pub failed: usize,

    /// Number of tests that were skipped
    pub skipped: usize,

    /// Detailed failure information
    pub failures: Vec<FailureDetail>,
}

impl ConformanceReport {
    /// Calculate pass rate (excluding skipped tests)
    pub fn pass_rate(&self) -> f64 {
        let attempted = self.total - self.skipped;
        if attempted == 0 {
            return 0.0;
        }
        self.passed as f64 / attempted as f64
    }

    /// Print a summary of the report
    pub fn print_summary(&self) {
        println!("\n=== Test262 Conformance Report ===");
        println!("Total:   {}", self.total);
        println!(
            "Passed:  {} ({:.2}%)",
            self.passed,
            self.pass_rate() * 100.0
        );
        println!("Failed:  {}", self.failed);
        println!("Skipped: {}", self.skipped);

        if !self.failures.is_empty() {
            println!("\n=== Failures ===");
            for (i, failure) in self.failures.iter().take(10).enumerate() {
                println!("{}. {}", i + 1, failure.path.display());
                println!("   {}", failure.reason);
            }

            if self.failures.len() > 10 {
                println!("... and {} more", self.failures.len() - 10);
            }
        }
    }

    /// Save detailed report to a file
    ///
    /// # Errors
    ///
    /// Returns an error if the file cannot be written.
    pub fn save_to_file(&self, path: &Path, test_name: &str) -> std::io::Result<()> {
        use std::io::Write;

        let mut output = String::new();

        // Get git commit hash if available
        if let Ok(commit) = std::process::Command::new("git")
            .args(["rev-parse", "--short", "HEAD"])
            .output()
        {
            if commit.status.success() {
                if let Ok(hash) = String::from_utf8(commit.stdout) {
                    output.push_str(&format!("commit: {}\n\n", hash.trim()));
                }
            }
        }

        // Summary
        output.push_str(&format!("{test_name} Summary:\n"));
        output.push_str(&format!("Total:          {}\n", self.total));
        output.push_str(&format!(
            "Passed:         {} ({:.2}%)\n",
            self.passed,
            self.pass_rate() * 100.0
        ));
        output.push_str(&format!("Failed:         {}\n", self.failed));
        output.push_str(&format!("Skipped:        {}\n\n", self.skipped));

        // Detailed failures
        if !self.failures.is_empty() {
            output.push_str("=== Failures ===\n\n");
            for failure in &self.failures {
                output.push_str(&format!("File: {}\n", failure.path.display()));
                output.push_str(&format!("Reason: {}\n\n", failure.reason));
            }
        }

        // Write to file
        let mut file = std::fs::File::create(path)?;
        file.write_all(output.as_bytes())?;

        Ok(())
    }
}

/// Detailed failure information
#[derive(Debug, Clone)]
pub struct FailureDetail {
    /// Path to the failed test
    pub path: PathBuf,

    /// Failure reason
    pub reason: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_pass_rate() {
        let report = ConformanceReport {
            total: 100,
            passed: 80,
            failed: 15,
            skipped: 5,
            failures: vec![],
        };

        // Pass rate should be 80/95 = 0.842...
        assert!((report.pass_rate() - 0.842).abs() < 0.001);
    }

    #[test]
    fn test_empty_report() {
        let report = ConformanceReport {
            total: 0,
            passed: 0,
            failed: 0,
            skipped: 0,
            failures: vec![],
        };

        assert_eq!(report.pass_rate(), 0.0);
    }
}
