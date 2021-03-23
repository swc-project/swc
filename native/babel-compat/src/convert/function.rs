use super::Context;
use crate::ast::{
    common::Param as BabelParam,
    expr::FunctionExpression,
};
use crate::convert::Babelify;
use swc_ecma_ast::{Function, Param, ParamOrTsParamProp};
// use serde::{Serialize, Deserialize};

impl Babelify for Function {
    type Output = FunctionExpression;

    fn babelify(self, ctx: &Context) -> Self::Output {
        FunctionExpression {
            base: ctx.base(self.span),
            params: self.params.iter().map(|p| p.clone().babelify(ctx)).collect(), // TODO(dwoznick): clone()?
            body: self.body.unwrap().babelify(ctx), // TODO(dwoznick): unwrap()?
            generator: Some(self.is_generator),
            is_async: Some(self.is_async),
            type_parameters: self.type_params.map(|t| t.babelify(ctx).into()),
            return_type: self.return_type.map(|t| t.babelify(ctx).into()),
            id: None,
        }
    }
}

// /// Common parts of function and method.
// #[ast_node]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct Function {
//     pub params: Vec<Param>,
//
//     #[serde(default)]
//     pub decorators: Vec<Decorator>,
//
//     pub span: Span,
//
//     #[serde(default)]
//     pub body: Option<BlockStmt>,
//
//     /// if it's a generator.
//     #[serde(default, rename = "generator")]
//     pub is_generator: bool,
//
//     /// if it's an async function.
//     #[serde(default, rename = "async")]
//     pub is_async: bool,
//
//     #[serde(default, rename = "typeParameters")]
//     pub type_params: Option<TsTypeParamDecl>,
//
//     #[serde(default)]
//     pub return_type: Option<TsTypeAnn>,
// }

impl Babelify for Param {
    type Output = BabelParam;

    fn babelify(self, ctx: &Context) -> Self::Output {
        panic!("unimplemented"); // TODO(dwoznick): how to convert this??
    }
}

//
// #[ast_node("Parameter")]
// #[derive(Eq, Hash, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub struct Param {
//     pub span: Span,
//     pub decorators: Vec<Decorator>,
//     pub pat: Pat,
// }

impl Babelify for ParamOrTsParamProp {
    type Output = BabelParam;

    fn babelify(self, ctx: &Context) -> Self::Output {
        panic!("unimplemented"); // TODO(dwoznicki): how to conver this??
    }
}

//
// #[ast_node]
// #[derive(Eq, Hash, Is, EqIgnoreSpan)]
// #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
// pub enum ParamOrTsParamProp {
//     #[tag("TsParameterProperty")]
//     TsParamProp(TsParamProp),
//     #[tag("Parameter")]
//     Param(Param),
// }
