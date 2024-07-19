use swc_atoms::Atom;
use swc_common::{BytePos, Span, Spanned};
use swc_css_ast::*;

use super::{input::ParserInput, PResult, Parser};
use crate::{
    error::{Error, ErrorKind},
    parser::Ctx,
    Parse,
};

impl<I> Parse<SelectorList> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<SelectorList> {
        let child: ComplexSelector = self.parse()?;
        let mut children = vec![child];

        loop {
            self.input.skip_ws();

            if !eat!(self, ",") {
                break;
            }

            self.input.skip_ws();

            let child = self.parse()?;

            children.push(child);
        }

        let start_pos = match children.first() {
            Some(first) => first.span_lo(),
            _ => {
                unreachable!();
            }
        };
        let last_pos = match children.last() {
            Some(last) => last.span_hi(),
            _ => {
                unreachable!();
            }
        };

        Ok(SelectorList {
            span: Span::new(start_pos, last_pos),
            children,
        })
    }
}

impl<I> Parse<ForgivingSelectorList> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ForgivingSelectorList> {
        let parse_forgiving_complex_selector =
            |parser: &mut Parser<I>| -> PResult<ForgivingComplexSelector> {
                let state = parser.input.state();

                parser.input.skip_ws();

                match parser.parse() {
                    Ok(child) => Ok(ForgivingComplexSelector::ComplexSelector(child)),
                    Err(_) => {
                        parser.input.reset(&state);

                        let span = parser.input.cur_span();
                        let mut children = Vec::new();

                        while !is_one_of!(parser, EOF, ",", ")") {
                            if let Some(token_and_span) = parser.input.bump() {
                                children
                                    .push(ComponentValue::PreservedToken(Box::new(token_and_span)));
                            }
                        }

                        Ok(ForgivingComplexSelector::ListOfComponentValues(
                            ListOfComponentValues {
                                span: span!(parser, span.lo),
                                children,
                            },
                        ))
                    }
                }
            };

        let child = parse_forgiving_complex_selector(self)?;
        let mut children = vec![child];

        loop {
            self.input.skip_ws();

            if !eat!(self, ",") {
                break;
            }

            let child = parse_forgiving_complex_selector(self)?;

            children.push(child);
        }

        let start_pos = match children.first() {
            Some(first) => first.span_lo(),
            _ => {
                unreachable!();
            }
        };
        let last_pos = match children.last() {
            Some(last) => last.span_hi(),
            _ => {
                unreachable!();
            }
        };

        Ok(ForgivingSelectorList {
            span: Span::new(start_pos, last_pos),
            children,
        })
    }
}

impl<I> Parse<CompoundSelectorList> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<CompoundSelectorList> {
        let child: CompoundSelector = self.parse()?;
        let mut children = vec![child];

        loop {
            self.input.skip_ws();

            if !eat!(self, ",") {
                break;
            }

            self.input.skip_ws();

            let child = self.parse()?;

            children.push(child);
        }

        let start_pos = match children.first() {
            Some(first) => first.span_lo(),
            _ => {
                unreachable!();
            }
        };
        let last_pos = match children.last() {
            Some(last) => last.span_hi(),
            _ => {
                unreachable!();
            }
        };

        Ok(CompoundSelectorList {
            span: Span::new(start_pos, last_pos),
            children,
        })
    }
}

impl<I> Parse<RelativeSelectorList> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<RelativeSelectorList> {
        let child: RelativeSelector = self.parse()?;
        let mut children = vec![child];

        loop {
            self.input.skip_ws();

            if !eat!(self, ",") {
                break;
            }

            self.input.skip_ws();

            let child = self.parse()?;

            children.push(child);
        }

        let start_pos = match children.first() {
            Some(first) => first.span_lo(),
            _ => {
                unreachable!();
            }
        };
        let last_pos = match children.last() {
            Some(last) => last.span_hi(),
            _ => {
                unreachable!();
            }
        };

        Ok(RelativeSelectorList {
            span: Span::new(start_pos, last_pos),
            children,
        })
    }
}

impl<I> Parse<ForgivingRelativeSelectorList> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<ForgivingRelativeSelectorList> {
        let parse_forgiving_relative_selector =
            |parser: &mut Parser<I>| -> PResult<ForgivingRelativeSelector> {
                let state = parser.input.state();

                parser.input.skip_ws();

                match parser.parse() {
                    Ok(child) => Ok(ForgivingRelativeSelector::RelativeSelector(child)),
                    Err(_) => {
                        parser.input.reset(&state);

                        let span = parser.input.cur_span();
                        let mut children = Vec::new();

                        while !is_one_of!(parser, EOF, ",", ")") {
                            if let Some(token_and_span) = parser.input.bump() {
                                children
                                    .push(ComponentValue::PreservedToken(Box::new(token_and_span)));
                            }
                        }

                        Ok(ForgivingRelativeSelector::ListOfComponentValues(
                            ListOfComponentValues {
                                span: span!(parser, span.lo),
                                children,
                            },
                        ))
                    }
                }
            };

