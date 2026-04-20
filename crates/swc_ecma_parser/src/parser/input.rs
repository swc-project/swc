use swc_atoms::{Atom, Wtf8Atom};
use swc_common::{BytePos, Span};
use swc_ecma_ast::EsVersion;

use crate::{
    error::Error,
    lexer::{
        FastToken, FastTokenAndValue, LexResult, SharedTokenValue, Token, TokenAndSpan, TokenFlags,
        TokenValue, TokenValueCell,
    },
    syntax::SyntaxFlags,
    Context,
};

/// Clone should be cheap if you are parsing typescript because typescript
/// syntax requires backtracking.
#[allow(private_interfaces)]
pub trait Tokens: Clone {
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

    /// If the program was parsed as a script, this contains the module
    /// errors should the program be identified as a module in the future.
    fn take_script_module_errors(&mut self) -> Vec<Error>;
    fn update_token_flags(&mut self, f: impl FnOnce(&mut TokenFlags));
    fn token_flags(&self) -> TokenFlags;
    fn set_current_token_type(&mut self, token: Token);

    fn clone_token_value(&self) -> Option<TokenValue>;
    fn take_token_value_cell(&mut self) -> Option<TokenValueCell> {
        self.take_token_value_shared()
            .map(TokenValueCell::new_shared)
    }
    fn take_token_value_shared(&mut self) -> Option<SharedTokenValue> {
        self.take_token_value().map(SharedTokenValue::new)
    }
    fn take_token_value(&mut self) -> Option<TokenValue>;
    fn get_token_value(&self) -> Option<&TokenValue>;
    fn set_token_value_cell(&mut self, token_value: Option<TokenValueCell>) {
        match token_value {
            Some(TokenValueCell::Owned(value)) => self.set_token_value(Some(value)),
            Some(TokenValueCell::Shared(value)) => self.set_token_value_shared(Some(value)),
            None => self.set_token_value(None),
        }
    }
    fn set_token_value_shared(&mut self, token_value: Option<SharedTokenValue>) {
        self.set_token_value(token_value.map(SharedTokenValue::into_owned));
    }
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

    #[inline(always)]
    fn first_token_fast(&mut self) -> FastTokenAndValue {
        FastTokenAndValue::new(self.first_token().into(), self.take_token_value_cell())
    }

    #[inline(always)]
    fn next_token_fast(&mut self) -> FastTokenAndValue {
        FastTokenAndValue::new(self.next_token().into(), self.take_token_value_cell())
    }

    #[inline(always)]
    fn scan_jsx_token_fast(&mut self) -> FastTokenAndValue {
        FastTokenAndValue::new(self.scan_jsx_token().into(), self.take_token_value_cell())
    }

    #[inline(always)]
    fn scan_jsx_open_el_terminal_token_fast(&mut self) -> FastTokenAndValue {
        FastTokenAndValue::new(
            self.scan_jsx_open_el_terminal_token().into(),
            self.take_token_value_cell(),
        )
    }

    #[inline(always)]
    fn rescan_jsx_open_el_terminal_token_fast(&mut self, reset: BytePos) -> FastTokenAndValue {
        FastTokenAndValue::new(
            self.rescan_jsx_open_el_terminal_token(reset).into(),
            self.take_token_value_cell(),
        )
    }

    #[inline(always)]
    fn rescan_jsx_token_fast(&mut self, reset: BytePos) -> FastTokenAndValue {
        FastTokenAndValue::new(
            self.rescan_jsx_token(reset).into(),
            self.take_token_value_cell(),
        )
    }

    #[inline(always)]
    fn scan_jsx_identifier_fast(&mut self, start: BytePos) -> FastTokenAndValue {
        FastTokenAndValue::new(
            self.scan_jsx_identifier(start).into(),
            self.take_token_value_cell(),
        )
    }

    #[inline(always)]
    fn scan_jsx_attribute_value_fast(&mut self) -> FastTokenAndValue {
        FastTokenAndValue::new(
            self.scan_jsx_attribute_value().into(),
            self.take_token_value_cell(),
        )
    }

    #[inline(always)]
    fn rescan_template_token_fast(
        &mut self,
        start: BytePos,
        start_with_back_tick: bool,
    ) -> FastTokenAndValue {
        FastTokenAndValue::new(
            self.rescan_template_token(start, start_with_back_tick)
                .into(),
            self.take_token_value_cell(),
        )
    }
}

#[derive(Clone)]
pub(crate) struct BufferedNextToken {
    token_and_span: FastToken,
    value: Option<TokenValueCell>,
}

