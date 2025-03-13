//! Statement parser implementation
//!
//! This module contains methods for parsing JavaScript statements.

use swc_atoms::Atom;
use swc_common::{Span, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::{
    BlockStmt, Expr, ExprStmt, Ident, Pat, ReturnStmt, Stmt, VarDecl, VarDeclKind, VarDeclarator,
};

use crate::{
    error::{Error, ErrorKind, Result},
    parser::{util, util::GetSpan, Parser},
    token::{Token, TokenType, TokenValue},
    util::{likely, unlikely},
};

impl<'a> Parser<'a> {
    /// Parse a statement
    pub fn parse_stmt(&mut self) -> Result<Stmt> {
        match self.current_token_type() {
            TokenType::LBrace => self.parse_block_stmt(),
            TokenType::Return => self.parse_return_stmt(),
            TokenType::Var => self.parse_var_decl_stmt(VarDeclKind::Var),
            TokenType::Let => self.parse_var_decl_stmt(VarDeclKind::Let),
            TokenType::Const => self.parse_var_decl_stmt(VarDeclKind::Const),
            // Other statement types will be added here
            _ => self.parse_expr_stmt(),
        }
    }

    /// Parse a block statement
    fn parse_block_stmt(&mut self) -> Result<Stmt> {
        let start_span = self.current_span();
        self.next()?; // Consume '{'

        let mut stmts = Vec::new();

        // Parse statements until we reach '}'
        while !self.is(TokenType::RBrace) {
            let stmt = self.parse_stmt()?;
            stmts.push(stmt);
        }

        let end_span = self.current_span();
        self.next()?; // Consume '}'

        let span = Span::new(start_span.lo, end_span.hi);
        Ok(Stmt::Block(BlockStmt {
            span,
            stmts,
            ctxt: SyntaxContext::empty(),
        }))
    }

    /// Parse a return statement
    fn parse_return_stmt(&mut self) -> Result<Stmt> {
        let start_span = self.current_span();
        self.next()?; // Consume 'return'

        // Check if there's an expression after 'return'
        let arg = if self.is(TokenType::Semi)
            || self.is(TokenType::RBrace)
            || self.is_line_terminator()
        {
            None
        } else {
            Some(self.parse_expr()?)
        };

        // Consume semicolon if present
        if self.is(TokenType::Semi) {
            self.next()?;
        }

        let end_span = match &arg {
            Some(expr) => expr.span(),
            None => start_span,
        };

        let span = Span::new(start_span.lo, end_span.hi);
        Ok(Stmt::Return(ReturnStmt { span, arg }))
    }

    /// Parse an expression statement
    fn parse_expr_stmt(&mut self) -> Result<Stmt> {
        let expr = self.parse_expr()?;
        let span = expr.span();

        // Consume semicolon if present
        if self.is(TokenType::Semi) {
            self.next()?;
        }

        Ok(Stmt::Expr(ExprStmt { span, expr }))
    }

    /// Parse a variable declaration statement
    fn parse_var_decl_stmt(&mut self, kind: VarDeclKind) -> Result<Stmt> {
        let start_span = self.current_span();
        self.next()?; // Consume 'var', 'let', or 'const'

        let mut decls = Vec::new();

        // Parse variable declarations
        loop {
            let decl = self.parse_var_declarator()?;
            decls.push(decl);

            // Check if there are more declarations
            if self.is(TokenType::Comma) {
                self.next()?; // Consume ','
            } else {
                break;
            }
        }

        // Consume semicolon if present
        if self.is(TokenType::Semi) {
            self.next()?;
        }

        let end_span = match decls.last() {
            Some(decl) => match &decl.init {
                Some(init) => init.span(),
                None => decl.name.span(),
            },
            None => start_span,
        };

        let span = Span::new(start_span.lo, end_span.hi);
        Ok(Stmt::Decl(swc_ecma_ast::Decl::Var(Box::new(VarDecl {
            span,
            kind,
            declare: false,
            decls,
            ctxt: SyntaxContext::empty(),
        }))))
    }

    /// Parse a variable declarator
    fn parse_var_declarator(&mut self) -> Result<VarDeclarator> {
        // Parse the variable name (pattern)
        let name = self.parse_pat()?;
        let name_span = name.span();

        // Check if there's an initializer
        let init = if self.is(TokenType::Eq) {
            self.next()?; // Consume '='
            Some(self.parse_expr()?)
        } else {
            None
        };

        let span = match &init {
            Some(expr) => {
                let expr_span = expr.span();
                Span::new(name_span.lo, expr_span.hi)
            }
            None => name_span,
        };

        Ok(VarDeclarator {
            span,
            name,
            init,
            definite: false,
        })
    }

    /// Check if the current token is a line terminator
    fn is_line_terminator(&self) -> bool {
        // In a real implementation, this would check if there's a line terminator
        // between the current token and the previous token
        false
    }
}
