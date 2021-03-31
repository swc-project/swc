use serde::{Serialize, Deserialize};

use crate::ast::{
    common::{BaseNode, SuperTypeParams},
    expr::{Expression},
    lit::{StringLiteral},
};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum JSX {
    #[serde(rename = "JSXAttribute")]
    Attr(JSXAttribute),
    #[serde(rename = "JSXClosingElement")]
    ClosingEl(JSXClosingElement),
    #[serde(rename = "JSXElement")]
    El(JSXElement),
    #[serde(rename = "JSXEmptyExpression")]
    EmptyExpr(JSXEmptyExpression),
    #[serde(rename = "JSXExpressionContainer")]
    ExprContainer(JSXExpressionContainer),
    #[serde(rename = "JSXSpreadChild")]
    SpreadChild(JSXSpreadChild),
    #[serde(rename = "JSXIdentifier")]
    Id(JSXIdentifier),
    #[serde(rename = "JSXMemberExpression")]
    MemberExpr(JSXMemberExpression),
    #[serde(rename = "JSXNamespacedName")]
    NamespacedName(JSXNamespacedName),
    #[serde(rename = "JSXOpeningElement")]
    OpeningEl(JSXOpeningElement),
    #[serde(rename = "JSXSpreadAttribute")]
    SpreadAttr(JSXSpreadAttribute),
    #[serde(rename = "JSXText")]
    Text(JSXText),
    #[serde(rename = "JSXFragment")]
    Fragment(JSXFragment),
    #[serde(rename = "JSXOpeningFragment")]
    OpeningFragment(JSXOpeningFragment),
    #[serde(rename = "JSXClosingFragment")]
    ClosingFragment(JSXClosingFragment),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum JSXAttrName {
    #[serde(rename = "JSXIdentifier")]
    Id(JSXIdentifier),
    #[serde(rename = "JSXNamespacedName")]
    Name(JSXNamespacedName),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum JSXAttrVal {
    #[serde(rename = "JSXElement")]
    Element(JSXElement),
    #[serde(rename = "JSXFragment")]
    Fragment(JSXFragment),
    #[serde(rename = "StringLiteral")]
    String(StringLiteral),
    #[serde(rename = "JSXExpressionContainer")]
    Expr(JSXExpressionContainer),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXAttribute {
    #[serde(flatten)]
    pub base: BaseNode,
    pub name: JSXAttrName,
    #[serde(default)]
    pub value: Option<JSXAttrVal>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXClosingElement {
    #[serde(flatten)]
    pub base: BaseNode,
    pub name: JSXElementName,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXEmptyExpression {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum JSXExprContainerExpr {
    #[serde(rename = "Expression")]
    Expr(Expression),
    #[serde(rename = "JSXEmptyExpression")]
    Empty(JSXEmptyExpression),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXExpressionContainer {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: JSXExprContainerExpr,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXSpreadChild {
    #[serde(flatten)]
    pub base: BaseNode,
    pub expression: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXIdentifier {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub name: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum JSXMemberExprObject {
    #[serde(rename = "JSXMemberExpression")]
    Expr(JSXMemberExpression),
    #[serde(rename = "JSXIdentifier")]
    Id(JSXIdentifier),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXMemberExpression {
    #[serde(flatten)]
    pub base: BaseNode,
    pub object: Box<JSXMemberExprObject>,
    pub property: JSXIdentifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXNamespacedName {
    #[serde(flatten)]
    pub base: BaseNode,
    pub namespace: JSXIdentifier,
    pub name: JSXIdentifier,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum JSXOpeningElAttr {
    #[serde(rename = "JSXAttribute")]
    Attr(JSXAttribute),
    #[serde(rename = "JSXSpreadAttribute")]
    Spread(JSXSpreadAttribute),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXSpreadAttribute {
    #[serde(flatten)]
    pub base: BaseNode,
    pub argument: Expression,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXText {
    #[serde(flatten)]
    pub base: BaseNode,
    pub value: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct JSXFragment {
    #[serde(flatten)]
    pub base: BaseNode,
    pub opening_fragment: JSXOpeningFragment,
    pub closing_fragment: JSXClosingFragment,
    #[serde(default)]
    pub children: Vec<JSXElementChild>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXOpeningFragment {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct JSXClosingFragment {
    #[serde(flatten)]
    pub base: BaseNode,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum JSXElementName {
    #[serde(rename = "JSXIdentifier")]
    Id(JSXIdentifier),
    #[serde(rename = "JSXMemberExpression")]
    Expr(JSXMemberExpression),
    #[serde(rename = "JSXNamespacedName")]
    Name(JSXNamespacedName),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub enum JSXElementChild {
    #[serde(rename = "JSXText")]
    Text(JSXText),
    #[serde(rename = "JSXExpressionContainer")]
    Expr(JSXExpressionContainer),
    #[serde(rename = "JSXSpreadChild")]
    Spread(JSXSpreadChild),
    #[serde(rename = "JSXElement")]
    Element(JSXElement),
    #[serde(rename = "JSXFragment")]
    Fragment(JSXFragment),
}

