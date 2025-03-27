use swc_common::{SourceMapper, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::node_impl;

use super::{Emitter, Result};
use crate::text_writer::WriteJs;

#[node_impl]
impl MacroNode for TsTypeParam {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if self.is_const {
            keyword!(emitter, "const");
            space!(emitter,);
        }

        if self.is_in {
            keyword!(emitter, "in");
            space!(emitter,);
        }

        if self.is_out {
            keyword!(emitter, "out");
            space!(emitter,);
        }

        emit!(self.name);

        if let Some(constraints) = &self.constraint {
            space!(emitter,);
            keyword!(emitter, "extends");
            space!(emitter,);
            emit!(constraints);
        }

        if let Some(default) = &self.default {
            formatting_space!(emitter,);
            punct!(emitter, "=");
            formatting_space!(emitter,);
            emit!(default);
        }
    }
}

#[node_impl]
impl MacroNode for TsTypePredicate {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if self.asserts {
            keyword!(emitter, "asserts");
            space!(emitter,);
        }

        emit!(self.param_name);

        if let Some(type_ann) = &self.type_ann {
            space!(emitter,);
            keyword!(emitter, "is");
            space!(emitter,);
            emit!(type_ann);
        }
    }
}

#[node_impl]
impl MacroNode for TsTypeParamDecl {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!(emitter, "<");

        emitter.emit_list(self.span, Some(&self.params), ListFormat::TypeParameters)?;

        punct!(emitter, ">");
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
        punct!(emitter, "[");
        punct!(emitter, "]");
    }
}

#[node_impl]
impl MacroNode for TsTypeParamInstantiation {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!(emitter, "<");
        emitter.emit_list(self.span, Some(&self.params), ListFormat::TypeParameters)?;

        punct!(emitter, ">");
    }
}

#[node_impl]
impl MacroNode for TsTypeQuery {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        keyword!(emitter, "typeof");
        space!(emitter,);
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
            punct!(emitter, "<");
            emitter.emit_list(n.span, Some(&n.params), ListFormat::TypeArguments)?;
            punct!(emitter, ">");
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
            TsTypeOperatorOp::KeyOf => keyword!(emitter, "keyof"),
            TsTypeOperatorOp::Unique => keyword!(emitter, "unique"),
            TsTypeOperatorOp::ReadOnly => keyword!(emitter, "readonly"),
        }
        space!(emitter,);
        emit!(self.type_ann);
    }
}

#[node_impl]
impl MacroNode for TsTypeLit {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!(emitter, "{");
        emitter.emit_list(
            self.span,
            Some(&self.members),
            ListFormat::MultiLineTypeLiteralMembers,
        )?;
        punct!(emitter, "}");
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

        punct!(emitter, "[");
        emitter.emit_list(
            self.span,
            Some(&self.elem_types),
            ListFormat::TupleTypeElements,
        )?;
        punct!(emitter, "]");

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

        punct!(emitter, "(");
        emitter.emit_list(self.span, Some(&self.params), ListFormat::Parameters)?;
        punct!(emitter, ")");

        space!(emitter,);
        punct!(emitter, "=>");
        space!(emitter,);

        emit!(self.type_ann);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsParenthesizedType {
    fn emit(&mut self, emitter: &mut Macro) {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!(emitter, "(");
        emit!(self.type_ann);
        punct!(emitter, ")");
    }
}

#[node_impl]
impl MacroNode for TsConditionalType {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(self.check_type);
        space!(emitter,);

        keyword!(emitter, "extends");
        space!(emitter,);

        emit!(self.extends_type);
        space!(emitter,);
        punct!(emitter, "?");

        space!(emitter,);
        emit!(self.true_type);
        space!(emitter,);

        punct!(emitter, ":");

