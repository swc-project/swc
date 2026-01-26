use std::collections::hash_map::Entry;

use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::{atom, Atom};
use swc_common::{errors::HANDLER, Span, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::for_each_binding_ident;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::rule::Rule;

// Helper macro for checking duplicate arguments
macro_rules! check_dupe_args {
    ($node:expr) => {{
        // This vector allocates only if there are duplicate parameters.
        // This is used to handle the case where the same parameter is used 3 or more
        // times.
        let mut done = Vec::new();

        let mut hash_mode = false;

        let mut i1 = 0;
        for_each_binding_ident($node, |id1| {
            i1 += 1;

            if !hash_mode {
                let mut i2 = 0;
                for_each_binding_ident($node, |id2| {
                    i2 += 1;

                    if hash_mode {
                        return;
                    } else if i2 >= 100 {
                        // While iterating for the first `id1`, we detect that there are more than
                        // 100 identifiers. We switch to hash mode.
                        hash_mode = true;
                    }

                    if i1 >= i2 || done.contains(&i1) {
                        return;
                    }

                    if id1.ctxt == id2.ctxt && id1.sym == id2.sym {
                        done.push(i1);

                        emit_dupe_args_error(id1, id2);
                    }
                });
            }
        });

        if hash_mode {
            let mut map = FxHashMap::default();

            for_each_binding_ident($node, |id| {
                //
                match map.entry((id.sym.clone(), id.ctxt)) {
                    Entry::Occupied(v) => {
                        emit_dupe_args_error(v.get(), id);
                    }

                    Entry::Vacant(v) => {
                        v.insert(id.clone());
                    }
                }
            });
        }
    }};
}

pub fn critical_rules() -> Box<dyn Rule> {
    Box::new(CriticalRules::default())
}

#[derive(Debug, Default)]
struct CriticalRules {
    // For const_assign
    const_vars: FxHashMap<Id, Span>,
    import_binding: FxHashMap<Id, Span>,

    // For duplicate_bindings
    bindings: FxHashMap<Id, BindingInfo>,
    type_bindings: FxHashSet<Id>,

    // For duplicate_exports
    exports: FxHashMap<Atom, Span>,
    export_assign: Option<Span>,

    // Shared state
    var_decl_kind: Option<VarDeclKind>,
    is_pat_decl: bool,
    lexical_function: bool,
}

#[derive(Debug, Default, Clone, Copy)]
struct BindingInfo {
    span: Span,
    ctxt: SyntaxContext,
    unique: bool,
    is_function: bool,
}

impl Rule for CriticalRules {
    fn lint_module(&mut self, program: &Module) {
        // First pass: collect type bindings and const variables
        program.visit_with(&mut TypeCollector {
            type_bindings: &mut self.type_bindings,
        });

        let mut const_collector = ConstCollector {
            const_vars: &mut self.const_vars,
            import_binding: &mut self.import_binding,
            var_decl_kind: None,
        };
        program.visit_children_with(&mut const_collector);

        // Reset state and do main visit
        self.lexical_function = true;
        self.visit_module(program);
    }

    fn lint_script(&mut self, program: &Script) {
        // First pass: collect type bindings and const variables
        program.visit_with(&mut TypeCollector {
            type_bindings: &mut self.type_bindings,
        });

        let mut const_collector = ConstCollector {
            const_vars: &mut self.const_vars,
            import_binding: &mut self.import_binding,
            var_decl_kind: None,
        };
        program.visit_children_with(&mut const_collector);

        // Reset state and do main visit
        self.visit_script(program);
    }
}

impl CriticalRules {
    // Helper methods from duplicate_bindings
    fn add_binding(&mut self, id: Atom, info: BindingInfo) {
        match self.bindings.entry((id.clone(), info.ctxt)) {
            Entry::Occupied(mut prev) => {
                if !(info.is_function && prev.get().is_function)
                    && (info.unique || prev.get().unique)
                {
                    emit_duplicate_binding_error(&id, info.span, prev.get().span);
                }

                if info.unique || !prev.get().unique {
                    *prev.get_mut() = info
                }
            }
            Entry::Vacant(e) => {
                e.insert(info);
            }
        }
    }

    fn is_unique_var_kind(&self) -> bool {
        matches!(
            self.var_decl_kind,
            Some(VarDeclKind::Const) | Some(VarDeclKind::Let)
        )
    }

    fn visit_with_kind<V: VisitWith<Self>>(&mut self, e: &V, kind: Option<VarDeclKind>) {
        let old_var_decl_kind = self.var_decl_kind.take();
        let old_is_pat_decl = self.is_pat_decl;

        self.var_decl_kind = kind;
        self.is_pat_decl = true;

        e.visit_children_with(self);

        self.is_pat_decl = old_is_pat_decl;
        self.var_decl_kind = old_var_decl_kind;
    }

    fn visit_with_stmt_like<T: VisitWith<Self>, F: Fn(&T) -> Option<Ident>>(
        &mut self,
        s: &[T],
        get_fn_ident: F,
    ) {
        let mut fn_name = FxHashMap::default();
        for s in s {
            if let Some(ident) = get_fn_ident(s) {
                if let Some(prev) = fn_name.get(&ident.sym) {
                    emit_duplicate_binding_error(&ident.sym, ident.span, *prev)
                } else {
                    fn_name.insert(ident.sym.clone(), ident.span);
                }
            }

            s.visit_with(self);
        }
    }

    fn visit_with_stmts(&mut self, s: &[Stmt], lexical_function: bool) {
        let old = self.lexical_function;
        self.lexical_function = lexical_function;

        if lexical_function {
            self.visit_with_stmt_like(s, |s| match s {
                Stmt::Decl(Decl::Fn(FnDecl {
                    ident, function: f, ..
                })) if f.body.is_some() => Some(ident.clone()),
                _ => None,
            });
        } else {
            s.visit_children_with(self);
        }
        self.lexical_function = old;
    }

    // Helper methods from duplicate_exports
    fn add_export(&mut self, id: &Ident) {
        match self.exports.entry(id.sym.clone()) {
            Entry::Occupied(mut prev) => {
                let name = &id.sym;

                HANDLER.with(|handler| {
                    handler
                        .struct_span_err(
                            id.span,
                            &format!("the name `{name}` is exported multiple times"),
                        )
                        .span_label(*prev.get(), "previous exported here")
                        .span_label(id.span, "exported more than once")
                        .note("Exported identifiers must be unique")
                        .emit();
                });

                *prev.get_mut() = id.span;
            }
            Entry::Vacant(e) => {
                e.insert(id.span);
            }
        }

        self.check_no_coexist();
    }

    fn add_export_assign(&mut self, span: Span) {
        if let Some(prev_span) = self.export_assign {
            HANDLER.with(|handler| {
                handler
                    .struct_span_err(span, "multiple `export =` found")
                    .span_label(prev_span, "previous `export =` declared here")
                    .emit()
            });
        }

        self.export_assign = Some(span);

        self.check_no_coexist();
    }

    fn check_no_coexist(&self) {
        if let Some(span) = self.export_assign {
            if !self.exports.is_empty() {
                HANDLER.with(|handler| {
                    handler
                        .struct_span_err(span, r#"An export assignment cannot be used in a module with other exported elements."#)
                        .emit()
                });
            }
        }
    }

    // Helper methods from const_assign
    fn check_const_assign(&self, id: &Ident) {
        if self.is_pat_decl {
            return;
        }

        if let Some(&decl_span) = self.const_vars.get(&id.to_id()) {
            HANDLER.with(|handler| {
                handler
                    .struct_span_err(
                        id.span,
                        "cannot reassign to a variable declared with `const`",
                    )
                    .span_label(decl_span, "const variable was declared here")
                    .span_suggestion(
                        decl_span,
                        "consider making this variable mutable",
                        format!("let {}", id.sym),
                    )
                    .span_label(id.span, "cannot reassign")
                    .emit();
            });
        }

        if let Some(&binding_span) = self.import_binding.get(&id.to_id()) {
            HANDLER.with(|handler| {
                handler
                    .struct_span_err(id.span, "cannot reassign to an imported binding")
                    .span_label(binding_span, "imported binding")
                    .emit();
            });
        }
    }
}

impl Visit for CriticalRules {
    noop_visit_type!();

    // Visit methods for all rules combined

    fn visit_module(&mut self, m: &Module) {
        self.lexical_function = true;

        self.visit_with_stmt_like(&m.body, |s| match s {
            ModuleItem::Stmt(Stmt::Decl(Decl::Fn(FnDecl {
                ident, function: f, ..
            })))
            | ModuleItem::ModuleDecl(
                ModuleDecl::ExportDecl(ExportDecl {
                    decl:
                        Decl::Fn(FnDecl {
                            ident, function: f, ..
                        }),
                    ..
                })
                | ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                    decl:
                        DefaultDecl::Fn(FnExpr {
                            ident: Some(ident),
                            function: f,
                        }),
                    ..
                }),
            ) if f.body.is_some() => Some(ident.clone()),
            _ => None,
        });
    }

    fn visit_script(&mut self, s: &Script) {
        s.body.visit_children_with(self);
    }

    fn visit_arrow_expr(&mut self, a: &ArrowExpr) {
        // Check for duplicate args
        check_dupe_args!(&a.params);

        let ArrowExpr { params, body, .. } = a;
        params.visit_with(self);
        if let BlockStmtOrExpr::BlockStmt(b) = &**body {
            self.visit_with_stmts(&b.stmts, false)
        }
    }

    fn visit_function(&mut self, f: &Function) {
        // Check for duplicate args
        check_dupe_args!(&f.params);

        let Function {
            body,
            params,
            decorators,
            ..
        } = f;
        params.visit_with(self);
        decorators.visit_with(self);
        if let Some(body) = body {
            self.visit_with_stmts(&body.stmts, false)
        }
    }

    fn visit_constructor(&mut self, f: &Constructor) {
        // Check for duplicate args
        check_dupe_args!(&f.params);

        f.visit_children_with(self);
    }

    fn visit_var_decl(&mut self, d: &VarDecl) {
        if d.declare {
            return;
        }

        self.visit_with_kind(d, Some(d.kind))
    }

    fn visit_var_declarator(&mut self, var_declarator: &VarDeclarator) {
        let old_is_pat_decl = self.is_pat_decl;
        self.is_pat_decl = true;
        var_declarator.name.visit_with(self);
        self.is_pat_decl = old_is_pat_decl;

        var_declarator.init.visit_with(self);
    }

    fn visit_binding_ident(&mut self, n: &BindingIdent) {
        self.check_const_assign(&Ident::from(n));
    }

    fn visit_update_expr(&mut self, n: &UpdateExpr) {
        n.visit_children_with(self);

        if let Expr::Ident(ident) = &*n.arg {
            self.check_const_assign(ident);
        }
    }

    fn visit_pat(&mut self, p: &Pat) {
        p.visit_children_with(self);

        if let Pat::Ident(p) = p {
            if self.is_pat_decl {
                self.add_binding(
                    p.sym.clone(),
                    BindingInfo {
                        span: p.span,
                        ctxt: p.ctxt,
                        unique: self.is_unique_var_kind(),
                        is_function: false,
                    },
                );
            }
        }
    }

    fn visit_assign_pat_prop(&mut self, p: &AssignPatProp) {
        p.visit_children_with(self);

        if self.is_pat_decl {
            self.add_binding(
                p.key.sym.clone(),
                BindingInfo {
                    span: p.key.span,
                    ctxt: p.key.ctxt,
                    unique: self.is_unique_var_kind(),
                    is_function: false,
                },
            );
        }
    }

    fn visit_expr(&mut self, e: &Expr) {
        let old_var_decl_kind = self.var_decl_kind.take();
        let old_is_pat_decl = self.is_pat_decl;

        self.var_decl_kind = None;
        self.is_pat_decl = false;

        e.visit_children_with(self);

        self.is_pat_decl = old_is_pat_decl;
        self.var_decl_kind = old_var_decl_kind;
    }

    fn visit_class_decl(&mut self, d: &ClassDecl) {
        if d.declare {
            return;
        }

        self.add_binding(
            d.ident.sym.clone(),
            BindingInfo {
                span: d.ident.span,
                ctxt: d.ident.ctxt,
                unique: true,
                is_function: false,
            },
        );

        d.visit_children_with(self);
    }

    fn visit_fn_decl(&mut self, d: &FnDecl) {
        if d.function.body.is_none() || d.declare {
            return;
        }

        self.add_binding(
            d.ident.sym.clone(),
            BindingInfo {
                span: d.ident.span,
                ctxt: d.ident.ctxt,
                unique: self.lexical_function,
                is_function: true,
            },
        );

        d.visit_children_with(self);
    }

    fn visit_import_decl(&mut self, s: &ImportDecl) {
        if s.type_only {
            return;
        }

        s.visit_children_with(self);
    }

    fn visit_import_default_specifier(&mut self, s: &ImportDefaultSpecifier) {
        s.visit_children_with(self);

        if !self.type_bindings.contains(&s.local.to_id()) {
            self.add_binding(
                s.local.sym.clone(),
                BindingInfo {
                    span: s.local.span,
                    ctxt: s.local.ctxt,
                    unique: true,
                    is_function: false,
                },
            );
        }
    }

    fn visit_import_named_specifier(&mut self, s: &ImportNamedSpecifier) {
        s.visit_children_with(self);

        if !s.is_type_only && !self.type_bindings.contains(&s.local.to_id()) {
            self.add_binding(
                s.local.sym.clone(),
                BindingInfo {
                    span: s.local.span,
                    ctxt: s.local.ctxt,
                    unique: true,
                    is_function: false,
                },
            );
        }
    }

    fn visit_import_star_as_specifier(&mut self, s: &ImportStarAsSpecifier) {
        s.visit_children_with(self);

        if !self.type_bindings.contains(&s.local.to_id()) {
            self.add_binding(
                s.local.sym.clone(),
                BindingInfo {
                    span: s.local.span,
                    ctxt: s.local.ctxt,
                    unique: true,
                    is_function: false,
                },
            );
        }
    }

    fn visit_catch_clause(&mut self, c: &CatchClause) {
        self.visit_with_kind(c, Some(VarDeclKind::Var))
    }

    fn visit_param(&mut self, p: &Param) {
        self.visit_with_kind(p, Some(VarDeclKind::Var))
    }

    fn visit_static_block(&mut self, c: &StaticBlock) {
        self.visit_with_stmts(&c.body.stmts, false)
    }

    fn visit_stmts(&mut self, b: &[Stmt]) {
        self.visit_with_stmts(b, true)
    }

    // Export related visits
    fn visit_export_default_decl(&mut self, d: &ExportDefaultDecl) {
        match &d.decl {
            DefaultDecl::Class(ClassExpr {
                ident: Some(ident), ..
            }) => self.add_binding(
                ident.sym.clone(),
                BindingInfo {
                    span: ident.span,
                    ctxt: ident.ctxt,
                    unique: true,
                    is_function: false,
                },
            ),
            DefaultDecl::Fn(FnExpr {
                ident: Some(ident),
                function: f,
                ..
            }) if f.body.is_some() => self.add_binding(
                ident.sym.clone(),
                BindingInfo {
                    span: ident.span,
                    ctxt: ident.ctxt,
                    unique: self.lexical_function,
                    is_function: true,
                },
            ),
            _ => {}
        }

        // Check for duplicate exports
        if match &d.decl {
            DefaultDecl::Fn(FnExpr { function: f, .. }) if f.body.is_none() => true,
            DefaultDecl::TsInterfaceDecl(..) => true,
            _ => false,
        } {
            return;
        }

        d.visit_children_with(self);

        self.add_export(&Ident::new_no_ctxt(atom!("default"), d.span));
    }

    fn visit_export_default_expr(&mut self, d: &ExportDefaultExpr) {
        d.visit_children_with(self);

        match &*d.expr {
            Expr::Fn(FnExpr { function: f, .. }) if f.body.is_none() => return,
            _ => {}
        }

        self.add_export(&Ident::new_no_ctxt(atom!("default"), d.span));
    }

    fn visit_export_default_specifier(&mut self, s: &ExportDefaultSpecifier) {
        self.add_export(&s.exported);
    }

    fn visit_export_named_specifier(&mut self, s: &ExportNamedSpecifier) {
        let exported = match &s.exported {
            Some(ModuleExportName::Ident(ident)) => Some(ident),
            Some(ModuleExportName::Str(..)) => return,
            _ => None,
        };
        let orig = match &s.orig {
            ModuleExportName::Ident(ident) => ident,
            ModuleExportName::Str(..) => return,
            #[cfg(swc_ast_unknown)]
            _ => return,
        };
        self.add_export(exported.as_ref().unwrap_or(&orig));
    }

    fn visit_export_namespace_specifier(&mut self, s: &ExportNamespaceSpecifier) {
        match &s.name {
            ModuleExportName::Ident(name) => self.add_export(name),
            ModuleExportName::Str(..) => {}
            #[cfg(swc_ast_unknown)]
            _ => (),
        };
    }

    fn visit_ts_export_assignment(&mut self, n: &TsExportAssignment) {
        self.add_export_assign(n.span);
    }

    fn visit_ts_import_equals_decl(&mut self, n: &TsImportEqualsDecl) {
        if n.is_export && !n.is_type_only {
            self.add_export(&n.id)
        }

        if !n.is_type_only && !self.type_bindings.contains(&n.id.to_id()) {
            self.add_binding(
                n.id.sym.clone(),
                BindingInfo {
                    span: n.id.span,
                    ctxt: n.id.ctxt,
                    unique: true,
                    is_function: false,
                },
            );
        }
    }

    fn visit_ts_module_decl(&mut self, d: &TsModuleDecl) {
        if !d.declare {
            let old_exports = std::mem::take(&mut self.exports);
            let old_export_assign = self.export_assign.take();
            d.visit_children_with(self);
            self.exports = old_exports;
            self.export_assign = old_export_assign;
        }
    }
}

