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
use swc_common::{comments::Comments, util::take::Take, Mark, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{constructor::inject_after_super, ExprFactory};
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
        jsx_pragma_ids: Default::default(),
    })
}

/// Creates a TypeScript transform pass with TSX support.
pub fn tsx<C>(
    _cm: swc_common::sync::Lrc<swc_common::SourceMap>,
    config: Config,
    tsx_config: TsxConfig,
    comments: C,
    unresolved_mark: Mark,
    top_level_mark: Mark,
) -> impl Pass + VisitMut
where
    C: Comments,
{
    visit_mut_pass(TypeScriptTsx {
        inner: TypeScript {
            config,
            unresolved_mark,
            top_level_mark,
            tsx_config: Some(tsx_config),
            jsx_pragma_ids: Default::default(),
        },
        comments,
    })
}

/// TypeScript transform with TSX support and comments.
struct TypeScriptTsx<C>
where
    C: Comments,
{
    inner: TypeScript,
    comments: C,
}

impl<C> TypeScriptTsx<C>
where
    C: Comments,
{
    /// Parse JSX pragma from comments and extract the first identifier.
    fn parse_jsx_pragma_ids(
        &self,
        module_span: swc_common::Span,
        first_item_span: Option<swc_common::Span>,
    ) -> FxHashSet<Atom> {
        let mut pragma_ids = FxHashSet::default();

        // Try to get from TsxConfig first
        if let Some(tsx_config) = &self.inner.tsx_config {
            if let Some(pragma) = &tsx_config.pragma {
                if let Some(first_id) = pragma.split('.').next() {
                    pragma_ids.insert(Atom::new(first_id));
                }
            }
            if let Some(pragma_frag) = &tsx_config.pragma_frag {
                if let Some(first_id) = pragma_frag.split('.').next() {
                    pragma_ids.insert(Atom::new(first_id));
                }
            }
        }

        // Parse from leading comments (at module start and first item)
        let spans_to_check = [Some(module_span.lo), first_item_span.map(|s| s.lo)];
        for span_lo in spans_to_check.into_iter().flatten() {
            if let Some(comments) = self.comments.get_leading(span_lo) {
                for comment in &comments {
                    self.parse_pragma_from_comment(&comment.text, &mut pragma_ids);
                }
            }
        }

        pragma_ids
    }

    /// Parse pragma identifiers from a comment text.
    fn parse_pragma_from_comment(&self, text: &str, pragma_ids: &mut FxHashSet<Atom>) {
        for line in text.lines() {
            let line = line.trim();
            // Handle JSDoc-style comments where lines start with *
            let line = if line.starts_with('*') {
                line[1..].trim()
            } else {
                line
            };

            if line.starts_with("@jsx ") {
                let pragma = line[5..].trim();
                if let Some(first_id) = pragma.split('.').next() {
                    let first_id = first_id.trim();
                    if !first_id.is_empty()
                        && first_id
                            .chars()
                            .next()
                            .map_or(false, |c| c.is_ascii_alphabetic() || c == '_' || c == '$')
                    {
                        pragma_ids.insert(Atom::new(first_id));
                    }
                }
            } else if line.starts_with("@jsxFrag ") {
                let pragma_frag = line[9..].trim();
                if let Some(first_id) = pragma_frag.split('.').next() {
                    let first_id = first_id.trim();
                    if !first_id.is_empty()
                        && first_id
                            .chars()
                            .next()
                            .map_or(false, |c| c.is_ascii_alphabetic() || c == '_' || c == '$')
                    {
                        pragma_ids.insert(Atom::new(first_id));
                    }
                }
            }
        }
    }
}

impl<C> VisitMut for TypeScriptTsx<C>
where
    C: Comments,
{
    fn visit_mut_module(&mut self, n: &mut Module) {
        // Parse JSX pragma identifiers from comments
        let first_item_span = n.body.first().map(|item| item.span());
        self.inner.jsx_pragma_ids = self.parse_jsx_pragma_ids(n.span, first_item_span);
        // Delegate to inner TypeScript transform
        self.inner.visit_mut_module(n);
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        // Parse JSX pragma identifiers from comments
        let first_item_span = n.body.first().map(|item| item.span());
        self.inner.jsx_pragma_ids = self.parse_jsx_pragma_ids(n.span, first_item_span);
        // Delegate to inner TypeScript transform
        self.inner.visit_mut_script(n);
    }
}

