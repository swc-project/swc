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

        let child = self.parse_complex_selector()?;
        let mut children = vec![child];

        loop {
            self.input.skip_ws()?;

            if !eat!(self, ",") {
                break;
            }

            self.input.skip_ws()?;

            let child = self.parse_complex_selector()?;

            children.push(child);
        }

        let start_pos = match children.first() {
            Some(ComplexSelector { span, .. }) => span.lo,
            _ => {
                unreachable!();
            }
        };
        let last_pos = match children.last() {
            Some(ComplexSelector { span, .. }) => span.hi,
            _ => {
                unreachable!();
            }
        };

        Ok(SelectorList {
            span: Span::new(start_pos, last_pos, Default::default()),
            children,
        })
    }

    fn parse_complex_selector(&mut self) -> PResult<ComplexSelector> {
        let child = ComplexSelectorChildren::CompoundSelector(self.parse_compound_selector()?);
        let mut children = vec![child];

        loop {
            let span = self.input.cur_span()?;

            self.input.skip_ws()?;

            if is_one_of!(self, EOF, ",", "{") {
                break;
            }

            let mut combinator = self.parse_combinator()?;

            if combinator.value == CombinatorValue::Descendant {
                combinator.span = span;
            } else {
                self.input.skip_ws()?;
            }

            children.push(ComplexSelectorChildren::Combinator(combinator));

            let child = self.parse_compound_selector()?;

            children.push(ComplexSelectorChildren::CompoundSelector(child));
        }

        let start_pos = match children.first() {
            Some(ComplexSelectorChildren::CompoundSelector(child)) => child.span.lo,
            _ => {
                unreachable!();
            }
        };
        let last_pos = match children.last() {
            Some(ComplexSelectorChildren::CompoundSelector(child)) => child.span.hi,
            _ => {
                unreachable!();
            }
        };

        Ok(ComplexSelector {
            span: Span::new(start_pos, last_pos, Default::default()),
            children,
        })
    }

    fn parse_combinator(&mut self) -> PResult<Combinator> {
        let span = self.input.cur_span()?;

        if eat!(self, ">") {
            return Ok(Combinator {
                span,
                value: CombinatorValue::Child,
            });
        } else if eat!(self, "+") {
            return Ok(Combinator {
                span,
                value: CombinatorValue::NextSibling,
            });
        } else if eat!(self, "~") {
            return Ok(Combinator {
                span,
                value: CombinatorValue::LaterSibling,
            });
        }

        return Ok(Combinator {
            span,
            value: CombinatorValue::Descendant,
        });
    }

    fn parse_ns_prefix(&mut self) -> PResult<Option<Ident>> {
        let span = self.input.cur_span()?;

        if is!(self, Ident) && peeked_is!(self, "|") {
            let token = bump!(self);
            let ident = match token {
                Token::Ident { value, raw } => Ident { span, value, raw },
                _ => {
                    unreachable!()
                }
            };

            bump!(self);

            return Ok(Some(ident));
        } else if is!(self, "*") && peeked_is!(self, "|") {
            bump!(self);
            bump!(self);

            let value: JsWord = "*".into();
            let raw = value.clone();

            return Ok(Some(Ident { span, value, raw }));
        } else if is!(self, "|") {
            bump!(self);

            return Ok(Some(Ident {
                span: Span::new(span.lo, span.lo, Default::default()),
                value: js_word!(""),
                raw: js_word!(""),
            }));
        }

        Ok(None)
    }

    fn parse_wq_name(&mut self) -> PResult<(Option<Ident>, Option<Ident>)> {
        let state = self.input.state();

        if is!(self, Ident) && peeked_is!(self, "|")
            || is!(self, "*") && peeked_is!(self, "|")
            || is!(self, "|")
        {
            let prefix = self.parse_ns_prefix()?;

            if is!(self, Ident) {
                let span = self.input.cur_span()?;
                let token = bump!(self);
                let name = match token {
                    Token::Ident { value, raw } => Ident { span, value, raw },
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
                Token::Ident { value, raw } => Ident { span, value, raw },
                _ => {
                    unreachable!()
                }
            };

            return Ok((None, Some(name)));
        }

        Ok((None, None))
    }

    // TODO: no span as argument
    fn parse_type_selector(&mut self, span: Span) -> PResult<Option<TypeSelector>> {
        let start_pos = span.lo;

        let mut prefix = None;

        if let Ok(result) = self.parse_ns_prefix() {
            prefix = result;
        }

        if is!(self, Ident) {
            let span = self.input.cur_span()?;
            let token = bump!(self);
            let name = match token {
                Token::Ident { value, raw } => Ident { span, value, raw },
                _ => {
                    unreachable!()
                }
            };

            return Ok(Some(TypeSelector {
                span: span!(self, start_pos),
                prefix,
                name,
            }));
        } else if is!(self, "*") {
            bump!(self);

            let value: JsWord = "*".into();
            let raw = value.clone();
            let name = Ident { span, value, raw };

            return Ok(Some(TypeSelector {
                span: span!(self, start_pos),
                prefix,
                name,
            }));
        }

        Ok(None)
    }

    fn parse_id_selector(&mut self) -> PResult<IdSelector> {
        let span = self.input.cur_span()?;
        let ident = match bump!(self) {
            Token::Hash { value, raw, .. } => Ident { span, value, raw },
            _ => {
                unreachable!()
            }
        };

        Ok(IdSelector {
            span: span!(self, span.lo),
            text: ident,
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
            text: Ident {
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

        let prefix;
        let name;
        let mut attr_matcher = None;
        let mut matcher_value = None;
        let mut matcher_modifier = None;

        if let Ok((p, Some(n))) = self.parse_wq_name() {
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

                    Some(AttrSelectorValue::Ident(Ident {
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
                name: Ident {
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
                name: Ident {
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

        let mut nesting_selector = None;

        // TODO: move under option, because it is draft
        // This is an extension: https://drafts.csswg.org/css-nesting-1/
        if eat!(self, "&") {
            nesting_selector = Some(NestingSelector {
                span: span!(self, start_pos),
            });
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
                        text: Ident {
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

        if nesting_selector.is_none() && type_selector.is_none() && subclass_selectors.len() == 0 {
            return Err(Error::new(span, ErrorKind::InvalidSelector));
        }

        Ok(CompoundSelector {
            span,
            nesting_selector,
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
