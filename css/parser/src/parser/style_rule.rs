use crate::parser::Ctx;

use super::{input::ParserInput, PResult, Parser};
use swc_common::Span;
use swc_css_ast::*;

impl<I> Parser<I>
where
    I: ParserInput,
{
    pub(crate) fn parse_style_rule(&mut self) -> PResult<Rule> {
        let start = self.input.cur_span()?.lo;

        let start_state = self.input.state();

        let selectors = self.parse_selectors();

        match selectors {
            Ok(selectors) => {
                let block = self.parse_style_block()?;

                let span = Span::new(start, self.input.last_pos(), Default::default());

                Ok(Rule::Style(StyleRule {
                    span,
                    selectors,
                    block,
                }))
            }
            Err(_) => {
                self.input.reset(&start_state);
                self.parse_qualified_rule()
            }
        }
    }

    pub(crate) fn parse_style_block(&mut self) -> PResult<DeclBlock> {
        let start = self.input.cur_span()?.lo;

        self.input.skip_ws()?;

        expect!(self, "{");

        self.input.skip_ws()?;

        let properties = self.parse_properties()?;

        self.input.skip_ws()?;

        expect!(self, "}");

        let span = Span::new(start, self.input.last_pos(), Default::default());

        Ok(DeclBlock { span, properties })
    }

    pub(crate) fn parse_properties(&mut self) -> PResult<Vec<Property>> {
        let mut props = vec![];

        while is_one_of!(self, Ident, "--") {
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

        let values = {
            let ctx = Ctx {
                allow_operation_in_value: false,
                ..self.ctx
            };
            self.with_ctx(ctx).parse_property_values()?
        };

        let important = self.parse_bang_import()?;

        let span = span!(self, start);

        Ok(Property {
            span,
            name,
            values,
            important,
        })
    }

    fn parse_property_name(&mut self) -> PResult<Text> {
        self.input.skip_ws()?;
        self.parse_id()
    }

    fn parse_bang_import(&mut self) -> PResult<Option<Span>> {
        let start = self.input.cur_span()?.lo;

        if eat!(self, "!") {
            expect!(self, "important");

            Ok(Some(span!(self, start)))
        } else {
            Ok(None)
        }
    }
}
