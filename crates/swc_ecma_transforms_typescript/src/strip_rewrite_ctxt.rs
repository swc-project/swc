use rustc_hash::FxHashSet;
use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_pat_ids, stack_size::maybe_grow_default};
use swc_ecma_visit::{noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith};

/// Collects identifiers from `declare` statements that will be stripped.
pub(crate) struct DeclareIdCollector {
    pub ids: FxHashSet<Id>,
}

impl DeclareIdCollector {
    pub fn new() -> Self {
        Self {
            ids: Default::default(),
        }
    }
}

impl Visit for DeclareIdCollector {
    noop_visit_type!();

    fn visit_module_item(&mut self, n: &ModuleItem) {
        match n {
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl)) => {
                self.visit_decl(&export_decl.decl);
            }
            ModuleItem::Stmt(Stmt::Decl(decl)) => {
                self.visit_decl(decl);
            }
            _ => {}
        }
    }

    fn visit_decl(&mut self, n: &Decl) {
        match n {
            Decl::Var(var_decl) if var_decl.declare => {
                let ids: Vec<Id> = find_pat_ids(&var_decl.decls);
                self.ids.extend(ids);
            }
            Decl::Fn(fn_decl) if fn_decl.declare => {
                self.ids.insert(fn_decl.ident.to_id());
            }
            Decl::Class(class_decl) if class_decl.declare => {
                self.ids.insert(class_decl.ident.to_id());
            }
            Decl::TsEnum(ts_enum) if ts_enum.declare => {
                self.ids.insert(ts_enum.id.to_id());
            }
            Decl::TsModule(ts_module) if ts_module.declare || ts_module.global => {
                // For `declare global {}`, the `global` identifier should be marked
                if let TsModuleName::Ident(ident) = &ts_module.id {
                    self.ids.insert(ident.to_id());
                }
            }
            Decl::TsInterface(ts_interface) => {
                self.ids.insert(ts_interface.id.to_id());
            }
            Decl::TsTypeAlias(ts_type_alias) => {
                self.ids.insert(ts_type_alias.id.to_id());
            }
            _ => {}
        }
    }
}

/// Rewrites the syntax context of identifiers that were declared in stripped
/// `declare` statements from `top_level_mark` to `unresolved_mark`.
///
/// This pass only rewrites identifiers in reference positions, not in binding
/// positions. This ensures that new declarations (like `import foo = ...`)
/// are not incorrectly rewritten.
pub(crate) struct CtxtRewriter {
    /// Identifiers that were declared in stripped `declare` statements
    pub stripped_ids: FxHashSet<Id>,
    pub top_level_ctxt: SyntaxContext,
    pub unresolved_ctxt: SyntaxContext,
    /// Set of identifiers that are still bound by remaining declarations
    pub remaining_bindings: FxHashSet<Id>,
}

impl CtxtRewriter {
    pub fn new(stripped_ids: FxHashSet<Id>, unresolved_mark: Mark, top_level_mark: Mark) -> Self {
        Self {
            stripped_ids,
            top_level_ctxt: SyntaxContext::empty().apply_mark(top_level_mark),
            unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
            remaining_bindings: Default::default(),
        }
    }

    fn should_rewrite(&self, n: &Ident) -> bool {
        if n.ctxt != self.top_level_ctxt {
            return false;
        }

        let id = (n.sym.clone(), self.top_level_ctxt);

        // Only rewrite if:
        // 1. The identifier was from a stripped declare statement
        // 2. There's no remaining binding for this identifier
        self.stripped_ids.contains(&id) && !self.remaining_bindings.contains(&id)
    }
}

impl VisitMut for CtxtRewriter {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, n: &mut Module) {
        // First pass: collect remaining bindings after stripping
        for item in &n.body {
            self.collect_bindings_from_module_item(item);
        }

        // Second pass: rewrite identifiers
        n.visit_mut_children_with(self);
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        // First pass: collect remaining bindings after stripping
        for stmt in &n.body {
            self.collect_bindings_from_stmt(stmt);
        }

        // Second pass: rewrite identifiers
        n.visit_mut_children_with(self);
    }

    fn visit_mut_ident(&mut self, n: &mut Ident) {
        if self.should_rewrite(n) {
            n.ctxt = self.unresolved_ctxt;
        }
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        maybe_grow_default(|| n.visit_mut_children_with(self));
    }
}

impl CtxtRewriter {
    fn collect_bindings_from_module_item(&mut self, item: &ModuleItem) {
        match item {
            ModuleItem::ModuleDecl(decl) => self.collect_bindings_from_module_decl(decl),
            ModuleItem::Stmt(stmt) => self.collect_bindings_from_stmt(stmt),
        }
    }

    fn collect_bindings_from_module_decl(&mut self, decl: &ModuleDecl) {
        match decl {
            ModuleDecl::Import(import) => {
                for spec in &import.specifiers {
                    match spec {
                        ImportSpecifier::Named(named) => {
                            self.remaining_bindings.insert(named.local.to_id());
                        }
                        ImportSpecifier::Default(default) => {
                            self.remaining_bindings.insert(default.local.to_id());
                        }
                        ImportSpecifier::Namespace(ns) => {
                            self.remaining_bindings.insert(ns.local.to_id());
                        }
                    }
                }
            }
            ModuleDecl::ExportDecl(export) => {
                self.collect_bindings_from_decl(&export.decl);
            }
            ModuleDecl::ExportDefaultDecl(export) => match &export.decl {
                DefaultDecl::Class(class) => {
                    if let Some(ident) = &class.ident {
                        self.remaining_bindings.insert(ident.to_id());
                    }
                }
                DefaultDecl::Fn(func) => {
                    if let Some(ident) = &func.ident {
                        self.remaining_bindings.insert(ident.to_id());
                    }
                }
                _ => {}
            },
            ModuleDecl::TsImportEquals(import_eq) => {
                self.remaining_bindings.insert(import_eq.id.to_id());
            }
            _ => {}
        }
    }

    fn collect_bindings_from_stmt(&mut self, stmt: &Stmt) {
        if let Stmt::Decl(decl) = stmt {
            self.collect_bindings_from_decl(decl);
        }
    }

    fn collect_bindings_from_decl(&mut self, decl: &Decl) {
        match decl {
            Decl::Class(class) => {
                self.remaining_bindings.insert(class.ident.to_id());
            }
            Decl::Fn(func) => {
                self.remaining_bindings.insert(func.ident.to_id());
            }
            Decl::Var(var) => {
                let ids: Vec<Id> = find_pat_ids(&var.decls);
                self.remaining_bindings.extend(ids);
            }
            Decl::TsEnum(ts_enum) => {
                self.remaining_bindings.insert(ts_enum.id.to_id());
            }
            Decl::TsModule(ts_module) => {
                if let TsModuleName::Ident(ident) = &ts_module.id {
                    self.remaining_bindings.insert(ident.to_id());
                }
            }
            _ => {}
        }
    }
}
