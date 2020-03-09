use super::*;

#[parser]
impl<'a, I: Tokens> Parser<'a, I> {
    #[allow(clippy::cognitive_complexity)]
    fn parse_import(&mut self) -> PResult<'a, ModuleItem> {
        let start = cur_pos!();

        if self.input.syntax().import_meta() && peeked_is!('.') {
            let expr = self.parse_expr()?;

            eat!(';');

            return Ok(Stmt::Expr(ExprStmt {
                span: span!(start),
                expr,
            })
            .into());
        }

        if self.input.syntax().dynamic_import() && peeked_is!('(') {
            let expr = self.parse_expr()?;

            eat!(';');

            return Ok(Stmt::Expr(ExprStmt {
                span: span!(start),
                expr,
            })
            .into());
        }

        expect!("import");

        if self.input.syntax().typescript() && is!(IdentRef) && peeked_is!('=') {
            return self
                .parse_ts_import_equals_decl(start, false)
                .map(ModuleDecl::from)
                .map(ModuleItem::from);
        }

        // Handle import 'mod.js'
        let str_start = cur_pos!();
        if let Ok(&Token::Str { .. }) = cur!(false) {
            let src = match bump!() {
                Token::Str { value, has_escape } => Str {
                    span: span!(str_start),
                    value,
                    has_escape,
                },
                _ => unreachable!(),
            };
            expect!(';');
            return Ok(ModuleDecl::Import(ImportDecl {
                span: span!(start),
                src,
                specifiers: vec![],
                type_only: false,
            }))
            .map(ModuleItem::from);
        }

