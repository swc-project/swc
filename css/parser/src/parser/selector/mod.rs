use super::{input::ParserInput, PResult, Parser};
use crate::{
    error::{Error, ErrorKind},
    Parse,
};
use swc_atoms::{js_word, JsWord};
use swc_common::Span;
use swc_css_ast::*;

impl<I> Parser<I>
where
    I: ParserInput,
{
    pub(super) fn parse_selectors(&mut self) -> PResult<Vec<ComplexSelector>> {
        self.input.skip_ws()?;

        let first = self.parse_complex_selector()?;

        let mut buf = vec![first];

        loop {
            self.input.skip_ws()?;

            if !eat!(self, ",") {
                break;
            }

            let s = self.parse_complex_selector()?;
            buf.push(s);
        }

        Ok(buf)
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

    fn parse_name_token(&mut self) -> PResult<Text> {
        let span = self.input.cur_span()?;

        match cur!(self) {
            Token::Ident { .. } => {
                let token = bump!(self);

                match token {
                    Token::Ident { value, raw } => return Ok(Text { span, value, raw }),
                    _ => {
                        unreachable!()
                    }
                }
            }
            _ => Err(Error::new(span, ErrorKind::Expected("Text"))),
        }
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

            return Ok((prefix, Some(name)));
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

        match cur!(self) {
            Token::Ident { .. } => {
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
            }
            tok!("*") => {
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

            _ => {}
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
        let start = self.input.cur_span()?.lo;

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
            span: span!(self, start),
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

        let name_start_pos = self.input.cur_span()?.lo;

        let mut ns_name_prefix = None;
        let mut ns_name_name;

        match cur!(self) {
            tok!("|") | tok!("*") => {
                // "[|x]"
                // "[*|x]"

                if eat!(self, "*") {
                    let value: JsWord = "*".into();
                    let raw = value.clone();

                    ns_name_prefix = Some(Text {
                        span: span!(self, name_start_pos),
                        value,
                        raw,
                    });
                } else {
                    // "[|attr]" is equivalent to "[attr]". From the
                    // specification: "In keeping with the
                    // Namespaces in the XML recommendation, default
                    // namespaces do not apply to attributes, therefore
                    // attribute selectors
                    // without a namespace component apply only to attributes
                    // that have no namespace (equivalent to
                    // |attr)."
                }

                expect!(self, "|");

                ns_name_name = self.parse_name_token()?;
            }

            _ => {
                // "[x]"
                // "[x|y]"

                ns_name_name = self.parse_name_token()?;

                if !peeked_is!(self, "=") && eat!(self, "|") {
                    ns_name_prefix = Some(ns_name_name);
                    ns_name_name = self.parse_name_token()?;
                }
            }
        }
        let name = NamespacedName {
            span: span!(self, name_start_pos),
            prefix: ns_name_prefix,
            name: ns_name_name,
        };

        self.input.skip_ws()?;

        let attr_op = if eat!(self, "=") {
            Some(AttrSelectorOp::Equals)
        } else {
            match cur!(self) {
                tok!("~") | tok!("|") | tok!("^") | tok!("$") | tok!("*") => {
                    let tok = bump!(self);
                    expect!(self, "=");
                    Some(match tok {
                        tok!("~") => AttrSelectorOp::Tilde,
                        tok!("|") => AttrSelectorOp::Bar,
                        tok!("^") => AttrSelectorOp::Caret,
                        tok!("$") => AttrSelectorOp::Dollar,
                        tok!("*") => AttrSelectorOp::Asterisk,
                        _ => {
                            unreachable!()
                        }
                    })
                }
                _ => None,
            }
        };

        let mut matcher_value = None;
        let mut matcher_modifier = None;

        if let Some(..) = attr_op {
            self.input.skip_ws()?;

            if !is!(self, Str) && !is!(self, Ident) {
                return Err(Error::new(
                    span!(self, start_pos),
                    ErrorKind::ExpectedIdentOrStrForAttrSelectorOp,
                ));
            }

            let _ = cur!(self);

            matcher_value = Some(self.parse_id_or_str_for_attr()?);

            self.input.skip_ws()?;

            if is!(self, Ident) {
                match self.input.cur()? {
                    Some(Token::Ident { value: s, .. }) => {
                        if (&**s).eq_ignore_ascii_case("i") || (&**s).eq_ignore_ascii_case("s") {
                            matcher_modifier = s.chars().next();
                            bump!(self);
                        }
                    }
                    _ => {}
                }
            }
        }

        expect!(self, "]");

        Ok(AttrSelector {
            span: span!(self, start_pos),
            name,
            op: attr_op,
            value: matcher_value,
            modifier: matcher_modifier,
        })
    }

    fn parse_pseudo_class_selector(&mut self) -> PResult<PseudoSelector> {
        let span = self.input.cur_span()?;

        expect!(self, ":"); // `:`

        // TODO: should be removed, because invalid
        self.input.skip_ws()?;

        // TODO: will be `Function` token
        if is!(self, Ident) && peeked_is!(self, "(") {
            let ident_span = self.input.cur_span()?;
            let value = bump!(self);
            let values = match value {
                Token::Ident { value, raw } => (value, raw),
                _ => unreachable!(),
            };

            expect!(self, "(");

            let args = self.parse_any_value(false)?;

            expect!(self, ")");

            return Ok(PseudoSelector {
                span: span!(self, span.lo),
                is_element: false,
                name: Text {
                    span: ident_span,
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
        self.input.skip_ws()?;

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

    fn parse_id_or_str_for_attr(&mut self) -> PResult<Str> {
        let span = self.input.cur_span()?;

        match cur!(self) {
            Token::Ident { .. } => {
                let value = bump!(self);
                let ident = match value {
                    Token::Ident { value, raw } => (value, raw),
                    _ => unreachable!(),
                };

                Ok(Str {
                    span,
                    value: ident.0,
                    raw: ident.1,
                })
            }
            Token::Str { .. } => {
                let value = bump!(self);
                let str = match value {
                    Token::Str { value, raw } => (value, raw),
                    _ => unreachable!(),
                };

                Ok(Str {
                    span,
                    value: str.0,
                    raw: str.1,
                })
            }
            _ => Err(Error::new(
                span,
                ErrorKind::ExpectedIdentOrStrForAttrSelectorOp,
            ))?,
        }
    }
}

impl<I> Parse<Vec<ComplexSelector>> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Vec<ComplexSelector>> {
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
