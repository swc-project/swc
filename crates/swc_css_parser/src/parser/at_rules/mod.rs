use swc_atoms::{js_word, JsWord};
use swc_common::Span;
use swc_css_ast::*;

use super::{input::ParserInput, PResult, Parser};
use crate::{
    error::{Error, ErrorKind},
    parser::{values_and_units::is_math_function, BlockContentsGrammar, Ctx},
    Parse,
};

impl<I> Parser<I>
where
    I: ParserInput,
{
    pub(super) fn parse_at_rule_prelude(
        &mut self,
        name: &JsWord,
    ) -> PResult<Option<AtRulePrelude>> {
        let prelude = match *name {
            js_word!("charset") => {
                self.input.skip_ws();

                let prelude = AtRulePrelude::CharsetPrelude(self.parse()?);

                self.input.skip_ws();

                Some(prelude)
            }
            js_word!("color-profile") => {
                self.input.skip_ws();

                let name = match cur!(self) {
                    Token::Ident { value, .. } => {
                        if value.starts_with("--") {
                            ColorProfileName::DashedIdent(self.parse()?)
                        } else {
                            ColorProfileName::Ident(self.parse()?)
                        }
                    }
                    _ => {
                        let span = self.input.cur_span();

                        return Err(Error::new(span, ErrorKind::Expected("ident token")));
                    }
                };

                let prelude = AtRulePrelude::ColorProfilePrelude(name);

                self.input.skip_ws();

                Some(prelude)
            }
            js_word!("container") => {
                self.input.skip_ws();

                let prelude = AtRulePrelude::ContainerPrelude(self.parse()?);

                self.input.skip_ws();

                Some(prelude)
            }
            js_word!("counter-style") => {
                self.input.skip_ws();

                let prelude = AtRulePrelude::CounterStylePrelude(self.parse()?);

                self.input.skip_ws();

                Some(prelude)
            }
            js_word!("custom-media") => {
                self.input.skip_ws();

                let prelude = AtRulePrelude::CustomMediaPrelude(self.parse()?);

                self.input.skip_ws();

                Some(prelude)
            }
            js_word!("document") | js_word!("-moz-document") => {
                self.input.skip_ws();

                let span = self.input.cur_span();
                let url_match_fn = self.parse()?;
                let mut matching_functions = vec![url_match_fn];

                loop {
                    self.input.skip_ws();

                    if !eat!(self, ",") {
                        break;
                    }

                    self.input.skip_ws();

                    matching_functions.push(self.parse()?);
                }

                let prelude = AtRulePrelude::DocumentPrelude(DocumentPrelude {
                    span: span!(self, span.lo),
                    matching_functions,
                });

                self.input.skip_ws();

                Some(prelude)
            }
            js_word!("font-face") => {
                self.input.skip_ws();

                if !is!(self, EOF) {
                    let span = self.input.cur_span();

                    return Err(Error::new(span, ErrorKind::Expected("'{' token")));
                }

                None
            }
            js_word!("font-feature-values") => {
                self.input.skip_ws();

                let prelude = AtRulePrelude::FontFeatureValuesPrelude(self.parse()?);

                self.input.skip_ws();

                Some(prelude)
            }
            js_word!("font-palette-values") => {
                self.input.skip_ws();

                let prelude = AtRulePrelude::FontPaletteValuesPrelude(self.parse()?);

                self.input.skip_ws();

                Some(prelude)
            }
            js_word!("stylistic")
            | js_word!("historical-forms")
            | js_word!("styleset")
            | js_word!("character-variant")
            | js_word!("swash")
            | js_word!("ornaments")
            | js_word!("annotation")
                if self.ctx.in_font_feature_values_at_rule =>
            {
                self.input.skip_ws();

                if !is!(self, EOF) {
                    let span = self.input.cur_span();

                    return Err(Error::new(span, ErrorKind::Expected("'{' token")));
                }

                None
            }
            js_word!("import") => {
                self.input.skip_ws();

                let span = self.input.cur_span();
                let href = Box::new(match cur!(self) {
                    tok!("string") => ImportPreludeHref::Str(self.parse()?),
                    tok!("url") => ImportPreludeHref::Url(self.parse()?),
                    tok!("function") => ImportPreludeHref::Url(self.parse()?),
                    _ => {
                        return Err(Error::new(
                            span,
                            ErrorKind::Expected("string, url or function token"),
                        ))
                    }
                });

                self.input.skip_ws();

                let layer_name = if !is!(self, EOF) {
                    match cur!(self) {
                        Token::Ident { value, .. } if *value.to_ascii_lowercase() == *"layer" => {
                            let name = ImportPreludeLayerName::Ident(self.parse()?);

                            self.input.skip_ws();

                            Some(Box::new(name))
                        }
                        Token::Function { value, .. }
                            if *value.to_ascii_lowercase() == *"layer" =>
                        {
                            let ctx = Ctx {
                                in_import_at_rule: true,
                                block_contents_grammar: BlockContentsGrammar::DeclarationValue,
                                ..self.ctx
                            };
                            let func = self.with_ctx(ctx).parse_as::<Function>()?;

                            self.input.skip_ws();

                            Some(Box::new(ImportPreludeLayerName::Function(func)))
                        }
                        _ => None,
                    }
                } else {
                    None
                };

                let supports = if !is!(self, EOF) {
                    match cur!(self) {
                        Token::Function { value, .. }
                            if *value.to_ascii_lowercase() == *"supports" =>
                        {
                            bump!(self);

                            self.input.skip_ws();

                            let supports =
                                if is_case_insensitive_ident!(self, "not") || is!(self, "(") {
                                    ImportPreludeSupportsType::SupportsCondition(self.parse()?)
                                } else {
                                    ImportPreludeSupportsType::Declaration(self.parse()?)
                                };

                            expect!(self, ")");

                            self.input.skip_ws();

                            Some(Box::new(supports))
                        }
                        _ => None,
                    }
                } else {
                    None
                };

                let media = if !is!(self, EOF) {
                    let media_query_list = self.parse()?;

                    self.input.skip_ws();

                    Some(media_query_list)
                } else {
                    None
                };

                let prelude = AtRulePrelude::ImportPrelude(ImportPrelude {
                    span: span!(self, span.lo),
                    href,
                    layer_name,
                    supports,
                    media,
                });

                Some(prelude)
            }
            js_word!("keyframes")
            | js_word!("-webkit-keyframes")
            | js_word!("-moz-keyframes")
            | js_word!("-o-keyframes")
            | js_word!("-ms-keyframes") => {
                self.input.skip_ws();

                let prelude = AtRulePrelude::KeyframesPrelude(self.parse()?);

                self.input.skip_ws();

                Some(prelude)
            }
            js_word!("layer") => {
                self.input.skip_ws();

                if is!(self, Ident) {
                    let mut name_list: Vec<LayerName> = vec![];

                    name_list.push(self.parse()?);

                    loop {
                        self.input.skip_ws();

                        if !eat!(self, ",") {
                            break;
                        }

                        self.input.skip_ws();

                        name_list.push(self.parse()?);
                    }

                    let res = if name_list.len() == 1 {
                        Some(AtRulePrelude::LayerPrelude(LayerPrelude::Name(
                            name_list.remove(0),
                        )))
                    } else {
                        let first = name_list[0].span;
                        let last = name_list[name_list.len() - 1].span;

                        Some(AtRulePrelude::LayerPrelude(LayerPrelude::NameList(
                            LayerNameList {
                                name_list,
                                span: Span::new(first.lo, last.hi, Default::default()),
                            },
                        )))
                    };

                    self.input.skip_ws();

                    res
                } else {
                    None
                }
            }
            js_word!("media") => {
                self.input.skip_ws();

                let media = if !is!(self, EOF) {
                    let media_query_list = self.parse()?;

                    Some(AtRulePrelude::MediaPrelude(media_query_list))
                } else {
                    None
                };

                self.input.skip_ws();

                media
            }
            js_word!("namespace") => {
                self.input.skip_ws();

                let span = self.input.cur_span();
                let mut prefix = None;

                if is!(self, Ident) {
                    prefix = match cur!(self) {
                        tok!("ident") => Some(self.parse()?),
                        _ => {
                            unreachable!()
                        }
                    };

                    self.input.skip_ws();
                }

                let uri = match cur!(self) {
                    tok!("string") => NamespacePreludeUri::Str(self.parse()?),
                    tok!("url") => NamespacePreludeUri::Url(self.parse()?),
                    tok!("function") => NamespacePreludeUri::Url(self.parse()?),
                    _ => {
                        let span = self.input.cur_span();

                        return Err(Error::new(
                            span,
                            ErrorKind::Expected("string, url or function tokens"),
                        ));
                    }
                };

                let prelude = AtRulePrelude::NamespacePrelude(NamespacePrelude {
                    span: span!(self, span.lo),
                    prefix,
                    uri: Box::new(uri),
                });

                self.input.skip_ws();

                Some(prelude)
            }
            js_word!("nest") => {
                self.input.skip_ws();

                let prelude = AtRulePrelude::NestPrelude(self.parse()?);

                self.input.skip_ws();

                Some(prelude)
            }
            js_word!("page") => {
                self.input.skip_ws();

                let prelude = if !is!(self, EOF) {
                    Some(AtRulePrelude::PagePrelude(self.parse()?))
                } else {
                    None
                };

                self.input.skip_ws();

                prelude
            }
            js_word!("top-left-corner")
            | js_word!("top-left")
            | js_word!("top-center")
            | js_word!("top-right")
            | js_word!("top-right-corner")
            | js_word!("bottom-left-corner")
            | js_word!("bottom-left")
            | js_word!("bottom-center")
            | js_word!("bottom-right")
            | js_word!("bottom-right-corner")
            | js_word!("left-top")
            | js_word!("left-middle")
            | js_word!("left-bottom")
            | js_word!("right-top")
            | js_word!("right-middle")
            | js_word!("right-bottom")
                if self.ctx.in_page_at_rule =>
            {
                self.input.skip_ws();

                if !is!(self, EOF) {
                    let span = self.input.cur_span();

                    return Err(Error::new(span, ErrorKind::Expected("'{' token")));
                }

                None
            }
            js_word!("property") => {
                self.input.skip_ws();

                let prelude = AtRulePrelude::PropertyPrelude(self.parse()?);

                self.input.skip_ws();

                Some(prelude)
            }
            js_word!("supports") => {
                self.input.skip_ws();

                let prelude = AtRulePrelude::SupportsPrelude(self.parse()?);

                self.input.skip_ws();

                Some(prelude)
            }
            js_word!("viewport") | js_word!("-ms-viewport") | js_word!("-o-viewport") => {
                self.input.skip_ws();

                if !is!(self, EOF) {
                    let span = self.input.cur_span();

                    return Err(Error::new(span, ErrorKind::Expected("'{' token")));
                }

                None
            }
            _ => {
                return Err(Error::new(Default::default(), ErrorKind::Ignore));
            }
        };

        if !is!(self, EOF) {
            let span = self.input.cur_span();

            return Err(Error::new(
                span,
                ErrorKind::Unexpected("tokens in at-rule prelude"),
            ));
        }

        Ok(prelude)
    }

    pub(super) fn parse_at_rule_block(&mut self, name: &JsWord) -> PResult<Vec<ComponentValue>> {
        let block_contents = match *name {
            js_word!("charset") => {
                let span = self.input.cur_span();

                return Err(Error::new(span, ErrorKind::Unexpected("'{' token")));
            }
            js_word!("color-profile") => {
                let declaration_list: Vec<DeclarationOrAtRule> = self.parse()?;
                let declaration_list: Vec<ComponentValue> = declaration_list
                    .into_iter()
                    .map(ComponentValue::DeclarationOrAtRule)
                    .collect();

                declaration_list
            }
            js_word!("container") => match self.ctx.block_contents_grammar {
                BlockContentsGrammar::StyleBlock => {
                    let ctx = Ctx {
                        in_container_at_rule: true,
                        ..self.ctx
                    };
                    let style_blocks = self.with_ctx(ctx).parse_as::<Vec<StyleBlock>>()?;
                    let style_blocks: Vec<ComponentValue> = style_blocks
                        .into_iter()
                        .map(ComponentValue::StyleBlock)
                        .collect();

                    style_blocks
                }
                _ => {
                    let ctx = Ctx {
                        is_top_level: false,
                        in_container_at_rule: true,
                        ..self.ctx
                    };
                    let rule_list = self.with_ctx(ctx).parse_as::<Vec<Rule>>()?;
                    let rule_list: Vec<ComponentValue> =
                        rule_list.into_iter().map(ComponentValue::Rule).collect();

                    rule_list
                }
            },
            js_word!("counter-style") => {
                let declaration_list: Vec<DeclarationOrAtRule> = self.parse()?;
                let declaration_list: Vec<ComponentValue> = declaration_list
                    .into_iter()
                    .map(ComponentValue::DeclarationOrAtRule)
                    .collect();

                declaration_list
            }
            js_word!("custom-media") => {
                let span = self.input.cur_span();

                return Err(Error::new(span, ErrorKind::Unexpected("'{' token")));
            }
            js_word!("document") | js_word!("-moz-document") => {
                match self.ctx.block_contents_grammar {
                    BlockContentsGrammar::StyleBlock => {
                        let style_blocks: Vec<StyleBlock> = self.parse()?;
                        let style_blocks: Vec<ComponentValue> = style_blocks
                            .into_iter()
                            .map(ComponentValue::StyleBlock)
                            .collect();

                        style_blocks
                    }
                    _ => {
                        let ctx = Ctx {
                            is_top_level: false,
                            ..self.ctx
                        };
                        let rule_list = self.with_ctx(ctx).parse_as::<Vec<Rule>>()?;
                        let rule_list: Vec<ComponentValue> =
                            rule_list.into_iter().map(ComponentValue::Rule).collect();

                        rule_list
                    }
                }
            }
            js_word!("font-face") => {
                let declaration_list: Vec<DeclarationOrAtRule> = self.parse()?;
                let declaration_list: Vec<ComponentValue> = declaration_list
                    .into_iter()
                    .map(ComponentValue::DeclarationOrAtRule)
                    .collect();

                declaration_list
            }
            js_word!("font-feature-values") => {
                let ctx = Ctx {
                    in_font_feature_values_at_rule: true,
                    ..self.ctx
                };
                let declaration_list = self.with_ctx(ctx).parse_as::<Vec<DeclarationOrAtRule>>()?;
                let declaration_list: Vec<ComponentValue> = declaration_list
                    .into_iter()
                    .map(ComponentValue::DeclarationOrAtRule)
                    .collect();

                declaration_list
            }
            js_word!("stylistic")
            | js_word!("historical-forms")
            | js_word!("styleset")
            | js_word!("character-variant")
            | js_word!("swash")
            | js_word!("ornaments")
            | js_word!("annotation")
                if self.ctx.in_font_feature_values_at_rule =>
            {
                let declaration_list: Vec<DeclarationOrAtRule> = self.parse()?;
                let declaration_list: Vec<ComponentValue> = declaration_list
                    .into_iter()
                    .map(ComponentValue::DeclarationOrAtRule)
                    .collect();

                declaration_list
            }
            js_word!("font-palette-values") => {
                let declaration_list: Vec<DeclarationOrAtRule> = self.parse()?;
                let declaration_list: Vec<ComponentValue> = declaration_list
                    .into_iter()
                    .map(ComponentValue::DeclarationOrAtRule)
                    .collect();

                declaration_list
            }
            js_word!("import") => {
                let span = self.input.cur_span();

                return Err(Error::new(span, ErrorKind::Unexpected("'{' token")));
            }
            js_word!("keyframes")
            | js_word!("-webkit-keyframes")
            | js_word!("-moz-keyframes")
            | js_word!("-o-keyframes")
            | js_word!("-ms-keyframes") => {
                let ctx = Ctx {
                    block_contents_grammar: BlockContentsGrammar::DeclarationList,
                    is_top_level: false,
                    in_keyframes_at_rule: true,
                    ..self.ctx
                };
                let rule_list = self.with_ctx(ctx).parse_as::<Vec<Rule>>()?;
                let rule_list: Vec<ComponentValue> = rule_list
                    .into_iter()
                    .map(|rule| match rule {
                        Rule::AtRule(at_rule) => {
                            self.errors.push(Error::new(
                                at_rule.span,
                                ErrorKind::Unexpected("at-rules are not allowed here"),
                            ));

                            ComponentValue::Rule(Rule::AtRule(at_rule))
                        }
                        Rule::QualifiedRule(qualified_rule) => {
                            let locv = match qualified_rule.prelude {
                                QualifiedRulePrelude::ListOfComponentValues(locv) => locv,
                                _ => {
                                    unreachable!();
                                }
                            };

                            match self.parse_according_to_grammar(&locv, |parser| {
                                parser.input.skip_ws();

                                let child = parser.parse()?;
                                let mut keyframes_selectors: Vec<KeyframeSelector> = vec![child];

                                loop {
                                    parser.input.skip_ws();

                                    if !eat!(parser, ",") {
                                        break;
                                    }

                                    parser.input.skip_ws();

                                    let child = parser.parse()?;

                                    keyframes_selectors.push(child);
                                }

                                Ok(keyframes_selectors)
                            }) {
                                Ok(keyframes_selectors) => {
                                    ComponentValue::KeyframeBlock(KeyframeBlock {
                                        span: qualified_rule.span,
                                        prelude: keyframes_selectors,
                                        block: qualified_rule.block,
                                    })
                                }
                                Err(err) => {
                                    self.errors.push(err);

                                    ComponentValue::Rule(Rule::ListOfComponentValues(Box::new(
                                        locv,
                                    )))
                                }
                            }
                        }
                        Rule::ListOfComponentValues(locv) => {
                            ComponentValue::Rule(Rule::ListOfComponentValues(locv))
                        }
                    })
                    .collect();

                rule_list
            }
            js_word!("layer") => {
                let ctx = Ctx {
                    is_top_level: false,
                    ..self.ctx
                };
                let rule_list = self.with_ctx(ctx).parse_as::<Vec<Rule>>()?;
                let rule_list: Vec<ComponentValue> =
                    rule_list.into_iter().map(ComponentValue::Rule).collect();

                rule_list
            }
            js_word!("media") => match self.ctx.block_contents_grammar {
                BlockContentsGrammar::StyleBlock => {
                    let style_blocks: Vec<StyleBlock> = self.parse()?;
                    let style_blocks: Vec<ComponentValue> = style_blocks
                        .into_iter()
                        .map(ComponentValue::StyleBlock)
                        .collect();

                    style_blocks
                }
                _ => {
                    let ctx = Ctx {
                        is_top_level: false,
                        ..self.ctx
                    };
                    let rule_list = self.with_ctx(ctx).parse_as::<Vec<Rule>>()?;
                    let rule_list: Vec<ComponentValue> =
                        rule_list.into_iter().map(ComponentValue::Rule).collect();

                    rule_list
                }
            },
            js_word!("namespace") => {
                let span = self.input.cur_span();

                return Err(Error::new(span, ErrorKind::Unexpected("")));
            }
            js_word!("nest") => {
                let style_blocks: Vec<StyleBlock> = self.parse()?;
                let style_blocks: Vec<ComponentValue> = style_blocks
                    .into_iter()
                    .map(ComponentValue::StyleBlock)
                    .collect();

                style_blocks
            }
            js_word!("page") => {
                let declaration_list = self
                    .with_ctx(Ctx {
                        in_page_at_rule: true,
                        ..self.ctx
                    })
                    .parse_as::<Vec<DeclarationOrAtRule>>()?;
                let declaration_list: Vec<ComponentValue> = declaration_list
                    .into_iter()
                    .map(ComponentValue::DeclarationOrAtRule)
                    .collect();

                declaration_list
            }
            js_word!("top-left-corner")
            | js_word!("top-left")
            | js_word!("top-center")
            | js_word!("top-right")
            | js_word!("top-right-corner")
            | js_word!("bottom-left-corner")
            | js_word!("bottom-left")
            | js_word!("bottom-center")
            | js_word!("bottom-right")
            | js_word!("bottom-right-corner")
            | js_word!("left-top")
            | js_word!("left-middle")
            | js_word!("left-bottom")
            | js_word!("right-top")
            | js_word!("right-middle")
            | js_word!("right-bottom")
                if self.ctx.in_page_at_rule =>
            {
                let declaration_list: Vec<DeclarationOrAtRule> = self.parse()?;
                let declaration_list: Vec<ComponentValue> = declaration_list
                    .into_iter()
                    .map(ComponentValue::DeclarationOrAtRule)
                    .collect();

                declaration_list
            }
            js_word!("property") => {
                let declaration_list: Vec<DeclarationOrAtRule> = self.parse()?;
                let declaration_list: Vec<ComponentValue> = declaration_list
                    .into_iter()
                    .map(ComponentValue::DeclarationOrAtRule)
                    .collect();

                declaration_list
            }
            js_word!("supports") => match self.ctx.block_contents_grammar {
                BlockContentsGrammar::StyleBlock => {
                    let style_blocks: Vec<StyleBlock> = self.parse()?;
                    let style_blocks: Vec<ComponentValue> = style_blocks
                        .into_iter()
                        .map(ComponentValue::StyleBlock)
                        .collect();

                    style_blocks
                }
                _ => {
                    let ctx = Ctx {
                        is_top_level: false,
                        ..self.ctx
                    };
                    let rule_list = self.with_ctx(ctx).parse_as::<Vec<Rule>>()?;
                    let rule_list: Vec<ComponentValue> =
                        rule_list.into_iter().map(ComponentValue::Rule).collect();

                    rule_list
                }
            },
            js_word!("viewport") | js_word!("-ms-viewport") | js_word!("-o-viewport") => {
                let declaration_list: Vec<DeclarationOrAtRule> = self.parse()?;
                let declaration_list: Vec<ComponentValue> = declaration_list
                    .into_iter()
                    .map(ComponentValue::DeclarationOrAtRule)
                    .collect();

                declaration_list
            }
            _ => {
                return Err(Error::new(Default::default(), ErrorKind::Ignore));
            }
        };

        Ok(block_contents)
    }
}

