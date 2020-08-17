macro_rules! impl_fold_fn {
    () => {
        fn fold_function(&mut self, f: Function) -> Function {
            if f.body.is_none() {
                return f;
            }

            let f = validate!(f);
            let f = f.fold_children_with(self);

            let (params, body) = self.fold_fn_like(f.params, f.body.unwrap());

            validate!(Function {
                params,
                body: Some(body),
                ..f
            })
        }

        fn fold_arrow_expr(&mut self, f: ArrowExpr) -> ArrowExpr {
            use swc_common::Spanned;

            let f = f.fold_children_with(self);

            let was_expr = match f.body {
                BlockStmtOrExpr::Expr(..) => true,
                _ => false,
            };
            let body_span = f.body.span();
            let (params, mut body) = self.fold_fn_like(
                f.params
                    .into_iter()
                    .map(|pat| Param {
                        span: DUMMY_SP,
                        decorators: Default::default(),
                        pat,
                    })
                    .collect(),
                match f.body {
                    BlockStmtOrExpr::BlockStmt(block) => block,
                    BlockStmtOrExpr::Expr(expr) => BlockStmt {
                        span: body_span,
                        stmts: vec![Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(expr),
                        })],
                    },
                },
            );

            let body = if was_expr
                && body.stmts.len() == 1
                && match body.stmts[0] {
                    Stmt::Return(ReturnStmt { arg: Some(..), .. }) => true,
                    _ => false,
                } {
                match body.stmts.pop().unwrap() {
                    Stmt::Return(ReturnStmt { arg: Some(arg), .. }) => BlockStmtOrExpr::Expr(arg),
                    _ => unreachable!(),
                }
            } else {
                BlockStmtOrExpr::BlockStmt(body)
            };

            validate!(ArrowExpr {
                params: params.into_iter().map(|param| param.pat).collect(),
                body,
                ..f
            })
        }

        fn fold_setter_prop(&mut self, f: SetterProp) -> SetterProp {
            if f.body.is_none() {
                return f;
            }

            let f = f.fold_children_with(self);

            let (mut params, body) = self.fold_fn_like(
                vec![Param {
                    span: DUMMY_SP,
                    decorators: Default::default(),
                    pat: f.param,
                }],
                f.body.unwrap(),
            );
            debug_assert!(params.len() == 1);

            validate!(SetterProp {
                param: params.pop().unwrap().pat,
                body: Some(body),
                ..f
            })
        }

        fn fold_getter_prop(&mut self, f: GetterProp) -> GetterProp {
            if f.body.is_none() {
                return f;
            }

            let f = f.fold_children_with(self);

            let (params, body) = self.fold_fn_like(vec![], f.body.unwrap());
            debug_assert_eq!(params, vec![]);

            validate!(GetterProp {
                body: Some(body),
                ..f
            })
        }

        fn fold_catch_clause(&mut self, f: CatchClause) -> CatchClause {
            let f = f.fold_children_with(self);

            let (mut params, body) = match f.param {
                Some(pat) => self.fold_fn_like(
                    vec![Param {
                        span: DUMMY_SP,
                        decorators: vec![],
                        pat,
                    }],
                    f.body,
                ),
                None => self.fold_fn_like(vec![], f.body),
            };
            assert!(
                params.len() == 0 || params.len() == 1,
                "fold_fn_like should return 0 ~ 1 parameter while handling catch clause"
            );

            let param = if params.is_empty() {
                None
            } else {
                Some(params.pop().unwrap())
            };

            validate!(CatchClause {
                param: param.map(|param| param.pat),
                body,
                ..f
            })
        }

        fn fold_constructor(&mut self, f: Constructor) -> Constructor {
            if f.body.is_none() {
                return f;
            }

            let f = f.fold_children_with(self);

            let params = f
                .params
                .into_iter()
                .map(|pat| match pat {
                    ParamOrTsParamProp::Param(p) => p,
                    _ => unreachable!(
                        "TsParameterProperty should be removed by typescript::strip pass"
                    ),
                })
                .collect();

            let (params, body) = self.fold_fn_like(params, f.body.unwrap());

            validate!(Constructor {
                params: params.into_iter().map(ParamOrTsParamProp::Param).collect(),
                body: Some(body),
                ..f
            })
        }
    };
}

