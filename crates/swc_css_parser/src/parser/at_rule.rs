use super::{input::ParserInput, traits::ParseDelmited, PResult, Parser};
use crate::{
    error::{Error, ErrorKind},
    parser::{Ctx, RuleContext},
    Parse,
};
use swc_atoms::js_word;
use swc_common::{Span, DUMMY_SP};
use swc_css_ast::*;

#[derive(Debug, Default)]
pub(super) struct AtRuleContext {}

impl<I> Parser<I>
where
    I: ParserInput,
{
    pub(super) fn parse_at_rule(&mut self, _ctx: AtRuleContext) -> PResult<AtRule> {
        let at_rule_span = self.input.cur_span()?;

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
                            r.span.lo = at_rule_span.lo;
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
                            r.span.lo = at_rule_span.lo;
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
                            r.span.lo = at_rule_span.lo;
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
                            r.span.lo = at_rule_span.lo;
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
                            r.span.lo = at_rule_span.lo;
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
                            r.span.lo = at_rule_span.lo;
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
                            r.span.lo = at_rule_span.lo;
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
                            r.span.lo = at_rule_span.lo;
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
                            r.span.lo = at_rule_span.lo;
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
                            r.span.lo = at_rule_span.lo;
                            r
                        })
                        .map(AtRule::Viewport);
                }
            }

            "layer" => {
                self.input.skip_ws()?;

                let at_rule_layer = self.parse();

                if at_rule_layer.is_ok() {
                    return at_rule_layer
                        .map(|mut r: LayerRule| {
                            r.span.lo = at_rule_span.lo;
                            r
                        })
                        .map(AtRule::Layer);
                }
            }

            _ => {}
        }

        // Consume the next input token. Create a new at-rule with its name set to the
        // value of the current input token, its prelude initially set to an empty list,
        // and its value initially set to nothing.
        let mut at_rule = UnknownAtRule {
            span: span!(self, at_rule_span.lo),
            name: Ident {
                span: span!(self, at_rule_span.lo),
                value: name.0,
                raw: name.1,
            },
            prelude: vec![],
            block: None,
        };

        loop {
            // <EOF-token>
            // This is a parse error. Return the at-rule.
            if is!(self, EOF) {
                at_rule.span = span!(self, at_rule_span.lo);

                return Ok(AtRule::Unknown(at_rule));
            }

            match cur!(self) {
                // <semicolon-token>
                // Return the at-rule.
                tok!(";") => {
                    self.input.bump()?;

                    at_rule.span = span!(self, at_rule_span.lo);

                    return Ok(AtRule::Unknown(at_rule));
                }
                // <{-token>
                // Consume a simple block and assign it to the at-rule’s block. Return the at-rule.
                tok!("{") => {
                    self.input.bump()?;

                    at_rule.block = Some(self.parse_simple_block('}')?);
                    at_rule.span = span!(self, at_rule_span.lo);

                    return Ok(AtRule::Unknown(at_rule));
                }
                // anything else
                // Reconsume the current input token. Consume a component value. Append the returned
                // value to the at-rule’s prelude.
                _ => {
                    at_rule.prelude.push(self.parse_component_value()?);
                }
            }
        }
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

        Ok(CharsetRule {
            span: span!(self, span.lo),
            charset,
        })
    }
}

impl<I> Parse<ImportRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ImportRule> {
        let span = self.input.cur_span()?;
        let href = match cur!(self) {
            Token::Str { .. } => ImportHref::Str(self.parse()?),
            Token::Function { value, .. } if *value.to_ascii_lowercase() == js_word!("url") => {
                ImportHref::Function(self.parse()?)
            }
            Token::Url { .. } => ImportHref::Url(self.parse()?),
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("url('https://example.com') or 'https://example.com'"),
                ))
            }
        };

        self.input.skip_ws()?;

        let layer_name = match cur!(self) {
            Token::Ident { value, .. } if *value.to_ascii_lowercase() == *"layer" => {
                let name = ImportLayerName::Ident(self.parse()?);

                self.input.skip_ws()?;

                Some(name)
            }
            Token::Function { value, .. } if *value.to_ascii_lowercase() == *"layer" => {
                let name = ImportLayerName::Function(self.parse()?);

                self.input.skip_ws()?;

                Some(name)
            }
            _ => None,
        };

        let media = if !is!(self, ";") {
            Some(self.parse()?)
        } else {
            None
        };

        eat!(self, ";");

        Ok(ImportRule {
            span: span!(self, span.lo),
            href,
            layer_name,
            media,
        })
    }
}

