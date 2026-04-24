//! Node-id based semantic analysis for `swc_ecma_ast`.
//!
//! [`NodeId`] is an occurrence id. It does not identify a binding by itself.
//! This module assigns fresh occurrence ids, then records the declaration and
//! reference relationship in a side table keyed by [`NodeId`].

use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitMut, VisitMutWith, VisitWith};

macro_rules! define_id {
    ($name:ident, $doc:literal) => {
        #[doc = $doc]
        #[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord)]
        pub struct $name(u32);

        impl $name {
            #[inline]
            fn from_index(index: usize) -> Self {
                Self(index as u32)
            }

            #[inline]
            fn index(self) -> usize {
                self.0 as usize
            }

            /// Returns the raw id value.
            #[inline]
            pub fn as_u32(self) -> u32 {
                self.0
            }
        }
    };
}

define_id!(ScopeId, "Opaque identifier of a lexical scope.");
define_id!(SymbolId, "Opaque identifier of a declared symbol.");
define_id!(ReferenceId, "Opaque identifier of an identifier reference.");

/// Configuration for node-id based semantic analysis.
#[derive(Debug, Clone, Copy, Default)]
pub struct SemanticConfig {
    /// Enables TypeScript type-namespace analysis.
    pub typescript: bool,
}

/// Scope category used by semantic analysis.
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
    /// Class name/body scope.
    Class,
}

/// Symbol namespace.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum SymbolNamespace {
    /// JavaScript runtime value namespace.
    Value,
    /// TypeScript type namespace.
    Type,
}

/// Symbol declaration category.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum SymbolKind {
    /// `var`.
    Var,
    /// `let`.
    Let,
    /// `const`.
    Const,
    /// Function declaration or function-expression name.
    Function,
    /// Class declaration or class-expression name.
    Class,
    /// Function parameter.
    Param,
    /// ESM import binding.
    Import,
    /// Catch parameter binding.
    CatchParam,
    /// TypeScript type alias, interface, or type parameter.
    Type,
    /// TypeScript enum binding.
    Enum,
    /// TypeScript namespace/module binding.
    Namespace,
    /// Explicit resource management binding.
    Using,
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

/// Scope metadata.
#[derive(Debug, Clone)]
pub struct ScopeData {
    /// Scope kind.
    pub kind: ScopeKind,
    /// Parent lexical scope.
    pub parent: Option<ScopeId>,
    /// Function/program scope containing this scope.
    pub enclosing_function: ScopeId,
    /// Parent function/program scope if this scope is itself function-like.
    pub parent_function: Option<ScopeId>,
    /// Symbols declared directly in this scope.
    pub symbols: Vec<SymbolId>,
}

/// Symbol metadata.
#[derive(Debug, Clone)]
pub struct SymbolData {
    /// Symbol kind.
    pub kind: SymbolKind,
    /// Symbol namespace.
    pub namespace: SymbolNamespace,
    /// Declaring scope.
    pub scope: ScopeId,
    /// Symbol name.
    pub name: Atom,
    /// Identifier occurrences that declare this symbol.
    pub declaration_node_ids: Vec<NodeId>,
}

/// Reference metadata.
#[derive(Debug, Clone)]
pub struct ReferenceData {
    /// Reference kind.
    pub kind: ReferenceKind,
    /// Reference namespace.
    pub namespace: SymbolNamespace,
    /// Scope where this reference appears.
    pub scope: ScopeId,
    /// Function/program scope containing this reference.
    pub enclosing_function: ScopeId,
    /// Referenced name.
    pub name: Atom,
    /// Identifier occurrence id.
    pub node_id: NodeId,
    /// Resolved symbol, if any.
    pub symbol: Option<SymbolId>,
}

/// Complete node-id based semantics result for one AST.
#[derive(Debug, Default)]
pub struct Semantics {
    scopes: Vec<ScopeData>,
    symbols: Vec<SymbolData>,
    references: Vec<ReferenceData>,
    symbol_by_node_id: FxHashMap<NodeId, SymbolId>,
    reference_by_node_id: FxHashMap<NodeId, ReferenceId>,
    references_by_symbol: Vec<Vec<ReferenceId>>,
    unresolved_references: Vec<ReferenceId>,
}

impl Semantics {
    /// Returns all scope records.
    #[inline]
    pub fn scopes(&self) -> &[ScopeData] {
        &self.scopes
    }

    /// Returns all symbol records.
    #[inline]
    pub fn symbols(&self) -> &[SymbolData] {
        &self.symbols
    }

    /// Returns all reference records.
    #[inline]
    pub fn references(&self) -> &[ReferenceData] {
        &self.references
    }

    /// Returns a scope by id.
    #[inline]
    pub fn scope(&self, id: ScopeId) -> &ScopeData {
        &self.scopes[id.index()]
    }

    /// Returns a symbol by id.
    #[inline]
    pub fn symbol(&self, id: SymbolId) -> &SymbolData {
        &self.symbols[id.index()]
    }

    /// Returns a reference by id.
    #[inline]
    pub fn reference(&self, id: ReferenceId) -> &ReferenceData {
        &self.references[id.index()]
    }

    /// Returns the symbol declared by or resolved for an identifier occurrence.
    #[inline]
    pub fn symbol_for_node_id(&self, node_id: NodeId) -> Option<SymbolId> {
        self.symbol_by_node_id.get(&node_id).copied()
    }

    /// Returns the reference record for an identifier occurrence.
    #[inline]
    pub fn reference_for_node_id(&self, node_id: NodeId) -> Option<ReferenceId> {
        self.reference_by_node_id.get(&node_id).copied()
    }

    /// Returns references attached to a symbol.
    #[inline]
    pub fn references_of_symbol(&self, id: SymbolId) -> &[ReferenceId] {
        self.references_by_symbol
            .get(id.index())
            .map(Vec::as_slice)
            .unwrap_or_default()
    }

