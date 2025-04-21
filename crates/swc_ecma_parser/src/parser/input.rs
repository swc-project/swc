use debug_unreachable::debug_unreachable;
use swc_atoms::Atom;
use swc_common::{BytePos, Span};

use super::Parser;
use crate::lexer::{LexResult, Token, TokenAndSpan, TokenValue};

impl<I: Tokens> Parser<I> {
    pub fn input(&mut self) -> &mut I {
        &mut self.input.iter
    }

    pub(crate) fn input_ref(&self) -> &I {
        &self.input.iter
    }
}

/// Clone should be cheap if you are parsing typescript because typescript
/// syntax requires backtracking.
pub trait Tokens: Clone + Iterator<Item = TokenAndSpan> {
    fn set_ctx(&mut self, ctx: swc_ecma_lexer::Context);
    fn ctx(&self) -> swc_ecma_lexer::Context;
    fn syntax(&self) -> swc_ecma_lexer::Syntax;
    fn target(&self) -> swc_ecma_ast::EsVersion;

    fn start_pos(&self) -> BytePos {
        BytePos(0)
    }

    fn set_expr_allowed(&mut self, allow: bool);
    fn set_next_regexp(&mut self, start: Option<BytePos>);

    fn token_context(&self) -> &swc_ecma_lexer::TokenContexts;
    fn token_context_mut(&mut self) -> &mut swc_ecma_lexer::TokenContexts;
    fn set_token_context(&mut self, _c: swc_ecma_lexer::TokenContexts);

    fn clone_token_value(&self) -> Option<TokenValue>;
    fn take_token_value(&mut self) -> Option<TokenValue>;
    fn get_token_value(&self) -> Option<&TokenValue>;

    /// Implementors should use Rc<RefCell<Vec<Error>>>.
    ///
    /// It is required because parser should backtrack while parsing typescript
    /// code.
    fn add_error(&self, error: swc_ecma_lexer::error::Error);

    /// Add an error which is valid syntax in script mode.
    ///
    /// This errors should be dropped if it's not a module.
    ///
    /// Implementor should check for if [Context].module, and buffer errors if
    /// module is false. Also, implementors should move errors to the error
    /// buffer on set_ctx if the parser mode become module mode.
    fn add_module_mode_error(&self, error: swc_ecma_lexer::error::Error);

    fn end_pos(&self) -> BytePos;

    fn take_errors(&mut self) -> Vec<swc_ecma_lexer::error::Error>;

    /// If the program was parsed as a script, this contains the module
    /// errors should the program be identified as a module in the future.
    fn take_script_module_errors(&mut self) -> Vec<swc_ecma_lexer::error::Error>;
}

/// This struct is responsible for managing current token and peeked token.
#[derive(Clone)]
pub struct Buffer<I> {
    pub iter: I,
    /// Span of the previous token.
    pub prev_span: Span,
    pub cur: Option<TokenAndSpan>,
    /// Peeked token
    pub next: Option<TokenAndSpan>,
}

impl<I: Tokens> Buffer<I> {
    pub fn new(lexer: I) -> Self {
        let start_pos = lexer.start_pos();
        Buffer {
            iter: lexer,
            cur: None,
            prev_span: Span::new(start_pos, start_pos),
            next: None,
        }
    }

    pub fn store(&mut self, token: Token) {
        debug_assert!(self.next.is_none());
        debug_assert!(self.cur.is_none());
        let span = self.prev_span;

        self.cur = Some(TokenAndSpan {
            span,
            token,
            had_line_break: false,
        });
    }

    #[allow(dead_code)]
    pub fn cur_debug(&self) -> Option<&Token> {
        self.cur.as_ref().map(|it| &it.token)
    }

    #[cold]
    #[inline(never)]
    pub fn dump_cur(&mut self) -> String {
        match self.cur() {
            Some(v) => format!("{:?}", v),
            None => "<eof>".to_string(),
        }
    }

