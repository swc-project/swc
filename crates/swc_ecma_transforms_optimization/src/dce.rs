#![allow(clippy::all)]
#![allow(dead_code)]

use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::Atom;
use swc_common::{pass::Repeated, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_pat_ids, IsDirective};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

// Define Id type for our usage
type Id = (Atom, SyntaxContext);

/// Fast DCE (Dead Code Elimination) for JavaScript.
///
/// This pass aggressively removes dead code from JavaScript modules.
/// It focuses on three main forms of dead code:
/// 1. Unused variables and functions
/// 2. Unreachable code (after return, throw, etc.)
/// 3. Pure code with no side effects (like pure function calls not used
///    anywhere)
/// 4. Unused import specifiers and imports
///
/// The algorithm uses a fast, single-pass approach with efficient data
/// structures for maximum performance.
pub fn dce() -> impl Pass + VisitMut + Repeated {
    visit_mut_pass(DeadCodeEliminator::default())
}

/// Fast dead code eliminator that focuses on performance.
#[derive(Default)]
struct DeadCodeEliminator {
    /// Tracks variable usage information
    vars: FxHashMap<Id, VarInfo>,

    /// Tracks function scope information
    scopes: Vec<ScopeInfo>,

    /// Current scope ID
    current_scope: usize,

    /// Global context for fast operations
    ctx: SyntaxContext,

    /// Tracks if we're processing pure expressions
    in_pure_context: bool,

    /// Flag to determine if code was changed
    changed: bool,

    /// Tracks imported specifiers
    imported_specifiers: FxHashMap<Id, ImportSpecifierInfo>,
}

/// Information about an import specifier
#[derive(Debug, Default, Clone)]
struct ImportSpecifierInfo {
    /// Whether the specifier is used anywhere
    used: bool,

    /// Source module of the import
    source: String,

    /// Local name (rename) if any
    local: Option<Atom>,

    /// Import specifier kind (named, default, namespace)
    kind: ImportSpecifierKind,
}

/// Kind of import specifier
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum ImportSpecifierKind {
    /// import { name } from 'module'
    Named,

    /// import defaultExport from 'module'
    Default,

    /// import * as name from 'module'
    Namespace,
}

impl Default for ImportSpecifierKind {
    fn default() -> Self {
        ImportSpecifierKind::Named
    }
}

/// Information about a variable
#[derive(Debug, Default, Clone)]
struct VarInfo {
    /// Whether the variable is referenced anywhere
    referenced: bool,

    /// Whether the variable is mutated
    mutated: bool,

    /// Whether the variable is exported (cannot be eliminated)
    exported: bool,

    /// The scope in which the variable is declared
    scope: usize,

    /// Number of references to this variable
    ref_count: u32,

    /// Whether the variable has potential side effects in its declaration
    has_side_effects: bool,

    /// Track if the variable is a function
    is_fn: bool,
}

/// Information about a scope
#[derive(Debug, Default)]
struct ScopeInfo {
    /// Variables declared in this scope
    declared_vars: FxHashSet<Id>,

    /// Track if scope has eval() call which makes static analysis difficult
    has_eval: bool,

    /// Track if this is a module scope (top level)
    is_module_scope: bool,

    /// Track if the scope contains a with statement
    has_with: bool,

    /// Parent scope ID
    parent: Option<usize>,
}

impl DeadCodeEliminator {
    /// Enter a new scope - creates and pushes a new scope onto the stack
    fn enter_scope(&mut self, parent: Option<usize>) -> usize {
        let scope_id = self.scopes.len();
        let mut scope = ScopeInfo::default();
        scope.parent = parent;
        self.scopes.push(scope);
        let old_scope = self.current_scope;
        self.current_scope = scope_id;
        old_scope
    }

    /// Exit current scope - restores the previous scope context
    fn exit_scope(&mut self, old_scope: usize) {
        self.current_scope = old_scope;
    }

    /// Fast check if a variable is used in any scope
    fn is_var_used(&self, id: &Id) -> bool {
        self.vars.get(id).map_or(true, |v| v.referenced)
    }

