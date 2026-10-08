//! Namespace instantiation and runtime emission. Instantiation is determined
//! before erasing declarations.
//! Ambient value declarations instantiate their enclosing namespace even though
//! they do not emit statements themselves.

use rustc_hash::FxHashMap;
use swc_common::{errors::HANDLER, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::ExprFactory;

use super::{ContainerContext, FoldedDecl, InitArg, Transform};
use crate::{
    retain::{should_retain_decl, should_retain_module_item},
    utils::Factory,
};

/// The contribution of one declaration body, before applying its own `declare`
/// modifier. Const-enum-only bodies additionally depend on runtime references;
/// pure type bodies stay erased even when another declaration shares their
/// name.
pub(super) enum NamespaceInstantiation {
    NonInstantiated,
    ConstEnumOnly,
    Instantiated,
}

impl NamespaceInstantiation {
    pub(super) fn is_instantiated(&self) -> bool {
        matches!(self, Self::Instantiated)
    }
}

impl<'a> Transform<'a> {
    pub(super) fn namespace_context(
        &self,
        object: Id,
        body: &TsNamespaceBody,
    ) -> Option<ContainerContext<'a>> {
        let bindings = &self.semantic.bindings;
        let container = bindings.container(&object)?;
        let mut locals = FxHashMap::default();

        if let TsNamespaceBody::TsModuleBlock(body) = body {
            for item in &body.body {
                let ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(decl)) = item else {
                    continue;
                };
                if !should_retain_decl(&decl.decl) {
                    continue;
                }
                let ident = match &decl.decl {
                    Decl::Fn(decl) => &decl.ident,
                    Decl::Class(decl) => &decl.ident,
                    _ => continue,
                };
                let Some(declaration) = bindings.ident_declaration(ident) else {
                    continue;
                };
                let Some(member) = bindings.declaration_member(declaration) else {
                    continue;
                };
                locals.insert(member, bindings.declaration(declaration));
            }
        }

        Some(ContainerContext {
            container,
            object,
            locals,
        })
    }

    pub(super) fn namespace_instantiation(
        &self,
        declaration: &TsModuleDecl,
    ) -> NamespaceInstantiation {
        if declaration.global {
            return NamespaceInstantiation::NonInstantiated;
        }
        let Some(body) = &declaration.body else {
            return NamespaceInstantiation::Instantiated;
        };
        let state = self.namespace_body_instantiation(body);
        match &declaration.id {
            TsModuleName::Ident(id) => self.namespace_instantiation_with_usage(id, state),
            _ => state,
        }
    }

    fn namespace_instantiation_with_usage(
        &self,
        id: &Ident,
        state: NamespaceInstantiation,
    ) -> NamespaceInstantiation {
        if matches!(state, NamespaceInstantiation::ConstEnumOnly) {
            let required = self
                .semantic
                .bindings
                .container(&id.to_id())
                .is_some_and(|container| self.semantic.runtime_containers.contains(&container));
            if required {
                return NamespaceInstantiation::Instantiated;
            }
        }
        state
    }

    fn namespace_body_instantiation(&self, body: &TsNamespaceBody) -> NamespaceInstantiation {
        match body {
            TsNamespaceBody::TsNamespaceDecl(declaration) => {
                let state = self.namespace_body_instantiation(&declaration.body);
                self.namespace_instantiation_with_usage(&declaration.id, state)
            }
            TsNamespaceBody::TsModuleBlock(block) => {
                let mut state = NamespaceInstantiation::NonInstantiated;
                for item in &block.body {
                    match self.namespace_item_instantiation(item) {
                        NamespaceInstantiation::Instantiated => {
                            return NamespaceInstantiation::Instantiated;
                        }
                        NamespaceInstantiation::ConstEnumOnly => {
                            state = NamespaceInstantiation::ConstEnumOnly;
                        }
                        NamespaceInstantiation::NonInstantiated => {}
                    }
                }
                state
            }
            #[cfg(swc_ast_unknown)]
            _ => NamespaceInstantiation::NonInstantiated,
        }
    }

    fn namespace_item_instantiation(&self, item: &ModuleItem) -> NamespaceInstantiation {
        match item {
            ModuleItem::Stmt(Stmt::Decl(declaration))
            | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                decl: declaration,
                ..
            })) => match declaration {
                Decl::TsInterface(_) | Decl::TsTypeAlias(_) => {
                    NamespaceInstantiation::NonInstantiated
                }
                Decl::TsModule(declaration) => self.namespace_instantiation(declaration),
                Decl::TsEnum(declaration) => {
                    let ambient_const =
                        declaration.declare && declaration.is_const && !self.verbatim_module_syntax;
                    if ambient_const || self.can_erase_enum(declaration) {
                        NamespaceInstantiation::ConstEnumOnly
                    } else {
                        NamespaceInstantiation::Instantiated
                    }
                }
                // A value declaration contributes even if it is ambient or a
                // function signature with no body. Its own erasure is separate.
                _ => NamespaceInstantiation::Instantiated,
            },
            ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(declaration)) => {
                // Exported aliases instantiate their namespace even when a
                // type-only target erases the alias assignment.
                let instantiates = !declaration.is_type_only
                    && (declaration.is_export
                        || self
                            .semantic
                            .has_import_equals_usage(&declaration.id.to_id()));
                if instantiates {
                    NamespaceInstantiation::Instantiated
                } else {
                    NamespaceInstantiation::NonInstantiated
                }
            }
            _ if should_retain_module_item(item) => NamespaceInstantiation::Instantiated,
            _ => NamespaceInstantiation::NonInstantiated,
        }
    }

    pub(super) fn can_erase_enum(&self, declaration: &TsEnumDecl) -> bool {
        self.semantic
            .enums
            .declaration(&self.semantic.bindings, declaration)
            .is_some_and(|facts| {
                self.semantic
                    .enums
                    .can_erase(facts.container, self.verbatim_module_syntax)
            })
    }
}

impl Transform<'_> {
    pub(super) fn transform_ts_module(
        &self,
        ts_module: TsModuleDecl,
        is_export: bool,
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
            namespace_id: Some(&id),
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

                            // export import foo = bar.baz
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
