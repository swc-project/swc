use std::{iter, mem};

use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::Atom;
use swc_common::{
    errors::HANDLER, source_map::PURE_SP, util::take::Take, Mark, Span, Spanned, SyntaxContext,
    DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    alias_ident_for, constructor::inject_after_super, ident::IdentLike, is_literal, member_expr,
    private_ident, quote_ident, quote_str, stack_size::maybe_grow_default, ExprFactory, QueryRef,
    RefRewriter, StmtLikeInjector,
};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

use crate::{
    config::TsImportExportAssignConfig,
    retain::{should_retain_module_item, should_retain_stmt},
    semantic::SemanticInfo,
    shared::enum_member_id_atom,
    ts_enum::{TsEnumRecordKey, TsEnumRecordValue},
    utils::{assign_value_to_this_private_prop, assign_value_to_this_prop, Factory},
};

/// ## This Module will transform all TypeScript specific synatx
///
/// - ### [namespace]/[modules]/[enums]
/// - ### class constructor [parameter properties]
///
///     ```TypeScript
///     class Foo {
///         constructor(public x: number) {
///             // No body necessary
///         }
///     }
///     ```
/// - ### [export and import require]
///
///     ```TypeScript
///     import foo = require("foo");
///     export = foo;
///     ```
///
/// [namespace]: https://www.typescriptlang.org/docs/handbook/namespaces.html
/// [modules]: https://www.typescriptlang.org/docs/handbook/modules.html
/// [enums]: https://www.typescriptlang.org/docs/handbook/enums.html
/// [parameter properties]: https://www.typescriptlang.org/docs/handbook/2/classes.html#parameter-properties
/// [export and import require]: https://www.typescriptlang.org/docs/handbook/modules.html#export--and-import--require
#[derive(Default)]
pub(crate) struct Transform {
    unresolved_ctxt: SyntaxContext,
    top_level_ctxt: SyntaxContext,

    import_export_assign_config: TsImportExportAssignConfig,
    import_not_used_as_values: crate::ImportsNotUsedAsValues,
    ts_enum_is_mutable: bool,
    verbatim_module_syntax: bool,
    native_class_properties: bool,

    semantic: SemanticInfo,

    in_namespace: bool,
    is_lhs: bool,

    ref_rewriter: Option<RefRewriter<ExportQuery>>,

    decl_id_record: FxHashSet<Id>,
    namespace_id: Option<Id>,

    var_list: Vec<Id>,
    export_var_list: Vec<Id>,

    in_class_prop: Vec<Id>,
    in_class_prop_init: Vec<Box<Expr>>,
}

#[allow(clippy::too_many_arguments)]
pub fn transform(
    unresolved_mark: Mark,
    top_level_mark: Mark,
    semantic: SemanticInfo,
    import_not_used_as_values: crate::ImportsNotUsedAsValues,
    import_export_assign_config: TsImportExportAssignConfig,
    ts_enum_is_mutable: bool,
    verbatim_module_syntax: bool,
    native_class_properties: bool,
) -> impl Pass {
    visit_mut_pass(Transform {
        unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
        top_level_ctxt: SyntaxContext::empty().apply_mark(top_level_mark),
        semantic,
        import_not_used_as_values,
        import_export_assign_config,
        ts_enum_is_mutable,
        verbatim_module_syntax,
        native_class_properties,
        ..Default::default()
    })
}

impl VisitMut for Transform {
    noop_visit_mut_type!();

    crate::type_to_none!(visit_mut_opt_ts_type, Box<TsType>);

    crate::type_to_none!(visit_mut_opt_ts_type_ann, Box<TsTypeAnn>);

    crate::type_to_none!(visit_mut_opt_ts_type_param_decl, Box<TsTypeParamDecl>);

    crate::type_to_none!(
        visit_mut_opt_ts_type_param_instantiation,
        Box<TsTypeParamInstantiation>
    );

    fn visit_mut_program(&mut self, node: &mut Program) {
        if !self.semantic.exported_binding.is_empty() {
            self.ref_rewriter = Some(RefRewriter {
                query: ExportQuery {
                    export_name: self.semantic.exported_binding.clone(),
                },
            });
        }
        node.visit_mut_children_with(self);
    }

    fn visit_mut_module(&mut self, node: &mut Module) {
        if !self.verbatim_module_syntax {
            self.strip_module_items_with_semantic(&mut node.body);
        }

        self.visit_mut_for_ts_import_export(node);

        node.visit_mut_children_with(self);

        if !self.export_var_list.is_empty() {
            let decls = self
                .export_var_list
                .take()
                .into_iter()
                .map(id_to_var_declarator)
                .collect();

            node.body.push(
                ExportDecl {
                    decl: VarDecl {
                        decls,
                        ..Default::default()
                    }
                    .into(),
                    span: DUMMY_SP,
                }
                .into(),
            )
        }
    }

    fn visit_mut_module_items(&mut self, node: &mut Vec<ModuleItem>) {
        let var_list = self.var_list.take();
        node.retain(|item| should_retain_module_item(item, self.in_namespace));
        node.retain_mut(|item| {
            let is_empty = item.as_stmt().map(Stmt::is_empty).unwrap_or(false);
            item.visit_mut_with(self);
            // Remove those folded into Empty
            is_empty || !item.as_stmt().map(Stmt::is_empty).unwrap_or(false)
        });
        let var_list = mem::replace(&mut self.var_list, var_list);

        if !var_list.is_empty() {
            let decls = var_list.into_iter().map(id_to_var_declarator).collect();

            node.push(
                VarDecl {
                    decls,
                    ..Default::default()
                }
                .into(),
            )
        }
    }

    fn visit_mut_class_members(&mut self, node: &mut Vec<ClassMember>) {
        let prop_list = self.in_class_prop.take();
        let init_list = self.in_class_prop_init.take();

        node.retain(|member| match member {
            ClassMember::TsIndexSignature(..) => false,
            ClassMember::Constructor(Constructor { body: None, .. }) => false,
            ClassMember::Method(ClassMethod {
                is_abstract,
                function,
                ..
            })
            | ClassMember::PrivateMethod(PrivateMethod {
                is_abstract,
                function,
                ..
            }) => !is_abstract && function.body.is_some(),
            ClassMember::ClassProp(
                ClassProp { declare: true, .. }
                | ClassProp {
                    is_abstract: true, ..
                },
            )
            | ClassMember::AutoAccessor(AutoAccessor {
                is_abstract: true, ..
            }) => false,
            _ => true,
        });

        node.visit_mut_children_with(self);
        let prop_list = mem::replace(&mut self.in_class_prop, prop_list);
        let init_list = mem::replace(&mut self.in_class_prop_init, init_list);

        if !prop_list.is_empty() {
            if self.native_class_properties {
                self.reorder_class_prop_decls(node, prop_list, init_list);
            } else {
                self.reorder_class_prop_decls_and_inits(node, prop_list, init_list);
            }
        }
    }