impl BufferedNextToken {
    #[inline(always)]
    fn from_fast(frame: FastTokenAndValue) -> Self {
        let (token_and_span, value) = frame.into_parts();
        Self {
            token_and_span,
            value,
        }
    }

    #[inline(always)]
    fn into_parts(self) -> (FastToken, Option<TokenValueCell>) {
        (self.token_and_span, self.value)
    }

    #[cfg(feature = "typescript")]
    #[inline(always)]
    fn checkpoint_clone(&self) -> Self {
        Self {
            token_and_span: self.token_and_span,
            value: self.value.as_ref().map(TokenValueCell::checkpoint_clone),
        }
    }

    #[inline(always)]
    pub fn token(&self) -> Token {
        self.token_and_span.token
    }

    #[inline(always)]
    pub fn span(&self) -> Span {
        self.token_and_span.span
    }

    #[inline(always)]
    pub fn had_line_break(&self) -> bool {
        self.token_and_span.had_line_break
    }
}

/// This struct is responsible for managing current token and peeked token.
#[derive(Clone)]
pub struct Buffer<I> {
    pub iter: I,
    /// Span of the previous token.
    pub prev_span: Span,
    pub(crate) cur: FastToken,
    cur_value: Option<TokenValueCell>,
    /// Peeked token
    next: Option<BufferedNextToken>,
}

/// Snapshot of the parser-visible token window and the underlying lexer cursor.
///
/// This keeps the checkpoint boundary centered on [Buffer], which owns the
/// current token, current token payload, and the peeked token payload.
#[cfg(feature = "typescript")]
pub struct BufferCheckpoint<I: Tokens> {
    lexer: I::Checkpoint,
    prev_span: Span,
    cur: FastToken,
    cur_value: Option<TokenValueCell>,
    next: Option<BufferedNextToken>,
}

impl<I: Tokens> Buffer<I> {
    pub fn expect_word_token_value(&mut self) -> Atom {
        let Some(crate::lexer::TokenValue::Word(word)) = self.take_cur_value() else {
            unreachable!()
        };
        word
    }

    pub fn expect_word_token_value_ref(&self) -> &Atom {
        let Some(crate::lexer::TokenValue::Word(word)) = self.get_token_value() else {
            unreachable!("token_value: {:?}", self.cur_value)
        };
        word
    }

    pub fn expect_number_token_value(&mut self) -> f64 {
        let Some(crate::lexer::TokenValue::Num(value)) = self.take_cur_value() else {
            unreachable!()
        };
        value
    }

    pub fn expect_string_token_value(&mut self) -> Wtf8Atom {
        let Some(crate::lexer::TokenValue::Str(value)) = self.take_cur_value() else {
            unreachable!()
        };
        value
    }

    pub fn expect_jsx_text_token_value(&mut self) -> Atom {
        let Some(crate::lexer::TokenValue::JsxText(value)) = self.take_cur_value() else {
            unreachable!()
        };
        value
    }

    pub fn expect_bigint_token_value(&mut self) -> Box<num_bigint::BigInt> {
        let Some(crate::lexer::TokenValue::BigInt(value)) = self.take_cur_value() else {
            unreachable!()
        };
        value
    }

    pub fn expect_regex_token_value(&mut self) -> BytePos {
        let Some(crate::lexer::TokenValue::Regex(exp_end)) = self.take_cur_value() else {
            unreachable!()
        };
        exp_end
    }

    pub fn expect_template_token_value(&mut self) -> LexResult<Wtf8Atom> {
        let Some(crate::lexer::TokenValue::Template(cooked)) = self.take_cur_value() else {
            unreachable!()
        };
        cooked
    }

    pub fn expect_error_token_value(&mut self) -> Error {
        let Some(crate::lexer::TokenValue::Error(error)) = self.take_cur_value() else {
            unreachable!()
        };
        error
    }

    pub fn get_token_value(&self) -> Option<&TokenValue> {
        self.cur_value.as_ref().map(TokenValueCell::as_ref)
    }

    fn take_cur_value(&mut self) -> Option<TokenValue> {
        self.cur_value.take().map(TokenValueCell::into_owned)
    }

    #[inline(always)]
    fn take_cur_shared_value(&mut self) -> Option<SharedTokenValue> {
        self.cur_value.take().map(TokenValueCell::into_shared)
    }

    pub fn scan_jsx_token(&mut self) {
        let prev = self.cur;
        let (t, value) = self.iter.scan_jsx_token_fast().into_parts();
        self.prev_span = prev.span;
        self.set_cur_with_token_value_cell(t, value);
    }

