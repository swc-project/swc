// Copyright (c) Meta Platforms, Inc. and affiliates.
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

//! Simplified semantic analysis for the React Compiler.
//!
//! This is a streamlined OXC-style semantic pass that builds scopes, symbols,
//! and references from an SWC AST. It only collects information needed by the
//! React Compiler.

use std::collections::HashMap;

use indexmap::IndexMap;
use rustc_hash::{FxBuildHasher, FxHashMap};
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

use crate::SourceType;

/// `IndexMap` keyed with the deterministic Fx hasher, matching
/// `react_compiler_utils::FxIndexMap` used by React Compiler 0.2.0 AST scope
/// fields.
type FxIndexMap<K, V> = IndexMap<K, V, FxBuildHasher>;

/// Unique ID for a scope.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct ScopeId(pub u32);

/// Unique ID for a symbol.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct SymbolId(pub u32);

/// Unique ID for a reference.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub struct ReferenceId(pub u32);

/// Flags describing a scope.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct ScopeFlags {
    bits: u16,
}

#[allow(non_upper_case_globals)]
impl ScopeFlags {
    pub const CatchClause: Self = Self { bits: 1 << 0 };
    pub const Class: Self = Self { bits: 1 << 1 };
    pub const ClassStaticBlock: Self = Self { bits: 1 << 2 };
    pub const For: Self = Self { bits: 1 << 3 };
    pub const Function: Self = Self { bits: 1 << 4 };
    pub const StrictMode: Self = Self { bits: 1 << 5 };
    pub const Switch: Self = Self { bits: 1 << 6 };
    pub const Top: Self = Self { bits: 1 << 7 };
    pub const TsModuleBlock: Self = Self { bits: 1 << 8 };

    #[inline]
    pub const fn empty() -> Self {
        Self { bits: 0 }
    }

    #[inline]
    pub const fn contains(self, other: Self) -> bool {
        (self.bits & other.bits) == other.bits
    }

    #[inline]
    pub const fn intersects(self, other: Self) -> bool {
        (self.bits & other.bits) != 0
    }

    #[inline]
    pub fn is_top(self) -> bool {
        self.contains(Self::Top)
    }

    #[inline]
    pub fn is_function(self) -> bool {
        self.intersects(Self::Function)
    }

    #[inline]
    pub fn is_class_static_block(self) -> bool {
        self.contains(Self::ClassStaticBlock)
    }

    #[inline]
    pub fn is_ts_module_block(self) -> bool {
        self.contains(Self::TsModuleBlock)
    }

    #[inline]
    pub fn is_var(self) -> bool {
        self.is_function()
            || self.is_top()
            || self.is_class_static_block()
            || self.is_ts_module_block()
    }

    #[inline]
    pub fn is_catch_clause(self) -> bool {
        self.contains(Self::CatchClause)
    }
}

impl std::ops::BitOr for ScopeFlags {
    type Output = Self;

    fn bitor(self, rhs: Self) -> Self::Output {
        Self {
            bits: self.bits | rhs.bits,
        }
    }
}

impl std::ops::BitAnd for ScopeFlags {
    type Output = Self;

    fn bitand(self, rhs: Self) -> Self::Output {
        Self {
            bits: self.bits & rhs.bits,
        }
    }
}

/// Flags describing a symbol.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct SymbolFlags {
    bits: u32,
}

#[allow(non_upper_case_globals)]
impl SymbolFlags {
    pub const BlockScopedVariable: Self = Self { bits: 1 << 0 };
    pub const CatchVariable: Self = Self { bits: 1 << 1 };
    pub const Class: Self = Self { bits: 1 << 2 };
    pub const ConstVariable: Self = Self { bits: 1 << 3 };
    pub const Enum: Self = Self { bits: 1 << 4 };
    pub const Function: Self = Self { bits: 1 << 5 };
    pub const FunctionExpression: Self = Self { bits: 1 << 6 };
    pub const FunctionScopedVariable: Self = Self { bits: 1 << 7 };
    pub const Import: Self = Self { bits: 1 << 8 };
    pub const Param: Self = Self { bits: 1 << 9 };

    #[inline]
    pub const fn contains(self, other: Self) -> bool {
        (self.bits & other.bits) == other.bits
    }

    #[inline]
    pub const fn intersects(self, other: Self) -> bool {
        (self.bits & other.bits) != 0
    }

    #[inline]
    pub fn is_value(self) -> bool {
        self.intersects(
            Self::FunctionScopedVariable
                | Self::BlockScopedVariable
                | Self::Function
                | Self::FunctionExpression
                | Self::Class
                | Self::Enum
                | Self::Import
                | Self::Param,
        )
    }

    #[inline]
    pub fn can_be_referenced_by_value(self) -> bool {
        self.is_value()
    }
}

impl std::ops::BitOr for SymbolFlags {
    type Output = Self;

    fn bitor(self, rhs: Self) -> Self::Output {
        Self {
            bits: self.bits | rhs.bits,
        }
    }
}

/// A symbol (binding) in the program.
#[derive(Debug, Clone)]
pub struct Symbol {
    pub id: SymbolId,
    pub name: String,
    pub span: swc_common::Span,
    pub flags: SymbolFlags,
}

/// A reference to a symbol.
#[derive(Debug, Clone)]
pub struct Reference {
    pub id: ReferenceId,
    pub span: swc_common::Span,
    pub scope_id: ScopeId,
    pub symbol_id: Option<SymbolId>,
}

impl Reference {
    pub fn new(span: swc_common::Span, scope_id: ScopeId) -> Self {
        Self {
            id: ReferenceId(0),
            span,
            scope_id,
            symbol_id: None,
        }
    }
}

