use swc_common::{BytePos, Span};
use swc_css_ast::*;

use super::{input::ParserInput, PResult, Parser};
use crate::{
    error::{Error, ErrorKind},
    parser::{BlockContentsGrammar, Ctx},
    Parse,
};

impl<I> Parse<AtRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<AtRule> {
        let at_rule_span = self.input.cur_span()?;

        let name = match bump!(self) {
            Token::AtKeyword { value, raw } => (value, raw),
            _ => {
                unreachable!()
            }
        };

        let state = self.input.state();

        match &*name.0.to_ascii_lowercase() {
            "charset" => {
                self.input.skip_ws()?;

                let at_rule_charset: PResult<CharsetRule> = self.parse();

                match at_rule_charset {
                    Ok(mut r) => {
                        r.span.lo = at_rule_span.lo;

                        return Ok(AtRule::Charset(r));
                    }
                    Err(err) => {
                        self.errors.push(err);
                    }
                }
            }

            "import" => {
                self.input.skip_ws()?;

                let at_rule_import: PResult<ImportRule> = self.parse();

                match at_rule_import {
                    Ok(mut r) => {
                        r.span.lo = at_rule_span.lo;

                        return Ok(AtRule::Import(r));
                    }
                    Err(err) => {
                        self.errors.push(err);
                    }
                }
            }

            "keyframes" | "-moz-keyframes" | "-o-keyframes" | "-webkit-keyframes"
            | "-ms-keyframes" => {
                self.input.skip_ws()?;

                let at_rule_keyframe: PResult<KeyframesRule> = self.parse();

                match at_rule_keyframe {
                    Ok(mut r) => {
                        r.span.lo = at_rule_span.lo;

                        return Ok(AtRule::Keyframes(r));
                    }
                    Err(err) => {
                        self.errors.push(err);
                    }
                }
            }

            "font-face" => {
                self.input.skip_ws()?;

                let at_rule_font_face: PResult<FontFaceRule> = self.parse();

                match at_rule_font_face {
                    Ok(mut r) => {
                        r.span.lo = at_rule_span.lo;

                        return Ok(AtRule::FontFace(r));
                    }
                    Err(err) => {
                        self.errors.push(err);
                    }
                }
            }

            "supports" => {
                self.input.skip_ws()?;

                let at_rule_supports: PResult<SupportsRule> = self.parse();

                match at_rule_supports {
                    Ok(mut r) => {
                        r.span.lo = at_rule_span.lo;

                        return Ok(AtRule::Supports(r));
                    }
                    Err(err) => {
                        self.errors.push(err);
                    }
                }
            }

            "media" => {
                self.input.skip_ws()?;

                let at_rule_media: PResult<MediaRule> = self.parse();

                match at_rule_media {
                    Ok(mut r) => {
                        r.span.lo = at_rule_span.lo;

                        return Ok(AtRule::Media(r));
                    }
                    Err(err) => {
                        self.errors.push(err);
                    }
                }
            }

            "page" => {
                self.input.skip_ws()?;

                let at_rule_page: PResult<PageRule> = self.parse();

                match at_rule_page {
                    Ok(mut r) => {
                        r.span.lo = at_rule_span.lo;

                        return Ok(AtRule::Page(r));
                    }
                    Err(err) => {
                        self.errors.push(err);
                    }
                }
            }

            "top-left-corner"
            | "top-left"
            | "top-center"
            | "top-right"
            | "top-right-corner"
            | "bottom-left-corner"
            | "bottom-left"
            | "bottom-center"
            | "bottom-right"
            | "bottom-right-corner"
            | "left-top"
            | "left-middle"
            | "left-bottom"
            | "right-top"
            | "right-middle"
            | "right-bottom"
                if self.ctx.in_page_at_rule =>
            {
                let margin_rule_name = Ident {
                    span: Span::new(
                        at_rule_span.lo + BytePos(1),
                        at_rule_span.hi,
                        Default::default(),
                    ),
                    value: name.0.clone(),
                    raw: name.1.clone(),
                };

                self.input.skip_ws()?;

                let margin_rule = self.parse();

                if margin_rule.is_ok() {
                    return margin_rule
                        .map(|mut r: PageMarginRule| {
                            r.name = margin_rule_name;
                            r.span.lo = at_rule_span.lo;
                            r
                        })
                        .map(AtRule::PageMargin);
                }
            }

            "document" | "-moz-document" => {
                self.input.skip_ws()?;

                let at_rule_document: PResult<DocumentRule> = self.parse();

                match at_rule_document {
                    Ok(mut r) => {
                        r.span.lo = at_rule_span.lo;

                        return Ok(AtRule::Document(r));
                    }
                    Err(err) => {
                        self.errors.push(err);
                    }
                }
            }

            "namespace" => {
                self.input.skip_ws()?;

                let at_rule_namespace: PResult<NamespaceRule> = self.parse();

                match at_rule_namespace {
                    Ok(mut r) => {
                        r.span.lo = at_rule_span.lo;

                        return Ok(AtRule::Namespace(r));
                    }
                    Err(err) => {
                        self.errors.push(err);
                    }
                }
            }

            "nest" => {
                self.input.skip_ws()?;

                let at_rule_nest: PResult<NestRule> = self.parse();

                match at_rule_nest {
                    Ok(mut r) => {
                        r.span.lo = at_rule_span.lo;

                        return Ok(AtRule::Nest(r));
                    }
                    Err(err) => {
                        self.errors.push(err);
                    }
                }
            }

            "viewport" | "-ms-viewport" => {
                self.input.skip_ws()?;

                let at_rule_viewport: PResult<ViewportRule> = self.parse();

                match at_rule_viewport {
                    Ok(mut r) => {
                        r.span.lo = at_rule_span.lo;

                        return Ok(AtRule::Viewport(r));
                    }
                    Err(err) => {
                        self.errors.push(err);
                    }
                }
            }

            "layer" => {
                self.input.skip_ws()?;

                let at_rule_layer: PResult<LayerRule> = self.parse();

                match at_rule_layer {
                    Ok(mut r) => {
                        r.span.lo = at_rule_span.lo;

                        return Ok(AtRule::Layer(r));
                    }
                    Err(err) => {
                        self.errors.push(err);
                    }
                }
            }

            "color-profile" => {
                self.input.skip_ws()?;

                let at_rule_color_profile: PResult<ColorProfileRule> = self.parse();

                match at_rule_color_profile {
                    Ok(mut r) => {
                        r.span.lo = at_rule_span.lo;

                        return Ok(AtRule::ColorProfile(r));
                    }
                    Err(err) => {
                        self.errors.push(err);
                    }
                }
            }

            "counter-style" => {
                self.input.skip_ws()?;

                let at_rule_counter_style: PResult<CounterStyleRule> = self.parse();

                match at_rule_counter_style {
                    Ok(mut r) => {
                        r.span.lo = at_rule_span.lo;

                        return Ok(AtRule::CounterStyle(r));
                    }
                    Err(err) => {
                        self.errors.push(err);
                    }
                }
            }

            "property" => {
                self.input.skip_ws()?;

                let at_rule_color_profile: PResult<PropertyRule> = self.parse();

                match at_rule_color_profile {
                    Ok(mut r) => {
                        r.span.lo = at_rule_span.lo;

                        return Ok(AtRule::Property(r));
                    }
                    Err(err) => {
                        self.errors.push(err);
                    }
                }
            }

            _ => {}
        }

