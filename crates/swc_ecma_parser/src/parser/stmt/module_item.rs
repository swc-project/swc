use super::*;

impl<I: Tokens> Parser<I> {
    fn parse_import(&mut self) -> PResult<ModuleItem> {
        let start = cur_pos!(self);

        if peeked_is!(self, '.') {
            let expr = self.parse_expr()?;

            eat!(self, ';');

            return Ok(ExprStmt {
                span: span!(self, start),
                expr,
            }
            .into());
        }

        if peeked_is!(self, '(') {
            let expr = self.parse_expr()?;

            eat!(self, ';');

            return Ok(ExprStmt {
                span: span!(self, start),
                expr,
            }
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

        // Handle import 'mod.js'
        let str_start = cur_pos!(self);
        if let Ok(&Token::Str { .. }) = cur!(self, false) {
            let src = match bump!(self) {
                Token::Str { value, raw, .. } => Box::new(Str {
                    span: span!(self, str_start),
                    value,
                    raw: Some(raw),
                }),
                _ => unreachable!(),
            };
            let _ = cur!(self, false);
            let with = if self.input.syntax().import_attributes()
                && !self.input.had_line_break_before_cur()
                && (eat!(self, "assert") || eat!(self, "with"))
            {
                match *self.parse_object::<Box<Expr>>()? {
                    Expr::Object(v) => Some(Box::new(v)),
                    _ => unreachable!(),
                }
            } else {
                None
            };
            expect!(self, ';');
            return Ok(ImportDecl {
                span: span!(self, start),
                src,
                specifiers: Vec::new(),
                type_only: false,
                with,
                phase: Default::default(),
            }
            .into());
        }

        let mut type_only = false;
        let mut phase = ImportPhase::Evaluation;
        let mut specifiers = Vec::new();

        'import_maybe_ident: {
            if is!(self, BindingIdent) {
                let mut local = self.parse_imported_default_binding()?;

                if self.input.syntax().typescript() && local.sym == "type" {
                    if is_one_of!(self, '*', '{') {
                        type_only = true;
                        break 'import_maybe_ident;
                    }

                    if is!(self, BindingIdent) {
                        if !is!(self, "from") || peeked_is!(self, "from") {
                            type_only = true;
                            local = self.parse_imported_default_binding()?;
                        } else if peeked_is!(self, '=') {
                            type_only = true;
                            local = self.parse_ident_name().map(From::from)?;
                        }
                    }
                }

                if self.input.syntax().typescript() && is!(self, '=') {
                    return self
                        .parse_ts_import_equals_decl(start, local, false, type_only)
                        .map(ModuleDecl::from)
                        .map(ModuleItem::from);
                }

                if matches!(&*local.sym, "source" | "defer") {
                    let new_phase = match &*local.sym {
                        "source" => ImportPhase::Source,
                        "defer" => ImportPhase::Defer,
                        _ => unreachable!(),
                    };

                    if is_one_of!(self, '*', '{') {
                        phase = new_phase;
                        break 'import_maybe_ident;
                    }

                    if is!(self, BindingIdent) && !is!(self, "from") || peeked_is!(self, "from") {
                        phase = new_phase;
                        local = self.parse_imported_default_binding()?;
                    }
                }

                //TODO: Better error reporting
                if !is!(self, "from") {
                    expect!(self, ',');
                }
                specifiers.push(ImportSpecifier::Default(ImportDefaultSpecifier {
                    span: local.span,
                    local,
                }));
            }
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

            match *cur!(self, true) {
                Token::Str { .. } => match bump!(self) {
                    Token::Str { value, raw, .. } => Box::new(Str {
                        span: span!(self, str_start),
                        value,
                        raw: Some(raw),
                    }),
                    _ => unreachable!(),
                },
                _ => unexpected!(self, "a string literal"),
            }
        };

        let _ = cur!(self, false);
        let with = if self.input.syntax().import_attributes()
            && !self.input.had_line_break_before_cur()
            && (eat!(self, "assert") || eat!(self, "with"))
        {
            match *self.parse_object::<Box<Expr>>()? {
                Expr::Object(v) => Some(Box::new(v)),
                _ => unreachable!(),
            }
        } else {
            None
        };

        expect!(self, ';');

        Ok(ImportDecl {
            span: span!(self, start),
            specifiers,
            src,
            type_only,
            with,
            phase,
        }
        .into())
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
                if self.syntax().typescript() && orig_name.sym == "type" && is!(self, IdentName) {
                    let possibly_orig_name = self.parse_ident_name().map(Ident::from)?;
                    if possibly_orig_name.sym == "as" {
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

                        let maybe_as: Ident = self.parse_binding_ident(false)?.into();
                        if maybe_as.sym == "as" {
                            if is!(self, IdentName) {
                                // `import { type as as as } from 'mod'`
                                // `import { type as as foo } from 'mod'`
                                let local: Ident = self.parse_binding_ident(false)?.into();

                                if type_only {
                                    self.emit_err(orig_name.span, SyntaxError::TS2206);
                                }

                                return Ok(ImportSpecifier::Named(ImportNamedSpecifier {
                                    span: Span::new(start, orig_name.span.hi()),
                                    local,
                                    imported: Some(ModuleExportName::Ident(possibly_orig_name)),
                                    is_type_only: true,
                                }));
                            } else {
                                // `import { type as as } from 'mod'`
                                return Ok(ImportSpecifier::Named(ImportNamedSpecifier {
                                    span: Span::new(start, maybe_as.span.hi()),
                                    local: maybe_as,
                                    imported: Some(ModuleExportName::Ident(orig_name)),
                                    is_type_only: false,
                                }));
                            }
                        } else {
                            // `import { type as xxx } from 'mod'`
                            return Ok(ImportSpecifier::Named(ImportNamedSpecifier {
                                span: Span::new(start, orig_name.span.hi()),
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
                    let local: Ident = self.parse_binding_ident(false)?.into();
                    return Ok(ImportSpecifier::Named(ImportNamedSpecifier {
                        span: Span::new(start, local.span.hi()),
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
                    let local: Ident = self.parse_binding_ident(false)?.into();
                    Ok(ImportSpecifier::Named(ImportNamedSpecifier {
                        span: Span::new(start, local.span.hi()),
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
        Ok(self.with_ctx(ctx).parse_binding_ident(false)?.into())
    }

    fn parse_export(&mut self, mut decorators: Vec<Decorator>) -> PResult<ModuleDecl> {
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
                return Ok(ExportDecl {
                    span: span!(self, start),
                    decl,
                }
                .into());
            }
        }

        if self.input.syntax().typescript() && is!(self, IdentName) {
            let sym = match *cur!(self, true) {
                Token::Word(ref w) => w.clone().into(),
                _ => unreachable!(),
            };
            // TODO: remove clone
            if let Some(decl) = self.try_parse_ts_export_decl(decorators.clone(), sym) {
                return Ok(ExportDecl {
                    span: span!(self, start),
                    decl,
                }
                .into());
            }
        }

        if self.input.syntax().typescript() {
            if eat!(self, "import") {
                let is_type_only = is!(self, "type") && peeked_is!(self, IdentRef);

                if is_type_only {
                    assert_and_bump!(self, "type");
                }

                let id = self.parse_ident_name()?;

                // export import A = B
                return self
                    .parse_ts_import_equals_decl(
                        start,
                        id.into(),
                        /* is_export */ true,
                        is_type_only,
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

        let ns_export_specifier_start = cur_pos!(self);

        let type_only = self.input.syntax().typescript() && eat!(self, "type");

        // Some("default") if default is exported from 'src'
        let mut export_default = None;

        if !type_only && eat!(self, "default") {
            if is!(self, '@') {
                let start = cur_pos!(self);
                let after_decorators = self.parse_decorators(false)?;

                if !decorators.is_empty() {
                    syntax_error!(self, span!(self, start), SyntaxError::TS8038);
                }

                decorators = after_decorators;
            }

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
                return Ok(decl.into());
            } else if is!(self, "async")
                && peeked_is!(self, "function")
                && !self.input.has_linebreak_between_cur_and_peeked()
            {
                let decl = self.parse_default_async_fn(start, decorators)?;
                return Ok(decl.into());
            } else if is!(self, "function") {
                let decl = self.parse_default_fn(start, decorators)?;
                return Ok(decl.into());
            } else if self.input.syntax().export_default_from()
                && (is!(self, "from")
                    || (is!(self, ',') && (peeked_is!(self, '{') || peeked_is!(self, '*'))))
            {
                export_default = Some(Ident::new_no_ctxt("default".into(), self.input.prev_span()))
            } else {
                let expr = self.include_in_expr(true).parse_assignment_expr()?;
                expect!(self, ';');
                return Ok(ExportDefaultExpr {
                    span: span!(self, start),
                    expr,
                }
                .into());
            }
        }

        if is!(self, '@') {
            let start = cur_pos!(self);
            let after_decorators = self.parse_decorators(false)?;

            if !decorators.is_empty() {
                syntax_error!(self, span!(self, start), SyntaxError::TS8038);
            }

            decorators = after_decorators;
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
                    ExportDecl {
                        span: span!(self, start),
                        decl,
                    }
                    .into()
                });
        } else if !type_only
            && (is!(self, "var")
                || is!(self, "const")
                || (is!(self, "let"))
                    && peek!(self)
                        .map(|t| {
                            // module code is always in strict mode.
                            t.kind().follows_keyword_let(true)
                        })
                        .unwrap_or(false))
        {
            self.parse_var_stmt(false).map(Decl::Var)?
        } else {
            // ```javascript
            // export foo, * as bar, { baz } from "mod"; // *
            // export      * as bar, { baz } from "mod"; // *
            // export foo,           { baz } from "mod"; // *
            // export foo, * as bar          from "mod"; // *
            // export foo                    from "mod"; // *
            // export      * as bar          from "mod"; //
            // export                { baz } from "mod"; //
            // export                { baz }           ; //
            // export      *                 from "mod"; //
            // ```

            // export default
            // export foo
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

            if default.is_none() && is!(self, '*') && !peeked_is!(self, "as") {
                assert_and_bump!(self, '*');

                // improve error message for `export * from foo`
                let (src, with) = self.parse_from_clause_and_semi()?;
                return Ok(ExportAll {
                    span: span!(self, start),
                    src,
                    type_only,
                    with,
                }
                .into());
            }

            let mut specifiers = Vec::new();

            let mut has_default = false;
            let mut has_ns = false;

            if let Some(default) = default {
                has_default = true;

                specifiers.push(ExportSpecifier::Default(ExportDefaultSpecifier {
                    exported: default,
                }))
            }

            // export foo, * as bar
            //           ^
            if !specifiers.is_empty() && is!(self, ',') && peeked_is!(self, '*') {
                assert_and_bump!(self, ',');

                has_ns = true;
            }
            // export     * as bar
            //            ^
            else if specifiers.is_empty() && is!(self, '*') {
                has_ns = true;
            }

            if has_ns {
                assert_and_bump!(self, '*');
                expect!(self, "as");
                let name = self.parse_module_export_name()?;
                specifiers.push(ExportSpecifier::Namespace(ExportNamespaceSpecifier {
                    span: span!(self, ns_export_specifier_start),
                    name,
                }));
            }

            if has_default || has_ns {
                if is!(self, "from") {
                    let (src, with) = self.parse_from_clause_and_semi()?;
                    return Ok(NamedExport {
                        span: span!(self, start),
                        specifiers,
                        src: Some(src),
                        type_only,
                        with,
                    }
                    .into());
                } else if !self.input.syntax().export_default_from() {
                    // emit error
                    expect!(self, "from");
                }

                expect!(self, ',');
            }

            expect!(self, '{');

            while !eof!(self) && !is!(self, '}') {
                let specifier = self.parse_named_export_specifier(type_only)?;
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
                for s in &specifiers {
                    match s {
                        ExportSpecifier::Default(default) => {
                            self.emit_err(
                                default.exported.span,
                                SyntaxError::ExportExpectFrom(default.exported.sym.clone()),
                            );
                        }
                        ExportSpecifier::Namespace(namespace) => {
                            let export_name = match &namespace.name {
                                ModuleExportName::Ident(i) => i.sym.clone(),
                                ModuleExportName::Str(s) => s.value.clone(),
                            };
                            self.emit_err(
                                namespace.span,
                                SyntaxError::ExportExpectFrom(export_name),
                            );
                        }
                        ExportSpecifier::Named(named) => match &named.orig {
                            ModuleExportName::Ident(id) if id.is_reserved() => {
                                self.emit_err(
                                    id.span,
                                    SyntaxError::ExportExpectFrom(id.sym.clone()),
                                );
                            }
                            ModuleExportName::Str(s) => {
                                self.emit_err(s.span, SyntaxError::ExportBindingIsString);
                            }
                            _ => {}
                        },
                    }
                }

                eat!(self, ';');

                None
            };
            let (src, with) = match opt {
                Some(v) => (Some(v.0), v.1),
                None => (None, None),
            };
            return Ok(NamedExport {
                span: span!(self, start),
                specifiers,
                src,
                type_only,
                with,
            }
            .into());
        };

        Ok(ExportDecl {
            span: span!(self, start),
            decl,
        }
        .into())
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
                if self.syntax().typescript() && orig_ident.sym == "type" && is!(self, IdentName) {
                    let possibly_orig = self.parse_ident_name().map(Ident::from)?;
                    if possibly_orig.sym == "as" {
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

                        let maybe_as = self.parse_ident_name().map(Ident::from)?;
                        if maybe_as.sym == "as" {
                            if is!(self, IdentName) {
                                // `export { type as as as }`
                                // `export { type as as foo }`
                                let exported = self.parse_ident_name().map(Ident::from)?;

                                if type_only {
                                    self.emit_err(orig_ident.span, SyntaxError::TS2207);
                                }

                                return Ok(ExportNamedSpecifier {
                                    span: Span::new(start, orig_ident.span.hi()),
                                    orig: ModuleExportName::Ident(possibly_orig),
                                    exported: Some(ModuleExportName::Ident(exported)),
                                    is_type_only: true,
                                });
                            } else {
                                // `export { type as as }`
                                return Ok(ExportNamedSpecifier {
                                    span: Span::new(start, orig_ident.span.hi()),
                                    orig: ModuleExportName::Ident(orig_ident),
                                    exported: Some(ModuleExportName::Ident(maybe_as)),
                                    is_type_only: false,
                                });
                            }
                        } else {
                            // `export { type as xxx }`
                            return Ok(ExportNamedSpecifier {
                                span: Span::new(start, orig_ident.span.hi()),
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

    /// Parses `from 'foo.js' with {};` or `from 'foo.js' assert {};`
    fn parse_from_clause_and_semi(&mut self) -> PResult<(Box<Str>, Option<Box<ObjectLit>>)> {
        expect!(self, "from");

        let str_start = cur_pos!(self);
        let src = match *cur!(self, true) {
            Token::Str { .. } => match bump!(self) {
                Token::Str { value, raw, .. } => Box::new(Str {
                    span: span!(self, str_start),
                    value,
                    raw: Some(raw),
                }),
                _ => unreachable!(),
            },
            _ => unexpected!(self, "a string literal"),
        };
        let _ = cur!(self, false);
        let with = if self.input.syntax().import_attributes()
            && !self.input.had_line_break_before_cur()
            && (eat!(self, "assert") || eat!(self, "with"))
        {
            match *self.parse_object::<Box<Expr>>()? {
                Expr::Object(v) => Some(Box::new(v)),
                _ => unreachable!(),
            }
        } else {
            None
        };
        expect!(self, ';');
        Ok((src, with))
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

impl<I: Tokens> StmtLikeParser<'_, ModuleItem> for Parser<I> {
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
    use crate::{EsSyntax, Syntax};

    #[test]
    fn test_legacy_decorator() {
        crate::test_parser(
            "@foo
export default class Foo {
  bar() {
    class Baz {}
  }
}",
            Syntax::Es(EsSyntax {
                decorators: true,
                decorators_before_export: true,
                ..Default::default()
            }),
            |p| p.parse_module(),
        );
    }
}
