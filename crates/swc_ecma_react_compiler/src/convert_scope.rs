// Copyright (c) Meta Platforms, Inc. and affiliates.
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

use std::collections::{HashMap, HashSet};

use indexmap::IndexMap;
use react_compiler_ast::scope::*;
use swc_ecma_ast::*;
use swc_ecma_visit::{Visit, VisitWith};

/// Helper to convert an SWC `Str` node's value to a Rust `String`.
fn str_value_to_string(s: &Str) -> String {
    s.value.to_string_lossy().into_owned()
}

/// Build scope information from an SWC Program AST.
///
/// This performs two passes over the AST:
/// 1. Build the scope tree and collect all bindings.
/// 2. Resolve identifier references to their bindings.
pub fn build_scope_info(program: &Program) -> ScopeInfo {
    let mut collector = ScopeCollector::new();
    collector.visit_program(program);

    let ref_node_id_to_binding = {
        let mut resolver = ReferenceResolver::new(&collector);
        resolver.visit_program(program);

        collector
            .bindings
            .iter()
            .filter_map(|binding| binding.declaration_start.map(|start| (start, binding.id)))
            .for_each(|(start, id)| {
                resolver.reference_to_binding.entry(start).or_insert(id);
            });

        resolver.reference_to_binding.extend(
            collector
                .redeclaration_refs
                .iter()
                .map(|(&start, &binding_id)| (start, binding_id)),
        );

        resolver.reference_to_binding
    };

    let node_id_to_scope = collector.node_to_scope.clone();

    ScopeInfo {
        scopes: collector.scopes,
        bindings: collector.bindings,
        node_to_scope: collector.node_to_scope,
        node_to_scope_end: collector.node_to_scope_end,
        reference_to_binding: IndexMap::new(),
        ref_node_id_to_binding,
        node_id_to_scope,
        program_scope: ScopeId(0),
    }
}

// ── Pass 1: Scope tree + binding collection ─────────────────────────────────

struct ScopeCollector {
    scopes: Vec<ScopeData>,
    bindings: Vec<BindingData>,
    node_to_scope: HashMap<u32, ScopeId>,
    node_to_scope_end: HashMap<u32, u32>,
    /// Stack of scope IDs representing the current nesting.
    scope_stack: Vec<ScopeId>,
    /// Set of span starts for block statements that are direct function/catch
    /// bodies. These should not create a separate Block scope.
    function_body_spans: HashSet<u32>,
    /// Function declarations that redeclare an existing hoisted name resolve to
    /// the first binding's `BindingId`, so the compiler treats the
    /// redeclaration as a reassignment rather than a new binding.
    redeclaration_refs: HashMap<u32, BindingId>,
}

impl ScopeCollector {
    fn new() -> Self {
        Self {
            scopes: Vec::new(),
            bindings: Vec::new(),
            node_to_scope: HashMap::new(),
            node_to_scope_end: HashMap::new(),
            scope_stack: Vec::new(),
            function_body_spans: HashSet::new(),
            redeclaration_refs: HashMap::new(),
        }
    }

    fn start(&self, span: swc_common::Span) -> u32 {
        span.lo.0
    }

    fn end(&self, span: swc_common::Span) -> u32 {
        span.hi.0
    }

    fn current_scope(&self) -> ScopeId {
        *self.scope_stack.last().expect("scope stack is empty")
    }

    fn push_scope(&mut self, kind: ScopeKind, node_start: u32, node_end: u32) -> ScopeId {
        let id = ScopeId(self.scopes.len() as u32);
        let parent = self.scope_stack.last().copied();
        self.scopes.push(ScopeData {
            id,
            parent,
            kind,
            bindings: HashMap::new(),
        });
        self.node_to_scope.insert(node_start, id);
        if node_end > node_start {
            self.node_to_scope_end.insert(node_start, node_end);
        }
        self.scope_stack.push(id);
        id
    }

    fn pop_scope(&mut self) {
        self.scope_stack.pop();
    }

