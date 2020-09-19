use crate::{PResult, Parser};
use swc_css_ast::*;

impl Parser<'_> {
    pub(super) fn parse_selectors(&mut self) -> PResult<Vec<Box<Selector>>> {
        let mut selectors = vec![];

        loop {
            let selector = self.parse_selector()?;
            selectors.push(selector);

            if !eat!(self, ",") {
                break;
            }
        }

        Ok(selectors)
    }

    pub(super) fn parse_selector(&mut self) -> PResult<Box<Selector>> {
        trace_cur!(self, parse_selector);

        let start = self.i.cur_pos();
        let first = self.parse_compound_selector()?;
        let components = vec![SelectorComponent::Compound(first)];

        if is!(self, ">") {
            unimplemented!("Parsing of '>' in selector")
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

            if !is_one_of!(self, ".", "#", "[", "*") && !self.is_word() {
                break;
            }
        }

        Ok(CompoundSelector {
            span: self.i.make_span(start),
            selectors,
        })
    }

    fn parse_simple_selector(&mut self) -> PResult<SimpleSelector> {
        trace_cur!(self, parse_simple_selector);

        match cur!(self) {
            tok!("*") => self
                .parse_universal_selector()
                .map(SimpleSelector::Universal),
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

        unimplemented!("parse_universal_selector")
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

        let op = self.parse_attribute_selector_operator()?;
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

    fn parse_attribute_selector_operator(&mut self) -> PResult<AttributeOp> {
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
}