    fn visit_mut_constructor(&mut self, node: &mut Constructor) {
        node.accessibility = None;

        node.params
            .iter_mut()
            .for_each(|param_or_ts_param_prop| match param_or_ts_param_prop {
                ParamOrTsParamProp::TsParamProp(ts_param_prop) => {
                    let TsParamProp {
                        span,
                        decorators,
                        param,
                        ..
                    } = ts_param_prop;

                    let (pat, expr, id) = match param {
                        TsParamPropParam::Ident(binding_ident) => {
                            let id = binding_ident.to_id();
                            let prop_name = PropName::Ident(IdentName::from(&*binding_ident));
                            let mut value_ident = Ident::from(&*binding_ident);
                            value_ident.optional = false;
                            let value = value_ident.into();

                            (
                                binding_ident.clone().into(),
                                assign_value_to_this_prop(prop_name, value),
                                id,
                            )
                        }
                        TsParamPropParam::Assign(assign_pat) => {
                            let AssignPat { left, .. } = &assign_pat;

                            let Pat::Ident(binding_ident) = &**left else {
                                unreachable!("destructuring pattern inside TsParameterProperty");
                            };

                            let id = binding_ident.id.to_id();
                            let prop_name = PropName::Ident(binding_ident.id.clone().into());
                            let mut value_ident = binding_ident.id.clone();
                            value_ident.optional = false;
                            let value = value_ident.into();

                            (
                                assign_pat.clone().into(),
                                assign_value_to_this_prop(prop_name, value),
                                id,
                            )
                        }
                        #[cfg(swc_ast_unknown)]
                        _ => panic!("unable to access unknown nodes"),
                    };

                    self.in_class_prop.push(id);
                    self.in_class_prop_init.push(expr);

                    *param_or_ts_param_prop = Param {
                        span: *span,
                        decorators: decorators.take(),
                        pat,
                    }
                    .into();
                }
                ParamOrTsParamProp::Param(..) => {}
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            });

        node.params.visit_mut_children_with(self);
        node.body.visit_mut_children_with(self);
    }

    fn visit_mut_stmts(&mut self, node: &mut Vec<Stmt>) {
        let var_list = self.var_list.take();
        node.retain_mut(|stmt| {
            let is_empty = stmt.is_empty();
            stmt.visit_mut_with(self);
            // Remove those folded into Empty
            is_empty || !stmt.is_empty()
        });
        let var_list = mem::replace(&mut self.var_list, var_list);
        if !var_list.is_empty() {
            let decls = var_list.into_iter().map(id_to_var_declarator).collect();
            node.push(
                VarDecl {
                    decls,
                    ..Default::default()
                }
                .into(),
            )
        }

        node.retain(|stmt| !matches!(stmt, Stmt::Empty(empty_stmt) if empty_stmt.span.is_dummy()));
    }

    fn visit_mut_ts_namespace_decl(&mut self, node: &mut TsNamespaceDecl) {
        let id = node.id.to_id();
        let namespace_id = self.namespace_id.replace(id);

        node.body.visit_mut_with(self);

        self.namespace_id = namespace_id;
    }

    fn visit_mut_ts_module_decl(&mut self, node: &mut TsModuleDecl) {
        let id = node.id.to_id();

        let namespace_id = self.namespace_id.replace(id);

        node.body.visit_mut_with(self);

        self.namespace_id = namespace_id;
    }

    fn visit_mut_stmt(&mut self, node: &mut Stmt) {
        if !should_retain_stmt(node) {
            if !node.is_empty() {
                node.take();
            }
            return;
        }

        node.visit_mut_children_with(self);

        let Stmt::Decl(decl) = node else {
            return;
        };

        match self.fold_decl(decl.take(), false) {
            FoldedDecl::Decl(var_decl) => *decl = var_decl,
            FoldedDecl::Expr(stmt) => *node = stmt,
            FoldedDecl::Empty => {
                node.take();
            }
        }
    }

    fn visit_mut_module_item(&mut self, node: &mut ModuleItem) {
        node.visit_mut_children_with(self);

        if let Some(ExportDecl { decl, .. }) = node
            .as_mut_module_decl()
            .and_then(ModuleDecl::as_mut_export_decl)
        {
            match self.fold_decl(decl.take(), true) {
                FoldedDecl::Decl(var_decl) => *decl = var_decl,
                FoldedDecl::Expr(stmt) => *node = stmt.into(),
                FoldedDecl::Empty => {
                    node.take();
                }
            }
        }
    }

    fn visit_mut_export_default_decl(&mut self, node: &mut ExportDefaultDecl) {
        node.visit_mut_children_with(self);

        if let DefaultDecl::Class(ClassExpr {
            ident: Some(ref ident),
            ..
        })
        | DefaultDecl::Fn(FnExpr {
            ident: Some(ref ident),
            ..
        }) = node.decl
        {
            self.decl_id_record.insert(ident.to_id());
        }
    }

    fn visit_mut_export_decl(&mut self, node: &mut ExportDecl) {
        if self.ref_rewriter.is_some() {
            if let Decl::Var(var_decl) = &mut node.decl {
                // visit inner directly to bypass visit_mut_var_declarator
                for decl in var_decl.decls.iter_mut() {
                    decl.name.visit_mut_with(self);
                    decl.init.visit_mut_with(self);
                }
                return;
            }
        }
        node.visit_mut_children_with(self);
    }

    fn visit_mut_prop(&mut self, node: &mut Prop) {
        node.visit_mut_children_with(self);

        if let Some(ref_rewriter) = self.ref_rewriter.as_mut() {
            ref_rewriter.exit_prop(node);
        }
    }

    fn visit_mut_var_declarator(&mut self, n: &mut VarDeclarator) {
        let ref_rewriter = self.ref_rewriter.take();
        n.name.visit_mut_with(self);
        self.ref_rewriter = ref_rewriter;
        n.init.visit_mut_with(self);
    }