    /// Register a variable usage/reference
    fn register_reference(&mut self, id: &Id) {
        // Register for regular variables
        if let Some(var) = self.vars.get_mut(id) {
            var.referenced = true;
            var.ref_count += 1;
        }

        // Register for imported specifiers
        if let Some(import_info) = self.imported_specifiers.get_mut(id) {
            import_info.used = true;
        }
    }

    /// Register a variable mutation
    fn register_mutation(&mut self, id: &Id) {
        if let Some(var) = self.vars.get_mut(id) {
            var.mutated = true;
        }
    }

    /// Register a variable declaration
    fn register_declaration(&mut self, id: Id, has_side_effects: bool, is_fn: bool) {
        let scope = self.current_scope;

        // Add to current scope's declarations
        if let Some(scope_info) = self.scopes.get_mut(scope) {
            scope_info.declared_vars.insert(id.clone());
        }

        // Update variable info
        let var = self.vars.entry(id).or_default();
        var.scope = scope;
        var.has_side_effects = has_side_effects;
        var.is_fn = is_fn;
    }

    /// Register an import specifier
    fn register_import_specifier(
        &mut self,
        id: Id,
        source: String,
        local: Option<Atom>,
        kind: ImportSpecifierKind,
    ) {
        let info = ImportSpecifierInfo {
            used: false,
            source,
            local,
            kind,
        };
        self.imported_specifiers.insert(id, info);
    }

    /// Evaluate if expression is pure (no side effects)
    fn is_pure_expr(&self, expr: &Expr) -> bool {
        match expr {
            Expr::Lit(..) => true,
            Expr::This(..) => true,
            Expr::Ident(..) => true,
            Expr::Bin(BinExpr {
                op: _, left, right, ..
            }) => self.is_pure_expr(left) && self.is_pure_expr(right),
            Expr::Paren(ParenExpr { expr, .. }) => self.is_pure_expr(expr),
            Expr::Cond(CondExpr {
                test, cons, alt, ..
            }) => self.is_pure_expr(test) && self.is_pure_expr(cons) && self.is_pure_expr(alt),
            Expr::Array(ArrayLit { elems, .. }) => elems.iter().all(|e| match e {
                Some(e) => self.is_pure_expr(&e.expr),
                None => true,
            }),
            Expr::Object(ObjectLit { props, .. }) => props.iter().all(|p| match p {
                PropOrSpread::Prop(p) => match &**p {
                    Prop::KeyValue(KeyValueProp { value, .. }) => self.is_pure_expr(value),
                    Prop::Shorthand(..) => true,
                    _ => false,
                },
                _ => false,
            }),
            Expr::Tpl(Tpl { exprs, .. }) => exprs.iter().all(|e| self.is_pure_expr(e)),
            // Conservatively consider other expressions to have side effects
            _ => false,
        }
    }

    /// Should we keep this statement even if it's not used
    fn should_preserve_stmt(&self, stmt: &Stmt) -> bool {
        stmt.can_precede_directive()
            || match stmt {
                Stmt::Expr(ExprStmt { expr, .. }) => !self.is_pure_expr(expr),
                // Preserve declarations by default
                Stmt::Decl(..) => true,
                // Preserve most statements by default unless we know they're unused
                _ => true,
            }
    }

    /// Process a pattern (destructuring assignment) to find and register
    /// variables
    fn process_pat(&mut self, pat: &Pat, is_mut: bool) {
        match pat {
            Pat::Ident(id) => {
                let var_id = (id.sym.clone(), id.ctxt);
                if is_mut {
                    self.register_mutation(&var_id);
                } else {
                    self.register_reference(&var_id);
                }
            }
            Pat::Array(arr) => {
                for elem in arr.elems.iter().flatten() {
                    self.process_pat(elem, is_mut);
                }
            }
            Pat::Object(obj) => {
                for prop in &obj.props {
                    match prop {
                        ObjectPatProp::KeyValue(kv) => {
                            self.process_pat(&kv.value, is_mut);
                        }
                        ObjectPatProp::Assign(assign) => {
                            let var_id = (assign.key.sym.clone(), assign.key.ctxt);
                            if is_mut {
                                self.register_mutation(&var_id);
                            } else {
                                self.register_reference(&var_id);
                            }
                            if let Some(value) = &assign.value {
                                if let Expr::Ident(ident) = &**value {
                                    let id = (ident.sym.clone(), ident.ctxt);
                                    self.register_reference(&id);
                                }
                            }
                        }
                        ObjectPatProp::Rest(rest) => {
                            self.process_pat(&rest.arg, is_mut);
                        }
                    }
                }
            }
            Pat::Rest(rest) => {
                self.process_pat(&rest.arg, is_mut);
            }
            Pat::Assign(assign) => {
                self.process_pat(&assign.left, is_mut);
                if let Expr::Ident(ident) = &*assign.right {
                    let id = (ident.sym.clone(), ident.ctxt);
                    self.register_reference(&id);
                }
            }
            // Other patterns are not handled (invalid, expr)
            _ => {}
        }
    }

