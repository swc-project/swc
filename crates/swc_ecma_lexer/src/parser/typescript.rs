use std::{fmt::Write, ops::DerefMut};

use swc_common::Spanned;

use super::*;
use crate::{
    common::parser::{
        class_and_fn::{parse_class_decl, parse_fn_decl},
        expr::parse_lit,
        ident::parse_ident_name,
        is_simple_param_list::IsSimpleParameterList,
        make_decl_declare,
        object::parse_object_expr,
        pat::parse_formal_params,
        stmt::parse_var_stmt,
        typescript::{
            is_ts_start_of_mapped_type, parse_ts_entity_name, parse_ts_enum_decl,
            parse_ts_interface_decl, parse_ts_lit_type_node, parse_ts_mapped_type,
            parse_ts_parenthesized_type, parse_ts_this_type_node, parse_ts_this_type_predicate,
            parse_ts_tuple_type, parse_ts_type_alias_decl, parse_ts_type_args, parse_ts_type_lit,
            parse_ts_type_params, parse_ts_type_ref, try_parse_ts,
            try_parse_ts_type_or_type_predicate_ann, ts_look_ahead,
        },
    },
    tok,
};

impl<I: Tokens<TokenAndSpan>> Parser<I> {
    /// `tsParseImportType`
    fn parse_ts_import_type(&mut self) -> PResult<TsImportType> {
        let start = cur_pos!(self);
        assert_and_bump!(self, "import");

        expect!(self, '(');

        let _ = cur!(self, false);

        let arg_span = self.input.cur_span();

        let arg = match cur!(self, true) {
            Token::Str { .. } => match bump!(self) {
                Token::Str { value, raw } => Str {
                    span: arg_span,
                    value,
                    raw: Some(raw),
                },
                _ => unreachable!(),
            },
            _ => {
                bump!(self);
                self.emit_err(arg_span, SyntaxError::TS1141);
                Str {
                    span: arg_span,
                    value: "".into(),
                    raw: Some("\"\"".into()),
                }
            }
        };

        // the "assert" keyword is deprecated and this syntax is niche, so
        // don't support it
        let attributes =
            if eat!(self, ',') && self.input.syntax().import_attributes() && is!(self, '{') {
                Some(self.parse_ts_call_options()?)
            } else {
                None
            };

        expect!(self, ')');

        let qualifier = if eat!(self, '.') {
            parse_ts_entity_name(self, false).map(Some)?
        } else {
            None
        };

        let type_args = if is!(self, '<') {
            parse_ts_type_args(
                self.with_ctx(self.ctx() & !Context::ShouldNotLexLtOrGtAsType)
                    .deref_mut(),
            )
            .map(Some)?
        } else {
            None
        };

        Ok(TsImportType {
            span: self.span(start),
            arg,
            qualifier,
            type_args,
            attributes,
        })
    }

    fn parse_ts_call_options(&mut self) -> PResult<TsImportCallOptions> {
        debug_assert!(self.input.syntax().typescript());
        let start = cur_pos!(self);
        assert_and_bump!(self, '{');

        expect!(self, "with");
        expect!(self, ':');

        let value = match parse_object_expr(self)? {
            Expr::Object(v) => v,
            _ => unreachable!(),
        };
        eat!(self, ',');
        expect!(self, '}');
        Ok(TsImportCallOptions {
            span: self.span(start),
            with: Box::new(value),
        })
    }

    /// `tsParseTypeQuery`
    fn parse_ts_type_query(&mut self) -> PResult<TsTypeQuery> {
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!(self);
        expect!(self, "typeof");
        let expr_name = if is!(self, "import") {
            self.parse_ts_import_type().map(From::from)?
        } else {
            parse_ts_entity_name(
                self, // allow_reserved_word
                true,
            )
            .map(From::from)?
        };

        let type_args = if !self.input.had_line_break_before_cur() && is!(self, '<') {
            Some(parse_ts_type_args(
                self.with_ctx(self.ctx() & !Context::ShouldNotLexLtOrGtAsType)
                    .deref_mut(),
            )?)
        } else {
            None
        };

        Ok(TsTypeQuery {
            span: self.span(start),
            expr_name,
            type_args,
        })
    }

