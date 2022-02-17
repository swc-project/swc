use swc_common::{BytePos, Span};
use swc_css_ast::*;

use super::{input::ParserInput, Ctx, Grammar, PResult, Parser};
use crate::{
    error::{Error, ErrorKind},
    Parse,
};

#[cfg(test)]
mod tests;

impl<I> Parser<I>
where
    I: ParserInput,
{
    /// Parse value as <declaration-value>.
    pub(super) fn parse_declaration_value(&mut self) -> PResult<Vec<Value>> {
        let mut value = vec![];
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
                Some(token) => value.push(Value::PreservedToken(token)),
                None => break,
            }
        }

        Ok(value)
    }

    /// Parse value as <any-value>.
    pub(super) fn parse_any_value(&mut self) -> PResult<Vec<TokenAndSpan>> {
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

        Ok(tokens)
    }

    pub(super) fn parse_one_value_inner(&mut self) -> PResult<Value> {
        // TODO remove me
        self.input.skip_ws()?;

        let span = self.input.cur_span()?;

        match cur!(self) {
            tok!(",") => return Ok(Value::Delimiter(self.parse()?)),

            tok!("/") => return Ok(Value::Delimiter(self.parse()?)),

            tok!(";") => return Ok(Value::Delimiter(self.parse()?)),

            tok!("string") => return Ok(Value::Str(self.parse()?)),

            tok!("url") => return Ok(Value::Url(self.parse()?)),

            Token::Function { value, .. } => {
                if &*value.to_ascii_lowercase() == "url" || &*value.to_ascii_lowercase() == "src" {
                    return Ok(Value::Url(self.parse()?));
                }

                return Ok(Value::Function(self.parse()?));
            }

            tok!("percentage") => return Ok(Value::Percentage(self.parse()?)),

            tok!("dimension") => return Ok(Value::Dimension(self.parse()?)),

            tok!("number") => return Ok(Value::Number(self.parse()?)),

            Token::Ident { value, .. } => {
                if value.starts_with("--") {
                    return Ok(Value::DashedIdent(self.parse()?));
                } else if &*value.to_ascii_lowercase() == "u"
                    && peeked_is_one_of!(self, "+", "number", "dimension")
                {
                    return Ok(Value::Urange(self.parse()?));
                }

                return Ok(Value::Ident(self.parse()?));
            }

            tok!("[") => {
                let ctx = Ctx {
                    grammar: Grammar::DeclarationValue,
                    ..self.ctx
                };
                let block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;

                return Ok(Value::SimpleBlock(block));
            }

            tok!("(") => {
                let ctx = Ctx {
                    grammar: Grammar::DeclarationValue,
                    ..self.ctx
                };
                let block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;

                return Ok(Value::SimpleBlock(block));
            }

            tok!("{") => {
                let ctx = Ctx {
                    grammar: Grammar::DeclarationValue,
                    ..self.ctx
                };
                let block = self.with_ctx(ctx).parse_as::<SimpleBlock>()?;

                return Ok(Value::SimpleBlock(block));
            }

            tok!("#") => return Ok(Value::Color(Color::HexColor(self.parse()?))),

            _ => {}
        }

        Err(Error::new(span, ErrorKind::Expected("Declaration value")))
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
                    let component_value = self.parse_component_value()?;

                    simple_block
                        .value
                        .push(ComponentValue::Value(component_value));
                }
            }
        }
    }

    pub fn parse_component_value(&mut self) -> PResult<Value> {
        match cur!(self) {
            tok!("[") => {
                self.input.bump()?;

                Ok(Value::SimpleBlock(self.parse_simple_block(']')?))
            }
            tok!("(") => {
                self.input.bump()?;

                Ok(Value::SimpleBlock(self.parse_simple_block(')')?))
            }
            tok!("{") => {
                self.input.bump()?;

                Ok(Value::SimpleBlock(self.parse_simple_block('}')?))
            }
            tok!("function") => Ok(Value::Function(self.parse()?)),
            _ => {
                let token = self.input.bump()?;

                match token {
                    Some(t) => Ok(Value::PreservedToken(t)),
                    _ => {
                        unreachable!();
                    }
                }
            }
        }
    }

    pub fn parse_function_values(&mut self, function_name: &str) -> PResult<Vec<Value>> {
        let mut values = vec![];

        match function_name {
            "calc" | "sin" | "cos" | "tan" | "asin" | "acos" | "atan" | "sqrt" | "exp" | "abs"
            | "sign" => {
                self.input.skip_ws()?;

                let calc_sum = Value::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws()?;
            }
            "min" | "max" | "hypot" => {
                self.input.skip_ws()?;

                let calc_sum = Value::CalcSum(self.parse()?);

                values.push(calc_sum);

                loop {
                    self.input.skip_ws()?;

                    if is!(self, ",") {
                        values.push(Value::Delimiter(self.parse()?));
                    } else {
                        break;
                    }

                    self.input.skip_ws()?;

                    let calc_sum = Value::CalcSum(self.parse()?);

                    values.push(calc_sum);
                }
            }
            "clamp" => {
                self.input.skip_ws()?;

                let calc_sum = Value::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws()?;

                if is!(self, ",") {
                    values.push(Value::Delimiter(self.parse()?));
                } else {
                    let span = self.input.cur_span()?;

                    return Err(Error::new(span, ErrorKind::Expected("',' delim token")));
                }

                self.input.skip_ws()?;

                let calc_sum = Value::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws()?;

                if is!(self, ",") {
                    values.push(Value::Delimiter(self.parse()?));
                } else {
                    let span = self.input.cur_span()?;

                    return Err(Error::new(span, ErrorKind::Expected("',' delim token")));
                }

                self.input.skip_ws()?;

                let calc_sum = Value::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws()?;
            }
            "round" => {
                self.input.skip_ws()?;

                if is!(self, "ident") {
                    // TODO improve me
                    let rounding_strategy = Value::Ident(self.parse()?);

                    values.push(rounding_strategy);

                    self.input.skip_ws()?;

                    if is!(self, ",") {
                        values.push(Value::Delimiter(self.parse()?));
                    } else {
                        let span = self.input.cur_span()?;

                        return Err(Error::new(span, ErrorKind::Expected("',' delim token")));
                    }

                    self.input.skip_ws()?;
                }

                let calc_sum = Value::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws()?;

                if is!(self, ",") {
                    values.push(Value::Delimiter(self.parse()?));
                } else {
                    let span = self.input.cur_span()?;

                    return Err(Error::new(span, ErrorKind::Expected("',' delim token")));
                }

                self.input.skip_ws()?;

                let calc_sum = Value::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws()?;
            }
            "mod" | "rem" | "atan2" | "pow" => {
                self.input.skip_ws()?;

                let calc_sum = Value::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws()?;

                if is!(self, ",") {
                    values.push(Value::Delimiter(self.parse()?));
                } else {
                    let span = self.input.cur_span()?;

                    return Err(Error::new(span, ErrorKind::Expected("',' delim token")));
                }

                self.input.skip_ws()?;

                let calc_sum = Value::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws()?;
            }
            "log" => {
                self.input.skip_ws()?;

                let calc_sum = Value::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws()?;

                if is!(self, ",") {
                    values.push(Value::Delimiter(self.parse()?));

                    self.input.skip_ws()?;

                    let calc_sum = Value::CalcSum(self.parse()?);

                    values.push(calc_sum);

                    self.input.skip_ws()?;
                }
            }
            _ => loop {
                self.input.skip_ws()?;

                if is!(self, ")") {
                    break;
                }

                values.push(self.parse_one_value_inner()?);
            },
        };

        Ok(values)
    }
}