impl<I> Parse<KeyframesRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<KeyframesRule> {
        let span = self.input.cur_span()?;
        let name = match bump!(self) {
            Token::Ident { value, raw } => KeyframesName::Ident(Ident {
                span: span!(self, span.lo),
                value,
                raw,
            }),
            Token::Str { value, raw } => KeyframesName::Str(Str {
                span: span!(self, span.lo),
                value,
                raw,
            }),
            _ => KeyframesName::Ident(Ident {
                span: DUMMY_SP,
                value: js_word!(""),
                raw: js_word!(""),
            }),
        };
        let mut blocks = vec![];

        self.input.skip_ws()?;

        if is!(self, "{") {
            expect!(self, "{");

            // TODO: change on `parse_simple_block`
            blocks = self.parse_delimited(true)?;

            expect!(self, "}");
        }

        Ok(KeyframesRule {
            span: span!(self, span.lo),
            name,
            blocks,
        })
    }
}

impl<I> Parse<ViewportRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ViewportRule> {
        let span = self.input.cur_span()?;
        let block = self.parse()?;

        Ok(ViewportRule {
            span: span!(self, span.lo),
            block,
        })
    }
}

impl<I> Parse<NamespaceRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<NamespaceRule> {
        let span = self.input.cur_span()?;
        let mut prefix = None;

        if is!(self, Ident) {
            prefix = match bump!(self) {
                Token::Ident { value, raw } => Some(Ident {
                    span: span!(self, span.lo),
                    value,
                    raw,
                }),
                _ => {
                    unreachable!()
                }
            };

            self.input.skip_ws()?;
        }

        let start_value_span = self.input.cur_span()?;

        let uri = match bump!(self) {
            Token::Str { value, raw } => NamespaceUri::Str(Str {
                span: span!(self, start_value_span.lo),
                value,
                raw,
            }),
            Token::Url { value, raw } => NamespaceUri::Url(UrlValue {
                span: span!(self, start_value_span.lo),
                url: value,
                raw,
            }),
            _ => return Err(Error::new(span, ErrorKind::Expected("Str or Url"))),
        };

        eat!(self, ";");

        Ok(NamespaceRule {
            span: span!(self, span.lo),
            prefix,
            uri,
        })
    }
}

impl<I> Parse<FontFaceRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<FontFaceRule> {
        let span = self.input.cur_span()?;
        let block = self.parse()?;

        Ok(FontFaceRule {
            span: span!(self, span.lo),
            block,
        })
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

        Ok(SupportsRule {
            span: span!(self, span.lo),
            query,
            rules,
        })
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
                let res: Function = self.parse()?;
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
            self.parse().map(KeyframeSelector::Ident)
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

        self.parse().map(Box::new).map(KeyframeBlockRule::Block)
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
                let declaration = self.parse()?;

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
        let media = self.parse()?;

        expect!(self, "{");

        let rules = self.parse_rule_list(RuleContext {
            is_top_level: false,
        })?;

        expect!(self, "}");

        Ok(MediaRule {
            span: span!(self, span.lo),
            media,
            rules,
        })
    }
}

impl<I> Parse<MediaQueryList> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<MediaQueryList> {
        self.input.skip_ws()?;

        let query = self.parse()?;
        let mut queries = vec![query];

        loop {
            self.input.skip_ws()?;

            if !eat!(self, ",") {
                break;
            }

            self.input.skip_ws()?;

            let query = self.parse()?;

            queries.push(query);
        }

        let start_pos = match queries.first() {
            Some(MediaQuery { span, .. }) => span.lo,
            _ => {
                unreachable!();
            }
        };
        let last_pos = match queries.last() {
            Some(MediaQuery { span, .. }) => span.hi,
            _ => {
                unreachable!();
            }
        };

        Ok(MediaQueryList {
            span: Span::new(start_pos, last_pos, Default::default()),
            queries,
        })
    }
}

impl<I> Parse<MediaQuery> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<MediaQuery> {
        let span = self.input.cur_span()?;
        let state = self.input.state();

        // TODO uppercase acceptable
        let mut modifier = if is!(self, "not") {
            let modifier = Some(self.parse()?);

            self.input.skip_ws()?;

            modifier
        } else if is!(self, "only") {
            let modifier = Some(self.parse()?);

            self.input.skip_ws()?;

            modifier
        } else {
            None
        };

        let media_type = if !is!(self, Ident) {
            None
        } else if is_one_of!(self, "not", "and", "or", "only") {
            None
        } else {
            let media_type = Some(self.parse()?);

            self.input.skip_ws()?;

            media_type
        };

