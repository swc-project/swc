use crate::{
    error::{Error, ErrorKind},
    token::{Token, TokenAndSpan},
};

use super::{input::ParserInput, PResult, Parser};
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

    /// Ported from https://github.com/evanw/esbuild/blob/a9456dfbf08ab50607952eefb85f2418968c124c/internal/css_parser/css_parser_selector.go#L35
    pub(super) fn parse_complex_selector(&mut self) -> PResult<ComplexSelector> {
        let start_pos = self.input.cur_span()?.lo;

        let sel = self.parse_compound_selector()?;

        let mut selectors = vec![sel];

        loop {
            self.input.skip_ws()?;

            if is_one_of!(self, EOF, ",", "{") {
                break;
            }

            let combinator = self.parse_combinator()?;
            if combinator != js_word!("") {
                self.input.skip_ws()?;
            }

            let sel = self.parse_compound_selector();
            match sel {
                Ok(mut sel) => {
                    sel.combinator = combinator;
                    selectors.push(sel);
                }
                Err(_) => todo!(),
            }
        }

        Ok(ComplexSelector {
            span: span!(self, start_pos),
            selectors,
        })
    }

    pub(super) fn parse_combinator(&mut self) -> PResult<JsWord> {
        todo!()
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
                let mut ns_name_name = None;
                let mut ns_name_prefix = None;
                if !peeked_is!(self, "|") {
                    ns_name_name = Some(self.parse_name_token()?);
                } else {
                    ns_name_name = Some(Text {
                        span: Span::new(start_pos, start_pos, Default::default()),
                        value: js_word!(""),
                    })
                    // TODO:
                    // nsName.Name.Kind = css_lexer.TIdent
                }

                if eat!(self, "|") {
                    if !peeked_is!(self, Ident) && !peeked_is!(self, "&") {
                        expect!(self, Ident);
                        return Err(Error::new(span, ErrorKind::InvalidSelector));
                    }

                    ns_name_prefix = ns_name_name.take();
                    ns_name_name = Some(self.parse_name_token()?);
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
                            let is_element = peeked_is!(self, ":");
                            if is_element {
                                bump!(self);
                            }

                            let mut pseudo = self.parse_pseudo_class_selector()?;

                            pseudo.is_element = is_element;
                            subclass_selectors.push(SubclassSelector::PseudoClass(pseudo));
                        }

                        break 'subclass_selectors;
                    }

                    let pseudo = self.parse_pseudo_class_selector()?;

                    subclass_selectors.push(SubclassSelector::PseudoClass(pseudo));
                }

                _ => {
                    break 'subclass_selectors;
                }
            }
        }

        let span = span!(self, start_pos);

        if !has_nest_prefix && type_selector.is_some() && subclass_selectors.len() == 0 {
            return Err(Error::new(span, ErrorKind::InvalidSelector));
        }

        Ok(CompoundSelector {
            span,
            has_nest_prefix,
            combinator: js_word!(""),
            type_selector,
            subclass_selectors,
        })
    }

    fn parse_id_selector(&mut self) -> PResult<IdSelector> {
        let start = self.input.cur_span()?.lo;
        let text = self.parse_selector_text()?;

        Ok(IdSelector {
            span: span!(self, start),
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

    fn parse_pseudo_class_selector(&mut self) -> PResult<PseudoClassSelector> {
        let start = self.input.cur_span()?.lo;

        bump!(self);

        if peeked_is!(self, Function) {
            let name = self.parse_selector_text()?;

            let values = self.parse_any_value()?;
            let args = self.convert_tokens(values)?;

            expect!(self, ")");
            return Ok(PseudoClassSelector {
                span: span!(self, start),
                is_element: false,
                name,
                args,
            });
        }

        let name = self.parse_selector_text()?;

        let name = if eat!(self, Ident) {
            name
        } else {
            Text {
                span: span!(self, start),
                value: js_word!(""),
            }
        };

        Ok(PseudoClassSelector {
            span: span!(self, start),
            is_element: false,
            name,
            args: Default::default(),
        })
    }

    fn parse_attr_selector(&mut self) -> PResult<AttrSelector> {
        let start_pos = self.input.cur_span()?.lo;
        expect!(self, "[");

        let mut ns_name_prefix = None;
        let mut ns_name_name = None;

        match cur!(self) {
            tok!("|") | tok!("*") => {
                // "[|x]"
                // "[*|x]"

                if peeked_is!(self, "*") {
                    ns_name_prefix = self.parse_name_token().map(Some)?;
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

                ns_name_name = self.parse_name_token().map(Some)?;
            }

            _ => {
                // "[x]"
                // "[x|y]"

                ns_name_name = self.parse_name_token().map(Some)?;

                if !peeked_is!(self, "=") && eat!(self, "|") {
                    ns_name_prefix = ns_name_name.take();
                    ns_name_name = self.parse_name_token().map(Some)?;
                }
            }
        }

        self.input.skip_ws()?;

        let mut attr_op = if eat!(self, "=") {
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

        if let Some(op) = attr_op {
            self.input.skip_ws()?;

            if !peeked_is!(self, Str) || peeked_is!(self, Ident) {
                return Err(Error::new(
                    span!(self, start_pos),
                    ErrorKind::ExpectedIdentOrStrForAttrSelectorOp,
                ));
            }

            let _ = cur!(self);

            matcher_value = Some(self.parse_selector_text()?);

            self.input.skip_ws()?;

            if peeked_is!(self, Ident) {
                match self.input.peek()? {
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
            op: attr_op,
            value: matcher_value,
            modifier: matcher_modifier,
        })
    }

    fn parse_any_value(&mut self) -> PResult<Vec<TokenAndSpan>> {
        todo!()
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
}