/// A scope in the program.
#[derive(Debug, Clone)]
pub struct ScopeData {
    pub id: ScopeId,
    pub parent_id: Option<ScopeId>,
    pub span: swc_common::Span,
    pub flags: ScopeFlags,
    pub bindings: HashMap<String, SymbolId>,
}

/// Scoping information: symbol table + scope tree + references.
#[derive(Debug, Clone, Default)]
pub struct Scoping {
    symbols: Vec<Symbol>,
    scopes: Vec<ScopeData>,
    references: Vec<Reference>,
}

impl Scoping {
    pub fn symbol_ids(&self) -> impl Iterator<Item = SymbolId> + '_ {
        self.symbols.iter().map(|s| s.id)
    }

    pub fn scope_descendants_from_root(&self) -> impl Iterator<Item = ScopeId> + '_ {
        self.scopes.iter().map(|s| s.id)
    }

    pub fn symbol_flags(&self, symbol_id: SymbolId) -> SymbolFlags {
        self.symbols[symbol_id.0 as usize].flags
    }

    pub fn symbol_name(&self, symbol_id: SymbolId) -> &str {
        &self.symbols[symbol_id.0 as usize].name
    }

    pub fn symbol_span(&self, symbol_id: SymbolId) -> swc_common::Span {
        self.symbols[symbol_id.0 as usize].span
    }

    pub fn scope_flags(&self, scope_id: ScopeId) -> ScopeFlags {
        self.scopes[scope_id.0 as usize].flags
    }

    pub fn scope_parent_id(&self, scope_id: ScopeId) -> Option<ScopeId> {
        self.scopes[scope_id.0 as usize].parent_id
    }

    pub fn scope_span(&self, scope_id: ScopeId) -> swc_common::Span {
        self.scopes[scope_id.0 as usize].span
    }

    pub fn iter_bindings_in(&self, scope_id: ScopeId) -> impl Iterator<Item = SymbolId> + '_ {
        self.scopes[scope_id.0 as usize].bindings.values().copied()
    }

    pub fn get_binding(&self, scope_id: ScopeId, name: &str) -> Option<SymbolId> {
        self.scopes[scope_id.0 as usize].bindings.get(name).copied()
    }

    pub fn root_scope_id(&self) -> ScopeId {
        ScopeId(0)
    }

    pub fn get_resolved_reference_ids(&self, symbol_id: SymbolId) -> Vec<ReferenceId> {
        self.references
            .iter()
            .filter(|r| r.symbol_id == Some(symbol_id))
            .map(|r| r.id)
            .collect()
    }

    pub fn get_reference(&self, reference_id: ReferenceId) -> &Reference {
        &self.references[reference_id.0 as usize]
    }

    pub fn create_symbol(
        &mut self,
        span: swc_common::Span,
        name: String,
        flags: SymbolFlags,
        scope_id: ScopeId,
    ) -> SymbolId {
        let id = SymbolId(self.symbols.len() as u32);
        self.symbols.push(Symbol {
            id,
            name: name.clone(),
            span,
            flags,
        });
        if let Some(scope) = self.scopes.get_mut(scope_id.0 as usize) {
            scope.bindings.insert(name, id);
        }
        id
    }

    pub fn add_scope(
        &mut self,
        parent_id: Option<ScopeId>,
        flags: ScopeFlags,
        span: swc_common::Span,
    ) -> ScopeId {
        let id = ScopeId(self.scopes.len() as u32);
        self.scopes.push(ScopeData {
            id,
            parent_id,
            span,
            flags,
            bindings: HashMap::new(),
        });
        id
    }

    pub fn create_reference(&mut self, mut reference: Reference) -> ReferenceId {
        let id = ReferenceId(self.references.len() as u32);
        reference.id = id;
        self.references.push(reference);
        id
    }

    pub fn add_resolved_reference(&mut self, symbol_id: SymbolId, reference_id: ReferenceId) {
        if let Some(r) = self.references.get_mut(reference_id.0 as usize) {
            r.symbol_id = Some(symbol_id);
        }
    }
}

/// Builder for semantic analysis that directly produces React Compiler
/// [`ScopeInfo`].
pub struct SemanticBuilder {
    scoping: Scoping,
    source_type: SourceType,
    current_scope_id: ScopeId,
    /// Stack of scope IDs.
    scope_stack: Vec<ScopeId>,
    /// Declarations to skip when resolving references (binding sites).
    declaration_starts: std::collections::HashSet<u32>,
    /// Re-declaration sites that should resolve to an existing binding.
    redeclaration_bindings: HashMap<u32, SymbolId>,
    /// Flat list of unresolved references: (name, reference_id).
    unresolved_references: Vec<(String, ReferenceId)>,
    /// Track function body spans so they don't create extra block scopes.
    function_body_spans: std::collections::HashSet<u32>,
}

impl SemanticBuilder {
    #[cfg(test)]
    pub fn new() -> Self {
        Self::with_source_type(SourceType::script())
    }

    pub fn with_source_type(source_type: SourceType) -> Self {
        let mut scoping = Scoping::default();
        let root_scope = scoping.add_scope(None, ScopeFlags::Top, swc_common::Span::default());
        Self {
            scoping,
            source_type,
            current_scope_id: root_scope,
            scope_stack: vec![root_scope],
            declaration_starts: std::collections::HashSet::new(),
            redeclaration_bindings: HashMap::new(),
            unresolved_references: Vec::new(),
            function_body_spans: std::collections::HashSet::new(),
        }
    }

