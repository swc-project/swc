use super::{input::ParserInput, Ctx, PResult, Parser};
use crate::{
    error::{Error, ErrorKind},
    Parse,
};
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
            if is_one_of!(self, EOF, ";", "}", "!", ")", "]") {
                self.input.reset(&state);
                break;
            }

            let v = self.parse_one_value_inner()?;

            hi = v.span().hi;
            values.push(v);
            state = self.input.state();

            if !eat!(self, " ")
                && !is_one_of!(
                    self,
                    ",",
                    "/",
                    "function",
                    "ident",
                    "dimension",
                    "percent",
                    "num",
                    "str",
                    "#",
                    "url",
                    "[",
                    "{",
                    "("
                )
            {
                if self.ctx.recover_from_property_value
                    && !is_one_of!(self, EOF, ";", "}", "!", ")", "]")
                {
                    self.input.reset(&start);

                    let mut tokens = vec![];
                    while !is_one_of!(self, EOF, ";", "}", "!", ")", "]") {
                        tokens.extend(self.input.bump()?);
                    }

                    let span = span!(self, start_pos);
                    let v = Value::Tokens(Tokens { span, tokens });

                    self.errors
                        .push(Error::new(span, ErrorKind::InvalidDeclarationValue));

                    return Ok((vec![v], hi));
                }

                break;
            }
        }

        // TODO: Make this lazy
        Ok((values, hi))
    }

    /// Parse value as <declaration-value>.
    pub(super) fn parse_declaration_value(&mut self) -> PResult<Tokens> {
        let start = self.input.cur_span()?.lo;

        let mut tokens = vec![];
        let mut balance_stack: Vec<Option<char>> = vec![];

        // The <declaration-value> production matches any sequence of one or more
        // tokens, so long as the sequence does not contain ...
        loop {
            match cur!(self) {
                // ... <bad-string-token>, <bad-url-token>,
                tok!("bad-string") | tok!("bad-url") => {
                    break;
                }

                // ... unmatched <)-token>, <]-token>, or <}-token>,
                tok!(")") | tok!("]") | tok!("}") => {
                    let value = match cur!(self) {
                        tok!(")") => ')',
                        tok!("]") => ']',
                        tok!("}") => '}',
                        _ => {
                            unreachable!();
                        }
                    };

                    let balance_close_type = match balance_stack.pop() {
                        Some(v) => v,
                        None => None,
                    };

                    if Some(value) != balance_close_type {
                        break;
                    }
                }

                tok!("function") | tok!("(") | tok!("[") | tok!("{") => {
                    let value = match cur!(self) {
                        tok!("function") | tok!("(") => ')',
                        tok!("[") => ']',
                        tok!("{") => '}',
                        _ => {
                            unreachable!();
                        }
                    };

                    balance_stack.push(Some(value));
                }

                // ... or top-level <semicolon-token> tokens
                tok!(";") => {
                    if balance_stack.is_empty() {
                        break;
                    }
                }

                // ... or <delim-token> tokens with a value of "!"
                tok!("!") => {
                    if balance_stack.is_empty() {
                        break;
                    }
                }

                _ => {}
            }

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

    /// Parse value as <any-value>.
    pub(super) fn parse_any_value(&mut self) -> PResult<Tokens> {
        let start = self.input.cur_span()?.lo;

        let mut tokens = vec![];
        let mut balance_stack: Vec<Option<char>> = vec![];

        // The <any-value> production matches any sequence of one or more tokens,
        // so long as the sequence ...
        loop {
            match cur!(self) {
                // ... <bad-string-token>, <bad-url-token>,
                tok!("bad-string") | tok!("bad-url") => {
                    break;
                }

                // ... unmatched <)-token>, <]-token>, or <}-token>,
                tok!(")") | tok!("]") | tok!("}") => {
                    let value = match cur!(self) {
                        tok!(")") => ')',
                        tok!("]") => ']',
                        tok!("}") => '}',
                        _ => {
                            unreachable!();
                        }
                    };

                    let balance_close_type = match balance_stack.pop() {
                        Some(v) => v,
                        None => None,
                    };

                    if Some(value) != balance_close_type {
                        break;
                    }
                }

                tok!("function") | tok!("(") | tok!("[") | tok!("{") => {
                    let value = match cur!(self) {
                        tok!("function") | tok!("(") => ')',
                        tok!("[") => ']',
                        tok!("{") => '}',
                        _ => {
                            unreachable!();
                        }
                    };

                    balance_stack.push(Some(value));
                }

                _ => {}
            }

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
        // TODO remove me
        self.input.skip_ws()?;

        let span = self.input.cur_span()?;

        match cur!(self) {
            tok!(",") => {
                bump!(self);

                return Ok(Value::Delimiter(Delimiter {
                    span: span!(self, span.lo),
                    value: DelimiterValue::Comma,
                }));
            }

            tok!("/") => {
                bump!(self);

                return Ok(Value::Delimiter(Delimiter {
                    span: span!(self, span.lo),
                    value: DelimiterValue::Solidus,
                }));
            }

            tok!("str") => return Ok(Value::Str(self.parse()?)),

            tok!("url") => return Ok(Value::Url(self.parse()?)),

            Token::Function { value, .. } => {
                if &*value.to_ascii_lowercase() == "url" || &*value.to_ascii_lowercase() == "src" {
                    return Ok(Value::Url(self.parse()?));
                }

                return Ok(Value::Function(self.parse()?));
            }

            tok!("percent") | tok!("dimension") | tok!("num") => {
                let span = self.input.cur_span()?;
                let base = self.parse_basical_numeric_value()?;

                return self.parse_numeric_value_with_base(span.lo, base);
            }

            Token::Ident { value, .. } => {
                if value.starts_with("--") {
                    return Ok(Value::DashedIdent(self.parse()?));
                };

                return Ok(Value::Ident(self.parse()?));
            }

            tok!("[") => return self.parse_square_brackets_value().map(From::from),

            tok!("(") => return self.parse_round_brackets_value().map(From::from),

            tok!("{") => {
                return self.parse_brace_value().map(From::from);
            }

            tok!("#") => return Ok(Value::Color(Color::HexColor(self.parse()?))),

            _ => {}
        }

        if is_one_of!(self, "<!--", "-->", "!", ";") {
            let token = self.input.bump()?.unwrap();
            return Ok(Value::Tokens(Tokens {
                span,
                tokens: vec![token],
            }));
        }

        Err(Error::new(span, ErrorKind::Expected("Declaration value")))
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
            let right = self.with_ctx(ctx).parse_one_value_inner()?;

            let value = Value::Bin(BinValue {
                span: span!(self, start),
                op,
                left: Box::new(base),
                right: Box::new(right),
            });

            return self.parse_numeric_value_with_base(start, value);
        }

        self.input.reset(&start_state);

        Ok(base)
    }

    fn parse_brace_value(&mut self) -> PResult<SimpleBlock> {
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

        Ok(SimpleBlock {
            span: span!(self, span.lo),
            name: '{',
            // TODO refactor me
            value: vec![Value::Tokens(Tokens {
                span: brace_span,
                tokens,
            })],
        })
    }

    fn parse_basical_numeric_value(&mut self) -> PResult<Value> {
        match cur!(self) {
            tok!("percent") => Ok(Value::Percent(self.parse()?)),
            tok!("dimension") => Ok(Value::Dimension(self.parse()?)),
            tok!("num") => Ok(Value::Number(self.parse()?)),
            _ => {
                unreachable!()
            }
        }
    }

    fn parse_square_brackets_value(&mut self) -> PResult<SimpleBlock> {
        let span = self.input.cur_span()?;

        expect!(self, "[");

        self.input.skip_ws()?;

        let value = self.parse_property_values()?.0;

        self.input.skip_ws()?;

        expect!(self, "]");

        Ok(SimpleBlock {
            span: span!(self, span.lo),
            name: '[',
            value,
        })
    }

    fn parse_round_brackets_value(&mut self) -> PResult<SimpleBlock> {
        let span = self.input.cur_span()?;

        expect!(self, "(");

        self.input.skip_ws()?;

        let value = if is!(self, ")") {
            vec![]
        } else {
            let ctx = Ctx {
                allow_operation_in_value: true,
                ..self.ctx
            };

            self.with_ctx(ctx).parse_property_values()?.0
        };

        expect!(self, ")");

        Ok(SimpleBlock {
            span: span!(self, span.lo),
            name: '(',
            value,
        })
    }

    pub fn parse_simple_block(&mut self, ending: char) -> PResult<SimpleBlock> {
        let start_pos = self.input.last_pos()? - BytePos(1);
        let mut simple_block = SimpleBlock {
            span: Default::default(),
            name: Default::default(),
            value: vec![],
        };

        loop {
            match cur!(self) {
                tok!("}") if ending == '}' => {
                    self.input.bump()?;

                    let ending_pos = self.input.last_pos()?;

                    simple_block.span =
                        swc_common::Span::new(ending_pos, start_pos, Default::default());
                    simple_block.name = '{';

                    return Ok(simple_block);
                }
                tok!(")") if ending == ')' => {
                    self.input.bump()?;

                    let ending_pos = self.input.last_pos()?;

                    simple_block.span =
                        swc_common::Span::new(ending_pos, start_pos, Default::default());
                    simple_block.name = '(';

                    return Ok(simple_block);
                }
                tok!("]") if ending == ']' => {
                    self.input.bump()?;

                    let ending_pos = self.input.last_pos()?;

                    simple_block.span =
                        swc_common::Span::new(ending_pos, start_pos, Default::default());
                    simple_block.name = '[';

                    return Ok(simple_block);
                }
                _ => {
                    let span = self.input.cur_span()?;
                    let token = self.input.bump()?.unwrap();

                    simple_block.value.push(Value::Tokens(Tokens {
                        span: span!(self, span.lo),
                        tokens: vec![token],
                    }));
                }
            }
        }
    }

    pub fn parse_component_value(&mut self) -> PResult<Value> {
        match cur!(self) {
            tok!("[") => Ok(Value::SimpleBlock(self.parse_simple_block(']')?)),
            tok!("(") => Ok(Value::SimpleBlock(self.parse_simple_block(')')?)),
            tok!("{") => Ok(Value::SimpleBlock(self.parse_simple_block('}')?)),
            tok!("function") => Ok(Value::Function(self.parse()?)),
            _ => {
                let span = self.input.cur_span()?;
                let token = self.input.bump()?;

                match token {
                    Some(t) => Ok(Value::Tokens(Tokens {
                        span: span!(self, span.lo),
                        tokens: vec![t],
                    })),
                    _ => {
                        unreachable!();
                    }
                }
            }
        }
    }
}

impl<I> Parse<Number> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Number> {
        let span = self.input.cur_span()?;

        if !is!(self, Num) {
            return Err(Error::new(span, ErrorKind::ExpectedNumber));
        }

        let value = bump!(self);

        match value {
            Token::Num { value, raw, .. } => Ok(Number { span, value, raw }),
            _ => {
                unreachable!()
            }
        }
    }
}

