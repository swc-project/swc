use std::borrow::Cow;

use swc_atoms::{Atom, Wtf8Atom};
use swc_common::{BytePos, Span};
use swc_ecma_ast::EsVersion;

use crate::{
    error::Error,
    lexer::{comments_buffer::CommentData, LexResult, Token, TokenAndSpan, TokenValue},
    syntax::SyntaxFlags,
    Context,
};

pub trait Tokens {
    type Checkpoint;

    fn set_ctx(&mut self, ctx: Context);
    fn ctx(&self) -> Context;
    fn ctx_mut(&mut self) -> &mut Context;
    fn syntax(&self) -> SyntaxFlags;
    fn target(&self) -> EsVersion;

    fn checkpoint_save(&self) -> Self::Checkpoint;
    fn checkpoint_load(&mut self, checkpoint: Self::Checkpoint);

    fn read_string(&self, span: Span) -> &str;

    fn start_pos(&self) -> BytePos {
        BytePos(0)
    }

    fn set_expr_allowed(&mut self, allow: bool);
    fn set_next_regexp(&mut self, start: Option<BytePos>);

    /// Implementors should use Rc<RefCell<Vec<Error>>>.
    ///
    /// It is required because parser should backtrack while parsing typescript
    /// code.
    fn add_error(&mut self, error: Error);

    /// Add an error which is valid syntax in script mode.
    ///
    /// This errors should be dropped if it's not a module.
    ///
    /// Implementor should check for if [Context].module, and buffer errors if
    /// module is false. Also, implementors should move errors to the error
    /// buffer on set_ctx if the parser mode become module mode.
    fn add_module_mode_error(&mut self, error: Error);

    fn end_pos(&self) -> BytePos;

    fn take_errors(&mut self) -> Vec<Error>;

    /// Take comments and their lexer-computed attachment positions.
    fn take_comments(&mut self) -> CommentData;

    /// If the program was parsed as a script, this contains the module
    /// errors should the program be identified as a module in the future.
    fn take_script_module_errors(&mut self) -> Vec<Error>;
    fn clone_token_value(&self) -> Option<TokenValue>;
    fn take_token_value(&mut self) -> Option<TokenValue>;
    fn get_token_value(&self) -> Option<&TokenValue>;
    fn set_token_value(&mut self, token_value: Option<TokenValue>);

    /// Returns the first token in the file.
    ///
    /// This function should only be called at the first time of bump.
    /// It's mainly used for shebang.
    fn first_token(&mut self) -> TokenAndSpan;
    /// Returns the next token from the input stream.
    ///
    /// This method always returns a `TokenAndSpan`. When the end of input is
    /// reached, it returns `Token::Eof`, and subsequent calls will continue
    /// returning `Token::Eof`.
    fn next_token(&mut self) -> TokenAndSpan;
    fn scan_jsx_token(&mut self) -> TokenAndSpan;
    fn scan_jsx_open_el_terminal_token(&mut self) -> TokenAndSpan;
    fn rescan_jsx_open_el_terminal_token(&mut self, reset: BytePos) -> TokenAndSpan;
    fn rescan_jsx_token(&mut self, reset: BytePos) -> TokenAndSpan;
    fn scan_jsx_identifier(&mut self, start: BytePos) -> TokenAndSpan;
    fn scan_jsx_attribute_value(&mut self) -> TokenAndSpan;
    fn rescan_template_token(&mut self, start: BytePos, start_with_back_tick: bool)
        -> TokenAndSpan;
}

/// OXC-style parser cursor over the lexer.
///
/// Lookahead checkpoints the lexer, advances once, and immediately rewinds.
/// Keeping only the current token prevents token values from living in a second
/// cache.
pub struct Buffer<I: Tokens> {
    pub iter: I,
    /// Span of the previous token.
    pub prev_span: Span,
    pub cur: TokenAndSpan,
}

impl<I: Tokens> Buffer<I> {
    pub fn expect_word_token_value(&mut self) -> Atom {
        let Some(crate::lexer::TokenValue::Word(word)) = self.iter.take_token_value() else {
            unreachable!()
        };
        word
    }

