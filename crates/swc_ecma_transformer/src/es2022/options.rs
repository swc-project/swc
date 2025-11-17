//! Configuration options for ES2022 transformations.

/// Options for ES2022 feature transformations.
///
/// This struct controls which ES2022 features are transformed.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct ES2022Options {
    /// Enable transformation of class static blocks.
    ///
    /// Transforms `static { }` blocks into private static field initializers.
    ///
    /// # Example
    ///
    /// ```ignore
    /// // Input
    /// class C {
    ///     static { this.x = 1; }
    /// }
    ///
    /// // Output
    /// class C {
    ///     static #_ = this.x = 1;
    /// }
    /// ```
    pub class_static_block: bool,
}

impl ES2022Options {
    /// Creates a new `ES2022Options` with all transformations enabled.
    pub fn all() -> Self {
        Self {
            class_static_block: true,
        }
    }

    /// Creates a new `ES2022Options` with all transformations disabled.
    pub fn none() -> Self {
        Self {
            class_static_block: false,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_options() {
        let options = ES2022Options::default();
        assert!(!options.class_static_block);
    }

    #[test]
    fn test_all_options() {
        let options = ES2022Options::all();
        assert!(options.class_static_block);
    }

    #[test]
    fn test_none_options() {
        let options = ES2022Options::none();
        assert!(!options.class_static_block);
    }
}
