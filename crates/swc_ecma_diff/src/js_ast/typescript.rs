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

diff_struct!(TsTypeParamInstantiation, [span, params]);
diff_struct!(TsExprWithTypeArgs, [span, expr, type_args]);
diff_struct!(TsAsExpr, [span, expr, type_ann]);
diff_struct!(TsTypeAssertion, [span, expr, type_ann]);
diff_struct!(TsConstAssertion, [span, expr]);
diff_struct!(TsNonNullExpr, [span, expr]);
