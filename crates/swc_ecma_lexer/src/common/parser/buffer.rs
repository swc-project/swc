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

pub trait Buffer<'a> {
    type Token: std::fmt::Debug + PartialEq + Clone + TokenFactory<'a, Self::TokenAndSpan, Self::I>;
    type Lexer: super::super::lexer::Lexer<'a, Self::TokenAndSpan>;
    type Next: NextTokenAndSpan<Token = Self::Token>;
    type TokenAndSpan: TokenAndSpanTrait<Token = Self::Token>;
    type I: Tokens<Self::TokenAndSpan>;

    fn new(lexer: Self::I) -> Self;
    fn iter(&self) -> &Self::I;
    fn iter_mut(&mut self) -> &mut Self::I;

    fn set_cur(&mut self, token: Self::TokenAndSpan);
    fn next(&self) -> Option<&Self::Next>;
    fn set_next(&mut self, token: Option<Self::Next>);
    fn next_mut(&mut self) -> &mut Option<Self::Next>;

    fn cur(&mut self) -> Option<&Self::Token>;
    fn get_cur(&self) -> Option<&Self::TokenAndSpan>;
    fn get_cur_mut(&mut self) -> &mut Option<Self::TokenAndSpan>;

    fn prev_span(&self) -> Span;
    fn set_prev_span(&mut self, span: Span);

    fn peek<'b>(&'b mut self) -> Option<&'b Self::Token>
    where
        Self::TokenAndSpan: 'b;

    fn store(&mut self, token: Self::Token) {
        debug_assert!(self.next().is_none());
        debug_assert!(self.get_cur().is_none());
        let span = self.prev_span();
        let token = Self::TokenAndSpan::new(token, span, false);
        self.set_cur(token);
    }

    #[allow(dead_code)]
    fn cur_debug<'b>(&'b self) -> Option<&'b Self::Token>
    where
        Self::TokenAndSpan: 'b,
    {
        self.get_cur().map(|it| it.token())
    }

    fn dump_cur(&mut self) -> String;

    /// Returns current token.
    fn bump(&mut self) -> Self::Token {
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
            self.is(&Self::Token::LSHIFT),
            "parser should only call cut_lshift when encountering LShift token"
        );
        let span = self.cur_span().with_lo(self.cur_span().lo + BytePos(1));
        let token = Self::TokenAndSpan::new(Self::Token::LESS, span, false);
        self.set_cur(token);
    }

    fn merge_lt_gt(&mut self) {
        debug_assert!(
            self.is(&Self::Token::LESS) || self.is(&Self::Token::GREATER),
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
        let token = if cur_token.is_greater() {
            let next_token = next.token();
            if next_token.is_greater() {
                // >>
                Self::Token::RSHIFT
            } else if next_token.is_equal() {
                // >=
                Self::Token::GREATER_EQ
            } else if next_token.is_rshift() {
                // >>>
                Self::Token::ZERO_FILL_RSHIFT
            } else if next_token.is_greater_eq() {
                // >>=
                Self::Token::RSHIFT_EQ
            } else if next_token.is_rshift_eq() {
                // >>>=
                Self::Token::ZERO_FILL_RSHIFT_EQ
            } else {
                self.set_cur(cur);
                self.set_next(Some(next));
                return;
            }
        } else if cur_token.is_less() {
            let next_token = next.token();
            if next_token.is_less() {
                // <<
                Self::Token::LSHIFT
            } else if next_token.is_equal() {
                // <=
                Self::Token::LESS_EQ
            } else if next_token.is_less_eq() {
                // <<=
                Self::Token::LSHIFT_EQ
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
        let token = Self::TokenAndSpan::new(token, span, cur.had_line_break());
        self.set_cur(token);
    }

    #[inline(always)]
    fn is(&mut self, expected: &Self::Token) -> bool {
        self.cur().is_some_and(|cur| cur == expected)
    }

    #[inline(always)]
    fn eat(&mut self, expected: &Self::Token) -> bool {
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
    fn can_skip_space(&self) -> bool {
        self.iter().can_skip_space()
    }

    #[inline]
    fn set_can_skip_space(&mut self, can_skip_space: bool) {
        self.iter_mut().set_can_skip_space(can_skip_space);
    }

    #[inline]
    fn token_context<'b>(&'b self) -> &'b crate::lexer::TokenContexts
    where
        Self::I: 'b,
    {
        self.iter().token_context()
    }

    #[inline]
    fn token_context_mut<'b>(&'b mut self) -> &'b mut crate::lexer::TokenContexts
    where
        Self::I: 'b,
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
