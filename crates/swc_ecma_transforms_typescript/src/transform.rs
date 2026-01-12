//! TypeScript transform with minimal visitor usage.
//!
//! This module provides a single-pass TypeScript transform that:
//! - Strips type annotations
//! - Converts enums to JavaScript
//! - Converts namespaces to JavaScript
//! - Handles import/export type statements
//! - Handles parameter properties

use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::Atom;
use swc_common::{util::take::Take, Mark, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

use crate::{
    config::{Config, ImportsNotUsedAsValues, TsImportExportAssignConfig, TsxConfig},
    enums::transform_enum,
    imports::{ImportInfo, ImportKind},
    namespace::transform_namespace,
};

/// Creates a TypeScript transform pass.
pub fn typescript(
    config: Config,
    unresolved_mark: Mark,
    top_level_mark: Mark,
) -> impl Pass + VisitMut {
    visit_mut_pass(TypeScript {
        config,
        unresolved_mark,
        top_level_mark,
        tsx_config: None,
    })
}

/// Creates a TypeScript transform pass with TSX support.
pub fn tsx<C>(
    _cm: swc_common::sync::Lrc<swc_common::SourceMap>,
    config: Config,
    tsx_config: TsxConfig,
    _comments: C,
    unresolved_mark: Mark,
    top_level_mark: Mark,
) -> impl Pass + VisitMut
where
    C: swc_common::comments::Comments,
{
    visit_mut_pass(TypeScript {
        config,
        unresolved_mark,
        top_level_mark,
        tsx_config: Some(tsx_config),
    })
}

/// The main TypeScript transform.
pub struct TypeScript {
    pub config: Config,
    pub unresolved_mark: Mark,
    pub top_level_mark: Mark,
    pub tsx_config: Option<TsxConfig>,
}

/// State for collecting import information.
struct TransformState {
    /// Set of imported identifiers and their usage info.
    imports: FxHashMap<Id, ImportInfo>,
    /// Set of identifiers that are used as values (not just types).
    value_usages: FxHashSet<Id>,
    /// Whether we're in a type-only position.
    in_type: bool,
    /// Enum values for inlining.
    enum_values: FxHashMap<Id, FxHashMap<Atom, TsLit>>,
    /// Whether the module has any non-type exports.
    has_value_export: bool,
    /// Whether the module has any non-type imports.
    has_value_import: bool,
    /// Was the module originally an ES module?
    was_module: bool,
    /// Set of identifiers that have been exported (to avoid duplicate exports
    /// for namespace augmentations).
    exported_ids: FxHashSet<Id>,
    /// Set of locally declared identifiers (to detect import shadowing).
    local_decls: FxHashSet<Id>,
}

impl Default for TransformState {
    fn default() -> Self {
        Self {
            imports: Default::default(),
            value_usages: Default::default(),
            in_type: false,
            enum_values: Default::default(),
            has_value_export: false,
            has_value_import: false,
            was_module: false,
            exported_ids: Default::default(),
            local_decls: Default::default(),
        }
    }
}

impl VisitMut for TypeScript {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, n: &mut Module) {
        let mut state = TransformState::default();
        state.was_module = !n.body.is_empty()
            && n.body
                .iter()
                .any(|item| matches!(item, ModuleItem::ModuleDecl(_)));

        // First pass: collect information about imports, local declarations, and usage
        self.collect_local_decls(n, &mut state);
        self.collect_imports(n, &mut state);
        self.collect_value_usages(n, &mut state);

        // Second pass: transform the module
        let mut new_body = Vec::with_capacity(n.body.len());
        for item in n.body.drain(..) {
            self.transform_module_item(item, &mut new_body, &mut state);
        }

        // If we removed all imports/exports but the module was originally an ES module,
        // add an empty export to preserve module semantics
        if !self.config.no_empty_export
            && state.was_module
            && !new_body
                .iter()
                .any(|item| matches!(item, ModuleItem::ModuleDecl(_)))
        {
            new_body.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(
                NamedExport {
                    span: DUMMY_SP,
                    specifiers: vec![],
                    src: None,
                    type_only: false,
                    with: None,
                },
            )));
        }

        n.body = new_body;

        // Final pass: strip remaining type annotations
        n.visit_mut_children_with(&mut TypeStripper {
            config: &self.config,
        });
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        let mut new_body = Vec::with_capacity(n.body.len());
        for stmt in n.body.drain(..) {
            self.transform_stmt(stmt, &mut new_body);
        }
        n.body = new_body;

        n.visit_mut_children_with(&mut TypeStripper {
            config: &self.config,
        });
    }
}

impl TypeScript {
    /// Collects locally declared identifiers (to detect import shadowing).
    fn collect_local_decls(&self, n: &Module, state: &mut TransformState) {
        for item in &n.body {
            match item {
                ModuleItem::Stmt(stmt) => {
                    self.collect_local_decls_from_stmt(stmt, state);
                }
                ModuleItem::ModuleDecl(decl) => match decl {
                    ModuleDecl::ExportDecl(export) => {
                        self.collect_local_decls_from_decl(&export.decl, state);
                    }
                    ModuleDecl::ExportDefaultExpr(_)
                    | ModuleDecl::ExportDefaultDecl(_)
                    | ModuleDecl::ExportNamed(_)
                    | ModuleDecl::ExportAll(_)
                    | ModuleDecl::TsExportAssignment(_)
                    | ModuleDecl::TsNamespaceExport(_)
                    | ModuleDecl::Import(_)
                    | ModuleDecl::TsImportEquals(_) => {}
                },
            }
        }
    }

    fn collect_local_decls_from_stmt(&self, stmt: &Stmt, state: &mut TransformState) {
        match stmt {
            Stmt::Decl(decl) => self.collect_local_decls_from_decl(decl, state),
            _ => {}
        }
    }

    fn collect_local_decls_from_decl(&self, decl: &Decl, state: &mut TransformState) {
        match decl {
            Decl::Class(c) => {
                state.local_decls.insert(c.ident.to_id());
            }
            Decl::Fn(f) => {
                state.local_decls.insert(f.ident.to_id());
            }
            Decl::Var(v) => {
                for decl in &v.decls {
                    self.collect_local_decls_from_pat(&decl.name, state);
                }
            }
            Decl::Using(u) => {
                for decl in &u.decls {
                    self.collect_local_decls_from_pat(&decl.name, state);
                }
            }
            Decl::TsInterface(_) | Decl::TsTypeAlias(_) => {}
            Decl::TsEnum(e) => {
                state.local_decls.insert(e.id.to_id());
            }
            Decl::TsModule(ns) => {
                if let TsModuleName::Ident(id) = &ns.id {
                    state.local_decls.insert(id.to_id());
                }
            }
        }
    }

