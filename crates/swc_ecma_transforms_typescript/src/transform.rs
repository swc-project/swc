use std::{
    iter,
    mem::{self, take},
    vec,
};

use swc_atoms::JsWord;
use swc_common::{
    collections::AHashSet, errors::HANDLER, util::take::Take, Mark, Span, Spanned, SyntaxContext,
    DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    alias_ident_for, constructor::inject_after_super, find_pat_ids, is_literal, member_expr,
    private_ident, quote_ident, quote_str, stack_size::maybe_grow_default, ExprFactory, QueryRef,
    RefRewriter,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

use crate::{
    config::TsImportExportAssignConfig,
    ts_enum::{EnumValueComputer, InlineEnum, TsEnumRecord, TsEnumRecordKey, TsEnumRecordValue},
    utils::{
        assign_value_to_this_private_prop, assign_value_to_this_prop, AsCollapsibleDecl,
        AsEnumOrModule, Factory, VecStmtLike,
    },
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
#[derive(Debug, Default)]
pub(crate) struct Transform {
    top_level_mark: Mark,
    top_level_ctxt: SyntaxContext,

    import_export_assign_config: TsImportExportAssignConfig,
    ts_enum_is_mutable: bool,
    verbatim_module_syntax: bool,

    namespace_id: Option<Id>,
    record: TsEnumRecord,

    in_class_prop: Vec<Id>,
    in_class_prop_init: Vec<Box<Expr>>,
    class_prop_decls: Vec<VarDeclarator>,
}

pub fn transform(
    top_level_mark: Mark,
    import_export_assign_config: TsImportExportAssignConfig,
    ts_enum_is_mutable: bool,
    verbatim_module_syntax: bool,
) -> impl Fold + VisitMut {
    as_folder(Transform {
        top_level_mark,
        top_level_ctxt: SyntaxContext::empty().apply_mark(top_level_mark),
        import_export_assign_config,
        ts_enum_is_mutable,
        verbatim_module_syntax,
        ..Default::default()
    })
}

impl VisitMut for Transform {
    noop_visit_mut_type!();

    fn visit_mut_program(&mut self, n: &mut Program) {
        n.visit_mut_children_with(self);

        if !self.record.is_empty() {
            let record = mem::take(&mut self.record);
            n.visit_mut_children_with(&mut InlineEnum::new(record));
        }
    }

    fn visit_mut_module(&mut self, n: &mut Module) {
        self.visit_mut_for_ts_import_export(n);

        n.visit_mut_children_with(self);
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        for mut item in n.take() {
            let decls = self.class_prop_decls.take();
            item.visit_mut_with(self);
            let decls = mem::replace(&mut self.class_prop_decls, decls);
            if !decls.is_empty() {
                n.push(
                    VarDecl {
                        span: DUMMY_SP,
                        declare: false,
                        decls,
                        kind: VarDeclKind::Let,
                        ..Default::default()
                    }
                    .into(),
                );
            }
            n.push(item);
        }

        // We use post-order traversal to ensure that there are no ts-things in the
        // children of a node, since we have already transformed them.

        self.visit_mut_module_items_for_enum_or_module(n);
    }

    fn visit_mut_class_members(&mut self, n: &mut Vec<ClassMember>) {
        let prop_list = self.in_class_prop.take();
        let init_list = self.in_class_prop_init.take();

        n.visit_mut_children_with(self);
        let prop_list = mem::replace(&mut self.in_class_prop, prop_list);
        let init_list = mem::replace(&mut self.in_class_prop_init, init_list);

        if !prop_list.is_empty() {
            self.reorder_class_prop_decls(n, prop_list, init_list);
        }
    }

    fn visit_mut_constructor(&mut self, n: &mut Constructor) {
        n.params
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
                            let value = Ident::from(&*binding_ident).into();

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
                            let value = binding_ident.id.clone().into();

                            (
                                assign_pat.clone().into(),
                                assign_value_to_this_prop(prop_name, value),
                                id,
                            )
                        }
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
            });

        n.params.visit_mut_children_with(self);
        n.body.visit_mut_children_with(self);
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        for mut item in n.take() {
            let decls = self.class_prop_decls.take();
            item.visit_mut_with(self);
            let decls = mem::replace(&mut self.class_prop_decls, decls);
            if !decls.is_empty() {
                n.push(
                    VarDecl {
                        span: DUMMY_SP,
                        declare: false,
                        decls,
                        kind: VarDeclKind::Let,
                        ..Default::default()
                    }
                    .into(),
                );
            }
            n.push(item);
        }

        self.visit_mut_stmts_for_enum_or_module(n);
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        if !n.is_class() {
            maybe_grow_default(|| n.visit_mut_children_with(self));
            return;
        }

        let decls = self.class_prop_decls.take();
        n.visit_mut_children_with(self);
        let mut decls = mem::replace(&mut self.class_prop_decls, decls);

        if !decls.is_empty() {
            let exprs = decls
                .iter_mut()
                .flat_map(|key| {
                    key.init.take().map(|init| {
                        let name = key.name.clone();
                        init.make_assign_to(op!("="), name.try_into().unwrap())
                    })
                })
                .chain(iter::once(n.take()))
                .map(Box::new)
                .collect();

            *n = SeqExpr {
                span: DUMMY_SP,
                exprs,
            }
            .into();

            self.class_prop_decls.extend(decls);
        }
    }

    fn visit_mut_ts_namespace_decl(&mut self, n: &mut TsNamespaceDecl) {
        let id = n.id.to_id();
        let old_id = self.namespace_id.replace(id);

        n.body.visit_mut_with(self);

        self.namespace_id = old_id;
    }

    fn visit_mut_ts_module_decl(&mut self, n: &mut TsModuleDecl) {
        let id =
            n.id.as_ident()
                .map(Ident::to_id)
                .expect("Only ambient modules can use quoted names.");

        let old_id = self.namespace_id.replace(id);

        n.body.visit_mut_with(self);

        self.namespace_id = old_id;
    }
}

