use swc_atoms::Atom;
use swc_common::{BytePos, Span};
use swc_ecma_lexer::common::{lexer::LexResult, parser::buffer::Buffer as BufferTrait};

use crate::lexer::{NextTokenAndSpan, Token, TokenAndSpan, TokenValue};

/// Clone should be cheap if you are parsing typescript because typescript
/// syntax requires backtracking.
pub trait Tokens: swc_ecma_lexer::common::input::Tokens<TokenAndSpan> {
    fn clone_token_value(&self) -> Option<TokenValue>;
    fn take_token_value(&mut self) -> Option<TokenValue>;
    fn get_token_value(&self) -> Option<&TokenValue>;
    fn set_token_value(&mut self, token_value: Option<TokenValue>);

    fn scan_jsx_token(&mut self, allow_multiline_jsx_text: bool) -> Option<TokenAndSpan>;
    fn scan_jsx_open_el_terminal_token(&mut self) -> Option<TokenAndSpan>;
    fn rescan_jsx_open_el_terminal_token(&mut self, reset: BytePos) -> Option<TokenAndSpan>;
    fn rescan_jsx_token(
        &mut self,
        allow_multiline_jsx_text: bool,
        reset: BytePos,
    ) -> Option<TokenAndSpan>;
    fn scan_jsx_identifier(&mut self, start: BytePos) -> TokenAndSpan;
    fn scan_jsx_attribute_value(&mut self) -> Option<TokenAndSpan>;
    fn rescan_template_token(
        &mut self,
        start: BytePos,
        start_with_back_tick: bool,
    ) -> Option<TokenAndSpan>;
}

/// This struct is responsible for managing current token and peeked token.
#[derive(Clone)]
pub struct Buffer<I> {
    pub iter: I,
    /// Span of the previous token.
    pub prev_span: Span,
    pub cur: Option<TokenAndSpan>,
    /// Peeked token
    pub next: Option<NextTokenAndSpan>,
}

impl<I: Tokens> Buffer<I> {
    pub fn expect_word_token_value(&mut self) -> Atom {
        let Some(crate::lexer::TokenValue::Word(word)) = self.iter.take_token_value() else {
            unreachable!()
        };
        word
    }

    pub fn expect_word_token_value_ref(&self) -> &Atom {
        let Some(crate::lexer::TokenValue::Word(word)) = self.iter.get_token_value() else {
            unreachable!("token_value: {:?}", self.iter.get_token_value())
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

    pub fn scan_jsx_token(&mut self, allow_multiline_jsx_text: bool) {
        if let Some(t) = self.iter_mut().scan_jsx_token(allow_multiline_jsx_text) {
            self.set_cur(t);
        }
    }

    fn scan_jsx_open_el_terminal_token(&mut self) {
        if let Some(t) = self.iter_mut().scan_jsx_open_el_terminal_token() {
            self.set_cur(t);
        }
    }

    pub fn rescan_jsx_open_el_terminal_token(&mut self) {
        if !self
            .cur()
            .is_some_and(|token| token.should_rescan_into_gt_in_jsx())
        {
            return;
        }
        // rescan `>=`, `>>`, `>>=`, `>>>`, `>>>=` into `>`
        let cur = match self.cur.as_ref() {
            Some(cur) => cur,
            None => {
                return self.scan_jsx_open_el_terminal_token();
            }
        };

        let start = cur.span.lo;
        if let Some(t) = self.iter_mut().rescan_jsx_open_el_terminal_token(start) {
            self.set_cur(t);
        }
    }

    pub fn rescan_jsx_token(&mut self, allow_multiline_jsx_text: bool) {
        let start = match self.cur.as_ref() {
            Some(cur) => cur.span.lo,
            None => {
                return self.scan_jsx_token(allow_multiline_jsx_text);
            }
        };
        if let Some(t) = self
            .iter_mut()
            .rescan_jsx_token(allow_multiline_jsx_text, start)
        {
            self.set_cur(t);
        }
    }

    pub fn scan_jsx_identifier(&mut self) {
        let Some(cur) = self.cur() else {
            return;
        };
        if !cur.is_word() {
            return;
        }
        let start = self.cur.as_ref().unwrap().span.lo;
        let cur = self.iter_mut().scan_jsx_identifier(start);
        debug_assert!(cur.token == Token::JSXName);
        self.set_cur(cur);
    }

    pub fn scan_jsx_attribute_value(&mut self) {
        if let Some(t) = self.iter_mut().scan_jsx_attribute_value() {
            self.set_cur(t);
        }
    }

    pub fn rescan_template_token(&mut self, start_with_back_tick: bool) {
        debug_assert!(self.cur.is_some());
        let start = self.cur_pos();
        self.cur = self
            .iter_mut()
            .rescan_template_token(start, start_with_back_tick);
    }
}

impl<'a, I: Tokens> swc_ecma_lexer::common::parser::buffer::Buffer<'a> for Buffer<I> {
    type I = I;
    type Lexer = super::super::lexer::Lexer<'a>;
    type Next = NextTokenAndSpan;
    type Token = super::super::lexer::Token;
    type TokenAndSpan = TokenAndSpan;

    fn new(lexer: I) -> Self {
        let start_pos = lexer.start_pos();
        Buffer {
            iter: lexer,
            cur: None,
            prev_span: Span::new(start_pos, start_pos),
            next: None,
        }
    }

    #[cold]
    #[inline(never)]
    fn dump_cur(&mut self) -> String {
        match self.cur() {
            Some(v) => v.to_string(self.get_token_value()),
            None => "<eof>".to_string(),
        }
    }

    fn set_cur(&mut self, token: TokenAndSpan) {
        self.cur = Some(token);
    }

    fn next(&self) -> Option<&Self::Next> {
        self.next.as_ref()
    }

    fn set_next(&mut self, token: Option<Self::Next>) {
        self.next = token;
    }

    fn next_mut(&mut self) -> &mut Option<Self::Next> {
        &mut self.next
    }

    fn cur(&mut self) -> Option<&super::super::lexer::Token> {
        if self.cur.is_none() {
            // If we have peeked a token, take it instead of calling lexer.next()
            if let Some(next) = self.next.take() {
                self.cur = Some(next.token_and_span);
                self.iter.set_token_value(next.value);
            } else {
                self.cur = self.iter.next()
            }
        }

        self.cur.as_ref().map(|v| &v.token)
    }

    fn get_cur(&self) -> Option<&TokenAndSpan> {
        self.cur.as_ref()
    }

    fn get_cur_mut(&mut self) -> &mut Option<TokenAndSpan> {
        &mut self.cur
    }

    fn prev_span(&self) -> Span {
        self.prev_span
    }

    fn set_prev_span(&mut self, span: Span) {
        self.prev_span = span;
    }

    fn iter(&self) -> &I {
        &self.iter
    }

    fn iter_mut(&mut self) -> &mut I {
        &mut self.iter
    }

    fn peek<'b>(&'b mut self) -> Option<&'b super::super::lexer::Token>
    where
        TokenAndSpan: 'b,
    {
        debug_assert!(
            self.cur.is_some(),
            "parser should not call peek() without knowing current token"
        );

        if self.next.is_none() {
            let old = self.iter.take_token_value();
            let next_token = self.iter.next();
            self.next = next_token.map(|t| NextTokenAndSpan {
                token_and_span: t,
                value: self.iter.take_token_value(),
            });
            self.iter.set_token_value(old);
        }

        self.next.as_ref().map(|ts| &ts.token_and_span.token)
    }
}