    /// Find the nearest enclosing function or program scope for hoisting `var`
    /// and function declarations.
    fn enclosing_function_scope(&self) -> ScopeId {
        self.scope_stack
            .iter()
            .rev()
            .copied()
            .find(|scope_id| {
                matches!(
                    self.scopes[scope_id.0 as usize].kind,
                    ScopeKind::Function | ScopeKind::Program
                )
            })
            .unwrap_or(ScopeId(0))
    }

    fn add_binding(
        &mut self,
        name: String,
        kind: BindingKind,
        scope: ScopeId,
        declaration_type: &str,
        declaration_start: Option<u32>,
        import: Option<ImportBindingData>,
    ) -> BindingId {
        let id = BindingId(self.bindings.len() as u32);
        self.bindings.push(BindingData {
            id,
            name: name.clone(),
            kind,
            scope,
            declaration_type: declaration_type.to_string(),
            declaration_start,
            declaration_node_id: declaration_start,
            import,
        });
        self.scopes[scope.0 as usize].bindings.insert(name, id);
        id
    }

    fn add_ident_binding(
        &mut self,
        ident: &Ident,
        kind: BindingKind,
        scope: ScopeId,
        declaration_type: &str,
        import: Option<ImportBindingData>,
    ) -> BindingId {
        let start = self.start(ident.span);
        self.add_binding(
            ident.sym.to_string(),
            kind,
            scope,
            declaration_type,
            Some(start),
            import,
        )
    }

    /// Extract all binding identifiers from a pattern, adding each as a
    /// binding.
    fn collect_pat_bindings(
        &mut self,
        pat: &Pat,
        kind: BindingKind,
        scope: ScopeId,
        declaration_type: &str,
    ) {
        match pat {
            Pat::Ident(binding_ident) => {
                self.add_ident_binding(&binding_ident.id, kind, scope, declaration_type, None);
            }
            Pat::Array(arr) => {
                for p in arr.elems.iter().flatten() {
                    self.collect_pat_bindings(p, kind.clone(), scope, declaration_type);
                }
            }
            Pat::Object(obj) => {
                for prop in &obj.props {
                    match prop {
                        ObjectPatProp::KeyValue(kv) => {
                            self.collect_pat_bindings(
                                &kv.value,
                                kind.clone(),
                                scope,
                                declaration_type,
                            );
                        }
                        ObjectPatProp::Assign(assign) => {
                            self.add_ident_binding(
                                &assign.key.id,
                                kind.clone(),
                                scope,
                                declaration_type,
                                None,
                            );
                        }
                        ObjectPatProp::Rest(rest) => {
                            self.collect_pat_bindings(
                                &rest.arg,
                                kind.clone(),
                                scope,
                                declaration_type,
                            );
                        }
                    }
                }
            }
            Pat::Rest(rest) => {
                self.collect_pat_bindings(&rest.arg, kind, scope, declaration_type);
            }
            Pat::Assign(assign) => {
                self.collect_pat_bindings(&assign.left, kind, scope, declaration_type);
            }
            Pat::Expr(_) | Pat::Invalid(_) => {}
        }
    }

    /// Visit a function's internals, creating the function scope.
    fn visit_function_inner(&mut self, function: &Function) {
        let func_start = self.start(function.span);
        self.push_scope(ScopeKind::Function, func_start, self.end(function.span));

        for param in &function.params {
            self.collect_pat_bindings(
                &param.pat,
                BindingKind::Param,
                self.current_scope(),
                "FormalParameter",
            );
        }

        if let Some(body) = &function.body {
            self.function_body_spans.insert(self.start(body.span));
            body.visit_with(self);
        }

        self.pop_scope();
    }

    fn visit_using_decl_as_bindings(&mut self, using: &UsingDecl) {
        let target_scope = self.current_scope();
        for declarator in &using.decls {
            self.collect_pat_bindings(
                &declarator.name,
                BindingKind::Const,
                target_scope,
                "VariableDeclarator",
            );
            if let Some(init) = &declarator.init {
                init.visit_with(self);
            }
        }
    }
}

