use swc_arena::Arena;

use crate::{Decl, DeclId, Expr, ExprId, Pat, PatId, Program, ProgramId, Stmt, StmtId};

/// Arena-backed storage for ES AST nodes.
#[derive(Debug, Default)]
pub struct AstStore {
    programs: Arena<Program>,
    stmts: Arena<Stmt>,
    decls: Arena<Decl>,
    pats: Arena<Pat>,
    exprs: Arena<Expr>,
}

impl AstStore {
    /// Allocates a [`Program`] node.
    #[inline]
    pub fn alloc_program(&mut self, node: Program) -> ProgramId {
        self.programs.insert(node)
    }

    /// Allocates a [`Stmt`] node.
    #[inline]
    pub fn alloc_stmt(&mut self, node: Stmt) -> StmtId {
        self.stmts.insert(node)
    }

    /// Allocates a [`Decl`] node.
    #[inline]
    pub fn alloc_decl(&mut self, node: Decl) -> DeclId {
        self.decls.insert(node)
    }

    /// Allocates a [`Pat`] node.
    #[inline]
    pub fn alloc_pat(&mut self, node: Pat) -> PatId {
        self.pats.insert(node)
    }

    /// Allocates an [`Expr`] node.
    #[inline]
    pub fn alloc_expr(&mut self, node: Expr) -> ExprId {
        self.exprs.insert(node)
    }

    /// Returns the [`Program`] for `id`.
    #[inline]
    pub fn program(&self, id: ProgramId) -> Option<&Program> {
        self.programs.get(id)
    }

    /// Returns the [`Stmt`] for `id`.
    #[inline]
    pub fn stmt(&self, id: StmtId) -> Option<&Stmt> {
        self.stmts.get(id)
    }

    /// Returns the [`Decl`] for `id`.
    #[inline]
    pub fn decl(&self, id: DeclId) -> Option<&Decl> {
        self.decls.get(id)
    }

    /// Returns the [`Pat`] for `id`.
    #[inline]
    pub fn pat(&self, id: PatId) -> Option<&Pat> {
        self.pats.get(id)
    }

    /// Returns the [`Expr`] for `id`.
    #[inline]
    pub fn expr(&self, id: ExprId) -> Option<&Expr> {
        self.exprs.get(id)
    }

    /// Returns mutable [`Program`] for `id`.
    #[inline]
    pub fn program_mut(&mut self, id: ProgramId) -> Option<&mut Program> {
        self.programs.get_mut(id)
    }

    /// Returns mutable [`Stmt`] for `id`.
    #[inline]
    pub fn stmt_mut(&mut self, id: StmtId) -> Option<&mut Stmt> {
        self.stmts.get_mut(id)
    }

    /// Returns mutable [`Decl`] for `id`.
    #[inline]
    pub fn decl_mut(&mut self, id: DeclId) -> Option<&mut Decl> {
        self.decls.get_mut(id)
    }

    /// Returns mutable [`Pat`] for `id`.
    #[inline]
    pub fn pat_mut(&mut self, id: PatId) -> Option<&mut Pat> {
        self.pats.get_mut(id)
    }

    /// Returns mutable [`Expr`] for `id`.
    #[inline]
    pub fn expr_mut(&mut self, id: ExprId) -> Option<&mut Expr> {
        self.exprs.get_mut(id)
    }
}
