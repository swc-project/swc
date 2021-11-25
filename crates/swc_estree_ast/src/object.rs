use serde::{ser::SerializeMap, Deserialize, Serialize};
use swc_common::ast_serde;

use crate::{
    common::{
        BaseNode, Decorator, Identifier, Param, PatternLike, TypeAnnotOrNoop, TypeParamDeclOrNoop,
    },
    expr::Expression,
    flavor::Flavor,
    flow::{
        ObjectTypeCallProperty, ObjectTypeIndexer, ObjectTypeInternalSlot, ObjectTypeProperty,
        ObjectTypeSpreadProperty,
    },
    lit::{NumericLiteral, StringLiteral},
    stmt::BlockStatement,
};

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum UserWhitespacable {
    #[tag("ObjectMethod")]
    ObjectMethod(ObjectMethod),
    #[tag("ObjectProperty")]
    ObjectProperty(ObjectProperty),
    #[tag("ObjectTypeInternalSlot")]
    ObjectTypeInternalSlot(ObjectTypeInternalSlot),
    #[tag("ObjectTypeCallProperty")]
    ObjectTypeCallProperty(ObjectTypeCallProperty),
    #[tag("ObjectTypeIndexer")]
    ObjectTypeIndexer(ObjectTypeIndexer),
    #[tag("ObjectTypeProperty")]
    ObjectTypeProperty(ObjectTypeProperty),
    #[tag("ObjectTypeSpreadProperty")]
    ObjectTypeSpreadProperty(ObjectTypeSpreadProperty),
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ObjectMember {
    #[tag("ObjectMember")]
    Method(ObjectMethod),
    #[tag("ObjectProperty")]
    Prop(ObjectProperty),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum ObjectMethodKind {
    Method,
    Get,
    Set,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ObjectKey {
    #[tag("Identifier")]
    Id(Identifier),
    #[tag("StringLiteral")]
    String(StringLiteral),
    #[tag("NumericLiteral")]
    Numeric(NumericLiteral),
    #[tag("*")]
    Expr(Box<Expression>),
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "camelCase")]
#[serde(tag = "type")]
pub struct ObjectMethod {
    #[serde(flatten)]
    pub base: BaseNode,
    pub kind: ObjectMethodKind,
    pub key: ObjectKey,
    #[serde(default)]
    pub params: Vec<Param>,
    pub body: BlockStatement,
    #[serde(default)]
    pub computed: bool,
    #[serde(default)]
    pub generator: Option<bool>,
    #[serde(default, rename = "async")]
    pub is_async: Option<bool>,
    #[serde(default)]
    pub decorator: Option<Vec<Decorator>>,
    #[serde(default)]
    pub return_type: Option<Box<TypeAnnotOrNoop>>,
    #[serde(default)]
    pub type_parameters: Option<TypeParamDeclOrNoop>,
}

#[derive(Debug, Clone, PartialEq)]
#[ast_serde]
pub enum ObjectPropVal {
    #[tag("Identifier")]
    #[tag("RestElement")]
    #[tag("AssignmentPattern")]
    #[tag("ArrayPattern")]
    #[tag("ObjectPattern")]
    Pattern(PatternLike),
    #[tag("*")]
    Expr(Box<Expression>),
}

#[derive(Debug, Clone, Deserialize, PartialEq)]
pub struct ObjectProperty {
    #[serde(flatten)]
    pub base: BaseNode,
    pub key: ObjectKey,
    pub value: ObjectPropVal,
    #[serde(default)]
    pub computed: bool,
    #[serde(default)]
    pub shorthand: bool,
    #[serde(default, skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    pub decorators: Option<Vec<Decorator>>,
}

#[derive(Serialize)]
struct BabelObjectProperty<'a> {
    #[serde(flatten)]
    base: &'a BaseNode,
    key: &'a ObjectKey,
    value: &'a ObjectPropVal,
    computed: bool,
    shorthand: bool,
    #[serde(skip_serializing_if = "crate::flavor::Flavor::skip_none")]
    decorators: Option<&'a [Decorator]>,
}

impl Serialize for ObjectProperty {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        match Flavor::current() {
            Flavor::Babel => {
                let actual = BabelObjectProperty {
                    base: &self.base,
                    key: &self.key,
                    value: &self.value,
                    computed: self.computed,
                    shorthand: self.shorthand,
                    decorators: self.decorators.as_deref(),
                };
                actual.serialize(serializer)
            }
            Flavor::Acorn => {
                let mut s = serializer.serialize_map(None)?;

                {
                    // TODO: This is bad.
                    self.base
                        .serialize(serde::__private::ser::FlatMapSerializer(&mut s))?;
                }

                s.serialize_entry("type", "Property")?;
                s.serialize_entry("kind", "init")?;
                s.serialize_entry("method", &false)?;
                s.serialize_entry("shorthand", &false)?;
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
