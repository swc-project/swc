use super::*;

impl<I: Tokens> Parser<I> {
    fn parse_import(&mut self) -> PResult<ModuleItem> {
        let start = cur_pos!(self);

        if peeked_is!(self, '.') {
            let expr = self.parse_expr()?;

            eat!(self, ';');

            return Ok(Stmt::Expr(ExprStmt {
                span: span!(self, start),
                expr,
            })
            .into());
        }

        if peeked_is!(self, '(') {
            let expr = self.parse_expr()?;

            eat!(self, ';');

            return Ok(Stmt::Expr(ExprStmt {
                span: span!(self, start),
                expr,
            })
            .into());
        }

        // It's now import statement

        if !self.ctx().module {
            // Switch to module mode
            let ctx = Context {
                module: true,
                strict: true,
                ..self.ctx()
            };
            self.set_ctx(ctx);
        }

        expect!(self, "import");

        if self.input.syntax().typescript() && is!(self, IdentRef) && peeked_is!(self, '=') {
            return self
                .parse_ts_import_equals_decl(
                    start, /* is_export */ false, /* is_type_only */ false,
                )
                .map(ModuleDecl::from)
                .map(ModuleItem::from);
        }

        // Handle import 'mod.js'
        let str_start = cur_pos!(self);
        if let Ok(&Token::Str { .. }) = cur!(self, false) {
            let src = match bump!(self) {
                Token::Str { value, raw, .. } => Str {
                    span: span!(self, str_start),
                    value,
                    raw: Some(raw),
                },
                _ => unreachable!(),
            };
            let _ = cur!(self, false);
            let asserts = if self.input.syntax().import_assertions()
                && !self.input.had_line_break_before_cur()
                && eat!(self, "assert")
            {
                match *self.parse_object::<Box<Expr>>()? {
                    Expr::Object(v) => Some(v),
                    _ => unreachable!(),
                }
            } else {
                None
            };
            expect!(self, ';');
            return Ok(ModuleDecl::Import(ImportDecl {
                span: span!(self, start),
                src,
                specifiers: vec![],
                type_only: false,
                asserts,
            }))
            .map(ModuleItem::from);
        }

        let type_only = self.input.syntax().typescript()
            && is!(self, "type")
            && (peeked_is!(self, '{') || !peeked_is!(self, "from") && !peeked_is!(self, ','));

        if type_only {
            assert_and_bump!(self, "type");

            if is!(self, IdentRef) && peeked_is!(self, '=') {
                return self
                    .parse_ts_import_equals_decl(
                        start, /* is_export */ false, /* is_type_only */ true,
                    )
                    .map(ModuleDecl::from)
                    .map(ModuleItem::from);
            }
        }

        let mut specifiers = vec![];

        if is!(self, BindingIdent) {
            let local = self.parse_imported_default_binding()?;
            //TODO: Better error reporting
            if !is!(self, "from") {
                expect!(self, ',');
            }
            specifiers.push(ImportSpecifier::Default(ImportDefaultSpecifier {
                span: local.span,
                local,
            }));
        }

        {
            let import_spec_start = cur_pos!(self);
            if eat!(self, '*') {
                expect!(self, "as");
                let local = self.parse_imported_binding()?;
                specifiers.push(ImportSpecifier::Namespace(ImportStarAsSpecifier {
                    span: span!(self, import_spec_start),
                    local,
                }));
            } else if eat!(self, '{') {
                while !eof!(self) && !is!(self, '}') {
                    specifiers.push(self.parse_import_specifier(type_only)?);

                    if is!(self, '}') {
                        break;
                    } else {
                        expect!(self, ',');
                    }
                }
                expect!(self, '}');
            }
        }

        let src = {
            expect!(self, "from");
            let str_start = cur_pos!(self);

            match *cur!(self, true)? {
                Token::Str { .. } => match bump!(self) {
                    Token::Str { value, raw, .. } => Str {
                        span: span!(self, str_start),
                        value,
                        raw: Some(raw),
                    },
                    _ => unreachable!(),
                },
                _ => unexpected!(self, "a string literal"),
            }
        };

        let _ = cur!(self, false);
        let asserts = if self.input.syntax().import_assertions()
            && !self.input.had_line_break_before_cur()
            && eat!(self, "assert")
        {
            match *self.parse_object::<Box<Expr>>()? {
                Expr::Object(v) => Some(v),
                _ => unreachable!(),
            }
        } else {
            None
        };

        expect!(self, ';');

        Ok(ModuleDecl::Import(ImportDecl {
            span: span!(self, start),
            specifiers,
            src,
            type_only,
            asserts,
        }))
        .map(ModuleItem::from)
    }