    /// Returns unresolved references.
    #[inline]
    pub fn unresolved_references(&self) -> &[ReferenceId] {
        &self.unresolved_references
    }

    fn alloc_scope(&mut self, data: ScopeData) -> ScopeId {
        let id = ScopeId::from_index(self.scopes.len());
        self.scopes.push(data);
        id
    }

    fn alloc_symbol(&mut self, data: SymbolData) -> SymbolId {
        let id = SymbolId::from_index(self.symbols.len());
        self.symbols.push(data);
        self.references_by_symbol.push(Vec::new());
        id
    }

    fn alloc_reference(&mut self, data: ReferenceData) -> ReferenceId {
        let id = ReferenceId::from_index(self.references.len());
        if !data.node_id.is_invalid() {
            self.reference_by_node_id.insert(data.node_id, id);
        }

        if let Some(symbol) = data.symbol {
            self.symbol_by_node_id.insert(data.node_id, symbol);
            self.references_by_symbol[symbol.index()].push(id);
        } else {
            self.unresolved_references.push(id);
        }

        self.references.push(data);
        id
    }
}

/// Assigns fresh occurrence ids to every [`Ident`] under `node`.
///
/// Existing ids are overwritten. `NodeId(0)` is never assigned.
pub fn assign_node_ids<N>(node: &mut N)
where
    N: VisitMutWith<NodeIdAssigner>,
{
    let mut assigner = NodeIdAssigner::default();
    node.visit_mut_with(&mut assigner);
}

/// Visitor that assigns fresh occurrence ids to identifiers.
#[derive(Debug, Default)]
pub struct NodeIdAssigner {
    next: u32,
}

impl NodeIdAssigner {
    fn next_id(&mut self) -> NodeId {
        self.next = self
            .next
            .checked_add(1)
            .expect("identifier node id overflowed u32");
        NodeId::new(self.next)
    }
}

impl VisitMut for NodeIdAssigner {
    fn visit_mut_ident(&mut self, ident: &mut Ident) {
        ident.node_id = self.next_id();
    }
}

/// Assigns fresh node ids and analyzes scopes, symbols, and references.
pub fn analyze(program: &mut Program, config: SemanticConfig) -> Semantics {
    assign_node_ids(program);
    analyze_with_existing_node_ids(program, config)
}

/// Analyzes scopes, symbols, and references using existing node ids.
pub fn analyze_with_existing_node_ids(program: &Program, config: SemanticConfig) -> Semantics {
    let mut semantics = Semantics::default();
    let mut analyzer = Analyzer::new(config, &mut semantics);
    program.visit_with(&mut analyzer);
    semantics
}

#[derive(Debug)]
struct ScopeFrame {
    id: ScopeId,
    function_scope: ScopeId,
    decls: FxHashMap<(Atom, SymbolNamespace), SymbolId>,
}

struct Analyzer<'a> {
    config: SemanticConfig,
    semantics: &'a mut Semantics,
    scope_stack: Vec<ScopeFrame>,
    namespace: SymbolNamespace,
}

impl<'a> Analyzer<'a> {
    fn new(config: SemanticConfig, semantics: &'a mut Semantics) -> Self {
        Self {
            config,
            semantics,
            scope_stack: Vec::new(),
            namespace: SymbolNamespace::Value,
        }
    }

    fn current_scope(&self) -> ScopeId {
        self.scope_stack
            .last()
            .map(|scope| scope.id)
            .expect("semantic scope stack should not be empty")
    }

    fn current_function_scope(&self) -> ScopeId {
        self.scope_stack
            .last()
            .map(|scope| scope.function_scope)
            .expect("semantic scope stack should not be empty")
    }

    fn var_scope(&self) -> ScopeId {
        self.scope_stack
            .iter()
            .rev()
            .find(|scope| {
                matches!(
                    self.semantics.scopes[scope.id.index()].kind,
                    ScopeKind::Program | ScopeKind::Function
                )
            })
            .map(|scope| scope.id)
            .unwrap_or_else(|| self.current_scope())
    }

    fn push_scope(&mut self, kind: ScopeKind) -> ScopeId {
        let parent = self.scope_stack.last().map(|scope| scope.id);
        let parent_function = parent.and_then(|parent_id| {
            let parent_scope = &self.semantics.scopes[parent_id.index()];
            if matches!(kind, ScopeKind::Program | ScopeKind::Function) {
                Some(parent_scope.enclosing_function)
            } else {
                parent_scope.parent_function
            }
        });
        let inherited_function = parent
            .map(|parent_id| self.semantics.scopes[parent_id.index()].enclosing_function)
            .unwrap_or_else(|| ScopeId::from_index(0));

        let id = self.semantics.alloc_scope(ScopeData {
            kind,
            parent,
            enclosing_function: inherited_function,
            parent_function,
            symbols: Vec::new(),
        });

        if matches!(kind, ScopeKind::Program | ScopeKind::Function) {
            self.semantics.scopes[id.index()].enclosing_function = id;
        }

        let function_scope = self.semantics.scopes[id.index()].enclosing_function;
        self.scope_stack.push(ScopeFrame {
            id,
            function_scope,
            decls: FxHashMap::default(),
        });
        id
    }

    fn pop_scope(&mut self) {
        self.scope_stack.pop();
    }

    fn with_scope<F>(&mut self, kind: ScopeKind, op: F)
    where
        F: FnOnce(&mut Self),
    {
        self.push_scope(kind);
        op(self);
        self.pop_scope();
    }

    fn with_namespace<F>(&mut self, namespace: SymbolNamespace, op: F)
    where
        F: FnOnce(&mut Self),
    {
        let old = self.namespace;
        self.namespace = namespace;
        op(self);
        self.namespace = old;
    }

    fn active_scope_mut(&mut self, id: ScopeId) -> Option<&mut ScopeFrame> {
        self.scope_stack.iter_mut().find(|scope| scope.id == id)
    }

