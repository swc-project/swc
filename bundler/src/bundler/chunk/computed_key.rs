use crate::bundler::modules::Modules;
use crate::util::ExprExt;
use crate::util::VarDeclaratorExt;
use crate::{bundler::chunk::merge::Ctx, Bundler, Load, ModuleId, Resolve};
use anyhow::{bail, Error};
use std::mem::take;
use swc_atoms::js_word;
use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{find_ids, private_ident, ExprFactory};
use swc_ecma_visit::{noop_fold_type, noop_visit_type, Fold, FoldWith, Node, Visit};

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
        mut module: Modules,
    ) -> Result<Modules, Error> {
        let span = DUMMY_SP;
        let info = self.scope.get_module(id).unwrap();
        let module_var_name = match self.scope.wrapped_esm_id(id) {
            Some(v) => v,
            None => bail!("{:?} should not be wrapped with a function", id),
        };
        let injected_ctxt = self.injected_ctxt;
        let mut injected_vars = vec![];
        module.iter_mut().for_each(|item| match item {
            ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)) => {
                //
                for s in export.specifiers.iter_mut() {
                    match s {
                        ExportSpecifier::Named(ExportNamedSpecifier {
                            span,
                            exported: Some(exported),
                            orig,
                            ..
                        }) => {
                            // Allow using variables within the wrapped es module.
                            injected_vars.push(
                                orig.clone().assign_to(exported.clone()).into_module_item(
                                    injected_ctxt,
                                    "wrapped esm -> aliased export",
                                ),
                            );
                            *s = ExportSpecifier::Named(ExportNamedSpecifier {
                                span: *span,
                                exported: None,
                                orig: exported.clone(),
                            })
                        }
                        _ => {}
                    }
                }
            }
            _ => {}
        });
        module.inject_all(injected_vars);
        module.sort(&self.cm);

        let is_async = {
            let mut v = TopLevelAwaitFinder { found: false };
            module.visit_with(&mut v);
            v.found
        };

        let mut module_items = vec![];

        let stmts = {
            let mut module = Module::from(module).fold_with(&mut ExportToReturn {
                synthesized_ctxt: self.synthesized_ctxt,
                exports: Default::default(),
            });

            take(&mut module.body)
                .into_iter()
                .filter_map(|v| match v {
                    ModuleItem::Stmt(Stmt::Decl(Decl::Var(var))) => {
                        // Handle `export *`-s from dependency modules.
                        //
                        // See: https://github.com/denoland/deno/issues/9200

                        if var.span.ctxt == injected_ctxt {
                            let decl = &var.decls[0];
                            match &decl.name {
                                Pat::Ident(i) => {
                                    if i.sym == js_word!("default") {
                                        return Some(Stmt::Decl(Decl::Var(var)));
                                    }

                                    if let Some(remapped) = ctx.transitive_remap.get(&i.span.ctxt) {
                                        // Create
                                        //
                                        // const local = mod.local;
                                        // expodt { local as exported }
                                        //

                                        let local_var = Ident::new(
                                            i.sym.clone(),
                                            i.span.with_ctxt(info.local_ctxt()),
                                        );

                                        let var_decl = VarDeclarator {
                                            span: DUMMY_SP,
                                            name: Pat::Ident(local_var.clone()),
                                            init: Some(Box::new(Expr::Member(MemberExpr {
                                                span: DUMMY_SP,
                                                obj: module_var_name.clone().as_obj(),
                                                prop: {
                                                    let mut prop = i.clone();
                                                    prop.span.ctxt = SyntaxContext::empty();

                                                    Box::new(Expr::Ident(prop))
                                                },
                                                computed: false,
                                            }))),
                                            definite: false,
                                        };
                                        module_items.push(var_decl.into_module_item(
                                            injected_ctxt,
                                            "reexport from wrapped module",
                                        ));

                                        let specifier =
                                            ExportSpecifier::Named(ExportNamedSpecifier {
                                                span: DUMMY_SP,
                                                orig: local_var.clone(),
                                                exported: {
                                                    let mut exported = local_var.clone();
                                                    exported.span.ctxt = remapped;
                                                    Some(exported)
                                                },
                                            });
                                        module_items.push(ModuleItem::ModuleDecl(
                                            ModuleDecl::ExportNamed(NamedExport {
                                                span: DUMMY_SP.with_ctxt(injected_ctxt),
                                                specifiers: vec![specifier],
                                                src: None,
                                                type_only: false,
                                            }),
                                        ));
                                    }
                                }
                                _ => {}
                            }
                        }

                        Some(Stmt::Decl(Decl::Var(var)))
                    }

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
                is_async,
                type_params: Default::default(),
                return_type: Default::default(),
            },
            ident: None,
        });

        let mut module_expr = Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: module_fn.as_callee(),
            type_args: Default::default(),
            args: Default::default(),
        });

        if is_async {
            module_expr = Expr::Await(AwaitExpr {
                span: DUMMY_SP,
                arg: Box::new(module_expr),
            });
        }

        let var_decl = VarDecl {
            span: span.with_ctxt(self.injected_ctxt),
            declare: false,
            kind: VarDeclKind::Const,
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                definite: false,
                name: Pat::Ident(module_var_name.into_ident()),
                init: Some(Box::new(module_expr)),
            }],
        };

        module_items.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(var_decl))));

        Ok(Modules::from(
            Module {
                span: DUMMY_SP,
                shebang: None,
                body: module_items,
            },
            self.injected_ctxt,
        ))
    }
}

struct TopLevelAwaitFinder {
    found: bool,
}

impl Visit for TopLevelAwaitFinder {
    noop_visit_type!();

    fn visit_function(&mut self, _: &Function, _: &dyn Node) {}
    fn visit_arrow_expr(&mut self, _: &ArrowExpr, _: &dyn Node) {}
    fn visit_class_member(&mut self, _: &ClassMember, _: &dyn Node) {}

    fn visit_await_expr(&mut self, _: &AwaitExpr, _: &dyn Node) {
        self.found = true;
    }
}

struct ExportToReturn {
    exports: Vec<PropOrSpread>,
    synthesized_ctxt: SyntaxContext,
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

        let stmt =
            match decl {
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
                            ExportSpecifier::Named(named) => {
                                match &named.exported {
                                    Some(exported) => self.exports.push(PropOrSpread::Prop(
                                        Box::new(Prop::KeyValue(KeyValueProp {
                                            key: PropName::Ident(exported.clone()),
                                            value: Box::new(Expr::Ident(named.orig.clone())),
                                        })),
                                    )),
                                    None => self.exports.push(PropOrSpread::Prop(Box::new(
                                        Prop::Shorthand(named.orig.clone()),
                                    ))),
                                }
                            }
                        }
                    }

                    // Ignore export {} specified by user.
                    if named.src.is_none() && named.span.ctxt != self.synthesized_ctxt {
                        None
                    } else {
                        return ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(named));
                    }
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
