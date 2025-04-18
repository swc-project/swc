use swc_common::{Span, Spanned};
use swc_ecma_ast::*;
use swc_ecma_codegen_macros::node_impl;

#[node_impl]
impl MacroNode for ParamOrTsParamProp {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        Ok(match self {
            ParamOrTsParamProp::Param(n) => {
                let n = emit!(emitter, n);

                only_new!(ParamOrTsParamProp::Param(n))
            }
            ParamOrTsParamProp::TsParamProp(n) => {
                let n = emit!(emitter, n);

                only_new!(ParamOrTsParamProp::TsParamProp(n))
            }
        })
    }
}

#[node_impl]
impl MacroNode for TsArrayType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        emit!(emitter, self.elem_type);
        punct!(emitter, "[");
        punct!(emitter, "]");

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsArrayType {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsAsExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        emit!(emitter, self.expr);

        space!(emitter);
        keyword!(emitter, "as");
        space!(emitter);

        emit!(emitter, self.type_ann);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsAsExpr {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsSatisfiesExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        emit!(emitter, self.expr);

        space!(emitter);
        keyword!(emitter, "satisfies");
        space!(emitter);

        emit!(emitter, self.type_ann);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsSatisfiesExpr {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsCallSignatureDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        emit!(emitter, self.type_params);

        punct!(emitter, "(");
        emitter.emit_list(self.span, Some(&self.params), ListFormat::Parameters)?;
        punct!(emitter, ")");

        if let Some(type_ann) = &self.type_ann {
            space!(emitter);
            punct!(emitter, ":");
            space!(emitter);

            emit!(emitter, type_ann);
        }

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsCallSignatureDecl {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsConditionalType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        emit!(emitter, self.check_type);
        space!(emitter);

        keyword!(emitter, "extends");
        space!(emitter);

        emit!(emitter, self.extends_type);
        space!(emitter);
        punct!(emitter, "?");

        space!(emitter);
        emit!(emitter, self.true_type);
        space!(emitter);

        punct!(emitter, ":");

        space!(emitter);
        emit!(emitter, self.false_type);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsConditionalType {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsConstructSignatureDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        keyword!(emitter, "new");
        if let Some(type_params) = &self.type_params {
            space!(emitter);
            emit!(emitter, type_params);
        }

        punct!(emitter, "(");
        emitter.emit_list(self.span, Some(&self.params), ListFormat::Parameters)?;
        punct!(emitter, ")");

        if let Some(type_ann) = &self.type_ann {
            punct!(emitter, ":");
            space!(emitter);
            emit!(emitter, type_ann);
        }

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsConstructSignatureDecl {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsConstructorType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        if self.is_abstract {
            keyword!(emitter, "abstract");
            space!(emitter);
        }

        keyword!(emitter, "new");
        if let Some(type_params) = &self.type_params {
            space!(emitter);
            emit!(emitter, type_params);
        }

        punct!(emitter, "(");
        emitter.emit_list(self.span, Some(&self.params), ListFormat::Parameters)?;
        punct!(emitter, ")");

        formatting_space!(emitter);
        punct!(emitter, "=>");
        formatting_space!(emitter);

        emit!(emitter, self.type_ann);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsConstructorType {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsEntityName {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        Ok(match self {
            TsEntityName::TsQualifiedName(n) => {
                let n = emit!(emitter, n);

                only_new!(TsEntityName::TsQualifiedName(n))
            }
            TsEntityName::Ident(n) => {
                let n = emit!(emitter, n);

                only_new!(TsEntityName::Ident(n))
            }
        })
    }
}

#[node_impl]
impl MacroNode for TsEnumDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        if self.declare {
            keyword!(emitter, "declare");
            space!(emitter);
        }

        if self.is_const {
            keyword!(emitter, "const");
            space!(emitter);
        }

        keyword!(emitter, "enum");
        space!(emitter);

        emit!(emitter, self.id);
        formatting_space!(emitter);

        punct!(emitter, "{");

        emitter.emit_list(self.span, Some(&self.members), ListFormat::EnumMembers)?;

        punct!(emitter, "}");

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsEnumDecl {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsEnumMember {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        emit!(emitter, self.id);

        if let Some(init) = &self.init {
            formatting_space!(emitter);
            punct!(emitter, "=");
            formatting_space!(emitter);
            emit!(emitter, init);
        }

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsEnumMember {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsEnumMemberId {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        Ok(match self {
            TsEnumMemberId::Ident(n) => {
                let n = emit!(emitter, n);

                only_new!(TsEnumMemberId::Ident(n))
            }
            TsEnumMemberId::Str(n) => {
                let n = emit!(emitter, n);

                only_new!(TsEnumMemberId::Str(n))
            }
        })
    }
}

#[node_impl]
impl MacroNode for TsExportAssignment {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        keyword!(emitter, "export");
        formatting_space!(emitter);
        punct!(emitter, "=");
        formatting_space!(emitter);
        emit!(emitter, self.expr);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsExportAssignment {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsExprWithTypeArgs {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        emit!(emitter, self.expr);

        emit!(emitter, self.type_args);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsExprWithTypeArgs {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsExternalModuleRef {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        keyword!(emitter, "require");
        punct!(emitter, "(");
        emit!(emitter, self.expr);
        punct!(emitter, ")");

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsExternalModuleRef {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsFnOrConstructorType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        Ok(match self {
            TsFnOrConstructorType::TsFnType(n) => {
                let n = emit!(emitter, n);

                only_new!(TsFnOrConstructorType::TsFnType(n))
            }
            TsFnOrConstructorType::TsConstructorType(n) => {
                let n = emit!(emitter, n);

                only_new!(TsFnOrConstructorType::TsConstructorType(n))
            }
        })
    }
}

#[node_impl]
impl MacroNode for TsFnParam {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        Ok(match self {
            TsFnParam::Ident(n) => {
                let n = emit!(emitter, n);

                only_new!(TsFnParam::Ident(n))
            }
            TsFnParam::Array(n) => {
                let n = emit!(emitter, n);

                only_new!(TsFnParam::Array(n))
            }
            TsFnParam::Rest(n) => {
                let n = emit!(emitter, n);

                only_new!(TsFnParam::Rest(n))
            }
            TsFnParam::Object(n) => {
                let n = emit!(emitter, n);

                only_new!(TsFnParam::Object(n))
            }
        })
    }
}

#[node_impl]
impl MacroNode for TsFnType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        emit!(emitter, self.type_params);

        punct!(emitter, "(");
        emitter.emit_list(self.span, Some(&self.params), ListFormat::Parameters)?;
        punct!(emitter, ")");

        formatting_space!(emitter);
        punct!(emitter, "=>");
        formatting_space!(emitter);

        emit!(emitter, self.type_ann);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsFnType {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsImportEqualsDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        if self.is_export {
            keyword!(emitter, "export");
            space!(emitter);
        }

        keyword!(emitter, "import");
        space!(emitter);

        if self.is_type_only {
            keyword!(emitter, "type");
            space!(emitter);
        }

        emit!(emitter, self.id);

        formatting_space!(emitter);

        punct!(emitter, "=");
        formatting_space!(emitter);

        emit!(emitter, self.module_ref);
        formatting_semi!(emitter);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsImportEqualsDecl {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsIndexSignature {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        if self.readonly {
            keyword!(emitter, "readonly");
            formatting_space!(emitter);
        }

        punct!(emitter, "[");
        emitter.emit_list(self.span, Some(&self.params), ListFormat::Parameters)?;
        punct!(emitter, "]");

        if let Some(type_ann) = &self.type_ann {
            punct!(emitter, ":");
            formatting_space!(emitter);
            emit!(emitter, type_ann);
        }

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsIndexSignature {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsIndexedAccessType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        emit!(emitter, self.obj_type);

        punct!(emitter, "[");
        emit!(emitter, self.index_type);
        punct!(emitter, "]");

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsIndexedAccessType {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsInferType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        keyword!(emitter, "infer");
        space!(emitter);
        emit!(emitter, self.type_param);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsInferType {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsInterfaceBody {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        punct!(emitter, "{");

        emitter.emit_list(self.span, Some(&self.body), ListFormat::InterfaceMembers)?;

        punct!(emitter, "}");

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsInterfaceBody {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsInterfaceDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        if self.declare {
            keyword!(emitter, "declare");
            space!(emitter);
        }

        keyword!(emitter, "interface");
        space!(emitter);

        emit!(emitter, self.id);

        if let Some(type_params) = &self.type_params {
            emit!(emitter, type_params);
        }

        if !self.extends.is_empty() {
            space!(emitter);

            keyword!(emitter, "extends");

            space!(emitter);

            emitter.emit_list(
                self.span,
                Some(&self.extends),
                ListFormat::HeritageClauseTypes,
            )?;
        }

        formatting_space!(emitter);

        emit!(emitter, self.body);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsInterfaceDecl {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsIntersectionType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        emitter.emit_list(
            self.span,
            Some(&self.types),
            ListFormat::IntersectionTypeConstituents,
        )?;

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsIntersectionType {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsKeywordType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        match self.kind {
            TsKeywordTypeKind::TsAnyKeyword => keyword!(emitter, self.span, "any"),
            TsKeywordTypeKind::TsUnknownKeyword => keyword!(emitter, self.span, "unknown"),
            TsKeywordTypeKind::TsNumberKeyword => keyword!(emitter, self.span, "number"),
            TsKeywordTypeKind::TsObjectKeyword => keyword!(emitter, self.span, "object"),
            TsKeywordTypeKind::TsBooleanKeyword => keyword!(emitter, self.span, "boolean"),
            TsKeywordTypeKind::TsBigIntKeyword => keyword!(emitter, self.span, "bigint"),
            TsKeywordTypeKind::TsStringKeyword => keyword!(emitter, self.span, "string"),
            TsKeywordTypeKind::TsSymbolKeyword => keyword!(emitter, self.span, "symbol"),
            TsKeywordTypeKind::TsVoidKeyword => keyword!(emitter, self.span, "void"),
            TsKeywordTypeKind::TsUndefinedKeyword => keyword!(emitter, self.span, "undefined"),
            TsKeywordTypeKind::TsNullKeyword => keyword!(emitter, self.span, "null"),
            TsKeywordTypeKind::TsNeverKeyword => keyword!(emitter, self.span, "never"),
            TsKeywordTypeKind::TsIntrinsicKeyword => keyword!(emitter, self.span, "intrinsic"),
        }

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsKeywordType {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsLit {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        Ok(match self {
            TsLit::BigInt(n) => {
                let n = emit!(emitter, n);

                only_new!(TsLit::BigInt(n))
            }
            TsLit::Number(n) => {
                let n = emit!(emitter, n);

                only_new!(TsLit::Number(n))
            }
            TsLit::Str(n) => {
                let n = emit!(emitter, n);

                only_new!(TsLit::Str(n))
            }
            TsLit::Bool(n) => {
                let n = emit!(emitter, n);
                only_new!(TsLit::Bool(n))
            }
            TsLit::Tpl(n) => {
                let n = emit!(emitter, n);

                only_new!(TsLit::Tpl(n))
            }
        })
    }
}

#[node_impl]
impl MacroNode for TsTplLitType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        punct!(emitter, "`");

        for i in 0..(self.quasis.len() + self.types.len()) {
            if i % 2 == 0 {
                emit!(emitter, self.quasis[i / 2]);
            } else {
                punct!(emitter, "${");
                emit!(emitter, self.types[i / 2]);
                punct!(emitter, "}");
            }
        }

        punct!(emitter, "`");

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsTplLitType {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsLitType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        let lit = emit!(emitter, self.lit);

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsLitType {
            span: Span::new(lo, hi),
            lit,
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsMappedType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        punct!(emitter, "{");
        emitter.wr.write_line()?;
        emitter.wr.increase_indent()?;

        match &self.readonly {
            None => {}
            Some(tpm) => match tpm {
                TruePlusMinus::True => {
                    keyword!(emitter, "readonly");
                    space!(emitter);
                }
                TruePlusMinus::Plus => {
                    punct!(emitter, "+");
                    keyword!(emitter, "readonly");
                    space!(emitter);
                }
                TruePlusMinus::Minus => {
                    punct!(emitter, "-");
                    keyword!(emitter, "readonly");
                    space!(emitter);
                }
            },
        }

        punct!(emitter, "[");

        emit!(emitter, self.type_param.name);

        if let Some(constraints) = &self.type_param.constraint {
            space!(emitter);
            keyword!(emitter, "in");
            space!(emitter);
            emit!(emitter, constraints);
        }

        if let Some(default) = &self.type_param.default {
            formatting_space!(emitter);
            punct!(emitter, "=");
            formatting_space!(emitter);
            emit!(emitter, default);
        }

        if let Some(name_type) = &self.name_type {
            space!(emitter);
            keyword!(emitter, "as");
            space!(emitter);
            emit!(emitter, name_type);
        }

        punct!(emitter, "]");

        match self.optional {
            None => {}
            Some(tpm) => match tpm {
                TruePlusMinus::True => {
                    punct!(emitter, "?");
                }
                TruePlusMinus::Plus => {
                    punct!(emitter, "+");
                    punct!(emitter, "?");
                }
                TruePlusMinus::Minus => {
                    punct!(emitter, "-");
                    punct!(emitter, "?");
                }
            },
        }

        if let Some(type_ann) = &self.type_ann {
            punct!(emitter, ":");
            space!(emitter);
            emit!(emitter, type_ann);
        }

        formatting_semi!(emitter);

        emitter.wr.write_line()?;
        emitter.wr.decrease_indent()?;
        punct!(emitter, "}");

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsMappedType {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsMethodSignature {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        if self.computed {
            punct!(emitter, "[");
            emit!(emitter, self.key);
            punct!(emitter, "]");
        } else {
            emit!(emitter, self.key)
        }

        if self.optional {
            punct!(emitter, "?");
        }

        if let Some(type_params) = &self.type_params {
            emit!(emitter, type_params);
        }

        punct!(emitter, "(");
        emitter.emit_list(self.span, Some(&self.params), ListFormat::Parameters)?;
        punct!(emitter, ")");

        if let Some(ref type_ann) = self.type_ann {
            punct!(emitter, ":");
            formatting_space!(emitter);
            emit!(emitter, type_ann);
        }

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsMethodSignature {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsModuleBlock {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        let lo = only_new!(emitter.wr.get_pos());

        emitter.emit_list(
            self.span,
            Some(&self.body),
            ListFormat::SourceFileStatements,
        )?;
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsModuleBlock {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsModuleDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        let lo = only_new!(emitter.wr.get_pos());

        if self.declare {
            keyword!(emitter, "declare");
            space!(emitter);
        }

        if self.global {
            keyword!(emitter, "global");
        } else {
            match &self.id {
                // prefer namespace keyword because TS might
                // deprecate the module keyword in this context
                TsModuleName::Ident(_) => keyword!(emitter, "namespace"),
                TsModuleName::Str(_) => keyword!(emitter, "module"),
            }
            space!(emitter);
            emit!(emitter, self.id);
        }

        if let Some(mut body) = self.body.as_ref() {
            while let TsNamespaceBody::TsNamespaceDecl(decl) = body {
                punct!(emitter, ".");
                emit!(emitter, decl.id);
                body = &*decl.body;
            }
            formatting_space!(emitter);
            emit!(emitter, body);
        }

        let hi = only_new!(emitter.wr.get_pos());

        Ok(only_new!(TsModuleDecl {
            span: Span::new(lo, hi),
            ..self.clone()
        }))
    }
}

#[node_impl]
impl MacroNode for TsModuleName {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        Ok(match self {
            TsModuleName::Ident(n) => {
                let n = emit!(emitter, n);

                only_new!(TsModuleName::Ident(n))
            }
            TsModuleName::Str(n) => {
                let n = emit!(emitter, n);

                only_new!(TsModuleName::Str(n))
            }
        })
    }
}

#[node_impl]
impl MacroNode for TsModuleRef {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        Ok(match self {
            TsModuleRef::TsEntityName(n) => {
                let n = emit!(emitter, n);

                only_new!(TsModuleRef::TsEntityName(n))
            }
            TsModuleRef::TsExternalModuleRef(n) => {
                let n = emit!(emitter, n);

                only_new!(TsModuleRef::TsExternalModuleRef(n))
            }
        })
    }
}

#[node_impl]
impl MacroNode for TsNamespaceBody {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!(emitter, "{");
        emitter.wr.increase_indent()?;
        match self {
            TsNamespaceBody::TsModuleBlock(n) => emit!(emitter, n),
            TsNamespaceBody::TsNamespaceDecl(n) => emit!(emitter, n),
        }
        emitter.wr.decrease_indent()?;
        punct!(emitter, "}");
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsNamespaceDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if self.declare {
            keyword!(emitter, "declare");
            space!(emitter);
        }

        keyword!(emitter, "namespace");
        space!(emitter);
        emit!(emitter, self.id);
        formatting_space!(emitter);

        emit!(emitter, self.body);
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsNamespaceExportDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        keyword!(emitter, "export");
        space!(emitter);
        punct!(emitter, "=");
        space!(emitter);
        emit!(emitter, self.id);
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsNonNullExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(emitter, self.expr);
        punct!(emitter, "!");
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsOptionalType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(emitter, self.type_ann);
        punct!(emitter, "?");
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsParamProp {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emitter.emit_list(self.span, Some(&self.decorators), ListFormat::Decorators)?;

        if self.accessibility.is_some() {
            match self.accessibility.as_ref().unwrap() {
                Accessibility::Public => keyword!(emitter, "public"),
                Accessibility::Protected => keyword!(emitter, "protected"),
                Accessibility::Private => keyword!(emitter, "private"),
            }
            space!(emitter);
        }

        if self.is_override {
            keyword!(emitter, "override");
            space!(emitter);
        }

        if self.readonly {
            keyword!(emitter, "readonly");
            space!(emitter);
        }

        emit!(emitter, self.param);
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsParamPropParam {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        match self {
            TsParamPropParam::Ident(n) => emit!(emitter, n),
            TsParamPropParam::Assign(n) => emit!(emitter, n),
        }
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsParenthesizedType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!(emitter, "(");
        emit!(emitter, self.type_ann);
        punct!(emitter, ")");
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsPropertySignature {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if self.readonly {
            keyword!(emitter, "readonly");
            space!(emitter);
        }

        if self.computed {
            punct!(emitter, "[");
            emit!(emitter, self.key);
            punct!(emitter, "]");
        } else {
            emit!(emitter, self.key);
        }

        if self.optional {
            punct!(emitter, "?");
        }

        if let Some(type_ann) = &self.type_ann {
            punct!(emitter, ":");
            formatting_space!(emitter);
            emit!(emitter, type_ann);
        }
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsQualifiedName {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(emitter, self.left);
        punct!(emitter, ".");
        emit!(emitter, self.right);
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsRestType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!(emitter, "...");
        emit!(emitter, self.type_ann);
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsThisType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        keyword!(emitter, self.span, "this");
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsThisTypeOrIdent {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        match self {
            TsThisTypeOrIdent::TsThisType(n) => emit!(emitter, n),
            TsThisTypeOrIdent::Ident(n) => emit!(emitter, n),
        }
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsTupleType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
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
impl MacroNode for TsTupleElement {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if let Some(label) = &self.label {
            emit!(emitter, label);
            punct!(emitter, ":");
            formatting_space!(emitter);
        }

        emit!(emitter, self.ty);
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            TsType::TsKeywordType(n) => emit!(emitter, n),
            TsType::TsThisType(n) => emit!(emitter, n),
            TsType::TsFnOrConstructorType(n) => emit!(emitter, n),
            TsType::TsTypeRef(n) => emit!(emitter, n),
            TsType::TsTypeQuery(n) => emit!(emitter, n),
            TsType::TsTypeLit(n) => emit!(emitter, n),
            TsType::TsArrayType(n) => emit!(emitter, n),
            TsType::TsTupleType(n) => emit!(emitter, n),
            TsType::TsOptionalType(n) => emit!(emitter, n),
            TsType::TsRestType(n) => emit!(emitter, n),
            TsType::TsUnionOrIntersectionType(n) => emit!(emitter, n),
            TsType::TsConditionalType(n) => emit!(emitter, n),
            TsType::TsInferType(n) => emit!(emitter, n),
            TsType::TsParenthesizedType(n) => emit!(emitter, n),
            TsType::TsTypeOperator(n) => emit!(emitter, n),
            TsType::TsIndexedAccessType(n) => emit!(emitter, n),
            TsType::TsMappedType(n) => emit!(emitter, n),
            TsType::TsLitType(n) => emit!(emitter, n),
            TsType::TsTypePredicate(n) => emit!(emitter, n),
            TsType::TsImportType(n) => emit!(emitter, n),
        }
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsImportType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        keyword!(emitter, "import");
        punct!(emitter, "(");
        emit!(emitter, self.arg);
        if let Some(attributes) = &self.attributes {
            punct!(emitter, ",");
            formatting_space!(emitter);
            emit!(emitter, attributes);
        }
        punct!(emitter, ")");

        if let Some(n) = &self.qualifier {
            punct!(emitter, ".");
            emit!(emitter, n);
        }

        emit!(emitter, self.type_args);
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsImportCallOptions {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        punct!(emitter, "{");
        if !emitter.cfg.minify {
            emitter.wr.write_line()?;
            emitter.wr.increase_indent()?;
        }

        keyword!(emitter, "with");
        punct!(emitter, ":");
        formatting_space!(emitter);
        emit!(emitter, self.with);

        if !emitter.cfg.minify {
            emitter.wr.decrease_indent()?;
            emitter.wr.write_line()?;
        }
        punct!(emitter, "}");
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsTypeAliasDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if self.declare {
            keyword!(emitter, "declare");
            space!(emitter);
        }

        keyword!(emitter, "type");

        space!(emitter);

        emit!(emitter, self.id);
        if let Some(type_params) = &self.type_params {
            emit!(emitter, type_params);
        }
        formatting_space!(emitter);

        punct!(emitter, "=");

        formatting_space!(emitter);

        emit!(emitter, self.type_ann);

        formatting_semi!(emitter);
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsTypeAnn {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(emitter, self.type_ann);
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsTypeAssertion {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!(emitter, "<");
        emit!(emitter, self.type_ann);
        punct!(emitter, ">");
        emit!(emitter, self.expr);
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsConstAssertion {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(emitter, self.expr);

        space!(emitter);
        keyword!(emitter, "as");
        space!(emitter);
        keyword!(emitter, "const");
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsTypeElement {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            TsTypeElement::TsCallSignatureDecl(n) => emit!(emitter, n),
            TsTypeElement::TsConstructSignatureDecl(n) => emit!(emitter, n),
            TsTypeElement::TsPropertySignature(n) => emit!(emitter, n),
            TsTypeElement::TsMethodSignature(n) => emit!(emitter, n),
            TsTypeElement::TsIndexSignature(n) => emit!(emitter, n),
            TsTypeElement::TsGetterSignature(n) => {
                emit!(emitter, n)
            }
            TsTypeElement::TsSetterSignature(n) => {
                emit!(emitter, n)
            }
        }
        formatting_semi!(emitter);
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsGetterSignature {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        keyword!(emitter, "get");
        space!(emitter);

        if self.computed {
            punct!(emitter, "[");
            emit!(emitter, self.key);
            punct!(emitter, "]");
        } else {
            emit!(emitter, self.key)
        }

        punct!(emitter, "(");
        punct!(emitter, ")");

        if let Some(ty) = &self.type_ann {
            punct!(emitter, ":");
            formatting_space!(emitter);

            emit!(emitter, ty.type_ann);
        }
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsSetterSignature {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        keyword!(emitter, "set");
        space!(emitter);

        if self.computed {
            punct!(emitter, "[");
            emit!(emitter, self.key);
            punct!(emitter, "]");
        } else {
            emit!(emitter, self.key)
        }

        punct!(emitter, "(");
        emit!(emitter, self.param);
        punct!(emitter, ")");
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsTypeLit {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!(emitter, "{");
        emitter.emit_list(
            self.span,
            Some(&self.members),
            ListFormat::MultiLineTypeLiteralMembers,
        )?;
        punct!(emitter, "}");
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsTypeOperator {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        match self.op {
            TsTypeOperatorOp::KeyOf => keyword!(emitter, "keyof"),
            TsTypeOperatorOp::Unique => keyword!(emitter, "unique"),
            TsTypeOperatorOp::ReadOnly => keyword!(emitter, "readonly"),
        }
        space!(emitter);
        emit!(emitter, self.type_ann);
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsTypeParam {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if self.is_const {
            keyword!(emitter, "const");
            space!(emitter);
        }

        if self.is_in {
            keyword!(emitter, "in");
            space!(emitter);
        }

        if self.is_out {
            keyword!(emitter, "out");
            space!(emitter);
        }

        emit!(emitter, self.name);

        if let Some(constraints) = &self.constraint {
            space!(emitter);
            keyword!(emitter, "extends");
            space!(emitter);
            emit!(emitter, constraints);
        }

        if let Some(default) = &self.default {
            formatting_space!(emitter);
            punct!(emitter, "=");
            formatting_space!(emitter);
            emit!(emitter, default);
        }
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsTypeParamDecl {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!(emitter, "<");

        emitter.emit_list(self.span, Some(&self.params), ListFormat::TypeParameters)?;

        punct!(emitter, ">");
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsTypeParamInstantiation {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        punct!(emitter, "<");
        emitter.emit_list(self.span, Some(&self.params), ListFormat::TypeParameters)?;

        punct!(emitter, ">");
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsTypePredicate {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        if self.asserts {
            keyword!(emitter, "asserts");
            space!(emitter);
        }

        emit!(emitter, self.param_name);

        if let Some(type_ann) = &self.type_ann {
            space!(emitter);
            keyword!(emitter, "is");
            space!(emitter);
            emit!(emitter, type_ann);
        }
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsTypeQuery {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        keyword!(emitter, "typeof");
        space!(emitter);
        emit!(emitter, self.expr_name);
        emit!(emitter, self.type_args);
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsTypeQueryExpr {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            TsTypeQueryExpr::TsEntityName(n) => emit!(emitter, n),
            TsTypeQueryExpr::Import(n) => emit!(emitter, n),
        }
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsTypeRef {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(emitter, self.type_name);

        if let Some(n) = &self.type_params {
            punct!(emitter, "<");
            emitter.emit_list(n.span, Some(&n.params), ListFormat::TypeArguments)?;
            punct!(emitter, ">");
        }
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsUnionOrIntersectionType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        match self {
            TsUnionOrIntersectionType::TsUnionType(n) => emit!(emitter, n),
            TsUnionOrIntersectionType::TsIntersectionType(n) => emit!(emitter, n),
        }
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsUnionType {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emitter.emit_list(
            self.span,
            Some(&self.types),
            ListFormat::UnionTypeConstituents,
        )?;
        Ok(())
    }
}

#[node_impl]
impl MacroNode for TsInstantiation {
    fn emit(&mut self, emitter: &mut Macro) -> Result {
        emitter.emit_leading_comments_of_span(self.span(), false)?;

        emit!(emitter, self.expr);

        emit!(emitter, self.type_args);
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
