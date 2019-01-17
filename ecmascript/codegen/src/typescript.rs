use super::{Emitter, Result};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::emitter;

impl<'a> Emitter<'a> {
    #[emitter]
    pub fn emit_pat_or_ts_param_prop(&mut self, n: &PatOrTsParamProp) -> Result {
        match *n {
            PatOrTsParamProp::Pat(ref n) => emit!(n),
            PatOrTsParamProp::TsParamProp(ref n) => emit!(n),
        }
    }

    #[emitter]
    pub fn emit_ts_array_type(&mut self, n: &TsArrayType) -> Result {
        unimplemented!("emit_ts_array_type")
    }

    #[emitter]
    pub fn emit_ts_as_expr(&mut self, n: &TsAsExpr) -> Result {
        unimplemented!("emit_ts_as_expr")
    }

    #[emitter]
    pub fn emit_ts_call_signature_decl(&mut self, n: &TsCallSignatureDecl) -> Result {
        unimplemented!("emit_ts_call_signature_decl")
    }

    #[emitter]
    pub fn emit_ts_cond_type(&mut self, n: &TsConditionalType) -> Result {
        unimplemented!("emit_ts_cond_type")
    }

    #[emitter]
    pub fn emit_ts_constructor_signature_decl(&mut self, n: &TsConstructSignatureDecl) -> Result {
        unimplemented!("emit_ts_constructor_signature_decl")
    }

    #[emitter]
    pub fn emit_ts_constructor_type(&mut self, n: &TsConstructorType) -> Result {
        unimplemented!("emit_ts_constructor_type")
    }

    #[emitter]
    pub fn emit_ts_entity_name(&mut self, n: &TsEntityName) -> Result {
        unimplemented!("emit_ts_entity_name")
    }

    #[emitter]
    pub fn emit_ts_enum_decl(&mut self, n: &TsEnumDecl) -> Result {
        unimplemented!("emit_ts_enum_decl")
    }

    #[emitter]
    pub fn emit_ts_enum_member(&mut self, n: &TsEnumMember) -> Result {
        unimplemented!("emit_ts_enum_member")
    }

    #[emitter]
    pub fn emit_ts_enum_member_id(&mut self, n: &TsEnumMemberId) -> Result {
        unimplemented!("emit_ts_enum_member_id")
    }

    #[emitter]
    pub fn emit_ts_export_assignment(&mut self, n: &TsExportAssignment) -> Result {
        unimplemented!("emit_ts_export_assignment")
    }

    #[emitter]
    pub fn emit_ts_expr_with_type_args(&mut self, n: &TsExprWithTypeArgs) -> Result {
        unimplemented!("emit_ts_expr_with_type_args")
    }

    #[emitter]
    pub fn emit_ts_external_module_ref(&mut self, n: &TsExternalModuleRef) -> Result {
        unimplemented!("emit_ts_external_module_ref")
    }

    #[emitter]
    pub fn emit_ts_fn_or_constructor_type(&mut self, n: &TsFnOrConstructorType) -> Result {
        unimplemented!("emit_ts_fn_or_constructor_type")
    }

    #[emitter]
    pub fn emit_ts_fn_param(&mut self, n: &TsFnParam) -> Result {
        unimplemented!("emit_ts_fn_param")
    }

    #[emitter]
    pub fn emit_ts_fn_type(&mut self, n: &TsFnType) -> Result {
        unimplemented!("emit_ts_fn_type")
    }

    #[emitter]
    pub fn emit_ts_import_equals_decl(&mut self, n: &TsImportEqualsDecl) -> Result {
        unimplemented!("emit_ts_import_equals_decl")
    }

    #[emitter]
    pub fn emit_ts_index_signature(&mut self, n: &TsIndexSignature) -> Result {
        unimplemented!("emit_ts_index_signature")
    }

    #[emitter]
    pub fn emit_ts_index_accessed_type(&mut self, n: &TsIndexedAccessType) -> Result {
        unimplemented!("emit_ts_index_accessed_type")
    }