    /// Run the semantic pass over `program` and return a React Compiler
    /// [`ScopeInfo`].
    pub fn build(mut self, program: &Program) -> react_compiler_ast::scope::ScopeInfo {
        self.source_type = self
            .source_type
            .with_module(matches!(program, Program::Module(_)));
        self.visit_program(program);
        self.resolve_all_references();
        self.into_scope_info(program)
    }

    fn start(&self, span: swc_common::Span) -> u32 {
        span.lo.0
    }

    fn current_scope(&self) -> ScopeId {
        *self.scope_stack.last().expect("scope stack empty")
    }

    fn push_scope(&mut self, flags: ScopeFlags, span: swc_common::Span) -> ScopeId {
        let parent = self.current_scope();
        let flags = self.get_new_scope_flags(flags, parent);
        let scope_id = self.scoping.add_scope(Some(parent), flags, span);
        self.scope_stack.push(scope_id);
        self.current_scope_id = scope_id;
        scope_id
    }

    fn pop_scope(&mut self) {
        self.scope_stack.pop();
        self.current_scope_id = self.current_scope();
    }

    fn get_new_scope_flags(&self, flags: ScopeFlags, parent_scope_id: ScopeId) -> ScopeFlags {
        let parent_flags = self.scoping.scope_flags(parent_scope_id);
        flags | (parent_flags & ScopeFlags::StrictMode)
    }

    fn strict_directives_present(stmts: &[Stmt]) -> bool {
        for stmt in stmts {
            if stmt.is_use_strict() {
                return true;
            }

            if !stmt.can_precede_directive() {
                break;
            }
        }

        false
    }

    fn body_scope_flags(&self, flags: ScopeFlags, body: Option<&BlockStmt>) -> ScopeFlags {
        if body.is_some_and(|body| Self::strict_directives_present(&body.stmts)) {
            flags | ScopeFlags::StrictMode
        } else {
            flags
        }
    }

    fn should_hoist_block_function(&self, function: &Function) -> bool {
        let current_flags = self.scoping.scope_flags(self.current_scope());

        !current_flags.is_var()
            && !current_flags.contains(ScopeFlags::StrictMode)
            && !self.source_type.is_typescript()
            && !function.is_async
            && !function.is_generator
    }

    fn declare_symbol(
        &mut self,
        span: swc_common::Span,
        name: String,
        flags: SymbolFlags,
    ) -> SymbolId {
        let scope_id = self.current_scope();
        self.declare_symbol_on_scope(span, name, flags, scope_id)
    }

    fn declare_symbol_on_scope(
        &mut self,
        span: swc_common::Span,
        name: String,
        flags: SymbolFlags,
        scope_id: ScopeId,
    ) -> SymbolId {
        if flags.contains(SymbolFlags::FunctionScopedVariable) {
            if let Some(symbol_id) = self.scoping.get_binding(scope_id, &name) {
                self.record_redeclaration_binding(span, symbol_id);
                return symbol_id;
            }
        }

        let symbol_id = self.scoping.create_symbol(span, name, flags, scope_id);
        self.declaration_starts.insert(self.start(span));
        symbol_id
    }

    fn record_redeclaration_binding(&mut self, span: swc_common::Span, symbol_id: SymbolId) {
        let start = self.start(span);
        self.declaration_starts.insert(start);
        self.redeclaration_bindings.insert(start, symbol_id);
    }

    fn declare_reference(&mut self, name: String, reference: Reference) -> ReferenceId {
        let reference_id = self.scoping.create_reference(reference);
        self.unresolved_references.push((name, reference_id));
        reference_id
    }

    fn reference_identifier(&mut self, ident: &Ident) {
        let reference = Reference::new(ident.span, self.current_scope_id);
        let name = ident.sym.to_string();
        let _reference_id = self.declare_reference(name, reference);
    }

    fn resolve_all_references(&mut self) {
        let refs: Vec<(String, ReferenceId)> = std::mem::take(&mut self.unresolved_references);
        for (name, reference_id) in refs {
            if !self.walk_up_resolve_reference(&name, reference_id) {
                // unresolved references are ignored
            }
        }
    }

    fn walk_up_resolve_reference(&mut self, name: &str, reference_id: ReferenceId) -> bool {
        let mut scope_id = Some(self.scoping.get_reference(reference_id).scope_id);
        while let Some(sid) = scope_id {
            if let Some(symbol_id) = self.scoping.get_binding(sid, name) {
                if self.try_resolve_reference(reference_id, symbol_id) {
                    return true;
                }
            }
            scope_id = self.scoping.scope_parent_id(sid);
        }
        false
    }

    fn try_resolve_reference(&mut self, reference_id: ReferenceId, symbol_id: SymbolId) -> bool {
        let symbol_flags = self.scoping.symbol_flags(symbol_id);

        // Only resolve value references here (type references are not needed for React
        // Compiler).
        if !symbol_flags.can_be_referenced_by_value() {
            return false;
        }

        self.scoping.add_resolved_reference(symbol_id, reference_id);
        true
    }

    fn enclosing_var_scope(&self) -> ScopeId {
        self.scope_stack
            .iter()
            .rev()
            .copied()
            .find(|scope_id| {
                let flags = self.scoping.scope_flags(*scope_id);
                flags.is_var()
            })
            .unwrap_or(ScopeId(0))
    }