    fn visit_mut_pat(&mut self, node: &mut Pat) {
        node.visit_mut_children_with(self);

        if let Some(ref_rewriter) = self.ref_rewriter.as_mut() {
            ref_rewriter.exit_pat(node);
        }
    }

    fn visit_mut_expr(&mut self, node: &mut Expr) {
        while let Expr::TsAs(TsAsExpr { expr, .. })
        | Expr::TsNonNull(TsNonNullExpr { expr, .. })
        | Expr::TsTypeAssertion(TsTypeAssertion { expr, .. })
        | Expr::TsConstAssertion(TsConstAssertion { expr, .. })
        | Expr::TsInstantiation(TsInstantiation { expr, .. })
        | Expr::TsSatisfies(TsSatisfiesExpr { expr, .. }) = node
        {
            *node = *expr.take();
        }

        self.enter_expr_for_inline_enum(node);

        maybe_grow_default(|| node.visit_mut_children_with(self));

        if let Some(ref_rewriter) = self.ref_rewriter.as_mut() {
            ref_rewriter.exit_expr(node);
        }
    }

    fn visit_mut_assign_expr(&mut self, n: &mut AssignExpr) {
        let is_lhs = mem::replace(&mut self.is_lhs, true);
        n.left.visit_mut_with(self);
        self.is_lhs = false;
        n.right.visit_mut_with(self);
        self.is_lhs = is_lhs;
    }

    fn visit_mut_assign_pat(&mut self, n: &mut AssignPat) {
        let is_lhs = mem::replace(&mut self.is_lhs, true);
        n.left.visit_mut_with(self);
        self.is_lhs = false;
        n.right.visit_mut_with(self);
        self.is_lhs = is_lhs;
    }

    fn visit_mut_update_expr(&mut self, n: &mut UpdateExpr) {
        let is_lhs = mem::replace(&mut self.is_lhs, true);
        n.arg.visit_mut_with(self);
        self.is_lhs = is_lhs;
    }

    fn visit_mut_assign_pat_prop(&mut self, n: &mut AssignPatProp) {
        n.key.visit_mut_with(self);
        let is_lhs = mem::replace(&mut self.is_lhs, false);
        n.value.visit_mut_with(self);
        self.is_lhs = is_lhs;
    }

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        let is_lhs = mem::replace(&mut self.is_lhs, false);
        n.visit_mut_children_with(self);
        self.is_lhs = is_lhs;
    }

    fn visit_mut_simple_assign_target(&mut self, node: &mut SimpleAssignTarget) {
        while let SimpleAssignTarget::TsAs(TsAsExpr { expr, .. })
        | SimpleAssignTarget::TsNonNull(TsNonNullExpr { expr, .. })
        | SimpleAssignTarget::TsTypeAssertion(TsTypeAssertion { expr, .. })
        | SimpleAssignTarget::TsInstantiation(TsInstantiation { expr, .. })
        | SimpleAssignTarget::TsSatisfies(TsSatisfiesExpr { expr, .. }) = node
        {
            *node = expr.take().try_into().unwrap();
        }

        node.visit_mut_children_with(self);

        if let Some(ref_rewriter) = self.ref_rewriter.as_mut() {
            ref_rewriter.exit_simple_assign_target(node);
        }
    }

    fn visit_mut_jsx_element_name(&mut self, node: &mut JSXElementName) {
        node.visit_mut_children_with(self);

        if let Some(ref_rewriter) = self.ref_rewriter.as_mut() {
            ref_rewriter.exit_jsx_element_name(node);
        }
    }

    fn visit_mut_jsx_object(&mut self, node: &mut JSXObject) {
        node.visit_mut_children_with(self);

        if let Some(ref_rewriter) = self.ref_rewriter.as_mut() {
            ref_rewriter.exit_jsx_object(node);
        }
    }

    fn visit_mut_object_pat_prop(&mut self, n: &mut ObjectPatProp) {
        n.visit_mut_children_with(self);

        if let Some(ref_rewriter) = self.ref_rewriter.as_mut() {
            ref_rewriter.exit_object_pat_prop(n);
        }
    }

    fn visit_mut_array_pat(&mut self, node: &mut ArrayPat) {
        node.visit_mut_children_with(self);
        node.optional = false;
    }

    fn visit_mut_auto_accessor(&mut self, node: &mut AutoAccessor) {
        node.type_ann = None;
        node.accessibility = None;
        node.definite = false;
        node.is_override = false;
        node.is_abstract = false;
        node.visit_mut_children_with(self);
    }

    fn visit_mut_class(&mut self, node: &mut Class) {
        node.is_abstract = false;
        node.implements.clear();
        node.visit_mut_children_with(self);
    }

    fn visit_mut_class_method(&mut self, node: &mut ClassMethod) {
        node.accessibility = None;
        node.is_override = false;
        node.is_abstract = false;
        node.is_optional = false;
        node.visit_mut_children_with(self);
    }

    fn visit_mut_class_prop(&mut self, node: &mut ClassProp) {
        node.declare = false;
        node.readonly = false;
        node.is_override = false;
        node.is_optional = false;
        node.is_abstract = false;
        node.definite = false;
        node.accessibility = None;
        node.visit_mut_children_with(self);
    }

    fn visit_mut_export_specifiers(&mut self, node: &mut Vec<ExportSpecifier>) {
        node.retain(|specifier| {
            !matches!(
                specifier,
                ExportSpecifier::Named(ExportNamedSpecifier {
                    is_type_only: true,
                    ..
                })
            )
        });
    }

    fn visit_mut_ident(&mut self, node: &mut Ident) {
        node.optional = false;
    }

    fn visit_mut_import_specifiers(&mut self, node: &mut Vec<ImportSpecifier>) {
        node.retain(|specifier| {
            !matches!(
                specifier,
                ImportSpecifier::Named(ImportNamedSpecifier {
                    is_type_only: true,
                    ..
                })
            )
        });
    }

    fn visit_mut_ts_module_block(&mut self, node: &mut TsModuleBlock) {
        let in_namespace = mem::replace(&mut self.in_namespace, true);
        node.visit_mut_children_with(self);
        self.in_namespace = in_namespace;
    }

    fn visit_mut_object_pat(&mut self, node: &mut ObjectPat) {
        node.visit_mut_children_with(self);
        node.optional = false;
    }

    fn visit_mut_params(&mut self, node: &mut Vec<Param>) {
        if node
            .first()
            .filter(|param| {
                matches!(
                    &param.pat,
                    Pat::Ident(BindingIdent {
                        id: Ident { sym, .. },
                        ..
                    }) if &**sym == "this"
                )
            })
            .is_some()
        {
            node.drain(0..1);
        }

        node.visit_mut_children_with(self);
    }

    fn visit_mut_private_method(&mut self, node: &mut PrivateMethod) {
        node.accessibility = None;
        node.is_abstract = false;
        node.is_optional = false;
        node.is_override = false;
        node.visit_mut_children_with(self);
    }

    fn visit_mut_private_prop(&mut self, node: &mut PrivateProp) {
        node.readonly = false;
        node.is_override = false;
        node.is_optional = false;
        node.definite = false;
        node.accessibility = None;
        node.visit_mut_children_with(self);
    }

    fn visit_mut_setter_prop(&mut self, node: &mut SetterProp) {
        node.this_param = None;
        node.visit_mut_children_with(self);
    }

    fn visit_mut_ts_import_equals_decl(&mut self, _: &mut TsImportEqualsDecl) {
        // id should be left intact for runtime rewriting
    }

    fn visit_mut_ts_param_prop(&mut self, node: &mut TsParamProp) {
        node.decorators.visit_mut_with(self);
        node.param.visit_mut_with(self);
    }
}

