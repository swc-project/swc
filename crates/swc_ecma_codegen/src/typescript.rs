use swc_common::{SourceMapper, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::emitter;

use super::{Emitter, Result};
use crate::text_writer::WriteJs;

#[node_impl]
impl MacroNode for TsTypeParam {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if self.is_const {
            keyword!("const");
            space!();
        }

        if self.is_in {
            keyword!("in");
            space!();
        }

        if self.is_out {
            keyword!("out");
            space!();
        }

        emit!(self.name);

        if let Some(constraints) = &self.constraint {
            space!();
            keyword!("extends");
            space!();
            emit!(constraints);
        }

        if let Some(default) = &self.default {
            formatting_space!();
            punct!("=");
            formatting_space!();
            emit!(default);
        }
    }
}

#[node_impl]
impl MacroNode for TsTypePredicate {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if self.asserts {
            keyword!("asserts");
            space!();
        }

        emit!(self.param_name);

        if let Some(type_ann) = &self.type_ann {
            space!();
            keyword!("is");
            space!();
            emit!(type_ann);
        }
    }
}

#[node_impl]
impl MacroNode for TsTypeParamDecl {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!("<");

        emitter.emit_list(self.span, Some(&self.params), ListFormat::TypeParameters)?;

        punct!(">");
    }
}

#[node_impl]
impl MacroNode for ParamOrTsParamProp {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            ParamOrTsParamProp::Param(n) => emit!(n),
            ParamOrTsParamProp::TsParamProp(n) => emit!(n),
        }
    }
}

#[node_impl]
impl MacroNode for TsArrayType {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(self.elem_type);
        punct!("[");
        punct!("]");
    }
}

#[node_impl]
impl MacroNode for TsTypeParamInstantiation {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!("<");
        emitter.emit_list(self.span, Some(&self.params), ListFormat::TypeParameters)?;

        punct!(">");
    }
}

#[node_impl]
impl MacroNode for TsTypeQuery {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        keyword!("typeof");
        space!();
        emit!(self.expr_name);
        emit!(self.type_args);
    }
}

#[node_impl]
impl MacroNode for TsTypeQueryExpr {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            TsTypeQueryExpr::TsEntityName(n) => emit!(n),
            TsTypeQueryExpr::Import(n) => emit!(n),
        }
    }
}

#[node_impl]
impl MacroNode for TsTypeRef {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(self.type_name);

        if let Some(n) = &self.type_params {
            punct!("<");
            emitter.emit_list(n.span, Some(&n.params), ListFormat::TypeArguments)?;
            punct!(">");
        }
    }
}

#[node_impl]
impl MacroNode for TsUnionOrIntersectionType {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
            TsUnionOrIntersectionType::TsUnionType(n) => emit!(n),
            TsUnionOrIntersectionType::TsIntersectionType(n) => emit!(n),
        }
    }
}

#[node_impl]
impl MacroNode for TsUnionType {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emitter.emit_list(
            self.span,
            Some(&self.types),
            ListFormat::UnionTypeConstituents,
        )?;
    }
}

#[node_impl]
impl MacroNode for TsInstantiation {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(self.expr);
        emit!(self.type_args);
    }
}

#[node_impl]
impl MacroNode for TsTypeOperator {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        match self.op {
            TsTypeOperatorOp::KeyOf => keyword!("keyof"),
            TsTypeOperatorOp::Unique => keyword!("unique"),
            TsTypeOperatorOp::ReadOnly => keyword!("readonly"),
        }
        space!();
        emit!(self.type_ann);
    }
}

#[node_impl]
impl MacroNode for TsTypeLit {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!("{");
        emitter.emit_list(
            self.span,
            Some(&self.members),
            ListFormat::MultiLineTypeLiteralMembers,
        )?;
        punct!("}");
    }
}

#[node_impl]
impl MacroNode for TsType {
    fn emit(&mut self, emitter: &mut Macro) {
        match self {
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
}

#[node_impl]
impl MacroNode for TsKeywordType {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter
            .emit_leading_comments_of_pos(self.span().lo)
            .unwrap();

        let s = match self.kind {
            TsKeywordTypeKind::TsAnyKeyword => "any",
            TsKeywordTypeKind::TsUnknownKeyword => "unknown",
            TsKeywordTypeKind::TsNumberKeyword => "number",
            TsKeywordTypeKind::TsObjectKeyword => "object",
            TsKeywordTypeKind::TsBooleanKeyword => "boolean",
            TsKeywordTypeKind::TsBigIntKeyword => "bigint",
            TsKeywordTypeKind::TsStringKeyword => "string",
            TsKeywordTypeKind::TsSymbolKeyword => "symbol",
            TsKeywordTypeKind::TsVoidKeyword => "void",
            TsKeywordTypeKind::TsUndefinedKeyword => "undefined",
            TsKeywordTypeKind::TsNullKeyword => "null",
            TsKeywordTypeKind::TsNeverKeyword => "never",
            TsKeywordTypeKind::TsIntrinsicKeyword => "intrinsic",
        };

        write!(emitter, "{}", s).unwrap();

        emitter
            .emit_trailing_comments_of_pos(self.span().hi)
            .unwrap();
    }
}

#[node_impl]
impl MacroNode for TsThisType {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_pos(self.span.lo)?;