    fn collect_pat_bindings(&mut self, pat: &Pat, flags: SymbolFlags) {
        match pat {
            Pat::Ident(binding_ident) => {
                // TypeScript `this` pseudo-parameters are type annotations only.
                // They are erased before emit and must not be registered as bindings.
                if binding_ident.id.sym.as_str() == "this" {
                    return;
                }
                self.declare_symbol(
                    binding_ident.id.span,
                    binding_ident.id.sym.to_string(),
                    flags,
                );
            }
            Pat::Array(arr) => {
                for p in arr.elems.iter().flatten() {
                    self.collect_pat_bindings(p, flags);
                }
            }
            Pat::Object(obj) => {
                for prop in &obj.props {
                    match prop {
                        ObjectPatProp::KeyValue(kv) => {
                            if let PropName::Computed(computed) = &kv.key {
                                computed.visit_with(self);
                            }
                            self.collect_pat_bindings(&kv.value, flags);
                        }
                        ObjectPatProp::Assign(assign) => {
                            self.declare_symbol(
                                assign.key.id.span,
                                assign.key.id.sym.to_string(),
                                flags,
                            );
                            if let Some(value) = &assign.value {
                                value.visit_with(self);
                            }
                        }
                        ObjectPatProp::Rest(rest) => {
                            self.collect_pat_bindings(&rest.arg, flags);
                        }
                    }
                }
            }
            Pat::Rest(rest) => {
                self.collect_pat_bindings(&rest.arg, flags);
            }
            Pat::Assign(assign) => {
                self.collect_pat_bindings(&assign.left, flags);
                assign.right.visit_with(self);
            }
            Pat::Expr(_) | Pat::Invalid(_) => {}
        }
    }

    fn visit_function_inner(&mut self, function: &Function, flags: ScopeFlags) {
        self.visit_function_inner_with_span(function.span, function, flags);
    }

    fn visit_function_inner_with_span(
        &mut self,
        scope_span: swc_common::Span,
        function: &Function,
        flags: ScopeFlags,
    ) {
        let _scope_id = self.push_scope(
            self.body_scope_flags(flags, function.body.as_ref()),
            scope_span,
        );

        for param in &function.params {
            self.collect_pat_bindings(&param.pat, SymbolFlags::Param);
        }

        if let Some(body) = &function.body {
            self.function_body_spans.insert(self.start(body.span));
            body.visit_with(self);
        }

        self.pop_scope();
    }

    fn visit_constructor_inner(&mut self, constructor: &Constructor) {
        let _scope_id = self.push_scope(
            self.body_scope_flags(ScopeFlags::Function, constructor.body.as_ref()),
            constructor.span,
        );

        for param in &constructor.params {
            self.collect_constructor_param_bindings(param);
        }

        if let Some(body) = &constructor.body {
            self.function_body_spans.insert(self.start(body.span));
            body.visit_with(self);
        }

        self.pop_scope();
    }

    fn collect_constructor_param_bindings(&mut self, param: &ParamOrTsParamProp) {
        match param {
            ParamOrTsParamProp::Param(param) => {
                self.collect_pat_bindings(&param.pat, SymbolFlags::Param);
            }
            ParamOrTsParamProp::TsParamProp(param_prop) => match &param_prop.param {
                TsParamPropParam::Ident(binding_ident) => {
                    self.declare_symbol(
                        binding_ident.id.span,
                        binding_ident.id.sym.to_string(),
                        SymbolFlags::Param,
                    );
                }
                TsParamPropParam::Assign(assign) => {
                    self.collect_pat_bindings(&assign.left, SymbolFlags::Param);
                    assign.right.visit_with(self);
                }
            },
        }
    }

    fn visit_accessor_inner(
        &mut self,
        span: swc_common::Span,
        param: Option<&Pat>,
        body: Option<&BlockStmt>,
    ) {
        let _scope_id = self.push_scope(self.body_scope_flags(ScopeFlags::Function, body), span);

        if let Some(param) = param {
            self.collect_pat_bindings(param, SymbolFlags::Param);
        }

        if let Some(body) = body {
            self.function_body_spans.insert(self.start(body.span));
            body.visit_with(self);
        }

        self.pop_scope();
    }
}

impl Visit for SemanticBuilder {
    fn visit_program(&mut self, program: &Program) {
        let span = match program {
            Program::Module(module) => module.span,
            Program::Script(script) => script.span,
        };
        let root_scope_idx = self.scoping.root_scope_id().0 as usize;
        if let Some(root_scope) = self.scoping.scopes.get_mut(root_scope_idx) {
            root_scope.span = span;
            if matches!(program, Program::Module(_))
                || matches!(program, Program::Script(script) if Self::strict_directives_present(&script.body))
            {
                root_scope.flags = root_scope.flags | ScopeFlags::StrictMode;
            }
        }
        program.visit_children_with(self);
    }

    fn visit_import_decl(&mut self, import: &ImportDecl) {
        for spec in &import.specifiers {
            match spec {
                ImportSpecifier::Named(named) => {
                    self.declare_symbol(
                        named.local.span,
                        named.local.sym.to_string(),
                        SymbolFlags::Import,
                    );
                }
                ImportSpecifier::Default(default) => {
                    self.declare_symbol(
                        default.local.span,
                        default.local.sym.to_string(),
                        SymbolFlags::Import,
                    );
                }
                ImportSpecifier::Namespace(ns) => {
                    self.declare_symbol(
                        ns.local.span,
                        ns.local.sym.to_string(),
                        SymbolFlags::Import,
                    );
                }
            }
        }
    }

    fn visit_var_decl(&mut self, var_decl: &VarDecl) {
        let flags = match var_decl.kind {
            VarDeclKind::Var => SymbolFlags::FunctionScopedVariable,
            VarDeclKind::Let => SymbolFlags::BlockScopedVariable,
            VarDeclKind::Const => SymbolFlags::BlockScopedVariable | SymbolFlags::ConstVariable,
        };

        let target_scope = match var_decl.kind {
            VarDeclKind::Var => self.enclosing_var_scope(),
            VarDeclKind::Let | VarDeclKind::Const => self.current_scope(),
        };

        for declarator in &var_decl.decls {
            self.collect_pat_bindings_with_scope(&declarator.name, flags, target_scope);
            if let Some(init) = &declarator.init {
                init.visit_with(self);
            }
        }
    }

