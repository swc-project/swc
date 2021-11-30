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

    fn parse_type_selector(&mut self) -> PResult<Option<TypeSelector>> {
        let span = self.input.cur_span()?;

        let mut prefix = None;

        if let Ok(result) = self.parse_ns_prefix() {
            prefix = result;
        }

        if is!(self, Ident) {
            let name_span = self.input.cur_span()?;
            let token = bump!(self);
            let name = match token {
                Token::Ident { value, raw } => Ident {
                    span: name_span,
                    value,
                    raw,
                },
                _ => {
                    unreachable!()
                }
            };

            return Ok(Some(TypeSelector {
                span: span!(self, span.lo),
                prefix,
                name,
            }));
        } else if is!(self, "*") {
            let name_span = self.input.cur_span()?;

            bump!(self);

            let value: JsWord = "*".into();
            let raw = value.clone();
            let name = Ident {
                span: name_span,
                value,
                raw,
            };

            return Ok(Some(TypeSelector {
                span: span!(self, span.lo),
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

    fn parse_nth(&mut self) -> PResult<Nth> {
        self.input.skip_ws()?;

        let span = self.input.cur_span()?;
        let nth = match cur!(self) {
            //  odd | even
            Token::Ident { value, .. }
                if &(*value).to_ascii_lowercase() == "odd"
                    || &(*value).to_ascii_lowercase() == "even" =>
            {
                let name = bump!(self);
                let names = match name {
                    Token::Ident { value, raw } => (value, raw),
                    _ => {
                        unreachable!();
                    }
                };

                NthValue::Ident(Ident {
                    span: span!(self, span.lo),
                    value: names.0.into(),
                    raw: names.1.into(),
                })
            }
            // <integer>
            Token::Num { .. } => {
                let num = match bump!(self) {
                    Token::Num { value, raw, .. } => (value, raw),
                    _ => {
                        unreachable!();
                    }
                };

                NthValue::AnPlusB(AnPlusB {
                    span: span!(self, span.lo),
                    a: None,
                    a_raw: None,
                    b: Some(num.0 as i32),
                    b_raw: Some(num.1),
                })
            }
            // '+'? n
            // '+'? <ndashdigit-ident>
            // '+'? n <signed-integer>
            // '+'? n- <signless-integer>
            // '+'? n ['+' | '-'] <signless-integer>
            // -n
            // <dashndashdigit-ident>
            // -n <signed-integer>
            // -n- <signless-integer>
            // -n ['+' | '-'] <signless-integer>
            Token::Ident { .. } | Token::Delim { value: '+' } |
            // <n-dimension>
            // <ndashdigit-dimension>
            // <ndash-dimension> <signless-integer>
            // <n-dimension> <signed-integer>
            // <n-dimension> ['+' | '-'] <signless-integer>
            Token::Dimension { .. } => {
                let mut has_plus_sign = false;

                // '+' n
                match cur!(self) {
                    Token::Delim { value: '+' } => {
                        let peeked = self.input.peek()?;

                        match peeked {
                            Some(Token::Ident { .. }) => {
                                bump!(self);
                                has_plus_sign = true;
                            }
                            _ => {}
                        }
                    }
                    _ => {}
                }

                let a;
                let a_raw;

                let n_value;

                match cur!(self) {
                    Token::Ident {  .. } => {
                        let ident_value = match bump!(self) {
                            Token::Ident { value, .. } => value,
                            _ => {
                                unreachable!();
                            }
                        };

                        let has_minus_sign = ident_value.chars().nth(0) == Some('-');
                        let n_char = if has_minus_sign { ident_value.chars().nth(1) } else { ident_value.chars().nth(0) };

                        if n_char != Some('n') && n_char != Some('N') {
                            return Err(Error::new(
                                span,
                                ErrorKind::Expected("'n' character in Ident"),
                            ));
                        }

                        a = Some(if has_minus_sign { -1 } else {1 });
                        a_raw = Some((if has_plus_sign { "+" } else if has_minus_sign { "-" } else { "" }).into());

                        n_value = if has_minus_sign { ident_value.clone()[1..].to_string() } else { ident_value.clone().to_string() };
                    }
                    Token::Dimension { .. } => {
                        let dimension = match bump!(self) {
                            Token::Dimension { value, raw_value, unit, .. } => (value, raw_value, unit),
                            _ => {
                                unreachable!();
                            }
                        };

                        let n_char = dimension.2.chars().nth(0);

                        if n_char != Some('n') && n_char != Some('N') {
                            return Err(Error::new(
                                span,
                                ErrorKind::Expected("'n' character in Ident"),
                            ));
                        }

                        a = Some(dimension.0 as i32);
                        a_raw = Some(dimension.1.into());

                        n_value =  (*dimension.2).to_string();
                    }
                    _ => {
                        return Err(Error::new(span, ErrorKind::InvalidAnPlusBMicrosyntax));
                    }
                };

                self.input.skip_ws()?;

                let mut b = None;
                let mut b_raw = None;

                let dash_after_n = n_value.chars().nth(1);

                match cur!(self) {
                    // '+'? n <signed-integer>
                    // -n <signed-integer>
                    // <n-dimension> <signed-integer>
                    Token::Num { .. } if dash_after_n == None => {
                        let num = match bump!(self) {
                            Token::Num { value, raw, .. } => (value, raw),
                            _ => {
                                unreachable!();
                            }
                        };

                        b = Some(num.0 as i32);
                        b_raw = Some(num.1);
                    }
                    // -n- <signless-integer>
                    // '+'? n- <signless-integer>
                    // <ndash-dimension> <signless-integer>
                    Token::Num { .. } if dash_after_n == Some('-') => {
                        let num = match bump!(self) {
                            Token::Num { value, raw, .. } => (value, raw),
                            _ => {
                                unreachable!();
                            }
                        };

                        b = Some(-1 * num.0 as i32);

                        let mut b_raw_str = String::new();

                        b_raw_str.push_str("- ");
                        b_raw_str.push_str(&num.1);
                        b_raw = Some(b_raw_str.into());
                    }
                    // '+'? n ['+' | '-'] <signless-integer>
                    // -n ['+' | '-'] <signless-integer>
                    // <n-dimension> ['+' | '-'] <signless-integer>
                    Token::Delim { value: '-', .. } | Token::Delim { value: '+', .. } => {
                        let (b_sign, b_sign_raw) = match bump!(self) {
                            Token::Delim { value, .. } => (if value == '-' { -1 } else { 1 }, value),
                            _ => {
                                unreachable!();
                            }
                        };

                        self.input.skip_ws()?;

                        let num = match bump!(self) {
                            Token::Num { value, raw, .. } => (value, raw),
                            _ => {
                                return Err(Error::new(span, ErrorKind::Expected("Num")));
                            }
                        };

                        b = Some(b_sign * num.0 as i32);

                        let mut b_raw_str = String::new();

                        b_raw_str.push(' ');
                        b_raw_str.push(b_sign_raw);
                        b_raw_str.push(' ');
                        b_raw_str.push_str(&num.1);
                        b_raw = Some(b_raw_str.into());
                    }
                    // '+'? <ndashdigit-ident>
                    // <dashndashdigit-ident>
                    // <ndashdigit-dimension>
                    _ if dash_after_n == Some('-') => {
                        let b_from_ident = &n_value[2..];
                        let parsed: i32 = lexical::parse(b_from_ident).unwrap_or_else(|err| {
                            unreachable!(
                                "failed to parse `{}` using lexical: {:?}",
                                b_from_ident, err
                            )
                        });

                        b = Some(-1 * parsed);

                        let mut b_raw_str = String::new();

                        b_raw_str.push('-');
                        b_raw_str.push_str(b_from_ident);

                        b_raw = Some(b_raw_str.into());
                    }
                    // '+'? n
                    // -n
                    _ if dash_after_n == None => {}
                    _ => {
                        return Err(Error::new(span, ErrorKind::InvalidAnPlusBMicrosyntax));
                    }
                }

                NthValue::AnPlusB(AnPlusB {
                    span: span!(self, span.lo),
                    a,
                    a_raw,
                    b,
                    b_raw,
                })
            }
            _ => {
                return Err(Error::new(span, ErrorKind::InvalidAnPlusBMicrosyntax));
            }
        };

        let nth = Nth {
            span: span!(self, span.lo),
            nth,
            selector_list: None,
        };

        self.input.skip_ws()?;

        // match cur!(self) {
        //     Token::Ident { value, .. } => {
        //         match &*value.to_ascii_lowercase() {
        //             "of" => {
        //                 bump!(self);
        //
        //                 self.input.skip_ws()?;
        //
        //                 // TODO: fix me
        //                 selector_list = Some(self.parse_selectors()?);
        //             }
        //             _ => {}
        //         }
        //     }
        //     _ => {}
        // }

        Ok(nth)
    }

    fn parse_pseudo_class_selector(&mut self) -> PResult<PseudoClassSelector> {
        let span = self.input.cur_span()?;

        expect!(self, ":"); // `:`

        if is!(self, Function) {
            let fn_span = self.input.cur_span()?;
            let name = bump!(self);
            let names = match name {
                Token::Function { value, raw } => (value, raw),
                _ => unreachable!(),
            };

            let children = match &*names.0.to_ascii_lowercase() {
                "nth-child" | "nth-last-child" | "nth-of-type" | "nth-last-of-type" => {
                    let state = self.input.state();
                    let nth = self.parse_nth();

                    match nth {
                        Ok(nth) => PseudoSelectorChildren::Nth(nth),
                        Err(_) => {
                            self.input.reset(&state);

                            PseudoSelectorChildren::Tokens(self.parse_any_value()?)
                        }
                    }
                }
                _ => PseudoSelectorChildren::Tokens(self.parse_any_value()?),
            };

            expect!(self, ")");

            return Ok(PseudoClassSelector {
                span: span!(self, span.lo),
                name: Ident {
                    span: Span::new(fn_span.lo, fn_span.hi - BytePos(1), Default::default()),
                    value: names.0,
                    raw: names.1,
                },
                children: Some(children),
            });
        } else if is!(self, Ident) {
            let ident_span = self.input.cur_span()?;
            let value = bump!(self);
            let values = match value {
                Token::Ident { value, raw } => (value, raw),
                _ => unreachable!(),
            };

            return Ok(PseudoClassSelector {
                span: span!(self, span.lo),
                name: Ident {
                    span: ident_span,
                    value: values.0,
                    raw: values.1,
                },
                children: None,
            });
        }

        let span = self.input.cur_span()?;

        return Err(Error::new(span, ErrorKind::InvalidSelector));
    }

    fn parse_pseudo_element_selector(&mut self) -> PResult<PseudoElementSelector> {
        let span = self.input.cur_span()?;

        expect!(self, ":"); // `:`
        expect!(self, ":"); // `:`

        if is!(self, Function) {
            let fn_span = self.input.cur_span()?;
            let name = bump!(self);
            let names = match name {
                Token::Function { value, raw } => (value, raw),
                _ => unreachable!(),
            };

            let children = self.parse_any_value()?;

            expect!(self, ")");

            return Ok(PseudoElementSelector {
                span: span!(self, span.lo),
                name: Ident {
                    span: Span::new(fn_span.lo, fn_span.hi - BytePos(1), Default::default()),
                    value: names.0,
                    raw: names.1,
                },
                children: Some(children),
            });
        } else if is!(self, Ident) {
            let ident_span = self.input.cur_span()?;
            let value = bump!(self);
            let values = match value {
                Token::Ident { value, raw } => (value, raw),
                _ => unreachable!(),
            };

            return Ok(PseudoElementSelector {
                span: span!(self, span.lo),
                name: Ident {
                    span: ident_span,
                    value: values.0,
                    raw: values.1,
                },
                children: None,
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

        let type_selector = self.parse_type_selector().unwrap();
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
                            let pseudo_element = self.parse_pseudo_element_selector()?;

                            subclass_selectors.push(pseudo_element.into());
                        }

                        break 'subclass_selectors;
                    }

                    let pseudo_class = self.parse_pseudo_class_selector()?;

                    subclass_selectors.push(pseudo_class.into());
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