    /// Returns current token.
    pub fn bump(&mut self) -> Token {
        let prev = match self.cur.take() {
            Some(t) => t,
            None => unsafe {
                debug_unreachable!(
                    "Current token is `None`. Parser should not call bump() without knowing \
                     current token"
                )
            },
        };
        self.prev_span = prev.span;

        prev.token
    }

    pub fn knows_cur(&self) -> bool {
        self.cur.is_some()
    }

    pub fn peek(&mut self) -> Option<Token> {
        debug_assert!(
            self.cur.is_some(),
            "parser should not call peek() without knowing current token"
        );

        if self.next.is_none() {
            self.next = self.iter.next();
        }

        self.next.as_ref().map(|ts| ts.token)
    }

    /// Returns true on eof.
    pub fn had_line_break_before_cur(&mut self) -> bool {
        self.cur();

        self.cur
            .as_ref()
            .map(|it| it.had_line_break)
            .unwrap_or_else(|| true)
    }

    /// This returns true on eof.
    pub fn has_linebreak_between_cur_and_peeked(&mut self) -> bool {
        let _ = self.peek();
        self.next
            .as_ref()
            .map(|item| item.had_line_break)
            .unwrap_or({
                // return true on eof.
                true
            })
    }

    /// Get current token. Returns `None` only on eof.
    #[inline]
    pub fn cur(&mut self) -> Option<Token> {
        if self.cur.is_none() {
            // If we have peeked a token, take it instead of calling lexer.next()
            self.cur = self.next.take().or_else(|| self.iter.next());
        }

        self.cur.map(|v| v.token)
    }

    #[inline]
    pub fn cut_lshift(&mut self) {
        debug_assert!(
            self.is(Token::LShift),
            "parser should only call cut_lshift when encountering LShift token"
        );
        self.cur = Some(TokenAndSpan {
            token: Token::Lt,
            span: self.cur_span().with_lo(self.cur_span().lo + BytePos(1)),
            had_line_break: false,
        });
    }

    pub fn merge_lt_gt(&mut self) {
        debug_assert!(
            self.is(Token::Lt) || self.is(Token::Gt),
            "parser should only call merge_lt_gt when encountering '<' or '>' token"
        );

        let span = self.cur_span();

        if self.peek().is_none() {
            return;
        }

        let next = self.next.as_ref().unwrap();

        if span.hi != next.span.lo {
            return;
        }

        let cur = self.cur.take().unwrap();
        let next = self.next.take().unwrap();

        let token = match (&cur.token, &next.token) {
            (Token::Gt, Token::Gt) => Token::RShift,
            (Token::Gt, Token::Eq) => Token::GtEq,
            (Token::Gt, Token::RShift) => Token::ZeroFillRShift,
            (Token::Gt, Token::GtEq) => Token::RShiftEq,
            (Token::Gt, Token::RShiftEq) => Token::ZeroFillRShiftEq,
            (Token::Lt, Token::Lt) => Token::LShift,
            (Token::Lt, Token::Eq) => Token::LtEq,
            (Token::Lt, Token::LtEq) => Token::LShiftEq,

            _ => {
                self.cur = Some(cur);
                self.next = Some(next);
                return;
            }
        };
        let span = span.with_hi(next.span.hi);

        self.cur = Some(TokenAndSpan {
            token,
            span,
            had_line_break: cur.had_line_break,
        });
    }

    #[inline]
    pub fn is(&mut self, expected: Token) -> bool {
        match self.cur() {
            Some(t) => expected == t,
            _ => false,
        }
    }

    #[inline]
    pub fn eat(&mut self, expected: Token) -> bool {
        let v = self.is(expected);
        if v {
            self.bump();
        }
        v
    }

    /// Returns start of current token.
    #[inline]
    pub fn cur_pos(&mut self) -> BytePos {
        let _ = self.cur();
        self.cur
            .as_ref()
            .map(|item| item.span.lo)
            .unwrap_or_else(|| {
                // eof
                self.last_pos()
            })
    }

