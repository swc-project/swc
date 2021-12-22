use swc_ecma_ast::*;

diff_struct!(TsTypeAnn, [span, type_ann]);
diff_struct!(TsTypeParamDecl, [span, params]);
diff_struct!(TsTypeParam, [span, name, constraint, default]);

diff_enum!(
    TsType,
    [
        TsKeywordType,
        TsThisType,
        TsFnOrConstructorType,
        TsTypeRef,
        TsTypeQuery,
        TsTypeLit,
        TsArrayType,
        TsTupleType,
        TsOptionalType,
        TsRestType,
        TsUnionOrIntersectionType,
        TsConditionalType,
        TsInferType,
        TsParenthesizedType,
        TsTypeOperator,
        TsIndexedAccessType,
        TsMappedType,
        TsLitType,
        TsTypePredicate,
        TsImportType
    ]
);
diff_enum!(TsEntityName, [TsQualifiedName, Ident]);
diff_enum!(
    TsTypeElement,
    [
        TsCallSignatureDecl,
        TsConstructSignatureDecl,
        TsPropertySignature,
        TsGetterSignature,
        TsSetterSignature,
        TsMethodSignature,
        TsIndexSignature
    ]
);

diff_struct!(TsTypeParamInstantiation, [span, params]);
diff_struct!(TsExprWithTypeArgs, [span, expr, type_args]);
diff_struct!(TsAsExpr, [span, expr, type_ann]);
diff_struct!(TsTypeAssertion, [span, expr, type_ann]);
diff_struct!(TsConstAssertion, [span, expr]);
diff_struct!(TsNonNullExpr, [span, expr]);
diff_struct!(
    TsInterfaceDecl,
    [span, id, declare, type_params, extends, body]
);
diff_struct!(TsInterfaceBody, [span, body]);
diff_struct!(TsTypeAliasDecl, [span, declare, id, type_params, type_ann]);
diff_struct!(TsEnumDecl, [span, declare, id, members, is_const]);
diff_struct!(TsEnumMember, [span, id, init]);
diff_enum!(TsEnumMemberId, [Str, Ident]);
diff_struct!(TsModuleDecl, [span, id, body, declare, global]);
diff_enum!(TsModuleName, [Ident, Str]);
diff_enum!(TsNamespaceBody, [TsModuleBlock, TsNamespaceDecl]);
trivial!(Accessibility);
diff_struct!(
    TsIndexSignature,
    [params, type_ann, readonly, is_static, span]
);
diff_enum!(TsFnParam, []);
diff_struct!(
    TsParamProp,
    [
        span,
        decorators,
        accessibility,
        is_override,
        readonly,
        param
    ]
);
diff_enum!(TsParamPropParam, []);
diff_struct!(
    TsImportEqualsDecl,
    [span, declare, is_export, is_type_only, id, module_ref]
);
diff_enum!(TsModuleRef, []);
diff_struct!(TsExportAssignment, [span, expr]);
diff_struct!(TsNamespaceExportDecl, [id, span]);

diff_struct!(TsKeywordType, [span, kind]);
trivial!(TsKeywordTypeKind);
diff_struct!(TsThisType, [span]);
diff_enum!(TsUnionOrIntersectionType, [TsUnionType, TsIntersectionType]);
diff_enum!(TsFnOrConstructorType, [TsFnType, TsConstructorType]);
diff_struct!(TsTypeRef, [span, type_name, type_params]);
diff_struct!(TsTypeQuery, [span, expr_name]);
diff_enum!(TsTypeQueryExpr, []);
diff_struct!(TsTypeLit, [span, members]);
diff_struct!(TsTupleType, [span, elem_types]);
diff_struct!(TsTupleElement, [span, label, ty]);
diff_struct!(TsArrayType, [span, elem_type]);
diff_struct!(TsOptionalType, [span, type_ann]);
diff_struct!(TsRestType, [span, type_ann]);
diff_struct!(
    TsConditionalType,
    [span, check_type, extends_type, true_type, false_type]
);
diff_struct!(TsInferType, [span, type_param]);
diff_struct!(TsParenthesizedType, [span, type_ann]);
diff_struct!(TsTypeOperator, [span, op, type_ann]);
diff_struct!(TsIndexedAccessType, [span, obj_type, index_type, readonly]);
diff_struct!(
    TsMappedType,
    [span, readonly, type_param, type_ann, name_type, optional]
);
diff_struct!(TsLitType, [span, lit]);
trivial!(TruePlusMinus);
diff_enum!(TsLit, []);
diff_struct!(TsTypePredicate, [span, param_name, asserts, type_ann]);
diff_enum!(TsThisTypeOrIdent, [TsThisType, Ident]);
diff_struct!(TsImportType, [span, arg, type_args, qualifier]);
diff_struct!(TsQualifiedName, [left, right]);
diff_struct!(TsUnionType, [span, types]);
diff_struct!(TsIntersectionType, [span, types]);
diff_struct!(TsFnType, [span, params, type_params, type_ann]);
diff_struct!(
    TsConstructorType,
    [span, params, type_params, type_ann, is_abstract]
);

diff_struct!(TsCallSignatureDecl, [span, params, type_ann, type_params]);
diff_struct!(
    TsConstructSignatureDecl,
    [span, params, type_ann, type_params]
);
diff_struct!(
    TsPropertySignature,
    [
        span,
        key,
        type_ann,
        optional,
        readonly,
        computed,
        init,
        params,
        type_params
    ]
);
diff_struct!(
    TsMethodSignature,
    [
        span,
        key,
        type_ann,
        params,
        type_params,
        readonly,
        computed,
        optional
    ]
);
diff_struct!(
    TsGetterSignature,
    [span, readonly, key, computed, optional, type_ann]
);
diff_struct!(
    TsSetterSignature,
    [span, readonly, key, computed, optional, param]
);

diff_struct!(TsNamespaceDecl, [span, declare, global, id, body]);

diff_struct!(TsModuleBlock, [span, body]);
