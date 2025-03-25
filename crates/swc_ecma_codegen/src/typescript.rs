use swc_common::{SourceMapper, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::emitter;

use super::{Emitter, Result};
use crate::text_writer::WriteJs;

impl<W, S: SourceMapper + SourceMapperExt> Emitter<'_, W, S>
where
    W: WriteJs,
{
    #[emitter]
    fn emit_pat_or_ts_param_prop(&mut self, n: &ParamOrTsParamProp) -> Result {
        match *n {
            ParamOrTsParamProp::Param(ref n) => emit!(n),
            ParamOrTsParamProp::TsParamProp(ref n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_ts_array_type(&mut self, n: &TsArrayType) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        emit!(n.elem_type);
        punct!(self, "[");
        punct!(self, "]");
    }

    #[emitter]
    fn emit_ts_as_expr(&mut self, n: &TsAsExpr) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        emit!(n.expr);

        space!(self);
        keyword!(self, "as");
        space!(self);

        emit!(n.type_ann);
    }

    #[emitter]
    fn emit_ts_satisfies_expr(&mut self, n: &TsSatisfiesExpr) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        emit!(n.expr);

        space!(self);
        keyword!(self, "satisfies");
        space!(self);

        emit!(n.type_ann);
    }

    #[emitter]
    fn emit_ts_call_signature_decl(&mut self, n: &TsCallSignatureDecl) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        emit!(n.type_params);

        punct!(self, "(");
        self.emit_list(n.span, Some(&n.params), ListFormat::Parameters)?;
        punct!(self, ")");

        if let Some(type_ann) = &n.type_ann {
            space!(self);
            punct!(self, ":");
            space!(self);

            emit!(type_ann);
        }
    }

    #[emitter]
    fn emit_ts_cond_type(&mut self, n: &TsConditionalType) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        emit!(n.check_type);
        space!(self);

        keyword!(self, "extends");
        space!(self);

        emit!(n.extends_type);
        space!(self);
        punct!(self, "?");

        space!(self);
        emit!(n.true_type);
        space!(self);

        punct!(self, ":");

        space!(self);
        emit!(n.false_type);
    }

    #[emitter]
    fn emit_ts_constructor_signature_decl(&mut self, n: &TsConstructSignatureDecl) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        keyword!(self, "new");
        if let Some(type_params) = &n.type_params {
            space!(self);
            emit!(type_params);
        }

        punct!(self, "(");
        self.emit_list(n.span, Some(&n.params), ListFormat::Parameters)?;
        punct!(self, ")");

        if let Some(type_ann) = &n.type_ann {
            punct!(self, ":");
            space!(self);
            emit!(type_ann);
        }
    }

    #[emitter]
    fn emit_ts_constructor_type(&mut self, n: &TsConstructorType) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        if n.is_abstract {
            keyword!(self, "abstract");
            space!(self);
        }

        keyword!(self, "new");
        if let Some(type_params) = &n.type_params {
            space!(self);
            emit!(type_params);
        }

        punct!(self, "(");
        self.emit_list(n.span, Some(&n.params), ListFormat::Parameters)?;
        punct!(self, ")");

        formatting_space!(self);
        punct!(self, "=>");
        formatting_space!(self);

        emit!(n.type_ann)
    }

    #[emitter]
    fn emit_ts_entity_name(&mut self, n: &TsEntityName) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        match n {
            TsEntityName::TsQualifiedName(n) => {
                emit!(n);
            }
            TsEntityName::Ident(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_ts_enum_decl(&mut self, n: &TsEnumDecl) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        if n.declare {
            keyword!(self, "declare");
            space!(self);
        }

        if n.is_const {
            keyword!(self, "const");
            space!(self);
        }

        keyword!(self, "enum");
        space!(self);

        emit!(n.id);
        formatting_space!(self);

        punct!(self, "{");

        self.emit_list(n.span, Some(&n.members), ListFormat::EnumMembers)?;

        punct!(self, "}");
    }

    #[emitter]
    fn emit_ts_enum_member(&mut self, n: &TsEnumMember) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        emit!(n.id);

        if let Some(init) = &n.init {
            formatting_space!(self);
            punct!(self, "=");
            formatting_space!(self);
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
        self.emit_leading_comments_of_span(n.span(), false)?;

        keyword!(self, "export");
        formatting_space!(self);
        punct!(self, "=");
        formatting_space!(self);
        emit!(n.expr);
    }

    #[emitter]
    fn emit_ts_expr_with_type_args(&mut self, n: &TsExprWithTypeArgs) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        emit!(n.expr);

        emit!(n.type_args);
    }

    #[emitter]
    fn emit_ts_external_module_ref(&mut self, n: &TsExternalModuleRef) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        keyword!(self, "require");
        punct!(self, "(");
        emit!(n.expr);
        punct!(self, ")");
    }

    #[emitter]
    fn emit_ts_fn_or_constructor_type(&mut self, n: &TsFnOrConstructorType) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

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
        self.emit_leading_comments_of_span(n.span(), false)?;

        emit!(n.type_params);

        punct!(self, "(");
        self.emit_list(n.span, Some(&n.params), ListFormat::Parameters)?;
        punct!(self, ")");

        formatting_space!(self);
        punct!(self, "=>");
        formatting_space!(self);

        emit!(n.type_ann);
    }

    #[emitter]
    fn emit_ts_import_equals_decl(&mut self, n: &TsImportEqualsDecl) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        if n.is_export {
            keyword!(self, "export");
            space!(self);
        }

        keyword!(self, "import");
        space!(self);

        if n.is_type_only {
            keyword!(self, "type");
            space!(self);
        }

        emit!(n.id);

        formatting_space!(self);

        punct!(self, "=");
        formatting_space!(self);

        emit!(n.module_ref);
        formatting_semi!();
    }

    #[emitter]
    fn emit_ts_index_signature(&mut self, n: &TsIndexSignature) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        if n.readonly {
            keyword!(self, "readonly");
            formatting_space!(self);
        }

        punct!(self, "[");
        self.emit_list(n.span, Some(&n.params), ListFormat::Parameters)?;
        punct!(self, "]");

        if let Some(type_ann) = &n.type_ann {
            punct!(self, ":");
            formatting_space!(self);
            emit!(type_ann);
        }
    }

    #[emitter]
    fn emit_ts_index_accessed_type(&mut self, n: &TsIndexedAccessType) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        emit!(n.obj_type);

        punct!(self, "[");
        emit!(n.index_type);
        punct!(self, "]");
    }

    #[emitter]
    fn emit_ts_infer_type(&mut self, n: &TsInferType) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        keyword!(self, "infer");
        space!(self);
        emit!(n.type_param);
    }

    #[emitter]
    fn emit_ts_interface_body(&mut self, n: &TsInterfaceBody) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        punct!(self, "{");

        self.emit_list(n.span, Some(&n.body), ListFormat::InterfaceMembers)?;

        punct!(self, "}");
    }

    #[emitter]
    fn emit_ts_interface_decl(&mut self, n: &TsInterfaceDecl) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        if n.declare {
            keyword!(self, "declare");
            space!(self);
        }

        keyword!(self, "interface");
        space!(self);

        emit!(n.id);

        if let Some(type_params) = &n.type_params {
            emit!(type_params);
        }

        if !n.extends.is_empty() {
            space!(self);

            keyword!(self, "extends");

            space!(self);

            self.emit_list(n.span, Some(&n.extends), ListFormat::HeritageClauseTypes)?;
        }

        formatting_space!(self);

        emit!(n.body);
    }

    #[emitter]
    fn emit_ts_intersection_type(&mut self, n: &TsIntersectionType) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        self.emit_list(
            n.span,
            Some(&n.types),
            ListFormat::IntersectionTypeConstituents,
        )?;
    }

    #[emitter]
    fn emit_ts_keyword_type(&mut self, n: &TsKeywordType) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        match n.kind {
            TsKeywordTypeKind::TsAnyKeyword => keyword!(self, n.span, "any"),
            TsKeywordTypeKind::TsUnknownKeyword => keyword!(self, n.span, "unknown"),
            TsKeywordTypeKind::TsNumberKeyword => keyword!(self, n.span, "number"),
            TsKeywordTypeKind::TsObjectKeyword => keyword!(self, n.span, "object"),
            TsKeywordTypeKind::TsBooleanKeyword => keyword!(self, n.span, "boolean"),
            TsKeywordTypeKind::TsBigIntKeyword => keyword!(self, n.span, "bigint"),
            TsKeywordTypeKind::TsStringKeyword => keyword!(self, n.span, "string"),
            TsKeywordTypeKind::TsSymbolKeyword => keyword!(self, n.span, "symbol"),
            TsKeywordTypeKind::TsVoidKeyword => keyword!(self, n.span, "void"),
            TsKeywordTypeKind::TsUndefinedKeyword => keyword!(self, n.span, "undefined"),
            TsKeywordTypeKind::TsNullKeyword => keyword!(self, n.span, "null"),
            TsKeywordTypeKind::TsNeverKeyword => keyword!(self, n.span, "never"),
            TsKeywordTypeKind::TsIntrinsicKeyword => keyword!(self, n.span, "intrinsic"),
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

        self.emit_leading_comments_of_span(node.span(), false)?;

        punct!(self, "`");

        for i in 0..(node.quasis.len() + node.types.len()) {
            if i % 2 == 0 {
                emit!(node.quasis[i / 2]);
            } else {
                punct!(self, "${");
                emit!(node.types[i / 2]);
                punct!(self, "}");
            }
        }

        punct!(self, "`");
    }

    #[emitter]
    fn emit_ts_lit_type(&mut self, n: &TsLitType) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        emit!(n.lit);
    }

    #[emitter]
    fn emit_ts_mapped_type(&mut self, n: &TsMappedType) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        punct!(self, "{");
        self.wr.write_line()?;
        self.wr.increase_indent()?;

        match n.readonly {
            None => {}
            Some(tpm) => match tpm {
                TruePlusMinus::True => {
                    keyword!(self, "readonly");
                    space!(self);
                }
                TruePlusMinus::Plus => {
                    punct!(self, "+");
                    keyword!(self, "readonly");
                    space!(self);
                }
                TruePlusMinus::Minus => {
                    punct!(self, "-");
                    keyword!(self, "readonly");
                    space!(self);
                }
            },
        }

        punct!(self, "[");

        emit!(n.type_param.name);

        if let Some(constraints) = &n.type_param.constraint {
            space!(self);
            keyword!(self, "in");
            space!(self);
            emit!(constraints);
        }

        if let Some(default) = &n.type_param.default {
            formatting_space!(self);
            punct!(self, "=");
            formatting_space!(self);
            emit!(default);
        }

        if let Some(name_type) = &n.name_type {
            space!(self);
            keyword!(self, "as");
            space!(self);
            emit!(name_type);
        }

        punct!(self, "]");

        match n.optional {
            None => {}
            Some(tpm) => match tpm {
                TruePlusMinus::True => {
                    punct!(self, "?");
                }
                TruePlusMinus::Plus => {
                    punct!(self, "+");
                    punct!(self, "?");
                }
                TruePlusMinus::Minus => {
                    punct!(self, "-");
                    punct!(self, "?");
                }
            },
        }

        if let Some(type_ann) = &n.type_ann {
            punct!(self, ":");
            space!(self);
            emit!(type_ann);
        }

        formatting_semi!();

        self.wr.write_line()?;
        self.wr.decrease_indent()?;
        punct!(self, "}");
    }

    #[emitter]
    fn emit_ts_method_signature(&mut self, n: &TsMethodSignature) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        if n.computed {
            punct!(self, "[");
            emit!(n.key);
            punct!(self, "]");
        } else {
            emit!(n.key)
        }

        if n.optional {
            punct!(self, "?");
        }

        if let Some(type_params) = &n.type_params {
            emit!(type_params);
        }

        punct!(self, "(");
        self.emit_list(n.span, Some(&n.params), ListFormat::Parameters)?;
        punct!(self, ")");

        if let Some(ref type_ann) = n.type_ann {
            punct!(self, ":");
            formatting_space!(self);
            emit!(type_ann);
        }
    }

    #[emitter]
    fn emit_ts_module_block(&mut self, n: &TsModuleBlock) -> Result {
        self.emit_list(n.span, Some(&n.body), ListFormat::SourceFileStatements)?;
        self.emit_leading_comments_of_span(n.span(), false)?;
    }

    #[emitter]
    fn emit_ts_module_decl(&mut self, n: &TsModuleDecl) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        if n.declare {
            keyword!(self, "declare");
            space!(self);
        }

        if n.global {
            keyword!(self, "global");
        } else {
            match &n.id {
                // prefer namespace keyword because TS might
                // deprecate the module keyword in this context
                TsModuleName::Ident(_) => keyword!(self, "namespace"),
                TsModuleName::Str(_) => keyword!(self, "module"),
            }
            space!(self);
            emit!(n.id);
        }

        if let Some(mut body) = n.body.as_ref() {
            while let TsNamespaceBody::TsNamespaceDecl(decl) = body {
                punct!(self, ".");
                emit!(decl.id);
                body = &*decl.body;
            }
            formatting_space!(self);
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
        self.emit_leading_comments_of_span(n.span(), false)?;

        match n {
            TsModuleRef::TsEntityName(n) => emit!(n),
            TsModuleRef::TsExternalModuleRef(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_ts_ns_body(&mut self, n: &TsNamespaceBody) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        punct!(self, "{");
        self.wr.increase_indent()?;
        match n {
            TsNamespaceBody::TsModuleBlock(n) => emit!(n),
            TsNamespaceBody::TsNamespaceDecl(n) => emit!(n),
        }
        self.wr.decrease_indent()?;
        punct!(self, "}");
    }

    #[emitter]
    fn emit_ts_ns_decl(&mut self, n: &TsNamespaceDecl) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        if n.declare {
            keyword!(self, "declare");
            space!(self);
        }

        keyword!(self, "namespace");
        space!(self);
        emit!(n.id);
        formatting_space!(self);

        emit!(n.body);
    }

    #[emitter]
    fn emit_ts_ns_export_decl(&mut self, n: &TsNamespaceExportDecl) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        keyword!(self, "export");
        space!(self);
        punct!(self, "=");
        space!(self);
        emit!(n.id);
    }

    #[emitter]
    fn emit_ts_non_null_expr(&mut self, n: &TsNonNullExpr) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        emit!(n.expr);
        punct!(self, "!")
    }

    #[emitter]
    fn emit_ts_optional_type(&mut self, n: &TsOptionalType) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        emit!(n.type_ann);
        punct!(self, "?");
    }

    #[emitter]
    fn emit_ts_param_prop(&mut self, n: &TsParamProp) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        self.emit_list(n.span, Some(&n.decorators), ListFormat::Decorators)?;

        self.emit_accessibility(n.accessibility)?;

        if n.is_override {
            keyword!(self, "override");
            space!(self);
        }

        if n.readonly {
            keyword!(self, "readonly");
            space!(self);
        }

        emit!(n.param);
    }

    #[emitter]
    fn emit_ts_param_prop_param(&mut self, n: &TsParamPropParam) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        match n {
            TsParamPropParam::Ident(n) => emit!(n),
            TsParamPropParam::Assign(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_ts_paren_type(&mut self, n: &TsParenthesizedType) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        punct!(self, "(");
        emit!(n.type_ann);
        punct!(self, ")");
    }

    #[emitter]
    fn emit_ts_property_signature(&mut self, n: &TsPropertySignature) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        if n.readonly {
            keyword!(self, "readonly");
            space!(self);
        }

        if n.computed {
            punct!(self, "[");
            emit!(n.key);
            punct!(self, "]");
        } else {
            emit!(n.key);
        }

        if n.optional {
            punct!(self, "?");
        }

        // punct!(self,"(");
        // self.emit_list(n.span, Some(&n.params), ListFormat::Parameters)?;
        // punct!(self,")");

        if let Some(type_ann) = &n.type_ann {
            punct!(self, ":");
            formatting_space!(self);
            emit!(type_ann);
        }
    }

    #[emitter]
    fn emit_ts_qualified_name(&mut self, n: &TsQualifiedName) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        emit!(n.left);
        punct!(self, ".");
        emit!(n.right);
    }

    #[emitter]
    fn emit_ts_rest_type(&mut self, n: &TsRestType) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        punct!(self, "...");
        emit!(n.type_ann);
    }

    #[emitter]
    fn emit_ts_this_type(&mut self, n: &TsThisType) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        keyword!(self, n.span, "this");
    }

    #[emitter]
    fn emit_ts_this_type_or_ident(&mut self, n: &TsThisTypeOrIdent) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        match n {
            TsThisTypeOrIdent::TsThisType(n) => emit!(n),
            TsThisTypeOrIdent::Ident(n) => emit!(n),
        }
    }

    #[emitter]
    fn emit_ts_tuple_type(&mut self, n: &TsTupleType) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        punct!(self, "[");
        self.emit_list(n.span, Some(&n.elem_types), ListFormat::TupleTypeElements)?;
        punct!(self, "]");
    }

    #[emitter]
    fn emit_ts_tuple_element(&mut self, n: &TsTupleElement) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        if let Some(label) = &n.label {
            emit!(label);
            punct!(self, ":");
            formatting_space!(self);
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
        self.emit_leading_comments_of_span(n.span(), false)?;

        keyword!(self, "import");
        punct!(self, "(");
        emit!(n.arg);
        if let Some(attributes) = &n.attributes {
            punct!(self, ",");
            formatting_space!(self);
            emit!(attributes);
        }
        punct!(self, ")");

        if let Some(n) = &n.qualifier {
            punct!(self, ".");
            emit!(n);
        }

        emit!(n.type_args);
    }

    #[emitter]
    fn emit_ts_import_call_options(&mut self, n: &TsImportCallOptions) -> Result {
        punct!(self, "{");
        if !self.cfg.minify {
            self.wr.write_line()?;
            self.wr.increase_indent()?;
        }

        keyword!(self, "with");
        punct!(self, ":");
        formatting_space!(self);
        emit!(n.with);

        if !self.cfg.minify {
            self.wr.decrease_indent()?;
            self.wr.write_line()?;
        }
        punct!(self, "}");
    }

    #[emitter]
    fn emit_ts_type_alias_decl(&mut self, n: &TsTypeAliasDecl) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        if n.declare {
            keyword!(self, "declare");
            space!(self);
        }

        keyword!(self, "type");

        space!(self);

        emit!(n.id);
        if let Some(type_params) = &n.type_params {
            emit!(type_params);
        }
        formatting_space!(self);

        punct!(self, "=");

        formatting_space!(self);

        emit!(n.type_ann);

        formatting_semi!();
    }

    #[emitter]
    fn emit_ts_type_ann(&mut self, n: &TsTypeAnn) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        emit!(n.type_ann)
    }

    #[emitter]
    fn emit_ts_type_assertion(&mut self, n: &TsTypeAssertion) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        punct!(self, "<");
        emit!(n.type_ann);
        punct!(self, ">");
        emit!(n.expr);
    }

    #[emitter]
    fn emit_ts_const_assertion(&mut self, n: &TsConstAssertion) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        emit!(n.expr);

        space!(self);
        keyword!(self, "as");
        space!(self);
        keyword!(self, "const");
    }

    #[emitter]
    fn emit_ts_type_element(&mut self, n: &TsTypeElement) -> Result {
        match n {
            TsTypeElement::TsCallSignatureDecl(n) => emit!(n),
            TsTypeElement::TsConstructSignatureDecl(n) => emit!(n),
            TsTypeElement::TsPropertySignature(n) => emit!(n),
            TsTypeElement::TsMethodSignature(n) => emit!(n),
            TsTypeElement::TsIndexSignature(n) => emit!(n),
            TsTypeElement::TsGetterSignature(n) => {
                emit!(n)
            }
            TsTypeElement::TsSetterSignature(n) => {
                emit!(n)
            }
        }
        formatting_semi!();
    }

    #[emitter]
    fn emit_ts_getter_signature(&mut self, n: &TsGetterSignature) -> Result {
        keyword!(self, "get");
        space!(self);

        if n.computed {
            punct!(self, "[");
            emit!(n.key);
            punct!(self, "]");
        } else {
            emit!(n.key)
        }

        punct!(self, "(");
        punct!(self, ")");

        if let Some(ty) = &n.type_ann {
            punct!(self, ":");
            formatting_space!(self);

            emit!(ty.type_ann);
        }
    }

    #[emitter]
    fn emit_ts_setter_signature(&mut self, n: &TsSetterSignature) -> Result {
        keyword!(self, "set");
        space!(self);

        if n.computed {
            punct!(self, "[");
            emit!(n.key);
            punct!(self, "]");
        } else {
            emit!(n.key)
        }

        punct!(self, "(");
        emit!(n.param);
        punct!(self, ")");
    }

    #[emitter]
    fn emit_ts_type_lit(&mut self, n: &TsTypeLit) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        punct!(self, "{");
        self.emit_list(
            n.span,
            Some(&n.members),
            ListFormat::MultiLineTypeLiteralMembers,
        )?;
        punct!(self, "}");
    }

    #[emitter]
    fn emit_ts_type_operator(&mut self, n: &TsTypeOperator) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        match n.op {
            TsTypeOperatorOp::KeyOf => keyword!(self, "keyof"),
            TsTypeOperatorOp::Unique => keyword!(self, "unique"),
            TsTypeOperatorOp::ReadOnly => keyword!(self, "readonly"),
        }
        space!(self);
        emit!(n.type_ann);
    }

    #[emitter]
    fn emit_ts_type_param(&mut self, n: &TsTypeParam) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        if n.is_const {
            keyword!(self, "const");
            space!(self);
        }

        if n.is_in {
            keyword!(self, "in");
            space!(self);
        }

        if n.is_out {
            keyword!(self, "out");
            space!(self);
        }

        emit!(n.name);

        if let Some(constraints) = &n.constraint {
            space!(self);
            keyword!(self, "extends");
            space!(self);
            emit!(constraints);
        }

        if let Some(default) = &n.default {
            formatting_space!(self);
            punct!(self, "=");
            formatting_space!(self);
            emit!(default);
        }
    }

    #[emitter]
    fn emit_ts_type_param_decl(&mut self, n: &TsTypeParamDecl) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        punct!(self, "<");

        self.emit_list(n.span, Some(&n.params), ListFormat::TypeParameters)?;

        punct!(self, ">");
    }

    #[emitter]
    fn emit_ts_type_param_instantiation(&mut self, n: &TsTypeParamInstantiation) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        punct!(self, "<");
        self.emit_list(n.span, Some(&n.params), ListFormat::TypeParameters)?;

        punct!(self, ">");
    }

    #[emitter]
    fn emit_ts_type_predicate(&mut self, n: &TsTypePredicate) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        if n.asserts {
            keyword!(self, "asserts");
            space!(self);
        }

        emit!(n.param_name);

        if let Some(type_ann) = &n.type_ann {
            space!(self);
            keyword!(self, "is");
            space!(self);
            emit!(type_ann);
        }
    }

    #[emitter]
    fn emit_ts_type_query(&mut self, n: &TsTypeQuery) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        keyword!(self, "typeof");
        space!(self);
        emit!(n.expr_name);
        emit!(n.type_args);
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
        self.emit_leading_comments_of_span(n.span(), false)?;

        emit!(n.type_name);

        if let Some(n) = &n.type_params {
            punct!(self, "<");
            self.emit_list(n.span, Some(&n.params), ListFormat::TypeArguments)?;
            punct!(self, ">");
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
        self.emit_leading_comments_of_span(n.span(), false)?;

        self.emit_list(n.span, Some(&n.types), ListFormat::UnionTypeConstituents)?;
    }

    #[emitter]
    fn emit_ts_instantiation(&mut self, n: &TsInstantiation) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        emit!(n.expr);

        emit!(n.type_args);
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

    #[test]
    fn type_arg() {
        assert_min_typescript("do_stuff<T>()", "do_stuff<T>()");
    }

    #[test]
    fn no_type_arg() {
        assert_min_typescript("do_stuff()", "do_stuff()");
    }
}
