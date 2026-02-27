use swc_arena::Arena;

use crate::{
    Class, ClassId, ClassMember, ClassMemberId, Decl, DeclId, Expr, ExprId, Function, FunctionId,
    JSXElement, JSXElementId, ModuleDecl, ModuleDeclId, Pat, PatId, Program, ProgramId, Stmt,
    StmtId, TsType, TsTypeId,
};

/// Arena-backed storage for ES AST nodes.
#[derive(Debug, Default)]
pub struct AstStore {
    programs: Arena<Program>,
    stmts: Arena<Stmt>,
    decls: Arena<Decl>,
    pats: Arena<Pat>,
    exprs: Arena<Expr>,
    module_decls: Arena<ModuleDecl>,
    classes: Arena<Class>,
    class_members: Arena<ClassMember>,
    functions: Arena<Function>,
    jsx_elements: Arena<JSXElement>,
    ts_types: Arena<TsType>,
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

    /// Allocates a [`ModuleDecl`] node.
    #[inline]
    pub fn alloc_module_decl(&mut self, node: ModuleDecl) -> ModuleDeclId {
        self.module_decls.insert(node)
    }

    /// Allocates a [`Class`] node.
    #[inline]
    pub fn alloc_class(&mut self, node: Class) -> ClassId {
        self.classes.insert(node)
    }

    /// Allocates a [`ClassMember`] node.
    #[inline]
    pub fn alloc_class_member(&mut self, node: ClassMember) -> ClassMemberId {
        self.class_members.insert(node)
    }

    /// Allocates a [`Function`] node.
    #[inline]
    pub fn alloc_function(&mut self, node: Function) -> FunctionId {
        self.functions.insert(node)
    }

    /// Allocates a [`JSXElement`] node.
    #[inline]
    pub fn alloc_jsx_element(&mut self, node: JSXElement) -> JSXElementId {
        self.jsx_elements.insert(node)
    }

    /// Allocates a [`TsType`] node.
    #[inline]
    pub fn alloc_ts_type(&mut self, node: TsType) -> TsTypeId {
        self.ts_types.insert(node)
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

    /// Returns the [`ModuleDecl`] for `id`.
    #[inline]
    pub fn module_decl(&self, id: ModuleDeclId) -> Option<&ModuleDecl> {
        self.module_decls.get(id)
    }

    /// Returns the [`Class`] for `id`.
    #[inline]
    pub fn class(&self, id: ClassId) -> Option<&Class> {
        self.classes.get(id)
    }

    /// Returns the [`ClassMember`] for `id`.
    #[inline]
    pub fn class_member(&self, id: ClassMemberId) -> Option<&ClassMember> {
        self.class_members.get(id)
    }

    /// Returns the [`Function`] for `id`.
    #[inline]
    pub fn function(&self, id: FunctionId) -> Option<&Function> {
        self.functions.get(id)
    }

    /// Returns the [`JSXElement`] for `id`.
    #[inline]
    pub fn jsx_element(&self, id: JSXElementId) -> Option<&JSXElement> {
        self.jsx_elements.get(id)
    }

    /// Returns the [`TsType`] for `id`.
    #[inline]
    pub fn ts_type(&self, id: TsTypeId) -> Option<&TsType> {
        self.ts_types.get(id)
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

    /// Returns mutable [`ModuleDecl`] for `id`.
    #[inline]
    pub fn module_decl_mut(&mut self, id: ModuleDeclId) -> Option<&mut ModuleDecl> {
        self.module_decls.get_mut(id)
    }

    /// Returns mutable [`Class`] for `id`.
    #[inline]
    pub fn class_mut(&mut self, id: ClassId) -> Option<&mut Class> {
        self.classes.get_mut(id)
    }

    /// Returns mutable [`ClassMember`] for `id`.
    #[inline]
    pub fn class_member_mut(&mut self, id: ClassMemberId) -> Option<&mut ClassMember> {
        self.class_members.get_mut(id)
    }

    /// Returns mutable [`Function`] for `id`.
    #[inline]
    pub fn function_mut(&mut self, id: FunctionId) -> Option<&mut Function> {
        self.functions.get_mut(id)
    }

    /// Returns mutable [`JSXElement`] for `id`.
    #[inline]
    pub fn jsx_element_mut(&mut self, id: JSXElementId) -> Option<&mut JSXElement> {
        self.jsx_elements.get_mut(id)
    }

    /// Returns mutable [`TsType`] for `id`.
    #[inline]
    pub fn ts_type_mut(&mut self, id: TsTypeId) -> Option<&mut TsType> {
        self.ts_types.get_mut(id)
    }
}
