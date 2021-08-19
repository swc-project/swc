use crate::babelify::{Babelify, Context};
use copyless::BoxHelper;
use serde::{Deserialize, Serialize};
use swc_babel_ast::{
    ArrayPattern, AssignmentPattern, AssignmentPatternLeft, CatchClauseParam, Expression,
    Identifier, LVal, ObjectKey, ObjectPattern, ObjectPatternProp, ObjectPropVal, ObjectProperty,
    Param, Pattern, PatternLike, RestElement,
};
use swc_common::Spanned;
use swc_ecma_ast::{
    ArrayPat, AssignPat, AssignPatProp, KeyValuePatProp, ObjectPat, ObjectPatProp, Pat, RestPat,
};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum PatOutput {
    Id(Identifier),
    Array(ArrayPattern),
    Rest(RestElement),
    Object(ObjectPattern),
    Assign(AssignmentPattern),
    Expr(Box<Expression>),
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
            Pat::Expr(e) => PatOutput::Expr(Box::alloc().init(e.babelify(ctx).into())),
            Pat::Invalid(_) => panic!(
                "illegal conversion: Cannot convert {:?} to PatOutput",
                &self
            ),
        }
    }
}

impl From<PatOutput> for Pattern {
    fn from(pat: PatOutput) -> Self {
        match pat {
            PatOutput::Assign(a) => Pattern::Assignment(a),
            PatOutput::Array(a) => Pattern::Array(a),
            PatOutput::Object(o) => Pattern::Object(o),
            _ => panic!("illegal conversion: Cannot convert {:?} to Pattern", &pat),
        }
    }
}

impl From<PatOutput> for ObjectPropVal {
    fn from(pat: PatOutput) -> Self {
        match pat {
            PatOutput::Expr(e) => ObjectPropVal::Expr(e),
            other => ObjectPropVal::Pattern(other.into()),
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
            PatOutput::Expr(expr) => match *expr {
                Expression::Member(e) => LVal::MemberExpr(e),
                _ => panic!("illegal conversion: Cannot convert {:?} to LVal", &expr),
            },
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
            PatOutput::Expr(_) => panic!("illegal conversion: Cannot convert {:?} to LVal", &pat),
        }
    }
}

impl From<PatOutput> for AssignmentPatternLeft {
    fn from(pat: PatOutput) -> Self {
        match pat {
            PatOutput::Id(i) => AssignmentPatternLeft::Id(i),
            PatOutput::Array(a) => AssignmentPatternLeft::Array(a),
            PatOutput::Object(o) => AssignmentPatternLeft::Object(o),
            PatOutput::Expr(expr) => match *expr {
                Expression::Member(e) => AssignmentPatternLeft::Member(e),
                _ => panic!(
                    "illegal conversion: Cannot convert {:?} to AssignmentPatternLeft",
                    &expr
                ),
            },
            PatOutput::Rest(_) => panic!(
                "illegal conversion: Cannot convert {:?} to AssignmentPatternLeft",
                &pat
            ),
            PatOutput::Assign(_) => panic!(
                "illegal conversion: Cannot convert {:?} to AssignmentPatternLeft",
                &pat
            ),
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

impl From<PatOutput> for CatchClauseParam {
    fn from(pat: PatOutput) -> Self {
        match pat {
            PatOutput::Id(i) => CatchClauseParam::Id(i),
            PatOutput::Array(a) => CatchClauseParam::Array(a),
            PatOutput::Object(o) => CatchClauseParam::Object(o),
            _ => panic!(
                "illegal conversion: Cannot convert {:?} to CatchClauseParam",
                &pat
            ),
        }
    }
}

impl Babelify for ArrayPat {
    type Output = ArrayPattern;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ArrayPattern {
            base: ctx.base(self.span),
            elements: self
                .elems
                .into_iter()
                .map(|opt| opt.map(|e| e.babelify(ctx).into()))
                .collect(),
            type_annotation: self
                .type_ann
                .map(|a| Box::alloc().init(a.babelify(ctx).into())),
            decorators: Default::default(),
        }
    }
}

impl Babelify for ObjectPat {
    type Output = ObjectPattern;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ObjectPattern {
            base: ctx.base(self.span),
            properties: self.props.babelify(ctx),
            type_annotation: self
                .type_ann
                .map(|a| Box::alloc().init(a.babelify(ctx).into())),
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
            ObjectPatProp::Assign(a) => ObjectPatternProp::Prop(a.babelify(ctx)),
        }
    }
}

impl Babelify for KeyValuePatProp {
    type Output = ObjectProperty;

    fn babelify(self, ctx: &Context) -> Self::Output {
        ObjectProperty {
            base: ctx.base(self.span()),
            key: self.key.babelify(ctx),
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
            argument: Box::alloc().init(self.arg.babelify(ctx).into()),
            type_annotation: self
                .type_ann
                .map(|a| Box::alloc().init(a.babelify(ctx).into())),
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
            right: Box::alloc().init(self.right.babelify(ctx).into()),
            type_annotation: self
                .type_ann
                .map(|a| Box::alloc().init(a.babelify(ctx).into())),
            decorators: Default::default(),
        }
    }
}

impl Babelify for AssignPatProp {
    type Output = ObjectProperty;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let is_shorthand = self.value.is_none();
        ObjectProperty {
            base: ctx.base(self.span),
            key: ObjectKey::Id(self.key.clone().babelify(ctx)),
            value: if is_shorthand {
                ObjectPropVal::Pattern(PatternLike::Id(self.key.babelify(ctx)))
            } else {
                ObjectPropVal::Expr(Box::alloc().init(self.value.unwrap().babelify(ctx).into()))
            },
            shorthand: is_shorthand,
            computed: Default::default(),
            decorators: Default::default(),
        }
    }
}
