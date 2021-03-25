use super::Context;
// use crate::ast::{
//     common::{LVal, PatternLike, RestElement, Identifier},
//     object::{ObjectProperty, ObjectKey, ObjectPropVal},
//     pat::{ArrayPattern, ObjectPattern, ObjectPatternProp, AssignmentPattern},
// };
use crate::ast::{
    common::Identifier,
    expr::Expression,
    lit::{StringLiteral, NumericLiteral},
    object::{ObjectKey, ObjectProperty},
};
use crate::convert::Babelify;
use swc_ecma_ast::{Prop, PropName, ComputedPropName};
// use swc_common::Spanned;
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PropNameOutput {
    Id(Identifier),
    String(StringLiteral),
    Numeric(NumericLiteral),
    Computed(Expression),
}

impl From<PropNameOutput> for ObjectKey {
    fn from(p: PropNameOutput) -> Self {
        match p {
            PropNameOutput::Id(i) => ObjectKey::Id(i),
            PropNameOutput::String(s) => ObjectKey::String(s),
            PropNameOutput::Numeric(n) => ObjectKey::Numeric(n),
            PropNameOutput::Computed(c) => ObjectKey::Expr(c),
        }
    }
}

impl Babelify for PropName {
    type Output = PropNameOutput;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            PropName::Ident(i) => PropNameOutput::Id(i.babelify(ctx)),
            PropName::Str(s) => PropNameOutput::String(s.babelify(ctx)),
            PropName::Num(n) => PropNameOutput::Numeric(n.babelify(ctx)),
            PropName::Computed(c) => PropNameOutput::Computed(c.babelify(ctx)),
            PropName::BigInt(_) => panic!("illegal conversion"), // TODO(dwoznick): how to handle?
        }
    }
}

// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum PropName {
//     #[tag("Identifier")]
//     Ident(Ident),
//     /// String literal.
//     #[tag("StringLiteral")]
//     Str(Str),
//     /// Numeric literal.
//     #[tag("NumericLiteral")]
//     Num(Number),
//     #[tag("Computed")]
//     Computed(ComputedPropName),
//     #[tag("BigInt")]
//     BigInt(BigInt),
// }
//

// TODO(dwoznicki): implement
impl Babelify for Prop {
    type Output = ObjectProperty;

    fn babelify(self, ctx: &Context) -> Self::Output {
        panic!();
    }
}

// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum Prop {
//     /// `a` in `{ a, }`
//     #[tag("Identifier")]
//     Shorthand(Ident),
//
//     /// `key: value` in `{ key: value, }`
//     #[tag("KeyValueProperty")]
//     KeyValue(KeyValueProp),
//
//     /// This is **invalid** for object literal.
//     #[tag("AssignmentProperty")]
//     Assign(AssignProp),
//
//     #[tag("GetterProperty")]
//     Getter(GetterProp),
//
//     #[tag("SetterProperty")]
//     Setter(SetterProp),
//
//     #[tag("MethodProperty")]
//     Method(MethodProp),
// }
//
// #[ast_node("KeyValueProperty")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct KeyValueProp {
//     #[span(lo)]
//     pub key: PropName,
//
//     #[span(hi)]
//     pub value: Box<Expr>,
// }
//
// #[ast_node("AssignmentProperty")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct AssignProp {
//     #[span(lo)]
//     pub key: Ident,
//     #[span(hi)]
//     pub value: Box<Expr>,
// }
//
// #[ast_node("GetterProperty")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct GetterProp {
//     pub span: Span,
//     pub key: PropName,
//     #[serde(default, rename = "typeAnnotation")]
//     pub type_ann: Option<TsTypeAnn>,
//     #[serde(default)]
//     pub body: Option<BlockStmt>,
// }
// #[ast_node("SetterProperty")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct SetterProp {
//     pub span: Span,
//     pub key: PropName,
//     pub param: Pat,
//     #[serde(default)]
//     pub body: Option<BlockStmt>,
// }
// #[ast_node("MethodProperty")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct MethodProp {
//     pub key: PropName,
//
//     #[serde(flatten)]
//     #[span]
//     pub function: Function,
// }
//
// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum PropName {
//     #[tag("Identifier")]
//     Ident(Ident),
//     /// String literal.
//     #[tag("StringLiteral")]
//     Str(Str),
//     /// Numeric literal.
//     #[tag("NumericLiteral")]
//     Num(Number),
//     #[tag("Computed")]
//     Computed(ComputedPropName),
//     #[tag("BigInt")]
//     BigInt(BigInt),
// }

impl Babelify for ComputedPropName {
    type Output = Expression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        // TODO(dwoznicki): implement
        panic!("unimplemented");
    }
}

//
// #[ast_node("Computed")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct ComputedPropName {
//     /// Span including `[` and `]`.
//     pub span: Span,
//     #[serde(rename = "expression")]
//     pub expr: Box<Expr>,
// }
