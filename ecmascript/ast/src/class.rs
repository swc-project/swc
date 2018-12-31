use super::{
    Accessibility, Expr, ExprOrSpread, Function, Ident, PropName, TsExprWithTypeArgs, TsTypeAnn,
};
use swc_common::{ast_node, Fold, Span};

#[ast_node]
pub struct Class {
    pub span: Span,

    pub decorators: Vec<Decorator>,

    pub body: Vec<ClassMember>,
    pub super_class: Option<Box<Expr>>,

    /// Typescript extension.
    pub implements: Vec<TsExprWithTypeArgs>,
}

#[ast_node]
pub enum ClassMember {
    /// `es2015`
    Method(Method),
    /// stage 0 / Typescript
    ClassProp(ClassProp),
}

#[ast_node]
pub struct ClassProp {
    pub span: Span,

    pub key: Box<Expr>,
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

#[ast_node]
pub struct Method {
    pub span: Span,
    pub key: PropName,

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
pub struct PrivateName {
    pub span: Span,
    pub id: Ident,
}

#[ast_node]
pub struct Decorator {
    pub span: Span,

    pub expr: Box<Expr>,
    pub args: Option<Vec<ExprOrSpread>>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Fold)]
pub enum MethodKind {
    Constructor,
    Method,
    Getter,
    Setter,
}