    fn visit_using_decl(&mut self, using_decl: &UsingDecl) {
        let flags = SymbolFlags::BlockScopedVariable | SymbolFlags::ConstVariable;
        let target_scope = self.current_scope();

        for declarator in &using_decl.decls {
            self.collect_pat_bindings_with_scope(&declarator.name, flags, target_scope);
            if let Some(init) = &declarator.init {
                init.visit_with(self);
            }
        }
    }

    fn visit_fn_decl(&mut self, fn_decl: &FnDecl) {
        let current_scope = self.current_scope();
        let hoist_scope = if self.should_hoist_block_function(&fn_decl.function) {
            self.enclosing_var_scope()
        } else {
            current_scope
        };
        let span = fn_decl.ident.span;
        let name = fn_decl.ident.sym.to_string();
        if let Some(symbol_id) = self.scoping.get_binding(hoist_scope, &name) {
            self.record_redeclaration_binding(span, symbol_id);
        } else if hoist_scope == current_scope {
            self.declare_symbol(span, name, SymbolFlags::Function);
        } else {
            self.declare_symbol_on_scope(span, name, SymbolFlags::Function, hoist_scope);
        }
        self.visit_function_inner(&fn_decl.function, ScopeFlags::Function);
    }

    fn visit_fn_expr(&mut self, fn_expr: &FnExpr) {
        let flags = self.body_scope_flags(ScopeFlags::Function, fn_expr.function.body.as_ref());
        self.push_scope(flags, fn_expr.function.span);

        if let Some(ident) = &fn_expr.ident {
            self.declare_symbol(
                ident.span,
                ident.sym.to_string(),
                SymbolFlags::FunctionExpression,
            );
        }

        for param in &fn_expr.function.params {
            self.collect_pat_bindings(&param.pat, SymbolFlags::Param);
        }

        if let Some(body) = &fn_expr.function.body {
            self.function_body_spans.insert(self.start(body.span));
            body.visit_with(self);
        }

        self.pop_scope();
    }

    fn visit_arrow_expr(&mut self, arrow: &ArrowExpr) {
        let flags = match &*arrow.body {
            BlockStmtOrExpr::BlockStmt(block) => {
                self.body_scope_flags(ScopeFlags::Function, Some(block))
            }
            BlockStmtOrExpr::Expr(_) => ScopeFlags::Function,
        };
        self.push_scope(flags, arrow.span);

        for param in &arrow.params {
            self.collect_pat_bindings(param, SymbolFlags::Param);
        }

        match &*arrow.body {
            BlockStmtOrExpr::BlockStmt(block) => {
                self.function_body_spans.insert(self.start(block.span));
                block.visit_with(self);
            }
            BlockStmtOrExpr::Expr(expr) => {
                expr.visit_with(self);
            }
        }

        self.pop_scope();
    }

    fn visit_block_stmt(&mut self, block: &BlockStmt) {
        if self.function_body_spans.remove(&self.start(block.span)) {
            block.visit_children_with(self);
        } else {
            self.push_scope(ScopeFlags::empty(), block.span);
            block.visit_children_with(self);
            self.pop_scope();
        }
    }

    fn visit_for_stmt(&mut self, for_stmt: &ForStmt) {
        self.push_scope(ScopeFlags::For, for_stmt.span);
        if let Some(init) = &for_stmt.init {
            init.visit_with(self);
        }
        if let Some(test) = &for_stmt.test {
            test.visit_with(self);
        }
        if let Some(update) = &for_stmt.update {
            update.visit_with(self);
        }
        for_stmt.body.visit_with(self);
        self.pop_scope();
    }

    fn visit_for_in_stmt(&mut self, for_in: &ForInStmt) {
        self.push_scope(ScopeFlags::For, for_in.span);
        for_in.left.visit_with(self);
        for_in.right.visit_with(self);
        for_in.body.visit_with(self);
        self.pop_scope();
    }

    fn visit_for_of_stmt(&mut self, for_of: &ForOfStmt) {
        self.push_scope(ScopeFlags::For, for_of.span);
        for_of.left.visit_with(self);
        for_of.right.visit_with(self);
        for_of.body.visit_with(self);
        self.pop_scope();
    }

    fn visit_catch_clause(&mut self, catch: &CatchClause) {
        self.push_scope(ScopeFlags::CatchClause, catch.span);

        if let Some(param) = &catch.param {
            self.collect_pat_bindings(param, SymbolFlags::CatchVariable);
        }

        self.function_body_spans.insert(self.start(catch.body.span));
        catch.body.visit_with(self);

        self.pop_scope();
    }

    fn visit_switch_stmt(&mut self, switch: &SwitchStmt) {
        switch.discriminant.visit_with(self);
        self.push_scope(ScopeFlags::Switch, switch.span);
        for case in &switch.cases {
            case.visit_with(self);
        }
        self.pop_scope();
    }

    fn visit_class_decl(&mut self, class_decl: &ClassDecl) {
        self.declare_symbol(
            class_decl.ident.span,
            class_decl.ident.sym.to_string(),
            SymbolFlags::Class,
        );

        self.push_scope(
            ScopeFlags::Class | ScopeFlags::StrictMode,
            class_decl.class.span,
        );
        class_decl.class.visit_children_with(self);
        self.pop_scope();
    }

