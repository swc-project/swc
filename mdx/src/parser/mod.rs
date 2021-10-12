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
        todo!()
    }

    pub fn parse_text_node(&mut self) -> PResult<TextNode> {
        todo!()
    }

    pub fn parse_list_item(&mut self) -> PResult<ListItem> {
        todo!()
    }
}
