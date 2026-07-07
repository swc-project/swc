use swc_atoms::{atom, Atom};
use swc_common::{util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_pat_ids, private_ident, ExprFactory};

use super::{
    ir::{
        export_name as make_export_name, DependencySlot, ExecuteStmt, ExportInit, ExportName,
        ExportTable, SetterOp, SystemModule,
    },
    pattern::replace_exported_pat,
    util::object_lit_prop_name,
};
use crate::{
    module_record::{
        external_ts_import_equals_source, LocalExportEntries, ModuleRecordEntry, RequestedModule,
        RequestedModules, SourceModule, SourceModuleItem,
    },
    util::local_name_for_src,
};

pub(super) fn lower(source: SourceModule) -> SystemModule {
    let SourceModule {
        directives: _directives,
        has_use_strict: _has_use_strict,
        requested_modules,
        local_export_entries,
        ts_export_assignment,
        body,
        has_module_syntax: _has_module_syntax,
    } = source;
    let default_value_exports = collect_default_value_exports(&body);
    let mut exports = collect_local_exports(local_export_entries);
    exports.announced.extend(default_value_exports);
    exports
        .announced
        .sort_unstable_by(|a, b| a.name.cmp(&b.name));
    let mut module = SystemModule::new(exports.clone());

    lower_dependencies(&mut module, &mut exports, requested_modules);
    module.exports = exports;

    for item in body {
        lower_source_item(&mut module, item);
    }
    if let Some(export_assignment) = ts_export_assignment {
        module
            .execute_stmts
            .push(ExecuteStmt::export_batch(export_assignment));
    }

    module
}

fn collect_default_value_exports(body: &[SourceModuleItem]) -> Vec<ExportName> {
    let mut exports = Vec::new();
    for item in body {
        match item {
            SourceModuleItem::ExportDefaultExpr(export) => {
                exports.push(default_export_name(export.span));
            }
            SourceModuleItem::ExportDefaultDecl(export) => match &export.decl {
                DefaultDecl::Class(class_expr) if class_expr.ident.is_none() => {
                    exports.push(default_export_name(export.span));
                }
                DefaultDecl::Fn(fn_expr) if fn_expr.ident.is_none() => {
                    exports.push(default_export_name(export.span));
                }
                _ => {}
            },
            _ => {}
        }
    }

    exports
}

fn collect_local_exports(local_export_entries: LocalExportEntries) -> ExportTable {
    let mut entries: Vec<_> = local_export_entries.into_iter().collect();
    entries.sort_unstable_by(|a, b| a.0.cmp(&b.0));

    let mut exports = ExportTable::default();
    for (name, entry) in entries {
        let span = entry.export_name_span();
        let local = entry.into_local_ident();
        exports.add_local(local.to_id(), make_export_name(name, span));
    }

    exports
}

fn lower_dependencies(
    module: &mut SystemModule,
    exports: &mut ExportTable,
    requested_modules: RequestedModules,
) {
    for (module_request, RequestedModule { span, entries, .. }) in requested_modules {
        let request = module_request.src().clone();
        let attributes = module_request.attributes().to_vec();
        let namespace = namespace_ident_for(&request);
        let mut setter_ops = Vec::with_capacity(entries.len());
        let mut entries: Vec<_> = entries.into_iter().collect();
        entries.sort_unstable_by(compare_module_entries);

        for entry in entries {
            match entry {
                ModuleRecordEntry::Empty => {}
                ModuleRecordEntry::ImportDefault { local_name } => {
                    let local = ident_from_id(local_name, span.0);
                    module.wrapper_vars.push(local.clone());
                    setter_ops.push(SetterOp::Import {
                        local,
                        imported: Some(atom!("default")),
                    });
                }
                ModuleRecordEntry::ImportNamed {
                    import_name,
                    local_name,
                } => {
                    let local = ident_from_id(local_name.clone(), span.0);
                    module.wrapper_vars.push(local.clone());
                    setter_ops.push(SetterOp::Import {
                        local,
                        imported: Some(import_name.unwrap_or(local_name.0)),
                    });
                }
                ModuleRecordEntry::ImportNamespace { local_name } => {
                    let local = ident_from_id(local_name, span.0);
                    module.wrapper_vars.push(local.clone());
                    setter_ops.push(SetterOp::Import {
                        local,
                        imported: None,
                    });
                }
                ModuleRecordEntry::IndirectExportNamed {
                    import_name,
                    export_name,
                } => {
                    let (export_name, export_span) =
                        export_name.unwrap_or_else(|| import_name.clone());
                    let export = make_export_name(export_name, export_span);
                    exports.add_indirect(export.clone());
                    setter_ops.push(SetterOp::ReExport {
                        export,
                        imported: import_name.0,
                    });
                }
                ModuleRecordEntry::IndirectExportDefault {
                    export_name,
                    export_name_span,
                } => {
                    let export = make_export_name(export_name, export_name_span);
                    exports.add_indirect(export.clone());
                    setter_ops.push(SetterOp::ReExport {
                        export,
                        imported: atom!("default"),
                    });
                }
                ModuleRecordEntry::IndirectExportNamespace {
                    export_name,
                    export_name_span,
                } => {
                    let export = make_export_name(export_name, export_name_span);
                    exports.add_indirect(export.clone());
                    setter_ops.push(SetterOp::ReExportNamespace { export });
                }
                ModuleRecordEntry::StarExport => {
                    setter_ops.push(SetterOp::StarExport);
                }
            }
        }

        module.dependencies.push(DependencySlot {
            request,
            span,
            attributes,
            namespace,
            setter_ops,
        });
    }
}