    fn visit_class_expr(&mut self, class_expr: &ClassExpr) {
        self.push_scope(
            ScopeFlags::Class | ScopeFlags::StrictMode,
            class_expr.class.span,
        );

        if let Some(ident) = &class_expr.ident {
            self.declare_symbol(ident.span, ident.sym.to_string(), SymbolFlags::Class);
        }

        class_expr.class.visit_children_with(self);
        self.pop_scope();
    }

    fn visit_export_default_decl(&mut self, export: &ExportDefaultDecl) {
        match &export.decl {
            DefaultDecl::Fn(fn_expr) => {
                if let Some(ident) = &fn_expr.ident {
                    let hoist_scope = self.enclosing_var_scope();
                    self.declare_symbol_on_scope(
                        ident.span,
                        ident.sym.to_string(),
                        SymbolFlags::Function,
                        hoist_scope,
                    );
                }
                self.visit_function_inner(&fn_expr.function, ScopeFlags::Function);
            }
            DefaultDecl::Class(class_expr) => {
                if let Some(ident) = &class_expr.ident {
                    self.declare_symbol(ident.span, ident.sym.to_string(), SymbolFlags::Class);
                }

                self.push_scope(
                    ScopeFlags::Class | ScopeFlags::StrictMode,
                    class_expr.class.span,
                );
                class_expr.class.visit_children_with(self);
                self.pop_scope();
            }
            DefaultDecl::TsInterfaceDecl(decl) => {
                decl.visit_with(self);
            }
        }
    }

    fn visit_static_block(&mut self, block: &StaticBlock) {
        self.push_scope(
            ScopeFlags::ClassStaticBlock | ScopeFlags::StrictMode,
            block.span,
        );
        block.visit_children_with(self);
        self.pop_scope();
    }

    fn visit_ts_import_equals_decl(&mut self, decl: &TsImportEqualsDecl) {
        self.declare_symbol(decl.id.span, decl.id.sym.to_string(), SymbolFlags::Import);
        decl.module_ref.visit_with(self);
    }

    fn visit_ts_type_alias_decl(&mut self, _decl: &TsTypeAliasDecl) {}

    fn visit_ts_enum_decl(&mut self, decl: &TsEnumDecl) {
        self.declare_symbol(decl.id.span, decl.id.sym.to_string(), SymbolFlags::Enum);
        for member in &decl.members {
            member.visit_with(self);
        }
    }

    fn visit_ts_enum_member(&mut self, member: &TsEnumMember) {
        if let Some(init) = &member.init {
            init.visit_with(self);
        }
    }

    fn visit_ts_module_decl(&mut self, decl: &TsModuleDecl) {
        if let TsModuleName::Ident(ident) = &decl.id {
            self.declare_symbol(
                ident.span,
                ident.sym.to_string(),
                SymbolFlags::FunctionScopedVariable,
            );
        }

        if let Some(body) = &decl.body {
            self.push_scope(
                ScopeFlags::TsModuleBlock | ScopeFlags::StrictMode,
                decl.span,
            );
            body.visit_with(self);
            self.pop_scope();
        }
    }

    fn visit_ts_namespace_decl(&mut self, decl: &TsNamespaceDecl) {
        self.declare_symbol(
            decl.id.span,
            decl.id.sym.to_string(),
            SymbolFlags::FunctionScopedVariable,
        );

        self.push_scope(
            ScopeFlags::TsModuleBlock | ScopeFlags::StrictMode,
            decl.span,
        );
        decl.body.visit_with(self);
        self.pop_scope();
    }

    fn visit_ts_interface_decl(&mut self, _decl: &TsInterfaceDecl) {
        // Type-only declaration; do not traverse children to avoid recording
        // type references as value references.
    }

    fn visit_ident(&mut self, ident: &Ident) {
        let start = self.start(ident.span);
        if self.declaration_starts.contains(&start) {
            return;
        }
        self.reference_identifier(ident);
    }

    fn visit_member_expr(&mut self, member: &MemberExpr) {
        member.obj.visit_with(self);
        if let MemberProp::Computed(computed) = &member.prop {
            computed.visit_with(self);
        }
    }

    fn visit_prop(&mut self, prop: &Prop) {
        match prop {
            Prop::Shorthand(ident) => {
                self.reference_identifier(ident);
            }
            Prop::KeyValue(kv) => {
                if let PropName::Computed(computed) = &kv.key {
                    computed.visit_with(self);
                }
                kv.value.visit_with(self);
            }
            Prop::Assign(assign) => {
                assign.value.visit_with(self);
            }
            Prop::Getter(getter) => {
                if let PropName::Computed(computed) = &getter.key {
                    computed.visit_with(self);
                }
                self.visit_accessor_inner(getter.span, None, getter.body.as_ref());
            }
            Prop::Setter(setter) => {
                if let PropName::Computed(computed) = &setter.key {
                    computed.visit_with(self);
                }
                self.visit_accessor_inner(
                    setter.span,
                    Some(setter.param.as_ref()),
                    setter.body.as_ref(),
                );
            }
            Prop::Method(method) => {
                if let PropName::Computed(computed) = &method.key {
                    computed.visit_with(self);
                }
                self.visit_function_inner(&method.function, ScopeFlags::Function);
            }
        }
    }

    fn visit_class_method(&mut self, method: &ClassMethod) {
        if let PropName::Computed(computed) = &method.key {
            computed.visit_with(self);
        }

        self.visit_function_inner_with_span(method.span, &method.function, ScopeFlags::Function);
    }

    fn visit_private_method(&mut self, method: &PrivateMethod) {
        self.visit_function_inner_with_span(method.span, &method.function, ScopeFlags::Function);
    }

    fn visit_constructor(&mut self, constructor: &Constructor) {
        if let PropName::Computed(computed) = &constructor.key {
            computed.visit_with(self);
        }

        self.visit_constructor_inner(constructor);
    }

