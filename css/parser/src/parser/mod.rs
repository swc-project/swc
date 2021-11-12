use self::input::{Buffer, ParserInput};
use crate::{
    error::{Error, ErrorKind},
    Parse,
};
use std::mem::take;
use swc_common::Span;
use swc_css_ast::*;

#[macro_use]
mod macros;
mod at_rule;
pub mod input;
mod selector;
mod style_rule;
#[cfg(test)]
mod tests;
mod traits;
mod util;
mod value;

pub type PResult<T> = Result<T, Error>;

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct ParserConfig {
    pub parse_values: bool,

    /// If this is `true`, **wrong** comments starting with `//` will be treated
    /// as a comment.
    ///
    /// This option exists because there are so many css-in-js tools and people
    /// use `//` as a comment because it's javascript file.
    pub allow_wrong_line_comments: bool,
}

#[derive(Debug, Default, Clone, Copy)]
struct Ctx {
    allow_operation_in_value: bool,
    allow_separating_value_with_space: bool,
    allow_separating_value_with_comma: bool,

    disallow_comma_in_media_query: bool,

    is_in_delimited_value: bool,

    allow_at_selector: bool,

    recover_from_property_value: bool,
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

    fn parse_id(&mut self) -> PResult<Ident> {
        let span = self.input.cur_span()?;
        if !is!(self, Ident) {
            return Err(Error::new(span, ErrorKind::Expected("Ident")));
        }

        match bump!(self) {
            Token::Ident { value, raw } => Ok(Ident { span, value, raw }),
            _ => {
                unreachable!()
            }
        }
    }
}

#[derive(Clone, Copy)]
pub struct RuleContext {
    is_top_level: bool,
}

impl<I> Parse<Stylesheet> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> Result<Stylesheet, Error> {
        let start = self.input.cur_span()?;
        let rules = self.parse_rule_list(RuleContext { is_top_level: true })?;

        let last = self.input.last_pos()?;

        Ok(Stylesheet {
            span: Span::new(start.lo, last, Default::default()),
            rules,
        })
    }
}