// Collector structs
struct ConstCollector<'a> {
    const_vars: &'a mut FxHashMap<Id, Span>,
    import_binding: &'a mut FxHashMap<Id, Span>,
    var_decl_kind: Option<VarDeclKind>,
}

impl Visit for ConstCollector<'_> {
    noop_visit_type!();

    fn visit_import_specifier(&mut self, n: &ImportSpecifier) {
        match n {
            ImportSpecifier::Named(ImportNamedSpecifier { local, .. })
            | ImportSpecifier::Default(ImportDefaultSpecifier { local, .. })
            | ImportSpecifier::Namespace(ImportStarAsSpecifier { local, .. }) => {
                self.import_binding.insert(local.to_id(), local.span);
            }
            #[cfg(swc_ast_unknown)]
            _ => (),
        }
    }

    fn visit_assign_pat_prop(&mut self, p: &AssignPatProp) {
        p.visit_children_with(self);

        if let Some(VarDeclKind::Const) = self.var_decl_kind {
            *self.const_vars.entry(p.key.to_id()).or_default() = p.span;
        }
    }

    fn visit_expr(&mut self, e: &Expr) {
        let old_var_decl_kind = self.var_decl_kind;
        self.var_decl_kind = None;

        e.visit_children_with(self);

        self.var_decl_kind = old_var_decl_kind;
    }

    fn visit_pat(&mut self, p: &Pat) {
        p.visit_children_with(self);

        if let Some(VarDeclKind::Const) = self.var_decl_kind {
            if let Pat::Ident(i) = p {
                *self.const_vars.entry(i.to_id()).or_default() = i.span;
            }
        }
    }

    fn visit_var_decl(&mut self, var_decl: &VarDecl) {
        let old_var_decl_kind = self.var_decl_kind;
        self.var_decl_kind = Some(var_decl.kind);

        var_decl.visit_children_with(self);

        self.var_decl_kind = old_var_decl_kind;
    }
}

struct TypeCollector<'a> {
    type_bindings: &'a mut FxHashSet<Id>,
}

impl Visit for TypeCollector<'_> {
    fn visit_ts_entity_name(&mut self, n: &TsEntityName) {
        n.visit_children_with(self);

        if let TsEntityName::Ident(ident) = n {
            self.type_bindings.insert(ident.to_id());
        }
    }
}

#[cold]
fn emit_dupe_args_error(first: &BindingIdent, second: &BindingIdent) {
    HANDLER.with(|handler| {
        handler
            .struct_span_err(
                second.span,
                &format!(
                    "the name `{}` is bound more than once in this parameter list",
                    first.sym
                ),
            )
            .span_label(first.span, "previous definition here".to_string())
            .span_label(second.span, "used as parameter more than once".to_string())
            .emit();
    });
}

#[cold]
fn emit_duplicate_binding_error(name: &str, span: Span, prev_span: Span) {
    HANDLER.with(|handler| {
        handler
            .struct_span_err(
                span,
                &format!("the name `{name}` is defined multiple times"),
            )
            .span_label(prev_span, format!("previous definition of `{name}` here"))
            .span_label(span, format!("`{name}` redefined here"))
            .emit();
    });
}