    /// `tsParseModuleBlock`
    fn parse_ts_module_block(&mut self) -> PResult<TsModuleBlock> {
        trace_cur!(self, parse_ts_module_block);

        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!(self);
        expect!(self, '{');
        // Inside of a module block is considered "top-level", meaning it can have
        // imports and exports.
        let body = self
            .with_ctx(self.ctx() | Context::TopLevel)
            .parse_with(|p| {
                p.parse_block_body(/* directives */ false, /* end */ Some(&tok!('}')))
            })?;

        Ok(TsModuleBlock {
            span: self.span(start),
            body,
        })
    }

    /// `tsParseModuleOrNamespaceDeclaration`
    fn parse_ts_module_or_ns_decl(
        &mut self,
        start: BytePos,
        namespace: bool,
    ) -> PResult<Box<TsModuleDecl>> {
        debug_assert!(self.input.syntax().typescript());

        let id = parse_ident_name(self)?;
        let body: TsNamespaceBody = if eat!(self, '.') {
            let inner_start = cur_pos!(self);
            let inner = self.parse_ts_module_or_ns_decl(inner_start, namespace)?;
            let inner = TsNamespaceDecl {
                span: inner.span,
                id: match inner.id {
                    TsModuleName::Ident(i) => i,
                    _ => unreachable!(),
                },
                body: Box::new(inner.body.unwrap()),
                declare: inner.declare,
                global: inner.global,
            };
            inner.into()
        } else {
            self.parse_ts_module_block().map(From::from)?
        };

        Ok(Box::new(TsModuleDecl {
            span: self.span(start),
            declare: false,
            id: TsModuleName::Ident(id.into()),
            body: Some(body),
            global: false,
            namespace,
        }))
    }

    /// `tsParseAmbientExternalModuleDeclaration`
    fn parse_ts_ambient_external_module_decl(
        &mut self,
        start: BytePos,
    ) -> PResult<Box<TsModuleDecl>> {
        debug_assert!(self.input.syntax().typescript());

        let (global, id) = if is!(self, "global") {
            let id = parse_ident_name(self)?;
            (true, TsModuleName::Ident(id.into()))
        } else if matches!(*cur!(self, true), Token::Str { .. }) {
            let id = parse_lit(self).map(|lit| match lit {
                Lit::Str(s) => TsModuleName::Str(s),
                _ => unreachable!(),
            })?;
            (false, id)
        } else {
            unexpected!(self, "global or a string literal");
        };

        let body = if is!(self, '{') {
            Some(self.parse_ts_module_block().map(TsNamespaceBody::from)?)
        } else {
            expect!(self, ';');
            None
        };

        Ok(Box::new(TsModuleDecl {
            span: self.span(start),
            declare: false,
            id,
            global,
            body,
            namespace: false,
        }))
    }

    // pub fn parse_type(&mut self) -> PResult<Box<TsType>> {
    //     debug_assert!(self.input.syntax().typescript());

    //     self.in_type().parse_ts_type()
    // }

