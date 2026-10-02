use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::Atom;
use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    find_pat_ids,
    stack_size::maybe_grow_default,
    ts_bindings::{TsAliasId, TsBindingObserver, TsBindings, TsContainerId},
};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::retain::{should_retain_decl, IsConcrete};

mod constants;
mod enums;
mod usage;

pub(crate) use enums::{EnumFacts, EnumInitializer, EnumValue};

#[derive(Debug, Default)]
pub(crate) struct SemanticInfo {
    pub bindings: TsBindings,
    pub enums: EnumFacts,
    pub enum_inlining: EnumInlining,
    pub live_aliases: FxHashSet<TsAliasId>,
    pub runtime_containers: FxHashSet<TsContainerId>,
    pub usage: FxHashSet<Id>,
    pub id_type: FxHashSet<Id>,
    pub id_value: FxHashSet<Id>,
    pub exported_binding: FxHashMap<Id, Option<Id>>,
}

/// Whether runtime reference analysis has already substituted enum reads.
#[derive(Debug, Default, Clone, Copy)]
pub(crate) enum EnumInlining {
    #[default]
    Emit,
    Applied,
}

impl SemanticInfo {
    #[inline]
    pub fn has_usage(&self, id: &Id) -> bool {
        self.usage.contains(id)
    }

    #[inline]
    pub fn has_value(&self, id: &Id) -> bool {
        self.id_value.contains(id)
    }

    #[inline]
    pub fn has_pure_type(&self, id: &Id) -> bool {
        self.id_type.contains(id) && !self.id_value.contains(id)
    }

    pub fn has_import_equals_usage(&self, id: &Id) -> bool {
        self.bindings
            .declaration_id(id)
            .and_then(|declaration| self.bindings.declaration_alias(declaration))
            .map_or_else(
                || self.has_usage(id),
                |alias| self.live_aliases.contains(&alias),
            )
    }
}

/// Evaluate enum definitions before erasure, substitute eligible reads, and
/// retain only the references that survive those substitutions.
pub(crate) fn analyze_program(
    program: &mut Program,
    unresolved_mark: Mark,
    seed_usage: FxHashSet<Id>,
    flow_syntax: bool,
    ts_enum_is_mutable: bool,
    verbatim_module_syntax: bool,
) -> SemanticInfo {
    let mut analyzer = SemanticAnalyzer {
        info: SemanticInfo {
            ..Default::default()
        },
        namespace_id: None,
        skip_transform_info: false,
        runtime_bindings_seen: false,
        enum_seen: false,
        enum_usage_needs_substitution: false,
        import_names: None,
        enum_roots: None,
    };

    let bindings = if has_root_runtime_declaration(program) {
        analyzer.enum_roots = Some(EnumDeclarationRoots::default());
        let (bindings, observed) = TsBindings::collect_with_observer(program, analyzer);
        analyzer = observed;
        Some(bindings)
    } else {
        // Ordinary inputs retain their existing reference-only walk. Runtime
        // declarations found in nested statements use the complete fallback.
        program.visit_with(&mut analyzer);
        None
    };

    let runtime_bindings_seen = analyzer.runtime_bindings_seen;
    let enum_seen = analyzer.enum_seen;
    let enum_usage_needs_substitution = analyzer.enum_usage_needs_substitution;
    let enum_roots = analyzer.enum_roots.map(|roots| roots.declarations);
    let mut info = analyzer.info;
    if runtime_bindings_seen {
        info.bindings = bindings.unwrap_or_else(|| TsBindings::collect(program));
        let runtime_usage = if enum_seen {
            info.bindings = info.bindings.with_runtime_queries();
            info.enums = enums::analyze(
                program,
                &info.bindings,
                SyntaxContext::empty().apply_mark(unresolved_mark),
                ts_enum_is_mutable,
                flow_syntax,
                enum_roots.as_ref(),
            );
            if enum_usage_needs_substitution {
                let runtime_usage = usage::analyze(
                    program,
                    &info.bindings,
                    &info.enums,
                    seed_usage,
                    ts_enum_is_mutable,
                    verbatim_module_syntax,
                    SyntaxContext::empty().apply_mark(unresolved_mark),
                );
                info.enum_inlining = EnumInlining::Applied;
                runtime_usage
            } else {
                // Ordinary enums always emit their runtime object. Without
                // namespaces or aliases, folding their member reads cannot
                // change import retention or another container's liveness.
                info.usage.extend(seed_usage);
                usage::RuntimeUsage {
                    bindings: std::mem::take(&mut info.usage),
                    aliases: FxHashSet::default(),
                    containers: FxHashSet::default(),
                }
            }
        } else {
            // Without enum substitution the first walk already collected the
            // surviving references. Only alias dependencies remain to finish.
            info.usage.extend(seed_usage);
            usage::from_resolved_usage(
                &info.bindings,
                std::mem::take(&mut info.usage),
                verbatim_module_syntax,
            )
        };
        for &container in &runtime_usage.containers {
            info.enums.require_runtime(container);
        }
        info.runtime_containers = runtime_usage.containers;
        info.usage = runtime_usage.bindings;
        info.live_aliases = runtime_usage.aliases;
    } else {
        info.usage.extend(seed_usage);
    }
    info
}

