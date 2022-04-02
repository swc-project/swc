use std::mem::take;

use swc_html_ast::*;

use self::input::{Buffer, ParserInput};
use crate::{error::Error, Parse};

#[macro_use]
mod macros;
mod base;
pub mod input;
#[cfg(test)]
mod tests;

pub type PResult<T> = Result<T, Error>;

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct ParserConfig {}

#[derive(Debug, Default, Clone, Copy)]
struct Ctx {}

#[derive(Debug)]
pub struct Parser<I>
where
    I: ParserInput,
{
    #[allow(dead_code)]
    config: ParserConfig,
    input: Buffer<I>,
    // ctx: Ctx,
    errors: Vec<Error>,
}

impl<I> Parser<I>
where
    I: ParserInput,
{
    pub fn new(input: I, config: ParserConfig) -> Self {
        Parser {
            config,
            input: Buffer::new(input),
            // ctx: Default::default(),
            errors: Default::default(),
        }
    }

    pub fn dump_cur(&mut self) -> String {
        format!("{:?}", self.input.cur())
    }

    /// Take **recovered** errors.
    pub fn take_errors(&mut self) -> Vec<Error> {
        take(&mut self.errors)
    }

    pub fn parse_all(&mut self) -> PResult<Document> {
        self.parse()
    }
}