    /// `tsParseNonArrayType`
    pub(super) fn parse_ts_non_array_type(&mut self) -> PResult<Box<TsType>> {
        if !cfg!(feature = "typescript") {
            unreachable!()
        }
        trace_cur!(self, parse_ts_non_array_type);
        debug_assert!(self.input.syntax().typescript());

        let start = cur_pos!(self);

        match *cur!(self, true) {
            Token::Word(Word::Ident(..))
            | tok!("void")
            | tok!("yield")
            | tok!("null")
            | tok!("await")
            | tok!("break") => {
                if is!(self, "asserts") && peeked_is!(self, "this") {
                    bump!(self);
                    let this_keyword = parse_ts_this_type_node(self)?;
                    return parse_ts_this_type_predicate(self, start, true, this_keyword)
                        .map(TsType::from)
                        .map(Box::new);
                }

                let kind = if is!(self, "void") {
                    Some(TsKeywordTypeKind::TsVoidKeyword)
                } else if is!(self, "null") {
                    Some(TsKeywordTypeKind::TsNullKeyword)
                } else if is!(self, "any") {
                    Some(TsKeywordTypeKind::TsAnyKeyword)
                } else if is!(self, "boolean") {
                    Some(TsKeywordTypeKind::TsBooleanKeyword)
                } else if is!(self, "bigint") {
                    Some(TsKeywordTypeKind::TsBigIntKeyword)
                } else if is!(self, "never") {
                    Some(TsKeywordTypeKind::TsNeverKeyword)
                } else if is!(self, "number") {
                    Some(TsKeywordTypeKind::TsNumberKeyword)
                } else if is!(self, "object") {
                    Some(TsKeywordTypeKind::TsObjectKeyword)
                } else if is!(self, "string") {
                    Some(TsKeywordTypeKind::TsStringKeyword)
                } else if is!(self, "symbol") {
                    Some(TsKeywordTypeKind::TsSymbolKeyword)
                } else if is!(self, "unknown") {
                    Some(TsKeywordTypeKind::TsUnknownKeyword)
                } else if is!(self, "undefined") {
                    Some(TsKeywordTypeKind::TsUndefinedKeyword)
                } else if is!(self, "intrinsic") {
                    Some(TsKeywordTypeKind::TsIntrinsicKeyword)
                } else {
                    None
                };

                let peeked_is_dot = peeked_is!(self, '.');

                match kind {
                    Some(kind) if !peeked_is_dot => {
                        bump!(self);
                        return Ok(Box::new(TsType::TsKeywordType(TsKeywordType {
                            span: self.span(start),
                            kind,
                        })));
                    }
                    _ => {
                        return parse_ts_type_ref(self).map(TsType::from).map(Box::new);
                    }
                }
            }
            Token::BigInt { .. }
            | Token::Str { .. }
            | Token::Num { .. }
            | tok!("true")
            | tok!("false")
            | tok!('`') => {
                return parse_ts_lit_type_node(self).map(TsType::from).map(Box::new);
            }
            tok!('-') => {
                let start = cur_pos!(self);

                bump!(self);

                if !matches!(*cur!(self, true), Token::Num { .. } | Token::BigInt { .. }) {
                    unexpected!(self, "numeric literal or bigint literal")
                }

                let lit = parse_lit(self)?;
                let lit = match lit {
                    Lit::Num(Number { span, value, raw }) => {
                        let mut new_raw = String::from("-");

                        match raw {
                            Some(raw) => {
                                new_raw.push_str(&raw);
                            }
                            _ => {
                                write!(new_raw, "{value}").unwrap();
                            }
                        };

                        TsLit::Number(Number {
                            span,
                            value: -value,
                            raw: Some(new_raw.into()),
                        })
                    }
                    Lit::BigInt(BigInt { span, value, raw }) => {
                        let mut new_raw = String::from("-");

                        match raw {
                            Some(raw) => {
                                new_raw.push_str(&raw);
                            }
                            _ => {
                                write!(new_raw, "{value}").unwrap();
                            }
                        };

                        TsLit::BigInt(BigInt {
                            span,
                            value: Box::new(-*value),
                            raw: Some(new_raw.into()),
                        })
                    }
                    _ => unreachable!(),
                };

                return Ok(Box::new(TsType::TsLitType(TsLitType {
                    span: self.span(start),
                    lit,
                })));
            }

            tok!("import") => {
                return self.parse_ts_import_type().map(TsType::from).map(Box::new);
            }

            tok!("this") => {
                let start = cur_pos!(self);
                let this_keyword = parse_ts_this_type_node(self)?;
                if !self.input.had_line_break_before_cur() && is!(self, "is") {
                    return parse_ts_this_type_predicate(self, start, false, this_keyword)
                        .map(TsType::from)
                        .map(Box::new);
                } else {
                    return Ok(Box::new(TsType::TsThisType(this_keyword)));
                }
            }
            tok!("typeof") => {
                return self.parse_ts_type_query().map(TsType::from).map(Box::new);
            }

            tok!('{') => {
                return if ts_look_ahead(self, is_ts_start_of_mapped_type)? {
                    parse_ts_mapped_type(self).map(TsType::from).map(Box::new)
                } else {
                    parse_ts_type_lit(self).map(TsType::from).map(Box::new)
                };
            }
            tok!('[') => {
                return parse_ts_tuple_type(self).map(TsType::from).map(Box::new);
            }
            tok!('(') => {
                return parse_ts_parenthesized_type(self)
                    .map(TsType::from)
                    .map(Box::new);
            }
            _ => {}
        }
        //   switch (self.state.type) {
        //   }

        unexpected!(
            self,
            "an identifier, void, yield, null, await, break, a string literal, a numeric literal, \
             true, false, `, -, import, this, typeof, {, [, ("
        )
    }

