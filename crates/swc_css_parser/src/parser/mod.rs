use std::mem::take;

use swc_css_ast::*;

use self::input::{Buffer, ParserInput};
use crate::{error::Error, Parse};

#[macro_use]
mod macros;
mod at_rule;
mod base;
pub mod input;
mod selector;
#[cfg(test)]
mod tests;
mod util;
mod value;

pub type PResult<T> = Result<T, Error>;

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct ParserConfig {
    /// If this is `true`, **wrong** comments starting with `//` will be treated
    /// as a comment.
    ///
    /// This option exists because there are so many css-in-js tools and people
    /// use `//` as a comment because it's javascript file.
    pub allow_wrong_line_comments: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum BlockContentsGrammar {
    NoGrammar,
    StyleBlock,
    DeclarationList,
    RuleList,
    Stylesheet,
    DeclarationValue,
}

impl Default for BlockContentsGrammar {
    fn default() -> Self {
        BlockContentsGrammar::NoGrammar
    }
}

#[derive(Debug, Default, Clone, Copy)]
struct Ctx {
    block_contents_grammar: BlockContentsGrammar,

    in_supports_at_rule: bool,
    in_page_at_rule: bool,
}

#[derive(Debug)]
pub struct Parser<I>
where
    I: ParserInput,
{
    #[allow(dead_code)]
    config: ParserConfig,
    input: Buffer<I>,
    ctx: Ctx,
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
            ctx: Default::default(),
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

    pub fn parse_all(&mut self) -> PResult<Stylesheet> {
        self.parse()
    }
}

#[derive(Clone, Copy)]
pub struct RuleContext {
    is_top_level: bool,
}
