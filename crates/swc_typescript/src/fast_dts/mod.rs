use std::{borrow::Cow, mem::take, sync::Arc};

use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::Atom;
use swc_common::{
    comments::SingleThreadedComments, util::take::Take, BytePos, FileName, Span, Spanned, DUMMY_SP,
};
use swc_ecma_ast::{
    BindingIdent, Decl, DefaultDecl, ExportDefaultExpr, Id, Ident, ImportSpecifier, ModuleDecl,
    ModuleItem, NamedExport, Pat, Program, Script, Stmt, TsExportAssignment, VarDecl, VarDeclKind,
    VarDeclarator,
};
use type_usage::TypeUsageAnalyzer;
use util::{
    ast_ext::MemberPropExt, expando_function_collector::ExpandoFunctionCollector, types::type_ann,
};
use visitors::type_usage;

use crate::diagnostic::{DtsIssue, SourceRange};

mod class;
mod decl;
mod r#enum;
mod function;
mod inferrer;
mod types;
mod util;
mod visitors;

/// TypeScript Isolated Declaration support.
///
/// ---
///
/// # License
///
/// Mostly translated from <https://github.com/oxc-project/oxc/tree/main/crates/oxc_isolated_declarations>
///
/// The original code is MIT licensed.
pub struct FastDts {
    filename: Arc<FileName>,
    diagnostics: Vec<DtsIssue>,
    // states
    id_counter: u32,
    is_top_level: bool,
    used_refs: FxHashSet<Id>,
    internal_annotations: Option<FxHashSet<BytePos>>,
}

#[derive(Debug, Default)]
pub struct FastDtsOptions {
    pub internal_annotations: Option<FxHashSet<BytePos>>,
}

/// Diagnostics
impl FastDts {
    pub fn new(filename: Arc<FileName>, options: FastDtsOptions) -> Self {
        let internal_annotations = options.internal_annotations;
        Self {
            filename,
            diagnostics: Vec::new(),
            id_counter: 0,
            is_top_level: true,
            used_refs: FxHashSet::default(),
            internal_annotations,
        }
    }

    pub fn mark_diagnostic<T: Into<Cow<'static, str>>>(&mut self, message: T, range: Span) {
        self.diagnostics.push(DtsIssue {
            message: message.into(),
            range: SourceRange {
                filename: self.filename.clone(),
                span: range,
            },
        })
    }
}

impl FastDts {
    pub fn transform(&mut self, program: &mut Program) -> Vec<DtsIssue> {
        match program {
            Program::Module(module) => self.transform_module_body(&mut module.body, false),
            Program::Script(script) => self.transform_script(script),
        }
        take(&mut self.diagnostics)
    }