impl Transform {
    fn visit_mut_stmts_for_enum_or_module(&mut self, n: &mut Vec<Stmt>) {
        let found = (**n).iter().any(|stmt| stmt.is_enum_or_module());

        if !found {
            return;
        }

        let mut decl_id_record = AHashSet::<Id>::default();

        for mut stmt in n.take().drain(..) {
            if let Some(id) = stmt.get_enum_or_module_id() {
                let var_stmt = self
                    .add_var_for_enum_or_module_declaration(&id, &decl_id_record)
                    .map(Into::into);

                n.extend(var_stmt);
            }

            let id = stmt.get_decl_id();
            stmt = self.fold_stmt(stmt, false);
            decl_id_record.extend(id);
            if !stmt.is_empty() {
                n.push(stmt);
            }
        }
    }

    fn fold_stmt(&mut self, n: Stmt, is_export: bool) -> Stmt {
        match n {
            Stmt::Decl(Decl::TsModule(ts_module)) => self.transform_ts_module(*ts_module, false),
            Stmt::Decl(Decl::TsEnum(ts_enum)) => self.transform_ts_enum(*ts_enum, is_export),
            stmt => stmt,
        }
    }

    fn visit_mut_module_items_for_enum_or_module(&mut self, n: &mut Vec<ModuleItem>) {
        let found = (**n)
            .iter()
            .any(|module_item| module_item.is_enum_or_module());

        if !found {
            return;
        }

        let export_names = self.collect_named_export(n);

        let mut decl_id_record = AHashSet::<Id>::default();

        for mut module_item in n.take().drain(..) {
            if let Some(id) = &module_item.get_enum_or_module_id() {
                let var_decl = self.add_var_for_enum_or_module_declaration(id, &decl_id_record);

                let var_stmt = if self.namespace_id.is_none()
                    && matches!(
                        module_item,
                        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(..))
                    ) {
                    // export var foo;
                    var_decl
                        .map(Box::new)
                        .map(Decl::Var)
                        .map(|decl| ExportDecl {
                            span: DUMMY_SP,
                            decl,
                        })
                        .map(ModuleDecl::ExportDecl)
                        .map(ModuleItem::ModuleDecl)
                } else {
                    // var foo;
                    var_decl.map(Into::into)
                };

                n.extend(var_stmt);
            }

            let id = module_item.get_decl_id();
            let is_export = id
                .as_ref()
                .map(|id| export_names.contains(id))
                .unwrap_or_default();
            module_item = self.fold_module_item(module_item, is_export);
            decl_id_record.extend(id);
            if !matches!(module_item, ModuleItem::Stmt(Stmt::Empty(..))) {
                n.push(module_item);
            }
        }
    }

    fn fold_module_item(&mut self, n: ModuleItem, is_export: bool) -> ModuleItem {
        match n {
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::TsModule(ts_module),
                ..
            })) => self.transform_ts_module(*ts_module, true).into(),
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: Decl::TsEnum(ts_enum),
                ..
            })) => self.transform_ts_enum(*ts_enum, true).into(),
            ModuleItem::Stmt(stmt @ Stmt::Decl(..)) => self.fold_stmt(stmt, is_export).into(),
            module_item => module_item,
        }
    }
}

