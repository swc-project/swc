//! JavaScript class declarations, expressions, and public members.

use swc_atoms::Atom;
use swc_common::{Span, Spanned, SyntaxContext};
use swc_ecma_ast::{
    BindingIdent, Class, ClassDecl, ClassExpr, ClassMember, ClassMethod, ClassProp, Constructor,
    Decl, Expr, Function, Ident, IdentName, MethodKind, Param, ParamOrTsParamProp, Pat, PropName,
    Stmt,
};

use crate::{
    error::Error,
    lexer::Token as Kind,
    next::{
        lexer::config::Config,
        parser::{context::Context, cursor::Parser},
    },
};

impl<C: Config> Parser<'_, C> {
    pub(crate) fn parse_class_declaration(&mut self) -> Result<Stmt, Error> {
        let (identifier, class) = self.parse_class(true)?;
        Ok(Stmt::Decl(Decl::Class(ClassDecl {
            ident: identifier.expect("class declaration must have a name"),
            declare: false,
            class,
        })))
    }

    pub(crate) fn parse_class_expression(&mut self) -> Result<Box<Expr>, Error> {
        let (identifier, class) = self.parse_class(false)?;
        Ok(Box::new(Expr::Class(ClassExpr {
            ident: identifier,
            class,
        })))
    }

    fn parse_class(&mut self, declaration: bool) -> Result<(Option<Ident>, Box<Class>), Error> {
        let start = self.token().start();
        self.advance();
        let identifier = if self.at_identifier_reference() {
            let token = self.token();
            let identifier = Ident::new_no_ctxt(Atom::new(self.token_source(token)), token.span());
            self.advance();
            Some(identifier)
        } else if declaration {
            return Err(self.expected_error(Kind::Ident));
        } else {
            None
        };
        let super_class = if self.eat(Kind::Extends) {
            Some(self.parse_expression()?)
        } else {
            None
        };
        if !self.expect(Kind::LBrace) {
            return Err(self.expected_error(Kind::LBrace));
        }

        let mut body = Vec::with_capacity(32);
        while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
            if self.eat(Kind::Semi) {
                continue;
            }
            body.push(self.with_context(
                Context::STRICT,
                Context::TOP_LEVEL,
                Self::parse_class_member,
            )?);
        }
        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        Ok((
            identifier,
            Box::new(Class {
                span: Span::new_with_checked(start, self.previous_end()),
                ctxt: SyntaxContext::empty(),
                decorators: Vec::new(),
                body,
                super_class,
                is_abstract: false,
                type_params: None,
                super_type_params: None,
                implements: Vec::new(),
            }),
        ))
    }

    fn parse_class_member(&mut self) -> Result<ClassMember, Error> {
        let start = self.token().start();
        let is_static = if self.at(Kind::Static)
            && self.lookahead(|parser| {
                parser.advance();
                !matches!(
                    parser.kind(),
                    Kind::LParen | Kind::Eq | Kind::Semi | Kind::RBrace
                )
            }) {
            self.advance();
            true
        } else {
            false
        };
        let is_generator = self.eat(Kind::Asterisk);
        let token = self.token();
        if !self.at_identifier_name() {
            return Err(self.expected_error(Kind::Ident));
        }
        let symbol = Atom::new(self.token_source(token));
        let is_constructor = !is_static && !is_generator && &*symbol == "constructor";
        let key = PropName::Ident(IdentName {
            span: token.span(),
            sym: symbol,
        });
        self.advance();

        if self.at(Kind::LParen) {
            let parameters = self.parse_method_parameters()?;
            if !self.at(Kind::LBrace) {
                return Err(self.expected_error(Kind::LBrace));
            }
            let body = self.with_context(
                Context::RETURN,
                Context::TOP_LEVEL,
                Self::parse_block_statement,
            )?;
            let span = Span::new_with_checked(start, body.span.hi);
            if is_constructor {
                return Ok(ClassMember::Constructor(Constructor {
                    span,
                    ctxt: SyntaxContext::empty(),
                    key,
                    params: parameters
                        .into_iter()
                        .map(ParamOrTsParamProp::Param)
                        .collect(),
                    body: Some(body),
                    accessibility: None,
                    is_optional: false,
                }));
            }
            return Ok(ClassMember::Method(ClassMethod {
                span,
                key,
                function: Box::new(Function {
                    params: parameters,
                    decorators: Vec::new(),
                    span,
                    ctxt: SyntaxContext::empty(),
                    body: Some(body),
                    is_generator,
                    is_async: false,
                    type_params: None,
                    return_type: None,
                }),
                kind: MethodKind::Method,
                is_static,
                accessibility: None,
                is_abstract: false,
                is_optional: false,
                is_override: false,
            }));
        }

        if is_generator {
            return Err(self.expected_error(Kind::LParen));
        }
        let value = if self.eat(Kind::Eq) {
            Some(self.parse_assignment_expression()?)
        } else {
            None
        };
        let end = value.as_ref().map_or(token.end(), |value| value.span().hi);
        self.consume_semicolon()?;
        Ok(ClassMember::ClassProp(ClassProp {
            span: Span::new_with_checked(start, end),
            key,
            value,
            type_ann: None,
            is_static,
            decorators: Vec::new(),
            accessibility: None,
            is_abstract: false,
            is_optional: false,
            is_override: false,
            readonly: false,
            declare: false,
            definite: false,
        }))
    }

    fn parse_method_parameters(&mut self) -> Result<Vec<Param>, Error> {
        if !self.expect(Kind::LParen) {
            return Err(self.expected_error(Kind::LParen));
        }
        let mut parameters = Vec::with_capacity(4);
        while !self.at(Kind::RParen) && !self.at(Kind::Eof) {
            let token = self.token();
            if !self.at_identifier_reference() {
                return Err(self.expected_error(Kind::Ident));
            }
            let identifier = Ident::new_no_ctxt(Atom::new(self.token_source(token)), token.span());
            self.advance();
            parameters.push(Param {
                span: token.span(),
                decorators: Vec::new(),
                pat: Pat::Ident(BindingIdent {
                    id: identifier,
                    type_ann: None,
                }),
            });
            if !self.eat(Kind::Comma) {
                break;
            }
        }
        if !self.expect(Kind::RParen) {
            return Err(self.expected_error(Kind::RParen));
        }
        Ok(parameters)
    }
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;
    use swc_ecma_ast::{ClassMember, Decl, Expr, Stmt};

    use crate::next::{
        lexer::{config::NoTokens, core::Lexer},
        parser::{context::Context, cursor::Parser},
    };

    #[test]
    fn parses_class_declarations_and_expressions_directly() {
        let source = "class Counter extends Base { static initial = 1; constructor(value) { \
                      this.value = value; } *values() { return this.value; } } const Anonymous = \
                      class { field; };";
        let lexer = Lexer::new(source, BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let script = parser.parse_script().unwrap();

        let Stmt::Decl(Decl::Class(declaration)) = &script.body[0] else {
            panic!("expected class declaration")
        };
        assert!(declaration.class.super_class.is_some());
        assert_eq!(declaration.class.body.len(), 3);
        assert!(matches!(
            declaration.class.body[1],
            ClassMember::Constructor(_)
        ));
        let Stmt::Decl(Decl::Var(variable)) = &script.body[1] else {
            panic!("expected class expression declaration")
        };
        assert!(matches!(
            variable.decls[0].init.as_deref(),
            Some(Expr::Class(_))
        ));
    }
}
