//! ES2015 Transformation Options
//!
//! Configuration options for ES2015 (ES6) syntax transformations.

use serde::Deserialize;

use super::ArrowFunctionsOptions;

/// Options for ES2015 transformations.
///
/// Controls which ES2015 features are transformed and how they are transformed.
/// Each feature can be individually configured or disabled.
///
/// # Examples
///
/// ```rust
/// use swc_ecma_transformer::ES2015Options;
///
/// // Default configuration - all features enabled with default settings
/// let options = ES2015Options::default();
/// ```
#[derive(Debug, Default, Clone, Copy, Deserialize)]
#[serde(default, rename_all = "camelCase", deny_unknown_fields)]
pub struct ES2015Options {
    /// Arrow function transformation options.
    ///
    /// Controls how arrow functions are transformed to regular functions.
    /// If `None`, arrow functions will be transformed with default settings.
    ///
    /// # Note
    ///
    /// The `#[serde(skip)]` attribute means this option cannot be configured
    /// via JSON/YAML configuration files. It is determined by the environment
    /// options instead.
    #[serde(skip)]
    pub arrow_function: Option<ArrowFunctionsOptions>,
}
