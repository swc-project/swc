//! Configuration options for ES2021 transformations.

use serde::Deserialize;

/// Configuration for ES2021 transforms.
///
/// This struct controls which ES2021 features should be transformed.
#[derive(Debug, Default, Clone, Copy, Deserialize)]
#[serde(default, rename_all = "camelCase", deny_unknown_fields)]
pub struct ES2021Options {
    /// Enable transformation of logical assignment operators (&&=, ||=, ??=).
    ///
    /// When enabled, transforms:
    /// - `a ||= b` to `a || (a = b)`
    /// - `a &&= b` to `a && (a = b)`
    /// - `a ??= b` to `a ?? (a = b)`
    pub logical_assignment_operators: bool,

    /// Enable removal of numeric separators.
    ///
    /// When enabled, transforms:
    /// - `1_000_000` to `1000000`
    /// - `0b1010_0001` to `0b10100001`
    pub numeric_separators: bool,
}

impl ES2021Options {
    /// Creates a new `ES2021Options` with all transforms enabled.
    pub fn all() -> Self {
        Self {
            logical_assignment_operators: true,
            numeric_separators: true,
        }
    }

    /// Creates a new `ES2021Options` with no transforms enabled.
    pub fn none() -> Self {
        Self::default()
    }
}
