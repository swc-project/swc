use crate::{PResult, Parser};
use swc_css_ast::*;

impl Parser<'_> {
    pub(super) fn parse_style_rule(&mut self) -> PResult<StyleRule> {}

    pub(super) fn parse_decl_block(&mut self) -> PResult<DeclBlock> {
        let start = self.i.cur_pos();
        expect!(self, "{");
        let mut properties = vec![];

        while let Some(token) = self.i.cur() {
            if token == tok!("}") {
                break;
            }

            self.parse_property()?;
        }

        expect!(self, "}");

        Ok(DeclBlock {
            span: self.i.make_span(start),
            properties,
        })
    }

    fn parse_property(&mut self) -> PResult<Property> {}
}