    fn find_in_scope(
        &self,
        scope: ScopeId,
        name: &Atom,
        namespace: SymbolNamespace,
    ) -> Option<SymbolId> {
        self.scope_stack
            .iter()
            .find(|frame| frame.id == scope)
            .and_then(|frame| frame.decls.get(&(name.clone(), namespace)).copied())
    }

    fn declare_ident(
        &mut self,
        ident: &Ident,
        scope: ScopeId,
        kind: SymbolKind,
        namespace: SymbolNamespace,
    ) -> SymbolId {
        if let Some(symbol) = self.find_in_scope(scope, &ident.sym, namespace) {
            if !ident.node_id.is_invalid() {
                self.semantics
                    .symbol_by_node_id
                    .insert(ident.node_id, symbol);
                let data = &mut self.semantics.symbols[symbol.index()];
                if !data.declaration_node_ids.contains(&ident.node_id) {
                    data.declaration_node_ids.push(ident.node_id);
                }
            }
            return symbol;
        }

        let symbol = self.semantics.alloc_symbol(SymbolData {
            kind,
            namespace,
            scope,
            name: ident.sym.clone(),
            declaration_node_ids: if ident.node_id.is_invalid() {
                Vec::new()
            } else {
                vec![ident.node_id]
            },
        });

        self.semantics.scopes[scope.index()].symbols.push(symbol);
        if !ident.node_id.is_invalid() {
            self.semantics
                .symbol_by_node_id
                .insert(ident.node_id, symbol);
        }

        if let Some(frame) = self.active_scope_mut(scope) {
            frame.decls.insert((ident.sym.clone(), namespace), symbol);
        }

        symbol
    }

    fn resolve_symbol(&self, name: &Atom, namespace: SymbolNamespace) -> Option<SymbolId> {
        for frame in self.scope_stack.iter().rev() {
            if let Some(symbol) = frame.decls.get(&(name.clone(), namespace)) {
                return Some(*symbol);
            }
        }

        None
    }

    fn record_reference(&mut self, ident: &Ident, kind: ReferenceKind, namespace: SymbolNamespace) {
        if ident.node_id.is_invalid() {
            return;
        }

        let scope = self.current_scope();
        let enclosing_function = self.current_function_scope();
        let symbol = self.resolve_symbol(&ident.sym, namespace);

        self.semantics.alloc_reference(ReferenceData {
            kind,
            namespace,
            scope,
            enclosing_function,
            name: ident.sym.clone(),
            node_id: ident.node_id,
            symbol,
        });
    }

    fn declare_pat(
        &mut self,
        pat: &Pat,
        scope: ScopeId,
        kind: SymbolKind,
        namespace: SymbolNamespace,
    ) {
        match pat {
            Pat::Ident(ident) => {
                self.visit_type_ann_opt(&ident.type_ann);
                self.declare_ident(&ident.id, scope, kind, namespace);
            }
            Pat::Array(array) => {
                self.visit_type_ann_opt(&array.type_ann);
                for elem in array.elems.iter().flatten() {
                    self.declare_pat(elem, scope, kind, namespace);
                }
            }
            Pat::Rest(rest) => {
                self.visit_type_ann_opt(&rest.type_ann);
                self.declare_pat(&rest.arg, scope, kind, namespace);
            }
            Pat::Object(object) => {
                self.visit_type_ann_opt(&object.type_ann);
                for prop in &object.props {
                    match prop {
                        ObjectPatProp::KeyValue(prop) => {
                            self.visit_prop_name(&prop.key);
                            self.declare_pat(&prop.value, scope, kind, namespace);
                        }
                        ObjectPatProp::Assign(prop) => {
                            self.visit_type_ann_opt(&prop.key.type_ann);
                            self.declare_ident(&prop.key.id, scope, kind, namespace);
                            if let Some(value) = &prop.value {
                                value.visit_with(self);
                            }
                        }
                        ObjectPatProp::Rest(rest) => {
                            self.declare_pat(&rest.arg, scope, kind, namespace);
                        }
                    }
                }
            }
            Pat::Assign(assign) => {
                self.declare_pat(&assign.left, scope, kind, namespace);
                assign.right.visit_with(self);
            }
            Pat::Expr(expr) => {
                self.visit_assignment_expr(expr, ReferenceKind::Write);
            }
            Pat::Invalid(_) => {}
        }
    }

    fn visit_assignment_expr(&mut self, expr: &Expr, kind: ReferenceKind) {
        match expr {
            Expr::Ident(ident) => self.record_reference(ident, kind, SymbolNamespace::Value),
            Expr::Paren(paren) => self.visit_assignment_expr(&paren.expr, kind),
            Expr::TsAs(expr) => self.visit_assignment_expr(&expr.expr, kind),
            Expr::TsSatisfies(expr) => self.visit_assignment_expr(&expr.expr, kind),
            Expr::TsNonNull(expr) => self.visit_assignment_expr(&expr.expr, kind),
            Expr::TsTypeAssertion(expr) => self.visit_assignment_expr(&expr.expr, kind),
            Expr::TsInstantiation(expr) => self.visit_assignment_expr(&expr.expr, kind),
            _ => expr.visit_with(self),
        }
    }

    fn visit_assignment_target(&mut self, target: &AssignTarget, kind: ReferenceKind) {
        match target {
            AssignTarget::Simple(target) => self.visit_simple_assignment_target(target, kind),
            AssignTarget::Pat(pat) => self.visit_assignment_target_pat(pat, kind),
        }
    }

