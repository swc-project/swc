use crate::{Str, Text, Tokens};
use is_macro::Is;
use string_enum::StringEnum;
use swc_common::{ast_node, EqIgnoreSpan, Span};

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
pub enum SelectorCombinator {
    /// ` `
    Descendant,

    /// `+`
    NextSibling,

    /// `>`
    Child,

    /// `~`
    LaterSibling,
}

#[ast_node("ComplexSelector")]
pub struct ComplexSelector {
    pub span: Span,
    pub selectors: Vec<CompoundSelector>,
}

/// e.g. `foo.c1.c2`
#[ast_node("CompoundSelector")]
pub struct CompoundSelector {
    pub span: Span,

    /// "&"
    pub has_nest_prefix: bool,

    pub combinator: Option<SelectorCombinator>,

    pub type_selector: Option<NamespacedName>,

    pub subclass_selectors: Vec<SubclassSelector>,
}

#[ast_node("NamespacedName")]
pub struct NamespacedName {
    pub span: Span,
    ///	If present, this is an identifier or "*" and is followed by a "|"
    /// character
    pub prefix: Option<Text>,
    ///	This is an identifier or "*".
    pub name: Text,
}

#[ast_node]
#[derive(Is)]
pub enum SubclassSelector {
    #[tag("IdSelector")]
    Id(IdSelector),

    #[tag("ClassSelector")]
    Class(ClassSelector),

    #[tag("AttrributeSelctor")]
    Attr(AttrSelector),

    #[tag("PseudoClassSelector")]
    Pseudo(PseudoSelector),

    #[tag("AtSelector")]
    At(AtSelector),
}

#[ast_node("AttributeSelector")]
pub struct AttrSelector {
    pub span: Span,
    pub name: NamespacedName,
    pub op: Option<AttrSelectorOp>,
    pub value: Option<Str>,
    pub modifier: Option<char>,
}

#[ast_node("PseudoSelector")]
pub struct PseudoSelector {
    pub span: Span,
    pub is_element: bool,
    pub name: Text,
    pub args: Tokens,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
pub enum AttrSelectorOp {
    /// `=`
    Equals,

    /// `~=`
    Tilde,

    /// `|=`
    Bar,

    /// `^=`
    Caret,

    /// `$=`
    Dollar,

    /// `*=`
    Asterisk,
}

/// `*`
#[ast_node]
pub struct UniversalSelector {
    pub span: Span,
}

#[ast_node("IdSelector")]
pub struct IdSelector {
    pub span: Span,
    /// Does not include `#`
    pub text: Text,
}

#[ast_node("ClassSelector")]
pub struct ClassSelector {
    pub span: Span,
    /// Does not include `.`
    pub text: Text,
}

#[ast_node("TagSelector")]
pub struct TagSelector {
    pub span: Span,
    pub text: Text,
}

/// Type for `@top-center`. Allowwed in only some contexts.
#[ast_node("AtSelector")]
pub struct AtSelector {
    pub span: Span,
    pub text: Text,
}
