#[macro_export]
macro_rules! unreachable_visit_mut_type {
    ($name:ident, $N:ident) => {
        fn $name(&mut self, _: &mut swc_ecma_ast::$N) {
            #[cfg(debug_assertions)]
            unreachable!(stringify!($name));
            #[cfg(not(debug_assertions))]
            unreachable!();
        }
    };
    () => {
        unreachable_visit_mut_type!(visit_mut_accessibility, Accessibility);
        unreachable_visit_mut_type!(visit_mut_true_plus_minus, TruePlusMinus);
        unreachable_visit_mut_type!(visit_mut_ts_array_type, TsArrayType);
        unreachable_visit_mut_type!(visit_mut_ts_call_signature_decl, TsCallSignatureDecl);
        unreachable_visit_mut_type!(visit_mut_ts_conditional_type, TsConditionalType);
        unreachable_visit_mut_type!(
            visit_mut_ts_construct_signature_decl,
            TsConstructSignatureDecl
        );
        unreachable_visit_mut_type!(visit_mut_ts_constructor_type, TsConstructorType);
        unreachable_visit_mut_type!(visit_mut_ts_entity_name, TsEntityName);
        unreachable_visit_mut_type!(visit_mut_ts_external_module_ref, TsExternalModuleRef);
        unreachable_visit_mut_type!(visit_mut_ts_fn_or_constructor_type, TsFnOrConstructorType);
        unreachable_visit_mut_type!(visit_mut_ts_fn_param, TsFnParam);
        unreachable_visit_mut_type!(visit_mut_ts_fn_type, TsFnType);
        unreachable_visit_mut_type!(visit_mut_ts_import_type, TsImportType);
        unreachable_visit_mut_type!(visit_mut_ts_index_signature, TsIndexSignature);
        unreachable_visit_mut_type!(visit_mut_ts_indexed_access_type, TsIndexedAccessType);
        unreachable_visit_mut_type!(visit_mut_ts_infer_type, TsInferType);
        unreachable_visit_mut_type!(visit_mut_ts_interface_body, TsInterfaceBody);
        unreachable_visit_mut_type!(visit_mut_ts_interface_decl, TsInterfaceDecl);
        unreachable_visit_mut_type!(visit_mut_ts_intersection_type, TsIntersectionType);
        unreachable_visit_mut_type!(visit_mut_ts_keyword_type, TsKeywordType);
        unreachable_visit_mut_type!(visit_mut_ts_keyword_type_kind, TsKeywordTypeKind);
        unreachable_visit_mut_type!(visit_mut_ts_mapped_type, TsMappedType);
        unreachable_visit_mut_type!(visit_mut_ts_method_signature, TsMethodSignature);
        unreachable_visit_mut_type!(visit_mut_ts_module_ref, TsModuleRef);
        unreachable_visit_mut_type!(visit_mut_ts_optional_type, TsOptionalType);
        unreachable_visit_mut_type!(visit_mut_ts_parenthesized_type, TsParenthesizedType);
        unreachable_visit_mut_type!(visit_mut_ts_property_signature, TsPropertySignature);
        unreachable_visit_mut_type!(visit_mut_ts_qualified_name, TsQualifiedName);
        unreachable_visit_mut_type!(visit_mut_ts_rest_type, TsRestType);
        unreachable_visit_mut_type!(visit_mut_ts_this_type, TsThisType);
        unreachable_visit_mut_type!(visit_mut_ts_this_type_or_ident, TsThisTypeOrIdent);
        unreachable_visit_mut_type!(visit_mut_ts_tuple_type, TsTupleType);
        unreachable_visit_mut_type!(visit_mut_ts_type, TsType);
        unreachable_visit_mut_type!(visit_mut_ts_type_alias_decl, TsTypeAliasDecl);
        unreachable_visit_mut_type!(visit_mut_ts_type_ann, TsTypeAnn);
        unreachable_visit_mut_type!(visit_mut_ts_type_element, TsTypeElement);
        unreachable_visit_mut_type!(visit_mut_ts_type_lit, TsTypeLit);
        unreachable_visit_mut_type!(visit_mut_ts_type_operator, TsTypeOperator);
        unreachable_visit_mut_type!(visit_mut_ts_type_operator_op, TsTypeOperatorOp);
        unreachable_visit_mut_type!(visit_mut_ts_type_param, TsTypeParam);
        unreachable_visit_mut_type!(visit_mut_ts_type_param_decl, TsTypeParamDecl);
        unreachable_visit_mut_type!(
            visit_mut_ts_type_param_instantiation,
            TsTypeParamInstantiation
        );
        unreachable_visit_mut_type!(visit_mut_ts_type_predicate, TsTypePredicate);
        unreachable_visit_mut_type!(visit_mut_ts_type_query, TsTypeQuery);
        unreachable_visit_mut_type!(visit_mut_ts_type_query_expr, TsTypeQueryExpr);
        unreachable_visit_mut_type!(visit_mut_ts_type_ref, TsTypeRef);
        unreachable_visit_mut_type!(
            visit_mut_ts_union_or_intersection_type,
            TsUnionOrIntersectionType
        );
        unreachable_visit_mut_type!(visit_mut_ts_union_type, TsUnionType);
    };
}

#[macro_export]
macro_rules! type_to_none {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, node: &mut Option<$T>) {
            *node = None;
        }
    };
}
