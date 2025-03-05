//! Statement parser module
//!
//! This module contains implementations for parsing JavaScript statements.

use swc_common::Span;
use swc_ecma_ast as ast;

use super::Parser;
use crate::{
    error::{Error, ErrorKind, Result},
    token::{Token, TokenType, TokenValue},
};

// Sub-modules
mod block;
mod control;
mod decl;
mod expr;

impl<'a> Parser<'a> {
    /// Parse a statement
    pub(crate) fn parse_statement(&mut self) -> Result<ast::Stmt> {
        match self.cur_token.token_type {
            // Block statement: { ... }
            TokenType::LBrace => {
                let block = self.parse_block_stmt()?;
                Ok(ast::Stmt::Block(block))
            }

            // Empty statement: ;
            TokenType::Semi => {
                let empty = self.parse_empty_statement()?;
                Ok(ast::Stmt::Empty(empty))
            }

            // Variable declarations
            TokenType::Var => {
                let decl = self.parse_var_declaration()?;
                Ok(ast::Stmt::Decl(ast::Decl::Var(decl)))
            }
            TokenType::Let => {
                let decl = self.parse_let_declaration()?;
                Ok(ast::Stmt::Decl(ast::Decl::Var(decl)))
            }
            TokenType::Const => {
                let decl = self.parse_const_declaration()?;
                Ok(ast::Stmt::Decl(ast::Decl::Var(decl)))
            }

            // Function declaration
            TokenType::Function => {
                let decl = self.parse_function_declaration(false, false)?;
                Ok(ast::Stmt::Decl(ast::Decl::Fn(decl)))
            }
            TokenType::Async => {
                // Check if it's an async function declaration
                if self.peek_token().token_type == TokenType::Function {
                    self.next_token(); // Skip 'async'
                    let decl = self.parse_function_declaration(true, false)?;
                    return Ok(ast::Stmt::Decl(ast::Decl::Fn(decl)));
                }

                // Otherwise, it's an expression statement
                let expr = self.parse_expression_statement()?;
                Ok(ast::Stmt::Expr(expr))
            }

            // Class declaration
            TokenType::Class => {
                let decl = self.parse_class_declaration()?;
                Ok(ast::Stmt::Decl(ast::Decl::Class(decl)))
            }

            // Control flow statements
            TokenType::If => {
                let stmt = self.parse_if_statement()?;
                Ok(ast::Stmt::If(stmt))
            }
            TokenType::Switch => {
                let stmt = self.parse_switch_statement()?;
                Ok(ast::Stmt::Switch(stmt))
            }
            TokenType::For => {
                let stmt = self.parse_for_statement()?;
                Ok(stmt)
            }
            TokenType::While => {
                let stmt = self.parse_while_statement()?;
                Ok(ast::Stmt::While(stmt))
            }
            TokenType::Do => {
                let stmt = self.parse_do_while_statement()?;
                Ok(ast::Stmt::DoWhile(stmt))
            }
            TokenType::Try => {
                let stmt = self.parse_try_statement()?;
                Ok(ast::Stmt::Try(stmt))
            }
            TokenType::With => {
                let stmt = self.parse_with_statement()?;
                Ok(ast::Stmt::With(stmt))
            }
            TokenType::Break => {
                let stmt = self.parse_break_statement()?;
                Ok(ast::Stmt::Break(stmt))
            }
            TokenType::Continue => {
                let stmt = self.parse_continue_statement()?;
                Ok(ast::Stmt::Continue(stmt))
            }
            TokenType::Return => {
                let stmt = self.parse_return_statement()?;
                Ok(ast::Stmt::Return(stmt))
            }
            TokenType::Throw => {
                let stmt = self.parse_throw_statement()?;
                Ok(ast::Stmt::Throw(stmt))
            }

            // Debugger statement
            TokenType::Debugger => {
                let stmt = self.parse_debugger_statement()?;
                Ok(ast::Stmt::Debugger(stmt))
            }

            // Labeled statement
            TokenType::Ident => {
                // Check if the next token is a colon
                if self.peek_token().token_type == TokenType::Colon {
                    let stmt = self.parse_labeled_statement()?;
                    return Ok(ast::Stmt::Labeled(stmt));
                }

                // Otherwise, it's an expression statement
                let expr = self.parse_expression_statement()?;
                Ok(ast::Stmt::Expr(expr))
            }

            // Export statement (only in modules)
            TokenType::Export => {
                if !self.in_module {
                    return Err(self.error(ErrorKind::General {
                        message: "'export' is only allowed in modules".into(),
                    }));
                }

                // Export declarations are not implemented in this simplified version
                return Err(self.error(ErrorKind::General {
                    message: "Export declarations are not fully implemented".into(),
                }));
            }

            // Import statement (only in modules)
            TokenType::Import => {
                if !self.in_module {
                    return Err(self.error(ErrorKind::General {
                        message: "'import' is only allowed in modules".into(),
                    }));
                }

                // Import declarations are not implemented in this simplified version
                return Err(self.error(ErrorKind::General {
                    message: "Import declarations are not fully implemented".into(),
                }));
            }

            // Default: expression statement
            _ => {
                let expr = self.parse_expression_statement()?;
                Ok(ast::Stmt::Expr(expr))
            }
        }
    }

