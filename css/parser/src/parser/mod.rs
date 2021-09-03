use std::mem::take;

use self::input::{Buffer, ParserInput};
use crate::{
    error::{Error, ErrorKind},
    Parse,
};
use swc_atoms::js_word;
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
}

#[derive(Debug, Default, Clone, Copy)]
struct Ctx {
    allow_operation_in_value: bool,
    allow_separating_value_with_space: bool,
    allow_separating_value_with_comma: bool,

    disallow_comma_in_media_query: bool,

    is_in_delimited_value: bool,

    allow_at_selctor: bool,
}

#[derive(Debug)]
pub struct Parser<I>
where
    I: ParserInput,
{
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

    fn parse_rules(&mut self, ctx: RuleContext) -> PResult<Vec<Rule>> {
        let mut rules = vec![];
        loop {
            self.input.skip_ws()?;

            if self.input.is_eof()? || is!(self, "}") {
                return Ok(rules);
            }

            match cur!(self) {
                Token::AtKeyword(..) => {
                    let rule = self.parse_at_rule(Default::default())?;
                    rules.push(rule.into());
                    continue;
                }

                tok!("<!--") | tok!("-->") => {
                    if ctx.is_top_level {
                        self.input.bump()?;
                        continue;
                    }
                }

                _ => {}
            }

            if ctx.parse_selectors {
                rules.push(self.parse_style_rule()?.into());
            } else {
                rules.push(self.parse_qualified_rule()?);
            }
        }
    }

    fn parse_qualified_rule(&mut self) -> PResult<Rule> {
        todo!("parse_qualified_rule: {:?}", cur!(self))
    }

    fn expect_url_or_str(&mut self) -> PResult<Str> {
        if is!(self, Str) {
            return self.parse_str();
        }

        self.parse_url()
    }

    fn may_parse_str(&mut self) -> PResult<Option<Str>> {
        if is!(self, Str) {
            self.parse_str().map(Some)
        } else {
            Ok(None)
        }
    }

    fn parse_id(&mut self) -> PResult<Text> {
        let span = self.input.cur_span()?;
        if !is!(self, Ident) {
            return Err(Error::new(span, ErrorKind::Expected("Ident")));
        }

        match bump!(self) {
            Token::Ident(value) => Ok(Text { span, value }),
            _ => {
                unreachable!()
            }
        }
    }

    fn parse_str(&mut self) -> PResult<Str> {
        let span = self.input.cur_span()?;
        if !is!(self, Str) {
            return Err(Error::new(span, ErrorKind::Expected("Str")));
        }

        match bump!(self) {
            Token::Str { value } => Ok(Str { span, value }),
            _ => {
                unreachable!()
            }
        }
    }

    fn parse_url(&mut self) -> PResult<Str> {
        let span = self.input.cur_span()?;

        match cur!(self) {
            Token::Ident(js_word!("url")) => {
                bump!(self);
                expect!(self, "(");
                let value = self.parse_str()?.value;
                expect!(self, ")");
                Ok(Str {
                    span: span!(self, span.lo),
                    value,
                })
            }

            Token::Url { .. } => match bump!(self) {
                Token::Url { value } => Ok(Str { span, value }),
                _ => {
                    unreachable!()
                }
            },

            _ => Err(Error::new(
                span,
                ErrorKind::Expected("url('https://example.com') or 'https://example.com'"),
            )),
        }
    }
}

#[derive(Clone, Copy)]
struct RuleContext {
    is_top_level: bool,
    parse_selectors: bool,
}

impl<I> Parse<Stylesheet> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> Result<Stylesheet, Error> {
        let start = self.input.cur_span()?;
        let rules = self.parse_rules(RuleContext {
            is_top_level: true,
            parse_selectors: true,
        })?;

        let last = self.input.last_pos()?;

        Ok(Stylesheet {
            span: Span::new(start.lo, last, Default::default()),
            rules,
        })
    }
}