#[cfg(test)]
#[allow(dead_code)]
pub(crate) fn validating(
    name: &'static str,
    tr: impl ::swc_ecma_visit::Fold + 'static,
) -> Box<dyn ::swc_ecma_visit::Fold> {
    Box::new(swc_common::chain!(
        tr,
        crate::debug::validator::Validator { name }
    )) as Box<_>
}

#[cfg(test)]
#[allow(unused_macros)]
macro_rules! validating {
    ($folder:expr) => {{
        crate::macros::validating(stringify!($folder), $folder)
    }};
}

macro_rules! validate {
    ($e:expr) => {{
        if cfg!(debug_assertions) {
            $e.fold_with(&mut $crate::debug::validator::Validator {
                name: concat!(file!(), ':', line!(), ':', column!()),
            })
        } else {
            $e
        }
    }};
}

#[macro_export]
macro_rules! noop_fold_type {
    ($name:ident, $N:tt) => {
        #[inline(always)]
        fn $name(&mut self, node: swc_ecma_ast::$N) -> swc_ecma_ast::$N {
            node
        }
    };
    () => {
        noop_fold_type!(fold_accessibility, Accessibility);
        noop_fold_type!(fold_true_plus_minus, TruePlusMinus);
        noop_fold_type!(fold_ts_array_type, TsArrayType);
        noop_fold_type!(fold_ts_call_signature_decl, TsCallSignatureDecl);
        noop_fold_type!(fold_ts_conditional_type, TsConditionalType);
        noop_fold_type!(fold_ts_construct_signature_decl, TsConstructSignatureDecl);
        noop_fold_type!(fold_ts_constructor_type, TsConstructorType);
        noop_fold_type!(fold_ts_entity_name, TsEntityName);
        noop_fold_type!(fold_ts_enum_decl, TsEnumDecl);
        noop_fold_type!(fold_ts_enum_member, TsEnumMember);
        noop_fold_type!(fold_ts_enum_member_id, TsEnumMemberId);
        noop_fold_type!(fold_ts_external_module_ref, TsExternalModuleRef);
        noop_fold_type!(fold_ts_fn_or_constructor_type, TsFnOrConstructorType);
        noop_fold_type!(fold_ts_fn_param, TsFnParam);
        noop_fold_type!(fold_ts_fn_type, TsFnType);
        noop_fold_type!(fold_ts_import_equals_decl, TsImportEqualsDecl);
        noop_fold_type!(fold_ts_import_type, TsImportType);
        noop_fold_type!(fold_ts_index_signature, TsIndexSignature);
        noop_fold_type!(fold_ts_indexed_access_type, TsIndexedAccessType);
        noop_fold_type!(fold_ts_infer_type, TsInferType);
        noop_fold_type!(fold_ts_interface_body, TsInterfaceBody);
        noop_fold_type!(fold_ts_interface_decl, TsInterfaceDecl);
        noop_fold_type!(fold_ts_intersection_type, TsIntersectionType);
        noop_fold_type!(fold_ts_keyword_type, TsKeywordType);
        noop_fold_type!(fold_ts_keyword_type_kind, TsKeywordTypeKind);
        noop_fold_type!(fold_ts_mapped_type, TsMappedType);
        noop_fold_type!(fold_ts_method_signature, TsMethodSignature);
        noop_fold_type!(fold_ts_module_block, TsModuleBlock);
        noop_fold_type!(fold_ts_module_decl, TsModuleDecl);
        noop_fold_type!(fold_ts_module_name, TsModuleName);
        noop_fold_type!(fold_ts_module_ref, TsModuleRef);
        noop_fold_type!(fold_ts_namespace_body, TsNamespaceBody);
        noop_fold_type!(fold_ts_namespace_decl, TsNamespaceDecl);
        noop_fold_type!(fold_ts_namespace_export_decl, TsNamespaceExportDecl);
        noop_fold_type!(fold_ts_optional_type, TsOptionalType);
        noop_fold_type!(fold_ts_param_prop, TsParamProp);
        noop_fold_type!(fold_ts_param_prop_param, TsParamPropParam);
        noop_fold_type!(fold_ts_parenthesized_type, TsParenthesizedType);
        noop_fold_type!(fold_ts_property_signature, TsPropertySignature);
        noop_fold_type!(fold_ts_qualified_name, TsQualifiedName);
        noop_fold_type!(fold_ts_rest_type, TsRestType);
        noop_fold_type!(fold_ts_signature_decl, TsSignatureDecl);
        noop_fold_type!(fold_ts_this_type, TsThisType);
        noop_fold_type!(fold_ts_this_type_or_ident, TsThisTypeOrIdent);
        noop_fold_type!(fold_ts_tuple_type, TsTupleType);
        noop_fold_type!(fold_ts_type, TsType);
        noop_fold_type!(fold_ts_type_alias_decl, TsTypeAliasDecl);
        noop_fold_type!(fold_ts_type_ann, TsTypeAnn);
        noop_fold_type!(fold_ts_type_assertion, TsTypeAssertion);
        noop_fold_type!(fold_ts_type_cast_expr, TsTypeCastExpr);
        noop_fold_type!(fold_ts_type_element, TsTypeElement);
        noop_fold_type!(fold_ts_type_lit, TsTypeLit);
        noop_fold_type!(fold_ts_type_operator, TsTypeOperator);
        noop_fold_type!(fold_ts_type_operator_op, TsTypeOperatorOp);
        noop_fold_type!(fold_ts_type_param, TsTypeParam);
        noop_fold_type!(fold_ts_type_param_decl, TsTypeParamDecl);
        noop_fold_type!(fold_ts_type_param_instantiation, TsTypeParamInstantiation);
        noop_fold_type!(fold_ts_type_predicate, TsTypePredicate);
        noop_fold_type!(fold_ts_type_query, TsTypeQuery);
        noop_fold_type!(fold_ts_type_query_expr, TsTypeQueryExpr);
        noop_fold_type!(fold_ts_type_ref, TsTypeRef);
        noop_fold_type!(
            fold_ts_union_or_intersection_type,
            TsUnionOrIntersectionType
        );
        noop_fold_type!(fold_ts_union_type, TsUnionType);
    };
}