impl Transform {
    fn transform_ts_module(&self, ts_module: TsModuleDecl, is_export: bool) -> Stmt {
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

        let expr =
            Self::wrap_enum_or_module_with_iife(&self.namespace_id, module_ident, body, is_export);

        ExprStmt {
            span,
            expr: expr.into(),
        }
        .into()
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
        };

        debug_assert!(!declare);
        debug_assert!(!global);

        let body = Self::transform_ts_namespace_body(local_name.to_id(), *body);

        let init_arg =
            Self::get_enum_or_module_init_arg(&Some(id), local_name.clone(), true).into();

        let expr =
            Factory::function(vec![local_name.into()], body).as_call(DUMMY_SP, vec![init_arg]);

        BlockStmt {
            span,
            stmts: vec![expr.into_stmt()],
            ..Default::default()
        }
    }

    fn transform_ts_module_block(id: Id, TsModuleBlock { span, body }: TsModuleBlock) -> BlockStmt {
        let mut stmts = vec![];
        let mut mutable_export_ids = Default::default();

        for module_item in body {
            match module_item {
                ModuleItem::Stmt(stmt) => stmts.push(stmt),
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl)) => {
                    let stmt_list = Self::transform_export_decl_in_ts_module_block(
                        &id,
                        export_decl,
                        &mut mutable_export_ids,
                    )
                    .into_iter()
                    .flatten();

                    stmts.extend(stmt_list);
                }
                ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(decl)) => {
                    match decl.module_ref {
                        TsModuleRef::TsEntityName(ts_entity_name) => {
                            let init = Self::ts_entity_name_to_expr(ts_entity_name);

                            // export impot foo = bar.baz
                            let stmt = if decl.is_export {
                                // Foo.foo = bar.baz
                                mutable_export_ids.insert(decl.id.to_id());
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

                                var_decl.into().into()
                            };

                            stmts.push(stmt);
                        }
                        TsModuleRef::TsExternalModuleRef(..) => {
                            // TS1147
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
                }
                item => {
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

        if !mutable_export_ids.is_empty() {
            rewrite_export_bindings(&mut stmts, id, mutable_export_ids);
        }

        BlockStmt {
            span,
            stmts,
            ..Default::default()
        }
    }
}

impl Transform {
    fn transform_ts_enum(&mut self, ts_enum: TsEnumDecl, is_export: bool) -> Stmt {
        let TsEnumDecl {
            span,
            declare,
            is_const,
            id,
            members,
        } = ts_enum;

        debug_assert!(!declare);

        let mut default_init = 0.0.into();
        let mut member_list = vec![];
        let mut local_record = if self.ts_enum_is_mutable && !is_const {
            Some(TsEnumRecord::default())
        } else {
            None
        };
        let record = local_record.as_mut().unwrap_or(&mut self.record);

        for m in members {
            let span = m.span;
            let name = m.id.as_ref().clone();

            let value = Self::transform_ts_enum_member(
                m,
                &id.to_id(),
                &default_init,
                record,
                self.top_level_mark,
            );

            default_init = value.inc();
            {
                let key = TsEnumRecordKey {
                    enum_id: id.to_id(),
                    member_name: name.clone(),
                };

                // Never store TsEnumRecordValue::Opaque value in the record.
                let value = if value.is_const() {
                    value.clone()
                } else {
                    TsEnumRecordValue::Void
                };

                record.insert(key, value);
            }

            let item = EnumMemberItem { span, name, value };

            member_list.push(item);
        }

        let ts_enum_safe_remove = !self.verbatim_module_syntax && is_const && !is_export;

        if ts_enum_safe_remove && member_list.iter().all(EnumMemberItem::is_const) {
            return Stmt::dummy();
        }

        let stmts = member_list
            .into_iter()
            .filter(|item| !ts_enum_safe_remove || !item.is_const())
            .map(|item| item.build_assign(&id.to_id()))
            .collect();

        let expr = Self::wrap_enum_or_module_with_iife(
            &self.namespace_id,
            id,
            BlockStmt {
                span: DUMMY_SP,
                stmts,
                ..Default::default()
            },
            is_export,
        );

        ExprStmt {
            span,
            expr: expr.into(),
        }
        .into()
    }

    fn transform_ts_enum_member(
        member: TsEnumMember,
        enum_id: &Id,
        default_init: &TsEnumRecordValue,
        record: &TsEnumRecord,
        top_level_mark: Mark,
    ) -> TsEnumRecordValue {
        member
            .init
            .map(|expr| {
                EnumValueComputer {
                    enum_id,
                    top_level_mark,
                    record,
                }
                .compute(expr)
            })
            .filter(TsEnumRecordValue::has_value)
            .unwrap_or_else(|| default_init.clone())
    }
}

/// Note:
/// All exported variable declarations are transformed into assignment to the
/// namespace. All references to the exported binding will be replaced with
/// qualified access to the namespace property.
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
impl Transform {
    fn transform_export_decl_in_ts_module_block(
        id: &Id,
        ExportDecl { decl, span, .. }: ExportDecl,
        mutable_export_ids: &mut AHashSet<Id>,
    ) -> [Option<Stmt>; 2] {
        match decl {
            Decl::Fn(FnDecl { ref ident, .. }) | Decl::Class(ClassDecl { ref ident, .. }) => {
                let assign_stmt = Self::assign_prop(id, ident, span);
                [decl.into(), assign_stmt].map(Option::Some)
            }
            Decl::Var(var_decl) => [
                Self::transform_export_var_decl_in_ts_module_block(
                    *var_decl,
                    id,
                    span,
                    mutable_export_ids,
                ),
                None,
            ],
            _ => unreachable!(),
        }
    }

    fn transform_export_var_decl_in_ts_module_block(
        mut var_decl: VarDecl,
        id: &Id,
        span: Span,
        mutable_export_ids: &mut AHashSet<Id>,
    ) -> Option<Stmt> {
        debug_assert!(!var_decl.declare);

        mutable_export_ids.extend(find_pat_ids(&var_decl));

        var_decl.decls.visit_mut_with(&mut ExportedPatRewriter {
            id: id.clone().into(),
        });

        let mut expr_list: Vec<Box<Expr>> =
            var_decl.decls.into_iter().filter_map(|d| d.init).collect();

        if expr_list.is_empty() {
            return None;
        }

        // take `NS.foo = init` from `let foo = init`;
        let expr = if expr_list.len() == 1 {
            expr_list[0].take()
        } else {
            SeqExpr {
                span: DUMMY_SP,
                exprs: expr_list,
            }
            .into()
        };

        Some(ExprStmt { span, expr }.into())
    }
}

impl Transform {
    fn reorder_class_prop_decls(
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
                    ..
                }) => {
                    let key = match &mut *key {
                        PropName::Computed(ComputedPropName { span, expr })
                            if !is_literal(expr) =>
                        {
                            let ident = alias_ident_for(expr, "_key");

                            self.class_prop_decls.push(VarDeclarator {
                                span: DUMMY_SP,
                                name: ident.clone().into(),
                                init: Some(expr.take()),
                                definite: false,
                            });

                            **expr = ident.clone().into();

                            PropName::Computed(ComputedPropName {
                                span: *span,
                                expr: ident.into(),
                            })
                        }
                        _ => key.clone(),
                    };

                    init_list.push(assign_value_to_this_prop(key, *value.take().unwrap()));
                }
                ClassMember::PrivateProp(PrivateProp {
                    key,
                    value: value @ Some(..),
                    is_static: false,
                    ..
                }) => {
                    init_list.push(assign_value_to_this_private_prop(
                        key.clone(),
                        *value.take().unwrap(),
                    ));
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
                    span: DUMMY_SP,
                    key,
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

    fn add_var_for_enum_or_module_declaration(
        &self,
        id: &Id,
        decl_id_record: &AHashSet<Id>,
    ) -> Option<VarDecl> {
        if decl_id_record.contains(id) {
            return None;
        }

        let kind = if id.1 != self.top_level_ctxt {
            VarDeclKind::Let
        } else {
            VarDeclKind::Var
        };

        let var_decl = VarDecl {
            span: DUMMY_SP,
            kind,
            declare: false,
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                name: id.clone().into(),
                init: None,
                definite: false,
            }],
            ..Default::default()
        };

        Some(var_decl)
    }

    /// Gets the argument used in a transformed enum or namespace call expr.
    ///
    /// Example:
    ///   * `MyNamespace.MyEnum || (MyNamespace.MyEnum = {})`
    ///   * or `MyEnum || (MyEnum = {})`
    fn get_enum_or_module_init_arg(
        container_name: &Option<Id>,
        ident: Ident,
        is_export: bool,
    ) -> Expr {
        let mut left: SimpleAssignTarget = ident.clone().into();
        let mut assign_left: SimpleAssignTarget = ident.clone().into();

        if is_export {
            if let Some(id) = container_name.clone() {
                left = Ident::from(id).make_member(ident.into()).into();
                assign_left = left.clone();
            }
        }

        BinExpr {
            span: DUMMY_SP,
            op: op!("||"),
            left: left.into(),
            right: Box::new(
                AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: assign_left.into(),
                    right: Box::new(
                        ObjectLit {
                            span: DUMMY_SP,
                            props: vec![],
                        }
                        .into(),
                    ),
                }
                .into(),
            ),
        }
        .into()
    }

    fn wrap_enum_or_module_with_iife(
        container_name: &Option<Id>,
        ident: Ident,
        body: BlockStmt,
        is_export: bool,
    ) -> Expr {
        let mut init_arg =
            Self::get_enum_or_module_init_arg(container_name, ident.clone(), is_export).into();

        if is_export && container_name.is_some() {
            init_arg = AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left: ident.clone().into(),
                right: init_arg,
            }
            .into();
        }

        Factory::function(vec![ident.into()], body).as_call(DUMMY_SP, vec![init_arg.into()])
    }

    fn collect_named_export(&self, n: &[ModuleItem]) -> AHashSet<Id> {
        let mut names = AHashSet::default();

        if self.namespace_id.is_some() {
            return names;
        }

        for item in n {
            match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                    specifiers,
                    src: None,
                    ..
                })) => {
                    names.extend(specifiers.iter().map(|s| match s {
                        ExportSpecifier::Named(ExportNamedSpecifier {
                            orig: ModuleExportName::Ident(export_id),
                            ..
                        }) => export_id.to_id(),
                        _ => unreachable!("only named export is allowed for src = None"),
                    }));
                }
                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                    expr,
                    ..
                })) if expr.is_ident() => {
                    names.extend(expr.as_ident().map(Ident::to_id));
                }
                _ => {}
            }
        }

        names
    }
}