impl<I> Parse<CustomIdent> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<CustomIdent> {
        let span = self.input.cur_span()?;

        if !is!(self, Ident) {
            return Err(Error::new(span, ErrorKind::Expected("Ident")));
        }

        match bump!(self) {
            Token::Ident { value, raw } => {
                match &*value.to_ascii_lowercase() {
                    "initial" | "inherit" | "unset" | "revert" | "default" => {
                        return Err(Error::new(
                            span,
                            ErrorKind::InvalidCustomIdent(stringify!(value)),
                        ));
                    }
                    _ => {}
                }

                Ok(CustomIdent { span, value, raw })
            }
            _ => {
                unreachable!()
            }
        }
    }
}

impl<I> Parse<DashedIdent> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<DashedIdent> {
        let span = self.input.cur_span()?;

        if !is!(self, Ident) {
            return Err(Error::new(span, ErrorKind::Expected("Ident")));
        }

        match bump!(self) {
            Token::Ident { value, raw } => {
                if !value.starts_with("--") {
                    return Err(Error::new(
                        span,
                        ErrorKind::Expected("'--' at the start of dashed-ident"),
                    ));
                }

                Ok(DashedIdent { span, value, raw })
            }
            _ => {
                unreachable!()
            }
        }
    }
}

impl<I> Parse<Ident> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Ident> {
        let span = self.input.cur_span()?;

