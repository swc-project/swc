//! Control flow statement parser implementation
//!
//! This module provides the implementation for parsing control flow statements,
//! including if, while, do-while, for, switch, try-catch, and jump statements.

use swc_common::Span;
use swc_ecma_ast as ast;

use super::{super::Parser, StmtParser};
use crate::{
    error::{Error, ErrorKind, Result},
    token::TokenType,
};

impl<'a> Parser<'a> {
    /// Parse an if statement: if (test) consequent else alternate
    fn parse_if_statement(&mut self) -> Result<ast::IfStmt> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::If)?; // Expect 'if'

        self.expect(TokenType::LParen)?; // Expect '('
        let test = self.parse_expression()?;
        self.expect(TokenType::RParen)?; // Expect ')'

        // Parse the consequent
        let consequent = self.parse_statement()?;

        // Parse the alternate if present
        let alternate = if self.is_token_type(TokenType::Else) {
            self.next_token(); // Skip 'else'
            Some(Box::new(self.parse_statement()?))
        } else {
            None
        };

        // Create the if statement
        let end_span = match &alternate {
            Some(alt) => alt.span(),
            None => consequent.span(),
        };

        Ok(ast::IfStmt {
            span: start_span.merge_with(end_span),
            test: Box::new(test),
            cons: Box::new(consequent),
            alt: alternate,
        })
    }

    /// Parse a switch statement: switch (discriminant) { case1: ... case2: ...
    /// }
    fn parse_switch_statement(&mut self) -> Result<ast::SwitchStmt> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::Switch)?; // Expect 'switch'

        self.expect(TokenType::LParen)?; // Expect '('
        let discriminant = self.parse_expression()?;
        self.expect(TokenType::RParen)?; // Expect ')'

        self.expect(TokenType::LBrace)?; // Expect '{'

        // Parse the cases
        let mut cases = Vec::new();
        let mut default_case = None;

        while !self.is_token_type(TokenType::RBrace) && !self.is_token_type(TokenType::EOF) {
            // Parse a case
            if self.is_token_type(TokenType::Case) {
                let case_span = self.cur_token.span;
                self.next_token(); // Skip 'case'

                // Parse the test expression
                let test = self.parse_expression()?;

                self.expect(TokenType::Colon)?; // Expect ':'

                // Parse the consequent statements
                let mut consequent = Vec::new();

                while !self.is_token_type(TokenType::Case)
                    && !self.is_token_type(TokenType::Default)
                    && !self.is_token_type(TokenType::RBrace)
                    && !self.is_token_type(TokenType::EOF)
                {
                    // Parse a statement
                    let stmt = self.parse_statement()?;
                    consequent.push(stmt);
                }

                // Create the case
                cases.push(ast::SwitchCase {
                    span: case_span.merge_with(if let Some(last) = consequent.last() {
                        last.span()
                    } else {
                        self.prev_token.span
                    }),
                    test: Some(Box::new(test)),
                    cons: consequent,
                });
            }
            // Parse a default case
            else if self.is_token_type(TokenType::Default) {
                let default_span = self.cur_token.span;
                self.next_token(); // Skip 'default'

                self.expect(TokenType::Colon)?; // Expect ':'

                // Parse the consequent statements
                let mut consequent = Vec::new();

                while !self.is_token_type(TokenType::Case)
                    && !self.is_token_type(TokenType::Default)
                    && !self.is_token_type(TokenType::RBrace)
                    && !self.is_token_type(TokenType::EOF)
                {
                    // Parse a statement
                    let stmt = self.parse_statement()?;
                    consequent.push(stmt);
                }

                // Check if there's already a default case
                if default_case.is_some() {
                    return Err(self.error(ErrorKind::General {
                        message: "Multiple default clauses in switch statement".into(),
                    }));
                }

                // Create the default case
                default_case = Some(ast::SwitchCase {
                    span: default_span.merge_with(if let Some(last) = consequent.last() {
                        last.span()
                    } else {
                        self.prev_token.span
                    }),
                    test: None,
                    cons: consequent,
                });
            }
            // Invalid case
            else {
                return Err(self.error(ErrorKind::UnexpectedToken {
                    expected: Some("'case' or 'default'"),
                    got: format!("{}", self.cur_token.token_type),
                }));
            }
        }

        // If we have a default case, add it to the cases
        if let Some(default) = default_case {
            cases.push(default);
        }

        let end_span = self.cur_token.span;
        self.expect(TokenType::RBrace)?; // Expect '}'

        // Create the switch statement
        Ok(ast::SwitchStmt {
            span: start_span.merge_with(end_span),
            discriminant: Box::new(discriminant),
            cases,
        })
    }

    /// Parse a for statement: for ([init]; [test]; [update]) body
    fn parse_for_statement(&mut self) -> Result<ast::Stmt> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::For)?; // Expect 'for'

        // Check for 'await' keyword (for-await-of loop)
        let await_token = if self.is_token_type(TokenType::Await) {
            if !self.in_async {
                return Err(self.error(ErrorKind::General {
                    message: "'for await' is only allowed within async functions and modules"
                        .into(),
                }));
            }

            self.next_token(); // Skip 'await'
            true
        } else {
            false
        };

        self.expect(TokenType::LParen)?; // Expect '('

        // Create a new scope for the for loop
        self.enter_scope(super::super::ScopeKind::Block);

        // Parse the initializer
        let init = if self.is_token_type(TokenType::Semicolon) {
            // No initializer
            None
        } else if self.is_token_type(TokenType::Var) {
            // Variable declaration initializer
            self.next_token(); // Skip 'var'
            let var_decl = self.parse_var_declarations()?;

            Some(ast::VarDeclOrExpr::VarDecl(ast::VarDecl {
                span: var_decl
                    .iter()
                    .fold(None, |acc, decl| match acc {
                        Some(span) => Some(span.merge_with(decl.span())),
                        None => Some(decl.span()),
                    })
                    .unwrap_or_else(|| Span::dummy()),
                kind: ast::VarDeclKind::Var,
                decls: var_decl,
                declare: false,
            }))
        } else if self.is_token_type(TokenType::Let) {
            // Let declaration initializer
            self.next_token(); // Skip 'let'
            let let_decl = self.parse_var_declarations()?;

            Some(ast::VarDeclOrExpr::VarDecl(ast::VarDecl {
                span: let_decl
                    .iter()
                    .fold(None, |acc, decl| match acc {
                        Some(span) => Some(span.merge_with(decl.span())),
                        None => Some(decl.span()),
                    })
                    .unwrap_or_else(|| Span::dummy()),
                kind: ast::VarDeclKind::Let,
                decls: let_decl,
                declare: false,
            }))
        } else if self.is_token_type(TokenType::Const) {
            // Const declaration initializer
            self.next_token(); // Skip 'const'
            let const_decl = self.parse_var_declarations()?;

            Some(ast::VarDeclOrExpr::VarDecl(ast::VarDecl {
                span: const_decl
                    .iter()
                    .fold(None, |acc, decl| match acc {
                        Some(span) => Some(span.merge_with(decl.span())),
                        None => Some(decl.span()),
                    })
                    .unwrap_or_else(|| Span::dummy()),
                kind: ast::VarDeclKind::Const,
                decls: const_decl,
                declare: false,
            }))
        } else {
            // Expression initializer
            let expr = self.parse_expression()?;

            // Check for for-in or for-of loop
            if self.is_token_type(TokenType::In)
                || (self.is_token_identifier_eq("of") && !await_token)
            {
                // Reset position and parse as a for-in or for-of loop
                return self.parse_for_in_of_statement(start_span, expr, false);
            } else if self.is_token_identifier_eq("of") && await_token {
                // Reset position and parse as a for-await-of loop
                return self.parse_for_in_of_statement(start_span, expr, true);
            }

            Some(ast::VarDeclOrExpr::Expr(Box::new(expr)))
        };

        // Check for for-in or for-of loop after variable declaration
        if let Some(ast::VarDeclOrExpr::VarDecl(var_decl)) = &init {
            if var_decl.decls.len() == 1 && self.is_token_type(TokenType::In) {
                // For-in loop
                return self.parse_for_in_of_statement_var(start_span, var_decl.clone(), false);
            } else if var_decl.decls.len() == 1 && self.is_token_identifier_eq("of") {
                // For-of loop
                return self.parse_for_in_of_statement_var(
                    start_span,
                    var_decl.clone(),
                    await_token,
                );
            }
        }

        // Regular for loop
        self.expect(TokenType::Semicolon)?; // Expect ';'

        // Parse the test expression
        let test = if !self.is_token_type(TokenType::Semicolon) {
            Some(Box::new(self.parse_expression()?))
        } else {
            None
        };

        self.expect(TokenType::Semicolon)?; // Expect ';'

        // Parse the update expression
        let update = if !self.is_token_type(TokenType::RParen) {
            Some(Box::new(self.parse_expression()?))
        } else {
            None
        };

        self.expect(TokenType::RParen)?; // Expect ')'

        // Parse the body
        let body = self.parse_statement()?;

        // Exit the for loop scope
        self.exit_scope();

        // Create the for statement
        Ok(ast::Stmt::For(ast::ForStmt {
            span: start_span.merge_with(body.span()),
            init,
            test,
            update,
            body: Box::new(body),
        }))
    }

    /// Parse a while statement: while (test) body
    fn parse_while_statement(&mut self) -> Result<ast::WhileStmt> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::While)?; // Expect 'while'

        self.expect(TokenType::LParen)?; // Expect '('
        let test = self.parse_expression()?;
        self.expect(TokenType::RParen)?; // Expect ')'

        // Parse the body
        let body = self.parse_statement()?;

        // Create the while statement
        Ok(ast::WhileStmt {
            span: start_span.merge_with(body.span()),
            test: Box::new(test),
            body: Box::new(body),
        })
    }

    /// Parse a do-while statement: do body while (test);
    fn parse_do_while_statement(&mut self) -> Result<ast::DoWhileStmt> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::Do)?; // Expect 'do'

        // Parse the body
        let body = self.parse_statement()?;

        self.expect(TokenType::While)?; // Expect 'while'
        self.expect(TokenType::LParen)?; // Expect '('
        let test = self.parse_expression()?;
        self.expect(TokenType::RParen)?; // Expect ')'

        self.consume_semicolon(); // Consume semicolon

        // Create the do-while statement
        Ok(ast::DoWhileStmt {
            span: start_span.merge_with(self.prev_token.span),
            test: Box::new(test),
            body: Box::new(body),
        })
    }

    /// Parse a try statement: try block catch finally
    fn parse_try_statement(&mut self) -> Result<ast::TryStmt> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::Try)?; // Expect 'try'

        // Parse the try block
        let block = self.parse_block_stmt()?;

        // Parse the handler (catch block) if present
        let handler = if self.is_token_type(TokenType::Catch) {
            let catch_start = self.cur_token.span;
            self.next_token(); // Skip 'catch'

            // Parse the catch parameter if present
            let param = if self.is_token_type(TokenType::LParen) {
                self.next_token(); // Skip '('

                // Create a new scope for the catch block
                self.enter_scope(super::super::ScopeKind::Block);

                // Parse the catch parameter
                let param = self.parse_binding_pattern()?;

                self.expect(TokenType::RParen)?; // Expect ')'

                Some(param)
            } else {
                None
            };

            // Parse the catch block
            let body = self.parse_block_stmt()?;

            // Exit the catch scope if we created one
            if param.is_some() {
                self.exit_scope();
            }

            // Create the catch clause
            Some(ast::CatchClause {
                span: catch_start.merge_with(body.span),
                param,
                body,
            })
        } else {
            None
        };

        // Parse the finalizer (finally block) if present
        let finalizer = if self.is_token_type(TokenType::Finally) {
            self.next_token(); // Skip 'finally'

            // Parse the finally block
            Some(self.parse_block_stmt()?)
        } else {
            None
        };

        // Either a catch block or a finally block must be present
        if handler.is_none() && finalizer.is_none() {
            return Err(self.error(ErrorKind::General {
                message: "Missing catch or finally after try".into(),
            }));
        }

        // Create the try statement
        let end_span = match &finalizer {
            Some(finally) => finally.span,
            None => match &handler {
                Some(catch) => catch.span,
                None => unreachable!("Either catch or finally must be present"),
            },
        };

        Ok(ast::TryStmt {
            span: start_span.merge_with(end_span),
            block,
            handler,
            finalizer,
        })
    }

    /// Parse a with statement: with (object) body
    fn parse_with_statement(&mut self) -> Result<ast::WithStmt> {
        // With statements are not allowed in strict mode
        if self.strict_mode {
            return Err(self.error(ErrorKind::General {
                message: "'with' statements are not allowed in strict mode".into(),
            }));
        }

        let start_span = self.cur_token.span;
        self.expect(TokenType::With)?; // Expect 'with'

        self.expect(TokenType::LParen)?; // Expect '('
        let object = self.parse_expression()?;
        self.expect(TokenType::RParen)?; // Expect ')'

        // Parse the body
        let body = self.parse_statement()?;

        // Create the with statement
        Ok(ast::WithStmt {
            span: start_span.merge_with(body.span()),
            object: Box::new(object),
            body: Box::new(body),
        })
    }

    /// Parse a break statement: break [label];
    fn parse_break_statement(&mut self) -> Result<ast::BreakStmt> {
        // Break statements are only allowed in loops or switch statements
        if !self.in_iteration && !self.in_switch {
            return Err(self.error(ErrorKind::General {
                message: "Illegal break statement outside of a loop or switch".into(),
            }));
        }

        let start_span = self.cur_token.span;
        self.expect(TokenType::Break)?; // Expect 'break'

        // Parse the label if present
        let label = if !self.can_insert_semicolon() && self.is_token_identifier() {
            let label = self.parse_identifier_name()?;

            // Check if the label exists
            if !self.has_label(&label.sym.to_string()) {
                return Err(self.error(ErrorKind::General {
                    message: format!("Undefined label '{}'", label.sym),
                }));
            }

            Some(label)
        } else {
            None
        };

        self.consume_semicolon(); // Consume semicolon

        // Create the break statement
        Ok(ast::BreakStmt {
            span: start_span.merge_with(self.prev_token.span),
            label,
        })
    }

    /// Parse a continue statement: continue [label];
    fn parse_continue_statement(&mut self) -> Result<ast::ContinueStmt> {
        // Continue statements are only allowed in loops
        if !self.in_iteration {
            return Err(self.error(ErrorKind::General {
                message: "Illegal continue statement outside of a loop".into(),
            }));
        }

        let start_span = self.cur_token.span;
        self.expect(TokenType::Continue)?; // Expect 'continue'

        // Parse the label if present
        let label = if !self.can_insert_semicolon() && self.is_token_identifier() {
            let label = self.parse_identifier_name()?;

            // Check if the label exists
            if !self.has_label(&label.sym.to_string()) {
                return Err(self.error(ErrorKind::General {
                    message: format!("Undefined label '{}'", label.sym),
                }));
            }

            Some(label)
        } else {
            None
        };

        self.consume_semicolon(); // Consume semicolon

        // Create the continue statement
        Ok(ast::ContinueStmt {
            span: start_span.merge_with(self.prev_token.span),
            label,
        })
    }

    /// Parse a return statement: return [expr];
    fn parse_return_statement(&mut self) -> Result<ast::ReturnStmt> {
        // Return statements are only allowed in functions
        if !self.in_function {
            return Err(self.error(ErrorKind::General {
                message: "Illegal return statement outside of a function".into(),
            }));
        }

        let start_span = self.cur_token.span;
        self.expect(TokenType::Return)?; // Expect 'return'

        // Parse the return value if present
        let arg = if !self.can_insert_semicolon()
            && !self.is_token_type(TokenType::RBrace)
            && !self.is_token_type(TokenType::Semicolon)
        {
            Some(Box::new(self.parse_expression()?))
        } else {
            None
        };

        self.consume_semicolon(); // Consume semicolon

        // Create the return statement
        Ok(ast::ReturnStmt {
            span: start_span.merge_with(self.prev_token.span),
            arg,
        })
    }

    /// Parse a throw statement: throw expr;
    fn parse_throw_statement(&mut self) -> Result<ast::ThrowStmt> {
        let start_span = self.cur_token.span;
        self.expect(TokenType::Throw)?; // Expect 'throw'

        // ASI doesn't apply to throw statements
        if self.cur_token.had_line_break {
            return Err(self.error(ErrorKind::General {
                message: "Illegal newline after throw".into(),
            }));
        }

        // Parse the throw argument
        let arg = self.parse_expression()?;

        self.consume_semicolon(); // Consume semicolon

        // Create the throw statement
        Ok(ast::ThrowStmt {
            span: start_span.merge_with(self.prev_token.span),
            arg: Box::new(arg),
        })
    }
}