    fn collect_local_decls_from_pat(&self, pat: &Pat, state: &mut TransformState) {
        match pat {
            Pat::Ident(i) => {
                state.local_decls.insert(i.to_id());
            }
            Pat::Array(a) => {
                for elem in a.elems.iter().flatten() {
                    self.collect_local_decls_from_pat(elem, state);
                }
            }
            Pat::Object(o) => {
                for prop in &o.props {
                    match prop {
                        ObjectPatProp::KeyValue(kv) => {
                            self.collect_local_decls_from_pat(&kv.value, state);
                        }
                        ObjectPatProp::Assign(a) => {
                            state.local_decls.insert(a.key.to_id());
                        }
                        ObjectPatProp::Rest(r) => {
                            self.collect_local_decls_from_pat(&r.arg, state);
                        }
                    }
                }
            }
            Pat::Rest(r) => {
                self.collect_local_decls_from_pat(&r.arg, state);
            }
            Pat::Assign(a) => {
                self.collect_local_decls_from_pat(&a.left, state);
            }
            Pat::Expr(_) | Pat::Invalid(_) => {}
        }
    }

    /// Collects information about imports.
    fn collect_imports(&self, n: &Module, state: &mut TransformState) {
        for item in &n.body {
            if let ModuleItem::ModuleDecl(decl) = item {
                match decl {
                    ModuleDecl::Import(import) => {
                        if import.type_only {
                            for spec in &import.specifiers {
                                let id = spec.local().to_id();
                                state.imports.insert(
                                    id,
                                    ImportInfo {
                                        kind: ImportKind::TypeOnly,
                                        src: (*import.src).clone(),
                                    },
                                );
                            }
                        } else {
                            for spec in &import.specifiers {
                                let is_type_only = matches!(
                                    spec,
                                    ImportSpecifier::Named(ImportNamedSpecifier {
                                        is_type_only: true,
                                        ..
                                    })
                                );
                                let id = spec.local().to_id();
                                state.imports.insert(
                                    id,
                                    ImportInfo {
                                        kind: if is_type_only {
                                            ImportKind::TypeOnly
                                        } else {
                                            ImportKind::Value
                                        },
                                        src: (*import.src).clone(),
                                    },
                                );
                            }
                        }
                    }
                    ModuleDecl::TsImportEquals(import) => {
                        state.imports.insert(
                            import.id.to_id(),
                            ImportInfo {
                                kind: if import.is_type_only {
                                    ImportKind::TypeOnly
                                } else {
                                    ImportKind::Value
                                },
                                src: Str {
                                    span: DUMMY_SP,
                                    value: "".into(),
                                    raw: None,
                                },
                            },
                        );
                    }
                    _ => {}
                }
            }
        }
    }

    /// Collects value usages of identifiers.
    fn collect_value_usages(&self, n: &Module, state: &mut TransformState) {
        let mut collector = ValueUsageCollector {
            state,
            in_type: false,
        };
        for item in &n.body {
            collector.collect_module_item(item);
        }
    }

    /// Transforms a single module item.
    fn transform_module_item(
        &mut self,
        item: ModuleItem,
        out: &mut Vec<ModuleItem>,
        state: &mut TransformState,
    ) {
        match item {
            ModuleItem::ModuleDecl(decl) => {
                self.transform_module_decl(decl, out, state);
            }
            ModuleItem::Stmt(stmt) => {
                let mut stmts = vec![];
                self.transform_stmt(stmt, &mut stmts);
                out.extend(stmts.into_iter().map(ModuleItem::Stmt));
            }
        }
    }

    /// Transforms module declarations.
    fn transform_module_decl(
        &mut self,
        decl: ModuleDecl,
        out: &mut Vec<ModuleItem>,
        state: &mut TransformState,
    ) {
        match decl {
            // Handle type-only imports
            ModuleDecl::Import(mut import) => {
                if self.config.verbatim_module_syntax {
                    if import.type_only {
                        return;
                    }
                    // Remove type-only and shadowed specifiers
                    import.specifiers.retain(|s| {
                        if matches!(
                            s,
                            ImportSpecifier::Named(ImportNamedSpecifier {
                                is_type_only: true,
                                ..
                            })
                        ) {
                            return false;
                        }
                        // Filter out specifiers shadowed by local declarations
                        let id = s.local().to_id();
                        !state.local_decls.contains(&id)
                    });
                    if !import.specifiers.is_empty() {
                        state.has_value_import = true;
                        out.push(ModuleItem::ModuleDecl(ModuleDecl::Import(import)));
                    }
                } else {
                    // Remove type-only imports
                    if import.type_only {
                        if matches!(
                            self.config.import_not_used_as_values,
                            ImportsNotUsedAsValues::Preserve
                        ) {
                            import.specifiers.clear();
                            out.push(ModuleItem::ModuleDecl(ModuleDecl::Import(import)));
                        }
                        return;
                    }

                    // Filter out type-only, unused, and shadowed specifiers
                    import.specifiers.retain(|s| {
                        if matches!(
                            s,
                            ImportSpecifier::Named(ImportNamedSpecifier {
                                is_type_only: true,
                                ..
                            })
                        ) {
                            return false;
                        }

                        // Filter out specifiers shadowed by local declarations
                        let id = s.local().to_id();
                        if state.local_decls.contains(&id) {
                            return false;
                        }

                        if matches!(
                            self.config.import_not_used_as_values,
                            ImportsNotUsedAsValues::Remove
                        ) {
                            state.value_usages.contains(&id)
                        } else {
                            true
                        }
                    });

                    if import.specifiers.is_empty() {
                        if matches!(
                            self.config.import_not_used_as_values,
                            ImportsNotUsedAsValues::Preserve
                        ) {
                            out.push(ModuleItem::ModuleDecl(ModuleDecl::Import(import)));
                        }
                    } else {
                        state.has_value_import = true;
                        out.push(ModuleItem::ModuleDecl(ModuleDecl::Import(import)));
                    }
                }
            }

            // Handle export declarations
            ModuleDecl::ExportDecl(export) => {
                match export.decl {
                    // Remove type-only declarations
                    Decl::TsInterface(_) | Decl::TsTypeAlias(_) => {}

                    // Transform enums
                    Decl::TsEnum(e) => {
                        let id = e.id.to_id();
                        let (var, _) =
                            transform_enum(&e, self.config.ts_enum_is_mutable, &state.enum_values);

                        // Store enum values for potential inlining
                        if !self.config.ts_enum_is_mutable {
                            if let Some(values) = crate::enums::collect_enum_values(&e) {
                                state.enum_values.insert(e.id.to_id(), values);
                            }
                        }

                        state.has_value_export = true;
                        state.exported_ids.insert(id);
                        out.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                            span: export.span,
                            decl: Decl::Var(Box::new(var)),
                        })));
                    }