        if !is!(self, Ident) {
            return Err(Error::new(span, ErrorKind::Expected("Ident")));
        }

        match bump!(self) {
            Token::Ident { value, raw } => Ok(Ident { span, value, raw }),
            _ => {
                unreachable!()
            }
        }
    }
}

impl<I> Parse<Dimension> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Dimension> {
        let span = self.input.cur_span()?;

        if !is!(self, Dimension) {
            return Err(Error::new(span, ErrorKind::Expected("dimension token")));
        }

        match cur!(self) {
            Token::Dimension { unit, .. } => {
                match unit {
                    // <length>
                    unit if is_length_unit(unit) => Ok(Dimension::Length(self.parse()?)),
                    // <angle>
                    unit if is_angle_unit(unit) => Ok(Dimension::Angle(self.parse()?)),
                    // <time>
                    unit if is_time_unit(unit) => Ok(Dimension::Time(self.parse()?)),
                    // <frequency>
                    unit if is_frequency_unit(unit) => Ok(Dimension::Frequency(self.parse()?)),
                    // <resolution>
                    unit if is_resolution_unit(unit) => Ok(Dimension::Resolution(self.parse()?)),
                    // <flex>
                    unit if is_flex_unit(unit) => Ok(Dimension::Flex(self.parse()?)),
                    _ => Ok(Dimension::UnknownDimension(self.parse()?)),
                }
            }
            _ => {
                unreachable!()
            }
        }
    }
}

