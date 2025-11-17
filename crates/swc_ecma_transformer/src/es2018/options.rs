//! Configuration options for ES2018 transformations.

use serde::Deserialize;

/// Configuration options for ES2018 transformations.
///
/// This struct controls which ES2018 features should be transformed and
/// how they should be transformed.
#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(default, rename_all = "camelCase", deny_unknown_fields)]
pub struct ES2018Options {
    /// Enable object rest/spread transformation.
    ///
    /// When enabled, transforms object rest/spread properties:
    /// - `{...obj}` -> helper function calls
    /// - `{...rest}` in destructuring -> helper function calls
    pub object_rest_spread: bool,

    /// Enable async generator functions transformation.
    ///
    /// When enabled, transforms async generator functions to use helper
    /// functions for async iteration.
    pub async_generator_functions: bool,

    /// Enable for-await-of loop transformation.
    ///
    /// When enabled, transforms `for await (const x of iter)` loops
    /// into equivalent code compatible with older environments.
    pub async_iteration: bool,
}

impl ES2018Options {
    /// Creates a new `ES2018Options` with all transformations enabled.
    pub fn all() -> Self {
        Self {
            object_rest_spread: true,
            async_generator_functions: true,
            async_iteration: true,
        }
    }

    /// Checks if any transformation is enabled.
    pub fn is_enabled(&self) -> bool {
        self.object_rest_spread || self.async_generator_functions || self.async_iteration
    }
}
