use super::{input::ParserInput, PResult, Parser};
use crate::{
    error::{Error, ErrorKind},
    parser::{Ctx, RuleContext},
    Parse,
};
use swc_common::Span;
use swc_css_ast::*;

impl<I> Parser<I>
where
    I: ParserInput,
{
    pub(crate) fn parse_rule_list(&mut self, ctx: RuleContext) -> PResult<Vec<Rule>> {
        let mut rules = vec![];

        loop {
            // TODO: remove `}`
            if self.input.is_eof()? || is!(self, "}") {
                return Ok(rules);
            }

            match cur!(self) {
                tok!(" ") => {
                    self.input.skip_ws()?;
                }
                tok!("<!--") | tok!("-->") => {
                    if ctx.is_top_level {
                        self.input.bump()?;

                        continue;
                    }

                    rules.push(self.parse_qualified_rule()?);
                }
                Token::AtKeyword { .. } => {
                    rules.push(self.parse_at_rule(Default::default())?.into());
                }
                _ => {
                    rules.push(self.parse_qualified_rule()?);
                }
            }
        }
    }

    pub(crate) fn parse_qualified_rule(&mut self) -> PResult<Rule> {
        let start_pos = self.input.cur_span()?.lo;
        let start_state = self.input.state();

        let selectors = self.parse_selectors();
        let selectors = match selectors {
            Ok(v) => v,
            Err(err) => {
                self.input.skip_ws()?;
                if is!(self, "}") {
                    self.errors.push(err);
                    self.input.reset(&start_state);

                    let mut tokens = vec![];
                    while !is_one_of!(self, EOF, "}") {
                        tokens.extend(self.input.bump()?);
                    }

                    return Ok(Rule::Invalid(Tokens {
                        span: span!(self, start_pos),
                        tokens,
                    }));
                } else {
                    return Err(err);
                }
            }
        };

        let block = self.parse_simple_block()?;
        let span = span!(self, start_pos);

        Ok(Rule::Style(StyleRule {
            span,
            selectors,
            block,
        }))
    }

    pub(crate) fn parse_simple_block(&mut self) -> PResult<Block> {
        let start = self.input.cur_span()?.lo;

        expect!(self, "{");

        self.input.skip_ws()?;

        let items = self.parse_decl_block_items()?;

        expect!(self, "}");

        let span = span!(self, start);

        Ok(Block { span, items })
    }

    fn parse_decl_block_items(&mut self) -> PResult<Vec<DeclarationBlockItem>> {
        let mut items = vec![];

        while is!(self, Ident) {
            items.push(self.parse()?);

            if !eat!(self, ";") {
                break;
            }

            self.input.skip_ws()?;
        }

        Ok(items)
    }

    fn parse_declaration_list(&mut self) -> PResult<Vec<Declaration>> {
        let mut declarations = vec![];

        loop {
            if self.input.is_eof()? {
                return Ok(declarations);
            }

            let cur = self.input.cur()?;

            match cur {
                Some(tok!(" ")) => {
                    self.input.skip_ws()?;
                }
                Some(tok!(";")) => {
                    bump!(self);
                }
                Some(Token::AtKeyword { .. }) => {
                    // TODO: change on `parse_at_rule`
                    declarations.push(self.parse()?);
                }
                Some(Token::Ident { .. }) => {
                    declarations.push(self.parse()?);

                    self.input.skip_ws()?;

                    if !eat!(self, ";") {
                        break;
                    }

                    self.input.skip_ws()?;
                }
                _ => {}
            }
        }

        Ok(declarations)
    }

    pub(crate) fn parse_declaration(&mut self) -> PResult<Declaration> {
        let start = self.input.cur_span()?.lo;

        self.input.skip_ws()?;

        let property = self.parse_id()?;

        self.input.skip_ws()?;

        expect!(self, ":");

        let mut value = vec![];
        let mut end = self.input.cur_span()?.hi;

        if !self.input.is_eof()? {
            let ctx = Ctx {
                allow_operation_in_value: false,
                recover_from_property_value: true,
                ..self.ctx
            };
            let (mut parsed_value, parsed_last_pos) = self.with_ctx(ctx).parse_property_values()?;

            value.append(&mut parsed_value);
            end = parsed_last_pos;
        }

        let important = self.parse_bang_important()?;

        if important.is_some() {
            end = self.input.last_pos()?;
        }

        self.input.skip_ws()?;

        Ok(Declaration {
            span: Span::new(start, end, Default::default()),
            property,
            value,
            important,
        })
    }

    fn parse_bang_important(&mut self) -> PResult<Option<Span>> {
        self.input.skip_ws()?;

        let start = self.input.cur_span()?.lo;

        if !is!(self, EOF) && eat!(self, "!") {
            self.input.skip_ws()?;

            let is_important = match bump!(self) {
                Token::Ident { value, .. } => &*value.to_ascii_lowercase() == "important",
                _ => false,
            };
            if !is_important {
                let span = Span::new(start, self.input.cur_span()?.hi, Default::default());
                return Err(Error::new(span, ErrorKind::ExpectedButGot("!important")));
            }

            self.input.skip_ws()?;

            Ok(Some(span!(self, start)))
        } else {
            Ok(None)
        }
    }
}

impl<I> Parse<Declaration> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Declaration> {
        self.parse_declaration()
    }
}

impl<I> Parse<Vec<Declaration>> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Vec<Declaration>> {
        self.parse_declaration_list()
    }
}

impl<I> Parse<Vec<DeclarationBlockItem>> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Vec<DeclarationBlockItem>> {
        self.parse_decl_block_items()
    }
}

impl<I> Parse<DeclarationBlockItem> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<DeclarationBlockItem> {
        let start = self.input.state();
        let start_pos = self.input.cur_span()?.lo;

        let prop = self.parse().map(DeclarationBlockItem::Declaration);

        match prop {
            Ok(v) => return Ok(v),
            Err(err) => {
                self.errors.push(err);
            }
        }

        self.input.reset(&start);
        let mut tokens = vec![];
        while !is_one_of!(self, EOF, ";", "}") {
            tokens.extend(self.input.bump()?);
        }

        Ok(DeclarationBlockItem::Invalid(Tokens {
            span: span!(self, start_pos),
            tokens,
        }))
    }
}