    /// Remove a statement if it has no side effects
    fn try_remove_pure_stmt(&mut self, stmt: &mut Stmt) -> bool {
        if stmt.can_precede_directive() {
            return false;
        }

        match stmt {
            Stmt::Expr(ExprStmt { expr, .. }) if self.is_pure_expr(expr) => {
                *stmt = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                self.changed = true;
                true
            }
            _ => false,
        }
    }

    /// Remove unreachable code after terminal statements
    fn remove_unreachable_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        let mut i = 0;
        let mut found_terminal = false;

        // Fast path: first find if there is any terminal statement
        while i < stmts.len() {
            if is_terminal_stmt(&stmts[i]) {
                found_terminal = true;
                break;
            }
            i += 1;
        }

        // If we found a terminal statement, remove everything after it
        if found_terminal {
            i += 1; // Skip the terminal statement itself
            if i < stmts.len() {
                stmts.drain(i..);
                self.changed = true;
            }
        }
    }

    /// Process an import declaration to track specifiers
    fn process_import_decl(&mut self, import: &ImportDecl) {
        let source = import.src.value.to_string();

        // Process all import specifiers
        for specifier in &import.specifiers {
            match specifier {
                // Named imports: import { name, other as alias } from 'module'
                ImportSpecifier::Named(named) => {
                    let local_id = (named.local.sym.clone(), named.local.ctxt);
                    let imported = named.imported.as_ref().map(|imp| match imp {
                        ModuleExportName::Ident(ident) => ident.sym.clone(),
                        ModuleExportName::Str(s) => Atom::from(&*s.value),
                    });
                    self.register_import_specifier(
                        local_id,
                        source.clone(),
                        imported,
                        ImportSpecifierKind::Named,
                    );
                }
                // Default import: import Name from 'module'
                ImportSpecifier::Default(default_spec) => {
                    let id = (default_spec.local.sym.clone(), default_spec.local.ctxt);
                    self.register_import_specifier(
                        id,
                        source.clone(),
                        None,
                        ImportSpecifierKind::Default,
                    );
                }
                // Namespace import: import * as name from 'module'
                ImportSpecifier::Namespace(ns_spec) => {
                    let id = (ns_spec.local.sym.clone(), ns_spec.local.ctxt);
                    self.register_import_specifier(
                        id,
                        source.clone(),
                        None,
                        ImportSpecifierKind::Namespace,
                    );
                }
            }
        }
    }

    /// Remove unused import specifiers but keep the import declaration
    fn remove_unused_imports(&mut self, module: &mut Module) {
        for item in &mut module.body {
            if let ModuleItem::ModuleDecl(ModuleDecl::Import(import)) = item {
                let mut j = 0;
                let mut modified = false;

                // Filter out unused named import specifiers
                while j < import.specifiers.len() {
                    let should_keep = match &import.specifiers[j] {
                        ImportSpecifier::Named(named) => {
                            let id = (named.local.sym.clone(), named.local.ctxt);
                            // Keep if used or no info available
                            self.imported_specifiers
                                .get(&id)
                                .map_or(true, |info| info.used)
                        }
                        ImportSpecifier::Default(default_spec) => {
                            let id = (default_spec.local.sym.clone(), default_spec.local.ctxt);
                            // Keep if used or no info available
                            self.imported_specifiers
                                .get(&id)
                                .map_or(true, |info| info.used)
                        }
                        ImportSpecifier::Namespace(ns_spec) => {
                            let id = (ns_spec.local.sym.clone(), ns_spec.local.ctxt);
                            // Keep if used or no info available
                            self.imported_specifiers
                                .get(&id)
                                .map_or(true, |info| info.used)
                        }
                    };

                    if should_keep {
                        j += 1;
                    } else {
                        import.specifiers.remove(j);
                        modified = true;
                    }
                }

                if modified {
                    self.changed = true;
                }

                // Important: We NEVER remove the entire import statement,
                // even if all specifiers are unused, as per requirements
                // If all specifiers were removed, add a dummy import comment
                if import.specifiers.is_empty() {
                    // Use a side-effect import (which keeps the import
                    // statement) This is equivalent to:
                    // import 'module'; We won't actually
                    // add a comment here, just keep the empty import
                }
            }
        }
    }
}