        let child = parse_forgiving_relative_selector(self)?;
        let mut children = vec![child];

        loop {
            self.input.skip_ws();

            if !eat!(self, ",") {
                break;
            }

            let child = parse_forgiving_relative_selector(self)?;

            children.push(child);
        }

        let start_pos = match children.first() {
            Some(first) => first.span_lo(),
            _ => {
                unreachable!();
            }
        };
        let last_pos = match children.last() {
            Some(last) => last.span_hi(),
            _ => {
                unreachable!();
            }
        };

        Ok(ForgivingRelativeSelectorList {
            span: Span::new(start_pos, last_pos),
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
            let span = self.input.cur_span();

            self.input.skip_ws();

            // TODO should be refactor after grammar parsing
            if is_one_of!(self, EOF, ",", ")") {
                break;
            }

            let mut combinator: Combinator = self.parse()?;

            if combinator.value == CombinatorValue::Descendant {
                combinator.span = span;
            } else {
                self.input.skip_ws();
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
            span: Span::new(start_pos, last_pos),
            children,
        })
    }
}

impl<I> Parse<Combinator> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Combinator> {
        let span = self.input.cur_span();

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

impl<I> Parse<RelativeSelector> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<RelativeSelector> {
        let mut combinator = None;

        if is_one_of!(self, ">", "+", "~", "|") {
            combinator = Some(self.parse()?);

            self.input.skip_ws();
        }

        let selector: ComplexSelector = self.parse()?;
        let start_pos = match combinator {
            Some(Combinator { span, .. }) => span.lo,
            _ => selector.span.lo,
        };
        let last_pos = selector.span.hi;

        Ok(RelativeSelector {
            span: Span::new(start_pos, last_pos),
            combinator,
            selector,
        })
    }
}

impl<I> Parse<CompoundSelector> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<CompoundSelector> {
        let start_span = self.input.cur_span();
        let start_pos = start_span.lo;

        let mut nesting_selector = None;

        // TODO: move under option, because it is draft
        // TODO validate list of selector, each should start with `&`
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
        let mut subclass_selectors = Vec::new();

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

        if !self.ctx.in_global_or_local_selector
            && nesting_selector.is_none()
            && type_selector.is_none()
            && subclass_selectors.is_empty()
        {
            return Err(Error::new(start_span, ErrorKind::InvalidSelector));
        }

        let span = span!(self, start_pos);

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
        let span = self.input.cur_span();
        let mut prefix = None;

        if is!(self, Ident) && peeked_is!(self, "|")
            || is!(self, "*") && peeked_is!(self, "|")
            || is!(self, "|")
        {
            prefix = Some(self.parse()?);
        }

        match cur!(self) {
            tok!("ident") => {
                let value: Ident = self.parse()?;

                return Ok(TypeSelector::TagName(TagNameSelector {
                    span: span!(self, span.lo),
                    name: WqName {
                        span: span!(self, span.lo),
                        prefix,
                        value,
                    },
                }));
            }
            tok!("*") => {
                bump!(self);

                return Ok(TypeSelector::Universal(UniversalSelector {
                    span: span!(self, span.lo),
                    prefix,
                }));
            }
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("ident, '*' or '|' delim tokens"),
                ));
            }
        }
    }
}

impl<I> Parse<NamespacePrefix> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<NamespacePrefix> {
        let span = self.input.cur_span();

        let mut namespace = None;

        match cur!(self) {
            Token::Ident { .. } => {
                let name = self.parse()?;

                namespace = Some(Namespace::Named(NamedNamespace {
                    span: span!(self, span.lo),
                    name,
                }));
            }
            Token::Delim { value, .. } if *value == '*' => {
                bump!(self);

                namespace = Some(Namespace::Any(AnyNamespace {
                    span: span!(self, span.lo),
                }));
            }
            _ => {}
        }

        expect!(self, "|");

        Ok(NamespacePrefix {
            span: span!(self, span.lo),
            namespace,
        })
    }
}

impl<I> Parse<WqName> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<WqName> {
        let span = self.input.cur_span();
        let state = self.input.state();
        let mut prefix = None;