        self.input.reset(&state);

        let name = if name.0.starts_with("--") {
            AtRuleName::DashedIdent(DashedIdent {
                span: Span::new(
                    at_rule_span.lo + BytePos(1),
                    at_rule_span.hi,
                    Default::default(),
                ),
                value: name.0,
                raw: name.1,
            })
        } else {
            AtRuleName::Ident(Ident {
                span: Span::new(
                    at_rule_span.lo + BytePos(1),
                    at_rule_span.hi,
                    Default::default(),
                ),
                value: name.0,
                raw: name.1,
            })
        };

        // Consume the next input token. Create a new at-rule with its name set to the
        // value of the current input token, its prelude initially set to an empty list,
        // and its value initially set to nothing.
        let mut at_rule = UnknownAtRule {
            span: span!(self, at_rule_span.lo),
            name,
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
                    let ctx = Ctx {
                        block_contents_grammar: BlockContentsGrammar::NoGrammar,
                        ..self.ctx
                    };
                    let block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;

                    at_rule.block = Some(block);
                    at_rule.span = span!(self, at_rule_span.lo);

                    return Ok(AtRule::Unknown(at_rule));
                }
                // anything else
                // Reconsume the current input token. Consume a component value. Append the returned
                // value to the at-rule’s prelude.
                _ => {
                    at_rule.prelude.push(self.parse()?);
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
            tok!("string") => self.parse()?,
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
            tok!("string") => ImportHref::Str(self.parse()?),
            tok!("url") => ImportHref::Url(self.parse()?),
            tok!("function") => ImportHref::Url(self.parse()?),
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("string, url or function"),
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

        let supports = match cur!(self) {
            Token::Function { value, .. } if *value.to_ascii_lowercase() == *"supports" => {
                bump!(self);

                self.input.skip_ws()?;

                let supports = if is_case_insensitive_ident!(self, "not") || is!(self, "(") {
                    ImportSupportsType::SupportsCondition(self.parse()?)
                } else {
                    ImportSupportsType::Declaration(self.parse()?)
                };

                expect!(self, ")");

                Some(supports)
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
            supports,
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
        let name = self.parse()?;

        self.input.skip_ws()?;

        let span_block = self.input.cur_span()?;
        let mut block = SimpleBlock {
            span: Default::default(),
            name: '{',
            value: vec![],
        };

        expect!(self, "{");

        self.input.skip_ws()?;

        loop {
            if is!(self, "}") {
                break;
            }

            self.input.skip_ws()?;

            let keyframe_block: KeyframeBlock = self.parse()?;

            block
                .value
                .push(ComponentValue::KeyframeBlock(keyframe_block));

            self.input.skip_ws()?;
        }

        expect!(self, "}");

        block.span = span!(self, span_block.lo);

        Ok(KeyframesRule {
            span: span!(self, span.lo),
            name,
            block,
        })
    }
}

impl<I> Parse<KeyframesName> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<KeyframesName> {
        match cur!(self) {
            tok!("ident") => {
                let custom_ident: CustomIdent = self.parse()?;

                if &*custom_ident.value.to_ascii_lowercase() == "none" {
                    let span = self.input.cur_span()?;

                    return Err(Error::new(
                        span,
                        ErrorKind::InvalidCustomIdent(stringify!(value)),
                    ));
                }

                Ok(KeyframesName::CustomIdent(custom_ident))
            }
            tok!("string") => Ok(KeyframesName::Str(self.parse()?)),
            _ => {
                let span = self.input.cur_span()?;

                Err(Error::new(span, ErrorKind::Expected("ident or string")))
            }
        }
    }
}

impl<I> Parse<KeyframeBlock> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<KeyframeBlock> {
        let span = self.input.cur_span()?;

