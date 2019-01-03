use super::*;

#[parser]
impl<'a, I: Input> Parser<'a, I> {
    fn parse_import(&mut self) -> PResult<'a, ModuleDecl> {
        let start = cur_pos!();
        assert_and_bump!("import");

        if self.input.syntax().typescript() {
            if is!(IdentRef) && peeked_is!('=') {
                return self
                    .parse_ts_import_equals_decl(start, false)
                    .map(From::from);
            }
        }

        // Handle import 'mod.js'
        let str_start = cur_pos!();
        match *cur!(false)? {
            Token::Str { .. } => match bump!() {
                Token::Str { value, has_escape } => {
                    expect!(';');
                    return Ok(ModuleDecl::Import(ImportDecl {
                        span: span!(start),
                        src: Str {
                            span: span!(str_start),
                            value,
                            has_escape,
                        },
                        specifiers: vec![],
                    }));
                }
                _ => unreachable!(),
            },
            _ => {}
        }

        let mut specifiers = vec![];

        if is!(BindingIdent) {
            let local = self.parse_imported_default_binding()?;
            //TODO: Better error reporting
            if !is!("from") {
                expect!(',');
            }
            specifiers.push(ImportSpecifier::Default(ImportDefault {
                span: local.span,
                local,
            }));
        }

        {
            let import_spec_start = cur_pos!();
            if eat!('*') {
                expect!("as");
                let local = self.parse_imported_binding()?;
                specifiers.push(ImportSpecifier::Namespace(ImportStarAs {
                    span: span!(import_spec_start),
                    local,
                }));
            } else if eat!('{') {
                let mut first = true;
                while !eof!() && !is!('}') {
                    if first {
                        first = false;
                    } else {
                        if eat!(',') {
                            if is!('}') {
                                break;
                            }
                        }
                    }

                    specifiers.push(self.parse_import_specifier()?);
                }
                expect!('}');
            }
        }

        let src = self.parse_from_clause_and_semi()?;

        Ok(ModuleDecl::Import(ImportDecl {
            span: span!(start),
            specifiers,
            src,
        }))
    }

    /// Parse `foo`, `foo2 as bar` in `import { foo, foo2 as bar }`
    fn parse_import_specifier(&mut self) -> PResult<'a, ImportSpecifier> {
        let start = cur_pos!();
        match *cur!(false)? {
            Word(..) => {
                let orig_name = self.parse_ident_name()?;

                if eat!("as") {
                    let local = self.parse_binding_ident()?;
                    return Ok(ImportSpecifier::Specific(ImportSpecific {
                        span: Span::new(start, local.span.hi(), Default::default()),
                        local,
                        imported: Some(orig_name),
                    }));
                }

                // Handle difference between
                //
                // 'ImportedBinding'
                // 'IdentifierName' as 'ImportedBinding'
                if self.ctx().is_reserved_word(&orig_name.sym) {
                    syntax_error!(orig_name.span, SyntaxError::ReservedWordInImport)
                }

                let local = orig_name;
                return Ok(ImportSpecifier::Specific(ImportSpecific {
                    span: span!(start),
                    local,
                    imported: None,
                }));
            }
            _ => unexpected!(),
        }
    }

    fn parse_imported_default_binding(&mut self) -> PResult<'a, Ident> {
        self.parse_imported_binding()
    }

    fn parse_imported_binding(&mut self) -> PResult<'a, Ident> {
        let ctx = Context {
            in_async: false,
            in_generator: false,
            ..self.ctx()
        };
        self.with_ctx(ctx).parse_binding_ident()
    }

    fn parse_export(&mut self, decoraters: Vec<Decorator>) -> PResult<'a, ModuleDecl> {
        let start = cur_pos!();
        assert_and_bump!("export");

        if self.input.syntax().typescript() {
            if eat!("import") {
                // export import A = B
                return self
                    .parse_ts_import_equals_decl(start, /* is_export */ true)
                    .map(From::from);
            }

            if eat!('=') {
                // `export = x;`
                let expr = self.parse_expr()?;
                expect!(';');
                return Ok(TsExportAssignment {
                    span: span!(start),
                    expr,
                }
                .into());
            }
        }

        if eat!('*') {
            let src = self.parse_from_clause_and_semi()?;
            return Ok(ModuleDecl::ExportAll(ExportAll {
                span: span!(start),
                src,
            }));
        }

        if eat!("default") {
            let decl = if is!("class") {
                self.parse_default_class(decoraters)?
            } else if is!("async")
                && peeked_is!("function")
                && !self.input.has_linebreak_between_cur_and_peeked()
            {
                self.parse_default_async_fn(decoraters)?
            } else if is!("function") {
                self.parse_default_fn(decoraters)?
            } else {
                let expr = self.include_in_expr(true).parse_assignment_expr()?;
                expect!(';');
                return Ok(ModuleDecl::ExportDefaultExpr(expr));
            };

            return Ok(ModuleDecl::ExportDefaultDecl(decl));
        }

        let decl = if is!("class") {
            self.parse_class_decl(decoraters)?
        } else if is!("async")
            && peeked_is!("function")
            && !self.input.has_linebreak_between_cur_and_peeked()
        {
            self.parse_async_fn_decl(decoraters)?
        } else if is!("function") {
            self.parse_fn_decl(decoraters)?
        } else if is!("var")
            || is!("const")
            || (is!("let")
                && peek!()
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

            expect!('{');
            let mut specifiers = vec![];
            let mut first = true;
            while is_one_of!(',', IdentName) {
                if first {
                    first = false;
                } else {
                    if eat!(',') {
                        if is!('}') {
                            break;
                        }
                    }
                }

                specifiers.push(self.parse_export_specifier()?);
            }
            expect!('}');

            let src = if is!("from") {
                Some(self.parse_from_clause_and_semi()?)
            } else {
                None
            };
            eat!(';');
            return Ok(ModuleDecl::ExportNamed(NamedExport {
                span: span!(start),
                specifiers,
                src,
            }));
        };

        return Ok(ModuleDecl::ExportDecl(decl));
    }

    fn parse_export_specifier(&mut self) -> PResult<'a, ExportSpecifier> {
        let start = cur_pos!();

        let orig = self.parse_ident_name()?;

        let exported = if eat!("as") {
            Some(self.parse_ident_name()?)
        } else {
            None
        };

        Ok(ExportSpecifier {
            span: span!(start),
            orig,
            exported,
        })
    }

    fn parse_from_clause_and_semi(&mut self) -> PResult<'a, Str> {
        expect!("from");

        let start = cur_pos!();
        match *cur!(true)? {
            Token::Str { .. } => match bump!() {
                Token::Str { value, has_escape } => {
                    expect!(';');
                    Ok(Str {
                        value,
                        has_escape,
                        span: span!(start),
                    })
                }
                _ => unreachable!(),
            },
            _ => unexpected!(),
        }
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

#[parser]
impl<'a, I: Input> StmtLikeParser<'a, ModuleItem> for Parser<'a, I> {
    fn handle_import_export(
        &mut self,
        top_level: bool,
        decorators: Vec<Decorator>,
    ) -> PResult<'a, ModuleItem> {
        if !top_level {
            syntax_error!(SyntaxError::NonTopLevelImportExport);
        }

        let start = cur_pos!();
        let decl = if is!("import") {
            self.parse_import()?
        } else if is!("export") {
            self.parse_export(decorators)?
        } else {
            unreachable!(
                "handle_import_export should not be called if current token isn't import nor \
                 export"
            )
        };

        Ok(ModuleItem::ModuleDecl(decl))
    }
}
