use std::{fmt::Debug, mem::take};

use swc_atoms::JsWord;
use swc_common::{BytePos, Span, Spanned, SyntaxContext};
use swc_css_ast::{ComponentValue, ListOfComponentValues, Token, TokenAndSpan};

use super::PResult;
use crate::error::{Error, ErrorKind};

pub trait ParserInput: Clone + Iterator<Item = TokenAndSpan> {
    type State: Debug;

    fn start_pos(&mut self) -> BytePos;

    fn state(&mut self) -> Self::State;

    fn reset(&mut self, state: &Self::State);

    fn take_errors(&mut self) -> Vec<Error>;

    /// Returns `last_pos`
    fn skip_ws(&mut self) -> Option<BytePos>;
}

#[derive(Debug, Clone)]
pub(super) struct Buffer<I>
where
    I: ParserInput,
{
    cur: Option<TokenAndSpan>,
    peeked: Option<TokenAndSpan>,
    input: I,
    last_pos: BytePos,
}

impl<I> Buffer<I>
where
    I: ParserInput,
{
    pub fn new(mut input: I) -> Self {
        let last_pos = input.start_pos();

        Buffer {
            cur: None,
            peeked: None,
            input,
            last_pos,
        }
    }

    pub fn last_pos(&mut self) -> BytePos {
        self.cur();

        self.last_pos
    }

    pub fn cur_span(&mut self) -> Span {
        if self.cur.is_none() {
            self.bump_inner();
        }

        self.cur
            .as_ref()
            .map(|cur| cur.span)
            .unwrap_or_else(|| Span::new(self.last_pos, self.last_pos, Default::default()))
    }

    pub fn cur(&mut self) -> Option<&Token> {
        if self.cur.is_none() {
            self.bump_inner();
        }

        self.cur.as_ref().map(|v| &v.token)
    }

    pub(super) fn peek(&mut self) -> Option<&Token> {
        self.cur();

        if self.peeked.is_none() {
            self.peeked = self.input.next();
        }

        self.peeked.as_ref().map(|v| &v.token)
    }

    #[track_caller]
    pub fn bump(&mut self) -> Option<TokenAndSpan> {
        debug_assert!(
            self.cur.is_some(),
            "bump() is called without checking current token"
        );

        if let Some(cur) = &self.cur {
            self.last_pos = cur.span.hi;
        }

        let token = self.cur.take();

        self.bump_inner();

        token
    }

    fn bump_inner(&mut self) {
        if let Some(cur) = &self.cur {
            self.last_pos = cur.span.hi;
        }

        self.cur = None;

        if let Some(next) = self.peeked.take() {
            self.cur = Some(next);
        }

        if self.cur.is_none() {
            let token_and_span = self.input.next();

            self.cur = token_and_span;
        }
    }

    pub fn take_errors(&mut self) -> Vec<Error> {
        take(&mut self.input.take_errors())
    }

    pub(super) fn skip_ws(&mut self) {
        if self.cur.is_none() {
            self.bump_inner();
        }

        if let Some(TokenAndSpan {
            token: tok!(" "),
            span,
        }) = &self.cur
        {
            self.last_pos = span.hi;
            self.cur = None;

            {
                // Drop peeked
                if let Some(next) = self.peeked.take() {
                    self.cur = Some(next);
                }

                match &self.cur {
                    Some(TokenAndSpan {
                        token: tok!(" "),
                        span,
                    }) => {
                        self.last_pos = span.hi;

                        self.cur = None;
                    }
                    Some(..) => return,
                    None => {}
                }
            }

            if let Some(last_pos) = self.input.skip_ws() {
                self.last_pos = last_pos;
            }

            self.cur = self.input.next();
        }
    }

    pub(super) fn state(&mut self) -> WrappedState<I::State> {
        WrappedState {
            cur: self.cur.clone(),
            inner: self.input.state(),
        }
    }

    pub(super) fn reset(&mut self, state: &WrappedState<I::State>) {
        self.cur = state.cur.clone();
        self.input.reset(&state.inner);
    }
}

#[derive(Debug, Clone)]
pub(super) struct WrappedState<S> {
    cur: Option<TokenAndSpan>,
    inner: S,
}

#[derive(Debug)]
pub struct TokensState {
    idx: usize,
}

#[derive(Debug, Clone)]
pub struct TokensInput<'a> {
    tokens: &'a Tokens,
    idx: usize,
}

#[derive(Debug)]
pub struct Tokens {
    pub span: Span,
    pub tokens: Vec<TokenAndSpan>,
}