enum FoldedDecl {
    Empty,
    Decl(Decl),
    Expr(Stmt),
}

impl Transform {
    fn strip_module_items_with_semantic(&self, items: &mut Vec<ModuleItem>) {
        items.retain_mut(|module_item| match module_item {
            ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                specifiers,
                type_only: false,
                ..
            })) if !specifiers.is_empty() => {
                // Match tsc behavior: keep empty original imports, but strip specifiers by
                // usage.
                specifiers.retain(|import_specifier| match import_specifier {
                    ImportSpecifier::Named(named) => {
                        if named.is_type_only {
                            return false;
                        }

                        let id = named.local.to_id();

                        if self.semantic.has_value(&id) {
                            return false;
                        }

                        self.semantic.has_usage(&id)
                    }
                    ImportSpecifier::Default(default) => {
                        let id = default.local.to_id();

                        if self.semantic.has_value(&id) {
                            return false;
                        }

                        self.semantic.has_usage(&id)
                    }
                    ImportSpecifier::Namespace(namespace) => {
                        let id = namespace.local.to_id();

                        if self.semantic.has_value(&id) {
                            return false;
                        }

                        self.semantic.has_usage(&id)
                    }
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                });

                self.import_not_used_as_values == crate::ImportsNotUsedAsValues::Preserve
                    || !specifiers.is_empty()
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                specifiers,
                src,
                type_only: false,
                ..
            })) => {
                specifiers.retain(|export_specifier| match export_specifier {
                    ExportSpecifier::Namespace(..) | ExportSpecifier::Default(..) => true,
                    ExportSpecifier::Named(ExportNamedSpecifier {
                        orig: ModuleExportName::Ident(ident),
                        is_type_only: false,
                        ..
                    }) if src.is_none() => !self.semantic.has_pure_type(&ident.to_id()),
                    ExportSpecifier::Named(ExportNamedSpecifier { is_type_only, .. }) => {
                        !is_type_only
                    }
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                });

                !specifiers.is_empty()
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport { type_only, .. })) => {
                !*type_only
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                expr,
                ..
            })) => expr
                .as_ident()
                .map(|ident| !self.semantic.has_pure_type(&ident.to_id()))
                .unwrap_or(true),
            ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(ts_import_equals_decl)) => {
                if ts_import_equals_decl.is_type_only {
                    return false;
                }

                if ts_import_equals_decl.is_export {
                    return true;
                }

                self.semantic.has_usage(&ts_import_equals_decl.id.to_id())
            }
            ModuleItem::Stmt(Stmt::Decl(Decl::TsModule(ts_module))) if ts_module.body.is_some() => {
                if let Some(body) = &mut ts_module.body {
                    self.strip_namespace_body_with_semantic(body);
                }

                true
            }
            _ => true,
        });
    }

    fn strip_namespace_body_with_semantic(&self, body: &mut TsNamespaceBody) {
        match body {
            TsNamespaceBody::TsModuleBlock(block) => {
                self.strip_namespace_module_items_with_semantic(&mut block.body);

                for module_item in &mut block.body {
                    if let ModuleItem::Stmt(Stmt::Decl(Decl::TsModule(ts_module))) = module_item {
                        if let Some(body) = &mut ts_module.body {
                            self.strip_namespace_body_with_semantic(body);
                        }
                    }
                }
            }
            TsNamespaceBody::TsNamespaceDecl(namespace_decl) => {
                self.strip_namespace_body_with_semantic(&mut namespace_decl.body);
            }
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }

    fn strip_namespace_module_items_with_semantic(&self, items: &mut Vec<ModuleItem>) {
        items.retain(|module_item| match module_item {
            ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(ts_import_equals_decl)) => {
                if ts_import_equals_decl.is_type_only {
                    return false;
                }

                ts_import_equals_decl.is_export
                    || self
                        .semantic
                        .has_namespace_import_equals_usage(ts_import_equals_decl.span)
            }
            _ => true,
        });
    }

    fn fold_decl(&mut self, node: Decl, is_export: bool) -> FoldedDecl {
        match node {
            Decl::TsModule(ts_module) => {
                let id = ts_module.id.to_id();

                if self.decl_id_record.insert(id.clone()) {
                    if is_export {
                        if self.namespace_id.is_none() {
                            self.export_var_list.push(id);
                        }
                    } else {
                        self.var_list.push(id);
                    }
                }

                self.transform_ts_module(*ts_module, is_export)
            }
            Decl::TsEnum(ts_enum) => {
                let id = ts_enum.id.to_id();

                let is_first = self.decl_id_record.insert(id);

                self.transform_ts_enum(*ts_enum, is_first, is_export)
            }
            Decl::Fn(FnDecl { ref ident, .. }) | Decl::Class(ClassDecl { ref ident, .. }) => {
                self.decl_id_record.insert(ident.to_id());
                FoldedDecl::Decl(node)
            }
            decl => FoldedDecl::Decl(decl),
        }
    }
}

struct InitArg<'a> {
    id: &'a Ident,
    namespace_id: Option<&'a Id>,
}