impl<I> Parse<KeyframesName> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<KeyframesName> {
        match cur!(self) {
            tok!(":") if self.config.css_modules => {
                let span = self.input.cur_span();

                bump!(self);

                match cur!(self) {
                    Token::Function { value, .. }
                        if (&*value.to_ascii_lowercase() == "local"
                            || &*value.to_ascii_lowercase() == "global") =>
                    {
                        let span = self.input.cur_span();
                        let pseudo = match bump!(self) {
                            Token::Function { value, raw, .. } => Ident {
                                span: span!(self, span.lo),
                                value,
                                raw: Some(raw),
                            },
                            _ => {
                                unreachable!();
                            }
                        };

                        self.input.skip_ws();

                        let name = self.parse()?;

                        self.input.skip_ws();

                        expect!(self, ")");

                        Ok(KeyframesName::PseudoFunction(Box::new(
                            KeyframesPseudoFunction {
                                span: span!(self, span.lo),
                                pseudo,
                                name,
                            },
                        )))
                    }
                    Token::Ident { value, .. }
                        if (&*value.to_ascii_lowercase() == "local"
                            || &*value.to_ascii_lowercase() == "global") =>
                    {
                        let pseudo = self.parse()?;

                        self.input.skip_ws();

                        let name = self.parse()?;

                        Ok(KeyframesName::PseudoPrefix(Box::new(
                            KeyframesPseudoPrefix {
                                span: span!(self, span.lo),
                                pseudo,
                                name,
                            },
                        )))
                    }
                    _ => {
                        let span = self.input.cur_span();

                        Err(Error::new(
                            span,
                            ErrorKind::Expected("ident or function (local or scope) token"),
                        ))
                    }
                }
            }
            tok!("ident") => {
                let custom_ident: CustomIdent = self.parse()?;

                if &*custom_ident.value.to_ascii_lowercase() == "none" {
                    return Err(Error::new(
                        custom_ident.span,
                        ErrorKind::InvalidCustomIdent(custom_ident.value),
                    ));
                }

                Ok(KeyframesName::CustomIdent(Box::new(custom_ident)))
            }
            tok!("string") => Ok(KeyframesName::Str(Box::new(self.parse()?))),
            _ => {
                let span = self.input.cur_span();

                Err(Error::new(span, ErrorKind::Expected("ident or string")))
            }
        }
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
                let normalized_ident_value = ident.value.to_ascii_lowercase();