                    // Transform namespaces
                    Decl::TsModule(ns) => {
                        if ns.declare || ns.body.is_none() {
                            return;
                        }
                        state.has_value_export = true;
                        let stmts = transform_namespace(&ns, true, &state.enum_values);
                        out.extend(stmts.into_iter().map(ModuleItem::Stmt));
                        // Add `export var ns;` after the IIFE only if not already exported
                        if let TsModuleName::Ident(id) = &ns.id {
                            let ns_id = id.to_id();
                            if !state.exported_ids.contains(&ns_id) {
                                state.exported_ids.insert(ns_id);
                                out.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(
                                    ExportDecl {
                                        span: DUMMY_SP,
                                        decl: Decl::Var(Box::new(VarDecl {
                                            span: DUMMY_SP,
                                            kind: VarDeclKind::Var,
                                            declare: false,
                                            decls: vec![VarDeclarator {
                                                span: DUMMY_SP,
                                                name: Pat::Ident(id.clone().into()),
                                                init: None,
                                                definite: false,
                                            }],
                                            ..Default::default()
                                        })),
                                    },
                                )));
                            }
                        }
                    }

                    // Track exported class/function identifiers
                    Decl::Class(ref c) => {
                        state.has_value_export = true;
                        state.exported_ids.insert(c.ident.to_id());
                        out.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                            span: export.span,
                            decl: export.decl,
                        })));
                    }
                    Decl::Fn(ref f) => {
                        state.has_value_export = true;
                        state.exported_ids.insert(f.ident.to_id());
                        out.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                            span: export.span,
                            decl: export.decl,
                        })));
                    }

                    decl => {
                        state.has_value_export = true;
                        out.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                            span: export.span,
                            decl,
                        })));
                    }
                }
            }

            // Handle named exports
            ModuleDecl::ExportNamed(mut export) => {
                if export.type_only {
                    return;
                }

                // Filter type-only exports
                export.specifiers.retain(|s| {
                    !matches!(
                        s,
                        ExportSpecifier::Named(ExportNamedSpecifier {
                            is_type_only: true,
                            ..
                        })
                    )
                });

                if !export.specifiers.is_empty() {
                    state.has_value_export = true;
                    out.push(ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)));
                }
            }

            // Handle default exports
            ModuleDecl::ExportDefaultDecl(export) => {
                state.has_value_export = true;
                out.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(
                    export,
                )));
            }

            ModuleDecl::ExportDefaultExpr(export) => {
                state.has_value_export = true;
                out.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(
                    export,
                )));
            }

            // Handle export all
            ModuleDecl::ExportAll(export) => {
                if export.type_only {
                    return;
                }
                state.has_value_export = true;
                out.push(ModuleItem::ModuleDecl(ModuleDecl::ExportAll(export)));
            }

            // Handle TS import equals
            ModuleDecl::TsImportEquals(import) => {
                if import.is_type_only {
                    return;
                }
                match self.config.import_export_assign_config {
                    TsImportExportAssignConfig::Classic => {
                        self.transform_import_equals_classic(&import, out, state);
                    }
                    TsImportExportAssignConfig::Preserve => {
                        out.push(ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(import)));
                    }
                    TsImportExportAssignConfig::NodeNext => {
                        self.transform_import_equals_node_next(&import, out, state);
                    }
                    TsImportExportAssignConfig::EsNext => {
                        // Error: import = is not supported in ESNext
                    }
                }
            }

            // Handle TS export assignment
            ModuleDecl::TsExportAssignment(export) => {
                match self.config.import_export_assign_config {
                    TsImportExportAssignConfig::Classic => {
                        // module.exports = expr
                        let stmt = Expr::Assign(AssignExpr {
                            span: export.span,
                            op: op!("="),
                            left: MemberExpr {
                                span: DUMMY_SP,
                                obj: Box::new(Expr::Ident(Ident::new_no_ctxt(
                                    "module".into(),
                                    DUMMY_SP,
                                ))),
                                prop: MemberProp::Ident(IdentName::new("exports".into(), DUMMY_SP)),
                            }
                            .into(),
                            right: export.expr,
                        })
                        .into_stmt();
                        state.has_value_export = true;
                        out.push(ModuleItem::Stmt(stmt));
                    }
                    TsImportExportAssignConfig::Preserve => {
                        out.push(ModuleItem::ModuleDecl(ModuleDecl::TsExportAssignment(
                            export,
                        )));
                    }
                    TsImportExportAssignConfig::NodeNext | TsImportExportAssignConfig::EsNext => {
                        // Error: export = is not supported
                    }
                }
            }

            // Remove TS namespace export declaration
            ModuleDecl::TsNamespaceExport(_) => {}
        }
    }

    /// Transforms statements.
    fn transform_stmt(&mut self, stmt: Stmt, out: &mut Vec<Stmt>) {
        match stmt {
            Stmt::Decl(decl) => match decl {
                // Remove type declarations
                Decl::TsInterface(_) | Decl::TsTypeAlias(_) => {}

                // Transform enums
                Decl::TsEnum(e) => {
                    let state = TransformState::default();
                    let (var, _) =
                        transform_enum(&e, self.config.ts_enum_is_mutable, &state.enum_values);
                    out.push(Stmt::Decl(Decl::Var(Box::new(var))));
                }

                // Transform namespaces
                Decl::TsModule(ns) => {
                    if ns.declare || ns.body.is_none() {
                        return;
                    }
                    let state = TransformState::default();
                    let stmts = transform_namespace(&ns, false, &state.enum_values);
                    out.extend(stmts);
                }

                // Skip declare statements (they have no runtime behavior)
                Decl::Var(v) if v.declare => {}
                Decl::Class(c) if c.declare => {}
                Decl::Fn(f) if f.declare => {}

                decl => {
                    out.push(Stmt::Decl(decl));
                }
            },
            stmt => {
                out.push(stmt);
            }
        }
    }

    /// Transforms import equals in classic mode.
    fn transform_import_equals_classic(
        &self,
        import: &TsImportEqualsDecl,
        out: &mut Vec<ModuleItem>,
        state: &mut TransformState,
    ) {
        match &import.module_ref {
            TsModuleRef::TsExternalModuleRef(external) => {
                // import foo = require("foo") -> var foo = require("foo")
                let var = VarDecl {
                    span: import.span,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(import.id.clone().into()),
                        init: Some(Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: Callee::Expr(Box::new(Expr::Ident(Ident::new_no_ctxt(
                                "require".into(),
                                DUMMY_SP,
                            )))),
                            args: vec![external.expr.clone().as_arg()],
                            ..Default::default()
                        }))),
                        definite: false,
                    }],
                    ..Default::default()
                };
                state.has_value_import = true;
                if import.is_export {
                    out.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                        span: import.span,
                        decl: Decl::Var(Box::new(var)),
                    })));
                } else {
                    out.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(var)))));
                }
            }
            TsModuleRef::TsEntityName(entity) => {
                // import foo = ns.bar -> var foo = ns.bar
                let expr = ts_entity_to_expr(entity.clone());
                let var = VarDecl {
                    span: import.span,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: vec![VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(import.id.clone().into()),
                        init: Some(expr),
                        definite: false,
                    }],
                    ..Default::default()
                };
                state.has_value_import = true;
                if import.is_export {
                    out.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                        span: import.span,
                        decl: Decl::Var(Box::new(var)),
                    })));
                } else {
                    out.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(var)))));
                }
            }
        }
    }

    /// Transforms import equals in NodeNext mode.
    fn transform_import_equals_node_next(
        &self,
        import: &TsImportEqualsDecl,
        out: &mut Vec<ModuleItem>,
        state: &mut TransformState,
    ) {
        if let TsModuleRef::TsExternalModuleRef(external) = &import.module_ref {
            // import { createRequire as _createRequire } from "module"
            // const __require = _createRequire(import.meta.url)
            // const foo = __require("foo")

            let create_require_local = Ident::new_no_ctxt("_createRequire".into(), DUMMY_SP);
            let require_local = Ident::new_no_ctxt("__require".into(), DUMMY_SP);

            // import { createRequire as _createRequire } from "module"
            out.push(ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                span: DUMMY_SP,
                specifiers: vec![ImportSpecifier::Named(ImportNamedSpecifier {
                    span: DUMMY_SP,
                    local: create_require_local.clone(),
                    imported: Some(ModuleExportName::Ident(Ident::new_no_ctxt(
                        "createRequire".into(),
                        DUMMY_SP,
                    ))),
                    is_type_only: false,
                })],
                src: Box::new(Str {
                    span: DUMMY_SP,
                    value: "module".into(),
                    raw: None,
                }),
                type_only: false,
                with: None,
                phase: Default::default(),
            })));

            // const __require = _createRequire(import.meta.url)
            out.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Const,
                declare: false,
                decls: vec![VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(require_local.clone().into()),
                    init: Some(Box::new(Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: Callee::Expr(Box::new(Expr::Ident(create_require_local))),
                        args: vec![Expr::Member(MemberExpr {
                            span: DUMMY_SP,
                            obj: Box::new(Expr::MetaProp(MetaPropExpr {
                                span: DUMMY_SP,
                                kind: MetaPropKind::ImportMeta,
                            })),
                            prop: MemberProp::Ident(IdentName::new("url".into(), DUMMY_SP)),
                        })
                        .as_arg()],
                        ..Default::default()
                    }))),
                    definite: false,
                }],
                ..Default::default()
            })))));

            // const foo = __require("foo")
            let var = VarDecl {
                span: import.span,
                kind: VarDeclKind::Const,
                declare: false,
                decls: vec![VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(import.id.clone().into()),
                    init: Some(Box::new(Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: Callee::Expr(Box::new(Expr::Ident(require_local))),
                        args: vec![external.expr.clone().as_arg()],
                        ..Default::default()
                    }))),
                    definite: false,
                }],
                ..Default::default()
            };

            state.has_value_import = true;
            if import.is_export {
                out.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    span: import.span,
                    decl: Decl::Var(Box::new(var)),
                })));
            } else {
                out.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(var)))));
            }
        }
    }
}

