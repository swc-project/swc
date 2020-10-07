use super::load::TransformedModule;
use crate::{Bundler, Load, Resolve};
use anyhow::Error;
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
    pub(super) fn wrap_esm_as_a_var(
        &self,
        _info: &TransformedModule,
        module: Module,
        id: Ident,
    ) -> Result<Module, Error> {
        let span = module.span;

        let stmts = {
            let mut module = module.fold_with(&mut ExportToReturn::default());

            take(&mut module.body)
                .into_iter()
                .map(|v| match v {
                    ModuleItem::ModuleDecl(_) => unreachable!(),
                    ModuleItem::Stmt(s) => s,
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
                name: Pat::Ident(id.clone()),
                init: Some(Box::new(module_expr)),
            }],
        };

        Ok(Module {
            span: DUMMY_SP,
            shebang: None,
            body: vec![ModuleItem::Stmt(Stmt::Decl(Decl::Var(var_decl)))],
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
            ModuleDecl::Import(_) => None,
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
            ModuleDecl::ExportAll(_) => {
                unimplemented!("export * from 'foo' inside a module loaded with computed key")
            }
            ModuleDecl::ExportNamed(_) => {
                unimplemented!("export {{ a }} from 'foo' inside a module loaded with computed key")
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

        if !self.exports.is_empty() {
            new.push(ModuleItem::Stmt(Stmt::Return(ReturnStmt {
                span: DUMMY_SP,
                arg: Some(Box::new(Expr::Object(ObjectLit {
                    span: DUMMY_SP,
                    props: take(&mut self.exports),
                }))),
            })));
        }

        new
    }
}
