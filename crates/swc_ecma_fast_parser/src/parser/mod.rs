//! ECMAScript/TypeScript parser implementation
//!
//! This module provides the core parser implementation for ECMAScript and
//! TypeScript.

use std::collections::HashSet;

use swc_common::{errors::Handler, Span};
use swc_ecma_ast as ast;

use crate::{
    error::{Error, ErrorKind, Result},
    lexer::Lexer,
    token::{Token, TokenType, TokenValue},
    Syntax,
};

// Sub-modules
pub(crate) mod expr;
mod stmt;

/// Scope kind for keeping track of different kinds of scopes
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum ScopeKind {
    /// Global scope
    Global,
    /// Module scope
    Module,
    /// Script scope
    Script,
    /// Function scope
    Function,
    /// Class scope
    Class,
    /// Block scope
    Block,
    /// Catch clause scope
    Catch,
    /// Loop scope (for for-in/of/loop)
    For,
    /// Switch scope
    Switch,
}

/// Scope for tracking variables, labels, etc.
#[derive(Debug, Clone)]
pub(crate) struct Scope {
    /// Kind of scope
    kind: ScopeKind,

    /// Set of labels declared in this scope
    labels: HashSet<String>,

    /// Parent scope
    parent: Option<Box<Scope>>,
}

impl Scope {
    /// Create a new scope
    fn new(kind: ScopeKind, parent: Option<Box<Scope>>) -> Self {
        Self {
            kind,
            labels: HashSet::new(),
            parent,
        }
    }

    /// Check if a label exists in this scope or any parent scope
    fn has_label(&self, label: &str) -> bool {
        if self.labels.contains(label) {
            return true;
        }

        if let Some(ref parent) = self.parent {
            return parent.has_label(label);
        }

        false
    }

    /// Add a label to this scope
    fn add_label(&mut self, label: String) {
        self.labels.insert(label);
    }
}

/// ECMAScript/TypeScript parser
pub struct Parser<'a> {
    /// Lexer for tokenizing the input
    lexer: Lexer<'a>,

    /// Error handler
    handler: &'a Handler,

    /// Current token
    cur_token: Token,

    /// Previous token
    prev_token: Token,

    /// Syntax configuration
    syntax: Syntax,

    /// Current scope
    scope: Scope,

    /// Strict mode flag
    pub(crate) strict_mode: bool,

    /// In module flag
    pub(crate) in_module: bool,

    /// In function flag
    pub(crate) in_function: bool,

    /// In async function flag
    pub(crate) in_async: bool,

    /// In generator function flag
    pub(crate) in_generator: bool,

    /// In constructor flag
    pub(crate) in_constructor: bool,

    /// In method flag
    pub(crate) in_method: bool,

    /// In loop flag
    pub(crate) in_loop: bool,

    /// In switch flag
    pub(crate) in_switch: bool,
}

impl<'a> Parser<'a> {
    /// Create a new parser
    pub fn new(lexer: Lexer<'a>, handler: &'a Handler, syntax: Syntax) -> Self {
        let mut parser = Self {
            lexer,
            handler,
            cur_token: Token::default(),
            prev_token: Token::default(),
            syntax,
            scope: Scope::new(ScopeKind::Global, None),
            strict_mode: false,
            in_module: false,
            in_function: false,
            in_async: false,
            in_generator: false,
            in_constructor: false,
            in_method: false,
            in_loop: false,
            in_switch: false,
        };

        // Initialize the current token
        parser.next_token();

        parser
    }

    /// Advance to the next token
    pub fn next_token(&mut self) {
        self.prev_token = std::mem::take(&mut self.cur_token);
        self.cur_token = self.lexer.next_token().unwrap_or_else(|e| {
            // Report the error but continue with a dummy token
            self.report_error(e);
            Token::default()
        });
    }

    /// Look ahead to the next token without consuming it
    pub fn peek_token(&self) -> Token {
        self.lexer.peek_token().unwrap_or_default()
    }

    /// Look ahead n tokens without consuming them
    pub fn peek_token_n(&self, n: usize) -> Option<Token> {
        self.lexer.peek_token_n(n).ok()
    }

    /// Create an error
    pub fn error(&self, kind: ErrorKind) -> Error {
        Error::new(kind, self.cur_token.span)
    }

    /// Report an error using the handler
    pub fn report_error(&self, error: Error) {
        self.handler.struct_err(&error.to_string()).emit();
    }

    /// Check if the current token has the given type
    pub fn is_token_type(&self, token_type: TokenType) -> bool {
        self.cur_token.token_type == token_type
    }

    /// Check if the current token is an identifier
    pub fn is_token_identifier(&self) -> bool {
        self.cur_token.token_type == TokenType::Ident
    }

    /// Check if the current token is an identifier with the given name
    pub fn is_token_identifier_eq(&self, name: &str) -> bool {
        if let TokenValue::Ident(ref ident) = self.cur_token.value {
            ident == name
        } else {
            false
        }
    }

    /// Expect the current token to have the given type and advance
    pub fn expect(&mut self, token_type: TokenType) -> Result<()> {
        if self.is_token_type(token_type) {
            self.next_token();
            Ok(())
        } else {
            Err(self.error(ErrorKind::UnexpectedToken {
                expected: Some(format!("{}", token_type)),
                got: format!("{}", self.cur_token.token_type),
            }))
        }
    }

