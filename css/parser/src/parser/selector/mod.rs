use super::{input::ParserInput, PResult, Parser};
use crate::{
    error::{Error, ErrorKind},
    Parse,
};
use swc_atoms::{js_word, JsWord};
use swc_common::{BytePos, Span};
use swc_css_ast::*;

impl<I> Parser<I>
where
    I: ParserInput,
{
    pub(super) fn parse_selectors(&mut self) -> PResult<SelectorList> {
        self.input.skip_ws()?;

        let start_pos = self.input.cur_span()?.lo;
        let first = self.parse_complex_selector()?;
        let mut last_pos = first.span.clone().hi;
        let mut children = vec![first];

        loop {
            self.input.skip_ws()?;

            if !eat!(self, ",") {
                break;
            }

            self.input.skip_ws()?;

            let child = self.parse_complex_selector()?;

            last_pos = child.span.clone().hi;
            children.push(child);
        }

        Ok(SelectorList {
            span: Span::new(start_pos, last_pos, Default::default()),
            children,
        })
    }

    fn parse_complex_selector(&mut self) -> PResult<ComplexSelector> {
        let start_pos = self.input.cur_span()?.lo;
        let sel = self.parse_compound_selector()?;
        let mut selectors = vec![sel];
        let mut last_pos;

        loop {
            last_pos = self.input.last_pos()?;

            self.input.skip_ws()?;

            if is_one_of!(self, EOF, ",", "{") {
                break;
            }

            let combinator = self.parse_combinator()?;

            if combinator.is_some() {
                self.input.skip_ws()?;
            }

            let sel = self.parse_compound_selector();

            match sel {
                Ok(mut sel) => {
                    sel.combinator = combinator;
                    selectors.push(sel);
                }
                Err(err) => return Err(err),
            }
        }

        Ok(ComplexSelector {
            span: Span::new(start_pos, last_pos, Default::default()),
            selectors,
        })
    }

    fn parse_combinator(&mut self) -> PResult<Option<SelectorCombinator>> {
        if eat!(self, " ") {
            return Ok(Some(SelectorCombinator::Descendant));
        }

        if eat!(self, ">") {
            return Ok(Some(SelectorCombinator::Child));
        }

        if eat!(self, "+") {
            return Ok(Some(SelectorCombinator::NextSibling));
        }

        if eat!(self, "~") {
            return Ok(Some(SelectorCombinator::LaterSibling));
        }

        Ok(None)
    }

    fn parse_ns_prefix(&mut self, span: Span) -> PResult<Option<Text>> {
        if is!(self, Ident) && peeked_is!(self, "|") {
            let token = bump!(self);
            let text = match token {
                Token::Ident { value, raw } => Text { span, value, raw },
                _ => {
                    unreachable!()
                }
            };

            bump!(self);

            return Ok(Some(text));
        } else if is!(self, "*") && peeked_is!(self, "|") {
            bump!(self);
            bump!(self);

            let value: JsWord = "*".into();
            let raw = value.clone();

            return Ok(Some(Text { span, value, raw }));
        } else if is!(self, "|") {
            bump!(self);

            return Ok(Some(Text {
                span: Span::new(span.lo, span.lo, Default::default()),
                value: js_word!(""),
                raw: js_word!(""),
            }));
        }

        Ok(None)
    }

    fn parse_wq_name(&mut self, span: Span) -> PResult<(Option<Text>, Option<Text>)> {
        let state = self.input.state();

        if is!(self, Ident) && peeked_is!(self, "|")
            || is!(self, "*") && peeked_is!(self, "|")
            || is!(self, "|")
        {
            let prefix = self.parse_ns_prefix(span)?;

            if is!(self, Ident) {
                let span = self.input.cur_span()?;
                let token = bump!(self);
                let name = match token {
                    Token::Ident { value, raw } => Text { span, value, raw },
                    _ => {
                        unreachable!()
                    }
                };

                return Ok((prefix, Some(name)));
            } else {
                // TODO: implement `peeked_ahead_is` for perf
                self.input.reset(&state);
            }
        }

        if is!(self, Ident) {
            let span = self.input.cur_span()?;
            let token = bump!(self);
            let name = match token {
                Token::Ident { value, raw } => Text { span, value, raw },
                _ => {
                    unreachable!()
                }
            };

            return Ok((None, Some(name)));
        }

        Ok((None, None))
    }

    // TODO: no span as argument
    fn parse_type_selector(&mut self, span: Span) -> PResult<Option<NamespacedName>> {
        let start_pos = span.lo;

        let mut prefix = None;

        if let Ok(result) = self.parse_ns_prefix(span) {
            prefix = result;
        }

        if is!(self, Ident) {
            let span = self.input.cur_span()?;
            let token = bump!(self);
            let name = match token {
                Token::Ident { value, raw } => Text { span, value, raw },
                _ => {
                    unreachable!()
                }
            };

            return Ok(Some(NamespacedName {
                span: span!(self, start_pos),
                prefix,
                name,
            }));
        } else if is!(self, "*") {
            bump!(self);

            let value: JsWord = "*".into();
            let raw = value.clone();
            let name = Text { span, value, raw };

            return Ok(Some(NamespacedName {
                span: span!(self, start_pos),
                prefix,
                name,
            }));
        }

        Ok(None)
    }

    fn parse_id_selector(&mut self) -> PResult<IdSelector> {
        let span = self.input.cur_span()?;

        let text = match bump!(self) {
            Token::Hash { value, raw, .. } => Text { span, value, raw },
            _ => {
                unreachable!()
            }
        };

        Ok(IdSelector {
            span: span!(self, span.lo),
            text,
        })
    }

    fn parse_class_selector(&mut self) -> PResult<ClassSelector> {
        let start_pos = self.input.cur_span()?.lo;

        bump!(self);

        let span = self.input.cur_span()?;

        match cur!(self) {
            Token::Ident { .. } => {}
            _ => Err(Error::new(span, ErrorKind::ExpectedSelectorText))?,
        }

        let value = bump!(self);
        let values = match value {
            Token::Ident { value, raw } => (value, raw),
            _ => unreachable!(),
        };

        Ok(ClassSelector {
            span: span!(self, start_pos),
            text: Text {
                span,
                value: values.0,
                raw: values.1,
            },
        })
    }

    fn parse_attribute_selector(&mut self) -> PResult<AttrSelector> {
        let start_pos = self.input.cur_span()?.lo;

        expect!(self, "[");

        self.input.skip_ws()?;

        let start_span = self.input.cur_span()?;
        let prefix;
        let name;
        let mut attr_matcher = None;
        let mut matcher_value = None;
        let mut matcher_modifier = None;

        if let Ok((p, Some(n))) = self.parse_wq_name(start_span) {
            prefix = p;
            name = n;
        } else {
            return Err(Error::new(
                span!(self, start_pos),
                ErrorKind::InvalidAttrSelectorName,
            ));
        }

        self.input.skip_ws()?;

        if !is!(self, "]") {
            let span = self.input.cur_span()?;

            attr_matcher = match cur!(self) {
                tok!("~") | tok!("|") | tok!("^") | tok!("$") | tok!("*") => {
                    let tok = bump!(self);

                    expect!(self, "=");

                    Some(match tok {
                        tok!("~") => AttrSelectorMatcher::Tilde,
                        tok!("|") => AttrSelectorMatcher::Bar,
                        tok!("^") => AttrSelectorMatcher::Caret,
                        tok!("$") => AttrSelectorMatcher::Dollar,
                        tok!("*") => AttrSelectorMatcher::Asterisk,
                        _ => {
                            unreachable!()
                        }
                    })
                }
                tok!("=") => {
                    let tok = bump!(self);

                    Some(match tok {
                        tok!("=") => AttrSelectorMatcher::Equals,
                        _ => {
                            unreachable!()
                        }
                    })
                }
                _ => Err(Error::new(span, ErrorKind::InvalidAttrSelectorMatcher))?,
            };

            self.input.skip_ws()?;

            let span = self.input.cur_span()?;

            matcher_value = match cur!(self) {
                Token::Ident { .. } => {
                    let value = bump!(self);
                    let ident = match value {
                        Token::Ident { value, raw } => (value, raw),
                        _ => unreachable!(),
                    };

                    Some(AttrSelectorValue::Text(Text {
                        span,
                        value: ident.0,
                        raw: ident.1,
                    }))
                }
                Token::Str { .. } => {
                    let value = bump!(self);
                    let str = match value {
                        Token::Str { value, raw } => (value, raw),
                        _ => unreachable!(),
                    };

                    Some(AttrSelectorValue::Str(Str {
                        span,
                        value: str.0,
                        raw: str.1,
                    }))
                }
                _ => Err(Error::new(span, ErrorKind::InvalidAttrSelectorMatcherValue))?,
            };

            self.input.skip_ws()?;

            if is!(self, Ident) {
                let span = self.input.cur_span()?;

                match self.input.cur()? {
                    Some(Token::Ident { value, .. }) => {
                        matcher_modifier = value.chars().next();

                        bump!(self);
                    }
                    _ => Err(Error::new(span, ErrorKind::InvalidAttrSelectorModifier))?,
                }
            }

            self.input.skip_ws()?;
        }

        expect!(self, "]");

        Ok(AttrSelector {
            span: span!(self, start_pos),
            prefix,
            name,
            matcher: attr_matcher,
            value: matcher_value,
            modifier: matcher_modifier,
        })
    }

    fn parse_pseudo_class_selector(&mut self) -> PResult<PseudoSelector> {
        let span = self.input.cur_span()?;

        expect!(self, ":"); // `:`

        // TODO: should be removed, because invalid
        self.input.skip_ws()?;

        if is!(self, Function) {
            let fn_span = self.input.cur_span()?;
            let value = bump!(self);
            let values = match value {
                Token::Function { value, raw } => (value, raw),
                _ => unreachable!(),
            };

            let args = self.parse_any_value(false)?;

            expect!(self, ")");

            return Ok(PseudoSelector {
                span: span!(self, span.lo),
                is_element: false,
                name: Text {
                    span: Span::new(fn_span.lo, fn_span.hi - BytePos(1), Default::default()),
                    value: values.0,
                    raw: values.1,
                },
                args,
            });
        } else if is!(self, Ident) {
            let ident_span = self.input.cur_span()?;
            let value = bump!(self);
            let values = match value {
                Token::Ident { value, raw } => (value, raw),
                _ => unreachable!(),
            };

            return Ok(PseudoSelector {
                span: span!(self, span.lo),
                is_element: false,
                name: Text {
                    span: ident_span,
                    value: values.0,
                    raw: values.1,
                },
                args: Default::default(),
            });
        }

        let span = self.input.cur_span()?;

        return Err(Error::new(span, ErrorKind::InvalidSelector));
    }

    fn parse_compound_selector(&mut self) -> PResult<CompoundSelector> {
        let span = self.input.cur_span()?;
        let start_pos = span.lo;

        let mut has_nest_prefix = false;

        // This is an extension: https://drafts.csswg.org/css-nesting-1/
        if eat!(self, "&") {
            has_nest_prefix = true;
        }

        let type_selector = self.parse_type_selector(span).unwrap();
        let mut subclass_selectors = vec![];

        'subclass_selectors: loop {
            if is!(self, EOF) {
                break;
            }

            match cur!(self) {
                Token::Hash { is_id, .. } => {
                    if !*is_id {
                        break 'subclass_selectors;
                    }

                    subclass_selectors.push(self.parse_id_selector()?.into());
                }

                tok!(".") => {
                    subclass_selectors.push(self.parse_class_selector()?.into());
                }

                tok!("[") => {
                    let attr = self.parse_attribute_selector()?;

                    subclass_selectors.push(attr.into());
                }

                tok!(":") => {
                    if peeked_is!(self, ":") {
                        while is!(self, ":") {
                            let start = self.input.cur_span()?.lo;

                            let is_element = peeked_is!(self, ":");
                            if is_element {
                                bump!(self);
                            }

                            let mut pseudo = self.parse_pseudo_class_selector()?;
                            pseudo.span.lo = start;
                            pseudo.is_element = is_element;
                            subclass_selectors.push(SubclassSelector::Pseudo(pseudo));
                        }

                        break 'subclass_selectors;
                    }

                    let pseudo = self.parse_pseudo_class_selector()?;

                    subclass_selectors.push(SubclassSelector::Pseudo(pseudo));
                }

                Token::AtKeyword { .. } if self.ctx.allow_at_selector => {
                    let values = match bump!(self) {
                        Token::AtKeyword { value, raw } => (value, raw),
                        _ => {
                            unreachable!()
                        }
                    };

                    subclass_selectors.push(SubclassSelector::At(AtSelector {
                        span,
                        text: Text {
                            span,
                            value: values.0,
                            raw: values.1,
                        },
                    }));
                    break 'subclass_selectors;
                }

                _ => {
                    break 'subclass_selectors;
                }
            }
        }

        let span = span!(self, start_pos);

        if !has_nest_prefix && type_selector.is_none() && subclass_selectors.len() == 0 {
            return Err(Error::new(span, ErrorKind::InvalidSelector));
        }

        Ok(CompoundSelector {
            span,
            has_nest_prefix,
            combinator: None,
            type_selector,
            subclass_selectors,
        })
    }
}

impl<I> Parse<SelectorList> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<SelectorList> {
        self.parse_selectors()
    }
}

impl<I> Parse<ComplexSelector> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ComplexSelector> {
        self.parse_complex_selector()
    }
}
