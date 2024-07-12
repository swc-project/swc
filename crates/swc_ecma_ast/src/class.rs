use is_macro::Is;
use swc_common::{ast_node, util::take::Take, EqIgnoreSpan, Span, SyntaxContext, DUMMY_SP};

use crate::{
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
#[derive(Eq, Hash, EqIgnoreSpan, Default)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Class {
    pub span: Span,

    pub ctxt: SyntaxContext,

    #[cfg_attr(c, serde(default))]
    pub decorators: Vec<Decorator>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub body: Vec<ClassMember>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub super_class: Option<Box<Expr>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_abstract: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub type_params: Option<Box<TsTypeParamDecl>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub super_type_params: Option<Box<TsTypeParamInstantiation>>,

    /// Typescript extension.
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub implements: Vec<TsExprWithTypeArgs>,
}

impl Take for Class {
    fn dummy() -> Self {
        Class {
            ..Default::default()
        }
    }
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum ClassMember {
    #[tag("Constructor")]
    Constructor(Constructor),
    /// `es2015`
    #[tag("ClassMethod")]
    Method(ClassMethod),
    #[tag("PrivateMethod")]
    PrivateMethod(PrivateMethod),
    /// stage 0 / Typescript
    #[tag("ClassProperty")]
    ClassProp(ClassProp),
    #[tag("PrivateProperty")]
    PrivateProp(PrivateProp),
    #[tag("TsIndexSignature")]
    TsIndexSignature(TsIndexSignature),
    #[tag("EmptyStatement")]
    Empty(EmptyStmt),

    /// Stage 3
    #[tag("StaticBlock")]
    StaticBlock(StaticBlock),

    /// Stage 3
    #[tag("AutoAccessor")]
    AutoAccessor(AutoAccessor),
}

impl Take for ClassMember {
    fn dummy() -> Self {
        ClassMember::Empty(EmptyStmt { span: DUMMY_SP })
    }
}

#[ast_node("ClassProperty")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct ClassProp {
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub span: Span,

    pub key: PropName,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub value: Option<Box<Expr>>,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeAnnotation"))]
    pub type_ann: Option<Box<TsTypeAnn>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_static: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub decorators: Vec<Decorator>,

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
pub struct PrivateProp {
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub ctxt: SyntaxContext,

    pub key: PrivateName,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub value: Option<Box<Expr>>,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeAnnotation"))]
    pub type_ann: Option<Box<TsTypeAnn>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_static: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub decorators: Vec<Decorator>,

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

macro_rules! method {
    ($name:ident, $ty:literal, $KEY:ty) => {
        #[ast_node($ty)]
        #[derive(Eq, Hash, EqIgnoreSpan)]
        #[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
        pub struct $name {
            #[cfg_attr(feature = "serde-impl", serde(default))]
            pub span: Span,

            pub key: $KEY,

            pub function: Box<Function>,

            pub kind: MethodKind,

            #[cfg_attr(feature = "serde-impl", serde(default))]
            pub is_static: bool,

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
        }
    };
}

method!(ClassMethod, "ClassMethod", PropName);
method!(PrivateMethod, "PrivateMethod", PrivateName);

#[ast_node("Constructor")]
#[derive(Eq, Hash, EqIgnoreSpan, Default)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Constructor {
    pub span: Span,

    pub ctxt: SyntaxContext,

    pub key: PropName,

    pub params: Vec<ParamOrTsParamProp>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub body: Option<BlockStmt>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub accessibility: Option<Accessibility>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_optional: bool,
}

#[ast_node("Decorator")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Decorator {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(rename = "expression"))]
    pub expr: Box<Expr>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
#[cfg_attr(
    any(feature = "rkyv-impl"),
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv-impl", archive(check_bytes))]
#[cfg_attr(feature = "rkyv-impl", archive_attr(repr(u32)))]
#[cfg_attr(feature = "serde-impl", derive(serde::Serialize, serde::Deserialize))]
pub enum MethodKind {
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
pub struct StaticBlock {
    pub span: Span,
    pub body: BlockStmt,
}

impl Take for StaticBlock {
    fn dummy() -> Self {
        StaticBlock {
            span: DUMMY_SP,
            body: Take::dummy(),
        }
    }
}

/// Either a private name or a public name.
#[ast_node]
#[derive(Is, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum Key {
    #[tag("PrivateName")]
    Private(PrivateName),
    #[tag("Identifier")]
    #[tag("StringLiteral")]
    #[tag("NumericLiteral")]
    #[tag("Computed")]
    #[tag("BigIntLiteral")]
    Public(PropName),
}

bridge_from!(Key, IdentName, Ident);
bridge_from!(Key, PropName, IdentName);
bridge_from!(Key, PropName, Id);
bridge_from!(Key, PropName, Number);
bridge_from!(Key, PropName, ComputedPropName);
bridge_from!(Key, PropName, BigInt);

impl Take for Key {
    fn dummy() -> Self {
        Key::Public(Take::dummy())
    }
}

#[ast_node("AutoAccessor")]
#[derive(Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct AutoAccessor {
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub span: Span,

    pub key: Key,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub value: Option<Box<Expr>>,

    #[cfg_attr(feature = "serde-impl", serde(default, rename = "typeAnnotation"))]
    pub type_ann: Option<Box<TsTypeAnn>>,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub is_static: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub decorators: Vec<Decorator>,

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

impl Take for AutoAccessor {
    fn dummy() -> AutoAccessor {
        AutoAccessor {
            span: Take::dummy(),
            key: Take::dummy(),
            value: Take::dummy(),
            type_ann: None,
            is_static: false,
            decorators: Take::dummy(),
            accessibility: None,
            is_abstract: false,
            is_override: false,
            definite: false,
        }
    }
}
