use crate::{PResult, Parser};
use swc_css_ast::*;

impl Parser<'_> {
    pub(super) fn parse_style_rule(&mut self) -> PResult<StyleRule> {}

    fn parse_property(&mut self) -> PResult<Property> {}
}
