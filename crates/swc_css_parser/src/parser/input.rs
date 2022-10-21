use std::{fmt::Debug, mem::take};

use swc_common::{BytePos, Span, Spanned, SyntaxContext};
use swc_css_ast::{ComponentValue, ListOfComponentValues, Token, TokenAndSpan};

use super::PResult;
use crate::error::{Error, ErrorKind};

pub trait ParserInput: Iterator<Item = TokenAndSpan> {
    type State: Debug;

    fn start_pos(&mut self) -> BytePos;

    fn state(&mut self) -> Self::State;

    fn reset(&mut self, state: &Self::State);

    fn take_errors(&mut self) -> Vec<Error>;

    /// Returns `last_pos`
    fn skip_ws(&mut self) -> Option<BytePos>;
}

#[derive(Debug)]
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

#[derive(Debug)]
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
}

#[derive(Debug)]
pub struct ListOfComponentValuesInput<'a> {
    list: &'a ListOfComponentValues,
    idx: Vec<usize>,
}

impl<'a> ListOfComponentValuesInput<'a> {
    pub fn new(list: &'a ListOfComponentValues) -> Self {
        ListOfComponentValuesInput { list, idx: vec![0] }
    }

    fn get_component_value(
        &mut self,
        list: Vec<ComponentValue>,
        deep: usize,
    ) -> Option<TokenAndSpan> {
        let index = match self.idx.get(deep) {
            Some(index) => index,
            _ => return None,
        };

        match list.get(*index) {
            Some(ComponentValue::PreservedToken(token_and_span)) => Some(token_and_span.clone()),
            Some(ComponentValue::Function(function)) => {
                if self.idx.len() - 1 == deep {
                    return Some(TokenAndSpan {
                        span: Span::new(
                            function.span_lo(),
                            function.name.span_hi() + BytePos(1),
                            Default::default(),
                        ),
                        token: Token::Function {
                            value: function.name.value.clone(),
                            raw: function.name.value.clone(),
                        },
                    });
                }

                let res = self.get_component_value(function.value.clone(), deep + 1);

                if res.is_none() {
                    return Some(TokenAndSpan {
                        span: Span::new(
                            function.span_hi() - BytePos(1),
                            function.span_hi(),
                            Default::default(),
                        ),
                        token: Token::RParen,
                    });
                }

                res
            }
            Some(ComponentValue::SimpleBlock(simple_block)) => {
                if self.idx.len() - 1 == deep {
                    return Some(simple_block.name.clone());
                }

                let res = self.get_component_value(simple_block.value.clone(), deep + 1);

                if res.is_none() {
                    return Some(match simple_block.name.token {
                        Token::LBracket => TokenAndSpan {
                            span: Span::new(
                                simple_block.span_hi() - BytePos(1),
                                simple_block.span_hi(),
                                Default::default(),
                            ),
                            token: Token::RBracket,
                        },
                        Token::LParen => TokenAndSpan {
                            span: Span::new(
                                simple_block.span_hi() - BytePos(1),
                                simple_block.span_hi(),
                                Default::default(),
                            ),
                            token: Token::RParen,
                        },
                        Token::LBrace => TokenAndSpan {
                            span: Span::new(
                                simple_block.span_hi() - BytePos(1),
                                simple_block.span_hi(),
                                Default::default(),
                            ),
                            token: Token::RBrace,
                        },
                        _ => {
                            unreachable!();
                        }
                    });
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
        let token_and_span = match self.get_component_value(self.list.children.clone(), 0) {
            Some(token_and_span) => token_and_span,
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
        }
    }

    fn reset(&mut self, state: &Self::State) {
        self.idx = state.idx.clone();
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
            Token::Function { .. } | Token::LParen | Token::LBrace | Token::LBracket => {
                self.idx.push(0);
            }
            token => {
                match token {
                    Token::RBrace | Token::RBracket | Token::RParen => {
                        self.idx.pop();
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
