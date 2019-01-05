use crate::typescript::TsTypeAnn;
use std::fmt::{self, Debug, Display, Formatter};
use swc_atoms::JsWord;
use swc_common::{ast_node, Fold, Span, Spanned};

/// Ident with span.
#[derive(Spanned, Fold, Clone, PartialEq)]
pub struct Ident {
    pub span: Span,
    #[fold(ignore)]
    pub sym: JsWord,
    pub type_ann: Option<TsTypeAnn>,
    /// TypeScript only. Used in case of an optional parameter.
    pub optional: bool,
}

impl Debug for Ident {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        f.debug_struct("Ident")
            .field("sym", &DebugUsingDisplay(&self.sym))
            .field("span", &self.span)
            .field("type_ann", &self.type_ann)
            .field("optional", &self.optional)
            .finish()
    }
}

#[ast_node]
pub struct PrivateName {
    pub span: Span,
    pub id: Ident,
}

impl AsRef<str> for Ident {
    fn as_ref(&self) -> &str {
        &self.sym
    }
}

struct DebugUsingDisplay<T: Display>(T);
impl<T: Display> Debug for DebugUsingDisplay<T> {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        Display::fmt(&self.0, f)
    }
}

impl Ident {
    pub const fn new(sym: JsWord, span: Span) -> Self {
        Ident {
            span,
            sym,
            type_ann: None,
            optional: false,
        }
    }
}

pub trait IdentExt: AsRef<str> {
    fn is_reserved_for_es3(&self) -> bool {
        [
            "abstract",
            "boolean",
            "break",
            "byte",
            "case",
            "catch",
            "char",
            "class",
            "const",
            "continue",
            "debugger",
            "default",
            "delete",
            "do",
            "double",
            "else",
            "enum",
            "export",
            "extends",
            "false",
            "final",
            "finally",
            "float",
            "for",
            "function",
            "goto",
            "if",
            "implements",
            "import",
            "in",
            "instanceof",
            "int",
            "interface",
            "long",
            "native",
            "new",
            "null",
            "package",
            "private",
            "protected",
            "public",
            "return",
            "short",
            "static",
            "super",
            "switch",
            "synchronized",
            "this",
            "throw",
            "throws",
            "transient",
            "true",
            "try",
            "typeof",
            "var",
            "void",
            "volatile",
            "while",
            "with",
        ]
        .contains(&self.as_ref())
    }

    fn is_reserved_only_for_es3(&self) -> bool {
        [
            "abstract",
            "boolean",
            "byte",
            "char",
            "double",
            "enum",
            "final",
            "float",
            "goto",
            "implements",
            "int",
            "interface",
            "long",
            "native",
            "package",
            "private",
            "protected",
            "public",
            "short",
            "static",
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
