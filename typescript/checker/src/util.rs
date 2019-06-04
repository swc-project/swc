use swc_ecma_ast::{ModuleDecl, ModuleItem, Stmt};

pub trait ModuleItemLike: StmtLike {
    fn try_into_module_decl(self) -> Result<ModuleDecl, Self> {
        Err(self)
    }
    fn try_from_module_decl(decl: ModuleDecl) -> Result<Self, ModuleDecl> {
        Err(decl)
    }
}

pub trait StmtLike: Sized {
    fn try_into_stmt(self) -> Result<Stmt, Self>;
    fn as_stmt(&self) -> Option<&Stmt>;
    fn from_stmt(stmt: Stmt) -> Self;
}

impl ModuleItemLike for Stmt {}

impl StmtLike for Stmt {
    fn try_into_stmt(self) -> Result<Stmt, Self> {
        Ok(self)
    }
    fn as_stmt(&self) -> Option<&Stmt> {
        Some(&self)
    }
    fn from_stmt(stmt: Stmt) -> Self {
        stmt
    }
}

impl ModuleItemLike for ModuleItem {
    fn try_into_module_decl(self) -> Result<ModuleDecl, Self> {
        match self {
            ModuleItem::ModuleDecl(decl) => Ok(decl),
            _ => Err(self),
        }
    }
    fn try_from_module_decl(decl: ModuleDecl) -> Result<Self, ModuleDecl> {
        Ok(ModuleItem::ModuleDecl(decl))
    }
}
impl StmtLike for ModuleItem {
    fn try_into_stmt(self) -> Result<Stmt, Self> {
        match self {
            ModuleItem::Stmt(stmt) => Ok(stmt),
            _ => Err(self),
        }
    }
    fn as_stmt(&self) -> Option<&Stmt> {
        match *self {
            ModuleItem::Stmt(ref stmt) => Some(stmt),
            _ => None,
        }
    }
    fn from_stmt(stmt: Stmt) -> Self {
        ModuleItem::Stmt(stmt)
    }
}