fn lower_source_item(module: &mut SystemModule, item: SourceModuleItem) {
    match item {
        SourceModuleItem::Stmt(stmt) => lower_stmt(module, stmt),
        SourceModuleItem::ExportDecl(export) => lower_decl(module, export.decl),
        SourceModuleItem::ExportDefaultDecl(export) => lower_default_decl(module, export),
        SourceModuleItem::ExportDefaultExpr(export) => {
            module.execute_stmts.push(ExecuteStmt::export_value(
                default_export_name(export.span),
                export.expr,
            ));
        }
        SourceModuleItem::TsImportEquals(import) => lower_ts_import_equals(module, *import),
    }
}

fn default_export_name(span: swc_common::Span) -> ExportName {
    make_export_name(atom!("default"), (span, Default::default()))
}

fn lower_ts_import_equals(module: &mut SystemModule, import: TsImportEqualsDecl) {
    let Some(src) = external_ts_import_equals_source(&import) else {
        return;
    };

    let request = src.value.to_atom_lossy().into_owned();
    let span = (src.span, Default::default());
    let namespace = namespace_ident_for(&request);
    let local = import.id;

    module.wrapper_vars.push(local.clone());
    module.dependencies.push(DependencySlot {
        request,
        span,
        attributes: Vec::new(),
        namespace,
        setter_ops: vec![SetterOp::Import {
            local,
            imported: None,
        }],
    });
}

fn lower_stmt(module: &mut SystemModule, stmt: Stmt) {
    if let Stmt::Decl(decl) = stmt {
        lower_decl(module, decl);
    } else {
        let mut stmt = stmt;
        lower_var_scoped_decls(module, &mut stmt);
        module.execute_stmts.push(ExecuteStmt::source(stmt));
    }
}

fn lower_decl(module: &mut SystemModule, decl: Decl) {
    match decl {
        Decl::Fn(fn_decl) => {
            module.wrapper_fns.push(fn_decl);
        }
        Decl::Class(class_decl) => {
            let ClassDecl {
                ident,
                declare: _,
                class,
            } = class_decl;

            module.wrapper_vars.push(ident.clone());
            module.execute_stmts.push(assign_or_export(
                module,
                ident.clone(),
                ClassExpr {
                    ident: Some(ident),
                    class,
                }
                .into(),
            ));
        }
        Decl::Var(var_decl) => {
            lower_var_decl(module, *var_decl);
        }
        _ => module
            .execute_stmts
            .push(ExecuteStmt::source(Stmt::Decl(decl))),
    }
}

fn lower_default_decl(module: &mut SystemModule, export: ExportDefaultDecl) {
    let export_span = export.span;

    match export.decl {
        DefaultDecl::Class(class_expr) => {
            let Some(ident) = class_expr.ident else {
                module.execute_stmts.push(ExecuteStmt::export_value(
                    default_export_name(export_span),
                    ClassExpr {
                        ident: None,
                        class: class_expr.class,
                    }
                    .into(),
                ));
                return;
            };

            module.wrapper_vars.push(ident.clone());
            module.execute_stmts.push(assign_or_export(
                module,
                ident.clone(),
                ClassExpr {
                    ident: Some(ident),
                    class: class_expr.class,
                }
                .into(),
            ));
        }
        DefaultDecl::Fn(fn_expr) => {
            let Some(ident) = fn_expr.ident.clone() else {
                module.export_inits.push(ExportInit::new(
                    default_export_name(export_span),
                    fn_expr.into(),
                ));
                return;
            };

            module.wrapper_fns.push(FnDecl {
                ident,
                declare: false,
                function: fn_expr.function,
            });
        }
        DefaultDecl::TsInterfaceDecl(_) => {}
        #[cfg(swc_ast_unknown)]
        _ => panic!("unable to access unknown nodes"),
    }
}

