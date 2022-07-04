use swc_ecma_ast::VarDeclKind;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ScopeKind {
    Block,
    Fn,
}

impl Default for ScopeKind {
    fn default() -> Self {
        ScopeKind::Fn
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum IdentType {
    Binding,
    Ref,
    Label,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DeclKind {
    Lexical,
    Param,
    Var,
    Function,
    /// don't actually get stored
    Type,
}

impl From<VarDeclKind> for DeclKind {
    fn from(kind: VarDeclKind) -> Self {
        match kind {
            VarDeclKind::Const | VarDeclKind::Let => Self::Lexical,
            VarDeclKind::Var => Self::Var,
        }
    }
}
