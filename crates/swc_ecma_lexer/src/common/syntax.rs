use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize, Serialize)]
#[serde(deny_unknown_fields, tag = "syntax")]
pub enum Syntax {
    /// Standard
    #[serde(rename = "ecmascript")]
    Es(EsSyntax),
    /// This variant requires the cargo feature `typescript` to be enabled.
    #[cfg(feature = "typescript")]
    #[cfg_attr(docsrs, doc(cfg(feature = "typescript")))]
    #[serde(rename = "typescript")]
    Typescript(TsSyntax),
}

impl Default for Syntax {
    fn default() -> Self {
        Syntax::Es(Default::default())
    }
}

impl Syntax {
    pub fn auto_accessors(self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                auto_accessors: true,
                ..
            }) => true,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(_) => true,
            _ => false,
        }
    }

    pub fn import_attributes(self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                import_attributes, ..
            }) => import_attributes,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(_) => true,
        }
    }

    /// Should we parse jsx?
    pub fn jsx(self) -> bool {
        match self {
            Syntax::Es(EsSyntax { jsx: true, .. }) => true,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(TsSyntax { tsx: true, .. }) => true,
            _ => false,
        }
    }

    pub fn fn_bind(self) -> bool {
        matches!(self, Syntax::Es(EsSyntax { fn_bind: true, .. }))
    }

    pub fn decorators(self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                decorators: true, ..
            }) => true,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(TsSyntax {
                decorators: true, ..
            }) => true,
            _ => false,
        }
    }

    pub fn decorators_before_export(self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                decorators_before_export: true,
                ..
            }) => true,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(..) => true,
            _ => false,
        }
    }

    /// Should we parse typescript?
    #[cfg(not(feature = "typescript"))]
    pub const fn typescript(self) -> bool {
        false
    }

    /// Should we parse typescript?
    #[cfg(feature = "typescript")]
    pub const fn typescript(self) -> bool {
        matches!(self, Syntax::Typescript(..))
    }

    pub fn export_default_from(self) -> bool {
        matches!(
            self,
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..
            })
        )
    }

    pub fn dts(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            Syntax::Typescript(t) => t.dts,
            _ => false,
        }
    }

    pub fn allow_super_outside_method(self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                allow_super_outside_method,
                ..
            }) => allow_super_outside_method,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(_) => true,
        }
    }

    pub fn allow_return_outside_function(self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                allow_return_outside_function,
                ..
            }) => allow_return_outside_function,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(_) => false,
        }
    }

    pub fn early_errors(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            Syntax::Typescript(t) => !t.no_early_errors,
            Syntax::Es(..) => true,
        }
    }

    pub fn disallow_ambiguous_jsx_like(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            Syntax::Typescript(t) => t.disallow_ambiguous_jsx_like,
            _ => false,
        }
    }

    pub fn explicit_resource_management(&self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                explicit_resource_management: using_decl,
                ..
            }) => *using_decl,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(_) => true,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TsSyntax {
    #[serde(default)]
    pub tsx: bool,

    #[serde(default)]
    pub decorators: bool,

    /// `.d.ts`
    #[serde(skip, default)]
    pub dts: bool,

    #[serde(skip, default)]
    pub no_early_errors: bool,

    /// babel: `disallowAmbiguousJSXLike`
    /// Even when JSX parsing is not enabled, this option disallows using syntax
    /// that would be ambiguous with JSX (`<X> y` type assertions and
    /// `<X>()=>{}` type arguments)
    /// see: https://babeljs.io/docs/en/babel-plugin-transform-typescript#disallowambiguousjsxlike
    #[serde(skip, default)]
    pub disallow_ambiguous_jsx_like: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EsSyntax {
    #[serde(default)]
    pub jsx: bool,

    /// Support function bind expression.
    #[serde(rename = "functionBind")]
    #[serde(default)]
    pub fn_bind: bool,

    /// Enable decorators.
    #[serde(default)]
    pub decorators: bool,

    /// babel: `decorators.decoratorsBeforeExport`
    ///
    /// Effective only if `decorator` is true.
    #[serde(rename = "decoratorsBeforeExport")]
    #[serde(default)]
    pub decorators_before_export: bool,

    #[serde(default)]
    pub export_default_from: bool,

    /// Stage 3.
    #[serde(default, alias = "importAssertions")]
    pub import_attributes: bool,

    #[serde(default, rename = "allowSuperOutsideMethod")]
    pub allow_super_outside_method: bool,

    #[serde(default, rename = "allowReturnOutsideFunction")]
    pub allow_return_outside_function: bool,

    #[serde(default)]
    pub auto_accessors: bool,

    #[serde(default)]
    pub explicit_resource_management: bool,
}
