use super::Context;
use crate::ast::{
    common::{Param as BabelParam, Identifier, RestElement},
    expr::FunctionExpression,
    pat::{Pattern, ArrayPattern, ObjectPattern, AssignmentPattern},
};
use crate::convert::Babelify;
use swc_ecma_ast::{Function, Param, ParamOrTsParamProp, Pat};
// use serde::{Serialize, Deserialize};

impl Babelify for Function {
    type Output = FunctionExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        FunctionExpression {
            base: ctx.base(self.span),
            params: self.params.iter().map(|param| param.clone().babelify(ctx)).collect(),
            body: self.body.unwrap().babelify(ctx), // TODO(dwoznick): unwrap()?
            generator: Some(self.is_generator),
            is_async: Some(self.is_async),
            type_parameters: self.type_params.map(|t| t.babelify(ctx).into()),
            return_type: self.return_type.map(|t| t.babelify(ctx).into()),
            id: None,
        }
    }
}

impl Babelify for Param {
    type Output = BabelParam;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self.pat {
            Pat::Ident(i) => BabelParam::Id(Identifier {
                base: ctx.base(self.span),
                decorators: Some(self.decorators.iter().map(|dec| dec.clone().babelify(ctx)).collect()),
                ..i.babelify(ctx)
            }),
            Pat::Array(a) => BabelParam::Pat(Pattern::Array(ArrayPattern {
                base: ctx.base(self.span),
                decorators: Some(self.decorators.iter().map(|dec| dec.clone().babelify(ctx)).collect()),
                ..a.babelify(ctx)
            })),
            Pat::Rest(r) => BabelParam::Rest(RestElement {
                base: ctx.base(self.span),
                decorators: Some(self.decorators.iter().map(|dec| dec.clone().babelify(ctx)).collect()),
                ..r.babelify(ctx)
            }),
            Pat::Object(o) => BabelParam::Pat(Pattern::Object(ObjectPattern {
                base: ctx.base(self.span),
                decorators: Some(self.decorators.iter().map(|dec| dec.clone().babelify(ctx)).collect()),
                ..o.babelify(ctx)
            })),
            Pat::Assign(a) => BabelParam::Pat(Pattern::Assignment(AssignmentPattern {
                base: ctx.base(self.span),
                decorators: Some(self.decorators.iter().map(|dec| dec.clone().babelify(ctx)).collect()),
                ..a.babelify(ctx)
            })),
            Pat::Expr(_) => panic!("unimplemented"),
            Pat::Invalid(_) => panic!("illegal conversion"), // TODO(dwoznicki): how to handle?
        }
    }
}

impl Babelify for ParamOrTsParamProp {
    type Output = BabelParam;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            ParamOrTsParamProp::TsParamProp(p) => BabelParam::TSProp(p.babelify(ctx)),
            ParamOrTsParamProp::Param(p) => p.babelify(ctx),
        }
    }
}

