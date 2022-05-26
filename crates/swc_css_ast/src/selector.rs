use is_macro::Is;
use string_enum::StringEnum;
use swc_atoms::JsWord;
use swc_common::{ast_node, EqIgnoreSpan, Span};

use crate::{Delimiter, Ident, Str, TokenAndSpan};

#[ast_node("SelectorList")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct SelectorList {
    pub span: Span,
    pub children: Vec<ComplexSelector>,
}

#[ast_node("CompoundSelectorList")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct CompoundSelectorList {
    pub span: Span,
    pub children: Vec<CompoundSelector>,
}

#[ast_node("RelativeSelectorList")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct RelativeSelectorList {
    pub span: Span,
    pub children: Vec<RelativeSelector>,
}

#[ast_node("ComplexSelector")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct ComplexSelector {
    pub span: Span,
    pub children: Vec<ComplexSelectorChildren>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum ComplexSelectorChildren {
    #[tag("CompoundSelector")]
    CompoundSelector(CompoundSelector),
    #[tag("Combinator")]
    Combinator(Combinator),
}

#[ast_node("RelativeSelector")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct RelativeSelector {
    pub span: Span,
    pub combinator: Option<Combinator>,
    pub selector: ComplexSelector,
}

/// e.g. `foo.c1.c2`
#[ast_node("CompoundSelector")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct CompoundSelector {
    pub span: Span,
    /// "&"
    pub nesting_selector: Option<NestingSelector>,
    pub type_selector: Option<TypeSelector>,
    pub subclass_selectors: Vec<SubclassSelector>,
}

#[ast_node("Combinator")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Combinator {
    pub span: Span,
    pub value: CombinatorValue,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, Is, EqIgnoreSpan)]
pub enum CombinatorValue {
    /// ` `
    Descendant,

    /// `+`
    NextSibling,

    /// `>`
    Child,

    /// `~`
    LaterSibling,

    /// `||`
    Column,
}

#[ast_node("NestingSelector")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct NestingSelector {
    pub span: Span,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum TypeSelector {
    #[tag("TagNameSelector")]
    TagName(TagNameSelector),
    #[tag("UniversalSelector")]
    Universal(UniversalSelector),
}

#[ast_node("TagNameSelector")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct TagNameSelector {
    pub span: Span,
    pub name: WqName,
}

#[ast_node("UniversalSelector")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct UniversalSelector {
    pub span: Span,
    pub prefix: Option<NsPrefix>,
}

#[ast_node("NsPrefix")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct NsPrefix {
    pub span: Span,
    pub prefix: Option<Ident>,
}

#[ast_node("WqName")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct WqName {
    pub span: Span,
    pub prefix: Option<NsPrefix>,
    pub value: Ident,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum SubclassSelector {
    #[tag("IdSelector")]
    Id(IdSelector),

    #[tag("ClassSelector")]
    Class(ClassSelector),

    #[tag("AttributeSelector")]
    Attribute(AttributeSelector),

    #[tag("PseudoClassSelector")]
    PseudoClass(PseudoClassSelector),

    #[tag("PseudoElementSelector")]
    PseudoElement(PseudoElementSelector),
}

#[ast_node("IdSelector")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct IdSelector {
    pub span: Span,
    /// Does not include `#`
    pub text: Ident,
}

#[ast_node("ClassSelector")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct ClassSelector {
    pub span: Span,
    /// Does not include `.`
    pub text: Ident,
}

#[ast_node("AttributeSelector")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct AttributeSelector {
    pub span: Span,
    pub name: WqName,
    pub matcher: Option<AttributeSelectorMatcher>,
    pub value: Option<AttributeSelectorValue>,
    pub modifier: Option<AttributeSelectorModifier>,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, Is, EqIgnoreSpan)]
pub enum AttributeSelectorMatcherValue {
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

#[ast_node("AttributeSelectorMatcher")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct AttributeSelectorMatcher {
    pub span: Span,
    pub value: AttributeSelectorMatcherValue,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum AttributeSelectorValue {
    #[tag("String")]
    Str(Str),

    #[tag("Ident")]
    Ident(Ident),
}

#[ast_node("AttributeSelectorModifier")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct AttributeSelectorModifier {
    pub span: Span,
    pub value: Ident,
}

#[ast_node("PseudoClassSelector")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct PseudoClassSelector {
    pub span: Span,
    pub name: Ident,
    pub children: Option<Vec<PseudoClassSelectorChildren>>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum PseudoClassSelectorChildren {
    #[tag("TokenAndSpan")]
    PreservedToken(TokenAndSpan),

    #[tag("AnPlusB")]
    AnPlusB(AnPlusB),

    #[tag("Ident")]
    Ident(Ident),

    #[tag("Str")]
    Str(Str),

    #[tag("Delimiter")]
    Delimiter(Delimiter),

    #[tag("SelectorList")]
    SelectorList(SelectorList),

    #[tag("CompoundSelectorList")]
    CompoundSelectorList(CompoundSelectorList),

    #[tag("RelativeSelectorList")]
    RelativeSelectorList(RelativeSelectorList),

    #[tag("CompoundSelector")]
    CompoundSelector(CompoundSelector),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum AnPlusB {
    #[tag("Ident")]
    Ident(Ident),
    #[tag("AnPlusBNotation")]
    AnPlusBNotation(AnPlusBNotation),
}

#[ast_node("AnPlusBNotation")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct AnPlusBNotation {
    pub span: Span,
    pub a: Option<i32>,
    pub a_raw: Option<JsWord>,
    pub b: Option<i32>,
    pub b_raw: Option<JsWord>,
}

#[ast_node("PseudoElementSelector")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct PseudoElementSelector {
    pub span: Span,
    pub name: Ident,
    pub children: Option<Vec<PseudoElementSelectorChildren>>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum PseudoElementSelectorChildren {
    #[tag("TokenAndSpan")]
    PreservedToken(TokenAndSpan),
    #[tag("Ident")]
    Ident(Ident),
    #[tag("CompoundSelector")]
    CompoundSelector(CompoundSelector),
}
