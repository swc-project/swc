#![allow(clippy::unnecessary_safety_comment)]
#![allow(unsafe_code)]

//! An Ecma-262 Lexer / Tokenizer
//! Prior Arts:
//!     * [jsparagus](https://github.com/mozilla-spidermonkey/jsparagus/blob/master/crates/parser/src)
//!     * [rome](https://github.com/rome/tools/tree/main/crates/rome_js_parser/src/lexer)
//!     * [rustc](https://github.com/rust-lang/rust/blob/master/compiler/rustc_lexer/src)
//!     * [v8](https://v8.dev/blog/scanner)
//!
//! Lots of codes are copied from oxc. https://github.com/oxc-project/oxc

mod byte_handlers;
mod comment;
mod identifier;
mod jsx;
mod kind;
mod number;
mod numeric;
mod punctuation;
mod regex;
mod search;
mod source;
mod string;
mod template;
mod token;
mod trivia_builder;
mod typescript;
mod unicode;
mod whitespace;

use std::collections::VecDeque;

use oxc_allocator::Allocator;
use oxc_ast::ast::RegExpFlags;
use oxc_diagnostics::OxcDiagnostic;
use oxc_span::{SourceType, Span};
use rustc_hash::FxHashMap;

use self::{
    byte_handlers::handle_byte,
    source::{Source, SourcePosition},
    trivia_builder::TriviaBuilder,
};
pub use self::{
    kind::Kind,
    number::{parse_big_int, parse_float, parse_int},
    token::Token,
};
use crate::{diagnostics, UniquePromise};

#[derive(Debug, Clone, Copy)]
pub struct LexerCheckpoint<'a> {
    /// Current position in source
    position: SourcePosition<'a>,

    token: Token,

    errors_pos: usize,
}

#[derive(Debug, Copy, Clone, Eq, PartialEq)]
pub enum LexerContext {
    Regular,
    /// Lex the next token, returns `JsxString` or any other token
    JsxAttributeValue,
}

#[derive(Debug, Clone, Copy)]
struct Lookahead<'a> {
    position: SourcePosition<'a>,
    token: Token,
}

pub struct Lexer<'a> {
    allocator: &'a Allocator,

    // Wrapper around source text. Must not be changed after initialization.
    source: Source<'a>,

    source_type: SourceType,

    token: Token,

    pub(crate) errors: Vec<OxcDiagnostic>,

    lookahead: VecDeque<Lookahead<'a>>,

    context: LexerContext,

    pub(crate) trivia_builder: TriviaBuilder,

    /// Data store for escaped strings, indexed by [Token::start] when
    /// [Token::escaped] is true
    pub escaped_strings: FxHashMap<u32, &'a str>,

    /// Data store for escaped templates, indexed by [Token::start] when
    /// [Token::escaped] is true `None` is saved when the string contains an
    /// invalid escape sequence.
    pub escaped_templates: FxHashMap<u32, Option<&'a str>>,

    /// `memchr` Finder for end of multi-line comments. Created lazily when
    /// first used.
    multi_line_comment_end_finder: Option<memchr::memmem::Finder<'static>>,
}

#[allow(clippy::unused_self)]
impl<'a> Lexer<'a> {
    /// Create new `Lexer`.
    ///
    /// Requiring a `UniquePromise` to be provided guarantees only 1 `Lexer` can
    /// exist on a single thread at one time.
    pub(super) fn new(
        allocator: &'a Allocator,
        source_text: &'a str,
        source_type: SourceType,
        unique: UniquePromise,
    ) -> Self {
        let source = Source::new(source_text, unique);

        // The first token is at the start of file, so is allows on a new line
        let token = Token::new_on_new_line();
        Self {
            allocator,
            source,
            source_type,
            token,
            errors: vec![],
            lookahead: VecDeque::with_capacity(4), // 4 is the maximum lookahead for TypeScript
            context: LexerContext::Regular,
            trivia_builder: TriviaBuilder::default(),
            escaped_strings: FxHashMap::default(),
            escaped_templates: FxHashMap::default(),
            multi_line_comment_end_finder: None,
        }
    }

    /// Backdoor to create a `Lexer` without holding a `UniquePromise`, for
    /// benchmarks. This function must NOT be exposed in public API as it
    /// breaks safety invariants.
    #[cfg(feature = "benchmarking")]
    pub fn new_for_benchmarks(
        allocator: &'a Allocator,
        source_text: &'a str,
        source_type: SourceType,
    ) -> Self {
        let unique = UniquePromise::new_for_tests();
        Self::new(allocator, source_text, source_type, unique)
    }

