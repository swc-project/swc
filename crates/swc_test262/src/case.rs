//! Test262 test case trait
//!
//! Defines the `Test262Case` trait that must be implemented by all test case
//! types.

use std::path::PathBuf;

use crate::metadata::Test262Metadata;

/// Trait for test262 test cases
///
/// This trait must be implemented for each test mode (parser, codegen, runtime,
/// etc.).
///
/// # Example
///
/// ```rust,no_run
/// use swc_test262::{Test262Case, Test262Metadata};
/// use std::path::PathBuf;
///
/// struct MyTest262Case {
///     path: PathBuf,
///     code: String,
///     meta: Test262Metadata,
/// }
///
/// impl Test262Case for MyTest262Case {
///     fn new(path: PathBuf, code: String, meta: Test262Metadata) -> Self {
///         Self { path, code, meta }
///     }
///
///     fn run(&self) {
///         // Test implementation
///     }
///
///     fn path(&self) -> &PathBuf {
///         &self.path
///     }
///
///     fn code(&self) -> &str {
///         &self.code
///     }
///
///     fn meta(&self) -> &Test262Metadata {
///         &self.meta
///     }
/// }
/// ```
pub trait Test262Case: Sized + Sync + Send {
    /// Create a new test case from path, code, and metadata
    fn new(path: PathBuf, code: String, meta: Test262Metadata) -> Self;

    /// Run the test case
    ///
    /// This method should panic if the test fails.
    fn run(&self);

    /// Get the test file path
    fn path(&self) -> &PathBuf;

    /// Get the test source code
    fn code(&self) -> &str;

    /// Get the test metadata
    fn meta(&self) -> &Test262Metadata;

    /// Check if this test case should be skipped
    ///
    /// Override this to skip tests based on features, flags, or known failures.
    fn skip_test_case(&self) -> bool {
        false
    }

    /// Check if this test is expected to fail
    ///
    /// This checks the `negative` metadata field.
    fn should_fail(&self) -> bool {
        self.meta().negative.is_some()
    }
}

/// Test result for individual test cases
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum TestResult {
    /// Test passed
    Passed,

    /// Test failed with error
    Failed {
        /// The reason for the failure
        reason: String,
    },

    /// Test was skipped
    Skipped,

    /// Test correctly produced an expected error
    CorrectError,
}

impl TestResult {
    /// Check if the test passed (including correct errors)
    pub fn is_success(&self) -> bool {
        matches!(self, Self::Passed | Self::CorrectError)
    }

    /// Check if the test failed
    pub fn is_failure(&self) -> bool {
        matches!(self, Self::Failed { .. })
    }

    /// Check if the test was skipped
    pub fn is_skipped(&self) -> bool {
        matches!(self, Self::Skipped)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_result_checks() {
        assert!(TestResult::Passed.is_success());
        assert!(TestResult::CorrectError.is_success());
        assert!(!TestResult::Passed.is_failure());
        assert!(TestResult::Failed {
            reason: "error".to_string()
        }
        .is_failure());
        assert!(TestResult::Skipped.is_skipped());
    }
}