    #[emitter]
    pub fn emit_ts_infer_type(&mut self, n: &TsInferType) -> Result {
        unimplemented!("emit_ts_infer_type")
    }

    #[emitter]
    pub fn emit_ts_interface_body(&mut self, n: &TsInterfaceBody) -> Result {
        unimplemented!("emit_ts_interface_body")
    }

    #[emitter]
    pub fn emit_ts_interface_decl(&mut self, n: &TsInterfaceDecl) -> Result {
        unimplemented!("emit_ts_interface_decl")
    }

    #[emitter]
    pub fn emit_ts_intersection_type(&mut self, n: &TsIntersectionType) -> Result {
        unimplemented!("emit_ts_intersection_type")
    }

    #[emitter]
    pub fn emit_ts_keyword_type(&mut self, n: &TsKeywordType) -> Result {
        unimplemented!("emit_ts_keyword_type")
    }

    #[emitter]
    pub fn emit_ts_lit(&mut self, n: &TsLit) -> Result {
        unimplemented!("emit_ts_lit")
    }

    #[emitter]
    pub fn emit_ts_lit_type(&mut self, n: &TsLitType) -> Result {
        unimplemented!("emit_ts_lit_type")
    }

    #[emitter]
    pub fn emit_ts_mapped_type(&mut self, n: &TsMappedType) -> Result {
        unimplemented!("emit_ts_mapped_type")
    }

    #[emitter]
    pub fn emit_ts_method_signature(&mut self, n: &TsMethodSignature) -> Result {
        unimplemented!("emit_ts_method_signature")
    }

    #[emitter]
    pub fn emit_ts_module_block(&mut self, n: &TsModuleBlock) -> Result {
        unimplemented!("emit_ts_module_block")
    }

    #[emitter]
    pub fn emit_ts_module_decl(&mut self, n: &TsModuleDecl) -> Result {
        unimplemented!("emit_ts_module_decl")
    }

    #[emitter]
    pub fn emit_ts_module_name(&mut self, n: &TsModuleName) -> Result {
        unimplemented!("emit_ts_module_name")
    }

    #[emitter]
    pub fn emit_ts_module_ref(&mut self, n: &TsModuleRef) -> Result {
        unimplemented!("emit_ts_module_ref")
    }

    #[emitter]
    pub fn emit_ts_ns_body(&mut self, n: &TsNamespaceBody) -> Result {
        unimplemented!("emit_ts_ns_body")
    }

    #[emitter]
    pub fn emit_ts_ns_decl(&mut self, n: &TsNamespaceDecl) -> Result {
        unimplemented!("emit_ts_ns_decl")
    }

    #[emitter]
    pub fn emit_ts_ns_export_decl(&mut self, n: &TsNamespaceExportDecl) -> Result {
        unimplemented!("emit_ts_ns_export_decl")
    }

    #[emitter]
    pub fn emit_ts_non_null_expr(&mut self, n: &TsNonNullExpr) -> Result {
        unimplemented!("emit_ts_non_null_expr")
    }

    #[emitter]
    pub fn emit_ts_optional_type(&mut self, n: &TsOptionalType) -> Result {
        unimplemented!("emit_ts_optional_type")
    }

    #[emitter]
    pub fn emit_ts_param_prop(&mut self, n: &TsParamProp) -> Result {
        unimplemented!("emit_ts_param_prop")
    }

    #[emitter]
    pub fn emit_ts_param_prop_param(&mut self, n: &TsParamPropParam) -> Result {
        unimplemented!("emit_ts_param_prop_param")
    }

    #[emitter]
    pub fn emit_ts_paren_type(&mut self, n: &TsParenthesizedType) -> Result {
        unimplemented!("emit_ts_paren_type")
    }

    #[emitter]
    pub fn emit_ts_property_signature(&mut self, n: &TsPropertySignature) -> Result {
        unimplemented!("emit_ts_property_signature")
    }