    fn visit_labeled_stmt(&mut self, labeled: &LabeledStmt) {
        labeled.body.visit_with(self);
    }

    fn visit_break_stmt(&mut self, _break_stmt: &BreakStmt) {}

    fn visit_continue_stmt(&mut self, _continue_stmt: &ContinueStmt) {}
}

impl SemanticBuilder {
    fn collect_pat_bindings_with_scope(&mut self, pat: &Pat, flags: SymbolFlags, scope: ScopeId) {
        match pat {
            Pat::Ident(binding_ident) => {
                let _symbol_id = self.declare_symbol_on_scope(
                    binding_ident.id.span,
                    binding_ident.id.sym.to_string(),
                    flags,
                    scope,
                );
            }
            Pat::Array(arr) => {
                for p in arr.elems.iter().flatten() {
                    self.collect_pat_bindings_with_scope(p, flags, scope);
                }
            }
            Pat::Object(obj) => {
                for prop in &obj.props {
                    match prop {
                        ObjectPatProp::KeyValue(kv) => {
                            if let PropName::Computed(computed) = &kv.key {
                                computed.visit_with(self);
                            }
                            self.collect_pat_bindings_with_scope(&kv.value, flags, scope);
                        }
                        ObjectPatProp::Assign(assign) => {
                            let _symbol_id = self.declare_symbol_on_scope(
                                assign.key.id.span,
                                assign.key.id.sym.to_string(),
                                flags,
                                scope,
                            );
                            if let Some(value) = &assign.value {
                                value.visit_with(self);
                            }
                        }
                        ObjectPatProp::Rest(rest) => {
                            self.collect_pat_bindings_with_scope(&rest.arg, flags, scope);
                        }
                    }
                }
            }
            Pat::Rest(rest) => {
                self.collect_pat_bindings_with_scope(&rest.arg, flags, scope);
            }
            Pat::Assign(assign) => {
                self.collect_pat_bindings_with_scope(&assign.left, flags, scope);
                assign.right.visit_with(self);
            }
            Pat::Expr(_) | Pat::Invalid(_) => {}
        }
    }

    /// Consume the builder and produce a React Compiler [`ScopeInfo`].
    fn into_scope_info(self, program: &Program) -> react_compiler_ast::scope::ScopeInfo {
        use react_compiler_ast::scope::{
            BindingData, BindingId, BindingKind, ScopeData, ScopeId as OutScopeId, ScopeInfo,
        };

        let import_map = build_import_map(program);

        let mut scopes: Vec<ScopeData> = Vec::new();
        let mut bindings: Vec<BindingData> = Vec::new();
        let mut node_to_scope: FxHashMap<u32, OutScopeId> = FxHashMap::default();
        let mut node_to_scope_end: FxHashMap<u32, u32> = FxHashMap::default();
        let mut node_id_to_scope: FxHashMap<u32, OutScopeId> = FxHashMap::default();
        let mut ref_node_id_to_binding: FxIndexMap<u32, BindingId> = FxIndexMap::default();

        let mut symbol_to_binding: HashMap<SymbolId, BindingId> = HashMap::new();

        // First pass: Create all bindings from symbols
        for symbol_id in self.scoping.symbol_ids() {
            let symbol_flags = self.scoping.symbol_flags(symbol_id);
            let name = self.scoping.symbol_name(symbol_id).to_string();

            let kind = get_binding_kind(symbol_flags);

            let span = self.scoping.symbol_span(symbol_id);
            let declaration_type = "BindingIdentifier".to_string();
            let declaration_start = Some(span.lo.0);

            let import = if matches!(kind, BindingKind::Module) {
                declaration_start.and_then(|start| import_map.get(&start).cloned())
            } else {
                None
            };

            let binding_id = BindingId(bindings.len() as u32);
            symbol_to_binding.insert(symbol_id, binding_id);

            bindings.push(BindingData {
                id: binding_id,
                name,
                kind,
                scope: OutScopeId(0), // Placeholder, filled in second pass
                declaration_type,
                declaration_start,
                declaration_node_id: declaration_start,
                import,
            });
        }

        // Second pass: Create all scopes and update binding scope references
        for scope_id in self.scoping.scope_descendants_from_root() {
            let scope_flags = self.scoping.scope_flags(scope_id);
            let parent = self.scoping.scope_parent_id(scope_id);

            let out_scope_id = OutScopeId(scope_id.0);

            let kind = get_scope_kind(scope_flags);

            let mut scope_bindings: FxHashMap<String, BindingId> = FxHashMap::default();
            for symbol_id in self.scoping.iter_bindings_in(scope_id) {
                if let Some(&binding_id) = symbol_to_binding.get(&symbol_id) {
                    let name = bindings[binding_id.0 as usize].name.clone();
                    scope_bindings.insert(name, binding_id);
                    bindings[binding_id.0 as usize].scope = out_scope_id;
                }
            }

            let span = self.scoping.scope_span(scope_id);
            let start = span.lo.0;
            let end = span.hi.0;

            if end > start {
                node_to_scope.insert(start, out_scope_id);
                node_to_scope_end.insert(start, end);
            } else {
                node_to_scope.insert(start, out_scope_id);
            }
            node_id_to_scope.insert(start, out_scope_id);

            scopes.push(ScopeData {
                id: out_scope_id,
                parent: parent.map(|p| OutScopeId(p.0)),
                kind,
                bindings: scope_bindings,
            });
        }

        // Third pass: Map all resolved references to bindings
        for symbol_id in self.scoping.symbol_ids() {
            if let Some(&binding_id) = symbol_to_binding.get(&symbol_id) {
                for ref_id in self.scoping.get_resolved_reference_ids(symbol_id) {
                    let reference = self.scoping.get_reference(ref_id);
                    let start = reference.span.lo.0;
                    ref_node_id_to_binding.insert(start, binding_id);
                }
            }
        }

        // Also map declaration identifiers to their bindings
        for symbol_id in self.scoping.symbol_ids() {
            if let Some(&binding_id) = symbol_to_binding.get(&symbol_id) {
                if let Some(start) = bindings[binding_id.0 as usize].declaration_start {
                    ref_node_id_to_binding.entry(start).or_insert(binding_id);
                }
            }
        }

        for (start, symbol_id) in &self.redeclaration_bindings {
            if let Some(&binding_id) = symbol_to_binding.get(symbol_id) {
                ref_node_id_to_binding.insert(*start, binding_id);
            }
        }

        // Map `export default function Foo` — Babel treats the
        // ExportDefaultDeclaration as a reference to the function's binding.
        if let Program::Module(module) = program {
            for stmt in &module.body {
                if let ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(export)) = stmt {
                    if let DefaultDecl::Fn(func) = &export.decl {
                        if let Some(ident) = &func.ident {
                            let name = ident.sym.as_ref();
                            for (sym_id, &bind_id) in &symbol_to_binding {
                                if self.scoping.symbol_name(*sym_id) == name {
                                    let export_start = export.span.lo.0;
                                    ref_node_id_to_binding
                                        .entry(export_start)
                                        .or_insert(bind_id);
                                    break;
                                }
                            }
                        }
                    }
                }
            }
        }