impl InitArg<'_> {
    // {}
    fn empty() -> ExprOrSpread {
        ExprOrSpread {
            spread: None,
            expr: ObjectLit::default().into(),
        }
    }

    // N
    fn get(&self) -> ExprOrSpread {
        self.namespace_id
            .cloned()
            .map_or_else(
                || -> Expr { self.id.clone().into() },
                |namespace_id| namespace_id.make_member(self.id.clone().into()).into(),
            )
            .into()
    }

    // N || {}
    fn or_empty(&self) -> ExprOrSpread {
        let expr = self.namespace_id.cloned().map_or_else(
            || -> Expr { self.id.clone().into() },
            |namespace_id| namespace_id.make_member(self.id.clone().into()).into(),
        );

        let bin = BinExpr {
            op: op!("||"),
            left: expr.into(),
            right: ObjectLit::default().into(),
            ..Default::default()
        };

        ExprOrSpread {
            spread: None,
            expr: bin.into(),
        }
    }

    // N || (N = {})
    fn or_assign_empty(&self) -> ExprOrSpread {
        let expr = self.namespace_id.cloned().map_or_else(
            || -> Expr { self.id.clone().into() },
            |namespace_id| namespace_id.make_member(self.id.clone().into()).into(),
        );

        let assign = self.namespace_id.cloned().map_or_else(
            || ObjectLit::default().make_assign_to(op!("="), self.id.clone().into()),
            |namespace_id| {
                ObjectLit::default().make_assign_to(
                    op!("="),
                    namespace_id.make_member(self.id.clone().into()).into(),
                )
            },
        );

        let bin = BinExpr {
            op: op!("||"),
            left: expr.into(),
            right: assign.into(),
            ..Default::default()
        };

        ExprOrSpread {
            spread: None,
            expr: bin.into(),
        }
    }
}

impl Transform {
    fn transform_ts_enum(
        &mut self,
        ts_enum: TsEnumDecl,
        is_first: bool,
        is_export: bool,
    ) -> FoldedDecl {
        let TsEnumDecl {
            span,
            declare,
            is_const,
            id,
            members,
        } = ts_enum;

        debug_assert!(!declare);

        let ts_enum_safe_remove = !self.verbatim_module_syntax
            && is_const
            && !is_export
            && !self.semantic.exported_binding.contains_key(&id.to_id());

        let member_list: Vec<_> = members
            .into_iter()
            .map(|m| {
                let span = m.span;
                let name = enum_member_id_atom(&m.id);

                let key = TsEnumRecordKey {
                    enum_id: id.to_id(),
                    member_name: name.clone(),
                };

                let value = self.semantic.enum_record.get(&key).unwrap().clone();

                EnumMemberItem { span, name, value }
            })
            .filter(|m| !ts_enum_safe_remove || !m.is_const())
            .collect();

        if member_list.is_empty() && is_const {
            return FoldedDecl::Empty;
        }

        let opaque = member_list
            .iter()
            .any(|item| matches!(item.value, TsEnumRecordValue::Opaque(..)));

        let stmts = member_list
            .into_iter()
            .filter(|item| !ts_enum_safe_remove || !item.is_const())
            .map(|item| item.build_assign(&id.to_id()));

        let namespace_export = self.namespace_id.is_some() && is_export;
        let iife = !is_first || namespace_export;

        let body = if !iife {
            let return_stmt: Stmt = ReturnStmt {
                arg: Some(id.clone().into()),
                ..Default::default()
            }
            .into();

            let stmts = stmts.chain(iter::once(return_stmt)).collect();

            BlockStmt {
                stmts,
                ..Default::default()
            }
        } else {
            BlockStmt {
                stmts: stmts.collect(),
                ..Default::default()
            }
        };

        let var_kind = if is_export || id.ctxt == self.top_level_ctxt {
            VarDeclKind::Var
        } else {
            VarDeclKind::Let
        };

        let init_arg = 'init_arg: {
            let init_arg = InitArg {
                id: &id,
                namespace_id: self.namespace_id.as_ref().filter(|_| is_export),
            };
            if !is_first {
                break 'init_arg init_arg.get();
            }

            if namespace_export {
                break 'init_arg init_arg.or_assign_empty();
            }

            if is_export || var_kind == VarDeclKind::Let {
                InitArg::empty()
            } else {
                init_arg.or_empty()
            }
        };

        let expr = Factory::function(vec![id.clone().into()], body).as_call(
            if iife || opaque { DUMMY_SP } else { PURE_SP },
            vec![init_arg],
        );

        if iife {
            FoldedDecl::Expr(
                ExprStmt {
                    span,
                    expr: expr.into(),
                }
                .into(),
            )
        } else {
            let var_declarator = VarDeclarator {
                span,
                name: id.into(),
                init: Some(expr.into()),
                definite: false,
            };

            FoldedDecl::Decl(
                VarDecl {
                    span,
                    kind: var_kind,
                    decls: vec![var_declarator],
                    ..Default::default()
                }
                .into(),
            )
        }
    }
}

impl Transform {
    fn transform_ts_module(&self, ts_module: TsModuleDecl, is_export: bool) -> FoldedDecl {
        debug_assert!(!ts_module.declare);
        debug_assert!(!ts_module.global);

        let TsModuleDecl {
            span,
            id: TsModuleName::Ident(module_ident),
            body: Some(body),
            ..
        } = ts_module
        else {
            unreachable!();
        };

        let body = Self::transform_ts_namespace_body(module_ident.to_id(), body);

        let init_arg = InitArg {
            id: &module_ident,
            namespace_id: self.namespace_id.as_ref().filter(|_| is_export),
        }
        .or_assign_empty();

        let expr = Factory::function(vec![module_ident.clone().into()], body)
            .as_call(DUMMY_SP, vec![init_arg])
            .into();

        FoldedDecl::Expr(ExprStmt { span, expr }.into())
    }

    fn transform_ts_namespace_body(id: Id, body: TsNamespaceBody) -> BlockStmt {
        let TsNamespaceDecl {
            span,
            declare,
            global,
            id: local_name,
            body,
        } = match body {
            TsNamespaceBody::TsModuleBlock(ts_module_block) => {
                return Self::transform_ts_module_block(id, ts_module_block);
            }
            TsNamespaceBody::TsNamespaceDecl(ts_namespace_decl) => ts_namespace_decl,
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        };

        debug_assert!(!declare);
        debug_assert!(!global);

        let body = Self::transform_ts_namespace_body(local_name.to_id(), *body);

        let init_arg = InitArg {
            id: &local_name,
            namespace_id: Some(&id.to_id()),
        }
        .or_assign_empty();

        let expr =
            Factory::function(vec![local_name.into()], body).as_call(DUMMY_SP, vec![init_arg]);

        BlockStmt {
            span,
            stmts: vec![expr.into_stmt()],
            ..Default::default()
        }
    }

