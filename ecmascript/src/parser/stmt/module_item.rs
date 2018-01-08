use super::*;

#[parser]
impl<I: Input> Parser<I> {
    fn parse_import(&mut self) -> PResult<ModuleDecl> {
        let start = cur_pos!();
        assert_and_bump!("import");

        // Handle import 'mod.js'
        match *cur!()? {
            Str(..) => match bump!() {
                Str(src, _) => {
                    expect!(';');
                    return Ok(ModuleDecl {
                        span: span!(start),
                        node: ModuleDeclKind::Import {
                            src,
                            specifiers: vec![],
                        },
                    });
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
            specifiers.push(ImportSpecifier {
                span: local.span,
                local,
                node: ImportSpecifierKind::Default,
            });
        }

        {
            let import_spec_start = cur_pos!();
            if eat!('*') {
                expect!("as");
                let local = self.parse_imported_binding()?;
                specifiers.push(ImportSpecifier {
                    span: span!(import_spec_start),
                    local,
                    node: ImportSpecifierKind::Namespace,
                });
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

        if specifiers.is_empty() {
            unexpected!();
        }

        let src = self.parse_from_clause_and_semi()?;

        Ok(ModuleDecl {
            span: span!(start),
            node: ModuleDeclKind::Import { specifiers, src },
        })
    }

    /// Parse `foo`, `foo2 as bar` in `import { foo, foo2 as bar }`
    fn parse_import_specifier(&mut self) -> PResult<ImportSpecifier> {
        let start = cur_pos!();
        match *cur!()? {
            Word(..) => {
                let orig_name = self.parse_ident_name()?;

                if eat!("as") {
                    let local = self.parse_binding_ident()?;
                    return Ok(ImportSpecifier {
                        span: Span {
                            start,
                            end: local.span.end,
                        },
                        local,
                        node: ImportSpecifierKind::Specific {
                            imported: Some(orig_name),
                        },
                    });
                }

                // TODO: Check if it's binding ident.
                let local = orig_name;
                return Ok(ImportSpecifier {
                    span: span!(start),
                    local,
                    node: ImportSpecifierKind::Specific { imported: None },
                });
            }
            _ => unexpected!(),
        }
    }

    fn parse_imported_default_binding(&mut self) -> PResult<Ident> {
        self.parse_imported_binding()
    }

    fn parse_imported_binding(&mut self) -> PResult<Ident> {
        self.with_ctx(Context {
            in_async: false,
            in_generator: false,
            ..self.ctx
        }).parse_binding_ident()
    }

    fn parse_export(&mut self) -> PResult<ModuleDecl> {
        let start = cur_pos!();
        assert_and_bump!("export");

        if eat!('*') {
            let src = self.parse_from_clause_and_semi()?;
            return Ok(ModuleDecl {
                span: span!(start),
                node: ModuleDeclKind::ExportAll { src },
            });
        }

        if eat!("default") {
            let decl = if is!("class") {
                self.parse_default_class()?
            } else if is!("async") && peeked_is!("function")
                && !self.input.has_linebreak_between_cur_and_peeked()
            {
                self.parse_default_async_fn()?
            } else if is!("function") {
                self.parse_default_fn()?
            } else {
                let expr = self.include_in_expr(true).parse_assignment_expr()?;
                expect!(';');
                return Ok(ModuleDecl {
                    span: span!(start),
                    node: ModuleDeclKind::ExportDefaultExpr(expr),
                });
            };

            return Ok(ModuleDecl {
                span: span!(start),
                node: ModuleDeclKind::ExportDefaultDecl(decl),
            });
        }

        let decl = if is!("class") {
            self.parse_class_decl()?
        } else if is!("async") && peeked_is!("function")
            && !self.input.has_linebreak_between_cur_and_peeked()
        {
            self.parse_async_fn_decl()?
        } else if is!("function") {
            self.parse_fn_decl()?
        } else if is!("var") || is!("const")
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
            return Ok(ModuleDecl {
                span: span!(start),
                node: ModuleDeclKind::ExportNamed { specifiers, src },
            });
        };

        return Ok(ModuleDecl {
            span: span!(start),
            node: ModuleDeclKind::ExportDecl(decl),
        });
    }

    fn parse_export_specifier(&mut self) -> PResult<ExportSpecifier> {
        let orig = self.parse_ident_name()?;

        let exported = if eat!("as") {
            Some(self.parse_ident_name()?)
        } else {
            None
        };
        Ok(ExportSpecifier { orig, exported })
    }

    fn parse_from_clause_and_semi(&mut self) -> PResult<String> {
        expect!("from");
        match *cur!()? {
            Str(..) => match bump!() {
                Str(src, _) => {
                    expect!(';');
                    Ok(src)
                }
                _ => unreachable!(),
            },
            _ => unexpected!(),
        }
    }
}

#[parser]
impl<I: Input> StmtLikeParser<ModuleItem> for Parser<I> {
    fn accept_import_export() -> bool {
        true
    }

    fn handle_import_export(&mut self, top_level: bool) -> PResult<ModuleItem> {
        if !top_level {
            syntax_error!(SyntaxError::NonTopLevelImportExport);
        }

        let start = cur_pos!();
        let decl = if is!("import") {
            self.parse_import()?
        } else if is!("export") {
            self.parse_export()?
        } else {
            unreachable!("handle_import_export should not be called if current token isn't import nor export")
        };

        Ok(ModuleItem::ModuleDecl(decl))
    }
}
