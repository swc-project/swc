use serde::{Deserialize, Serialize};
use serde_json::Value;
use swc_common::ast_serde;

use crate::{
    common::{
        Access, BaseNode, Decorator, Identifier, Param, PrivateName, SuperTypeParams,
        TypeAnnotOrNoop, TypeParamDeclOrNoop,
    },
    expr::{ClassExpression, Expression},
    flow::{ClassImplements, InterfaceExtends},
    object::ObjectKey,
    stmt::{BlockStatement, Statement},
    typescript::{TSDeclareMethod, TSExpressionWithTypeArguments, TSIndexSignature},
};

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum Class {
    #[tag("ClassExpression")]
    Expr(ClassExpression),
    #[tag("ClassDeclaration")]
    Decl(ClassDeclaration),
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ClassMethodKind {
    Get,
    Set,
    Method,
    Constructor,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("ClassMethod")]
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
    pub return_type: Option<Box<TypeAnnotOrNoop>>,
    #[serde(default)]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("ClassPrivateProperty")]
pub struct ClassPrivateProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: PrivateName,
    #[serde(default)]
    pub value: Option<Box<Expression>>,
    #[serde(default)]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(default, rename = "static")]
    pub static_any: Value,
    #[serde(default)]
    pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("ClassPrivateMethod")]
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
    pub return_type: Option<Box<TypeAnnotOrNoop>>,
    #[serde(default)]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("ClassProperty")]
pub struct ClassProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: ObjectKey,
    #[serde(default)]
    pub value: Option<Box<Expression>>,
    #[serde(default)]
    pub type_annotation: Option<Box<TypeAnnotOrNoop>>,
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

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("StaticBlock")]
pub struct StaticBlock {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub body: Vec<Statement>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ClassBodyEl {
    #[tag("ClassMethod")]
    Method(ClassMethod),
    #[tag("ClassPrivateMethod")]
    PrivateMethod(ClassPrivateMethod),
    #[tag("ClassProperty")]
    Prop(ClassProperty),
    #[tag("ClassPrivateProperty")]
    PrivateProp(ClassPrivateProperty),
    #[tag("TSDeclareMethod")]
    TSMethod(TSDeclareMethod),
    #[tag("TSIndexSignature")]
    TSIndex(TSIndexSignature),
    #[tag("StaticBlock")]
    StaticBlock(StaticBlock),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("ClassBody")]
pub struct ClassBody {
    #[serde(flatten)]
    pub base: BaseNode,
    #[serde(default)]
    pub body: Vec<ClassBodyEl>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ClassImpl {
    #[tag("TSExpressionWithTypeArguments")]
    TSExpr(TSExpressionWithTypeArguments),
    #[tag("ClassImplements")]
    Implements(ClassImplements),
}

impl From<TSExpressionWithTypeArguments> for ClassImpl {
    fn from(expr: TSExpressionWithTypeArguments) -> Self {
        ClassImpl::TSExpr(expr)
    }
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde("ClassDeclaration")]
pub struct ClassDeclaration {
    #[serde(flatten)]
    pub base: BaseNode,
    pub id: Identifier,
    #[serde(default)]
    pub super_class: Option<Box<Expression>>,
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

impl From<ClassExpression> for ClassDeclaration {
    fn from(expr: ClassExpression) -> Self {
        ClassDeclaration {
            base: expr.base,
            id: expr.id.unwrap(),
            super_class: expr.super_class.map(|s| Box::new(*s)),
            body: expr.body,
            decorators: expr.decorators,
            is_abstract: Default::default(),
            declare: Default::default(),
            implements: expr.implements,
            mixins: expr.mixins,
            super_type_parameters: expr.super_type_parameters,
            type_parameters: expr.type_parameters,
        }
    }
}