    fn visit_simple_assignment_target(&mut self, target: &SimpleAssignTarget, kind: ReferenceKind) {
        match target {
            SimpleAssignTarget::Ident(ident) => {
                self.record_reference(&ident.id, kind, SymbolNamespace::Value);
            }
            SimpleAssignTarget::Member(member) => member.visit_with(self),
            SimpleAssignTarget::SuperProp(super_prop) => super_prop.visit_with(self),
            SimpleAssignTarget::Paren(paren) => self.visit_assignment_expr(&paren.expr, kind),
            SimpleAssignTarget::OptChain(opt_chain) => opt_chain.visit_with(self),
            SimpleAssignTarget::TsAs(expr) => self.visit_assignment_expr(&expr.expr, kind),
            SimpleAssignTarget::TsSatisfies(expr) => self.visit_assignment_expr(&expr.expr, kind),
            SimpleAssignTarget::TsNonNull(expr) => self.visit_assignment_expr(&expr.expr, kind),
            SimpleAssignTarget::TsTypeAssertion(expr) => {
                self.visit_assignment_expr(&expr.expr, kind)
            }
            SimpleAssignTarget::TsInstantiation(expr) => {
                self.visit_assignment_expr(&expr.expr, kind)
            }
            SimpleAssignTarget::Invalid(_) => {}
        }
    }

    fn visit_assignment_target_pat(&mut self, pat: &AssignTargetPat, kind: ReferenceKind) {
        match pat {
            AssignTargetPat::Array(array) => {
                for elem in array.elems.iter().flatten() {
                    self.visit_assignment_pat(elem, kind);
                }
            }
            AssignTargetPat::Object(object) => {
                for prop in &object.props {
                    match prop {
                        ObjectPatProp::KeyValue(prop) => {
                            self.visit_prop_name(&prop.key);
                            self.visit_assignment_pat(&prop.value, kind);
                        }
                        ObjectPatProp::Assign(prop) => {
                            self.record_reference(&prop.key.id, kind, SymbolNamespace::Value);
                            if let Some(value) = &prop.value {
                                value.visit_with(self);
                            }
                        }
                        ObjectPatProp::Rest(rest) => {
                            self.visit_assignment_pat(&rest.arg, kind);
                        }
                    }
                }
            }
            AssignTargetPat::Invalid(_) => {}
        }
    }

    fn visit_assignment_pat(&mut self, pat: &Pat, kind: ReferenceKind) {
        match pat {
            Pat::Ident(ident) => self.record_reference(&ident.id, kind, SymbolNamespace::Value),
            Pat::Array(array) => {
                for elem in array.elems.iter().flatten() {
                    self.visit_assignment_pat(elem, kind);
                }
            }
            Pat::Rest(rest) => self.visit_assignment_pat(&rest.arg, kind),
            Pat::Object(object) => {
                for prop in &object.props {
                    match prop {
                        ObjectPatProp::KeyValue(prop) => {
                            self.visit_prop_name(&prop.key);
                            self.visit_assignment_pat(&prop.value, kind);
                        }
                        ObjectPatProp::Assign(prop) => {
                            self.record_reference(&prop.key.id, kind, SymbolNamespace::Value);
                            if let Some(value) = &prop.value {
                                value.visit_with(self);
                            }
                        }
                        ObjectPatProp::Rest(rest) => {
                            self.visit_assignment_pat(&rest.arg, kind);
                        }
                    }
                }
            }
            Pat::Assign(assign) => {
                self.visit_assignment_pat(&assign.left, kind);
                assign.right.visit_with(self);
            }
            Pat::Expr(expr) => self.visit_assignment_expr(expr, kind),
            Pat::Invalid(_) => {}
        }
    }

    fn predeclare_module_items(&mut self, items: &[ModuleItem]) {
        for item in items {
            match item {
                ModuleItem::ModuleDecl(decl) => self.predeclare_module_decl(decl),
                ModuleItem::Stmt(stmt) => self.predeclare_stmt(stmt),
            }
        }
    }

    fn predeclare_stmts(&mut self, stmts: &[Stmt]) {
        for stmt in stmts {
            self.predeclare_stmt(stmt);
        }
    }

    fn predeclare_stmt(&mut self, stmt: &Stmt) {
        if let Stmt::Decl(decl) = stmt {
            self.predeclare_decl(decl);
        }
    }

    fn predeclare_module_decl(&mut self, decl: &ModuleDecl) {
        match decl {
            ModuleDecl::Import(import) => self.predeclare_import(import),
            ModuleDecl::ExportDecl(export) => self.predeclare_decl(&export.decl),
            ModuleDecl::ExportDefaultDecl(export) => self.predeclare_default_decl(&export.decl),
            ModuleDecl::TsImportEquals(decl) => {
                let namespace = if decl.is_type_only {
                    SymbolNamespace::Type
                } else {
                    SymbolNamespace::Value
                };
                self.declare_ident(
                    &decl.id,
                    self.current_scope(),
                    SymbolKind::Import,
                    namespace,
                );
            }
            ModuleDecl::TsNamespaceExport(_) => {}
            ModuleDecl::ExportNamed(_)
            | ModuleDecl::ExportDefaultExpr(_)
            | ModuleDecl::ExportAll(_)
            | ModuleDecl::TsExportAssignment(_) => {}
        }
    }

    fn predeclare_default_decl(&mut self, decl: &DefaultDecl) {
        match decl {
            DefaultDecl::Fn(function) => {
                if let Some(ident) = &function.ident {
                    self.declare_ident(
                        ident,
                        self.current_scope(),
                        SymbolKind::Function,
                        SymbolNamespace::Value,
                    );
                }
            }
            DefaultDecl::Class(class) => {
                if let Some(ident) = &class.ident {
                    self.declare_ident(
                        ident,
                        self.current_scope(),
                        SymbolKind::Class,
                        SymbolNamespace::Value,
                    );
                }
            }
            DefaultDecl::TsInterfaceDecl(decl) => {
                self.declare_ident(
                    &decl.id,
                    self.current_scope(),
                    SymbolKind::Type,
                    SymbolNamespace::Type,
                );
            }
        }
    }

