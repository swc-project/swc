use crate::{PResult, Parser};
use swc_css_ast::*;

impl Parser<'_> {
    pub(super) fn parse_selectors(&mut self) -> PResult<Vec<Box<Selector>>> {
        let mut selectors = vec![];

        loop {
            let selector = self.parse_selector()?;
            selectors.push(selector);

            if is!(self, "{") {
                break;
            }

            expect!(self, ",");
        }

        Ok(selectors)
    }

    pub(super) fn parse_selector(&mut self) -> PResult<Box<Selector>> {
        unimplemented!("parse_selector")
    }
}