    fn transform_module_body(
        &mut self,
        items: &mut Vec<ModuleItem>,
        in_global_or_lit_module: bool,
    ) {
        // 1. Analyze usage
        self.used_refs.extend(TypeUsageAnalyzer::analyze(
            items,
            self.internal_annotations.as_ref(),
        ));

        // 2. Transform.
        Self::remove_function_overloads_in_module(items);
        self.transform_module_items(items);

        // 3. Strip export keywords in ts module blocks
        for item in items.iter_mut() {
            if let Some(Stmt::Decl(Decl::TsModule(ts_module))) = item.as_mut_stmt() {
                if ts_module.global || !ts_module.id.is_str() {
                    continue;
                }

                if let Some(body) = ts_module
                    .body
                    .as_mut()
                    .and_then(|body| body.as_mut_ts_module_block())
                {
                    self.strip_export(&mut body.body);
                }
            }
        }

        // 4. Report error for expando function and remove statements.
        self.report_error_for_expando_function_in_module(items);
        items.retain(|item| {
            item.as_stmt()
                .map(|stmt| stmt.is_decl() && !self.has_internal_annotation(stmt.span_lo()))
                .unwrap_or(true)
        });

        // 5. Remove unused imports and decls
        self.remove_ununsed(items, in_global_or_lit_module);

        // 6. Add empty export mark if there's any declaration that is used but not
        // exported to keep its privacy.
        let mut has_non_exported_stmt = false;
        let mut has_export = false;
        for item in items.iter_mut() {
            match item {
                ModuleItem::Stmt(stmt) => {
                    if stmt.as_decl().map_or(true, |decl| !decl.is_ts_module()) {
                        has_non_exported_stmt = true;
                    }
                }
                ModuleItem::ModuleDecl(
                    ModuleDecl::ExportDefaultDecl(_)
                    | ModuleDecl::ExportDefaultExpr(_)
                    | ModuleDecl::ExportNamed(_)
                    | ModuleDecl::TsExportAssignment(_),
                ) => has_export = true,
                _ => {}
            }
        }
        if items.is_empty() || (has_non_exported_stmt && !has_export) {
            items.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                NamedExport {
                    span: DUMMY_SP,
                    specifiers: Vec::new(),
                    src: None,
                    type_only: false,
                    with: None,
                },
            )));
        } else if !self.is_top_level {
            self.strip_export(items);
        }
    }

    fn transform_script(&mut self, script: &mut Script) {
        // 1. Transform.
        Self::remove_function_overloads_in_script(script);
        let body = script.body.take();
        for mut stmt in body {
            if self.has_internal_annotation(stmt.span_lo()) {
                continue;
            }
            if let Some(decl) = stmt.as_mut_decl() {
                self.transform_decl(decl, false);
            }
            script.body.push(stmt);
        }

        // 2. Report error for expando function and remove statements.
        self.report_error_for_expando_function_in_script(&script.body);
        script
            .body
            .retain(|stmt| stmt.is_decl() && !self.has_internal_annotation(stmt.span_lo()));
    }

    fn transform_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        let orig_items = take(items);

        for mut item in orig_items {
            match &mut item {
                ModuleItem::ModuleDecl(
                    ModuleDecl::Import(..)
                    | ModuleDecl::TsImportEquals(_)
                    | ModuleDecl::TsNamespaceExport(_),
                ) => items.push(item),
                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(_) | ModuleDecl::ExportAll(_)) => {
                    items.push(item);
                }
                ModuleItem::Stmt(stmt) => {
                    if self.has_internal_annotation(stmt.span_lo()) {
                        continue;
                    }

                    if let Some(decl) = stmt.as_mut_decl() {
                        self.transform_decl(decl, true);
                    }
                    items.push(item);
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(expor_decl)) => {
                    if self.has_internal_annotation(expor_decl.span_lo()) {
                        continue;
                    }
                    self.transform_decl(&mut expor_decl.decl, false);
                    items.push(item);
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(export)) => {
                    self.transform_default_decl(&mut export.decl);
                    items.push(item);
                }
                ModuleItem::ModuleDecl(
                    ModuleDecl::ExportDefaultExpr(_) | ModuleDecl::TsExportAssignment(_),
                ) => {
                    let expr = match &item {
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(export)) => {
                            &export.expr
                        }
                        ModuleItem::ModuleDecl(ModuleDecl::TsExportAssignment(export)) => {
                            &export.expr
                        }
                        _ => unreachable!(),
                    };

                    if expr.is_ident() {
                        items.push(item);
                        continue;
                    }

                    let name_ident = Ident::new_no_ctxt(self.gen_unique_name("_default"), DUMMY_SP);
                    let type_ann = self.infer_type_from_expr(expr).map(type_ann);
                    self.used_refs.insert(name_ident.to_id());

                    if type_ann.is_none() {
                        self.default_export_inferred(expr.span());
                    }

                    items.push(
                        VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Const,
                            declare: true,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(BindingIdent {
                                    id: name_ident.clone(),
                                    type_ann,
                                }),
                                init: None,
                                definite: false,
                            }],
                            ..Default::default()
                        }
                        .into(),
                    );

                    match &item {
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(export)) => items
                            .push(
                                ExportDefaultExpr {
                                    span: export.span,
                                    expr: name_ident.into(),
                                }
                                .into(),
                            ),
                        ModuleItem::ModuleDecl(ModuleDecl::TsExportAssignment(export)) => items
                            .push(
                                TsExportAssignment {
                                    span: export.span,
                                    expr: name_ident.into(),
                                }
                                .into(),
                            ),
                        _ => unreachable!(),
                    };
                }
            }
        }
    }

    fn report_error_for_expando_function_in_module(&mut self, items: &[ModuleItem]) {
        let used_refs = self.used_refs.clone();
        let mut assignable_properties_for_namespace = FxHashMap::<&str, FxHashSet<Atom>>::default();
        let mut collector = ExpandoFunctionCollector::new(&used_refs);

        for item in items {
            let decl = match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl)) => {
                    if let Some(ts_module) = export_decl.decl.as_ts_module() {
                        ts_module
                    } else {
                        continue;
                    }
                }
                ModuleItem::Stmt(Stmt::Decl(Decl::TsModule(ts_module))) => ts_module,
                _ => continue,
            };

            let (Some(name), Some(block)) = (
                decl.id.as_ident(),
                decl.body
                    .as_ref()
                    .and_then(|body| body.as_ts_module_block()),
            ) else {
                continue;
            };

            for item in &block.body {
                // Note that all the module blocks have been transformed
                let Some(decl) = item.as_stmt().and_then(|stmt| stmt.as_decl()) else {
                    continue;
                };

                match &decl {
                    Decl::Class(class_decl) => {
                        assignable_properties_for_namespace
                            .entry(name.sym.as_str())
                            .or_default()
                            .insert(class_decl.ident.sym.clone());
                    }
                    Decl::Fn(fn_decl) => {
                        assignable_properties_for_namespace
                            .entry(name.sym.as_str())
                            .or_default()
                            .insert(fn_decl.ident.sym.clone());
                    }
                    Decl::Var(var_decl) => {
                        for decl in &var_decl.decls {
                            if let Some(ident) = decl.name.as_ident() {
                                assignable_properties_for_namespace
                                    .entry(name.sym.as_str())
                                    .or_default()
                                    .insert(ident.sym.clone());
                            }
                        }
                    }
                    Decl::Using(using_decl) => {
                        for decl in &using_decl.decls {
                            if let Some(ident) = decl.name.as_ident() {
                                assignable_properties_for_namespace
                                    .entry(name.sym.as_str())
                                    .or_default()
                                    .insert(ident.sym.clone());
                            }
                        }
                    }
                    _ => {}
                }
            }
        }

        for item in items {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl)) => {
                    match &export_decl.decl {
                        Decl::Fn(fn_decl) => collector.add_fn_decl(fn_decl, false),
                        Decl::Var(var_decl) => collector.add_var_decl(var_decl, false),
                        _ => (),
                    }
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(export_decl)) => {
                    if let DefaultDecl::Fn(fn_expr) = &export_decl.decl {
                        collector.add_fn_expr(fn_expr)
                    }
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(_export_named)) => {
                    // TODO: may be function
                }
                ModuleItem::Stmt(Stmt::Decl(decl)) => match decl {
                    Decl::Fn(fn_decl) => collector.add_fn_decl(fn_decl, true),
                    Decl::Var(var_decl) => collector.add_var_decl(var_decl, true),
                    _ => (),
                },
                ModuleItem::Stmt(Stmt::Expr(expr_stmt)) => {
                    let Some(assign_expr) = expr_stmt.expr.as_assign() else {
                        continue;
                    };
                    let Some(member_expr) = assign_expr
                        .left
                        .as_simple()
                        .and_then(|simple| simple.as_member())
                    else {
                        continue;
                    };

                    if let Some(ident) = member_expr.obj.as_ident() {
                        if collector.contains(&ident.sym)
                            && !assignable_properties_for_namespace
                                .get(ident.sym.as_str())
                                .map_or(false, |properties| {
                                    member_expr
                                        .prop
                                        .static_name()
                                        .map_or(false, |name| properties.contains(name))
                                })
                        {
                            self.function_with_assigning_properties(member_expr.span);
                        }
                    }
                }
                _ => (),
            }
        }
    }

    fn report_error_for_expando_function_in_script(&mut self, stmts: &[Stmt]) {
        let used_refs = self.used_refs.clone();
        let mut collector = ExpandoFunctionCollector::new(&used_refs);
        for stmt in stmts {
            match stmt {
                Stmt::Decl(decl) => match decl {
                    Decl::Fn(fn_decl) => collector.add_fn_decl(fn_decl, false),
                    Decl::Var(var_decl) => collector.add_var_decl(var_decl, false),
                    _ => (),
                },
                Stmt::Expr(expr_stmt) => {
                    let Some(assign_expr) = expr_stmt.expr.as_assign() else {
                        continue;
                    };
                    let Some(member_expr) = assign_expr
                        .left
                        .as_simple()
                        .and_then(|simple| simple.as_member())
                    else {
                        continue;
                    };

                    if let Some(ident) = member_expr.obj.as_ident() {
                        if collector.contains(&ident.sym) {
                            self.function_with_assigning_properties(member_expr.span);
                        }
                    }
                }
                _ => (),
            }
        }
    }

    fn strip_export(&self, items: &mut Vec<ModuleItem>) {
        for item in items {
            if let ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl)) = item {
                *item = ModuleItem::Stmt(Stmt::Decl(export_decl.decl.clone()));
            }
        }
    }

    fn remove_ununsed(&self, items: &mut Vec<ModuleItem>, in_global_or_lit_module: bool) {
        let used_refs = &self.used_refs;
        items.retain_mut(|node| match node {
            ModuleItem::Stmt(Stmt::Decl(decl)) if !in_global_or_lit_module => match decl {
                Decl::Class(class_decl) => used_refs.contains(&class_decl.ident.to_id()),
                Decl::Fn(fn_decl) => used_refs.contains(&fn_decl.ident.to_id()),
                Decl::Var(var_decl) => {
                    var_decl.decls.retain(|decl| {
                        if let Some(ident) = decl.name.as_ident() {
                            used_refs.contains(&ident.to_id())
                        } else {
                            false
                        }
                    });
                    !var_decl.decls.is_empty()
                }
                Decl::Using(using_decl) => {
                    using_decl.decls.retain(|decl| {
                        if let Some(ident) = decl.name.as_ident() {
                            used_refs.contains(&ident.to_id())
                        } else {
                            false
                        }
                    });
                    !using_decl.decls.is_empty()
                }
                Decl::TsInterface(ts_interface_decl) => {
                    used_refs.contains(&ts_interface_decl.id.to_id())
                }
                Decl::TsTypeAlias(ts_type_alias_decl) => {
                    used_refs.contains(&ts_type_alias_decl.id.to_id())
                }
                Decl::TsEnum(ts_enum) => used_refs.contains(&ts_enum.id.to_id()),
                Decl::TsModule(ts_module_decl) => {
                    ts_module_decl.global
                        || ts_module_decl.id.is_str()
                        || ts_module_decl
                            .id
                            .as_ident()
                            .map_or(true, |ident| used_refs.contains(&ident.to_id()))
                }
            },
            ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) => {
                if import_decl.specifiers.is_empty() {
                    return true;
                }

                import_decl.specifiers.retain(|specifier| match specifier {
                    ImportSpecifier::Named(specifier) => {
                        used_refs.contains(&specifier.local.to_id())
                    }
                    ImportSpecifier::Default(specifier) => {
                        used_refs.contains(&specifier.local.to_id())
                    }
                    ImportSpecifier::Namespace(specifier) => {
                        used_refs.contains(&specifier.local.to_id())
                    }
                });

                !import_decl.specifiers.is_empty()
            }
            ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(ts_import_equals)) => {
                used_refs.contains(&ts_import_equals.id.to_id())
            }
            _ => true,
        });
    }

    pub fn has_internal_annotation(&self, pos: BytePos) -> bool {
        if let Some(internal_annotations) = &self.internal_annotations {
            return internal_annotations.contains(&pos);
        }
        false
    }

    pub fn get_internal_annotations(comments: &SingleThreadedComments) -> FxHashSet<BytePos> {
        let mut internal_annotations = FxHashSet::default();
        let (leading, _) = comments.borrow_all();
        for (pos, comment) in leading.iter() {
            let has_internal_annotation = comment
                .iter()
                .any(|comment| comment.text.contains("@internal"));
            if has_internal_annotation {
                internal_annotations.insert(*pos);
            }
        }
        internal_annotations
    }

    fn gen_unique_name(&mut self, name: &str) -> Atom {
        self.id_counter += 1;
        format!("{name}_{}", self.id_counter).into()
    }
}