impl<I> Parse<Delimiter> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Delimiter> {
        let span = self.input.cur_span()?;

        if !is_one_of!(self, ",", "/", ";") {
            return Err(Error::new(
                span,
                ErrorKind::Expected("',', '/' or ';' delim token"),
            ));
        }

        match cur!(self) {
            tok!(",") => {
                bump!(self);

                return Ok(Delimiter {
                    span: span!(self, span.lo),
                    value: DelimiterValue::Comma,
                });
            }
            tok!("/") => {
                bump!(self);

                return Ok(Delimiter {
                    span: span!(self, span.lo),
                    value: DelimiterValue::Solidus,
                });
            }
            tok!(";") => {
                bump!(self);

                return Ok(Delimiter {
                    span: span!(self, span.lo),
                    value: DelimiterValue::Semicolon,
                });
            }
            _ => {
                unreachable!();
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

        if !is!(self, Number) {
            return Err(Error::new(span, ErrorKind::ExpectedNumber));
        }

        let value = bump!(self);

        match value {
            Token::Number { value, raw, .. } => Ok(Number { span, value, raw }),
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

impl<I> Parse<Percentage> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Percentage> {
        let span = self.input.cur_span()?;

        if !is!(self, Percentage) {
            return Err(Error::new(span, ErrorKind::Expected("percentage token")));
        }

        match bump!(self) {
            Token::Percentage { value, raw } => {
                let value = Number {
                    span: swc_common::Span::new(span.lo, span.hi - BytePos(1), Default::default()),
                    value,
                    raw,
                };

                Ok(Percentage { span, value })
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

        if !is!(self, "string") {
            return Err(Error::new(span, ErrorKind::Expected("string token")));
        }

        match bump!(self) {
            Token::String { value, raw } => Ok(Str { span, value, raw }),
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
                    tok!("string") => Some(UrlValue::Str(self.parse()?)),
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
        let function_name = &*ident.0.to_ascii_lowercase();
        let name = Ident {
            span: swc_common::Span::new(span.lo, span.hi - BytePos(1), Default::default()),
            value: ident.0,
            raw: ident.1,
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
                    let values = self.parse_function_values(function_name);

                    match values {
                        Ok(values) => {
                            function.value.extend(values);
                        }
                        Err(err) => {
                            self.errors.push(err);
                            self.input.reset(&state);

                            let value = self.parse_component_value()?;

                            function.value.push(value);
                        }
                    }
                }
            }
        }

        function.span = span!(self, span.lo);

        return Ok(function);
    }
}

// <urange> =
//   u '+' <ident-token> '?'* |
//   u <dimension-token> '?'* |
//   u <number-token> '?'* |
//   u <number-token> <dimension-token> |
//   u <number-token> <number-token> |
//   u '+' '?'+
impl<I> Parse<Urange> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Urange> {
        let span = self.input.cur_span()?;
        let mut urange = String::new();

        // should start with `u` or `U`
        match cur!(self) {
            Token::Ident { value, .. } if &*value.to_ascii_lowercase() == "u" => {
                let ident = match bump!(self) {
                    Token::Ident { value, .. } => value,
                    _ => {
                        unreachable!();
                    }
                };

                urange.push_str(&ident);
            }
            _ => {
                return Err(Error::new(span, ErrorKind::Expected("'u' ident token")));
            }
        };

        match cur!(self) {
            // u '+' <ident-token> '?'*
            // u '+' '?'+
            Token::Delim { value } if *value == '+' => {
                let plus = match bump!(self) {
                    Token::Delim { value } => value,
                    _ => {
                        unreachable!();
                    }
                };

                urange.push(plus);

                if is!(self, Ident) {
                    let ident = match bump!(self) {
                        Token::Ident { value, .. } => value,
                        _ => {
                            unreachable!();
                        }
                    };

                    urange.push_str(&ident);

                    loop {
                        if !is!(self, "?") {
                            break;
                        }

                        let question = match bump!(self) {
                            Token::Delim { value } => value,
                            _ => {
                                unreachable!();
                            }
                        };

                        urange.push(question);
                    }
                } else {
                    let question = match bump!(self) {
                        Token::Delim { value } if value == '?' => value,
                        _ => {
                            return Err(Error::new(span, ErrorKind::Expected("'?' delim token")));
                        }
                    };

                    urange.push(question);

                    loop {
                        if !is!(self, "?") {
                            break;
                        }

                        let question = match bump!(self) {
                            Token::Delim { value } => value,
                            _ => {
                                unreachable!();
                            }
                        };

                        urange.push(question);
                    }
                }
            }
            // u <number-token> '?'*
            // u <number-token> <dimension-token>
            // u <number-token> <number-token>
            tok!("number") => {
                let number = match bump!(self) {
                    Token::Number { raw, .. } => raw,
                    _ => {
                        unreachable!();
                    }
                };

                urange.push_str(&number);

                match cur!(self) {
                    tok!("?") => {
                        let question = match bump!(self) {
                            Token::Delim { value } => value,
                            _ => {
                                unreachable!();
                            }
                        };

                        urange.push(question);

                        loop {
                            if !is!(self, "?") {
                                break;
                            }

                            let question = match bump!(self) {
                                Token::Delim { value } => value,
                                _ => {
                                    unreachable!();
                                }
                            };

                            urange.push(question);
                        }
                    }
                    tok!("dimension") => {
                        let dimension = match bump!(self) {
                            Token::Dimension {
                                raw_value,
                                raw_unit,
                                ..
                            } => (raw_value, raw_unit),
                            _ => {
                                unreachable!();
                            }
                        };

                        urange.push_str(&dimension.0);
                        urange.push_str(&dimension.1);
                    }
                    tok!("number") => {
                        let number = match bump!(self) {
                            Token::Number { raw, .. } => raw,
                            _ => {
                                unreachable!();
                            }
                        };

                        urange.push_str(&number);
                    }
                    _ => {}
                }
            }
            // u <dimension-token> '?'*
            tok!("dimension") => {
                let dimension = match bump!(self) {
                    Token::Dimension {
                        raw_value,
                        raw_unit,
                        ..
                    } => (raw_value, raw_unit),
                    _ => {
                        unreachable!();
                    }
                };

                urange.push_str(&dimension.0);
                urange.push_str(&dimension.1);

                loop {
                    if !is!(self, "?") {
                        break;
                    }

                    let question = match bump!(self) {
                        Token::Delim { value } => value,
                        _ => {
                            unreachable!();
                        }
                    };

                    urange.push(question);
                }
            }
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("dimension, number or '?' delim token"),
                ));
            }
        }

        return Ok(Urange {
            span: span!(self, span.lo),
            value: urange.into(),
        });
    }
}