        write!(emitter, "this")?;

        emitter.emit_trailing_comments_of_pos(self.span.hi)?;
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsTupleType {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!("[");
        emitter.emit_list(
            self.span,
            Some(&self.elem_types),
            ListFormat::TupleTypeElements,
        )?;
        punct!("]");

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsFnOrConstructorType {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        match self {
            TsFnOrConstructorType::TsFnType(n) => n.emit(emitter),
            TsFnOrConstructorType::TsConstructorType(n) => n.emit(emitter),
        }
    }
}

#[node_impl]
impl MacroNode for TsFnType {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if let Some(type_params) = &self.type_params {
            emit!(type_params);
        }

        punct!("(");
        emitter.emit_list(self.span, Some(&self.params), ListFormat::Parameters)?;
        punct!(")");

        space!();
        punct!("=>");
        space!();

        emit!(self.type_ann);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsParenthesizedType {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!("(");
        emit!(self.type_ann);
        punct!(")");
    }
}

#[node_impl]
impl MacroNode for TsConditionalType {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(self.check_type);
        space!();

        keyword!("extends");
        space!();

        emit!(self.extends_type);
        space!();
        punct!("?");

        space!();
        emit!(self.true_type);
        space!();

        punct!(":");

        space!();
        emit!(self.false_type);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsInferType {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        keyword!("infer");
        space!();
        emit!(self.type_param);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsOptionalType {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(self.type_ann);
        punct!("?");

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsRestType {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!("...");
        emit!(self.type_ann);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsLitType {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(self.lit);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsLit {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        match self {
            TsLit::BigInt(n) => n.emit(emitter),
            TsLit::Number(n) => n.emit(emitter),
            TsLit::Str(n) => n.emit(emitter),
            TsLit::Bool(n) => n.emit(emitter),
            TsLit::Tpl(n) => n.emit(emitter),
        }
    }
}

#[node_impl]
impl MacroNode for TsMappedType {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!("{");

        if let Some(writer) = emitter.writer() {
            if !writer.cfg.minify {
                writer.wr.write_line()?;
                writer.wr.increase_indent()?;
            }
        }

        if self.readonly.is_some() {
            if self.readonly == Some(TruePlusMinus::True) {
                keyword!("readonly");
                space!();
            } else if self.readonly == Some(TruePlusMinus::Plus) {
                punct!("+");
                keyword!("readonly");
                space!();
            } else if self.readonly == Some(TruePlusMinus::Minus) {
                punct!("-");
                keyword!("readonly");
                space!();
            }
        }

        punct!("[");
        emit!(self.type_param.name);

        if let Some(constraint) = &self.type_param.constraint {
            space!();
            keyword!("in");
            space!();
            emit!(constraint);
        }

        if let Some(ref name_type) = self.name_type {
            space!();
            keyword!("as");
            space!();
            emit!(name_type);
        }

        punct!("]");

        if self.optional.is_some() {
            if self.optional == Some(TruePlusMinus::True) {
                punct!("?");
                punct!(":");
            } else if self.optional == Some(TruePlusMinus::Plus) {
                space!();
                punct!("+");
                punct!("?");
                punct!(":");
            } else if self.optional == Some(TruePlusMinus::Minus) {
                space!();
                punct!("-");
                punct!("?");
                punct!(":");
            }
        } else {
            punct!(":");
        }

        space!();
        emit!(self.type_ann);
        punct!(";");

        if let Some(writer) = emitter.writer() {
            if !writer.cfg.minify {
                writer.wr.write_line()?;
                writer.wr.decrease_indent()?;
            }
        }

        punct!("}");

        Ok(())
    }
}

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
        punct!("[");
        punct!("]");
    }

    #[emitter]
    fn emit_ts_as_expr(&mut self, n: &TsAsExpr) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        emit!(n.expr);

        space!();
        keyword!("as");
        space!();

        emit!(n.type_ann);
    }

    #[emitter]
    fn emit_ts_satisfies_expr(&mut self, n: &TsSatisfiesExpr) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        emit!(n.expr);

        space!();
        keyword!("satisfies");
        space!();

        emit!(n.type_ann);
    }

