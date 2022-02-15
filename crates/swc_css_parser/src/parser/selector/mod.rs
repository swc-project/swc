use swc_atoms::JsWord;
use swc_common::{BytePos, Span};
use swc_css_ast::*;

use super::{input::ParserInput, PResult, Parser};
use crate::{
    error::{Error, ErrorKind},
    Parse,
};

impl<I> Parse<SelectorList> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<SelectorList> {
        self.input.skip_ws()?;

        let child = self.parse()?;
        let mut children = vec![child];

        loop {
            self.input.skip_ws()?;

            if !eat!(self, ",") {
                break;
            }

            self.input.skip_ws()?;

            let child = self.parse()?;

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
}

impl<I> Parse<ComplexSelector> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ComplexSelector> {
        let child = ComplexSelectorChildren::CompoundSelector(self.parse()?);
        let mut children = vec![child];

        loop {
            let span = self.input.cur_span()?;

            self.input.skip_ws()?;

            if is_one_of!(self, EOF, ",", "{") {
                break;
            }

            let mut combinator: Combinator = self.parse()?;

            if combinator.value == CombinatorValue::Descendant {
                combinator.span = span;
            } else {
                self.input.skip_ws()?;
            }

            children.push(ComplexSelectorChildren::Combinator(combinator));

            let child = self.parse()?;

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
}

impl<I> Parse<Combinator> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Combinator> {
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
        } else if eat!(self, "|") {
            expect!(self, "|");

            return Ok(Combinator {
                span: span!(self, span.lo),
                value: CombinatorValue::Column,
            });
        }

        Ok(Combinator {
            span,
            value: CombinatorValue::Descendant,
        })
    }
}

impl<I> Parse<CompoundSelector> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<CompoundSelector> {
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

        let type_selector = if is_one_of!(self, Ident, "*", "|") {
            Some(self.parse()?)
        } else {
            None
        };
        let mut subclass_selectors = vec![];

        loop {
            if !(is!(self, "#")
                || is!(self, ".")
                || is!(self, "[")
                || (is!(self, ":") && !peeked_is!(self, ":")))
            {
                break;
            }

            let subclass_selector = self.parse()?;

            subclass_selectors.push(subclass_selector);
        }

        loop {
            if !(is!(self, ":") && peeked_is!(self, ":")) {
                break;
            }

            // TODO pseudo element is not subclass selector
            let pseudo_element = SubclassSelector::PseudoElement(self.parse()?);

            subclass_selectors.push(pseudo_element);

            loop {
                if !(is!(self, ":") && !peeked_is!(self, ":")) {
                    break;
                }

                let pseudo_element = SubclassSelector::PseudoClass(self.parse()?);

                subclass_selectors.push(pseudo_element);
            }
        }

        let span = span!(self, start_pos);

        if nesting_selector.is_none() && type_selector.is_none() && subclass_selectors.is_empty() {
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

impl<I> Parse<TypeSelector> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<TypeSelector> {
        let span = self.input.cur_span()?;
        let prefix = if (is!(self, Ident) && peeked_is!(self, "|"))
            || (is!(self, "*") && peeked_is!(self, "|"))
            || is!(self, "|")
        {
            Some(self.parse()?)
        } else {
            None
        };

        if is!(self, Ident) {
            let value = self.parse()?;

            return Ok(TypeSelector::TagName(TagNameSelector {
                span: span!(self, span.lo),
                name: WqName {
                    span: span!(self, span.lo),
                    prefix,
                    value,
                },
            }));
        } else if is!(self, "*") {
            bump!(self);

            return Ok(TypeSelector::Universal(UniversalSelector {
                span: span!(self, span.lo),
                prefix,
            }));
        }

        return Err(Error::new(
            span,
            ErrorKind::Expected("ident, '*' or '|' delim tokens"),
        ));
    }
}

impl<I> Parse<NsPrefix> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<NsPrefix> {
        let span = self.input.cur_span()?;
        let mut prefix = None;

        if is!(self, Ident) {
            prefix = Some(self.parse()?);
        } else if is!(self, "*") {
            bump!(self);

            let value: JsWord = "*".into();
            let raw = value.clone();

            prefix = Some(Ident { span, value, raw });
        }

        expect!(self, "|");

