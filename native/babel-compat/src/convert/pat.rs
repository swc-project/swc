use super::Context;
use crate::ast::{
    common::{LVal, PatternLike, RestElement, Identifier, Param},
    expr::Expression,
    object::{ObjectProperty, ObjectPropVal},
    pat::{
        Pattern, ArrayPattern, ObjectPattern, ObjectPatternProp, AssignmentPattern,
        AssignmentPatternLeft,
    },
};
use crate::convert::Babelify;
use swc_ecma_ast::{Pat, RestPat, ArrayPat, ObjectPat, ObjectPatProp, KeyValuePatProp, AssignPat};
use swc_common::Spanned;
use serde::{Serialize, Deserialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PatOutput {
    Id(Identifier),
    Array(ArrayPattern),
    Rest(RestElement),
    Object(ObjectPattern),
    Assign(AssignmentPattern),
    Expr(Expression),
}

impl From<PatOutput> for Pattern {
    fn from(pat: PatOutput) -> Self {
        match pat {
            PatOutput::Assign(a) => Pattern::Assignment(a),
            PatOutput::Array(a) => Pattern::Array(a),
            PatOutput::Object(o) => Pattern::Object(o),
            _ => panic!("illegal conversion"),
        }
    }
}

impl From<PatOutput> for ObjectPropVal {
    fn from(pat: PatOutput) -> Self {
        match pat {
            PatOutput::Expr(e) => ObjectPropVal::Expr(e),
            other => other.into(),
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
            PatOutput::Expr(_) => panic!("unimplemented"), // TODO(dwoznick): implement MemberExpression
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
            PatOutput::Expr(_) => panic!("illegal conversion"), // TODO(dwoznicki): how to handle?
        }
    }
}

impl From<PatOutput> for AssignmentPatternLeft {
    fn from(pat: PatOutput) -> Self {
        match pat {
            PatOutput::Id(i) => AssignmentPatternLeft::Id(i),
            PatOutput::Array(a) => AssignmentPatternLeft::Array(a),
            PatOutput::Rest(_) => panic!("illegal conversion"), // TODO(dwoznicki): how to handle?
            PatOutput::Object(o) => AssignmentPatternLeft::Object(o),
            PatOutput::Assign(_) => panic!("illegal conversion"), // TODO(dwoznicki): how to handle?
            PatOutput::Expr(_) => panic!("unimplemented"), // TODO(dwoznicki): implement MemberExpression
        }
    }
}

impl From<PatOutput> for Param {
    fn from(pat: PatOutput) -> Self {
        match pat {
            PatOutput::Id(i) => Param::Id(i),
            PatOutput::Rest(r) => Param::Rest(r),
            other => other.into(),
        }
    }
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
            Pat::Expr(e) => PatOutput::Expr(e.babelify(ctx).into()),
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
            properties: self.props.iter().map(|p| p.clone().babelify(ctx)).collect(), // TODO(dwoznick): is clone() best solution?
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
            ObjectPatProp::Assign(_) => panic!("unimplemented"), // TODO(dwoznicki): what is this supposed to represent?
            // #[tag("AssignmentPatternProperty")]
            // Assign(AssignPatProp),
        }
    }
}

impl Babelify for KeyValuePatProp {
    type Output = ObjectProperty;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ObjectProperty {
            base: ctx.base(self.span()),
            key: self.key.babelify(ctx).into(),
            value: self.value.babelify(ctx).into(),
            computed: Default::default(),
            shorthand: Default::default(),
            decorators: Default::default(),
        }
    }
}

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

impl Babelify for AssignPat {
    type Output = AssignmentPattern;

    fn babelify(self, ctx: &Context) -> Self::Output {
        AssignmentPattern {
            base: ctx.base(self.span),
            left: self.left.babelify(ctx).into(),
            right: self.right.babelify(ctx).into(),
            type_annotation: self.type_ann.map(|a| a.babelify(ctx).into()),
            decorators: Default::default(),
        }
    }
}

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