                if &*normalized_ident_value != "from" && &*normalized_ident_value != "to" {
                    return Err(Error::new(
                        ident.span,
                        ErrorKind::Expected("'from' or 'to' idents"),
                    ));
                }

                Ok(KeyframeSelector::Ident(ident))
            }
            tok!("percentage") => Ok(KeyframeSelector::Percentage(self.parse()?)),
            _ => {
                let span = self.input.cur_span();

                return Err(Error::new(
                    span,
                    ErrorKind::Expected("ident or percentage token"),
                ));
            }
        }
    }
}

impl<I> Parse<FontFeatureValuesPrelude> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<FontFeatureValuesPrelude> {
        let span = self.input.cur_span();

        let mut font_family = vec![self.parse()?];

        loop {
            self.input.skip_ws();

            if !eat!(self, ",") {
                break;
            }

            self.input.skip_ws();

            font_family.push(self.parse()?);
        }

        Ok(FontFeatureValuesPrelude {
            span: span!(self, span.lo),
            font_family,
        })
    }
}

impl<I> Parse<SupportsCondition> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<SupportsCondition> {
        self.input.skip_ws();

        let start_pos = self.input.cur_span().lo;
        let mut last_pos;
        let mut conditions = vec![];

        if is_case_insensitive_ident!(self, "not") {
            let not = self.parse()?;

            last_pos = self.input.last_pos();

            conditions.push(SupportsConditionType::Not(not));
        } else {
            let supports_in_parens = self.parse()?;

            last_pos = self.input.last_pos();

            conditions.push(SupportsConditionType::SupportsInParens(supports_in_parens));

            self.input.skip_ws();

            if is_case_insensitive_ident!(self, "and") {
                while is_case_insensitive_ident!(self, "and") {
                    let and = self.parse()?;

                    last_pos = self.input.last_pos();

                    conditions.push(SupportsConditionType::And(and));

                    self.input.skip_ws();
                }
            } else if is_case_insensitive_ident!(self, "or") {
                while is_case_insensitive_ident!(self, "or") {
                    let or = self.parse()?;

                    last_pos = self.input.last_pos();

                    conditions.push(SupportsConditionType::Or(or));

                    self.input.skip_ws();
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
        let span = self.input.cur_span();
        let keyword = match cur!(self) {
            Token::Ident { value, .. } if value.as_ref().eq_ignore_ascii_case("not") => {
                Some(self.parse()?)
            }
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("ident (with 'not' value) token"),
                ));
            }
        };

