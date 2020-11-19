use crate::{bundler::chunk::merge::Ctx, Bundler, Load, ModuleId, Resolve};
use anyhow::{bail, Error};
use std::mem::take;
use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::{find_ids, private_ident, ExprFactory};
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    //  Converts
    ///
    /// ```ts
    /// export const arr = [1, 2, 3];
    /// ```
    ///
    /// to
    ///
    /// ```ts
    /// const _mod = (function(){
    ///     const arr = [1, 2, 3];
    ///     return {
    ///         arr,
    ///     };
    /// })();
    /// ```
    pub(super) fn wrap_esm(
        &self,
        ctx: &Ctx,
        id: ModuleId,
        module: Module,
    ) -> Result<Module, Error> {
        let span = module.span;
        let var_name = match self.scope.wrapped_esm_id(id) {
            Some(v) => v,
            None => bail!("{:?} should not be wrapped with a function", id),
        };

        let mut module_items = vec![];

        let stmts = {
            let mut module = module.fold_with(&mut ExportToReturn::default());

            take(&mut module.body)
                .into_iter()
                .filter_map(|v| match v {
                    ModuleItem::Stmt(s) => Some(s),
                    ModuleItem::ModuleDecl(ModuleDecl::ExportAll(ref export)) => {
                        // We handle this later.
                        let mut map = ctx.export_stars_in_wrapped.lock();
                        map.entry(id).or_default().push(export.span.ctxt);
                        module_items.push(v);
                        None
                    }
                    _ => {
                        module_items.push(v);
                        None
                    }
                })
                .collect()
        };

        let module_fn = Expr::Fn(FnExpr {
            function: Function {
                params: Default::default(),
                decorators: Default::default(),
                span: DUMMY_SP,
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts,
                }),
                is_generator: false,
                is_async: false,
                type_params: Default::default(),
                return_type: Default::default(),
            },
            ident: None,
        });

        let module_expr = Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: module_fn.as_callee(),
            type_args: Default::default(),
            args: Default::default(),
        });

        let var_decl = VarDecl {
            span,
            declare: false,
            kind: VarDeclKind::Const,
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                definite: false,
                name: Pat::Ident(var_name.into_ident()),
                init: Some(Box::new(module_expr)),
            }],
        };

        module_items.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(var_decl))));

        Ok(Module {
            span: DUMMY_SP,
            shebang: None,
            body: module_items,
        })
    }
}

#[derive(Default)]
struct ExportToReturn {
    exports: Vec<PropOrSpread>,
}

impl Fold for ExportToReturn {
    noop_fold_type!();

    fn fold_stmt(&mut self, s: Stmt) -> Stmt {
        s
    }

    fn fold_module_item(&mut self, item: ModuleItem) -> ModuleItem {
        let decl = match item {
            ModuleItem::ModuleDecl(decl) => decl,
            ModuleItem::Stmt(_) => return item,
        };

        let stmt = match decl {
            ModuleDecl::Import(_) => return ModuleItem::ModuleDecl(decl),
            ModuleDecl::ExportDecl(export) => {
                match &export.decl {
                    Decl::Class(ClassDecl { ident, .. }) | Decl::Fn(FnDecl { ident, .. }) => {
                        self.exports
                            .push(PropOrSpread::Prop(Box::new(Prop::Shorthand(ident.clone()))));
                    }
                    Decl::Var(decl) => {
                        let ids: Vec<Ident> = find_ids(decl);
                        self.exports.extend(
                            ids.into_iter()
                                .map(Prop::Shorthand)
                                .map(Box::new)
                                .map(PropOrSpread::Prop),
                        );
                    }
                    _ => unreachable!(),
                }

                Some(Stmt::Decl(export.decl))
            }
            ModuleDecl::ExportNamed(NamedExport {
                src: None,
                specifiers,
                ..
            }) => {
                for s in specifiers {
                    match s {
                        ExportSpecifier::Namespace(_s) => {}
                        ExportSpecifier::Default(_s) => {}
                        ExportSpecifier::Named(_s) => {}
                    }
                }

                None
            }
            ModuleDecl::ExportDefaultDecl(export) => match export.decl {
                DefaultDecl::Class(expr) => {
                    let ident = expr.ident;
                    let ident = ident.unwrap_or_else(|| private_ident!("_default_decl"));

                    self.exports
                        .push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: PropName::Ident(Ident::new(js_word!("default"), export.span)),
                            value: Box::new(Expr::Ident(ident.clone())),
                        }))));

                    Some(Stmt::Decl(Decl::Class(ClassDecl {
                        ident,
                        class: expr.class,
                        declare: false,
                    })))
                }
                DefaultDecl::Fn(expr) => {
                    let ident = expr.ident;
                    let ident = ident.unwrap_or_else(|| private_ident!("_default_decl"));

                    self.exports
                        .push(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                            key: PropName::Ident(Ident::new(js_word!("default"), export.span)),
                            value: Box::new(Expr::Ident(ident.clone())),
                        }))));

                    Some(Stmt::Decl(Decl::Fn(FnDecl {
                        ident,
                        function: expr.function,
                        declare: false,
                    })))
                }
                DefaultDecl::TsInterfaceDecl(_) => None,
            },
            ModuleDecl::ExportDefaultExpr(_) => None,
            ModuleDecl::ExportAll(export) => {
                return ModuleItem::ModuleDecl(ModuleDecl::ExportAll(export))
            }
            ModuleDecl::ExportNamed(named) => {
                for specifier in &named.specifiers {
                    match specifier {
                        ExportSpecifier::Namespace(_) => {}
                        ExportSpecifier::Default(_) => {}
                        ExportSpecifier::Named(named) => match &named.exported {
                            Some(exported) => {
                                self.exports
                                    .push(PropOrSpread::Prop(Box::new(Prop::KeyValue(
                                        KeyValueProp {
                                            key: PropName::Ident(exported.clone()),
                                            value: Box::new(Expr::Ident(named.orig.clone())),
                                        },
                                    ))))
                            }
                            None => {}
                        },
                    }
                }

                return ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(named));
            }
            ModuleDecl::TsImportEquals(_) => None,
            ModuleDecl::TsExportAssignment(_) => None,
            ModuleDecl::TsNamespaceExport(_) => None,
        };

        if let Some(stmt) = stmt {
            ModuleItem::Stmt(stmt)
        } else {
            ModuleItem::Stmt(Stmt::Empty(EmptyStmt { span: DUMMY_SP }))
        }
    }

    fn fold_module_items(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        let mut new = items.fold_children_with(self);

        new.retain(|s| match s {
            ModuleItem::Stmt(Stmt::Empty(..)) => false,
            _ => true,
        });

        new.push(ModuleItem::Stmt(Stmt::Return(ReturnStmt {
            span: DUMMY_SP,
            arg: Some(Box::new(Expr::Object(ObjectLit {
                span: DUMMY_SP,
                props: take(&mut self.exports),
            }))),
        })));

        new
    }
}