/// Check if a statement is terminal (return, throw, etc.)
fn is_terminal_stmt(stmt: &Stmt) -> bool {
    match stmt {
        Stmt::Return(..) | Stmt::Throw(..) => true,
        Stmt::Block(BlockStmt { stmts, .. }) if !stmts.is_empty() => {
            is_terminal_stmt(&stmts[stmts.len() - 1])
        }
        Stmt::If(IfStmt { cons, alt, .. }) => {
            is_terminal_stmt(cons) && alt.as_ref().map_or(false, |alt| is_terminal_stmt(alt))
        }
        _ => false,
    }
}

impl VisitMut for DeadCodeEliminator {
    noop_visit_mut_type!();

    // Implementation for all the necessary visit_mut_* methods

    fn visit_mut_module(&mut self, module: &mut Module) {
        // Initialize the top-level module scope
        let old_scope = self.enter_scope(None);
        if let Some(scope) = self.scopes.last_mut() {
            scope.is_module_scope = true;
        }

        // First pass: collect all declarations and import specifiers
        for item in &module.body {
            match item {
                // Track variable declarations
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) => {
                    for decl in &var.decls {
                        let ids = find_pat_ids(&decl.name);
                        let has_effects = decl
                            .init
                            .as_ref()
                            .map_or(false, |init| !self.is_pure_expr(init));
                        for id in ids {
                            self.register_declaration(id, has_effects, false);
                        }
                    }
                }
                // Track function declarations
                ModuleItem::Stmt(Stmt::Decl(Decl::Fn(fn_decl))) => {
                    let id = (fn_decl.ident.sym.clone(), fn_decl.ident.ctxt);
                    self.register_declaration(id, false, true);
                }
                // Track exported declarations
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl { decl, .. })) => {
                    match decl {
                        Decl::Var(var) => {
                            for decl in &var.decls {
                                let ids = find_pat_ids(&decl.name);
                                for id in ids {
                                    let var = self.vars.entry(id).or_default();
                                    var.exported = true;
                                }
                            }
                        }
                        Decl::Fn(fn_decl) => {
                            let id = (fn_decl.ident.sym.clone(), fn_decl.ident.ctxt);
                            let var = self.vars.entry(id).or_default();
                            var.exported = true;
                        }
                        Decl::Class(class_decl) => {
                            let id = (class_decl.ident.sym.clone(), class_decl.ident.ctxt);
                            let var = self.vars.entry(id).or_default();
                            var.exported = true;
                        }
                        _ => {}
                    }
                }
                // Track import declarations
                ModuleItem::ModuleDecl(ModuleDecl::Import(import)) => {
                    self.process_import_decl(import);
                }
                _ => {}
            }
        }

        // Visit the module to collect references
        module.visit_mut_children_with(self);

        // Second pass: remove unused declarations
        let mut i = 0;
        while i < module.body.len() {
            let mut removed = false;

            match &mut module.body[i] {
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) => {
                    let mut j = 0;
                    while j < var.decls.len() {
                        let decl = &var.decls[j];
                        let ids = find_pat_ids(&decl.name);

                        // If all identifiers in this declaration are unused and have no side
                        // effects, we can remove it
                        let all_unused = ids.iter().all(|id| {
                            if let Some(var_info) = self.vars.get(id) {
                                !var_info.referenced
                                    && !var_info.has_side_effects
                                    && !var_info.exported
                            } else {
                                false
                            }
                        });

                        let no_side_effects = decl
                            .init
                            .as_ref()
                            .map_or(true, |init| self.is_pure_expr(init));

                        if all_unused && no_side_effects {
                            var.decls.remove(j);
                            self.changed = true;
                            removed = var.decls.is_empty();
                        } else {
                            j += 1;
                        }
                    }
                }
                ModuleItem::Stmt(Stmt::Decl(Decl::Fn(fn_decl))) => {
                    let id = (fn_decl.ident.sym.clone(), fn_decl.ident.ctxt);
                    if let Some(var_info) = self.vars.get(&id) {
                        if !var_info.referenced && !var_info.exported {
                            module.body.remove(i);
                            self.changed = true;
                            removed = true;
                        }
                    }
                }
                ModuleItem::Stmt(stmt) => {
                    self.try_remove_pure_stmt(stmt);
                }
                _ => {}
            }

            if !removed {
                i += 1;
            }
        }

        // Third pass: remove unused import specifiers
        self.remove_unused_imports(module);

        // Exit module scope
        self.exit_scope(old_scope);
    }

    fn visit_mut_function(&mut self, f: &mut Function) {
        // Create a new scope for the function
        let old_scope = self.enter_scope(Some(self.current_scope));

        // Process parameters
        for param in &f.params {
            let ids = find_pat_ids(&param.pat);
            for id in ids {
                self.register_declaration(id, false, false);
            }
        }

        // Visit function body
        f.body.visit_mut_with(self);

        // Remove unreachable code in function body
        if let Some(body) = &mut f.body {
            self.remove_unreachable_stmts(&mut body.stmts);
        }

        // Exit function scope
        self.exit_scope(old_scope);
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        // First pass: visit all statements to collect references
        for stmt in stmts.iter_mut() {
            stmt.visit_mut_with(self);
        }

        // Second pass: remove unreachable statements and pure expressions
        self.remove_unreachable_stmts(stmts);

        // Remove empty statements and pure expressions with no side effects
        stmts.retain(|stmt| self.should_preserve_stmt(stmt));
    }

    fn visit_mut_block_stmt(&mut self, block: &mut BlockStmt) {
        // Create a new scope for the block
        let old_scope = self.enter_scope(Some(self.current_scope));

        // Visit all statements in the block
        self.visit_mut_stmts(&mut block.stmts);

        // Exit block scope
        self.exit_scope(old_scope);
    }

    fn visit_mut_var_declarator(&mut self, decl: &mut VarDeclarator) {
        // Process variable name (destructuring pattern)
        let ids: Vec<Id> = find_pat_ids(&decl.name);
        for id in ids {
            self.register_declaration(id.clone(), false, false);
        }

        // Visit the initializer if exists
        if let Some(init) = &mut decl.init {
            self.visit_mut_expr(init);
        }
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        match expr {
            Expr::Ident(ident) => {
                let id = (ident.sym.clone(), ident.ctxt);
                self.register_reference(&id);
            }
            Expr::Assign(assign) => {
                // Visit right side first
                self.visit_mut_expr(&mut assign.right);

                // 왼쪽 변이를 직접 처리하는 것은 복잡하므로 이 구현에서는 이 부분을
                // 단순화합니다. 대신 right의 참조를 처리한 다음, 방문 시스템이
                // 나머지를 처리하게 합니다.

                // 자식 노드 방문
                assign.visit_mut_children_with(self);
            }
            Expr::Update(update) => {
                if let Expr::Ident(ident) = &*update.arg {
                    let id = (ident.sym.clone(), ident.ctxt);
                    self.register_mutation(&id);
                } else {
                    update.arg.visit_mut_with(self);
                }
            }
            // Save and restore pure context state
            Expr::Arrow(arrow) => {
                let old_pure = self.in_pure_context;
                self.in_pure_context = false;

                let old_scope = self.enter_scope(Some(self.current_scope));

                // Process parameters
                for pat in &arrow.params {
                    self.process_pat(pat, false);
                }

                arrow.body.visit_mut_with(self);

                self.exit_scope(old_scope);
                self.in_pure_context = old_pure;
            }
            // For all other expressions, just visit children normally
            _ => {
                expr.visit_mut_children_with(self);
            }
        }
    }
}

impl Repeated for DeadCodeEliminator {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        *self = Self::default();
    }
}
