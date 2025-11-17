//! ES2019 transformation options.

/// Configuration options for ES2019 transformations.
///
/// This struct controls which ES2019 features are transformed.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct ES2019Options {
    /// Enable optional catch binding transformation.
    ///
    /// Transforms catch clauses without parameters by adding a dummy parameter.
    /// This is needed for environments that don't support ES2019's optional
    /// catch binding.
    pub optional_catch_binding: bool,

    /// Enable JSON superset transformation.
    ///
    /// Handles additional unicode escapes introduced in ES2019.
    /// Note: This is typically handled during parsing, so this option may be
    /// rarely needed.
    pub json_superset: bool,
}

impl Default for ES2019Options {
    fn default() -> Self {
        Self {
            optional_catch_binding: true,
            json_superset: true,
        }
    }
}

impl ES2019Options {
    /// Creates a new `ES2019Options` with all transforms enabled.
    pub fn new() -> Self {
        Self::default()
    }

    /// Creates a new `ES2019Options` with all transforms disabled.
    pub fn disabled() -> Self {
        Self {
            optional_catch_binding: false,
            json_superset: false,
        }
    }
}
