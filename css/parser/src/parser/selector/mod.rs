use super::{input::ParserInput, PResult, Parser};
use crate::{
    error::{Error, ErrorKind},
    Parse,
};
use swc_atoms::js_word;
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

    /// Ported from `parseComplexSelector` of `esbuild`.
    pub(super) fn parse_complex_selector(&mut self) -> PResult<ComplexSelector> {
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

    pub(super) fn parse_combinator(&mut self) -> PResult<Option<SelectorCombinator>> {
        if eat!(self, " ") {
            return Ok(Some(SelectorCombinator::Descendant));
        }

        if eat!(self, "+") {
            return Ok(Some(SelectorCombinator::NextSibling));
        }

        if eat!(self, ">") {
            return Ok(Some(SelectorCombinator::Child));
        }

        if eat!(self, "~") {
            return Ok(Some(SelectorCombinator::LaterSibling));
        }

        Ok(None)
    }

    fn parse_name_token(&mut self) -> PResult<Text> {
        let span = self.input.cur_span()?;
        match cur!(self) {
            Token::Ident(..) => {
                let token = bump!(self);

                match token {
                    Token::Ident(value) => return Ok(Text { span, value }),
                    _ => {
                        unreachable!()
                    }
                }
            }
            _ => Err(Error::new(span, ErrorKind::Expected("Text"))),
        }
    }

    pub(super) fn parse_compound_selector(&mut self) -> PResult<CompoundSelector> {
        self.input.skip_ws()?;

        let span = self.input.cur_span()?;
        let start_pos = span.lo;

        let mut has_nest_prefix = false;

        // This is an extension: https://drafts.csswg.org/css-nesting-1/
        if eat!(self, "&") {
            has_nest_prefix = true;
        }

        let mut type_selector = None;

        match cur!(self) {
            tok!("|") | Token::Ident(..) | tok!("*") => {
                let mut ns_name_name;
                let mut ns_name_prefix = None;

                if !is!(self, "|") {
                    // No namespace prefix.

                    if eat!(self, "*") {
                        ns_name_name = Some(Text {
                            span,
                            value: "*".into(),
                        });
                    } else {
                        ns_name_name = Some(self.parse_name_token()?);
                    }
                } else {
                    // e.g.
                    // `|*`
                    // `|b`

                    ns_name_name = Some(Text {
                        span: Span::new(start_pos, start_pos, Default::default()),
                        value: js_word!(""),
                    });
                    // TODO:
                    // nsName.Name.Kind = css_lexer.TIdent
                }

                if eat!(self, "|") {
                    if !is!(self, Ident) && !is!(self, "*") {
                        expect!(self, Ident);
                        return Err(Error::new(span, ErrorKind::InvalidTypeSelector));
                    }

                    ns_name_prefix = ns_name_name.take();
                    if eat!(self, "*") {
                        ns_name_name = Some(Text {
                            span,
                            value: "*".into(),
                        });
                    } else {
                        ns_name_name = Some(self.parse_name_token()?);
                    }
                }

                type_selector = Some(NamespacedName {
                    span: span!(self, start_pos),
                    prefix: ns_name_prefix,
                    name: ns_name_name.unwrap(),
                });
            }

            _ => {}
        }

        let mut subclass_selectors = vec![];

        'subclass_selectors: loop {
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
                    let attr = self.parse_attr_selector()?;

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

                Token::AtKeyword(..) if self.ctx.allow_at_selctor => {
                    let name = match bump!(self) {
                        Token::AtKeyword(kwd) => kwd,
                        _ => {
                            unreachable!()
                        }
                    };

                    subclass_selectors.push(SubclassSelector::At(AtSelector {
                        span,
                        text: Text { span, value: name },
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

    fn parse_id_selector(&mut self) -> PResult<IdSelector> {
        let span = self.input.cur_span()?;

        let text = match bump!(self) {
            Token::Hash { value, .. } => Text { span, value },
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
        assert_eq!(*cur!(self), tok!("."));
        bump!(self);

        let text = self.parse_selector_text()?;

        Ok(ClassSelector {
            span: span!(self, start),
            text,
        })
    }

    fn parse_pseudo_class_selector(&mut self) -> PResult<PseudoSelector> {
        let start = self.input.cur_span()?.lo;

        expect!(self, ":"); // `:`

        self.input.skip_ws()?;

        if is!(self, Ident) && peeked_is!(self, "(") {
            let name = self.parse_selector_text()?;

            expect!(self, "(");

            let args = self.parse_any_value(false)?;

            expect!(self, ")");

            return Ok(PseudoSelector {
                span: span!(self, start),
                is_element: false,
                name,
                args,
            });
        }

        let name_start = self.input.cur_span()?.lo;

        let name = if is!(self, Ident) {
            self.parse_selector_text()?
        } else {
            Text {
                span: span!(self, name_start),
                value: js_word!(""),
            }
        };

        Ok(PseudoSelector {
            span: span!(self, start),
            is_element: false,
            name,
            args: Default::default(),
        })
    }

    fn parse_attr_selector(&mut self) -> PResult<AttrSelector> {
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
                    ns_name_prefix = Some(Text {
                        span: span!(self, name_start_pos),
                        value: "*".into(),
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
                    Some(Token::Ident(s)) => {
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

    fn parse_selector_text(&mut self) -> PResult<Text> {
        let span = self.input.cur_span()?;

        match cur!(self) {
            Token::Ident { .. } => {}
            _ => Err(Error::new(span, ErrorKind::ExpectedSelectorText))?,
        }

        let value = bump!(self);
        let value = match value {
            Token::Ident(value) => value,
            _ => unreachable!(),
        };

        Ok(Text { span, value })
    }

    fn parse_id_or_str_for_attr(&mut self) -> PResult<Str> {
        let span = self.input.cur_span()?;

        match cur!(self) {
            Token::Ident { .. } => {
                let value = bump!(self);
                let value = match value {
                    Token::Ident(value) => value,
                    _ => unreachable!(),
                };

                Ok(Str { span, value })
            }
            Token::Str { .. } => {
                let value = bump!(self);
                let value = match value {
                    Token::Str { value } => value,
                    _ => unreachable!(),
                };

                Ok(Str { span, value })
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
