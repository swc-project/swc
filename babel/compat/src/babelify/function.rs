use crate::babelify::{Babelify, Context};
use copyless::BoxHelper;
use swc_babel_ast::{
    ArrayPattern, AssignmentPattern, FunctionExpression, Identifier, ObjectPattern,
    Param as BabelParam, Pattern, RestElement,
};
use swc_ecma_ast::{Function, Param, ParamOrTsParamProp, Pat};

impl Babelify for Function {
    type Output = FunctionExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        FunctionExpression {
            base: ctx.base(self.span),
            params: self.params.babelify(ctx),
            body: self.body.unwrap().babelify(ctx),
            generator: Some(self.is_generator),
            is_async: Some(self.is_async),
            type_parameters: self.type_params.map(|t| t.babelify(ctx).into()),
            return_type: self
                .return_type
                .map(|t| Box::alloc().init(t.babelify(ctx).into())),
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
                decorators: Some(self.decorators.babelify(ctx)),
                ..i.babelify(ctx)
            }),
            Pat::Array(a) => BabelParam::Pat(Pattern::Array(ArrayPattern {
                base: ctx.base(self.span),
                decorators: Some(self.decorators.babelify(ctx)),
                ..a.babelify(ctx)
            })),
            Pat::Rest(r) => BabelParam::Rest(RestElement {
                base: ctx.base(self.span),
                decorators: Some(self.decorators.babelify(ctx)),
                ..r.babelify(ctx)
            }),
            Pat::Object(o) => BabelParam::Pat(Pattern::Object(ObjectPattern {
                base: ctx.base(self.span),
                decorators: Some(self.decorators.babelify(ctx)),
                ..o.babelify(ctx)
            })),
            Pat::Assign(a) => BabelParam::Pat(Pattern::Assignment(AssignmentPattern {
                base: ctx.base(self.span),
                decorators: Some(self.decorators.babelify(ctx)),
                ..a.babelify(ctx)
            })),
            Pat::Expr(_) => panic!(
                "illegal conversion: Cannot convert {:?} to BabelParam",
                &self.pat
            ),
            Pat::Invalid(_) => panic!(
                "illegal conversion: Cannot convert {:?} to BabelParam",
                &self.pat
            ),
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