impl Visit for ScopeCollector {
    fn visit_program(&mut self, program: &Program) {
        let span = match program {
            Program::Module(module) => module.span,
            Program::Script(script) => script.span,
        };
        self.push_scope(ScopeKind::Program, self.start(span), self.end(span));
        program.visit_children_with(self);
        self.pop_scope();
    }

    fn visit_import_decl(&mut self, import: &ImportDecl) {
        let source = str_value_to_string(&import.src);
        let program_scope = ScopeId(0);

        for spec in &import.specifiers {
            match spec {
                ImportSpecifier::Named(named) => {
                    let local_name = named.local.sym.to_string();
                    let start = self.start(named.local.span);
                    let imported_name = match &named.imported {
                        Some(ModuleExportName::Ident(ident)) => ident.sym.to_string(),
                        Some(ModuleExportName::Str(s)) => str_value_to_string(s),
                        None => local_name.clone(),
                    };
                    self.add_binding(
                        local_name,
                        BindingKind::Module,
                        program_scope,
                        "ImportSpecifier",
                        Some(start),
                        Some(ImportBindingData {
                            source: source.clone(),
                            kind: ImportBindingKind::Named,
                            imported: Some(imported_name),
                        }),
                    );
                }
                ImportSpecifier::Default(default) => {
                    let local_name = default.local.sym.to_string();
                    let start = self.start(default.local.span);
                    self.add_binding(
                        local_name,
                        BindingKind::Module,
                        program_scope,
                        "ImportDefaultSpecifier",
                        Some(start),
                        Some(ImportBindingData {
                            source: source.clone(),
                            kind: ImportBindingKind::Default,
                            imported: None,
                        }),
                    );
                }
                ImportSpecifier::Namespace(ns) => {
                    let local_name = ns.local.sym.to_string();
                    let start = self.start(ns.local.span);
                    self.add_binding(
                        local_name,
                        BindingKind::Module,
                        program_scope,
                        "ImportNamespaceSpecifier",
                        Some(start),
                        Some(ImportBindingData {
                            source: source.clone(),
                            kind: ImportBindingKind::Namespace,
                            imported: None,
                        }),
                    );
                }
            }
        }
    }

    fn visit_var_decl(&mut self, var_decl: &VarDecl) {
        let (kind, declaration_type) = match var_decl.kind {
            VarDeclKind::Var => (BindingKind::Var, "VariableDeclarator"),
            VarDeclKind::Let => (BindingKind::Let, "VariableDeclarator"),
            VarDeclKind::Const => (BindingKind::Const, "VariableDeclarator"),
        };

        let target_scope = match var_decl.kind {
            VarDeclKind::Var => self.enclosing_function_scope(),
            VarDeclKind::Let | VarDeclKind::Const => self.current_scope(),
        };

        for declarator in &var_decl.decls {
            self.collect_pat_bindings(
                &declarator.name,
                kind.clone(),
                target_scope,
                declaration_type,
            );
            if let Some(init) = &declarator.init {
                init.visit_with(self);
            }
        }
    }

    fn visit_using_decl(&mut self, using: &UsingDecl) {
        self.visit_using_decl_as_bindings(using);
    }

    fn visit_fn_decl(&mut self, fn_decl: &FnDecl) {
        let hoist_scope = self.enclosing_function_scope();
        let name = fn_decl.ident.sym.to_string();
        let start = self.start(fn_decl.ident.span);
        if let Some(&existing_id) = self.scopes[hoist_scope.0 as usize].bindings.get(&name) {
            self.redeclaration_refs.insert(start, existing_id);
        } else {
            self.add_binding(
                name,
                BindingKind::Hoisted,
                hoist_scope,
                "FunctionDeclaration",
                Some(start),
                None,
            );
        }

        self.visit_function_inner(&fn_decl.function);
    }

