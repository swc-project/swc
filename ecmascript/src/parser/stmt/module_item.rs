use super::*;

#[parser]
impl<I: Input> Parser<I> {
    fn parse_import(&mut self) -> PResult<ModuleItem> {
        let start = cur_pos!();
        assert_and_bump!("import");

        // Handle import 'mod.js'
        match *cur!()? {
            Str(..) => match bump!() {
                Str(src, _) => {
                    expect!(';');
                    return Ok(ModuleItem::ModuleDecl(ModuleDecl {
                        span: span!(start),
                        node: ModuleDeclKind::Import {
                            src,
                            specifiers: vec![],
                        },
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
                while !is!('}') {
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

        expect!("from");
        let src = match *cur!()? {
            Str(..) => match bump!() {
                Str(src, _) => {
                    expect!(';');
                    src
                }
                _ => unreachable!(),
            },
            _ => unexpected!(),
        };

        Ok(ModuleItem::ModuleDecl(ModuleDecl {
            span: span!(start),
            node: ModuleDeclKind::Import { specifiers, src },
        }))
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

    fn parse_export(&mut self) -> PResult<ModuleItem> {
        unimplemented!("parse_export")
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

        if is!("import") {
            self.parse_import()
        } else {
            self.parse_export()
        }
    }
}