        let child = self.parse()?;
        let mut prelude = vec![child];

        loop {
            self.input.skip_ws()?;

            if !eat!(self, ",") {
                break;
            }

            self.input.skip_ws()?;

            let child = self.parse()?;

            prelude.push(child);
        }

        let ctx = Ctx {
            block_contents_grammar: BlockContentsGrammar::DeclarationList,
            ..self.ctx
        };
        let block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;

        Ok(KeyframeBlock {
            span: span!(self, span.lo),
            prelude,
            block,
        })
    }
}

impl<I> Parse<KeyframeSelector> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<KeyframeSelector> {
        match cur!(self) {
            tok!("ident") => {
                let ident: Ident = self.parse()?;
                let lowercased_ident_value = ident.value.to_ascii_lowercase();

                if &*lowercased_ident_value != "from" && &*lowercased_ident_value != "to" {
                    let span = self.input.cur_span()?;

                    return Err(Error::new(
                        span,
                        ErrorKind::Expected("'from' or 'to' idents"),
                    ));
                }

                Ok(KeyframeSelector::Ident(ident))
            }
            tok!("percentage") => Ok(KeyframeSelector::Percentage(self.parse()?)),
            _ => {
                let span = self.input.cur_span()?;

                return Err(Error::new(
                    span,
                    ErrorKind::Expected("ident or percentage token"),
                ));
            }
        }
    }
}

impl<I> Parse<ViewportRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ViewportRule> {
        let span = self.input.cur_span()?;
        let ctx = Ctx {
            block_contents_grammar: BlockContentsGrammar::DeclarationList,
            ..self.ctx
        };
        let block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;

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
            prefix = match cur!(self) {
                tok!("ident") => Some(self.parse()?),
                _ => {
                    unreachable!()
                }
            };

            self.input.skip_ws()?;
        }

        let uri = match cur!(self) {
            tok!("string") => NamespaceUri::Str(self.parse()?),
            tok!("url") => NamespaceUri::Url(self.parse()?),
            tok!("function") => NamespaceUri::Url(self.parse()?),
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("string, url or function"),
                ))
            }
        };

        eat!(self, ";");

        Ok(NamespaceRule {
            span: span!(self, span.lo),
            prefix,
            uri,
        })
    }
}

impl<I> Parse<NestRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<NestRule> {
        let span = self.input.cur_span()?;
        let prelude = self.parse()?;
        let ctx = Ctx {
            block_contents_grammar: BlockContentsGrammar::StyleBlock,
            ..self.ctx
        };

