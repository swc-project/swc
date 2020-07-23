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
    EmptyStmt,
};
use is_macro::Is;
use serde::{Deserialize, Serialize};
use swc_common::{ast_node, Span};

#[ast_node]
#[derive(Eq, Hash)]
pub struct Class {
    pub span: Span,

    #[serde(default)]
    pub decorators: Vec<Decorator>,

    #[serde(default)]
    pub body: Vec<ClassMember>,

    #[serde(default)]
    pub super_class: Option<Box<Expr>>,

    #[serde(default)]
    pub is_abstract: bool,

    #[serde(default)]
    pub type_params: Option<TsTypeParamDecl>,

    #[serde(default)]
    pub super_type_params: Option<TsTypeParamInstantiation>,

    /// Typescript extension.
    #[serde(default)]
    pub implements: Vec<TsExprWithTypeArgs>,
}

#[ast_node]
#[derive(Eq, Hash, Is)]
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
}

macro_rules! property {
    ($name:ident, $ty:literal, $KEY:ty) => {
        #[ast_node($ty)]
        #[derive(Eq, Hash)]
        pub struct $name {
            #[serde(default)]
            pub span: Span,

            pub key: $KEY,

            #[serde(default)]
            pub value: Option<Box<Expr>>,

            #[serde(default, rename = "typeAnnotation")]
            pub type_ann: Option<TsTypeAnn>,

            #[serde(default)]
            pub is_static: bool,

            #[serde(default)]
            pub decorators: Vec<Decorator>,

            #[serde(default)]
            pub computed: bool,

            /// Typescript extension.
            #[serde(default)]
            pub accessibility: Option<Accessibility>,

            /// Typescript extension.
            #[serde(default)]
            pub is_abstract: bool,

            #[serde(default)]
            pub is_optional: bool,

            #[serde(default)]
            pub readonly: bool,

            #[serde(default)]
            pub definite: bool,
        }
    };
}

property!(ClassProp, "ClassProperty", Box<Expr>);
property!(PrivateProp, "PrivateProperty", PrivateName);

macro_rules! method {
    ($name:ident, $ty:literal, $KEY:ty) => {
        #[ast_node($ty)]
        #[derive(Eq, Hash)]
        pub struct $name {
            #[serde(default)]
            pub span: Span,

            pub key: $KEY,

            pub function: Function,

            pub kind: MethodKind,

            #[serde(default)]
            pub is_static: bool,

            /// Typescript extension.
            #[serde(default)]
            pub accessibility: Option<Accessibility>,

            /// Typescript extension.
            #[serde(default)]
            pub is_abstract: bool,

            #[serde(default)]
            pub is_optional: bool,
        }
    };
}

method!(ClassMethod, "ClassMethod", PropName);
method!(PrivateMethod, "PrivateMethod", PrivateName);

#[ast_node("Constructor")]
#[derive(Eq, Hash)]
pub struct Constructor {
    pub span: Span,

    pub key: PropName,

    pub params: Vec<ParamOrTsParamProp>,

    #[serde(default)]
    pub body: Option<BlockStmt>,

    #[serde(default)]
    pub accessibility: Option<Accessibility>,

    #[serde(default)]
    pub is_optional: bool,
}

#[ast_node("Decorator")]
#[derive(Eq, Hash)]
pub struct Decorator {
    pub span: Span,

    #[serde(rename = "expression")]
    pub expr: Box<Expr>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub enum MethodKind {
    #[serde(rename = "method")]
    Method,
    #[serde(rename = "getter")]
    Getter,
    #[serde(rename = "setter")]
    Setter,
}
