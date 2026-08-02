use is_macro::Is;
use swc_common::{ast_node, util::take::Take, EqIgnoreSpan, Span, SyntaxContext, DUMMY_SP};

use crate::{
    class::Decorator,
    pat::Pat,
    stmt::{Directive, Stmt},
    typescript::{TsParamProp, TsThisParam, TsTypeAnn, TsTypeParamDecl},
};

/// Common parts of function and method.
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan, Default)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
#[cfg_attr(feature = "shrink-to-fit", derive(shrink_to_fit::ShrinkToFit))]
pub struct Function {
    /// TypeScript or Flow `this` parameter, which is not part of the runtime
    /// parameter list.
    #[cfg_attr(
        feature = "serde-impl",
        serde(default, rename = "thisParam", skip_serializing_if = "Option::is_none")
    )]
    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub this_param: Option<Box<TsThisParam>>,

    pub params: Vec<Param>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub decorators: Vec<Decorator>,

    pub span: Span,

    pub ctxt: SyntaxContext,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub body: Option<FunctionBody>,

    /// if it's a generator.
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "generator"))]
    pub is_generator: bool,

    /// if it's an async function.
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "async"))]
    pub is_async: bool,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeParameters"))]
    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub type_params: Option<Box<TsTypeParamDecl>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub return_type: Option<Box<TsTypeAnn>>,
}

impl Take for Function {
    fn dummy() -> Self {
        Function {
            ..Default::default()
        }
    }
}

/// The braced body of a function, method, constructor, or block-bodied arrow
/// function.
///
/// Unlike [`crate::BlockStmt`], a function body does not introduce an
/// additional block scope. Its statements are evaluated in the scope created
/// by the owning function-like node.
#[ast_node("FunctionBody")]
#[derive(Eq, Hash, EqIgnoreSpan, Default)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
#[cfg_attr(feature = "shrink-to-fit", derive(shrink_to_fit::ShrinkToFit))]
pub struct FunctionBody {
    /// Span including the braces.
    pub span: Span,

    /// Directive prologue.
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub directives: Vec<Directive>,

    pub stmts: Vec<Stmt>,
}

impl Take for FunctionBody {
    fn dummy() -> Self {
        FunctionBody {
            span: DUMMY_SP,
            directives: Vec::new(),
            stmts: Vec::new(),
        }
    }
}

#[ast_node("Parameter")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
#[cfg_attr(feature = "shrink-to-fit", derive(shrink_to_fit::ShrinkToFit))]
pub struct Param {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(default))]
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
#[cfg_attr(feature = "shrink-to-fit", derive(shrink_to_fit::ShrinkToFit))]
pub enum ParamOrTsParamProp {
    #[tag("TsParameterProperty")]
    TsParamProp(TsParamProp),
    #[tag("Parameter")]
    Param(Param),
}
