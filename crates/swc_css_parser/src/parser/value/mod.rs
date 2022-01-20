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
            if is_one_of!(self, EOF, ";", "}", "!", ")", "]") {
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
                    && !is_one_of!(self, EOF, ";", "}", "!", ")", "]")
                {
                    self.input.reset(&start);

                    let mut tokens = vec![];
                    while !is_one_of!(self, EOF, ";", "}", "!", ")", "]") {
                        tokens.extend(self.input.bump()?);
                    }

                    let span = span!(self, start_pos);
                    let v = Value::Lazy(Tokens { span, tokens });

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

    fn parse_one_value(&mut self) -> PResult<Value> {
        let span = self.input.cur_span()?;
        let value = self.parse_one_value_inner()?;

        let val = if self.ctx.allow_separating_value_with_space && eat!(self, " ") {
            self.input.skip_ws()?;

            let mut values = vec![value];

            loop {
                if !is_one_of!(self, Str, Num, Ident, Function, Dimension, "[", "(") {
                    break;
                }

                let value = self.parse_one_value_inner()?;

                values.push(value);

                self.input.skip_ws()?;
            }

            Value::Space(SpaceValues {
                span: span!(self, span.lo),
                values,
            })
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
        self.input.skip_ws()?;

        let span = self.input.cur_span()?;
        match cur!(self) {
            Token::Str { .. } => return Ok(Value::Str(self.parse()?)),

            Token::Num { .. } => return self.parse_numeric_value(),

            Token::Function { .. } => return Ok(Value::Function(self.parse()?)),

            Token::Percent { .. } => return self.parse_numeric_value(),

            Token::Dimension { .. } => return self.parse_numeric_value(),

            Token::Ident { .. } => return Ok(Value::Ident(self.parse()?)),

            tok!("[") => return self.parse_square_brackets_value().map(From::from),

            tok!("(") => return self.parse_round_brackets_value().map(From::from),

            tok!("{") => {
                return self.parse_brace_value().map(From::from);
            }

            Token::Hash { .. } => {
                let token = bump!(self);

                match token {
                    Token::Hash { value, raw, .. } => {
                        return Ok(Value::Hash(HashValue { span, value, raw }))
                    }
                    _ => {
                        unreachable!()
                    }
                }
            }

            Token::AtKeyword { .. } => {
                let name = bump!(self);
                let name = match name {
                    Token::AtKeyword { value, raw } => Ident { span, value, raw },
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

            Token::Url { .. } => return Ok(Value::Url(self.parse()?)),

            _ => {}
        }

        if is_one_of!(self, "<!--", "-->", "!", ";") {
            let token = self.input.bump()?.unwrap();
            return Ok(Value::Lazy(Tokens {
                span,
                tokens: vec![token],
            }));
        }

        Err(Error::new(span, ErrorKind::Expected("Declaration value")))
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

        Ok(base)
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
        let span = self.input.cur_span()?;

        match bump!(self) {
            Token::Percent { value, raw, .. } => {
                let value = Num {
                    span: swc_common::Span::new(span.lo, span.hi - BytePos(1), Default::default()),
                    value,
                    raw,
                };

                Ok(Value::Percent(PercentValue { span, value }))
            }
            Token::Dimension {
                value,
                raw_value,
                unit,
                raw_unit,
                ..
            } => {
                let unit_len = raw_unit.len() as u32;

                Ok(Value::Unit(UnitValue {
                    span,
                    value: Num {
                        value,
                        raw: raw_value,
                        span: swc_common::Span::new(
                            span.lo,
                            span.hi - BytePos(unit_len),
                            Default::default(),
                        ),
                    },
                    unit: Unit {
                        span: swc_common::Span::new(
                            span.hi - BytePos(unit_len),
                            span.hi,
                            Default::default(),
                        ),
                        value: unit,
                        raw: raw_unit,
                    },
                }))
            }
            Token::Num { value, raw, .. } => Ok(Value::Number(Num { span, value, raw })),
            _ => {
                unreachable!()
            }
        }
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

    fn parse_square_brackets_value(&mut self) -> PResult<SquareBracketBlock> {
        let span = self.input.cur_span()?;

        expect!(self, "[");

        self.input.skip_ws()?;

        let ctx = Ctx {
            allow_separating_value_with_space: false,
            ..self.ctx
        };

        let children = Some(self.with_ctx(ctx).parse_property_values()?.0);

        self.input.skip_ws()?;

        expect!(self, "]");

        Ok(SquareBracketBlock {
            span: span!(self, span.lo),
            children,
        })
    }

    fn parse_round_brackets_value(&mut self) -> PResult<RoundBracketBlock> {
        let span = self.input.cur_span()?;

        expect!(self, "(");

        self.input.skip_ws()?;

        let children = if is!(self, ")") {
            None
        } else {
            let ctx = Ctx {
                allow_operation_in_value: true,
                ..self.ctx
            };

            Some(self.with_ctx(ctx).parse_property_values()?.0)
        };

        expect!(self, ")");

        Ok(RoundBracketBlock {
            span: span!(self, span.lo),
            children,
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

                    simple_block.value.push(Value::Lazy(Tokens {
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
                    Some(t) => Ok(Value::Lazy(Tokens {
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
            Token::Num { value, raw, .. } => Ok(Num { span, value, raw }),
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

impl<I> Parse<PercentValue> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<PercentValue> {
        let span = self.input.cur_span()?;

        if !is!(self, Percent) {
            return Err(Error::new(span, ErrorKind::Expected("Percent")));
        }

        match bump!(self) {
            Token::Percent { value, raw } => {
                let value = Num {
                    span: swc_common::Span::new(span.lo, span.hi - BytePos(1), Default::default()),
                    value,
                    raw,
                };

                Ok(PercentValue { span, value })
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

impl<I> Parse<UrlValue> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<UrlValue> {
        let span = self.input.cur_span()?;

        if !is!(self, Url) {
            return Err(Error::new(span, ErrorKind::Expected("Url")));
        }

        match bump!(self) {
            Token::Url { value, raw } => Ok(UrlValue {
                span,
                url: value,
                raw,
            }),
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

        let name = match bump!(self) {
            Token::Function { value, raw } => (value, raw),
            _ => {
                unreachable!()
            }
        };

        let name = Ident {
            span: swc_common::Span::new(span.lo, span.hi - BytePos(1), Default::default()),
            value: name.0,
            raw: name.1,
        };
        let is_url = name.value.to_ascii_lowercase() == js_word!("url");
        let ctx = Ctx {
            allow_operation_in_value: !is_url,
            allow_separating_value_with_space: !is_url,
            allow_separating_value_with_comma: false,
            ..self.ctx
        };
        let value = self.with_ctx(ctx).parse_comma_separated_value()?;

        expect!(self, ")");

        Ok(Function {
            span: span!(self, span.lo),
            name,
            value,
        })
    }
}