    pub fn expect_number_token_value(&mut self) -> f64 {
        let Some(crate::lexer::TokenValue::Num(radix)) = self.iter.take_token_value() else {
            unreachable!()
        };
        let raw = self.iter.read_string(self.cur.span);
        let raw = if raw.contains('_') {
            Cow::Owned(raw.replace('_', ""))
        } else {
            Cow::Borrowed(raw)
        };
        if radix == 10 {
            raw.parse().expect("lexer must validate decimal literals")
        } else {
            let digits = if raw
                .as_bytes()
                .get(1)
                .is_some_and(|byte| matches!(byte, b'b' | b'B' | b'o' | b'O' | b'x' | b'X'))
            {
                &raw[2..]
            } else {
                &raw
            };
            match radix {
                2 => crate::lexer::parse_integer::<2>(digits),
                8 => crate::lexer::parse_integer::<8>(digits),
                16 => crate::lexer::parse_integer::<16>(digits),
                _ => unreachable!("invalid numeric radix"),
            }
        }
    }

    pub fn expect_string_token_value(&mut self) -> Wtf8Atom {
        match self.iter.take_token_value() {
            Some(crate::lexer::TokenValue::Str(value)) => value,
            Some(crate::lexer::TokenValue::RawStr) => {
                let span = self.cur.span;
                debug_assert!(span.hi.0 >= span.lo.0 + 2);
                let value_span = Span::new_with_checked(span.lo + BytePos(1), span.hi - BytePos(1));
                Wtf8Atom::new(self.iter.read_string(value_span))
            }
            _ => unreachable!(),
        }
    }

    pub fn expect_jsx_text_token_value(&mut self) -> Atom {
        let Some(crate::lexer::TokenValue::JsxText(value)) = self.iter.take_token_value() else {
            unreachable!()
        };
        value
    }

    pub fn expect_bigint_token_value(&mut self) -> Box<num_bigint::BigInt> {
        let Some(crate::lexer::TokenValue::BigInt(radix)) = self.iter.take_token_value() else {
            unreachable!()
        };
        let raw = self.iter.read_string(self.cur.span);
        let digits = raw.strip_suffix('n').expect("BigInt token must end in `n`");
        let digits = if radix == 10 {
            digits
        } else {
            debug_assert!(matches!(radix, 2 | 8 | 16));
            &digits[2..]
        };
        let digits = if digits.contains('_') {
            Cow::Owned(digits.replace('_', ""))
        } else {
            Cow::Borrowed(digits)
        };
        Box::new(
            num_bigint::BigInt::parse_bytes(digits.as_bytes(), u32::from(radix))
                .expect("lexer must validate BigInt digits"),
        )
    }

    pub fn expect_regex_token_value(&mut self) -> BytePos {
        let Some(crate::lexer::TokenValue::Regex(exp_end)) = self.iter.take_token_value() else {
            unreachable!()
        };
        exp_end
    }

    pub fn expect_template_token_value(&mut self) -> LexResult<Wtf8Atom> {
        match self.iter.take_token_value() {
            Some(crate::lexer::TokenValue::Template(cooked)) => cooked,
            Some(crate::lexer::TokenValue::RawTemplate(value_span)) => {
                Ok(Wtf8Atom::new(self.iter.read_string(value_span)))
            }
            _ => unreachable!(),
        }
    }

    pub fn expect_error_token_value(&mut self) -> Error {
        let Some(crate::lexer::TokenValue::Error(error)) = self.iter.take_token_value() else {
            unreachable!()
        };
        error
    }

    pub fn get_token_value(&self) -> Option<&TokenValue> {
        self.iter.get_token_value()
    }

    pub fn scan_jsx_token(&mut self) {
        let prev = self.cur;
        let t = self.iter.scan_jsx_token();
        self.prev_span = prev.span;
        self.set_cur(t);
    }

    #[allow(unused)]
    fn scan_jsx_open_el_terminal_token(&mut self) {
        let prev = self.cur;
        let t = self.iter.scan_jsx_open_el_terminal_token();
        self.prev_span = prev.span;
        self.set_cur(t);
    }

