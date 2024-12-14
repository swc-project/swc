use is_macro::Is;
use swc_allocator::arena::{Box, Vec};
use swc_common::{
    arena::{ast_node, CloneIn, Take},
    EqIgnoreSpan, Span, SyntaxContext, DUMMY_SP,
};

use super::{
    expr::Expr,
    function::{Function, ParamOrTsParamProp},
    ident::PrivateName,
    prop::PropName,
    stmt::BlockStmt,
    typescript::{
        Accessibility, TsExprWithTypeArgs, TsIndexSignature, TsTypeAnn, TsTypeParamDecl,
        TsTypeParamInstantiation,
    },
    BigInt, ComputedPropName, EmptyStmt, Id, Ident, IdentName, Number,
};

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Class<'a> {
    pub span: Span,

    pub ctxt: SyntaxContext,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub decorators: Vec<'a, Decorator<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub body: Vec<'a, ClassMember<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub super_class: Option<Expr<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_abstract: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub type_params: Option<Box<'a, TsTypeParamDecl<'a>>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub super_type_params: Option<Box<'a, TsTypeParamInstantiation<'a>>>,

    /// Typescript extension.
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub implements: Vec<'a, TsExprWithTypeArgs<'a>>,
}

// impl Take for Class {
//     fn dummy() -> Self {
//         Class {
//             ..Default::default()
//         }
//     }
// }

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum ClassMember<'a> {
    // #[tag("Constructor")]
    Constructor(Box<'a, Constructor<'a>>),
    /// `es2015`
    // #[tag("ClassMethod")]
    Method(Box<'a, ClassMethod<'a>>),
    // #[tag("PrivateMethod")]
    PrivateMethod(Box<'a, PrivateMethod<'a>>),
    /// stage 0 / Typescript
    // #[tag("ClassProperty")]
    ClassProp(Box<'a, ClassProp<'a>>),
    // #[tag("PrivateProperty")]
    PrivateProp(Box<'a, PrivateProp<'a>>),
    // #[tag("TsIndexSignature")]
    TsIndexSignature(Box<'a, TsIndexSignature<'a>>),
    // #[tag("EmptyStatement")]
    Empty(Box<'a, EmptyStmt>),

    /// Stage 3
    // #[tag("StaticBlock")]
    StaticBlock(Box<'a, StaticBlock<'a>>),

    /// Stage 3
    // #[tag("AutoAccessor")]
    AutoAccessor(Box<'a, AutoAccessor<'a>>),
}

// impl Take for ClassMember {
//     fn dummy() -> Self {
//         ClassMember::Empty(EmptyStmt { span: DUMMY_SP })
//     }
// }

#[ast_node("ClassProperty")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ClassProp<'a> {
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub span: Span,

    pub key: PropName<'a>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub value: Option<Expr<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeAnnotation"))]
    pub type_ann: Option<Box<'a, TsTypeAnn<'a>>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_static: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub decorators: Vec<'a, Decorator<'a>>,

    /// Typescript extension.
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub accessibility: Option<Accessibility>,

    /// Typescript extension.
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_abstract: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_optional: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_override: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub readonly: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub declare: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub definite: bool,
}

#[ast_node("PrivateProperty")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct PrivateProp<'a> {
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub ctxt: SyntaxContext,

    pub key: PrivateName,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub value: Option<Expr<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeAnnotation"))]
    pub type_ann: Option<Box<'a, TsTypeAnn<'a>>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_static: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub decorators: Vec<'a, Decorator<'a>>,

    /// Typescript extension.
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub accessibility: Option<Accessibility>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_optional: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_override: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub readonly: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub definite: bool,
}

#[ast_node("ClassMethod")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ClassMethod<'a> {
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub span: Span,
    pub key: PropName<'a>,
    pub function: Box<'a, Function<'a>>,
    pub kind: MethodKind,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_static: bool,
    #[doc = r" Typescript extension."]
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub accessibility: Option<Accessibility>,
    #[doc = r" Typescript extension."]
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_abstract: bool,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_optional: bool,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_override: bool,
}

#[ast_node("PrivateMethod")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct PrivateMethod<'a> {
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub span: Span,
    pub key: PrivateName,
    pub function: Box<'a, Function<'a>>,
    pub kind: MethodKind,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_static: bool,
    #[doc = r" Typescript extension."]
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub accessibility: Option<Accessibility>,
    #[doc = r" Typescript extension."]
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_abstract: bool,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_optional: bool,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_override: bool,
}

#[ast_node("Constructor")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Constructor<'a> {
    pub span: Span,

    pub ctxt: SyntaxContext,

    pub key: PropName<'a>,

    pub params: Vec<'a, ParamOrTsParamProp<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub body: Option<BlockStmt<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub accessibility: Option<Accessibility>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_optional: bool,
}

#[ast_node("Decorator")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Decorator<'a> {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(rename = "expression"))]
    pub expr: Expr<'a>,
}

#[derive(Debug, Clone, CloneIn, Copy, PartialEq, Eq, Hash, EqIgnoreSpan, Default)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
#[cfg_attr(
    any(feature = "rkyv-impl"),
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv-impl", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv-impl", repr(u32))]
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
pub enum MethodKind {
    #[default]
    #[cfg_attr(feature = "serde-impl", serde(rename = "method"))]
    Method,
    #[cfg_attr(feature = "serde-impl", serde(rename = "getter"))]
    Getter,
    #[cfg_attr(feature = "serde-impl", serde(rename = "setter"))]
    Setter,
}

#[ast_node("StaticBlock")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct StaticBlock<'a> {
    pub span: Span,
    pub body: BlockStmt<'a>,
}

// impl Take for StaticBlock {
//     fn dummy() -> Self {
//         StaticBlock {
//             span: DUMMY_SP,
//             body: Take::dummy(),
//         }
//     }
// }

/// Either a private name or a public name.
#[ast_node]
#[derive(Is, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum Key<'a> {
    // #[tag("PrivateName")]
    Private(PrivateName),
    // #[tag("Identifier")]
    // #[tag("StringLiteral")]
    // #[tag("NumericLiteral")]
    // #[tag("Computed")]
    // #[tag("BigIntLiteral")]
    Public(PropName<'a>),
}

// bridge_from!(Key, IdentName, Ident);
// bridge_from!(Key, PropName, IdentName);
// bridge_from!(Key, PropName, Id);
// bridge_from!(Key, PropName, Number);
// bridge_from!(Key, PropName, ComputedPropName);
// bridge_from!(Key, PropName, BigInt);

// impl Take for Key {
//     fn dummy() -> Self {
//         Default::default()
//     }
// }

// impl Default for Key {
//     fn default() -> Self {
//         Key::Public(Default::default())
//     }
// }

#[ast_node("AutoAccessor")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct AutoAccessor<'a> {
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub span: Span,

    pub key: Key<'a>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub value: Option<Expr<'a>>,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeAnnotation"))]
    pub type_ann: Option<Box<'a, TsTypeAnn<'a>>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_static: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub decorators: Vec<'a, Decorator<'a>>,

    /// Typescript extension.
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub accessibility: Option<Accessibility>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_abstract: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_override: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub definite: bool,
}

// impl Take for AutoAccessor {
//     fn dummy() -> AutoAccessor {
//         AutoAccessor {
//             span: Take::dummy(),
//             key: Take::dummy(),
//             value: Take::dummy(),
//             type_ann: None,
//             is_static: false,
//             decorators: Take::dummy(),
//             accessibility: None,
//             is_abstract: false,
//             is_override: false,
//             definite: false,
//         }
//     }
// }