        self.input.skip_ws()?;

        let block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;

        Ok(NestRule {
            span: span!(self, span.lo),
            prelude,
            block,
        })
    }
}

impl<I> Parse<FontFaceRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<FontFaceRule> {
        let span = self.input.cur_span()?;
        let ctx = Ctx {
            block_contents_grammar: BlockContentsGrammar::DeclarationList,
            ..self.ctx
        };
        let block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;

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
        let condition = self.parse()?;

        self.input.skip_ws()?;

        if !is!(self, "{") {
            return Err(Error::new(span, ErrorKind::Expected("'{' delim token")));
        }

        let ctx = match self.ctx.block_contents_grammar {
            BlockContentsGrammar::StyleBlock => Ctx {
                block_contents_grammar: BlockContentsGrammar::StyleBlock,
                ..self.ctx
            },
            _ => Ctx {
                block_contents_grammar: BlockContentsGrammar::Stylesheet,
                ..self.ctx
            },
        };
        let block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;

        Ok(SupportsRule {
            span: span!(self, span.lo),
            condition,
            block,
        })
    }
}

impl<I> Parse<SupportsCondition> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<SupportsCondition> {
        self.input.skip_ws()?;

        let start_pos = self.input.cur_span()?.lo;
        let mut last_pos;
        let mut conditions = vec![];

        if is_case_insensitive_ident!(self, "not") {
            let not = self.parse()?;

            last_pos = self.input.last_pos()?;

            conditions.push(SupportsConditionType::Not(not));
        } else {
            let supports_in_parens = self.parse()?;

            last_pos = self.input.last_pos()?;

            conditions.push(SupportsConditionType::SupportsInParens(supports_in_parens));

            self.input.skip_ws()?;

            if is_case_insensitive_ident!(self, "and") {
                while is_case_insensitive_ident!(self, "and") {
                    let and = self.parse()?;

                    last_pos = self.input.last_pos()?;

                    conditions.push(SupportsConditionType::And(and));

                    self.input.skip_ws()?;
                }
            } else if is_case_insensitive_ident!(self, "or") {
                while is_case_insensitive_ident!(self, "or") {
                    let or = self.parse()?;

                    last_pos = self.input.last_pos()?;

                    conditions.push(SupportsConditionType::Or(or));

                    self.input.skip_ws()?;
                }
            }
        };

        Ok(SupportsCondition {
            span: Span::new(start_pos, last_pos, Default::default()),
            conditions,
        })
    }
}

impl<I> Parse<SupportsNot> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<SupportsNot> {
        let span = self.input.cur_span()?;

        expect_case_insensitive_ident!(self, "not");

        self.input.skip_ws()?;

        let supports_in_parens = self.parse()?;

        Ok(SupportsNot {
            span: span!(self, span.lo),
            condition: supports_in_parens,
        })
    }
}

impl<I> Parse<SupportsAnd> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<SupportsAnd> {
        let span = self.input.cur_span()?;

        expect_case_insensitive_ident!(self, "and");

        self.input.skip_ws()?;

        let supports_in_parens = self.parse()?;

        Ok(SupportsAnd {
            span: span!(self, span.lo),
            condition: supports_in_parens,
        })
    }
}

impl<I> Parse<SupportsOr> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<SupportsOr> {
        let span = self.input.cur_span()?;

        expect_case_insensitive_ident!(self, "or");

        self.input.skip_ws()?;

        let supports_in_parens = self.parse()?;

        Ok(SupportsOr {
            span: span!(self, span.lo),
            condition: supports_in_parens,
        })
    }
}

impl<I> Parse<SupportsInParens> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<SupportsInParens> {
        let state = self.input.state();

        match self.parse() {
            Ok(feature) => Ok(SupportsInParens::Feature(feature)),
            Err(_) => {
                self.input.reset(&state);

                let mut parse_condition = || {
                    expect!(self, "(");

                    let condition = self.parse()?;

                    expect!(self, ")");

                    Ok(SupportsInParens::SupportsCondition(condition))
                };

                match parse_condition() {
                    Ok(condition) => Ok(condition),
                    Err(_) => {
                        self.input.reset(&state);

                        match self.parse() {
                            Ok(general_enclosed) => {
                                Ok(SupportsInParens::GeneralEnclosed(general_enclosed))
                            }
                            Err(err) => Err(err),
                        }
                    }
                }
            }
        }
    }
}

