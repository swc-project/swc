//! Transformer options and configuration.
//!
//! This module defines the options for configuring the transformer,
//! similar to oxc's options structure.

use serde::{Deserialize, Serialize};

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
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum JsxRuntime {
    /// Classic JSX transform (React.createElement)
    Classic,
    /// Automatic JSX transform (react/jsx-runtime)
    Automatic,
}

impl Default for JsxRuntime {
    fn default() -> Self {
        JsxRuntime::Classic
    }
}

/// Target ECMAScript version.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum EsVersion {
    /// ES5
    Es5,
    /// ES2015 (ES6)
    Es2015,
    /// ES2016 (ES7)
    Es2016,
    /// ES2017
    Es2017,
    /// ES2018
    Es2018,
    /// ES2019
    Es2019,
    /// ES2020
    Es2020,
    /// ES2021
    Es2021,
    /// ES2022
    Es2022,
    /// ES2023
    Es2023,
    /// ES2024
    Es2024,
    /// ES2025
    Es2025,
    /// ES2026 (future spec)
    Es2026,
    /// ESNext (latest)
    EsNext,
}

impl Default for EsVersion {
    fn default() -> Self {
        EsVersion::EsNext
    }
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
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum DecoratorVersion {
    /// Legacy decorator proposal
    Legacy,
    /// 2022-03 decorator proposal
    V202203,
}

impl Default for DecoratorVersion {
    fn default() -> Self {
        DecoratorVersion::V202203
    }
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
