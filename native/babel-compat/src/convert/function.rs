use super::Context;
// use crate::ast::lit::{
//     Literal, BooleanLiteral, StringLiteral, NullLiteral, NumericLiteral, BigIntLiteral,
//     RegExpLiteral,
// };
// use crate::ast::jsx::JSXText as BabelJSXText;
use crate::ast::expr::FunctionExpression;
use crate::convert::Babelify;
// use swc_ecma_ast::{Lit, Str, Bool, Null, Number, BigInt, Regex, JSXText};
use swc_ecma_ast::{Function, Param, ParamOrTsParamProp};
// use serde::{Serialize, Deserialize};

// impl Babelify for Function {
//     // pub params: Vec<Param>,
//     // #[serde(default)]
//     // pub decorators: Vec<Decorator>,
//     // pub span: Span,
//     // #[serde(default)]
//     // pub body: Option<BlockStmt>,
//     // /// if it's a generator.
//     // #[serde(default, rename = "generator")]
//     // pub is_generator: bool,
//     // /// if it's an async function.
//     // #[serde(default, rename = "async")]
//     // pub is_async: bool,
//     // #[serde(default, rename = "typeParameters")]
//     // pub type_params: Option<TsTypeParamDecl>,
//     // #[serde(default)]
//     // pub return_type: Option<TsTypeAnn>,
//     type Output = FunctionExpression;
//     fn babelify(self, ctx: &Context) -> Self::Output {
//         FunctionExpression {
//             base: ctx.base(self.span),
//             id: _,
//             params: _,
//             body: _,
//             generator: Some(self.is_generator),
//             is_async: Some(self.is_async),
//             type_parameters: _,
//             return_type: _,
//         }
//     }
// }

impl Babelify for Param {
//     pub span: Span,
//     pub decorators: Vec<Decorator>,
//     pub pat: Pat,

    type Output = Option<String>;

    fn babelify(self, ctx: &Context) -> Self::Output {
        None
    }
}

impl Babelify for ParamOrTsParamProp {
//     #[tag("TsParameterProperty")]
//     TsParamProp(TsParamProp),
//     #[tag("Parameter")]
//     Param(Param),

    type Output = Option<String>;

    fn babelify(self, ctx: &Context) -> Self::Output {
        None
    }
}

