use std::iter::once;

use super::{input::ParserInput, Ctx, PResult, Parser};
use crate::{
    error::{Error, ErrorKind},
    Parse,
};
use swc_atoms::js_word;
use swc_common::{BytePos, Spanned};
use swc_css_ast::*;

#[cfg(test)]
mod tests;

impl<I> Parser<I>
where
    I: ParserInput,
{
    /// Ported from `parseDeclaration` of esbuild.
    ///
    /// https://github.com/evanw/esbuild/blob/a9456dfbf08ab50607952eefb85f2418968c124c/internal/css_parser/css_parser.go#L987
    ///
    /// Returned [BytePos] is `hi`.
    pub(super) fn parse_property_values(&mut self) -> PResult<(Vec<Value>, BytePos)> {
        let start = self.input.state();
        let mut values = vec![];
        let mut state = self.input.state();
        let start_pos = self.input.cur_span()?.lo;

        let mut hi = self.input.last_pos()?;
        loop {
            if is_one_of!(self, EOF, ";", "}", "!", ")") {
                self.input.reset(&state);
                break;
            }

            let ctx = Ctx {
                allow_separating_value_with_comma: true,
                allow_separating_value_with_space: false,
                ..self.ctx
            };
            let v = self.with_ctx(ctx).parse_one_value()?;
            hi = v.span().hi;
            values.push(v);

            state = self.input.state();

            if !eat!(self, " ") {
                if self.ctx.recover_from_property_value
                    && !is_one_of!(self, EOF, ";", "}", "!", ")")
                {
                    self.input.reset(&start);

                    let mut tokens = vec![];
                    while !is_one_of!(self, EOF, ";", "}", "!", ")") {
                        tokens.extend(self.input.bump()?);
                    }

                    let v = Value::Lazy(Tokens {
                        span: span!(self, start_pos),
                        tokens,
                    });
                    return Ok((vec![v], hi));
                }

                break;
            }
        }

        // TODO: Make this lazy
        Ok((values, hi))
    }

    fn parse_one_value(&mut self) -> PResult<Value> {
        let span = self.input.cur_span()?;
        let value = self.parse_one_value_inner()?;

        let val = if self.ctx.allow_separating_value_with_space && eat!(self, " ") {
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

            let val = Value::Space(SpaceValues {
                span: span!(self, span.lo),
                values,
            });

            val
        } else {
            value
        };

        if self.ctx.allow_separating_value_with_comma && eat!(self, ",") {
            let next = self.parse_one_value()?;
            match next {
                Value::Comma(next) => {
                    return Ok(Value::Comma(CommaValues {
                        span: span!(self, span.lo),
                        values: once(val).chain(next.values).collect(),
                    }))
                }
                _ => {
                    return Ok(Value::Comma(CommaValues {
                        span: span!(self, span.lo),
                        values: vec![val, next],
                    }))
                }
            }
        }

        Ok(val)
    }

    /// Parse value as tokens.
    pub(super) fn parse_any_value(&mut self, terminate_on_semi: bool) -> PResult<Tokens> {
        let start = self.input.cur_span()?.lo;

        let mut tokens = vec![];

        loop {
            if is_one_of!(self, EOF, ")", "}", "]") {
                break;
            }

            if terminate_on_semi {
                if is!(self, ";") {
                    break;
                }
            }

            let span = self.input.cur_span()?;

            macro_rules! try_group {
                ($start:tt,$end:tt) => {{
                    if is!(self, $start) {
                        tokens.push(TokenAndSpan {
                            span,
                            token: bump!(self),
                        });

                        tokens.extend(self.parse_any_value(false)?.tokens);

                        if is!(self, $end) {
                            tokens.push(TokenAndSpan {
                                span,
                                token: bump!(self),
                            });
                        } else {
                            break;
                        }
                        continue;
                    }
                }};
            }

            try_group!("(", ")");
            try_group!("[", "]");
            try_group!("{", "}");

            let token = self.input.bump()?;
            match token {
                Some(token) => tokens.push(token),
                None => break,
            }
        }

        Ok(Tokens {
            span: span!(self, start),
            tokens,
        })
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

            tok!("{") => {
                return self.parse_brace_value().map(From::from);
            }

            Token::Hash { .. } => return self.parse_hash_value().map(From::from),

            Token::AtKeyword(..) => {
                let name = bump!(self);
                let name = match name {
                    Token::AtKeyword(name) => Text { span, value: name },
                    _ => {
                        unreachable!()
                    }
                };

                let block = if is!(self, "{") {
                    self.parse_brace_value().map(Some)?
                } else {
                    None
                };

                return Ok(Value::AtText(AtTextValue {
                    span: span!(self, span.lo),
                    name,
                    block,
                }));
            }

            Token::Url { .. } => {
                let url = match bump!(self) {
                    Token::Url { value } => value,
                    _ => {
                        unreachable!()
                    }
                };

                return Ok(Value::Url(UrlValue {
                    span: span!(self, span.lo),
                    url,
                }));
            }

            _ => {}
        }

        if is_one_of!(self, "<!--", "-->")
            || (self.ctx.is_in_delimited_value && is_one_of!(self, "!", ";"))
        {
            let token = self.input.bump()?.unwrap();
            return Ok(Value::Lazy(Tokens {
                span,
                tokens: vec![token],
            }));
        }

        Err(Error::new(span, ErrorKind::Expected("Property value")))
    }

    /// This may parse operations, depending on the context.
    fn parse_numeric_value(&mut self) -> PResult<Value> {
        let span = self.input.cur_span()?;

        let base = self.parse_basical_numeric_value()?;

        self.parse_numeric_value_with_base(span.lo, base)
    }

    fn parse_numeric_value_with_base(&mut self, start: BytePos, base: Value) -> PResult<Value> {
        let start_state = self.input.state();
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

        self.input.reset(&start_state);

        return Ok(base);
    }

    fn parse_hash_value(&mut self) -> PResult<HashValue> {
        let span = self.input.cur_span()?;

        let token = bump!(self);
        match token {
            Token::Hash { value, .. } => Ok(HashValue { span, value }),
            _ => {
                unreachable!("parse_hash_value should not be ")
            }
        }
    }

    fn parse_brace_value(&mut self) -> PResult<BraceValue> {
        let span = self.input.cur_span()?;

        expect!(self, "{");

        let brace_start = self.input.cur_span()?.lo;
        let mut tokens = vec![];

        let mut brace_cnt = 1;
        loop {
            if is!(self, "}") {
                brace_cnt -= 1;
                if brace_cnt == 0 {
                    break;
                }
            }
            if is!(self, "{") {
                brace_cnt += 1;
            }

            let token = self.input.bump()?;
            match token {
                Some(token) => tokens.push(token),
                None => break,
            }
        }

        let brace_span = span!(self, brace_start);
        expect!(self, "}");

        Ok(BraceValue {
            span: span!(self, span.lo),
            value: Box::new(Value::Lazy(Tokens {
                span: brace_span,
                tokens,
            })),
        })
    }

    fn parse_basical_numeric_value(&mut self) -> PResult<Value> {
        assert!(
            matches!(cur!(self), Token::Num { .. }),
            "parse_numeric_value: Should be called only if current token is Token::Num"
        );
        let span = self.input.cur_span()?;

        match bump!(self) {
            Token::Num(NumToken { value }) => {
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
            let is_url = name.value.to_ascii_lowercase() == js_word!("url");
            let ctx = Ctx {
                allow_operation_in_value: if is_url { false } else { true },
                allow_separating_value_with_space: if is_url { false } else { true },
                allow_separating_value_with_comma: false,
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
            self.input.skip_ws()?;
            if is_one_of!(self, EOF, ")", "}", ";", "]") {
                break;
            }
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
            is_in_delimited_value: true,
            ..self.ctx
        };
        let values = self.with_ctx(ctx).parse_comma_separated_value()?;

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
            is_in_delimited_value: true,
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
            Token::Num(NumToken { value }) => Ok(Num { span, value }),
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

impl<I> Parse<FnValue> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<FnValue> {
        let span = self.input.cur_span()?;

        let value = match bump!(self) {
            Token::Ident(value) => value,
            _ => {
                unreachable!()
            }
        };
        let name = Text { span, value };

        expect!(self, "(");

        let ctx = Ctx {
            allow_operation_in_value: true,
            allow_separating_value_with_space: true,
            ..self.ctx
        };
        let args = self.with_ctx(ctx).parse_comma_separated_value()?;

        expect!(self, ")");

        Ok(FnValue {
            span: span!(self, span.lo),
            name,
            args,
        })
    }
}