impl<I> Parse<SupportsFeature> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<SupportsFeature> {
        match cur!(self) {
            tok!("(") => {
                bump!(self);

                self.input.skip_ws()?;

                let declaration = self.parse()?;

                self.input.skip_ws()?;

                expect!(self, ")");

                Ok(SupportsFeature::Declaration(declaration))
            }
            Token::Function { value, .. } if &*value.to_lowercase() == "selector" => {
                let ctx = Ctx {
                    in_supports_at_rule: true,
                    ..self.ctx
                };
                let function = self.with_ctx(ctx).parse_as::<Function>()?;

                Ok(SupportsFeature::Function(function))
            }
            _ => {
                let span = self.input.cur_span()?;

                Err(Error::new(
                    span,
                    ErrorKind::Expected("'(' or 'function' token"),
                ))
            }
        }
    }
}

impl<I> Parse<GeneralEnclosed> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<GeneralEnclosed> {
        match cur!(self) {
            tok!("function") => Ok(GeneralEnclosed::Function(self.parse()?)),
            tok!("(") => {
                let ctx = Ctx {
                    block_contents_grammar: BlockContentsGrammar::NoGrammar,
                    ..self.ctx
                };
                let block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;

                // TODO validate on first ident
                Ok(GeneralEnclosed::SimpleBlock(block))
            }
            _ => {
                let span = self.input.cur_span()?;

                Err(Error::new(
                    span,
                    ErrorKind::Expected("function or '(' token"),
                ))
            }
        }
    }
}

impl<I> Parse<DocumentRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<DocumentRule> {
        let span = self.input.cur_span()?;
        let url_match_fn = self.parse()?;
        let mut matching_functions = vec![url_match_fn];

        loop {
            self.input.skip_ws()?;

            if !eat!(self, ",") {
                break;
            }

            self.input.skip_ws()?;

            matching_functions.push(self.parse()?);
        }
        let ctx = match self.ctx.block_contents_grammar {
            BlockContentsGrammar::StyleBlock => Ctx {
                block_contents_grammar: BlockContentsGrammar::StyleBlock,
                ..self.ctx
            },
            _ => Ctx {
                block_contents_grammar: BlockContentsGrammar::Stylesheet,
                ..self.ctx
            },
        };
        let block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;

        Ok(DocumentRule {
            span: span!(self, span.lo),
            matching_functions,
            block,
        })
    }
}

impl<I> Parse<DocumentRuleMatchingFunction> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<DocumentRuleMatchingFunction> {
        match cur!(self) {
            tok!("url") => Ok(DocumentRuleMatchingFunction::Url(self.parse()?)),
            Token::Function {
                value: function_name,
                ..
            } => {
                if &*function_name.to_ascii_lowercase() == "url"
                    || &*function_name.to_ascii_lowercase() == "src"
                {
                    Ok(DocumentRuleMatchingFunction::Url(self.parse()?))
                } else {
                    Ok(DocumentRuleMatchingFunction::Function(self.parse()?))
                }
            }
            _ => {
                let span = self.input.cur_span()?;

                Err(Error::new(span, ErrorKind::Expected("url or function")))
            }
        }
    }
}

impl<I> Parse<MediaRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<MediaRule> {
        let span = self.input.cur_span()?;

        let media = if !is!(self, "{") {
            let media_query_list = self.parse()?;

            Some(media_query_list)
        } else {
            None
        };

        self.input.skip_ws()?;

        if !is!(self, "{") {
            return Err(Error::new(span, ErrorKind::Expected("'{' delim token")));
        }

        let ctx = match self.ctx.block_contents_grammar {
            BlockContentsGrammar::StyleBlock => Ctx {
                block_contents_grammar: BlockContentsGrammar::StyleBlock,
                ..self.ctx
            },
            _ => Ctx {
                block_contents_grammar: BlockContentsGrammar::Stylesheet,
                ..self.ctx
            },
        };
        let block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;

