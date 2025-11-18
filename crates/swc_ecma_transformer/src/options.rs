//! Transformer options and configuration.
//!
//! This module defines the options for configuring the transformer,
//! similar to oxc's options structure.

use serde::{Deserialize, Serialize};
use swc_ecma_ast::EsVersion;

/// Options for the transformer.
///
/// These options control which transformations are enabled and their behavior.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TransformOptions {
    /// TypeScript transformation options
    #[serde(default)]
    pub typescript: TypeScriptOptions,

    /// JSX transformation options
    #[serde(default)]
    pub jsx: JsxOptions,

    /// ECMAScript version target
    #[serde(default)]
    pub target: EsVersion,

    /// Decorator transformation options
    #[serde(default)]
    pub decorator: DecoratorOptions,

    /// Regular expression transformation options
    #[serde(default)]
    pub regexp: RegExpOptions,
}

/// TypeScript transformation options.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TypeScriptOptions {
    /// Enable TypeScript transformations
    #[serde(default)]
    pub enabled: bool,

    /// Only strip types (don't transform TypeScript-specific syntax)
    #[serde(default)]
    pub only_remove_type_imports: bool,
}

/// JSX transformation options.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct JsxOptions {
    /// Enable JSX transformations
    #[serde(default)]
    pub enabled: bool,

    /// JSX pragma (default: "React.createElement")
    #[serde(default)]
    pub pragma: Option<String>,

    /// JSX pragma fragment (default: "React.Fragment")
    #[serde(default)]
    pub pragma_frag: Option<String>,

    /// Use the new JSX transform
    #[serde(default)]
    pub runtime: JsxRuntime,

    /// Import source for the new JSX transform
    #[serde(default)]
    pub import_source: Option<String>,

    /// Enable development mode (adds __source and __self)
    #[serde(default)]
    pub development: bool,

    /// Enable React refresh
    #[serde(default)]
    pub refresh: bool,
}

/// JSX runtime mode.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[serde(rename_all = "lowercase")]
pub enum JsxRuntime {
    /// Classic JSX transform (React.createElement)
    #[default]
    Classic,
    /// Automatic JSX transform (react/jsx-runtime)
    Automatic,
}

/// Decorator transformation options.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DecoratorOptions {
    /// Enable decorator transformations
    #[serde(default)]
    pub enabled: bool,

    /// Decorator version
    #[serde(default)]
    pub version: DecoratorVersion,
}

/// Decorator proposal version.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Default)]
#[serde(rename_all = "lowercase")]
pub enum DecoratorVersion {
    /// Legacy decorator proposal
    Legacy,
    /// 2022-03 decorator proposal
    #[default]
    V202203,
}

/// Regular expression transformation options.
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RegExpOptions {
    /// Enable regular expression transformations
    #[serde(default)]
    pub enabled: bool,

    /// Transform sticky flag
    #[serde(default)]
    pub sticky_flag: bool,

    /// Transform unicode flag
    #[serde(default)]
    pub unicode_flag: bool,

    /// Transform dot-all flag
    #[serde(default)]
    pub dot_all_flag: bool,

    /// Transform named capture groups
    #[serde(default)]
    pub named_capture_groups: bool,

    /// Transform unicode property escapes
    #[serde(default)]
    pub unicode_property_escapes: bool,
}
