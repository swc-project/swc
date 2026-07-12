//! JavaScript statements and script bodies.

use swc_atoms::Atom;
use swc_common::{Span, Spanned, SyntaxContext};
use swc_ecma_ast::{
    BindingIdent, BlockStmt, BreakStmt, CatchClause, ContinueStmt, DebuggerStmt, Decl, DoWhileStmt,
    EmptyStmt, ExprStmt, ForHead, ForInStmt, ForOfStmt, ForStmt, Ident, IfStmt, Pat, ReturnStmt,
    Script, Stmt, SwitchCase, SwitchStmt, ThrowStmt, TryStmt, VarDecl, VarDeclKind, VarDeclOrExpr,
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
            Kind::For => self.parse_for_statement(),
            Kind::Function => self.parse_function_declaration(),
            Kind::If => self.parse_if_statement(),
            Kind::Return => self.parse_return_statement(),
            Kind::Switch => self.parse_switch_statement(),
            Kind::Throw => self.parse_throw_statement(),
            Kind::Try => self.parse_try_statement(),
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

    pub(crate) fn parse_block_statement(&mut self) -> Result<BlockStmt, Error> {
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
            if !self.at_identifier_reference() {
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

    fn parse_for_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        let is_await = self.eat(Kind::Await);
        if !self.expect(Kind::LParen) {
            return Err(self.expected_error(Kind::LParen));
        }

        let init = if self.at(Kind::Semi) {
            None
        } else if matches!(self.kind(), Kind::Var | Kind::Let | Kind::Const) {
            Some(VarDeclOrExpr::VarDecl(self.with_context(
                Context::empty(),
                Context::IN,
                Self::parse_variable_declaration,
            )?))
        } else {
            Some(VarDeclOrExpr::Expr(self.with_context(
                Context::empty(),
                Context::IN,
                Self::parse_expression,
            )?))
        };

        if matches!(self.kind(), Kind::In | Kind::Of) {
            let operator = self.kind();
            if is_await && operator != Kind::Of {
                return Err(self.expected_error(Kind::Of));
            }
            let Some(init) = init else {
                return Err(self.expected_error(Kind::Ident));
            };
            // Plugin builds consume a non-exhaustive AST enum from another
            // crate, while workspace builds see the current variants.
            #[allow(unreachable_patterns)]
            let left = match init {
                VarDeclOrExpr::VarDecl(declaration) => ForHead::VarDecl(declaration),
                VarDeclOrExpr::Expr(expression) => ForHead::Pat(Box::new(Pat::Expr(expression))),
                _ => return Err(self.expected_error(Kind::Ident)),
            };
            self.advance();
            let right = self.parse_expression()?;
            if !self.expect(Kind::RParen) {
                return Err(self.expected_error(Kind::RParen));
            }
            let body = Box::new(self.with_context(
                Context::BREAK | Context::CONTINUE,
                Context::empty(),
                Self::parse_statement,
            )?);
            let span = Span::new_with_checked(start, body.span().hi);
            return Ok(if operator == Kind::In {
                Stmt::ForIn(ForInStmt {
                    span,
                    left,
                    right,
                    body,
                })
            } else {
                Stmt::ForOf(ForOfStmt {
                    span,
                    is_await,
                    left,
                    right,
                    body,
                })
            });
        }

        if is_await {
            return Err(self.expected_error(Kind::Of));
        }
        if !self.expect(Kind::Semi) {
            return Err(self.expected_error(Kind::Semi));
        }
        let test = if self.at(Kind::Semi) {
            None
        } else {
            Some(self.parse_expression()?)
        };
        if !self.expect(Kind::Semi) {
            return Err(self.expected_error(Kind::Semi));
        }
        let update = if self.at(Kind::RParen) {
            None
        } else {
            Some(self.parse_expression()?)
        };
        if !self.expect(Kind::RParen) {
            return Err(self.expected_error(Kind::RParen));
        }
        let body = Box::new(self.with_context(
            Context::BREAK | Context::CONTINUE,
            Context::empty(),
            Self::parse_statement,
        )?);
        Ok(Stmt::For(ForStmt {
            span: Span::new_with_checked(start, body.span().hi),
            init,
            test,
            update,
            body,
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

    fn parse_switch_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        let discriminant = self.parse_parenthesized_expression()?;
        if !self.expect(Kind::LBrace) {
            return Err(self.expected_error(Kind::LBrace));
        }

        let mut cases = Vec::with_capacity(4);
        while !self.at(Kind::RBrace) && !self.at(Kind::Eof) {
            let case_start = self.token().start();
            let test = if self.eat(Kind::Case) {
                Some(self.parse_expression()?)
            } else if self.eat(Kind::Default) {
                None
            } else {
                return Err(self.expected_error(Kind::Case));
            };
            if !self.expect(Kind::Colon) {
                return Err(self.expected_error(Kind::Colon));
            }

            let mut consequent = Vec::with_capacity(8);
            while !matches!(
                self.kind(),
                Kind::Case | Kind::Default | Kind::RBrace | Kind::Eof
            ) {
                consequent.push(self.with_context(
                    Context::BREAK,
                    Context::empty(),
                    Self::parse_statement,
                )?);
            }
            let end = consequent
                .last()
                .map_or(self.previous_end(), |statement| statement.span().hi);
            cases.push(SwitchCase {
                span: Span::new_with_checked(case_start, end),
                test,
                cons: consequent,
            });
        }

        if !self.expect(Kind::RBrace) {
            return Err(self.expected_error(Kind::RBrace));
        }
        Ok(Stmt::Switch(SwitchStmt {
            span: Span::new_with_checked(start, self.previous_end()),
            discriminant,
            cases,
        }))
    }

    fn parse_try_statement(&mut self) -> Result<Stmt, Error> {
        let start = self.token().start();
        self.advance();
        if !self.at(Kind::LBrace) {
            return Err(self.expected_error(Kind::LBrace));
        }
        let block = self.parse_block_statement()?;

        let catch_start = self.token().start();
        let handler = if self.eat(Kind::Catch) {
            let parameter = if self.eat(Kind::LParen) {
                let token = self.token();
                if !self.at_identifier_reference() {
                    return Err(self.expected_error(Kind::Ident));
                }
                let identifier =
                    Ident::new_no_ctxt(Atom::new(self.token_source(token)), token.span());
                self.advance();
                if !self.expect(Kind::RParen) {
                    return Err(self.expected_error(Kind::RParen));
                }
                Some(Pat::Ident(BindingIdent {
                    id: identifier,
                    type_ann: None,
                }))
            } else {
                None
            };
            if !self.at(Kind::LBrace) {
                return Err(self.expected_error(Kind::LBrace));
            }
            let body = self.parse_block_statement()?;
            Some(CatchClause {
                span: Span::new_with_checked(catch_start, body.span.hi),
                param: parameter,
                body,
            })
        } else {
            None
        };

        let finalizer = if self.eat(Kind::Finally) {
            if !self.at(Kind::LBrace) {
                return Err(self.expected_error(Kind::LBrace));
            }
            Some(self.parse_block_statement()?)
        } else {
            None
        };
        if handler.is_none() && finalizer.is_none() {
            return Err(self.expected_error(Kind::Catch));
        }
        let end = finalizer
            .as_ref()
            .map_or_else(|| handler.as_ref().unwrap().span.hi, |block| block.span.hi);
        Ok(Stmt::Try(Box::new(TryStmt {
            span: Span::new_with_checked(start, end),
            block,
            handler,
            finalizer,
        })))
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
        let declaration = self.parse_variable_declaration()?;
        self.consume_semicolon()?;
        Ok(Stmt::Decl(Decl::Var(declaration)))
    }

    fn parse_variable_declaration(&mut self) -> Result<Box<VarDecl>, Error> {
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
            if !self.at_identifier_reference() {
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

        Ok(Box::new(VarDecl {
            span: Span::new_with_checked(start, self.previous_end()),
            ctxt: SyntaxContext::empty(),
            kind,
            declare: false,
            decls: declarations,
        }))
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

    #[test]
    fn parses_switch_and_try_statements_directly() {
        let source = "switch (value) { case 1: break; default: throw error; } try { work(); } \
                      catch (error) { recover(error); } finally { cleanup(); }";
        let lexer = Lexer::new(source, BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let script = parser.parse_script().unwrap();

        let Stmt::Switch(switch_statement) = &script.body[0] else {
            panic!("expected switch statement")
        };
        assert_eq!(switch_statement.cases.len(), 2);
        assert!(switch_statement.cases[1].test.is_none());
        let Stmt::Try(try_statement) = &script.body[1] else {
            panic!("expected try statement")
        };
        assert!(try_statement.handler.is_some());
        assert!(try_statement.finalizer.is_some());
    }

    #[test]
    fn parses_for_statement_variants_directly() {
        let source = "for (let index = 0; index < 3; index = index + 1) work(index); for (const \
                      key in object) useKey(key); for await (const value of values) \
                      consume(value);";
        let lexer = Lexer::new(source, BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let script = parser.parse_script().unwrap();

        assert!(matches!(script.body[0], Stmt::For(_)));
        assert!(matches!(script.body[1], Stmt::ForIn(_)));
        let Stmt::ForOf(for_of) = &script.body[2] else {
            panic!("expected for-of statement")
        };
        assert!(for_of.is_await);
    }
}
