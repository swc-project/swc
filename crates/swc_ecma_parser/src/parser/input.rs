use swc_atoms::Atom;
use swc_common::{BytePos, Span};
use swc_ecma_lexer::common::{
    lexer::{token::TokenFactory, LexResult},
    parser::{buffer::Buffer as BufferTrait, token_and_span::TokenAndSpan as TokenAndSpanTrait},
};

use crate::lexer::{NextTokenAndSpan, Token, TokenAndSpan, TokenValue};

/// Clone should be cheap if you are parsing typescript because typescript
/// syntax requires backtracking.
pub trait Tokens: swc_ecma_lexer::common::input::Tokens<TokenAndSpan> {
    fn clone_token_value(&self) -> Option<TokenValue>;
    fn take_token_value(&mut self) -> Option<TokenValue>;
    fn get_token_value(&self) -> Option<&TokenValue>;
    fn set_token_value(&mut self, token_value: Option<TokenValue>);

    fn scan_jsx_token(&mut self, allow_multiline_jsx_text: bool) -> TokenAndSpan;
    fn scan_jsx_open_el_terminal_token(&mut self) -> TokenAndSpan;
    fn rescan_jsx_open_el_terminal_token(&mut self, reset: BytePos) -> TokenAndSpan;
    fn rescan_jsx_token(&mut self, allow_multiline_jsx_text: bool, reset: BytePos) -> TokenAndSpan;
    fn scan_jsx_identifier(&mut self, start: BytePos) -> TokenAndSpan;
    fn scan_jsx_attribute_value(&mut self) -> TokenAndSpan;
    fn rescan_template_token(&mut self, start: BytePos, start_with_back_tick: bool)
        -> TokenAndSpan;
}

