use super::*;

impl<I: Input> Parser<I> {
    pub fn parse_module(&mut self) -> PResult<Module> {
        unimplemented!("parse_module")
    }

    fn parse_import(&mut self) -> PResult<Lit> {
        unimplemented!("parse_module_item")
    }

    fn parse_export(&mut self) -> PResult<Lit> {
        unimplemented!("parse_export")
    }
}