        return Ok(NsPrefix {
            span: span!(self, span.lo),
            prefix,
        });
    }
}

impl<I> Parse<Option<WqName>> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Option<WqName>> {
        let span = self.input.cur_span()?;
        let state = self.input.state();

        if is!(self, Ident) && peeked_is!(self, "|")
            || is!(self, "*") && peeked_is!(self, "|")
            || is!(self, "|")
        {
            let prefix = Some(self.parse()?);

            if is!(self, Ident) {
                let value = self.parse()?;

                return Ok(Some(WqName {
                    span: span!(self, span.lo),
                    prefix,
                    value,
                }));
            } else {
                // TODO: implement `peeked_ahead_is` for perf
                self.input.reset(&state);
            }
        }

        if is!(self, Ident) {
            let value = self.parse()?;

            return Ok(Some(WqName {
                span: span!(self, span.lo),
                prefix: None,
                value,
            }));
        }

        Ok(None)
    }
}

impl<I> Parse<SubclassSelector> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<SubclassSelector> {
        match cur!(self) {
            tok!("#") => Ok(SubclassSelector::Id(self.parse()?)),
            tok!(".") => Ok(SubclassSelector::Class(self.parse()?)),
            tok!("[") => Ok(SubclassSelector::Attribute(self.parse()?)),
            tok!(":") => Ok(SubclassSelector::PseudoClass(self.parse()?)),
            _ => {
                let span = self.input.cur_span()?;

                return Err(Error::new(
                    span,
                    ErrorKind::Expected("id, class, attribute or pseudo-class selector"),
                ));
            }
        }
    }
}

impl<I> Parse<IdSelector> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<IdSelector> {
        let span = self.input.cur_span()?;
        let text = match bump!(self) {
            Token::Hash {
                is_id, value, raw, ..
            } => {
                if !is_id {
                    return Err(Error::new(
                        span,
                        ErrorKind::Expected("identifier in id selector"),
                    ));
                }

                Ident { span, value, raw }
            }
            _ => {
                unreachable!()
            }
        };

        Ok(IdSelector {
            span: span!(self, span.lo),
            text,
        })
    }
}

impl<I> Parse<ClassSelector> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ClassSelector> {
        let span = self.input.cur_span()?;

        expect!(self, ".");

        let text = self.parse()?;

        Ok(ClassSelector {
            span: span!(self, span.lo),
            text,
        })
    }
}

impl<I> Parse<AttributeSelector> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<AttributeSelector> {
        let span = self.input.cur_span()?;

        expect!(self, "[");

        self.input.skip_ws()?;

        let mut matcher = None;
        let mut value = None;
        let mut modifier = None;

        let name = if let Ok(Some(wq_name)) = self.parse() {
            wq_name
        } else {
            let span = self.input.cur_span()?;

            return Err(Error::new(
                span!(self, span.lo),
                ErrorKind::InvalidAttrSelectorName,
            ));
        };

        self.input.skip_ws()?;

        if !is!(self, "]") {
            matcher = Some(self.parse()?);

            self.input.skip_ws()?;

            value = Some(self.parse()?);

            self.input.skip_ws()?;

            if is!(self, Ident) {
                modifier = Some(self.parse()?);
            }

            self.input.skip_ws()?;
        }

        expect!(self, "]");

        Ok(AttributeSelector {
            span: span!(self, span.lo),
            name,
            matcher,
            value,
            modifier,
        })
    }
}

impl<I> Parse<AttributeSelectorMatcher> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<AttributeSelectorMatcher> {
        let span = self.input.cur_span()?;