    /// Enter a new scope
    pub fn enter_scope(&mut self, kind: ScopeKind) {
        let parent = Some(Box::new(std::mem::replace(
            &mut self.scope,
            Scope::new(kind, None),
        )));
        self.scope.parent = parent;
    }

    /// Exit the current scope
    pub fn exit_scope(&mut self) {
        if let Some(parent) = std::mem::take(&mut self.scope.parent) {
            self.scope = *parent;
        } else {
            // This should never happen if scopes are balanced
            self.scope = Scope::new(ScopeKind::Global, None);
        }
    }

    /// Add a label to the current scope
    pub fn add_label(&mut self, label: String) {
        self.scope.add_label(label);
    }

    /// Check if a label exists in the current scope chain
    pub fn has_label(&self, label: &str) -> bool {
        self.scope.has_label(label)
    }

    /// Parse an identifier name
    pub fn parse_identifier_name(&mut self) -> Result<ast::Ident> {
        if !self.is_token_identifier() {
            return Err(self.error(ErrorKind::UnexpectedToken {
                expected: Some("identifier"),
                got: format!("{}", self.cur_token.token_type),
            }));
        }

        let span = self.cur_token.span;
        let sym = match &self.cur_token.value {
            TokenValue::Ident(name) => name.clone().into(),
            _ => unreachable!("Token is not an identifier"),
        };

        self.next_token(); // Consume the identifier

        Ok(ast::Ident {
            span,
            sym,
            optional: false,
        })
    }

    /// Parse an identifier reference
    pub fn parse_identifier_reference(&mut self) -> Result<ast::Expr> {
        let ident = self.parse_identifier_name()?;
        Ok(ast::Expr::Ident(ident))
    }

    /// Parse a literal (string, number, boolean, null, etc.)
    pub fn parse_literal(&mut self) -> Result<ast::Expr> {
        let span = self.cur_token.span;

        match self.cur_token.token_type {
            TokenType::Str => {
                let str_lit = self.parse_string_literal()?;
                Ok(ast::Expr::Lit(ast::Lit::Str(str_lit)))
            }
            TokenType::Num => {
                let num_lit = self.parse_number_literal()?;
                Ok(ast::Expr::Lit(ast::Lit::Num(num_lit)))
            }
            TokenType::True => {
                self.next_token(); // Consume 'true'
                Ok(ast::Expr::Lit(ast::Lit::Bool(ast::Bool {
                    span,
                    value: true,
                })))
            }
            TokenType::False => {
                self.next_token(); // Consume 'false'
                Ok(ast::Expr::Lit(ast::Lit::Bool(ast::Bool {
                    span,
                    value: false,
                })))
            }
            TokenType::Null => {
                self.next_token(); // Consume 'null'
                Ok(ast::Expr::Lit(ast::Lit::Null(ast::Null { span })))
            }
            TokenType::BigInt => {
                match &self.cur_token.value {
                    TokenValue::BigInt(value) => {
                        let value = value.clone();
                        self.next_token(); // Consume BigInt
                        Ok(ast::Expr::Lit(ast::Lit::BigInt(ast::BigInt {
                            span,
                            value,
                        })))
                    }
                    _ => Err(self.error(ErrorKind::UnexpectedToken {
                        expected: Some("BigInt literal"),
                        got: format!("{}", self.cur_token.token_type),
                    })),
                }
            }
            TokenType::RegExp => {
                match &self.cur_token.value {
                    TokenValue::RegExp { pattern, flags } => {
                        let pattern = pattern.clone();
                        let flags = flags.clone();
                        self.next_token(); // Consume RegExp
                        Ok(ast::Expr::Lit(ast::Lit::Regex(ast::Regex {
                            span,
                            exp: pattern,
                            flags,
                        })))
                    }
                    _ => Err(self.error(ErrorKind::UnexpectedToken {
                        expected: Some("RegExp literal"),
                        got: format!("{}", self.cur_token.token_type),
                    })),
                }
            }
            _ => Err(self.error(ErrorKind::UnexpectedToken {
                expected: Some("literal"),
                got: format!("{}", self.cur_token.token_type),
            })),
        }
    }

    /// Parse a string literal
    pub fn parse_string_literal(&mut self) -> Result<ast::Str> {
        if !self.is_token_type(TokenType::Str) {
            return Err(self.error(ErrorKind::UnexpectedToken {
                expected: Some("string literal"),
                got: format!("{}", self.cur_token.token_type),
            }));
        }

        let span = self.cur_token.span;
        let value = match &self.cur_token.value {
            TokenValue::Str(s) => s.clone().into(),
            _ => unreachable!("Token is not a string literal"),
        };

        self.next_token(); // Consume the string

        Ok(ast::Str {
            span,
            value,
            raw: None,
        })
    }

    /// Parse a number literal
    pub fn parse_number_literal(&mut self) -> Result<ast::Number> {
        if !self.is_token_type(TokenType::Num) {
            return Err(self.error(ErrorKind::UnexpectedToken {
                expected: Some("number literal"),
                got: format!("{}", self.cur_token.token_type),
            }));
        }

        let span = self.cur_token.span;
        let value = match &self.cur_token.value {
            TokenValue::Num(n) => *n,
            _ => unreachable!("Token is not a number literal"),
        };

        self.next_token(); // Consume the number

        Ok(ast::Number {
            span,
            value,
            raw: None,
        })
    }
}
