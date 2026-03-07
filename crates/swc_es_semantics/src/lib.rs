//! High-performance semantics analysis for `swc_es_ast`.
//!
//! This crate provides a single-pass API to analyze scopes, symbols,
//! references, and per-root control-flow graphs from arena-backed ES AST.

#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]
#![deny(missing_docs)]

use std::hash::{Hash, Hasher};

use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_es_ast::{
    AstStore, ClassMemberId, Decl, DeclId, Expr, ExprId, FunctionId, ProgramId, Stmt, StmtId,
};

mod analyzer;
mod cfg;
mod sparse;

pub use cfg::{BasicBlock, BasicBlockKind, Cfg, CfgEdge, CfgEdgeKind};
use sparse::SparseIdMap;

macro_rules! define_id {
    ($name:ident, $doc:literal) => {
        #[doc = $doc]
        #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord)]
        pub struct $name(u32);

        impl $name {
            #[inline]
            pub(crate) fn from_index(index: usize) -> Self {
                Self(index as u32)
            }

            #[inline]
            #[allow(dead_code)]
            pub(crate) fn index(self) -> usize {
                self.0 as usize
            }

            /// Returns this id as `u32`.
            #[inline]
            pub fn as_u32(self) -> u32 {
                self.0
            }
        }
    };
}

define_id!(ScopeId, "Opaque identifier of a scope.");
define_id!(SymbolId, "Opaque identifier of a symbol.");
define_id!(ReferenceId, "Opaque identifier of a reference.");
define_id!(CfgId, "Opaque identifier of a CFG.");
define_id!(BlockId, "Opaque identifier of a CFG block.");

/// Scope category used by semantics analysis.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum ScopeKind {
    /// Program-level scope.
    Program,
    /// Function-like scope.
    Function,
    /// Lexical block scope.
    Block,
    /// Catch clause scope.
    Catch,
    /// Class body scope.
    Class,
}

/// Symbol declaration category.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum SymbolKind {
    /// `var`
    Var,
    /// `let`
    Let,
    /// `const`
    Const,
    /// Function declaration.
    Function,
    /// Class declaration.
    Class,
    /// Function parameter.
    Param,
    /// ESM import binding.
    Import,
    /// Catch parameter binding.
    CatchParam,
}

/// Reference usage category.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum ReferenceKind {
    /// Read-only reference.
    Read,
    /// Write-only reference.
    Write,
    /// Read-modify-write reference.
    ReadWrite,
}

/// CFG analysis root.
#[derive(Debug, Clone, Copy)]
pub enum CfgRoot {
    /// Program root.
    Program(ProgramId),
    /// Function root.
    Function(FunctionId),
    /// Function declaration root.
    FunctionDecl(DeclId),
    /// Arrow-expression root.
    Arrow(ExprId),
    /// Class static block root.
    ClassStaticBlock(ClassMemberId),
}

impl PartialEq for CfgRoot {
    fn eq(&self, other: &Self) -> bool {
        use CfgRoot::*;
        match (*self, *other) {
            (Program(a), Program(b)) => a.as_raw() == b.as_raw(),
            (Function(a), Function(b)) => a.as_raw() == b.as_raw(),
            (FunctionDecl(a), FunctionDecl(b)) => a.as_raw() == b.as_raw(),
            (Arrow(a), Arrow(b)) => a.as_raw() == b.as_raw(),
            (ClassStaticBlock(a), ClassStaticBlock(b)) => a.as_raw() == b.as_raw(),
            _ => false,
        }
    }
}

impl Eq for CfgRoot {}

impl Hash for CfgRoot {
    fn hash<H: Hasher>(&self, state: &mut H) {
        use CfgRoot::*;
        match *self {
            Program(id) => {
                0u8.hash(state);
                id.as_raw().hash(state);
            }
            Function(id) => {
                1u8.hash(state);
                id.as_raw().hash(state);
            }
            FunctionDecl(id) => {
                2u8.hash(state);
                id.as_raw().hash(state);
            }
            Arrow(id) => {
                3u8.hash(state);
                id.as_raw().hash(state);
            }
            ClassStaticBlock(id) => {
                4u8.hash(state);
                id.as_raw().hash(state);
            }
        }
    }
}

