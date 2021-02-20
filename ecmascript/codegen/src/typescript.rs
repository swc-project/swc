use super::{Emitter, Result};
use crate::{list::ListFormat, text_writer::WriteJs};
use swc_common::Spanned;
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::emitter;

impl<'a> Emitter<'a> {
    #[emitter]
    fn emit_pat_or_ts_param_prop(&mut self, n: &ParamOrTsParamProp) -> Result {
        match *n {
            ParamOrTsParamProp::Param(ref n) => emit!(n),
            ParamOrTsParamProp::TsParamProp(ref n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_ts_array_type(&mut self, n: &TsArrayType) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        emit!(n.elem_type);
        punct!("[");
        punct!("]");
    }

    #[emitter]
    fn emit_ts_as_expr(&mut self, n: &TsAsExpr) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        emit!(n.expr);

        space!();
        keyword!("as");
        space!();

        emit!(n.type_ann);
    }

    #[emitter]
    fn emit_ts_call_signature_decl(&mut self, n: &TsCallSignatureDecl) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        emit!(n.type_params);

        punct!("(");
        self.emit_list(n.span, Some(&n.params), ListFormat::Parameters)?;
        punct!(")");

        if let Some(type_ann) = &n.type_ann {
            space!();
            punct!(":");
            space!();

            emit!(type_ann);
        }
    }

    #[emitter]
    fn emit_ts_cond_type(&mut self, n: &TsConditionalType) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        emit!(n.check_type);
        space!();

        keyword!("extends");
        space!();

        emit!(n.extends_type);
        space!();
        punct!("?");

        space!();
        emit!(n.true_type);
        space!();

        punct!(":");

