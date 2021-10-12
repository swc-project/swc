use swc_common::input::Input;

pub use self::errors::{Error, ErrorKind};
use crate::ast::*;

mod errors;

pub struct Parser<I>
where
    I: Input,
{
    i: I,
}

/// Result of parsing
pub type PResult<T> = Result<T, Error>;

impl<I> Parser<I>
where
    I: Input,
{
    fn read_exact_text(&mut self, expected: &'static str, skip_ws: bool) -> PResult<bool> {
        let start = self.i.cur_pos();

        if skip_ws {
            loop {
                if self.i.eat_byte(b' ') || self.i.eat_byte(b'\t') {
                    continue;
                }

                break;
            }
        }

        for chars in expected.chars() {
            if self.i.cur() != Some(chars) {
                self.i.reset_to(start);
                return Ok(false);
            }
        }

        Ok(true)
    }

    pub fn parse_block_nodes(&mut self) -> PResult<Vec<BlockNode>> {
        let mut buf = vec![];

        loop {
            if self.i.cur().is_none() {
                return Ok(buf);
            }

            buf.push(self.parse_block_node()?)
        }
    }

    pub fn parse_block_node(&mut self) -> PResult<BlockNode> {
        let start = self.i.cur_pos();

        if self.read_exact_text("import", true)? {}

        todo!()
    }

    pub fn parse_text_node(&mut self) -> PResult<TextNode> {
        todo!()
    }

    pub fn parse_list_item(&mut self) -> PResult<ListItem> {
        todo!()
    }
}
