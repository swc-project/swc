use std::{fmt::Debug, mem::take};

use swc_common::{BytePos, Span, SyntaxContext};
use swc_css_ast::{Token, TokenAndSpan, Tokens};

use super::PResult;
use crate::error::{Error, ErrorKind};

pub trait ParserInput: Iterator<Item = TokenAndSpan> {
    type State: Debug;

    fn start_pos(&mut self) -> BytePos;

    fn state(&mut self) -> Self::State;

    fn reset(&mut self, state: &Self::State);

    fn take_errors(&mut self) -> Vec<Error>;
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

    pub fn last_pos(&mut self) -> PResult<BytePos> {
        self.cur()?;

        Ok(self.last_pos)
    }

    pub fn cur_span(&mut self) -> PResult<Span> {
        if self.cur.is_none() {
            self.bump_inner()?;
        }

        Ok(self
            .cur
            .as_ref()
            .map(|cur| cur.span)
            .unwrap_or_else(|| Span::new(self.last_pos, self.last_pos, Default::default())))
    }

    pub fn cur(&mut self) -> PResult<Option<&Token>> {
        if self.cur.is_none() {
            self.bump_inner()?;
        }

        Ok(self.cur.as_ref().map(|v| &v.token))
    }

    pub(super) fn peek(&mut self) -> PResult<Option<&Token>> {
        self.cur()?;

        if self.peeked.is_none() {
            self.peeked = self.input.next();
        }

        Ok(self.peeked.as_ref().map(|v| &v.token))
    }

    #[track_caller]
    pub fn bump(&mut self) -> PResult<Option<TokenAndSpan>> {
        debug_assert!(
            self.cur.is_some(),
            "bump() is called without checking current token"
        );

        if let Some(cur) = &self.cur {
            self.last_pos = cur.span.hi;
        }

        let token = self.cur.take();

        self.bump_inner()?;

        Ok(token)
    }

    fn bump_inner(&mut self) -> PResult<()> {
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

        Ok(())
    }

    pub fn take_errors(&mut self) -> Vec<Error> {
        take(&mut self.input.take_errors())
    }

    pub(super) fn skip_ws(&mut self) -> PResult<()> {
        loop {
            match self.cur.as_ref().map(|v| &v.token) {
                Some(tok!(" ")) => {
                    self.bump_inner()?;
                }

                Some(..) | None => return Ok(()),
            }
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