    fn visit_export_default_decl(&mut self, decl: &ExportDefaultDecl) {
        match &decl.decl {
            DefaultDecl::Fn(fn_expr) => {
                if let Some(ident) = &fn_expr.ident {
                    let hoist_scope = self.enclosing_function_scope();
                    self.add_ident_binding(
                        ident,
                        BindingKind::Hoisted,
                        hoist_scope,
                        "FunctionDeclaration",
                        None,
                    );
                }
                self.visit_function_inner(&fn_expr.function);
            }
            DefaultDecl::Class(class_expr) => {
                if let Some(ident) = &class_expr.ident {
                    self.add_ident_binding(
                        ident,
                        BindingKind::Local,
                        self.current_scope(),
                        "ClassDeclaration",
                        None,
                    );
                }
                self.push_scope(
                    ScopeKind::Class,
                    self.start(class_expr.class.span),
                    self.end(class_expr.class.span),
                );
                class_expr.class.visit_children_with(self);
                self.pop_scope();
            }
            DefaultDecl::TsInterfaceDecl(d) => {
                d.visit_with(self);
            }
        }
    }

    fn visit_fn_expr(&mut self, fn_expr: &FnExpr) {
        let func_start = self.start(fn_expr.function.span);
        self.push_scope(
            ScopeKind::Function,
            func_start,
            self.end(fn_expr.function.span),
        );

        if let Some(ident) = &fn_expr.ident {
            self.add_ident_binding(
                ident,
                BindingKind::Local,
                self.current_scope(),
                "FunctionExpression",
                None,
            );
        }

        for param in &fn_expr.function.params {
            self.collect_pat_bindings(
                &param.pat,
                BindingKind::Param,
                self.current_scope(),
                "FormalParameter",
            );
        }

        if let Some(body) = &fn_expr.function.body {
            self.function_body_spans.insert(self.start(body.span));
            body.visit_with(self);
        }

        self.pop_scope();
    }

    fn visit_arrow_expr(&mut self, arrow: &ArrowExpr) {
        let func_start = self.start(arrow.span);
        self.push_scope(ScopeKind::Function, func_start, self.end(arrow.span));

        for param in &arrow.params {
            self.collect_pat_bindings(
                param,
                BindingKind::Param,
                self.current_scope(),
                "FormalParameter",
            );
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
            self.push_scope(
                ScopeKind::Block,
                self.start(block.span),
                self.end(block.span),
            );
            block.visit_children_with(self);
            self.pop_scope();
        }
    }

    fn visit_for_stmt(&mut self, for_stmt: &ForStmt) {
        self.push_scope(
            ScopeKind::For,
            self.start(for_stmt.span),
            self.end(for_stmt.span),
        );

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
        self.push_scope(
            ScopeKind::For,
            self.start(for_in.span),
            self.end(for_in.span),
        );
        for_in.left.visit_with(self);
        for_in.right.visit_with(self);
        for_in.body.visit_with(self);
        self.pop_scope();
    }

    fn visit_for_of_stmt(&mut self, for_of: &ForOfStmt) {
        self.push_scope(
            ScopeKind::For,
            self.start(for_of.span),
            self.end(for_of.span),
        );
        for_of.left.visit_with(self);
        for_of.right.visit_with(self);
        for_of.body.visit_with(self);
        self.pop_scope();
    }

    fn visit_catch_clause(&mut self, catch: &CatchClause) {
        self.push_scope(
            ScopeKind::Catch,
            self.start(catch.span),
            self.end(catch.span),
        );

        if let Some(param) = &catch.param {
            self.collect_pat_bindings(param, BindingKind::Let, self.current_scope(), "CatchClause");
        }

        self.function_body_spans.insert(self.start(catch.body.span));
        catch.body.visit_with(self);

        self.pop_scope();
    }

    fn visit_switch_stmt(&mut self, switch: &SwitchStmt) {
        switch.discriminant.visit_with(self);

        self.push_scope(
            ScopeKind::Switch,
            self.start(switch.span),
            self.end(switch.span),
        );
        for case in &switch.cases {
            case.visit_with(self);
        }
        self.pop_scope();
    }

    fn visit_class_decl(&mut self, class_decl: &ClassDecl) {
        self.add_ident_binding(
            &class_decl.ident,
            BindingKind::Local,
            self.current_scope(),
            "ClassDeclaration",
            None,
        );

        self.push_scope(
            ScopeKind::Class,
            self.start(class_decl.class.span),
            self.end(class_decl.class.span),
        );
        class_decl.class.visit_children_with(self);
        self.pop_scope();
    }