fn lower_var_decl(module: &mut SystemModule, var_decl: VarDecl) {
    for declarator in var_decl.decls {
        if let Pat::Ident(binding) = declarator.name {
            let ident = binding.id;
            let Some(init) = declarator.init else {
                module.wrapper_vars.push(ident);
                continue;
            };

            module.wrapper_vars.push(ident.clone());
            module
                .execute_stmts
                .push(assign_or_export(module, ident, init));
            continue;
        }

        let ids = find_pat_ids::<_, Ident>(&declarator.name);
        module.wrapper_vars.extend(ids.iter().cloned());

        let Some(init) = declarator.init else {
            continue;
        };

        let mut pattern = declarator.name;
        let uses_export_setters = replace_exported_pat(
            &mut pattern,
            &module.exports.local_exports,
            &module.export_setters,
        );
        if uses_export_setters {
            module.needs_export_setters = true;
        }

        if let Ok(left) = AssignTarget::try_from(pattern) {
            module.execute_stmts.push(ExecuteStmt::assign(left, init));
            if !uses_export_setters {
                for ident in ids {
                    if let Some(exports) = module.exports.exports_for(&ident.to_id()) {
                        module
                            .execute_stmts
                            .push(ExecuteStmt::export_names(exports, ident));
                    }
                }
            }
        }
    }
}

fn assign_or_export(module: &SystemModule, ident: Ident, value: Box<Expr>) -> ExecuteStmt {
    if let Some(exports) = module.exports.exports_for(&ident.to_id()) {
        ExecuteStmt::export_assign(exports, ident, value)
    } else {
        ExecuteStmt::assign(ident.into(), value)
    }
}

fn lower_var_scoped_decls(module: &mut SystemModule, stmt: &mut Stmt) {
    // Function declarations are emitted in wrapper scope, so `var` bindings
    // from the module's execution scope must live there too. Lexical
    // declarations inside nested blocks keep their original scope.
    match stmt {
        Stmt::Block(block) => lower_var_scoped_decls_in_stmts(module, &mut block.stmts),
        Stmt::With(with) => lower_var_scoped_decls(module, &mut with.body),
        Stmt::Labeled(labeled) => lower_var_scoped_decls(module, &mut labeled.body),
        Stmt::If(if_stmt) => {
            lower_var_scoped_decls(module, &mut if_stmt.cons);
            if let Some(alt) = &mut if_stmt.alt {
                lower_var_scoped_decls(module, alt);
            }
        }
        Stmt::Switch(switch) => {
            for case in &mut switch.cases {
                lower_var_scoped_decls_in_stmts(module, &mut case.cons);
            }
        }
        Stmt::Try(try_stmt) => {
            lower_var_scoped_decls_in_stmts(module, &mut try_stmt.block.stmts);
            if let Some(handler) = &mut try_stmt.handler {
                lower_var_scoped_decls_in_stmts(module, &mut handler.body.stmts);
            }
            if let Some(finalizer) = &mut try_stmt.finalizer {
                lower_var_scoped_decls_in_stmts(module, &mut finalizer.stmts);
            }
        }
        Stmt::While(while_stmt) => lower_var_scoped_decls(module, &mut while_stmt.body),
        Stmt::DoWhile(do_while) => lower_var_scoped_decls(module, &mut do_while.body),
        Stmt::For(for_stmt) => {
            lower_for_init(module, &mut for_stmt.init);
            lower_var_scoped_decls(module, &mut for_stmt.body);
        }
        Stmt::ForIn(for_in) => {
            lower_for_head(module, &mut for_in.left);
            lower_var_scoped_decls(module, &mut for_in.body);
        }
        Stmt::ForOf(for_of) => {
            lower_for_head(module, &mut for_of.left);
            lower_var_scoped_decls(module, &mut for_of.body);
        }
        Stmt::Decl(Decl::Var(var_decl)) if var_decl.kind == VarDeclKind::Var => {
            *stmt = lower_var_decl_stmt(module, *var_decl.take());
        }
        _ => {}
    }
}

fn lower_var_scoped_decls_in_stmts(module: &mut SystemModule, stmts: &mut [Stmt]) {
    for stmt in stmts {
        lower_var_scoped_decls(module, stmt);
    }
}

fn lower_for_init(module: &mut SystemModule, init: &mut Option<VarDeclOrExpr>) {
    let Some(VarDeclOrExpr::VarDecl(var_decl)) = init else {
        return;
    };
    if var_decl.kind != VarDeclKind::Var {
        return;
    }

    *init = var_decl_to_assignments(module, *var_decl.take()).map(VarDeclOrExpr::Expr);
}