impl<'a> TokensInput<'a> {
    pub fn new(tokens: &'a Tokens) -> Self {
        TokensInput { tokens, idx: 0 }
    }

    fn cur(&mut self) -> PResult<&TokenAndSpan> {
        let token_and_span = match self.tokens.tokens.get(self.idx) {
            Some(v) => v,
            None => {
                let bp = self.tokens.span.hi;
                let span = Span::new(bp, bp, SyntaxContext::empty());

                return Err(Error::new(span, ErrorKind::Eof));
            }
        };

        Ok(token_and_span)
    }
}

impl<'a> ParserInput for TokensInput<'a> {
    type State = TokensState;

    fn start_pos(&mut self) -> BytePos {
        self.tokens.span.lo
    }

    fn state(&mut self) -> Self::State {
        TokensState { idx: self.idx }
    }

    fn reset(&mut self, state: &Self::State) {
        self.idx = state.idx;
    }

    fn take_errors(&mut self) -> Vec<Error> {
        vec![]
    }

    fn skip_ws(&mut self) -> Option<BytePos> {
        let mut last_pos = None;

        while let Ok(TokenAndSpan {
            token: tok!(" "),
            span,
        }) = self.cur()
        {
            last_pos = Some(span.hi);
            self.idx += 1;
        }

        last_pos
    }
}

impl<'a> Iterator for TokensInput<'a> {
    type Item = TokenAndSpan;

    fn next(&mut self) -> Option<Self::Item> {
        let token_and_span = match self.cur() {
            Ok(token_and_span) => token_and_span.clone(),
            _ => return None,
        };

        self.idx += 1;

        Some(token_and_span)
    }
}

#[derive(Debug)]
pub struct ListOfComponentValuesState {
    idx: Vec<usize>,
    balance_stack: Vec<BalanceToken>,
}

#[derive(Debug, Clone)]
pub struct ListOfComponentValuesInput<'a> {
    list: &'a ListOfComponentValues,
    idx: Vec<usize>,
    balance_stack: Vec<BalanceToken>,
}

#[derive(Debug, Clone)]
#[allow(clippy::enum_variant_names)]
enum BalanceToken {
    /// `]`
    RBracket,

    /// `)`
    RParen,

    /// `}`
    RBrace,
}

#[derive(Debug)]
pub enum TokenOrBlock {
    Token(TokenAndSpan),
    Function(Span, JsWord, JsWord),
    LBracket(Span),
    LParen(Span),
    LBrace(Span),
    RParen(Span),
    RBracket(Span),
    RBrace(Span),
}

impl<'a> ListOfComponentValuesInput<'a> {
    pub fn new(list: &'a ListOfComponentValues) -> Self {
        let mut idx = Vec::with_capacity(16);

        idx.push(0);

        ListOfComponentValuesInput {
            list,
            idx,
            balance_stack: Vec::with_capacity(16),
        }
    }

    fn get_component_value(
        &mut self,
        list: &'a [ComponentValue],
        deep: usize,
    ) -> Option<TokenOrBlock> {
        let index = match self.idx.get(deep) {
            Some(index) => index,
            _ => return None,
        };

        match list.get(*index) {
            Some(ComponentValue::PreservedToken(token_and_span)) => {
                Some(TokenOrBlock::Token(token_and_span.clone()))
            }
            Some(ComponentValue::Function(function)) => {
                if self.idx.len() - 1 == deep {
                    return Some(TokenOrBlock::Function(
                        Span::new(
                            function.span_lo(),
                            function.name.span_hi() + BytePos(1),
                            Default::default(),
                        ),
                        function.name.value.clone(),
                        match &function.name.raw {
                            Some(raw) => raw.clone(),
                            _ => function.name.value.clone(),
                        },
                    ));
                }

                let res = self.get_component_value(&function.value, deep + 1);

                if res.is_none() {
                    return Some(TokenOrBlock::RParen(Span::new(
                        function.span_hi() - BytePos(1),
                        function.span_hi(),
                        Default::default(),
                    )));
                }

                res
            }
            Some(ComponentValue::SimpleBlock(simple_block)) => {
                if self.idx.len() - 1 == deep {
                    let close = match simple_block.name.token {
                        Token::LBracket => TokenOrBlock::LBracket(simple_block.name.span),
                        Token::LParen => TokenOrBlock::LParen(simple_block.name.span),
                        Token::LBrace => TokenOrBlock::LBrace(simple_block.name.span),
                        _ => {
                            unreachable!();
                        }
                    };

                    return Some(close);
                }

                let res = self.get_component_value(&simple_block.value, deep + 1);

                if res.is_none() {
                    let span = Span::new(
                        simple_block.span_hi() - BytePos(1),
                        simple_block.span_hi(),
                        Default::default(),
                    );
                    let close = match simple_block.name.token {
                        Token::LBracket => TokenOrBlock::RBracket(span),
                        Token::LParen => TokenOrBlock::RParen(span),
                        Token::LBrace => TokenOrBlock::RBrace(span),
                        _ => {
                            unreachable!();
                        }
                    };

                    return Some(close);
                }

                res
            }
            None => return None,
            _ => {
                unreachable!("Not allowed in the list of component values")
            }
        }
    }

