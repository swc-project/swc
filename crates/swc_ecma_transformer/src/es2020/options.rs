//! Configuration options for ES2020 transformations.

/// Options controlling which ES2020 features to transform.
#[derive(Debug, Clone)]
pub struct ES2020Options {
    /// Enable optional chaining transformation.
    pub optional_chaining: bool,

    /// Enable nullish coalescing transformation.
    pub nullish_coalescing: bool,
}

impl Default for ES2020Options {
    fn default() -> Self {
        Self {
            optional_chaining: true,
            nullish_coalescing: true,
        }
    }
}

impl ES2020Options {
    /// Creates a new options instance with all transformations enabled.
    pub fn all() -> Self {
        Self::default()
    }

    /// Creates a new options instance with all transformations disabled.
    pub fn none() -> Self {
        Self {
            optional_chaining: false,
            nullish_coalescing: false,
        }
    }
}