fn lower_for_head(module: &mut SystemModule, head: &mut ForHead) {
    let ForHead::VarDecl(var_decl) = head else {
        return;
    };
    if var_decl.kind != VarDeclKind::Var {
        return;
    }

    for declarator in &var_decl.decls {
        module
            .wrapper_vars
            .extend(find_pat_ids::<_, Ident>(&declarator.name));
    }

    if var_decl.decls.len() == 1 {
        let mut var_decl = var_decl.take();
        let declarator = var_decl.decls.pop().unwrap();
        *head = declarator.name.into();
    }
}

fn lower_var_decl_stmt(module: &mut SystemModule, var_decl: VarDecl) -> Stmt {
    var_decl_to_assignments(module, var_decl).map_or_else(
        || EmptyStmt { span: DUMMY_SP }.into(),
        ExprFactory::into_stmt,
    )
}

fn var_decl_to_assignments(module: &mut SystemModule, var_decl: VarDecl) -> Option<Box<Expr>> {
    let mut exprs = Vec::new();
    for declarator in var_decl.decls {
        module
            .wrapper_vars
            .extend(find_pat_ids::<_, Ident>(&declarator.name));

        let Some(init) = declarator.init else {
            continue;
        };
        let Ok(left) = AssignTarget::try_from(declarator.name) else {
            continue;
        };

        exprs.push(
            AssignExpr {
                span: declarator.span,
                op: op!("="),
                left,
                right: init,
            }
            .into(),
        );
    }

    match exprs.len() {
        0 => None,
        1 => exprs.pop(),
        _ => Some(
            SeqExpr {
                span: var_decl.span,
                exprs,
            }
            .into(),
        ),
    }
}

pub(super) fn export_call(export_ident: &Ident, exports: &[ExportName], value: Expr) -> Expr {
    exports.iter().fold(value, |value, export| {
        export_ident.clone().as_call(
            value.span(),
            vec![
                Str {
                    span: export.span.0,
                    value: export.name.clone().into(),
                    raw: None,
                }
                .as_arg(),
                value.as_arg(),
            ],
        )
    })
}

pub(super) fn export_names_call(
    export_ident: &Ident,
    exports: &[ExportName],
    value_ident: Ident,
) -> Expr {
    if exports.len() == 1 {
        export_call(export_ident, exports, value_ident.into())
    } else {
        let props = exports
            .iter()
            .map(|export| {
                Prop::KeyValue(KeyValueProp {
                    key: object_lit_prop_name(&export.name, export.span),
                    value: value_ident.clone().into(),
                })
                .into()
            })
            .collect();

        export_ident.clone().as_call(
            DUMMY_SP,
            vec![ObjectLit {
                span: DUMMY_SP,
                props,
            }
            .as_arg()],
        )
    }
}

fn namespace_ident_for(src: &Atom) -> Ident {
    let base = local_name_for_src(src);
    private_ident!(format!("{base}_ns"))
}

fn ident_from_id((sym, ctxt): Id, span: swc_common::Span) -> Ident {
    Ident::new(sym, span, ctxt)
}

fn compare_module_entries(a: &ModuleRecordEntry, b: &ModuleRecordEntry) -> std::cmp::Ordering {
    module_entry_rank(a)
        .cmp(&module_entry_rank(b))
        .then_with(|| module_entry_sort_name(a).cmp(&module_entry_sort_name(b)))
}

fn module_entry_rank(entry: &ModuleRecordEntry) -> u8 {
    match entry {
        ModuleRecordEntry::Empty => 0,
        ModuleRecordEntry::ImportDefault { .. } => 1,
        ModuleRecordEntry::ImportNamespace { .. } => 2,
        ModuleRecordEntry::ImportNamed { .. } => 3,
        ModuleRecordEntry::IndirectExportDefault { .. } => 4,
        ModuleRecordEntry::IndirectExportNamed { .. } => 5,
        ModuleRecordEntry::IndirectExportNamespace { .. } => 6,
        ModuleRecordEntry::StarExport => 7,
    }
}

fn module_entry_sort_name(entry: &ModuleRecordEntry) -> Option<&Atom> {
    match entry {
        ModuleRecordEntry::ImportDefault { local_name }
        | ModuleRecordEntry::ImportNamespace { local_name }
        | ModuleRecordEntry::ImportNamed { local_name, .. } => Some(&local_name.0),
        ModuleRecordEntry::IndirectExportDefault { export_name, .. }
        | ModuleRecordEntry::IndirectExportNamespace { export_name, .. } => Some(export_name),
        ModuleRecordEntry::IndirectExportNamed {
            export_name,
            import_name,
        } => Some(
            export_name
                .as_ref()
                .map_or(&import_name.0, |export_name| &export_name.0),
        ),
        ModuleRecordEntry::Empty | ModuleRecordEntry::StarExport => None,
    }
}
