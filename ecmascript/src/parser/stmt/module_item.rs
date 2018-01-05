use super::*;

impl<I: Input> Parser<I> {
    fn parse_import(&mut self) -> PResult<ModuleItem> {
        unimplemented!("parse_import")
    }

    fn parse_export(&mut self) -> PResult<ModuleItem> {
        unimplemented!("parse_export")
    }
}
impl<I: Input> StmtLikeParser<ModuleItem> for Parser<I> {
    fn handle_import_export(&mut self, top_level: bool) -> PResult<ModuleItem> {
        if !top_level {
            unexpected!(self);
        }

        if is!(self, "import") {
            self.parse_import()
        } else {
            self.parse_export()
        }
    }
}
