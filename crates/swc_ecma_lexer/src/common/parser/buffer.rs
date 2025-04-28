use debug_unreachable::debug_unreachable;
use swc_common::{BytePos, Span};
use swc_ecma_ast::EsVersion;

use super::token_and_span::TokenAndSpan as TokenAndSpanTrait;
use crate::{
    common::{context::Context, input::Tokens, lexer::token::TokenFactory},
    Syntax,
};

pub trait NextTokenAndSpan {
    type Token;
    fn token(&self) -> &Self::Token;
    fn span(&self) -> Span;
    fn had_line_break(&self) -> bool;
}

pub trait Buffer<
    'a,
    Lexer: super::super::lexer::Lexer<'a, TokenAndSpan>,
    Token: std::fmt::Debug + PartialEq + Clone + TokenFactory<'a, TokenAndSpan, Lexer>,
    TokenAndSpan: TokenAndSpanTrait<Token>,
    I: Tokens<TokenAndSpan>,
>
{
    type Next: NextTokenAndSpan<Token = Token>;

    fn new(lexer: I) -> Self;
    fn set_cur(&mut self, token: TokenAndSpan);
    fn next(&self) -> Option<&Self::Next>;
    fn set_next(&mut self, token: Option<Self::Next>);
    fn next_mut(&mut self) -> &mut Option<Self::Next>;

    fn cur(&mut self) -> Option<&Token>;
    fn get_cur(&self) -> Option<&TokenAndSpan>;
    fn get_cur_mut(&mut self) -> &mut Option<TokenAndSpan>;

    fn prev_span(&self) -> Span;
    fn set_prev_span(&mut self, span: Span);

    fn iter(&self) -> &I;
    fn iter_mut(&mut self) -> &mut I;
    fn peek<'b>(&'b mut self) -> Option<&'b Token>
    where
        TokenAndSpan: 'b;

    fn store(&mut self, token: Token) {
        debug_assert!(self.next().is_none());
        debug_assert!(self.get_cur().is_none());
        let span = self.prev_span();
        let token = TokenAndSpan::new(token, span, false);
        self.set_cur(token);
    }

    #[allow(dead_code)]
    fn cur_debug<'b>(&'b self) -> Option<&'b Token>
    where
        TokenAndSpan: 'b,
    {
        self.get_cur().map(|it| it.token())
    }

    #[cold]
    #[inline(never)]
    fn dump_cur(&mut self) -> String {
        match self.cur() {
            Some(v) => format!("{:?}", v),
            None => "<eof>".to_string(),
        }
    }
    /// Returns current token.
    fn bump(&mut self) -> Token {
        let prev = match self.get_cur_mut().take() {
            Some(t) => t,
            None => unsafe {
                debug_unreachable!(
                    "Current token is `None`. Parser should not call bump() without knowing \
                     current token"
                )
            },
        };
        self.set_prev_span(prev.span());
        prev.take_token()
    }

    #[inline]
    fn knows_cur(&self) -> bool {
        self.get_cur().is_some()
    }

    fn had_line_break_before_cur(&mut self) -> bool {
        self.cur();
        self.get_cur()
            .map(|it| it.had_line_break())
            .unwrap_or_else(|| true)
    }

    /// This returns true on eof.
    fn has_linebreak_between_cur_and_peeked(&mut self) -> bool {
        let _ = self.peek();
        self.next().map(|item| item.had_line_break()).unwrap_or({
            // return true on eof.
            true
        })
    }

    fn cut_lshift(&mut self) {
        debug_assert!(
            self.is(&Token::lshift()),
            "parser should only call cut_lshift when encountering LShift token"
        );
        let span = self.cur_span().with_lo(self.cur_span().lo + BytePos(1));
        let token = TokenAndSpan::new(Token::less(), span, false);
        self.set_cur(token);
    }

    fn merge_lt_gt(&mut self) {
        debug_assert!(
            self.is(&Token::less()) || self.is(&Token::greater()),
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
        let cur = self.get_cur_mut().take().unwrap();
        let next = self.next_mut().take().unwrap();
        let cur_token = cur.token();
        let token = if cur_token == &Token::greater() {
            let next_token = next.token();
            if next_token == &Token::greater() {
                // >>
                Token::rshift()
            } else if next_token == &Token::equal() {
                // >=
                Token::greater_eq()
            } else if next_token == &Token::rshift() {
                // >>>
                Token::zero_fill_rshift()
            } else if next_token == &Token::greater_eq() {
                // >>=
                Token::rshift_eq()
            } else if next_token == &Token::rshift_eq() {
                // >>>=
                Token::zero_fill_rshift_eq()
            } else {
                self.set_cur(cur);
                self.set_next(Some(next));
                return;
            }
        } else if cur_token == &Token::less() {
            let next_token = next.token();
            if next_token == &Token::less() {
                // <<
                Token::lshift()
            } else if next_token == &Token::equal() {
                // <=
                Token::less_eq()
            } else if next_token == &Token::less_eq() {
                // <<=
                Token::lshift_eq()
            } else {
                self.set_cur(cur);
                self.set_next(Some(next));
                return;
            }
        } else {
            self.set_cur(cur);
            self.set_next(Some(next));
            return;
        };
        let span = span.with_hi(next.span().hi);
        let token = TokenAndSpan::new(token, span, cur.had_line_break());
        self.set_cur(token);
    }

    #[inline]
    fn is(&mut self, expected: &Token) -> bool {
        match self.cur() {
            Some(t) => expected == t,
            _ => false,
        }
    }

    #[inline]
    fn eat(&mut self, expected: &Token) -> bool {
        let v = self.is(expected);
        if v {
            self.bump();
        }
        v
    }

    /// Returns start of current token.
    #[inline]
    fn cur_pos(&mut self) -> BytePos {
        let _ = self.cur();
        self.get_cur()
            .map(|item| item.span().lo)
            .unwrap_or_else(|| {
                // eof
                self.last_pos()
            })
    }

    #[inline]
    fn cur_span(&self) -> Span {
        let data = self
            .get_cur()
            .map(|item| item.span())
            .unwrap_or(self.prev_span());
        Span::new(data.lo, data.hi)
    }

    /// Returns last byte position of previous token.
    #[inline]
    fn last_pos(&self) -> BytePos {
        self.prev_span().hi
    }

    #[inline]
    fn get_ctx(&self) -> Context {
        self.iter().ctx()
    }

    #[inline]
    fn set_ctx(&mut self, ctx: Context) {
        self.iter_mut().set_ctx(ctx);
    }

    #[inline]
    fn syntax(&self) -> Syntax {
        self.iter().syntax()
    }

    #[inline]
    fn target(&self) -> EsVersion {
        self.iter().target()
    }

    #[inline]
    fn set_expr_allowed(&mut self, allow: bool) {
        self.iter_mut().set_expr_allowed(allow)
    }

    #[inline]
    fn set_next_regexp(&mut self, start: Option<BytePos>) {
        self.iter_mut().set_next_regexp(start);
    }

    #[inline]
    fn token_context<'b>(&'b self) -> &'b crate::lexer::TokenContexts
    where
        I: 'b,
    {
        self.iter().token_context()
    }

    #[inline]
    fn token_context_mut<'b>(&'b mut self) -> &'b mut crate::lexer::TokenContexts
    where
        I: 'b,
    {
        self.iter_mut().token_context_mut()
    }

    #[inline]
    fn set_token_context(&mut self, c: crate::lexer::TokenContexts) {
        self.iter_mut().set_token_context(c);
    }

    #[inline]
    fn end_pos(&self) -> BytePos {
        self.iter().end_pos()
    }
}