/// Converts a TsEntityName to an expression.
fn ts_entity_to_expr(entity: TsEntityName) -> Box<Expr> {
    match entity {
        TsEntityName::Ident(i) => Box::new(Expr::Ident(i)),
        TsEntityName::TsQualifiedName(q) => Box::new(Expr::Member(MemberExpr {
            span: DUMMY_SP,
            obj: ts_entity_to_expr(q.left),
            prop: MemberProp::Ident(q.right),
        })),
    }
}

/// Collects value usages of identifiers.
struct ValueUsageCollector<'a> {
    state: &'a mut TransformState,
    in_type: bool,
}

impl ValueUsageCollector<'_> {
    fn collect_module_item(&mut self, item: &ModuleItem) {
        match item {
            ModuleItem::ModuleDecl(decl) => self.collect_module_decl(decl),
            ModuleItem::Stmt(stmt) => self.collect_stmt(stmt),
        }
    }

    fn collect_module_decl(&mut self, decl: &ModuleDecl) {
        match decl {
            ModuleDecl::Import(_) => {}
            ModuleDecl::ExportDecl(export) => self.collect_decl(&export.decl),
            ModuleDecl::ExportNamed(export) => {
                if export.src.is_none() {
                    for spec in &export.specifiers {
                        if let ExportSpecifier::Named(named) = spec {
                            if !named.is_type_only {
                                if let ModuleExportName::Ident(id) = &named.orig {
                                    self.state.value_usages.insert(id.to_id());
                                }
                            }
                        }
                    }
                }
            }
            ModuleDecl::ExportDefaultExpr(export) => self.collect_expr(&export.expr),
            ModuleDecl::ExportDefaultDecl(export) => match &export.decl {
                DefaultDecl::Class(c) => self.collect_class(&c.class),
                DefaultDecl::Fn(f) => self.collect_function(&f.function),
                DefaultDecl::TsInterfaceDecl(_) => {}
            },
            ModuleDecl::ExportAll(_) => {}
            ModuleDecl::TsImportEquals(_) => {}
            ModuleDecl::TsExportAssignment(export) => self.collect_expr(&export.expr),
            ModuleDecl::TsNamespaceExport(_) => {}
        }
    }

    fn collect_stmt(&mut self, stmt: &Stmt) {
        match stmt {
            Stmt::Block(s) => {
                for stmt in &s.stmts {
                    self.collect_stmt(stmt);
                }
            }
            Stmt::With(s) => {
                self.collect_expr(&s.obj);
                self.collect_stmt(&s.body);
            }
            Stmt::Return(s) => {
                if let Some(arg) = &s.arg {
                    self.collect_expr(arg);
                }
            }
            Stmt::Labeled(s) => self.collect_stmt(&s.body),
            Stmt::If(s) => {
                self.collect_expr(&s.test);
                self.collect_stmt(&s.cons);
                if let Some(alt) = &s.alt {
                    self.collect_stmt(alt);
                }
            }
            Stmt::Switch(s) => {
                self.collect_expr(&s.discriminant);
                for case in &s.cases {
                    if let Some(test) = &case.test {
                        self.collect_expr(test);
                    }
                    for stmt in &case.cons {
                        self.collect_stmt(stmt);
                    }
                }
            }
            Stmt::Throw(s) => self.collect_expr(&s.arg),
            Stmt::Try(s) => {
                for stmt in &s.block.stmts {
                    self.collect_stmt(stmt);
                }
                if let Some(handler) = &s.handler {
                    if let Some(param) = &handler.param {
                        self.collect_pat(param);
                    }
                    for stmt in &handler.body.stmts {
                        self.collect_stmt(stmt);
                    }
                }
                if let Some(finalizer) = &s.finalizer {
                    for stmt in &finalizer.stmts {
                        self.collect_stmt(stmt);
                    }
                }
            }
            Stmt::While(s) => {
                self.collect_expr(&s.test);
                self.collect_stmt(&s.body);
            }
            Stmt::DoWhile(s) => {
                self.collect_stmt(&s.body);
                self.collect_expr(&s.test);
            }
            Stmt::For(s) => {
                match &s.init {
                    Some(VarDeclOrExpr::VarDecl(v)) => {
                        for decl in &v.decls {
                            if let Some(init) = &decl.init {
                                self.collect_expr(init);
                            }
                        }
                    }
                    Some(VarDeclOrExpr::Expr(e)) => self.collect_expr(e),
                    None => {}
                }
                if let Some(test) = &s.test {
                    self.collect_expr(test);
                }
                if let Some(update) = &s.update {
                    self.collect_expr(update);
                }
                self.collect_stmt(&s.body);
            }
            Stmt::ForIn(s) => {
                match &s.left {
                    ForHead::VarDecl(v) => {
                        for decl in &v.decls {
                            if let Some(init) = &decl.init {
                                self.collect_expr(init);
                            }
                        }
                    }
                    ForHead::UsingDecl(u) => {
                        for decl in &u.decls {
                            if let Some(init) = &decl.init {
                                self.collect_expr(init);
                            }
                        }
                    }
                    ForHead::Pat(p) => self.collect_pat(p),
                }
                self.collect_expr(&s.right);
                self.collect_stmt(&s.body);
            }
            Stmt::ForOf(s) => {
                match &s.left {
                    ForHead::VarDecl(v) => {
                        for decl in &v.decls {
                            if let Some(init) = &decl.init {
                                self.collect_expr(init);
                            }
                        }
                    }
                    ForHead::UsingDecl(u) => {
                        for decl in &u.decls {
                            if let Some(init) = &decl.init {
                                self.collect_expr(init);
                            }
                        }
                    }
                    ForHead::Pat(p) => self.collect_pat(p),
                }
                self.collect_expr(&s.right);
                self.collect_stmt(&s.body);
            }
            Stmt::Decl(d) => self.collect_decl(d),
            Stmt::Expr(s) => self.collect_expr(&s.expr),
            _ => {}
        }
    }

    fn collect_decl(&mut self, decl: &Decl) {
        match decl {
            Decl::Class(c) => self.collect_class(&c.class),
            Decl::Fn(f) => self.collect_function(&f.function),
            Decl::Var(v) => {
                for decl in &v.decls {
                    if let Some(init) = &decl.init {
                        self.collect_expr(init);
                    }
                }
            }
            Decl::Using(u) => {
                for decl in &u.decls {
                    if let Some(init) = &decl.init {
                        self.collect_expr(init);
                    }
                }
            }
            Decl::TsInterface(_) | Decl::TsTypeAlias(_) | Decl::TsEnum(_) | Decl::TsModule(_) => {}
        }
    }

    fn collect_expr(&mut self, expr: &Expr) {
        if self.in_type {
            return;
        }

        match expr {
            Expr::Ident(i) => {
                self.state.value_usages.insert(i.to_id());
            }
            Expr::This(_) | Expr::Lit(_) | Expr::PrivateName(_) | Expr::MetaProp(_) => {}
            Expr::Array(a) => {
                for elem in a.elems.iter().flatten() {
                    self.collect_expr(&elem.expr);
                }
            }
            Expr::Object(o) => {
                for prop in &o.props {
                    match prop {
                        PropOrSpread::Spread(s) => self.collect_expr(&s.expr),
                        PropOrSpread::Prop(p) => match &**p {
                            Prop::Shorthand(i) => {
                                self.state.value_usages.insert(i.to_id());
                            }
                            Prop::KeyValue(kv) => {
                                self.collect_prop_name(&kv.key);
                                self.collect_expr(&kv.value);
                            }
                            Prop::Assign(a) => self.collect_expr(&a.value),
                            Prop::Getter(g) => {
                                self.collect_prop_name(&g.key);
                                if let Some(body) = &g.body {
                                    for stmt in &body.stmts {
                                        self.collect_stmt(stmt);
                                    }
                                }
                            }
                            Prop::Setter(s) => {
                                self.collect_prop_name(&s.key);
                                self.collect_pat(&s.param);
                                if let Some(body) = &s.body {
                                    for stmt in &body.stmts {
                                        self.collect_stmt(stmt);
                                    }
                                }
                            }
                            Prop::Method(m) => {
                                self.collect_prop_name(&m.key);
                                self.collect_function(&m.function);
                            }
                        },
                    }
                }
            }
            Expr::Fn(f) => self.collect_function(&f.function),
            Expr::Unary(u) => self.collect_expr(&u.arg),
            Expr::Update(u) => self.collect_expr(&u.arg),
            Expr::Bin(b) => {
                self.collect_expr(&b.left);
                self.collect_expr(&b.right);
            }
            Expr::Assign(a) => {
                match &a.left {
                    AssignTarget::Simple(s) => match s {
                        SimpleAssignTarget::Ident(i) => {
                            self.state.value_usages.insert(i.to_id());
                        }
                        SimpleAssignTarget::Member(m) => self.collect_member_expr(m),
                        SimpleAssignTarget::SuperProp(s) => {
                            if let SuperProp::Computed(c) = &s.prop {
                                self.collect_expr(&c.expr);
                            }
                        }
                        SimpleAssignTarget::Paren(p) => self.collect_expr(&p.expr),
                        SimpleAssignTarget::OptChain(o) => self.collect_opt_chain(o),
                        SimpleAssignTarget::TsAs(a) => self.collect_expr(&a.expr),
                        SimpleAssignTarget::TsSatisfies(s) => self.collect_expr(&s.expr),
                        SimpleAssignTarget::TsNonNull(n) => self.collect_expr(&n.expr),
                        SimpleAssignTarget::TsTypeAssertion(a) => self.collect_expr(&a.expr),
                        SimpleAssignTarget::TsInstantiation(i) => self.collect_expr(&i.expr),
                        SimpleAssignTarget::Invalid(_) => {}
                    },
                    AssignTarget::Pat(p) => match p {
                        AssignTargetPat::Array(a) => {
                            for elem in a.elems.iter().flatten() {
                                self.collect_pat(elem);
                            }
                        }
                        AssignTargetPat::Object(o) => {
                            for prop in &o.props {
                                match prop {
                                    ObjectPatProp::KeyValue(kv) => {
                                        self.collect_prop_name(&kv.key);
                                        self.collect_pat(&kv.value);
                                    }
                                    ObjectPatProp::Assign(a) => {
                                        if let Some(value) = &a.value {
                                            self.collect_expr(value);
                                        }
                                    }
                                    ObjectPatProp::Rest(r) => self.collect_pat(&r.arg),
                                }
                            }
                        }
                        AssignTargetPat::Invalid(_) => {}
                    },
                }
                self.collect_expr(&a.right);
            }
            Expr::Member(m) => self.collect_member_expr(m),
            Expr::SuperProp(s) => {
                if let SuperProp::Computed(c) = &s.prop {
                    self.collect_expr(&c.expr);
                }
            }
            Expr::Cond(c) => {
                self.collect_expr(&c.test);
                self.collect_expr(&c.cons);
                self.collect_expr(&c.alt);
            }
            Expr::Call(c) => {
                match &c.callee {
                    Callee::Super(_) | Callee::Import(_) => {}
                    Callee::Expr(e) => self.collect_expr(e),
                }
                for arg in &c.args {
                    self.collect_expr(&arg.expr);
                }
            }
            Expr::New(n) => {
                self.collect_expr(&n.callee);
                if let Some(args) = &n.args {
                    for arg in args {
                        self.collect_expr(&arg.expr);
                    }
                }
            }
            Expr::Seq(s) => {
                for expr in &s.exprs {
                    self.collect_expr(expr);
                }
            }
            Expr::Tpl(t) => {
                for expr in &t.exprs {
                    self.collect_expr(expr);
                }
            }
            Expr::TaggedTpl(t) => {
                self.collect_expr(&t.tag);
                for expr in &t.tpl.exprs {
                    self.collect_expr(expr);
                }
            }
            Expr::Arrow(a) => {
                for param in &a.params {
                    self.collect_pat(param);
                }
                match &*a.body {
                    BlockStmtOrExpr::BlockStmt(b) => {
                        for stmt in &b.stmts {
                            self.collect_stmt(stmt);
                        }
                    }
                    BlockStmtOrExpr::Expr(e) => self.collect_expr(e),
                }
            }
            Expr::Class(c) => self.collect_class(&c.class),
            Expr::Yield(y) => {
                if let Some(arg) = &y.arg {
                    self.collect_expr(arg);
                }
            }
            Expr::Await(a) => self.collect_expr(&a.arg),
            Expr::Paren(p) => self.collect_expr(&p.expr),
            Expr::JSXMember(j) => self.collect_jsx_obj(&j.obj),
            Expr::JSXNamespacedName(_) => {}
            Expr::JSXEmpty(_) => {}
            Expr::JSXElement(e) => self.collect_jsx_element(e),
            Expr::JSXFragment(f) => {
                for child in &f.children {
                    self.collect_jsx_child(child);
                }
            }
            Expr::TsTypeAssertion(a) => self.collect_expr(&a.expr),
            Expr::TsConstAssertion(a) => self.collect_expr(&a.expr),
            Expr::TsNonNull(n) => self.collect_expr(&n.expr),
            Expr::TsAs(a) => self.collect_expr(&a.expr),
            Expr::TsInstantiation(i) => self.collect_expr(&i.expr),
            Expr::TsSatisfies(s) => self.collect_expr(&s.expr),
            Expr::OptChain(o) => self.collect_opt_chain(o),
            Expr::Invalid(_) => {}
        }
    }

    fn collect_jsx_obj(&mut self, obj: &JSXObject) {
        match obj {
            JSXObject::JSXMemberExpr(m) => self.collect_jsx_obj(&m.obj),
            JSXObject::Ident(i) => {
                self.state.value_usages.insert(i.to_id());
            }
        }
    }

    fn collect_jsx_element(&mut self, elem: &JSXElement) {
        self.collect_jsx_element_name(&elem.opening.name);
        for attr in &elem.opening.attrs {
            match attr {
                JSXAttrOrSpread::JSXAttr(a) => {
                    if let Some(value) = &a.value {
                        match value {
                            JSXAttrValue::Str(_) => {}
                            JSXAttrValue::JSXExprContainer(c) => {
                                if let JSXExpr::Expr(e) = &c.expr {
                                    self.collect_expr(e);
                                }
                            }
                            JSXAttrValue::JSXElement(e) => self.collect_jsx_element(e),
                            JSXAttrValue::JSXFragment(f) => {
                                for child in &f.children {
                                    self.collect_jsx_child(child);
                                }
                            }
                        }
                    }
                }
                JSXAttrOrSpread::SpreadElement(s) => self.collect_expr(&s.expr),
            }
        }
        for child in &elem.children {
            self.collect_jsx_child(child);
        }
    }

    fn collect_jsx_element_name(&mut self, name: &JSXElementName) {
        match name {
            JSXElementName::Ident(i) => {
                // Only treat as value if it starts with uppercase
                if i.sym.chars().next().map_or(false, |c| c.is_uppercase()) {
                    self.state.value_usages.insert(i.to_id());
                }
            }
            JSXElementName::JSXMemberExpr(m) => self.collect_jsx_obj(&m.obj),
            JSXElementName::JSXNamespacedName(_) => {}
        }
    }

    fn collect_jsx_child(&mut self, child: &JSXElementChild) {
        match child {
            JSXElementChild::JSXText(_) => {}
            JSXElementChild::JSXExprContainer(c) => {
                if let JSXExpr::Expr(e) = &c.expr {
                    self.collect_expr(e);
                }
            }
            JSXElementChild::JSXSpreadChild(s) => self.collect_expr(&s.expr),
            JSXElementChild::JSXElement(e) => self.collect_jsx_element(e),
            JSXElementChild::JSXFragment(f) => {
                for child in &f.children {
                    self.collect_jsx_child(child);
                }
            }
        }
    }

    fn collect_opt_chain(&mut self, opt: &OptChainExpr) {
        match &*opt.base {
            OptChainBase::Member(m) => self.collect_member_expr(m),
            OptChainBase::Call(c) => {
                self.collect_expr(&c.callee);
                for arg in &c.args {
                    self.collect_expr(&arg.expr);
                }
            }
        }
    }

    fn collect_member_expr(&mut self, m: &MemberExpr) {
        self.collect_expr(&m.obj);
        if let MemberProp::Computed(c) = &m.prop {
            self.collect_expr(&c.expr);
        }
    }

    fn collect_prop_name(&mut self, name: &PropName) {
        if let PropName::Computed(c) = name {
            self.collect_expr(&c.expr);
        }
    }

    fn collect_pat(&mut self, pat: &Pat) {
        match pat {
            Pat::Ident(_) => {}
            Pat::Array(a) => {
                for elem in a.elems.iter().flatten() {
                    self.collect_pat(elem);
                }
            }
            Pat::Rest(r) => self.collect_pat(&r.arg),
            Pat::Object(o) => {
                for prop in &o.props {
                    match prop {
                        ObjectPatProp::KeyValue(kv) => {
                            self.collect_prop_name(&kv.key);
                            self.collect_pat(&kv.value);
                        }
                        ObjectPatProp::Assign(a) => {
                            if let Some(value) = &a.value {
                                self.collect_expr(value);
                            }
                        }
                        ObjectPatProp::Rest(r) => self.collect_pat(&r.arg),
                    }
                }
            }
            Pat::Assign(a) => {
                self.collect_pat(&a.left);
                self.collect_expr(&a.right);
            }
            Pat::Expr(e) => self.collect_expr(e),
            Pat::Invalid(_) => {}
        }
    }

    fn collect_function(&mut self, f: &Function) {
        for param in &f.params {
            self.collect_pat(&param.pat);
        }
        if let Some(body) = &f.body {
            for stmt in &body.stmts {
                self.collect_stmt(stmt);
            }
        }
    }

    fn collect_class(&mut self, c: &Class) {
        if let Some(super_class) = &c.super_class {
            self.collect_expr(super_class);
        }
        for member in &c.body {
            match member {
                ClassMember::Constructor(c) => {
                    if let Some(body) = &c.body {
                        for stmt in &body.stmts {
                            self.collect_stmt(stmt);
                        }
                    }
                }
                ClassMember::Method(m) => self.collect_function(&m.function),
                ClassMember::PrivateMethod(m) => self.collect_function(&m.function),
                ClassMember::ClassProp(p) => {
                    if let Some(value) = &p.value {
                        self.collect_expr(value);
                    }
                }
                ClassMember::PrivateProp(p) => {
                    if let Some(value) = &p.value {
                        self.collect_expr(value);
                    }
                }
                ClassMember::StaticBlock(s) => {
                    for stmt in &s.body.stmts {
                        self.collect_stmt(stmt);
                    }
                }
                ClassMember::TsIndexSignature(_)
                | ClassMember::AutoAccessor(_)
                | ClassMember::Empty(_) => {}
            }
        }
    }
}

