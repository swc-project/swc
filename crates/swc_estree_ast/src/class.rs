use serde::{ser::SerializeMap, Deserialize, Serialize};
use serde_json::Value;
use swc_common::ast_serde;

use crate::{
    common::{
        Access, BaseNode, Decorator, Identifier, Param, PrivateName, SuperTypeParams,
        TypeAnnotOrNoop, TypeParamDeclOrNoop,
    },
    expr::{ClassExpression, Expression},
    flavor::Flavor,
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

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "lowercase")]
pub enum ClassMethodKind {
    Get,
    Set,
    Method,
    Constructor,
}

#[derive(Debug, Clone, PartialEq, Deserialize)]
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
    #[serde(
        default,
        rename = "static",
        skip_serializing_if = "crate::flavor::Flavor::skip_none_and_false"
    )]
    pub is_static: Option<bool>,
    #[serde(
        default,
        skip_serializing_if = "crate::flavor::Flavor::skip_none_and_false"
    )]
    pub generator: Option<bool>,
    #[serde(
        default,
        rename = "async",
        serialize_with = "crate::ser::serialize_as_bool"
    )]
    pub is_async: Option<bool>,
    #[serde(
        default,
        rename = "abstract",
        skip_serializing_if = "crate::flavor::Flavor::skip_none"
    )]
    pub is_abstract: Option<bool>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub access: Option<Access>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
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

#[derive(Serialize)]
struct BabelClassMethod<'a> {
    #[serde(rename = "type")]
    type_: &'a str,
    #[serde(flatten)]
    pub base: &'a BaseNode,
    #[serde(default)]
    pub kind: Option<ClassMethodKind>,
    pub key: &'a ObjectKey,
    #[serde(default)]
    pub params: &'a [Param],
    pub body: &'a BlockStatement,
    #[serde(default)]
    pub computed: Option<bool>,
    #[serde(
        default,
        rename = "static",
        skip_serializing_if = "crate::flavor::Flavor::skip_none_and_false"
    )]
    pub is_static: Option<bool>,
    #[serde(
        default,
        skip_serializing_if = "crate::flavor::Flavor::skip_none_and_false"
    )]
    pub generator: Option<bool>,
    #[serde(
        default,
        rename = "async",
        serialize_with = "crate::ser::serialize_as_bool"
    )]
    pub is_async: Option<bool>,
    #[serde(
        default,
        rename = "abstract",
        skip_serializing_if = "crate::flavor::Flavor::skip_none"
    )]
    pub is_abstract: Option<bool>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub access: Option<&'a Access>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub accessibility: Option<&'a Access>,
    #[serde(default)]
    pub decorators: Option<&'a [Decorator]>,
    #[serde(default)]
    pub optional: Option<bool>,
    #[serde(default)]
    pub return_type: Option<&'a TypeAnnotOrNoop>,
    #[serde(default)]
    pub type_parameters: Option<&'a TypeParamDeclOrNoop>,
}

#[derive(Serialize)]
struct AcornClassMethodValue<'a> {
    /// `FunctionExpression`
    #[serde(rename = "type")]
    type_: &'a str,
    #[serde(flatten)]
    base: &'a BaseNode,

    body: &'a BlockStatement,

    params: &'a [Param],

    generator: bool,
    #[serde(rename = "async")]
    is_async: bool,
}