impl Transform {
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
        }
    }

    fn visit_mut_for_ts_import_export(&mut self, n: &mut Module) {
        let n = &mut n.body;
        let mut should_inject = false;
        let create_require = private_ident!("_createRequire");
        let require = private_ident!("__require");

        // NOTE: This is not correct!
        // However, all unresolved_span are used in TsImportExportAssignConfig::Classic
        // which is deprecated and not used in real world.
        let unresolved_ctxt = SyntaxContext::empty().apply_mark(self.top_level_mark);
        let cjs_require = quote_ident!(unresolved_ctxt, "require");
        let cjs_exports = quote_ident!(unresolved_ctxt, "exports");

        let mut cjs_export_assign = None;

        for mut module_item in n.take() {
            match &mut module_item {
                ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(decl)) if !decl.is_type_only => {
                    debug_assert_eq!(decl.id.ctxt, self.top_level_ctxt);

                    match &mut decl.module_ref {
                        // import foo = bar.baz
                        TsModuleRef::TsEntityName(ts_entity_name) => {
                            let init = Self::ts_entity_name_to_expr(ts_entity_name.clone());

                            let mut var_decl =
                                init.into_var_decl(VarDeclKind::Const, decl.id.take().into());

                            let module_item = if decl.is_export {
                                ExportDecl {
                                    span: decl.span,
                                    decl: var_decl.into(),
                                }
                                .into()
                                .into()
                            } else {
                                var_decl.span = decl.span;
                                ModuleItem::Stmt(var_decl.into())
                            };
                            n.push(module_item);
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

                                    n.push(ModuleItem::Stmt(var_decl.into()));
                                }
                                TsImportExportAssignConfig::Preserve => n.push(module_item),
                                TsImportExportAssignConfig::NodeNext => {
                                    should_inject = true;

                                    let mut var_decl = require
                                        .clone()
                                        .as_call(DUMMY_SP, vec![expr.take().as_arg()])
                                        .into_var_decl(VarDeclKind::Const, decl.id.take().into());

                                    let module_item = if decl.is_export {
                                        ExportDecl {
                                            span: decl.span,
                                            decl: var_decl.into(),
                                        }
                                        .into()
                                        .into()
                                    } else {
                                        var_decl.span = decl.span;
                                        var_decl.into().into().into()
                                    };
                                    n.push(module_item);
                                }
                                TsImportExportAssignConfig::EsNext => {
                                    // TS1202
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
                _ => n.push(module_item),
            }
        }

        if should_inject {
            n.inject_after_directive([
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
                .into()
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
                    .into()
                    .into()
                    .into(),
            ]);
        }

        if let Some(cjs_export_assign) = cjs_export_assign {
            match self.import_export_assign_config {
                TsImportExportAssignConfig::Classic => {
                    let TsExportAssignment { expr, span } = cjs_export_assign;

                    n.push(
                        ExprStmt {
                            span,
                            expr: Box::new(
                                expr.make_assign_to(
                                    op!("="),
                                    member_expr!(
                                        unresolved_ctxt,
                                        Default::default(),
                                        module.exports
                                    )
                                    .into(),
                                ),
                            ),
                        }
                        .into()
                        .into(),
                    );
                }
                TsImportExportAssignConfig::Preserve => {
                    n.push(cjs_export_assign.into().into());
                }
                TsImportExportAssignConfig::NodeNext | TsImportExportAssignConfig::EsNext => {
                    // TS1203
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

struct ExportedPatRewriter {
    id: Ident,
}

impl VisitMut for ExportedPatRewriter {
    noop_visit_mut_type!();

    fn visit_mut_var_declarator(&mut self, n: &mut VarDeclarator) {
        let Some(right) = n.init.take() else {
            return;
        };

        let mut left = n.name.take();
        left.visit_mut_with(self);

        n.init = Some(
            right
                .make_assign_to(op!("="), left.try_into().unwrap())
                .into(),
        );
    }

    fn visit_mut_pat(&mut self, n: &mut Pat) {
        if let Pat::Ident(bid) = n {
            *n = Pat::Expr(
                self.id
                    .clone()
                    .make_member(IdentName::from(take(bid)))
                    .into(),
            );
            return;
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_object_pat_prop(&mut self, n: &mut ObjectPatProp) {
        if let ObjectPatProp::Assign(AssignPatProp { key, value, .. }) = n {
            let left = Pat::Expr(self.id.clone().make_member(key.clone().into()).into());

            let value = if let Some(right) = value.take() {
                AssignPat {
                    span: DUMMY_SP,
                    left: left.into(),
                    right,
                }
                .into()
            } else {
                left
            };

            *n = ObjectPatProp::KeyValue(KeyValuePatProp {
                key: PropName::Ident(key.clone().into()),
                value: value.into(),
            });
            return;
        }

        n.visit_mut_children_with(self);
    }
}

struct ExportQuery {
    namesapce_id: Id,
    export_id_list: AHashSet<Id>,
}

impl QueryRef for ExportQuery {
    fn query_ref(&self, ident: &Ident) -> Option<Box<Expr>> {
        self.export_id_list.contains(&ident.to_id()).then(|| {
            self.namesapce_id
                .clone()
                .make_member(ident.clone().into())
                .into()
        })
    }

    fn query_lhs(&self, ident: &Ident) -> Option<Box<Expr>> {
        self.query_ref(ident)
    }

    fn query_jsx(&self, ident: &Ident) -> Option<JSXElementName> {
        self.export_id_list.contains(&ident.to_id()).then(|| {
            JSXMemberExpr {
                span: DUMMY_SP,
                obj: JSXObject::Ident(self.namesapce_id.clone().into()),
                prop: ident.clone().into(),
            }
            .into()
        })
    }

    fn should_fix_this(&self, _: &Ident) -> bool {
        // tsc does not care about `this` in namespace.
        false
    }
}

fn rewrite_export_bindings<V>(node: &mut V, namesapce_id: Id, export_id_list: AHashSet<Id>)
where
    V: VisitMutWith<RefRewriter<ExportQuery>>,
{
    let mut v = RefRewriter {
        query: ExportQuery {
            namesapce_id,
            export_id_list,
        },
    };

    node.visit_mut_with(&mut v);
}

struct EnumMemberItem {
    span: Span,
    name: JsWord,
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