        Ok(MediaRule {
            span: span!(self, span.lo),
            media,
            block,
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

        // TODO error recovery
        // To parse a <media-query-list> production, parse a comma-separated list of
        // component values, then parse each entry in the returned list as a
        // <media-query>. Its value is the list of <media-query>s so produced.
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
        let start_pos = self.input.cur_span()?.lo;
        let state = self.input.state();

        let mut modifier = if is_one_of_case_insensitive_ident!(self, "not", "only") {
            let modifier = Some(self.parse()?);

            self.input.skip_ws()?;

            modifier
        } else {
            None
        };

        let mut last_pos = self.input.last_pos()?;

        let media_type = if !is!(self, Ident)
            || is_one_of_case_insensitive_ident!(self, "not", "and", "or", "only")
        {
            None
        } else {
            let media_type = Some(self.parse()?);

            last_pos = self.input.last_pos()?;

            self.input.skip_ws()?;

            media_type
        };

        let condition = if media_type.is_some() {
            if is_one_of_case_insensitive_ident!(self, "and") {
                bump!(self);

                self.input.skip_ws()?;

                let condition_without_or: MediaConditionWithoutOr = self.parse()?;

                last_pos = condition_without_or.span.hi;

                Some(MediaConditionType::WithoutOr(condition_without_or))
            } else {
                None
            }
        } else {
            modifier = None;

            self.input.reset(&state);

            let condition: MediaCondition = self.parse()?;

            last_pos = condition.span.hi;

            Some(MediaConditionType::All(condition))
        };

        Ok(MediaQuery {
            span: Span::new(start_pos, last_pos, Default::default()),
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

        let start_pos = self.input.cur_span()?.lo;
        let mut last_pos;
        let mut conditions = vec![];

        if is_case_insensitive_ident!(self, "not") {
            let not = self.parse()?;

            last_pos = self.input.last_pos()?;

            conditions.push(MediaConditionAllType::Not(not));
        } else {
            let media_in_parens = self.parse()?;

            last_pos = self.input.last_pos()?;

            conditions.push(MediaConditionAllType::MediaInParens(media_in_parens));

            self.input.skip_ws()?;

            if is_case_insensitive_ident!(self, "and") {
                while is_case_insensitive_ident!(self, "and") {
                    let and = self.parse()?;

                    last_pos = self.input.last_pos()?;

                    conditions.push(MediaConditionAllType::And(and));

                    self.input.skip_ws()?;
                }
            } else if is_case_insensitive_ident!(self, "or") {
                while is_case_insensitive_ident!(self, "or") {
                    let or = self.parse()?;

                    last_pos = self.input.last_pos()?;

                    conditions.push(MediaConditionAllType::Or(or));

                    self.input.skip_ws()?;
                }
            }
        };

        Ok(MediaCondition {
            span: Span::new(start_pos, last_pos, Default::default()),
            conditions,
        })
    }
}

impl<I> Parse<MediaConditionWithoutOr> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<MediaConditionWithoutOr> {
        self.input.skip_ws()?;

        let start_pos = self.input.cur_span()?.lo;
        let mut last_pos;
        let mut conditions = vec![];

        if is_case_insensitive_ident!(self, "not") {
            let not = self.parse()?;

            last_pos = self.input.last_pos()?;

            conditions.push(MediaConditionWithoutOrType::Not(not));
        } else {
            let media_in_parens = self.parse()?;

            last_pos = self.input.last_pos()?;

            conditions.push(MediaConditionWithoutOrType::MediaInParens(media_in_parens));

            self.input.skip_ws()?;

            if is_case_insensitive_ident!(self, "and") {
                while is_case_insensitive_ident!(self, "and") {
                    let and = self.parse()?;

                    last_pos = self.input.last_pos()?;

                    conditions.push(MediaConditionWithoutOrType::And(and));

                    self.input.skip_ws()?;
                }
            }
        };

        Ok(MediaConditionWithoutOr {
            span: Span::new(start_pos, last_pos, Default::default()),
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

        expect_case_insensitive_ident!(self, "not");

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

        expect_case_insensitive_ident!(self, "and");

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

        expect_case_insensitive_ident!(self, "or");

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
        let state = self.input.state();

        expect!(self, "(");

        self.input.skip_ws()?;

        if !is!(self, "(") && !is_case_insensitive_ident!(self, "not") {
            self.input.reset(&state);

            return Ok(MediaInParens::Feature(self.parse()?));
        }

        let condition = MediaInParens::MediaCondition(self.parse()?);

        expect!(self, ")");

        Ok(condition)
    }
}

impl<I> Parse<MediaFeature> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<MediaFeature> {
        let span = self.input.cur_span()?;

        expect!(self, "(");

        self.input.skip_ws()?;

        let left = self.parse()?;

        self.input.skip_ws()?;

        match cur!(self) {
            tok!(")") => {
                bump!(self);

                let name = match left {
                    MediaFeatureValue::Ident(ident) => MediaFeatureName::Ident(ident),
                    _ => {
                        return Err(Error::new(span, ErrorKind::Expected("identifier value")));
                    }
                };

                Ok(MediaFeature::Boolean(MediaFeatureBoolean {
                    span: span!(self, span.lo),
                    name,
                }))
            }
            tok!(":") => {
                bump!(self);

                self.input.skip_ws()?;

                let name = match left {
                    MediaFeatureValue::Ident(ident) => MediaFeatureName::Ident(ident),
                    _ => {
                        return Err(Error::new(span, ErrorKind::Expected("identifier value")));
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
                        if eat!(self, "=") {
                            MediaFeatureRangeComparison::Le
                        } else {
                            MediaFeatureRangeComparison::Lt
                        }
                    }
                    tok!(">") => {
                        if eat!(self, "=") {
                            MediaFeatureRangeComparison::Ge
                        } else {
                            MediaFeatureRangeComparison::Gt
                        }
                    }
                    tok!("=") => MediaFeatureRangeComparison::Eq,
                    _ => {
                        unreachable!();
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
                        if eat!(self, "=") {
                            MediaFeatureRangeComparison::Le
                        } else {
                            MediaFeatureRangeComparison::Lt
                        }
                    }
                    tok!(">") => {
                        if eat!(self, "=") {
                            MediaFeatureRangeComparison::Ge
                        } else {
                            MediaFeatureRangeComparison::Gt
                        }
                    }
                    _ => {
                        return Err(Error::new(
                            span,
                            ErrorKind::Expected("'>' or '<' operators"),
                        ));
                    }
                };

                self.input.skip_ws()?;

                let right = self.parse()?;

                self.input.skip_ws()?;

                expect!(self, ")");

                let name = match center {
                    MediaFeatureValue::Ident(ident) => MediaFeatureName::Ident(ident),
                    _ => {
                        return Err(Error::new(span, ErrorKind::Expected("identifier value")));
                    }
                };

                let is_valid_operator = match left_comparison {
                    MediaFeatureRangeComparison::Lt | MediaFeatureRangeComparison::Le
                        if right_comparison == MediaFeatureRangeComparison::Lt
                            || right_comparison == MediaFeatureRangeComparison::Le =>
                    {
                        true
                    }
                    MediaFeatureRangeComparison::Gt | MediaFeatureRangeComparison::Ge
                        if right_comparison == MediaFeatureRangeComparison::Gt
                            || right_comparison == MediaFeatureRangeComparison::Ge =>
                    {
                        true
                    }
                    _ => false,
                };

                if !is_valid_operator {
                    return Err(Error::new(
                        span,
                        ErrorKind::Expected(
                            "left comparison operator should be equal right comparison operator",
                        ),
                    ));
                }

                Ok(MediaFeature::RangeInterval(MediaFeatureRangeInterval {
                    span: span!(self, span.lo),
                    left,
                    left_comparison,
                    name,
                    right_comparison,
                    right,
                }))
            }
            _ => Err(Error::new(span, ErrorKind::Expected("identifier value"))),
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
            tok!("number") => {
                let left = self.parse()?;

                self.input.skip_ws()?;

                if eat!(self, "/") {
                    self.input.skip_ws()?;

                    let right = Some(self.parse()?);

                    return Ok(MediaFeatureValue::Ratio(Ratio {
                        span: span!(self, span.lo),
                        left,
                        right,
                    }));
                }

                Ok(MediaFeatureValue::Number(left))
            }
            tok!("ident") => Ok(MediaFeatureValue::Ident(self.parse()?)),
            tok!("dimension") => Ok(MediaFeatureValue::Dimension(self.parse()?)),
            _ => Err(Error::new(
                span,
                ErrorKind::Expected("number, ident or dimension token"),
            )),
        }
    }
}

impl<I> Parse<PageRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<PageRule> {
        let start = self.input.cur_span()?.lo;

        let prelude = if !is!(self, "{") {
            Some(self.parse()?)
        } else {
            None
        };

        self.input.skip_ws()?;

        let ctx = Ctx {
            in_page_at_rule: true,
            block_contents_grammar: BlockContentsGrammar::DeclarationList,
            ..self.ctx
        };
        let block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;

        Ok(PageRule {
            span: span!(self, start),
            prelude,
            block,
        })
    }
}

impl<I> Parse<PageSelectorList> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<PageSelectorList> {
        let selector = self.parse()?;
        let mut selectors = vec![selector];

        loop {
            self.input.skip_ws()?;

            if !eat!(self, ",") {
                break;
            }

            self.input.skip_ws()?;

            let selector = self.parse()?;

            selectors.push(selector);
        }

        let start_pos = match selectors.first() {
            Some(PageSelector { span, .. }) => span.lo,
            _ => {
                unreachable!();
            }
        };
        let last_pos = match selectors.last() {
            Some(PageSelector { span, .. }) => span.hi,
            _ => {
                unreachable!();
            }
        };

        Ok(PageSelectorList {
            span: Span::new(start_pos, last_pos, Default::default()),
            selectors,
        })
    }
}

impl<I> Parse<PageSelector> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<PageSelector> {
        self.input.skip_ws()?;