    fn visit_class_expr(&mut self, class_expr: &ClassExpr) {
        self.push_scope(
            ScopeKind::Class,
            self.start(class_expr.class.span),
            self.end(class_expr.class.span),
        );

        if let Some(ident) = &class_expr.ident {
            self.add_ident_binding(
                ident,
                BindingKind::Local,
                self.current_scope(),
                "ClassExpression",
                None,
            );
        }

        class_expr.class.visit_children_with(self);
        self.pop_scope();
    }

    fn visit_ts_type_alias_decl(&mut self, decl: &TsTypeAliasDecl) {
        self.add_ident_binding(
            &decl.id,
            BindingKind::Local,
            self.current_scope(),
            "TSTypeAliasDeclaration",
            None,
        );
        decl.type_ann.visit_with(self);
    }

    fn visit_ts_enum_decl(&mut self, decl: &TsEnumDecl) {
        self.add_ident_binding(
            &decl.id,
            BindingKind::Local,
            self.current_scope(),
            "TSEnumDeclaration",
            None,
        );
        decl.visit_children_with(self);
    }

    fn visit_ts_module_decl(&mut self, decl: &TsModuleDecl) {
        if let TsModuleName::Ident(id) = &decl.id {
            self.add_ident_binding(
                id,
                BindingKind::Local,
                self.current_scope(),
                "TSModuleDeclaration",
                None,
            );
        }
        decl.visit_children_with(self);
    }

    fn visit_function(&mut self, f: &Function) {
        self.visit_function_inner(f);
    }
}

// ── Pass 2: Reference resolution ────────────────────────────────────────────

struct ReferenceResolver<'a> {
    scopes: &'a [ScopeData],
    #[allow(dead_code)]
    bindings: &'a [BindingData],
    node_to_scope: &'a HashMap<u32, ScopeId>,
    reference_to_binding: IndexMap<u32, BindingId>,
    /// Stack of scope IDs for resolution.
    scope_stack: Vec<ScopeId>,
    /// Declaration positions to skip. These are binding sites, not references.
    declaration_starts: HashSet<u32>,
    /// Span starts for block statements that are direct function/catch bodies.
    function_body_spans: HashSet<u32>,
}

impl<'a> ReferenceResolver<'a> {
    fn new(collector: &'a ScopeCollector) -> Self {
        let declaration_starts = collector
            .bindings
            .iter()
            .filter_map(|binding| binding.declaration_start)
            .collect();
        Self {
            scopes: &collector.scopes,
            bindings: &collector.bindings,
            node_to_scope: &collector.node_to_scope,
            reference_to_binding: IndexMap::new(),
            scope_stack: Vec::new(),
            declaration_starts,
            function_body_spans: HashSet::new(),
        }
    }

    fn start(&self, span: swc_common::Span) -> u32 {
        span.lo.0
    }

    fn current_scope(&self) -> ScopeId {
        *self.scope_stack.last().expect("scope stack is empty")
    }

    fn resolve_ident(&mut self, name: &str, start: u32) {
        if self.declaration_starts.contains(&start) {
            return;
        }

        let mut current = Some(self.current_scope());
        while let Some(scope_id) = current {
            let scope = &self.scopes[scope_id.0 as usize];
            if let Some(&binding_id) = scope.bindings.get(name) {
                self.reference_to_binding.insert(start, binding_id);
                return;
            }
            current = scope.parent;
        }
    }

    fn find_scope_at(&self, node_start: u32) -> Option<&ScopeId> {
        self.node_to_scope.get(&node_start)
    }