/// Scope metadata.
#[derive(Debug, Clone)]
pub struct ScopeData {
    /// Scope kind.
    pub kind: ScopeKind,
    /// Parent scope.
    pub parent: Option<ScopeId>,
    /// Function/program scope that lexically contains this scope.
    pub enclosing_function: ScopeId,
    /// Parent function/program scope if this scope is itself function/program.
    pub parent_function: Option<ScopeId>,
    /// Declared symbols in this scope.
    pub symbols: Vec<SymbolId>,
    /// `true` if this function/program scope contains direct `eval`/`with`.
    pub has_dynamic_lookup: bool,
}

/// Symbol metadata.
#[derive(Debug, Clone)]
pub struct SymbolData {
    /// Symbol category.
    pub kind: SymbolKind,
    /// Declaring scope.
    pub scope: ScopeId,
    /// Symbol name.
    pub name: Atom,
}

/// Reference metadata.
#[derive(Debug, Clone)]
pub struct ReferenceData {
    /// Reference category.
    pub kind: ReferenceKind,
    /// Scope where this reference appears.
    pub scope: ScopeId,
    /// Function/program scope that contains this reference.
    pub enclosing_function: ScopeId,
    /// Resolved symbol if any.
    pub symbol: Option<SymbolId>,
    /// Referenced name.
    pub name: Atom,
    /// Identifier expression node for expression references.
    pub expr: Option<ExprId>,
    /// `true` if resolution may be affected by dynamic scope (`eval`/`with`).
    pub maybe_dynamic: bool,
}

/// Complete semantics result for one program.
#[derive(Debug, Default)]
pub struct Semantics {
    pub(crate) scopes: Vec<ScopeData>,
    pub(crate) symbols: Vec<SymbolData>,
    pub(crate) references: Vec<ReferenceData>,
    pub(crate) cfgs: Vec<Cfg>,

    pub(crate) scope_by_stmt: SparseIdMap<Stmt, ScopeId>,
    pub(crate) scope_by_expr: SparseIdMap<Expr, ScopeId>,
    pub(crate) scope_by_decl: SparseIdMap<Decl, ScopeId>,
    pub(crate) symbol_by_expr_ident: SparseIdMap<Expr, SymbolId>,

    pub(crate) references_by_symbol: Vec<Vec<ReferenceId>>,
    pub(crate) cfg_by_root: FxHashMap<CfgRoot, CfgId>,
}

impl Semantics {
    /// Returns scope for a statement node.
    #[inline]
    pub fn scope_of_stmt(&self, id: StmtId) -> Option<ScopeId> {
        self.scope_by_stmt.get(id).copied()
    }

    /// Returns scope for an expression node.
    #[inline]
    pub fn scope_of_expr(&self, id: ExprId) -> Option<ScopeId> {
        self.scope_by_expr.get(id).copied()
    }

    /// Returns scope for a declaration node.
    #[inline]
    pub fn scope_of_decl(&self, id: DeclId) -> Option<ScopeId> {
        self.scope_by_decl.get(id).copied()
    }

    /// Returns resolved symbol for an identifier expression.
    #[inline]
    pub fn symbol_of_expr_ident(&self, id: ExprId) -> Option<SymbolId> {
        self.symbol_by_expr_ident.get(id).copied()
    }

    /// Returns references attached to a symbol.
    #[inline]
    pub fn references_of_symbol(&self, id: SymbolId) -> &[ReferenceId] {
        self.references_by_symbol
            .get(id.index())
            .map(Vec::as_slice)
            .unwrap_or(&[])
    }

    /// Returns symbol-to-reference adjacency.
    #[inline]
    pub fn symbol_references(&self) -> &[Vec<ReferenceId>] {
        &self.references_by_symbol
    }

