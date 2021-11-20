use crate::{Ident, Str, Tokens};
use is_macro::Is;
use string_enum::StringEnum;
use swc_atoms::JsWord;
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
    pub prefix: Option<Ident>,
    ///	This is an identifier or "*".
    pub name: Ident,
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

    #[tag("Ident")]
    Ident(Ident),
}

#[ast_node("AttributeSelector")]
pub struct AttrSelector {
    pub span: Span,
    pub prefix: Option<Ident>,
    pub name: Ident,
    pub matcher: Option<AttrSelectorMatcher>,
    pub value: Option<AttrSelectorValue>,
    pub modifier: Option<char>,
}

#[ast_node]
#[derive(Is)]
pub enum PseudoSelectorChildren {
    #[tag("Nth")]
    Nth(Nth),

    #[tag("Tokens")]
    Tokens(Tokens),
}

#[ast_node("Nth")]
pub struct Nth {
    pub span: Span,
    pub nth: NthValue,
    pub selector_list: Option<SelectorList>,
}

#[ast_node("AnPlusB")]
pub struct AnPlusB {
    pub span: Span,
    pub a: Option<i32>,
    pub a_raw: Option<JsWord>,
    pub b: Option<i32>,
    pub b_raw: Option<JsWord>,
}

#[ast_node]
#[derive(Is)]
pub enum NthValue {
    #[tag("AnPlusB")]
    AnPlusB(AnPlusB),

    #[tag("Ident")]
    Ident(Ident),
}

#[ast_node("PseudoClassSelector")]
pub struct PseudoClassSelector {
    pub span: Span,
    pub name: Ident,
    pub children: Option<PseudoSelectorChildren>,
}

#[ast_node("PseudoElementSelector")]
pub struct PseudoElementSelector {
    pub span: Span,
    pub name: Ident,
    pub children: Option<Tokens>,
}

#[ast_node("IdSelector")]
pub struct IdSelector {
    pub span: Span,
    /// Does not include `#`
    pub text: Ident,
}

#[ast_node("ClassSelector")]
pub struct ClassSelector {
    pub span: Span,
    /// Does not include `.`
    pub text: Ident,
}

#[ast_node("TagSelector")]
pub struct TagSelector {
    pub span: Span,
    pub text: Ident,
}

/// Type for `@top-center`. Allowwed in only some contexts.
#[ast_node("AtSelector")]
pub struct AtSelector {
    pub span: Span,
    pub text: Ident,
}
