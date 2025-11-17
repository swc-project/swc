//! ES2017 transformation options.

/// Options for ES2017 transformations.
///
/// Controls which ES2017 features should be transformed.
#[derive(Debug, Default, Clone, Copy)]
pub struct ES2017Options {
    /// Transform async functions to generators.
    ///
    /// When enabled, async/await syntax is converted to generator functions
    /// wrapped with an `asyncToGenerator` helper function.
    ///
    /// Example transformation:
    /// ```js
    /// // Input
    /// async function foo() {
    ///   const x = await bar();
    ///   return x;
    /// }
    ///
    /// // Output
    /// function foo() {
    ///   return _asyncToGenerator(function* () {
    ///     const x = yield bar();
    ///     return x;
    ///   })();
    /// }
    /// ```
    pub async_to_generator: bool,
}

impl ES2017Options {
    /// Creates a new `ES2017Options` with all transformations enabled.
    pub fn all() -> Self {
        Self {
            async_to_generator: true,
        }
    }

    /// Creates a new `ES2017Options` with all transformations disabled.
    pub fn none() -> Self {
        Self {
            async_to_generator: false,
        }
    }
}