impl<'a> Parser<'a> {
    /// Parse a for-in or for-of statement with a left-hand expression
    fn parse_for_in_of_statement(
        &mut self,
        start_span: Span,
        left: ast::Expr,
        is_await: bool,
    ) -> Result<ast::Stmt> {
        // Check the type of loop
        let is_for_in = self.is_token_type(TokenType::In);

        // Convert left expression to a pattern if possible
        let left = match left.as_pat() {
            Ok(pat) => pat,
            Err(_) => {
                return Err(self.error(ErrorKind::General {
                    message: "Invalid left-hand side in for-in/for-of loop".into(),
                }));
            }
        };

        self.next_token(); // Skip 'in' or 'of'

        // Parse the right expression
        let right = self.parse_expression()?;

        self.expect(TokenType::RParen)?; // Expect ')'

        // Parse the body
        let body = self.parse_statement()?;

        // Create the appropriate loop statement
        if is_for_in {
            // For-in loop
            Ok(ast::Stmt::ForIn(ast::ForInStmt {
                span: start_span.merge_with(body.span()),
                left: ast::VarDeclOrPat::Pat(left),
                right: Box::new(right),
                body: Box::new(body),
            }))
        } else {
            // For-of loop
            Ok(ast::Stmt::ForOf(ast::ForOfStmt {
                span: start_span.merge_with(body.span()),
                is_await,
                left: ast::VarDeclOrPat::Pat(left),
                right: Box::new(right),
                body: Box::new(body),
            }))
        }
    }

    /// Parse a for-in or for-of statement with a variable declaration
    fn parse_for_in_of_statement_var(
        &mut self,
        start_span: Span,
        left: ast::VarDecl,
        is_await: bool,
    ) -> Result<ast::Stmt> {
        // Check the type of loop
        let is_for_in = self.is_token_type(TokenType::In);

        self.next_token(); // Skip 'in' or 'of'

        // Parse the right expression
        let right = self.parse_expression()?;

        self.expect(TokenType::RParen)?; // Expect ')'

        // Parse the body
        let body = self.parse_statement()?;

        // Create the appropriate loop statement
        if is_for_in {
            // For-in loop
            Ok(ast::Stmt::ForIn(ast::ForInStmt {
                span: start_span.merge_with(body.span()),
                left: ast::VarDeclOrPat::VarDecl(left),
                right: Box::new(right),
                body: Box::new(body),
            }))
        } else {
            // For-of loop
            Ok(ast::Stmt::ForOf(ast::ForOfStmt {
                span: start_span.merge_with(body.span()),
                is_await,
                left: ast::VarDeclOrPat::VarDecl(left),
                right: Box::new(right),
                body: Box::new(body),
            }))
        }
    }
}