impl<I> Parse<Length> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Length> {
        let span = self.input.cur_span()?;

        if !is!(self, Dimension) {
            return Err(Error::new(span, ErrorKind::Expected("dimension token")));
        }

        match bump!(self) {
            Token::Dimension {
                value,
                raw_value,
                unit,
                raw_unit,
                ..
            } => {
                // TODO validate

                let unit_len = raw_unit.len() as u32;

                Ok(Length {
                    span,
                    value: Number {
                        value,
                        raw: raw_value,
                        span: swc_common::Span::new(
                            span.lo,
                            span.hi - BytePos(unit_len),
                            Default::default(),
                        ),
                    },
                    unit: Ident {
                        span: swc_common::Span::new(
                            span.hi - BytePos(unit_len),
                            span.hi,
                            Default::default(),
                        ),
                        value: unit,
                        raw: raw_unit,
                    },
                })
            }
            _ => {
                unreachable!()
            }
        }
    }
}

impl<I> Parse<Angle> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Angle> {
        let span = self.input.cur_span()?;

        if !is!(self, Dimension) {
            return Err(Error::new(span, ErrorKind::Expected("dimension token")));
        }

        match bump!(self) {
            Token::Dimension {
                value,
                raw_value,
                unit,
                raw_unit,
                ..
            } => {
                if !is_angle_unit(&unit) {
                    return Err(Error::new(
                        span,
                        ErrorKind::Expected("'deg', 'grad', 'rad' or 'turn' units"),
                    ));
                }

                let unit_len = raw_unit.len() as u32;

                Ok(Angle {
                    span,
                    value: Number {
                        value,
                        raw: raw_value,
                        span: swc_common::Span::new(
                            span.lo,
                            span.hi - BytePos(unit_len),
                            Default::default(),
                        ),
                    },
                    unit: Ident {
                        span: swc_common::Span::new(
                            span.hi - BytePos(unit_len),
                            span.hi,
                            Default::default(),
                        ),
                        value: unit,
                        raw: raw_unit,
                    },
                })
            }
            _ => {
                unreachable!()
            }
        }
    }
}

impl<I> Parse<Time> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Time> {
        let span = self.input.cur_span()?;

        if !is!(self, Dimension) {
            return Err(Error::new(span, ErrorKind::Expected("dimension token")));
        }

