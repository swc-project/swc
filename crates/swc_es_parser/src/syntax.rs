use serde::{Deserialize, Serialize};

/// Parser syntax mode.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize, Serialize)]
#[serde(deny_unknown_fields, tag = "syntax")]
pub enum Syntax {
    /// ECMAScript mode.
    #[serde(rename = "ecmascript")]
    Es(EsSyntax),
    /// TypeScript mode.
    #[cfg(feature = "typescript")]
    #[cfg_attr(docsrs, doc(cfg(feature = "typescript")))]
    #[serde(rename = "typescript")]
    Typescript(TsSyntax),
}

impl Default for Syntax {
    fn default() -> Self {
        Self::Es(Default::default())
    }
}

impl Syntax {
    /// Returns `true` if JSX should be parsed.
    pub fn jsx(self) -> bool {
        match self {
            Syntax::Es(es) => es.jsx,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(ts) => ts.tsx,
        }
    }

    /// Returns `true` if TypeScript should be parsed.
    pub fn typescript(self) -> bool {
        #[cfg(feature = "typescript")]
        {
            matches!(self, Syntax::Typescript(..))
        }

        #[cfg(not(feature = "typescript"))]
        {
            false
        }
    }

    /// Returns `true` if decorators are enabled.
    pub fn decorators(self) -> bool {
        match self {
            Syntax::Es(es) => es.decorators,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(ts) => ts.decorators,
        }
    }

    /// Returns `true` if resource declarations are enabled.
    pub fn explicit_resource_management(self) -> bool {
        match self {
            Syntax::Es(es) => es.explicit_resource_management,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(_) => true,
        }
    }

    /// Returns `true` when early errors should be checked.
    pub fn early_errors(self) -> bool {
        match self {
            Syntax::Es(_) => true,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(ts) => !ts.no_early_errors,
        }
    }

    /// Returns `true` if super outside method is allowed.
    pub fn allow_super_outside_method(self) -> bool {
        match self {
            Syntax::Es(es) => es.allow_super_outside_method,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(_) => true,
        }
    }

    /// Returns `true` if return outside function is allowed.
    pub fn allow_return_outside_function(self) -> bool {
        match self {
            Syntax::Es(es) => es.allow_return_outside_function,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(_) => false,
        }
    }
}

/// ECMAScript parser options.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct EsSyntax {
    #[serde(default)]
    pub jsx: bool,
    #[serde(default)]
    pub decorators: bool,
    #[serde(default)]
    pub decorators_before_export: bool,
    #[serde(default)]
    pub export_default_from: bool,
    #[serde(default, alias = "importAssertions")]
    pub import_attributes: bool,
    #[serde(default)]
    pub allow_super_outside_method: bool,
    #[serde(default)]
    pub allow_return_outside_function: bool,
    #[serde(default)]
    pub explicit_resource_management: bool,
}

/// TypeScript parser options.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TsSyntax {
    #[serde(default)]
    pub tsx: bool,
    #[serde(default)]
    pub decorators: bool,
    #[serde(skip, default)]
    pub dts: bool,
    #[serde(skip, default)]
    pub no_early_errors: bool,
    #[serde(skip, default)]
    pub disallow_ambiguous_jsx_like: bool,
}
