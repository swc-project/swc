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
    analyzer::{Analyzer, ProgramInfo},
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
    /// Enum values for inlining.
    enum_values: FxHashMap<Id, FxHashMap<Atom, TsLit>>,
    /// Set of const enum IDs (for inlining and removal).
    const_enum_ids: FxHashSet<Id>,
    /// Set of const enum IDs that are used as standalone values (not member
    /// access). These must be kept even though they're const enums.
    const_enums_as_values: FxHashSet<Id>,
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
    /// Non-instantiated namespace IDs (namespaces that only contain type
    /// exports).
    non_instantiated_namespaces: FxHashSet<Id>,
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
            enum_values: Default::default(),
            const_enum_ids: Default::default(),
            const_enums_as_values: Default::default(),
            has_value_export: false,
            has_value_import: false,
            was_module: false,
            exported_ids: Default::default(),
            local_decls: Default::default(),
            import_equals_refs: Default::default(),
            type_decls: Default::default(),
            non_instantiated_namespaces: Default::default(),
            ns_var_decls: Default::default(),
            ns_export_var_decls: Default::default(),
            seen_enum_ids: Default::default(),
        }
    }
}

impl TransformState {
    /// Creates a TransformState from a ProgramInfo and module.
    fn from_program_info(info: ProgramInfo, n: &Module) -> Self {
        let was_module = !n.body.is_empty()
            && n.body
                .iter()
                .any(|item| matches!(item, ModuleItem::ModuleDecl(_)));

        // Build the imports map from the module (we need the source strings)
        let mut imports = FxHashMap::default();
        for item in &n.body {
            if let ModuleItem::ModuleDecl(ModuleDecl::Import(import)) = item {
                for spec in &import.specifiers {
                    let id = spec.local().to_id();
                    let is_type_only = import.type_only
                        || matches!(
                            spec,
                            ImportSpecifier::Named(ImportNamedSpecifier {
                                is_type_only: true,
                                ..
                            })
                        );
                    imports.insert(
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
            } else if let ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(import)) = item {
                imports.insert(
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
        }

        Self {
            imports,
            value_usages: info.value_usages,
            enum_values: info.enum_values,
            const_enum_ids: info.const_enum_ids,
            const_enums_as_values: info.const_enums_as_values,
            has_value_export: info.has_value_export,
            has_value_import: info.has_value_import,
            was_module,
            exported_ids: Default::default(),
            local_decls: info.local_decls,
            import_equals_refs: info.import_equals_refs,
            type_decls: info.type_decls,
            non_instantiated_namespaces: info.non_instantiated_namespaces,
            ns_var_decls: Default::default(),
            ns_export_var_decls: Default::default(),
            seen_enum_ids: Default::default(),
        }
    }
}

impl VisitMut for TypeScript {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, n: &mut Module) {
        // First pass: analyze the module using the semantic analyzer
        let mut info = ProgramInfo::default();
        {
            let mut analyzer = Analyzer::new(&mut info);
            analyzer.analyze_module(n);
        }

        // Initialize state from the analyzed info
        let mut state = TransformState::from_program_info(info, n);

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
        // In script mode, const enums are always stripped (no export default possible
        // in scripts)
        let empty_const_enums_as_values = FxHashSet::default();
        for stmt in n.body.drain(..) {
            self.transform_stmt_with_ns_decls(
                stmt,
                &mut new_body,
                &mut ns_var_decls,
                &mut seen_ns_ids,
                &mut seen_enum_ids,
                &enum_values,
                &empty_const_enums_as_values,
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
                    &state.const_enums_as_values,
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
                        // Skip declare enums (ambient)
                        if e.declare {
                            return;
                        }
                        // Note: Exported const enums are kept because SWC operates
                        // in isolatedModules mode where cross-module inlining isn't
                        // possible

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
                        let stmts = transform_namespace(&ns, true, &state.enum_values);
                        // Only emit if there are statements (namespace wasn't empty)
                        if !stmts.is_empty() {
                            state.has_value_export = true;
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
                    }

                    // Track exported class/function identifiers
                    Decl::Class(ref c) => {
                        // Skip declare class (ambient)
                        if c.declare {
                            return;
                        }
                        state.has_value_export = true;
                        state.exported_ids.insert(c.ident.to_id());
                        out.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                            span: export.span,
                            decl: export.decl,
                        })));
                    }
                    Decl::Fn(ref f) => {
                        // Skip declare function (ambient)
                        if f.declare {
                            return;
                        }
                        state.has_value_export = true;
                        state.exported_ids.insert(f.ident.to_id());
                        out.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                            span: export.span,
                            decl: export.decl,
                        })));
                    }
                    Decl::Var(ref v) => {
                        // Skip declare var (ambient)
                        if v.declare {
                            return;
                        }
                        state.has_value_export = true;
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
                            // Filter out exports of non-instantiated namespaces
                            // (namespaces that only contain type exports)
                            if state.non_instantiated_namespaces.contains(&id_ref) {
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
                // Skip type-only default exports (interface)
                if matches!(export.decl, DefaultDecl::TsInterfaceDecl(_)) {
                    return;
                }
                // Skip function overloads (declarations without body)
                if let DefaultDecl::Fn(f) = &export.decl {
                    if f.function.body.is_none() {
                        return;
                    }
                }
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
        const_enums_as_values: &FxHashSet<Id>,
    ) {
        match stmt {
            Stmt::Decl(decl) => match decl {
                // Remove type declarations
                Decl::TsInterface(_) | Decl::TsTypeAlias(_) => {}

                // Transform enums
                Decl::TsEnum(e) => {
                    // Skip const enums - they are removed and their usages inlined
                    // But keep them if they're used as standalone values (e.g., export default
                    // EnumName) because SWC operates in isolatedModules mode
                    if e.is_const && !const_enums_as_values.contains(&e.id.to_id()) {
                        return;
                    }
                    // Skip declare enums (ambient)
                    if e.declare {
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
        let empty_const_enums_as_values = FxHashSet::default();
        self.transform_stmt_with_ns_decls(
            stmt,
            out,
            &mut ns_var_decls,
            &mut seen_ns_ids,
            &mut seen_enum_ids,
            &empty_enum_values,
            &empty_const_enums_as_values,
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
        // Handle enum declarations in single-statement positions
        // (e.g., `if (cond) enum E { ... }`)
        // These need to be transformed into var declarations with IIFE
        if let Stmt::Decl(Decl::TsEnum(e)) = n {
            if e.is_const {
                // Const enums are removed
                *n = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                return;
            }
            if e.declare {
                // Declare enums are removed
                *n = Stmt::Empty(EmptyStmt { span: DUMMY_SP });
                return;
            }
            // Transform regular enum into var declaration with IIFE
            let (var, _) =
                transform_enum(e, self.config.ts_enum_is_mutable, self.enum_values, false);
            *n = Stmt::Decl(Decl::Var(Box::new(var)));
            return;
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
                    // Skip declare enums (ambient)
                    if e.declare {
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
                    // Only emit if there are statements (namespace wasn't empty)
                    if !stmts.is_empty() {
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
        // Skip constructor overloads (those without body)
        let mut param_prop_fields: Vec<ClassMember> = vec![];
        for member in &mut n.body {
            if let ClassMember::Constructor(c) = member {
                if c.body.is_some() {
                    param_prop_fields = self.transform_constructor(c);
                }
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

    fn visit_mut_setter_prop(&mut self, n: &mut SetterProp) {
        // Remove TypeScript `this` parameter from setter
        n.this_param = None;
        // Strip type annotation from parameter
        n.param.visit_mut_with(self);
        if let Some(body) = &mut n.body {
            body.visit_mut_with(self);
        }
    }

    fn visit_mut_getter_prop(&mut self, n: &mut GetterProp) {
        // Strip return type
        n.type_ann = None;
        if let Some(body) = &mut n.body {
            body.visit_mut_with(self);
        }
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

    fn visit_mut_jsx_opening_element(&mut self, n: &mut JSXOpeningElement) {
        n.type_args = None;
        n.visit_mut_children_with(self);
    }

    fn visit_mut_simple_assign_target(&mut self, n: &mut SimpleAssignTarget) {
        // Strip TypeScript-only assignment target wrappers
        loop {
            let expr = match n {
                SimpleAssignTarget::TsAs(a) => a.expr.take(),
                SimpleAssignTarget::TsSatisfies(a) => a.expr.take(),
                SimpleAssignTarget::TsNonNull(a) => a.expr.take(),
                SimpleAssignTarget::TsTypeAssertion(a) => a.expr.take(),
                SimpleAssignTarget::TsInstantiation(a) => a.expr.take(),
                _ => break,
            };
            *n = expr_to_simple_assign_target(*expr);
        }
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

        // Strip TypeScript-only properties from constructor
        c.accessibility = None;
        c.is_optional = false;

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

/// Convert an expression to a SimpleAssignTarget.
fn expr_to_simple_assign_target(e: Expr) -> SimpleAssignTarget {
    match e {
        Expr::Ident(i) => SimpleAssignTarget::Ident(BindingIdent {
            id: i,
            type_ann: None,
        }),
        Expr::Member(m) => SimpleAssignTarget::Member(m),
        Expr::SuperProp(s) => SimpleAssignTarget::SuperProp(s),
        Expr::Paren(p) => SimpleAssignTarget::Paren(p),
        Expr::OptChain(o) => SimpleAssignTarget::OptChain(o),
        Expr::TsAs(a) => SimpleAssignTarget::TsAs(a),
        Expr::TsSatisfies(s) => SimpleAssignTarget::TsSatisfies(s),
        Expr::TsNonNull(n) => SimpleAssignTarget::TsNonNull(n),
        Expr::TsTypeAssertion(t) => SimpleAssignTarget::TsTypeAssertion(t),
        Expr::TsInstantiation(i) => SimpleAssignTarget::TsInstantiation(i),
        _ => SimpleAssignTarget::Paren(ParenExpr {
            span: DUMMY_SP,
            expr: Box::new(e),
        }),
    }
}
