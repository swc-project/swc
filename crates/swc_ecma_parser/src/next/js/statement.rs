//! JavaScript statements and script bodies.

use swc_atoms::Atom;
use swc_common::{Span, Spanned, SyntaxContext};
use swc_ecma_ast::{
    BindingIdent, BlockStmt, Decl, EmptyStmt, ExprStmt, Ident, Pat, ReturnStmt, Script, Stmt,
    VarDecl, VarDeclKind, VarDeclarator,
};

use crate::{
    error::Error,
    lexer::Token as Kind,
    next::{lexer::config::Config, parser::cursor::Parser},
};

impl<C: Config> Parser<'_, C> {
    /// Parse a script body using the independent lexer and direct SWC AST
    /// nodes.
    pub(crate) fn parse_script(&mut self) -> Result<Script, Error> {
        let start = self.token().start();
        let mut body = Vec::with_capacity(8);
        while !self.at(Kind::Eof) {
            body.push(self.parse_statement()?);
        }
        Ok(Script {
            span: Span::new_with_checked(start, self.token().end()),
            body,
            shebang: None,
        })
    }

    pub(crate) fn parse_statement(&mut self) -> Result<Stmt, Error> {
        match self.kind() {
            Kind::Semi => {
                let span = self.token().span();
                self.advance();
                Ok(Stmt::Empty(EmptyStmt { span }))
            }
            Kind::LBrace => self.parse_block_statement().map(Stmt::Block),
            Kind::Return => self.parse_return_statement(),
            Kind::Var | Kind::Let | Kind::Const => self.parse_variable_statement(),
            _ => self.parse_expression_statement(),
        }
    }

    fn parse_block_statement(&mut self) -> Result<BlockStmt, Error> {
        let start = self.token().start();
        self.advance();
        let mut statements = Vec::with_capacity(8);
        while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
            statements.push(self.parse_statement()?);
        }
        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        Ok(BlockStmt {
            span: Span::new_with_checked(start, self.previous_end()),
            ctxt: SyntaxContext::empty(),
            stmts: statements,
        })
    }

    fn parse_return_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        let argument = if self.token().had_line_break()
            || matches!(self.kind(), Kind::Semi | Kind::RBrace | Kind::Eof)
        {
            None
        } else {
            Some(self.parse_expression()?)
        };
        self.consume_semicolon()?;
        let end = argument
            .as_ref()
            .map_or(self.previous_end(), |expression| expression.span().hi);
        Ok(Stmt::Return(ReturnStmt {
            span: Span::new_with_checked(start, end),
            arg: argument,
        }))
    }

    fn parse_variable_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        let kind = match self.kind() {
            Kind::Var => VarDeclKind::Var,
            Kind::Let => VarDeclKind::Let,
            Kind::Const => VarDeclKind::Const,
            _ => unreachable!(),
        };
        self.advance();
        let mut declarations = Vec::with_capacity(4);

        loop {
            let identifier_token = self.token();
            if !self.at(Kind::Ident) {
                return Err(self.expected_error(Kind::Ident));
            }
            let identifier = Ident::new_no_ctxt(
                Atom::new(self.token_source(identifier_token)),
                identifier_token.span(),
            );
            self.advance();
            let initializer = if self.eat(Kind::Eq) {
                Some(self.parse_assignment_expression()?)
            } else {
                None
            };
            let end = initializer
                .as_ref()
                .map_or(identifier.span.hi, |expression| expression.span().hi);
            declarations.push(VarDeclarator {
                span: Span::new_with_checked(identifier.span.lo, end),
                name: Pat::Ident(BindingIdent {
                    id: identifier,
                    type_ann: None,
                }),
                init: initializer,
                definite: false,
            });
            if !self.eat(Kind::Comma) {
                break;
            }
        }

        self.consume_semicolon()?;
        Ok(Stmt::Decl(Decl::Var(Box::new(VarDecl {
            span: Span::new_with_checked(start, self.previous_end()),
            ctxt: SyntaxContext::empty(),
            kind,
            declare: false,
            decls: declarations,
        }))))
    }

    fn parse_expression_statement(&mut self) -> Result<Stmt, Error> {
        let expression = self.parse_expression()?;
        let span = expression.span();
        self.consume_semicolon()?;
        Ok(Stmt::Expr(ExprStmt {
            span,
            expr: expression,
        }))
    }

    fn consume_semicolon(&mut self) -> Result<(), Error> {
        if self.eat(Kind::Semi)
            || self.at(Kind::RBrace)
            || self.at(Kind::Eof)
            || self.token().had_line_break()
        {
            Ok(())
        } else {
            Err(self.expected_error(Kind::Semi))
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_common::BytePos;
    use swc_ecma_ast::{Decl, Expr, Stmt, VarDeclKind};

    use crate::next::{
        lexer::{config::NoTokens, core::Lexer},
        parser::{context::Context, cursor::Parser},
    };

    #[test]
    fn parses_basic_script_directly() {
        let lexer = Lexer::new(
            "const answer = 40 + 2; { answer; return\nanswer; }",
            BytePos(1),
            NoTokens,
        )
        .unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let script = parser.parse_script().unwrap();

        assert_eq!(script.body.len(), 2);
        let Stmt::Decl(Decl::Var(declaration)) = &script.body[0] else {
            panic!("expected variable declaration")
        };
        assert_eq!(declaration.kind, VarDeclKind::Const);
        assert!(matches!(
            declaration.decls[0].init.as_deref(),
            Some(Expr::Bin(_))
        ));
        let Stmt::Block(block) = &script.body[1] else {
            panic!("expected block")
        };
        assert_eq!(block.stmts.len(), 3);
        let Stmt::Return(return_statement) = &block.stmts[1] else {
            panic!("expected return")
        };
        assert!(return_statement.arg.is_none());
    }
}