        space!(emitter,);
        emit!(self.false_type);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsInferType {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        keyword!(emitter, "infer");
        space!(emitter,);
        emit!(self.type_param);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsOptionalType {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(self.type_ann);
        punct!(emitter, "?");

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsRestType {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!(emitter, "...");
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

        punct!(emitter, "{");

        if let Some(writer) = emitter.writer() {
            if !writer.cfg.minify {
                writer.wr.write_line()?;
                writer.wr.increase_indent()?;
            }
        }

        if self.readonly.is_some() {
            if self.readonly == Some(TruePlusMinus::True) {
                keyword!(emitter, "readonly");
                space!(emitter,);
            } else if self.readonly == Some(TruePlusMinus::Plus) {
                punct!(emitter, "+");
                keyword!(emitter, "readonly");
                space!(emitter,);
            } else if self.readonly == Some(TruePlusMinus::Minus) {
                punct!(emitter, "-");
                keyword!(emitter, "readonly");
                space!(emitter,);
            }
        }

        punct!(emitter, "[");
        emit!(self.type_param.name);

        if let Some(constraint) = &self.type_param.constraint {
            space!(emitter,);
            keyword!(emitter, "in");
            space!(emitter,);
            emit!(constraint);
        }

        if let Some(ref name_type) = self.name_type {
            space!(emitter,);
            keyword!(emitter, "as");
            space!(emitter,);
            emit!(name_type);
        }

        punct!(emitter, "]");

        if self.optional.is_some() {
            if self.optional == Some(TruePlusMinus::True) {
                punct!(emitter, "?");
                punct!(emitter, ":");
            } else if self.optional == Some(TruePlusMinus::Plus) {
                space!(emitter,);
                punct!(emitter, "+");
                punct!(emitter, "?");
                punct!(emitter, ":");
            } else if self.optional == Some(TruePlusMinus::Minus) {
                space!(emitter,);
                punct!(emitter, "-");
                punct!(emitter, "?");
                punct!(emitter, ":");
            }
        } else {
            punct!(emitter, ":");
        }

        space!(emitter,);
        emit!(self.type_ann);
        punct!(emitter, ";");

        if let Some(writer) = emitter.writer() {
            if !writer.cfg.minify {
                writer.wr.write_line()?;
                writer.wr.decrease_indent()?;
            }
        }

        punct!(emitter, "}");

        Ok(())
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
        punct!(emitter, "[");
        emit!(self.index_type);
        punct!(emitter, "]");

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsQualifiedName {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(self.left);
        punct!(emitter, ".");
        emit!(self.right);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsConstructorType {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if self.is_abstract {
            keyword!(emitter, "abstract");
            space!(emitter,);
        }

        keyword!(emitter, "new");
        if let Some(type_params) = &self.type_params {
            space!(emitter,);
            emit!(type_params);
        }

        punct!(emitter, "(");
        emitter.emit_list(self.span, Some(&self.params), ListFormat::Parameters)?;
        punct!(emitter, ")");

        formatting_space!(emitter,);
        punct!(emitter, "=>");
        formatting_space!(emitter,);

        emit!(self.type_ann);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsIntersectionType {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emitter.emit_list(
            self.span,
            Some(&self.types),
            ListFormat::IntersectionTypeConstituents,
        )?;

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsTplLitType {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!(emitter, "`");

        for i in 0..(self.quasis.len() + self.types.len()) {
            if i % 2 == 0 {
                emit!(self.quasis[i / 2]);
            } else {
                punct!(emitter, "${");
                emit!(self.types[i / 2]);
                punct!(emitter, "}");
            }
        }

        punct!(emitter, "`");

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsTypeAnn {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(self.type_ann);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsTypeAliasDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if self.declare {
            keyword!(emitter, "declare");
            space!(emitter,);
        }

        keyword!(emitter, "type");
        space!(emitter,);

        emit!(self.id);
        if let Some(type_params) = &self.type_params {
            emit!(type_params);
        }
        formatting_space!(emitter,);

        punct!(emitter, "=");
        formatting_space!(emitter,);

        emit!(self.type_ann);
        formatting_semi!();

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsMethodSignature {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if self.computed {
            punct!(emitter, "[");
            emit!(self.key);
            punct!(emitter, "]");
        } else {
            emit!(self.key);
        }

        if self.optional {
            punct!(emitter, "?");
        }

        if let Some(type_params) = &self.type_params {
            emit!(type_params);
        }

        punct!(emitter, "(");
        emitter.emit_list(self.span, Some(&self.params), ListFormat::Parameters)?;
        punct!(emitter, ")");

        if let Some(ref type_ann) = self.type_ann {
            punct!(emitter, ":");
            formatting_space!(emitter,);
            emit!(type_ann);
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsModuleBlock {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_list(
            self.span,
            Some(&self.body),
            ListFormat::SourceFileStatements,
        )?;

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsPropertySignature {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if self.readonly {
            keyword!(emitter, "readonly");
            space!(emitter,);
        }

        if self.computed {
            punct!(emitter, "[");
            emit!(self.key);
            punct!(emitter, "]");
        } else {
            emit!(self.key);
        }

        if self.optional {
            punct!(emitter, "?");
        }

        if let Some(type_ann) = &self.type_ann {
            punct!(emitter, ":");
            formatting_space!(emitter,);
            emit!(type_ann);
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsEnumMember {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(self.id);

        if let Some(init) = &self.init {
            formatting_space!(emitter,);
            punct!(emitter, "=");
            formatting_space!(emitter,);
            emit!(init);
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsModuleDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if self.declare {
            keyword!(emitter, "declare");
            space!(emitter,);
        }

        if self.global {
            keyword!(emitter, "global");
        } else {
            match &self.id {
                TsModuleName::Ident(_) => keyword!(emitter, "namespace"),
                TsModuleName::Str(_) => keyword!(emitter, "module"),
            }
            space!(emitter,);
            emit!(self.id);
        }

        if let Some(mut body) = self.body.as_ref() {
            while let TsNamespaceBody::TsNamespaceDecl(decl) = body {
                punct!(emitter, ".");
                emit!(decl.id);
                body = &*decl.body;
            }
            formatting_space!(emitter,);
            emit!(body);
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsNamespaceBody {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!(emitter, "{");
        match self {
            TsNamespaceBody::TsModuleBlock(n) => emit!(n),
            TsNamespaceBody::TsNamespaceDecl(n) => emit!(n),
        }
        punct!(emitter, "}");

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsParamProp {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emitter.emit_list(self.span, Some(&self.decorators), ListFormat::Decorators)?;

        if let Some(accessibility) = self.accessibility {
            match accessibility {
                Accessibility::Public => keyword!(emitter, "public"),
                Accessibility::Protected => keyword!(emitter, "protected"),
                Accessibility::Private => keyword!(emitter, "private"),
            }
            space!(emitter,);
        }

        if self.is_override {
            keyword!(emitter, "override");
            space!(emitter,);
        }

        if self.readonly {
            keyword!(emitter, "readonly");
            space!(emitter,);
        }

        emit!(self.param);

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsCallSignatureDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(self.type_params);

        punct!(emitter, "(");
        emitter.emit_list(self.span, Some(&self.params), ListFormat::Parameters)?;
        punct!(emitter, ")");

        if let Some(type_ann) = &self.type_ann {
            space!(emitter,);
            punct!(emitter, ":");
            space!(emitter,);
            emit!(type_ann);
        }

        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsEnumDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result<(), Error> {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if self.declare {
            keyword!(emitter, "declare");
            space!(emitter,);
        }

        if self.is_const {
            keyword!(emitter, "const");
            space!(emitter,);
        }

        keyword!(emitter, "enum");
        space!(emitter,);

        emit!(self.id);
        formatting_space!(emitter,);

        punct!(emitter, "{");
        emitter.emit_list(self.span, Some(&self.members), ListFormat::EnumMembers)?;
        punct!(emitter, "}");

        Ok(())
    }
}