impl<I> Parse<CalcSum> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<CalcSum> {
        let start = self.input.cur_span()?.lo;
        let mut expressions = vec![];
        let calc_product = CalcProductOrOperator::Product(self.parse()?);
        let mut end = match calc_product {
            CalcProductOrOperator::Product(ref calc_product) => calc_product.span.hi,
            _ => {
                unreachable!();
            }
        };

        expressions.push(calc_product);

        loop {
            self.input.skip_ws()?;

            match cur!(self) {
                tok!("+") | tok!("-") => {
                    let operator = CalcProductOrOperator::Operator(self.parse()?);

                    expressions.push(operator);

                    self.input.skip_ws()?;

                    let calc_product = CalcProductOrOperator::Product(self.parse()?);

                    end = match calc_product {
                        CalcProductOrOperator::Product(ref calc_product) => calc_product.span.hi,
                        _ => {
                            unreachable!();
                        }
                    };

                    expressions.push(calc_product);
                }
                _ => {
                    break;
                }
            }
        }

        Ok(CalcSum {
            span: Span::new(start, end, Default::default()),
            expressions,
        })
    }
}

impl<I> Parse<CalcProduct> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<CalcProduct> {
        let start = self.input.cur_span()?.lo;
        let mut expressions = vec![];
        let calc_value = CalcValueOrOperator::Value(self.parse()?);
        let mut end = match calc_value {
            CalcValueOrOperator::Value(ref calc_value) => match calc_value {
                CalcValue::Number(item) => item.span.hi,
                CalcValue::Percentage(item) => item.span.hi,
                CalcValue::Constant(item) => item.span.hi,
                CalcValue::Sum(item) => item.span.hi,
                CalcValue::Function(item) => item.span.hi,
                CalcValue::Dimension(item) => match item {
                    Dimension::Length(item) => item.span.hi,
                    Dimension::Angle(item) => item.span.hi,
                    Dimension::Time(item) => item.span.hi,
                    Dimension::Frequency(item) => item.span.hi,
                    Dimension::Resolution(item) => item.span.hi,
                    Dimension::Flex(item) => item.span.hi,
                    Dimension::UnknownDimension(item) => item.span.hi,
                },
            },
            _ => {
                unreachable!();
            }
        };