        match cur!(self) {
            tok!("~") => {
                bump!(self);
                expect!(self, "=");

                Ok(AttributeSelectorMatcher {
                    span: span!(self, span.lo),
                    value: AttributeSelectorMatcherValue::Tilde,
                })
            }
            tok!("|") => {
                bump!(self);
                expect!(self, "=");

                Ok(AttributeSelectorMatcher {
                    span: span!(self, span.lo),
                    value: AttributeSelectorMatcherValue::Bar,
                })
            }
            tok!("^") => {
                bump!(self);
                expect!(self, "=");

                Ok(AttributeSelectorMatcher {
                    span: span!(self, span.lo),
                    value: AttributeSelectorMatcherValue::Caret,
                })
            }
            tok!("$") => {
                bump!(self);
                expect!(self, "=");

                Ok(AttributeSelectorMatcher {
                    span: span!(self, span.lo),
                    value: AttributeSelectorMatcherValue::Dollar,
                })
            }
            tok!("*") => {
                bump!(self);
                expect!(self, "=");

                Ok(AttributeSelectorMatcher {
                    span: span!(self, span.lo),
                    value: AttributeSelectorMatcherValue::Asterisk,
                })
            }
            tok!("=") => {
                bump!(self);

                Ok(AttributeSelectorMatcher {
                    span: span!(self, span.lo),
                    value: AttributeSelectorMatcherValue::Equals,
                })
            }
            _ => return Err(Error::new(span, ErrorKind::InvalidAttrSelectorMatcher)),
        }
    }
}

impl<I> Parse<AttributeSelectorValue> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<AttributeSelectorValue> {
        match cur!(self) {
            tok!("ident") => {
                let ident = self.parse()?;

                Ok(AttributeSelectorValue::Ident(ident))
            }
            tok!("string") => {
                let string = self.parse()?;

                Ok(AttributeSelectorValue::Str(string))
            }
            _ => {
                let span = self.input.cur_span()?;

                return Err(Error::new(span, ErrorKind::InvalidAttrSelectorMatcherValue));
            }
        }
    }
}

impl<I> Parse<AttributeSelectorModifier> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<AttributeSelectorModifier> {
        let span = self.input.cur_span()?;

        match cur!(self) {
            tok!("ident") => {
                let value = self.parse()?;

                Ok(AttributeSelectorModifier {
                    span: span!(self, span.lo),
                    value,
                })
            }
            _ => return Err(Error::new(span, ErrorKind::InvalidAttrSelectorModifier)),
        }
    }
}

impl<I> Parse<PseudoClassSelector> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<PseudoClassSelector> {
        let span = self.input.cur_span()?;

        expect!(self, ":");

        if is!(self, Function) {
            let fn_span = self.input.cur_span()?;
            let name = bump!(self);
            let names = match name {
                Token::Function { value, raw } => (value, raw),
                _ => unreachable!(),
            };

            let mut children = vec![];

            match &*names.0.to_ascii_lowercase() {
                "nth-child" | "nth-last-child" | "nth-of-type" | "nth-last-of-type" | "nth-col"
                | "nth-last-col" => {
                    let state = self.input.state();
                    let nth = self.parse();

                    match nth {
                        Ok(nth) => children.push(PseudoSelectorChildren::Nth(nth)),
                        Err(_) => {
                            self.input.reset(&state);

                            let any_value = self.parse_any_value()?;
                            let any_value: Vec<PseudoSelectorChildren> = any_value
                                .into_iter()
                                .map(PseudoSelectorChildren::PreservedToken)
                                .collect();

                            children.extend(any_value)
                        }
                    }
                }
                _ => {
                    let any_value = self.parse_any_value()?;
                    let any_value: Vec<PseudoSelectorChildren> = any_value
                        .into_iter()
                        .map(PseudoSelectorChildren::PreservedToken)
                        .collect();

                    children.extend(any_value)
                }
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
            let name = self.parse()?;

            return Ok(PseudoClassSelector {
                span: span!(self, span.lo),
                name,
                children: None,
            });
        }

        let span = self.input.cur_span()?;

        return Err(Error::new(span, ErrorKind::InvalidSelector));
    }
}

impl<I> Parse<PseudoElementSelector> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<PseudoElementSelector> {
        let span = self.input.cur_span()?;

        expect!(self, ":");
        expect!(self, ":");

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
            let name = self.parse()?;

            return Ok(PseudoElementSelector {
                span: span!(self, span.lo),
                name,
                children: None,
            });
        }

        let span = self.input.cur_span()?;

        return Err(Error::new(span, ErrorKind::InvalidSelector));
    }
}

impl<I> Parse<Nth> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Nth> {
        self.input.skip_ws()?;

