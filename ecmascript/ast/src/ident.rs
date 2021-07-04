use crate::typescript::TsTypeAnn;
use serde::Deserialize;
use serde::Serialize;
use swc_atoms::JsWord;
use swc_common::ast_node;
use swc_common::EqIgnoreSpan;
use swc_common::Span;
use swc_common::Spanned;

/// Identifer used as a pattern.
#[derive(Spanned, Clone, Debug, PartialEq, Eq, Hash, EqIgnoreSpan, Serialize, Deserialize)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct BindingIdent {
    #[span]
    #[serde(flatten)]
    pub id: Ident,
    #[serde(default, rename = "typeAnnotation")]
    pub type_ann: Option<TsTypeAnn>,
}

impl From<Ident> for BindingIdent {
    fn from(id: Ident) -> Self {
        Self { id, type_ann: None }
    }
}

/// Ident with span.
#[ast_node("Identifier")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Ident {
    pub span: Span,
    #[serde(rename = "value")]
    pub sym: JsWord,

    /// TypeScript only. Used in case of an optional parameter.
    #[serde(default)]
    pub optional: bool,
}

#[cfg(feature = "arbitrary")]
impl<'a> arbitrary::Arbitrary<'a> for Ident {
    fn arbitrary(u: &mut arbitrary::Unstructured<'_>) -> arbitrary::Result<Self> {
        let span = u.arbitrary()?;
        let sym = u.arbitrary::<String>()?;
        if sym.is_empty() {
            return Err(arbitrary::Error::NotEnoughData);
        }
        let sym = sym.into();

        let optional = u.arbitrary()?;

        Ok(Self {
            span,
            sym,
            optional,
        })
    }
}

#[ast_node("PrivateName")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct PrivateName {
    pub span: Span,
    pub id: Ident,
}

impl AsRef<str> for Ident {
    fn as_ref(&self) -> &str {
        &self.sym
    }
}

impl Ident {
    pub const fn new(sym: JsWord, span: Span) -> Self {
        Ident {
            span,
            sym,
            optional: false,
        }
    }
}

pub trait IdentExt: AsRef<str> {
    fn is_reserved(&self) -> bool {
        [
            "break",
            "case",
            "catch",
            "class",
            "const",
            "continue",
            "debugger",
            "default",
            "delete",
            "do",
            "else",
            "enum",
            "export",
            "extends",
            "false",
            "finally",
            "for",
            "function",
            "if",
            "import",
            "in",
            "instanceof",
            "new",
            "null",
            "package",
            "return",
            "super",
            "switch",
            "this",
            "throw",
            "true",
            "try",
            "typeof",
            "var",
            "void",
            "while",
            "with",
        ]
        .contains(&self.as_ref())
    }

    fn is_reserved_in_strict_mode(&self, is_module: bool) -> bool {
        if is_module && self.as_ref() == "await" {
            return true;
        }
        [
            "implements",
            "interface",
            "let",
            "package",
            "private",
            "protected",
            "public",
            "static",
            "yield",
        ]
        .contains(&self.as_ref())
    }

    fn is_reserved_in_strict_bind(&self) -> bool {
        ["eval", "arguments"].contains(&self.as_ref())
    }

    fn is_reserved_in_es3(&self) -> bool {
        [
            "abstract",
            "boolean",
            "byte",
            "char",
            "double",
            "final",
            "float",
            "goto",
            "int",
            "long",
            "native",
            "short",
            "synchronized",
            "throws",
            "transient",
            "volatile",
        ]
        .contains(&self.as_ref())
    }
}

impl IdentExt for JsWord {}
impl IdentExt for Ident {}
