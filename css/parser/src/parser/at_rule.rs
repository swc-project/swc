use super::{
    input::ParserInput,
    traits::{Block, Parse, ParseDelmited},
    PResult, Parser,
};
use crate::token::Token;
use swc_common::Span;
use swc_css_ast::*;

#[derive(Debug, Default)]
pub(super) struct AtRuleContext {}

enum AtRuleKind {
    Empty,
    Declarations,
    InheritContext,
}

impl<I> Parser<I>
where
    I: ParserInput,
{
    pub(super) fn parse_at_rule(&mut self, ctx: AtRuleContext) -> PResult<AtRule> {
        let start = self.input.cur_span()?.lo;

        assert!(matches!(cur!(self), Token::AtKeyword(..)));

        let name = match bump!(self) {
            Token::AtKeyword(word) => word,
            _ => {
                unreachable!()
            }
        };

        let kind;

        let prelude_start = self.input.cur_span()?.lo;
        match &*name {
            "charset" => {
                kind = AtRuleKind::Empty;

                self.input.skip_ws()?;

                let value = self.may_parse_str()?;

                if let Some(v) = value {
                    let span = span!(self, start);
                    return Ok(AtRule::Charset(CharsetRule { span, charset: v }));
                }
            }

            "import" => {
                kind = AtRuleKind::Empty;
                self.input.skip_ws()?;

                let res = self.expect_url_or_str();
                match res {
                    Ok(path) => {
                        // TODO
                        let import_conditin_start = self.input.cur_span()?.lo;

                        if !is_one_of!(self, ";", EOF) {}
                    }
                    _ => {}
                }
            }

            "keyframes" => {
                self.input.skip_ws()?;

                return self.parse_items_block().map(AtRule::Keyframes);
            }

            _ => {}
        }

        todo!("at rule ({})", name)
    }
}

impl<I> Parse<KeyframeSelector> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<KeyframeSelector> {
        if is!(self, Ident) {
            self.parse_id().map(KeyframeSelector::Id)
        } else {
            todo!("parse percentage value for keyframe")
        }
    }
}

impl<I> Parse<KeyframeBlockRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<KeyframeBlockRule> {
        if is!(self, AtKeyword) {
            return self
                .parse_at_rule(Default::default())
                .map(Box::new)
                .map(KeyframeBlockRule::AtRule);
        }

        self.parse_decl_block()
            .map(Box::new)
            .map(KeyframeBlockRule::Decl)
    }
}

impl<I> Parse<KeyframeBlock> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<KeyframeBlock> {
        let span = self.input.cur_span()?;

        let selector = self.parse()?;

        let rule = self.parse()?;

        Ok(KeyframeBlock {
            span: span!(self, span.lo),
            selector,
            rule,
        })
    }
}

impl<I> ParseDelmited<KeyframeBlock> for Parser<I>
where
    I: ParserInput,
{
    fn eat_delimiter(&mut self) -> PResult<bool> {
        self.input.skip_ws()?;

        if is!(self, "}") {
            Ok(false)
        } else {
            Ok(true)
        }
    }
}

impl Block for KeyframesRule {
    type Content = Vec<KeyframeBlock>;

    fn from_content(span: Span, blocks: Self::Content) -> Self {
        Self { span, blocks }
    }
}