        self.input.skip_ws();

        let supports_in_parens = self.parse()?;

        Ok(SupportsNot {
            span: span!(self, span.lo),
            keyword,
            condition: supports_in_parens,
        })
    }
}

impl<I> Parse<SupportsAnd> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<SupportsAnd> {
        let span = self.input.cur_span();
        let keyword = match cur!(self) {
            Token::Ident { value, .. } if value.as_ref().eq_ignore_ascii_case("and") => {
                Some(self.parse()?)
            }
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("ident (with 'and' value) token"),
                ));
            }
        };

        self.input.skip_ws();

        let supports_in_parens = self.parse()?;

        Ok(SupportsAnd {
            span: span!(self, span.lo),
            keyword,
            condition: supports_in_parens,
        })
    }
}

impl<I> Parse<SupportsOr> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<SupportsOr> {
        let span = self.input.cur_span();
        let keyword = match cur!(self) {
            Token::Ident { value, .. } if value.as_ref().eq_ignore_ascii_case("or") => {
                Some(self.parse()?)
            }
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("ident (with 'or' value) token"),
                ));
            }
        };

        self.input.skip_ws();

        let supports_in_parens = self.parse()?;

        Ok(SupportsOr {
            span: span!(self, span.lo),
            keyword,
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

                self.input.skip_ws();

                let declaration = self.parse()?;

                self.input.skip_ws();

                expect!(self, ")");

                Ok(SupportsFeature::Declaration(declaration))
            }
            Token::Function { value, .. } if &*value.to_ascii_lowercase() == "selector" => {
                // TODO improve me
                let ctx = Ctx {
                    block_contents_grammar: BlockContentsGrammar::DeclarationValue,
                    in_supports_at_rule: true,
                    ..self.ctx
                };
                let function = self.with_ctx(ctx).parse_as::<Function>()?;

                Ok(SupportsFeature::Function(function))
            }
            _ => {
                let span = self.input.cur_span();

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
            tok!("function") => {
                let ctx = Ctx {
                    block_contents_grammar: BlockContentsGrammar::DeclarationList,
                    ..self.ctx
                };
                let function = self.with_ctx(ctx).parse_as::<Function>()?;

                Ok(GeneralEnclosed::Function(function))
            }
            tok!("(") => {
                let block = self.parse_as::<SimpleBlock>()?;

                if let Some(first) = block.value.get(0) {
                    match first {
                        ComponentValue::PreservedToken(token_and_span) => {
                            match token_and_span.token {
                                Token::Ident { .. } => {}
                                _ => {
                                    return Err(Error::new(
                                        block.span,
                                        ErrorKind::Expected(
                                            "ident token at first position in <general-enclosed>",
                                        ),
                                    ));
                                }
                            }
                        }
                        _ => {
                            return Err(Error::new(
                                block.span,
                                ErrorKind::Expected(
                                    "ident token at first position in <general-enclosed>",
                                ),
                            ));
                        }
                    }
                }

                Ok(GeneralEnclosed::SimpleBlock(block))
            }
            _ => {
                let span = self.input.cur_span();

                Err(Error::new(
                    span,
                    ErrorKind::Expected("function or '(' token"),
                ))
            }
        }
    }
}

