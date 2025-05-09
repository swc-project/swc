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
///
/// The algorithm uses a fast, single-pass approach with efficient data
/// structures for maximum performance.
pub fn dce(unresolved_ctxt: SyntaxContext) -> impl Pass + VisitMut + Repeated {
    visit_mut_pass(DeadCodeEliminator {
        unresolved_ctxt,
        ..Default::default()
    })
}

/// Fast dead code eliminator that focuses on performance.
#[derive(Default)]
struct DeadCodeEliminator {
    unresolved_ctxt: SyntaxContext,

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

    /// Track import specifiers and their usage
    import_specifiers: FxHashMap<Id, bool>,
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
        if let Some(var) = self.vars.get_mut(id) {
            var.referenced = true;
            var.ref_count += 1;

            // Note: We don't set self.changed=true here since this is just
            // tracking variable usage and not an actual AST
            // transformation
        }
    }

    /// Register a variable mutation
    fn register_mutation(&mut self, id: &Id) {
        if let Some(var) = self.vars.get_mut(id) {
            var.mutated = true;

            // Note: We don't set self.changed=true here since this is just
            // tracking variable state and not an actual AST
            // transformation
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
        let prev_has_side_effects = var.has_side_effects;
        let prev_is_fn = var.is_fn;

        var.scope = scope;
        var.has_side_effects = has_side_effects;
        var.is_fn = is_fn;
    }

    /// Evaluate if expression is pure (no side effects)
    fn is_pure_expr(&self, expr: &Expr) -> bool {
        match expr {
            Expr::Lit(..) => true,
            Expr::This(..) => true,
            Expr::Ident(i) => i.ctxt == self.unresolved_ctxt,
            Expr::Bin(BinExpr { left, right, .. }) => {
                self.is_pure_expr(left) && self.is_pure_expr(right)
            }
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
                let original_len = stmts.len();
                stmts.drain(i..);
                // stmts 길이가 변경되었다면 changed 설정
                if stmts.len() != original_len {
                    self.changed = true;
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

    fn visit_mut_block_stmt(&mut self, block: &mut BlockStmt) {
        // Create a new scope for the block
        let old_scope = self.enter_scope(Some(self.current_scope));

        // Visit all statements in the block
        self.visit_mut_stmts(&mut block.stmts);

        // Exit block scope
        self.exit_scope(old_scope);
    }

    // Implementation for all the necessary visit_mut_* methods

    fn visit_mut_class(&mut self, class: &mut Class) {
        // 클래스 내부 요소 방문 전에 상태 저장
        let old_pure = self.in_pure_context;
        self.in_pure_context = false;

        // 상속(extends) 처리
        if let Some(parent) = &mut class.super_class {
            // 부모 클래스도 방문해서 참조 마킹
            if let Expr::Ident(ident) = &**parent {
                let id = (ident.sym.clone(), ident.ctxt);
                self.register_reference(&id);
            }
            parent.visit_mut_with(self);
        }

        // 클래스 내부 요소 처리
        for member in &mut class.body {
            match member {
                ClassMember::Constructor(constructor) => {
                    // 생성자 파라미터 처리 - params는 Option이 아닌 Vec 타입
                    for param in &constructor.params {
                        if let ParamOrTsParamProp::Param(param) = param {
                            let ids = find_pat_ids(&param.pat);
                            for id in ids {
                                self.register_declaration(id, false, false);
                            }
                        }
                    }

                    // 생성자 본문 방문
                    if let Some(body) = &mut constructor.body {
                        body.visit_mut_with(self);
                    }
                }
                ClassMember::Method(method) => {
                    // 메서드 방문 - function은 Option이 아닌 Box<Function> 타입
                    method.function.visit_mut_with(self);
                }
                ClassMember::PrivateMethod(priv_method) => {
                    // 프라이빗 메서드 방문 - function은 Option이 아닌 Box<Function> 타입
                    priv_method.function.visit_mut_with(self);
                }
                ClassMember::ClassProp(prop) => {
                    // 프로퍼티 초기화 값 방문
                    if let Some(value) = &mut prop.value {
                        value.visit_mut_with(self);
                    }
                }
                ClassMember::PrivateProp(priv_prop) => {
                    // 프라이빗 프로퍼티 초기화 값 방문
                    if let Some(value) = &mut priv_prop.value {
                        value.visit_mut_with(self);
                    }
                }
                _ => {
                    // Process other class members
                    member.visit_mut_children_with(self);
                }
            }
        }

        // Restore original state
        self.in_pure_context = old_pure;
    }

    fn visit_mut_class_decl(&mut self, class_decl: &mut ClassDecl) {
        // Process class name
        let id = (class_decl.ident.sym.clone(), class_decl.ident.ctxt);
        self.register_declaration(id, false, false);

        // Visit class contents
        class_decl.class.visit_mut_with(self);
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        match expr {
            Expr::Ident(ident) => {
                let id = (ident.sym.clone(), ident.ctxt);
                self.register_reference(&id);

                // Mark import specifier as used if this identifier is an import
                if let Some(used) = self.import_specifiers.get_mut(&id) {
                    *used = true;
                }
            }
            // Also handle member expressions to catch namespace imports usage
            Expr::Member(member) => {
                // If we're accessing a property of a namespace import, mark it as used
                if let Expr::Ident(obj) = &*member.obj {
                    let id = (obj.sym.clone(), obj.ctxt);
                    self.register_reference(&id);

                    // Mark namespace import as used
                    if let Some(used) = self.import_specifiers.get_mut(&id) {
                        *used = true;
                    }
                }

                // Continue normal visitation
                member.visit_mut_children_with(self);
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

    fn visit_mut_module(&mut self, module: &mut Module) {
        // Initialize the top-level module scope
        let old_scope = self.enter_scope(None);
        if let Some(scope) = self.scopes.last_mut() {
            scope.is_module_scope = true;
        }

        // First pass: collect all declarations and import specifiers
        for item in &module.body {
            match item {
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
                ModuleItem::Stmt(Stmt::Decl(Decl::Fn(fn_decl))) => {
                    let id = (fn_decl.ident.sym.clone(), fn_decl.ident.ctxt);
                    self.register_declaration(id, false, true);
                }
                ModuleItem::Stmt(Stmt::Decl(Decl::Class(class_decl))) => {
                    let id = (class_decl.ident.sym.clone(), class_decl.ident.ctxt);
                    self.register_declaration(id, false, false);
                }
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
                ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) => {
                    // Track all imported specifiers
                    for specifier in &import_decl.specifiers {
                        match specifier {
                            ImportSpecifier::Named(named) => {
                                let local = &named.local;
                                let id = (local.sym.clone(), local.ctxt);
                                self.import_specifiers.insert(id.clone(), false);
                                self.register_declaration(id, false, false);
                            }
                            ImportSpecifier::Default(default) => {
                                let local = &default.local;
                                let id = (local.sym.clone(), local.ctxt);
                                self.import_specifiers.insert(id.clone(), false);
                                self.register_declaration(id, false, false);
                            }
                            ImportSpecifier::Namespace(namespace) => {
                                let local = &namespace.local;
                                let id = (local.sym.clone(), local.ctxt);
                                self.import_specifiers.insert(id.clone(), false);
                                self.register_declaration(id, false, false);
                            }
                        }
                    }
                }
                _ => {}
            }
        }

        // Process module items
        module.body.visit_mut_with(self);

        // Clean up unreferenced import specifiers
        for i in 0..module.body.len() {
            if let ModuleItem::ModuleDecl(ModuleDecl::Import(import)) = &mut module.body[i] {
                import.specifiers.retain(|s| match s {
                    ImportSpecifier::Named(named) => {
                        let imported = match &named.imported {
                            Some(imported) => match imported {
                                ModuleExportName::Ident(i) => i.sym.clone(),
                                ModuleExportName::Str(s) => s.value.clone(),
                            },
                            None => named.local.sym.clone(),
                        };
                        let id = (imported, named.local.ctxt);
                        self.import_specifiers.get(&id).copied().unwrap_or(true)
                    }
                    ImportSpecifier::Default(default) => {
                        let id = (Atom::from("default"), default.local.ctxt);
                        self.import_specifiers.get(&id).copied().unwrap_or(true)
                    }
                    ImportSpecifier::Namespace(_) => true, // Always keep namespace imports
                });
            }
        }

        // Remove unreachable statements in the module
        for i in 0..module.body.len() {
            if let ModuleItem::Stmt(stmt) = &mut module.body[i] {
                // Try to remove pure statements that have no side effects
                if self.try_remove_pure_stmt(stmt) {
                    self.changed = true;
                    module.body[i] = ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }));
                }
            }
        }

        // Exit module scope
        self.exit_scope(old_scope);
    }

    fn visit_mut_script(&mut self, script: &mut Script) {
        // Initialize the top-level script scope
        let old_scope = self.enter_scope(None);
        if let Some(scope) = self.scopes.last_mut() {
            scope.is_module_scope = true;
        }

        // First pass: collect all declarations
        for stmt in &script.body {
            match stmt {
                Stmt::Decl(Decl::Var(var)) => {
                    for decl in &var.decls {
                        let ids = find_pat_ids(&decl.name);
                        let has_effects = decl
                            .init
                            .as_ref()
                            .map_or(false, |init| !self.is_pure_expr(init));
                        for id in ids {
                            // Mark all top-level declarations in scripts as referenced
                            self.register_reference(&id);
                            self.register_declaration(id, has_effects, false);
                        }
                    }
                }
                Stmt::Decl(Decl::Fn(fn_decl)) => {
                    let id = (fn_decl.ident.sym.clone(), fn_decl.ident.ctxt);
                    // Mark all top-level declarations in scripts as referenced
                    self.register_reference(&id);
                    self.register_declaration(id, false, true);
                }
                Stmt::Decl(Decl::Class(class_decl)) => {
                    let id = (class_decl.ident.sym.clone(), class_decl.ident.ctxt);
                    // Mark all top-level declarations in scripts as referenced
                    self.register_reference(&id);
                    self.register_declaration(id, false, false);
                }
                _ => {}
            }
        }

        // Visit the script to process nested statements and expressions
        script.visit_mut_children_with(self);

        // Remove unreachable statements in the script
        self.remove_unreachable_stmts(&mut script.body);

        // Exit script scope
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
        let original_len = stmts.len();
        stmts.retain(|stmt| self.should_preserve_stmt(stmt));
        // 길이가 변경되었다면 changed 설정
        if stmts.len() != original_len {
            self.changed = true;
        }
    }

    fn visit_mut_var_declarator(&mut self, decl: &mut VarDeclarator) {
        // Process variable name (destructuring pattern)
        let ids: Vec<Id> = find_pat_ids(&decl.name);
        for id in ids {
            self.register_declaration(id, false, false);
        }

        // Visit the initializer if exists
        if let Some(init) = &mut decl.init {
            self.visit_mut_expr(init);
        }
    }
}

impl Repeated for DeadCodeEliminator {
    fn changed(&self) -> bool {
        self.changed
    }

    fn reset(&mut self) {
        *self = Default::default();
    }
}