    fn cur(&mut self) -> PResult<TokenAndSpan> {
        let token_and_span = match self.get_component_value(&self.list.children, 0) {
            Some(token_or_block) => match token_or_block {
                TokenOrBlock::Token(token_and_span) => token_and_span,
                TokenOrBlock::Function(span, value, raw) => TokenAndSpan {
                    span,
                    token: Token::Function { value, raw },
                },
                TokenOrBlock::LBracket(span) => TokenAndSpan {
                    span,
                    token: Token::LBracket,
                },
                TokenOrBlock::LBrace(span) => TokenAndSpan {
                    span,
                    token: Token::LBrace,
                },
                TokenOrBlock::LParen(span) => TokenAndSpan {
                    span,
                    token: Token::LParen,
                },
                TokenOrBlock::RBracket(span) => TokenAndSpan {
                    span,
                    token: Token::RBracket,
                },
                TokenOrBlock::RBrace(span) => TokenAndSpan {
                    span,
                    token: Token::RBrace,
                },
                TokenOrBlock::RParen(span) => TokenAndSpan {
                    span,
                    token: Token::RParen,
                },
            },
            None => {
                let bp = self.list.span.hi;
                let span = Span::new(bp, bp, SyntaxContext::empty());

                return Err(Error::new(span, ErrorKind::Eof));
            }
        };

        Ok(token_and_span)
    }
}

impl<'a> ParserInput for ListOfComponentValuesInput<'a> {
    type State = ListOfComponentValuesState;

    fn start_pos(&mut self) -> BytePos {
        self.list.span.lo
    }

    fn state(&mut self) -> Self::State {
        ListOfComponentValuesState {
            idx: self.idx.clone(),
            balance_stack: self.balance_stack.clone(),
        }
    }

    fn reset(&mut self, state: &Self::State) {
        self.idx = state.idx.clone();
        self.balance_stack = state.balance_stack.clone();
    }

    fn take_errors(&mut self) -> Vec<Error> {
        vec![]
    }

    fn skip_ws(&mut self) -> Option<BytePos> {
        let mut last_pos = None;

        while let Ok(TokenAndSpan {
            token: tok!(" "),
            span,
        }) = self.cur()
        {
            last_pos = Some(span.hi);

            if let Some(idx) = self.idx.last_mut() {
                *idx += 1;
            }
        }

        last_pos
    }
}

impl<'a> Iterator for ListOfComponentValuesInput<'a> {
    type Item = TokenAndSpan;

    fn next(&mut self) -> Option<Self::Item> {
        let token_and_span = match self.cur() {
            Ok(token_and_span) => token_and_span,
            _ => return None,
        };

        match &token_and_span.token {
            Token::Function { .. } | Token::LParen | Token::LBracket | Token::LBrace => {
                self.idx.push(0);

                let balance = match &token_and_span.token {
                    Token::Function { .. } | Token::LParen => BalanceToken::RParen,
                    Token::LBracket => BalanceToken::RBracket,
                    Token::LBrace => BalanceToken::RBrace,
                    _ => {
                        unreachable!();
                    }
                };

                self.balance_stack.push(balance);
            }
            token => {
                match token {
                    Token::RBrace | Token::RBracket | Token::RParen => {
                        if let Some(last) = self.balance_stack.last() {
                            match (token, last) {
                                (Token::RBrace, BalanceToken::RBrace)
                                | (Token::RParen, BalanceToken::RParen)
                                | (Token::RBracket, BalanceToken::RBracket) => {
                                    self.balance_stack.pop();
                                    self.idx.pop();
                                }
                                _ => {}
                            }
                        }
                    }
                    _ => {}
                }

                let index = match self.idx.last_mut() {
                    Some(index) => index,
                    _ => return None,
                };

                *index += 1;
            }
        }

        Some(token_and_span)
    }
}