    /// Visit a binding pattern: skip binding identifiers, but visit default
    /// values and computed keys as references.
    fn visit_binding_pattern_references(&mut self, pat: &Pat) {
        match pat {
            Pat::Ident(_) => {}
            Pat::Array(arr) => {
                for p in arr.elems.iter().flatten() {
                    self.visit_binding_pattern_references(p);
                }
            }
            Pat::Object(obj) => {
                for prop in &obj.props {
                    match prop {
                        ObjectPatProp::KeyValue(kv) => {
                            if let PropName::Computed(computed) = &kv.key {
                                computed.visit_with(self);
                            }
                            self.visit_binding_pattern_references(&kv.value);
                        }
                        ObjectPatProp::Assign(assign) => {
                            if let Some(value) = &assign.value {
                                value.visit_with(self);
                            }
                        }
                        ObjectPatProp::Rest(rest) => {
                            self.visit_binding_pattern_references(&rest.arg);
                        }
                    }
                }
            }
            Pat::Assign(assign) => {
                self.visit_binding_pattern_references(&assign.left);
                assign.right.visit_with(self);
            }
            Pat::Rest(rest) => {
                self.visit_binding_pattern_references(&rest.arg);
            }
            Pat::Expr(expr) => {
                expr.visit_with(self);
            }
            Pat::Invalid(_) => {}
        }
    }

    /// Visit function internals for the resolver, mirroring the collector.
    fn visit_function_inner(&mut self, function: &Function) {
        let func_start = self.start(function.span);
        if let Some(&scope_id) = self.find_scope_at(func_start) {
            self.scope_stack.push(scope_id);

            for param in &function.params {
                self.visit_binding_pattern_references(&param.pat);
            }

            if let Some(body) = &function.body {
                self.function_body_spans.insert(self.start(body.span));
                body.visit_with(self);
            }

            self.scope_stack.pop();
        }
    }
}