#[macro_export]
macro_rules! noop_visit_type {
    ($name:ident, $N:tt) => {
        #[inline(always)]
        fn $name(&mut self, _: &swc_ecma_ast::$N, _: &dyn swc_ecma_visit::Node) {}
    };
    () => {
        noop_visit_type!(visit_accessibility, Accessibility);
        noop_visit_type!(visit_true_plus_minus, TruePlusMinus);
        noop_visit_type!(visit_ts_array_type, TsArrayType);
        noop_visit_type!(visit_ts_call_signature_decl, TsCallSignatureDecl);
        noop_visit_type!(visit_ts_conditional_type, TsConditionalType);
        noop_visit_type!(visit_ts_construct_signature_decl, TsConstructSignatureDecl);
        noop_visit_type!(visit_ts_constructor_type, TsConstructorType);
        noop_visit_type!(visit_ts_entity_name, TsEntityName);
        noop_visit_type!(visit_ts_enum_decl, TsEnumDecl);
        noop_visit_type!(visit_ts_enum_member, TsEnumMember);
        noop_visit_type!(visit_ts_enum_member_id, TsEnumMemberId);
        noop_visit_type!(visit_ts_external_module_ref, TsExternalModuleRef);
        noop_visit_type!(visit_ts_fn_or_constructor_type, TsFnOrConstructorType);
        noop_visit_type!(visit_ts_fn_param, TsFnParam);
        noop_visit_type!(visit_ts_fn_type, TsFnType);
        noop_visit_type!(visit_ts_import_equals_decl, TsImportEqualsDecl);
        noop_visit_type!(visit_ts_import_type, TsImportType);
        noop_visit_type!(visit_ts_index_signature, TsIndexSignature);
        noop_visit_type!(visit_ts_indexed_access_type, TsIndexedAccessType);
        noop_visit_type!(visit_ts_infer_type, TsInferType);
        noop_visit_type!(visit_ts_interface_body, TsInterfaceBody);
        noop_visit_type!(visit_ts_interface_decl, TsInterfaceDecl);
        noop_visit_type!(visit_ts_intersection_type, TsIntersectionType);
        noop_visit_type!(visit_ts_keyword_type, TsKeywordType);
        noop_visit_type!(visit_ts_keyword_type_kind, TsKeywordTypeKind);
        noop_visit_type!(visit_ts_mapped_type, TsMappedType);
        noop_visit_type!(visit_ts_method_signature, TsMethodSignature);
        noop_visit_type!(visit_ts_module_block, TsModuleBlock);
        noop_visit_type!(visit_ts_module_decl, TsModuleDecl);
        noop_visit_type!(visit_ts_module_name, TsModuleName);
        noop_visit_type!(visit_ts_module_ref, TsModuleRef);
        noop_visit_type!(visit_ts_namespace_body, TsNamespaceBody);
        noop_visit_type!(visit_ts_namespace_decl, TsNamespaceDecl);
        noop_visit_type!(visit_ts_namespace_export_decl, TsNamespaceExportDecl);
        noop_visit_type!(visit_ts_optional_type, TsOptionalType);
        noop_visit_type!(visit_ts_param_prop, TsParamProp);
        noop_visit_type!(visit_ts_param_prop_param, TsParamPropParam);
        noop_visit_type!(visit_ts_parenthesized_type, TsParenthesizedType);
        noop_visit_type!(visit_ts_property_signature, TsPropertySignature);
        noop_visit_type!(visit_ts_qualified_name, TsQualifiedName);
        noop_visit_type!(visit_ts_rest_type, TsRestType);
        noop_visit_type!(visit_ts_signature_decl, TsSignatureDecl);
        noop_visit_type!(visit_ts_this_type, TsThisType);
        noop_visit_type!(visit_ts_this_type_or_ident, TsThisTypeOrIdent);
        noop_visit_type!(visit_ts_tuple_type, TsTupleType);
        noop_visit_type!(visit_ts_type, TsType);
        noop_visit_type!(visit_ts_type_alias_decl, TsTypeAliasDecl);
        noop_visit_type!(visit_ts_type_ann, TsTypeAnn);
        noop_visit_type!(visit_ts_type_assertion, TsTypeAssertion);
        noop_visit_type!(visit_ts_type_cast_expr, TsTypeCastExpr);
        noop_visit_type!(visit_ts_type_element, TsTypeElement);
        noop_visit_type!(visit_ts_type_lit, TsTypeLit);
        noop_visit_type!(visit_ts_type_operator, TsTypeOperator);
        noop_visit_type!(visit_ts_type_operator_op, TsTypeOperatorOp);
        noop_visit_type!(visit_ts_type_param, TsTypeParam);
        noop_visit_type!(visit_ts_type_param_decl, TsTypeParamDecl);
        noop_visit_type!(visit_ts_type_param_instantiation, TsTypeParamInstantiation);
        noop_visit_type!(visit_ts_type_predicate, TsTypePredicate);
        noop_visit_type!(visit_ts_type_query, TsTypeQuery);
        noop_visit_type!(visit_ts_type_query_expr, TsTypeQueryExpr);
        noop_visit_type!(visit_ts_type_ref, TsTypeRef);
        noop_visit_type!(
            visit_ts_union_or_intersection_type,
            TsUnionOrIntersectionType
        );
        noop_visit_type!(visit_ts_union_type, TsUnionType);
    };
}

