use self::ctx::Ctx;
pub use self::errors::{Error, ErrorKind};
use crate::ast::*;
use swc_common::{input::Input, BytePos, Span, Spanned};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{EsConfig, Syntax};

mod ctx;
mod errors;

pub struct Parser<I>
where
    I: Input,
{
    i: I,
    ctx: Ctx,
}

/// Result of parsing
pub type PResult<T> = Result<T, Error>;

impl<I> Parser<I>
where
    I: Input,
{
    pub fn new(input: I) -> Self {
        Self {
            i: input,
            ctx: Default::default(),
        }
    }

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

    fn expect_byte(&mut self, b: u8) -> PResult<()> {
        if self.i.eat_byte(b) {
            return Ok(());
        }
        let pos = self.i.cur_pos();
        Err(Error {
            inner: Box::new((
                Span::new(pos, pos, Default::default()),
                ErrorKind::Expected(b as _),
            )),
        })
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
            self.i.bump();
        }

        Ok(true)
    }

    fn is_exact_at_line_start(&mut self, expected: &'static str, skip_ws: bool) -> PResult<bool> {
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

        let actual_start = self.i.cur_pos();

        for chars in expected.chars() {
            if self.i.cur() != Some(chars) {
                self.i.reset_to(start);
                return Ok(false);
            }
            self.i.bump();
        }

        self.i.reset_to(actual_start);

        Ok(true)
    }

    pub fn parse(&mut self) -> PResult<MdxFile> {
        let start = self.i.cur_pos();

        let content = self.parse_block_nodes()?;

        Ok(MdxFile {
            span: self.span(start),
            content,
        })
    }

    pub fn parse_block_nodes(&mut self) -> PResult<Vec<BlockNode>> {
        let mut buf = vec![];

        loop {
            if self.i.cur().is_none() {
                break;
            }

            let node = self.parse_block_node()?;
            match node {
                Some(v) => {
                    buf.push(v);
                }
                None => break,
            }
        }

        Ok(buf)
    }

    fn parse_block_node(&mut self) -> PResult<Option<BlockNode>> {
        loop {
            let start = self.i.cur_pos();

            // import / export
            if self.is_exact_at_line_start("import", true)?
                || self.is_exact_at_line_start("export", true)?
            {
                return Ok(self
                    .with_es_parser(|p| p.parse_module_item())
                    .map(BlockNode::Es)
                    .map(Some)?);
            }

            // jsx elem / jsx frag
            if self.is_exact_at_line_start("<", true)? {
                let expr = self.with_es_parser(|p| p.parse_expr())?;
                return Ok(Some(BlockNode::Jsx(expr)));
            }

            if self.read_exact_at_line_start("#", true)? {
                let mut cnt = 1;

                while self.i.eat_byte(b'#') {
                    cnt += 1;
                }

                self.skip_ws()?;

                let content = self.parse_text_nodes()?;

                let span = self.span(start);

                return Ok(Some(BlockNode::Header(Header {
                    span,
                    hash_cnt: cnt,
                    content,
                })));
            }

            if self.read_exact_at_line_start("```", true)? {
                return self.parse_code_block().map(Some);
            }

            if self.read_exact_at_line_start(">", true)? {
                return self
                    .parse_block_quote()
                    .map(BlockNode::BlockQuote)
                    .map(Some);
            }

            if self.i.eat_byte(b'\n') || self.i.eat_byte(b'\r') {
                continue;
            }

            break;
        }

        let c = self.i.cur();
        let c = match c {
            Some(v) => v,
            None => return Ok(None),
        };

        if c.is_alphanumeric() || (!self.ctx.in_asterisk && c == '*') {
            return self.parse_text_nodes().map(BlockNode::Text).map(Some);
        }

        todo!("parse({:?})", self.i.cur())
    }

    pub fn parse_code_block(&mut self) -> PResult<BlockNode> {
        todo!("parse_code_block({:?})", self.i.cur())
    }

    fn read_text(&mut self) -> PResult<String> {
        let mut buf = String::new();

        loop {
            match self.i.cur() {
                Some(c) => {
                    let s = self.i.uncons_while(|c: char| {
                        c.is_alphanumeric()
                            || match c {
                                ' ' | '?' | '!' | '_' | ',' => true,
                                _ => false,
                            }
                    });
                    if !s.is_empty() {
                        buf.push_str(&s);
                        break;
                    }
                }
                None => break,
            }

            if self.i.eat_byte(b' ') {
                buf.push(' ');
                continue;
            }
        }

        Ok(buf)
    }

    pub fn parse_text_node(&mut self) -> PResult<TextNode> {
        let start = self.i.cur_pos();

        if !self.ctx.in_asterisk && self.i.eat_byte(b'*') {
            let ctx = Ctx {
                in_asterisk: true,
                ..self.ctx
            };
            let kind = self
                .with_ctx(ctx)
                .parse_text_nodes()
                .map(TextNodeKind::Emphasis)?;

            self.expect_byte(b'*')?;

            return Ok(TextNode {
                span: self.span(start),
                kind,
            });
        }

        let c = match self.i.cur() {
            Some(c) => c,
            None => {
                return Ok(TextNode {
                    span: self.span(start),
                    kind: TextNodeKind::Break,
                })
            }
        };
        if c.is_alphanumeric() {
            let text = self.read_text()?;
            return Ok(TextNode {
                span: self.span(start),
                kind: TextNodeKind::Text(text),
            });
        }

        if c == '<' {
            let expr = self.with_es_parser(|p| p.parse_expr())?;
            return Ok(TextNode {
                span: self.span(start),
                kind: TextNodeKind::Jsx(expr),
            });
        }

        todo!("parse_text_node({:?})", self.i.cur())
    }

    pub fn parse_text_nodes(&mut self) -> PResult<Vec<TextNode>> {
        let mut buf = vec![];

        loop {
            if self.i.cur().is_none() || self.i.eat_byte(b'\n') || self.i.eat_byte(b'\r') {
                break;
            }

            if self.ctx.in_asterisk && self.i.is_byte(b'*') {
                break;
            }

            buf.push(self.parse_text_node()?);
        }

        Ok(buf)
    }

    pub fn parse_block_quote(&mut self) -> PResult<BlockQuote> {
        todo!()
    }

    pub fn parse_list_item(&mut self) -> PResult<ListItem> {
        todo!()
    }

    fn with_es_parser<F, T>(&mut self, op: F) -> PResult<T>
    where
        F: FnOnce(
            &mut swc_ecma_parser::Parser<swc_ecma_parser::lexer::Lexer<I>>,
        ) -> swc_ecma_parser::PResult<T>,
        T: Spanned,
    {
        let lexer = swc_ecma_parser::lexer::Lexer::new(
            Syntax::Es(EsConfig {
                jsx: true,
                ..Default::default()
            }),
            EsVersion::latest(),
            self.i.clone(),
            None,
        );
        let mut es_parser = swc_ecma_parser::Parser::new_from(lexer);
        let ret = op(&mut es_parser)?;

        self.i.reset_to(ret.span().hi);

        Ok(ret)
    }
}
