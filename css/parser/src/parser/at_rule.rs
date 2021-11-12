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

        assert!(matches!(cur!(self), Token::AtKeyword { .. }));

        let name = match bump!(self) {
            Token::AtKeyword { value, raw } => (value, raw),
            _ => {
                unreachable!()
            }
        };

        match &*name.0.to_ascii_lowercase() {
            "charset" => {
                self.input.skip_ws()?;

                let at_rule_charset = self.parse();

                if at_rule_charset.is_ok() {
                    return at_rule_charset
                        .map(|mut r: CharsetRule| {
                            r.span.lo = start;
                            r
                        })
                        .map(AtRule::Charset);
                }
            }

            "import" => {
                self.input.skip_ws()?;

                let at_rule_import = self.parse();

                if at_rule_import.is_ok() {
                    return at_rule_import
                        .map(|mut r: ImportRule| {
                            r.span.lo = start;
                            r
                        })
                        .map(AtRule::Import);
                }
            }

            "keyframes" | "-moz-keyframes" | "-o-keyframes" | "-webkit-keyframes"
            | "-ms-keyframes" => {
                self.input.skip_ws()?;

                let at_rule_keyframe = self.parse();

                if at_rule_keyframe.is_ok() {
                    return at_rule_keyframe
                        .map(|mut r: KeyframesRule| {
                            r.span.lo = start;
                            r
                        })
                        .map(AtRule::Keyframes);
                }
            }

            "font-face" => {
                self.input.skip_ws()?;

                let at_rule_font_face = self.parse();

                if at_rule_font_face.is_ok() {
                    return at_rule_font_face
                        .map(|mut r: FontFaceRule| {
                            r.span.lo = start;
                            r
                        })
                        .map(AtRule::FontFace);
                }
            }

            "supports" => {
                self.input.skip_ws()?;

                let at_rule_supports = self.parse();

                if at_rule_supports.is_ok() {
                    return at_rule_supports
                        .map(|mut r: SupportsRule| {
                            r.span.lo = start;
                            r
                        })
                        .map(AtRule::Supports);
                }
            }

            "media" => {
                self.input.skip_ws()?;

                let at_rule_media = self.parse();

                if at_rule_media.is_ok() {
                    return at_rule_media
                        .map(|mut r: MediaRule| {
                            r.span.lo = start;
                            r
                        })
                        .map(AtRule::Media);
                }
            }

            "page" => {
                self.input.skip_ws()?;

                let at_rule_page = self.parse();

                if at_rule_page.is_ok() {
                    return at_rule_page
                        .map(|mut r: PageRule| {
                            r.span.lo = start;
                            r
                        })
                        .map(AtRule::Page);
                }
            }

            "document" | "-moz-document" => {
                self.input.skip_ws()?;

                let at_rule_document = self.parse();

                if at_rule_document.is_ok() {
                    return at_rule_document
                        .map(|mut r: DocumentRule| {
                            r.span.lo = start;
                            r
                        })
                        .map(AtRule::Document);
                }
            }

            "namespace" => {
                self.input.skip_ws()?;

                let at_rule_namespace = self.parse();

                if at_rule_namespace.is_ok() {
                    return at_rule_namespace
                        .map(|mut r: NamespaceRule| {
                            r.span.lo = start;
                            r
                        })
                        .map(AtRule::Namespace);
                }
            }

            "viewport" | "-ms-viewport" => {
                self.input.skip_ws()?;

                let at_rule_viewport = self.parse();

                if at_rule_viewport.is_ok() {
                    return at_rule_viewport
                        .map(|mut r: ViewportRule| {
                            r.span.lo = start;
                            r
                        })
                        .map(AtRule::Viewport);
                }
            }

            _ => {}
        }

        let name = Ident {
            span: span!(self, start),
            value: name.0,
            raw: name.1,
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

impl<I> Parse<CharsetRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<CharsetRule> {
        let span = self.input.cur_span()?;
        let charset = match cur!(self) {
            Token::Str { .. } => self.parse()?,
            _ => return Err(Error::new(span, ErrorKind::InvalidCharsetAtRule)),
        };

        eat!(self, ";");

        return Ok(CharsetRule {
            span: span!(self, span.lo),
            charset,
        });
    }
}

impl<I> Parse<ImportRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ImportRule> {
        let span = self.input.cur_span()?;

        let src = match cur!(self) {
            Token::Str { .. } => {
                let str = self.parse()?;

                Ok(ImportSource::Str(str))
            }
            Token::Function { value, .. } if *value.to_ascii_lowercase() == js_word!("url") => {
                let func = self.parse()?;

                Ok(ImportSource::Fn(func))
            }
            Token::Url { .. } => {
                let url = self.parse()?;

                Ok(ImportSource::Url(url))
            }
            _ => Err(Error::new(
                span,
                ErrorKind::Expected("url('https://example.com') or 'https://example.com'"),
            )),
        };

        self.input.skip_ws()?;