        expressions.push(calc_value);

        loop {
            self.input.skip_ws()?;

            match cur!(self) {
                tok!("*") | tok!("/") => {
                    let operator = CalcValueOrOperator::Operator(self.parse()?);

                    expressions.push(operator);

                    self.input.skip_ws()?;

                    let calc_value = CalcValueOrOperator::Value(self.parse()?);

                    end = match calc_value {
                        CalcValueOrOperator::Value(ref calc_value) => match calc_value {
                            CalcValue::Number(item) => item.span.hi,
                            CalcValue::Percentage(item) => item.span.hi,
                            CalcValue::Constant(item) => item.span.hi,
                            CalcValue::Sum(item) => item.span.hi,
                            CalcValue::Function(item) => item.span.hi,
                            CalcValue::Dimension(item) => match item {
                                Dimension::Length(item) => item.span.hi,
                                Dimension::Angle(item) => item.span.hi,
                                Dimension::Time(item) => item.span.hi,
                                Dimension::Frequency(item) => item.span.hi,
                                Dimension::Resolution(item) => item.span.hi,
                                Dimension::Flex(item) => item.span.hi,
                                Dimension::UnknownDimension(item) => item.span.hi,
                            },
                        },
                        _ => {
                            unreachable!();
                        }
                    };

                    expressions.push(calc_value);
                }
                _ => {
                    break;
                }
            }
        }

