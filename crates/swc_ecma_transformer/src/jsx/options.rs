//! JSX transformation options.

use swc_atoms::Atom;

use super::Runtime;

/// Configuration options for JSX transformation.
#[derive(Debug, Clone)]
pub struct JsxOptions {
    /// Runtime mode (classic or automatic)
    pub runtime: Runtime,

    /// Import source for automatic runtime (e.g., "react", "preact")
    pub import_source: Atom,

    /// Custom pragma for classic runtime (e.g., "React.createElement")
    pub pragma: Option<String>,

    /// Custom fragment pragma for classic runtime (e.g., "React.Fragment")
    pub pragma_frag: Option<String>,

    /// Whether to include development mode helpers (__source, __self)
    pub development: bool,

    /// Whether to throw an error if namespace is used in JSX
    pub throw_if_namespace: bool,
}

impl Default for JsxOptions {
    fn default() -> Self {
        Self {
            runtime: Runtime::default(),
            import_source: "react".into(),
            pragma: None,
            pragma_frag: None,
            development: false,
            throw_if_namespace: true,
        }
    }
}

impl JsxOptions {
    /// Creates a new JsxOptions with default values.
    pub fn new() -> Self {
        Self::default()
    }

    /// Sets the runtime mode.
    pub fn with_runtime(mut self, runtime: Runtime) -> Self {
        self.runtime = runtime;
        self
    }

    /// Sets the import source for automatic runtime.
    pub fn with_import_source(mut self, source: impl Into<Atom>) -> Self {
        self.import_source = source.into();
        self
    }

    /// Sets the pragma for classic runtime.
    pub fn with_pragma(mut self, pragma: impl Into<String>) -> Self {
        self.pragma = Some(pragma.into());
        self
    }

    /// Sets the fragment pragma for classic runtime.
    pub fn with_pragma_frag(mut self, pragma_frag: impl Into<String>) -> Self {
        self.pragma_frag = Some(pragma_frag.into());
        self
    }

    /// Enables or disables development mode.
    pub fn with_development(mut self, development: bool) -> Self {
        self.development = development;
        self
    }

    /// Sets whether to throw on namespace usage.
    pub fn with_throw_if_namespace(mut self, throw_if_namespace: bool) -> Self {
        self.throw_if_namespace = throw_if_namespace;
        self
    }
}