        let condition = if !is_one_of!(self, ";", EOF) {
            Some(self.parse()?)
        } else {
            None
        };

        eat!(self, ";");

        return Ok(ImportRule {
            span: span!(self, span.lo),
            src: src.unwrap(),
            condition,
        });
    }
}

impl<I> Parse<KeyframesRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<KeyframesRule> {
        let span = self.input.cur_span()?;
        let name = match bump!(self) {
            Token::Ident { value, raw } => Ident {
                span: span!(self, span.lo),
                value,
                raw,
            },
            Token::Str { value, raw } => Ident {
                span: span!(self, span.lo),
                value,
                raw,
            },
            _ => Ident {
                span: DUMMY_SP,
                value: js_word!(""),
                raw: js_word!(""),
            },
        };
        let mut blocks = vec![];

        self.input.skip_ws()?;

        if is!(self, "{") {
            expect!(self, "{");

            // TODO: change on `parse_simple_block`
            blocks = self.parse_delimited(true)?;

            expect!(self, "}");
        }

        return Ok(KeyframesRule {
            span: span!(self, span.lo),
            id: name,
            blocks,
        });
    }
}

impl<I> Parse<ViewportRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ViewportRule> {
        let span = self.input.cur_span()?;
        let block = self.parse_simple_block()?;

        return Ok(ViewportRule {
            span: span!(self, span.lo),
            block,
        });
    }
}

impl<I> Parse<NamespaceRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<NamespaceRule> {
        let span = self.input.cur_span()?;
        // TODO: make optional
        let mut prefix = Ident {
            span: DUMMY_SP,
            value: js_word!(""),
            raw: js_word!(""),
        };

        if is!(self, Ident) {
            prefix = match bump!(self) {
                Token::Ident { value, raw } => Ident {
                    span: span!(self, span.lo),
                    value,
                    raw,
                },
                _ => {
                    unreachable!()
                }
            };

            self.input.skip_ws()?;
        }

        let start_value_span = self.input.cur_span()?;

        let value = match bump!(self) {
            Token::Str { value, raw } => NamespaceValue::Str(Str {
                span: span!(self, start_value_span.lo),
                value,
                raw,
            }),
            Token::Url { value, raw } => NamespaceValue::Url(UrlValue {
                span: span!(self, start_value_span.lo),
                url: value,
                raw,
            }),
            _ => NamespaceValue::Str(Str {
                span: span!(self, start_value_span.lo),
                value: js_word!(""),
                raw: js_word!(""),
            }),
        };

        eat!(self, ";");

        return Ok(NamespaceRule {
            span: span!(self, span.lo),
            prefix,
            value,
        });
    }
}

impl<I> Parse<FontFaceRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<FontFaceRule> {
        let span = self.input.cur_span()?;
        let block = self.parse_simple_block()?;

        return Ok(FontFaceRule {
            span: span!(self, span.lo),
            block,
        });
    }
}

impl<I> Parse<SupportsRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<SupportsRule> {
        let span = self.input.cur_span()?;
        let query = self.parse()?;

        expect!(self, "{");

        let rules = self.parse_rule_list(RuleContext {
            is_top_level: false,
        })?;

        expect!(self, "}");

        return Ok(SupportsRule {
            span: span!(self, span.lo),
            query,
            rules,
        });
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

        let block = self.parse_rule_list(RuleContext {
            is_top_level: false,
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
        let span = self.input.cur_span()?;

        if is!(self, Ident) {
            self.parse_id().map(KeyframeSelector::Ident)
        } else if is!(self, Percent) {
            self.parse().map(KeyframeSelector::Percent)
        } else {
            Err(Error::new(span, ErrorKind::InvalidKeyframeSelector))
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

        self.parse_simple_block()
            .map(Box::new)
            .map(KeyframeBlockRule::Block)
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
                let declaration = self.parse_declaration()?;

                SupportQuery::Declaration(declaration)
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

impl<I> Parse<MediaRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<MediaRule> {
        let span = self.input.cur_span()?;
        let query = self.parse()?;

        expect!(self, "{");

        let rules = self.parse_rule_list(RuleContext {
            is_top_level: false,
        })?;

        expect!(self, "}");

        return Ok(MediaRule {
            span: span!(self, span.lo),
            query,
            rules,
        });
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
            let ident = self.parse_id()?;
            MediaQuery::Ident(ident)
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
                    let value = self.with_ctx(ctx).parse_property_values()?.0;

                    expect!(self, ")");

                    MediaQuery::Declaration(Declaration {
                        span: span!(self, span.lo),
                        property: id,
                        value,
                        important: Default::default(),
                    })
                } else {
                    expect!(self, ")");
                    MediaQuery::Ident(id)
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
            Token::AtKeyword { .. } => Ok(PageRuleBlockItem::Nested(self.parse()?)),
            _ => {
                let p = self
                    .parse_declaration()
                    .map(Box::new)
                    .map(PageRuleBlockItem::Declaration)?;
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
            allow_at_selector: true,
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
