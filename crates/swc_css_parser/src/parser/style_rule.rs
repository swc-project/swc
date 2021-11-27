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
            if is!(self, EOF) || is!(self, "}") {
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

                    rules.push(self.parse()?);
                }
                Token::AtKeyword { .. } => {
                    rules.push(self.parse_at_rule(Default::default())?.into());
                }
                _ => {
                    rules.push(self.parse()?);
                }
            }
        }
    }
}

impl<I> Parse<Rule> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Rule> {
        let start_pos = self.input.cur_span()?.lo;
        let start_state = self.input.state();

        let prelude = self.parse_selectors();
        let prelude = match prelude {
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

        let block = self.parse()?;
        let span = span!(self, start_pos);

        Ok(Rule::QualifiedRule(QualifiedRule {
            span,
            prelude,
            block,
        }))
    }
}

impl<I> Parse<Block> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Block> {
        let start = self.input.cur_span()?.lo;

        expect!(self, "{");

        self.input.skip_ws()?;

        let items = self.parse()?;

        expect!(self, "}");

        let span = span!(self, start);

        Ok(Block { span, items })
    }
}

impl<I> Parse<Vec<Declaration>> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Vec<Declaration>> {
        let mut declarations = vec![];

        loop {
            if is!(self, EOF) {
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
}


impl<I> Parse<Vec<DeclarationBlockItem>> for Parser<I>
    where
        I: ParserInput,
{
    fn parse(&mut self) -> PResult<Vec<DeclarationBlockItem>> {
        let mut items = vec![];

        while is!(self, Ident) {
            let state = self.input.state();
            let span = self.input.cur_span()?;
            let prop = match self.parse().map(DeclarationBlockItem::Declaration) {
                Ok(v) => v,
                Err(err) => {
                    self.errors.push(err);
                    self.input.reset(&state);

                    let mut tokens = vec![];

                    while !is_one_of!(self, EOF, ";", "}") {
                        tokens.extend(self.input.bump()?);
                    }

                    DeclarationBlockItem::Invalid(Tokens {
                        span: span!(self, span.lo),
                        tokens,
                    })
                }
            };

            items.push(prop);

            if !eat!(self, ";") {
                break;
            }

            self.input.skip_ws()?;
        }

        Ok(items)
    }
}

impl<I> Parse<Declaration> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Declaration> {
        let start = self.input.cur_span()?.lo;

        self.input.skip_ws()?;

        let property: Ident = self.parse()?;

        self.input.skip_ws()?;

        expect!(self, ":");

        let mut end = self.input.cur_span()?.hi;
        let mut value = vec![];

        if !is!(self, EOF) {
            match &*property.value {
                str if str.starts_with("--") => {
                    let tokens = Value::Lazy(self.parse_declaration_value()?);

                    value.push(tokens);
                }
                _ => {
                    let ctx = Ctx {
                        allow_operation_in_value: false,
                        recover_from_property_value: true,
                        ..self.ctx
                    };
                    let (parsed_value, parsed_last_pos) =
                        self.with_ctx(ctx).parse_property_values()?;

                    value.extend(parsed_value);
                    end = parsed_last_pos;
                }
            }
        }

        self.input.skip_ws()?;

        let span_import = self.input.cur_span()?;

        let important = if !is!(self, EOF) && eat!(self, "!") {
            self.input.skip_ws()?;

            let is_important = match bump!(self) {
                Token::Ident { value, .. } => &*value.to_ascii_lowercase() == "important",
                _ => false,
            };

            if !is_important {
                return Err(Error::new(
                    Span::new(
                        span_import.lo,
                        self.input.cur_span()?.hi,
                        Default::default(),
                    ),
                    ErrorKind::ExpectedButGot("!important"),
                ));
            }

            self.input.skip_ws()?;

            end = self.input.last_pos()?;

            Some(span!(self, span_import.lo))
        } else {
            None
        };

        self.input.skip_ws()?;

        Ok(Declaration {
            span: Span::new(start, end, Default::default()),
            property,
            value,
            important,
        })
    }
}

impl<I> Parse<Vec<DeclarationBlockItem>> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Vec<DeclarationBlockItem>> {
        let mut items = vec![];

        while is!(self, Ident) {
            let start = self.input.state();
            let start_pos = self.input.cur_span()?.lo;
            let prop = match self.parse().map(DeclarationBlockItem::Declaration) {
                Ok(v) => v,
                Err(err) => {
                    self.errors.push(err);
                    self.input.reset(&start);

                    let mut tokens = vec![];

                    while !is_one_of!(self, EOF, ";", "}") {
                        tokens.extend(self.input.bump()?);
                    }

                    DeclarationBlockItem::Invalid(Tokens {
                        span: span!(self, start_pos),
                        tokens,
                    })
                }
            };

            items.push(prop);

            if !eat!(self, ";") {
                break;
            }

            self.input.skip_ws()?;
        }

        Ok(items)
    }
}

impl<I> Parse<Vec<Declaration>> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Vec<Declaration>> {
        let mut declarations = vec![];

        loop {
            if is!(self, EOF) {
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
    }
}
