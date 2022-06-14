use swc_atoms::JsWord;
use swc_common::ast_serde;

use crate::{
    common::{BaseNode, Identifier, SuperTypeParams},
    expr::Expression,
    lit::StringLiteral,
};

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum JSX {
    #[tag("JSXAttribute")]
    Attr(JSXAttribute),
    #[tag("JSXClosingElement")]
    ClosingEl(JSXClosingElement),
    #[tag("JSXElement")]
    El(JSXElement),
    #[tag("JSXEmptyExpression")]
    EmptyExpr(JSXEmptyExpression),
    #[tag("JSXExpressionContainer")]
    ExprContainer(JSXExpressionContainer),
    #[tag("JSXSpreadChild")]
    SpreadChild(JSXSpreadChild),
    #[tag("JSXIdentifier")]
    Id(JSXIdentifier),
    #[tag("JSXMemberExpression")]
    MemberExpr(JSXMemberExpression),
    #[tag("JSXNamespacedName")]
    NamespacedName(JSXNamespacedName),
    #[tag("JSXOpeningElement")]
    OpeningEl(JSXOpeningElement),
    #[tag("JSXSpreadAttribute")]
    SpreadAttr(JSXSpreadAttribute),
    #[tag("JSXText")]
    Text(JSXText),
    #[tag("JSXFragment")]
    Fragment(JSXFragment),
    #[tag("JSXOpeningFragment")]
    OpeningFragment(JSXOpeningFragment),
    #[tag("JSXClosingFragment")]
    ClosingFragment(JSXClosingFragment),
}

#[derive(Debug, Clone, PartialEq, Eq)]
#[ast_serde]
pub enum JSXAttrName {
    #[tag("JSXIdentifier")]
    Id(JSXIdentifier),
    #[tag("JSXNamespacedName")]
    Name(JSXNamespacedName),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum JSXAttrVal {
    #[tag("JSXElement")]
    Element(JSXElement),
    #[tag("JSXFragment")]
    Fragment(JSXFragment),
    #[tag("StringLiteral")]
    String(StringLiteral),
    #[tag("JSXExpressionContainer")]
    Expr(JSXExpressionContainer),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("JSXAttribute")]
pub struct JSXAttribute {
    #[serde(flatten)]
    pub base: BaseNode,
    pub name: JSXAttrName,
    #[serde(default)]
    pub value: Option<JSXAttrVal>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("JSXClosingElement")]
pub struct JSXClosingElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub name: JSXElementName,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("JSXElement")]
pub struct JSXElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub opening_element: JSXOpeningElement,
    #[serde(default)]
    pub closing_element: Option<JSXClosingElement>,
    #[serde(default)]
    pub children: Vec<JSXElementChild>,
    #[serde(default)]
    pub self_closing: Option<bool>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
#[ast_serde("JSXEmptyExpression")]
pub struct JSXEmptyExpression {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum JSXExprContainerExpr {
    #[tag("JSXEmptyExpression")]
    Empty(JSXEmptyExpression),
    #[tag("*")]
    Expr(Box<Expression>),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("JSXExpressionContainer")]
pub struct JSXExpressionContainer {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: JSXExprContainerExpr,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("JSXSpreadChild")]
pub struct JSXSpreadChild {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Box<Expression>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
#[ast_serde("JSXIdentifier")]
pub struct JSXIdentifier {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub name: JsWord,
}

impl From<Identifier> for JSXIdentifier {
    fn from(id: Identifier) -> Self {
        JSXIdentifier {
            base: id.base,
            name: id.name,
        }
    }
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum JSXMemberExprObject {
    #[tag("JSXMemberExpression")]
    Expr(JSXMemberExpression),
    #[tag("JSXIdentifier")]
    Id(JSXIdentifier),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("JSXMemberExpression")]
pub struct JSXMemberExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object: Box<JSXMemberExprObject>,
    pub property: JSXIdentifier,
}

#[derive(Debug, Clone, PartialEq, Eq)]
#[ast_serde("JSXNamespacedName")]
pub struct JSXNamespacedName {
    #[serde(flatten)]
    pub base: BaseNode,
    pub namespace: JSXIdentifier,
    pub name: JSXIdentifier,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum JSXOpeningElAttr {
    #[tag("JSXAttribute")]
    Attr(JSXAttribute),
    #[tag("JSXSpreadAttribute")]
    Spread(JSXSpreadAttribute),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("JSXOpeningElement")]
pub struct JSXOpeningElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub name: JSXElementName,
    #[serde(default)]
    pub attributes: Vec<JSXOpeningElAttr>,
    #[serde(default)]
    pub self_closing: bool,
    #[serde(default)]
    pub type_parameters: Option<SuperTypeParams>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("JSXSpreadAttribute")]
pub struct JSXSpreadAttribute {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Box<Expression>,
}

// impl From<SpreadElement> for JSXSpreadAttribute {
//     fn from(spread: SpreadElement) -> Self {
//         JSXSpreadAttribute {
//             // base: spread.base.clone(),
//             base: spread.base,
//             argument: spread.argument,
//         }
//     }
// }

#[derive(Debug, Clone, PartialEq, Eq)]
#[ast_serde("JSXText")]
pub struct JSXText {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: JsWord,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("JSXFragment")]
pub struct JSXFragment {
    #[serde(flatten)]
    pub base: BaseNode,
    pub opening_fragment: JSXOpeningFragment,
    pub closing_fragment: JSXClosingFragment,
    #[serde(default)]
    pub children: Vec<JSXElementChild>,
}

#[derive(Debug, Clone, PartialEq, Eq)]
#[ast_serde("JSXOpeningFragment")]
pub struct JSXOpeningFragment {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, PartialEq, Eq)]
#[ast_serde("JSXClosingElement")]
pub struct JSXClosingFragment {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum JSXElementName {
    #[tag("JSXIdentifier")]
    Id(JSXIdentifier),
    #[tag("JSXMemberExpression")]
    Expr(JSXMemberExpression),
    #[tag("JSXNamespacedName")]
    Name(JSXNamespacedName),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum JSXElementChild {
    #[tag("JSXText")]
    Text(JSXText),
    #[tag("JSXExpressionContainer")]
    Expr(JSXExpressionContainer),
    #[tag("JSXSpreadChild")]
    Spread(JSXSpreadChild),
    #[tag("JSXElement")]
    Element(JSXElement),
    #[tag("JSXFragment")]
    Fragment(JSXFragment),
}
