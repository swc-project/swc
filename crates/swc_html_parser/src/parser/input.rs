use std::{fmt::Debug, mem::take};

use swc_common::{BytePos, Span};
use swc_html_ast::{Token, TokenAndSpan};

use super::PResult;
use crate::{error::Error, lexer::State};

pub trait ParserInput: Clone + Iterator<Item = TokenAndSpan> {
    fn start_pos(&mut self) -> BytePos;

    fn take_errors(&mut self) -> Vec<Error>;

    fn set_input_state(&mut self, state: State);

    fn set_adjusted_current_node_to_html_namespace(&mut self, value: bool);
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
        Ok(self.last_pos)
    }

    pub fn cur_span(&mut self) -> PResult<Span> {
        if self.cur.is_none() {
            self.bump_inner()?;
        }

        Ok(self.cur.as_ref().map(|cur| cur.span).unwrap_or_default())
    }

    pub fn cur(&mut self) -> PResult<Option<&Token>> {
        if self.cur.is_none() {
            self.bump_inner()?;
        }

        Ok(self.cur.as_ref().map(|v| &v.token))
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
            let result = self.input.next();

            if let Some(result) = result {
                self.cur = Some(result);
            } else {
                return Ok(());
            }
        }

        Ok(())
    }

    pub fn take_errors(&mut self) -> Vec<Error> {
        take(&mut self.input.take_errors())
    }

    pub(super) fn set_input_state(&mut self, state: State) {
        self.input.set_input_state(state);
    }

    pub(super) fn set_adjusted_current_node_to_html_namespace(&mut self, value: bool) {
        self.input
            .set_adjusted_current_node_to_html_namespace(value);
    }
}