    /// Note:
    /// All exported variable declarations are transformed into assignment to
    /// the namespace. All references to the exported binding will be
    /// replaced with qualified access to the namespace property.
    ///
    /// Exported function and class will be treat as const exported which is in
    /// line with how the TypeScript compiler handles exports.
    ///
    /// Inline exported syntax should not be used with function which will lead
    /// to issues with function hoisting.
    ///
    /// Input:
    /// ```TypeScript
    /// export const foo = init, { bar: baz = init } = init;
    ///
    /// export function a() {}
    ///
    /// export let b = init;
    /// ```
    ///
    /// Output:
    /// ```TypeScript
    /// NS.foo = init, { bar: NS.baz = init } = init;
    ///
    /// function a() {}
    /// NS.a = a;
    ///
    /// NS.b = init;
    /// ```
    fn transform_ts_module_block(id: Id, TsModuleBlock { span, body }: TsModuleBlock) -> BlockStmt {
        let mut stmts = Vec::new();

        for module_item in body {
            match module_item {
                ModuleItem::Stmt(stmt) => stmts.push(stmt),
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl, span, ..
                })) => match decl {
                    Decl::Class(ClassDecl { ref ident, .. })
                    | Decl::Fn(FnDecl { ref ident, .. }) => {
                        let assign_stmt = Self::assign_prop(&id, ident, span);
                        stmts.push(decl.into());
                        stmts.push(assign_stmt);
                    }
                    Decl::Var(var_decl) => {
                        let mut exprs: Vec<Box<_>> = var_decl
                            .decls
                            .into_iter()
                            .flat_map(
                                |VarDeclarator {
                                     span, name, init, ..
                                 }| {
                                    let right = init?;
                                    let left = name.try_into().unwrap();

                                    Some(
                                        AssignExpr {
                                            span,
                                            left,
                                            op: op!("="),
                                            right,
                                        }
                                        .into(),
                                    )
                                },
                            )
                            .collect();

                        if exprs.is_empty() {
                            continue;
                        }

                        let expr = if exprs.len() == 1 {
                            exprs.pop().unwrap()
                        } else {
                            SeqExpr {
                                span: DUMMY_SP,
                                exprs,
                            }
                            .into()
                        };

                        stmts.push(
                            ExprStmt {
                                span: var_decl.span,
                                expr,
                            }
                            .into(),
                        );
                    }
                    decl => unreachable!("{decl:?}"),
                },
                ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(decl)) => {
                    match decl.module_ref {
                        TsModuleRef::TsEntityName(ts_entity_name) => {
                            let init = Self::ts_entity_name_to_expr(ts_entity_name);

                            // export impot foo = bar.baz
                            let stmt = if decl.is_export {
                                // Foo.foo = bar.baz
                                let left = id.clone().make_member(decl.id.clone().into());
                                let expr = init.make_assign_to(op!("="), left.into());

                                ExprStmt {
                                    span: decl.span,
                                    expr: expr.into(),
                                }
                                .into()
                            } else {
                                // const foo = bar.baz
                                let mut var_decl =
                                    init.into_var_decl(VarDeclKind::Const, decl.id.clone().into());

                                var_decl.span = decl.span;

                                var_decl.into()
                            };

                            stmts.push(stmt);
                        }
                        TsModuleRef::TsExternalModuleRef(..) => {
                            // TS1147
                            if HANDLER.is_set() {
                                HANDLER.with(|handler| {
                                    handler
                                    .struct_span_err(
                                        decl.span,
                                        r#"Import declarations in a namespace cannot reference a module."#,
                                    )
                                    .emit();
                                });
                            }
                        }
                        #[cfg(swc_ast_unknown)]
                        _ => panic!("unable to access unknown nodes"),
                    }
                }
                item => {
                    if HANDLER.is_set() {
                        HANDLER.with(|handler| {
                            handler
                                .struct_span_err(
                                    item.span(),
                                    r#"ESM-style module declarations are not permitted in a namespace."#,
                                )
                                .emit();
                        });
                    }
                }
            }
        }

        BlockStmt {
            span,
            stmts,
            ..Default::default()
        }
    }
}

impl Transform {
    fn reorder_class_prop_decls_and_inits(
        &mut self,
        class_member_list: &mut Vec<ClassMember>,
        prop_list: Vec<Id>,
        mut init_list: Vec<Box<Expr>>,
    ) {
        let mut constructor = None;
        let mut cons_index = 0;
        for (index, member) in class_member_list.iter_mut().enumerate() {
            match member {
                ClassMember::Constructor(..) => {
                    let empty = EmptyStmt {
                        span: member.span(),
                    }
                    .into();
                    constructor = mem::replace(member, empty).constructor();
                    cons_index = index;
                }
                ClassMember::ClassProp(ClassProp {
                    key,
                    value: value @ Some(..),
                    is_static: false,
                    span,
                    ..
                }) => {
                    let key = match &mut *key {
                        PropName::Computed(ComputedPropName { span, expr })
                            if !is_literal(expr) =>
                        {
                            let ident = alias_ident_for(expr, "_key");

                            self.var_list.push(ident.to_id());

                            **expr = expr.take().make_assign_to(op!("="), ident.clone().into());

                            PropName::Computed(ComputedPropName {
                                span: *span,
                                expr: ident.into(),
                            })
                        }
                        _ => key.clone(),
                    };

                    let mut init = assign_value_to_this_prop(key, *value.take().unwrap());
                    init.set_span(*span);

                    init_list.push(init);
                }
                ClassMember::PrivateProp(PrivateProp {
                    key,
                    value: value @ Some(..),
                    is_static: false,
                    span,
                    ..
                }) => {
                    let mut init =
                        assign_value_to_this_private_prop(key.clone(), *value.take().unwrap());
                    init.set_span(*span);
                    init_list.push(init);
                }
                _ => {}
            }
        }

        if let Some(mut constructor) = constructor {
            inject_after_super(&mut constructor, init_list);

            if let Some(c) = class_member_list
                .get_mut(cons_index)
                .filter(|m| m.is_empty() && m.span() == constructor.span)
            {
                *c = constructor.into();
            } else {
                class_member_list.push(constructor.into());
            }
        }

        class_member_list.splice(
            0..0,
            prop_list
                .into_iter()
                .map(Ident::from)
                .map(PropName::from)
                .map(|key| ClassProp {
                    key,
                    ..Default::default()
                })
                .map(ClassMember::ClassProp),
        );
    }

