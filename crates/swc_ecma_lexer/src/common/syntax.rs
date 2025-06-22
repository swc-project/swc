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
        true
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

    pub fn into_flags(self) -> SyntaxFlags {
        match self {
            Syntax::Es(es) => SyntaxFlags::Es(es.into_flags()),
            #[cfg(feature = "typescript")]
            Syntax::Typescript(ts) => SyntaxFlags::Ts(ts.into_flags()),
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

impl TsSyntax {
    fn into_flags(self) -> TsSyntaxFlags {
        let mut flags = TsSyntaxFlags::empty();
        if self.tsx {
            flags |= TsSyntaxFlags::TSX;
        }
        if self.decorators {
            flags |= TsSyntaxFlags::DECORATORS;
        }
        if self.dts {
            flags |= TsSyntaxFlags::DTS;
        }
        if self.no_early_errors {
            flags |= TsSyntaxFlags::NO_EARLY_ERRORS;
        }
        if self.disallow_ambiguous_jsx_like {
            flags |= TsSyntaxFlags::DISALLOW_AMBIGUOUS_JSX_LIKE;
        }
        flags
    }
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

    /// Stage 4
    /// Always true in swc
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

impl EsSyntax {
    fn into_flags(self) -> EsSyntaxFlags {
        let mut flags = EsSyntaxFlags::empty();
        if self.jsx {
            flags |= EsSyntaxFlags::JSX;
        }
        if self.fn_bind {
            flags |= EsSyntaxFlags::FN_BIND;
        }
        if self.decorators {
            flags |= EsSyntaxFlags::DECORATORS;
        }
        if self.decorators_before_export {
            flags |= EsSyntaxFlags::DECORATORS_BEFORE_EXPORT;
        }
        if self.export_default_from {
            flags |= EsSyntaxFlags::EXPORT_DEFAULT_FROM;
        }
        if self.import_attributes {
            flags |= EsSyntaxFlags::IMPORT_ATTRIBUTES;
        }
        if self.allow_super_outside_method {
            flags |= EsSyntaxFlags::ALLOW_SUPER_OUTSIDE_METHOD;
        }
        if self.allow_return_outside_function {
            flags |= EsSyntaxFlags::ALLOW_RETURN_OUTSIDE_FUNCTION;
        }
        if self.auto_accessors {
            flags |= EsSyntaxFlags::AUTO_ACCESSORS;
        }
        if self.explicit_resource_management {
            flags |= EsSyntaxFlags::EXPLICIT_RESOURCE_MANAGEMENT;
        }
        flags
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SyntaxFlags {
    Es(EsSyntaxFlags),
    #[cfg(feature = "typescript")]
    #[cfg_attr(docsrs, doc(cfg(feature = "typescript")))]
    Ts(TsSyntaxFlags),
}

impl Default for SyntaxFlags {
    fn default() -> Self {
        SyntaxFlags::Es(Default::default())
    }
}

impl SyntaxFlags {
    pub fn auto_accessors(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            Self::Ts(_) => true,
            Self::Es(flags) => flags.contains(EsSyntaxFlags::AUTO_ACCESSORS),
        }
    }

    pub fn import_attributes(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            Self::Ts(_) => true,
            Self::Es(flags) => flags.contains(EsSyntaxFlags::IMPORT_ATTRIBUTES),
        }
    }

    /// Should we parse jsx?
    pub fn jsx(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            Self::Ts(flags) => flags.contains(TsSyntaxFlags::TSX),
            Self::Es(flags) => flags.contains(EsSyntaxFlags::JSX),
        }
    }

    pub fn fn_bind(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            Self::Ts(_) => false,
            Self::Es(flags) => flags.contains(EsSyntaxFlags::FN_BIND),
        }
    }

    pub fn decorators(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            SyntaxFlags::Ts(flags) => flags.contains(TsSyntaxFlags::DECORATORS),
            SyntaxFlags::Es(flags) => flags.contains(EsSyntaxFlags::DECORATORS),
        }
    }

    pub fn decorators_before_export(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            SyntaxFlags::Ts(_) => true,
            SyntaxFlags::Es(flags) => flags.contains(EsSyntaxFlags::DECORATORS_BEFORE_EXPORT),
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
        matches!(self, SyntaxFlags::Ts(..))
    }

    pub fn export_default_from(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            SyntaxFlags::Ts(_) => false,
            SyntaxFlags::Es(flags) => flags.contains(EsSyntaxFlags::EXPORT_DEFAULT_FROM),
        }
    }

    pub fn dts(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            SyntaxFlags::Ts(flags) => flags.contains(TsSyntaxFlags::DTS),
            _ => false,
        }
    }

    pub fn allow_super_outside_method(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            SyntaxFlags::Ts(_) => true,
            SyntaxFlags::Es(flags) => flags.contains(EsSyntaxFlags::ALLOW_SUPER_OUTSIDE_METHOD),
        }
    }

    pub fn allow_return_outside_function(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            SyntaxFlags::Ts(_) => false,
            SyntaxFlags::Es(flags) => flags.contains(EsSyntaxFlags::ALLOW_RETURN_OUTSIDE_FUNCTION),
        }
    }

    pub fn early_errors(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            SyntaxFlags::Ts(flags) => !flags.contains(TsSyntaxFlags::NO_EARLY_ERRORS),
            SyntaxFlags::Es(..) => true,
        }
    }

    pub fn disallow_ambiguous_jsx_like(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            SyntaxFlags::Ts(flags) => flags.contains(TsSyntaxFlags::DISALLOW_AMBIGUOUS_JSX_LIKE),
            _ => false,
        }
    }

    pub fn explicit_resource_management(&self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            SyntaxFlags::Ts(_) => true,
            SyntaxFlags::Es(flags) => flags.contains(EsSyntaxFlags::EXPLICIT_RESOURCE_MANAGEMENT),
        }
    }
}

bitflags::bitflags! {
    #[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
    pub struct EsSyntaxFlags: u16 {
     const JSX = 1 << 0;
     const FN_BIND = 1 << 1;
     const DECORATORS = 1 << 2;
     const DECORATORS_BEFORE_EXPORT = 1 << 3;
     const EXPORT_DEFAULT_FROM = 1 << 4;
     const IMPORT_ATTRIBUTES = 1 << 5;
     const ALLOW_SUPER_OUTSIDE_METHOD = 1 << 6;
     const ALLOW_RETURN_OUTSIDE_FUNCTION = 1 << 7;
     const AUTO_ACCESSORS = 1 << 8;
     const EXPLICIT_RESOURCE_MANAGEMENT = 1 << 9;
    }

    #[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
    pub struct TsSyntaxFlags: u8 {
         const TSX = 1 << 0;
         const DECORATORS = 1 << 1;
         const DTS = 1 << 2;
         const NO_EARLY_ERRORS = 1 << 3;
         const DISALLOW_AMBIGUOUS_JSX_LIKE = 1 << 4;
    }
}
