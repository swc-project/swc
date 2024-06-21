use std::mem::take;

use swc_ecma_ast::{
    Decl, DefaultDecl, ExportDecl, ExportDefaultDecl, FnDecl, FnExpr, Module, ModuleDecl,
    ModuleItem, Stmt,
};

pub struct Checker {}

impl Checker {
    pub fn transform(&mut self, module: &mut Module) {}

    fn transform_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        let items = take(items);
        let mut new_items = Vec::with_capacity(items.len());

        let mut prev_is_overload = false;

        for mut item in items {
            let is_overload = match item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl { decl, .. }))
                | ModuleItem::Stmt(Stmt::Decl(decl)) => match decl {
                    Decl::Fn(FnDecl {
                        function, declare, ..
                    }) => !declare && function.body.is_none(),
                    _ => false,
                },

                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                    decl,
                    ..
                })) => match decl {
                    DefaultDecl::Fn(FnExpr { function, .. }) => function.body.is_none(),
                    _ => false,
                },

                _ => false,
            };

            match &mut item {
                // Keep all these
                ModuleItem::ModuleDecl(
                    ModuleDecl::Import(..)
                    | ModuleDecl::TsImportEquals(_)
                    | ModuleDecl::TsNamespaceExport(_)
                    | ModuleDecl::TsExportAssignment(_)
                    | ModuleDecl::ExportNamed(_)
                    | ModuleDecl::ExportAll(_),
                ) => new_items.push(item),

                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    span, decl, ..
                })) => {
                    let should_keep = prev_is_overload && !is_overload;

                    if should_keep {
                        prev_is_overload = is_overload;
                        continue;
                    }

                    if let Some(decl) = self.decl_to_type_decl(decl) {
                        new_items.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(
                            ExportDecl { decl, span: *span },
                        )));
                    } else {
                        self.mark_diagnostic(FastCheckDtsDiagnostic::UnableToInferType {
                            range: self.source_range_to_range(export_decl.range()),
                        })
                    }
                }

                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(export)) => {
                    match &mut export.decl {
                        DefaultDecl::Class(mut class_expr) => {
                            class_expr.class.body = self.class_body_to_type(class_expr.class.body);

                            export.decl = DefaultDecl::Class(class_expr);
                        }
                        DefaultDecl::Fn(mut fn_expr) => {
                            fn_expr.function.body = None;
                            export.decl = DefaultDecl::Fn(fn_expr);
                        }
                        DefaultDecl::TsInterfaceDecl(_) => {}
                    };

                    let should_keep = prev_is_overload && !is_overload;
                    prev_is_overload = is_overload;
                    if should_keep {
                        continue;
                    }

                    new_items.push(item);
                }

                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(export)) => {
                    let should_keep = prev_is_overload && !is_overload;
                    prev_is_overload = is_overload;
                    if should_keep {
                        continue;
                    }

                    let name = self.gen_unique_name();
                    let name_ident = Ident::new(name.into(), DUMMY_SP);
                    let type_ann = self
                        .expr_to_ts_type(*export_default_expr.expr.clone(), false, true)
                        .map(type_ann);

                    if let Some(type_ann) = type_ann {
                        new_items.push(ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(
                            VarDecl {
                                span: DUMMY_SP,
                                kind: VarDeclKind::Const,
                                declare: true,
                                decls: vec![VarDeclarator {
                                    span: DUMMY_SP,
                                    name: Pat::Ident(BindingIdent {
                                        id: name_ident.clone(),
                                        type_ann: Some(type_ann),
                                    }),
                                    init: None,
                                    definite: false,
                                }],
                            },
                        )))));

                        new_items.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(
                            ExportDefaultExpr {
                                span: export_default_expr.span,
                                expr: Box::new(Expr::Ident(name_ident)),
                            },
                        )))
                    } else {
                        new_items.push(ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(
                            ExportDefaultExpr {
                                span: export_default_expr.span,
                                expr: export_default_expr.expr,
                            },
                        )))
                    }
                }

                ModuleItem::Stmt(Stmt::Decl(decl)) => match decl {
                    Decl::TsEnum(_)
                    | Decl::Class(_)
                    | Decl::Fn(_)
                    | Decl::Var(_)
                    | Decl::TsModule(_) => {
                        if let Some(decl) = self.decl_to_type_decl(decl.clone()) {
                            new_items.push(ModuleItem::Stmt(Stmt::Decl(decl)));
                        } else {
                            self.mark_diagnostic_unable_to_infer(decl.range())
                        }
                    }

                    Decl::TsInterface(_) | Decl::TsTypeAlias(_) | Decl::Using(_) => {
                        new_items.push(ModuleItem::Stmt(Stmt::Decl(decl)));
                    }
                },

                ModuleItem::Stmt(..) => {}
            }

            prev_is_overload = is_overload;
        }
    }
}