impl<I> Parse<DocumentPreludeMatchingFunction> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<DocumentPreludeMatchingFunction> {
        match cur!(self) {
            tok!("url") => Ok(DocumentPreludeMatchingFunction::Url(self.parse()?)),
            Token::Function {
                value: function_name,
                ..
            } => {
                if &*function_name.to_ascii_lowercase() == "url"
                    || &*function_name.to_ascii_lowercase() == "src"
                {
                    Ok(DocumentPreludeMatchingFunction::Url(self.parse()?))
                } else {
                    // TODO improve me
                    let ctx = Ctx {
                        block_contents_grammar: BlockContentsGrammar::DeclarationValue,
                        ..self.ctx
                    };
                    let function = self.with_ctx(ctx).parse_as::<Function>()?;

                    Ok(DocumentPreludeMatchingFunction::Function(function))
                }
            }
            _ => {
                let span = self.input.cur_span();

                Err(Error::new(span, ErrorKind::Expected("url or function")))
            }
        }
    }
}

impl<I> Parse<MediaQueryList> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<MediaQueryList> {
        self.input.skip_ws();

        let query = self.parse()?;
        let mut queries = vec![query];

        // TODO error recovery
        // To parse a <media-query-list> production, parse a comma-separated list of
        // component values, then parse each entry in the returned list as a
        // <media-query>. Its value is the list of <media-query>s so produced.
        loop {
            self.input.skip_ws();

            if !eat!(self, ",") {
                break;
            }

            self.input.skip_ws();

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
        let start_pos = self.input.cur_span().lo;
        let state = self.input.state();

        let is_not = is_one_of_case_insensitive_ident!(self, "not");
        let modifier = if is_one_of_case_insensitive_ident!(self, "not", "only") {
            let modifier = Some(self.parse()?);

            self.input.skip_ws();

            modifier
        } else {
            None
        };

        if is!(self, "ident") {
            let media_type = Some(self.parse()?);

            self.input.skip_ws();

            let mut keyword = None;
            let mut condition_without_or = None;

            if is_one_of_case_insensitive_ident!(self, "and") {
                keyword = Some(self.parse()?);

                self.input.skip_ws();

                condition_without_or = Some(Box::new(MediaConditionType::WithoutOr(self.parse()?)));
            }

            let end_pos = if let Some(MediaConditionType::WithoutOr(condition_without_or)) =
                condition_without_or.as_deref()
            {
                condition_without_or.span.hi
            } else if let Some(MediaType::Ident(ident)) = &media_type {
                ident.span.hi
            } else {
                unreachable!();
            };

            return Ok(MediaQuery {
                span: Span::new(start_pos, end_pos, Default::default()),
                modifier,
                media_type,
                keyword,
                condition: condition_without_or,
            });
        }

        if is_not {
            self.input.reset(&state);
        }

        let condition: MediaCondition = self.parse()?;

        Ok(MediaQuery {
            span: Span::new(start_pos, condition.span.hi, Default::default()),
            modifier: None,
            media_type: None,
            keyword: None,
            condition: Some(Box::new(MediaConditionType::All(condition))),
        })
    }
}