    #[emitter]
    pub fn emit_ts_qualified_name(&mut self, n: &TsQualifiedName) -> Result {
        unimplemented!("emit_ts_qualified_name")
    }

    #[emitter]
    pub fn emit_ts_rest_type(&mut self, n: &TsRestType) -> Result {
        unimplemented!("emit_ts_rest_type")
    }

    #[emitter]
    pub fn emit_ts_signature_decl(&mut self, n: &TsSignatureDecl) -> Result {
        unimplemented!("emit_ts_signature_decl")
    }

    #[emitter]
    pub fn emit_ts_this_type(&mut self, n: &TsThisType) -> Result {
        unimplemented!("emit_ts_this_type")
    }

    #[emitter]
    pub fn emit_ts_this_type_or_ident(&mut self, n: &TsThisTypeOrIdent) -> Result {
        unimplemented!("emit_ts_this_type_or_ident")
    }

    #[emitter]
    pub fn emit_ts_tuple_type(&mut self, n: &TsTupleType) -> Result {
        unimplemented!("emit_ts_tuple_type")
    }

    #[emitter]
    pub fn emit_ts_type(&mut self, n: &TsType) -> Result {
        unimplemented!("emit_ts_type")
    }

    #[emitter]
    pub fn emit_ts_type_alias_decl(&mut self, n: &TsTypeAliasDecl) -> Result {
        unimplemented!("emit_ts_type_alias_decl")
    }

    #[emitter]
    pub fn emit_ts_type_ann(&mut self, n: &TsTypeAnn) -> Result {
        unimplemented!("emit_ts_type_ann")
    }

    #[emitter]
    pub fn emit_ts_type_assertion(&mut self, n: &TsTypeAssertion) -> Result {
        unimplemented!("emit_ts_type_assertion")
    }

    #[emitter]
    pub fn emit_ts_type_cast_expr(&mut self, n: &TsTypeCastExpr) -> Result {
        unimplemented!("emit_ts_type_cast_expr")
    }

    #[emitter]
    pub fn emit_ts_type_element(&mut self, n: &TsTypeElement) -> Result {
        unimplemented!("emit_ts_type_element")
    }

    #[emitter]
    pub fn emit_ts_type_lit(&mut self, n: &TsTypeLit) -> Result {
        unimplemented!("emit_ts_type_lit")
    }

    #[emitter]
    pub fn emit_ts_type_operator(&mut self, n: &TsTypeOperator) -> Result {
        unimplemented!("emit_ts_type_operator")
    }

    #[emitter]
    pub fn emit_ts_type_param(&mut self, n: &TsTypeParam) -> Result {
        unimplemented!("emit_ts_type_param")
    }

    #[emitter]
    pub fn emit_ts_type_param_decl(&mut self, n: &TsTypeParamDecl) -> Result {
        unimplemented!("emit_ts_type_param_decl")
    }

    #[emitter]
    pub fn emit_ts_type_param_instantiation(&mut self, n: &TsTypeParamInstantiation) -> Result {
        unimplemented!("emit_ts_type_param_instantiation")
    }

    #[emitter]
    pub fn emit_ts_type_predicate(&mut self, n: &TsTypePredicate) -> Result {
        unimplemented!("emit_ts_type_predicate")
    }

    #[emitter]
    pub fn emit_ts_type_query(&mut self, n: &TsTypeQuery) -> Result {
        unimplemented!("emit_ts_type_query")
    }

    #[emitter]
    pub fn emit_ts_type_ref(&mut self, n: &TsTypeRef) -> Result {
        unimplemented!("emit_ts_type_ref")
    }

    #[emitter]
    pub fn emit_ts_union_or_intersection_type(&mut self, n: &TsUnionOrIntersectionType) -> Result {
        unimplemented!("emit_ts_union_or_intersection_type")
    }

    #[emitter]
    pub fn emit_ts_union_type(&mut self, n: &TsUnionType) -> Result {
        unimplemented!("emit_ts_union_type")
    }
}