impl Serialize for ClassMethod {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        match Flavor::current() {
            Flavor::Babel => {
                let actual = BabelClassMethod {
                    type_: "ClassMethod",
                    base: &self.base,
                    kind: self.kind,
                    key: &self.key,
                    params: &self.params,
                    body: &self.body,
                    computed: self.computed,
                    is_static: self.is_static,
                    generator: self.generator,
                    is_async: self.is_async,
                    is_abstract: self.is_abstract,
                    access: self.access.as_ref(),
                    accessibility: self.accessibility.as_ref(),
                    decorators: self.decorators.as_deref(),
                    optional: self.optional,
                    return_type: self.return_type.as_deref(),
                    type_parameters: self.type_parameters.as_ref(),
                };
                actual.serialize(serializer)
            }
            Flavor::Acorn { .. } => {
                let mut s = serializer.serialize_map(None)?;

                {
                    // TODO(kdy1): This is bad.
                    self.base
                        .serialize(serde::__private::ser::FlatMapSerializer(&mut s))?;
                }

                s.serialize_entry("type", "MethodDefinition")?;
                s.serialize_entry("computed", &self.computed.unwrap_or(false))?;
                s.serialize_entry("key", &self.key)?;
                s.serialize_entry("kind", &self.kind)?;
                s.serialize_entry("static", &self.is_static.unwrap_or(false))?;
                s.serialize_entry(
                    "value",
                    &AcornClassMethodValue {
                        type_: "FunctionExpression",
                        base: &self.body.base,
                        body: &self.body,
                        params: &self.params,
                        generator: self.generator.unwrap_or(false),
                        is_async: self.is_async.unwrap_or(false),
                    },
                )?;

                s.end()
            }
        }
    }
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

#[derive(Debug, Clone, PartialEq, Deserialize)]
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
#[derive(Serialize)]
struct BabelClassProperty<'a> {
    #[serde(rename = "type")]
    type_: &'static str,
    #[serde(flatten)]
    pub base: &'a BaseNode,
    pub key: &'a ObjectKey,
    #[serde(default)]
    pub value: Option<&'a Expression>,
    #[serde(default)]
    pub type_annotation: Option<&'a TypeAnnotOrNoop>,
    #[serde(default)]
    pub decorators: Option<&'a [Decorator]>,
    #[serde(default)]
    pub computed: Option<bool>,
    #[serde(default, rename = "static")]
    pub is_static: Option<bool>,
    #[serde(default, rename = "abstract")]
    pub is_abstract: Option<bool>,
    #[serde(default)]
    pub accessibility: Option<&'a Access>,
    #[serde(default)]
    pub declare: Option<bool>,
    #[serde(default)]
    pub definite: Option<bool>,
    #[serde(default)]
    pub optional: Option<bool>,
    #[serde(default)]
    pub readonly: Option<bool>,
}

impl Serialize for ClassProperty {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        match Flavor::current() {
            Flavor::Babel => {
                let actual = BabelClassProperty {
                    type_: "ClassProperty",
                    base: &self.base,
                    key: &self.key,
                    value: self.value.as_deref(),
                    type_annotation: self.type_annotation.as_deref(),
                    decorators: self.decorators.as_deref(),
                    computed: self.computed,
                    is_static: self.is_static,
                    is_abstract: self.is_abstract,
                    accessibility: self.accessibility.as_ref(),
                    declare: self.declare,
                    definite: self.definite,
                    optional: self.optional,
                    readonly: self.readonly,
                };
                actual.serialize(serializer)
            }
            Flavor::Acorn { .. } => {
                let mut s = serializer.serialize_map(None)?;

                {
                    // TODO(kdy1): This is bad.
                    self.base
                        .serialize(serde::__private::ser::FlatMapSerializer(&mut s))?;
                }

                s.serialize_entry("type", "PropertyDefinition")?;
                s.serialize_entry("static", &self.is_static)?;
                s.serialize_entry("key", &self.key)?;
                s.serialize_entry("value", &self.value)?;
                s.serialize_entry("computed", &self.computed)?;
                if let Some(decorators) = &self.decorators {
                    if !decorators.is_empty() {
                        s.serialize_entry("decorators", decorators)?;
                    }
                }
                s.serialize_entry("computed", &self.computed)?;

                s.end()
            }
        }
    }
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
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_empty")]
    pub decorators: Option<Vec<Decorator>>,
    #[serde(
        default,
        rename = "abstract",
        skip_serializing_if = "crate::ser::skip_typescript"
    )]
    pub is_abstract: Option<bool>,
    #[serde(default, skip_serializing_if = "crate::ser::skip_typescript")]
    pub declare: Option<bool>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_empty")]
    pub implements: Option<Vec<ClassImpl>>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub mixins: Option<InterfaceExtends>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub super_type_parameters: Option<SuperTypeParams>,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
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