impl<I> Parse<MediaType> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<MediaType> {
        match cur!(self) {
            _ if !is_one_of_case_insensitive_ident!(self, "not", "and", "or", "only", "layer") => {
                Ok(MediaType::Ident(self.parse()?))
            }
            _ => {
                let span = self.input.cur_span();

                Err(Error::new(
                    span,
                    ErrorKind::Expected(
                        "ident (exclude the keywords 'only', 'not', 'and', 'or' and 'layer')",
                    ),
                ))
            }
        }
    }
}

impl<I> Parse<MediaCondition> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<MediaCondition> {
        self.input.skip_ws();

        let start_pos = self.input.cur_span().lo;
        let mut last_pos;
        let mut conditions = vec![];

        if is_case_insensitive_ident!(self, "not") {
            let not = self.parse()?;

            last_pos = self.input.last_pos();

            conditions.push(MediaConditionAllType::Not(not));
        } else {
            let media_in_parens = self.parse()?;

            last_pos = self.input.last_pos();

            conditions.push(MediaConditionAllType::MediaInParens(media_in_parens));

            self.input.skip_ws();

            if is_case_insensitive_ident!(self, "and") {
                while is_case_insensitive_ident!(self, "and") {
                    let and = self.parse()?;

                    last_pos = self.input.last_pos();

                    conditions.push(MediaConditionAllType::And(and));

                    self.input.skip_ws();
                }
            } else if is_case_insensitive_ident!(self, "or") {
                while is_case_insensitive_ident!(self, "or") {
                    let or = self.parse()?;

                    last_pos = self.input.last_pos();

                    conditions.push(MediaConditionAllType::Or(or));

                    self.input.skip_ws();
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
        self.input.skip_ws();

        let start_pos = self.input.cur_span().lo;
        let mut last_pos;
        let mut conditions = vec![];

        if is_case_insensitive_ident!(self, "not") {
            let not = self.parse()?;

            last_pos = self.input.last_pos();

            conditions.push(MediaConditionWithoutOrType::Not(not));
        } else {
            let media_in_parens = self.parse()?;

            last_pos = self.input.last_pos();

            conditions.push(MediaConditionWithoutOrType::MediaInParens(media_in_parens));

            self.input.skip_ws();

            if is_case_insensitive_ident!(self, "and") {
                while is_case_insensitive_ident!(self, "and") {
                    let and = self.parse()?;

                    last_pos = self.input.last_pos();

                    conditions.push(MediaConditionWithoutOrType::And(and));

                    self.input.skip_ws();
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
        let span = self.input.cur_span();
        let keyword = match cur!(self) {
            Token::Ident { value, .. } if value.as_ref().eq_ignore_ascii_case("not") => {
                Some(self.parse()?)
            }
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("ident (with 'not' value) token"),
                ));
            }
        };

        self.input.skip_ws();

        let media_in_parens = self.parse()?;

        Ok(MediaNot {
            span: span!(self, span.lo),
            keyword,
            condition: media_in_parens,
        })
    }
}

impl<I> Parse<MediaAnd> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<MediaAnd> {
        let span = self.input.cur_span();
        let keyword = match cur!(self) {
            Token::Ident { value, .. } if value.as_ref().eq_ignore_ascii_case("and") => {
                Some(self.parse()?)
            }
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("ident (with 'and' value) token"),
                ));
            }
        };

        self.input.skip_ws();

        let media_in_parens = self.parse()?;

        Ok(MediaAnd {
            span: span!(self, span.lo),
            keyword,
            condition: media_in_parens,
        })
    }
}

impl<I> Parse<MediaOr> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<MediaOr> {
        let span = self.input.cur_span();
        let keyword = match cur!(self) {
            Token::Ident { value, .. } if value.as_ref().eq_ignore_ascii_case("or") => {
                Some(self.parse()?)
            }
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("ident (with 'or' value) token"),
                ));
            }
        };

        self.input.skip_ws();

        let media_in_parens = self.parse()?;

        Ok(MediaOr {
            span: span!(self, span.lo),
            keyword,
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

        match self.parse() {
            Ok(media_feature) => Ok(MediaInParens::Feature(media_feature)),
            Err(_) => {
                self.input.reset(&state);

                let mut parse_media_condition = || {
                    expect!(self, "(");

                    let media_condition = self.parse()?;

                    expect!(self, ")");

                    Ok(MediaInParens::MediaCondition(media_condition))
                };

                match parse_media_condition() {
                    Ok(media_in_parens) => Ok(media_in_parens),
                    Err(_) => {
                        self.input.reset(&state);

                        let general_enclosed = self.parse()?;

                        Ok(MediaInParens::GeneralEnclosed(general_enclosed))
                    }
                }
            }
        }
    }
}

impl<I> Parse<MediaFeature> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<MediaFeature> {
        let span = self.input.cur_span();

        expect!(self, "(");

        self.input.skip_ws();

        let left = self.parse()?;