    /// `tsParseExpressionStatement`
    pub(super) fn parse_ts_expr_stmt(
        &mut self,
        decorators: Vec<Decorator>,
        expr: Ident,
    ) -> PResult<Option<Decl>> {
        if !cfg!(feature = "typescript") {
            return Ok(Default::default());
        }

        let start = expr.span_lo();

        match &*expr.sym {
            "declare" => {
                let decl = self.try_parse_ts_declare(start, decorators)?;
                if let Some(decl) = decl {
                    Ok(Some(make_decl_declare(decl)))
                } else {
                    Ok(None)
                }
            }
            "global" => {
                // `global { }` (with no `declare`) may appear inside an ambient module
                // declaration.
                // Would like to use tsParseAmbientExternalModuleDeclaration here, but already
                // ran past "global".
                if is!(self, '{') {
                    let global = true;
                    let id = TsModuleName::Ident(expr);
                    let body = self
                        .parse_ts_module_block()
                        .map(TsNamespaceBody::from)
                        .map(Some)?;
                    Ok(Some(
                        TsModuleDecl {
                            span: self.span(start),
                            global,
                            declare: false,
                            namespace: false,
                            id,
                            body,
                        }
                        .into(),
                    ))
                } else {
                    Ok(None)
                }
            }
            _ => self.parse_ts_decl(start, decorators, expr.sym, /* next */ false),
        }
    }

