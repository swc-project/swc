use crate::{token::Token, PResult, Parser};
use swc_css_ast::*;

impl Parser<'_> {
    pub(super) fn parse_selectors(&mut self) -> PResult<Vec<Box<Selector>>> {
        let mut selectors = vec![];

        loop {
            let selector = self.parse_selector()?;
            selectors.push(selector);

            if is_one_of!(self, ".", "#", "[", "*") || self.is_word() {
                continue;
            }

            if !eat!(self, ",") {
                break;
            }
        }

        Ok(selectors)
    }

    pub(super) fn parse_selector(&mut self) -> PResult<Box<Selector>> {
        trace_cur!(self, parse_selector);

        let start = self.i.cur_pos();
        let components = vec![];

        loop {
            let sel = self
                .parse_compound_selector()
                .map(SelectorComponent::Compound)?;

            components.push(sel);

            if is_one_of!(self, ">", "+", "~") {
                components.push(
                    self.parse_selector_combinator()
                        .map(SelectorComponent::Combinator)?,
                );
                continue;
            }

            break;
        }

        Ok(Box::new(Selector {
            span: self.i.make_span(start),
            components,
        }))
    }

    fn parse_compound_selector(&mut self) -> PResult<CompoundSelector> {
        trace_cur!(self, parse_compound_selector);

        let start = self.i.cur_pos();
        let mut selectors = vec![];

        loop {
            let selector = self.parse_simple_selector()?;

            selectors.push(selector);

            if !is_one_of!(self, ".", "#", "[", "*", ":") && !self.is_word() {
                break;
            }
        }

        Ok(CompoundSelector {
            span: self.i.make_span(start),
            selectors,
        })
    }

    fn parse_selector_combinator(&mut self) -> PResult<CombinatorSelector> {
        let span = self.i.span();
        let combinator = if eat!(self, ">") {
            Combinator::Child
        } else if eat!(self, "+") {
            Combinator::NextSibling
        } else if eat!(self, "~") {
            Combinator::FollowingSibling
        } else {
            expected_one_of!(self, ">", "+", "~")
        };

        Ok(CombinatorSelector { span, combinator })
    }

    fn parse_simple_selector(&mut self) -> PResult<SimpleSelector> {
        trace_cur!(self, parse_simple_selector);

        match cur!(self) {
            tok!("*") => self
                .parse_universal_selector()
                .map(SimpleSelector::Universal),
            tok!(":") => self.parse_pseudo_selector().map(SimpleSelector::Pseudo),

            tok!("#") => self.parse_id_selector().map(SimpleSelector::Id),
            tok!(".") => self.parse_class_selector().map(SimpleSelector::Class),
            tok!("[") => self
                .parse_attribute_selector()
                .map(SimpleSelector::Attribute),
            _ => self.parse_tag_selector().map(SimpleSelector::Tag),
        }
    }

    fn parse_universal_selector(&mut self) -> PResult<UniversalSelector> {
        trace_cur!(self, parse_universal_selector);
        debug_assert_eq!(self.i.cur(), Some(tok!("*")));
        let span = self.i.span();
        self.i.bump(); // '*'

        Ok(UniversalSelector { span })
    }

    fn parse_id_selector(&mut self) -> PResult<IdSelector> {
        trace_cur!(self, parse_id_selector);
        debug_assert_eq!(self.i.cur(), Some(tok!("#")));
        let start = self.i.cur_pos();
        self.i.bump(); // '#'

        let text = self.parse_word()?;

        Ok(IdSelector {
            span: self.i.make_span(start),
            text,
        })
    }

    fn parse_class_selector(&mut self) -> PResult<ClassSelector> {
        trace_cur!(self, parse_class_selector);

        let start = self.i.cur_pos();
        debug_assert_eq!(self.i.cur(), Some(tok!(".")));
        self.i.bump(); // '.'

        let text = self.parse_word()?;

        Ok(ClassSelector {
            span: self.i.make_span(start),
            text,
        })
    }

    fn parse_tag_selector(&mut self) -> PResult<TagSelector> {
        trace_cur!(self, parse_tag_selector);

        let start = self.i.cur_pos();
        let text = self.parse_word()?;

        Ok(TagSelector {
            span: self.i.make_span(start),
            text,
        })
    }

    fn parse_attribute_selector(&mut self) -> PResult<AttributeSelector> {
        trace_cur!(self, parse_attribute_selector);
        debug_assert_eq!(self.i.cur(), Some(tok!("[")));
        let start = self.i.cur_pos();
        self.i.bump(); // '['

        let name = self.parse_word()?;

        let op = self.parse_attribute_selector_op()?;
        let value = if op == AttributeOp::Any {
            None
        } else {
            self.parse_word().map(Some)?
        };
        expect!(self, "]");

        Ok(AttributeSelector {
            span: self.i.make_span(start),
            attr: name,
            value,
            // TODO: Fix this
            modifier: None,
            op,
        })
    }

    fn parse_attribute_selector_op(&mut self) -> PResult<AttributeOp> {
        let op = match cur!(self) {
            tok!("]") => return Ok(AttributeOp::Any),
            tok!("=") => AttributeOp::Equals,
            tok!("~=") => AttributeOp::Include,
            tok!("|=") => AttributeOp::Dash,
            tok!("^=") => AttributeOp::Prefix,
            tok!("$=") => AttributeOp::Suffix,
            tok!("*=") => AttributeOp::Contains,
            _ => expected_one_of!(self, "]", "=", "~=", "|=", "^=", "$=", "*="),
        };

        self.i.bump();
        Ok(op)
    }

    fn parse_pseudo_selector(&mut self) -> PResult<PseudoSelector> {
        debug_assert_eq!(self.i.cur(), Some(tok!(":")));
        let start = self.i.cur_pos();
        self.i.bump(); // ':'

        // TODO: Check for difference
        let _ = eat!(self, ":");

        let name = self.parse_word()?;

        let arguments = if is!(self, "(") {
            Some(self.parse_pseudo_selector_args()?)
        } else {
            None
        };

        Ok(PseudoSelector {
            span: self.i.make_span(start),
            name,
            // TODO
            is_class: false,
            // TODO
            is_syntactic_class: false,
            arguments,
            // TODO
            selector: None,
        })
    }

    fn parse_pseudo_selector_args(&mut self) -> PResult<Vec<Text>> {
        debug_assert_eq!(self.i.cur(), Some(tok!("(")));
        self.i.bump(); // '('

        let mut args = vec![];

        loop {
            if eat!(self, ")") {
                break;
            }
            if self.is_word() {
                args.push(self.parse_word()?);
                if is!(self, ")") {
                    continue;
                }
                expect!(self, ",");
                continue;
            }

            unimplemented!("parse_pseudo_selector_args")
        }

        Ok(args)
    }
}