fn has_root_runtime_declaration(program: &Program) -> bool {
    let declaration = |decl: &Decl| matches!(decl, Decl::TsEnum(_) | Decl::TsModule(_));
    match program {
        Program::Module(module) => module.body.iter().any(|item| match item {
            ModuleItem::Stmt(Stmt::Decl(decl)) => declaration(decl),
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export)) => declaration(&export.decl),
            ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(_)) => true,
            _ => false,
        }),
        Program::Script(script) => script.body.iter().any(|stmt| match stmt {
            Stmt::Decl(decl) => declaration(decl),
            _ => false,
        }),
        #[cfg(swc_ast_unknown)]
        _ => false,
    }
}

#[derive(Default)]
struct SemanticAnalyzer {
    info: SemanticInfo,
    namespace_id: Option<Id>,
    skip_transform_info: bool,
    runtime_bindings_seen: bool,
    enum_seen: bool,
    enum_usage_needs_substitution: bool,
    import_names: Option<FxHashSet<Atom>>,
    enum_roots: Option<EnumDeclarationRoots>,
}

/// Resolved declarations whose bodies contain enum syntax. The following
/// definition walk sees the same AST. Repeated declaration identities share a
/// key, conservatively retaining every contributing body.
#[derive(Default)]
struct EnumDeclarationRoots {
    count: usize,
    declarations: FxHashSet<Id>,
}

struct DeclarationState {
    skip_transform_info: bool,
    enum_root: Option<(Id, usize)>,
}

impl SemanticAnalyzer {
    fn collect_module(&mut self, node: &Module) {
        for item in &node.body {
            self.collect_top_level_module_item(item);
        }
        if self.enum_seen && !self.enum_usage_needs_substitution {
            let mut names = FxHashSet::default();
            for item in &node.body {
                if let ModuleItem::ModuleDecl(ModuleDecl::Import(import)) = item {
                    for specifier in &import.specifiers {
                        names.insert(specifier.local().sym.clone());
                    }
                }
            }
            self.import_names = Some(names);
        }
    }

    fn collect_enum(&mut self, node: &TsEnumDecl) {
        if let Some(roots) = &mut self.enum_roots {
            roots.count += 1;
        }
        self.runtime_bindings_seen = true;
        self.enum_seen = true;
        self.enum_usage_needs_substitution |= node.is_const;
        if self.enum_usage_needs_substitution {
            self.info.usage.clear();
        }
    }

    fn collect_export_decl(&mut self, node: &ExportDecl) {
        if self.skip_transform_info {
            return;
        }
        match &node.decl {
            Decl::Var(var_decl) => {
                let ids: Vec<Id> = find_pat_ids(&var_decl.decls);
                self.info.exported_binding.extend(
                    ids.into_iter()
                        .zip(std::iter::repeat(self.namespace_id.clone())),
                );
            }
            Decl::TsEnum(ts_enum_decl) => {
                self.info
                    .exported_binding
                    .insert(ts_enum_decl.id.to_id(), self.namespace_id.clone());
            }
            Decl::TsModule(ts_module_decl) => {
                if let TsModuleName::Ident(ident) = &ts_module_decl.id {
                    self.info
                        .exported_binding
                        .insert(ident.to_id(), self.namespace_id.clone());
                }
            }
            _ => {}
        }
    }

    fn collect_export_default_expr(&mut self, node: &ExportDefaultExpr) {
        if self.skip_transform_info {
            return;
        }
        if let Expr::Ident(ident) = &*node.expr {
            self.info
                .exported_binding
                .insert(ident.to_id(), self.namespace_id.clone());
        }
    }

