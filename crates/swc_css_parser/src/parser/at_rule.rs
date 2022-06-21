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
        // Consume the next input token. Create a new at-rule with its name set to the
        // value of the current input token, its prelude initially set to an empty list,
        // and its value initially set to nothing.
        let at_rule_span = self.input.cur_span()?;
        let at_keyword_name = match bump!(self) {
            Token::AtKeyword { value, raw } => (value, raw),
            _ => {
                unreachable!()
            }
        };
        let lowercased_name = &*at_keyword_name.0.to_lowercase();
        let at_rule_name = if at_keyword_name.0.starts_with("--") {
            AtRuleName::DashedIdent(DashedIdent {
                span: Span::new(
                    at_rule_span.lo + BytePos(1),
                    at_rule_span.hi,
                    Default::default(),
                ),
                value: at_keyword_name.0,
                raw: at_keyword_name.1,
            })
        } else {
            AtRuleName::Ident(Ident {
                span: Span::new(
                    at_rule_span.lo + BytePos(1),
                    at_rule_span.hi,
                    Default::default(),
                ),
                value: at_keyword_name.0,
                raw: at_keyword_name.1,
            })
        };
        let mut at_rule = AtRule {
            span: span!(self, at_rule_span.lo),
            name: at_rule_name,
            prelude: None,
            block: None,
        };
        let parse_prelude = |parser: &mut Parser<I>| -> PResult<Option<AtRulePrelude>> {
            match lowercased_name {
                "viewport" | "-ms-viewport" | "-o-viewport" | "font-face" => {
                    parser.input.skip_ws()?;

                    if !is!(parser, "{") {
                        let span = parser.input.cur_span()?;

                        return Err(Error::new(span, ErrorKind::Expected("'{' token")));
                    }

                    Ok(None)
                }
                "charset" => {
                    parser.input.skip_ws()?;

                    let span = parser.input.cur_span()?;
                    let charset = match cur!(parser) {
                        tok!("string") => parser.parse()?,
                        _ => {
                            return Err(Error::new(span, ErrorKind::InvalidCharsetAtRule));
                        }
                    };

                    let prelude = AtRulePrelude::CharsetPrelude(charset);

                    parser.input.skip_ws()?;

                    if !is!(parser, ";") {
                        let span = parser.input.cur_span()?;

                        return Err(Error::new(span, ErrorKind::Expected("';' token")));
                    }

                    Ok(Some(prelude))
                }
                "counter-style" => {
                    parser.input.skip_ws()?;

                    let prelude = AtRulePrelude::CounterStylePrelude(parser.parse()?);

                    parser.input.skip_ws()?;

                    if !is!(parser, "{") {
                        let span = parser.input.cur_span()?;

                        return Err(Error::new(span, ErrorKind::Expected("'{' token")));
                    }

                    Ok(Some(prelude))
                }
                "font-palette-values" => {
                    parser.input.skip_ws()?;

                    let prelude = AtRulePrelude::FontPaletteValuesPrelude(parser.parse()?);

                    parser.input.skip_ws()?;

                    if !is!(parser, "{") {
                        let span = parser.input.cur_span()?;

                        return Err(Error::new(span, ErrorKind::Expected("'{' token")));
                    }

                    Ok(Some(prelude))
                }
                "layer" => {
                    parser.input.skip_ws()?;

                    let prelude = if is!(parser, Ident) {
                        let mut name_list = vec![];

                        while is!(parser, Ident) {
                            name_list.push(parser.parse()?);

                            parser.input.skip_ws()?;

                            if is!(parser, ",") {
                                eat!(parser, ",");

                                parser.input.skip_ws()?;
                            }
                        }

                        match name_list.len() == 1 {
                            // Block
                            true => Some(AtRulePrelude::LayerPrelude(LayerPrelude::Name(
                                name_list.remove(0),
                            ))),
                            // Statement
                            false => {
                                let first = name_list[0].span;
                                let last = name_list[name_list.len() - 1].span;

                                Some(AtRulePrelude::LayerPrelude(LayerPrelude::NameList(
                                    LayerNameList {
                                        name_list,
                                        span: Span::new(first.lo, last.hi, Default::default()),
                                    },
                                )))
                            }
                        }
                    } else {
                        None
                    };

                    parser.input.skip_ws()?;

                    match prelude {
                        Some(AtRulePrelude::LayerPrelude(LayerPrelude::Name(_))) | None => {
                            if !is!(parser, "{") {
                                let span = parser.input.cur_span()?;

                                return Err(Error::new(span, ErrorKind::Expected("'{' token")));
                            }
                        }
                        Some(AtRulePrelude::LayerPrelude(LayerPrelude::NameList(_))) => {
                            if !is!(parser, ";") {
                                let span = parser.input.cur_span()?;

                                return Err(Error::new(span, ErrorKind::Expected("';' token")));
                            }
                        }
                        _ => {
                            unreachable!();
                        }
                    }

                    Ok(prelude)
                }
                "document" | "-moz-document" => {
                    parser.input.skip_ws()?;

                    let span = parser.input.cur_span()?;
                    let url_match_fn = parser.parse()?;
                    let mut matching_functions = vec![url_match_fn];

                    loop {
                        parser.input.skip_ws()?;

                        if !eat!(parser, ",") {
                            break;
                        }

                        parser.input.skip_ws()?;

                        matching_functions.push(parser.parse()?);
                    }

                    let prelude = AtRulePrelude::DocumentPrelude(DocumentPrelude {
                        span: span!(parser, span.lo),
                        matching_functions,
                    });

                    parser.input.skip_ws()?;

                    if !is!(parser, "{") {
                        let span = parser.input.cur_span()?;

                        return Err(Error::new(span, ErrorKind::Expected("'{' token")));
                    }

                    Ok(Some(prelude))
                }
                "page" => {
                    parser.input.skip_ws()?;

                    let prelude = if !is!(parser, "{") {
                        Some(AtRulePrelude::PagePrelude(parser.parse()?))
                    } else {
                        None
                    };

                    parser.input.skip_ws()?;

                    Ok(prelude)
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
                    if parser.ctx.in_page_at_rule =>
                {
                    parser.input.skip_ws()?;

                    Ok(None)
                }
                "property" => {
                    parser.input.skip_ws()?;

                    let prelude = AtRulePrelude::PropertyPrelude(parser.parse()?);

                    parser.input.skip_ws()?;

                    if !is!(parser, "{") {
                        let span = parser.input.cur_span()?;

                        return Err(Error::new(span, ErrorKind::Expected("'{' token")));
                    }

                    Ok(Some(prelude))
                }
                "namespace" => {
                    parser.input.skip_ws()?;

                    let span = parser.input.cur_span()?;
                    let mut prefix = None;

                    if is!(parser, Ident) {
                        prefix = match cur!(parser) {
                            tok!("ident") => Some(parser.parse()?),
                            _ => {
                                unreachable!()
                            }
                        };

                        parser.input.skip_ws()?;
                    }

                    let uri = match cur!(parser) {
                        tok!("string") => NamespacePreludeUri::Str(parser.parse()?),
                        tok!("url") => NamespacePreludeUri::Url(parser.parse()?),
                        tok!("function") => NamespacePreludeUri::Url(parser.parse()?),
                        _ => {
                            let span = parser.input.cur_span()?;

                            return Err(Error::new(
                                span,
                                ErrorKind::Expected("string, url or function tokens"),
                            ));
                        }
                    };

                    let prelude = AtRulePrelude::NamespacePrelude(NamespacePrelude {
                        span: span!(parser, span.lo),
                        prefix,
                        uri,
                    });

                    if !is!(parser, ";") {
                        let span = parser.input.cur_span()?;

                        return Err(Error::new(span, ErrorKind::Expected("';' token")));
                    }

                    Ok(Some(prelude))
                }
                "color-profile" => {
                    parser.input.skip_ws()?;

                    let name = match cur!(parser) {
                        Token::Ident { value, .. } => {
                            if value.starts_with("--") {
                                ColorProfileName::DashedIdent(parser.parse()?)
                            } else {
                                ColorProfileName::Ident(parser.parse()?)
                            }
                        }
                        _ => {
                            let span = parser.input.cur_span()?;

                            return Err(Error::new(span, ErrorKind::Expected("ident")));
                        }
                    };

                    let prelude = AtRulePrelude::ColorProfilePrelude(name);

                    parser.input.skip_ws()?;

                    if !is!(parser, "{") {
                        let span = parser.input.cur_span()?;

                        return Err(Error::new(span, ErrorKind::Expected("'{' token")));
                    }

                    Ok(Some(prelude))
                }
                "nest" => {
                    parser.input.skip_ws()?;

                    let prelude = AtRulePrelude::NestPrelude(parser.parse()?);

                    parser.input.skip_ws()?;

                    if !is!(parser, "{") {
                        let span = parser.input.cur_span()?;

                        return Err(Error::new(span, ErrorKind::Expected("'{' token")));
                    }

                    Ok(Some(prelude))
                }
                "media" => {
                    parser.input.skip_ws()?;

                    let media = if !is!(parser, "{") {
                        let media_query_list = parser.parse()?;

                        Some(AtRulePrelude::MediaPrelude(media_query_list))
                    } else {
                        None
                    };

                    parser.input.skip_ws()?;

                    Ok(media)
                }
                "supports" => {
                    parser.input.skip_ws()?;

                    let prelude = AtRulePrelude::SupportsPrelude(parser.parse()?);

                    parser.input.skip_ws()?;

                    Ok(Some(prelude))
                }
                "import" => {
                    parser.input.skip_ws()?;

                    let span = parser.input.cur_span()?;
                    let href = match cur!(parser) {
                        tok!("string") => ImportPreludeHref::Str(parser.parse()?),
                        tok!("url") => ImportPreludeHref::Url(parser.parse()?),
                        tok!("function") => ImportPreludeHref::Url(parser.parse()?),
                        _ => {
                            return Err(Error::new(
                                span,
                                ErrorKind::Expected("string, url or function token"),
                            ))
                        }
                    };

                    parser.input.skip_ws()?;

                    let layer_name = match cur!(parser) {
                        Token::Ident { value, .. } if *value.to_ascii_lowercase() == *"layer" => {
                            let name = ImportPreludeLayerName::Ident(parser.parse()?);

                            parser.input.skip_ws()?;

                            Some(name)
                        }
                        Token::Function { value, .. }
                            if *value.to_ascii_lowercase() == *"layer" =>
                        {
                            // TODO improve me
                            let ctx = Ctx {
                                block_contents_grammar: BlockContentsGrammar::DeclarationValue,
                                ..parser.ctx
                            };

                            let name = ImportPreludeLayerName::Function(
                                parser.with_ctx(ctx).parse_as::<Function>()?,
                            );

                            parser.input.skip_ws()?;

                            Some(name)
                        }
                        _ => None,
                    };

                    let supports = match cur!(parser) {
                        Token::Function { value, .. }
                            if *value.to_ascii_lowercase() == *"supports" =>
                        {
                            bump!(parser);

                            parser.input.skip_ws()?;

                            let supports =
                                if is_case_insensitive_ident!(parser, "not") || is!(parser, "(") {
                                    ImportPreludeSupportsType::SupportsCondition(parser.parse()?)
                                } else {
                                    ImportPreludeSupportsType::Declaration(parser.parse()?)
                                };

                            expect!(parser, ")");

                            Some(supports)
                        }
                        _ => None,
                    };

                    let media = if !is!(parser, ";") {
                        Some(parser.parse()?)
                    } else {
                        None
                    };

                    parser.input.skip_ws()?;

                    let prelude = AtRulePrelude::ImportPrelude(ImportPrelude {
                        span: span!(parser, span.lo),
                        href,
                        layer_name,
                        supports,
                        media,
                    });

                    if !is!(parser, ";") {
                        let span = parser.input.cur_span()?;

                        return Err(Error::new(span, ErrorKind::Expected("';' token")));
                    }

                    Ok(Some(prelude))
                }
                "keyframes" | "-webkit-keyframes" | "-moz-keyframes" | "-o-keyframes"
                | "-ms-keyframes" => {
                    parser.input.skip_ws()?;

                    let prelude = AtRulePrelude::KeyframesPrelude(parser.parse()?);

                    parser.input.skip_ws()?;

                    if !is!(parser, "{") {
                        let span = parser.input.cur_span()?;

                        return Err(Error::new(span, ErrorKind::Expected("'{' token")));
                    }

                    Ok(Some(prelude))
                }
                _ => {
                    let span = parser.input.cur_span()?;

                    return Err(Error::new(span, ErrorKind::Ignore));
                }
            }
        };
        let parse_simple_block = |parser: &mut Parser<I>| -> PResult<SimpleBlock> {
            let ctx = match lowercased_name {
                "viewport"
                | "-o-viewport"
                | "-ms-viewport"
                | "font-face"
                | "font-palette-values"
                | "property"
                | "color-profile"
                | "counter-style"
                | "top-left-corner"
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
                | "right-bottom" => Ctx {
                    block_contents_grammar: BlockContentsGrammar::DeclarationList,
                    ..parser.ctx
                },
                "page" => Ctx {
                    in_page_at_rule: true,
                    block_contents_grammar: BlockContentsGrammar::DeclarationList,
                    ..parser.ctx
                },
                "layer" => Ctx {
                    block_contents_grammar: BlockContentsGrammar::Stylesheet,
                    ..parser.ctx
                },
                "media" | "supports" | "document" | "-moz-document" => {
                    match parser.ctx.block_contents_grammar {
                        BlockContentsGrammar::StyleBlock => Ctx {
                            block_contents_grammar: BlockContentsGrammar::StyleBlock,
                            ..parser.ctx
                        },
                        _ => Ctx {
                            block_contents_grammar: BlockContentsGrammar::Stylesheet,
                            ..parser.ctx
                        },
                    }
                }
                "nest" => Ctx {
                    block_contents_grammar: BlockContentsGrammar::StyleBlock,
                    ..parser.ctx
                },
                _ => Ctx {
                    block_contents_grammar: BlockContentsGrammar::NoGrammar,
                    ..parser.ctx
                },
            };
            let block = match lowercased_name {
                "keyframes" | "-moz-keyframes" | "-o-keyframes" | "-webkit-keyframes"
                | "-ms-keyframes" => {
                    let span_block = parser.input.cur_span()?;
                    let mut block = SimpleBlock {
                        span: Default::default(),
                        name: '{',
                        value: vec![],
                    };

                    expect!(parser, "{");

                    parser.input.skip_ws()?;

                    loop {
                        if is!(parser, "}") {
                            break;
                        }

                        parser.input.skip_ws()?;

                        let keyframe_block: KeyframeBlock = parser.parse()?;

                        block
                            .value
                            .push(ComponentValue::KeyframeBlock(keyframe_block));

                        parser.input.skip_ws()?;
                    }

                    expect!(parser, "}");

                    block.span = span!(parser, span_block.lo);

                    block
                }
                _ => parser.with_ctx(ctx).parse_as::<SimpleBlock>()?,
            };

            Ok(block)
        };

        loop {
            // <EOF-token>
            // This is a parse error. Return the at-rule.
            if is!(self, EOF) {
                at_rule.span = span!(self, at_rule_span.lo);

                return Ok(at_rule);
            }

            match cur!(self) {
                // <semicolon-token>
                // Return the at-rule.
                tok!(";") => {
                    self.input.bump()?;

                    at_rule.span = span!(self, at_rule_span.lo);

                    return Ok(at_rule);
                }
                // <{-token>
                // Consume a simple block and assign it to the at-rule’s block. Return the at-rule.
                tok!("{") => {
                    let state = self.input.state();
                    let block = match parse_simple_block(self) {
                        Ok(simple_block) => simple_block,
                        Err(err) => {
                            if *err.kind() != ErrorKind::Ignore {
                                self.errors.push(err);
                            }

                            self.input.reset(&state);

                            let ctx = Ctx {
                                block_contents_grammar: BlockContentsGrammar::NoGrammar,
                                ..self.ctx
                            };

                            self.with_ctx(ctx).parse_as::<SimpleBlock>()?
                        }
                    };

                    at_rule.block = Some(block);
                    at_rule.span = span!(self, at_rule_span.lo);

                    return Ok(at_rule);
                }
                // anything else
                // Reconsume the current input token. Consume a component value. Append the returned
                // value to the at-rule’s prelude.
                _ => {
                    let state = self.input.state();

                    match parse_prelude(self) {
                        Ok(prelude) => match prelude {
                            Some(prelude) => {
                                at_rule.prelude = Some(prelude);
                            }
                            None => {}
                        },
                        Err(err) => {
                            if *err.kind() != ErrorKind::Ignore {
                                self.errors.push(err);
                            }

                            self.input.reset(&state);

                            let span = self.input.cur_span()?;

                            let mut list_of_component_value = match at_rule.prelude {
                                Some(AtRulePrelude::ListOfComponentValues(
                                    ref mut list_of_component_value,
                                )) => list_of_component_value,
                                _ => {
                                    at_rule.prelude = Some(AtRulePrelude::ListOfComponentValues(
                                        ListOfComponentValues {
                                            span: span!(self, span.lo),
                                            children: vec![],
                                        },
                                    ));

                                    match at_rule.prelude {
                                        Some(AtRulePrelude::ListOfComponentValues(
                                            ref mut list_of_component_value,
                                        )) => list_of_component_value,
                                        _ => {
                                            unreachable!();
                                        }
                                    }
                                }
                            };

                            let ctx = Ctx {
                                block_contents_grammar: BlockContentsGrammar::NoGrammar,
                                ..self.ctx
                            };
                            let component_value =
                                self.with_ctx(ctx).parse_as::<ComponentValue>()?;

                            list_of_component_value.children.push(component_value);
                            list_of_component_value.span = Span::new(
                                list_of_component_value.span.lo,
                                span.hi,
                                Default::default(),
                            );
                        }
                    }
                }
            }
        }
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
                    return Err(Error::new(
                        custom_ident.span,
                        ErrorKind::InvalidCustomIdent(custom_ident.raw),
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
                let span = self.input.cur_span()?;

                return Err(Error::new(
                    span,
                    ErrorKind::Expected("ident or percentage token"),
                ));
            }
        }
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
        let keyword = match cur!(self) {
            Token::Ident { value, .. } if value.as_ref().eq_ignore_ascii_case("not") => {
                self.parse()?
            }
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("ident (with 'not' value) token"),
                ));
            }
        };

        self.input.skip_ws()?;

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
        let span = self.input.cur_span()?;
        let keyword = match cur!(self) {
            Token::Ident { value, .. } if value.as_ref().eq_ignore_ascii_case("and") => {
                self.parse()?
            }
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("ident (with 'and' value) token"),
                ));
            }
        };

        self.input.skip_ws()?;

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
        let span = self.input.cur_span()?;
        let keyword = match cur!(self) {
            Token::Ident { value, .. } if value.as_ref().eq_ignore_ascii_case("or") => {
                self.parse()?
            }
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("ident (with 'or' value) token"),
                ));
            }
        };

        self.input.skip_ws()?;

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

                self.input.skip_ws()?;

                let declaration = self.parse()?;

                self.input.skip_ws()?;

                expect!(self, ")");

                Ok(SupportsFeature::Declaration(declaration))
            }
            Token::Function { value, .. } if &*value.to_lowercase() == "selector" => {
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
                let span = self.input.cur_span()?;

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

        let mut keyword = None;

        let condition = if media_type.is_some() {
            if is_one_of_case_insensitive_ident!(self, "and") {
                keyword = Some(self.parse()?);

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
            keyword,
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
        let keyword = match cur!(self) {
            Token::Ident { value, .. } if value.as_ref().eq_ignore_ascii_case("not") => {
                self.parse()?
            }
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("ident (with 'not' value) token"),
                ));
            }
        };

        self.input.skip_ws()?;

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
        let span = self.input.cur_span()?;
        let keyword = match cur!(self) {
            Token::Ident { value, .. } if value.as_ref().eq_ignore_ascii_case("and") => {
                self.parse()?
            }
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("ident (with 'and' value) token"),
                ));
            }
        };

        self.input.skip_ws()?;

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
        let span = self.input.cur_span()?;
        let keyword = match cur!(self) {
            Token::Ident { value, .. } if value.as_ref().eq_ignore_ascii_case("or") => {
                self.parse()?
            }
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("ident (with 'or' value) token"),
                ));
            }
        };

        self.input.skip_ws()?;

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
