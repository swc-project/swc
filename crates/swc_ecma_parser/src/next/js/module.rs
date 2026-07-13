//! ECMAScript module declarations built directly as SWC AST nodes.

use swc_atoms::{Atom, Wtf8Atom};
use swc_common::{Span, Spanned};
#[cfg(feature = "flow")]
use swc_ecma_ast::FnExpr;
use swc_ecma_ast::{
    Decl, DefaultDecl, ExportAll, ExportDecl, ExportDefaultDecl, ExportDefaultExpr,
    ExportNamedSpecifier, ExportNamespaceSpecifier, ExportSpecifier, Expr, Ident, ImportDecl,
    ImportDefaultSpecifier, ImportNamedSpecifier, ImportPhase, ImportSpecifier,
    ImportStarAsSpecifier, Module, ModuleDecl, ModuleExportName, ModuleItem, NamedExport,
    ObjectLit, Pat, Stmt, Str, TsExportAssignment, TsExternalModuleRef, TsImportEqualsDecl,
    TsModuleRef, TsNamespaceExportDecl,
};

use crate::{
    error::Error,
    next::{
        lexer::{config::Config, TokenKind as Kind},
        parser::cursor::Parser,
    },
};

impl<C: Config> Parser<'_, C> {
    /// Parse an ECMAScript module body.
    pub(crate) fn parse_module(&mut self) -> Result<Module, Error> {
        let start = self.token().start();
        let shebang = if self.at(Kind::Shebang) {
            let source = self.token_source(self.token());
            let value = source.strip_prefix("#!").unwrap_or(source).into();
            self.advance();
            Some(value)
        } else {
            None
        };
        let mut body = Vec::with_capacity(8);
        let mut strict = false;
        while !self.at(Kind::Eof) {
            body.push(match self.kind() {
                Kind::Import
                    if !self.lookahead(|parser| {
                        parser.advance();
                        matches!(parser.kind(), Kind::Dot | Kind::LParen)
                    }) =>
                {
                    ModuleItem::ModuleDecl(self.parse_import_declaration()?)
                }
                Kind::Export => ModuleItem::ModuleDecl(self.parse_export_declaration()?),
                #[cfg(feature = "flow")]
                Kind::Declare
                    if self
                        .context()
                        .contains(crate::next::parser::context::Context::FLOW)
                        && self.lookahead(|parser| {
                            parser.advance();
                            parser.at(Kind::Export)
                        }) =>
                {
                    ModuleItem::Stmt(self.parse_ts_declare_statement()?)
                }
                Kind::At => {
                    let start = self.token().start();
                    let decorators = self.parse_decorators()?;
                    if self.at(Kind::Export) {
                        let mut declaration = self.parse_export_declaration()?;
                        match &mut declaration {
                            ModuleDecl::ExportDecl(ExportDecl {
                                decl: Decl::Class(class),
                                ..
                            }) => {
                                if !class.class.decorators.is_empty()
                                    && !self
                                        .context()
                                        .contains(crate::next::parser::context::Context::FLOW)
                                {
                                    self.emit_error(Error::new(
                                        class.class.decorators[0].span,
                                        crate::error::SyntaxError::Expected(
                                            "one decorator position around export".into(),
                                            "decorators on both sides of export".into(),
                                        ),
                                    ));
                                }
                                class.class.span =
                                    Span::new_with_checked(start, class.class.span.hi);
                                let mut leading = decorators;
                                leading.append(&mut class.class.decorators);
                                class.class.decorators = leading;
                            }
                            ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                                decl: DefaultDecl::Class(class),
                                ..
                            }) => {
                                if !class.class.decorators.is_empty()
                                    && !self
                                        .context()
                                        .contains(crate::next::parser::context::Context::FLOW)
                                {
                                    self.emit_error(Error::new(
                                        class.class.decorators[0].span,
                                        crate::error::SyntaxError::Expected(
                                            "one decorator position around export".into(),
                                            "decorators on both sides of export".into(),
                                        ),
                                    ));
                                }
                                class.class.span =
                                    Span::new_with_checked(start, class.class.span.hi);
                                let mut leading = decorators;
                                leading.append(&mut class.class.decorators);
                                class.class.decorators = leading;
                            }
                            _ => return Err(self.expected_error(Kind::Class)),
                        }
                        ModuleItem::ModuleDecl(declaration)
                    } else {
                        let mut statement = self.parse_statement()?;
                        let Stmt::Decl(Decl::Class(class)) = &mut statement else {
                            return Err(self.expected_error(Kind::Class));
                        };
                        if class.declare {
                            self.emit_error(Error::new(
                                class.class.span,
                                crate::error::SyntaxError::Unexpected {
                                    got: "decorated declare class".into(),
                                    expected: "non-ambient decorated class",
                                },
                            ));
                        }
                        class.class.span = Span::new_with_checked(start, class.class.span.hi);
                        class.class.decorators = decorators;
                        ModuleItem::Stmt(statement)
                    }
                }
                _ => ModuleItem::Stmt(self.with_context(
                    if strict {
                        crate::next::parser::context::Context::STRICT
                    } else {
                        crate::next::parser::context::Context::empty()
                    },
                    crate::next::parser::context::Context::empty(),
                    Self::parse_statement,
                )?),
            });
            strict |= matches!(body.last(), Some(ModuleItem::Stmt(Stmt::Expr(expression))) if matches!(&*expression.expr, Expr::Lit(swc_ecma_ast::Lit::Str(value)) if &*value.value == "use strict"));
        }
        self.validate_duplicate_exports(&body);
        Ok(Module {
            span: Span::new_with_checked(start, self.token().end()),
            body,
            shebang,
        })
    }

    fn validate_duplicate_exports(&mut self, body: &[ModuleItem]) {
        let mut exports = Vec::<(Atom, Span)>::with_capacity(8);
        let mut candidates = Vec::<(Atom, Span)>::with_capacity(4);
        for item in body {
            candidates.clear();
            let ModuleItem::ModuleDecl(declaration) = item else {
                continue;
            };
            match declaration {
                ModuleDecl::ExportDecl(export) => match &export.decl {
                    Decl::Var(variable) => {
                        for declarator in &variable.decls {
                            collect_export_pattern_names(&declarator.name, &mut candidates);
                        }
                    }
                    Decl::Fn(function) => {
                        candidates.push((function.ident.sym.clone(), function.ident.span));
                    }
                    Decl::Class(class) => {
                        candidates.push((class.ident.sym.clone(), class.ident.span));
                    }
                    _ => {}
                },
                ModuleDecl::ExportNamed(export) => {
                    for specifier in &export.specifiers {
                        match specifier {
                            ExportSpecifier::Named(named) => {
                                let name = named.exported.as_ref().unwrap_or(&named.orig);
                                candidates.push((name.atom().into_owned(), name.span()));
                            }
                            ExportSpecifier::Namespace(namespace) => candidates
                                .push((namespace.name.atom().into_owned(), namespace.name.span())),
                            ExportSpecifier::Default(default) => candidates
                                .push((default.exported.sym.clone(), default.exported.span)),
                        }
                    }
                }
                ModuleDecl::ExportDefaultDecl(default) => {
                    candidates.push(("default".into(), default.span));
                }
                ModuleDecl::ExportDefaultExpr(default) => {
                    candidates.push(("default".into(), default.span));
                }
                _ => {}
            }
            for (name, span) in candidates.drain(..) {
                if exports.iter().any(|(previous, _)| previous == &name) {
                    self.emit_error(Error::new(
                        span,
                        crate::error::SyntaxError::Unexpected {
                            got: name.to_string(),
                            expected: "unique module export name",
                        },
                    ));
                } else {
                    exports.push((name, span));
                }
            }
        }
    }

    pub(crate) fn parse_import_declaration(&mut self) -> Result<ModuleDecl, Error> {
        let start = self.token().start();
        self.advance();
        if self
            .context()
            .contains(crate::next::parser::context::Context::TYPESCRIPT)
            && self.lookahead(|parser| {
                if parser.at(Kind::Type) {
                    parser.advance();
                }
                parser.advance();
                parser.at(Kind::Eq)
            })
        {
            return self.parse_ts_import_equals(start, false);
        }
        let flow_typeof = self
            .context()
            .contains(crate::next::parser::context::Context::FLOW)
            && self.at(Kind::TypeOf);
        let type_only = flow_typeof
            || (self
                .context()
                .contains(crate::next::parser::context::Context::TYPESCRIPT)
                && self.at(Kind::Type)
                && self.lookahead(|parser| {
                    parser.advance();
                    if parser.at(Kind::From) {
                        parser.advance();
                        return parser.at(Kind::From);
                    }
                    !matches!(parser.kind(), Kind::Comma | Kind::Eq)
                }));
        if type_only {
            self.advance();
        }
        let mut phase = ImportPhase::Evaluation;
        if !type_only && self.at(Kind::Ident) {
            let phase_word = self.token_source(self.token());
            let is_phase = match phase_word {
                "defer" => self.lookahead(|parser| {
                    parser.advance();
                    matches!(parser.kind(), Kind::Asterisk | Kind::LBrace)
                }),
                "source" => self.lookahead(|parser| {
                    parser.advance();
                    if matches!(parser.kind(), Kind::Asterisk | Kind::LBrace) {
                        return true;
                    }
                    if parser.at(Kind::From) {
                        parser.advance();
                        parser.at(Kind::From)
                    } else {
                        parser.at_identifier_name()
                    }
                }),
                _ => false,
            };
            if is_phase {
                phase = if phase_word == "source" {
                    ImportPhase::Source
                } else {
                    ImportPhase::Defer
                };
                self.advance();
            }
        }
        if phase == ImportPhase::Defer && self.at(Kind::LBrace) {
            self.emit_error(Error::new(
                self.token().span(),
                crate::error::SyntaxError::Expected(
                    "namespace import for import defer".into(),
                    "named imports".into(),
                ),
            ));
        }
        let mut specifiers = Vec::with_capacity(4);
        if self.at(Kind::Str) {
            if self
                .context()
                .contains(crate::next::parser::context::Context::FLOW)
                && type_only
            {
                self.emit_error(Error::new(
                    self.token().span(),
                    crate::error::SyntaxError::Unexpected {
                        got: "type-only side-effect import".into(),
                        expected: "type import binding",
                    },
                ));
            }
            let source = self.parse_module_string()?;
            let with = self.parse_import_attributes()?;
            self.consume_semicolon()?;
            return Ok(ModuleDecl::Import(ImportDecl {
                span: Span::new_with_checked(start, self.previous_end()),
                specifiers,
                src: Box::new(source),
                type_only,
                with,
                phase,
            }));
        }

        if phase == ImportPhase::Source {
            let local = self.parse_module_identifier_name()?;
            specifiers.push(ImportSpecifier::Default(ImportDefaultSpecifier {
                span: local.span,
                local,
            }));
        } else if self.at_identifier_reference()
            || (self
                .context()
                .contains(crate::next::parser::context::Context::FLOW)
                && self.at_identifier_name())
        {
            let local = self.parse_module_identifier()?;
            if type_only {
                self.validate_flow_type_binding(&local);
            }
            specifiers.push(ImportSpecifier::Default(ImportDefaultSpecifier {
                span: local.span,
                local,
            }));
            self.eat(Kind::Comma);
        }

        if self.eat(Kind::Asterisk) {
            if !self.expect(Kind::As) {
                return Err(self.expected_error(Kind::As));
            }
            let local = self.parse_module_identifier()?;
            if type_only {
                self.validate_flow_type_binding(&local);
                if self
                    .context()
                    .contains(crate::next::parser::context::Context::FLOW)
                    && !flow_typeof
                {
                    self.emit_error(Error::new(
                        local.span,
                        crate::error::SyntaxError::Unexpected {
                            got: "namespace type import".into(),
                            expected: "default or named Flow type import",
                        },
                    ));
                }
            }
            specifiers.push(ImportSpecifier::Namespace(ImportStarAsSpecifier {
                span: local.span,
                local,
            }));
        } else if self.eat(Kind::LBrace) {
            while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
                let flow_typeof = self
                    .context()
                    .contains(crate::next::parser::context::Context::FLOW)
                    && self.at(Kind::TypeOf);
                let is_type_only = flow_typeof
                    || (self
                        .context()
                        .contains(crate::next::parser::context::Context::TYPESCRIPT)
                        && self.at(Kind::Type)
                        && self.lookahead(|parser| {
                            parser.advance();
                            if matches!(parser.kind(), Kind::Comma | Kind::RBrace) {
                                return false;
                            }
                            if parser.eat(Kind::As) {
                                if matches!(parser.kind(), Kind::Comma | Kind::RBrace) {
                                    return true;
                                }
                                if parser.eat(Kind::As) {
                                    return !matches!(parser.kind(), Kind::Comma | Kind::RBrace);
                                }
                                return false;
                            }
                            true
                        }));
                if is_type_only {
                    if type_only {
                        self.emit_error(Error::new(
                            self.token().span(),
                            crate::error::SyntaxError::Expected(
                                "one type-only import marker".into(),
                                "type type".into(),
                            ),
                        ));
                    }
                    self.advance();
                }
                let imported = self.parse_module_export_name()?;
                if is_type_only
                    && matches!(&imported, ModuleExportName::Ident(identifier) if identifier.sym == "import")
                {
                    self.emit_error(Error::new(
                        imported.span(),
                        crate::error::SyntaxError::Expected(
                            "valid type-only imported binding".into(),
                            "import".into(),
                        ),
                    ));
                }
                let imported_span = imported.span();
                let (local, explicit_imported) = if self.eat(Kind::As) {
                    (self.parse_module_identifier()?, Some(imported))
                } else if flow_typeof {
                    let ModuleExportName::Ident(identifier) = imported else {
                        return Err(self.expected_error(Kind::Ident));
                    };
                    (
                        identifier.clone(),
                        Some(ModuleExportName::Ident(identifier)),
                    )
                } else {
                    let ModuleExportName::Ident(identifier) = imported else {
                        return Err(self.expected_error(Kind::As));
                    };
                    if !self
                        .context()
                        .contains(crate::next::parser::context::Context::FLOW)
                    {
                        self.validate_binding_identifier(&identifier);
                    }
                    (identifier, None)
                };
                if type_only || is_type_only {
                    self.validate_flow_type_binding(&local);
                }
                if self
                    .context()
                    .contains(crate::next::parser::context::Context::FLOW)
                    && local.sym == "default"
                {
                    self.emit_error(Error::new(
                        local.span,
                        crate::error::SyntaxError::Unexpected {
                            got: "default import binding".into(),
                            expected: "non-reserved local import binding",
                        },
                    ));
                }
                specifiers.push(ImportSpecifier::Named(ImportNamedSpecifier {
                    span: Span::new_with_checked(imported_span.lo, local.span.hi),
                    local,
                    imported: explicit_imported,
                    is_type_only,
                }));
                if !self.eat(Kind::Comma) {
                    break;
                }
            }
            if !self.expect(Kind::RBrace) {
                return Err(self.expected_error(Kind::RBrace));
            }
        }

        if !self.expect(Kind::From) {
            return Err(self.expected_error(Kind::From));
        }
        let source = self.parse_module_string()?;
        let with = self.parse_import_attributes()?;
        self.consume_semicolon()?;
        Ok(ModuleDecl::Import(ImportDecl {
            span: Span::new_with_checked(start, self.previous_end()),
            specifiers,
            src: Box::new(source),
            type_only,
            with,
            phase,
        }))
    }

    pub(crate) fn parse_export_declaration(&mut self) -> Result<ModuleDecl, Error> {
        let start = self.token().start();
        self.advance();
        let type_only = self
            .context()
            .contains(crate::next::parser::context::Context::TYPESCRIPT)
            && self.at(Kind::Type)
            && self.lookahead(|parser| {
                parser.advance();
                matches!(parser.kind(), Kind::LBrace | Kind::Asterisk)
            });
        if type_only {
            self.advance();
        }
        if self
            .context()
            .contains(crate::next::parser::context::Context::TYPESCRIPT)
        {
            if self.eat(Kind::Eq) {
                let expr = self.parse_assignment_expression()?;
                self.consume_semicolon()?;
                return Ok(ModuleDecl::TsExportAssignment(TsExportAssignment {
                    span: Span::new_with_checked(start, expr.span().hi),
                    expr,
                }));
            }
            if self.eat(Kind::As) {
                if !self.expect(Kind::Namespace) {
                    return Err(self.expected_error(Kind::Namespace));
                }
                let id = self.parse_module_identifier()?;
                self.consume_semicolon()?;
                return Ok(ModuleDecl::TsNamespaceExport(TsNamespaceExportDecl {
                    span: Span::new_with_checked(start, self.previous_end()),
                    id,
                }));
            }
            if self.eat(Kind::Import) {
                return self.parse_ts_import_equals(start, true);
            }
        }
        if self.eat(Kind::Default) {
            return self.parse_export_default(start);
        }
        if self.eat(Kind::Asterisk) {
            if self.eat(Kind::As) {
                let name = self.parse_module_export_name()?;
                if type_only
                    && self
                        .context()
                        .contains(crate::next::parser::context::Context::FLOW)
                {
                    self.emit_error(Error::new(
                        name.span(),
                        crate::error::SyntaxError::Unexpected {
                            got: "Flow type namespace export".into(),
                            expected: "named Flow type exports",
                        },
                    ));
                }
                if !self.expect(Kind::From) {
                    return Err(self.expected_error(Kind::From));
                }
                let source = self.parse_module_string()?;
                let with = self.parse_import_attributes()?;
                self.consume_semicolon()?;
                return Ok(ModuleDecl::ExportNamed(NamedExport {
                    span: Span::new_with_checked(start, self.previous_end()),
                    specifiers: vec![ExportSpecifier::Namespace(ExportNamespaceSpecifier {
                        span: name.span(),
                        name,
                    })],
                    src: Some(Box::new(source)),
                    type_only,
                    with,
                }));
            }
            if !self.expect(Kind::From) {
                return Err(self.expected_error(Kind::From));
            }
            let source = self.parse_module_string()?;
            let with = self.parse_import_attributes()?;
            self.consume_semicolon()?;
            return Ok(ModuleDecl::ExportAll(ExportAll {
                span: Span::new_with_checked(start, self.previous_end()),
                src: Box::new(source),
                type_only,
                with,
            }));
        }
        if self.eat(Kind::LBrace) {
            return self.parse_named_export(start, type_only);
        }

        let statement = self.parse_statement()?;
        let Stmt::Decl(declaration) = statement else {
            return Err(self.expected_error(Kind::Var));
        };
        Ok(ModuleDecl::ExportDecl(ExportDecl {
            span: Span::new_with_checked(start, declaration.span().hi),
            decl: declaration,
        }))
    }

    fn parse_ts_import_equals(
        &mut self,
        start: swc_common::BytePos,
        is_export: bool,
    ) -> Result<ModuleDecl, Error> {
        let is_type_only = self.eat(Kind::Type);
        let id = self.parse_module_identifier()?;
        if !self.expect(Kind::Eq) {
            return Err(self.expected_error(Kind::Eq));
        }
        let module_ref = if self.at(Kind::Require) {
            self.advance();
            if !self.expect(Kind::LParen) {
                return Err(self.expected_error(Kind::LParen));
            }
            let source = self.parse_module_string()?;
            if !self.expect(Kind::RParen) {
                return Err(self.expected_error(Kind::RParen));
            }
            TsModuleRef::TsExternalModuleRef(TsExternalModuleRef {
                span: Span::new_with_checked(id.span.hi, self.previous_end()),
                expr: source,
            })
        } else {
            TsModuleRef::TsEntityName(self.parse_ts_entity_name()?)
        };
        self.consume_semicolon()?;
        Ok(ModuleDecl::TsImportEquals(Box::new(TsImportEqualsDecl {
            span: Span::new_with_checked(start, self.previous_end()),
            is_export,
            is_type_only,
            id,
            module_ref,
        })))
    }

    fn parse_export_default(&mut self, start: swc_common::BytePos) -> Result<ModuleDecl, Error> {
        if self.at(Kind::At) {
            let decorators = self.parse_decorators()?;
            let expression = self.parse_class_expression()?;
            let Expr::Class(mut class) = *expression else {
                unreachable!("decorated default declaration must be a class")
            };
            class.class.decorators = decorators;
            let end = class.class.span.hi;
            return Ok(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                span: Span::new_with_checked(start, end),
                decl: DefaultDecl::Class(class),
            }));
        }
        #[cfg(feature = "flow")]
        if self
            .context()
            .contains(crate::next::parser::context::Context::FLOW)
            && self.at(Kind::Enum)
        {
            let Stmt::Decl(declaration) = self.parse_ts_enum_declaration(false)? else {
                unreachable!("enum parser must produce a declaration")
            };
            return Ok(ModuleDecl::ExportDecl(ExportDecl {
                span: Span::new_with_checked(start, declaration.span().hi),
                decl: declaration,
            }));
        }
        #[cfg(feature = "flow")]
        if self
            .context()
            .contains(crate::next::parser::context::Context::FLOW)
            && self.at(Kind::Ident)
            && self.token_source(self.token()) == "component"
        {
            let Stmt::Decl(Decl::Fn(function)) = self.parse_flow_component_declaration()? else {
                unreachable!("component parser must produce a function declaration")
            };
            let end = function.function.span.hi;
            return Ok(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                span: Span::new_with_checked(start, end),
                decl: DefaultDecl::Fn(FnExpr {
                    ident: Some(function.ident),
                    function: function.function,
                }),
            }));
        }
        #[cfg(feature = "flow")]
        if self
            .context()
            .contains(crate::next::parser::context::Context::FLOW)
            && self.at(Kind::Ident)
            && self.token_source(self.token()) == "hook"
        {
            let Stmt::Decl(Decl::Fn(function)) = self.parse_flow_hook_declaration()? else {
                unreachable!("hook parser must produce a function declaration")
            };
            let end = function.function.span.hi;
            return Ok(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                span: Span::new_with_checked(start, end),
                decl: DefaultDecl::Fn(FnExpr {
                    ident: Some(function.ident),
                    function: function.function,
                }),
            }));
        }
        if self
            .context()
            .contains(crate::next::parser::context::Context::TYPESCRIPT)
            && self.at(Kind::Interface)
        {
            let Stmt::Decl(Decl::TsInterface(interface)) = self.parse_ts_interface_declaration()?
            else {
                unreachable!("interface parser must produce an interface declaration")
            };
            return Ok(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                span: Span::new_with_checked(start, interface.span.hi),
                decl: DefaultDecl::TsInterfaceDecl(interface),
            }));
        }
        if self
            .context()
            .contains(crate::next::parser::context::Context::TYPESCRIPT)
            && self.at(Kind::Abstract)
            && self.lookahead(|parser| {
                parser.advance();
                parser.at(Kind::Class)
            })
        {
            self.advance();
            let expression = self.parse_class_expression()?;
            let Expr::Class(mut class) = *expression else {
                unreachable!("class parser must produce a class expression")
            };
            class.class.is_abstract = true;
            let end = class.class.span.hi;
            return Ok(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                span: Span::new_with_checked(start, end),
                decl: DefaultDecl::Class(class),
            }));
        }
        if matches!(self.kind(), Kind::Function | Kind::Class)
            || (self.at(Kind::Async) && self.is_async_function_start())
        {
            if !self.at(Kind::Class) {
                let function = self.parse_default_function_declaration()?;
                let end = function.function.span.hi;
                return Ok(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                    span: Span::new_with_checked(start, end),
                    decl: DefaultDecl::Fn(function),
                }));
            }
            let expression = self.parse_class_expression()?;
            let end = expression.span().hi;
            let declaration = match *expression {
                Expr::Class(class) => DefaultDecl::Class(class),
                Expr::Fn(function) => DefaultDecl::Fn(function),
                _ => unreachable!(),
            };
            return Ok(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
                span: Span::new_with_checked(start, end),
                decl: declaration,
            }));
        }

        let expression = self.parse_assignment_expression()?;
        let end = expression.span().hi;
        self.consume_semicolon()?;
        Ok(ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
            span: Span::new_with_checked(start, end),
            expr: expression,
        }))
    }

    fn parse_named_export(
        &mut self,
        start: swc_common::BytePos,
        type_only: bool,
    ) -> Result<ModuleDecl, Error> {
        let mut specifiers = Vec::with_capacity(4);
        while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
            let is_type_only = self
                .context()
                .contains(crate::next::parser::context::Context::TYPESCRIPT)
                && self.at(Kind::Type)
                && self.lookahead(|parser| {
                    parser.advance();
                    if matches!(parser.kind(), Kind::Comma | Kind::RBrace) {
                        return false;
                    }
                    if parser.eat(Kind::As) {
                        if matches!(parser.kind(), Kind::Comma | Kind::RBrace) {
                            return true;
                        }
                        if parser.eat(Kind::As) {
                            return !matches!(parser.kind(), Kind::Comma | Kind::RBrace);
                        }
                        return false;
                    }
                    true
                });
            if is_type_only {
                if type_only {
                    self.emit_error(Error::new(
                        self.token().span(),
                        crate::error::SyntaxError::Expected(
                            "one type-only export marker".into(),
                            "type type".into(),
                        ),
                    ));
                }
                self.advance();
            }
            let original = self.parse_module_export_name()?;
            let original_span = original.span();
            let exported = if self.eat(Kind::As) {
                Some(self.parse_module_export_name()?)
            } else {
                None
            };
            let end = exported
                .as_ref()
                .map_or(original_span.hi, swc_common::Spanned::span_hi);
            specifiers.push(ExportSpecifier::Named(ExportNamedSpecifier {
                span: Span::new_with_checked(original_span.lo, end),
                orig: original,
                exported,
                is_type_only,
            }));
            if !self.eat(Kind::Comma) {
                break;
            }
        }
        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        let source = if self.eat(Kind::From) {
            Some(Box::new(self.parse_module_string()?))
        } else {
            None
        };
        if source.is_none() {
            for specifier in &specifiers {
                if let ExportSpecifier::Named(named) = specifier {
                    if matches!(&named.orig, ModuleExportName::Ident(identifier) if matches!(&*identifier.sym, "default" | "if" | "for" | "export"))
                    {
                        self.emit_error(Error::new(
                            named.orig.span(),
                            crate::error::SyntaxError::Expected(
                                "local export binding".into(),
                                "reserved export name".into(),
                            ),
                        ));
                    }
                }
            }
        }
        let with = self.parse_import_attributes()?;
        self.consume_semicolon()?;
        Ok(ModuleDecl::ExportNamed(NamedExport {
            span: Span::new_with_checked(start, self.previous_end()),
            specifiers,
            src: source,
            type_only,
            with,
        }))
    }

    fn parse_import_attributes(&mut self) -> Result<Option<Box<ObjectLit>>, Error> {
        if !matches!(self.kind(), Kind::Assert | Kind::With)
            || !self.lookahead(|parser| {
                parser.advance();
                parser.at(Kind::LBrace)
            })
        {
            return Ok(None);
        }
        self.advance();
        if !self.at(Kind::LBrace) {
            return Err(self.expected_error(Kind::LBrace));
        }
        let expression = self.parse_object_literal()?;
        let Expr::Object(attributes) = *expression else {
            unreachable!("import attributes parser must produce an object")
        };
        Ok(Some(Box::new(attributes)))
    }

    fn parse_module_identifier(&mut self) -> Result<Ident, Error> {
        let token = self.token();
        if !self.at_identifier_reference()
            && !(self
                .context()
                .contains(crate::next::parser::context::Context::FLOW)
                && self.at_identifier_name())
        {
            return Err(self.expected_error(Kind::Ident));
        }
        let identifier = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
        self.advance();
        Ok(identifier)
    }

    fn parse_module_identifier_name(&mut self) -> Result<Ident, Error> {
        let token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let identifier = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
        self.advance();
        Ok(identifier)
    }

    fn parse_module_export_name(&mut self) -> Result<ModuleExportName, Error> {
        if self.at(Kind::Str) {
            return self.parse_module_string().map(ModuleExportName::Str);
        }
        let token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let identifier = Ident::new_no_ctxt(self.identifier_atom(token), token.span());
        self.advance();
        Ok(ModuleExportName::Ident(identifier))
    }

    fn parse_module_string(&mut self) -> Result<Str, Error> {
        let token = self.token();
        if !self.at(Kind::Str) {
            return Err(self.expected_error(Kind::Str));
        }
        let raw = self.token_source(token);
        let value = if token.escaped() {
            self.escaped_string(token)
                .expect("escaped module string must have a decoded value")
                .clone()
        } else {
            Wtf8Atom::new(&raw[1..raw.len() - 1])
        };
        let string = Str {
            span: token.span(),
            value,
            raw: Some(Atom::new(raw)),
        };
        self.advance();
        Ok(string)
    }
}