    fn collect_top_level_module_item(&mut self, item: &ModuleItem) {
        match item {
            ModuleItem::Stmt(Stmt::Decl(decl)) => self.collect_decl(decl),
            ModuleItem::ModuleDecl(module_decl) => self.collect_module_decl(module_decl),
            _ => {}
        }
    }

    fn collect_module_decl(&mut self, module_decl: &ModuleDecl) {
        match module_decl {
            ModuleDecl::Import(import_decl) => {
                for import_specifier in &import_decl.specifiers {
                    match import_specifier {
                        ImportSpecifier::Named(named) => {
                            if import_decl.type_only || named.is_type_only {
                                self.info.id_type.insert(named.local.to_id());
                            }
                        }
                        ImportSpecifier::Default(default) => {
                            if import_decl.type_only {
                                self.info.id_type.insert(default.local.to_id());
                            }
                        }
                        ImportSpecifier::Namespace(namespace) => {
                            if import_decl.type_only {
                                self.info.id_type.insert(namespace.local.to_id());
                            }
                        }
                        #[cfg(swc_ast_unknown)]
                        _ => panic!("unable to access unknown nodes"),
                    }
                }
            }
            ModuleDecl::ExportDecl(export_decl) => self.collect_decl(&export_decl.decl),
            ModuleDecl::ExportDefaultDecl(export_default_decl) => match &export_default_decl.decl {
                DefaultDecl::Class(ClassExpr {
                    ident: Some(ident), ..
                }) => {
                    self.info.id_value.insert(ident.to_id());
                }
                DefaultDecl::Fn(FnExpr {
                    ident: Some(ident), ..
                }) => {
                    self.info.id_value.insert(ident.to_id());
                }
                _ => {}
            },
            ModuleDecl::TsImportEquals(ts_import_equals_decl) => {
                self.enum_usage_needs_substitution = true;
                if ts_import_equals_decl.is_type_only {
                    self.info.id_type.insert(ts_import_equals_decl.id.to_id());
                } else {
                    self.info.id_value.insert(ts_import_equals_decl.id.to_id());
                }
            }
            ModuleDecl::TsNamespaceExport(..)
            | ModuleDecl::ExportNamed(..)
            | ModuleDecl::ExportDefaultExpr(..)
            | ModuleDecl::ExportAll(..)
            | ModuleDecl::TsExportAssignment(..) => {}
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }

    fn collect_decl(&mut self, decl: &Decl) {
        match decl {
            Decl::Var(var_decl) => {
                let ids: Vec<Id> = find_pat_ids(&var_decl.decls);
                self.info.id_value.extend(ids);
            }
            Decl::Using(using_decl) => {
                let ids: Vec<Id> = find_pat_ids(&using_decl.decls);
                self.info.id_value.extend(ids);
            }
            Decl::Fn(fn_decl) => {
                self.info.id_value.insert(fn_decl.ident.to_id());
            }
            Decl::Class(class_decl) => {
                self.info.id_value.insert(class_decl.ident.to_id());
            }
            Decl::TsEnum(ts_enum_decl) => {
                self.enum_seen = true;
                self.enum_usage_needs_substitution |= ts_enum_decl.is_const;
                self.info.id_value.insert(ts_enum_decl.id.to_id());
            }
            Decl::TsModule(ts_module_decl) => {
                self.enum_usage_needs_substitution = true;
                if ts_module_decl.global {
                    return;
                }

                let TsModuleName::Ident(ident) = &ts_module_decl.id else {
                    return;
                };

                if ts_module_decl.is_concrete() {
                    self.info.id_value.insert(ident.to_id());
                } else {
                    self.info.id_type.insert(ident.to_id());
                }
            }
            Decl::TsInterface(ts_interface_decl) => {
                self.info.id_type.insert(ts_interface_decl.id.to_id());
            }
            Decl::TsTypeAlias(ts_type_alias_decl) => {
                self.info.id_type.insert(ts_type_alias_decl.id.to_id());
            }
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}

impl TsBindingObserver for SemanticAnalyzer {
    type DeclarationState = DeclarationState;
    type NamespaceState = Option<Option<Id>>;

    const RUNTIME: bool = true;

    fn module(&mut self, node: &Module) {
        self.collect_module(node);
    }

    fn enter_decl(&mut self, node: &Decl) -> DeclarationState {
        let enum_root = self.enum_roots.as_ref().and_then(|roots| {
            let ident = match node {
                Decl::Fn(function) => &function.ident,
                Decl::Class(class) => &class.ident,
                _ => return None,
            };
            Some((ident.to_id(), roots.count))
        });
        let state = DeclarationState {
            skip_transform_info: self.skip_transform_info,
            enum_root,
        };
        self.skip_transform_info |= !should_retain_decl(node);
        state
    }

    fn leave_decl(&mut self, state: DeclarationState) {
        self.skip_transform_info = state.skip_transform_info;
        if let (Some(roots), Some((id, count))) = (&mut self.enum_roots, state.enum_root) {
            if roots.count != count {
                roots.declarations.insert(id);
            }
        }
    }

    fn ident(&mut self, node: &Ident) {
        self.visit_ident(node);
    }

    fn enter_namespace(&mut self, id: &Id) -> Self::NamespaceState {
        if self.skip_transform_info {
            return None;
        }
        Some(self.namespace_id.replace(id.clone()))
    }

    fn leave_namespace(&mut self, previous: Self::NamespaceState) {
        if let Some(previous) = previous {
            self.namespace_id = previous;
        }
    }

    fn module_decl(&mut self, _: &TsModuleDecl) {
        self.runtime_bindings_seen = true;
        self.enum_usage_needs_substitution = true;
    }

    fn import_equals(&mut self, node: &TsImportEqualsDecl) {
        self.visit_ts_import_equals_decl(node);
    }

    fn enum_decl(&mut self, node: &TsEnumDecl) {
        self.collect_enum(node);
    }

    fn named_export(&mut self, node: &NamedExport) {
        self.visit_named_export(node);
    }

    fn export_decl(&mut self, node: &ExportDecl) {
        self.collect_export_decl(node);
    }

    fn export_default_expr(&mut self, node: &ExportDefaultExpr) {
        self.collect_export_default_expr(node);
    }
}

impl Visit for SemanticAnalyzer {
    noop_visit_type!();

    fn visit_module(&mut self, node: &Module) {
        self.collect_module(node);
        node.visit_children_with(self);
    }

    fn visit_decl(&mut self, node: &Decl) {
        let prev = self.skip_transform_info;

        if !should_retain_decl(node) {
            self.skip_transform_info = true;
        }

        node.visit_children_with(self);
        self.skip_transform_info = prev;
    }

    fn visit_ident(&mut self, node: &Ident) {
        // Enum substitution needs the later reference walk. Do not collect a
        // second set that would be discarded after evaluating the enums.
        if self.skip_transform_info || (self.enum_seen && self.enum_usage_needs_substitution) {
            return;
        }
        if self
            .import_names
            .as_ref()
            .is_some_and(|names| !names.contains(&node.sym))
        {
            return;
        }
        self.info.usage.insert(node.to_id());
    }

    fn visit_expr(&mut self, node: &Expr) {
        maybe_grow_default(|| node.visit_children_with(self));
    }

    fn visit_binding_ident(&mut self, _: &BindingIdent) {
        // skip
    }

    fn visit_fn_decl(&mut self, node: &FnDecl) {
        // skip function identifier in usage collection
        node.function.visit_with(self);
    }

    fn visit_fn_expr(&mut self, node: &FnExpr) {
        // skip function identifier in usage collection
        node.function.visit_with(self);
    }

    fn visit_class_decl(&mut self, node: &ClassDecl) {
        // skip class identifier in usage collection
        node.class.visit_with(self);
    }

    fn visit_class_expr(&mut self, node: &ClassExpr) {
        // skip class identifier in usage collection
        node.class.visit_with(self);
    }

    fn visit_import_decl(&mut self, _: &ImportDecl) {
        // skip
    }

    fn visit_ts_import_equals_decl(&mut self, node: &TsImportEqualsDecl) {
        self.runtime_bindings_seen = true;
        self.enum_usage_needs_substitution = true;
        if !self.skip_transform_info && node.is_export {
            self.info
                .exported_binding
                .insert(node.id.to_id(), self.namespace_id.clone());
        }

        // Alias roots are dependencies, not ordinary runtime references.
        // The binding graph activates them only when their alias survives.
    }

    fn visit_export_decl(&mut self, node: &ExportDecl) {
        node.visit_children_with(self);
        self.collect_export_decl(node);
    }

    fn visit_export_named_specifier(&mut self, node: &ExportNamedSpecifier) {
        if node.is_type_only {
            return;
        }

        if self.skip_transform_info {
            node.visit_children_with(self);
            return;
        }

        if let ModuleExportName::Ident(ident) = &node.orig {
            self.info
                .exported_binding
                .insert(ident.to_id(), self.namespace_id.clone());
        }

        node.visit_children_with(self);
    }

    fn visit_named_export(&mut self, node: &NamedExport) {
        if node.type_only || node.src.is_some() {
            return;
        }

        node.visit_children_with(self);
    }

    fn visit_export_default_expr(&mut self, node: &ExportDefaultExpr) {
        node.visit_children_with(self);
        self.collect_export_default_expr(node);
    }

    fn visit_ts_namespace_decl(&mut self, node: &TsNamespaceDecl) {
        if self.skip_transform_info {
            node.body.visit_with(self);
            return;
        }

        let namespace_id = self.namespace_id.replace(node.id.to_id());

        node.body.visit_with(self);

        self.namespace_id = namespace_id;
    }

    fn visit_ts_module_decl(&mut self, node: &TsModuleDecl) {
        self.runtime_bindings_seen = true;
        self.enum_usage_needs_substitution = true;
        if self.skip_transform_info {
            if let Some(body) = &node.body {
                body.visit_with(self);
            }
            return;
        }

        let Some(id) = node.id.as_ident().map(Ident::to_id) else {
            if let Some(body) = &node.body {
                body.visit_with(self);
            }
            return;
        };

        let Some(body) = &node.body else {
            return;
        };

        let namespace_id = self.namespace_id.replace(id);

        body.visit_with(self);
        self.namespace_id = namespace_id;
    }

    fn visit_ts_enum_decl(&mut self, node: &TsEnumDecl) {
        self.collect_enum(node);
        node.members.visit_with(self);
    }

    fn visit_jsx_element_name(&mut self, node: &JSXElementName) {
        if matches!(node, JSXElementName::Ident(i) if i.sym.starts_with(|c: char| c.is_ascii_lowercase()))
        {
            return;
        }

        node.visit_children_with(self);
    }
}

#[cfg(test)]
mod tests {
    use swc_common::DUMMY_SP;
    use swc_ecma_ast::{Ident, TsEnumMember, TsEnumMemberId};
    use swc_ecma_parser::Syntax;
    use swc_ecma_transforms_base::resolver;
    use swc_ecma_transforms_testing::Tester;

    use super::*;

    fn namespace_usage(source: &str) -> FxHashSet<swc_atoms::Atom> {
        Tester::run(|tester| {
            let module = tester.with_parser(
                "namespace-aliases.ts",
                Syntax::Typescript(Default::default()),
                source,
                |parser| parser.parse_module(),
            )?;
            let unresolved = Mark::new();
            let top_level = Mark::new();
            let mut program = Program::Module(module);
            program.mutate(resolver(unresolved, top_level, true));
            let info = analyze_program(
                &mut program,
                unresolved,
                FxHashSet::default(),
                false,
                false,
                false,
            );
            Ok(info.usage.into_iter().map(|(name, _)| name).collect())
        })
    }

    #[test]
    fn namespace_block_analyze_import_chain_marks_transitive_usage() {
        let usage = namespace_usage("namespace N { class c {} import b = c; import a = b; a; }");

        assert!(usage.contains(&swc_atoms::Atom::from("b")));
        assert!(usage.contains(&swc_atoms::Atom::from("c")));
    }

    #[test]
    fn namespace_block_merge_from_child_keeps_parent_alias_used() {
        let usage = namespace_usage(
            "namespace N { class n {} import a = n; namespace Child { import b = a; b; } }",
        );

        assert!(usage.contains(&swc_atoms::Atom::from("a")));
    }

    fn enum_member(sym: &str) -> TsEnumMember {
        TsEnumMember {
            span: DUMMY_SP,
            id: TsEnumMemberId::Ident(Ident::new_no_ctxt(sym.into(), DUMMY_SP)),
            init: None,
        }
    }

    #[test]
    fn flow_defaulted_enum_member_uses_member_name_as_runtime_value() {
        let member = enum_member("A");
        let name = crate::shared::enum_member_name(&member.id);
        let value = enums::default_member(&EnumValue::Unknown, &name, true);

        let EnumValue::String(value) = value else {
            panic!("expected defaulted Flow enum member to become a string literal");
        };
        assert_eq!(&*value, "A");
    }

    #[test]
    fn typescript_defaulted_enum_member_still_uses_numeric_sequence() {
        let member = enum_member("A");
        let name = crate::shared::enum_member_name(&member.id);
        let value = enums::default_member(&EnumValue::number(2.0), &name, false);

        let EnumValue::Number(value) = value else {
            panic!("expected defaulted TypeScript enum member to stay numeric");
        };
        assert_eq!(value.value, 2.0);
    }
}