#[macro_export]
macro_rules! noop_visit_mut_type {
    ($name:ident, $N:ident) => {
        #[inline(always)]
        fn $name(&mut self, _: &mut swc_ecma_ast::$N) {}
    };
    () => {
        noop_visit_mut_type!(visit_mut_accessibility, Accessibility);
        noop_visit_mut_type!(visit_mut_true_plus_minus, TruePlusMinus);
        noop_visit_mut_type!(visit_mut_ts_array_type, TsArrayType);
        noop_visit_mut_type!(visit_mut_ts_call_signature_decl, TsCallSignatureDecl);
        noop_visit_mut_type!(visit_mut_ts_conditional_type, TsConditionalType);
        noop_visit_mut_type!(
            visit_mut_ts_construct_signature_decl,
            TsConstructSignatureDecl
        );
        noop_visit_mut_type!(visit_mut_ts_constructor_type, TsConstructorType);
        noop_visit_mut_type!(visit_mut_ts_entity_name, TsEntityName);
        noop_visit_mut_type!(visit_mut_ts_enum_decl, TsEnumDecl);
        noop_visit_mut_type!(visit_mut_ts_enum_member, TsEnumMember);
        noop_visit_mut_type!(visit_mut_ts_enum_member_id, TsEnumMemberId);
        noop_visit_mut_type!(visit_mut_ts_external_module_ref, TsExternalModuleRef);
        noop_visit_mut_type!(visit_mut_ts_fn_or_constructor_type, TsFnOrConstructorType);
        noop_visit_mut_type!(visit_mut_ts_fn_param, TsFnParam);
        noop_visit_mut_type!(visit_mut_ts_fn_type, TsFnType);
        noop_visit_mut_type!(visit_mut_ts_import_equals_decl, TsImportEqualsDecl);
        noop_visit_mut_type!(visit_mut_ts_import_type, TsImportType);
        noop_visit_mut_type!(visit_mut_ts_index_signature, TsIndexSignature);
        noop_visit_mut_type!(visit_mut_ts_indexed_access_type, TsIndexedAccessType);
        noop_visit_mut_type!(visit_mut_ts_infer_type, TsInferType);
        noop_visit_mut_type!(visit_mut_ts_interface_body, TsInterfaceBody);
        noop_visit_mut_type!(visit_mut_ts_interface_decl, TsInterfaceDecl);
        noop_visit_mut_type!(visit_mut_ts_intersection_type, TsIntersectionType);
        noop_visit_mut_type!(visit_mut_ts_keyword_type, TsKeywordType);
        noop_visit_mut_type!(visit_mut_ts_keyword_type_kind, TsKeywordTypeKind);
        noop_visit_mut_type!(visit_mut_ts_mapped_type, TsMappedType);
        noop_visit_mut_type!(visit_mut_ts_method_signature, TsMethodSignature);
        noop_visit_mut_type!(visit_mut_ts_module_block, TsModuleBlock);
        noop_visit_mut_type!(visit_mut_ts_module_decl, TsModuleDecl);
        noop_visit_mut_type!(visit_mut_ts_module_name, TsModuleName);
        noop_visit_mut_type!(visit_mut_ts_module_ref, TsModuleRef);
        noop_visit_mut_type!(visit_mut_ts_namespace_body, TsNamespaceBody);
        noop_visit_mut_type!(visit_mut_ts_namespace_decl, TsNamespaceDecl);
        noop_visit_mut_type!(visit_mut_ts_namespace_export_decl, TsNamespaceExportDecl);
        noop_visit_mut_type!(visit_mut_ts_optional_type, TsOptionalType);
        noop_visit_mut_type!(visit_mut_ts_param_prop, TsParamProp);
        noop_visit_mut_type!(visit_mut_ts_param_prop_param, TsParamPropParam);
        noop_visit_mut_type!(visit_mut_ts_parenthesized_type, TsParenthesizedType);
        noop_visit_mut_type!(visit_mut_ts_property_signature, TsPropertySignature);
        noop_visit_mut_type!(visit_mut_ts_qualified_name, TsQualifiedName);
        noop_visit_mut_type!(visit_mut_ts_rest_type, TsRestType);
        noop_visit_mut_type!(visit_mut_ts_signature_decl, TsSignatureDecl);
        noop_visit_mut_type!(visit_mut_ts_this_type, TsThisType);
        noop_visit_mut_type!(visit_mut_ts_this_type_or_ident, TsThisTypeOrIdent);
        noop_visit_mut_type!(visit_mut_ts_tuple_type, TsTupleType);
        noop_visit_mut_type!(visit_mut_ts_type, TsType);
        noop_visit_mut_type!(visit_mut_ts_type_alias_decl, TsTypeAliasDecl);
        noop_visit_mut_type!(visit_mut_ts_type_ann, TsTypeAnn);
        noop_visit_mut_type!(visit_mut_ts_type_assertion, TsTypeAssertion);
        noop_visit_mut_type!(visit_mut_ts_type_cast_expr, TsTypeCastExpr);
        noop_visit_mut_type!(visit_mut_ts_type_element, TsTypeElement);
        noop_visit_mut_type!(visit_mut_ts_type_lit, TsTypeLit);
        noop_visit_mut_type!(visit_mut_ts_type_operator, TsTypeOperator);
        noop_visit_mut_type!(visit_mut_ts_type_operator_op, TsTypeOperatorOp);
        noop_visit_mut_type!(visit_mut_ts_type_param, TsTypeParam);
        noop_visit_mut_type!(visit_mut_ts_type_param_decl, TsTypeParamDecl);
        noop_visit_mut_type!(
            visit_mut_ts_type_param_instantiation,
            TsTypeParamInstantiation
        );
        noop_visit_mut_type!(visit_mut_ts_type_predicate, TsTypePredicate);
        noop_visit_mut_type!(visit_mut_ts_type_query, TsTypeQuery);
        noop_visit_mut_type!(visit_mut_ts_type_query_expr, TsTypeQueryExpr);
        noop_visit_mut_type!(visit_mut_ts_type_ref, TsTypeRef);
        noop_visit_mut_type!(
            visit_mut_ts_union_or_intersection_type,
            TsUnionOrIntersectionType
        );
        noop_visit_mut_type!(visit_mut_ts_union_type, TsUnionType);
    };
}
