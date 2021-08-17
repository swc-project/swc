use super::{
    input::ParserInput,
    traits::{Parse, ParseDelmited},
    PResult, Parser,
};
use crate::{
    error::{Error, ErrorKind},
    parser::{Ctx, RuleContext},
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
                    eat!(self, ";");

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

                        eat!(self, ";");

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

                expect!(self, "{");
                self.input.skip_ws()?;

                let blocks = self.parse_delimited(true)?;
                expect!(self, "}");

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

            "media" => {
                self.input.skip_ws()?;

                let query = self.parse()?;

                expect!(self, "{");
                let rules = self.parse_rules(RuleContext {
                    is_top_level: false,
                    parse_selectors: true,
                })?;
                expect!(self, "}");

                return Ok(AtRule::Media(MediaRule {
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
            self.input.skip_ws()?;

            let query = if is!(self, "(") {
                let query: SupportQuery = self.parse()?;

                query
            } else {
                let property = self.parse_property()?;

                SupportQuery::Property(property)
            };

            expect!(self, ")");
            self.input.skip_ws()?;

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

impl<I> Parse<MediaQuery> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<MediaQuery> {
        self.input.skip_ws()?;

        let span = self.input.cur_span()?;

        let base = if eat!(self, "not") {
            let query = self.parse()?;
            MediaQuery::Not(NotMediaQuery {
                span: span!(self, span.lo),
                query,
            })
        } else if eat!(self, "only") {
            let query = self.parse()?;
            MediaQuery::Only(OnlyMediaQuery {
                span: span!(self, span.lo),
                query,
            })
        } else if is!(self, Ident) {
            let text = self.parse_id()?;
            MediaQuery::Text(text)
        } else if eat!(self, "(") {
            if is!(self, Ident) {
                let id = self.parse_id()?;

                self.input.skip_ws()?;

                if eat!(self, ":") {
                    self.input.skip_ws()?;

                    let ctx = Ctx {
                        allow_operation_in_value: true,
                        ..self.ctx
                    };
                    let values = self.with_ctx(ctx).parse_property_values()?;

                    expect!(self, ")");

                    MediaQuery::Property(Property {
                        span: span!(self, span.lo),
                        name: id,
                        values,
                        important: Default::default(),
                    })
                } else {
                    expect!(self, ")");
                    MediaQuery::Text(id)
                }
            } else {
                let query: MediaQuery = self.parse()?;
                expect!(self, ")");

                query
            }
        } else {
            return Err(Error::new(span, ErrorKind::InvalidMediaQuery));
        };

        self.input.skip_ws()?;

        if eat!(self, "and") {
            let right = self.parse()?;

            return Ok(MediaQuery::And(AndMediaQuery {
                span: span!(self, span.lo),
                left: Box::new(base),
                right,
            }));
        }

        if eat!(self, "or") {
            let right = self.parse()?;

            return Ok(MediaQuery::Or(OrMediaQuery {
                span: span!(self, span.lo),
                left: Box::new(base),
                right,
            }));
        }

        if !self.ctx.disallow_comma_in_media_query && eat!(self, ",") {
            let mut queries = Vec::with_capacity(4);
            queries.push(base);

            loop {
                self.input.skip_ws()?;

                let ctx = Ctx {
                    disallow_comma_in_media_query: true,
                    ..self.ctx
                };
                let q = self.with_ctx(ctx).parse_with(|p| p.parse())?;
                queries.push(q);

                self.input.skip_ws()?;
                if !eat!(self, ",") {
                    break;
                }
            }

            return Ok(MediaQuery::Comma(CommaMediaQuery {
                span: span!(self, span.lo),
                queries,
            }));
        }

        return Ok(base);
    }
}
