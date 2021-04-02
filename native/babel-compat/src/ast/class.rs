use serde::{Serialize, Deserialize};
use serde_json::Value;

use crate::ast::{
    common::{
        BaseNode, Identifier, Access, Param, Decorator, PrivateName, TypeAnnotOrNoop,
        TypeParamDeclOrNoop, SuperTypeParams
    },
    expr::{Expression, ClassExpression},
    flow::{ClassImplements, InterfaceExtends},
    object::{ObjectKey},
    stmt::{BlockStatement},
    typescript::{TSDeclareMethod, TSIndexSignature, TSExpressionWithTypeArguments},
};

#[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(tag = "type")]
#[serde(untagged)]
pub enum Class {
    #[serde(rename = "ClassExpression")]
    Expr(ClassExpression),
    #[serde(rename = "ClassDeclaration")]
    Decl(ClassDeclaration),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ClassMethodKind {
    Get,
    Set,
    Method,
    Constructor,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ClassMethod {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub kind: Option<ClassMethodKind>,
    pub key: ObjectKey,
    #[serde(default)]
    pub params: Vec<Param>,
    pub body: BlockStatement,
    #[serde(default)]
    pub computed: Option<bool>,
    #[serde(default, rename = "static")]
    pub is_static: Option<bool>,
    #[serde(default)]
    pub generator: Option<bool>,
    #[serde(default, rename = "async")]
    pub is_async: Option<bool>,
    #[serde(default, rename = "abstract")]
    pub is_abstract: Option<bool>,
    #[serde(default)]
    pub access: Option<Access>,
    #[serde(default)]
    pub accessibility: Option<Access>,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub optional: Option<bool>,
    #[serde(default)]
    pub return_type: Option<TypeAnnotOrNoop>,
    #[serde(default)]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ClassPrivateProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: PrivateName,
    #[serde(default)]
    pub value: Option<Expression>,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default, rename = "static")]
    pub static_any: Value, // TODO: is this the right way to model any?
    #[serde(default)]
    pub type_annotation: Option<TypeAnnotOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ClassPrivateMethod {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub kind: Option<ClassMethodKind>,
    pub key: PrivateName,
    #[serde(default)]
    pub params: Vec<Param>,
    pub body: BlockStatement,
    #[serde(default, rename = "static")]
    pub is_static: Option<bool>,
    #[serde(default, rename = "abstract")]
    pub is_abstract: Option<bool>,
    #[serde(default)]
    pub access: Option<Access>,
    #[serde(default)]
    pub accessibility: Option<Access>,
    #[serde(default, rename = "async")]
    pub is_async: Option<bool>,
    #[serde(default)]
    pub computed: Option<bool>,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub generator: Option<bool>,
    #[serde(default)]
    pub optional: Option<bool>,
    #[serde(default)]
    pub return_type: Option<TypeAnnotOrNoop>,
    #[serde(default)]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ClassProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: ObjectKey,
    #[serde(default)]
    pub value: Option<Expression>,
    #[serde(default)]
    pub type_annotation: Option<TypeAnnotOrNoop>,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default)]
    pub computed: Option<bool>,
    #[serde(default, rename = "static")]
    pub is_static: Option<bool>,
    #[serde(default, rename = "abstract")]
    pub is_abstract: Option<bool>,
    #[serde(default)]
    pub accessibility: Option<Access>,
    #[serde(default)]
    pub declare: Option<bool>,
    #[serde(default)]
    pub definite: Option<bool>,
    #[serde(default)]
    pub optional: Option<bool>,
    #[serde(default)]
    pub readonly: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(tag = "type")]
#[serde(untagged)]
pub enum ClassBodyEl {
    #[serde(rename = "ClassMethod")]
    Method(ClassMethod),
    #[serde(rename = "ClassPrivateMethod")]
    PrivateMethod(ClassPrivateMethod),
    #[serde(rename = "ClassProperty")]
    Prop(ClassProperty),
    #[serde(rename = "ClassPrivateProperty")]
    PrivateProp(ClassPrivateProperty),
    #[serde(rename = "TSDeclareMethod")]
    TSMethod(TSDeclareMethod),
    #[serde(rename = "TSIndexSignature")]
    TSIndex(TSIndexSignature),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type")]
pub struct ClassBody {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub body: Vec<ClassBodyEl>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(tag = "type")]
#[serde(untagged)]
pub enum ClassImpl {
    #[serde(rename = "TSExpressionWithTypeArguments")]
    TSExpr(TSExpressionWithTypeArguments),
    #[serde(rename = "ClassImplements")]
    Implements(ClassImplements),
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ClassDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub super_class: Option<Expression>,
    pub body: ClassBody,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default, rename = "abstract")]
    pub is_abstract: Option<bool>,
    #[serde(default)]
    pub declare: Option<bool>,
    #[serde(default)]
    pub implements: Option<Vec<ClassImpl>>,
    #[serde(default)]
    pub mixins: Option<InterfaceExtends>,
    #[serde(default)]
    pub super_type_parameters: Option<SuperTypeParams>,
    #[serde(default)]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
}