        let type_only = self.syntax().typescript() && eat!("type");

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
                    } else if eat!(',') && is!('}') {
                        break;
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
            type_only,
        }))
        .map(ModuleItem::from)
    }

    /// Parse `foo`, `foo2 as bar` in `import { foo, foo2 as bar }`
    fn parse_import_specifier(&mut self) -> PResult<'a, ImportSpecifier> {
        let start = cur_pos!();
        match cur!(false) {
            Ok(&Word(..)) => {
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
                Ok(ImportSpecifier::Specific(ImportSpecific {
                    span: span!(start),
                    local,
                    imported: None,
                }))
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

    #[allow(clippy::cognitive_complexity)]
    fn parse_export(&mut self, decorators: Vec<Decorator>) -> PResult<'a, ModuleDecl> {
        let start = cur_pos!();
        assert_and_bump!("export");
        let _ = cur!(true);
        let after_export_start = cur_pos!();

        // "export declare" is equivalent to just "export".
        let declare = self.input.syntax().typescript() && eat!("declare");

        if declare {
            // TODO: Remove
            if let Some(decl) = self.try_parse_ts_declare(after_export_start, decorators.clone())? {
                return Ok(ModuleDecl::ExportDecl(ExportDecl {
                    span: span!(start),
                    decl,
                }));
            }
        }

        if self.input.syntax().typescript() && is!(IdentName) {
            let sym = match *cur!(true)? {
                Token::Word(ref w) => w.clone().into(),
                _ => unreachable!(),
            };
            // TODO: remove clone
            if let Some(decl) = self.try_parse_ts_export_decl(decorators.clone(), sym) {
                return Ok(ModuleDecl::ExportDecl(ExportDecl {
                    span: span!(start),
                    decl,
                }));
            }
        }

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

            if eat!("as") {
                // `export as namespace A;`
                // See `parseNamespaceExportDeclaration` in TypeScript's own parser
                expect!("namespace");
                let id = self.parse_ident(false, false)?;
                expect!(';');
                return Ok(TsNamespaceExportDecl {
                    span: span!(start),
                    id,
                }
                .into());
            }
        }

        let mut has_star = false;
        let mut export_ns = None;
        let ns_export_specifier_start = cur_pos!();

        if eat!('*') {
            has_star = true;
            if is!("from") {
                let src = self.parse_from_clause_and_semi()?;
                return Ok(ModuleDecl::ExportAll(ExportAll {
                    span: span!(start),
                    src,
                }));
            }
            if eat!("as") {
                if !self.input.syntax().export_namespace_from() {
                    syntax_error!(span!(start), SyntaxError::ExportNamespaceFrom)
                }
                let _ = cur!(false);

                let name = self.parse_ident_name()?;
                export_ns = Some(ExportSpecifier::Namespace(NamespaceExportSpecifier {
                    span: span!(ns_export_specifier_start),
                    name,
                }));
            }
        }

        let type_only = self.input.syntax().typescript() && eat!("type");

        // Some("default") if default is exported from 'src'
        let mut export_default = None;

        if !type_only && export_ns.is_none() && eat!("default") {
            if self.input.syntax().typescript() {
                if is!("abstract") && peeked_is!("class") {
                    let class_start = cur_pos!();
                    assert_and_bump!("abstract");
                    let _ = cur!(true);

                    let mut class = self.parse_default_class(start, class_start, decorators)?;
                    match class {
                        ExportDefaultDecl {
                            decl: DefaultDecl::Class(ClassExpr { ref mut class, .. }),
                            ..
                        } => class.is_abstract = true,
                        _ => unreachable!(),
                    }
                    return Ok(class.into());
                }
                if is!("abstract") && peeked_is!("interface") {
                    self.emit_err(self.input.cur_span(), SyntaxError::TS1242);
                    assert_and_bump!("abstract");
                }

                if is!("interface") {
                    let interface_start = cur_pos!();
                    assert_and_bump!("interface");
                    let decl = self
                        .parse_ts_interface_decl(interface_start)
                        .map(DefaultDecl::from)?;
                    return Ok(ExportDefaultDecl {
                        span: span!(start),
                        decl,
                    }
                    .into());
                }
            }

            if is!("class") {
                let class_start = cur_pos!();
                let decl = self.parse_default_class(start, class_start, decorators)?;
                return Ok(ModuleDecl::ExportDefaultDecl(decl));
            } else if is!("async")
                && peeked_is!("function")
                && !self.input.has_linebreak_between_cur_and_peeked()
            {
                let decl = self.parse_default_async_fn(decorators)?;
                return Ok(ModuleDecl::ExportDefaultDecl(decl));
            } else if is!("function") {
                let decl = self.parse_default_fn(decorators)?;
                return Ok(ModuleDecl::ExportDefaultDecl(decl));
            } else if self.input.syntax().export_default_from()
                && (is!("from") || (is!(',') && peeked_is!('{')))
            {
                export_default = Some(Ident::new(
                    "default".into(),
                    make_span(self.input.prev_span()),
                ))
            } else {
                let expr = self.include_in_expr(true).parse_assignment_expr()?;
                expect!(';');
                return Ok(ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                    span: span!(start),
                    expr,
                }));
            }
        }

        let decl = if !type_only && is!("class") {
            let class_start = cur_pos!();
            self.parse_class_decl(start, class_start, decorators)?
        } else if !type_only
            && is!("async")
            && peeked_is!("function")
            && !self.input.has_linebreak_between_cur_and_peeked()
        {
            self.parse_async_fn_decl(decorators)?
        } else if !type_only && is!("function") {
            self.parse_fn_decl(decorators)?
        } else if !type_only
            && self.input.syntax().typescript()
            && is!("const")
            && peeked_is!("enum")
        {
            let start = cur_pos!();
            assert_and_bump!("const");
            let _ = cur!(true);
            assert_and_bump!("enum");
            return self
                .parse_ts_enum_decl(start, /* is_const */ true)
                .map(Decl::from)
                .map(|decl| {
                    ModuleDecl::ExportDecl(ExportDecl {
                        span: span!(start),
                        decl,
                    })
                });
        } else if !type_only
            && (is!("var")
                || is!("const")
                || (is!("let"))
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

            if is!("from") {
                if let Some(s) = export_ns {
                    let src = self.parse_from_clause_and_semi()?;
                    return Ok(ModuleDecl::ExportNamed(NamedExport {
                        span: Span::new(start, src.span.hi(), Default::default()),
                        specifiers: vec![s],
                        src: Some(src),
                        type_only,
                    }));
                }
            }

            let default = match export_default {
                Some(default) => Some(default),
                None => {
                    if self.input.syntax().export_default_from() && is!(IdentName) {
                        Some(self.parse_ident(false, false)?)
                    } else {
                        None
                    }
                }
            };

            if is!("from") {
                if let Some(default) = default {
                    let src = self.parse_from_clause_and_semi()?;
                    return Ok(ModuleDecl::ExportNamed(NamedExport {
                        span: Span::new(start, src.span.hi(), Default::default()),
                        specifiers: vec![ExportSpecifier::Default(DefaultExportSpecifier {
                            exported: default,
                        })],
                        src: Some(src),
                        type_only,
                    }));
                }
            }

            if has_star && export_ns.is_none() {
                // improve error message for `export * from foo`
                let src = self.parse_from_clause_and_semi()?;
                return Ok(ModuleDecl::ExportAll(ExportAll {
                    span: Span::new(start, src.span.hi(), Default::default()),
                    src,
                }));
            }

            let has_ns = export_ns.is_some();
            let has_default = default.is_some();
            if has_ns || has_default {
                expect!(',')
            }

            expect!('{');
            let mut specifiers = vec![];
            if let Some(s) = export_ns {
                specifiers.push(s)
            }
            if let Some(default) = default {
                specifiers.push(ExportSpecifier::Default(DefaultExportSpecifier {
                    exported: default,
                }))
            }
            let mut first = true;
            while is_one_of!(',', IdentName) {
                if first {
                    first = false;
                } else if eat!(',') && is!('}') {
                    break;
                }

                specifiers.push(
                    self.parse_named_export_specifier()
                        .map(ExportSpecifier::Named)?,
                );
            }
            expect!('}');

            let src = if is!("from") {
                Some(self.parse_from_clause_and_semi()?)
            } else {
                eat!(';');
                if has_default || has_ns {
                    syntax_error!(span!(start), SyntaxError::ExportDefaultWithOutFrom);
                }
                None
            };
            return Ok(ModuleDecl::ExportNamed(NamedExport {
                span: span!(start),
                specifiers,
                src,
                type_only,
            }));
        };

        Ok(ModuleDecl::ExportDecl(ExportDecl {
            span: span!(start),
            decl,
        }))
    }

    fn parse_named_export_specifier(&mut self) -> PResult<'a, NamedExportSpecifier> {
        let start = cur_pos!();

        let orig = self.parse_ident_name()?;

        let exported = if eat!("as") {
            Some(self.parse_ident_name()?)
        } else {
            None
        };

        Ok(NamedExportSpecifier {
            span: span!(start),
            orig,
            exported,
        })
    }

    fn parse_from_clause_and_semi(&mut self) -> PResult<'a, Str> {
        expect!("from");

        let str_start = cur_pos!();
        let src = match *cur!(true)? {
            Token::Str { .. } => match bump!() {
                Token::Str { value, has_escape } => Str {
                    value,
                    has_escape,
                    span: span!(str_start),
                },
                _ => unreachable!(),
            },
            _ => unexpected!(),
        };
        expect!(';');
        Ok(src)
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
impl<'a, I: Tokens> StmtLikeParser<'a, ModuleItem> for Parser<'a, I> {
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
            |p| p.parse_module().map_err(|mut e| e.emit()),
        );
    }
}
