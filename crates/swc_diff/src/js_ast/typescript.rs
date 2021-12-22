use swc_ecma_ast::*;

diff_struct!(TsTypeAnn, [span, type_ann]);
diff_struct!(TsTypeParamDecl, [span, params]);
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
