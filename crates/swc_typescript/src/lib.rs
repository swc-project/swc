#![allow(clippy::boxed_local)]

use std::mem::take;

use swc_atoms::Atom;
use swc_common::DUMMY_SP;
use swc_ecma_ast::{
    Decl, DefaultDecl, ExportDecl, ExportDefaultDecl, Expr, FnDecl, FnExpr, Ident, Lit, Module,
    ModuleDecl, ModuleItem, Prop, PropName, PropOrSpread, Stmt, TsEntityName,
    TsFnOrConstructorType, TsFnParam, TsFnType, TsKeywordType, TsKeywordTypeKind,
    TsPropertySignature, TsTupleElement, TsTupleType, TsType, TsTypeAnn, TsTypeElement, TsTypeLit,
    TsTypeOperator, TsTypeOperatorOp, TsTypeRef,
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

            Expr::Object(obj) => {
                let mut members: Vec<TsTypeElement> = vec![];

                // TODO: Prescan all object properties to know which ones
                // have a getter or a setter. This allows us to apply
                // TypeScript's `readonly` keyword accordingly.

                for item in obj.props {
                    match item {
                        PropOrSpread::Prop(prop_box) => {
                            let prop = *prop_box;
                            match prop {
                                Prop::KeyValue(key_value) => {
                                    let (key, computed) = match key_value.key {
                                        PropName::Ident(ident) => (Expr::Ident(ident), false),
                                        PropName::Str(str_prop) => {
                                            (Expr::Lit(Lit::Str(str_prop)), false)
                                        }
                                        PropName::Num(num) => (Expr::Lit(Lit::Num(num)), true),
                                        PropName::Computed(computed) => (*computed.expr, true),
                                        PropName::BigInt(big_int) => {
                                            (Expr::Lit(Lit::BigInt(big_int)), true)
                                        }
                                    };

                                    let init_type = self
                                        .expr_to_ts_type(key_value.value, as_const, as_readonly)
                                        .map(type_ann);

                                    members.push(TsTypeElement::TsPropertySignature(
                                        TsPropertySignature {
                                            span: DUMMY_SP,
                                            readonly: as_readonly,
                                            key: Box::new(key),
                                            computed,
                                            optional: false,
                                            type_ann: init_type,
                                        },
                                    ));
                                }
                                Prop::Shorthand(_)
                                | Prop::Assign(_)
                                | Prop::Getter(_)
                                | Prop::Setter(_)
                                | Prop::Method(_) => {
                                    self.mark_diagnostic_unsupported_prop(prop.range());
                                }
                            }
                        }
                        PropOrSpread::Spread(_) => self.mark_diagnostic(
                            FastCheckDtsDiagnostic::UnableToInferTypeFromSpread {
                                range: self.source_range_to_range(item.range()),
                            },
                        ),
                    }
                }

                Some(TsType::TsTypeLit(TsTypeLit {
                    span: obj.span,
                    members,
                }))
            }
            Expr::Lit(lit) => {
                if as_const {
                    maybe_lit_to_ts_type_const(&lit)
                } else {
                    maybe_lit_to_ts_type(&lit)
                }
            }
            Expr::TsConstAssertion(ts_const) => self.expr_to_ts_type(ts_const.expr, true, true),
            Expr::TsSatisfies(satisifies) => {
                self.expr_to_ts_type(satisifies.expr, as_const, as_readonly)
            }
            Expr::TsAs(ts_as) => Some(*ts_as.type_ann),
            Expr::Fn(fn_expr) => {
                let return_type = fn_expr
                    .function
                    .return_type
                    .map_or(any_type_ann(), |val| val);

                let params: Vec<TsFnParam> = fn_expr
                    .function
                    .params
                    .into_iter()
                    .filter_map(|param| self.pat_to_ts_fn_param(param.pat))
                    .collect();

                Some(TsType::TsFnOrConstructorType(
                    TsFnOrConstructorType::TsFnType(TsFnType {
                        span: fn_expr.function.span,
                        params,
                        type_ann: return_type,
                        type_params: fn_expr.function.type_params,
                    }),
                ))
            }
            Expr::Arrow(arrow_expr) => {
                let return_type = arrow_expr.return_type.map_or(any_type_ann(), |val| val);

                let params = arrow_expr
                    .params
                    .into_iter()
                    .filter_map(|pat| self.pat_to_ts_fn_param(pat))
                    .collect();

                Some(TsType::TsFnOrConstructorType(
                    TsFnOrConstructorType::TsFnType(TsFnType {
                        span: arrow_expr.span,
                        params,
                        type_ann: return_type,
                        type_params: arrow_expr.type_params,
                    }),
                ))
            }
            // Since fast check requires explicit type annotations these
            // can be dropped as they are not part of an export declaration
            Expr::This(_)
            | Expr::Unary(_)
            | Expr::Update(_)
            | Expr::Bin(_)
            | Expr::Assign(_)
            | Expr::Member(_)
            | Expr::SuperProp(_)
            | Expr::Cond(_)
            | Expr::Call(_)
            | Expr::New(_)
            | Expr::Seq(_)
            | Expr::Ident(_)
            | Expr::Tpl(_)
            | Expr::TaggedTpl(_)
            | Expr::Class(_)
            | Expr::Yield(_)
            | Expr::MetaProp(_)
            | Expr::Await(_)
            | Expr::Paren(_)
            | Expr::JSXMember(_)
            | Expr::JSXNamespacedName(_)
            | Expr::JSXEmpty(_)
            | Expr::JSXElement(_)
            | Expr::JSXFragment(_)
            | Expr::TsTypeAssertion(_)
            | Expr::TsNonNull(_)
            | Expr::TsInstantiation(_)
            | Expr::PrivateName(_)
            | Expr::OptChain(_)
            | Expr::Invalid(_) => None,
        }
    }
}

fn is_void_type(return_type: &TsType) -> bool {
    is_keyword_type(return_type, TsKeywordTypeKind::TsVoidKeyword)
}

fn is_keyword_type(return_type: &TsType, kind: TsKeywordTypeKind) -> bool {
    match return_type {
        TsType::TsKeywordType(TsKeywordType { kind: k, .. }) => k == &kind,
        _ => false,
    }
}

fn any_type_ann() -> Box<TsTypeAnn> {
    type_ann(ts_keyword_type(TsKeywordTypeKind::TsAnyKeyword))
}

fn type_ann(ts_type: TsType) -> Box<TsTypeAnn> {
    Box::new(TsTypeAnn {
        span: DUMMY_SP,
        type_ann: Box::new(ts_type),
    })
}

fn type_ref(name: Atom) -> TsTypeRef {
    TsTypeRef {
        span: DUMMY_SP,
        type_name: TsEntityName::Ident(Ident::new(name, DUMMY_SP)),
        type_params: None,
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