    pub fn rescan_jsx_open_el_terminal_token(&mut self) {
        if !self.cur().should_rescan_into_gt_in_jsx() {
            return;
        }
        // rescan `>=`, `>>`, `>>=`, `>>>`, `>>>=` into `>`
        let start = self.cur.span.lo;
        let t = self.iter.rescan_jsx_open_el_terminal_token(start);
        self.set_cur(t);
    }

    pub fn rescan_jsx_token(&mut self) {
        let start = self.cur.span.lo;
        let t = self.iter.rescan_jsx_token(start);
        self.set_cur(t);
    }

    pub fn scan_jsx_identifier(&mut self) {
        if !self.cur().is_word() {
            return;
        }
        let start = self.cur.span.lo;
        let cur = self.iter.scan_jsx_identifier(start);
        debug_assert!(cur.token == Token::JSXName);
        self.set_cur(cur);
    }

    pub fn scan_jsx_attribute_value(&mut self) {
        self.cur = self.iter.scan_jsx_attribute_value();
    }

    pub fn rescan_template_token(&mut self, start_with_back_tick: bool) {
        let start = self.cur_pos();
        self.cur = self.iter.rescan_template_token(start, start_with_back_tick);
    }
}

impl<I: Tokens> Buffer<I> {
    pub fn new(lexer: I) -> Self {
        let start_pos = lexer.start_pos();
        let prev_span = Span::new_with_checked(start_pos, start_pos);
        Buffer {
            iter: lexer,
            cur: TokenAndSpan::new(Token::Eof, prev_span, false),
            prev_span,
        }
    }

    #[inline(always)]
    pub fn set_cur(&mut self, token: TokenAndSpan) {
        self.cur = token
    }

    #[inline(always)]
    pub fn cur(&self) -> Token {
        self.cur.token
    }

    #[inline(always)]
    pub fn get_cur(&self) -> &TokenAndSpan {
        &self.cur
    }

    #[inline(always)]
    pub fn prev_span(&self) -> Span {
        self.prev_span
    }

    #[inline(always)]
    pub fn iter(&self) -> &I {
        &self.iter
    }

    #[inline(always)]
    pub fn iter_mut(&mut self) -> &mut I {
        &mut self.iter
    }

    pub fn peek(&mut self) -> Option<Token> {
        debug_assert!(
            self.cur.token != Token::Eof,
            "parser should not call peek() without knowing current token"
        );

        Some(self.peek_token_and_span().token)
    }

    #[inline]
    pub fn peek_token_and_span(&mut self) -> TokenAndSpan {
        let checkpoint = self.iter.checkpoint_save();
        let token = self.iter.next_token();
        self.iter.checkpoint_load(checkpoint);
        token
    }

    pub fn store(&mut self, token: Token) {
        debug_assert!(self.cur() != Token::Eof);
        let span = self.prev_span();
        let token = TokenAndSpan::new(token, span, false);
        self.set_cur(token);
    }

    pub fn first_bump(&mut self) {
        let first_token = self.iter.first_token();
        self.prev_span = self.cur.span;
        self.set_cur(first_token);
    }

    pub fn bump(&mut self) {
        let next = self.iter.next_token();
        self.prev_span = self.cur.span;
        self.set_cur(next);
    }

    pub fn expect_word_token_and_bump(&mut self) -> Atom {
        let cur = self.cur();
        let word = cur.take_word(self);
        self.bump();
        word
    }

    pub fn expect_shebang_token_and_bump(&mut self) -> swc_atoms::Atom {
        let cur = self.cur();
        let ret = cur.take_shebang(self);
        self.bump();
        ret
    }

    pub fn expect_jsx_name_token_and_bump(&mut self) -> Atom {
        let cur = self.cur();
        let word = cur.take_jsx_name(self);
        self.bump();
        word
    }

    pub fn expect_error_token_and_bump(&mut self) -> Error {
        let cur = self.cur();
        let ret = cur.take_error(self);
        self.bump();
        ret
    }

    #[cold]
    #[inline(never)]
    pub fn dump_cur(&self) -> String {
        let cur = self.cur();
        cur.to_string()
    }
}

