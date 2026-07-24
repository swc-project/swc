use copyless::BoxHelper;
use swc_ecma_ast::{BindingIdent, Function, Ident, Param, ParamOrTsParamProp, Pat, TsThisParam};
use swc_estree_ast::{
    ArrayPattern, AssignmentPattern, FunctionExpression, Identifier, ObjectPattern,
    Param as BabelParam, Pattern, RestElement,
};

use crate::babelify::{Babelify, Context};

/// Converts a `this` parameter without widening the identifier's token span.
fn babelify_ts_this_param(param: TsThisParam, ctx: &Context) -> BabelParam {
    BabelParam::Id(
        BindingIdent {
            id: Ident::new_no_ctxt("this".into(), param.this_span),
            type_ann: param.type_ann,
        }
        .babelify(ctx),
    )
}

pub(super) fn babelify_function_params(
    this_param: Option<Box<TsThisParam>>,
    params: Vec<Param>,
    ctx: &Context,
) -> Vec<BabelParam> {
    let mut output = Vec::with_capacity(params.len() + usize::from(this_param.is_some()));
    if let Some(this_param) = this_param {
        output.push(babelify_ts_this_param(*this_param, ctx));
    }
    output.extend(params.into_iter().map(|param| param.babelify(ctx)));
    output
}

impl Babelify for Function {
    type Output = FunctionExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        let params = babelify_function_params(self.this_param, self.params, ctx);

        FunctionExpression {
            base: ctx.base(self.span),
            params,
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
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}

impl Babelify for ParamOrTsParamProp {
    type Output = BabelParam;

    fn babelify(self, ctx: &Context) -> Self::Output {
        match self {
            ParamOrTsParamProp::TsParamProp(p) => BabelParam::TSProp(p.babelify(ctx)),
            ParamOrTsParamProp::Param(p) => p.babelify(ctx),
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}