/// The main TypeScript transform.
pub struct TypeScript {
    pub config: Config,
    pub unresolved_mark: Mark,
    pub top_level_mark: Mark,
    pub tsx_config: Option<TsxConfig>,
    /// JSX pragma identifiers to keep in imports.
    jsx_pragma_ids: FxHashSet<Atom>,
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
    /// Set of const enum IDs (for inlining and removal).
    const_enum_ids: FxHashSet<Id>,
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
    /// Import equals declarations: LHS id -> root id of RHS TsEntityName.
    /// Used to check if import equals should be transformed (only if LHS is
    /// used).
    import_equals_refs: FxHashMap<Id, Id>,
    /// Set of type-only declarations (type aliases and interfaces).
    type_decls: FxHashSet<Id>,
    /// Deferred namespace var declarations (to be emitted at the end).
    ns_var_decls: Vec<VarDeclarator>,
    /// Deferred exported namespace var declarations (to be emitted at the end).
    ns_export_var_decls: Vec<VarDeclarator>,
    /// Set of seen enum IDs (for merging).
    seen_enum_ids: FxHashSet<Id>,
}

impl Default for TransformState {
    fn default() -> Self {
        Self {
            imports: Default::default(),
            value_usages: Default::default(),
            in_type: false,
            enum_values: Default::default(),
            const_enum_ids: Default::default(),
            has_value_export: false,
            has_value_import: false,
            was_module: false,
            exported_ids: Default::default(),
            local_decls: Default::default(),
            import_equals_refs: Default::default(),
            type_decls: Default::default(),
            ns_var_decls: Default::default(),
            ns_export_var_decls: Default::default(),
            seen_enum_ids: Default::default(),
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

        // Collect const enum values for inlining (always done for const enums)
        self.collect_const_enum_values(n, &mut state);

        // Pre-process import equals to update value_usages before we process imports
        // This is needed because import equals may reference imports that come later
        for item in &n.body {
            if let ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(import)) = item {
                if !import.is_type_only {
                    let is_used =
                        import.is_export || state.value_usages.contains(&import.id.to_id());
                    if is_used {
                        if let Some(rhs_root) =
                            state.import_equals_refs.get(&import.id.to_id()).cloned()
                        {
                            state.value_usages.insert(rhs_root);
                        }
                    }
                }
            }
        }

        // Second pass: transform items in original order (preserving import positions)
        let mut new_body = Vec::with_capacity(n.body.len());

        for item in n.body.drain(..) {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::Import(import)) => {
                    // Process import in place
                    let mut import_items = Vec::new();
                    self.transform_import(import, &mut import_items, &mut state);
                    new_body.extend(import_items);
                }
                item => {
                    self.transform_module_item(item, &mut new_body, &mut state);
                }
            }
        }

        // Emit deferred namespace var declarations at the end
        if !state.ns_var_decls.is_empty() {
            let var_decl = VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls: state.ns_var_decls,
                ..Default::default()
            };
            new_body.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(var_decl)))));
        }

        // Emit deferred exported namespace var declarations at the end
        if !state.ns_export_var_decls.is_empty() {
            let var_decl = VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls: state.ns_export_var_decls,
                ..Default::default()
            };
            new_body.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                span: DUMMY_SP,
                decl: Decl::Var(Box::new(var_decl)),
            })));
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

        // Final pass: strip remaining type annotations and inline const enums
        n.visit_mut_children_with(&mut TypeStripper {
            config: &self.config,
            enum_values: &state.enum_values,
            const_enum_ids: &state.const_enum_ids,
        });
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        // Collect const enum values before transformation
        let mut enum_values: FxHashMap<Id, FxHashMap<Atom, TsLit>> = FxHashMap::default();
        let mut const_enum_ids: FxHashSet<Id> = FxHashSet::default();
        for stmt in &n.body {
            if let Stmt::Decl(Decl::TsEnum(e)) = stmt {
                if e.is_const {
                    const_enum_ids.insert(e.id.to_id());
                }
                if let Some(values) = self.collect_enum_values_with_existing_script(e, &enum_values)
                {
                    enum_values.insert(e.id.to_id(), values);
                }
            }
        }

        let mut new_body = Vec::with_capacity(n.body.len());
        let mut ns_var_decls: Vec<Stmt> = Vec::new();
        let mut seen_ns_ids: FxHashSet<Id> = FxHashSet::default();
        let mut seen_enum_ids: FxHashSet<Id> = FxHashSet::default();
        for stmt in n.body.drain(..) {
            self.transform_stmt_with_ns_decls(
                stmt,
                &mut new_body,
                &mut ns_var_decls,
                &mut seen_ns_ids,
                &mut seen_enum_ids,
                &enum_values,
            );
        }
        // Merge namespace var declarations into a single var statement
        if !ns_var_decls.is_empty() {
            let mut all_declarators: Vec<VarDeclarator> = Vec::new();
            for stmt in ns_var_decls {
                if let Stmt::Decl(Decl::Var(var)) = stmt {
                    all_declarators.extend(var.decls);
                }
            }
            if !all_declarators.is_empty() {
                new_body.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: all_declarators,
                    ..Default::default()
                }))));
            }
        }
        n.body = new_body;

        // Strip remaining type annotations and inline const enums
        n.visit_mut_children_with(&mut TypeStripper {
            config: &self.config,
            enum_values: &enum_values,
            const_enum_ids: &const_enum_ids,
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
            Decl::TsInterface(i) => {
                state.type_decls.insert(i.id.to_id());
            }
            Decl::TsTypeAlias(t) => {
                state.type_decls.insert(t.id.to_id());
            }
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
                        // Store the RHS root reference for lazy value usage tracking
                        if !import.is_type_only {
                            if let TsModuleRef::TsEntityName(entity) = &import.module_ref {
                                let root = get_entity_root(entity);
                                state.import_equals_refs.insert(import.id.to_id(), root);
                            }
                        }
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

    /// Collects enum values for inlining.
    /// All enum values are collected (for computing const enum values),
    /// but only const enum IDs are tracked for later inlining.
    fn collect_const_enum_values(&self, n: &Module, state: &mut TransformState) {
        // Collect all enum values in order (needed for resolving references like F.A or
        // H.A)
        for item in &n.body {
            match item {
                ModuleItem::Stmt(Stmt::Decl(Decl::TsEnum(e))) => {
                    if e.is_const {
                        state.const_enum_ids.insert(e.id.to_id());
                    }
                    // Collect values for all enums, passing existing values for resolution
                    if let Some(values) =
                        self.collect_enum_values_with_existing(e, &state.enum_values)
                    {
                        state.enum_values.insert(e.id.to_id(), values);
                    }
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::TsEnum(e),
                    ..
                })) => {
                    if e.is_const {
                        state.const_enum_ids.insert(e.id.to_id());
                    }
                    // Collect values for all enums, passing existing values for resolution
                    if let Some(values) =
                        self.collect_enum_values_with_existing(e, &state.enum_values)
                    {
                        state.enum_values.insert(e.id.to_id(), values);
                    }
                }
                _ => {}
            }
        }
    }

    /// Collects enum member values, resolving references to other enums.
    /// This function collects PARTIAL values - if some members can be computed,
    /// they are collected even if later members cannot be computed.
    fn collect_enum_values_with_existing(
        &self,
        e: &TsEnumDecl,
        existing_values: &FxHashMap<Id, FxHashMap<Atom, TsLit>>,
    ) -> Option<FxHashMap<Atom, TsLit>> {
        let mut values = FxHashMap::default();
        let mut current_value: Option<f64> = Some(0.0);

        for member in &e.members {
            let member_name: Atom = match &member.id {
                TsEnumMemberId::Ident(i) => i.sym.clone(),
                TsEnumMemberId::Str(s) => s.value.to_atom_lossy().into_owned(),
            };

            let value = if let Some(init) = &member.init {
                if let Some(computed) =
                    crate::enums::compute_const_expr(init, &values, existing_values)
                {
                    if let TsLit::Number(n) = &computed {
                        current_value = Some(n.value);
                    } else {
                        current_value = None;
                    }
                    Some(computed)
                } else {
                    // Value couldn't be computed - stop incrementing current_value
                    // but continue processing remaining members
                    current_value = None;
                    None
                }
            } else if let Some(val) = current_value {
                Some(TsLit::Number(Number {
                    span: DUMMY_SP,
                    value: val,
                    raw: None,
                }))
            } else {
                None
            };

            if let Some(v) = value {
                values.insert(member_name, v);
            }

            if let Some(val) = current_value {
                current_value = Some(val + 1.0);
            }
        }

        if values.is_empty() {
            None
        } else {
            Some(values)
        }
    }

    /// Collects enum member values for scripts, resolving references to other
    /// enums.
    fn collect_enum_values_with_existing_script(
        &self,
        e: &TsEnumDecl,
        existing_values: &FxHashMap<Id, FxHashMap<Atom, TsLit>>,
    ) -> Option<FxHashMap<Atom, TsLit>> {
        // Same logic as collect_enum_values_with_existing
        self.collect_enum_values_with_existing(e, existing_values)
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
                let mut ns_var_decls = vec![];
                let mut seen_ns_ids = FxHashSet::default();
                self.transform_stmt_with_ns_decls(
                    stmt,
                    &mut stmts,
                    &mut ns_var_decls,
                    &mut seen_ns_ids,
                    &mut state.seen_enum_ids,
                    &state.enum_values,
                );
                out.extend(stmts.into_iter().map(ModuleItem::Stmt));
                // Defer namespace var declarations to state for later emission
                for var_stmt in ns_var_decls {
                    if let Stmt::Decl(Decl::Var(var)) = var_stmt {
                        state.ns_var_decls.extend(var.decls);
                    }
                }
            }
        }
    }

    /// Transforms import declarations.
    /// Called after other module items to ensure import equals usages are
    /// collected.
    fn transform_import(
        &mut self,
        mut import: ImportDecl,
        out: &mut Vec<ModuleItem>,
        state: &mut TransformState,
    ) {
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

            // Side-effect imports (no specifiers) should always be kept
            let is_side_effect = import.specifiers.is_empty();

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

                // Keep JSX pragma identifiers (e.g., `h` from `@jsx h`)
                if self.jsx_pragma_ids.contains(&id.0) {
                    return true;
                }

                // Always check for value usage, regardless of mode
                state.value_usages.contains(&id)
            });

            if import.specifiers.is_empty() {
                // Keep side-effect imports, or preserve mode
                if is_side_effect
                    || matches!(
                        self.config.import_not_used_as_values,
                        ImportsNotUsedAsValues::Preserve
                    )
                {
                    out.push(ModuleItem::ModuleDecl(ModuleDecl::Import(import)));
                }
            } else {
                state.has_value_import = true;
                out.push(ModuleItem::ModuleDecl(ModuleDecl::Import(import)));
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
            // Imports are handled separately via transform_import
            ModuleDecl::Import(_) => unreachable!("imports should be handled via transform_import"),

            // Handle export declarations
            ModuleDecl::ExportDecl(export) => {
                match export.decl {
                    // Remove type-only declarations
                    Decl::TsInterface(_) | Decl::TsTypeAlias(_) => {}

                    // Transform enums
                    Decl::TsEnum(e) => {
                        // Skip const enums - they are removed and their usages inlined
                        if e.is_const {
                            return;
                        }

                        let id = e.id.to_id();

                        // Store enum values for potential inlining
                        if !self.config.ts_enum_is_mutable {
                            if let Some(values) = crate::enums::collect_enum_values(&e) {
                                state.enum_values.insert(e.id.to_id(), values);
                            }
                        }

                        state.has_value_export = true;

                        // Check if this enum is merging with an existing exported declaration
                        if state.exported_ids.contains(&id) {
                            // Merging: emit just the IIFE statement
                            let stmt = crate::enums::transform_enum_merging(&e, &state.enum_values);
                            out.push(ModuleItem::Stmt(stmt));
                        } else {
                            // First declaration: emit export var with IIFE
                            let (var, _) = transform_enum(
                                &e,
                                self.config.ts_enum_is_mutable,
                                &state.enum_values,
                                true, // is_export
                            );
                            state.exported_ids.insert(id);
                            out.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                                span: export.span,
                                decl: Decl::Var(Box::new(var)),
                            })));
                        }
                    }

                    // Transform namespaces
                    Decl::TsModule(ns) => {
                        if ns.declare || ns.body.is_none() {
                            return;
                        }
                        state.has_value_export = true;
                        let stmts = transform_namespace(&ns, true, &state.enum_values);
                        out.extend(stmts.into_iter().map(ModuleItem::Stmt));
                        // Defer `export var ns;` to the end
                        if let TsModuleName::Ident(id) = &ns.id {
                            let ns_id = id.to_id();
                            if !state.exported_ids.contains(&ns_id) {
                                state.exported_ids.insert(ns_id);
                                state.ns_export_var_decls.push(VarDeclarator {
                                    span: DUMMY_SP,
                                    name: Pat::Ident(id.clone().into()),
                                    init: None,
                                    definite: false,
                                });
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

                // Filter type-only exports and exports that reference type declarations
                export.specifiers.retain(|s| {
                    if matches!(
                        s,
                        ExportSpecifier::Named(ExportNamedSpecifier {
                            is_type_only: true,
                            ..
                        })
                    ) {
                        return false;
                    }

                    // For re-exports from another module, keep them
                    if export.src.is_some() {
                        return true;
                    }

                    // For local exports, check if the name refers to a type declaration
                    // or a type-only import
                    if let ExportSpecifier::Named(ExportNamedSpecifier { orig, .. }) = s {
                        if let ModuleExportName::Ident(id) = orig {
                            let id_ref = id.to_id();
                            // Filter out exports that reference type declarations,
                            // BUT keep them if there's also a value declaration with the same name
                            if state.type_decls.contains(&id_ref)
                                && !state.local_decls.contains(&id_ref)
                            {
                                return false;
                            }
                            // Filter out exports of type-only imports
                            if let Some(import_info) = state.imports.get(&id_ref) {
                                if matches!(import_info.kind, ImportKind::TypeOnly) {
                                    return false;
                                }
                            }
                        }
                    }

                    true
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
                // Check if the exported expression is an identifier that only refers to a type
                if let Expr::Ident(id) = &*export.expr {
                    let id_ref = id.to_id();
                    // If the identifier is a type declaration and not a value declaration, skip it
                    if state.type_decls.contains(&id_ref) && !state.local_decls.contains(&id_ref) {
                        return;
                    }
                }
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

                // Only transform if the LHS is used as a value (or if it's an export)
                let is_used = import.is_export || state.value_usages.contains(&import.id.to_id());
                if !is_used {
                    return;
                }

                // Now that we know it's used, mark the RHS root as used
                // so the corresponding import is kept
                if let Some(rhs_root) = state.import_equals_refs.get(&import.id.to_id()).cloned() {
                    state.value_usages.insert(rhs_root);
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

    /// Transforms statements with namespace var decl collection.
    fn transform_stmt_with_ns_decls(
        &mut self,
        stmt: Stmt,
        out: &mut Vec<Stmt>,
        ns_var_decls: &mut Vec<Stmt>,
        seen_ns_ids: &mut FxHashSet<Id>,
        seen_enum_ids: &mut FxHashSet<Id>,
        enum_values: &FxHashMap<Id, FxHashMap<Atom, TsLit>>,
    ) {
        match stmt {
            Stmt::Decl(decl) => match decl {
                // Remove type declarations
                Decl::TsInterface(_) | Decl::TsTypeAlias(_) => {}

                // Transform enums
                Decl::TsEnum(e) => {
                    // Skip const enums - they are removed and their usages inlined
                    if e.is_const {
                        return;
                    }

                    let enum_id = e.id.to_id();
                    if seen_enum_ids.contains(&enum_id) {
                        // Merging: emit just the IIFE statement
                        let stmt = crate::enums::transform_enum_merging(&e, enum_values);
                        out.push(stmt);
                    } else {
                        // First declaration: emit var with IIFE
                        seen_enum_ids.insert(enum_id.clone());
                        // Also mark as seen namespace ID to prevent extra var decl
                        // when namespace merges with this enum
                        seen_ns_ids.insert(enum_id);
                        let (var, _) = transform_enum(
                            &e,
                            self.config.ts_enum_is_mutable,
                            enum_values,
                            false, // not an export
                        );
                        out.push(Stmt::Decl(Decl::Var(Box::new(var))));
                    }
                }

                // Transform namespaces
                Decl::TsModule(ns) => {
                    if ns.declare || ns.body.is_none() {
                        return;
                    }
                    let stmts = transform_namespace(&ns, false, enum_values);
                    // Only emit if there are statements (namespace wasn't empty)
                    if !stmts.is_empty() {
                        out.extend(stmts);
                        // Collect var declaration for the namespace identifier (to emit at the end)
                        // Dedupe by only adding if we haven't seen this namespace name yet
                        // This also prevents emitting var decl when namespace merges with
                        // class/function/enum
                        if let TsModuleName::Ident(id) = &ns.id {
                            let ns_id = id.to_id();
                            if !seen_ns_ids.contains(&ns_id) {
                                seen_ns_ids.insert(ns_id);
                                ns_var_decls.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
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
                                }))));
                            }
                        }
                    }
                }

                // Skip declare statements (they have no runtime behavior)
                Decl::Var(v) if v.declare => {}
                Decl::Class(c) if c.declare => {
                    // Still track the ID for namespace merging
                    seen_ns_ids.insert(c.ident.to_id());
                }
                Decl::Fn(f) if f.declare => {
                    // Still track the ID for namespace merging
                    seen_ns_ids.insert(f.ident.to_id());
                }

                Decl::Class(c) => {
                    // Track class ID for namespace merging
                    seen_ns_ids.insert(c.ident.to_id());
                    out.push(Stmt::Decl(Decl::Class(c)));
                }
                Decl::Fn(f) => {
                    // Track function ID for namespace merging
                    seen_ns_ids.insert(f.ident.to_id());
                    out.push(Stmt::Decl(Decl::Fn(f)));
                }

                decl => {
                    out.push(Stmt::Decl(decl));
                }
            },
            stmt => {
                out.push(stmt);
            }
        }
    }

    /// Transforms statements (simple version without namespace var decl
    /// collection).
    #[allow(dead_code)]
    fn transform_stmt(&mut self, stmt: Stmt, out: &mut Vec<Stmt>) {
        let mut ns_var_decls = Vec::new();
        let mut seen_ns_ids = FxHashSet::default();
        let mut seen_enum_ids = FxHashSet::default();
        let empty_enum_values = FxHashMap::default();
        self.transform_stmt_with_ns_decls(
            stmt,
            out,
            &mut ns_var_decls,
            &mut seen_ns_ids,
            &mut seen_enum_ids,
            &empty_enum_values,
        );
        // In transform_stmt, we add ns_var_decls inline (used for modules)
        out.append(&mut ns_var_decls);
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
                state.has_value_import = true;
                if import.is_export {
                    // export import foo = require("foo") -> const foo = exports.foo =
                    // require("foo")
                    let require_call = Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: Callee::Expr(Box::new(Expr::Ident(Ident::new_no_ctxt(
                            "require".into(),
                            DUMMY_SP,
                        )))),
                        args: vec![external.expr.clone().as_arg()],
                        ..Default::default()
                    });
                    // exports.foo = require("foo")
                    let export_assign = Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: MemberExpr {
                            span: DUMMY_SP,
                            obj: Box::new(Expr::Ident(Ident::new_no_ctxt(
                                "exports".into(),
                                DUMMY_SP,
                            ))),
                            prop: MemberProp::Ident(IdentName::new(
                                import.id.sym.clone(),
                                DUMMY_SP,
                            )),
                        }
                        .into(),
                        right: Box::new(require_call),
                    });
                    // const foo = exports.foo = require("foo")
                    let var = VarDecl {
                        span: import.span,
                        kind: VarDeclKind::Const,
                        declare: false,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(import.id.clone().into()),
                            init: Some(Box::new(export_assign)),
                            definite: false,
                        }],
                        ..Default::default()
                    };
                    out.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(var)))));
                } else {
                    // import foo = require("foo") -> const foo = require("foo")
                    let var = VarDecl {
                        span: import.span,
                        kind: VarDeclKind::Const,
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
                    out.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(var)))));
                }
            }
            TsModuleRef::TsEntityName(entity) => {
                // import foo = ns.bar -> const foo = ns.bar
                let expr = ts_entity_to_expr(entity.clone());
                let var = VarDecl {
                    span: import.span,
                    kind: VarDeclKind::Const,
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

/// Gets the root identifier from a TsEntityName.
/// For `Foo`, returns Foo's id. For `Foo.Bar.Baz`, returns Foo's id.
fn get_entity_root(entity: &TsEntityName) -> Id {
    match entity {
        TsEntityName::Ident(i) => i.to_id(),
        TsEntityName::TsQualifiedName(q) => get_entity_root(&q.left),
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
                // Skip type-only exports entirely
                if export.type_only {
                    return;
                }
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
            // TsImportEquals usages are collected lazily during transform
            // (only if the LHS is actually used as a value)
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
                    // Collect usages from default values in patterns (e.g., [a = Test])
                    self.collect_pat(&decl.name);
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
            Decl::TsInterface(_) | Decl::TsTypeAlias(_) | Decl::TsEnum(_) => {}
            Decl::TsModule(ns) => {
                // Collect usages from namespace contents (e.g., export import A = I.A)
                self.collect_ts_module_body(&ns.body);
            }
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

    /// Collects usages from namespace body.
    fn collect_ts_module_body(&mut self, body: &Option<TsNamespaceBody>) {
        let Some(body) = body else { return };
        match body {
            TsNamespaceBody::TsModuleBlock(block) => {
                for item in &block.body {
                    match item {
                        ModuleItem::ModuleDecl(decl) => {
                            match decl {
                                ModuleDecl::ExportDecl(export) => self.collect_decl(&export.decl),
                                ModuleDecl::TsImportEquals(import) => {
                                    // For `export import A = I.A`, collect I as a value usage
                                    if !import.is_type_only {
                                        if let TsModuleRef::TsEntityName(entity) =
                                            &import.module_ref
                                        {
                                            self.collect_ts_entity_name(entity);
                                        }
                                    }
                                }
                                _ => {}
                            }
                        }
                        ModuleItem::Stmt(stmt) => self.collect_stmt(stmt),
                    }
                }
            }
            TsNamespaceBody::TsNamespaceDecl(ns) => {
                self.collect_ts_module_body(&Some((*ns.body).clone()));
            }
        }
    }

    /// Collects usages from TsEntityName (used in import equals)
    fn collect_ts_entity_name(&mut self, entity: &TsEntityName) {
        match entity {
            TsEntityName::Ident(i) => {
                self.state.value_usages.insert(i.to_id());
            }
            TsEntityName::TsQualifiedName(q) => {
                // For Foo.Bar, only the root Foo is a usage
                self.collect_ts_entity_name(&q.left);
            }
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

/// Strips remaining TypeScript type annotations and inlines const enum values.
struct TypeStripper<'a> {
    config: &'a Config,
    /// Enum values for const enum inlining.
    enum_values: &'a FxHashMap<Id, FxHashMap<Atom, TsLit>>,
    /// Set of const enum IDs (to identify which member accesses to inline).
    const_enum_ids: &'a FxHashSet<Id>,
}

impl VisitMut for TypeStripper<'_> {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        // Remove function declaration overloads (signatures without bodies)
        n.retain(|item| match item {
            ModuleItem::Stmt(Stmt::Decl(Decl::Fn(f))) if f.function.body.is_none() => false,
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::Fn(f),
                ..
            })) if f.function.body.is_none() => false,
            _ => true,
        });
        n.visit_mut_children_with(self);
    }

    fn visit_mut_stmt(&mut self, n: &mut Stmt) {
        // Handle const enum declarations in single-statement positions
        // (e.g., `if (cond) const enum E { ... }`)
        // These need to be replaced with empty statements
        if let Stmt::Decl(Decl::TsEnum(e)) = n {
            if e.is_const {
                *n = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                return;
            }
        }
        // Handle declare namespace/module in single-statement positions
        if let Stmt::Decl(Decl::TsModule(ns)) = n {
            if ns.declare || ns.body.is_none() {
                *n = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                return;
            }
        }
        // Handle type declarations in single-statement positions
        if matches!(n, Stmt::Decl(Decl::TsInterface(_) | Decl::TsTypeAlias(_))) {
            *n = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
            return;
        }
        // Handle function declaration overloads in single-statement positions
        if let Stmt::Decl(Decl::Fn(f)) = n {
            if f.function.body.is_none() {
                *n = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                return;
            }
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        // Remove function declaration overloads (signatures without bodies)
        // and remove type declarations
        n.retain(|s| match s {
            Stmt::Decl(Decl::Fn(f)) if f.function.body.is_none() => false,
            Stmt::Decl(Decl::TsInterface(_) | Decl::TsTypeAlias(_)) => false,
            _ => true,
        });

        // Transform nested enums and namespaces, tracking seen enum IDs for merging
        let mut new_stmts = Vec::with_capacity(n.len());
        let mut seen_enum_ids: FxHashSet<Id> = FxHashSet::default();
        for stmt in n.drain(..) {
            match stmt {
                Stmt::Decl(Decl::TsEnum(e)) => {
                    // Skip const enums - they are removed and their usages inlined
                    if e.is_const {
                        continue;
                    }
                    let enum_id = e.id.to_id();
                    if seen_enum_ids.contains(&enum_id) {
                        // Merging: emit just the IIFE statement
                        let stmt = crate::enums::transform_enum_merging(&e, &FxHashMap::default());
                        new_stmts.push(stmt);
                    } else {
                        // First declaration: emit let with IIFE
                        seen_enum_ids.insert(enum_id);
                        let (var, _) =
                            crate::enums::transform_enum_block_scoped(&e, &FxHashMap::default());
                        new_stmts.push(Stmt::Decl(Decl::Var(Box::new(var))));
                    }
                }
                Stmt::Decl(Decl::TsModule(ns)) => {
                    // Skip declare and empty namespaces
                    if ns.declare || ns.body.is_none() {
                        continue;
                    }
                    // Transform the namespace to JavaScript
                    let stmts =
                        crate::namespace::transform_namespace(&ns, false, &FxHashMap::default());
                    new_stmts.extend(stmts);
                    // Add var declaration for namespace
                    if let TsModuleName::Ident(id) = &ns.id {
                        new_stmts.push(Stmt::Decl(Decl::Var(Box::new(VarDecl {
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
                        }))));
                    }
                }
                stmt => new_stmts.push(stmt),
            }
        }
        *n = new_stmts;

        n.visit_mut_children_with(self);
    }

    fn visit_mut_class(&mut self, n: &mut Class) {
        // Remove abstract modifier and type parameters
        n.is_abstract = false;
        n.type_params = None;
        n.super_type_params = None;
        n.implements = vec![];

        // Process class members
        n.body
            .retain(|m| !matches!(m, ClassMember::TsIndexSignature(_)));

        // Handle parameter properties in constructor and collect field declarations
        let mut param_prop_fields: Vec<ClassMember> = vec![];
        for member in &mut n.body {
            if let ClassMember::Constructor(c) = member {
                param_prop_fields = self.transform_constructor(c);
            }
        }

        // Insert parameter property field declarations at the beginning of the class
        // body (before existing class fields)
        if !param_prop_fields.is_empty() {
            param_prop_fields.append(&mut n.body);
            n.body = param_prop_fields;
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_class_members(&mut self, n: &mut Vec<ClassMember>) {
        // Remove:
        // - Index signatures
        // - Abstract members (methods, props, auto accessors, private methods)
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
                ClassMember::AutoAccessor(AutoAccessor {
                    is_abstract: true, ..
                }) => false,
                ClassMember::PrivateMethod(PrivateMethod {
                    is_abstract: true, ..
                }) => false,
                // Remove method overloads (no body)
                ClassMember::Method(ClassMethod { function, .. }) if function.body.is_none() => {
                    false
                }
                // Remove private method overloads (no body)
                ClassMember::PrivateMethod(PrivateMethod { function, .. })
                    if function.body.is_none() =>
                {
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

    fn visit_mut_auto_accessor(&mut self, n: &mut AutoAccessor) {
        // Strip TypeScript-only fields
        n.accessibility = None;
        n.is_abstract = false;
        n.is_override = false;
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

        // Remove `this` parameter (TypeScript-only syntax for declaring this type)
        if let Some(first) = n.params.first() {
            if matches!(&first.pat, Pat::Ident(ident) if &*ident.sym == "this") {
                n.params.remove(0);
            }
        }

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
                i.optional = false;
            }
            Pat::Array(a) => {
                a.type_ann = None;
                a.optional = false;
            }
            Pat::Object(o) => {
                o.type_ann = None;
                o.optional = false;
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
            // Inline enum member accesses (const enums always, regular enums when not mutable)
            Expr::Member(m) => {
                // Don't inline if the object is itself a member expression that resolves
                // to an enum value (e.g., `Baz.a.toString()` - don't inline `Baz.a` to `0`)
                // This avoids ugly output like `0..toString()` and matches TypeScript output
                if let Expr::Member(inner_m) = &*m.obj {
                    if let Expr::Ident(inner_obj) = &*inner_m.obj {
                        if self.enum_values.contains_key(&inner_obj.to_id()) {
                            // The inner member expression is an enum access like `Baz.a`
                            // Don't inline it - just visit the property (toString, etc.)
                            // and leave the enum access as-is
                            m.prop.visit_mut_with(self);
                            return;
                        }
                    }
                }

                // Check if this is an enum access before visiting children
                let replacement = if let Expr::Ident(obj) = &*m.obj {
                    let obj_id = obj.to_id();
                    // Check if we have enum values for this ID
                    if let Some(enum_values) = self.enum_values.get(&obj_id) {
                        // Get the property name from either ident or computed string literal
                        let prop_name: Option<Atom> = match &m.prop {
                            MemberProp::Ident(prop) => Some(prop.sym.clone()),
                            MemberProp::Computed(ComputedPropName { expr, .. }) => match &**expr {
                                Expr::Lit(Lit::Str(s)) => {
                                    Some(s.value.to_atom_lossy().into_owned())
                                }
                                Expr::Tpl(t) if t.exprs.is_empty() => {
                                    t.quasis.first().map(|q| q.raw.clone())
                                }
                                _ => None,
                            },
                            _ => None,
                        };

                        // Only inline if:
                        // - It's a const enum, OR
                        // - It's a regular enum and ts_enum_is_mutable is false
                        let should_inline = self.const_enum_ids.contains(&obj_id)
                            || !self.config.ts_enum_is_mutable;

                        if should_inline {
                            prop_name.and_then(|name| {
                                enum_values.get(&name).and_then(|value| {
                                    Some(match value {
                                        TsLit::Number(num) => Expr::Lit(Lit::Num(num.clone())),
                                        TsLit::Str(s) => Expr::Lit(Lit::Str(s.clone())),
                                        TsLit::Bool(b) => Expr::Lit(Lit::Bool(b.clone())),
                                        TsLit::Tpl(_) => return None, /* Cannot inline template */
                                        // literals
                                        TsLit::BigInt(b) => Expr::Lit(Lit::BigInt(b.clone())),
                                    })
                                })
                            })
                        } else {
                            None
                        }
                    } else {
                        None
                    }
                } else {
                    None
                };

                if let Some(replacement) = replacement {
                    *n = replacement;
                } else {
                    n.visit_mut_children_with(self);
                }
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
    /// Transform constructor - handles parameter properties.
    /// Returns a list of field declarations for parameter properties that
    /// should be inserted into the class body.
    fn transform_constructor(&mut self, c: &mut Constructor) -> Vec<ClassMember> {
        // Collect parameter properties
        let mut prop_stmts: Vec<Stmt> = vec![];
        let mut field_decls: Vec<ClassMember> = vec![];

        for param in &mut c.params {
            if let ParamOrTsParamProp::TsParamProp(prop) = param {
                let (name, init) = match &prop.param {
                    TsParamPropParam::Ident(i) => {
                        // Clear the optional flag from the ident when using as expression
                        let mut ident = i.id.clone();
                        ident.optional = false;
                        (PropName::Ident(ident.clone().into()), Expr::Ident(ident))
                    }
                    TsParamPropParam::Assign(a) => match &*a.left {
                        Pat::Ident(i) => {
                            let mut ident = i.id.clone();
                            ident.optional = false;
                            (PropName::Ident(ident.clone().into()), Expr::Ident(ident))
                        }
                        _ => continue,
                    },
                };

                // Generate field declaration for parameter property
                field_decls.push(ClassMember::ClassProp(ClassProp {
                    span: DUMMY_SP,
                    key: name.clone(),
                    value: None,
                    type_ann: None,
                    is_static: false,
                    decorators: vec![],
                    accessibility: None,
                    is_abstract: false,
                    is_optional: false,
                    is_override: false,
                    readonly: false,
                    declare: false,
                    definite: false,
                }));

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
        // We use inject_after_super to handle both cases consistently with how
        // class_properties does it - this ensures correct ordering when both
        // parameter properties and class fields are present.
        if !prop_stmts.is_empty() {
            // Convert statements to expressions
            let prop_exprs: Vec<Box<Expr>> = prop_stmts
                .into_iter()
                .filter_map(|stmt| {
                    if let Stmt::Expr(e) = stmt {
                        Some(e.expr)
                    } else {
                        None
                    }
                })
                .collect();

            if !prop_exprs.is_empty() {
                inject_after_super(c, prop_exprs);
            }
        }

        field_decls
    }
}
