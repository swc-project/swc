//! Namespace runtime object emission.

use swc_common::{errors::HANDLER, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, ExprFactory};

use super::{FoldedDecl, InitArg, Transform};
use crate::utils::Factory;

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
