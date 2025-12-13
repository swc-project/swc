use serde::Deserialize;

#[inline]
fn default_as_true() -> bool {
    true
}

/// Decides which runtime to use.
///
/// Auto imports the functions that JSX transpiles to.
/// classic does not automatic import anything.
#[derive(Debug, Default, Clone, Copy, Eq, PartialEq, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum JsxRuntime {
    Classic,
    /// The default runtime is switched to automatic in Babel 8.
    #[default]
    Automatic,
}

impl JsxRuntime {
    pub fn is_classic(self) -> bool {
        self == Self::Classic
    }

    pub fn is_automatic(self) -> bool {
        self == Self::Automatic
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, rename_all = "camelCase", deny_unknown_fields)]
pub struct JsxOptions {
    #[serde(skip)]
    pub jsx_plugin: bool,

    #[serde(skip)]
    pub display_name_plugin: bool,

    #[serde(skip)]
    pub jsx_self_plugin: bool,

    #[serde(skip)]
    pub jsx_source_plugin: bool,

    // Both Runtimes
    //
    /// Decides which runtime to use.
    pub runtime: JsxRuntime,

    /// This toggles behavior specific to development, such as adding __source and __self.
    ///
    /// Defaults to `false`.
    pub development: bool,

    /// Toggles whether or not to throw an error if a XML namespaced tag name is used.
    ///
    /// Though the JSX spec allows this, it is disabled by default since React's JSX does not currently have support for it.
    #[serde(default = "default_as_true")]
    pub throw_if_namespace: bool,

    /// Enables `@babel/plugin-transform-react-pure-annotations`.
    ///
    /// It will mark top-level React method calls as pure for tree shaking.
    ///
    /// Defaults to `true`.
    #[serde(default = "default_as_true")]
    pub pure: bool,

    // React Automatic Runtime
    //
    /// Replaces the import source when importing functions.
    ///
    /// Defaults to `react`.
    #[serde(default)]
    pub import_source: Option<String>,

    // React Classic Runtime
    //
    /// Replace the function used when compiling JSX expressions.
    ///
    /// It should be a qualified name (e.g. React.createElement) or an identifier (e.g. createElement).
    ///
    /// Note that the @jsx React.DOM pragma has been deprecated as of React v0.12
    ///
    /// Defaults to `React.createElement`.
    #[serde(default)]
    pub pragma: Option<String>,

    /// Replace the component used when compiling JSX fragments. It should be a valid JSX tag name.
    ///
    /// Defaults to `React.Fragment`.
    #[serde(default)]
    pub pragma_frag: Option<String>,

    /// `useBuiltIns` is deprecated in Babel 8.
    ///
    /// This value is used to skip Babel tests, and is not used in oxc.
    pub use_built_ins: Option<bool>,

    /// `useSpread` is deprecated in Babel 8.
    ///
    /// This value is used to skip Babel tests, and is not used in oxc.
    pub use_spread: Option<bool>,

    /// Fast Refresh
    pub refresh: Option<ReactRefreshOptions>,
}

impl Default for JsxOptions {
    fn default() -> Self {
        Self::enable()
    }
}

impl JsxOptions {
    pub fn conform(&mut self) {
        if self.development {
            self.jsx_plugin = true;
            self.jsx_self_plugin = true;
            self.jsx_source_plugin = true;
        }
    }

    pub fn enable() -> Self {
        Self {
            jsx_plugin: true,
            display_name_plugin: true,
            jsx_self_plugin: false,
            jsx_source_plugin: false,
            runtime: JsxRuntime::default(),
            development: false,
            throw_if_namespace: default_as_true(),
            pure: default_as_true(),
            import_source: None,
            pragma: None,
            pragma_frag: None,
            use_built_ins: None,
            use_spread: None,
            refresh: None,
        }
    }

    pub fn disable() -> Self {
        Self {
            jsx_plugin: false,
            display_name_plugin: false,
            jsx_self_plugin: false,
            jsx_source_plugin: false,
            runtime: JsxRuntime::default(),
            development: false,
            throw_if_namespace: false,
            pure: false,
            import_source: None,
            pragma: None,
            pragma_frag: None,
            use_built_ins: None,
            use_spread: None,
            refresh: None,
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, rename_all = "camelCase", deny_unknown_fields)]
pub struct ReactRefreshOptions {
    /// Specify the identifier of the refresh registration variable.
    ///
    /// Defaults to `$RefreshReg$`.
    #[serde(default = "default_refresh_reg")]
    pub refresh_reg: String,

    /// Specify the identifier of the refresh signature variable.
    ///
    /// Defaults to `$RefreshSig$`.
    #[serde(default = "default_refresh_sig")]
    pub refresh_sig: String,

    /// Controls whether to emit full signatures or use a more compact representation.
    ///
    /// When set to `true`, this option causes this plugin to emit full, readable signatures
    /// for React components and hooks. This can be useful for debugging and development purposes.
    ///
    /// When set to `false` (default), the transformer will use a more compact representation.
    /// Specifically, it generates a SHA-1 hash of the signature and then encodes it using Base64.
    /// This process produces a deterministic, compact representation that's suitable for
    /// production builds while still uniquely identifying components.
    ///
    /// Defaults to `false`.
    #[serde(default)]
    pub emit_full_signatures: bool,
}

impl Default for ReactRefreshOptions {
    fn default() -> Self {
        Self {
            refresh_reg: default_refresh_reg(),
            refresh_sig: default_refresh_sig(),
            emit_full_signatures: false,
        }
    }
}

fn default_refresh_reg() -> String {
    String::from("$RefreshReg$")
}

fn default_refresh_sig() -> String {
    String::from("$RefreshSig$")
}