    /// `tsTryParseDeclare`
    pub(super) fn try_parse_ts_declare(
        &mut self,
        start: BytePos,
        decorators: Vec<Decorator>,
    ) -> PResult<Option<Decl>> {
        if !self.syntax().typescript() {
            return Ok(None);
        }

        if self.ctx().contains(Context::InDeclare)
            && matches!(
                self.syntax(),
                Syntax::Typescript(TsSyntax { dts: false, .. })
            )
        {
            let span_of_declare = self.span(start);
            self.emit_err(span_of_declare, SyntaxError::TS1038);
        }

        let declare_start = start;
        let ctx = self.ctx() | Context::InDeclare;
        self.with_ctx(ctx).parse_with(|p| {
            if is!(p, "function") {
                return parse_fn_decl(p, decorators)
                    .map(|decl| match decl {
                        Decl::Fn(f) => FnDecl {
                            declare: true,
                            function: Box::new(Function {
                                span: Span {
                                    lo: declare_start,
                                    ..f.function.span
                                },
                                ..*f.function
                            }),
                            ..f
                        }
                        .into(),
                        _ => decl,
                    })
                    .map(Some);
            }

            if is!(p, "class") {
                return parse_class_decl(p, start, start, decorators, false)
                    .map(|decl| match decl {
                        Decl::Class(c) => ClassDecl {
                            declare: true,
                            class: Box::new(Class {
                                span: Span {
                                    lo: declare_start,
                                    ..c.class.span
                                },
                                ..*c.class
                            }),
                            ..c
                        }
                        .into(),
                        _ => decl,
                    })
                    .map(Some);
            }

            if is!(p, "const") && peeked_is!(p, "enum") {
                assert_and_bump!(p, "const");
                let _ = cur!(p, true);
                assert_and_bump!(p, "enum");

                return parse_ts_enum_decl(p, start, /* is_const */ true)
                    .map(|decl| TsEnumDecl {
                        declare: true,
                        span: Span {
                            lo: declare_start,
                            ..decl.span
                        },
                        ..*decl
                    })
                    .map(Box::new)
                    .map(From::from)
                    .map(Some);
            }
            if is_one_of!(p, "const", "var", "let") {
                return parse_var_stmt(p, false)
                    .map(|decl| VarDecl {
                        declare: true,
                        span: Span {
                            lo: declare_start,
                            ..decl.span
                        },
                        ..*decl
                    })
                    .map(Box::new)
                    .map(From::from)
                    .map(Some);
            }

            if is!(p, "global") {
                return p
                    .parse_ts_ambient_external_module_decl(start)
                    .map(Decl::from)
                    .map(make_decl_declare)
                    .map(Some);
            } else if is!(p, IdentName) {
                let value = match *cur!(p, true) {
                    Token::Word(ref w) => w.clone().into(),
                    _ => unreachable!(),
                };
                return p
                    .parse_ts_decl(start, decorators, value, /* next */ true)
                    .map(|v| v.map(make_decl_declare));
            }

            Ok(None)
        })
    }

    /// `tsTryParseExportDeclaration`
    ///
    /// Note: this won't be called unless the keyword is allowed in
    /// `shouldParseExportDeclaration`.
    pub(super) fn try_parse_ts_export_decl(
        &mut self,
        decorators: Vec<Decorator>,
        value: Atom,
    ) -> Option<Decl> {
        if !cfg!(feature = "typescript") {
            return None;
        }

        try_parse_ts(self, |p| {
            let start = cur_pos!(p);
            let opt = p.parse_ts_decl(start, decorators, value, true)?;
            Ok(opt)
        })
    }

    /// Common to tsTryParseDeclare, tsTryParseExportDeclaration, and
    /// tsParseExpressionStatement.
    ///
    /// `tsParseDeclaration`
    fn parse_ts_decl(
        &mut self,
        start: BytePos,
        decorators: Vec<Decorator>,
        value: Atom,
        next: bool,
    ) -> PResult<Option<Decl>> {
        if !cfg!(feature = "typescript") {
            return Ok(Default::default());
        }

        match &*value {
            "abstract" => {
                if next || (is!(self, "class") && !self.input.had_line_break_before_cur()) {
                    if next {
                        bump!(self);
                    }
                    return Ok(Some(parse_class_decl(
                        self, start, start, decorators, true,
                    )?));
                }
            }

            "enum" => {
                if next || is!(self, IdentRef) {
                    if next {
                        bump!(self);
                    }
                    return parse_ts_enum_decl(self, start, /* is_const */ false)
                        .map(From::from)
                        .map(Some);
                }
            }

            "interface" => {
                if next || (is!(self, IdentRef)) {
                    if next {
                        bump!(self);
                    }

                    return parse_ts_interface_decl(self, start)
                        .map(From::from)
                        .map(Some);
                }
            }

            "module" if !self.input.had_line_break_before_cur() => {
                if next {
                    bump!(self);
                }

                if matches!(*cur!(self, true), Token::Str { .. }) {
                    return self
                        .parse_ts_ambient_external_module_decl(start)
                        .map(From::from)
                        .map(Some);
                } else if next || is!(self, IdentRef) {
                    return self
                        .parse_ts_module_or_ns_decl(start, false)
                        .map(From::from)
                        .map(Some);
                }
            }

            "namespace" => {
                if next || is!(self, IdentRef) {
                    if next {
                        bump!(self);
                    }
                    return self
                        .parse_ts_module_or_ns_decl(start, true)
                        .map(From::from)
                        .map(Some);
                }
            }

            "type" => {
                if next || (!self.input.had_line_break_before_cur() && is!(self, IdentRef)) {
                    if next {
                        bump!(self);
                    }
                    return parse_ts_type_alias_decl(self, start)
                        .map(From::from)
                        .map(Some);
                }
            }

            _ => {}
        }

        Ok(None)
    }