    /// Parse `foo`, `foo2 as bar` in `import { foo, foo2 as bar }`
    fn parse_import_specifier(&mut self, type_only: bool) -> PResult<ImportSpecifier> {
        let start = cur_pos!(self);
        match self.parse_module_export_name()? {
            ModuleExportName::Ident(mut orig_name) => {
                let mut is_type_only = false;
                // Handle:
                // `import { type xx } from 'mod'`
                // `import { type xx as yy } from 'mod'`
                // `import { type as } from 'mod'`
                // `import { type as as } from 'mod'`
                // `import { type as as as } from 'mod'`
                if self.syntax().typescript()
                    && orig_name.sym == js_word!("type")
                    && is!(self, IdentName)
                {
                    let possibly_orig_name = self.parse_ident_name()?;
                    if possibly_orig_name.sym == js_word!("as") {
                        // `import { type as } from 'mod'`
                        if !is!(self, IdentName) {
                            if self.ctx().is_reserved_word(&possibly_orig_name.sym) {
                                syntax_error!(
                                    self,
                                    possibly_orig_name.span,
                                    SyntaxError::ReservedWordInImport
                                )
                            }

                            if type_only {
                                self.emit_err(orig_name.span, SyntaxError::TS2206);
                            }

                            return Ok(ImportSpecifier::Named(ImportNamedSpecifier {
                                span: span!(self, start),
                                local: possibly_orig_name,
                                imported: None,
                                is_type_only: true,
                            }));
                        }

                        let maybe_as = self.parse_binding_ident()?.id;
                        if maybe_as.sym == js_word!("as") {
                            if is!(self, IdentName) {
                                // `import { type as as as } from 'mod'`
                                // `import { type as as foo } from 'mod'`
                                let local = self.parse_binding_ident()?.id;

                                if type_only {
                                    self.emit_err(orig_name.span, SyntaxError::TS2206);
                                }

                                return Ok(ImportSpecifier::Named(ImportNamedSpecifier {
                                    span: Span::new(start, orig_name.span.hi(), Default::default()),
                                    local,
                                    imported: Some(ModuleExportName::Ident(possibly_orig_name)),
                                    is_type_only: true,
                                }));
                            } else {
                                // `import { type as as } from 'mod'`
                                return Ok(ImportSpecifier::Named(ImportNamedSpecifier {
                                    span: Span::new(start, maybe_as.span.hi(), Default::default()),
                                    local: maybe_as,
                                    imported: Some(ModuleExportName::Ident(orig_name)),
                                    is_type_only: false,
                                }));
                            }
                        } else {
                            // `import { type as xxx } from 'mod'`
                            return Ok(ImportSpecifier::Named(ImportNamedSpecifier {
                                span: Span::new(start, orig_name.span.hi(), Default::default()),
                                local: maybe_as,
                                imported: Some(ModuleExportName::Ident(orig_name)),
                                is_type_only: false,
                            }));
                        }
                    } else {
                        // `import { type xx } from 'mod'`
                        // `import { type xx as yy } from 'mod'`
                        if type_only {
                            self.emit_err(orig_name.span, SyntaxError::TS2206);
                        }

                        orig_name = possibly_orig_name;
                        is_type_only = true;
                    }
                }

                if eat!(self, "as") {
                    let local = self.parse_binding_ident()?.id;
                    return Ok(ImportSpecifier::Named(ImportNamedSpecifier {
                        span: Span::new(start, local.span.hi(), Default::default()),
                        local,
                        imported: Some(ModuleExportName::Ident(orig_name)),
                        is_type_only,
                    }));
                }

                // Handle difference between
                //
                // 'ImportedBinding'
                // 'IdentifierName' as 'ImportedBinding'
                if self.ctx().is_reserved_word(&orig_name.sym) {
                    syntax_error!(self, orig_name.span, SyntaxError::ReservedWordInImport)
                }

                let local = orig_name;
                Ok(ImportSpecifier::Named(ImportNamedSpecifier {
                    span: span!(self, start),
                    local,
                    imported: None,
                    is_type_only,
                }))
            }
            ModuleExportName::Str(orig_str) => {
                if eat!(self, "as") {
                    let local = self.parse_binding_ident()?.id;
                    Ok(ImportSpecifier::Named(ImportNamedSpecifier {
                        span: Span::new(start, local.span.hi(), Default::default()),
                        local,
                        imported: Some(ModuleExportName::Str(orig_str)),
                        is_type_only: false,
                    }))
                } else {
                    syntax_error!(
                        self,
                        orig_str.span,
                        SyntaxError::ImportBindingIsString(orig_str.value)
                    )
                }
            }
        }
    }

