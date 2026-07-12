//! JavaScript function declarations and expressions.

use swc_atoms::Atom;
use swc_common::{Span, SyntaxContext};
use swc_ecma_ast::{BindingIdent, Decl, Expr, FnDecl, FnExpr, Function, Ident, Param, Pat, Stmt};

use crate::{
    error::Error,
    lexer::Token as Kind,
    next::{
        lexer::config::Config,
        parser::{context::Context, cursor::Parser},
    },
};

impl<C: Config> Parser<'_, C> {
    pub(crate) fn parse_function_declaration(&mut self) -> Result<Stmt, Error> {
        let (identifier, function) = self.parse_function(true)?;
        Ok(Stmt::Decl(Decl::Fn(FnDecl {
            ident: identifier.expect("function declaration must have a name"),
            declare: false,
            function,
        })))
    }

    pub(crate) fn parse_function_expression(&mut self) -> Result<Box<Expr>, Error> {
        let (identifier, function) = self.parse_function(false)?;
        Ok(Box::new(Expr::Fn(FnExpr {
            ident: identifier,
            function,
        })))
    }

    fn parse_function(
        &mut self,
        declaration: bool,
    ) -> Result<(Option<Ident>, Box<Function>), Error> {
        let start = self.token().start();
        self.advance();
        let is_generator = self.eat(Kind::Asterisk);
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
        if !self.at(Kind::LBrace) {
            return Err(self.expected_error(Kind::LBrace));
        }
        let body = self.with_context(
            Context::RETURN,
            Context::TOP_LEVEL,
            Self::parse_block_statement,
        )?;
        let span = Span::new_with_checked(start, body.span.hi);
        Ok((
            identifier,
            Box::new(Function {
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
        ))
    }
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;
    use swc_ecma_ast::{Decl, Expr, Stmt};

    use crate::next::{
        lexer::{config::NoTokens, core::Lexer},
        parser::{context::Context, cursor::Parser},
    };

    #[test]
    fn parses_function_declarations_and_expressions_directly() {
        let lexer = Lexer::new(
            "function* generate(value) { return value; } const identity = function (value) { \
             return value; };",
            BytePos(1),
            NoTokens,
        )
        .unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let script = parser.parse_script().unwrap();

        let Stmt::Decl(Decl::Fn(declaration)) = &script.body[0] else {
            panic!("expected function declaration")
        };
        assert!(declaration.function.is_generator);
        let Stmt::Decl(Decl::Var(variable)) = &script.body[1] else {
            panic!("expected variable declaration")
        };
        assert!(matches!(
            variable.decls[0].init.as_deref(),
            Some(Expr::Fn(_))
        ));
    }
}