/// This struct is responsible for managing current token and peeked token.
#[derive(Clone)]
pub struct Buffer<I> {
    pub iter: I,
    /// Span of the previous token.
    pub prev_span: Span,
    pub cur: TokenAndSpan,
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
        let prev = self.cur;
        let t = self.iter_mut().scan_jsx_token(allow_multiline_jsx_text);
        self.set_prev_span(prev.span);
        self.set_cur(t);
    }

    #[allow(unused)]
    fn scan_jsx_open_el_terminal_token(&mut self) {
        let prev = self.cur;
        let t = self.iter_mut().scan_jsx_open_el_terminal_token();
        self.set_prev_span(prev.span);
        self.set_cur(t);
    }

    pub fn rescan_jsx_open_el_terminal_token(&mut self) {
        if !self.cur().should_rescan_into_gt_in_jsx() {
            return;
        }
        // rescan `>=`, `>>`, `>>=`, `>>>`, `>>>=` into `>`
        let start = self.cur.span.lo;
        let t = self.iter_mut().rescan_jsx_open_el_terminal_token(start);
        self.set_cur(t);
    }

    pub fn rescan_jsx_token(&mut self, allow_multiline_jsx_text: bool) {
        let start = self.cur.span.lo;
        let t = self
            .iter_mut()
            .rescan_jsx_token(allow_multiline_jsx_text, start);
        self.set_cur(t);
    }

    pub fn scan_jsx_identifier(&mut self) {
        if !(*self.cur()).is_word() {
            return;
        }
        let start = self.cur.span.lo;
        let cur = self.iter_mut().scan_jsx_identifier(start);
        debug_assert!(cur.token == Token::JSXName);
        self.set_cur(cur);
    }

    pub fn scan_jsx_attribute_value(&mut self) {
        self.cur = self.iter_mut().scan_jsx_attribute_value();
    }

    pub fn rescan_template_token(&mut self, start_with_back_tick: bool) {
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
        let prev_span = Span::new_with_checked(start_pos, start_pos);
        Buffer {
            iter: lexer,
            cur: TokenAndSpan::new(Token::Eof, prev_span, false),
            prev_span,
            next: None,
        }
    }

    #[inline(always)]
    fn set_cur(&mut self, token: TokenAndSpan) {
        self.cur = token
    }

    #[inline(always)]
    fn next(&self) -> Option<&Self::Next> {
        self.next.as_ref()
    }

    #[inline(always)]
    fn set_next(&mut self, token: Option<Self::Next>) {
        self.next = token;
    }

    #[inline(always)]
    fn next_mut(&mut self) -> &mut Option<Self::Next> {
        &mut self.next
    }

    #[inline(always)]
    fn cur(&self) -> &super::super::lexer::Token {
        &self.cur.token
    }

    #[inline(always)]
    fn get_cur(&self) -> &TokenAndSpan {
        &self.cur
    }

    #[inline(always)]
    fn get_cur_mut(&mut self) -> &mut TokenAndSpan {
        &mut self.cur
    }

    #[inline(always)]
    fn prev_span(&self) -> Span {
        self.prev_span
    }

    #[inline(always)]
    fn set_prev_span(&mut self, span: Span) {
        self.prev_span = span;
    }

    #[inline(always)]
    fn iter(&self) -> &I {
        &self.iter
    }

    #[inline(always)]
    fn iter_mut(&mut self) -> &mut I {
        &mut self.iter
    }

    fn peek<'b>(&'b mut self) -> Option<&'b super::super::lexer::Token>
    where
        TokenAndSpan: 'b,
    {
        debug_assert!(
            self.cur.token != Token::Eof,
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

    fn bump(&mut self) {
        let next = if let Some(next) = self.next.take() {
            self.iter.set_token_value(next.value);
            next.token_and_span
        } else if let Some(next) = self.iter.next() {
            next
        } else {
            let eof_pos = self.cur.span().hi;
            let eof_span = Span::new_with_checked(eof_pos, eof_pos);
            TokenAndSpan::new(Token::Eof, eof_span, true)
        };
        self.set_prev_span(self.cur.span());
        self.set_cur(next);
    }

    fn expect_word_token_and_bump(&mut self) -> Atom {
        let cur = *self.cur();
        let word = cur.take_word(self).unwrap();
        self.bump();
        word
    }

    fn expect_shebang_token_and_bump(&mut self) -> swc_atoms::Atom {
        let cur = *self.cur();
        let ret = cur.take_shebang(self);
        self.bump();
        ret
    }

    fn expect_jsx_name_token_and_bump(&mut self) -> Atom {
        let cur = *self.cur();
        let word = cur.take_jsx_name(self);
        self.bump();
        word
    }

    fn expect_jsx_text_token_and_bump(&mut self) -> (Atom, Atom) {
        let cur = *self.cur();
        let ret = cur.take_jsx_text(self);
        self.bump();
        ret
    }

    fn expect_number_token_and_bump(&mut self) -> (f64, Atom) {
        let cur = *self.cur();
        let ret = cur.take_num(self);
        self.bump();
        ret
    }

    fn expect_string_token_and_bump(&mut self) -> (Atom, Atom) {
        let cur = *self.cur();
        let ret = cur.take_str(self);
        self.bump();
        ret
    }

    fn expect_bigint_token_and_bump(&mut self) -> (Box<num_bigint::BigInt>, Atom) {
        let cur = *self.cur();
        let ret = cur.take_bigint(self);
        self.bump();
        ret
    }

    fn expect_regex_token_and_bump(&mut self) -> (Atom, Atom) {
        let cur = *self.cur();
        let ret = cur.take_regexp(self);
        self.bump();
        ret
    }

    fn expect_template_token_and_bump(&mut self) -> (LexResult<Atom>, Atom) {
        let cur = *self.cur();
        let ret = cur.take_template(self);
        self.bump();
        ret
    }

    fn expect_error_token_and_bump(&mut self) -> swc_ecma_lexer::error::Error {
        let cur = *self.cur();
        let ret = cur.take_error(self);
        self.bump();
        ret
    }

    #[cold]
    #[inline(never)]
    fn dump_cur(&self) -> String {
        let cur = self.cur();
        cur.to_string(self)
    }
}