    fn parse_imported_default_binding(&mut self) -> PResult<Ident> {
        self.parse_imported_binding()
    }

    fn parse_imported_binding(&mut self) -> PResult<Ident> {
        let ctx = Context {
            in_async: false,
            in_generator: false,
            ..self.ctx()
        };
        Ok(self.with_ctx(ctx).parse_binding_ident()?.id)
    }

    fn parse_export(&mut self, decorators: Vec<Decorator>) -> PResult<ModuleDecl> {
        if !self.ctx().module {
            // Switch to module mode
            let ctx = Context {
                module: true,
                strict: true,
                ..self.ctx()
            };
            self.set_ctx(ctx);
        }

        let start = cur_pos!(self);
        assert_and_bump!(self, "export");
        let _ = cur!(self, true);
        let after_export_start = cur_pos!(self);

        // "export declare" is equivalent to just "export".
        let declare = self.input.syntax().typescript() && eat!(self, "declare");

        if declare {
            // TODO: Remove
            if let Some(decl) = self.try_parse_ts_declare(after_export_start, decorators.clone())? {
                return Ok(ModuleDecl::ExportDecl(ExportDecl {
                    span: span!(self, start),
                    decl,
                }));
            }
        }

        if self.input.syntax().typescript() && is!(self, IdentName) {
            let sym = match *cur!(self, true)? {
                Token::Word(ref w) => w.clone().into(),
                _ => unreachable!(),
            };
            // TODO: remove clone
            if let Some(decl) = self.try_parse_ts_export_decl(decorators.clone(), sym) {
                return Ok(ModuleDecl::ExportDecl(ExportDecl {
                    span: span!(self, start),
                    decl,
                }));
            }
        }

        if self.input.syntax().typescript() {
            if eat!(self, "import") {
                // export import A = B
                return self
                    .parse_ts_import_equals_decl(
                        start, /* is_export */ true, /* is_type_only */ false,
                    )
                    .map(From::from);
            }

            if eat!(self, '=') {
                // `export = x;`
                let expr = self.parse_expr()?;
                expect!(self, ';');
                return Ok(TsExportAssignment {
                    span: span!(self, start),
                    expr,
                }
                .into());
            }

            if eat!(self, "as") {
                // `export as namespace A;`
                // See `parseNamespaceExportDeclaration` in TypeScript's own parser
                expect!(self, "namespace");
                let id = self.parse_ident(false, false)?;
                expect!(self, ';');
                return Ok(TsNamespaceExportDecl {
                    span: span!(self, start),
                    id,
                }
                .into());
            }
        }

        let mut has_star = false;
        let mut export_ns = None;
        let ns_export_specifier_start = cur_pos!(self);

        let type_only = self.input.syntax().typescript() && eat!(self, "type");

        if eat!(self, '*') {
            has_star = true;
            if self.input.syntax().typescript() && type_only {
                // export type * from "mod";
                // or
                // export type * as foo from "mod";
                self.emit_err(span!(self, start), SyntaxError::TS1383)
            }
            if is!(self, "from") {
                let (src, asserts) = self.parse_from_clause_and_semi()?;
                return Ok(ModuleDecl::ExportAll(ExportAll {
                    span: span!(self, start),
                    src,
                    asserts,
                }));
            }
            if eat!(self, "as") {
                let _ = cur!(self, false);

                let name = self.parse_module_export_name()?;
                export_ns = Some(ExportSpecifier::Namespace(ExportNamespaceSpecifier {
                    span: span!(self, ns_export_specifier_start),
                    name,
                }));
            }
        }

        // Some("default") if default is exported from 'src'
        let mut export_default = None;

        if !type_only && export_ns.is_none() && eat!(self, "default") {
            if self.input.syntax().typescript() {
                if is!(self, "abstract")
                    && peeked_is!(self, "class")
                    && !self.input.has_linebreak_between_cur_and_peeked()
                {
                    let class_start = cur_pos!(self);
                    assert_and_bump!(self, "abstract");
                    let _ = cur!(self, true);

                    return self
                        .parse_default_class(start, class_start, decorators, true)
                        .map(ModuleDecl::ExportDefaultDecl);
                }
                if is!(self, "abstract") && peeked_is!(self, "interface") {
                    self.emit_err(self.input.cur_span(), SyntaxError::TS1242);
                    assert_and_bump!(self, "abstract");
                }

                if is!(self, "interface") {
                    let interface_start = cur_pos!(self);
                    assert_and_bump!(self, "interface");
                    let decl = self
                        .parse_ts_interface_decl(interface_start)
                        .map(DefaultDecl::from)?;
                    return Ok(ExportDefaultDecl {
                        span: span!(self, start),
                        decl,
                    }
                    .into());
                }
            }

            if is!(self, "class") {
                let class_start = cur_pos!(self);
                let decl = self.parse_default_class(start, class_start, decorators, false)?;
                return Ok(ModuleDecl::ExportDefaultDecl(decl));
            } else if is!(self, "async")
                && peeked_is!(self, "function")
                && !self.input.has_linebreak_between_cur_and_peeked()
            {
                let decl = self.parse_default_async_fn(start, decorators)?;
                return Ok(ModuleDecl::ExportDefaultDecl(decl));
            } else if is!(self, "function") {
                let decl = self.parse_default_fn(start, decorators)?;
                return Ok(ModuleDecl::ExportDefaultDecl(decl));
            } else if self.input.syntax().export_default_from()
                && (is!(self, "from") || (is!(self, ',') && peeked_is!(self, '{')))
            {
                export_default = Some(Ident::new("default".into(), self.input.prev_span()))
            } else {
                let expr = self.include_in_expr(true).parse_assignment_expr()?;
                expect!(self, ';');
                return Ok(ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                    span: span!(self, start),
                    expr,
                }));
            }
        }

        let decl = if !type_only && is!(self, "class") {
            let class_start = cur_pos!(self);
            self.parse_class_decl(start, class_start, decorators, false)?
        } else if !type_only
            && is!(self, "async")
            && peeked_is!(self, "function")
            && !self.input.has_linebreak_between_cur_and_peeked()
        {
            self.parse_async_fn_decl(decorators)?
        } else if !type_only && is!(self, "function") {
            self.parse_fn_decl(decorators)?
        } else if !type_only
            && self.input.syntax().typescript()
            && is!(self, "const")
            && peeked_is!(self, "enum")
        {
            let enum_start = cur_pos!(self);
            assert_and_bump!(self, "const");
            let _ = cur!(self, true);
            assert_and_bump!(self, "enum");
            return self
                .parse_ts_enum_decl(enum_start, /* is_const */ true)
                .map(Decl::from)
                .map(|decl| {
                    ModuleDecl::ExportDecl(ExportDecl {
                        span: span!(self, start),
                        decl,
                    })
                });
        } else if !type_only
            && (is!(self, "var")
                || is!(self, "const")
                || (is!(self, "let"))
                    && peek!(self)
                        .map(|t| {
                            // module code is always in strict mode.
                            t.follows_keyword_let(true)
                        })
                        .unwrap_or(false))
        {
            self.parse_var_stmt(false).map(Decl::Var)?
        } else {
            // export {};
            // export {} from '';

            if is!(self, "from") {
                if let Some(s) = export_ns {
                    let (src, asserts) = self.parse_from_clause_and_semi()?;
                    return Ok(ModuleDecl::ExportNamed(NamedExport {
                        span: span!(self, start),
                        specifiers: vec![s],
                        src: Some(src),
                        type_only,
                        asserts,
                    }));
                }
            }

            let default = match export_default {
                Some(default) => Some(default),
                None => {
                    if self.input.syntax().export_default_from() && is!(self, IdentName) {
                        Some(self.parse_ident(false, false)?)
                    } else {
                        None
                    }
                }
            };

            if is!(self, "from") {
                if let Some(default) = default {
                    let (src, asserts) = self.parse_from_clause_and_semi()?;
                    return Ok(ModuleDecl::ExportNamed(NamedExport {
                        span: span!(self, start),
                        specifiers: vec![ExportSpecifier::Default(ExportDefaultSpecifier {
                            exported: default,
                        })],
                        src: Some(src),
                        type_only,
                        asserts,
                    }));
                }
            }

            if has_star && export_ns.is_none() {
                // improve error message for `export * from foo`
                let (src, asserts) = self.parse_from_clause_and_semi()?;
                return Ok(ModuleDecl::ExportAll(ExportAll {
                    span: Span::new(start, src.span.hi(), Default::default()),
                    src,
                    asserts,
                }));
            }

            let has_ns = export_ns.is_some();
            let has_default = default.is_some();
            if has_ns || has_default {
                expect!(self, ',')
            }

            expect!(self, '{');
            let mut specifiers = vec![];
            if let Some(s) = export_ns {
                specifiers.push(s)
            }
            if let Some(default) = default {
                specifiers.push(ExportSpecifier::Default(ExportDefaultSpecifier {
                    exported: default,
                }))
            }
            let mut string_export_binding_span = None;
            while !eof!(self) && !is!(self, '}') {
                let specifier = self.parse_named_export_specifier(type_only)?;
                if let ModuleExportName::Str(str_export) = &specifier.orig {
                    string_export_binding_span = Some(str_export.span);
                }
                specifiers.push(ExportSpecifier::Named(specifier));

                if is!(self, '}') {
                    break;
                } else {
                    expect!(self, ',');
                }
            }
            expect!(self, '}');

            let opt = if is!(self, "from") {
                Some(self.parse_from_clause_and_semi()?)
            } else {
                eat!(self, ';');
                if has_default || has_ns {
                    syntax_error!(
                        self,
                        span!(self, start),
                        SyntaxError::ExportDefaultWithOutFrom
                    );
                }
                if let Some(span) = string_export_binding_span {
                    syntax_error!(self, span, SyntaxError::ExportBindingIsString);
                }
                None
            };
            let (src, asserts) = match opt {
                Some(v) => (Some(v.0), v.1),
                None => (None, None),
            };
            return Ok(ModuleDecl::ExportNamed(NamedExport {
                span: span!(self, start),
                specifiers,
                src,
                type_only,
                asserts,
            }));
        };

        Ok(ModuleDecl::ExportDecl(ExportDecl {
            span: span!(self, start),
            decl,
        }))
    }

    fn parse_named_export_specifier(&mut self, type_only: bool) -> PResult<ExportNamedSpecifier> {
        let start = cur_pos!(self);

        let mut is_type_only = false;

        let orig = match self.parse_module_export_name()? {
            ModuleExportName::Ident(orig_ident) => {
                // Handle:
                // `export { type xx }`
                // `export { type xx as yy }`
                // `export { type as }`
                // `export { type as as }`
                // `export { type as as as }`
                if self.syntax().typescript()
                    && orig_ident.sym == js_word!("type")
                    && is!(self, IdentName)
                {
                    let possibly_orig = self.parse_ident_name()?;
                    if possibly_orig.sym == js_word!("as") {
                        // `export { type as }`
                        if !is!(self, IdentName) {
                            if type_only {
                                self.emit_err(orig_ident.span, SyntaxError::TS2207);
                            }

                            return Ok(ExportNamedSpecifier {
                                span: span!(self, start),
                                orig: ModuleExportName::Ident(possibly_orig),
                                exported: None,
                                is_type_only: true,
                            });
                        }

                        let maybe_as = self.parse_ident_name()?;
                        if maybe_as.sym == js_word!("as") {
                            if is!(self, IdentName) {
                                // `export { type as as as }`
                                // `export { type as as foo }`
                                let exported = self.parse_ident_name()?;

                                if type_only {
                                    self.emit_err(orig_ident.span, SyntaxError::TS2207);
                                }

                                return Ok(ExportNamedSpecifier {
                                    span: Span::new(
                                        start,
                                        orig_ident.span.hi(),
                                        Default::default(),
                                    ),
                                    orig: ModuleExportName::Ident(possibly_orig),
                                    exported: Some(ModuleExportName::Ident(exported)),
                                    is_type_only: true,
                                });
                            } else {
                                // `export { type as as }`
                                return Ok(ExportNamedSpecifier {
                                    span: Span::new(
                                        start,
                                        orig_ident.span.hi(),
                                        Default::default(),
                                    ),
                                    orig: ModuleExportName::Ident(orig_ident),
                                    exported: Some(ModuleExportName::Ident(maybe_as)),
                                    is_type_only: false,
                                });
                            }
                        } else {
                            // `export { type as xxx }`
                            return Ok(ExportNamedSpecifier {
                                span: Span::new(start, orig_ident.span.hi(), Default::default()),
                                orig: ModuleExportName::Ident(orig_ident),
                                exported: Some(ModuleExportName::Ident(maybe_as)),
                                is_type_only: false,
                            });
                        }
                    } else {
                        // `export { type xx }`
                        // `export { type xx as yy }`
                        if type_only {
                            self.emit_err(orig_ident.span, SyntaxError::TS2207);
                        }

                        is_type_only = true;
                        ModuleExportName::Ident(possibly_orig)
                    }
                } else {
                    ModuleExportName::Ident(orig_ident)
                }
            }
            module_export_name => module_export_name,
        };

        let exported = if eat!(self, "as") {
            Some(self.parse_module_export_name()?)
        } else {
            None
        };

        Ok(ExportNamedSpecifier {
            span: span!(self, start),
            orig,
            exported,
            is_type_only,
        })
    }

    /// Parses `from 'foo.js' assert {};`
    fn parse_from_clause_and_semi(&mut self) -> PResult<(Str, Option<ObjectLit>)> {
        expect!(self, "from");

        let str_start = cur_pos!(self);
        let src = match *cur!(self, true)? {
            Token::Str { .. } => match bump!(self) {
                Token::Str { value, raw, .. } => Str {
                    span: span!(self, str_start),
                    value,
                    raw: Some(raw),
                },
                _ => unreachable!(),
            },
            _ => unexpected!(self, "a string literal"),
        };
        let _ = cur!(self, false);
        let asserts = if self.input.syntax().import_assertions()
            && !self.input.had_line_break_before_cur()
            && eat!(self, "assert")
        {
            match *self.parse_object::<Box<Expr>>()? {
                Expr::Object(v) => Some(v),
                _ => unreachable!(),
            }
        } else {
            None
        };
        expect!(self, ';');
        Ok((src, asserts))
    }
}

impl IsDirective for ModuleItem {
    fn as_ref(&self) -> Option<&Stmt> {
        match *self {
            ModuleItem::Stmt(ref s) => Some(s),
            _ => None,
        }
    }
}

impl<'a, I: Tokens> StmtLikeParser<'a, ModuleItem> for Parser<I> {
    fn handle_import_export(
        &mut self,
        top_level: bool,
        decorators: Vec<Decorator>,
    ) -> PResult<ModuleItem> {
        if !top_level {
            syntax_error!(self, SyntaxError::NonTopLevelImportExport);
        }

        let decl = if is!(self, "import") {
            self.parse_import()?
        } else if is!(self, "export") {
            self.parse_export(decorators).map(ModuleItem::from)?
        } else {
            unreachable!(
                "handle_import_export should not be called if current token isn't import nor \
                 export"
            )
        };

        Ok(decl)
    }
}

#[cfg(test)]
mod tests {
    use crate::{EsConfig, Syntax};

    #[test]
    fn test_legacy_decorator() {
        crate::test_parser(
            "@foo
export default class Foo {
  bar() {
    class Baz {}
  }
}",
            Syntax::Es(EsConfig {
                decorators: true,
                decorators_before_export: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }
}