    /// Parse a module
    pub(crate) fn parse_module(&mut self) -> Result<ast::Program> {
        // Set module mode
        self.in_module = true;

        // In ES6, modules are always in strict mode
        self.strict_mode = true;

        // Create a module scope
        self.enter_scope(super::ScopeKind::Module);

        // Parse the module body
        let body = self.parse_module_items()?;

        // Exit the module scope
        self.exit_scope();

        // Create the module program
        Ok(ast::Program::Module(ast::Module {
            span: body
                .iter()
                .fold(None, |acc, item| {
                    let item_span = match item {
                        ast::ModuleItem::ModuleDecl(decl) => match decl {
                            ast::ModuleDecl::Import(import) => import.span,
                            ast::ModuleDecl::ExportDecl(export) => export.span,
                            ast::ModuleDecl::ExportNamed(export) => export.span,
                            ast::ModuleDecl::ExportDefaultDecl(export) => export.span,
                            ast::ModuleDecl::ExportDefaultExpr(export) => export.span,
                            ast::ModuleDecl::ExportAll(export) => export.span,
                            ast::ModuleDecl::TsImportEquals(_) => unreachable!("Not implemented"),
                            ast::ModuleDecl::TsExportAssignment(_) => {
                                unreachable!("Not implemented")
                            }
                            ast::ModuleDecl::TsNamespaceExport(_) => {
                                unreachable!("Not implemented")
                            }
                        },
                        ast::ModuleItem::Stmt(stmt) => stmt.span(),
                    };

                    match acc {
                        Some(acc) => Some(acc.merge_with(item_span)),
                        None => Some(item_span),
                    }
                })
                .unwrap_or_else(|| Span::dummy()),
            body,
            shebang: None,
        }))
    }

    /// Parse a script
    pub(crate) fn parse_script(&mut self) -> Result<ast::Program> {
        // Set script mode
        self.in_module = false;

        // Create a script scope
        self.enter_scope(super::ScopeKind::Script);

        // Parse the script body
        let mut body = Vec::new();

        while !self.is_token_type(TokenType::EOF) {
            // Parse a statement
            match self.parse_statement() {
                Ok(stmt) => body.push(stmt),
                Err(err) => {
                    // Report the error but continue parsing
                    self.report_error(err);
                    self.error_recovery();
                }
            }
        }

        // Exit the script scope
        self.exit_scope();

        // Create the script program
        Ok(ast::Program::Script(ast::Script {
            span: body
                .iter()
                .fold(None, |acc, stmt| {
                    let stmt_span = stmt.span();
                    match acc {
                        Some(acc) => Some(acc.merge_with(stmt_span)),
                        None => Some(stmt_span),
                    }
                })
                .unwrap_or_else(|| Span::dummy()),
            body,
            shebang: None,
        }))
    }

    /// Parse an empty statement (;)
    pub(crate) fn parse_empty_statement(&mut self) -> Result<ast::EmptyStmt> {
        let span = self.cur_token.span;
        self.expect(TokenType::Semi)?; // Expect ';'

        Ok(ast::EmptyStmt { span })
    }

    /// Parse a debugger statement
    pub(crate) fn parse_debugger_statement(&mut self) -> Result<ast::DebuggerStmt> {
        let span = self.cur_token.span;
        self.expect(TokenType::Debugger)?; // Expect 'debugger'

        self.consume_semicolon(); // Consume semicolon

        Ok(ast::DebuggerStmt {
            span: span.merge_with(self.prev_token.span),
        })
    }

