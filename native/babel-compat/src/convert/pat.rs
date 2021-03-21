use super::Context;
use crate::ast::{
    common::{LVal, PatternLike, RestElement, Identifier},
    object::{ObjectProperty, ObjectKey, ObjectPropVal},
    pat::{ArrayPattern, ObjectPattern, ObjectPatternProp, AssignmentPattern},
};
use crate::convert::Babelify;
use swc_ecma_ast::{Pat, RestPat, ArrayPat, ObjectPat, ObjectPatProp, KeyValuePatProp};
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PatOutput {
    Id(Identifier),
    Array(ArrayPattern),
    Rest(RestElement),
    Object(ObjectPattern),
    Assign(AssignmentPattern),
}

impl Babelify for Pat {
    type Output = PatOutput;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            Pat::Ident(i) => PatOutput::Id(i.babelify(ctx)),
            Pat::Array(a) => PatOutput::Array(a.babelify(ctx)),
            Pat::Rest(r) => PatOutput::Rest(r.babelify(ctx)),
            Pat::Object(o) => PatOutput::Object(o.babelify(ctx)),
            Pat::Assign(a) => PatOutput::Assign(a.babelify(ctx)),
            Pat::Invalid(_) => panic!("unimplemnted"), // TODO(dwoznicki): find corresponding babel node
            Pat::Expr(_) => panic!("unimplemented"), // TODO(dwoznicki): find corresponding babel node
            _ => panic!()
        }
    }
}

impl From<PatOutput> for LVal {
    fn from(pat: PatOutput) -> Self {
        match pat {
            PatOutput::Id(i) => LVal::Id(i),
            PatOutput::Array(a) => LVal::ArrayPat(a),
            PatOutput::Rest(r) => LVal::RestEl(r),
            PatOutput::Object(o) => LVal::ObjectPat(o),
            PatOutput::Assign(a) => LVal::AssignmentPat(a),
        }
    }
}

impl From<PatOutput> for PatternLike {
    fn from(pat: PatOutput) -> Self {
        match pat {
            PatOutput::Id(i) => PatternLike::Id(i),
            PatOutput::Array(a) => PatternLike::ArrayPat(a),
            PatOutput::Rest(r) => PatternLike::RestEl(r),
            PatOutput::Object(o) => PatternLike::ObjectPat(o),
            PatOutput::Assign(a) => PatternLike::AssignmentPat(a),
        }
    }
}

impl Babelify for ArrayPat {
    type Output = ArrayPattern;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ArrayPattern {
            base: ctx.base(self.span),
            elements: self.elems.iter().map(|opt| opt.as_ref().map(|e| e.clone().babelify(ctx).into())).collect(), // TODO(dwoznicki): is clone() best solution?
            type_annotation: self.type_ann.map(|a| a.babelify(ctx).into()),
            decorators: Default::default(),
        }
    }
}

impl Babelify for ObjectPat {
    type Output = ObjectPattern;
    
    fn babelify(self, ctx: &Context) -> Self::Output {
        ObjectPattern {
            base: ctx.base(self.span),
            properties: self.props.iter().map(|p| p.babelify(ctx)).collect(),
            type_annotation: self.type_ann.map(|a| a.babelify(ctx).into()),
            decorators: Default::default(),
        }
    }
}

impl Babelify for ObjectPatProp {
    type Output = ObjectPatternProp;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            ObjectPatProp::KeyValue(p) => ObjectPatternProp::Prop(p.babelify(ctx)),
            ObjectPatProp::Rest(r) => ObjectPatternProp::Rest(r.babelify(ctx)),
            ObjectPatProp::Assign(_) => panic!("unimplemented"), // TODO(dwoznicki): find best babel node
        }
    }
}

impl Babelify for KeyValuePatProp {
    type Output = ObjectProperty;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ObjectProperty {
            base: ctx.base(self.span),
            key: self.key.babelify(ctx),
            value: self.value.babelify(ctx).into(),
            computed: Default::default(),
            shorthand: Default::default(),
            decorators: Default::default(),
        }
    }
}

// /// `{key: value}`
// #[ast_node("KeyValuePatternProperty")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct KeyValuePatProp {
//     #[span(lo)]
//     pub key: PropName,
//
//     #[span(hi)]
//     pub value: Box<Pat>,
// }

impl Babelify for RestPat {
    type Output = RestElement;

    fn babelify(self, ctx: &Context) -> Self::Output {
        RestElement {
            base: ctx.base(self.span),
            argument: Box::new(self.arg.babelify(ctx).into()),
            type_annotation: self.type_ann.map(|a| a.babelify(ctx).into()),
            decorators: Default::default(),
        }
    }
}

//
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct AssignPat {
//     pub span: Span,
//
//     pub left: Box<Pat>,
//
//     pub right: Box<Expr>,
//
//     #[serde(default, rename = "typeAnnotation")]
//     pub type_ann: Option<TsTypeAnn>,
// }
//
// /// EsTree `RestElement`
// #[ast_node("RestElement")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct RestPat {
//     pub span: Span,
//
//     #[serde(rename = "rest")]
//     pub dot3_token: Span,
//
//     #[serde(rename = "argument")]
//     pub arg: Box<Pat>,
//
//     #[serde(default, rename = "typeAnnotation")]
//     pub type_ann: Option<TsTypeAnn>,
// }
//
// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum ObjectPatProp {
//     #[tag("KeyValuePatternProperty")]
//     KeyValue(KeyValuePatProp),
//
//     #[tag("AssignmentPatternProperty")]
//     Assign(AssignPatProp),
//
//     #[tag("RestElement")]
//     Rest(RestPat),
// }
//
// /// `{key: value}`
// #[ast_node("KeyValuePatternProperty")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct KeyValuePatProp {
//     #[span(lo)]
//     pub key: PropName,
//
//     #[span(hi)]
//     pub value: Box<Pat>,
// }
// /// `{key}` or `{key = value}`
// #[ast_node("AssignmentPatternProperty")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct AssignPatProp {
//     pub span: Span,
//     pub key: Ident,
//
//     #[serde(default)]
//     pub value: Option<Box<Expr>>,
// }
//
