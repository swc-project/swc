use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::Atom;
use swc_common::{Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_pat_ids, stack_size::maybe_grow_default};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use crate::{
    strip_type::IsConcrete,
    ts_enum::{EnumValueComputer, TsEnumRecord, TsEnumRecordKey, TsEnumRecordValue},
};

#[derive(Debug, Default)]
pub(crate) struct SemanticInfo {
    pub usage: FxHashSet<Id>,
    pub id_type: FxHashSet<Id>,
    pub id_value: FxHashSet<Id>,
    pub exported_binding: FxHashMap<Id, Option<Id>>,
    pub enum_record: TsEnumRecord,
    pub const_enum: FxHashSet<Id>,
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
}

pub(crate) fn analyze_program(
    program: &Program,
    unresolved_mark: Mark,
    seed_usage: FxHashSet<Id>,
) -> SemanticInfo {
    let mut analyzer = SemanticAnalyzer {
        unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
        info: SemanticInfo {
            usage: seed_usage,
            ..Default::default()
        },
        import_chain: Default::default(),
        namespace_id: None,
        skip_transform_info: false,
    };

    program.visit_with(&mut analyzer);

    analyzer.finish()
}

struct SemanticAnalyzer {
    unresolved_ctxt: SyntaxContext,
    info: SemanticInfo,
    import_chain: FxHashMap<Id, Id>,
    namespace_id: Option<Id>,
    skip_transform_info: bool,
}

impl SemanticAnalyzer {
    fn finish(mut self) -> SemanticInfo {
        self.analyze_import_chain();
        self.info
    }

    fn analyze_import_chain(&mut self) {
        if self.import_chain.is_empty() {
            return;
        }

        let mut new_usage = FxHashSet::default();
        for id in &self.info.usage {
            let mut next = self.import_chain.remove(id);

            while let Some(id) = next {
                next = self.import_chain.remove(&id);
                new_usage.insert(id);
            }

            if self.import_chain.is_empty() {
                break;
            }
        }

        self.info.usage.extend(new_usage);
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
                self.info.id_value.insert(ts_enum_decl.id.to_id());
            }
            Decl::TsModule(ts_module_decl) => {
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

    fn transform_ts_enum_member(
        member: TsEnumMember,
        enum_id: &Id,
        default_init: &TsEnumRecordValue,
        record: &TsEnumRecord,
        unresolved_ctxt: SyntaxContext,
    ) -> TsEnumRecordValue {
        member
            .init
            .map(|expr| {
                EnumValueComputer {
                    enum_id,
                    unresolved_ctxt,
                    record,
                }
                .compute(expr)
            })
            .filter(TsEnumRecordValue::has_value)
            .unwrap_or_else(|| default_init.clone())
    }
}

impl Visit for SemanticAnalyzer {
    noop_visit_type!();

    fn visit_module(&mut self, node: &Module) {
        for item in &node.body {
            self.collect_top_level_module_item(item);
        }

        node.visit_children_with(self);
    }

    fn visit_decl(&mut self, node: &Decl) {
        let prev = self.skip_transform_info;

        if !should_retain_decl_for_transform(node) {
            self.skip_transform_info = true;
        }

        node.visit_children_with(self);
        self.skip_transform_info = prev;
    }

    fn visit_ident(&mut self, node: &Ident) {
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
        if !self.skip_transform_info && node.is_export {
            self.info
                .exported_binding
                .insert(node.id.to_id(), self.namespace_id.clone());
        }

        if node.is_type_only {
            return;
        }

        let TsModuleRef::TsEntityName(ts_entity_name) = &node.module_ref else {
            return;
        };

        let id = get_module_ident(ts_entity_name);

        if node.is_export {
            id.visit_with(self);
            node.id.visit_with(self);
            return;
        }

        self.import_chain.insert(node.id.to_id(), id.to_id());
    }

    fn visit_export_decl(&mut self, node: &ExportDecl) {
        node.visit_children_with(self);

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

        if self.skip_transform_info {
            return;
        }

        if let Expr::Ident(ident) = &*node.expr {
            self.info
                .exported_binding
                .insert(ident.to_id(), self.namespace_id.clone());
        }
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
        node.visit_children_with(self);

        if self.skip_transform_info {
            return;
        }

        let TsEnumDecl {
            is_const,
            id,
            members,
            ..
        } = node;

        if *is_const {
            self.info.const_enum.insert(id.to_id());
        }

        let mut default_init = 0.0.into();

        for member in members {
            let value = Self::transform_ts_enum_member(
                member.clone(),
                &id.to_id(),
                &default_init,
                &self.info.enum_record,
                self.unresolved_ctxt,
            );

            default_init = value.inc();

            let member_name = enum_member_id_atom(&member.id);
            let key = TsEnumRecordKey {
                enum_id: id.to_id(),
                member_name,
            };

            self.info.enum_record.insert(key, value);
        }
    }

    fn visit_jsx_element_name(&mut self, node: &JSXElementName) {
        if matches!(node, JSXElementName::Ident(i) if i.sym.starts_with(|c: char| c.is_ascii_lowercase()))
        {
            return;
        }

        node.visit_children_with(self);
    }
}

fn should_retain_decl_for_transform(decl: &Decl) -> bool {
    if is_declare_decl(decl) {
        return false;
    }

    decl.is_concrete()
}

fn is_declare_decl(decl: &Decl) -> bool {
    match decl {
        Decl::Class(class_decl) => class_decl.declare,
        Decl::Fn(function_decl) => function_decl.declare,
        Decl::Var(var_decl) => var_decl.declare,
        Decl::Using(..) => false,
        Decl::TsInterface(..) | Decl::TsTypeAlias(..) => true,
        Decl::TsEnum(ts_enum_decl) => ts_enum_decl.declare,
        Decl::TsModule(ts_module_decl) => ts_module_decl.declare || ts_module_decl.global,
        #[cfg(swc_ast_unknown)]
        _ => panic!("unable to access unknown nodes"),
    }
}

#[inline]
fn enum_member_id_atom(id: &TsEnumMemberId) -> Atom {
    match id {
        TsEnumMemberId::Ident(ident) => ident.sym.clone(),
        TsEnumMemberId::Str(str_lit) => str_lit.value.to_atom_lossy().into_owned(),
        #[cfg(swc_ast_unknown)]
        _ => panic!("unable to access unknown nodes"),
    }
}

fn get_module_ident(ts_entity_name: &TsEntityName) -> &Ident {
    match ts_entity_name {
        TsEntityName::TsQualifiedName(ts_qualified_name) => {
            get_module_ident(&ts_qualified_name.left)
        }
        TsEntityName::Ident(ident) => ident,
        #[cfg(swc_ast_unknown)]
        _ => panic!("unable to access unknown nodes"),
    }
}
