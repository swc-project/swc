use super::PResult;
use crate::error::{Error, ErrorKind};
use std::fmt::Debug;
use swc_common::{BytePos, Span, SyntaxContext};
use swc_css_ast::{Token, TokenAndSpan, Tokens};

pub trait ParserInput {
    type State: Debug;

    fn next(&mut self) -> PResult<TokenAndSpan>;

    fn skip_whitespaces(&mut self) -> PResult<()>;

    fn start_pos(&mut self) -> BytePos;

    fn state(&mut self) -> Self::State;

    fn reset(&mut self, state: &Self::State);
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

    pub fn is_eof(&mut self) -> PResult<bool> {
        Ok(self.cur()?.is_none())
    }

    pub fn last_pos(&mut self) -> PResult<BytePos> {
        self.cur()?;

        Ok(self.last_pos)
    }

    pub fn cur_span(&mut self) -> PResult<Span> {
        if self.cur.is_none() {
            self.bump_inner(false)?;
        }

        Ok(self.cur.as_ref().map(|cur| cur.span).unwrap_or_default())
    }

    pub fn cur(&mut self) -> PResult<Option<&Token>> {
        if self.cur.is_none() {
            self.bump_inner(true)?;
        }

        Ok(self.cur.as_ref().map(|v| &v.token))
    }

    pub(super) fn peek(&mut self) -> PResult<Option<&Token>> {
        self.cur()?;

        if self.peeked.is_none() {
            self.peeked = Some(self.input.next()?);
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

        self.bump_inner(false)?;

        Ok(token)
    }

    fn bump_inner(&mut self, skip_whitespace: bool) -> PResult<()> {
        if let Some(cur) = &self.cur {
            self.last_pos = cur.span.hi;
        }

        self.cur = None;

        if let Some(next) = self.peeked.take() {
            if skip_whitespace {
                match next.token {
                    tok!(" ") => {}
                    _ => {
                        self.cur = Some(next);
                    }
                }
            } else {
                self.cur = Some(next);
            }
        }

        if skip_whitespace {
            self.input.skip_whitespaces()?;
        }

        if self.cur.is_none() {
            let res = self.input.next();

            match &res {
                Err(err) => {
                    if let ErrorKind::Eof = err.kind() {
                        return Ok(());
                    }
                }
                _ => {}
            }

            self.cur = res.map(Some)?;
        }

        Ok(())
    }

    pub(super) fn skip_ws(&mut self) -> PResult<()> {
        match self.cur.as_ref().map(|v| &v.token) {
            Some(tok!(" ")) => {
                self.bump_inner(true)?;
                Ok(())
            }

            Some(..) => Ok(()),

            None => {
                if self.peeked.is_none() {
                    self.input.skip_whitespaces()?;
                } else {
                    match self.peeked.as_ref().map(|v| &v.token) {
                        Some(tok!(" ")) => {
                            self.peeked = None;
                            self.input.skip_whitespaces()?;
                        }
                        _ => {}
                    }
                }
                Ok(())
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

pub struct TokensInput<'a> {
    tokens: &'a Tokens,
    idx: usize,
}

impl<'a> TokensInput<'a> {
    pub fn new(tokens: &'a Tokens) -> Self {
        TokensInput { tokens, idx: 0 }
    }

    fn cur(&mut self) -> PResult<&TokenAndSpan> {
        let ret = self.tokens.tokens.get(self.idx);
        let ret = match ret {
            Some(v) => v,
            None => {
                let bp = self.tokens.span.hi;
                let span = Span::new(bp, bp, SyntaxContext::empty());
                return Err(Error::new(span, ErrorKind::Eof));
            }
        };

        Ok(ret)
    }
}

impl ParserInput for TokensInput<'_> {
    type State = TokensState;

    fn next(&mut self) -> PResult<TokenAndSpan> {
        let ret = self.cur()?.clone();
        self.idx += 1;

        Ok(ret)
    }

    fn skip_whitespaces(&mut self) -> PResult<()> {
        let cur = self.tokens.tokens.get(self.idx);
        let cur = match cur {
            Some(cur) => cur,
            None => return Ok(()),
        };

        match cur.token {
            tok!(" ") => {
                self.idx += 1;
            }

            _ => {}
        }

        Ok(())
    }

    fn start_pos(&mut self) -> BytePos {
        self.tokens.span.lo
    }

    fn state(&mut self) -> Self::State {
        TokensState { idx: self.idx }
    }

    fn reset(&mut self, state: &Self::State) {
        self.idx = state.idx;
    }
}