/// Strips remaining TypeScript type annotations.
struct TypeStripper<'a> {
    config: &'a Config,
}

impl VisitMut for TypeStripper<'_> {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        n.visit_mut_children_with(self);
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        n.visit_mut_children_with(self);
    }

    fn visit_mut_class(&mut self, n: &mut Class) {
        // Remove type parameters
        n.type_params = None;
        n.super_type_params = None;
        n.implements = vec![];

        // Process class members
        n.body
            .retain(|m| !matches!(m, ClassMember::TsIndexSignature(_)));

        // Handle parameter properties in constructor
        for member in &mut n.body {
            if let ClassMember::Constructor(c) = member {
                self.transform_constructor(c);
            }
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_class_members(&mut self, n: &mut Vec<ClassMember>) {
        // Remove:
        // - Index signatures
        // - Abstract members
        // - Method/constructor overloads (signatures without bodies)
        // - Declare properties
        n.retain(|m| {
            match m {
                ClassMember::TsIndexSignature(_) => false,
                ClassMember::Method(ClassMethod {
                    is_abstract: true, ..
                }) => false,
                ClassMember::ClassProp(ClassProp {
                    is_abstract: true, ..
                }) => false,
                // Remove method overloads (no body)
                ClassMember::Method(ClassMethod { function, .. }) if function.body.is_none() => {
                    false
                }
                // Remove constructor overloads (no body)
                ClassMember::Constructor(Constructor { body: None, .. }) => false,
                // Remove declare properties
                ClassMember::ClassProp(ClassProp { declare: true, .. }) => false,
                _ => true,
            }
        });

        n.visit_mut_children_with(self);
    }

    fn visit_mut_class_prop(&mut self, n: &mut ClassProp) {
        // Strip TypeScript-only fields
        n.accessibility = None;
        n.is_abstract = false;
        n.is_optional = false;
        n.is_override = false;
        n.readonly = false;
        n.type_ann = None;
        n.declare = false;
        n.definite = false;
        n.visit_mut_children_with(self);
    }

    fn visit_mut_private_prop(&mut self, n: &mut PrivateProp) {
        // Strip TypeScript-only fields
        n.accessibility = None;
        n.is_optional = false;
        n.is_override = false;
        n.readonly = false;
        n.type_ann = None;
        n.definite = false;
        n.visit_mut_children_with(self);
    }

    fn visit_mut_private_method(&mut self, n: &mut PrivateMethod) {
        // Strip TypeScript-only fields
        n.accessibility = None;
        n.is_abstract = false;
        n.is_optional = false;
        n.is_override = false;
        n.visit_mut_children_with(self);
    }

    fn visit_mut_class_method(&mut self, n: &mut ClassMethod) {
        // Strip TypeScript-only fields
        n.accessibility = None;
        n.is_abstract = false;
        n.is_optional = false;
        n.is_override = false;
        n.visit_mut_children_with(self);
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        n.type_params = None;
        n.return_type = None;

        // Remove parameter type annotations
        for param in &mut n.params {
            param.pat.visit_mut_with(self);
        }

        if let Some(body) = &mut n.body {
            body.visit_mut_with(self);
        }
    }

    fn visit_mut_arrow_expr(&mut self, n: &mut ArrowExpr) {
        n.type_params = None;
        n.return_type = None;

        for param in &mut n.params {
            param.visit_mut_with(self);
        }
        n.body.visit_mut_with(self);
    }

    fn visit_mut_pat(&mut self, n: &mut Pat) {
        match n {
            Pat::Ident(i) => {
                i.type_ann = None;
            }
            Pat::Array(a) => {
                a.type_ann = None;
            }
            Pat::Object(o) => {
                o.type_ann = None;
            }
            Pat::Rest(r) => {
                r.type_ann = None;
            }
            Pat::Assign(a) => {
                a.left.visit_mut_with(self);
                a.right.visit_mut_with(self);
            }
            _ => {}
        }
        n.visit_mut_children_with(self);
    }

    fn visit_mut_var_declarator(&mut self, n: &mut VarDeclarator) {
        n.definite = false;
        n.visit_mut_children_with(self);
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        match n {
            // Remove type assertions
            Expr::TsTypeAssertion(a) => {
                *n = *Take::take(&mut a.expr);
                n.visit_mut_with(self);
            }
            Expr::TsAs(a) => {
                *n = *Take::take(&mut a.expr);
                n.visit_mut_with(self);
            }
            Expr::TsConstAssertion(a) => {
                *n = *Take::take(&mut a.expr);
                n.visit_mut_with(self);
            }
            Expr::TsNonNull(a) => {
                *n = *Take::take(&mut a.expr);
                n.visit_mut_with(self);
            }
            Expr::TsSatisfies(a) => {
                *n = *Take::take(&mut a.expr);
                n.visit_mut_with(self);
            }
            Expr::TsInstantiation(a) => {
                *n = *Take::take(&mut a.expr);
                n.visit_mut_with(self);
            }
            _ => {
                n.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_call_expr(&mut self, n: &mut CallExpr) {
        n.type_args = None;
        n.visit_mut_children_with(self);
    }

    fn visit_mut_new_expr(&mut self, n: &mut NewExpr) {
        n.type_args = None;
        n.visit_mut_children_with(self);
    }

    fn visit_mut_tagged_tpl(&mut self, n: &mut TaggedTpl) {
        n.type_params = None;
        n.visit_mut_children_with(self);
    }

    fn visit_mut_opt_call(&mut self, n: &mut OptCall) {
        n.type_args = None;
        n.visit_mut_children_with(self);
    }
}

impl TypeStripper<'_> {
    fn transform_constructor(&mut self, c: &mut Constructor) {
        // Collect parameter properties
        let mut prop_stmts: Vec<Stmt> = vec![];

        for param in &mut c.params {
            if let ParamOrTsParamProp::TsParamProp(prop) = param {
                let (name, init) = match &prop.param {
                    TsParamPropParam::Ident(i) => (
                        PropName::Ident(i.id.clone().into()),
                        Expr::Ident(i.id.clone()),
                    ),
                    TsParamPropParam::Assign(a) => match &*a.left {
                        Pat::Ident(i) => (
                            PropName::Ident(i.id.clone().into()),
                            Expr::Ident(i.id.clone()),
                        ),
                        _ => continue,
                    },
                };

                let stmt = crate::utils::assign_value_to_this_prop(name, init).into_stmt();
                prop_stmts.push(stmt);
            }
        }

        // Convert params to regular params
        let new_params: Vec<ParamOrTsParamProp> = c
            .params
            .drain(..)
            .map(|p| match p {
                ParamOrTsParamProp::Param(p) => ParamOrTsParamProp::Param(p),
                ParamOrTsParamProp::TsParamProp(prop) => {
                    let pat = match prop.param {
                        TsParamPropParam::Ident(i) => Pat::Ident(i),
                        TsParamPropParam::Assign(a) => Pat::Assign(a),
                    };
                    ParamOrTsParamProp::Param(Param {
                        span: prop.span,
                        decorators: prop.decorators,
                        pat,
                    })
                }
            })
            .collect();
        c.params = new_params;

        // Insert property initializations at the beginning of constructor body (after
        // super call if present)
        if !prop_stmts.is_empty() {
            if let Some(body) = &mut c.body {
                // Find super call position
                let super_pos = body.stmts.iter().position(|s| {
                    if let Stmt::Expr(e) = s {
                        if let Expr::Call(c) = &*e.expr {
                            return matches!(c.callee, Callee::Super(_));
                        }
                    }
                    false
                });

                let insert_pos = super_pos.map_or(0, |p| p + 1);
                for (i, stmt) in prop_stmts.into_iter().enumerate() {
                    body.stmts.insert(insert_pos + i, stmt);
                }
            }
        }
    }
}
