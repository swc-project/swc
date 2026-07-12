//! ECMAScript module declarations built directly as SWC AST nodes.

use swc_atoms::{Atom, Wtf8Atom};
use swc_common::{Span, Spanned};
use swc_ecma_ast::{
    DefaultDecl, ExportAll, ExportDecl, ExportDefaultDecl, ExportDefaultExpr, ExportNamedSpecifier,
    ExportNamespaceSpecifier, ExportSpecifier, Expr, Ident, ImportDecl, ImportDefaultSpecifier,
    ImportNamedSpecifier, ImportSpecifier, ImportStarAsSpecifier, Module, ModuleDecl,
    ModuleExportName, ModuleItem, NamedExport, Stmt, Str,
};

use crate::{
    error::Error,
    lexer::Token as Kind,
    next::{lexer::config::Config, parser::cursor::Parser},
};

impl<C: Config> Parser<'_, C> {
    /// Parse an ECMAScript module body.
    pub(crate) fn parse_module(&mut self) -> Result<Module, Error> {
        let start = self.token().start();
        let mut body = Vec::with_capacity(8);
        while !self.at(Kind::Eof) {
            body.push(match self.kind() {
                Kind::Import => ModuleItem::ModuleDecl(self.parse_import_declaration()?),
                Kind::Export => ModuleItem::ModuleDecl(self.parse_export_declaration()?),
                _ => ModuleItem::Stmt(self.parse_statement()?),
            });
        }
        Ok(Module {
            span: Span::new_with_checked(start, self.token().end()),
            body,
            shebang: None,
        })
    }

    fn parse_import_declaration(&mut self) -> Result<ModuleDecl, Error> {
        let start = self.token().start();
        self.advance();
        let mut specifiers = Vec::with_capacity(4);
        if self.at(Kind::Str) {
            let source = self.parse_module_string()?;
            self.consume_semicolon()?;
            return Ok(ModuleDecl::Import(ImportDecl {
                span: Span::new_with_checked(start, self.previous_end()),
                specifiers,
                src: Box::new(source),
                type_only: false,
                with: None,
                phase: Default::default(),
            }));
        }

        if self.at_identifier_reference() {
            let local = self.parse_module_identifier()?;
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
            specifiers.push(ImportSpecifier::Namespace(ImportStarAsSpecifier {
                span: local.span,
                local,
            }));
        } else if self.eat(Kind::LBrace) {
            while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
                let imported = self.parse_module_export_name()?;
                let imported_span = imported.span();
                let (local, explicit_imported) = if self.eat(Kind::As) {
                    (self.parse_module_identifier()?, Some(imported))
                } else {
                    let ModuleExportName::Ident(identifier) = imported else {
                        return Err(self.expected_error(Kind::As));
                    };
                    (identifier, None)
                };
                specifiers.push(ImportSpecifier::Named(ImportNamedSpecifier {
                    span: Span::new_with_checked(imported_span.lo, local.span.hi),
                    local,
                    imported: explicit_imported,
                    is_type_only: false,
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
        self.consume_semicolon()?;
        Ok(ModuleDecl::Import(ImportDecl {
            span: Span::new_with_checked(start, self.previous_end()),
            specifiers,
            src: Box::new(source),
            type_only: false,
            with: None,
            phase: Default::default(),
        }))
    }

    fn parse_export_declaration(&mut self) -> Result<ModuleDecl, Error> {
        let start = self.token().start();
        self.advance();
        if self.eat(Kind::Default) {
            return self.parse_export_default(start);
        }
        if self.eat(Kind::Asterisk) {
            if self.eat(Kind::As) {
                let name = self.parse_module_export_name()?;
                if !self.expect(Kind::From) {
                    return Err(self.expected_error(Kind::From));
                }
                let source = self.parse_module_string()?;
                self.consume_semicolon()?;
                return Ok(ModuleDecl::ExportNamed(NamedExport {
                    span: Span::new_with_checked(start, self.previous_end()),
                    specifiers: vec![ExportSpecifier::Namespace(ExportNamespaceSpecifier {
                        span: name.span(),
                        name,
                    })],
                    src: Some(Box::new(source)),
                    type_only: false,
                    with: None,
                }));
            }
            if !self.expect(Kind::From) {
                return Err(self.expected_error(Kind::From));
            }
            let source = self.parse_module_string()?;
            self.consume_semicolon()?;
            return Ok(ModuleDecl::ExportAll(ExportAll {
                span: Span::new_with_checked(start, self.previous_end()),
                src: Box::new(source),
                type_only: false,
                with: None,
            }));
        }
        if self.eat(Kind::LBrace) {
            return self.parse_named_export(start);
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

    fn parse_export_default(&mut self, start: swc_common::BytePos) -> Result<ModuleDecl, Error> {
        if matches!(self.kind(), Kind::Function | Kind::Class)
            || (self.at(Kind::Async) && self.is_async_function_start())
        {
            let expression = if self.at(Kind::Class) {
                self.parse_class_expression()?
            } else {
                self.parse_function_expression()?
            };
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

    fn parse_named_export(&mut self, start: swc_common::BytePos) -> Result<ModuleDecl, Error> {
        let mut specifiers = Vec::with_capacity(4);
        while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
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
                is_type_only: false,
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
        self.consume_semicolon()?;
        Ok(ModuleDecl::ExportNamed(NamedExport {
            span: Span::new_with_checked(start, self.previous_end()),
            specifiers,
            src: source,
            type_only: false,
            with: None,
        }))
    }

    fn parse_module_identifier(&mut self) -> Result<Ident, Error> {
        let token = self.token();
        if !self.at_identifier_reference() {
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