        self.input.skip_ws();

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

                self.input.skip_ws();

                let name = match left {
                    MediaFeatureValue::Ident(ident) => MediaFeatureName::Ident(ident),
                    _ => {
                        return Err(Error::new(span, ErrorKind::Expected("identifier value")));
                    }
                };
                let value = self.parse()?;

                self.input.skip_ws();

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

                self.input.skip_ws();

                let center = self.parse()?;

                self.input.skip_ws();

                if eat!(self, ")") {
                    return Ok(MediaFeature::Range(MediaFeatureRange {
                        span: span!(self, span.lo),
                        left: Box::new(left),
                        comparison: left_comparison,
                        right: Box::new(center),
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

                self.input.skip_ws();

                let right = self.parse()?;

                self.input.skip_ws();

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
                    left: Box::new(left),
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
        let span = self.input.cur_span();

        match cur!(self) {
            tok!("number") => {
                let left = self.parse()?;

                self.input.skip_ws();

                if eat!(self, "/") {
                    self.input.skip_ws();

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
            Token::Function { value, .. } if is_math_function(value) => {
                let ctx = Ctx {
                    block_contents_grammar: BlockContentsGrammar::DeclarationValue,
                    ..self.ctx
                };
                let function = self.with_ctx(ctx).parse_as::<Function>()?;

                Ok(MediaFeatureValue::Function(function))
            }
            _ => Err(Error::new(
                span,
                ErrorKind::Expected("number, ident, dimension or function token"),
            )),
        }
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
            self.input.skip_ws();

            if !eat!(self, ",") {
                break;
            }

            self.input.skip_ws();

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
        self.input.skip_ws();

        let span = self.input.cur_span();

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
        let span = self.input.cur_span();
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
        let span = self.input.cur_span();

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
                let span = self.input.cur_span();

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

impl<I> Parse<LayerName> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<LayerName> {
        let start = self.input.cur_span().lo;
        let mut name = vec![];

        while is!(self, Ident) {
            name.push(self.parse()?);

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

impl<I> Parse<ContainerCondition> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ContainerCondition> {
        let start_pos = self.input.cur_span().lo;

        let mut name: Option<ContainerName> = None;

        if is!(self, "ident") && !is_case_insensitive_ident!(self, "not") {
            name = Some(self.parse()?);

            self.input.skip_ws();
        }

        let query: ContainerQuery = self.parse()?;

        Ok(ContainerCondition {
            span: Span::new(start_pos, query.span.hi, Default::default()),
            name,
            query,
        })
    }
}

impl<I> Parse<ContainerName> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ContainerName> {
        match cur!(self) {
            tok!("ident") => {
                let custom_ident: CustomIdent = self.parse()?;

                Ok(ContainerName::CustomIdent(custom_ident))
            }
            _ => {
                let span = self.input.cur_span();

                Err(Error::new(span, ErrorKind::Expected("ident")))
            }
        }
    }
}

impl<I> Parse<ContainerQuery> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ContainerQuery> {
        let start_pos = self.input.cur_span().lo;
        let mut last_pos;

        let mut queries = vec![];

        if is_case_insensitive_ident!(self, "not") {
            let not = self.parse()?;

            queries.push(ContainerQueryType::Not(not));

            last_pos = self.input.last_pos();
        } else {
            self.input.skip_ws();

            let query_in_parens = self.parse()?;

            queries.push(ContainerQueryType::QueryInParens(query_in_parens));

            last_pos = self.input.last_pos();

            self.input.skip_ws();

            if is_case_insensitive_ident!(self, "and") {
                while is_case_insensitive_ident!(self, "and") {
                    let and = self.parse()?;

                    last_pos = self.input.last_pos();

                    queries.push(ContainerQueryType::And(and));

                    self.input.skip_ws();
                }
            } else if is_case_insensitive_ident!(self, "or") {
                while is_case_insensitive_ident!(self, "or") {
                    let or = self.parse()?;

                    last_pos = self.input.last_pos();

                    queries.push(ContainerQueryType::Or(or));

                    self.input.skip_ws();
                }
            };
        }

        Ok(ContainerQuery {
            span: Span::new(start_pos, last_pos, Default::default()),
            queries,
        })
    }
}

impl<I> Parse<ContainerQueryNot> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ContainerQueryNot> {
        let span = self.input.cur_span();
        let keyword = match cur!(self) {
            Token::Ident { value, .. } if value.as_ref().eq_ignore_ascii_case("not") => {
                Some(self.parse()?)
            }
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("ident (with 'not' value) token"),
                ));
            }
        };

        self.input.skip_ws();

        let query_in_parens = self.parse()?;

        Ok(ContainerQueryNot {
            span: span!(self, span.lo),
            keyword,
            query: query_in_parens,
        })
    }
}

impl<I> Parse<ContainerQueryAnd> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ContainerQueryAnd> {
        let span = self.input.cur_span();
        let keyword = match cur!(self) {
            Token::Ident { value, .. } if value.as_ref().eq_ignore_ascii_case("and") => {
                Some(self.parse()?)
            }
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("ident (with 'and' value) token"),
                ));
            }
        };

        self.input.skip_ws();

        let query_in_parens = self.parse()?;

        Ok(ContainerQueryAnd {
            span: span!(self, span.lo),
            keyword,
            query: query_in_parens,
        })
    }
}

impl<I> Parse<ContainerQueryOr> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ContainerQueryOr> {
        let span = self.input.cur_span();
        let keyword = match cur!(self) {
            Token::Ident { value, .. } if value.as_ref().eq_ignore_ascii_case("or") => {
                Some(self.parse()?)
            }
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("ident (with 'or' value) token"),
                ));
            }
        };

        self.input.skip_ws();

        let query_in_parens = self.parse()?;

        Ok(ContainerQueryOr {
            span: span!(self, span.lo),
            keyword,
            query: query_in_parens,
        })
    }
}

impl<I> Parse<QueryInParens> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<QueryInParens> {
        let state = self.input.state();

        match self.parse() {
            Ok(size_feature) => Ok(QueryInParens::SizeFeature(size_feature)),
            Err(_) => {
                self.input.reset(&state);

                let mut parse_container_query = || {
                    expect!(self, "(");

                    let container_query = self.parse()?;

                    expect!(self, ")");

                    Ok(QueryInParens::ContainerQuery(Box::new(container_query)))
                };

                match parse_container_query() {
                    Ok(query_in_parens) => Ok(query_in_parens),
                    Err(_) => {
                        self.input.reset(&state);

                        let general_enclosed = self.parse()?;

                        Ok(QueryInParens::GeneralEnclosed(general_enclosed))
                    }
                }
            }
        }
    }
}