        match bump!(self) {
            Token::Dimension {
                value,
                raw_value,
                unit,
                raw_unit,
                ..
            } => {
                if !is_time_unit(&unit) {
                    return Err(Error::new(span, ErrorKind::Expected("'s' or 'ms' units")));
                }

                let unit_len = raw_unit.len() as u32;

                Ok(Time {
                    span,
                    value: Number {
                        value,
                        raw: raw_value,
                        span: swc_common::Span::new(
                            span.lo,
                            span.hi - BytePos(unit_len),
                            Default::default(),
                        ),
                    },
                    unit: Ident {
                        span: swc_common::Span::new(
                            span.hi - BytePos(unit_len),
                            span.hi,
                            Default::default(),
                        ),
                        value: unit,
                        raw: raw_unit,
                    },
                })
            }
            _ => {
                unreachable!()
            }
        }
    }
}

impl<I> Parse<Frequency> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Frequency> {
        let span = self.input.cur_span()?;

        if !is!(self, Dimension) {
            return Err(Error::new(span, ErrorKind::Expected("dimension token")));
        }

        match bump!(self) {
            Token::Dimension {
                value,
                raw_value,
                unit,
                raw_unit,
                ..
            } => {
                if !is_frequency_unit(&unit) {
                    return Err(Error::new(span, ErrorKind::Expected("'Hz' or 'kHz' units")));
                }

                let unit_len = raw_unit.len() as u32;

                Ok(Frequency {
                    span,
                    value: Number {
                        value,
                        raw: raw_value,
                        span: swc_common::Span::new(
                            span.lo,
                            span.hi - BytePos(unit_len),
                            Default::default(),
                        ),
                    },
                    unit: Ident {
                        span: swc_common::Span::new(
                            span.hi - BytePos(unit_len),
                            span.hi,
                            Default::default(),
                        ),
                        value: unit,
                        raw: raw_unit,
                    },
                })
            }
            _ => {
                unreachable!()
            }
        }
    }
}

impl<I> Parse<Resolution> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Resolution> {
        let span = self.input.cur_span()?;

        if !is!(self, Dimension) {
            return Err(Error::new(span, ErrorKind::Expected("dimension token")));
        }

        match bump!(self) {
            Token::Dimension {
                value,
                raw_value,
                unit,
                raw_unit,
                ..
            } => {
                if !is_resolution_unit(&unit) {
                    return Err(Error::new(
                        span,
                        ErrorKind::Expected("'dpi', 'dpcm', 'dppx' or 'x' units"),
                    ));
                }

                let unit_len = raw_unit.len() as u32;

                Ok(Resolution {
                    span,
                    value: Number {
                        value,
                        raw: raw_value,
                        span: swc_common::Span::new(
                            span.lo,
                            span.hi - BytePos(unit_len),
                            Default::default(),
                        ),
                    },
                    unit: Ident {
                        span: swc_common::Span::new(
                            span.hi - BytePos(unit_len),
                            span.hi,
                            Default::default(),
                        ),
                        value: unit,
                        raw: raw_unit,
                    },
                })
            }
            _ => {
                unreachable!()
            }
        }
    }
}

impl<I> Parse<Flex> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Flex> {
        let span = self.input.cur_span()?;

        if !is!(self, Dimension) {
            return Err(Error::new(span, ErrorKind::Expected("dimension token")));
        }

        match bump!(self) {
            Token::Dimension {
                value,
                raw_value,
                unit,
                raw_unit,
                ..
            } => {
                if !is_flex_unit(&unit) {
                    return Err(Error::new(span, ErrorKind::Expected("'fr' unit")));
                }

                let unit_len = raw_unit.len() as u32;

                Ok(Flex {
                    span,
                    value: Number {
                        value,
                        raw: raw_value,
                        span: swc_common::Span::new(
                            span.lo,
                            span.hi - BytePos(unit_len),
                            Default::default(),
                        ),
                    },
                    unit: Ident {
                        span: swc_common::Span::new(
                            span.hi - BytePos(unit_len),
                            span.hi,
                            Default::default(),
                        ),
                        value: unit,
                        raw: raw_unit,
                    },
                })
            }
            _ => {
                unreachable!()
            }
        }
    }
}

impl<I> Parse<UnknownDimension> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<UnknownDimension> {
        let span = self.input.cur_span()?;

        if !is!(self, Dimension) {
            return Err(Error::new(span, ErrorKind::Expected("dimension token")));
        }