        let span = self.input.cur_span()?;

        let page_type = if is!(self, Ident) {
            Some(self.parse()?)
        } else {
            None
        };

        let pseudos = if is!(self, ":") {
            let mut pseudos = vec![];

            loop {
                if !is!(self, ":") {
                    break;
                }

                let pseudo = self.parse()?;

                pseudos.push(pseudo);
            }

            Some(pseudos)
        } else {
            None
        };

        Ok(PageSelector {
            span: span!(self, span.lo),
            page_type,
            pseudos,
        })
    }
}

impl<I> Parse<PageSelectorType> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<PageSelectorType> {
        let span = self.input.cur_span()?;
        let value = self.parse()?;

        Ok(PageSelectorType {
            span: span!(self, span.lo),
            value,
        })
    }
}

impl<I> Parse<PageSelectorPseudo> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<PageSelectorPseudo> {
        let span = self.input.cur_span()?;

        expect!(self, ":");

        let value = match cur!(self) {
            Token::Ident { value, .. }
                if matches!(
                    &*value.to_ascii_lowercase(),
                    "left" | "right" | "first" | "blank"
                ) =>
            {
                self.parse()?
            }
            _ => {
                let span = self.input.cur_span()?;

                return Err(Error::new(
                    span,
                    ErrorKind::Expected("'left', 'right', 'first' or 'blank' ident"),
                ));
            }
        };

