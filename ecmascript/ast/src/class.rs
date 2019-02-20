use crate::{
    expr::Expr,
    function::{Function, PatOrTsParamProp},
    ident::PrivateName,
    prop::PropName,
    stmt::BlockStmt,
    typescript::{
        Accessibility, TsExprWithTypeArgs, TsIndexSignature, TsTypeAnn, TsTypeParamDecl,
        TsTypeParamInstantiation,
    },
};
use serde::{Deserialize, Serialize};
#[cfg(feature = "fold")]
use swc_common::Fold;
use swc_common::{ast_node, Span};

#[ast_node]
pub struct Class {
    #[serde(default)]
    pub span: Span,

    #[serde(default)]
    pub decorators: Vec<Decorator>,

    pub body: Vec<ClassMember>,

    #[serde(default)]
    pub super_class: Option<Box<Expr>>,

    pub is_abstract: bool,

    #[serde(default)]
    pub type_params: Option<TsTypeParamDecl>,

    #[serde(default)]
    pub super_type_params: Option<TsTypeParamInstantiation>,

    /// Typescript extension.
    pub implements: Vec<TsExprWithTypeArgs>,
}

#[ast_node]
pub enum ClassMember {
    Constructor(Constructor),
    /// `es2015`
    Method(Method),
    PrivateMethod(PrivateMethod),
    /// stage 0 / Typescript
    ClassProp(ClassProp),
    PrivateProp(PrivateProp),
    TsIndexSignature(TsIndexSignature),
}

pub type ClassProp = ClassProperty<Box<Expr>>;
pub type PrivateProp = ClassProperty<PrivateName>;

#[ast_node]
pub struct ClassProperty<K> {
    #[serde(default)]
    pub span: Span,

    #[cfg_attr(feature = "fold", fold(bound))]
    pub key: K,
    pub value: Option<Box<Expr>>,

    pub type_ann: Option<TsTypeAnn>,

    pub is_static: bool,
    #[serde(default)]
    pub decorators: Vec<Decorator>,
    pub computed: bool,

    /// Typescript extension.
    pub accessibility: Option<Accessibility>,
    /// Typescript extension.
    pub is_abstract: bool,
    pub is_optional: bool,

    pub readonly: bool,
    pub definite: bool,
}

pub type Method = ClassMethod<PropName>;
pub type PrivateMethod = ClassMethod<PrivateName>;

#[ast_node("Constructor")]
pub struct Constructor {
    #[serde(default)]
    pub span: Span,
    pub key: PropName,
    pub params: Vec<PatOrTsParamProp>,
    pub body: Option<BlockStmt>,
    pub accessibility: Option<Accessibility>,
    pub is_optional: bool,
}

#[ast_node]
pub struct ClassMethod<K> {
    #[serde(default)]
    pub span: Span,
    #[cfg_attr(feature = "fold", fold(bound))]
    pub key: K,

    pub function: Function,

    #[cfg_attr(feature = "fold", fold(ignore))]
    pub kind: MethodKind,

    pub is_static: bool,

    /// Typescript extension.
    pub accessibility: Option<Accessibility>,
    /// Typescript extension.
    pub is_abstract: bool,
    pub is_optional: bool,
}

#[ast_node("Decorator")]
pub struct Decorator {
    #[serde(default)]
    pub span: Span,

    pub expr: Box<Expr>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[cfg_attr(feature = "fold", derive(Fold))]
pub enum MethodKind {
    #[serde(rename = "method")]
    Method,
    #[serde(rename = "getter")]
    Getter,
    #[serde(rename = "setter")]
    Setter,
}