        let program_scope = OutScopeId(self.scoping.root_scope_id().0);

        ScopeInfo {
            scopes,
            bindings,
            node_to_scope,
            node_to_scope_end,
            reference_to_binding: FxIndexMap::default(),
            ref_node_id_to_binding,
            node_id_to_scope,
            program_scope,
        }
    }
}

/// Build a map from import specifier span start to its import data.
fn build_import_map(
    program: &Program,
) -> HashMap<u32, react_compiler_ast::scope::ImportBindingData> {
    use react_compiler_ast::scope::{ImportBindingData, ImportBindingKind};

    let mut map = HashMap::new();
    let items = match program {
        Program::Module(m) => &m.body,
        Program::Script(_) => return map,
    };
    for item in items {
        let ModuleItem::ModuleDecl(ModuleDecl::Import(import)) = item else {
            continue;
        };
        let source = import.src.value.to_string_lossy().into_owned();
        for spec in &import.specifiers {
            match spec {
                ImportSpecifier::Named(named) => {
                    let imported = named.imported.as_ref().map(|name| match name {
                        ModuleExportName::Ident(ident) => ident.sym.to_string(),
                        ModuleExportName::Str(s) => s.value.to_string_lossy().into_owned(),
                    });
                    map.insert(
                        named.local.span.lo.0,
                        ImportBindingData {
                            source: source.clone(),
                            kind: ImportBindingKind::Named,
                            imported,
                        },
                    );
                }
                ImportSpecifier::Default(default) => {
                    map.insert(
                        default.local.span.lo.0,
                        ImportBindingData {
                            source: source.clone(),
                            kind: ImportBindingKind::Default,
                            imported: None,
                        },
                    );
                }
                ImportSpecifier::Namespace(ns) => {
                    map.insert(
                        ns.local.span.lo.0,
                        ImportBindingData {
                            source: source.clone(),
                            kind: ImportBindingKind::Namespace,
                            imported: None,
                        },
                    );
                }
            }
        }
    }
    map
}

/// Map our ScopeFlags to react_compiler_ast ScopeKind.
fn get_scope_kind(flags: ScopeFlags) -> react_compiler_ast::scope::ScopeKind {
    use react_compiler_ast::scope::ScopeKind;

    if flags.is_top() {
        return ScopeKind::Program;
    }

    if flags.is_function() {
        return ScopeKind::Function;
    }

    if flags.is_catch_clause() {
        return ScopeKind::Catch;
    }

    if flags.contains(ScopeFlags::For) {
        return ScopeKind::For;
    }

    if flags.contains(ScopeFlags::Switch) {
        return ScopeKind::Switch;
    }

    if flags.contains(ScopeFlags::Class) || flags.is_class_static_block() {
        return ScopeKind::Class;
    }

    ScopeKind::Block
}

/// Map our SymbolFlags to react_compiler_ast BindingKind.
fn get_binding_kind(flags: SymbolFlags) -> react_compiler_ast::scope::BindingKind {
    use react_compiler_ast::scope::BindingKind;

    if flags.contains(SymbolFlags::Import) {
        return BindingKind::Module;
    }

    if flags.contains(SymbolFlags::CatchVariable) {
        return BindingKind::Let;
    }

    if flags.contains(SymbolFlags::Param) {
        return BindingKind::Param;
    }

    if flags.contains(SymbolFlags::FunctionScopedVariable) {
        return BindingKind::Var;
    }

    if flags.contains(SymbolFlags::BlockScopedVariable) {
        if flags.contains(SymbolFlags::ConstVariable) {
            return BindingKind::Const;
        } else {
            return BindingKind::Let;
        }
    }

    if flags.contains(SymbolFlags::FunctionExpression) {
        return BindingKind::Local;
    }

    if flags.contains(SymbolFlags::Enum) {
        BindingKind::Local
    } else if flags.contains(SymbolFlags::Function) {
        BindingKind::Hoisted
    } else if flags.contains(SymbolFlags::Class) {
        BindingKind::Local
    } else {
        BindingKind::Unknown
    }
}