    fn reorder_class_prop_decls(
        &mut self,
        class_member_list: &mut Vec<ClassMember>,
        prop_list: Vec<Id>,
        init_list: Vec<Box<Expr>>,
    ) {
        if let Some(constructor) = class_member_list
            .iter_mut()
            .find_map(|m| m.as_mut_constructor())
        {
            inject_after_super(constructor, init_list);
        }

        class_member_list.splice(
            0..0,
            prop_list
                .into_iter()
                .map(Ident::from)
                .map(PropName::from)
                .map(|key| ClassProp {
                    key,
                    ..Default::default()
                })
                .map(ClassMember::ClassProp),
        );
    }
}

impl Transform {
    // Foo.x = x;
    fn assign_prop(id: &Id, prop: &Ident, span: Span) -> Stmt {
        let expr = prop
            .clone()
            .make_assign_to(op!("="), id.clone().make_member(prop.clone().into()).into());

        ExprStmt {
            span,
            expr: expr.into(),
        }
        .into()
    }

    fn ts_entity_name_to_expr(n: TsEntityName) -> Expr {
        match n {
            TsEntityName::Ident(i) => i.into(),
            TsEntityName::TsQualifiedName(q) => {
                let TsQualifiedName { span, left, right } = *q;

                MemberExpr {
                    span,
                    obj: Box::new(Self::ts_entity_name_to_expr(left)),
                    prop: MemberProp::Ident(right),
                }
                .into()
            }
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}

impl Transform {
    fn enter_expr_for_inline_enum(&mut self, node: &mut Expr) {
        if self.is_lhs {
            return;
        }

        if let Expr::Member(MemberExpr { obj, prop, .. }) = node {
            let Some(enum_id) = get_enum_id(obj) else {
                return;
            };

            if self.ts_enum_is_mutable && !self.semantic.const_enum.contains(&enum_id) {
                return;
            }

            let Some(member_name) = get_member_key(prop) else {
                return;
            };

            let key = TsEnumRecordKey {
                enum_id,
                member_name,
            };

            let Some(value) = self.semantic.enum_record.get(&key) else {
                return;
            };

            if value.is_const() {
                *node = value.clone().into();
            }
        }
    }

    fn visit_mut_for_ts_import_export(&mut self, node: &mut Module) {
        let mut should_inject = false;
        let create_require = private_ident!("_createRequire");
        let require = private_ident!("__require");

        // NOTE: This is not correct!
        // However, all unresolved_span are used in TsImportExportAssignConfig::Classic
        // which is deprecated and not used in real world.
        let unresolved_ctxt = self.unresolved_ctxt;
        let cjs_require = quote_ident!(unresolved_ctxt, "require");
        let cjs_exports = quote_ident!(unresolved_ctxt, "exports");

        let mut cjs_export_assign = None;

        for module_item in &mut node.body {
            match module_item {
                ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(decl)) if !decl.is_type_only => {
                    debug_assert_ne!(
                        decl.id.ctxt, self.unresolved_ctxt,
                        "TsImportEquals has top-level context and it should not be identical to \
                         the unresolved mark"
                    );
                    debug_assert_eq!(decl.id.ctxt, self.top_level_ctxt);

                    match &mut decl.module_ref {
                        // import foo = bar.baz
                        TsModuleRef::TsEntityName(ts_entity_name) => {
                            let init = Self::ts_entity_name_to_expr(ts_entity_name.clone());

                            let mut var_decl =
                                init.into_var_decl(VarDeclKind::Const, decl.id.take().into());

                            *module_item = if decl.is_export {
                                ExportDecl {
                                    span: decl.span,
                                    decl: var_decl.into(),
                                }
                                .into()
                            } else {
                                var_decl.span = decl.span;
                                var_decl.into()
                            };
                        }
                        // import foo = require("foo")
                        TsModuleRef::TsExternalModuleRef(TsExternalModuleRef { expr, .. }) => {
                            match self.import_export_assign_config {
                                TsImportExportAssignConfig::Classic => {
                                    // require("foo");
                                    let mut init = cjs_require
                                        .clone()
                                        .as_call(DUMMY_SP, vec![expr.take().as_arg()]);

                                    // exports.foo = require("foo");
                                    if decl.is_export {
                                        init = init.make_assign_to(
                                            op!("="),
                                            cjs_exports
                                                .clone()
                                                .make_member(decl.id.clone().into())
                                                .into(),
                                        )
                                    }

                                    // const foo = require("foo");
                                    // const foo = exports.foo = require("foo");
                                    let mut var_decl = init
                                        .into_var_decl(VarDeclKind::Const, decl.id.take().into());
                                    var_decl.span = decl.span;

                                    *module_item = var_decl.into();
                                }
                                TsImportExportAssignConfig::Preserve => {}
                                TsImportExportAssignConfig::NodeNext => {
                                    should_inject = true;

                                    let mut var_decl = require
                                        .clone()
                                        .as_call(DUMMY_SP, vec![expr.take().as_arg()])
                                        .into_var_decl(VarDeclKind::Const, decl.id.take().into());

                                    *module_item = if decl.is_export {
                                        ExportDecl {
                                            span: decl.span,
                                            decl: var_decl.into(),
                                        }
                                        .into()
                                    } else {
                                        var_decl.span = decl.span;
                                        var_decl.into()
                                    };
                                }
                                TsImportExportAssignConfig::EsNext => {
                                    // TS1202
                                    if HANDLER.is_set() {
                                        HANDLER.with(|handler| {
                                            handler.struct_span_err(
                                                decl.span,
                                                r#"Import assignment cannot be used when targeting ECMAScript modules. Consider using `import * as ns from "mod"`, `import {a} from "mod"`, `import d from "mod"`, or another module format instead."#,
                                            )
                                            .emit();
                                        });
                                    }
                                }
                            }
                        }
                        #[cfg(swc_ast_unknown)]
                        _ => panic!("unable to access unknown nodes"),
                    }
                }
                ModuleItem::ModuleDecl(ModuleDecl::TsExportAssignment(..)) => {
                    let ts_export_assign = module_item
                        .take()
                        .module_decl()
                        .unwrap()
                        .ts_export_assignment()
                        .unwrap();

                    cjs_export_assign.get_or_insert(ts_export_assign);
                }
                _ => {}
            }
        }

        if should_inject {
            node.body.prepend_stmts([
                // import { createRequire } from "module";
                ImportDecl {
                    span: DUMMY_SP,
                    specifiers: vec![ImportNamedSpecifier {
                        span: DUMMY_SP,
                        local: create_require.clone(),
                        imported: Some(quote_ident!("createRequire").into()),
                        is_type_only: false,
                    }
                    .into()],
                    src: Box::new(quote_str!("module")),
                    type_only: false,
                    with: None,
                    phase: Default::default(),
                }
                .into(),
                // const __require = _createRequire(import.meta.url);
                create_require
                    .as_call(
                        DUMMY_SP,
                        vec![MetaPropExpr {
                            span: DUMMY_SP,
                            kind: MetaPropKind::ImportMeta,
                        }
                        .make_member(quote_ident!("url"))
                        .as_arg()],
                    )
                    .into_var_decl(VarDeclKind::Const, require.clone().into())
                    .into(),
            ]);
        }

        if let Some(cjs_export_assign) = cjs_export_assign {
            match self.import_export_assign_config {
                TsImportExportAssignConfig::Classic => {
                    let TsExportAssignment { expr, span } = cjs_export_assign;

                    let stmt = ExprStmt {
                        span,
                        expr: Box::new(
                            expr.make_assign_to(
                                op!("="),
                                member_expr!(unresolved_ctxt, Default::default(), module.exports)
                                    .into(),
                            ),
                        ),
                    }
                    .into();

                    if let Some(item) = node
                        .body
                        .last_mut()
                        .and_then(ModuleItem::as_mut_stmt)
                        .filter(|stmt| stmt.is_empty())
                    {
                        *item = stmt;
                    } else {
                        node.body.push(stmt.into());
                    }
                }
                TsImportExportAssignConfig::Preserve => {
                    node.body.push(cjs_export_assign.into());
                }
                TsImportExportAssignConfig::NodeNext | TsImportExportAssignConfig::EsNext => {
                    // TS1203
                    if HANDLER.is_set() {
                        HANDLER.with(|handler| {
                            handler
                                .struct_span_err(
                                    cjs_export_assign.span,
                                    r#"Export assignment cannot be used when targeting ECMAScript modules. Consider using `export default` or another module format instead."#,
                                )
                                .emit()
                        });
                    }
                }
            }
        }
    }
}

struct ExportQuery {
    export_name: FxHashMap<Id, Option<Id>>,
}

impl QueryRef for ExportQuery {
    fn query_ref(&self, export_name: &Ident) -> Option<Box<Expr>> {
        self.export_name
            .get(&export_name.to_id())?
            .clone()
            .map(|namespace_id| namespace_id.make_member(export_name.clone().into()).into())
    }