        let condition = if media_type.is_some() {
            if eat!(self, "and") {
                self.input.skip_ws()?;

                Some(self.parse()?)
            } else {
                None
            }
        } else {
            modifier = None;

            self.input.reset(&state);

            Some(self.parse()?)
        };

        Ok(MediaQuery {
            span: span!(self, span.lo),
            modifier,
            media_type,
            condition,
        })
    }
}

impl<I> Parse<MediaCondition> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<MediaCondition> {
        self.input.skip_ws()?;

        let span = self.input.cur_span()?;
        let mut conditions = vec![];

        if is!(self, "not") {
            conditions.push(MediaConditionItem::Not(self.parse()?));
        } else {
            conditions.push(MediaConditionItem::MediaInParens(self.parse()?));

            self.input.skip_ws()?;

            if is!(self, "and") {
                while is!(self, "and") {
                    conditions.push(MediaConditionItem::And(self.parse()?));

                    self.input.skip_ws()?;
                }
            } else if eat!(self, "or") {
                while is!(self, "or") {
                    conditions.push(MediaConditionItem::Or(self.parse()?));

                    self.input.skip_ws()?;
                }
            } else {
                // TODO ERROR
            }
        };

        Ok(MediaCondition {
            span: span!(self, span.lo),
            conditions,
        })
    }
}

impl<I> Parse<MediaNot> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<MediaNot> {
        let span = self.input.cur_span()?;

        expect!(self, "not");

        self.input.skip_ws()?;

        let media_in_parens = self.parse()?;

        Ok(MediaNot {
            span: span!(self, span.lo),
            condition: media_in_parens,
        })
    }
}

impl<I> Parse<MediaAnd> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<MediaAnd> {
        let span = self.input.cur_span()?;

        expect!(self, "and");

        self.input.skip_ws()?;

        let media_in_parens = self.parse()?;

        Ok(MediaAnd {
            span: span!(self, span.lo),
            condition: media_in_parens,
        })
    }
}

impl<I> Parse<MediaOr> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<MediaOr> {
        let span = self.input.cur_span()?;

        expect!(self, "or");

        self.input.skip_ws()?;

        let media_in_parens = self.parse()?;

        Ok(MediaOr {
            span: span!(self, span.lo),
            condition: media_in_parens,
        })
    }
}

impl<I> Parse<MediaInParens> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<MediaInParens> {
        // TODO fix me for parenses
        Ok(MediaInParens::Feature(self.parse()?))
    }
}

impl<I> Parse<MediaFeature> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<MediaFeature> {
        let span = self.input.cur_span()?;

        expect!(self, "(");

        let left = self.parse()?;

        self.input.skip_ws()?;

        match cur!(self) {
            tok!(":") => {
                eat!(self, ":");

                self.input.skip_ws()?;

                let name = match left {
                    MediaFeatureValue::Ident(ident) => ident,
                    _ => {
                        // TODO another error
                        return Err(Error::new(span, ErrorKind::InvalidCharsetAtRule));
                    }
                };
                let value = self.parse()?;

                self.input.skip_ws()?;

                expect!(self, ")");

                Ok(MediaFeature::Plain(MediaFeaturePlain {
                    span: span!(self, span.lo),
                    name,
                    value,
                }))
            }
            tok!("<") | tok!(">") | tok!("=") => {
                let left_comparison = match bump!(self) {
                    tok!("<") => {
                        eat!(self, "<");

                        if eat!(self, "=") {
                            MediaFeatureRangeComparison::Le
                        } else {
                            MediaFeatureRangeComparison::Lt
                        }
                    }
                    tok!(">") => {
                        eat!(self, ">");

                        if eat!(self, "=") {
                            MediaFeatureRangeComparison::Ge
                        } else {
                            MediaFeatureRangeComparison::Gt
                        }
                    }
                    tok!("=") => {
                        eat!(self, "=");

                        MediaFeatureRangeComparison::Eq
                    }
                    _ => {
                        // TODO another error
                        return Err(Error::new(span, ErrorKind::InvalidCharsetAtRule));
                    }
                };

                self.input.skip_ws()?;

                let center = self.parse()?;

                self.input.skip_ws()?;

                if eat!(self, ")") {
                    return Ok(MediaFeature::Range(MediaFeatureRange {
                        span: span!(self, span.lo),
                        left,
                        comparison: left_comparison,
                        right: center,
                    }));
                }

                let right_comparison = match bump!(self) {
                    tok!("<") => {
                        eat!(self, "<");

                        if eat!(self, "=") {
                            MediaFeatureRangeComparison::Le
                        } else {
                            MediaFeatureRangeComparison::Lt
                        }
                    }
                    tok!(">") => {
                        eat!(self, ">");

                        if eat!(self, "=") {
                            MediaFeatureRangeComparison::Ge
                        } else {
                            MediaFeatureRangeComparison::Gt
                        }
                    }
                    _ => {
                        // TODO another error
                        return Err(Error::new(span, ErrorKind::InvalidCharsetAtRule));
                    }
                };

                self.input.skip_ws()?;

                let right = self.parse()?;

                self.input.skip_ws()?;

                expect!(self, ")");

                let name = match center {
                    MediaFeatureValue::Ident(ident) => ident,
                    _ => {
                        // TODO another error
                        return Err(Error::new(span, ErrorKind::InvalidCharsetAtRule));
                    }
                };

                // TODO validate comparison

                Ok(MediaFeature::RangeInterval(MediaFeatureRangeInterval {
                    span: span!(self, span.lo),
                    left,
                    left_comparison,
                    name,
                    right_comparison,
                    right,
                }))
            }
            _ => {
                let name = match left {
                    MediaFeatureValue::Ident(ident) => ident,
                    _ => {
                        // TODO another error
                        return Err(Error::new(span, ErrorKind::InvalidCharsetAtRule));
                    }
                };

                self.input.skip_ws()?;

                expect!(self, ")");

                Ok(MediaFeature::Boolean(MediaFeatureBoolean {
                    span: span!(self, span.lo),
                    name,
                }))
            }
        }
    }
}