        match bump!(self) {
            Token::Dimension {
                value,
                raw_value,
                unit,
                raw_unit,
                ..
            } => {
                let unit_len = raw_unit.len() as u32;

                Ok(UnknownDimension {
                    span,
                    value: Number {
                        value,
                        raw: raw_value,
                        span: swc_common::Span::new(
                            span.lo,
                            span.hi - BytePos(unit_len),
                            Default::default(),
                        ),
                    },
                    unit: Ident {
                        span: swc_common::Span::new(
                            span.hi - BytePos(unit_len),
                            span.hi,
                            Default::default(),
                        ),
                        value: unit,
                        raw: raw_unit,
                    },
                })
            }
            _ => {
                unreachable!()
            }
        }
    }
}

impl<I> Parse<HexColor> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<HexColor> {
        let span = self.input.cur_span()?;

        if !is!(self, "#") {
            return Err(Error::new(span, ErrorKind::Expected("hash token")));
        }

        match bump!(self) {
            Token::Hash { value, raw, .. } => Ok(HexColor { span, value, raw }),
            _ => {
                unreachable!()
            }
        }
    }
}

impl<I> Parse<Percent> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Percent> {
        let span = self.input.cur_span()?;

        if !is!(self, Percent) {
            return Err(Error::new(span, ErrorKind::Expected("Percent")));
        }

        match bump!(self) {
            Token::Percent { value, raw } => {
                let value = Number {
                    span: swc_common::Span::new(span.lo, span.hi - BytePos(1), Default::default()),
                    value,
                    raw,
                };

                Ok(Percent { span, value })
            }
            _ => {
                unreachable!()
            }
        }
    }
}

impl<I> Parse<Str> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Str> {
        let span = self.input.cur_span()?;

        if !is!(self, Str) {
            return Err(Error::new(span, ErrorKind::Expected("Str")));
        }

        match bump!(self) {
            Token::Str { value, raw } => Ok(Str { span, value, raw }),
            _ => {
                unreachable!()
            }
        }
    }
}

impl<I> Parse<Url> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Url> {
        let span = self.input.cur_span()?;

        if !is_one_of!(self, Url, Function) {
            return Err(Error::new(span, ErrorKind::Expected("url or function")));
        }

        match bump!(self) {
            Token::Url {
                name,
                raw_name,
                value,
                raw_value,
                before,
                after,
            } => {
                let name_length = raw_name.len() as u32;
                let name = Ident {
                    span: swc_common::Span::new(
                        span.lo,
                        span.lo + BytePos(name_length),
                        Default::default(),
                    ),
                    value: name,
                    raw: raw_name,
                };
                let value = Some(UrlValue::Raw(UrlValueRaw {
                    span: swc_common::Span::new(
                        span.lo + BytePos(name_length + 1),
                        span.hi - BytePos(1),
                        Default::default(),
                    ),
                    before,
                    after,
                    value,
                    raw: raw_value,
                }));

                Ok(Url {
                    span: span!(self, span.lo),
                    name,
                    value,
                    modifiers: None,
                })
            }
            Token::Function {
                value: function_name,
                raw: raw_function_name,
            } => {
                if &*function_name.to_ascii_lowercase() != "url"
                    && &*function_name.to_ascii_lowercase() != "src"
                {
                    return Err(Error::new(span, ErrorKind::Expected("'url' or 'src' name")));
                }

                let name = Ident {
                    span: swc_common::Span::new(span.lo, span.hi - BytePos(1), Default::default()),
                    value: function_name,
                    raw: raw_function_name,
                };

                self.input.skip_ws()?;

                let value = match cur!(self) {
                    tok!("str") => Some(UrlValue::Str(self.parse()?)),
                    _ => None,
                };

                self.input.skip_ws()?;

                let mut modifiers = vec![];

                loop {
                    if is!(self, ")") {
                        break;
                    }

                    match cur!(self) {
                        tok!("ident") => {
                            modifiers.push(UrlModifier::Ident(self.parse()?));
                        }
                        tok!("function") => {
                            modifiers.push(UrlModifier::Function(self.parse()?));
                        }
                        _ => {
                            let span = self.input.cur_span()?;

                            return Err(Error::new(span, ErrorKind::Expected("ident or function")));
                        }
                    }

                    self.input.skip_ws()?;
                }

                expect!(self, ")");

                Ok(Url {
                    span: span!(self, span.lo),
                    name,
                    value,
                    modifiers: Some(modifiers),
                })
            }
            _ => {
                unreachable!()
            }
        }
    }
}

