use crate::{PResult, Parser};
use swc_css_ast::*;

impl Parser<'_> {
    pub(super) fn parse_style_rule(&mut self) -> PResult<StyleRule> {
        trace_cur!(self, parse_style_rule);

        let start = self.i.cur_pos();
        let selectors = self.parse_selectors()?;

        let block = self.parse_decl_block()?;

        Ok(StyleRule {
            span: self.i.make_span(start),
            selectors,
            block,
        })
    }

    pub(super) fn parse_decl_block(&mut self) -> PResult<DeclBlock> {
        trace_cur!(self, parse_decl_block);

        let start = self.i.cur_pos();
        expect!(self, "{");
        let mut properties = vec![];

        while let Some(token) = self.i.cur() {
            if token == tok!("}") {
                break;
            }

            let p = self.parse_property()?;
            properties.push(p);
            if !eat!(self, ";") && !is!(self, "}") {
                break;
            }
        }

        expect!(self, "}");

        Ok(DeclBlock {
            span: self.i.make_span(start),
            properties,
        })
    }

    pub(super) fn parse_property(&mut self) -> PResult<Property> {
        trace_cur!(self, parse_property);

        let start = self.i.cur_pos();

        let name = self.parse_word()?;
        expect!(self, ":");
        let value = self.parse_value()?;

        let important = if is!(self, "!important") {
            let span = self.i.span();
            self.i.bump();
            Some(span)
        } else {
            None
        };

        Ok(Property {
            span: self.i.make_span(start),
            name,
            value,
            important,
        })
    }
}