        space!();
        emit!(n.false_type);
    }

    #[emitter]
    fn emit_ts_constructor_signature_decl(&mut self, n: &TsConstructSignatureDecl) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        keyword!("constructor");

        punct!("(");
        self.emit_list(n.span, Some(&n.params), ListFormat::Parameters)?;
        punct!(")");
    }

    #[emitter]
    fn emit_ts_constructor_type(&mut self, n: &TsConstructorType) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        if n.is_abstract {
            keyword!("abstract");
            space!();
        }

        keyword!("new");
        space!();
        if let Some(type_params) = &n.type_params {
            emit!(type_params);
        }

        punct!("(");
        self.emit_list(n.span, Some(&n.params), ListFormat::Parameters)?;
        punct!(")");

        formatting_space!();
        punct!("=>");
        formatting_space!();

        emit!(n.type_ann)
    }

    #[emitter]
    fn emit_ts_entity_name(&mut self, n: &TsEntityName) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        match n {
            TsEntityName::TsQualifiedName(n) => {
                emit!(n);
            }
            TsEntityName::Ident(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_ts_enum_decl(&mut self, n: &TsEnumDecl) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        if n.declare {
            keyword!("declare");
            space!();
        }

        if n.is_const {
            keyword!("const");
            space!();
        }

        keyword!("enum");
        space!();

        emit!(n.id);
        formatting_space!();

        punct!("{");

        self.emit_list(n.span, Some(&n.members), ListFormat::EnumMembers)?;

        punct!("}");
    }

    #[emitter]
    fn emit_ts_enum_member(&mut self, n: &TsEnumMember) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        emit!(n.id);

        if let Some(init) = &n.init {
            formatting_space!();
            punct!("=");
            formatting_space!();
            emit!(init);
        }
    }

    #[emitter]
    fn emit_ts_enum_member_id(&mut self, n: &TsEnumMemberId) -> Result {
        match n {
            TsEnumMemberId::Ident(n) => emit!(n),
            TsEnumMemberId::Str(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_ts_export_assignment(&mut self, n: &TsExportAssignment) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        keyword!("export");
        formatting_space!();
        punct!("=");
        formatting_space!();
        emit!(n.expr);
    }

    #[emitter]
    fn emit_ts_expr_with_type_args(&mut self, n: &TsExprWithTypeArgs) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        emit!(n.expr);

        emit!(n.type_args);
    }

    #[emitter]
    fn emit_ts_external_module_ref(&mut self, n: &TsExternalModuleRef) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        unimplemented!("emit_ts_external_module_ref")
    }

    #[emitter]
    fn emit_ts_fn_or_constructor_type(&mut self, n: &TsFnOrConstructorType) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        match n {
            TsFnOrConstructorType::TsFnType(n) => emit!(n),
            TsFnOrConstructorType::TsConstructorType(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_ts_fn_param(&mut self, n: &TsFnParam) -> Result {
        match n {
            TsFnParam::Ident(n) => emit!(n),
            TsFnParam::Array(n) => emit!(n),
            TsFnParam::Rest(n) => emit!(n),
            TsFnParam::Object(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_ts_fn_type(&mut self, n: &TsFnType) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        emit!(n.type_params);

        punct!("(");
        self.emit_list(n.span, Some(&n.params), ListFormat::Parameters)?;
        punct!(")");

        formatting_space!();
        punct!("=>");
        formatting_space!();

        emit!(n.type_ann);
    }

    #[emitter]
    fn emit_ts_import_equals_decl(&mut self, n: &TsImportEqualsDecl) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        if n.is_export {
            keyword!("export");
            space!();
        }

        keyword!("import");
        formatting_space!();
        punct!("=");
        formatting_space!();

        emit!(n.module_ref);
    }

    #[emitter]
    fn emit_ts_index_signature(&mut self, n: &TsIndexSignature) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        punct!("[");
        self.emit_list(n.span, Some(&n.params), ListFormat::Parameters)?;
        punct!("]");

        if let Some(type_ann) = &n.type_ann {
            punct!(":");
            formatting_space!();
            emit!(type_ann);
        }
    }

    #[emitter]
    fn emit_ts_index_accessed_type(&mut self, n: &TsIndexedAccessType) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        emit!(n.obj_type);

        punct!("[");
        emit!(n.index_type);
        punct!("]");
    }

    #[emitter]
    fn emit_ts_infer_type(&mut self, n: &TsInferType) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        keyword!("infer");
        space!();
        emit!(n.type_param);
    }

    #[emitter]
    fn emit_ts_interface_body(&mut self, n: &TsInterfaceBody) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        punct!("{");

        self.emit_list(n.span, Some(&n.body), ListFormat::InterfaceMembers)?;

        punct!("}");
    }

    #[emitter]
    fn emit_ts_interface_decl(&mut self, n: &TsInterfaceDecl) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        if n.declare {
            keyword!("declare");
            space!();
        }

        keyword!("interface");
        space!();

        emit!(n.id);

        if let Some(type_params) = &n.type_params {
            emit!(type_params);
        }

        if !n.extends.is_empty() {
            space!();

            keyword!("extends");

            space!();

            self.emit_list(n.span, Some(&n.extends), ListFormat::HeritageClauseTypes)?;
        }

        formatting_space!();

        emit!(n.body);
    }

    #[emitter]
    fn emit_ts_intersection_type(&mut self, n: &TsIntersectionType) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        self.emit_list(
            n.span,
            Some(&n.types),
            ListFormat::IntersectionTypeConstituents,
        )?;
    }

    #[emitter]
    fn emit_ts_keyword_type(&mut self, n: &TsKeywordType) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        match n.kind {
            TsKeywordTypeKind::TsAnyKeyword => keyword!(n.span, "any"),
            TsKeywordTypeKind::TsUnknownKeyword => keyword!(n.span, "unknown"),
            TsKeywordTypeKind::TsNumberKeyword => keyword!(n.span, "number"),
            TsKeywordTypeKind::TsObjectKeyword => keyword!(n.span, "object"),
            TsKeywordTypeKind::TsBooleanKeyword => keyword!(n.span, "boolean"),
            TsKeywordTypeKind::TsBigIntKeyword => keyword!(n.span, "bigint"),
            TsKeywordTypeKind::TsStringKeyword => keyword!(n.span, "string"),
            TsKeywordTypeKind::TsSymbolKeyword => keyword!(n.span, "symbol"),
            TsKeywordTypeKind::TsVoidKeyword => keyword!(n.span, "void"),
            TsKeywordTypeKind::TsUndefinedKeyword => keyword!(n.span, "undefined"),
            TsKeywordTypeKind::TsNullKeyword => keyword!(n.span, "null"),
            TsKeywordTypeKind::TsNeverKeyword => keyword!(n.span, "never"),
            TsKeywordTypeKind::TsIntrinsicKeyword => keyword!(n.span, "intrinsic"),
        }
    }

    #[emitter]
    fn emit_ts_lit(&mut self, n: &TsLit) -> Result {
        match n {
            TsLit::BigInt(n) => emit!(n),
            TsLit::Number(n) => emit!(n),
            TsLit::Str(n) => emit!(n),
            TsLit::Bool(n) => emit!(n),
            TsLit::Tpl(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_ts_tpl_lit(&mut self, node: &TsTplLitType) -> Result {
        debug_assert!(node.quasis.len() == node.types.len() + 1);

        self.emit_leading_comments_of_pos(node.span().lo())?;

        punct!("`");
        let i = 0;

        for i in 0..(node.quasis.len() + node.types.len()) {
            if i % 2 == 0 {
                emit!(node.quasis[i / 2]);
            } else {
                punct!("${");
                emit!(node.types[i / 2]);
                punct!("}");
            }
        }

        punct!("`");
    }

    #[emitter]
    fn emit_ts_lit_type(&mut self, n: &TsLitType) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        emit!(n.lit);
    }

    #[emitter]
    fn emit_ts_mapped_type(&mut self, n: &TsMappedType) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        punct!("{");
        self.wr.write_line()?;
        self.wr.increase_indent()?;

        match n.readonly {
            None => {}
            Some(tpm) => match tpm {
                TruePlusMinus::True => {
                    keyword!("readonly");
                    space!();
                }
                TruePlusMinus::Plus => {
                    punct!("+");
                    keyword!("readonly");
                    space!();
                }
                TruePlusMinus::Minus => {
                    punct!("-");
                    keyword!("readonly");
                    space!();
                }
            },
        }

        punct!("[");
        emit!(n.type_param.name);

        if let Some(constraints) = &n.type_param.constraint {
            space!();
            keyword!("in");
            space!();
        }

        if let Some(default) = &n.type_param.default {
            formatting_space!();
            punct!("=");
            formatting_space!();
            emit!(default);
        }

        emit!(n.type_param.constraint);

        punct!("]");

        match n.optional {
            None => {}
            Some(tpm) => match tpm {
                TruePlusMinus::True => {
                    punct!("?");
                }
                TruePlusMinus::Plus => {
                    punct!("+");
                    punct!("/");
                }
                TruePlusMinus::Minus => {
                    punct!("-");
                    punct!("?");
                }
            },
        }

        punct!(":");
        space!();
        emit!(n.type_ann);
        formatting_semi!();

        self.wr.write_line()?;
        self.wr.decrease_indent()?;
        punct!("}");
    }

    #[emitter]
    fn emit_ts_method_signature(&mut self, n: &TsMethodSignature) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        if n.readonly {
            keyword!("readonly");
        }

        if n.computed {
            punct!("[");
            emit!(n.key);
            punct!("]");
        } else {
            emit!(n.key)
        }

        if n.optional {
            punct!("?");
        }

        if let Some(type_params) = &n.type_params {
            emit!(type_params);
        }

        punct!("(");
        self.emit_list(n.span, Some(&n.params), ListFormat::Parameters)?;
        punct!(")");

        if let Some(ref type_ann) = n.type_ann {
            punct!(":");
            formatting_space!();
            emit!(type_ann);
        }
    }

    #[emitter]
    fn emit_ts_module_block(&mut self, n: &TsModuleBlock) -> Result {
        self.emit_list(n.span, Some(&n.body), ListFormat::SourceFileStatements)?;
        self.emit_leading_comments_of_pos(n.span().lo())?;
    }

    #[emitter]
    fn emit_ts_module_decl(&mut self, n: &TsModuleDecl) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        if n.declare {
            keyword!("declare");
            space!();
        }

        keyword!("module");
        space!();
        emit!(n.id);
        formatting_space!();

        if let Some(body) = &n.body {
            emit!(body);
        }
    }

    #[emitter]
    fn emit_ts_module_name(&mut self, n: &TsModuleName) -> Result {
        match n {
            TsModuleName::Ident(n) => emit!(n),
            TsModuleName::Str(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_ts_module_ref(&mut self, n: &TsModuleRef) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        unimplemented!("emit_ts_module_ref")
    }

    #[emitter]
    fn emit_ts_ns_body(&mut self, n: &TsNamespaceBody) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        punct!("{");
        self.wr.increase_indent()?;
        match n {
            TsNamespaceBody::TsModuleBlock(n) => emit!(n),
            TsNamespaceBody::TsNamespaceDecl(n) => emit!(n),
        }
        self.wr.decrease_indent()?;
        punct!("}");
    }

    #[emitter]
    fn emit_ts_ns_decl(&mut self, n: &TsNamespaceDecl) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        unimplemented!("emit_ts_ns_decl")
    }

    #[emitter]
    fn emit_ts_ns_export_decl(&mut self, n: &TsNamespaceExportDecl) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        keyword!("export");
        space!();
        punct!("=");
        space!();
        emit!(n.id);
    }

    #[emitter]
    fn emit_ts_non_null_expr(&mut self, n: &TsNonNullExpr) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        emit!(n.expr);
        punct!("!")
    }

    #[emitter]
    fn emit_ts_optional_type(&mut self, n: &TsOptionalType) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        emit!(n.type_ann);
        punct!("?");
    }

    #[emitter]
    fn emit_ts_param_prop(&mut self, n: &TsParamProp) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        self.emit_accesibility(n.accessibility)?;

        if n.readonly {
            keyword!("readonly");
            space!();
        }

        emit!(n.param);
    }

    #[emitter]
    fn emit_ts_param_prop_param(&mut self, n: &TsParamPropParam) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        match n {
            TsParamPropParam::Ident(n) => emit!(n),
            TsParamPropParam::Assign(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_ts_paren_type(&mut self, n: &TsParenthesizedType) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        punct!("(");
        emit!(n.type_ann);
        punct!(")");
    }

    #[emitter]
    fn emit_ts_property_signature(&mut self, n: &TsPropertySignature) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        if n.readonly {
            keyword!("readonly");
            space!();
        }

        if n.computed {
            punct!("[");
            emit!(n.key);
            punct!("]");
        } else {
            emit!(n.key);
        }

        if n.optional {
            punct!("?");
        }

        emit!(n.type_params);

        // punct!("(");
        // self.emit_list(n.span, Some(&n.params), ListFormat::Parameters)?;
        // punct!(")");

        if let Some(type_ann) = &n.type_ann {
            punct!(":");
            formatting_space!();
            emit!(type_ann);
        }

        if let Some(init) = &n.init {
            formatting_space!();
            punct!("=");
            formatting_space!();
            emit!(init);
        }
    }

    #[emitter]
    fn emit_ts_qualified_name(&mut self, n: &TsQualifiedName) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        emit!(n.left);
        punct!(".");
        emit!(n.right);
    }

    #[emitter]
    fn emit_ts_rest_type(&mut self, n: &TsRestType) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        punct!("...");
        emit!(n.type_ann);
    }

    #[emitter]
    fn emit_ts_signature_decl(&mut self, n: &TsSignatureDecl) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        match n {
            TsSignatureDecl::TsCallSignatureDecl(n) => {
                emit!(n);
            }
            TsSignatureDecl::TsConstructSignatureDecl(n) => {
                emit!(n);
            }
            TsSignatureDecl::TsMethodSignature(n) => {
                emit!(n);
            }
            TsSignatureDecl::TsFnType(n) => {
                emit!(n);
            }
            TsSignatureDecl::TsConstructorType(n) => {
                emit!(n);
            }
        }
    }

    #[emitter]
    fn emit_ts_this_type(&mut self, n: &TsThisType) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        keyword!(n.span, "this");
    }

    #[emitter]
    fn emit_ts_this_type_or_ident(&mut self, n: &TsThisTypeOrIdent) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        match n {
            TsThisTypeOrIdent::TsThisType(n) => emit!(n),
            TsThisTypeOrIdent::Ident(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_ts_tuple_type(&mut self, n: &TsTupleType) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        punct!("[");
        self.emit_list(n.span, Some(&n.elem_types), ListFormat::TupleTypeElements)?;
        punct!("]");
    }

    #[emitter]
    fn emit_ts_tuple_element(&mut self, n: &TsTupleElement) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        if let Some(label) = &n.label {
            emit!(label);
            punct!(":");
            formatting_space!();
        }

        emit!(n.ty)
    }

    #[emitter]
    fn emit_ts_type(&mut self, n: &TsType) -> Result {
        match n {
            TsType::TsKeywordType(n) => emit!(n),
            TsType::TsThisType(n) => emit!(n),
            TsType::TsFnOrConstructorType(n) => emit!(n),
            TsType::TsTypeRef(n) => emit!(n),
            TsType::TsTypeQuery(n) => emit!(n),
            TsType::TsTypeLit(n) => emit!(n),
            TsType::TsArrayType(n) => emit!(n),
            TsType::TsTupleType(n) => emit!(n),
            TsType::TsOptionalType(n) => emit!(n),
            TsType::TsRestType(n) => emit!(n),
            TsType::TsUnionOrIntersectionType(n) => emit!(n),
            TsType::TsConditionalType(n) => emit!(n),
            TsType::TsInferType(n) => emit!(n),
            TsType::TsParenthesizedType(n) => emit!(n),
            TsType::TsTypeOperator(n) => emit!(n),
            TsType::TsIndexedAccessType(n) => emit!(n),
            TsType::TsMappedType(n) => emit!(n),
            TsType::TsLitType(n) => emit!(n),
            TsType::TsTypePredicate(n) => emit!(n),
            TsType::TsImportType(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_ts_import_type(&mut self, n: &TsImportType) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        keyword!("import");
        punct!("(");
        emit!(n.arg);
        punct!(")");

        if let Some(n) = &n.qualifier {
            punct!(".");
            emit!(n);
        }

        if let Some(type_args) = &n.type_args {
            punct!("<");
            emit!(type_args);
            punct!(">");
        }
    }

    #[emitter]
    fn emit_ts_type_alias_decl(&mut self, n: &TsTypeAliasDecl) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        if n.declare {
            keyword!("declare");
            space!();
        }

        keyword!("type");

        space!();

        emit!(n.id);
        if let Some(type_params) = &n.type_params {
            emit!(type_params);
        }
        formatting_space!();

        punct!("=");

        formatting_space!();

        emit!(n.type_ann);

        formatting_semi!();
    }

    #[emitter]
    fn emit_ts_type_ann(&mut self, n: &TsTypeAnn) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        emit!(n.type_ann)
    }

    #[emitter]
    fn emit_ts_type_assertion(&mut self, n: &TsTypeAssertion) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        keyword!("asserts");
        space!();
        emit!(n.expr);
        space!();
        keyword!("is");
        space!();
        emit!(n.type_ann);
    }

    #[emitter]
    fn emit_ts_const_assertion(&mut self, n: &TsConstAssertion) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        emit!(n.expr);

        space!();
        keyword!("as");
        space!();
        keyword!("const");
    }

    #[emitter]
    fn emit_ts_type_element(&mut self, n: &TsTypeElement) -> Result {
        match n {
            TsTypeElement::TsCallSignatureDecl(n) => emit!(n),
            TsTypeElement::TsConstructSignatureDecl(n) => emit!(n),
            TsTypeElement::TsPropertySignature(n) => emit!(n),
            TsTypeElement::TsMethodSignature(n) => emit!(n),
            TsTypeElement::TsIndexSignature(n) => emit!(n),
        }
        formatting_semi!();
    }

    #[emitter]
    fn emit_ts_type_lit(&mut self, n: &TsTypeLit) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        punct!("{");
        self.emit_list(
            n.span,
            Some(&n.members),
            ListFormat::MultiLineTypeLiteralMembers,
        )?;
        punct!("}");
    }

    #[emitter]
    fn emit_ts_type_operator(&mut self, n: &TsTypeOperator) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        match n.op {
            TsTypeOperatorOp::KeyOf => keyword!("keyof"),
            TsTypeOperatorOp::Unique => keyword!("unique"),
            TsTypeOperatorOp::ReadOnly => keyword!("readonly"),
        }
        space!();
        emit!(n.type_ann);
    }

    #[emitter]
    fn emit_ts_type_param(&mut self, n: &TsTypeParam) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        emit!(n.name);

        if let Some(constraints) = &n.constraint {
            space!();
            keyword!("extends");
            space!();
            emit!(constraints);
        }

        if let Some(default) = &n.default {
            formatting_space!();
            punct!("=");
            formatting_space!();
            emit!(default);
        }
    }

    #[emitter]
    fn emit_ts_type_param_decl(&mut self, n: &TsTypeParamDecl) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        punct!("<");

        self.emit_list(n.span, Some(&n.params), ListFormat::TypeParameters)?;

        punct!(">");
    }

    #[emitter]
    fn emit_ts_type_param_instantiation(&mut self, n: &TsTypeParamInstantiation) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        punct!("<");
        self.emit_list(n.span, Some(&n.params), ListFormat::TypeParameters)?;

        punct!(">");
    }

    #[emitter]
    fn emit_ts_type_predicate(&mut self, n: &TsTypePredicate) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        if n.asserts {
            keyword!("asserts");
            space!();
        }

        emit!(n.param_name);

        if let Some(type_ann) = &n.type_ann {
            space!();
            keyword!("is");
            space!();
            emit!(type_ann);
        }
    }

    #[emitter]
    fn emit_ts_type_query(&mut self, n: &TsTypeQuery) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        keyword!("typeof");
        space!();
        emit!(n.expr_name);
    }

    #[emitter]
    fn emit_ts_type_query_expr(&mut self, n: &TsTypeQueryExpr) -> Result {
        match n {
            TsTypeQueryExpr::TsEntityName(n) => emit!(n),
            TsTypeQueryExpr::Import(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_ts_type_ref(&mut self, n: &TsTypeRef) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        emit!(n.type_name);

        if let Some(n) = &n.type_params {
            punct!("<");
            self.emit_list(n.span, Some(&n.params), ListFormat::TypeArguments)?;
            punct!(">");
        }
    }

    #[emitter]
    fn emit_ts_union_or_intersection_type(&mut self, n: &TsUnionOrIntersectionType) -> Result {
        match n {
            TsUnionOrIntersectionType::TsUnionType(n) => emit!(n),
            TsUnionOrIntersectionType::TsIntersectionType(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_ts_union_type(&mut self, n: &TsUnionType) -> Result {
        self.emit_leading_comments_of_pos(n.span().lo())?;

        self.emit_list(n.span, Some(&n.types), ListFormat::UnionTypeConstituents)?;
    }
}

#[cfg(test)]
mod tests {
    use crate::tests::assert_min_typescript;

    #[test]
    fn qualified_type() {
        assert_min_typescript(
            "var memory: WebAssembly.Memory;",
            "var memory:WebAssembly.Memory",
        );
    }
}
