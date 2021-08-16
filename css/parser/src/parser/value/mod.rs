use super::{input::ParserInput, traits::Parse, Ctx, PResult, Parser};
use crate::{
    error::{Error, ErrorKind},
    token::{Token, TokenAndSpan},
};
use swc_common::BytePos;
use swc_css_ast::*;

mod color;
#[cfg(test)]
mod tests;

impl<I> Parser<I>
where
    I: ParserInput,
{
    /// Ported from `parseDeclaration` of esbuild.
    ///
    /// https://github.com/evanw/esbuild/blob/a9456dfbf08ab50607952eefb85f2418968c124c/internal/css_parser/css_parser.go#L987
    pub(super) fn parse_property_values(&mut self) -> PResult<Vec<Value>> {
        self.input.skip_ws()?;
        let start_pos = self.input.cur_span()?.lo;

        let mut ok = true;

        let mut values = vec![];
        loop {
            if is_one_of!(self, EOF, ";", "}") {
                break;
            }

            values.push(self.parse_one_value()?);

            if !eat!(self, " ") {
                break;
            }
        }

        // TODO: Make this lazy
        Ok(values)
    }

    fn parse_one_value(&mut self) -> PResult<Value> {
        let span = self.input.cur_span()?;
        let value = self.parse_one_value_inner()?;

        if self.ctx.allow_separating_value_with_space && eat!(self, " ") {
            self.input.skip_ws()?;

            let mut values = vec![];
            values.push(value);
            loop {
                if !is_one_of!(self, Str, Num, Ident, "[", "(") {
                    break;
                }

                let value = self.parse_one_value_inner()?;

                values.push(value);

                self.input.skip_ws()?;
            }

            return Ok(Value::Values(Values {
                span: span!(self, span.lo),
                values,
            }));
        }

        Ok(value)
    }

    fn parse_one_value_inner(&mut self) -> PResult<Value> {
        self.input.skip_ws()?;

        let span = self.input.cur_span()?;
        match cur!(self) {
            Token::Str { .. } => {
                let token = bump!(self);

                match token {
                    Token::Str { value } => return Ok(Value::Str(Str { span, value })),
                    _ => {
                        unreachable!()
                    }
                }
            }

            Token::Num { .. } => return self.parse_numeric_value(),

            Token::Ident { .. } => return self.parse_value_ident_or_fn(),

            tok!("[") => return self.parse_array_value().map(From::from),

            tok!("(") => return self.parse_paren_value().map(From::from),

            _ => {}
        }

        todo!("parse_one_value: {:?}", cur!(self))
    }

    /// This may parse operations, depending on the context.
    fn parse_numeric_value(&mut self) -> PResult<Value> {
        let span = self.input.cur_span()?;

        let base = self.parse_basical_numeric_value()?;

        self.parse_numeric_value_with_base(span.lo, base)
    }

    fn parse_numeric_value_with_base(&mut self, start: BytePos, base: Value) -> PResult<Value> {
        self.input.skip_ws()?;

        if self.ctx.allow_operation_in_value && is_one_of!(self, "+", "-", "*", "/") {
            let token = bump!(self);

            self.input.skip_ws()?;

            let op = match token {
                tok!("+") => BinOp::Add,
                tok!("-") => BinOp::Sub,
                tok!("*") => BinOp::Mul,
                tok!("/") => BinOp::Div,
                _ => {
                    unreachable!()
                }
            };
            self.input.skip_ws()?;

            let ctx = Ctx {
                allow_operation_in_value: false,
                ..self.ctx
            };
            let right = self.with_ctx(ctx).parse_one_value()?;

            let value = Value::Bin(BinValue {
                span: span!(self, start),
                op,
                left: Box::new(base),
                right: Box::new(right),
            });

            return self.parse_numeric_value_with_base(start, value);
        }

        return Ok(base);
    }

    fn parse_basical_numeric_value(&mut self) -> PResult<Value> {
        assert!(
            matches!(cur!(self), Token::Num { .. }),
            "parse_numeric_value: Should be called only if current token is Token::Num"
        );
        let span = self.input.cur_span()?;

        match bump!(self) {
            Token::Num { value } => {
                if is!(self, Ident) {
                    let unit_span = self.input.cur_span()?;

                    // Unit
                    let value = Num { span, value };
                    match bump!(self) {
                        Token::Ident(unit) => {
                            let kind = UnitKind::from(unit);
                            return Ok(Value::Unit(UnitValue {
                                span: span!(self, span.lo),
                                value,
                                unit: Unit {
                                    span: unit_span,
                                    kind,
                                },
                            }));
                        }
                        _ => {
                            unreachable!()
                        }
                    }
                }

                if eat!(self, "%") {
                    let value = Num { span, value };

                    return Ok(Value::Percent(PercentValue {
                        span: span!(self, span.lo),
                        value,
                    }));
                }

                Ok(Value::Number(Num { span, value }))
            }
            _ => {
                unreachable!()
            }
        }
    }

    fn parse_value_ident_or_fn(&mut self) -> PResult<Value> {
        assert!(
            matches!(cur!(self), Token::Ident { .. }),
            "parse_value_ident_or_fn: Should be called only if current token is Token::Ident"
        );
        let span = self.input.cur_span()?;

        let value = match bump!(self) {
            Token::Ident(value) => value,
            _ => {
                unreachable!()
            }
        };
        let name = Text { span, value };

        if eat!(self, "(") {
            let ctx = Ctx {
                allow_operation_in_value: true,
                allow_separating_value_with_space: true,
                ..self.ctx
            };
            let args = self.with_ctx(ctx).parse_comma_separated_value()?;

            expect!(self, ")");

            return Ok(Value::Fn(FnValue {
                span: span!(self, span.lo),
                name,
                args,
            }));
        }

        Ok(Value::Text(name))
    }

    /// Parse comma separated values.
    fn parse_comma_separated_value(&mut self) -> PResult<Vec<Value>> {
        let mut args = vec![];

        loop {
            let value = self.parse_one_value()?;

            args.push(value);

            if !eat!(self, ",") {
                break;
            }
        }

        Ok(args)
    }

    fn parse_array_value(&mut self) -> PResult<ArrayValue> {
        let span = self.input.cur_span()?;

        expect!(self, "[");

        let ctx = Ctx {
            allow_operation_in_value: false,
            ..self.ctx
        };
        let values = self.parse_comma_separated_value()?;

        expect!(self, "]");

        Ok(ArrayValue {
            span: span!(self, span.lo),
            values,
        })
    }

    fn parse_paren_value(&mut self) -> PResult<ParenValue> {
        let span = self.input.cur_span()?;

        expect!(self, "(");

        self.input.skip_ws()?;

        let ctx = Ctx {
            allow_operation_in_value: true,
            ..self.ctx
        };
        let value = if is!(self, ")") {
            None
        } else {
            self.with_ctx(ctx)
                .parse_one_value()
                .map(Box::new)
                .map(Some)?
        };

        expect!(self, ")");

        Ok(ParenValue {
            span: span!(self, span.lo),
            value,
        })
    }

    /// Ported from https://github.com/evanw/esbuild/blob/a9456dfbf08ab50607952eefb85f2418968c124c/internal/css_parser/css_parser.go#L657
    pub(in crate::parser) fn convert_tokens(
        &mut self,
        tokens: Vec<TokenAndSpan>,
    ) -> PResult<Vec<Text>> {
        todo!()
    }
}

impl<I> Parse<Num> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Num> {
        let span = self.input.cur_span()?;

        if !is!(self, Num) {
            return Err(Error::new(span, ErrorKind::ExpectedNumber));
        }

        let value = bump!(self);

        match value {
            Token::Num { value } => Ok(Num { span, value }),
            _ => {
                unreachable!()
            }
        }
    }
}

impl<I> Parse<PercentValue> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<PercentValue> {
        let span = self.input.cur_span()?;
        let value = self.parse()?;

        expect!(self, "%");

        Ok(PercentValue {
            span: span!(self, span.lo),
            value,
        })
    }
}