    #[allow(unused)]
    fn scan_jsx_open_el_terminal_token(&mut self) {
        let prev = self.cur;
        let (t, value) = self
            .iter
            .scan_jsx_open_el_terminal_token_fast()
            .into_parts();
        self.prev_span = prev.span;
        self.set_cur_with_token_value_cell(t, value);
    }

    pub fn rescan_jsx_open_el_terminal_token(&mut self) {
        if !self.cur().should_rescan_into_gt_in_jsx() {
            return;
        }
        // rescan `>=`, `>>`, `>>=`, `>>>`, `>>>=` into `>`
        let start = self.cur.span.lo;
        let (t, value) = self
            .iter
            .rescan_jsx_open_el_terminal_token_fast(start)
            .into_parts();
        self.set_cur_with_token_value_cell(t, value);
    }

    pub fn rescan_jsx_token(&mut self) {
        let start = self.cur.span.lo;
        let (t, value) = self.iter.rescan_jsx_token_fast(start).into_parts();
        self.set_cur_with_token_value_cell(t, value);
    }

    pub fn scan_jsx_identifier(&mut self) {
        if !self.cur().is_word() {
            return;
        }
        let start = self.cur.span.lo;
        self.iter.set_current_token_type(self.cur.token);
        let current_value = self.take_cur_shared_value();
        self.iter.set_token_value_shared(current_value);
        let (cur, value) = self.iter.scan_jsx_identifier_fast(start).into_parts();
        debug_assert!(cur.token == Token::JSXName);
        self.set_cur_with_token_value_cell(cur, value);
    }

    pub fn scan_jsx_attribute_value(&mut self) {
        let (cur, value) = self.iter.scan_jsx_attribute_value_fast().into_parts();
        self.set_cur_with_token_value_cell(cur, value);
    }

    pub fn rescan_template_token(&mut self, start_with_back_tick: bool) {
        let start = self.cur_pos();
        let (cur, value) = self
            .iter
            .rescan_template_token_fast(start, start_with_back_tick)
            .into_parts();
        self.set_cur_with_token_value_cell(cur, value);
    }
}

impl<I: Tokens> Buffer<I> {
    pub fn new(lexer: I) -> Self {
        let start_pos = lexer.start_pos();
        let prev_span = Span::new_with_checked(start_pos, start_pos);
        Buffer {
            iter: lexer,
            cur: FastToken::new(Token::Eof, prev_span, false),
            cur_value: None,
            prev_span,
            next: None,
        }
    }

    #[inline(always)]
    pub(crate) fn set_cur(&mut self, token: FastToken) {
        self.cur = token;
    }

    #[inline(always)]
    pub(crate) fn set_cur_with_value(
        &mut self,
        token: impl Into<FastToken>,
        value: Option<TokenValue>,
    ) {
        self.cur = token.into();
        self.cur_value = value.map(TokenValueCell::new_owned);
    }

    #[inline(always)]
    pub(crate) fn set_cur_with_token_value_cell(
        &mut self,
        token: impl Into<FastToken>,
        value: Option<TokenValueCell>,
    ) {
        self.cur = token.into();
        self.cur_value = value;
    }

    #[inline(always)]
    pub(crate) fn next(&self) -> Option<&BufferedNextToken> {
        self.next.as_ref()
    }

    #[inline(always)]
    pub(crate) fn set_next(&mut self, token: Option<BufferedNextToken>) {
        self.next = token;
    }

    #[inline(always)]
    pub(crate) fn next_mut(&mut self) -> &mut Option<BufferedNextToken> {
        &mut self.next
    }

    #[inline(always)]
    pub fn cur(&self) -> Token {
        self.cur.token
    }

    #[inline(always)]
    pub(crate) fn get_cur(&self) -> &FastToken {
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

        if self.next.is_none() {
            self.next = Some(BufferedNextToken::from_fast(self.iter.next_token_fast()));
        }

        self.next.as_ref().map(|ts| ts.token_and_span.token)
    }

    pub fn store(&mut self, token: Token) {
        debug_assert!(self.next().is_none());
        debug_assert!(self.cur() != Token::Eof);
        let span = self.prev_span();
        let token = FastToken::new(token, span, false);
        self.set_cur_with_value(token, None);
    }

    pub fn first_bump(&mut self) {
        let (first_token, first_value) = self.iter.first_token_fast().into_parts();
        self.prev_span = self.cur.span;
        self.set_cur_with_token_value_cell(first_token, first_value);
    }