    fn query_lhs(&self, ident: &Ident) -> Option<Box<Expr>> {
        self.query_ref(ident)
    }

    fn query_jsx(&self, ident: &Ident) -> Option<JSXElementName> {
        self.export_name
            .get(&ident.to_id())?
            .clone()
            .map(|namespace_id| {
                JSXMemberExpr {
                    span: DUMMY_SP,
                    obj: JSXObject::Ident(namespace_id.into()),
                    prop: ident.clone().into(),
                }
                .into()
            })
    }
}

struct EnumMemberItem {
    span: Span,
    name: Atom,
    value: TsEnumRecordValue,
}

impl EnumMemberItem {
    fn is_const(&self) -> bool {
        self.value.is_const()
    }

    fn build_assign(self, enum_id: &Id) -> Stmt {
        let is_string = self.value.is_string();
        let value: Expr = self.value.into();

        let inner_assign = value.make_assign_to(
            op!("="),
            Ident::from(enum_id.clone())
                .computed_member(self.name.clone())
                .into(),
        );

        let outer_assign = if is_string {
            inner_assign
        } else {
            let value: Expr = self.name.clone().into();

            value.make_assign_to(
                op!("="),
                Ident::from(enum_id.clone())
                    .computed_member(inner_assign)
                    .into(),
            )
        };

        ExprStmt {
            span: self.span,
            expr: outer_assign.into(),
        }
        .into()
    }
}

trait ModuleId {
    fn to_id(&self) -> Id;
}

impl ModuleId for TsModuleName {
    fn to_id(&self) -> Id {
        self.as_ident()
            .expect("Only ambient modules can use quoted names.")
            .to_id()
    }
}

fn id_to_var_declarator(id: Id) -> VarDeclarator {
    VarDeclarator {
        span: DUMMY_SP,
        name: id.into(),
        init: None,
        definite: false,
    }
}

fn get_enum_id(e: &Expr) -> Option<Id> {
    if let Expr::Ident(ident) = e {
        Some(ident.to_id())
    } else {
        None
    }
}

fn get_member_key(prop: &MemberProp) -> Option<Atom> {
    match prop {
        MemberProp::Ident(ident) => Some(ident.sym.clone()),
        MemberProp::Computed(ComputedPropName { expr, .. }) => match &**expr {
            Expr::Lit(Lit::Str(Str { value, .. })) => Some(value.to_atom_lossy().into_owned()),
            Expr::Tpl(Tpl { exprs, quasis, .. }) => match (exprs.len(), quasis.len()) {
                (0, 1) => quasis[0]
                    .cooked
                    .as_ref()
                    .map(|cooked| cooked.to_atom_lossy().into_owned())
                    .or_else(|| Some(quasis[0].raw.clone())),
                _ => None,
            },
            _ => None,
        },
        MemberProp::PrivateName(_) => None,
        #[cfg(swc_ast_unknown)]
        _ => panic!("unable to access unknown nodes"),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn get_member_key_resolves_template_literal_without_expressions() {
        let member_prop = MemberProp::Computed(ComputedPropName {
            span: DUMMY_SP,
            expr: Box::new(Expr::Tpl(Tpl {
                span: DUMMY_SP,
                exprs: vec![],
                quasis: vec![TplElement {
                    span: DUMMY_SP,
                    tail: true,
                    cooked: Some("foo".into()),
                    raw: "foo".into(),
                }],
            })),
        });

        assert_eq!(get_member_key(&member_prop), Some("foo".into()));
    }
}
