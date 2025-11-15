//! Configuration options for the transformer.

use serde::{Deserialize, Serialize};

/// Main configuration for the transformer.
///
/// This struct contains all configuration options for the transformer and its
/// child transforms. It can be deserialized from JSON or other formats using
/// serde.
///
/// # Example
///
/// ```rust
/// use swc_ecma_transformer::TransformerOptions;
///
/// let options = TransformerOptions::default();
/// ```
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct TransformerOptions {
    /// Options for ECMAScript compatibility transforms.
    #[serde(default)]
    pub compat: CompatOptions,

    /// Options for optimization transforms.
    #[serde(default)]
    pub optimization: OptimizationOptions,

    /// Options for module transforms.
    #[serde(default)]
    pub module: ModuleOptions,
}

/// Options for ECMAScript compatibility transforms.
///
/// These options control which ECMAScript features are transformed
/// to be compatible with older JavaScript environments.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct CompatOptions {
    /// Enable all compatibility transforms.
    #[serde(default)]
    pub enabled: bool,

    /// Target ECMAScript version (e.g., "es5", "es2015", "es2020").
    #[serde(default)]
    pub target: Option<String>,
}

/// Options for optimization transforms.
///
/// These options control various optimization passes that can be applied
/// to the AST to improve runtime performance or reduce bundle size.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct OptimizationOptions {
    /// Enable all optimization transforms.
    #[serde(default)]
    pub enabled: bool,

    /// Enable constant folding.
    #[serde(default)]
    pub constant_folding: bool,

    /// Enable dead code elimination.
    #[serde(default)]
    pub dead_code_elimination: bool,
}

/// Options for module transforms.
///
/// These options control how different module formats (ESM, CommonJS, etc.)
/// are handled and transformed.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(deny_unknown_fields, rename_all = "camelCase")]
pub struct ModuleOptions {
    /// Module format to transform to (e.g., "commonjs", "esm", "amd").
    #[serde(default)]
    pub format: Option<String>,

    /// Enable strict mode for modules.
    #[serde(default)]
    pub strict: bool,
}
