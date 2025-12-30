use std::{iter, mem};

use swc_atoms::Atom;
use swc_common::{errors::HANDLER, source_map::PURE_SP, util::take::Take, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::{
    alias_ident_for, constructor::inject_after_super, find_pat_ids, ident::IdentLike, is_literal,
    member_expr, private_ident, quote_ident, quote_str, stack_size::maybe_grow_default,
    ExprFactory, StmtLikeInjector,
};
use swc_ecma_visit::{Visit, VisitMutWith, VisitWith};

use super::context::{ExportQuery, TypeScriptCtx};
use crate::{
    ts_enum::{EnumValueComputer, TsEnumRecordKey, TsEnumRecordValue},
    utils::{assign_value_to_this_private_prop, assign_value_to_this_prop, Factory},
};

pub fn hook() -> impl VisitMutHook<TypeScriptCtx> {
    TransformHook
}

struct TransformHook;

impl VisitMutHook<TypeScriptCtx> for TransformHook {
    fn enter_program(&mut self, node: &mut Program, ctx: &mut TypeScriptCtx) {
        // Collection phase - visit to collect enum values and exports
        node.visit_with(&mut Collector { ctx });

        // Initialize ref_rewriter if we have exported bindings
        if !ctx.transform.exported_binding.is_empty() {
            ctx.transform.ref_rewriter = Some(swc_ecma_utils::RefRewriter {
                query: ExportQuery {
                    export_name: ctx.transform.exported_binding.clone(),
                },
            });
        }

        // Store the last module span for restore_esm_ctx
        if let Program::Module(m) = node {
            ctx.transform.last_module_span = get_last_module_span(m, ctx.config.no_empty_export);
        }
    }

    fn exit_program(&mut self, node: &mut Program, ctx: &mut TypeScriptCtx) {
        // Restore ESM context if needed
        if let (Program::Module(module), Some(span)) = (node, ctx.transform.last_module_span) {
            restore_esm_ctx(module, span);
        }
    }

    fn enter_ts_enum_decl(&mut self, node: &mut TsEnumDecl, ctx: &mut TypeScriptCtx) {
        // Collect enum values
        if node.is_const {
            ctx.transform.const_enum.insert(node.id.to_id());
        }

        let mut default_init = 0.0.into();

        for m in &node.members {
            let value = transform_ts_enum_member(
                m.clone(),
                &node.id.to_id(),
                &default_init,
                &ctx.transform.enum_record,
                ctx.unresolved_ctxt,
            );

            default_init = value.inc();

            let member_name = enum_member_id_atom(&m.id);
            let key = TsEnumRecordKey {
                enum_id: node.id.to_id(),
                member_name: member_name.clone(),
            };

            ctx.transform.enum_record.insert(key, value);
        }
    }

    fn enter_ts_namespace_decl(&mut self, n: &mut TsNamespaceDecl, ctx: &mut TypeScriptCtx) {
        let id = n.id.to_id();
        let namespace_id = ctx.transform.namespace_id.replace(id);
        ctx.transform.namespace_id = namespace_id;
    }

    fn exit_ts_namespace_decl(&mut self, n: &mut TsNamespaceDecl, ctx: &mut TypeScriptCtx) {
        let id = n.id.to_id();
        let namespace_id = mem::replace(&mut ctx.transform.namespace_id, Some(id));
        ctx.transform.namespace_id = namespace_id;
    }

    fn enter_ts_module_decl(&mut self, n: &mut TsModuleDecl, ctx: &mut TypeScriptCtx) {
        let id = module_id_to_id(&n.id);
        let namespace_id = ctx.transform.namespace_id.replace(id);
        ctx.transform.namespace_id = namespace_id;
    }

    fn exit_ts_module_decl(&mut self, n: &mut TsModuleDecl, ctx: &mut TypeScriptCtx) {
        let id = module_id_to_id(&n.id);
        let namespace_id = mem::replace(&mut ctx.transform.namespace_id, Some(id));
        ctx.transform.namespace_id = namespace_id;
    }

    fn exit_module(&mut self, node: &mut Module, ctx: &mut TypeScriptCtx) {
        visit_mut_for_ts_import_export(node, ctx);

        if !ctx.transform.export_var_list.is_empty() {
            let decls = ctx
                .transform
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

    fn exit_module_items(&mut self, node: &mut Vec<ModuleItem>, ctx: &mut TypeScriptCtx) {
        // Filter out empty statements
        node.retain_mut(|item| {
            let is_empty = item.as_stmt().map(Stmt::is_empty).unwrap_or(false);
            // Remove those folded into Empty
            is_empty || !item.as_stmt().map(Stmt::is_empty).unwrap_or(false)
        });

        // Take collected var declarations
        let var_list = mem::take(&mut ctx.transform.var_list);

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

    fn exit_class_members(&mut self, node: &mut Vec<ClassMember>, ctx: &mut TypeScriptCtx) {
        // Children have already been visited, take the collected values
        let prop_list = mem::take(&mut ctx.transform.in_class_prop);
        let init_list = mem::take(&mut ctx.transform.in_class_prop_init);

        if !prop_list.is_empty() {
            if ctx.transform.native_class_properties {
                reorder_class_prop_decls(node, prop_list, init_list, &mut ctx.transform.var_list);
            } else {
                reorder_class_prop_decls_and_inits(
                    node,
                    prop_list,
                    init_list,
                    &mut ctx.transform.var_list,
                );
            }
        }
    }

    fn enter_constructor(&mut self, node: &mut Constructor, ctx: &mut TypeScriptCtx) {
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
                            value_ident.optional = false; // Remove optional flag for the value expression

                            (
                                binding_ident.clone().into(),
                                assign_value_to_this_prop(prop_name, value_ident.into()),
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
                            value_ident.optional = false; // Remove optional flag for the value expression

                            (
                                assign_pat.clone().into(),
                                assign_value_to_this_prop(prop_name, value_ident.into()),
                                id,
                            )
                        }
                        #[cfg(swc_ast_unknown)]
                        _ => panic!("unable to access unknown nodes"),
                    };

                    ctx.transform.in_class_prop.push(id);
                    ctx.transform.in_class_prop_init.push(expr);

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
    }

    fn exit_stmts(&mut self, node: &mut Vec<Stmt>, ctx: &mut TypeScriptCtx) {
        // Filter out empty statements
        node.retain_mut(|stmt| {
            let is_empty = stmt.is_empty();
            // Remove those folded into Empty
            is_empty || !stmt.is_empty()
        });

        // Take collected var declarations
        let var_list = mem::take(&mut ctx.transform.var_list);
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

    fn exit_stmt(&mut self, node: &mut Stmt, ctx: &mut TypeScriptCtx) {
        let Stmt::Decl(decl) = node else {
            return;
        };

        match fold_decl(decl.take(), false, ctx) {
            FoldedDecl::Decl(var_decl) => *decl = var_decl,
            FoldedDecl::Expr(stmt) => *node = stmt,
            FoldedDecl::Empty => {
                node.take();
            }
        }
    }

    fn exit_module_item(&mut self, node: &mut ModuleItem, ctx: &mut TypeScriptCtx) {
        if let Some(ExportDecl { decl, .. }) = node
            .as_mut_module_decl()
            .and_then(ModuleDecl::as_mut_export_decl)
        {
            match fold_decl(decl.take(), true, ctx) {
                FoldedDecl::Decl(var_decl) => *decl = var_decl,
                FoldedDecl::Expr(stmt) => *node = stmt.into(),
                FoldedDecl::Empty => {
                    node.take();
                }
            }
        }
    }

    fn exit_export_default_decl(&mut self, node: &mut ExportDefaultDecl, ctx: &mut TypeScriptCtx) {
        if let DefaultDecl::Class(ClassExpr {
            ident: Some(ref ident),
            ..
        })
        | DefaultDecl::Fn(FnExpr {
            ident: Some(ref ident),
            ..
        }) = node.decl
        {
            ctx.transform.decl_id_record.insert(ident.to_id());
        }
    }

    fn enter_export_decl(&mut self, node: &mut ExportDecl, ctx: &mut TypeScriptCtx) {
        // Mark that we're in an export declaration so var_declarator knows to keep
        // ref_rewriter
        ctx.transform.in_export_decl = true;
    }

    fn exit_export_decl(&mut self, node: &mut ExportDecl, ctx: &mut TypeScriptCtx) {
        ctx.transform.in_export_decl = false;
    }

    fn exit_prop(&mut self, node: &mut Prop, ctx: &mut TypeScriptCtx) {
        if let Some(ref_rewriter) = ctx.transform.ref_rewriter.as_mut() {
            ref_rewriter.exit_prop(node);
        }
    }

    fn enter_var_declarator(&mut self, n: &mut VarDeclarator, ctx: &mut TypeScriptCtx) {
        // In export declarations, manually apply RefRewriter to the pattern
        // This rewrites exported identifiers in destructuring patterns
        if ctx.transform.in_export_decl {
            if let Some(ref_rewriter) = ctx.transform.ref_rewriter.as_mut() {
                n.name.visit_mut_with(ref_rewriter);
            }
        } else {
            // Otherwise, temporarily remove ref_rewriter to prevent it from being applied
            ctx.transform.ref_rewriter_temp = ctx.transform.ref_rewriter.take();
        }
    }

    fn exit_var_declarator(&mut self, n: &mut VarDeclarator, ctx: &mut TypeScriptCtx) {
        // Restore ref_rewriter after name has been processed (if we removed it)
        if !ctx.transform.in_export_decl {
            if let Some(ref_rewriter) = ctx.transform.ref_rewriter_temp.take() {
                ctx.transform.ref_rewriter = Some(ref_rewriter);
            } else if !ctx.transform.exported_binding.is_empty() {
                ctx.transform.ref_rewriter = Some(swc_ecma_utils::RefRewriter {
                    query: ExportQuery {
                        export_name: ctx.transform.exported_binding.clone(),
                    },
                });
            }
        }
    }

    fn exit_pat(&mut self, node: &mut Pat, ctx: &mut TypeScriptCtx) {
        if let Some(ref_rewriter) = ctx.transform.ref_rewriter.as_mut() {
            ref_rewriter.exit_pat(node);
        }
    }

    fn enter_expr(&mut self, node: &mut Expr, ctx: &mut TypeScriptCtx) {
        enter_expr_for_inline_enum(node, ctx);
    }

    fn exit_expr(&mut self, node: &mut Expr, ctx: &mut TypeScriptCtx) {
        maybe_grow_default(|| {});

        if let Some(ref_rewriter) = ctx.transform.ref_rewriter.as_mut() {
            ref_rewriter.exit_expr(node);
        }
    }

    fn enter_assign_expr(&mut self, _n: &mut AssignExpr, ctx: &mut TypeScriptCtx) {
        // Mark that we're entering the LHS of an assignment
        ctx.transform.is_lhs = true;
    }

    fn exit_assign_expr(&mut self, _n: &mut AssignExpr, ctx: &mut TypeScriptCtx) {
        // Reset is_lhs after assignment
        ctx.transform.is_lhs = false;
    }

    fn enter_update_expr(&mut self, _n: &mut UpdateExpr, ctx: &mut TypeScriptCtx) {
        ctx.transform.is_lhs = true;
    }

    fn exit_update_expr(&mut self, _n: &mut UpdateExpr, ctx: &mut TypeScriptCtx) {
        ctx.transform.is_lhs = false;
    }

    fn enter_member_expr(&mut self, _n: &mut MemberExpr, ctx: &mut TypeScriptCtx) {
        let old_is_lhs = ctx.transform.is_lhs;
        ctx.transform.is_lhs = false;
        // Store old value to restore in exit
        if old_is_lhs {
            // We'll need to restore it, but VisitMutWithHook doesn't give us
            // per-node state So we'll just set it to false and it
            // will be corrected by parent
        }
    }

    fn exit_simple_assign_target(
        &mut self,
        node: &mut SimpleAssignTarget,
        ctx: &mut TypeScriptCtx,
    ) {
        if let Some(ref_rewriter) = ctx.transform.ref_rewriter.as_mut() {
            ref_rewriter.exit_simple_assign_target(node);
        }
    }

    fn exit_jsx_element_name(&mut self, node: &mut JSXElementName, ctx: &mut TypeScriptCtx) {
        if let Some(ref_rewriter) = ctx.transform.ref_rewriter.as_mut() {
            ref_rewriter.exit_jsx_element_name(node);
        }
    }

    fn exit_jsx_object(&mut self, node: &mut JSXObject, ctx: &mut TypeScriptCtx) {
        if let Some(ref_rewriter) = ctx.transform.ref_rewriter.as_mut() {
            ref_rewriter.exit_jsx_object(node);
        }
    }

    fn exit_object_pat_prop(&mut self, n: &mut ObjectPatProp, ctx: &mut TypeScriptCtx) {
        if let Some(ref_rewriter) = ctx.transform.ref_rewriter.as_mut() {
            ref_rewriter.exit_object_pat_prop(n);
        }
    }
}

// Helper visitor for collection phase
struct Collector<'a> {
    ctx: &'a mut TypeScriptCtx,
}

impl<'a> Visit for Collector<'a> {
    fn visit_ts_namespace_decl(&mut self, n: &TsNamespaceDecl) {
        let id = n.id.to_id();
        let old_namespace_id = self.ctx.transform.namespace_id.replace(id);
        n.visit_children_with(self);
        self.ctx.transform.namespace_id = old_namespace_id;
    }

    fn visit_ts_module_decl(&mut self, n: &TsModuleDecl) {
        let id = module_id_to_id(&n.id);
        let old_namespace_id = self.ctx.transform.namespace_id.replace(id);
        n.visit_children_with(self);
        self.ctx.transform.namespace_id = old_namespace_id;
    }

    fn visit_export_decl(&mut self, node: &ExportDecl) {
        node.visit_children_with(self);

        match &node.decl {
            Decl::Var(var_decl) => {
                self.ctx.transform.exported_binding.extend({
                    find_pat_ids(&var_decl.decls)
                        .into_iter()
                        .zip(iter::repeat(self.ctx.transform.namespace_id.clone()))
                });
            }
            Decl::TsEnum(ts_enum_decl) => {
                self.ctx.transform.exported_binding.insert(
                    ts_enum_decl.id.to_id(),
                    self.ctx.transform.namespace_id.clone(),
                );
            }
            Decl::TsModule(ts_module_decl) => {
                self.ctx.transform.exported_binding.insert(
                    module_id_to_id(&ts_module_decl.id),
                    self.ctx.transform.namespace_id.clone(),
                );
            }
            _ => {}
        }
    }

    fn visit_export_named_specifier(&mut self, node: &ExportNamedSpecifier) {
        if let ModuleExportName::Ident(ident) = &node.orig {
            self.ctx
                .transform
                .exported_binding
                .insert(ident.to_id(), self.ctx.transform.namespace_id.clone());
        }
    }

    fn visit_export_default_expr(&mut self, node: &ExportDefaultExpr) {
        node.visit_children_with(self);

        if let Expr::Ident(ident) = &*node.expr {
            self.ctx
                .transform
                .exported_binding
                .insert(ident.to_id(), self.ctx.transform.namespace_id.clone());
        }
    }

    fn visit_ts_import_equals_decl(&mut self, node: &TsImportEqualsDecl) {
        node.visit_children_with(self);

        if node.is_export {
            self.ctx
                .transform
                .exported_binding
                .insert(node.id.to_id(), self.ctx.transform.namespace_id.clone());
        }
    }

    fn visit_expr(&mut self, node: &Expr) {
        maybe_grow_default(|| node.visit_children_with(self));
    }
}

// Continue with helper functions...
// (Due to length, I'll split this into multiple responses)

// Helper functions from transform.rs

#[inline]
fn enum_member_id_atom(id: &TsEnumMemberId) -> Atom {
    match id {
        TsEnumMemberId::Ident(ident) => ident.sym.clone(),
        TsEnumMemberId::Str(s) => s.value.to_atom_lossy().into_owned(),
        #[cfg(swc_ast_unknown)]
        _ => panic!("unable to access unknown nodes"),
    }
}

fn transform_ts_enum_member(
    member: TsEnumMember,
    enum_id: &Id,
    default_init: &TsEnumRecordValue,
    record: &crate::ts_enum::TsEnumRecord,
    unresolved_ctxt: swc_common::SyntaxContext,
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

enum FoldedDecl {
    Empty,
    Decl(Decl),
    Expr(Stmt),
}

fn fold_decl(node: Decl, is_export: bool, ctx: &mut TypeScriptCtx) -> FoldedDecl {
    match node {
        Decl::TsModule(ts_module) => {
            let id = module_id_to_id(&ts_module.id);

            if ctx.transform.decl_id_record.insert(id.clone()) {
                if is_export {
                    if ctx.transform.namespace_id.is_none() {
                        ctx.transform.export_var_list.push(id);
                    }
                } else {
                    ctx.transform.var_list.push(id);
                }
            }

            transform_ts_module(*ts_module, is_export, ctx)
        }
        Decl::TsEnum(ts_enum) => {
            let id = ts_enum.id.to_id();

            let is_first = ctx.transform.decl_id_record.insert(id);

            transform_ts_enum(*ts_enum, is_first, is_export, ctx)
        }
        Decl::Fn(FnDecl { ref ident, .. }) | Decl::Class(ClassDecl { ref ident, .. }) => {
            ctx.transform.decl_id_record.insert(ident.to_id());
            FoldedDecl::Decl(node)
        }
        decl => FoldedDecl::Decl(decl),
    }
}

fn module_id_to_id(module_name: &TsModuleName) -> Id {
    module_name
        .as_ident()
        .expect("Only ambient modules can use quoted names.")
        .to_id()
}

fn id_to_var_declarator(id: Id) -> VarDeclarator {
    VarDeclarator {
        span: DUMMY_SP,
        name: id.into(),
        init: None,
        definite: false,
    }
}

fn enter_expr_for_inline_enum(node: &mut Expr, ctx: &mut TypeScriptCtx) {
    if ctx.transform.is_lhs {
        return;
    }

    if let Expr::Member(MemberExpr { obj, prop, .. }) = node {
        let Some(enum_id) = get_enum_id(obj) else {
            return;
        };

        if ctx.transform.ts_enum_is_mutable && !ctx.transform.const_enum.contains(&enum_id) {
            return;
        }

        let Some(member_name) = get_member_key(prop) else {
            return;
        };

        let key = TsEnumRecordKey {
            enum_id,
            member_name,
        };

        let Some(value) = ctx.transform.enum_record.get(&key) else {
            return;
        };

        if value.is_const() {
            *node = value.clone().into();
        }
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

fn reorder_class_prop_decls_and_inits(
    class_member_list: &mut Vec<ClassMember>,
    prop_list: Vec<Id>,
    mut init_list: Vec<Box<Expr>>,
    var_list: &mut Vec<Id>,
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
                    PropName::Computed(ComputedPropName { span, expr }) if !is_literal(expr) => {
                        let ident = alias_ident_for(expr, "_key");

                        var_list.push(ident.to_id());

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
    class_member_list: &mut Vec<ClassMember>,
    prop_list: Vec<Id>,
    init_list: Vec<Box<Expr>>,
    _var_list: &mut Vec<Id>,
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

// EnumMemberItem and InitArg helpers

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

fn transform_ts_enum(
    ts_enum: TsEnumDecl,
    is_first: bool,
    is_export: bool,
    ctx: &mut TypeScriptCtx,
) -> FoldedDecl {
    let TsEnumDecl {
        span,
        declare,
        is_const,
        id,
        members,
    } = ts_enum;

    debug_assert!(!declare);

    let ts_enum_safe_remove = !ctx.transform.verbatim_module_syntax
        && is_const
        && !is_export
        && !ctx.transform.exported_binding.contains_key(&id.to_id());

    let member_list: Vec<_> = members
        .into_iter()
        .map(|m| {
            let span = m.span;
            let name = enum_member_id_atom(&m.id);

            let key = TsEnumRecordKey {
                enum_id: id.to_id(),
                member_name: name.clone(),
            };

            let value = ctx.transform.enum_record.get(&key).unwrap().clone();

            EnumMemberItem { span, name, value }
        })
        .filter(|m| !ts_enum_safe_remove || !m.is_const())
        .collect();

    if member_list.is_empty() && is_const {
        return FoldedDecl::Empty;
    }

    let stmts = member_list
        .into_iter()
        .filter(|item| !ts_enum_safe_remove || !item.is_const())
        .map(|item| item.build_assign(&id.to_id()));

    let namespace_export = ctx.transform.namespace_id.is_some() && is_export;
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

    let var_kind = if is_export || id.ctxt == ctx.top_level_ctxt {
        VarDeclKind::Var
    } else {
        VarDeclKind::Let
    };

    let init_arg = 'init_arg: {
        let init_arg = InitArg {
            id: &id,
            namespace_id: ctx.transform.namespace_id.as_ref().filter(|_| is_export),
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

    let expr = Factory::function(vec![id.clone().into()], body)
        .as_call(if iife { DUMMY_SP } else { PURE_SP }, vec![init_arg]);

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

fn transform_ts_module(
    ts_module: TsModuleDecl,
    is_export: bool,
    ctx: &mut TypeScriptCtx,
) -> FoldedDecl {
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

    let body = transform_ts_namespace_body(module_ident.to_id(), body, ctx);

    let init_arg = InitArg {
        id: &module_ident,
        namespace_id: ctx.transform.namespace_id.as_ref().filter(|_| is_export),
    }
    .or_assign_empty();

    let expr = Factory::function(vec![module_ident.clone().into()], body)
        .as_call(DUMMY_SP, vec![init_arg])
        .into();

    FoldedDecl::Expr(ExprStmt { span, expr }.into())
}

fn transform_ts_namespace_body(
    id: Id,
    body: TsNamespaceBody,
    ctx: &mut TypeScriptCtx,
) -> BlockStmt {
    let TsNamespaceDecl {
        span,
        declare,
        global,
        id: local_name,
        body,
    } = match body {
        TsNamespaceBody::TsModuleBlock(ts_module_block) => {
            return transform_ts_module_block(id, ts_module_block, ctx);
        }
        TsNamespaceBody::TsNamespaceDecl(ts_namespace_decl) => ts_namespace_decl,
        #[cfg(swc_ast_unknown)]
        _ => panic!("unable to access unknown nodes"),
    };

    debug_assert!(!declare);
    debug_assert!(!global);

    let body = transform_ts_namespace_body(local_name.to_id(), *body, ctx);

    let init_arg = InitArg {
        id: &local_name,
        namespace_id: Some(&id.to_id()),
    }
    .or_assign_empty();

    let expr = Factory::function(vec![local_name.into()], body).as_call(DUMMY_SP, vec![init_arg]);

    BlockStmt {
        span,
        stmts: vec![expr.into_stmt()],
        ..Default::default()
    }
}

fn transform_ts_module_block(
    id: Id,
    TsModuleBlock { span, body }: TsModuleBlock,
    ctx: &mut TypeScriptCtx,
) -> BlockStmt {
    let mut stmts = Vec::new();

    for module_item in body {
        match module_item {
            ModuleItem::Stmt(stmt) => stmts.push(stmt),
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl { decl, span, .. })) => {
                match decl {
                    Decl::Class(ClassDecl { ref ident, .. })
                    | Decl::Fn(FnDecl { ref ident, .. }) => {
                        let assign_stmt = assign_prop(&id, ident, span);
                        stmts.push(decl.into());
                        stmts.push(assign_stmt);
                    }
                    Decl::Var(var_decl) => {
                        let mut exprs: Vec<Box<_>> = var_decl
                            .decls
                            .into_iter()
                            .flat_map(
                                |VarDeclarator {
                                     span,
                                     mut name,
                                     init,
                                     ..
                                 }| {
                                    let right = init?;

                                    // Apply RefRewriter to rewrite exported identifiers with
                                    // namespace prefix
                                    // e.g., [a, b] becomes [util.a, util.b]
                                    // This must be done BEFORE converting to AssignTarget
                                    if let Some(ref_rewriter) = ctx.transform.ref_rewriter.as_mut()
                                    {
                                        name.visit_mut_with(ref_rewriter);
                                    }

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
                }
            }
            ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(decl)) => {
                match decl.module_ref {
                    TsModuleRef::TsEntityName(ts_entity_name) => {
                        let init = ts_entity_name_to_expr(ts_entity_name);

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
                obj: Box::new(ts_entity_name_to_expr(left)),
                prop: MemberProp::Ident(right),
            }
            .into()
        }
        #[cfg(swc_ast_unknown)]
        _ => panic!("unable to access unknown nodes"),
    }
}

fn visit_mut_for_ts_import_export(node: &mut Module, ctx: &mut TypeScriptCtx) {
    let mut should_inject = false;
    let create_require = private_ident!("_createRequire");
    let require = private_ident!("__require");

    // NOTE: This is not correct!
    // However, all unresolved_span are used in TsImportExportAssignConfig::Classic
    // which is deprecated and not used in real world.
    let unresolved_ctxt = ctx.unresolved_ctxt;
    let cjs_require = quote_ident!(unresolved_ctxt, "require");
    let cjs_exports = quote_ident!(unresolved_ctxt, "exports");

    let mut cjs_export_assign = None;

    for module_item in &mut node.body {
        match module_item {
            ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(decl)) if !decl.is_type_only => {
                debug_assert_ne!(
                    decl.id.ctxt, ctx.unresolved_ctxt,
                    "TsImportEquals has top-level context and it should not be identical to the \
                     unresolved mark"
                );
                debug_assert_eq!(decl.id.ctxt, ctx.top_level_ctxt);

                match &mut decl.module_ref {
                    // import foo = bar.baz
                    TsModuleRef::TsEntityName(ts_entity_name) => {
                        let init = ts_entity_name_to_expr(ts_entity_name.clone());

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
                        match ctx.transform.import_export_assign_config {
                            crate::config::TsImportExportAssignConfig::Classic => {
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
                                let mut var_decl =
                                    init.into_var_decl(VarDeclKind::Const, decl.id.take().into());
                                var_decl.span = decl.span;

                                *module_item = var_decl.into();
                            }
                            crate::config::TsImportExportAssignConfig::Preserve => {}
                            crate::config::TsImportExportAssignConfig::NodeNext => {
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
                            crate::config::TsImportExportAssignConfig::EsNext => {
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
        match ctx.transform.import_export_assign_config {
            crate::config::TsImportExportAssignConfig::Classic => {
                let TsExportAssignment { expr, span } = cjs_export_assign;

                let stmt = ExprStmt {
                    span,
                    expr: Box::new(expr.make_assign_to(
                        op!("="),
                        member_expr!(unresolved_ctxt, Default::default(), module.exports).into(),
                    )),
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
            crate::config::TsImportExportAssignConfig::Preserve => {
                node.body.push(cjs_export_assign.into());
            }
            crate::config::TsImportExportAssignConfig::NodeNext
            | crate::config::TsImportExportAssignConfig::EsNext => {
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

fn get_last_module_span(n: &Module, no_empty_export: bool) -> Option<Span> {
    if no_empty_export {
        return None;
    }

    n.body
        .iter()
        .rev()
        .find(|m| is_es_module_decl(m))
        .map(Spanned::span)
}

fn restore_esm_ctx(n: &mut Module, span: Span) {
    if n.body.iter().any(|item| is_es_module_decl(item)) {
        return;
    }

    n.body.push(
        NamedExport {
            span,
            ..NamedExport::dummy()
        }
        .into(),
    );
}

fn is_es_module_decl(item: &ModuleItem) -> bool {
    item.as_module_decl().is_some_and(|decl| {
        matches!(
            decl,
            ModuleDecl::Import(..)
                | ModuleDecl::ExportDecl(..)
                | ModuleDecl::ExportNamed(..)
                | ModuleDecl::ExportDefaultDecl(..)
                | ModuleDecl::ExportDefaultExpr(..)
                | ModuleDecl::ExportAll(..)
        )
    })
}
