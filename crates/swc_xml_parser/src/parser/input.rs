use std::{fmt::Debug, mem::take};

use swc_common::{BytePos, Span};
use swc_xml_ast::{Token, TokenAndSpan};

use super::PResult;
use crate::error::Error;

pub trait ParserInput: Iterator<Item = TokenAndSpan> {
    fn start_pos(&mut self) -> BytePos;

    fn last_pos(&mut self) -> BytePos;

    fn take_errors(&mut self) -> Vec<Error>;
}

#[derive(Debug)]
pub(super) struct Buffer<I>
where
    I: ParserInput,
{
    cur: Option<TokenAndSpan>,
    input: I,
}

impl<I> Buffer<I>
where
    I: ParserInput,
{
    pub fn new(input: I) -> Self {
        Buffer { cur: None, input }
    }

    /// Last start position
    pub fn start_pos(&mut self) -> PResult<BytePos> {
        Ok(self.input.start_pos())
    }

    /// Last end position
    pub fn last_pos(&mut self) -> PResult<BytePos> {
        Ok(self.input.last_pos())
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

        let token = self.cur.take();

        Ok(token)
    }

    fn bump_inner(&mut self) -> PResult<()> {
        self.cur = None;

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
}
