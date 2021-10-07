use super::{input::ParserInput, PResult, Parser};
use crate::{
    error::{Error, ErrorKind},
    parser::Ctx,
    Parse,
};
use swc_common::Span;
use swc_css_ast::*;

impl<I> Parser<I>
where
    I: ParserInput,
{
    pub(crate) fn parse_style_rule(&mut self) -> PResult<Rule> {
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

        let block = self.parse_decl_block()?;

        let span = span!(self, start_pos);

        Ok(Rule::Style(StyleRule {
            span,
            selectors,
            block,
        }))
    }

    pub(crate) fn parse_decl_block(&mut self) -> PResult<DeclBlock> {
        let start = self.input.cur_span()?.lo;

        expect!(self, "{");

        self.input.skip_ws()?;

        let items = self.parse_decl_block_items()?;

        expect!(self, "}");

        let span = span!(self, start);

        Ok(DeclBlock { span, items })
    }

    fn parse_decl_block_items(&mut self) -> PResult<Vec<DeclBlockItem>> {
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

    pub(crate) fn parse_properties(&mut self) -> PResult<Vec<Property>> {
        let mut props = vec![];

        while is!(self, Ident) {
            let p = self.parse_property()?;
            props.push(p);

            self.input.skip_ws()?;

            if !eat!(self, ";") {
                break;
            }

            self.input.skip_ws()?;
        }

        Ok(props)
    }

    pub(crate) fn parse_property(&mut self) -> PResult<Property> {
        self.input.skip_ws()?;

        let start = self.input.cur_span()?.lo;

        let name = self.parse_property_name()?;

        expect!(self, ":");

        let (values, mut last_pos) = {
            let ctx = Ctx {
                allow_operation_in_value: false,
                recover_from_property_value: true,
                ..self.ctx
            };
            self.with_ctx(ctx).parse_property_values()?
        };

        let important = self.parse_bang_important()?;
        if important.is_some() {
            last_pos = self.input.last_pos()?;
        }

        Ok(Property {
            span: Span::new(start, last_pos, Default::default()),
            name,
            values,
            important,
        })
    }

    fn parse_property_name(&mut self) -> PResult<Text> {
        self.input.skip_ws()?;
        self.parse_id()
    }

    fn parse_bang_important(&mut self) -> PResult<Option<Span>> {
        self.input.skip_ws()?;

        let start = self.input.cur_span()?.lo;

        if !is!(self, EOF) && eat!(self, "!") {
            self.input.skip_ws()?;

            let is_important = match bump!(self) {
                Token::Ident(value) => &*value.to_ascii_lowercase() == "important",
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

impl<I> Parse<Property> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Property> {
        self.parse_property()
    }
}

impl<I> Parse<Vec<Property>> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Vec<Property>> {
        self.parse_properties()
    }
}

impl<I> Parse<Vec<DeclBlockItem>> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Vec<DeclBlockItem>> {
        self.parse_decl_block_items()
    }
}

impl<I> Parse<DeclBlockItem> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<DeclBlockItem> {
        let start = self.input.state();
        let start_pos = self.input.cur_span()?.lo;

        let prop = self.parse().map(DeclBlockItem::Property);

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

        Ok(DeclBlockItem::Invalid(Tokens {
            span: span!(self, start_pos),
            tokens,
        }))
    }
}
