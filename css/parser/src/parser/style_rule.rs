use super::{input::ParserInput, PResult, Parser};
use crate::{parser::Ctx, Parse};
use swc_common::Span;
use swc_css_ast::*;

impl<I> Parser<I>
where
    I: ParserInput,
{
    pub(crate) fn parse_style_rule(&mut self) -> PResult<Rule> {
        let start = self.input.cur_span()?.lo;

        let selectors = self.parse_selectors()?;

        let block = self.parse_decl_block()?;

        let span = span!(self, start);

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

        let properties = self.parse_properties()?;

        expect!(self, "}");

        let span = span!(self, start);

        Ok(DeclBlock { span, properties })
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
            expect!(self, "important");

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
