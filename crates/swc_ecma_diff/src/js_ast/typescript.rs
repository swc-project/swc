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