    fn predeclare_decl(&mut self, decl: &Decl) {
        match decl {
            Decl::Fn(decl) => {
                self.declare_ident(
                    &decl.ident,
                    self.current_scope(),
                    SymbolKind::Function,
                    SymbolNamespace::Value,
                );
            }
            Decl::Class(decl) => {
                self.declare_ident(
                    &decl.ident,
                    self.current_scope(),
                    SymbolKind::Class,
                    SymbolNamespace::Value,
                );
            }
            Decl::Var(decl) => self.predeclare_var_decl(decl),
            Decl::Using(decl) => {
                for decl in &decl.decls {
                    self.predeclare_var_declarator(
                        decl,
                        self.current_scope(),
                        SymbolKind::Using,
                        SymbolNamespace::Value,
                    );
                }
            }
            Decl::TsInterface(decl) => {
                self.declare_ident(
                    &decl.id,
                    self.current_scope(),
                    SymbolKind::Type,
                    SymbolNamespace::Type,
                );
            }
            Decl::TsTypeAlias(decl) => {
                self.declare_ident(
                    &decl.id,
                    self.current_scope(),
                    SymbolKind::Type,
                    SymbolNamespace::Type,
                );
            }
            Decl::TsEnum(decl) => {
                self.declare_ident(
                    &decl.id,
                    self.current_scope(),
                    SymbolKind::Enum,
                    SymbolNamespace::Value,
                );
                if self.config.typescript {
                    self.declare_ident(
                        &decl.id,
                        self.current_scope(),
                        SymbolKind::Enum,
                        SymbolNamespace::Type,
                    );
                }
            }
            Decl::TsModule(decl) => {
                if let TsModuleName::Ident(id) = &decl.id {
                    self.declare_ident(
                        id,
                        self.current_scope(),
                        SymbolKind::Namespace,
                        SymbolNamespace::Value,
                    );
                    if self.config.typescript {
                        self.declare_ident(
                            id,
                            self.current_scope(),
                            SymbolKind::Namespace,
                            SymbolNamespace::Type,
                        );
                    }
                }
            }
        }
    }

    fn predeclare_var_decl(&mut self, decl: &VarDecl) {
        let scope = if decl.kind == VarDeclKind::Var {
            self.var_scope()
        } else {
            self.current_scope()
        };
        let kind = match decl.kind {
            VarDeclKind::Var => SymbolKind::Var,
            VarDeclKind::Let => SymbolKind::Let,
            VarDeclKind::Const => SymbolKind::Const,
        };

        for decl in &decl.decls {
            self.predeclare_var_declarator(decl, scope, kind, SymbolNamespace::Value);
        }
    }

    fn predeclare_var_declarator(
        &mut self,
        decl: &VarDeclarator,
        scope: ScopeId,
        kind: SymbolKind,
        namespace: SymbolNamespace,
    ) {
        self.predeclare_pat(&decl.name, scope, kind, namespace);
    }

    fn predeclare_pat(
        &mut self,
        pat: &Pat,
        scope: ScopeId,
        kind: SymbolKind,
        namespace: SymbolNamespace,
    ) {
        match pat {
            Pat::Ident(ident) => {
                self.declare_ident(&ident.id, scope, kind, namespace);
            }
            Pat::Array(array) => {
                for elem in array.elems.iter().flatten() {
                    self.predeclare_pat(elem, scope, kind, namespace);
                }
            }
            Pat::Rest(rest) => self.predeclare_pat(&rest.arg, scope, kind, namespace),
            Pat::Object(object) => {
                for prop in &object.props {
                    match prop {
                        ObjectPatProp::KeyValue(prop) => {
                            self.predeclare_pat(&prop.value, scope, kind, namespace);
                        }
                        ObjectPatProp::Assign(prop) => {
                            self.declare_ident(&prop.key.id, scope, kind, namespace);
                        }
                        ObjectPatProp::Rest(rest) => {
                            self.predeclare_pat(&rest.arg, scope, kind, namespace);
                        }
                    }
                }
            }
            Pat::Assign(assign) => self.predeclare_pat(&assign.left, scope, kind, namespace),
            Pat::Expr(_) | Pat::Invalid(_) => {}
        }
    }

    fn predeclare_import(&mut self, import: &ImportDecl) {
        for specifier in &import.specifiers {
            let namespace = match specifier {
                ImportSpecifier::Named(named) if import.type_only || named.is_type_only => {
                    SymbolNamespace::Type
                }
                _ => SymbolNamespace::Value,
            };

            self.declare_ident(
                specifier.local(),
                self.current_scope(),
                SymbolKind::Import,
                namespace,
            );
        }
    }

    fn visit_type_ann_opt(&mut self, type_ann: &Option<Box<TsTypeAnn>>) {
        if self.config.typescript {
            self.with_namespace(SymbolNamespace::Type, |analyzer| {
                type_ann.visit_with(analyzer);
            });
        }
    }

    fn visit_function_like(&mut self, function: &Function, name: Option<&Ident>) {
        self.with_scope(ScopeKind::Function, |analyzer| {
            if let Some(name) = name {
                analyzer.declare_ident(
                    name,
                    analyzer.current_scope(),
                    SymbolKind::Function,
                    SymbolNamespace::Value,
                );
            }

            if analyzer.config.typescript {
                analyzer.with_namespace(SymbolNamespace::Type, |analyzer| {
                    function.type_params.visit_with(analyzer);
                });
            }

            for param in &function.params {
                analyzer.declare_pat(
                    &param.pat,
                    analyzer.current_scope(),
                    SymbolKind::Param,
                    SymbolNamespace::Value,
                );
            }

            analyzer.visit_type_ann_opt(&function.return_type);

            if let Some(body) = &function.body {
                analyzer.predeclare_stmts(&body.stmts);
                body.stmts.visit_with(analyzer);
            }
        });
    }