        Ok(CalcProduct {
            span: Span::new(start, end, Default::default()),
            expressions,
        })
    }
}

impl<I> Parse<CalcOperator> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<CalcOperator> {
        let span = self.input.cur_span()?;

        match cur!(self) {
            tok!("+") => {
                bump!(self);

                Ok(CalcOperator {
                    span: span!(self, span.lo),
                    value: CalcOperatorType::Add,
                })
            }
            tok!("-") => {
                bump!(self);

                Ok(CalcOperator {
                    span: span!(self, span.lo),
                    value: CalcOperatorType::Sub,
                })
            }
            tok!("*") => {
                bump!(self);

                Ok(CalcOperator {
                    span: span!(self, span.lo),
                    value: CalcOperatorType::Mul,
                })
            }
            tok!("/") => {
                bump!(self);

                Ok(CalcOperator {
                    span: span!(self, span.lo),
                    value: CalcOperatorType::Div,
                })
            }
            _ => {
                let span = self.input.cur_span()?;

                return Err(Error::new(
                    span,
                    ErrorKind::Expected("'+', '-', '*' or '/' delim tokens"),
                ));
            }
        }
    }
}

impl<I> Parse<CalcValue> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<CalcValue> {
        match cur!(self) {
            tok!("number") => Ok(CalcValue::Number(self.parse()?)),
            tok!("dimension") => Ok(CalcValue::Dimension(self.parse()?)),
            tok!("percentage") => Ok(CalcValue::Percentage(self.parse()?)),
            Token::Ident { value, .. } => {
                match &*value.to_ascii_lowercase() {
                    "e" | "pi" | "infinity" | "-infinity" | "nan" => {}
                    _ => {
                        let span = self.input.cur_span()?;

                        return Err(Error::new(
                            span,
                            ErrorKind::Expected(
                                "'e', 'pi', 'infinity', '-infinity' or 'NaN', ident tokens",
                            ),
                        ));
                    }
                }

                Ok(CalcValue::Constant(self.parse()?))
            }
            tok!("(") => {
                let span = self.input.cur_span()?;

                expect!(self, "(");

                self.input.skip_ws()?;

                let mut calc_sum_in_parens: CalcSum = self.parse()?;

                self.input.skip_ws()?;

                expect!(self, ")");

                calc_sum_in_parens.span = span!(self, span.lo);

                Ok(CalcValue::Sum(calc_sum_in_parens))
            }
            tok!("function") => Ok(CalcValue::Function(self.parse()?)),
            _ => {
                let span = self.input.cur_span()?;

                return Err(Error::new(
                    span,
                    ErrorKind::Expected(
                        "'number', 'dimension', 'percentage', 'ident', '(' or 'function' tokens",
                    ),
                ));
            }
        }
    }
}

fn is_length_unit(unit: &str) -> bool {
    matches!(
        &*unit.to_ascii_lowercase(),
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
        "cm" | "mm" | "q" | "in" | "pc" | "pt" | "px" | "mozmm"
    )
}

fn is_angle_unit(unit: &str) -> bool {
    matches!(&*unit.to_ascii_lowercase(), "deg" | "grad" | "rad" | "turn")
}

fn is_time_unit(unit: &str) -> bool {
    matches!(&*unit.to_ascii_lowercase(), "s" | "ms")
}

fn is_frequency_unit(unit: &str) -> bool {
    matches!(&*unit.to_ascii_lowercase(), "hz" | "khz")
}

fn is_resolution_unit(unit: &str) -> bool {
    matches!(&*unit.to_ascii_lowercase(), "dpi" | "dpcm" | "dppx" | "x")
}

fn is_flex_unit(unit: &str) -> bool {
    matches!(&*unit.to_ascii_lowercase(), "fr")
}
