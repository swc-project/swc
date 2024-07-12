use is_macro::Is;
use swc_atoms::Atom;
use swc_common::{ast_node, util::take::Take, EqIgnoreSpan, Span, DUMMY_SP};

use crate::{
    expr::{Expr, SpreadElement},
    ident::Ident,
    lit::Lit,
    typescript::TsTypeParamInstantiation,
    IdentName,
};

/// Used for `obj` property of `JSXMemberExpr`.
#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[allow(variant_size_differences)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum JSXObject {
    #[tag("JSXMemberExpression")]
    JSXMemberExpr(Box<JSXMemberExpr>),
    #[tag("Identifier")]
    Ident(Ident),
}

#[ast_node("JSXMemberExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXMemberExpr {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(rename = "object"))]
    pub obj: JSXObject,

    #[cfg_attr(feature = "serde-impl", serde(rename = "property"))]
    pub prop: IdentName,
}

/// XML-based namespace syntax:
#[ast_node("JSXNamespacedName")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXNamespacedName {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "namespace"))]
    pub ns: IdentName,
    pub name: IdentName,
}

#[ast_node("JSXEmptyExpression")]
#[derive(Eq, Hash, Copy, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXEmptyExpr {
    pub span: Span,
}

#[ast_node("JSXExpressionContainer")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXExprContainer {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "expression"))]
    pub expr: JSXExpr,
}

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[allow(variant_size_differences)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum JSXExpr {
    #[tag("JSXEmptyExpression")]
    JSXEmptyExpr(JSXEmptyExpr),
    #[tag("*")]
    Expr(Box<Expr>),
}

#[ast_node("JSXSpreadChild")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXSpreadChild {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "expression"))]
    pub expr: Box<Expr>,
}

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum JSXElementName {
    #[tag("Identifier")]
    Ident(Ident),
    #[tag("JSXMemberExpression")]
    JSXMemberExpr(JSXMemberExpr),
    #[tag("JSXNamespacedName")]
    JSXNamespacedName(JSXNamespacedName),
}

impl Take for JSXElementName {
    fn dummy() -> Self {
        JSXElementName::Ident(Take::dummy())
    }
}

#[ast_node("JSXOpeningElement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXOpeningElement {
    pub name: JSXElementName,

    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "attributes"))]
    pub attrs: Vec<JSXAttrOrSpread>,

    #[cfg_attr(feature = "serde-impl", serde(rename = "selfClosing"))]
    pub self_closing: bool,

    /// Note: This field's name is different from one from babel because it is
    /// misleading
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeArguments"))]
    pub type_args: Option<Box<TsTypeParamInstantiation>>,
}

impl Take for JSXOpeningElement {
    fn dummy() -> Self {
        JSXOpeningElement {
            name: Take::dummy(),
            span: DUMMY_SP,
            attrs: Take::dummy(),
            self_closing: Default::default(),
            type_args: Take::dummy(),
        }
    }
}

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[allow(variant_size_differences)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum JSXAttrOrSpread {
    #[tag("JSXAttribute")]
    JSXAttr(JSXAttr),
    #[tag("SpreadElement")]
    SpreadElement(SpreadElement),
}

#[ast_node("JSXClosingElement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXClosingElement {
    pub span: Span,
    pub name: JSXElementName,
}

#[ast_node("JSXAttribute")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXAttr {
    pub span: Span,
    pub name: JSXAttrName,
    /// Babel uses Expr instead of JSXAttrValue
    pub value: Option<JSXAttrValue>,
}

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum JSXAttrName {
    #[tag("Identifier")]
    Ident(IdentName),
    #[tag("JSXNamespacedName")]
    JSXNamespacedName(JSXNamespacedName),
}

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum JSXAttrValue {
    #[tag("StringLiteral")]
    #[tag("BooleanLiteral")]
    #[tag("NullLiteral")]
    #[tag("NumericLiteral")]
    #[tag("RegExpLiteral")]
    #[tag("JSXText")]
    Lit(Lit),

    #[tag("JSXExpressionContainer")]
    JSXExprContainer(JSXExprContainer),

    #[tag("JSXElement")]
    JSXElement(Box<JSXElement>),

    #[tag("JSXFragment")]
    JSXFragment(JSXFragment),
}

#[ast_node("JSXText")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct JSXText {
    pub span: Span,
    pub value: Atom,
    pub raw: Atom,
}

#[cfg(feature = "arbitrary")]
#[cfg_attr(docsrs, doc(cfg(feature = "arbitrary")))]
impl<'a> arbitrary::Arbitrary<'a> for JSXText {
    fn arbitrary(u: &mut arbitrary::Unstructured<'_>) -> arbitrary::Result<Self> {
        let span = u.arbitrary()?;
        let value = u.arbitrary::<String>()?.into();
        let raw = u.arbitrary::<String>()?.into();

        Ok(Self { span, value, raw })
    }
}

#[ast_node("JSXElement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXElement {
    pub span: Span,
    pub opening: JSXOpeningElement,
    pub children: Vec<JSXElementChild>,
    pub closing: Option<JSXClosingElement>,
}

impl Take for JSXElement {
    fn dummy() -> Self {
        JSXElement {
            span: DUMMY_SP,
            opening: Take::dummy(),
            children: Take::dummy(),
            closing: Take::dummy(),
        }
    }
}

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum JSXElementChild {
    #[tag("JSXText")]
    JSXText(JSXText),

    #[tag("JSXExpressionContainer")]
    JSXExprContainer(JSXExprContainer),

    #[tag("JSXSpreadChild")]
    JSXSpreadChild(JSXSpreadChild),

    #[tag("JSXElement")]
    JSXElement(Box<JSXElement>),

    #[tag("JSXFragment")]
    JSXFragment(JSXFragment),
}

#[ast_node("JSXFragment")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXFragment {
    pub span: Span,

    pub opening: JSXOpeningFragment,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub children: Vec<JSXElementChild>,

    pub closing: JSXClosingFragment,
}

impl Take for JSXFragment {
    fn dummy() -> Self {
        JSXFragment {
            span: DUMMY_SP,
            opening: Take::dummy(),
            children: Take::dummy(),
            closing: Take::dummy(),
        }
    }
}

#[ast_node("JSXOpeningFragment")]
#[derive(Eq, Hash, Copy, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXOpeningFragment {
    pub span: Span,
}

impl Take for JSXOpeningFragment {
    fn dummy() -> Self {
        JSXOpeningFragment { span: DUMMY_SP }
    }
}

#[ast_node("JSXClosingFragment")]
#[derive(Eq, Hash, Copy, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXClosingFragment {
    pub span: Span,
}

impl Take for JSXClosingFragment {
    fn dummy() -> Self {
        JSXClosingFragment { span: DUMMY_SP }
    }
}
