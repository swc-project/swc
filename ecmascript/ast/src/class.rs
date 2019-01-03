use crate::{
    expr::Expr,
    function::Function,
    ident::PrivateName,
    prop::PropName,
    typescript::{
        Accessibility, TsExprWithTypeArgs, TsTypeAnn, TsTypeParamDecl, TsTypeParamInstantiation,
    },
};
use swc_common::{ast_node, Fold, Span};

#[ast_node]
pub struct Class {
    pub span: Span,

    pub decorators: Vec<Decorator>,

    pub body: Vec<ClassMember>,
    pub super_class: Option<Box<Expr>>,

    pub is_abstract: bool,

    pub type_params: Option<TsTypeParamDecl>,
    pub super_type_params: Option<TsTypeParamInstantiation>,

    /// Typescript extension.
    pub implements: Vec<TsExprWithTypeArgs>,
}

#[ast_node]
pub enum ClassMember {
    /// `es2015`
    Method(Method),
    PrivateMethod(PrivateMethod),
    /// stage 0 / Typescript
    ClassProp(ClassProp),
    PrivateProp(PrivateProp),
}

pub type ClassProp = ClassProperty<Box<Expr>>;
pub type PrivateProp = ClassProperty<PrivateName>;

#[ast_node]
pub struct ClassProperty<K> {
    pub span: Span,

    #[fold(bound)]
    pub key: K,
    pub value: Option<Box<Expr>>,

    pub type_ann: Option<TsTypeAnn>,

    pub is_static: bool,
    pub decorators: Vec<Decorator>,

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

#[ast_node]
pub struct ClassMethod<K> {
    pub span: Span,
    #[fold(bound)]
    pub key: K,

    pub function: Function,

    #[fold(ignore)]
    pub kind: MethodKind,

    pub is_static: bool,

    /// Typescript extension.
    pub accessibility: Option<Accessibility>,
    /// Typescript extension.
    pub is_abstract: bool,
    pub is_optional: bool,
}

#[ast_node]
pub struct Decorator {
    pub span: Span,

    pub expr: Box<Expr>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Fold)]
pub enum MethodKind {
    Constructor,
    Method,
    Getter,
    Setter,
}