    /// Returns CFG for a root.
    #[inline]
    pub fn cfg_of_root(&self, root: CfgRoot) -> Option<CfgId> {
        self.cfg_by_root.get(&root).copied()
    }

    /// Returns scope metadata.
    #[inline]
    pub fn scope(&self, id: ScopeId) -> Option<&ScopeData> {
        self.scopes.get(id.index())
    }

    /// Returns all scope entries.
    #[inline]
    pub fn scopes(&self) -> &[ScopeData] {
        &self.scopes
    }

    /// Returns symbol metadata.
    #[inline]
    pub fn symbol(&self, id: SymbolId) -> Option<&SymbolData> {
        self.symbols.get(id.index())
    }

    /// Returns all symbol entries.
    #[inline]
    pub fn symbols(&self) -> &[SymbolData] {
        &self.symbols
    }

    /// Returns reference metadata.
    #[inline]
    pub fn reference(&self, id: ReferenceId) -> Option<&ReferenceData> {
        self.references.get(id.index())
    }

    /// Returns all reference entries.
    #[inline]
    pub fn references(&self) -> &[ReferenceData] {
        &self.references
    }

    /// Returns CFG metadata.
    #[inline]
    pub fn cfg(&self, id: CfgId) -> Option<&Cfg> {
        self.cfgs.get(id.index())
    }

    /// Returns all CFG entries.
    #[inline]
    pub fn cfgs(&self) -> &[Cfg] {
        &self.cfgs
    }

    #[inline]
    pub(crate) fn alloc_scope(&mut self, data: ScopeData) -> ScopeId {
        let id = ScopeId::from_index(self.scopes.len());
        self.scopes.push(data);
        id
    }

    #[inline]
    pub(crate) fn alloc_symbol(&mut self, data: SymbolData) -> SymbolId {
        let id = SymbolId::from_index(self.symbols.len());
        self.symbols.push(data);
        self.references_by_symbol.push(Vec::new());
        id
    }

    #[inline]
    pub(crate) fn alloc_reference(&mut self, data: ReferenceData) -> ReferenceId {
        let id = ReferenceId::from_index(self.references.len());
        if let Some(symbol) = data.symbol {
            self.references_by_symbol[symbol.index()].push(id);
        }
        self.references.push(data);
        id
    }

    #[inline]
    pub(crate) fn alloc_cfg(&mut self, cfg: Cfg) -> CfgId {
        let id = CfgId::from_index(self.cfgs.len());
        self.cfg_by_root.insert(cfg.root, id);
        self.cfgs.push(cfg);
        id
    }

    pub(crate) fn mark_dynamic_if_needed(&mut self) {
        let mut memo: Vec<Option<bool>> = vec![None; self.scopes.len()];

        fn function_dynamic(
            sem: &Semantics,
            function_scope: ScopeId,
            memo: &mut [Option<bool>],
        ) -> bool {
            if let Some(cached) = memo[function_scope.index()] {
                return cached;
            }

            let scope = &sem.scopes[function_scope.index()];
            let mut dynamic = scope.has_dynamic_lookup;
            if let Some(parent_function) = scope.parent_function {
                dynamic |= function_dynamic(sem, parent_function, memo);
            }

            memo[function_scope.index()] = Some(dynamic);
            dynamic
        }

        for index in 0..self.references.len() {
            let function_scope = self.references[index].enclosing_function;
            let maybe_dynamic = function_dynamic(self, function_scope, &mut memo);
            self.references[index].maybe_dynamic = maybe_dynamic;
        }
    }
}

/// Analyze a program and return scopes, symbols, references and CFGs.
#[inline]
pub fn analyze_program(store: &AstStore, program: ProgramId) -> Semantics {
    let mut semantics = Semantics::default();
    analyzer::analyze_scopes(store, program, &mut semantics);
    semantics.mark_dynamic_if_needed();
    cfg::build_cfgs(store, program, &mut semantics);
    semantics
}