impl<I> Parse<Function> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Function> {
        let span = self.input.cur_span()?;
        let ident = match bump!(self) {
            Token::Function { value, raw } => (value, raw),
            _ => {
                unreachable!()
            }
        };
        let is_math_function = matches!(
            &*ident.0.to_ascii_lowercase(),
            "calc"
                | "min"
                | "max"
                | "clamp"
                | "round"
                | "mod"
                | "rem"
                | "sin"
                | "cos"
                | "tan"
                | "asin"
                | "acos"
                | "atan"
                | "atan2"
                | "pow"
                | "sqrt"
                | "hypot"
                | "log"
                | "exp"
                | "abs"
                | "sign"
        );
        let name = Ident {
            span: swc_common::Span::new(span.lo, span.hi - BytePos(1), Default::default()),
            value: ident.0,
            raw: ident.1,
        };
        let ctx = Ctx {
            allow_operation_in_value: is_math_function,
            ..self.ctx
        };

        // Create a function with its name equal to the value of the current input token
        // and with its value initially set to an empty list.
        let mut function = Function {
            span: Default::default(),
            name,
            value: vec![],
        };

        // Repeatedly consume the next input token and process it as follows:
        loop {
            // <EOF-token>
            // This is a parse error. Return the function.
            if is!(self, EOF) {
                break;
            }

            match cur!(self) {
                // <)-token>
                // Return the function.
                tok!(")") => {
                    bump!(self);

                    break;
                }
                // anything else
                // Reconsume the current input token. Consume a component value and append the
                // returned value to the function’s value.
                _ => {
                    let state = self.input.state();
                    let parsed = self.with_ctx(ctx).parse_one_value_inner();
                    let value = match parsed {
                        Ok(value) => {
                            self.input.skip_ws()?;

                            value
                        }
                        Err(err) => {
                            self.errors.push(err);
                            self.input.reset(&state);

                            self.parse_component_value()?
                        }
                    };

                    function.value.push(value);
                }
            }
        }

        function.span = span!(self, span.lo);

        return Ok(function);
    }
}

fn is_length_unit(unit: &str) -> bool {
    match &*unit.to_ascii_lowercase() {
        // Relative Lengths
        // Font-relative Lengths
        "em" | "rem"  | 
        "ex" | "rex" | 
        "cap" | "rcap" | 
        "ch" | "rch" | 
        "ic" | "ric" | 
        "lh" | "rlh" | 
        //  Viewport-percentage Lengths
        "vw" | "svw" | "lvw" | "dvw" |
        "vh" | "svh" | "lvh" | "dvh" |
        "vi" | "svi" | "lvi" | "dvi" |
        "vb" | "svb" | "lvb" | "dvb" |
        "vmin" | "svmin" | "lvmin" | "dvmin" |
        "vmax" | "svmax" | "lvmax" | "dvmax" |
        // Absolute lengths
        "cm" | "mm" | "q" | "in" | "pc" | "pt" | "px" | "mozmm" => true,
        _ => false,
    }
}

fn is_angle_unit(unit: &str) -> bool {
    match &*unit.to_ascii_lowercase() {
        "deg" | "grad" | "rad" | "turn" => true,
        _ => false,
    }
}

fn is_time_unit(unit: &str) -> bool {
    match &*unit.to_ascii_lowercase() {
        "s" | "ms" => true,
        _ => false,
    }
}

fn is_frequency_unit(unit: &str) -> bool {
    match &*unit.to_ascii_lowercase() {
        "hz" | "khz" => true,
        _ => false,
    }
}

fn is_resolution_unit(unit: &str) -> bool {
    match &*unit.to_ascii_lowercase() {
        "dpi" | "dpcm" | "dppx" | "x" => true,
        _ => false,
    }
}

fn is_flex_unit(unit: &str) -> bool {
    match &*unit.to_ascii_lowercase() {
        "fr" => true,
        _ => false,
    }
}