    /// Remaining string from `Source`
    pub fn remaining(&self) -> &'a str {
        self.source.remaining()
    }

    /// Creates a checkpoint storing the current lexer state.
    /// Use `rewind` to restore the lexer to the state stored in the checkpoint.
    pub fn checkpoint(&self) -> LexerCheckpoint<'a> {
        LexerCheckpoint {
            position: self.source.position(),
            token: self.token,
            errors_pos: self.errors.len(),
        }
    }

    /// Rewinds the lexer to the same state as when the passed in `checkpoint`
    /// was created.
    pub fn rewind(&mut self, checkpoint: LexerCheckpoint<'a>) {
        self.errors.truncate(checkpoint.errors_pos);
        self.source.set_position(checkpoint.position);
        self.token = checkpoint.token;
        self.lookahead.clear();
    }

    /// Find the nth lookahead token lazily
    pub fn lookahead(&mut self, n: u8) -> Token {
        let n = n as usize;
        debug_assert!(n > 0);

        if self.lookahead.len() > n - 1 {
            return self.lookahead[n - 1].token;
        }

        let position = self.source.position();

        if let Some(lookahead) = self.lookahead.back() {
            self.source.set_position(lookahead.position);
        }

        for _i in self.lookahead.len()..n {
            let kind = self.read_next_token();
            let peeked = self.finish_next(kind);
            self.lookahead.push_back(Lookahead {
                position: self.source.position(),
                token: peeked,
            });
        }

        // Call to `finish_next` in loop above leaves `self.token = Token::default()`.
        // Only circumstance in which `self.token` wouldn't have been default at start
        // of this function is if we were at very start of file, before any
        // tokens have been read, when `token.is_on_new_line` is `true`. But
        // `lookahead` isn't called before the first token is read, so that's
        // not possible. So no need to restore `self.token` here. It's already
        // in same state as it was at start of this function.

        self.source.set_position(position);

        self.lookahead[n - 1].token
    }

    /// Set context
    pub fn set_context(&mut self, context: LexerContext) {
        self.context = context;
    }

    /// Main entry point
    pub fn next_token(&mut self) -> Token {
        if let Some(lookahead) = self.lookahead.pop_front() {
            self.source.set_position(lookahead.position);
            return lookahead.token;
        }
        let kind = self.read_next_token();
        self.finish_next(kind)
    }

    fn finish_next(&mut self, kind: Kind) -> Token {
        self.token.kind = kind;
        self.token.end = self.offset();
        debug_assert!(self.token.start <= self.token.end);
        let token = self.token;
        self.token = Token::default();
        token
    }

    // ---------- Private Methods ---------- //
    fn error(&mut self, error: OxcDiagnostic) {
        self.errors.push(error);
    }

    /// Get the length offset from the source, in UTF-8 bytes
    #[inline]
    #[allow(clippy::cast_possible_truncation)]
    fn offset(&self) -> u32 {
        self.source.offset()
    }

    /// Get the current unterminated token range
    fn unterminated_range(&self) -> Span {
        Span::new(self.token.start, self.offset())
    }

    /// Consume the current char if not at EOF
    #[inline]
    fn next_char(&mut self) -> Option<char> {
        self.source.next_char()
    }

    /// Consume the current char
    #[inline]
    fn consume_char(&mut self) -> char {
        self.source.next_char().unwrap()
    }

    /// Peek the next char without advancing the position
    #[inline]
    fn peek(&self) -> Option<char> {
        self.source.peek_char()
    }

    /// Peek the next next char without advancing the position
    #[inline]
    fn peek2(&self) -> Option<char> {
        self.source.peek_char2()
    }

    /// Peek the next character, and advance the current position if it matches
    #[inline]
    fn next_eq(&mut self, c: char) -> bool {
        let matched = self.peek() == Some(c);
        if matched {
            self.source.next_char().unwrap();
        }
        matched
    }

    fn current_offset(&self) -> Span {
        let offset = self.offset();
        Span::new(offset, offset)
    }

    /// Return `IllegalCharacter` Error or `UnexpectedEnd` if EOF
    fn unexpected_err(&mut self) {
        let offset = self.current_offset();
        match self.peek() {
            Some(c) => self.error(diagnostics::invalid_character(c, offset)),
            None => self.error(diagnostics::unexpected_end(offset)),
        }
    }

    /// Read each char and set the current token
    /// Whitespace and line terminators are skipped
    fn read_next_token(&mut self) -> Kind {
        loop {
            let offset = self.offset();
            self.token.start = offset;

            let Some(byte) = self.source.peek_byte() else {
                return Kind::Eof;
            };

            // SAFETY: `byte` is byte value at current position in source
            let kind = unsafe { handle_byte(byte, self) };
            if kind != Kind::Skip {
                return kind;
            }
        }
    }
}

/// Call a closure while hinting to compiler that this branch is rarely taken.
/// "Cold trampoline function", suggested in:
/// <https://users.rust-lang.org/t/is-cold-the-only-reliable-way-to-hint-to-branch-predictor/106509/2>
#[cold]
pub fn cold_branch<F: FnOnce() -> T, T>(f: F) -> T {
    f()
}
