use super::{
    input::ParserInput,
    traits::{Parse, ParseDelmited},
    PResult, Parser,
};
use crate::{
    error::{Error, ErrorKind},
    parser::RuleContext,
    token::Token,
};
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

                        return Ok(AtRule::Import(ImportRule {
                            span: span!(self, start),
                            src: path,
                        }));
                    }
                    _ => {}
                }
            }

            "keyframes" => {
                self.input.skip_ws()?;

                let name = self.parse_id()?;

                self.input.skip_ws()?;
                expect!(self, "{");
                self.input.skip_ws()?;

                let blocks = self.parse_delimited(true)?;
                self.input.skip_ws()?;
                expect!(self, "}");
                self.input.skip_ws()?;

                return Ok(AtRule::Keyframes(KeyframesRule {
                    span: span!(self, start),
                    id: name,
                    blocks,
                }));
            }

            "font-face" => {
                self.input.skip_ws()?;

                let block = self.parse_decl_block()?;

                return Ok(AtRule::FontFace(FontFaceRule {
                    span: span!(self, start),
                    block,
                }));
            }

            "supports" => {
                self.input.skip_ws()?;

                let query = self.parse()?;

                expect!(self, "{");
                let rules = self.parse_rules(RuleContext {
                    is_top_level: false,
                    parse_selectors: true,
                })?;
                expect!(self, "}");

                return Ok(AtRule::Supports(SupportsRule {
                    span: span!(self, start),
                    query,
                    rules,
                }));
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
            self.parse().map(KeyframeSelector::Perecent)
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

impl<I> Parse<SupportQuery> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<SupportQuery> {
        self.input.skip_ws()?;

        let span = self.input.cur_span()?;

        if eat!(self, "not") {
            let query = self.parse()?;
            return Ok(SupportQuery::Not(NotSupportQuery {
                span: span!(self, span.lo),
                query,
            }));
        }

        if eat!(self, "(") {
            let property = self.parse_property()?;

            self.input.skip_ws()?;

            expect!(self, ")");
            self.input.skip_ws()?;

            let query = SupportQuery::Property(property);

            if eat!(self, "and") {
                let right = self.parse()?;

                return Ok(SupportQuery::And(AndSupportQuery {
                    span: span!(self, span.lo),
                    left: Box::new(query),
                    right,
                }));
            }

            if eat!(self, "or") {
                let right = self.parse()?;

                return Ok(SupportQuery::Or(OrSupportQuery {
                    span: span!(self, span.lo),
                    left: Box::new(query),
                    right,
                }));
            }

            return Ok(query);
        }

        Err(Error::new(span, ErrorKind::InvalidSupportQuery))
    }
}
