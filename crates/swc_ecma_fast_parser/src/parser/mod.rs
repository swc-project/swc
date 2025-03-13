//! High-performance parser for ECMAScript/TypeScript
//!
//! This parser is designed for maximum performance and memory efficiency,
//! operating at the token level for optimal throughput.

#![allow(clippy::redundant_closure_call)]

mod expr;
mod pat;
mod stmt;
#[cfg(test)]
mod tests;
mod util;

use std::rc::Rc;

use swc_atoms::Atom;
use swc_common::Span;
use swc_ecma_ast::{Module, ModuleItem, Program, Script, Stmt};

use crate::{
    error::{Error, ErrorKind, Result},
    lexer::Lexer,
    token::{Token, TokenType},
    JscTarget, SingleThreadedComments, Syntax,
};

/// High-performance parser for ECMAScript/TypeScript
///
/// This parser processes tokens from the lexer to build an AST.
#[repr(C)] // Ensure predictable memory layout
pub struct Parser<'a> {
    /// Lexer instance
    lexer: Lexer<'a>,

    /// Syntax configuration
    pub syntax: Syntax,

    /// Target ECMAScript version
    pub target: JscTarget,

    /// Whether the parser is in strict mode
    pub strict_mode: bool,

    /// Whether the parser is in module mode
    pub is_module: bool,

    /// Whether the parser is in a function context
    pub in_function: bool,

    /// Whether the parser is in a generator function
    pub in_generator: bool,

    /// Whether the parser is in an async function
    pub in_async: bool,

    /// Whether the parser is in a loop
    pub in_loop: bool,

    /// Whether the parser is in a switch statement
    pub in_switch: bool,

    /// Whether the parser is in a class context
    pub in_class: bool,

    /// Whether the parser is in a static block
    pub in_static_block: bool,

    /// Label set for break/continue statements
    pub labels: Vec<Atom>,

    /// Comments storage
    pub comments: Option<Rc<SingleThreadedComments>>,
}

impl<'a> Parser<'a> {
    /// Create a new parser from a string input
    #[inline]
    pub fn new(
        input: &'a str,
        target: JscTarget,
        syntax: Syntax,
        is_module: bool,
        comments: Option<Rc<SingleThreadedComments>>,
    ) -> Self {
        let lexer = Lexer::new(input, target, syntax, comments.clone());

        Self {
            lexer,
            syntax,
            target,
            strict_mode: is_module, // Modules are always in strict mode
            is_module,
            in_function: false,
            in_generator: false,
            in_async: false,
            in_loop: false,
            in_switch: false,
            in_class: false,
            in_static_block: false,
            labels: Vec::new(),
            comments,
        }
    }

    /// Parse a complete program (script or module)
    pub fn parse_program(&mut self) -> Result<Program> {
        if self.is_module {
            let module = self.parse_module()?;
            Ok(Program::Module(module))
        } else {
            let script = self.parse_script()?;
            Ok(Program::Script(script))
        }
    }

    /// Parse a script
    fn parse_script(&mut self) -> Result<Script> {
        let span_start = self.current_span().lo;
        let body = self.parse_statements()?;
        let span = Span::new(span_start, self.current_span().hi);

        Ok(Script {
            span,
            body,
            shebang: None, // TODO: Handle shebang
        })
    }

    /// Parse a module
    fn parse_module(&mut self) -> Result<Module> {
        let span_start = self.current_span().lo;
        let body = self.parse_module_items()?;
        let span = Span::new(span_start, self.current_span().hi);

        Ok(Module {
            span,
            body,
            shebang: None, // TODO: Handle shebang
        })
    }

    /// Parse statements until end of input or closing brace
    fn parse_statements(&mut self) -> Result<Vec<Stmt>> {
        let mut stmts = Vec::new();

        while !self.is(TokenType::EOF) && !self.is(TokenType::RBrace) {
            let stmt = self.parse_stmt()?;
            stmts.push(stmt);
        }

        Ok(stmts)
    }

    /// Parse module items until end of input
    fn parse_module_items(&mut self) -> Result<Vec<ModuleItem>> {
        let mut items = Vec::new();

        while !self.is(TokenType::EOF) {
            // For now, just parse statements as module items
            // TODO: Add support for import/export declarations
            let stmt = self.parse_stmt()?;
            items.push(ModuleItem::Stmt(stmt));
        }

        Ok(items)
    }

    /// Get the current token
    #[inline(always)]
    pub fn current(&self) -> &Token {
        &self.lexer.current
    }

    /// Get the current token type
    #[inline(always)]
    pub fn current_token_type(&self) -> TokenType {
        self.lexer.current.token_type
    }

    /// Get the current token span
    #[inline(always)]
    pub fn current_span(&self) -> Span {
        self.lexer.current.span
    }

    /// Check if the current token is of the specified type
    #[inline(always)]
    pub fn is(&self, token_type: TokenType) -> bool {
        self.current_token_type() == token_type
    }

    /// Check if the current token is one of the specified types
    #[inline(always)]
    pub fn is_one_of(&self, token_types: &[TokenType]) -> bool {
        token_types.contains(&self.current_token_type())
    }

    /// Expect a specific token type and advance to the next token
    #[inline]
    pub fn expect(&mut self, token_type: TokenType) -> Result<()> {
        if self.is(token_type) {
            self.lexer.next_token()?;
            Ok(())
        } else {
            let span = self.current_span();
            Err(Error {
                kind: ErrorKind::UnexpectedToken {
                    expected: Some(token_type.as_str()),
                    got: self.current_token_type().as_str().to_string(),
                },
                span,
            })
        }
    }

    /// Consume the current token if it matches the specified type
    #[inline]
    pub fn eat(&mut self, token_type: TokenType) -> Result<bool> {
        if self.is(token_type) {
            self.lexer.next_token()?;
            Ok(true)
        } else {
            Ok(false)
        }
    }
}