impl<I> Parse<SizeFeature> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<SizeFeature> {
        let span = self.input.cur_span();

        expect!(self, "(");

        self.input.skip_ws();

        let left = self.parse()?;

        self.input.skip_ws();

        match cur!(self) {
            tok!(")") => {
                bump!(self);

                let name = match left {
                    SizeFeatureValue::Ident(ident) => SizeFeatureName::Ident(ident),
                    _ => {
                        return Err(Error::new(span, ErrorKind::Expected("identifier value")));
                    }
                };

                Ok(SizeFeature::Boolean(SizeFeatureBoolean {
                    span: span!(self, span.lo),
                    name,
                }))
            }
            tok!(":") => {
                bump!(self);

                self.input.skip_ws();

                let name = match left {
                    SizeFeatureValue::Ident(ident) => SizeFeatureName::Ident(ident),
                    _ => {
                        return Err(Error::new(span, ErrorKind::Expected("identifier value")));
                    }
                };
                let value = self.parse()?;

                self.input.skip_ws();

                expect!(self, ")");

                Ok(SizeFeature::Plain(SizeFeaturePlain {
                    span: span!(self, span.lo),
                    name,
                    value,
                }))
            }
            tok!("<") | tok!(">") | tok!("=") => {
                let left_comparison = match bump!(self) {
                    tok!("<") => {
                        if eat!(self, "=") {
                            SizeFeatureRangeComparison::Le
                        } else {
                            SizeFeatureRangeComparison::Lt
                        }
                    }
                    tok!(">") => {
                        if eat!(self, "=") {
                            SizeFeatureRangeComparison::Ge
                        } else {
                            SizeFeatureRangeComparison::Gt
                        }
                    }
                    tok!("=") => SizeFeatureRangeComparison::Eq,
                    _ => {
                        unreachable!();
                    }
                };

                self.input.skip_ws();

                let center = self.parse()?;

                self.input.skip_ws();

                if eat!(self, ")") {
                    return Ok(SizeFeature::Range(SizeFeatureRange {
                        span: span!(self, span.lo),
                        left: Box::new(left),
                        comparison: left_comparison,
                        right: Box::new(center),
                    }));
                }

                let right_comparison = match bump!(self) {
                    tok!("<") => {
                        if eat!(self, "=") {
                            SizeFeatureRangeComparison::Le
                        } else {
                            SizeFeatureRangeComparison::Lt
                        }
                    }
                    tok!(">") => {
                        if eat!(self, "=") {
                            SizeFeatureRangeComparison::Ge
                        } else {
                            SizeFeatureRangeComparison::Gt
                        }
                    }
                    _ => {
                        return Err(Error::new(
                            span,
                            ErrorKind::Expected("'>' or '<' operators"),
                        ));
                    }
                };

                self.input.skip_ws();

                let right = self.parse()?;

                self.input.skip_ws();

                expect!(self, ")");

                let name = match center {
                    SizeFeatureValue::Ident(ident) => SizeFeatureName::Ident(ident),
                    _ => {
                        return Err(Error::new(span, ErrorKind::Expected("identifier value")));
                    }
                };

                let is_valid_operator = match left_comparison {
                    SizeFeatureRangeComparison::Lt | SizeFeatureRangeComparison::Le
                        if right_comparison == SizeFeatureRangeComparison::Lt
                            || right_comparison == SizeFeatureRangeComparison::Le =>
                    {
                        true
                    }
                    SizeFeatureRangeComparison::Gt | SizeFeatureRangeComparison::Ge
                        if right_comparison == SizeFeatureRangeComparison::Gt
                            || right_comparison == SizeFeatureRangeComparison::Ge =>
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

                Ok(SizeFeature::RangeInterval(SizeFeatureRangeInterval {
                    span: span!(self, span.lo),
                    left: Box::new(left),
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

impl<I> Parse<SizeFeatureValue> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<SizeFeatureValue> {
        let span = self.input.cur_span();

        match cur!(self) {
            tok!("number") => {
                let left = self.parse()?;

                self.input.skip_ws();

                if eat!(self, "/") {
                    self.input.skip_ws();

                    let right = Some(self.parse()?);

                    return Ok(SizeFeatureValue::Ratio(Ratio {
                        span: span!(self, span.lo),
                        left,
                        right,
                    }));
                }

                Ok(SizeFeatureValue::Number(left))
            }
            tok!("ident") => Ok(SizeFeatureValue::Ident(self.parse()?)),
            tok!("dimension") => Ok(SizeFeatureValue::Dimension(self.parse()?)),
            Token::Function { value, .. } if is_math_function(value) => {
                let ctx = Ctx {
                    block_contents_grammar: BlockContentsGrammar::DeclarationValue,
                    ..self.ctx
                };
                let function = self.with_ctx(ctx).parse_as::<Function>()?;

                Ok(SizeFeatureValue::Function(function))
            }
            _ => Err(Error::new(
                span,
                ErrorKind::Expected("number, ident, dimension or function token"),
            )),
        }
    }
}

impl<I> Parse<ExtensionName> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ExtensionName> {
        let span = self.input.cur_span();

        if !is!(self, Ident) {
            return Err(Error::new(span, ErrorKind::Expected("indent token")));
        }

        match bump!(self) {
            Token::Ident { value, raw } => {
                if !value.starts_with("--") {
                    return Err(Error::new(
                        span,
                        ErrorKind::Expected("Extension name should start with '--'"),
                    ));
                }

                Ok(ExtensionName {
                    span,
                    value,
                    raw: Some(raw),
                })
            }
            _ => {
                unreachable!()
            }
        }
    }
}

impl<I> Parse<CustomMediaQuery> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<CustomMediaQuery> {
        let span = self.input.cur_span();
        let name = self.parse()?;

        self.input.skip_ws();

        let media = match cur!(self) {
            _ if is_case_insensitive_ident!(self, "true")
                || is_case_insensitive_ident!(self, "false") =>
            {
                CustomMediaQueryMediaType::Ident(self.parse()?)
            }
            _ => CustomMediaQueryMediaType::MediaQueryList(self.parse()?),
        };

        Ok(CustomMediaQuery {
            span: span!(self, span.lo),
            name,
            media,
        })
    }
}
