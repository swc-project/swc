use crate::{Str, Text, Tokens};
use is_macro::Is;
use string_enum::StringEnum;
use swc_common::{ast_node, EqIgnoreSpan, Span};

#[ast_node("SelectorList")]
pub struct SelectorList {
    pub span: Span,
    pub children: Vec<ComplexSelector>,
}

#[ast_node("ComplexSelector")]
pub struct ComplexSelector {
    pub span: Span,
    pub children: Vec<ComplexSelectorChildren>,
}

#[ast_node]
#[derive(Is)]
pub enum ComplexSelectorChildren {
    #[tag("CompoundSelector")]
    CompoundSelector(CompoundSelector),
    #[tag("Combinator")]
    Combinator(Combinator),
}

/// e.g. `foo.c1.c2`
#[ast_node("CompoundSelector")]
pub struct CompoundSelector {
    pub span: Span,
    /// "&"
    pub nesting_selector: Option<NestingSelector>,
    pub type_selector: Option<TypeSelector>,
    pub subclass_selectors: Vec<SubclassSelector>,
}

#[ast_node("Combinator")]
pub struct Combinator {
    pub span: Span,
    pub value: CombinatorValue,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
pub enum CombinatorValue {
    /// ` `
    Descendant,

    /// `+`
    NextSibling,

    /// `>`
    Child,

    /// `~`
    LaterSibling,
}

#[ast_node("NestingSelector")]
pub struct NestingSelector {
    pub span: Span,
}

#[ast_node("TypeSelector")]
pub struct TypeSelector {
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

    #[tag("AttributeSelector")]
    Attr(AttrSelector),

    #[tag("PseudoClassSelector")]
    PseudoClass(PseudoClassSelector),

    #[tag("PseudoElementSelector")]
    PseudoElement(PseudoElementSelector),

    #[tag("AtSelector")]
    At(AtSelector),
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
pub enum AttrSelectorMatcher {
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

#[ast_node]
#[derive(Is)]
pub enum AttrSelectorValue {
    #[tag("String")]
    Str(Str),

    #[tag("Text")]
    Text(Text),
}

#[ast_node("AttributeSelector")]
pub struct AttrSelector {
    pub span: Span,
    pub prefix: Option<Text>,
    pub name: Text,
    pub matcher: Option<AttrSelectorMatcher>,
    pub value: Option<AttrSelectorValue>,
    pub modifier: Option<char>,
}

#[ast_node("PseudoClassSelector")]
pub struct PseudoClassSelector {
    pub span: Span,
    pub name: Text,
    pub args: Tokens,
}

#[ast_node("PseudoElementSelector")]
pub struct PseudoElementSelector {
    pub span: Span,
    pub name: Text,
    pub args: Tokens,
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
