use super::{Emitter, Result};
use crate::list::ListFormat;
use swc_common::Spanned;
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
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_as_expr(&mut self, n: &TsAsExpr) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_call_signature_decl(&mut self, n: &TsCallSignatureDecl) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_cond_type(&mut self, n: &TsConditionalType) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_constructor_signature_decl(&mut self, n: &TsConstructSignatureDecl) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_constructor_type(&mut self, n: &TsConstructorType) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_entity_name(&mut self, n: &TsEntityName) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_enum_decl(&mut self, n: &TsEnumDecl) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_enum_member(&mut self, n: &TsEnumMember) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_enum_member_id(&mut self, n: &TsEnumMemberId) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_export_assignment(&mut self, n: &TsExportAssignment) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_expr_with_type_args(&mut self, n: &TsExprWithTypeArgs) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_external_module_ref(&mut self, n: &TsExternalModuleRef) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_fn_or_constructor_type(&mut self, n: &TsFnOrConstructorType) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_fn_param(&mut self, n: &TsFnParam) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_fn_type(&mut self, n: &TsFnType) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_import_equals_decl(&mut self, n: &TsImportEqualsDecl) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_index_signature(&mut self, n: &TsIndexSignature) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_index_accessed_type(&mut self, n: &TsIndexedAccessType) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_infer_type(&mut self, n: &TsInferType) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_interface_body(&mut self, n: &TsInterfaceBody) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_interface_decl(&mut self, n: &TsInterfaceDecl) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_intersection_type(&mut self, n: &TsIntersectionType) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_keyword_type(&mut self, n: &TsKeywordType) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_lit(&mut self, n: &TsLit) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_lit_type(&mut self, n: &TsLitType) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_mapped_type(&mut self, n: &TsMappedType) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_method_signature(&mut self, n: &TsMethodSignature) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_module_block(&mut self, n: &TsModuleBlock) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_module_decl(&mut self, n: &TsModuleDecl) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_module_name(&mut self, n: &TsModuleName) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_module_ref(&mut self, n: &TsModuleRef) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_ns_body(&mut self, n: &TsNamespaceBody) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_ns_decl(&mut self, n: &TsNamespaceDecl) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_ns_export_decl(&mut self, n: &TsNamespaceExportDecl) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_non_null_expr(&mut self, n: &TsNonNullExpr) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_optional_type(&mut self, n: &TsOptionalType) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_param_prop(&mut self, n: &TsParamProp) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_param_prop_param(&mut self, n: &TsParamPropParam) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_paren_type(&mut self, n: &TsParenthesizedType) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_property_signature(&mut self, n: &TsPropertySignature) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_qualified_name(&mut self, n: &TsQualifiedName) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_rest_type(&mut self, n: &TsRestType) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_signature_decl(&mut self, n: &TsSignatureDecl) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_this_type(&mut self, n: &TsThisType) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_this_type_or_ident(&mut self, n: &TsThisTypeOrIdent) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_tuple_type(&mut self, n: &TsTupleType) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_type(&mut self, n: &TsType) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_type_alias_decl(&mut self, n: &TsTypeAliasDecl) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_type_ann(&mut self, n: &TsTypeAnn) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_type_assertion(&mut self, n: &TsTypeAssertion) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_type_cast_expr(&mut self, n: &TsTypeCastExpr) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_type_element(&mut self, n: &TsTypeElement) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_type_lit(&mut self, n: &TsTypeLit) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_type_operator(&mut self, n: &TsTypeOperator) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_type_param(&mut self, n: &TsTypeParam) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_type_param_decl(&mut self, n: &TsTypeParamDecl) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_type_param_instantiation(&mut self, n: &TsTypeParamInstantiation) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_type_predicate(&mut self, n: &TsTypePredicate) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_type_query(&mut self, n: &TsTypeQuery) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_type_ref(&mut self, n: &TsTypeRef) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_union_or_intersection_type(&mut self, n: &TsUnionOrIntersectionType) -> Result {
        unimplemented!()
    }

    #[emitter]
    pub fn emit_ts_union_type(&mut self, n: &TsUnionType) -> Result {
        unimplemented!()
    }
}