        Ok(PageSelectorPseudo {
            span: span!(self, span.lo),
            value,
        })
    }
}

impl<I> Parse<PageMarginRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<PageMarginRule> {
        let span = self.input.cur_span()?;
        let ctx = Ctx {
            block_contents_grammar: BlockContentsGrammar::DeclarationList,
            ..self.ctx
        };
        let block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;

        Ok(PageMarginRule {
            name: Ident {
                span: Default::default(),
                value: Default::default(),
                raw: Default::default(),
            },
            span: span!(self, span.lo),
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

        let block = match prelude {
            // Block
            None | Some(LayerPrelude::Name(LayerName { .. })) if is!(self, "{") => {
                let ctx = Ctx {
                    block_contents_grammar: BlockContentsGrammar::Stylesheet,
                    ..self.ctx
                };
                println!("{:?}", self.input.cur());
                let block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;

                Some(block)
            }
            // Statement
            Some(LayerPrelude::NameList(LayerNameList { .. })) => {
                expect!(self, ";");

                None
            }
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("'{' delim token or ';'"),
                ));
            }
        };

        Ok(LayerRule {
            span: span!(self, span.lo),
            prelude,
            block,
        })
    }
}

impl<I> Parse<ColorProfileRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ColorProfileRule> {
        let span = self.input.cur_span()?;

        let name = match cur!(self) {
            Token::Ident { value, .. } => {
                if value.starts_with("--") {
                    ColorProfileName::DashedIdent(self.parse()?)
                } else {
                    ColorProfileName::Ident(self.parse()?)
                }
            }
            _ => {
                return Err(Error::new(span, ErrorKind::Expected("ident")));
            }
        };

        self.input.skip_ws()?;

        let ctx = Ctx {
            block_contents_grammar: BlockContentsGrammar::DeclarationList,
            ..self.ctx
        };
        let block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;

        Ok(ColorProfileRule {
            span: span!(self, span.lo),
            name,
            block,
        })
    }
}

impl<I> Parse<CounterStyleRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<CounterStyleRule> {
        let span = self.input.cur_span()?;
        let name = self.parse()?;

        self.input.skip_ws()?;

        let ctx = Ctx {
            block_contents_grammar: BlockContentsGrammar::DeclarationList,
            ..self.ctx
        };
        let block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;

        Ok(CounterStyleRule {
            span: span!(self, span.lo),
            name,
            block,
        })
    }
}

impl<I> Parse<PropertyRule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<PropertyRule> {
        let span = self.input.cur_span()?;
        let name = self.parse()?;

        self.input.skip_ws()?;

        let ctx = Ctx {
            block_contents_grammar: BlockContentsGrammar::DeclarationList,
            ..self.ctx
        };
        let block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;

        Ok(PropertyRule {
            span: span!(self, span.lo),
            name,
            block,
        })
    }
}
