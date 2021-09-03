use super::{input::ParserInput, traits::ParseDelmited, PResult, Parser};
use crate::{
    error::{Error, ErrorKind},
    parser::{Ctx, RuleContext},
    Parse,
};
use swc_atoms::js_word;
use swc_common::{Span, Spanned, DUMMY_SP};
use swc_css_ast::*;

#[derive(Debug, Default)]
pub(super) struct AtRuleContext {}

impl<I> Parser<I>
where
    I: ParserInput,
{
    pub(super) fn parse_at_rule(&mut self, _ctx: AtRuleContext) -> PResult<AtRule> {
        let start = self.input.cur_span()?.lo;

        assert!(matches!(cur!(self), Token::AtKeyword(..)));

        let name = match bump!(self) {
            Token::AtKeyword(word) => word,
            _ => {
                unreachable!()
            }
        };

        match &*name {
            "charset" => {
                self.input.skip_ws()?;

                let value = self.may_parse_str()?;

                if let Some(v) = value {
                    eat!(self, ";");

                    let span = span!(self, start);

                    return Ok(AtRule::Charset(CharsetRule { span, charset: v }));
                }
            }

            "import" => {
                self.input.skip_ws()?;

                let res = self.expect_url_or_str();
                match res {
                    Ok(path) => {
                        // TODO

                        self.input.skip_ws()?;

                        let condition = if !is_one_of!(self, ";", EOF) {
                            Some(self.parse()?)
                        } else {
                            None
                        };

                        eat!(self, ";");

                        return Ok(AtRule::Import(ImportRule {
                            span: span!(self, start),
                            src: path,
                            condition,
                        }));
                    }
                    Err(err) => return Err(err),
                }
            }

            "keyframes" | "-moz-keyframes" | "-o-keyframes" | "-webkit-keyframes"
            | "-ms-keyframes" => {
                self.input.skip_ws()?;

                let name = if is!(self, "{") {
                    Text {
                        span: DUMMY_SP,
                        value: js_word!(""),
                    }
                } else {
                    self.parse_id()?
                };

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

            "page" => {
                self.input.skip_ws()?;

                return self
                    .parse()
                    .map(|mut r: PageRule| {
                        r.span.lo = start;
                        r
                    })
                    .map(AtRule::Page);
            }

            "document" | "-moz-document" => {
                self.input.skip_ws()?;

                return self
                    .parse()
                    .map(|mut r: DocumentRule| {
                        r.span.lo = start;
                        r
                    })
                    .map(AtRule::Document);
            }

            "namespace" => {
                self.input.skip_ws()?;

                let prefix = self.parse_id()?;
                self.input.skip_ws()?;
                let value = self.parse_str()?;

                eat!(self, ";");

                return Ok(AtRule::Namespace(NamespaceRule {
                    span: span!(self, start),
                    prefix,
                    value,
                }));
            }

            "viewport" | "-ms-viewport" => {
                self.input.skip_ws()?;

                let block = self.parse_decl_block()?;

                return Ok(AtRule::Viewport(ViewportRule {
                    span: span!(self, start),
                    block,
                }));
            }

            _ => {}
        }

        let name = Text {
            span: span!(self, start),
            value: name,
        };

        self.input.skip_ws()?;

        let token_start = self.input.cur_span()?.lo;
        let mut tokens = vec![];

        if is!(self, "{") {
            tokens.push(self.input.bump()?.unwrap());

            let mut brace_cnt = 1;
            loop {
                if is!(self, "}") {
                    brace_cnt -= 1;
                    if brace_cnt == 0 {
                        tokens.push(self.input.bump()?.unwrap());
                        break;
                    }
                }
                if is!(self, "{") {
                    brace_cnt += 1;
                }

                let token = self.input.bump()?;
                match token {
                    Some(token) => tokens.push(token),
                    None => break,
                }
            }
        } else {
            loop {
                if eat!(self, ";") {
                    break;
                }

                if self.input.is_eof()? {
                    break;
                }
                let token = self.input.bump()?;
                match token {
                    Some(token) => tokens.push(token),
                    None => break,
                }
            }

            if !is_one_of!(self, EOF, ";") {
                return Err(Error::new(
                    span!(self, start),
                    ErrorKind::UnknownAtRuleNotTerminated,
                ));
            }
        }

        Ok(AtRule::Unknown(UnknownAtRule {
            span: span!(self, start),
            name,
            tokens: Tokens {
                span: span!(self, token_start),
                tokens,
            },
        }))
    }
}

impl<I> Parse<DocumentRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<DocumentRule> {
        let span = self.input.cur_span()?;

        let selectors = {
            let mut items = vec![];

            loop {
                let res: FnValue = self.parse()?;
                items.push(res);

                self.input.skip_ws()?;
                if !is!(self, ",") {
                    break;
                }
            }

            items
        };

        expect!(self, "{");

        let block = self.parse_rules(RuleContext {
            is_top_level: false,
            parse_selectors: true,
        })?;

        expect!(self, "}");

        Ok(DocumentRule {
            span: span!(self, span.lo),
            selectors,
            block,
        })
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
            self.parse().map(KeyframeSelector::Percent)
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

        let selector = self.parse_delimited(false)?;

        let rule = self.parse()?;

        Ok(KeyframeBlock {
            span: span!(self, span.lo),
            selector,
            rule,
        })
    }
}