    /// `tsTryParseGenericAsyncArrowFunction`
    pub(super) fn try_parse_ts_generic_async_arrow_fn(
        &mut self,
        start: BytePos,
    ) -> PResult<Option<ArrowExpr>> {
        if !cfg!(feature = "typescript") {
            return Ok(Default::default());
        }

        let res = if is_one_of!(self, '<', JSXTagStart) {
            try_parse_ts(self, |p| {
                let type_params = parse_ts_type_params(p, false, false)?;
                // Don't use overloaded parseFunctionParams which would look for "<" again.
                expect!(p, '(');
                let params: Vec<Pat> = parse_formal_params(p)?.into_iter().map(|p| p.pat).collect();
                expect!(p, ')');
                let return_type = try_parse_ts_type_or_type_predicate_ann(p)?;
                expect!(p, "=>");

                Ok(Some((type_params, params, return_type)))
            })
        } else {
            None
        };

        let (type_params, params, return_type) = match res {
            Some(v) => v,
            None => return Ok(None),
        };

        let ctx = (self.ctx() | Context::InAsync) & !Context::InGenerator;
        self.with_ctx(ctx).parse_with(|p| {
            let is_generator = false;
            let is_async = true;
            let body = p.parse_fn_block_or_expr_body(
                true,
                false,
                true,
                params.is_simple_parameter_list(),
            )?;
            Ok(Some(ArrowExpr {
                span: span!(p, start),
                body,
                is_async,
                is_generator,
                type_params: Some(type_params),
                params,
                return_type,
                ..Default::default()
            }))
        })
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_ast::*;

    use crate::{
        common::parser::Parser as ParserTrait,
        token::{BinOpToken, Token, TokenAndSpan},
        Capturing, Lexer, Parser, Syntax,
    };

    #[test]
    fn issue_726() {
        crate::with_test_sess(
            "type Test = (
    string | number);",
            |handler, input| {
                let lexer = Lexer::new(
                    Syntax::Typescript(Default::default()),
                    EsVersion::Es2019,
                    input,
                    None,
                );
                let lexer = Capturing::new(lexer);

                let mut parser = Parser::new_from(lexer);
                parser
                    .parse_typescript_module()
                    .map_err(|e| e.into_diagnostic(handler).emit())?;
                let tokens: Vec<TokenAndSpan> = parser.input_mut().iter.tokens().take();
                let tokens = tokens.into_iter().map(|t| t.token).collect::<Vec<_>>();
                assert_eq!(tokens.len(), 9, "Tokens: {tokens:#?}");
                Ok(())
            },
        )
        .unwrap();
    }

    #[test]
    fn issue_751() {
        crate::with_test_sess("t ? -(v >>> 1) : v >>> 1", |handler, input| {
            let lexer = Lexer::new(
                Syntax::Typescript(Default::default()),
                EsVersion::Es2019,
                input,
                None,
            );
            let lexer = Capturing::new(lexer);

            let mut parser = Parser::new_from(lexer);
            parser
                .parse_typescript_module()
                .map_err(|e| e.into_diagnostic(handler).emit())?;
            let tokens: Vec<TokenAndSpan> = parser.input_mut().iter.tokens().take();
            let token = &tokens[10];
            assert_eq!(
                token.token,
                Token::BinOp(BinOpToken::ZeroFillRShift),
                "Token: {:#?}",
                token.token
            );
            Ok(())
        })
        .unwrap();
    }
}