impl<I: Tokens> Buffer<I> {
    pub fn had_line_break_before_cur(&self) -> bool {
        self.cur.had_line_break()
    }

    /// This returns true on eof.
    pub fn has_linebreak_between_cur_and_peeked(&mut self) -> bool {
        let token = self.peek_token_and_span();
        token.token == Token::Eof || token.had_line_break()
    }

    pub fn cut_lshift(&mut self) {
        debug_assert!(
            self.is(Token::LShift),
            "parser should only call cut_lshift when encountering LShift token"
        );
        let span = self.cur_span().with_lo(self.cur_span().lo + BytePos(1));
        let token = TokenAndSpan::new(Token::Lt, span, false);
        self.set_cur(token);
    }

    pub fn merge_lt_gt(&mut self) {
        debug_assert!(
            self.is(Token::Lt) || self.is(Token::Gt),
            "parser should only call merge_lt_gt when encountering Less token"
        );
        let span = self.cur_span();
        let next = self.peek_token_and_span();
        if span.hi != next.span.lo {
            return;
        }
        let cur = *self.get_cur();
        let cur_token = cur.token;
        let token = if cur_token == Token::Gt {
            let next_token = next.token;
            if next_token == Token::Gt {
                // >>
                Token::RShift
            } else if next_token == Token::Eq {
                // >=
                Token::GtEq
            } else if next_token == Token::RShift {
                // >>>
                Token::ZeroFillRShift
            } else if next_token == Token::GtEq {
                // >>=
                Token::RShiftEq
            } else if next_token == Token::RShiftEq {
                // >>>=
                Token::ZeroFillRShiftEq
            } else {
                return;
            }
        } else if cur_token == Token::Lt {
            let next_token = next.token;
            if next_token == Token::Lt {
                // <<
                Token::LShift
            } else if next_token == Token::Eq {
                // <=
                Token::LtEq
            } else if next_token == Token::LtEq {
                // <<=
                Token::LShiftEq
            } else {
                return;
            }
        } else {
            return;
        };
        let consumed = self.iter.next_token();
        debug_assert_eq!(consumed.token, next.token);
        self.iter.set_token_value(None);
        let span = span.with_hi(next.span.hi);
        let token = TokenAndSpan::new(token, span, cur.had_line_break());
        self.set_cur(token);
    }

    #[inline(always)]
    pub fn is(&self, expected: Token) -> bool {
        self.cur.token == expected
    }

    #[inline(always)]
    pub fn eat(&mut self, expected: Token) -> bool {
        if self.cur.token == expected {
            self.bump();
            true
        } else {
            false
        }
    }

    /// Returns start of current token.
    #[inline]
    pub fn cur_pos(&self) -> BytePos {
        self.cur.span.lo
    }

    #[inline]
    pub fn cur_span(&self) -> Span {
        self.cur.span
    }

    #[inline]
    pub fn cur_string(&self) -> &str {
        let token_span = self.cur_span();
        self.iter.read_string(token_span)
    }

    /// Returns last byte position of previous token.
    #[inline]
    pub fn last_pos(&self) -> BytePos {
        self.prev_span.hi
    }

    #[inline]
    pub fn get_ctx(&self) -> Context {
        self.iter().ctx()
    }

    #[inline]
    pub fn set_ctx(&mut self, ctx: Context) {
        self.iter_mut().set_ctx(ctx);
    }

    #[inline]
    pub fn syntax(&self) -> SyntaxFlags {
        self.iter().syntax()
    }

    #[inline]
    pub fn target(&self) -> EsVersion {
        self.iter().target()
    }

    #[inline]
    pub fn set_expr_allowed(&mut self, allow: bool) {
        self.iter_mut().set_expr_allowed(allow)
    }

    #[inline]
    pub fn set_next_regexp(&mut self, start: Option<BytePos>) {
        self.iter_mut().set_next_regexp(start);
    }

    #[inline]
    pub fn end_pos(&self) -> BytePos {
        self.iter().end_pos()
    }

    #[inline]
    pub fn token_flags(&self) -> crate::lexer::TokenFlags {
        self.cur.flags()
    }
}
