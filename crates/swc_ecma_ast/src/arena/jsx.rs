use is_macro::Is;
use swc_allocator::arena::{Allocator, Box, Vec};
use swc_atoms::Atom;
use swc_common::{arena::ast_node, arena::Take, EqIgnoreSpan, Span, DUMMY_SP};

use super::{
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
pub enum JSXObject<'a> {
    // #[tag("JSXMemberExpression")]
    JSXMemberExpr(Box<'a, JSXMemberExpr<'a>>),
    // #[tag("Identifier")]
    Ident(Box<'a, Ident>),
}

#[ast_node("JSXMemberExpression")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXMemberExpr<'a> {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(rename = "object"))]
    pub obj: JSXObject<'a>,

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
#[derive(Eq, Hash, Copy, Clone, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXEmptyExpr {
    pub span: Span,
}

#[ast_node("JSXExpressionContainer")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXExprContainer<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "expression"))]
    pub expr: JSXExpr<'a>,
}

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[allow(variant_size_differences)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum JSXExpr<'a> {
    // #[tag("JSXEmptyExpression")]
    JSXEmptyExpr(Box<'a, JSXEmptyExpr>),
    // #[tag("*")]
    Expr(Expr<'a>),
}

#[ast_node("JSXSpreadChild")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXSpreadChild<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(rename = "expression"))]
    pub expr: Expr<'a>,
}

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum JSXElementName<'a> {
    // #[tag("Identifier")]
    Ident(Box<'a, Ident>),
    // #[tag("JSXMemberExpression")]
    JSXMemberExpr(Box<'a, JSXMemberExpr<'a>>),
    // #[tag("JSXNamespacedName")]
    JSXNamespacedName(Box<'a, JSXNamespacedName>),
}

// impl Take for JSXElementName {
//     fn dummy() -> Self {
//         JSXElementName::Ident(Take::dummy())
//     }
// }

#[ast_node("JSXOpeningElement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXOpeningElement<'a> {
    pub name: JSXElementName<'a>,

    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "attributes"))]
    pub attrs: Vec<'a, JSXAttrOrSpread<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(rename = "selfClosing"))]
    pub self_closing: bool,

    /// Note: This field's name is different from one from babel because it is
    /// misleading
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeArguments"))]
    pub type_args: Option<Box<'a, TsTypeParamInstantiation<'a>>>,
}

// impl Take for JSXOpeningElement {
//     fn dummy() -> Self {
//         JSXOpeningElement {
//             name: Take::dummy(),
//             span: DUMMY_SP,
//             attrs: Take::dummy(),
//             self_closing: Default::default(),
//             type_args: Take::dummy(),
//         }
//     }
// }

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[allow(variant_size_differences)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum JSXAttrOrSpread<'a> {
    // #[tag("JSXAttribute")]
    JSXAttr(Box<'a, JSXAttr<'a>>),
    // #[tag("SpreadElement")]
    SpreadElement(Box<'a, SpreadElement<'a>>),
}

#[ast_node("JSXClosingElement")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXClosingElement<'a> {
    pub span: Span,
    pub name: JSXElementName<'a>,
}

#[ast_node("JSXAttribute")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXAttr<'a> {
    pub span: Span,
    pub name: JSXAttrName<'a>,
    /// Babel uses Expr instead of JSXAttrValue
    pub value: Option<JSXAttrValue<'a>>,
}

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum JSXAttrName<'a> {
    // #[tag("Identifier")]
    Ident(Box<'a, IdentName>),
    // #[tag("JSXNamespacedName")]
    JSXNamespacedName(Box<'a, JSXNamespacedName>),
}

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum JSXAttrValue<'a> {
    // #[tag("StringLiteral")]
    // #[tag("BooleanLiteral")]
    // #[tag("NullLiteral")]
    // #[tag("NumericLiteral")]
    // #[tag("RegExpLiteral")]
    // #[tag("JSXText")]
    Lit(Box<'a, Lit<'a>>),

    // #[tag("JSXExpressionContainer")]
    JSXExprContainer(Box<'a, JSXExprContainer<'a>>),

    // #[tag("JSXElement")]
    JSXElement(Box<'a, JSXElement<'a>>),

    // #[tag("JSXFragment")]
    JSXFragment(Box<'a, JSXFragment<'a>>),
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
pub struct JSXElement<'a> {
    pub span: Span,
    pub opening: JSXOpeningElement<'a>,
    pub children: Vec<'a, JSXElementChild<'a>>,
    pub closing: Option<JSXClosingElement<'a>>,
}

// impl Take for JSXElement {
//     fn dummy() -> Self {
//         JSXElement {
//             span: DUMMY_SP,
//             opening: Take::dummy(),
//             children: Take::dummy(),
//             closing: Take::dummy(),
//         }
//     }
// }

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum JSXElementChild<'a> {
    // #[tag("JSXText")]
    JSXText(Box<'a, JSXText>),

    // #[tag("JSXExpressionContainer")]
    JSXExprContainer(Box<'a, JSXExprContainer<'a>>),

    // #[tag("JSXSpreadChild")]
    JSXSpreadChild(Box<'a, JSXSpreadChild<'a>>),

    // #[tag("JSXElement")]
    JSXElement(Box<'a, JSXElement<'a>>),

    // #[tag("JSXFragment")]
    JSXFragment(Box<'a, JSXFragment<'a>>),
}

#[ast_node("JSXFragment")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXFragment<'a> {
    pub span: Span,

    pub opening: JSXOpeningFragment,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub children: Vec<'a, JSXElementChild<'a>>,

    pub closing: JSXClosingFragment,
}

// impl Take for JSXFragment {
//     fn dummy() -> Self {
//         JSXFragment {
//             span: DUMMY_SP,
//             opening: Take::dummy(),
//             children: Take::dummy(),
//             closing: Take::dummy(),
//         }
//     }
// }

#[ast_node("JSXOpeningFragment")]
#[derive(Eq, Hash, Copy, Clone, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXOpeningFragment {
    pub span: Span,
}

impl<'a> Take<'a> for JSXOpeningFragment {
    fn dummy(_: &'a Allocator) -> Self {
        JSXOpeningFragment { span: DUMMY_SP }
    }
}

#[ast_node("JSXClosingFragment")]
#[derive(Eq, Hash, Copy, Clone, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct JSXClosingFragment {
    pub span: Span,
}

impl<'a> Take<'a> for JSXClosingFragment {
    fn dummy(_: &'a Allocator) -> Self {
        JSXClosingFragment { span: DUMMY_SP }
    }
}