    pub fn bump(&mut self) {
        let (next, next_value) = match self.next.take() {
            Some(next) => next.into_parts(),
            None => self.iter.next_token_fast().into_parts(),
        };
        self.prev_span = self.cur.span;
        self.cur = next;
        self.cur_value = next_value;
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
        self.get_cur().had_line_break
    }

    /// This returns true on eof.
    pub fn has_linebreak_between_cur_and_peeked(&mut self) -> bool {
        let _ = self.peek();
        self.next().map(|item| item.had_line_break()).unwrap_or({
            // return true on eof.
            true
        })
    }

    pub fn cut_lshift(&mut self) {
        debug_assert!(
            self.is(Token::LShift),
            "parser should only call cut_lshift when encountering LShift token"
        );
        let span = self.cur_span().with_lo(self.cur_span().lo + BytePos(1));
        let token = FastToken::new(Token::Lt, span, false);
        self.set_cur(token);
    }

    pub fn merge_lt_gt(&mut self) {
        debug_assert!(
            self.is(Token::Lt) || self.is(Token::Gt),
            "parser should only call merge_lt_gt when encountering Less token"
        );
        if self.peek().is_none() {
            return;
        }
        let span = self.cur_span();
        let next = self.next().unwrap();
        if span.hi != next.span().lo {
            return;
        }
        let next = self.next_mut().take().unwrap();
        let cur = self.get_cur();
        let cur_token = cur.token;
        let token = if cur_token == Token::Gt {
            let next_token = next.token();
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
                self.set_next(Some(next));
                return;
            }
        } else if cur_token == Token::Lt {
            let next_token = next.token();
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
                self.set_next(Some(next));
                return;
            }
        } else {
            self.set_next(Some(next));
            return;
        };
        let span = span.with_hi(next.span().hi);
        let token = FastToken::new(token, span, cur.had_line_break);
        self.set_cur(token);
    }

    #[inline(always)]
    pub fn is(&self, expected: Token) -> bool {
        self.cur() == expected
    }

    #[inline(always)]
    pub fn eat(&mut self, expected: Token) -> bool {
        let v = self.is(expected);
        if v {
            self.bump();
        }
        v
    }

    /// Returns start of current token.
    #[inline]
    pub fn cur_pos(&self) -> BytePos {
        self.get_cur().span.lo
    }

    #[inline]
    pub fn cur_span(&self) -> Span {
        self.get_cur().span
    }

    #[inline]
    pub fn cur_string(&self) -> &str {
        let token_span = self.cur_span();
        self.iter.read_string(token_span)
    }

    /// Returns last byte position of previous token.
    #[inline]
    pub fn last_pos(&self) -> BytePos {
        self.prev_span().hi
    }

    #[inline]
    pub fn get_ctx(&self) -> Context {
        self.iter().ctx()
    }

    #[inline]
    pub fn set_ctx(&mut self, ctx: Context) {
        self.iter_mut().set_ctx(ctx);
    }

    #[cfg(feature = "typescript")]
    pub fn checkpoint_save(&self) -> BufferCheckpoint<I> {
        BufferCheckpoint {
            lexer: self.iter.checkpoint_save(),
            prev_span: self.prev_span,
            cur: self.cur,
            cur_value: self
                .cur_value
                .as_ref()
                .map(TokenValueCell::checkpoint_clone),
            next: self.next.as_ref().map(BufferedNextToken::checkpoint_clone),
        }
    }

    #[cfg(feature = "typescript")]
    pub fn checkpoint_load(&mut self, checkpoint: BufferCheckpoint<I>) {
        self.iter.checkpoint_load(checkpoint.lexer);
        self.prev_span = checkpoint.prev_span;
        self.cur = checkpoint.cur;
        self.cur_value = checkpoint.cur_value;
        self.next = checkpoint.next;
    }

    #[cfg(test)]
    pub fn cur_value_ref_count(&self) -> Option<usize> {
        self.cur_value
            .as_ref()
            .and_then(TokenValueCell::strong_count)
    }

    #[cfg(test)]
    pub(crate) fn clone_cur_value_handle(&mut self) -> Option<SharedTokenValue> {
        let value = self.cur_value.take()?;
        let shared = value.into_shared();
        self.cur_value = Some(TokenValueCell::new_shared(shared.clone()));
        Some(shared)
    }

    #[cfg(test)]
    pub fn next_value_ref_count(&self) -> Option<usize> {
        self.next
            .as_ref()
            .and_then(|token| token.value.as_ref())
            .and_then(TokenValueCell::strong_count)
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
        self.iter().token_flags()
    }
}