impl<I> Parse<MediaFeatureValue> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<MediaFeatureValue> {
        let span = self.input.cur_span()?;

        match cur!(self) {
            Token::Num { .. } => {
                let left = self.parse()?;

                self.input.skip_ws()?;

                if eat!(self, "/") {
                    self.input.skip_ws()?;

                    let right = self.parse()?;

                    return Ok(MediaFeatureValue::Ratio(BinValue {
                        span: span!(self, span.lo),
                        op: BinOp::Div,
                        left: Box::new(Value::Number(left)),
                        right: Box::new(Value::Number(right)),
                    }));
                }

                return Ok(MediaFeatureValue::Number(left));
            }
            Token::Ident { .. } => Ok(MediaFeatureValue::Ident(self.parse()?)),
            Token::Dimension { .. } => Ok(MediaFeatureValue::Dimension(self.parse()?)),
            _ => {
                // TODO another error
                return Err(Error::new(span, ErrorKind::InvalidCharsetAtRule));
            }
        }
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
            Some(self.parse()?)
        } else {
            None
        };

        let pseudo = if eat!(self, ":") {
            Some(self.parse()?)
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
                    .parse()
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

impl<I> Parse<LayerName> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<LayerName> {
        let start = self.input.cur_span()?.lo;
        let mut name = vec![];

        while is!(self, Ident) {
            let span = self.input.cur_span()?;
            let token = bump!(self);
            let ident = match token {
                Token::Ident { value, raw } => Ident { span, value, raw },
                _ => {
                    unreachable!();
                }
            };

            name.push(ident);

            if is!(self, ".") {
                eat!(self, ".");
            }
        }

        Ok(LayerName {
            name,
            span: span!(self, start),
        })
    }
}

impl<I> Parse<LayerRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<LayerRule> {
        let span = self.input.cur_span()?;
        let prelude = if is!(self, Ident) {
            let mut name_list = vec![];

            while is!(self, Ident) {
                name_list.push(self.parse()?);

                self.input.skip_ws()?;

                if is!(self, ",") {
                    eat!(self, ",");

                    self.input.skip_ws()?;
                }
            }

            match name_list.len() == 1 {
                // Block
                true => Some(LayerPrelude::Name(name_list.remove(0))),
                // Statement
                false => {
                    let first = name_list[0].span;
                    let last = name_list[name_list.len() - 1].span;

                    Some(LayerPrelude::NameList(LayerNameList {
                        name_list,
                        span: Span::new(first.lo, last.hi, Default::default()),
                    }))
                }
            }
        } else {
            None
        };

        self.input.skip_ws()?;

        let rules = match prelude {
            // Block
            None | Some(LayerPrelude::Name(LayerName { .. })) => {
                expect!(self, "{");

                let rules = Some(self.parse_rule_list(RuleContext {
                    is_top_level: false,
                })?);

                expect!(self, "}");

                rules
            }
            // Statement
            Some(LayerPrelude::NameList(LayerNameList { .. })) => {
                expect!(self, ";");

                None
            }
        };

        return Ok(LayerRule {
            span: span!(self, span.lo),
            prelude,
            rules,
        });
    }
}
