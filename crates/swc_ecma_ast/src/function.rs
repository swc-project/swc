use is_macro::Is;
use swc_common::{ast_node, util::take::Take, EqIgnoreSpan, Span, DUMMY_SP};

use crate::{
    class::Decorator,
    pat::Pat,
    stmt::BlockStmt,
    typescript::{TsParamProp, TsTypeAnn, TsTypeParamDecl},
};

/// Common parts of function and method.
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Function {
    pub params: Vec<Param>,

    #[serde(default)]
    pub decorators: Vec<Decorator>,

    pub span: Span,

    #[serde(default)]
    pub body: Option<BlockStmt>,

    /// if it's a generator.
    #[serde(default, rename = "generator")]
    pub is_generator: bool,

    /// if it's an async function.
    #[serde(default, rename = "async")]
    pub is_async: bool,

    #[serde(default, rename = "typeParameters")]
    pub type_params: Option<Box<TsTypeParamDecl>>,

    #[serde(default)]
    pub return_type: Option<Box<TsTypeAnn>>,
}

impl Take for Function {
    fn dummy() -> Self {
        Function {
            params: Take::dummy(),
            decorators: Take::dummy(),
            span: DUMMY_SP,
            body: Take::dummy(),
            is_generator: false,
            is_async: false,
            type_params: Take::dummy(),
            return_type: Take::dummy(),
        }
    }
}

#[ast_node("Parameter")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Param {
    pub span: Span,
    #[serde(default)]
    pub decorators: Vec<Decorator>,
    pub pat: Pat,
}

impl From<Pat> for Param {
    fn from(pat: Pat) -> Self {
        Self {
            span: DUMMY_SP,
            decorators: Default::default(),
            pat,
        }
    }
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum ParamOrTsParamProp {
    #[tag("TsParameterProperty")]
    TsParamProp(TsParamProp),
    #[tag("Parameter")]
    Param(Param),
}
