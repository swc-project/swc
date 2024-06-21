#![allow(clippy::boxed_local)]

use std::mem::take;

use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    Decl, DefaultDecl, ExportDecl, ExportDefaultDecl, Expr, FnDecl, FnExpr, Module, ModuleDecl,
    ModuleItem, Stmt, TsKeywordType, TsKeywordTypeKind, TsTupleElement, TsTupleType, TsType,
    TsTypeOperator, TsTypeOperatorOp,
};

pub struct Checker {
    is_top_level: bool,
}

impl Checker {
    pub fn transform(&mut self, module: &mut Module) {
        self.is_top_level = true;

        self.transform_module_items(&mut module.body);
    }

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
                        if let Some(decl) = self.decl_to_type_decl(decl) {
                            new_items.push(ModuleItem::Stmt(Stmt::Decl(decl)));
                        } else {
                            self.mark_diagnostic_unable_to_infer(decl.range())
                        }
                    }

                    Decl::TsInterface(_) | Decl::TsTypeAlias(_) | Decl::Using(_) => {
                        new_items.push(item);
                    }
                },

                ModuleItem::Stmt(..) => {}
            }

            prev_is_overload = is_overload;
        }
    }

    fn expr_to_ts_type(
        &mut self,
        e: Box<Expr>,
        as_const: bool,
        as_readonly: bool,
    ) -> Option<TsType> {
        match *e {
            Expr::Array(arr) => {
                let mut elem_types: Vec<TsTupleElement> = vec![];

                for elems in arr.elems {
                    if let Some(expr_or_spread) = elems {
                        if let Some(ts_expr) =
                            self.expr_to_ts_type(expr_or_spread.expr, as_const, as_readonly)
                        {
                            elem_types.push(ts_tuple_element(ts_expr));
                        } else {
                            self.mark_diagnostic_unable_to_infer(expr_or_spread);
                        }
                    } else {
                        // TypeScript converts holey arrays to any
                        // Example: const a = [,,] -> const a = [any, any, any]
                        elem_types.push(ts_tuple_element(TsType::TsKeywordType(TsKeywordType {
                            kind: TsKeywordTypeKind::TsAnyKeyword,
                            span: DUMMY_SP,
                        })))
                    }
                }

                let mut result = TsType::TsTupleType(TsTupleType {
                    span: arr.span,
                    elem_types,
                });

                if as_readonly {
                    result = ts_readonly(result);
                }
                Some(result)
            }
        }
    }
}

fn ts_readonly(ann: TsType) -> TsType {
    TsType::TsTypeOperator(TsTypeOperator {
        span: DUMMY_SP,
        op: TsTypeOperatorOp::ReadOnly,
        type_ann: Box::new(ann),
    })
}

fn ts_tuple_element(ts_type: TsType) -> TsTupleElement {
    TsTupleElement {
        label: None,
        span: DUMMY_SP,
        ty: Box::new(ts_type),
    }
}

fn ts_keyword_type(kind: TsKeywordTypeKind) -> TsType {
    TsType::TsKeywordType(TsKeywordType {
        span: DUMMY_SP,
        kind,
    })
}