        if is!(self, Ident) && peeked_is!(self, "|")
            || is!(self, "*") && peeked_is!(self, "|")
            || is!(self, "|")
        {
            prefix = Some(self.parse()?);
        }

        // To avoid confusing syntax in attribute selectors:
        //
        // - [foo|="foo"]
        // - [foo|*="foo"]
        if !is!(self, Ident) {
            prefix = None;

            self.input.reset(&state);
        }

        let value = self.parse()?;

        Ok(WqName {
            span: span!(self, span.lo),
            prefix,
            value,
        })
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
                let span = self.input.cur_span();

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
        let span = self.input.cur_span();
        let text = match bump!(self) {
            Token::Hash {
                is_id, value, raw, ..
            } => {
                if !is_id {
                    return Err(Error::new(
                        span,
                        ErrorKind::Unexpected("characters in ID selector"),
                    ));
                }

                Ident {
                    span,
                    value,
                    raw: Some(raw),
                }
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
        let span = self.input.cur_span();

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
        let span = self.input.cur_span();

        expect!(self, "[");

        self.input.skip_ws();

        let mut matcher = None;
        let mut value = None;
        let mut modifier = None;

        let name = if let Ok(wq_name) = self.parse() {
            wq_name
        } else {
            let span = self.input.cur_span();

            return Err(Error::new(
                span!(self, span.lo),
                ErrorKind::InvalidAttrSelectorName,
            ));
        };

        self.input.skip_ws();

        if !is!(self, "]") {
            matcher = Some(self.parse()?);

            self.input.skip_ws();

            value = Some(self.parse()?);

            self.input.skip_ws();

            if is!(self, Ident) {
                modifier = Some(self.parse()?);
            }

            self.input.skip_ws();
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
        let span = self.input.cur_span();

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
                let span = self.input.cur_span();

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
        let span = self.input.cur_span();

        match cur!(self) {
            tok!("ident") => {
                let value: Ident = self.parse()?;

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
        let span = self.input.cur_span();

        expect!(self, ":");

        if is!(self, Function) {
            let fn_span = self.input.cur_span();
            let name = bump!(self);
            let names: (Atom, _) = match name {
                Token::Function { value, raw } => (value.to_ascii_lowercase(), raw),
                _ => unreachable!(),
            };
            let state = self.input.state();
            let mut parse_pseudo_class_children =
                || -> PResult<Vec<PseudoClassSelectorChildren>> {
                    let mut children = Vec::new();

                    match &*names.0 {
                        "local" | "global" if self.config.css_modules => {
                            self.input.skip_ws();

                            let ctx = Ctx {
                                in_global_or_local_selector: true,
                                ..self.ctx
                            };
                            let selector_list = self.with_ctx(ctx).parse_as::<ComplexSelector>()?;

                            self.input.skip_ws();

                            children
                                .push(PseudoClassSelectorChildren::ComplexSelector(selector_list));
                        }
                        "-moz-any" | "-webkit-any" => {
                            self.input.skip_ws();

                            let compound_selector_list = self.parse()?;

                            self.input.skip_ws();

                            children.push(PseudoClassSelectorChildren::CompoundSelectorList(
                                compound_selector_list,
                            ));
                        }
                        "dir" => {
                            self.input.skip_ws();

                            let ident: Ident = self.parse()?;

                            self.input.skip_ws();

                            children.push(PseudoClassSelectorChildren::Ident(ident));
                        }
                        "lang" => {
                            self.input.skip_ws();

                            let child = match cur!(self) {
                                tok!("ident") => PseudoClassSelectorChildren::Ident(self.parse()?),
                                tok!("string") => PseudoClassSelectorChildren::Str(self.parse()?),
                                _ => {
                                    return Err(Error::new(
                                        span,
                                        ErrorKind::Expected("ident or str tokens"),
                                    ));
                                }
                            };

                            children.push(child);

                            loop {
                                self.input.skip_ws();

                                if is!(self, ",") {
                                    children.push(PseudoClassSelectorChildren::Delimiter(
                                        self.parse()?,
                                    ));

                                    self.input.skip_ws();
                                } else {
                                    break;
                                }

                                let child = match cur!(self) {
                                    tok!("ident") => {
                                        PseudoClassSelectorChildren::Ident(self.parse()?)
                                    }
                                    tok!("string") => {
                                        PseudoClassSelectorChildren::Str(self.parse()?)
                                    }
                                    _ => {
                                        return Err(Error::new(
                                            span,
                                            ErrorKind::Expected("ident or str tokens"),
                                        ));
                                    }
                                };

                                children.push(child);
                            }
                        }
                        "current" | "past" | "future" => {
                            self.input.skip_ws();

                            let compound_selector_list = self.parse()?;

                            self.input.skip_ws();

                            children.push(PseudoClassSelectorChildren::CompoundSelectorList(
                                compound_selector_list,
                            ));
                        }
                        "not" | "matches" => {
                            self.input.skip_ws();

                            let selector_list = self.parse()?;

                            self.input.skip_ws();

                            children.push(PseudoClassSelectorChildren::SelectorList(selector_list));
                        }
                        "is" | "where" => {
                            let forgiving_selector_list = self.parse()?;

                            children.push(PseudoClassSelectorChildren::ForgivingSelectorList(
                                forgiving_selector_list,
                            ));
                        }
                        "has" => {
                            let forgiving_relative_selector_list = self.parse()?;

                            children.push(
                                PseudoClassSelectorChildren::ForgivingRelativeSelectorList(
                                    forgiving_relative_selector_list,
                                ),
                            );
                        }
                        "nth-child" | "nth-last-child" | "nth-of-type" | "nth-last-of-type"
                        | "nth-col" | "nth-last-col" => {
                            self.input.skip_ws();

                            let an_plus_b = self.parse()?;

                            children.push(PseudoClassSelectorChildren::AnPlusB(an_plus_b));

                            self.input.skip_ws();

                            if is!(self, "ident") {
                                let of: Ident = self.parse()?;

                                children.push(PseudoClassSelectorChildren::Ident(of));

                                self.input.skip_ws();

                                let selector_list = self.parse()?;

                                self.input.skip_ws();

                                children
                                    .push(PseudoClassSelectorChildren::SelectorList(selector_list));
                            }
                        }
                        "host" | "host-context" => {
                            self.input.skip_ws();

                            let compound_selector = self.parse()?;

                            self.input.skip_ws();

                            children.push(PseudoClassSelectorChildren::CompoundSelector(
                                compound_selector,
                            ));
                        }
                        _ => {
                            return Err(Error::new(span, ErrorKind::Ignore));
                        }
                    };

                    Ok(children)
                };
            let children = match parse_pseudo_class_children() {
                Ok(children) => children,
                Err(err) => {
                    if *err.kind() != ErrorKind::Ignore {
                        self.errors.push(err);
                    }

                    self.input.reset(&state);

                    let any_value = self.parse_any_value()?;
                    let any_value: Vec<PseudoClassSelectorChildren> = any_value
                        .into_iter()
                        .map(PseudoClassSelectorChildren::PreservedToken)
                        .collect();

                    any_value
                }
            };

            expect!(self, ")");

            Ok(PseudoClassSelector {
                span: span!(self, span.lo),
                name: Ident {
                    span: Span::new(fn_span.lo, fn_span.hi - BytePos(1)),
                    value: names.0,
                    raw: Some(names.1),
                },
                children: Some(children),
            })
        } else if is!(self, Ident) {
            let name: Ident = self.parse()?;

            Ok(PseudoClassSelector {
                span: span!(self, span.lo),
                name,
                children: None,
            })
        } else {
            let span = self.input.cur_span();

            Err(Error::new(
                span,
                ErrorKind::Expected("function or ident tokens"),
            ))
        }
    }
}

impl<I> Parse<PseudoElementSelector> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<PseudoElementSelector> {
        let span = self.input.cur_span();

        expect!(self, ":");
        expect!(self, ":");

        if is!(self, Function) {
            let fn_span = self.input.cur_span();
            let name = bump!(self);
            let names: (Atom, _) = match name {
                Token::Function { value, raw } => (value.to_ascii_lowercase(), raw),
                _ => unreachable!(),
            };

            let state = self.input.state();
            let mut parse_pseudo_element_children =
                || -> PResult<Vec<PseudoElementSelectorChildren>> {
                    let mut children = Vec::new();

                    match &*names.0 {
                        "cue" | "cue-region" => {
                            self.input.skip_ws();

                            let compound_selector = self.parse()?;

                            children.push(PseudoElementSelectorChildren::CompoundSelector(
                                compound_selector,
                            ));

                            self.input.skip_ws();
                        }
                        "part" => {
                            self.input.skip_ws();

                            let ident = self.parse()?;

                            children.push(PseudoElementSelectorChildren::Ident(ident));

                            self.input.skip_ws();
                        }
                        "slotted" => {
                            self.input.skip_ws();

                            let compound_selector = self.parse()?;

                            children.push(PseudoElementSelectorChildren::CompoundSelector(
                                compound_selector,
                            ));

                            self.input.skip_ws();
                        }
                        "highlight" => {
                            self.input.skip_ws();

                            let custom_highlight_name = self.parse()?;

                            children.push(PseudoElementSelectorChildren::CustomHighlightName(
                                custom_highlight_name,
                            ));

                            self.input.skip_ws();
                        }
                        _ => {
                            return Err(Error::new(span, ErrorKind::Ignore));
                        }
                    };

                    Ok(children)
                };
            let children = match parse_pseudo_element_children() {
                Ok(children) => children,
                Err(err) => {
                    if *err.kind() != ErrorKind::Ignore {
                        self.errors.push(err);
                    }

                    self.input.reset(&state);

                    let any_value = self.parse_any_value()?;
                    let any_value: Vec<PseudoElementSelectorChildren> = any_value
                        .into_iter()
                        .map(PseudoElementSelectorChildren::PreservedToken)
                        .collect();

                    any_value
                }
            };

            expect!(self, ")");

            Ok(PseudoElementSelector {
                span: span!(self, span.lo),
                name: Ident {
                    span: Span::new(fn_span.lo, fn_span.hi - BytePos(1)),
                    value: names.0,
                    raw: Some(names.1),
                },
                children: Some(children),
            })
        } else if is!(self, Ident) {
            let name: Ident = self.parse()?;

            Ok(PseudoElementSelector {
                span: span!(self, span.lo),
                name,
                children: None,
            })
        } else {
            let span = self.input.cur_span();

            Err(Error::new(span, ErrorKind::InvalidSelector))
        }
    }
}

impl<I> Parse<AnPlusB> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<AnPlusB> {
        let span = self.input.cur_span();

        match cur!(self) {
            //  odd | even
            Token::Ident { value, .. }
                if matches_eq_ignore_ascii_case!(value, "odd", "even") =>
                {
                    let ident: Ident = self.parse()?;


                    Ok(AnPlusB::Ident(ident))
                }
            // <integer>
            tok!("number") => {
                let number = match bump!(self) {
                    Token::Number { value, raw, .. } => (value, raw),
                    _ => {
                        unreachable!();
                    }
                };

                Ok(AnPlusB::AnPlusBNotation(AnPlusBNotation {
                    span: span!(self, span.lo),
                    a: None,
                    a_raw: None,
                    b: Some(number.0 as i32),
                    b_raw: Some(number.1),
                }))
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
                    let peeked = self.input.peek();

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
                        a_raw = Some(self.input.atom(if has_plus_sign { "+" } else if has_minus_sign { "-" } else { "" }));

                        n_value = if has_minus_sign { ident_value[1..].to_string() } else { ident_value.to_string() };
                    }
                    tok!("dimension") => {
                        let dimension = match bump!(self) {
                            Token::Dimension(dimension) => {
                                let DimensionToken { value, raw_value, unit, .. } = *dimension;

                             (value, raw_value, unit)
                            }
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

                self.input.skip_ws();

                let mut b = None;
                let mut b_raw = None;

                let dash_after_n = n_value.chars().nth(1);

                match cur!(self) {
                    // '+'? n <signed-integer>
                    // -n <signed-integer>
                    // <n-dimension> <signed-integer>
                    tok!("number") if dash_after_n.is_none() => {
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
                        b_raw = Some(self.input.atom(b_raw_str));
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

                        self.input.skip_ws();

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
                        b_raw = Some(self.input.atom(b_raw_str));
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

                        b_raw = Some(self.input.atom(b_raw_str));
                    }
                    // '+'? n
                    // -n
                    _ if dash_after_n.is_none() => {}
                    _ => {
                        return Err(Error::new(span, ErrorKind::InvalidAnPlusBMicrosyntax));
                    }
                }

                Ok(AnPlusB::AnPlusBNotation(AnPlusBNotation {
                    span: span!(self, span.lo),
                    a,
                    a_raw,
                    b,
                    b_raw,
                }))
            }
            _ => {
                return Err(Error::new(span, ErrorKind::InvalidAnPlusBMicrosyntax));
            }
        }
    }
}

impl<I> Parse<CustomHighlightName> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<CustomHighlightName> {
        let span = self.input.cur_span();

        if !is!(self, Ident) {
            return Err(Error::new(span, ErrorKind::Expected("ident token")));
        }

        match bump!(self) {
            Token::Ident { value, raw, .. } => Ok(CustomHighlightName {
                span,
                value,
                raw: Some(raw),
            }),
            _ => {
                unreachable!()
            }
        }
    }
}
