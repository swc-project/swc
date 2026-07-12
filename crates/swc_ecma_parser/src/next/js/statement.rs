//! JavaScript statements and script bodies.

use swc_atoms::Atom;
use swc_common::{Span, Spanned, SyntaxContext};
use swc_ecma_ast::{
    BindingIdent, BlockStmt, BreakStmt, ContinueStmt, DebuggerStmt, Decl, DoWhileStmt, EmptyStmt,
    ExprStmt, Ident, IfStmt, Pat, ReturnStmt, Script, Stmt, ThrowStmt, VarDecl, VarDeclKind,
    VarDeclarator, WhileStmt,
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
            Kind::Break | Kind::Continue => self.parse_jump_statement(),
            Kind::Debugger => self.parse_debugger_statement(),
            Kind::If => self.parse_if_statement(),
            Kind::Return => self.parse_return_statement(),
            Kind::Throw => self.parse_throw_statement(),
            Kind::Var | Kind::Let | Kind::Const => self.parse_variable_statement(),
            Kind::While => self.parse_while_statement(),
            Kind::Do => self.parse_do_while_statement(),
            _ => self.parse_expression_statement(),
        }
    }

    fn parse_parenthesized_expression(&mut self) -> Result<Box<swc_ecma_ast::Expr>, Error> {
        if !self.expect(Kind::LParen) {
            return Err(self.expected_error(Kind::LParen));
        }
        let expression = self.parse_expression()?;
        if !self.expect(Kind::RParen) {
            return Err(self.expected_error(Kind::RParen));
        }
        Ok(expression)
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

    fn parse_debugger_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        self.consume_semicolon()?;
        Ok(Stmt::Debugger(DebuggerStmt {
            span: Span::new_with_checked(start, self.previous_end()),
        }))
    }

    fn parse_jump_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        let is_break = self.at(Kind::Break);
        self.advance();
        let label = if self.token().had_line_break()
            || matches!(self.kind(), Kind::Semi | Kind::RBrace | Kind::Eof)
        {
            None
        } else {
            let token = self.token();
            if !self.at(Kind::Ident) {
                return Err(self.expected_error(Kind::Ident));
            }
            let label = Ident::new_no_ctxt(Atom::new(self.token_source(token)), token.span());
            self.advance();
            Some(label)
        };
        self.consume_semicolon()?;
        let span = Span::new_with_checked(start, self.previous_end());

        // Labeled jump validation is added with labeled statements. Unlabeled
        // jumps can be checked immediately from the production context.
        if label.is_none() {
            let allowed = if is_break {
                self.context().contains(Context::BREAK)
            } else {
                self.context().contains(Context::CONTINUE)
            };
            if !allowed {
                self.emit_error(Error::new(
                    span,
                    if is_break {
                        crate::error::SyntaxError::TS1105
                    } else {
                        crate::error::SyntaxError::TS1115
                    },
                ));
            }
        }

        Ok(if is_break {
            Stmt::Break(BreakStmt { span, label })
        } else {
            Stmt::Continue(ContinueStmt { span, label })
        })
    }

    fn parse_if_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        let test = self.parse_parenthesized_expression()?;
        let consequent = Box::new(self.parse_statement()?);
        let alternate = if self.eat(Kind::Else) {
            Some(Box::new(self.parse_statement()?))
        } else {
            None
        };
        let end = alternate
            .as_ref()
            .map_or_else(|| consequent.span().hi, |statement| statement.span().hi);
        Ok(Stmt::If(IfStmt {
            span: Span::new_with_checked(start, end),
            test,
            cons: consequent,
            alt: alternate,
        }))
    }

    fn parse_throw_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        if self.token().had_line_break() {
            return Err(Error::new(
                self.token().span(),
                crate::error::SyntaxError::LineBreakInThrow,
            ));
        }
        let argument = self.parse_expression()?;
        let end = argument.span().hi;
        self.consume_semicolon()?;
        Ok(Stmt::Throw(ThrowStmt {
            span: Span::new_with_checked(start, end),
            arg: argument,
        }))
    }

    fn parse_while_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        let test = self.parse_parenthesized_expression()?;
        let body = Box::new(self.with_context(
            Context::BREAK | Context::CONTINUE,
            Context::empty(),
            Self::parse_statement,
        )?);
        Ok(Stmt::While(WhileStmt {
            span: Span::new_with_checked(start, body.span().hi),
            test,
            body,
        }))
    }

    fn parse_do_while_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        let body = Box::new(self.with_context(
            Context::BREAK | Context::CONTINUE,
            Context::empty(),
            Self::parse_statement,
        )?);
        if !self.expect(Kind::While) {
            return Err(self.expected_error(Kind::While));
        }
        let test = self.parse_parenthesized_expression()?;
        self.eat(Kind::Semi);
        Ok(Stmt::DoWhile(DoWhileStmt {
            span: Span::new_with_checked(start, self.previous_end()),
            test,
            body,
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

    #[test]
    fn parses_control_flow_statements_directly() {
        let source = "if (ready) while (active) { debugger; break; continue outer; } else do \
                      throw error; while (retry);";
        let lexer = Lexer::new(source, BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let script = parser.parse_script().unwrap();

        let Stmt::If(if_statement) = &script.body[0] else {
            panic!("expected if statement")
        };
        let Stmt::While(while_statement) = &*if_statement.cons else {
            panic!("expected while statement")
        };
        let Stmt::Block(block) = &*while_statement.body else {
            panic!("expected loop block")
        };
        assert!(matches!(block.stmts[1], Stmt::Break(_)));
        let Stmt::Continue(continue_statement) = &block.stmts[2] else {
            panic!("expected continue statement")
        };
        assert_eq!(continue_statement.label.as_ref().unwrap().sym, "outer");
        let Some(alternate) = &if_statement.alt else {
            panic!("expected alternate")
        };
        assert!(matches!(&**alternate, Stmt::DoWhile(_)));
    }

    #[test]
    fn rejects_line_break_after_throw() {
        let lexer = Lexer::new("throw\nerror;", BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let error = parser.parse_script().unwrap_err();

        assert!(matches!(
            error.kind(),
            crate::error::SyntaxError::LineBreakInThrow
        ));
    }
}
