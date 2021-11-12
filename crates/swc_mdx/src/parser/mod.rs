use swc_common::{input::Input, BytePos, Span};

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
    fn span(&mut self, start: BytePos) -> Span {
        Span::new(start, self.i.last_pos(), Default::default())
    }

    fn skip_ws(&mut self) -> PResult<()> {
        loop {
            if self.i.eat_byte(b' ') || self.i.eat_byte(b'\t') {
                continue;
            }

            return Ok(());
        }
    }

    fn read_exact_at_line_start(&mut self, expected: &'static str, skip_ws: bool) -> PResult<bool> {
        let start = self.i.cur_pos();

        // TODO: Line start
        if skip_ws {
            loop {
                if self.i.eat_byte(b' ')
                    || self.i.eat_byte(b'\t')
                    || self.i.eat_byte(b'\n')
                    || self.i.eat_byte(b'\r')
                {
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

        // import / export
        if self.read_exact_at_line_start("import", true)?
            || self.read_exact_at_line_start("export", true)?
        {}

        // jsx elem / jsx frag
        if self.read_exact_at_line_start("<", true)? {}

        if self.read_exact_at_line_start("#", true)? {
            let mut cnt = 1;

            while self.i.eat_byte(b'#') {
                cnt += 1;
            }

            self.skip_ws()?;

            let content = self.parse_text_nodes()?;

            let span = self.span(start);

            return Ok(BlockNode::Header {
                span,
                hash_cnt: cnt,
                content,
            });
        }

        if self.read_exact_at_line_start("```", true)? {
            return self.parse_code_block();
        }

        if self.read_exact_at_line_start(">", true)? {
            return self.parse_quote_block()?;
        }

        todo!()
    }

    pub fn parse_code_block(&mut self) -> PResult<BlockNode> {
        todo!()
    }

    pub fn parse_text_node(&mut self) -> PResult<TextNode> {
        todo!()
    }

    pub fn parse_text_nodes(&mut self) -> PResult<Vec<TextNode>> {
        todo!()
    }

    pub fn parse_list_item(&mut self) -> PResult<ListItem> {
        todo!()
    }
}