        let span = self.input.cur_span()?;
        let nth = match cur!(self) {
            //  odd | even
            Token::Ident { value, .. }
            if &(*value).to_ascii_lowercase() == "odd"
                || &(*value).to_ascii_lowercase() == "even" =>
                {
                    let ident = self.parse()?;

                    NthValue::Ident(ident)
                }
            // <integer>
            tok!("number") => {
                let number = match bump!(self) {
                    Token::Number { value, raw, .. } => (value, raw),
                    _ => {
                        unreachable!();
                    }
                };

                NthValue::AnPlusB(AnPlusB {
                    span: span!(self, span.lo),
                    a: None,
                    a_raw: None,
                    b: Some(number.0 as i32),
                    b_raw: Some(number.1),
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
            tok!("ident") | tok!("+") |
            // <n-dimension>
            // <ndashdigit-dimension>
            // <ndash-dimension> <signless-integer>
            // <n-dimension> <signed-integer>
            // <n-dimension> ['+' | '-'] <signless-integer>
            tok!("dimension") => {
                let mut has_plus_sign = false;

                // '+' n
                if let  Token::Delim { value: '+' } = cur!(self){
                    let peeked = self.input.peek()?;

                    if let Some(Token::Ident { .. }) = peeked {
                        bump!(self);
                        has_plus_sign = true;
                    }
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

                        let has_minus_sign = ident_value.starts_with('-');
                        let n_char = if has_minus_sign { ident_value.chars().nth(1) } else { ident_value.chars().next() };

                        if n_char != Some('n') && n_char != Some('N') {
                            return Err(Error::new(
                                span,
                                ErrorKind::Expected("'n' character in Ident"),
                            ));
                        }

                        a = Some(if has_minus_sign { -1 } else {1 });
                        a_raw = Some((if has_plus_sign { "+" } else if has_minus_sign { "-" } else { "" }).into());

                        n_value = if has_minus_sign { ident_value[1..].to_string() } else { ident_value.to_string() };
                    }
                    tok!("dimension") => {
                        let dimension = match bump!(self) {
                            Token::Dimension { value, raw_value, unit, .. } => (value, raw_value, unit),
                            _ => {
                                unreachable!();
                            }
                        };

                        let n_char = dimension.2.chars().next();

                        if n_char != Some('n') && n_char != Some('N') {
                            return Err(Error::new(
                                span,
                                ErrorKind::Expected("'n' character in Ident"),
                            ));
                        }

                        a = Some(dimension.0 as i32);
                        a_raw = Some(dimension.1);

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
                    tok!("number") if dash_after_n == None => {
                        let number = match bump!(self) {
                            Token::Number { value, raw, .. } => (value, raw),
                            _ => {
                                unreachable!();
                            }
                        };

                        b = Some(number.0 as i32);
                        b_raw = Some(number.1);
                    }
                    // -n- <signless-integer>
                    // '+'? n- <signless-integer>
                    // <ndash-dimension> <signless-integer>
                    tok!("number") if dash_after_n == Some('-') => {
                        let number = match bump!(self) {
                            Token::Number { value, raw, .. } => (value, raw),
                            _ => {
                                unreachable!();
                            }
                        };

                        b = Some(-number.0 as i32);

                        let mut b_raw_str = String::new();

                        b_raw_str.push_str("- ");
                        b_raw_str.push_str(&number.1);
                        b_raw = Some(b_raw_str.into());
                    }
                    // '+'? n ['+' | '-'] <signless-integer>
                    // -n ['+' | '-'] <signless-integer>
                    // <n-dimension> ['+' | '-'] <signless-integer>
                    tok!("-") | tok!("+") => {
                        let (b_sign, b_sign_raw) = match bump!(self) {
                            Token::Delim { value, .. } => (if value == '-' { -1 } else { 1 }, value),
                            _ => {
                                unreachable!();
                            }
                        };

                        self.input.skip_ws()?;

                        let number = match bump!(self) {
                            Token::Number { value, raw, .. } => (value, raw),
                            _ => {
                                return Err(Error::new(span, ErrorKind::Expected("Num")));
                            }
                        };

                        b = Some(b_sign * number.0 as i32);

                        let mut b_raw_str = String::new();

                        b_raw_str.push(' ');
                        b_raw_str.push(b_sign_raw);
                        b_raw_str.push(' ');
                        b_raw_str.push_str(&number.1);
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

                        b = Some(-parsed);

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
        //                 selector_list = Some(self.parse()?);
        //             }
        //             _ => {}
        //         }
        //     }
        //     _ => {}
        // }

        Ok(nth)
    }
}