impl<I> ParseDelmited<KeyframeSelector> for Parser<I>
where
    I: ParserInput,
{
    fn eat_delimiter(&mut self) -> PResult<bool> {
        self.input.skip_ws()?;

        if eat!(self, ",") {
            self.input.skip_ws()?;
            Ok(true)
        } else {
            Ok(false)
        }
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
                let query = self.parse()?;

                SupportQuery::Paren(ParenSupportQuery {
                    span: span!(self, span.lo),
                    query,
                })
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
                let span = self.input.cur_span()?;
                let id = self.parse_id()?;

                self.input.skip_ws()?;

                if eat!(self, ":") {
                    self.input.skip_ws()?;

                    let ctx = Ctx {
                        allow_operation_in_value: true,
                        ..self.ctx
                    };
                    let values = self.with_ctx(ctx).parse_property_values()?.0;

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
            let right: Box<MediaQuery> = self.parse()?;

            return Ok(MediaQuery::And(AndMediaQuery {
                span: Span::new(span.lo, right.span().hi, Default::default()),
                left: Box::new(base),
                right,
            }));
        }

        if eat!(self, "or") {
            let right: Box<MediaQuery> = self.parse()?;

            return Ok(MediaQuery::Or(OrMediaQuery {
                span: Span::new(span.lo, right.span().hi, Default::default()),
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

impl<I> Parse<PageRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<PageRule> {
        let start = self.input.cur_span()?.lo;

        let prelude = {
            let mut items = vec![];
            loop {
                self.input.skip_ws()?;

                if is!(self, "{") {
                    break;
                }

                items.push(self.parse()?);

                self.input.skip_ws()?;
                if !eat!(self, ",") {
                    break;
                }
            }
            items
        };

        let block = self.parse()?;

        Ok(PageRule {
            span: span!(self, start),
            prelude,
            block,
        })
    }
}

impl<I> Parse<PageSelector> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<PageSelector> {
        self.input.skip_ws()?;

        let start = self.input.cur_span()?.lo;

        let ident = if is!(self, Ident) {
            Some(self.parse_id()?)
        } else {
            None
        };

        let pseudo = if eat!(self, ":") {
            Some(self.parse_id()?)
        } else {
            None
        };

        Ok(PageSelector {
            span: span!(self, start),
            ident,
            pseudo,
        })
    }
}

impl<I> Parse<PageRuleBlock> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<PageRuleBlock> {
        let span = self.input.cur_span()?;
        expect!(self, "{");
        self.input.skip_ws()?;
        let mut items = vec![];

        if !is!(self, "}") {
            loop {
                self.input.skip_ws()?;

                let q = self.parse()?;
                items.push(q);

                self.input.skip_ws()?;

                if is_one_of!(self, EOF, "}") {
                    break;
                }
            }
        }

        expect!(self, "}");

        Ok(PageRuleBlock {
            span: span!(self, span.lo),
            items,
        })
    }
}

impl<I> Parse<PageRuleBlockItem> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<PageRuleBlockItem> {
        match cur!(self) {
            Token::AtKeyword(..) => Ok(PageRuleBlockItem::Nested(self.parse()?)),
            _ => {
                let p = self
                    .parse_property()
                    .map(Box::new)
                    .map(PageRuleBlockItem::Property)?;
                eat!(self, ";");

                Ok(p)
            }
        }
    }
}

impl<I> Parse<NestedPageRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<NestedPageRule> {
        let start = self.input.cur_span()?.lo;

        let ctx = Ctx {
            allow_at_selctor: true,
            ..self.ctx
        };
        let prelude = self.with_ctx(ctx).parse_selectors()?;

        let block = self.parse()?;

        Ok(NestedPageRule {
            span: span!(self, start),
            prelude,
            block,
        })
    }
}