    /// Parse a labeled statement: label: stmt
    pub(crate) fn parse_labeled_statement(&mut self) -> Result<ast::LabeledStmt> {
        let label = self.parse_identifier_name()?;

        self.expect(TokenType::Colon)?; // Expect ':'

        // Check for duplicate label
        if self.has_label(&label.sym.to_string()) {
            return Err(self.error(ErrorKind::General {
                message: format!("Label '{}' has already been declared", label.sym),
            }));
        }

        // Add the label to the current scope
        self.add_label(label.sym.to_string());

        // Parse the labeled statement
        let body = self.parse_statement()?;

        // Create the labeled statement
        Ok(ast::LabeledStmt {
            span: label.span.merge_with(body.span()),
            label,
            body: Box::new(body),
        })
    }

    /// Consume a semicolon (either explicit or automatic semicolon insertion)
    fn consume_semicolon(&mut self) -> bool {
        if self.is_token_type(TokenType::Semi) {
            self.next_token(); // Skip explicit semicolon
            return true;
        }

        // Automatic Semicolon Insertion (ASI) rules
        if self.can_insert_semicolon() {
            return true;
        }

        // If the next token is } or EOF, we can insert a semicolon
        if self.is_token_type(TokenType::RBrace) || self.is_token_type(TokenType::EOF) {
            return true;
        }

        // Otherwise, we need an explicit semicolon
        self.report_error(self.error(ErrorKind::UnexpectedToken {
            expected: Some(";"),
            got: format!("{}", self.cur_token.token_type),
        }));

        false
    }

    /// Check if a semicolon can be automatically inserted
    fn can_insert_semicolon(&self) -> bool {
        // ASI applies if:
        // 1. There's a line break before the next token
        // 2. The next token is } (end of block)
        // 3. The next token is EOF (end of input)
        self.cur_token.had_line_break
            || self.is_token_type(TokenType::RBrace)
            || self.is_token_type(TokenType::EOF)
    }

    /// Error recovery - skip to the next statement
    fn error_recovery(&mut self) {
        // Skip tokens until we find a good synchronization point
        while !self.is_token_type(TokenType::EOF) {
            // Good synchronization points: semicolon, block start/end, some statements
            if self.is_token_type(TokenType::Semi)
                || self.is_token_type(TokenType::RBrace)
                || self.is_token_type(TokenType::LBrace)
                || self.is_token_type(TokenType::Function)
                || self.is_token_type(TokenType::Class)
                || self.is_token_type(TokenType::If)
                || self.is_token_type(TokenType::For)
                || self.is_token_type(TokenType::While)
                || self.is_token_type(TokenType::Do)
                || self.is_token_type(TokenType::Try)
                || self.is_token_type(TokenType::Switch)
                || self.is_token_type(TokenType::Var)
                || self.is_token_type(TokenType::Let)
                || self.is_token_type(TokenType::Const)
            {
                // Found a synchronization point
                if self.is_token_type(TokenType::Semi) {
                    self.next_token(); // Skip the semicolon
                }
                break;
            }

            // Skip the token and continue
            self.next_token();
        }
    }
}

impl<'a> Parser<'a> {
    /// Parse module items
    pub(crate) fn parse_module_items(&mut self) -> Result<Vec<ast::ModuleItem>> {
        let mut body = Vec::new();

        while !self.is_token_type(TokenType::EOF) {
            // Parse a module item
            match self.parse_module_item() {
                Ok(item) => body.push(item),
                Err(err) => {
                    // Report the error but continue parsing
                    self.report_error(err);
                    self.error_recovery();
                }
            }
        }

        Ok(body)
    }

    /// Parse a module item (statement or module-specific declaration)
    pub(crate) fn parse_module_item(&mut self) -> Result<ast::ModuleItem> {
        // Check for import or export declarations
        match self.cur_token.token_type {
            TokenType::Import => {
                // Import declarations are not implemented in this simplified version
                return Err(self.error(ErrorKind::General {
                    message: "Import declarations are not fully implemented".into(),
                }));
            }
            TokenType::Export => {
                // Export declarations are not implemented in this simplified version
                return Err(self.error(ErrorKind::General {
                    message: "Export declarations are not fully implemented".into(),
                }));
            }
            _ => {
                // Regular statement
                let stmt = self.parse_statement()?;
                Ok(ast::ModuleItem::Stmt(stmt))
            }
        }
    }
}