    #[inline]
    pub fn cur_span(&self) -> Span {
        let data = self
            .cur
            .as_ref()
            .map(|item| item.span)
            .unwrap_or(self.prev_span);

        Span::new(data.lo, data.hi)
    }

    /// Returns last byte position of previous token.
    #[inline]
    pub fn last_pos(&self) -> BytePos {
        self.prev_span.hi
    }

    /// Returns span of the previous token.
    #[inline]
    pub fn prev_span(&self) -> Span {
        self.prev_span
    }

    #[inline]
    pub fn get_ctx(&self) -> swc_ecma_lexer::Context {
        self.iter.ctx()
    }

    #[inline]
    pub fn set_ctx(&mut self, ctx: swc_ecma_lexer::Context) {
        self.iter.set_ctx(ctx);
    }

    #[inline]
    pub fn syntax(&self) -> swc_ecma_lexer::Syntax {
        self.iter.syntax()
    }

    #[inline]
    pub fn target(&self) -> swc_ecma_ast::EsVersion {
        self.iter.target()
    }

    #[inline]
    pub fn set_expr_allowed(&mut self, allow: bool) {
        self.iter.set_expr_allowed(allow)
    }

    #[inline]
    pub fn set_next_regexp(&mut self, start: Option<BytePos>) {
        self.iter.set_next_regexp(start);
    }

    #[inline]
    pub fn token_context(&self) -> &swc_ecma_lexer::TokenContexts {
        self.iter.token_context()
    }

    #[inline]
    pub fn token_context_mut(&mut self) -> &mut swc_ecma_lexer::TokenContexts {
        self.iter.token_context_mut()
    }

    #[inline]
    pub fn set_token_context(&mut self, c: swc_ecma_lexer::TokenContexts) {
        self.iter.set_token_context(c)
    }

    #[inline]
    pub fn end_pos(&self) -> BytePos {
        self.iter.end_pos()
    }

    pub fn expect_word_token_value(&mut self) -> Atom {
        let Some(crate::lexer::TokenValue::Word(word)) = self.iter.take_token_value() else {
            unreachable!()
        };
        word
    }

    pub fn expect_word_token_value_ref(&self) -> &Atom {
        let Some(crate::lexer::TokenValue::Word(word)) = self.iter.get_token_value() else {
            unreachable!()
        };
        word
    }

    pub fn expect_number_token_value(&mut self) -> (f64, Atom) {
        let Some(crate::lexer::TokenValue::Num { value, raw }) = self.iter.take_token_value()
        else {
            unreachable!()
        };
        (value, raw)
    }

    pub fn expect_string_token_value(&mut self) -> (Atom, Atom) {
        let Some(crate::lexer::TokenValue::Str { value, raw }) = self.iter.take_token_value()
        else {
            unreachable!()
        };
        (value, raw)
    }

    pub fn expect_bigint_token_value(&mut self) -> (Box<num_bigint::BigInt>, Atom) {
        let Some(crate::lexer::TokenValue::BigInt { value, raw }) = self.iter.take_token_value()
        else {
            unreachable!()
        };
        (value, raw)
    }

    pub fn expect_regex_token_value(&mut self) -> (Atom, Atom) {
        let Some(crate::lexer::TokenValue::Regex { value, flags }) = self.iter.take_token_value()
        else {
            unreachable!()
        };
        (value, flags)
    }

    pub fn expect_template_token_value(&mut self) -> (LexResult<Atom>, Atom) {
        let Some(crate::lexer::TokenValue::Template { cooked, raw }) = self.iter.take_token_value()
        else {
            unreachable!()
        };
        (cooked, raw)
    }

    pub fn expect_error_token_value(&mut self) -> swc_ecma_lexer::error::Error {
        let Some(crate::lexer::TokenValue::Error(error)) = self.iter.take_token_value() else {
            unreachable!()
        };
        error
    }

    pub fn get_token_value(&self) -> Option<&TokenValue> {
        self.iter.get_token_value()
    }
}
