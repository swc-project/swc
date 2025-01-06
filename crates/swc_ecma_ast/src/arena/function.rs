use is_macro::Is;
use swc_allocator::arena::{Box, Vec};
use swc_common::{
    arena::{ast_node, Take},
    EqIgnoreSpan, Span, SyntaxContext, DUMMY_SP,
};

use super::{
    class::Decorator,
    pat::Pat,
    stmt::BlockStmt,
    typescript::{TsParamProp, TsTypeAnn, TsTypeParamDecl},
};

/// Common parts of function and method.
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Function<'a> {
    pub params: Vec<'a, Param<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub decorators: Vec<'a, Decorator<'a>>,

    pub span: Span,

    pub ctxt: SyntaxContext,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub body: Option<BlockStmt<'a>>,

    /// if it's a generator.
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "generator"))]
    pub is_generator: bool,

    /// if it's an async function.
    #[cfg_attr(feature = "serde-impl", serde(default, rename = "async"))]
    pub is_async: bool,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeParameters"))]
    pub type_params: Option<Box<'a, TsTypeParamDecl<'a>>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub return_type: Option<Box<'a, TsTypeAnn<'a>>>,
}

impl<'a> Take<'a> for Function<'a> {
    fn dummy(alloc: &'a swc_allocator::arena::Allocator) -> Self {
        Self {
            params: Vec::new_in(alloc),
            decorators: Vec::new_in(alloc),
            span: DUMMY_SP,
            ctxt: SyntaxContext::default(),
            body: None,
            is_generator: false,
            is_async: false,
            type_params: None,
            return_type: None,
        }
    }
}

#[ast_node("Parameter")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Param<'a> {
    pub span: Span,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub decorators: Vec<'a, Decorator<'a>>,
    pub pat: Pat<'a>,
}

// impl<'a> FromWith<'a, Pat<'a>> for Param<'a> {
//     fn from_with(pat: Pat<'a>, allocator: &'a swc_allocator::Allocator) ->
// Self {         Self {
//             span: DUMMY_SP,
//             decorators: Vec::new_in(allocator),
//             pat,
//         }
//     }
// }

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum ParamOrTsParamProp<'a> {
    // #[tag("TsParameterProperty")]
    TsParamProp(Box<'a, TsParamProp<'a>>),
    // #[tag("Parameter")]
    Param(Box<'a, Param<'a>>),
}