fn collect_export_pattern_names(pattern: &Pat, names: &mut Vec<(Atom, Span)>) {
    match pattern {
        Pat::Ident(binding) => names.push((binding.id.sym.clone(), binding.id.span)),
        Pat::Array(array) => {
            for element in array.elems.iter().flatten() {
                collect_export_pattern_names(element, names);
            }
        }
        Pat::Object(object) => {
            for property in &object.props {
                match property {
                    swc_ecma_ast::ObjectPatProp::Assign(assign) => {
                        names.push((assign.key.id.sym.clone(), assign.key.id.span));
                    }
                    swc_ecma_ast::ObjectPatProp::KeyValue(key_value) => {
                        collect_export_pattern_names(&key_value.value, names);
                    }
                    swc_ecma_ast::ObjectPatProp::Rest(rest) => {
                        collect_export_pattern_names(&rest.arg, names);
                    }
                }
            }
        }
        Pat::Assign(assign) => collect_export_pattern_names(&assign.left, names),
        Pat::Rest(rest) => collect_export_pattern_names(&rest.arg, names),
        Pat::Invalid(_) | Pat::Expr(_) => {}
    }
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;
    use swc_ecma_ast::{ImportSpecifier, ModuleDecl, ModuleItem};

    use crate::next::{
        lexer::{config::NoTokens, core::Lexer},
        parser::{context::Context, cursor::Parser},
    };

    #[test]
    fn parses_static_import_forms_directly() {
        let lexer = Lexer::new(
            "import 'side'; import main, { value as local, other } from 'dep'; import * as ns \
             from 'all';",
            BytePos(1),
            NoTokens,
        )
        .unwrap();
        let mut parser = Parser::new(lexer, Context::default() | Context::MODULE);
        let module = parser.parse_module().unwrap();
        let ModuleItem::ModuleDecl(ModuleDecl::Import(import)) = &module.body[1] else {
            panic!("expected import declaration")
        };
        assert_eq!(import.specifiers.len(), 3);
        assert!(matches!(import.specifiers[0], ImportSpecifier::Default(_)));
        assert!(matches!(import.specifiers[1], ImportSpecifier::Named(_)));
    }

    #[test]
    fn parses_export_forms_directly() {
        let lexer = Lexer::new(
            "export const value = 1; export { value as renamed }; export * from 'dep'; export * \
             as ns from 'dep'; export default function named() {}",
            BytePos(1),
            NoTokens,
        )
        .unwrap();
        let mut parser = Parser::new(lexer, Context::default() | Context::MODULE);
        let module = parser.parse_module().unwrap();
        assert_eq!(module.body.len(), 5);
        assert!(matches!(
            module.body[0],
            ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(_))
        ));
        assert!(matches!(
            module.body[4],
            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(_))
        ));
    }
}
