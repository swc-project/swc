use swc_common::{BytePos, Span};
use swc_css_ast::*;

use super::{input::ParserInput, BlockContentsGrammar, Ctx, PResult, Parser};
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
    pub(super) fn parse_declaration_value(&mut self) -> PResult<Vec<ComponentValue>> {
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
                Some(token) => value.push(ComponentValue::PreservedToken(token)),
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

    pub fn parse_function_values(&mut self, function_name: &str) -> PResult<Vec<ComponentValue>> {
        let mut values = vec![];

        match function_name {
            "calc" | "-moz-calc" | "-webkit-calc" | "sin" | "cos" | "tan" | "asin" | "acos"
            | "atan" | "sqrt" | "exp" | "abs" | "sign" => {
                self.input.skip_ws()?;

                let calc_sum = ComponentValue::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws()?;
            }
            "min" | "max" | "hypot" => {
                self.input.skip_ws()?;

                let calc_sum = ComponentValue::CalcSum(self.parse()?);

                values.push(calc_sum);

                loop {
                    self.input.skip_ws()?;

                    if is!(self, ",") {
                        values.push(ComponentValue::Delimiter(self.parse()?));

                        self.input.skip_ws()?;
                    } else {
                        break;
                    }

                    let calc_sum = ComponentValue::CalcSum(self.parse()?);

                    values.push(calc_sum);
                }
            }
            "clamp" => {
                self.input.skip_ws()?;

                let calc_sum = ComponentValue::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws()?;

                if is!(self, ",") {
                    values.push(ComponentValue::Delimiter(self.parse()?));

                    self.input.skip_ws()?;
                } else {
                    let span = self.input.cur_span()?;

                    return Err(Error::new(span, ErrorKind::Expected("',' delim token")));
                }

                let calc_sum = ComponentValue::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws()?;

                if is!(self, ",") {
                    values.push(ComponentValue::Delimiter(self.parse()?));

                    self.input.skip_ws()?;
                } else {
                    let span = self.input.cur_span()?;

                    return Err(Error::new(span, ErrorKind::Expected("',' delim token")));
                }

                let calc_sum = ComponentValue::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws()?;
            }
            "round" => {
                self.input.skip_ws()?;

                if is!(self, "ident") {
                    // TODO improve me
                    let rounding_strategy = ComponentValue::Ident(self.parse()?);

                    values.push(rounding_strategy);

                    self.input.skip_ws()?;

                    if is!(self, ",") {
                        values.push(ComponentValue::Delimiter(self.parse()?));

                        self.input.skip_ws()?;
                    } else {
                        let span = self.input.cur_span()?;

                        return Err(Error::new(span, ErrorKind::Expected("',' delim token")));
                    }
                }

                let calc_sum = ComponentValue::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws()?;

                if is!(self, ",") {
                    values.push(ComponentValue::Delimiter(self.parse()?));

                    self.input.skip_ws()?;
                } else {
                    let span = self.input.cur_span()?;

                    return Err(Error::new(span, ErrorKind::Expected("',' delim token")));
                }

                let calc_sum = ComponentValue::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws()?;
            }
            "mod" | "rem" | "atan2" | "pow" => {
                self.input.skip_ws()?;

                let calc_sum = ComponentValue::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws()?;

                if is!(self, ",") {
                    values.push(ComponentValue::Delimiter(self.parse()?));

                    self.input.skip_ws()?;
                } else {
                    let span = self.input.cur_span()?;

                    return Err(Error::new(span, ErrorKind::Expected("',' delim token")));
                }

                let calc_sum = ComponentValue::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws()?;
            }
            "log" => {
                self.input.skip_ws()?;

                let calc_sum = ComponentValue::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws()?;

                if is!(self, ",") {
                    values.push(ComponentValue::Delimiter(self.parse()?));

                    self.input.skip_ws()?;

                    let calc_sum = ComponentValue::CalcSum(self.parse()?);

                    values.push(calc_sum);

                    self.input.skip_ws()?;
                }
            }
            "rgb" | "rgba" | "hsl" | "hsla" => {
                self.input.skip_ws()?;

                let mut is_legacy_syntax = true;

                match cur!(self) {
                    Token::Ident { value, .. } if &*value.to_lowercase() == "from" => {
                        is_legacy_syntax = false;

                        values.push(ComponentValue::Ident(self.parse()?));

                        self.input.skip_ws()?;

                        let color = self.try_parse_variable_function(|parser| {
                            Ok(ComponentValue::Color(parser.parse()?))
                        })?;

                        values.push(color);

                        self.input.skip_ws()?;
                    }
                    _ => {}
                }

                match function_name {
                    "rgb" | "rgba" => {
                        let percentage_or_number_or_none =
                            self.try_parse_variable_function(|parser| match cur!(parser) {
                                tok!("percentage") => {
                                    Ok(ComponentValue::Percentage(parser.parse()?))
                                }
                                tok!("number") => Ok(ComponentValue::Number(parser.parse()?)),
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(ComponentValue::Function(parser.parse()?))
                                }
                                tok!("ident") => {
                                    is_legacy_syntax = false;

                                    let ident: Ident = parser.parse()?;

                                    if ident.value.eq_str_ignore_ascii_case("none") {
                                        Ok(ComponentValue::Ident(ident))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                _ => Err(Error::new(
                                    parser.input.cur_span()?,
                                    ErrorKind::Expected(
                                        "percentage, number, function (math functions) or ident \
                                         (with 'none' value) token",
                                    ),
                                )),
                            })?;

                        values.push(percentage_or_number_or_none);
                    }
                    "hsl" | "hsla" => {
                        let hue_or_none =
                            self.try_parse_variable_function(|parser| match cur!(parser) {
                                tok!("number") | tok!("dimension") => {
                                    Ok(ComponentValue::Hue(parser.parse()?))
                                }
                                tok!("ident") => {
                                    let ident: Ident = parser.parse()?;

                                    if ident.value.eq_str_ignore_ascii_case("none") {
                                        Ok(ComponentValue::Ident(ident))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(ComponentValue::Function(parser.parse()?))
                                }
                                _ => Err(Error::new(
                                    parser.input.cur_span()?,
                                    ErrorKind::Expected(
                                        "number, dimension, function (math functions) or ident \
                                         (with 'none' value) token",
                                    ),
                                )),
                            })?;

                        values.push(hue_or_none);
                    }
                    _ => {
                        unreachable!()
                    }
                }

                self.input.skip_ws()?;

                if is!(self, ",") {
                    if !is_legacy_syntax {
                        let span = self.input.cur_span()?;

                        return Err(Error::new(span, ErrorKind::Expected("comma token")));
                    }

                    is_legacy_syntax = true;

                    values.push(ComponentValue::Delimiter(self.parse()?));

                    self.input.skip_ws()?;
                } else {
                    is_legacy_syntax = false;
                }

                match function_name {
                    "rgb" | "rgba" => {
                        let percentage_or_number =
                            self.try_parse_variable_function(|parser| match cur!(parser) {
                                tok!("percentage") => {
                                    Ok(ComponentValue::Percentage(parser.parse()?))
                                }
                                tok!("number") => Ok(ComponentValue::Number(parser.parse()?)),
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(ComponentValue::Function(parser.parse()?))
                                }
                                tok!("ident") if !is_legacy_syntax => {
                                    let ident: Ident = parser.parse()?;

                                    if ident.value.eq_str_ignore_ascii_case("none") {
                                        Ok(ComponentValue::Ident(ident))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                _ => Err(Error::new(
                                    parser.input.cur_span()?,
                                    ErrorKind::Expected(
                                        "percentage, number, function (math functions) or ident \
                                         (with 'none' value) token",
                                    ),
                                )),
                            })?;

                        values.push(percentage_or_number);
                    }
                    "hsl" | "hsla" => {
                        let percentage_or_none =
                            self.try_parse_variable_function(|parser| match cur!(parser) {
                                tok!("percentage") => {
                                    Ok(ComponentValue::Percentage(parser.parse()?))
                                }
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(ComponentValue::Function(parser.parse()?))
                                }
                                tok!("ident") => {
                                    let ident: Ident = parser.parse()?;

                                    if ident.value.eq_str_ignore_ascii_case("none") {
                                        Ok(ComponentValue::Ident(ident))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                _ => Err(Error::new(
                                    parser.input.cur_span()?,
                                    ErrorKind::Expected(
                                        "percentage, function (math functions) or ident (with \
                                         'none' value) token",
                                    ),
                                )),
                            })?;

                        values.push(percentage_or_none);
                    }
                    _ => {
                        unreachable!();
                    }
                }

                self.input.skip_ws()?;

                if is_legacy_syntax {
                    match cur!(self) {
                        tok!(",") => {
                            values.push(ComponentValue::Delimiter(self.parse()?));

                            self.input.skip_ws()?;
                        }
                        _ => {
                            let span = self.input.cur_span()?;

                            return Err(Error::new(span, ErrorKind::Expected("comma token")));
                        }
                    }
                }

                match function_name {
                    "rgb" | "rgba" => {
                        let percentage_or_number =
                            self.try_parse_variable_function(|parser| match cur!(parser) {
                                tok!("percentage") => {
                                    Ok(ComponentValue::Percentage(parser.parse()?))
                                }
                                tok!("number") => Ok(ComponentValue::Number(parser.parse()?)),
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(ComponentValue::Function(parser.parse()?))
                                }
                                tok!("ident") if !is_legacy_syntax => {
                                    let ident: Ident = parser.parse()?;

                                    if ident.value.eq_str_ignore_ascii_case("none") {
                                        Ok(ComponentValue::Ident(ident))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                _ => Err(Error::new(
                                    parser.input.cur_span()?,
                                    ErrorKind::Expected(
                                        "percentage, number, function (math functions) or ident \
                                         (with 'none' value) token",
                                    ),
                                )),
                            })?;

                        values.push(percentage_or_number);
                    }
                    "hsl" | "hsla" => {
                        let percentage_or_none =
                            self.try_parse_variable_function(|parser| match cur!(parser) {
                                tok!("percentage") => {
                                    Ok(ComponentValue::Percentage(parser.parse()?))
                                }
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(ComponentValue::Function(parser.parse()?))
                                }
                                tok!("ident") => {
                                    let ident: Ident = parser.parse()?;

                                    if ident.value.eq_str_ignore_ascii_case("none") {
                                        Ok(ComponentValue::Ident(ident))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                _ => Err(Error::new(
                                    parser.input.cur_span()?,
                                    ErrorKind::Expected(
                                        "percentage, function (math functions) or ident (with \
                                         'none' value) token",
                                    ),
                                )),
                            })?;

                        values.push(percentage_or_none);
                    }
                    _ => {
                        unreachable!();
                    }
                }

                self.input.skip_ws()?;

                if is!(self, ",") && is_legacy_syntax {
                    values.push(ComponentValue::Delimiter(self.parse()?));

                    self.input.skip_ws()?;

                    let alpha_value =
                        self.try_parse_variable_function(|parser| match cur!(parser) {
                            tok!("number") | tok!("percentage") => {
                                Ok(ComponentValue::AlphaValue(parser.parse()?))
                            }
                            Token::Function { value, .. } if is_math_function(value) => {
                                Ok(ComponentValue::Function(parser.parse()?))
                            }
                            _ => Err(Error::new(
                                parser.input.cur_span()?,
                                ErrorKind::Expected(
                                    "percentage, function (math functions) or number token",
                                ),
                            )),
                        })?;

                    values.push(alpha_value);

                    self.input.skip_ws()?;
                } else if is!(self, "/") && !is_legacy_syntax {
                    values.push(ComponentValue::Delimiter(self.parse()?));

                    self.input.skip_ws()?;

                    let alpha_value =
                        self.try_parse_variable_function(|parser| match cur!(parser) {
                            tok!("number") | tok!("percentage") => {
                                Ok(ComponentValue::AlphaValue(parser.parse()?))
                            }
                            Token::Function { value, .. } if is_math_function(value) => {
                                Ok(ComponentValue::Function(parser.parse()?))
                            }
                            tok!("ident") => {
                                let ident: Ident = parser.parse()?;

                                if ident.value.eq_str_ignore_ascii_case("none") {
                                    Ok(ComponentValue::Ident(ident))
                                } else {
                                    Err(Error::new(
                                        ident.span,
                                        ErrorKind::Expected("'none' value of an ident token"),
                                    ))
                                }
                            }
                            _ => Err(Error::new(
                                parser.input.cur_span()?,
                                ErrorKind::Expected(
                                    "percentage, number, function (math functions) or ident (with \
                                     'none' value) token",
                                ),
                            )),
                        })?;

                    values.push(alpha_value);

                    self.input.skip_ws()?;
                }
            }
            "hwb" | "lab" | "lch" | "oklab" | "oklch" | "device-cmyk" => {
                self.input.skip_ws()?;

                match cur!(self) {
                    Token::Ident { value, .. }
                        if &*value.to_lowercase() == "from" && function_name != "device-cmyk" =>
                    {
                        values.push(ComponentValue::Ident(self.parse()?));

                        self.input.skip_ws()?;

                        let color = match cur!(self) {
                            Token::Function { value, .. }
                                if matches!(&*value.to_lowercase(), "var" | "env") =>
                            {
                                ComponentValue::Function(self.parse()?)
                            }
                            _ => ComponentValue::Color(self.parse()?),
                        };

                        values.push(color);

                        self.input.skip_ws()?;
                    }
                    _ => {}
                }

                match function_name {
                    "hwb" => {
                        let hue_or_none =
                            self.try_parse_variable_function(|parser| match cur!(parser) {
                                tok!("number") | tok!("dimension") => {
                                    Ok(ComponentValue::Hue(parser.parse()?))
                                }
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(ComponentValue::Function(parser.parse()?))
                                }
                                tok!("ident") => {
                                    let ident: Ident = parser.parse()?;

                                    if ident.value.eq_str_ignore_ascii_case("none") {
                                        Ok(ComponentValue::Ident(ident))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                _ => {
                                    return Err(Error::new(
                                        parser.input.cur_span()?,
                                        ErrorKind::Expected(
                                            "number, dimension, function (math functions) or \
                                             ident (with 'none' value) token",
                                        ),
                                    ));
                                }
                            })?;

                        values.push(hue_or_none);
                    }
                    "lab" | "lch" | "oklab" | "oklch" => {
                        let percentage_or_none =
                            self.try_parse_variable_function(|parser| match cur!(parser) {
                                tok!("percentage") => {
                                    Ok(ComponentValue::Percentage(parser.parse()?))
                                }
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(ComponentValue::Function(parser.parse()?))
                                }
                                tok!("ident") => {
                                    let ident: Ident = parser.parse()?;

                                    if ident.value.eq_str_ignore_ascii_case("none") {
                                        Ok(ComponentValue::Ident(ident))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                _ => Err(Error::new(
                                    parser.input.cur_span()?,
                                    ErrorKind::Expected(
                                        "percentage, function (math functions) or ident (with \
                                         'none' value) token",
                                    ),
                                )),
                            })?;

                        values.push(percentage_or_none);
                    }
                    "device-cmyk" => {
                        let cmyk_component = self.try_parse_variable_function(|parser| {
                            Ok(ComponentValue::CmykComponent(parser.parse()?))
                        })?;

                        values.push(cmyk_component);
                    }
                    _ => {
                        unreachable!();
                    }
                }

                self.input.skip_ws()?;

                match function_name {
                    "hwb" => {
                        let percentage_or_none =
                            self.try_parse_variable_function(|parser| match cur!(parser) {
                                tok!("percentage") => {
                                    Ok(ComponentValue::Percentage(parser.parse()?))
                                }
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(ComponentValue::Function(parser.parse()?))
                                }
                                tok!("ident") => {
                                    let ident: Ident = parser.parse()?;

                                    if ident.value.eq_str_ignore_ascii_case("none") {
                                        Ok(ComponentValue::Ident(ident))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                _ => Err(Error::new(
                                    parser.input.cur_span()?,
                                    ErrorKind::Expected(
                                        "percentage, functions (math functions) or ident (with \
                                         'none' value) token",
                                    ),
                                )),
                            })?;

                        values.push(percentage_or_none);
                    }
                    "lab" | "lch" | "oklab" | "oklch" => {
                        let number_or_none =
                            self.try_parse_variable_function(|parser| match cur!(parser) {
                                tok!("number") => Ok(ComponentValue::Number(parser.parse()?)),
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(ComponentValue::Function(parser.parse()?))
                                }
                                tok!("ident") => {
                                    let ident: Ident = parser.parse()?;

                                    if ident.value.eq_str_ignore_ascii_case("none") {
                                        Ok(ComponentValue::Ident(ident))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                _ => Err(Error::new(
                                    parser.input.cur_span()?,
                                    ErrorKind::Expected(
                                        "number, functions (math functions) or ident (with 'none' \
                                         value) token",
                                    ),
                                )),
                            })?;

                        values.push(number_or_none);
                    }
                    "device-cmyk" => {
                        let cmyk_component = self.try_parse_variable_function(|parser| {
                            Ok(ComponentValue::CmykComponent(parser.parse()?))
                        })?;

                        values.push(cmyk_component);
                    }
                    _ => {
                        unreachable!();
                    }
                }

                self.input.skip_ws()?;

                match function_name {
                    "hwb" => {
                        let percentage_or_none =
                            self.try_parse_variable_function(|parser| match cur!(parser) {
                                tok!("percentage") => {
                                    Ok(ComponentValue::Percentage(parser.parse()?))
                                }
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(ComponentValue::Function(parser.parse()?))
                                }
                                tok!("ident") => {
                                    let ident: Ident = parser.parse()?;

                                    if ident.value.eq_str_ignore_ascii_case("none") {
                                        Ok(ComponentValue::Ident(ident))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                _ => Err(Error::new(
                                    parser.input.cur_span()?,
                                    ErrorKind::Expected(
                                        "percentage, functions (math functions) or ident (with \
                                         'none' value) token",
                                    ),
                                )),
                            })?;

                        values.push(percentage_or_none);
                    }
                    "lab" | "oklab" => {
                        let number_or_none =
                            self.try_parse_variable_function(|parser| match cur!(parser) {
                                tok!("number") => Ok(ComponentValue::Number(parser.parse()?)),
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(ComponentValue::Function(parser.parse()?))
                                }
                                tok!("ident") => {
                                    let ident: Ident = parser.parse()?;

                                    if ident.value.eq_str_ignore_ascii_case("none") {
                                        Ok(ComponentValue::Ident(ident))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                _ => Err(Error::new(
                                    parser.input.cur_span()?,
                                    ErrorKind::Expected(
                                        "number, function (math functions) or ident (with 'none' \
                                         value) token",
                                    ),
                                )),
                            })?;

                        values.push(number_or_none);
                    }
                    "lch" | "oklch" => {
                        let hue_or_none =
                            self.try_parse_variable_function(|parser| match cur!(parser) {
                                tok!("number") | tok!("dimension") => {
                                    Ok(ComponentValue::Hue(parser.parse()?))
                                }
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(ComponentValue::Function(parser.parse()?))
                                }
                                tok!("ident") => {
                                    let ident: Ident = parser.parse()?;

                                    if ident.value.eq_str_ignore_ascii_case("none") {
                                        Ok(ComponentValue::Ident(ident))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                _ => {
                                    return Err(Error::new(
                                        parser.input.cur_span()?,
                                        ErrorKind::Expected(
                                            "number, dimension, functions (math functions) or \
                                             ident (with 'none' value) token",
                                        ),
                                    ));
                                }
                            })?;

                        values.push(hue_or_none);
                    }
                    "device-cmyk" => {
                        let cmyk_component = self.try_parse_variable_function(|parser| {
                            Ok(ComponentValue::CmykComponent(parser.parse()?))
                        })?;

                        values.push(cmyk_component);
                    }
                    _ => {
                        unreachable!();
                    }
                }

                self.input.skip_ws()?;

                if function_name == "device-cmyk" {
                    let cmyk_component = self.try_parse_variable_function(|parser| {
                        Ok(ComponentValue::CmykComponent(parser.parse()?))
                    })?;

                    values.push(cmyk_component);

                    self.input.skip_ws()?;
                }

                if is!(self, "/") {
                    values.push(ComponentValue::Delimiter(self.parse()?));

                    self.input.skip_ws()?;

                    let alpha_value =
                        self.try_parse_variable_function(|parser| match cur!(parser) {
                            tok!("number") | tok!("percentage") => {
                                Ok(ComponentValue::AlphaValue(parser.parse()?))
                            }
                            Token::Function { value, .. } if is_math_function(value) => {
                                Ok(ComponentValue::Function(parser.parse()?))
                            }
                            tok!("ident") if !matches!(function_name, "device-cmyk") => {
                                let ident: Ident = parser.parse()?;

                                if ident.value.eq_str_ignore_ascii_case("none") {
                                    Ok(ComponentValue::Ident(ident))
                                } else {
                                    Err(Error::new(
                                        ident.span,
                                        ErrorKind::Expected("'none' value of an ident token"),
                                    ))
                                }
                            }
                            _ => Err(Error::new(
                                parser.input.cur_span()?,
                                ErrorKind::Expected(
                                    "percentage, number, functions (math functions) or ident \
                                     (with 'none' value) token",
                                ),
                            )),
                        })?;

                    values.push(alpha_value);

                    self.input.skip_ws()?;
                }
            }
            "color" => {
                self.input.skip_ws()?;

                match cur!(self) {
                    Token::Ident { value, .. } if &*value.to_lowercase() == "from" => {
                        values.push(self.try_parse_variable_function(|parser| {
                            Ok(ComponentValue::Ident(parser.parse()?))
                        })?);

                        self.input.skip_ws()?;

                        let color = self.try_parse_variable_function(|parser| {
                            Ok(ComponentValue::Color(parser.parse()?))
                        })?;

                        values.push(color);

                        self.input.skip_ws()?;
                    }
                    _ => {}
                }

                let mut is_custom_params = false;
                let mut is_xyz = false;

                let ident = self.try_parse_variable_function(|parser| match cur!(parser) {
                    Token::Ident { value, .. } => {
                        if value.starts_with("--") {
                            is_custom_params = true;

                            Ok(ComponentValue::DashedIdent(parser.parse()?))
                        } else {
                            match &*value.to_ascii_lowercase() {
                                "xyz" | "xyz-d50" | "xyz-d65" => is_xyz = true,
                                _ => {
                                    // There are predefined-rgb-params , but
                                    // For unknown, we don't return an error to
                                    // continue to support invalid color,
                                    // because they fallback in browser
                                }
                            }

                            Ok(ComponentValue::Ident(parser.parse()?))
                        }
                    }
                    _ => Err(Error::new(
                        parser.input.cur_span()?,
                        ErrorKind::Expected("ident token"),
                    )),
                })?;

                values.push(ident);

                self.input.skip_ws()?;

                let number_or_percentage_or_none =
                    self.try_parse_variable_function(|parser| match cur!(parser) {
                        tok!("number") => Ok(ComponentValue::Number(parser.parse()?)),
                        tok!("percentage") if !is_xyz => {
                            Ok(ComponentValue::Percentage(parser.parse()?))
                        }
                        Token::Function { value, .. } if is_math_function(value) => {
                            Ok(ComponentValue::Function(parser.parse()?))
                        }
                        tok!("ident") => {
                            let ident: Ident = parser.parse()?;

                            if ident.value.eq_str_ignore_ascii_case("none") {
                                Ok(ComponentValue::Ident(ident))
                            } else {
                                Err(Error::new(
                                    ident.span,
                                    ErrorKind::Expected("'none' value of an ident token"),
                                ))
                            }
                        }
                        _ => Err(Error::new(
                            parser.input.cur_span()?,
                            ErrorKind::Expected(
                                "percentage, function (math functions) or ident (with 'none' \
                                 value) token",
                            ),
                        )),
                    })?;

                values.push(number_or_percentage_or_none);

                self.input.skip_ws()?;

                if is_custom_params {
                    loop {
                        let number_or_percentage_or_none = match cur!(self) {
                            tok!("number") => ComponentValue::Number(self.parse()?),
                            tok!("percentage") if !is_xyz => {
                                ComponentValue::Percentage(self.parse()?)
                            }
                            Token::Function { value, .. }
                                if is_math_function(value)
                                    || value.eq_str_ignore_ascii_case("var")
                                    || value.eq_str_ignore_ascii_case("env") =>
                            {
                                ComponentValue::Function(self.parse()?)
                            }
                            tok!("ident") => {
                                let ident: Ident = self.parse()?;

                                if ident.value.eq_str_ignore_ascii_case("none") {
                                    ComponentValue::Ident(ident)
                                } else {
                                    return Err(Error::new(
                                        ident.span,
                                        ErrorKind::Expected("'none' value of an ident token"),
                                    ));
                                }
                            }
                            _ => {
                                break;
                            }
                        };

                        values.push(number_or_percentage_or_none);

                        self.input.skip_ws()?;
                    }
                } else {
                    let number_or_percentage_or_none =
                        self.try_parse_variable_function(|parser| match cur!(parser) {
                            tok!("number") => Ok(ComponentValue::Number(parser.parse()?)),
                            tok!("percentage") if !is_xyz => {
                                Ok(ComponentValue::Percentage(parser.parse()?))
                            }
                            Token::Function { value, .. } if is_math_function(value) => {
                                Ok(ComponentValue::Function(parser.parse()?))
                            }
                            tok!("ident") => {
                                let ident: Ident = parser.parse()?;

                                if ident.value.eq_str_ignore_ascii_case("none") {
                                    Ok(ComponentValue::Ident(ident))
                                } else {
                                    Err(Error::new(
                                        ident.span,
                                        ErrorKind::Expected("'none' value of an ident token"),
                                    ))
                                }
                            }
                            _ => Err(Error::new(
                                parser.input.cur_span()?,
                                ErrorKind::Expected(
                                    "percentage, function (math functions) or ident (with 'none' \
                                     value) token",
                                ),
                            )),
                        })?;

                    values.push(number_or_percentage_or_none);

                    self.input.skip_ws()?;

                    let number_or_percentage_or_none =
                        self.try_parse_variable_function(|parser| match cur!(parser) {
                            tok!("number") => Ok(ComponentValue::Number(parser.parse()?)),
                            tok!("percentage") if !is_xyz => {
                                Ok(ComponentValue::Percentage(parser.parse()?))
                            }
                            tok!("ident") => {
                                let ident: Ident = parser.parse()?;

                                if ident.value.eq_str_ignore_ascii_case("none") {
                                    Ok(ComponentValue::Ident(ident))
                                } else {
                                    Err(Error::new(
                                        ident.span,
                                        ErrorKind::Expected("'none' value of an ident token"),
                                    ))
                                }
                            }
                            Token::Function { value, .. } if is_math_function(value) => {
                                Ok(ComponentValue::Function(parser.parse()?))
                            }
                            _ => Err(Error::new(
                                parser.input.cur_span()?,
                                ErrorKind::Expected(
                                    "percentage, function (math functions) or ident (with 'none' \
                                     value) token",
                                ),
                            )),
                        })?;

                    values.push(number_or_percentage_or_none);

                    self.input.skip_ws()?;
                }

                if is!(self, "/") {
                    values.push(ComponentValue::Delimiter(self.parse()?));

                    self.input.skip_ws()?;

                    let alpha_value =
                        self.try_parse_variable_function(|parser| match cur!(parser) {
                            tok!("number") | tok!("percentage") => {
                                Ok(ComponentValue::AlphaValue(parser.parse()?))
                            }
                            Token::Function { value, .. } if is_math_function(value) => {
                                Ok(ComponentValue::Function(parser.parse()?))
                            }
                            tok!("ident") if !matches!(function_name, "device-cmyk") => {
                                let ident: Ident = parser.parse()?;

                                if ident.value.eq_str_ignore_ascii_case("none") {
                                    Ok(ComponentValue::Ident(ident))
                                } else {
                                    Err(Error::new(
                                        ident.span,
                                        ErrorKind::Expected("'none' value of an ident token"),
                                    ))
                                }
                            }
                            _ => Err(Error::new(
                                parser.input.cur_span()?,
                                ErrorKind::Expected(
                                    "percentage, number, function (math functions) or ident (with \
                                     'none' value) token",
                                ),
                            )),
                        })?;

                    values.push(alpha_value);

                    self.input.skip_ws()?;
                }

                self.input.skip_ws()?;
            }
            "selector" if self.ctx.in_supports_at_rule => {
                self.input.skip_ws()?;

                let selector = ComponentValue::ComplexSelector(self.parse()?);

                values.push(selector);

                self.input.skip_ws()?;
            }
            _ => loop {
                self.input.skip_ws()?;

                if is!(self, ")") {
                    break;
                }

                let ctx = Ctx {
                    block_contents_grammar: BlockContentsGrammar::DeclarationValue,
                    ..self.ctx
                };

                values.push(self.with_ctx(ctx).parse_as::<ComponentValue>()?);
            },
        };

        Ok(values)
    }

    fn try_parse_variable_function<F>(&mut self, mut fallback: F) -> PResult<ComponentValue>
    where
        F: FnMut(&mut Parser<I>) -> PResult<ComponentValue>,
    {
        match cur!(self) {
            Token::Function { value, .. }
                if value.eq_str_ignore_ascii_case("var")
                    || value.eq_str_ignore_ascii_case("env") =>
            {
                Ok(ComponentValue::Function(self.parse()?))
            }
            _ => fallback(self),
        }
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

impl<I> Parse<Integer> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Integer> {
        let span = self.input.cur_span()?;

        if !is!(self, Number) {
            return Err(Error::new(span, ErrorKind::ExpectedNumber));
        }

        let value = bump!(self);

        match value {
            Token::Number {
                value,
                raw,
                type_flag,
                ..
            } => {
                if type_flag == NumberType::Number {
                    return Err(Error::new(span, ErrorKind::Expected("integer type")));
                }

                Ok(Integer {
                    span,
                    value: value.round() as i64,
                    raw,
                })
            }
            _ => {
                unreachable!()
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
                        return Err(Error::new(span, ErrorKind::InvalidCustomIdent(raw)));
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

impl<I> Parse<CustomPropertyName> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<CustomPropertyName> {
        let span = self.input.cur_span()?;

        if !is!(self, Ident) {
            return Err(Error::new(span, ErrorKind::Expected("Ident")));
        }

        match bump!(self) {
            Token::Ident { value, raw } => {
                if !value.starts_with("--") {
                    return Err(Error::new(
                        span,
                        ErrorKind::Expected("'--' at the start of custom property name"),
                    ));
                } else if &*value == "--" {
                    return Err(Error::new(
                        span,
                        ErrorKind::Expected("valid dashed, '--' is not valid custom property name"),
                    ));
                }

                Ok(CustomPropertyName { span, value, raw })
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

impl<I> Parse<Color> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Color> {
        let span = self.input.cur_span()?;

        match cur!(self) {
            // currentcolor | <system-color>
            Token::Ident { value, .. }
                if value.as_ref().eq_ignore_ascii_case("currentcolor")
                    || is_system_color(value) =>
            {
                Ok(Color::CurrentColorOrSystemColor(self.parse()?))
            }
            // <device-cmyk()>
            Token::Function { value, .. } if value.as_ref().eq_ignore_ascii_case("device-cmyk") => {
                Ok(Color::Function(self.parse()?))
            }
            // <absolute-color-base>
            _ => match self.parse() {
                Ok(absolute_color_base) => Ok(Color::AbsoluteColorBase(absolute_color_base)),
                Err(_) => {
                    return Err(Error::new(
                        span,
                        ErrorKind::Expected(
                            "hash, ident (with named color, system color, 'transparent' or \
                             'currentColor' value) or function (with color function name) token",
                        ),
                    ));
                }
            },
        }
    }
}

impl<I> Parse<AbsoluteColorBase> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<AbsoluteColorBase> {
        let span = self.input.cur_span()?;

        match cur!(self) {
            tok!("#") => Ok(AbsoluteColorBase::HexColor(self.parse()?)),
            Token::Ident { value, .. } => {
                if !(is_named_color(value) || value.as_ref().eq_ignore_ascii_case("transparent")) {
                    let span = self.input.cur_span()?;

                    return Err(Error::new(
                        span,
                        ErrorKind::Expected("known named color or 'transparent' keyword"),
                    ));
                }

                Ok(AbsoluteColorBase::NamedColorOrTransparent(self.parse()?))
            }
            Token::Function { value, .. } if is_absolute_color_base_function(value) => {
                Ok(AbsoluteColorBase::Function(self.parse()?))
            }
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected(
                        "hash, ident (with named color or 'transparent' value) or function (with \
                         color function name) token",
                    ),
                ));
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

impl<I> Parse<AlphaValue> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<AlphaValue> {
        if !is_one_of!(self, "percentage", "number") {
            let span = self.input.cur_span()?;

            return Err(Error::new(
                span,
                ErrorKind::Expected("percentage or number token"),
            ));
        }

        match cur!(self) {
            tok!("percentage") => Ok(AlphaValue::Percentage(self.parse()?)),
            tok!("number") => Ok(AlphaValue::Number(self.parse()?)),
            _ => {
                unreachable!()
            }
        }
    }
}

impl<I> Parse<Hue> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Hue> {
        if !is_one_of!(self, "number", "dimension") {
            let span = self.input.cur_span()?;

            return Err(Error::new(
                span,
                ErrorKind::Expected("number or dimension token"),
            ));
        }

        match cur!(self) {
            tok!("number") => Ok(Hue::Number(self.parse()?)),
            tok!("dimension") => Ok(Hue::Angle(self.parse()?)),
            _ => {
                unreachable!()
            }
        }
    }
}

impl<I> Parse<CmykComponent> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<CmykComponent> {
        if !is_one_of!(self, "number", "percentage", "function") {
            let span = self.input.cur_span()?;

            return Err(Error::new(
                span,
                ErrorKind::Expected("number, function or percentage token"),
            ));
        }

        match cur!(self) {
            tok!("number") => Ok(CmykComponent::Number(self.parse()?)),
            tok!("percentage") => Ok(CmykComponent::Percentage(self.parse()?)),
            Token::Function { value, .. } => {
                if !is_math_function(value) {
                    let span = self.input.cur_span()?;

                    return Err(Error::new(span, ErrorKind::Expected("math function token")));
                }

                Ok(CmykComponent::Function(self.parse()?))
            }
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
            return Err(Error::new(
                span,
                ErrorKind::Expected("url or function (with 'url' or 'src' name) token"),
            ));
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
                    return Err(Error::new(
                        span,
                        ErrorKind::Expected("'url' or 'src' name of a function token"),
                    ));
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
                _ => match self.ctx.block_contents_grammar {
                    BlockContentsGrammar::NoGrammar => {
                        let ctx = Ctx {
                            block_contents_grammar: BlockContentsGrammar::NoGrammar,
                            ..self.ctx
                        };

                        let component_value = self.with_ctx(ctx).parse_as::<ComponentValue>()?;

                        function.value.push(component_value);
                    }
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

                                function.value.push(self.parse()?);
                            }
                        }
                    }
                },
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
impl<I> Parse<UnicodeRange> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<UnicodeRange> {
        let span = self.input.cur_span()?;
        let mut unicode_range = String::new();

        // should start with `u` or `U`
        match cur!(self) {
            Token::Ident { value, .. } if &*value.to_ascii_lowercase() == "u" => {
                let ident = match bump!(self) {
                    Token::Ident { value, .. } => value,
                    _ => {
                        unreachable!();
                    }
                };

                unicode_range.push_str(&ident);
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

                unicode_range.push(plus);

                if is!(self, Ident) {
                    let ident = match bump!(self) {
                        Token::Ident { value, .. } => value,
                        _ => {
                            unreachable!();
                        }
                    };

                    unicode_range.push_str(&ident);

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

                        unicode_range.push(question);
                    }
                } else {
                    let question = match bump!(self) {
                        Token::Delim { value } if value == '?' => value,
                        _ => {
                            return Err(Error::new(span, ErrorKind::Expected("'?' delim token")));
                        }
                    };

                    unicode_range.push(question);

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

                        unicode_range.push(question);
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

                unicode_range.push_str(&number);

                match cur!(self) {
                    tok!("?") => {
                        let question = match bump!(self) {
                            Token::Delim { value } => value,
                            _ => {
                                unreachable!();
                            }
                        };

                        unicode_range.push(question);

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

                            unicode_range.push(question);
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

                        unicode_range.push_str(&dimension.0);
                        unicode_range.push_str(&dimension.1);
                    }
                    tok!("number") => {
                        let number = match bump!(self) {
                            Token::Number { raw, .. } => raw,
                            _ => {
                                unreachable!();
                            }
                        };

                        unicode_range.push_str(&number);
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

                unicode_range.push_str(&dimension.0);
                unicode_range.push_str(&dimension.1);

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

                    unicode_range.push(question);
                }
            }
            _ => {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("dimension, number or '?' delim token"),
                ));
            }
        }

        let mut chars = unicode_range.chars();

        // 1. Skipping the first u token, concatenate the representations of all the
        // tokens in the production together. Let this be text.
        let prefix = chars.next().unwrap();

        let mut next = chars.next();

        // 2. If the first character of text is U+002B PLUS SIGN, consume it. Otherwise,
        // this is an invalid <urange>, and this algorithm must exit.
        if next != Some('+') {
            return Err(Error::new(
                span,
                ErrorKind::Expected("'+' character after 'u' in unicode range"),
            ));
        } else {
            next = chars.next();
        }

        // 3. Consume as many hex digits from text as possible. then consume as many
        // U+003F QUESTION MARK (?) code points as possible. If zero code points
        // were consumed, or more than six code points were consumed, this is an
        // invalid <urange>, and this algorithm must exit.
        let mut start = String::new();

        loop {
            match next {
                Some(c) if c.is_ascii_digit() => {
                    start.push(c);

                    next = chars.next();
                }
                Some(c @ 'A'..='F') | Some(c @ 'a'..='f') => {
                    start.push(c);

                    next = chars.next();
                }
                _ => {
                    break;
                }
            }
        }

        let mut has_question_mark = false;

        while let Some(c @ '?') = next {
            has_question_mark = true;

            start.push(c);

            next = chars.next();
        }

        let len = start.len();

        if len == 0 || len > 6 {
            return Err(Error::new(
                span,
                ErrorKind::Expected(
                    "valid length (minimum 1 or maximum 6 hex digits) in the start of unicode \
                     range",
                ),
            ));
        }

        // If any U+003F QUESTION MARK (?) code points were consumed, then:
        if has_question_mark {
            // 1. If there are any code points left in text, this is an invalid <urange>,
            // and this algorithm must exit.
            if next != None {
                return Err(Error::new(
                    span,
                    ErrorKind::Expected("no characters after '?' in unicode range"),
                ));
            }

            // 2. Interpret the consumed code points
            // as a hexadecimal number, with the U+003F QUESTION MARK (?) code points
            // replaced by U+0030 DIGIT ZERO (0) code points. This is the start value.
            //
            // 3. Interpret the consumed code points as a hexadecimal number again, with the
            // U+003F QUESTION MARK (?) code points replaced by U+0046 LATIN CAPITAL LETTER
            // F (F) code points. This is the end value.
            //

            // 4. Exit this algorithm.
            return Ok(UnicodeRange {
                span: span!(self, span.lo),
                prefix,
                start: start.into(),
                end: None,
            });
        }

        // Otherwise, interpret the consumed code points as a hexadecimal number. This
        // is the start value.

        // 4. If there are no code points left in text, The end value is the same as the
        // start value. Exit this algorithm.
        if next == None {
            return Ok(UnicodeRange {
                span: span!(self, span.lo),
                prefix,
                start: start.into(),
                end: None,
            });
        }

        // 5. If the next code point in text is U+002D HYPHEN-MINUS (-), consume it.
        // Otherwise, this is an invalid <urange>, and this algorithm must exit.
        if next != Some('-') {
            return Err(Error::new(
                span,
                ErrorKind::Expected("'-' between start and end in unicode range"),
            ));
        } else {
            next = chars.next();
        }

        // 6. Consume as many hex digits as possible from text.
        // If zero hex digits were consumed, or more than 6 hex digits were consumed,
        // this is an invalid <urange>, and this algorithm must exit. If there are any
        // code points left in text, this is an invalid <urange>, and this algorithm
        // must exit.
        let mut end = String::new();

        loop {
            match next {
                Some(c) if c.is_ascii_digit() => {
                    end.push(c);
                    next = chars.next();
                }
                Some(c @ 'A'..='F') | Some(c @ 'a'..='f') => {
                    end.push(c);
                    next = chars.next();
                }
                _ => {
                    break;
                }
            }
        }

        let len = end.len();

        if len == 0 || len > 6 {
            return Err(Error::new(
                span,
                ErrorKind::Expected(
                    "valid length (minimum 1 or maximum 6 hex digits) in the end of unicode range",
                ),
            ));
        }

        if chars.next() != None {
            return Err(Error::new(
                span,
                ErrorKind::Expected("no characters after end in unicode range"),
            ));
        }

        return Ok(UnicodeRange {
            span: span!(self, span.lo),
            prefix,
            start: start.into(),
            end: Some(end.into()),
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

fn is_math_function(name: &str) -> bool {
    matches!(
        &*name.to_ascii_lowercase(),
        "calc"
            | "sin"
            | "cos"
            | "tan"
            | "asin"
            | "acos"
            | "atan"
            | "sqrt"
            | "exp"
            | "abs"
            | "sign"
            | "min"
            | "max"
            | "hypot"
            | "clamp"
            | "round"
            | "mod"
            | "rem"
            | "atan2"
            | "pow"
            | "log"
    )
}

fn is_absolute_color_base_function(name: &str) -> bool {
    matches!(
        &*name.to_ascii_lowercase(),
        "rgb"
            | "rgba"
            | "hsl"
            | "hsla"
            | "hwb"
            | "lab"
            | "lch"
            | "oklab"
            | "oklch"
            | "color"
            | "color-mix"
            | "color-contrast"
    )
}

fn is_system_color(name: &str) -> bool {
    matches!(
        &*name.to_ascii_lowercase(),
        "canvas"
            | "canvastext"
            | "linktext"
            | "visitedtext"
            | "activetext"
            | "buttonface"
            | "buttontext"
            | "buttonborder"
            | "field"
            | "fieldtext"
            | "highlight"
            | "highlighttext"
            | "selecteditem"
            | "selecteditemtext"
            | "mark"
            | "marktext"
            | "graytext"
            // Deprecated
            | "activeborder"
            | "activecaption"
            | "appWorkspace"
            | "background"
            | "buttonhighlight"
            | "buttonshadow"
            | "captiontext"
            | "inactiveborder"
            | "inactivecaption"
            | "inactivecaptiontext"
            | "infobackground"
            | "infotext"
            | "menu"
            | "menutext"
            | "scrollbar"
            | "threeddarkshadow"
            | "threedface"
            | "threedhighlight"
            | "threedlightshadow"
            | "threedshadow"
            | "window"
            | "windowframe"
            | "windowtext"
            // Mozilla System Color Extensions
            | "-moz-buttondefault"
            | "-moz-buttonhoverface"
            | "-moz-buttonhovertext"
            | "-moz-cellhighlight"
            | "-moz-cellhighlighttext"
            | "-moz-combobox"
            | "-moz-comboboxtext"
            | "-moz-dialog"
            | "-moz-dialogtext"
            | "-moz-dragtargetzone"
            | "-moz-eventreerow"
            | "-moz-html-cellhighlight"
            | "-moz-html-cellhighlighttext"
            | "-moz-mac-accentdarkestshadow"
            | "-moz-mac-accentdarkshadow"
            | "-moz-mac-accentface"
            | "-moz-mac-accentlightesthighlight"
            | "-moz-mac-accentlightshadow"
            | "-moz-mac-accentregularhighlight"
            | "-moz-mac-accentregularshadow"
            | "-moz-mac-chrome-active"
            | "-moz-mac-chrome-inactive"
            | "-moz-mac-focusring"
            | "-moz-mac-menuselect"
            | "-moz-mac-menushadow"
            | "-moz-mac-menutextselect"
            | "-moz-menuhover"
            | "-moz-menuhovertext"
            | "-moz-menubartext"
            | "-moz-menubarhovertext"
            | "-moz-nativehyperlinktext"
            | "-moz-oddtreerow"
            | "-moz-win-communicationstext"
            | "-moz-win-mediatext"
            | "-moz-win-accentcolor"
            | "-moz-win-accentcolortext"
            // Mozilla Color Preference Extensions
            | "-moz-activehyperlinktext"
            | "-moz-default-background-color"
            | "-moz-default-color"
            | "-moz-hyperlinktext"
            | "-moz-visitedhyperlinktext"
    )
}

fn is_named_color(name: &str) -> bool {
    matches!(
        &*name.to_ascii_lowercase(),
        "aliceblue"
            | "antiquewhite"
            | "aqua"
            | "aquamarine"
            | "azure"
            | "beige"
            | "bisque"
            | "black"
            | "blanchedalmond"
            | "blue"
            | "blueviolet"
            | "brown"
            | "burlywood"
            | "cadetblue"
            | "chartreuse"
            | "chocolate"
            | "coral"
            | "cornflowerblue"
            | "cornsilk"
            | "crimson"
            | "cyan"
            | "darkblue"
            | "darkcyan"
            | "darkgoldenrod"
            | "darkgray"
            | "darkgreen"
            | "darkgrey"
            | "darkkhaki"
            | "darkmagenta"
            | "darkolivegreen"
            | "darkorange"
            | "darkorchid"
            | "darkred"
            | "darksalmon"
            | "darkseagreen"
            | "darkslateblue"
            | "darkslategray"
            | "darkslategrey"
            | "darkturquoise"
            | "darkviolet"
            | "deeppink"
            | "deepskyblue"
            | "dimgray"
            | "dimgrey"
            | "dodgerblue"
            | "firebrick"
            | "floralwhite"
            | "forestgreen"
            | "fuchsia"
            | "gainsboro"
            | "ghostwhite"
            | "gold"
            | "goldenrod"
            | "gray"
            | "green"
            | "greenyellow"
            | "grey"
            | "honeydew"
            | "hotpink"
            | "indianred"
            | "indigo"
            | "ivory"
            | "khaki"
            | "lavender"
            | "lavenderblush"
            | "lawngreen"
            | "lemonchiffon"
            | "lightblue"
            | "lightcoral"
            | "lightcyan"
            | "lightgoldenrodyellow"
            | "lightgray"
            | "lightgreen"
            | "lightgrey"
            | "lightpink"
            | "lightsalmon"
            | "lightseagreen"
            | "lightskyblue"
            | "lightslategray"
            | "lightslategrey"
            | "lightsteelblue"
            | "lightyellow"
            | "lime"
            | "limegreen"
            | "linen"
            | "magenta"
            | "maroon"
            | "mediumaquamarine"
            | "mediumblue"
            | "mediumorchid"
            | "mediumpurple"
            | "mediumseagreen"
            | "mediumslateblue"
            | "mediumspringgreen"
            | "mediumturquoise"
            | "mediumvioletred"
            | "midnightblue"
            | "mintcream"
            | "mistyrose"
            | "moccasin"
            | "navajowhite"
            | "navy"
            | "oldlace"
            | "olive"
            | "olivedrab"
            | "orange"
            | "orangered"
            | "orchid"
            | "palegoldenrod"
            | "palegreen"
            | "paleturquoise"
            | "palevioletred"
            | "papayawhip"
            | "peachpuff"
            | "peru"
            | "pink"
            | "plum"
            | "powderblue"
            | "purple"
            | "rebeccapurple"
            | "red"
            | "rosybrown"
            | "royalblue"
            | "saddlebrown"
            | "salmon"
            | "sandybrown"
            | "seagreen"
            | "seashell"
            | "sienna"
            | "silver"
            | "skyblue"
            | "slateblue"
            | "slategray"
            | "slategrey"
            | "snow"
            | "springgreen"
            | "steelblue"
            | "tan"
            | "teal"
            | "thistle"
            | "tomato"
            | "turquoise"
            | "violet"
            | "wheat"
            | "white"
            | "whitesmoke"
            | "yellow"
            | "yellowgreen"
    )
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