    fn visit_class_like(&mut self, class: &Class, name: Option<&Ident>) {
        class.decorators.visit_with(self);
        class.super_class.visit_with(self);

        self.with_scope(ScopeKind::Class, |analyzer| {
            if let Some(name) = name {
                analyzer.declare_ident(
                    name,
                    analyzer.current_scope(),
                    SymbolKind::Class,
                    SymbolNamespace::Value,
                );
            }

            if analyzer.config.typescript {
                analyzer.with_namespace(SymbolNamespace::Type, |analyzer| {
                    class.type_params.visit_with(analyzer);
                    class.super_type_params.visit_with(analyzer);
                    class.implements.visit_with(analyzer);
                });
            }

            class.body.visit_with(analyzer);
        });
    }
}

impl Visit for Analyzer<'_> {
    fn visit_program(&mut self, program: &Program) {
        self.with_scope(ScopeKind::Program, |analyzer| match program {
            Program::Module(module) => {
                analyzer.predeclare_module_items(&module.body);
                module.body.visit_with(analyzer);
            }
            Program::Script(script) => {
                analyzer.predeclare_stmts(&script.body);
                script.body.visit_with(analyzer);
            }
        });
    }

    fn visit_module(&mut self, module: &Module) {
        self.predeclare_module_items(&module.body);
        module.body.visit_with(self);
    }

    fn visit_script(&mut self, script: &Script) {
        self.predeclare_stmts(&script.body);
        script.body.visit_with(self);
    }

    fn visit_block_stmt(&mut self, block: &BlockStmt) {
        self.with_scope(ScopeKind::Block, |analyzer| {
            analyzer.predeclare_stmts(&block.stmts);
            block.stmts.visit_with(analyzer);
        });
    }

    fn visit_catch_clause(&mut self, catch: &CatchClause) {
        self.with_scope(ScopeKind::Catch, |analyzer| {
            if let Some(param) = &catch.param {
                analyzer.declare_pat(
                    param,
                    analyzer.current_scope(),
                    SymbolKind::CatchParam,
                    SymbolNamespace::Value,
                );
            }
            analyzer.predeclare_stmts(&catch.body.stmts);
            catch.body.stmts.visit_with(analyzer);
        });
    }

    fn visit_fn_decl(&mut self, decl: &FnDecl) {
        self.declare_ident(
            &decl.ident,
            self.current_scope(),
            SymbolKind::Function,
            SymbolNamespace::Value,
        );
        decl.function.decorators.visit_with(self);
        self.visit_function_like(&decl.function, None);
    }

    fn visit_fn_expr(&mut self, expr: &FnExpr) {
        expr.function.decorators.visit_with(self);
        self.visit_function_like(&expr.function, expr.ident.as_ref());
    }

    fn visit_function(&mut self, function: &Function) {
        function.decorators.visit_with(self);
        self.visit_function_like(function, None);
    }

    fn visit_arrow_expr(&mut self, arrow: &ArrowExpr) {
        self.with_scope(ScopeKind::Function, |analyzer| {
            if analyzer.config.typescript {
                analyzer.with_namespace(SymbolNamespace::Type, |analyzer| {
                    arrow.type_params.visit_with(analyzer);
                });
            }

            for param in &arrow.params {
                analyzer.declare_pat(
                    param,
                    analyzer.current_scope(),
                    SymbolKind::Param,
                    SymbolNamespace::Value,
                );
            }

            analyzer.visit_type_ann_opt(&arrow.return_type);

            match &*arrow.body {
                BlockStmtOrExpr::BlockStmt(body) => {
                    analyzer.predeclare_stmts(&body.stmts);
                    body.stmts.visit_with(analyzer);
                }
                BlockStmtOrExpr::Expr(expr) => expr.visit_with(analyzer),
            }
        });
    }

    fn visit_class_decl(&mut self, decl: &ClassDecl) {
        self.declare_ident(
            &decl.ident,
            self.current_scope(),
            SymbolKind::Class,
            SymbolNamespace::Value,
        );
        self.visit_class_like(&decl.class, None);
    }

    fn visit_class_expr(&mut self, expr: &ClassExpr) {
        self.visit_class_like(&expr.class, expr.ident.as_ref());
    }

    fn visit_class_method(&mut self, method: &ClassMethod) {
        self.visit_prop_name(&method.key);
        self.visit_function_like(&method.function, None);
    }

    fn visit_private_method(&mut self, method: &PrivateMethod) {
        self.visit_function_like(&method.function, None);
    }

    fn visit_constructor(&mut self, ctor: &Constructor) {
        self.with_scope(ScopeKind::Function, |analyzer| {
            for param in &ctor.params {
                match param {
                    ParamOrTsParamProp::Param(param) => {
                        analyzer.declare_pat(
                            &param.pat,
                            analyzer.current_scope(),
                            SymbolKind::Param,
                            SymbolNamespace::Value,
                        );
                    }
                    ParamOrTsParamProp::TsParamProp(prop) => prop.visit_with(analyzer),
                }
            }

            if let Some(body) = &ctor.body {
                analyzer.predeclare_stmts(&body.stmts);
                body.stmts.visit_with(analyzer);
            }
        });
    }

    fn visit_var_decl(&mut self, decl: &VarDecl) {
        let scope = if decl.kind == VarDeclKind::Var {
            self.var_scope()
        } else {
            self.current_scope()
        };
        let kind = match decl.kind {
            VarDeclKind::Var => SymbolKind::Var,
            VarDeclKind::Let => SymbolKind::Let,
            VarDeclKind::Const => SymbolKind::Const,
        };

        for decl in &decl.decls {
            self.declare_pat(&decl.name, scope, kind, SymbolNamespace::Value);
            decl.init.visit_with(self);
        }
    }

    fn visit_using_decl(&mut self, decl: &UsingDecl) {
        for decl in &decl.decls {
            self.declare_pat(
                &decl.name,
                self.current_scope(),
                SymbolKind::Using,
                SymbolNamespace::Value,
            );
            decl.init.visit_with(self);
        }
    }

    fn visit_binding_ident(&mut self, ident: &BindingIdent) {
        self.visit_type_ann_opt(&ident.type_ann);
        self.declare_ident(
            &ident.id,
            self.current_scope(),
            SymbolKind::Let,
            self.namespace,
        );
    }

    fn visit_ident(&mut self, ident: &Ident) {
        self.record_reference(ident, ReferenceKind::Read, self.namespace);
    }

    fn visit_prop_name(&mut self, name: &PropName) {
        if let PropName::Computed(computed) = name {
            computed.expr.visit_with(self);
        }
    }

    fn visit_member_prop(&mut self, prop: &MemberProp) {
        if let MemberProp::Computed(computed) = prop {
            computed.expr.visit_with(self);
        }
    }

    fn visit_super_prop(&mut self, prop: &SuperProp) {
        if let SuperProp::Computed(computed) = prop {
            computed.expr.visit_with(self);
        }
    }

    fn visit_key_value_pat_prop(&mut self, prop: &KeyValuePatProp) {
        self.visit_prop_name(&prop.key);
        prop.value.visit_with(self);
    }

    fn visit_assign_expr(&mut self, expr: &AssignExpr) {
        let kind = if expr.op == op!("=") {
            ReferenceKind::Write
        } else {
            ReferenceKind::ReadWrite
        };
        self.visit_assignment_target(&expr.left, kind);
        expr.right.visit_with(self);
    }

    fn visit_update_expr(&mut self, expr: &UpdateExpr) {
        self.visit_assignment_expr(&expr.arg, ReferenceKind::ReadWrite);
    }

    fn visit_for_stmt(&mut self, stmt: &ForStmt) {
        self.with_scope(ScopeKind::Block, |analyzer| {
            if let Some(VarDeclOrExpr::VarDecl(decl)) = &stmt.init {
                analyzer.predeclare_var_decl(decl);
            }
            stmt.init.visit_with(analyzer);
            stmt.test.visit_with(analyzer);
            stmt.update.visit_with(analyzer);
            stmt.body.visit_with(analyzer);
        });
    }

    fn visit_for_in_stmt(&mut self, stmt: &ForInStmt) {
        self.with_scope(ScopeKind::Block, |analyzer| {
            match &stmt.left {
                ForHead::VarDecl(decl) => {
                    analyzer.predeclare_var_decl(decl);
                    decl.visit_with(analyzer);
                }
                ForHead::UsingDecl(decl) => decl.visit_with(analyzer),
                ForHead::Pat(pat) => analyzer.visit_assignment_pat(pat, ReferenceKind::Write),
            }
            stmt.right.visit_with(analyzer);
            stmt.body.visit_with(analyzer);
        });
    }

    fn visit_for_of_stmt(&mut self, stmt: &ForOfStmt) {
        self.with_scope(ScopeKind::Block, |analyzer| {
            match &stmt.left {
                ForHead::VarDecl(decl) => {
                    analyzer.predeclare_var_decl(decl);
                    decl.visit_with(analyzer);
                }
                ForHead::UsingDecl(decl) => decl.visit_with(analyzer),
                ForHead::Pat(pat) => analyzer.visit_assignment_pat(pat, ReferenceKind::Write),
            }
            stmt.right.visit_with(analyzer);
            stmt.body.visit_with(analyzer);
        });
    }

    fn visit_import_decl(&mut self, import: &ImportDecl) {
        self.predeclare_import(import);
    }

    fn visit_named_export(&mut self, export: &NamedExport) {
        if export.src.is_some() {
            return;
        }

        let namespace = if export.type_only {
            SymbolNamespace::Type
        } else {
            SymbolNamespace::Value
        };

        for specifier in &export.specifiers {
            match specifier {
                ExportSpecifier::Named(named) => {
                    let namespace = if named.is_type_only {
                        SymbolNamespace::Type
                    } else {
                        namespace
                    };
                    if let ModuleExportName::Ident(orig) = &named.orig {
                        self.record_reference(orig, ReferenceKind::Read, namespace);
                    }
                }
                ExportSpecifier::Default(default) => {
                    self.record_reference(&default.exported, ReferenceKind::Read, namespace);
                }
                ExportSpecifier::Namespace(_) => {}
            }
        }
    }

    fn visit_export_decl(&mut self, export: &ExportDecl) {
        export.decl.visit_with(self);
    }

    fn visit_export_default_decl(&mut self, export: &ExportDefaultDecl) {
        match &export.decl {
            DefaultDecl::Fn(function) => {
                if let Some(ident) = &function.ident {
                    self.declare_ident(
                        ident,
                        self.current_scope(),
                        SymbolKind::Function,
                        SymbolNamespace::Value,
                    );
                }
                function.function.decorators.visit_with(self);
                self.visit_function_like(&function.function, None);
            }
            DefaultDecl::Class(class) => {
                if let Some(ident) = &class.ident {
                    self.declare_ident(
                        ident,
                        self.current_scope(),
                        SymbolKind::Class,
                        SymbolNamespace::Value,
                    );
                }
                self.visit_class_like(&class.class, None);
            }
            DefaultDecl::TsInterfaceDecl(decl) => decl.visit_with(self),
        }
    }

    fn visit_ts_type_ann(&mut self, ann: &TsTypeAnn) {
        if self.config.typescript {
            self.with_namespace(SymbolNamespace::Type, |analyzer| {
                ann.type_ann.visit_with(analyzer);
            });
        }
    }

    fn visit_ts_type_alias_decl(&mut self, decl: &TsTypeAliasDecl) {
        self.declare_ident(
            &decl.id,
            self.current_scope(),
            SymbolKind::Type,
            SymbolNamespace::Type,
        );

        if self.config.typescript {
            self.with_scope(ScopeKind::Block, |analyzer| {
                analyzer.with_namespace(SymbolNamespace::Type, |analyzer| {
                    decl.type_params.visit_with(analyzer);
                    decl.type_ann.visit_with(analyzer);
                });
            });
        }
    }

    fn visit_ts_interface_decl(&mut self, decl: &TsInterfaceDecl) {
        self.declare_ident(
            &decl.id,
            self.current_scope(),
            SymbolKind::Type,
            SymbolNamespace::Type,
        );

        if self.config.typescript {
            self.with_scope(ScopeKind::Block, |analyzer| {
                analyzer.with_namespace(SymbolNamespace::Type, |analyzer| {
                    decl.type_params.visit_with(analyzer);
                    decl.extends.visit_with(analyzer);
                    decl.body.visit_with(analyzer);
                });
            });
        }
    }

    fn visit_ts_type_param(&mut self, param: &TsTypeParam) {
        if !self.config.typescript {
            return;
        }

        self.declare_ident(
            &param.name,
            self.current_scope(),
            SymbolKind::Type,
            SymbolNamespace::Type,
        );

        self.with_namespace(SymbolNamespace::Type, |analyzer| {
            param.constraint.visit_with(analyzer);
            param.default.visit_with(analyzer);
        });
    }

    fn visit_ts_entity_name(&mut self, name: &TsEntityName) {
        if !self.config.typescript {
            return;
        }

        match name {
            TsEntityName::Ident(ident) => {
                self.record_reference(ident, ReferenceKind::Read, SymbolNamespace::Type);
            }
            TsEntityName::TsQualifiedName(qualified) => {
                qualified.left.visit_with(self);
            }
        }
    }

    fn visit_ts_type_ref(&mut self, type_ref: &TsTypeRef) {
        if !self.config.typescript {
            return;
        }

        self.with_namespace(SymbolNamespace::Type, |analyzer| {
            type_ref.type_name.visit_with(analyzer);
            type_ref.type_params.visit_with(analyzer);
        });
    }

    fn visit_ts_expr_with_type_args(&mut self, expr: &TsExprWithTypeArgs) {
        if !self.config.typescript {
            return;
        }

        self.with_namespace(SymbolNamespace::Type, |analyzer| {
            expr.expr.visit_with(analyzer);
            expr.type_args.visit_with(analyzer);
        });
    }

    fn visit_ts_property_signature(&mut self, prop: &TsPropertySignature) {
        if !self.config.typescript {
            return;
        }

        self.with_namespace(SymbolNamespace::Type, |analyzer| {
            if prop.computed {
                prop.key.visit_with(analyzer);
            }
            prop.type_ann.visit_with(analyzer);
        });
    }

    fn visit_ts_getter_signature(&mut self, getter: &TsGetterSignature) {
        if !self.config.typescript {
            return;
        }

        self.with_namespace(SymbolNamespace::Type, |analyzer| {
            if getter.computed {
                getter.key.visit_with(analyzer);
            }
            getter.type_ann.visit_with(analyzer);
        });
    }

    fn visit_ts_setter_signature(&mut self, setter: &TsSetterSignature) {
        if !self.config.typescript {
            return;
        }

        self.with_namespace(SymbolNamespace::Type, |analyzer| {
            if setter.computed {
                setter.key.visit_with(analyzer);
            }
            setter.param.visit_with(analyzer);
        });
    }

    fn visit_ts_method_signature(&mut self, method: &TsMethodSignature) {
        if !self.config.typescript {
            return;
        }

        self.with_scope(ScopeKind::Function, |analyzer| {
            analyzer.with_namespace(SymbolNamespace::Type, |analyzer| {
                if method.computed {
                    method.key.visit_with(analyzer);
                }
                method.type_params.visit_with(analyzer);
                method.params.visit_with(analyzer);
                method.type_ann.visit_with(analyzer);
            });
        });
    }

    fn visit_ts_enum_decl(&mut self, decl: &TsEnumDecl) {
        self.declare_ident(
            &decl.id,
            self.current_scope(),
            SymbolKind::Enum,
            SymbolNamespace::Value,
        );
        if self.config.typescript {
            self.declare_ident(
                &decl.id,
                self.current_scope(),
                SymbolKind::Enum,
                SymbolNamespace::Type,
            );
        }

        self.with_scope(ScopeKind::Block, |analyzer| {
            for member in &decl.members {
                if let Some(init) = &member.init {
                    init.visit_with(analyzer);
                }
            }
        });
    }

    fn visit_ts_module_decl(&mut self, decl: &TsModuleDecl) {
        if let TsModuleName::Ident(id) = &decl.id {
            self.declare_ident(
                id,
                self.current_scope(),
                SymbolKind::Namespace,
                SymbolNamespace::Value,
            );
            if self.config.typescript {
                self.declare_ident(
                    id,
                    self.current_scope(),
                    SymbolKind::Namespace,
                    SymbolNamespace::Type,
                );
            }
        }

        self.with_scope(ScopeKind::Block, |analyzer| {
            decl.body.visit_with(analyzer);
        });
    }

    fn visit_ts_namespace_decl(&mut self, decl: &TsNamespaceDecl) {
        self.declare_ident(
            &decl.id,
            self.current_scope(),
            SymbolKind::Namespace,
            SymbolNamespace::Value,
        );
        if self.config.typescript {
            self.declare_ident(
                &decl.id,
                self.current_scope(),
                SymbolKind::Namespace,
                SymbolNamespace::Type,
            );
        }

        self.with_scope(ScopeKind::Block, |analyzer| {
            decl.body.visit_with(analyzer);
        });
    }

    fn visit_ts_import_equals_decl(&mut self, decl: &TsImportEqualsDecl) {
        let namespace = if decl.is_type_only {
            SymbolNamespace::Type
        } else {
            SymbolNamespace::Value
        };
        self.declare_ident(
            &decl.id,
            self.current_scope(),
            SymbolKind::Import,
            namespace,
        );
        decl.module_ref.visit_with(self);
    }
}
