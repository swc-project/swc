//! Configuration options for React transforms.

use bytes_str::BytesStr;
#[cfg(feature = "serde-impl")]
use serde::{Deserialize, Serialize};
use swc_atoms::Atom;
use swc_config::merge::Merge;

/// JSX runtime mode.
#[derive(Debug, Default, Clone, Copy, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "serde-impl", derive(Serialize, Deserialize))]
#[cfg_attr(feature = "serde-impl", serde(rename_all = "lowercase"))]
pub enum Runtime {
    /// Classic mode - uses `React.createElement`
    #[default]
    Classic,
    /// Automatic mode - imports jsx/jsxs from react/jsx-runtime
    Automatic,
    /// Preserve mode - keeps JSX as-is
    Preserve,
}

impl Merge for Runtime {
    fn merge(&mut self, other: Self) {
        // If self is the default (Classic), take other's value
        if *self == Runtime::Classic {
            *self = other;
        }
    }
}

/// Main options for the React transform.
///
/// Corresponds to `@babel/preset-react` options.
#[derive(Debug, Default, Clone, Merge)]
#[cfg_attr(feature = "serde-impl", derive(Serialize, Deserialize))]
#[cfg_attr(feature = "serde-impl", serde(rename_all = "camelCase"))]
#[cfg_attr(feature = "serde-impl", serde(default))]
pub struct Options {
    /// JSX runtime mode.
    ///
    /// - `classic`: Uses `React.createElement`
    /// - `automatic`: Uses jsx/jsxs from react/jsx-runtime
    /// - `preserve`: Keeps JSX as-is
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub runtime: Option<Runtime>,

    /// Import source for automatic runtime.
    ///
    /// Default: `"react"`
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub import_source: Option<BytesStr>,

    /// Pragma for classic runtime.
    ///
    /// Default: `"React.createElement"`
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub pragma: Option<BytesStr>,

    /// Pragma fragment for classic runtime.
    ///
    /// Default: `"React.Fragment"`
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub pragma_frag: Option<BytesStr>,

    /// Whether to throw an error when a namespace is used in JSX.
    ///
    /// Default: `true`
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub throw_if_namespace: Option<bool>,

    /// Enable development mode.
    ///
    /// When enabled:
    /// - Adds `__source` attribute for debugging
    /// - Adds `__self` attribute for debugging
    /// - Uses `jsxDEV` instead of `jsx` in automatic runtime
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub development: Option<bool>,

    /// React Fast Refresh options.
    #[cfg_attr(
        feature = "serde-impl",
        serde(default, deserialize_with = "deserialize_refresh")
    )]
    pub refresh: Option<RefreshOptions>,

    /// Use built-ins for JSX.
    ///
    /// This is deprecated in Babel 8.
    #[cfg_attr(feature = "serde-impl", serde(default, alias = "useBuiltIns"))]
    pub use_builtins: Option<bool>,

    /// Use spread instead of Object.assign.
    ///
    /// This is deprecated in Babel 8.
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub use_spread: Option<bool>,
}

/// Options for React Fast Refresh.
#[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(feature = "serde-impl", derive(Serialize, Deserialize))]
#[cfg_attr(feature = "serde-impl", serde(rename_all = "camelCase"))]
#[cfg_attr(feature = "serde-impl", serde(default))]
pub struct RefreshOptions {
    /// The refresh registration variable name.
    ///
    /// Default: `"$RefreshReg$"`
    #[cfg_attr(feature = "serde-impl", serde(default = "default_refresh_reg"))]
    pub refresh_reg: Atom,

    /// The refresh signature variable name.
    ///
    /// Default: `"$RefreshSig$"`
    #[cfg_attr(feature = "serde-impl", serde(default = "default_refresh_sig"))]
    pub refresh_sig: Atom,

    /// Whether to emit full signatures.
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub emit_full_signatures: bool,
}

impl Merge for RefreshOptions {
    fn merge(&mut self, other: Self) {
        // For RefreshOptions, we keep self's values if they differ from default,
        // otherwise take other's values
        if self.refresh_reg == default_refresh_reg() {
            self.refresh_reg = other.refresh_reg;
        }
        if self.refresh_sig == default_refresh_sig() {
            self.refresh_sig = other.refresh_sig;
        }
        if !self.emit_full_signatures {
            self.emit_full_signatures = other.emit_full_signatures;
        }
    }
}

impl Default for RefreshOptions {
    fn default() -> Self {
        Self {
            refresh_reg: default_refresh_reg(),
            refresh_sig: default_refresh_sig(),
            emit_full_signatures: false,
        }
    }
}

fn default_refresh_reg() -> Atom {
    "$RefreshReg$".into()
}

fn default_refresh_sig() -> Atom {
    "$RefreshSig$".into()
}

/// Returns the default pragma.
pub fn default_pragma() -> BytesStr {
    "React.createElement".into()
}

/// Returns the default pragma fragment.
pub fn default_pragma_frag() -> BytesStr {
    "React.Fragment".into()
}

/// Custom deserializer for refresh options.
///
/// Allows `refresh: true` to use default options.
#[cfg(feature = "serde-impl")]
fn deserialize_refresh<'de, D>(deserializer: D) -> Result<Option<RefreshOptions>, D::Error>
where
    D: serde::Deserializer<'de>,
{
    use serde::de::{Error, Visitor};

    struct RefreshVisitor;

    impl<'de> Visitor<'de> for RefreshVisitor {
        type Value = Option<RefreshOptions>;

        fn expecting(&self, formatter: &mut std::fmt::Formatter) -> std::fmt::Result {
            formatter.write_str("a boolean or RefreshOptions object")
        }

        fn visit_bool<E>(self, v: bool) -> Result<Self::Value, E>
        where
            E: Error,
        {
            if v {
                Ok(Some(RefreshOptions::default()))
            } else {
                Ok(None)
            }
        }

        fn visit_none<E>(self) -> Result<Self::Value, E>
        where
            E: Error,
        {
            Ok(None)
        }

        fn visit_unit<E>(self) -> Result<Self::Value, E>
        where
            E: Error,
        {
            Ok(None)
        }

        fn visit_map<A>(self, map: A) -> Result<Self::Value, A::Error>
        where
            A: serde::de::MapAccess<'de>,
        {
            let options =
                RefreshOptions::deserialize(serde::de::value::MapAccessDeserializer::new(map))?;
            Ok(Some(options))
        }
    }

    deserializer.deserialize_any(RefreshVisitor)
}