impl Visit for ReferenceResolver<'_> {
    fn visit_program(&mut self, program: &Program) {
        self.scope_stack.push(ScopeId(0));
        program.visit_children_with(self);
        self.scope_stack.pop();
    }

    fn visit_ident(&mut self, ident: &Ident) {
        let start = self.start(ident.span);
        self.resolve_ident(ident.sym.as_ref(), start);
    }

    fn visit_import_decl(&mut self, _import: &ImportDecl) {
        // Do not recurse. Import identifiers are declarations.
    }

    fn visit_var_decl(&mut self, var_decl: &VarDecl) {
        for declarator in &var_decl.decls {
            self.visit_binding_pattern_references(&declarator.name);
            if let Some(init) = &declarator.init {
                init.visit_with(self);
            }
        }
    }

    fn visit_using_decl(&mut self, using: &UsingDecl) {
        for declarator in &using.decls {
            self.visit_binding_pattern_references(&declarator.name);
            if let Some(init) = &declarator.init {
                init.visit_with(self);
            }
        }
    }

    fn visit_fn_decl(&mut self, fn_decl: &FnDecl) {
        self.visit_function_inner(&fn_decl.function);
    }

    fn visit_export_default_decl(&mut self, decl: &ExportDefaultDecl) {
        match &decl.decl {
            DefaultDecl::Fn(fn_expr) => {
                self.visit_function_inner(&fn_expr.function);
            }
            DefaultDecl::Class(class_expr) => {
                if let Some(&scope_id) = self.find_scope_at(self.start(class_expr.class.span)) {
                    self.scope_stack.push(scope_id);
                    class_expr.class.visit_children_with(self);
                    self.scope_stack.pop();
                }
            }
            DefaultDecl::TsInterfaceDecl(d) => {
                d.visit_with(self);
            }
        }
    }

    fn visit_fn_expr(&mut self, fn_expr: &FnExpr) {
        let func_start = self.start(fn_expr.function.span);
        if let Some(&scope_id) = self.find_scope_at(func_start) {
            self.scope_stack.push(scope_id);

            for param in &fn_expr.function.params {
                self.visit_binding_pattern_references(&param.pat);
            }

            if let Some(body) = &fn_expr.function.body {
                self.function_body_spans.insert(self.start(body.span));
                body.visit_with(self);
            }

            self.scope_stack.pop();
        }
    }

    fn visit_arrow_expr(&mut self, arrow: &ArrowExpr) {
        let func_start = self.start(arrow.span);
        if let Some(&scope_id) = self.find_scope_at(func_start) {
            self.scope_stack.push(scope_id);

            for param in &arrow.params {
                self.visit_binding_pattern_references(param);
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

            self.scope_stack.pop();
        }
    }

    fn visit_block_stmt(&mut self, block: &BlockStmt) {
        if self.function_body_spans.remove(&self.start(block.span)) {
            block.visit_children_with(self);
        } else if let Some(&scope_id) = self.find_scope_at(self.start(block.span)) {
            self.scope_stack.push(scope_id);
            block.visit_children_with(self);
            self.scope_stack.pop();
        } else {
            block.visit_children_with(self);
        }
    }

    fn visit_for_stmt(&mut self, for_stmt: &ForStmt) {
        if let Some(&scope_id) = self.find_scope_at(self.start(for_stmt.span)) {
            self.scope_stack.push(scope_id);

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

            self.scope_stack.pop();
        }
    }

    fn visit_for_in_stmt(&mut self, for_in: &ForInStmt) {
        if let Some(&scope_id) = self.find_scope_at(self.start(for_in.span)) {
            self.scope_stack.push(scope_id);
            for_in.left.visit_with(self);
            for_in.right.visit_with(self);
            for_in.body.visit_with(self);
            self.scope_stack.pop();
        }
    }

    fn visit_for_of_stmt(&mut self, for_of: &ForOfStmt) {
        if let Some(&scope_id) = self.find_scope_at(self.start(for_of.span)) {
            self.scope_stack.push(scope_id);
            for_of.left.visit_with(self);
            for_of.right.visit_with(self);
            for_of.body.visit_with(self);
            self.scope_stack.pop();
        }
    }

    fn visit_catch_clause(&mut self, catch: &CatchClause) {
        if let Some(&scope_id) = self.find_scope_at(self.start(catch.span)) {
            self.scope_stack.push(scope_id);
            if let Some(param) = &catch.param {
                self.visit_binding_pattern_references(param);
            }
            self.function_body_spans.insert(self.start(catch.body.span));
            catch.body.visit_with(self);
            self.scope_stack.pop();
        }
    }

    fn visit_switch_stmt(&mut self, switch: &SwitchStmt) {
        switch.discriminant.visit_with(self);

        if let Some(&scope_id) = self.find_scope_at(self.start(switch.span)) {
            self.scope_stack.push(scope_id);
            for case in &switch.cases {
                case.visit_with(self);
            }
            self.scope_stack.pop();
        }
    }

    fn visit_class_decl(&mut self, class_decl: &ClassDecl) {
        if let Some(&scope_id) = self.find_scope_at(self.start(class_decl.class.span)) {
            self.scope_stack.push(scope_id);
            class_decl.class.visit_children_with(self);
            self.scope_stack.pop();
        }
    }

    fn visit_class_expr(&mut self, class_expr: &ClassExpr) {
        if let Some(&scope_id) = self.find_scope_at(self.start(class_expr.class.span)) {
            self.scope_stack.push(scope_id);
            class_expr.class.visit_children_with(self);
            self.scope_stack.pop();
        }
    }

    fn visit_function(&mut self, f: &Function) {
        self.visit_function_inner(f);
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
                self.visit_ident(ident);
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
                if let Some(body) = &getter.body {
                    body.visit_with(self);
                }
            }
            Prop::Setter(setter) => {
                if let PropName::Computed(computed) = &setter.key {
                    computed.visit_with(self);
                }
                setter.param.visit_with(self);
                if let Some(body) = &setter.body {
                    body.visit_with(self);
                }
            }
            Prop::Method(method) => {
                if let PropName::Computed(computed) = &method.key {
                    computed.visit_with(self);
                }
                method.function.visit_with(self);
            }
        }
    }

    fn visit_labeled_stmt(&mut self, labeled: &LabeledStmt) {
        labeled.body.visit_with(self);
    }

    fn visit_break_stmt(&mut self, _break_stmt: &BreakStmt) {}

    fn visit_continue_stmt(&mut self, _continue_stmt: &ContinueStmt) {}
}