    #[emitter]
    fn emit_ts_call_signature_decl(&mut self, n: &TsCallSignatureDecl) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

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
        self.emit_leading_comments_of_span(n.span(), false)?;

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
        self.emit_leading_comments_of_span(n.span(), false)?;

        keyword!("new");
        if let Some(type_params) = &n.type_params {
            space!();
            emit!(type_params);
        }

        punct!("(");
        self.emit_list(n.span, Some(&n.params), ListFormat::Parameters)?;
        punct!(")");

        if let Some(type_ann) = &n.type_ann {
            punct!(":");
            space!();
            emit!(type_ann);
        }
    }

    #[emitter]
    fn emit_ts_constructor_type(&mut self, n: &TsConstructorType) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        if n.is_abstract {
            keyword!("abstract");
            space!();
        }

        keyword!("new");
        if let Some(type_params) = &n.type_params {
            space!();
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
        self.emit_leading_comments_of_span(n.span(), false)?;

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
        self.emit_leading_comments_of_span(n.span(), false)?;

        keyword!("export");
        formatting_space!();
        punct!("=");
        formatting_space!();
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

        keyword!("require");
        punct!("(");
        emit!(n.expr);
        punct!(")");
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
        self.emit_leading_comments_of_span(n.span(), false)?;

        if n.is_export {
            keyword!("export");
            space!();
        }

        keyword!("import");
        space!();

        if n.is_type_only {
            keyword!("type");
            space!();
        }

        emit!(n.id);

        formatting_space!();

        punct!("=");
        formatting_space!();

        emit!(n.module_ref);
        formatting_semi!();
    }

    #[emitter]
    fn emit_ts_index_signature(&mut self, n: &TsIndexSignature) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        if n.readonly {
            keyword!("readonly");
            formatting_space!();
        }

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
        self.emit_leading_comments_of_span(n.span(), false)?;

        emit!(n.obj_type);

        punct!("[");
        emit!(n.index_type);
        punct!("]");
    }

    #[emitter]
    fn emit_ts_interface_body(&mut self, n: &TsInterfaceBody) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        punct!("{");

        self.emit_list(n.span, Some(&n.body), ListFormat::InterfaceMembers)?;

        punct!("}");
    }

    #[emitter]
    fn emit_ts_interface_decl(&mut self, n: &TsInterfaceDecl) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

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
        self.emit_leading_comments_of_span(n.span(), false)?;

        self.emit_list(n.span, Some(&n.types), ListFormat::IntersectionTypeList)?;

        Ok(())
    }

    #[emitter]
    fn emit_ts_keyword_type(&mut self, n: &TsKeywordType) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

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
    fn emit_ts_tpl_lit(&mut self, node: &TsTplLitType) -> Result {
        debug_assert!(node.quasis.len() == node.types.len() + 1);

        self.emit_leading_comments_of_span(node.span(), false)?;

        punct!("`");

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
        keyword!("get");
        space!();

        if n.computed {
            punct!("[");
            emit!(n.key);
            punct!("]");
        } else {
            emit!(n.key)
        }

        punct!("(");
        punct!(")");

        if let Some(ty) = &n.type_ann {
            punct!(":");
            formatting_space!();

            emit!(ty.type_ann);
        }
    }

    #[emitter]
    fn emit_ts_setter_signature(&mut self, n: &TsSetterSignature) -> Result {
        keyword!("set");
        space!();

        if n.computed {
            punct!("[");
            emit!(n.key);
            punct!("]");
        } else {
            emit!(n.key)
        }

        punct!("(");
        emit!(n.param);
        punct!(")");
    }

    #[emitter]
    fn emit_ts_type_lit(&mut self, n: &TsTypeLit) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

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
        self.emit_leading_comments_of_span(n.span(), false)?;

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
        self.emit_leading_comments_of_span(n.span(), false)?;

        if n.is_const {
            keyword!("const");
            space!();
        }

        if n.is_in {
            keyword!("in");
            space!();
        }

        if n.is_out {
            keyword!("out");
            space!();
        }

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
    fn emit_ts_type_param_instantiation(&mut self, n: &TsTypeParamInstantiation) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        punct!("<");
        self.emit_list(n.span, Some(&n.params), ListFormat::TypeParameters)?;

        punct!(">");
    }

    #[emitter]
    fn emit_ts_type_query(&mut self, n: &TsTypeQuery) -> Result {
        self.emit_leading_comments_of_span(n.span(), false)?;

        keyword!("typeof");
        space!();
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

#[node_impl]
impl MacroNode for TsIndexedAccessType {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(self.obj_type);
        punct!("[");
        emit!(self.index_type);
        punct!("]");

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsQualifiedName {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(self.left);
        punct!(".");
        emit!(self.right);

        Ok(())
    }
}
