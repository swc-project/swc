use crate::typescript::TsTypeAnn;
use serde::{Deserialize, Serialize};
use std::fmt::Display;
use swc_atoms::{js_word, JsWord};
use swc_common::{
    ast_node, util::take::Take, EqIgnoreSpan, Span, Spanned, SyntaxContext, DUMMY_SP,
};
use unicode_xid::UnicodeXID;

/// Identifier used as a pattern.
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

/// A complete identifier with span.
///
/// Identifier of swc consists of two parts. The first one is symbol, which is
/// stored using an interned string, [JsWord] . The second
/// one is [SyntaxContext][swc_common::SyntaxContext], which can be
/// used to distinguish identifier with same symbol.
///
/// Let me explain this with an example.
///
/// ```ts
/// let a = 5
/// {
///     let a = 3;
/// }
/// ```
/// In the code above, there are two variables with the symbol a.
///
///
/// Other compilers typically uses type like `Scope`, and store them nested, but
/// in rust, type like `Scope`  requires [Arc<Mutex<Scope>>] so swc uses
/// different approach. Instead of passing scopes, swc annotates two variables
/// with different tag, which is named
/// [SyntaxContext]. The notation for the syntax
/// context is #n where n is a number. e.g. `foo#1`
///
/// For the example above, after applying resolver pass, it becomes.
///
/// ```ts
/// let a#1 = 5
/// {
///     let a#2 = 3;
/// }
/// ```
///
/// Thanks to the `tag` we attached, we can now distinguish them.
///
/// ([JsWord], [SyntaxContext])
///
/// See [Id], which is a type alias for this.
///
/// This can be used to store all variables in a module to single hash map.
///
/// # Comparison
///
/// While comparing two identifiers, you can use `.to_id()`.
///
/// # HashMap
///
/// There's a type named [Id] which only contains minimal information to
/// distinguish identifiers.
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

impl Ident {
    /// Returns true if `c` is a valid character for an identifier start.
    pub fn is_valid_start(c: char) -> bool {
        c == '$' || c == '_' || c.is_ascii_alphabetic() || {
            if c.is_ascii() {
                false
            } else {
                UnicodeXID::is_xid_start(c)
            }
        }
    }

    /// Returns true if `c` is a valid character for an identifier part after
    /// start.
    pub fn is_valid_continue(c: char) -> bool {
        c == '$' || c == '_' || c == '\u{200c}' || c == '\u{200d}' || c.is_ascii_alphanumeric() || {
            if c.is_ascii() {
                false
            } else {
                UnicodeXID::is_xid_continue(c)
            }
        }
    }

    /// Alternative for `toIdentifier` of babel.
    ///
    /// Returns [Ok] if it's a valid identifier and [Err] if it's not valid.
    /// The returned [Err] contains the valid symbol.
    pub fn verify_symbol(s: &str) -> Result<(), String> {
        if s.is_reserved() || s.is_reserved_in_strict_mode(true) || s.is_reserved_in_strict_bind() {
            let mut buf = String::with_capacity(s.len() + 1);
            buf.push('_');
            buf.push_str(s);
            return Err(buf);
        }

        {
            let mut chars = s.chars();

            if let Some(first) = chars.next() {
                if Self::is_valid_start(first) {
                    if chars.all(Self::is_valid_continue) {
                        return Ok(());
                    }
                }
            }
        }

        let mut buf = String::with_capacity(s.len() + 2);
        let mut has_start = false;

        for c in s.chars() {
            if !has_start && Self::is_valid_start(c) {
                has_start = true;
                buf.push(c);
                continue;
            }

            if Self::is_valid_continue(c) {
                buf.push(c);
            }
        }

        if buf.is_empty() {
            buf.push('_');
        }

        Err(buf)
    }
}

/// See [Ident] for documentation.
pub type Id = (JsWord, SyntaxContext);

impl Take for Ident {
    fn dummy() -> Self {
        Ident::new(js_word!(""), DUMMY_SP)
    }
}

impl Display for Ident {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}{:?}", self.sym, self.span.ctxt)
    }
}

#[cfg(feature = "arbitrary")]
#[cfg_attr(docsrs, doc(cfg(feature = "arbitrary")))]
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
impl IdentExt for &'_ str {}
impl IdentExt for String {}
