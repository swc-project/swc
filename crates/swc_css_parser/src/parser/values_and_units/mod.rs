use swc_atoms::JsWord;
use swc_common::{BytePos, Span};
use swc_css_ast::*;

use super::{input::ParserInput, PResult, Parser};
use crate::{
    error::{Error, ErrorKind},
    Parse,
};

impl<I> Parser<I>
where
    I: ParserInput,
{
    pub(super) fn parse_generic_values(&mut self) -> PResult<Vec<ComponentValue>> {
        let mut values = Vec::new();

        loop {
            self.input.skip_ws();

            if is!(self, EOF) {
                break;
            }

            let component_value = self.parse_generic_value()?;

            values.push(component_value);
        }

        Ok(values)
    }

    pub(super) fn parse_generic_value(&mut self) -> PResult<ComponentValue> {
        self.input.skip_ws();

        let span = self.input.cur_span();

        match cur!(self) {
            tok!(",") | tok!("/") | tok!(";") => {
                return Ok(ComponentValue::Delimiter(self.parse()?));
            }

            tok!("string") => {
                return Ok(ComponentValue::Str(self.parse()?));
            }

            tok!("url") => {
                return Ok(ComponentValue::Url(self.parse()?));
            }

            Token::Function { value, .. } => match &*value.to_ascii_lowercase() {
                "url" | "src" => {
                    return Ok(ComponentValue::Url(self.parse()?));
                }
                "rgb" | "rgba" | "hsl" | "hsla" | "hwb" | "lab" | "lch" | "oklab" | "oklch"
                | "color" | "device-cmyk" | "color-mix" | "color-contrast" => {
                    return Ok(ComponentValue::Color(self.parse()?));
                }
                _ => {
                    return Ok(ComponentValue::Function(self.parse()?));
                }
            },

            tok!("percentage") => {
                return Ok(ComponentValue::Percentage(self.parse()?));
            }

            tok!("dimension") => return Ok(ComponentValue::Dimension(self.parse()?)),

            Token::Number { type_flag, .. } => {
                if *type_flag == NumberType::Integer {
                    return Ok(ComponentValue::Integer(self.parse()?));
                }

                return Ok(ComponentValue::Number(self.parse()?));
            }

            Token::Ident { value, .. } => {
                if value.starts_with("--") {
                    return Ok(ComponentValue::DashedIdent(self.parse()?));
                } else if matches_eq_ignore_ascii_case!(value, "u")
                    && peeked_is_one_of!(self, "+", "number", "dimension")
                {
                    return Ok(ComponentValue::UnicodeRange(self.parse()?));
                }

                return Ok(ComponentValue::Ident(self.parse()?));
            }

            tok!("[") | tok!("(") | tok!("{") => {
                let mut block = self.parse_as::<SimpleBlock>()?;
                let locv = self.create_locv(block.value);

                block.value = match self
                    .parse_according_to_grammar(&locv, |parser| parser.parse_generic_values())
                {
                    Ok(values) => values,
                    Err(err) => {
                        if *err.kind() != ErrorKind::Ignore {
                            self.errors.push(err);
                        }

                        locv.children
                    }
                };

                return Ok(ComponentValue::SimpleBlock(Box::new(block)));
            }

            tok!("#") => {
                return Ok(ComponentValue::Color(self.parse()?));
            }

            _ => {}
        }

        Err(Error::new(span, ErrorKind::Expected("Declaration value")))
    }

    /// Parse value as <any-value>.
    pub(super) fn parse_any_value(&mut self) -> PResult<Vec<TokenAndSpan>> {
        let mut tokens = Vec::new();
        let mut balance_stack: Vec<Option<char>> = Vec::new();

        // The <any-value> production matches any sequence of one or more tokens,
        // so long as the sequence ...
        loop {
            if is!(self, EOF) {
                break;
            }

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

                    let balance_close_type = balance_stack.pop().unwrap_or_default();

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

            let token = self.input.bump();

            match token {
                Some(token) => tokens.push(token),
                None => break,
            }
        }

        Ok(tokens)
    }

    // TODO use `JsWord`
    pub fn parse_function_values(
        &mut self,
        function_name: &FunctionName,
    ) -> PResult<Vec<ComponentValue>> {
        let function_name = match function_name {
            FunctionName::Ident(name) => &name.value,
            FunctionName::DashedIdent(_) => {
                return Err(Error::new(Default::default(), ErrorKind::Ignore))
            }
        };

        let mut values = Vec::new();

        let lower_fname = function_name.to_ascii_lowercase();

        match &*lower_fname {
            "calc" | "-moz-calc" | "-webkit-calc" | "sin" | "cos" | "tan" | "asin" | "acos"
            | "atan" | "sqrt" | "exp" | "abs" | "sign" => {
                self.input.skip_ws();

                let calc_sum = ComponentValue::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws();

                if !is!(self, EOF) {
                    let span = self.input.cur_span();

                    return Err(Error::new(span, ErrorKind::Unexpected("value")));
                }
            }
            "min" | "max" | "hypot" => {
                self.input.skip_ws();

                let calc_sum = ComponentValue::CalcSum(self.parse()?);

                values.push(calc_sum);

                loop {
                    self.input.skip_ws();

                    if is!(self, ",") {
                        values.push(ComponentValue::Delimiter(self.parse()?));

                        self.input.skip_ws();
                    } else {
                        break;
                    }

                    let calc_sum = ComponentValue::CalcSum(self.parse()?);

                    values.push(calc_sum);
                }

                if !is!(self, EOF) {
                    let span = self.input.cur_span();

                    return Err(Error::new(span, ErrorKind::Unexpected("value")));
                }
            }
            "clamp" => {
                self.input.skip_ws();

                let calc_sum = ComponentValue::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws();

                if is!(self, ",") {
                    values.push(ComponentValue::Delimiter(self.parse()?));

                    self.input.skip_ws();
                } else {
                    let span = self.input.cur_span();

                    return Err(Error::new(span, ErrorKind::Expected("',' delim token")));
                }

                let calc_sum = ComponentValue::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws();

                if is!(self, ",") {
                    values.push(ComponentValue::Delimiter(self.parse()?));

                    self.input.skip_ws();
                } else {
                    let span = self.input.cur_span();

                    return Err(Error::new(span, ErrorKind::Expected("',' delim token")));
                }

                let calc_sum = ComponentValue::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws();
            }
            "round" => {
                self.input.skip_ws();

                if is!(self, "ident") {
                    // TODO improve me
                    let rounding_strategy = ComponentValue::Ident(self.parse()?);

                    values.push(rounding_strategy);

                    self.input.skip_ws();

                    if is!(self, ",") {
                        values.push(ComponentValue::Delimiter(self.parse()?));

                        self.input.skip_ws();
                    } else {
                        let span = self.input.cur_span();

                        return Err(Error::new(span, ErrorKind::Expected("',' delim token")));
                    }
                }

                let calc_sum = ComponentValue::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws();

                if is!(self, ",") {
                    values.push(ComponentValue::Delimiter(self.parse()?));

                    self.input.skip_ws();
                } else {
                    let span = self.input.cur_span();

                    return Err(Error::new(span, ErrorKind::Expected("',' delim token")));
                }

                let calc_sum = ComponentValue::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws();
            }
            "mod" | "rem" | "atan2" | "pow" => {
                self.input.skip_ws();

                let calc_sum = ComponentValue::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws();

                if is!(self, ",") {
                    values.push(ComponentValue::Delimiter(self.parse()?));

                    self.input.skip_ws();
                } else {
                    let span = self.input.cur_span();

                    return Err(Error::new(span, ErrorKind::Expected("',' delim token")));
                }

                let calc_sum = ComponentValue::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws();
            }
            "log" => {
                self.input.skip_ws();

                let calc_sum = ComponentValue::CalcSum(self.parse()?);

                values.push(calc_sum);

                self.input.skip_ws();

                if is!(self, ",") {
                    values.push(ComponentValue::Delimiter(self.parse()?));

                    self.input.skip_ws();

                    let calc_sum = ComponentValue::CalcSum(self.parse()?);

                    values.push(calc_sum);

                    self.input.skip_ws();
                }
            }
            "rgb" | "rgba" | "hsl" | "hsla" => {
                self.input.skip_ws();

                let mut has_variable = false;
                let mut is_legacy_syntax = true;

                match cur!(self) {
                    Token::Ident { value, .. } if matches_eq_ignore_ascii_case!(value, "from") => {
                        is_legacy_syntax = false;

                        values.push(ComponentValue::Ident(self.parse()?));

                        self.input.skip_ws();

                        let color = self.try_parse_variable_function(
                            |parser, _| Ok(Some(ComponentValue::Color(parser.parse()?))),
                            &mut has_variable,
                        )?;

                        if let Some(color) = color {
                            values.push(color);
                        }

                        self.input.skip_ws();
                    }
                    _ => {}
                }

                match &*lower_fname {
                    "rgb" | "rgba" => {
                        let percentage_or_number_or_none = self.try_parse_variable_function(
                            |parser, has_variable_before| match cur!(parser) {
                                tok!("percentage") => {
                                    Ok(Some(ComponentValue::Percentage(parser.parse()?)))
                                }
                                tok!("number") => Ok(Some(ComponentValue::Number(parser.parse()?))),
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(Some(ComponentValue::Function(parser.parse()?)))
                                }
                                tok!("ident") => {
                                    is_legacy_syntax = false;

                                    let ident: Box<Ident> = parser.parse()?;

                                    if ident.value.eq_ignore_ascii_case("none") {
                                        Ok(Some(ComponentValue::Ident(ident)))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                _ => {
                                    if !has_variable_before {
                                        Err(Error::new(
                                            parser.input.cur_span(),
                                            ErrorKind::Expected(
                                                "percentage, number, function (math functions) or \
                                                 ident (with 'none' value) token",
                                            ),
                                        ))
                                    } else {
                                        Ok(None)
                                    }
                                }
                            },
                            &mut has_variable,
                        )?;

                        if let Some(percentage_or_number_or_none) = percentage_or_number_or_none {
                            values.push(percentage_or_number_or_none);
                        }

                        self.input.skip_ws();
                    }
                    "hsl" | "hsla" => {
                        let hue_or_none = self.try_parse_variable_function(
                            |parser, has_variable_before| match cur!(parser) {
                                tok!("number") | tok!("dimension") => {
                                    Ok(Some(ComponentValue::Hue(parser.parse()?)))
                                }
                                tok!("ident") => {
                                    let ident: Box<Ident> = parser.parse()?;

                                    if ident.value.eq_ignore_ascii_case("none") {
                                        Ok(Some(ComponentValue::Ident(ident)))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(Some(ComponentValue::Function(parser.parse()?)))
                                }
                                _ => {
                                    if !has_variable_before {
                                        Err(Error::new(
                                            parser.input.cur_span(),
                                            ErrorKind::Expected(
                                                "number, dimension, function (math functions) or \
                                                 ident (with 'none' value) token",
                                            ),
                                        ))
                                    } else {
                                        Ok(None)
                                    }
                                }
                            },
                            &mut has_variable,
                        )?;

                        if let Some(hue_or_none) = hue_or_none {
                            values.push(hue_or_none);
                        }

                        self.input.skip_ws();
                    }
                    _ => {
                        unreachable!()
                    }
                }

                if is!(self, ",") {
                    if !is_legacy_syntax && !has_variable {
                        let span = self.input.cur_span();

                        return Err(Error::new(span, ErrorKind::Expected("comma token")));
                    }

                    is_legacy_syntax = true;

                    values.push(ComponentValue::Delimiter(self.parse()?));

                    self.input.skip_ws();
                } else {
                    is_legacy_syntax = false;
                }

                match &*lower_fname {
                    "rgb" | "rgba" => {
                        let percentage_or_number = self.try_parse_variable_function(
                            |parser, has_variable_before| match cur!(parser) {
                                tok!("percentage") => {
                                    Ok(Some(ComponentValue::Percentage(parser.parse()?)))
                                }
                                tok!("number") => Ok(Some(ComponentValue::Number(parser.parse()?))),
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(Some(ComponentValue::Function(parser.parse()?)))
                                }
                                tok!("ident") if !is_legacy_syntax => {
                                    let ident: Box<Ident> = parser.parse()?;

                                    if ident.value.eq_ignore_ascii_case("none") {
                                        Ok(Some(ComponentValue::Ident(ident)))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                _ => {
                                    if !has_variable_before {
                                        Err(Error::new(
                                            parser.input.cur_span(),
                                            ErrorKind::Expected(
                                                "percentage, number, function (math functions) or \
                                                 ident (with 'none' value) token",
                                            ),
                                        ))
                                    } else {
                                        Ok(None)
                                    }
                                }
                            },
                            &mut has_variable,
                        )?;

                        if let Some(percentage_or_number) = percentage_or_number {
                            values.push(percentage_or_number);
                        }

                        self.input.skip_ws();
                    }
                    "hsl" | "hsla" => {
                        let percentage_or_none = self.try_parse_variable_function(
                            |parser, has_variable_before| match cur!(parser) {
                                tok!("percentage") => {
                                    Ok(Some(ComponentValue::Percentage(parser.parse()?)))
                                }
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(Some(ComponentValue::Function(parser.parse()?)))
                                }
                                tok!("ident") => {
                                    let ident: Box<Ident> = parser.parse()?;

                                    if ident.value.eq_ignore_ascii_case("none") {
                                        Ok(Some(ComponentValue::Ident(ident)))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                _ => {
                                    if !has_variable_before {
                                        Err(Error::new(
                                            parser.input.cur_span(),
                                            ErrorKind::Expected(
                                                "percentage, function (math functions) or ident \
                                                 (with 'none' value) token",
                                            ),
                                        ))
                                    } else {
                                        Ok(None)
                                    }
                                }
                            },
                            &mut has_variable,
                        )?;

                        if let Some(percentage_or_none) = percentage_or_none {
                            values.push(percentage_or_none);
                        }

                        self.input.skip_ws();
                    }
                    _ => {
                        unreachable!();
                    }
                }

                if is_legacy_syntax {
                    if has_variable && is!(self, EOF) {
                        return Ok(values);
                    }

                    match cur!(self) {
                        tok!(",") => {
                            values.push(ComponentValue::Delimiter(self.parse()?));

                            self.input.skip_ws();
                        }
                        _ => {
                            if !has_variable {
                                let span = self.input.cur_span();

                                return Err(Error::new(span, ErrorKind::Expected("comma token")));
                            }
                        }
                    }
                }

                match &*lower_fname {
                    "rgb" | "rgba" => {
                        let percentage_or_number = self.try_parse_variable_function(
                            |parser, has_variable_before| match cur!(parser) {
                                tok!("percentage") => {
                                    Ok(Some(ComponentValue::Percentage(parser.parse()?)))
                                }
                                tok!("number") => Ok(Some(ComponentValue::Number(parser.parse()?))),
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(Some(ComponentValue::Function(parser.parse()?)))
                                }
                                tok!("ident") if !is_legacy_syntax => {
                                    let ident: Box<Ident> = parser.parse()?;

                                    if ident.value.eq_ignore_ascii_case("none") {
                                        Ok(Some(ComponentValue::Ident(ident)))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                _ => {
                                    if !has_variable_before {
                                        Err(Error::new(
                                            parser.input.cur_span(),
                                            ErrorKind::Expected(
                                                "percentage, number, function (math functions) or \
                                                 ident (with 'none' value) token",
                                            ),
                                        ))
                                    } else {
                                        Ok(None)
                                    }
                                }
                            },
                            &mut has_variable,
                        )?;

                        if let Some(percentage_or_number) = percentage_or_number {
                            values.push(percentage_or_number);
                        }

                        self.input.skip_ws();
                    }
                    "hsl" | "hsla" => {
                        let percentage_or_none = self.try_parse_variable_function(
                            |parser, has_variable_before| match cur!(parser) {
                                tok!("percentage") => {
                                    Ok(Some(ComponentValue::Percentage(parser.parse()?)))
                                }
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(Some(ComponentValue::Function(parser.parse()?)))
                                }
                                tok!("ident") => {
                                    let ident: Box<Ident> = parser.parse()?;

                                    if ident.value.eq_ignore_ascii_case("none") {
                                        Ok(Some(ComponentValue::Ident(ident)))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                _ => {
                                    if !has_variable_before {
                                        Err(Error::new(
                                            parser.input.cur_span(),
                                            ErrorKind::Expected(
                                                "percentage, function (math functions) or ident \
                                                 (with 'none' value) token",
                                            ),
                                        ))
                                    } else {
                                        Ok(None)
                                    }
                                }
                            },
                            &mut has_variable,
                        )?;

                        if let Some(percentage_or_none) = percentage_or_none {
                            values.push(percentage_or_none);
                        }

                        self.input.skip_ws();
                    }
                    _ => {
                        unreachable!();
                    }
                }

                if (is!(self, ",") || has_variable) && is_legacy_syntax {
                    if is!(self, ",") {
                        values.push(ComponentValue::Delimiter(self.parse()?));
                    }

                    self.input.skip_ws();

                    let alpha_value = self.try_parse_variable_function(
                        |parser, has_variable_before| match cur!(parser) {
                            tok!("number") | tok!("percentage") => {
                                Ok(Some(ComponentValue::AlphaValue(parser.parse()?)))
                            }
                            Token::Function { value, .. } if is_math_function(value) => {
                                Ok(Some(ComponentValue::Function(parser.parse()?)))
                            }
                            _ => {
                                if !has_variable_before {
                                    Err(Error::new(
                                        parser.input.cur_span(),
                                        ErrorKind::Expected(
                                            "percentage, function (math functions) or number token",
                                        ),
                                    ))
                                } else {
                                    Ok(None)
                                }
                            }
                        },
                        &mut has_variable,
                    )?;

                    if let Some(alpha_value) = alpha_value {
                        values.push(alpha_value);
                    }

                    self.input.skip_ws();
                } else if is!(self, "/") && !is_legacy_syntax {
                    values.push(ComponentValue::Delimiter(self.parse()?));

                    self.input.skip_ws();

                    let alpha_value = self.try_parse_variable_function(
                        |parser, has_variable_before| match cur!(parser) {
                            tok!("number") | tok!("percentage") => {
                                Ok(Some(ComponentValue::AlphaValue(parser.parse()?)))
                            }
                            Token::Function { value, .. } if is_math_function(value) => {
                                Ok(Some(ComponentValue::Function(parser.parse()?)))
                            }
                            tok!("ident") => {
                                let ident: Box<Ident> = parser.parse()?;

                                if ident.value.eq_ignore_ascii_case("none") {
                                    Ok(Some(ComponentValue::Ident(ident)))
                                } else {
                                    Err(Error::new(
                                        ident.span,
                                        ErrorKind::Expected("'none' value of an ident token"),
                                    ))
                                }
                            }
                            _ => {
                                if !has_variable_before {
                                    Err(Error::new(
                                        parser.input.cur_span(),
                                        ErrorKind::Expected(
                                            "percentage, number, function (math functions) or \
                                             ident (with 'none' value) token",
                                        ),
                                    ))
                                } else {
                                    Ok(None)
                                }
                            }
                        },
                        &mut has_variable,
                    )?;

                    if let Some(alpha_value) = alpha_value {
                        values.push(alpha_value);
                    }

                    self.input.skip_ws();
                }
            }
            "hwb" | "lab" | "lch" | "oklab" | "oklch" | "device-cmyk" => {
                self.input.skip_ws();

                let mut has_variable = false;

                match cur!(self) {
                    Token::Ident { value, .. }
                        if matches_eq_ignore_ascii_case!(value, "from")
                            && lower_fname != "device-cmyk" =>
                    {
                        values.push(ComponentValue::Ident(self.parse()?));

                        self.input.skip_ws();

                        let color = self.try_parse_variable_function(
                            |parser, _| Ok(Some(ComponentValue::Color(parser.parse()?))),
                            &mut has_variable,
                        )?;

                        if let Some(color) = color {
                            values.push(color);
                        }

                        self.input.skip_ws();
                    }
                    _ => {}
                }

                match &*lower_fname {
                    "hwb" => {
                        let hue_or_none = self.try_parse_variable_function(
                            |parser, has_variable_before| match cur!(parser) {
                                tok!("number") | tok!("dimension") => {
                                    Ok(Some(ComponentValue::Hue(parser.parse()?)))
                                }
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(Some(ComponentValue::Function(parser.parse()?)))
                                }
                                tok!("ident") => {
                                    let ident: Box<Ident> = parser.parse()?;

                                    if ident.value.eq_ignore_ascii_case("none") {
                                        Ok(Some(ComponentValue::Ident(ident)))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                _ => {
                                    if !has_variable_before {
                                        return Err(Error::new(
                                            parser.input.cur_span(),
                                            ErrorKind::Expected(
                                                "number, dimension, function (math functions) or \
                                                 ident (with 'none' value) token",
                                            ),
                                        ));
                                    } else {
                                        Ok(None)
                                    }
                                }
                            },
                            &mut has_variable,
                        )?;

                        if let Some(hue_or_none) = hue_or_none {
                            values.push(hue_or_none);
                        }

                        self.input.skip_ws();
                    }
                    "lab" | "lch" | "oklab" | "oklch" => {
                        let percentage_or_none = self.try_parse_variable_function(
                            |parser, has_variable_before| match cur!(parser) {
                                tok!("percentage") => {
                                    Ok(Some(ComponentValue::Percentage(parser.parse()?)))
                                }
                                tok!("number") => Ok(Some(ComponentValue::Number(parser.parse()?))),
                                Token::Function { value, .. } if is_math_function(value) => {
                                    Ok(Some(ComponentValue::Function(parser.parse()?)))
                                }
                                tok!("ident") => {
                                    let ident: Box<Ident> = parser.parse()?;

                                    if ident.value.eq_ignore_ascii_case("none") {
                                        Ok(Some(ComponentValue::Ident(ident)))
                                    } else {
                                        Err(Error::new(
                                            ident.span,
                                            ErrorKind::Expected("'none' value of an ident token"),
                                        ))
                                    }
                                }
                                _ => {
                                    if !has_variable_before {
                                        Err(Error::new(
                                            parser.input.cur_span(),
                                            ErrorKind::Expected(
                                                "percentage, function (math functions) or ident \
                                                 (with 'none' value) token",
                                            ),
                                        ))
                                    } else {
                                        Ok(None)
                                    }
                                }
                            },
                            &mut has_variable,
                        )?;

                        if let Some(percentage_or_none) = percentage_or_none {
                            values.push(percentage_or_none);
                        }

                        self.input.skip_ws();
                    }
                    "device-cmyk" => {
                        let cmyk_component = self.try_parse_variable_function(
                            |parser, _| Ok(Some(ComponentValue::CmykComponent(parser.parse()?))),
                            &mut has_variable,
                        )?;

                        if let Some(cmyk_component) = cmyk_component {
                            values.push(cmyk_component);
                        }

                        self.input.skip_ws();
                    }
                    _ => {
                        unreachable!();
                    }
                }

                if !is_one_of!(self, EOF, "/") {
                    match &*lower_fname {
                        "hwb" => {
                            let percentage_or_none = self.try_parse_variable_function(
                                |parser, has_variable_before| match cur!(parser) {
                                    tok!("percentage") => {
                                        Ok(Some(ComponentValue::Percentage(parser.parse()?)))
                                    }
                                    Token::Function { value, .. } if is_math_function(value) => {
                                        Ok(Some(ComponentValue::Function(parser.parse()?)))
                                    }
                                    tok!("ident") => {
                                        let ident: Box<Ident> = parser.parse()?;

                                        if ident.value.eq_ignore_ascii_case("none") {
                                            Ok(Some(ComponentValue::Ident(ident)))
                                        } else {
                                            Err(Error::new(
                                                ident.span,
                                                ErrorKind::Expected(
                                                    "'none' value of an ident token",
                                                ),
                                            ))
                                        }
                                    }
                                    _ => {
                                        if !has_variable_before {
                                            Err(Error::new(
                                                parser.input.cur_span(),
                                                ErrorKind::Expected(
                                                    "percentage, functions (math functions) or \
                                                     ident (with 'none' value) token",
                                                ),
                                            ))
                                        } else {
                                            Ok(None)
                                        }
                                    }
                                },
                                &mut has_variable,
                            )?;

                            if let Some(percentage_or_none) = percentage_or_none {
                                values.push(percentage_or_none);
                            }

                            self.input.skip_ws();
                        }
                        "lab" | "lch" | "oklab" | "oklch" => {
                            let number_or_none = self.try_parse_variable_function(
                                |parser, has_variable_before| match cur!(parser) {
                                    tok!("percentage") => {
                                        Ok(Some(ComponentValue::Percentage(parser.parse()?)))
                                    }
                                    tok!("number") => {
                                        Ok(Some(ComponentValue::Number(parser.parse()?)))
                                    }
                                    Token::Function { value, .. } if is_math_function(value) => {
                                        Ok(Some(ComponentValue::Function(parser.parse()?)))
                                    }
                                    tok!("ident") => {
                                        let ident: Box<Ident> = parser.parse()?;

                                        if ident.value.eq_ignore_ascii_case("none") {
                                            Ok(Some(ComponentValue::Ident(ident)))
                                        } else {
                                            Err(Error::new(
                                                ident.span,
                                                ErrorKind::Expected(
                                                    "'none' value of an ident token",
                                                ),
                                            ))
                                        }
                                    }
                                    _ => {
                                        if !has_variable_before {
                                            Err(Error::new(
                                                parser.input.cur_span(),
                                                ErrorKind::Expected(
                                                    "number, functions (math functions) or ident \
                                                     (with 'none' value) token",
                                                ),
                                            ))
                                        } else {
                                            Ok(None)
                                        }
                                    }
                                },
                                &mut has_variable,
                            )?;

                            if let Some(number_or_none) = number_or_none {
                                values.push(number_or_none);
                            }

                            self.input.skip_ws();
                        }
                        "device-cmyk" => {
                            let cmyk_component = self.try_parse_variable_function(
                                |parser, _| {
                                    Ok(Some(ComponentValue::CmykComponent(parser.parse()?)))
                                },
                                &mut has_variable,
                            )?;

                            if let Some(cmyk_component) = cmyk_component {
                                values.push(cmyk_component);
                            }

                            self.input.skip_ws();
                        }
                        _ => {
                            unreachable!();
                        }
                    }
                }

                if !is_one_of!(self, EOF, "/") {
                    match &*lower_fname {
                        "hwb" => {
                            let percentage_or_none = self.try_parse_variable_function(
                                |parser, has_variable_before| match cur!(parser) {
                                    tok!("percentage") => {
                                        Ok(Some(ComponentValue::Percentage(parser.parse()?)))
                                    }
                                    Token::Function { value, .. } if is_math_function(value) => {
                                        Ok(Some(ComponentValue::Function(parser.parse()?)))
                                    }
                                    tok!("ident") => {
                                        let ident: Box<Ident> = parser.parse()?;

                                        if ident.value.eq_ignore_ascii_case("none") {
                                            Ok(Some(ComponentValue::Ident(ident)))
                                        } else {
                                            Err(Error::new(
                                                ident.span,
                                                ErrorKind::Expected(
                                                    "'none' value of an ident token",
                                                ),
                                            ))
                                        }
                                    }
                                    _ => {
                                        if !has_variable_before {
                                            Err(Error::new(
                                                parser.input.cur_span(),
                                                ErrorKind::Expected(
                                                    "percentage, functions (math functions) or \
                                                     ident (with 'none' value) token",
                                                ),
                                            ))
                                        } else {
                                            Ok(None)
                                        }
                                    }
                                },
                                &mut has_variable,
                            )?;

                            if let Some(percentage_or_none) = percentage_or_none {
                                values.push(percentage_or_none);
                            }

                            self.input.skip_ws();
                        }
                        "lab" | "oklab" => {
                            let number_or_none = self.try_parse_variable_function(
                                |parser, has_variable_before| match cur!(parser) {
                                    tok!("percentage") => {
                                        Ok(Some(ComponentValue::Percentage(parser.parse()?)))
                                    }
                                    tok!("number") => {
                                        Ok(Some(ComponentValue::Number(parser.parse()?)))
                                    }
                                    Token::Function { value, .. } if is_math_function(value) => {
                                        Ok(Some(ComponentValue::Function(parser.parse()?)))
                                    }
                                    tok!("ident") => {
                                        let ident: Box<Ident> = parser.parse()?;

                                        if ident.value.eq_ignore_ascii_case("none") {
                                            Ok(Some(ComponentValue::Ident(ident)))
                                        } else {
                                            Err(Error::new(
                                                ident.span,
                                                ErrorKind::Expected(
                                                    "'none' value of an ident token",
                                                ),
                                            ))
                                        }
                                    }
                                    _ => {
                                        if !has_variable_before {
                                            Err(Error::new(
                                                parser.input.cur_span(),
                                                ErrorKind::Expected(
                                                    "number, function (math functions) or ident \
                                                     (with 'none' value) token",
                                                ),
                                            ))
                                        } else {
                                            Ok(None)
                                        }
                                    }
                                },
                                &mut has_variable,
                            )?;

                            if let Some(number_or_none) = number_or_none {
                                values.push(number_or_none);
                            }

                            self.input.skip_ws();
                        }
                        "lch" | "oklch" => {
                            let hue_or_none = self.try_parse_variable_function(
                                |parser, has_variable_before| match cur!(parser) {
                                    tok!("number") | tok!("dimension") => {
                                        Ok(Some(ComponentValue::Hue(parser.parse()?)))
                                    }
                                    Token::Function { value, .. } if is_math_function(value) => {
                                        Ok(Some(ComponentValue::Function(parser.parse()?)))
                                    }
                                    tok!("ident") => {
                                        let ident: Box<Ident> = parser.parse()?;

                                        if ident.value.eq_ignore_ascii_case("none") {
                                            Ok(Some(ComponentValue::Ident(ident)))
                                        } else {
                                            Err(Error::new(
                                                ident.span,
                                                ErrorKind::Expected(
                                                    "'none' value of an ident token",
                                                ),
                                            ))
                                        }
                                    }
                                    _ => {
                                        if !has_variable_before {
                                            return Err(Error::new(
                                                parser.input.cur_span(),
                                                ErrorKind::Expected(
                                                    "number, dimension, functions (math \
                                                     functions) or ident (with 'none' value) token",
                                                ),
                                            ));
                                        } else {
                                            Ok(None)
                                        }
                                    }
                                },
                                &mut has_variable,
                            )?;

                            if let Some(hue_or_none) = hue_or_none {
                                values.push(hue_or_none);
                            }

                            self.input.skip_ws();
                        }
                        "device-cmyk" => {
                            let cmyk_component = self.try_parse_variable_function(
                                |parser, _| {
                                    Ok(Some(ComponentValue::CmykComponent(parser.parse()?)))
                                },
                                &mut has_variable,
                            )?;

                            if let Some(cmyk_component) = cmyk_component {
                                values.push(cmyk_component);
                            }

                            self.input.skip_ws();
                        }
                        _ => {
                            unreachable!();
                        }
                    }
                }

                if !is_one_of!(self, EOF, "/") && lower_fname == "device-cmyk" {
                    let cmyk_component = self.try_parse_variable_function(
                        |parser, _| Ok(Some(ComponentValue::CmykComponent(parser.parse()?))),
                        &mut has_variable,
                    )?;

                    if let Some(cmyk_component) = cmyk_component {
                        values.push(cmyk_component);
                    }

                    self.input.skip_ws();
                }

                if is!(self, "/") {
                    values.push(ComponentValue::Delimiter(self.parse()?));

                    self.input.skip_ws();

                    let alpha_value = self.try_parse_variable_function(
                        |parser, has_variable_before| match cur!(parser) {
                            tok!("number") | tok!("percentage") => {
                                Ok(Some(ComponentValue::AlphaValue(parser.parse()?)))
                            }
                            Token::Function { value, .. } if is_math_function(value) => {
                                Ok(Some(ComponentValue::Function(parser.parse()?)))
                            }
                            tok!("ident") if !matches!(&*lower_fname, "device-cmyk") => {
                                let ident: Box<Ident> = parser.parse()?;

                                if ident.value.eq_ignore_ascii_case("none") {
                                    Ok(Some(ComponentValue::Ident(ident)))
                                } else {
                                    Err(Error::new(
                                        ident.span,
                                        ErrorKind::Expected("'none' value of an ident token"),
                                    ))
                                }
                            }
                            _ => {
                                if !has_variable_before {
                                    Err(Error::new(
                                        parser.input.cur_span(),
                                        ErrorKind::Expected(
                                            "percentage, number, functions (math functions) or \
                                             ident (with 'none' value) token",
                                        ),
                                    ))
                                } else {
                                    Ok(None)
                                }
                            }
                        },
                        &mut has_variable,
                    )?;

                    if let Some(alpha_value) = alpha_value {
                        values.push(alpha_value);
                    }

                    self.input.skip_ws();
                }
            }
            "color" => {
                self.input.skip_ws();

                let mut has_variable = false;

                match cur!(self) {
                    Token::Ident { value, .. } if matches_eq_ignore_ascii_case!(value, "from") => {
                        values.push(ComponentValue::Ident(self.parse()?));

                        self.input.skip_ws();

                        let color = self.try_parse_variable_function(
                            |parser, _| Ok(Some(ComponentValue::Color(parser.parse()?))),
                            &mut has_variable,
                        )?;

                        if let Some(color) = color {
                            values.push(color);
                        }

                        self.input.skip_ws();
                    }
                    _ => {}
                }

                let mut is_custom_params = false;
                let mut is_xyz = false;

                let ident = self.try_parse_variable_function(
                    |parser, _| match cur!(parser) {
                        Token::Ident { value, .. } => {
                            if value.starts_with("--") && value.len() > 2 {
                                is_custom_params = true;

                                Ok(Some(ComponentValue::DashedIdent(parser.parse()?)))
                            } else {
                                if matches_eq_ignore_ascii_case!(value, "xyz", "xyz-d50", "xyz-d65")
                                {
                                    is_xyz = true
                                } else {
                                    // There are predefined-rgb-params , but
                                    // For unknown, we don't return an error
                                    // to
                                    // continue to support invalid color,
                                    // because they fallback in browser
                                }

                                Ok(Some(ComponentValue::Ident(parser.parse()?)))
                            }
                        }
                        _ => Err(Error::new(
                            parser.input.cur_span(),
                            ErrorKind::Expected("ident token"),
                        )),
                    },
                    &mut has_variable,
                )?;

                if let Some(ident) = ident {
                    values.push(ident);
                }

                self.input.skip_ws();

                let number_or_percentage_or_none = self.try_parse_variable_function(
                    |parser, has_variable_before| match cur!(parser) {
                        tok!("number") => Ok(Some(ComponentValue::Number(parser.parse()?))),
                        tok!("percentage") if !is_xyz => {
                            Ok(Some(ComponentValue::Percentage(parser.parse()?)))
                        }
                        Token::Function { value, .. } if is_math_function(value) => {
                            Ok(Some(ComponentValue::Function(parser.parse()?)))
                        }
                        tok!("ident") => {
                            let ident: Box<Ident> = parser.parse()?;

                            if ident.value.eq_ignore_ascii_case("none") {
                                Ok(Some(ComponentValue::Ident(ident)))
                            } else {
                                Err(Error::new(
                                    ident.span,
                                    ErrorKind::Expected("'none' value of an ident token"),
                                ))
                            }
                        }
                        _ => {
                            if !has_variable_before {
                                Err(Error::new(
                                    parser.input.cur_span(),
                                    ErrorKind::Expected(
                                        "percentage, function (math functions) or ident (with \
                                         'none' value) token",
                                    ),
                                ))
                            } else {
                                Ok(None)
                            }
                        }
                    },
                    &mut has_variable,
                )?;

                if let Some(number_or_percentage_or_none) = number_or_percentage_or_none {
                    values.push(number_or_percentage_or_none);
                }

                self.input.skip_ws();

                if is_custom_params {
                    loop {
                        if is!(self, EOF) {
                            break;
                        }

                        let number_or_percentage_or_none = match cur!(self) {
                            tok!("number") => ComponentValue::Number(self.parse()?),
                            tok!("percentage") if !is_xyz => {
                                ComponentValue::Percentage(self.parse()?)
                            }
                            Token::Function { value, .. }
                                if is_math_function(value)
                                    || matches_eq_ignore_ascii_case!(
                                        value, "var", "env", "constant"
                                    ) =>
                            {
                                ComponentValue::Function(self.parse()?)
                            }
                            tok!("ident") => {
                                let ident: Box<Ident> = self.parse()?;

                                if ident.value.eq_ignore_ascii_case("none") {
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

                        self.input.skip_ws();
                    }
                } else {
                    let number_or_percentage_or_none = self.try_parse_variable_function(
                        |parser, has_variable_before| match cur!(parser) {
                            tok!("number") => Ok(Some(ComponentValue::Number(parser.parse()?))),
                            tok!("percentage") if !is_xyz => {
                                Ok(Some(ComponentValue::Percentage(parser.parse()?)))
                            }
                            Token::Function { value, .. } if is_math_function(value) => {
                                Ok(Some(ComponentValue::Function(parser.parse()?)))
                            }
                            tok!("ident") => {
                                let ident: Box<Ident> = parser.parse()?;

                                if ident.value.eq_ignore_ascii_case("none") {
                                    Ok(Some(ComponentValue::Ident(ident)))
                                } else {
                                    Err(Error::new(
                                        ident.span,
                                        ErrorKind::Expected("'none' value of an ident token"),
                                    ))
                                }
                            }
                            _ => {
                                if !has_variable_before {
                                    Err(Error::new(
                                        parser.input.cur_span(),
                                        ErrorKind::Expected(
                                            "percentage, function (math functions) or ident (with \
                                             'none' value) token",
                                        ),
                                    ))
                                } else {
                                    Ok(None)
                                }
                            }
                        },
                        &mut has_variable,
                    )?;

                    if let Some(number_or_percentage_or_none) = number_or_percentage_or_none {
                        values.push(number_or_percentage_or_none);
                    }

                    self.input.skip_ws();

                    let number_or_percentage_or_none = self.try_parse_variable_function(
                        |parser, has_variable_before| match cur!(parser) {
                            tok!("number") => Ok(Some(ComponentValue::Number(parser.parse()?))),
                            tok!("percentage") if !is_xyz => {
                                Ok(Some(ComponentValue::Percentage(parser.parse()?)))
                            }
                            tok!("ident") => {
                                let ident: Box<Ident> = parser.parse()?;

                                if ident.value.eq_ignore_ascii_case("none") {
                                    Ok(Some(ComponentValue::Ident(ident)))
                                } else {
                                    Err(Error::new(
                                        ident.span,
                                        ErrorKind::Expected("'none' value of an ident token"),
                                    ))
                                }
                            }
                            Token::Function { value, .. } if is_math_function(value) => {
                                Ok(Some(ComponentValue::Function(parser.parse()?)))
                            }
                            _ => {
                                if !has_variable_before {
                                    Err(Error::new(
                                        parser.input.cur_span(),
                                        ErrorKind::Expected(
                                            "percentage, function (math functions) or ident (with \
                                             'none' value) token",
                                        ),
                                    ))
                                } else {
                                    Ok(None)
                                }
                            }
                        },
                        &mut has_variable,
                    )?;

                    if let Some(number_or_percentage_or_none) = number_or_percentage_or_none {
                        values.push(number_or_percentage_or_none);
                    }

                    self.input.skip_ws();
                }

                if is!(self, "/") {
                    values.push(ComponentValue::Delimiter(self.parse()?));

                    self.input.skip_ws();

                    let alpha_value = self.try_parse_variable_function(
                        |parser, has_variable_before| match cur!(parser) {
                            tok!("number") | tok!("percentage") => {
                                Ok(Some(ComponentValue::AlphaValue(parser.parse()?)))
                            }
                            Token::Function { value, .. } if is_math_function(value) => {
                                Ok(Some(ComponentValue::Function(parser.parse()?)))
                            }
                            tok!("ident") if !matches!(&*lower_fname, "device-cmyk") => {
                                let ident: Box<Ident> = parser.parse()?;

                                if ident.value.eq_ignore_ascii_case("none") {
                                    Ok(Some(ComponentValue::Ident(ident)))
                                } else {
                                    Err(Error::new(
                                        ident.span,
                                        ErrorKind::Expected("'none' value of an ident token"),
                                    ))
                                }
                            }
                            _ => {
                                if !has_variable_before {
                                    Err(Error::new(
                                        parser.input.cur_span(),
                                        ErrorKind::Expected(
                                            "percentage, number, function (math functions) or \
                                             ident (with 'none' value) token",
                                        ),
                                    ))
                                } else {
                                    Ok(None)
                                }
                            }
                        },
                        &mut has_variable,
                    )?;

                    if let Some(alpha_value) = alpha_value {
                        values.push(alpha_value);
                    }

                    self.input.skip_ws();
                }

                self.input.skip_ws();
            }
            "element" | "-moz-element" => {
                self.input.skip_ws();

                let id_selector = self.try_parse_variable_function(
                    |parser, _| Ok(Some(ComponentValue::IdSelector(parser.parse()?))),
                    &mut false,
                )?;

                if let Some(id_selector) = id_selector {
                    values.push(id_selector);

                    self.input.skip_ws();
                }
            }
            "selector" if self.ctx.in_supports_at_rule => {
                self.input.skip_ws();

                let selector = ComponentValue::ComplexSelector(self.parse()?);

                values.push(selector);

                self.input.skip_ws();
            }
            "layer" if self.ctx.in_import_at_rule => {
                self.input.skip_ws();

                if is!(self, EOF) {
                    let span = self.input.cur_span();

                    return Err(Error::new(
                        span,
                        ErrorKind::Expected(
                            "layer function inside @import expected to have exactly one ident \
                             argument",
                        ),
                    ));
                }

                let layer_name = self.parse_as::<Box<LayerName>>()?;

                values.push(ComponentValue::LayerName(layer_name));

                self.input.skip_ws();

                if !is!(self, EOF) {
                    let span = self.input.cur_span();

                    return Err(Error::new(
                        span,
                        ErrorKind::Expected(
                            "layer function inside @import expected to have exactly one ident \
                             argument",
                        ),
                    ));
                }
            }
            "supports" if self.ctx.in_import_at_rule => {
                self.input.skip_ws();

                if !is!(self, EOF) {
                    let state = self.input.state();

                    match self.parse() {
                        Ok(declaration) => {
                            values.push(ComponentValue::Declaration(declaration));

                            self.input.skip_ws();
                        }
                        Err(_) => {
                            self.input.reset(&state);

                            let supports_conditions = self.parse()?;

                            values.push(ComponentValue::SupportsCondition(supports_conditions));
                        }
                    }
                }
            }
            _ => loop {
                self.input.skip_ws();

                if is!(self, EOF) {
                    break;
                }

                let value = match self.try_parse(|p| p.parse_generic_value()) {
                    Some(v) => v,
                    None => {
                        if is_one_of!(self, ";", ":") || (self.config.legacy_ie && is!(self, "=")) {
                            let tok = self.input.bump().unwrap();

                            ComponentValue::PreservedToken(Box::new(tok))
                        } else {
                            return Err(Error::new(
                                self.input.cur_span(),
                                ErrorKind::Expected("Declaration value"),
                            ));
                        }
                    }
                };

                values.push(value);
            },
        };

        Ok(values)
    }

    fn try_parse_variable_function<F>(
        &mut self,
        mut fallback: F,
        has_before_variable: &mut bool,
    ) -> PResult<Option<ComponentValue>>
    where
        F: FnMut(&mut Parser<I>, bool) -> PResult<Option<ComponentValue>>,
    {
        if is!(self, EOF) {
            return Ok(None);
        }

        match cur!(self) {
            Token::Function { value, .. }
                if matches_eq_ignore_ascii_case!(value, "var", "env", "constant") =>
            {
                *has_before_variable = true;

                Ok(Some(ComponentValue::Function(self.parse()?)))
            }
            _ => fallback(self, *has_before_variable),
        }
    }
}

impl<I> Parse<Delimiter> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<Delimiter> {
        let span = self.input.cur_span();

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
        let span = self.input.cur_span();

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
                    raw: Some(raw),
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
        let span = self.input.cur_span();

        if !is!(self, Number) {
            return Err(Error::new(span, ErrorKind::ExpectedNumber));
        }

        let value = bump!(self);

        match value {
            Token::Number { value, raw, .. } => Ok(Number {
                span,
                value,
                raw: Some(raw),
            }),
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
        let span = self.input.cur_span();

        if !is!(self, Ident) {
            return Err(Error::new(span, ErrorKind::Expected("Ident")));
        }

        match bump!(self) {
            Token::Ident { value, raw, .. } => {
                if matches_eq_ignore_ascii_case!(
                    value, "initial", "inherit", "unset", "revert", "default"
                ) {
                    return Err(Error::new(span, ErrorKind::InvalidCustomIdent(value)));
                }

                Ok(CustomIdent {
                    span,
                    value,
                    raw: Some(raw),
                })
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
        let span = self.input.cur_span();

        if !is!(self, Ident) {
            return Err(Error::new(span, ErrorKind::Expected("Ident")));
        }

        match bump!(self) {
            Token::Ident { value, raw, .. } => {
                if !value.starts_with("--") {
                    return Err(Error::new(
                        span,
                        ErrorKind::Expected("'--' at the start of dashed-ident"),
                    ));
                }

                if value.len() < 3 {
                    return Err(Error::new(
                        span,
                        ErrorKind::Expected("dashed-ident must be at least 3 characters"),
                    ));
                }

                Ok(DashedIdent {
                    span,
                    value: self.input.atom(&value[2..]),
                    raw: Some(raw),
                })
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
        let span = self.input.cur_span();

        if !is!(self, Ident) {
            return Err(Error::new(span, ErrorKind::Expected("Ident")));
        }

        match bump!(self) {
            Token::Ident { value, raw, .. } => {
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

                Ok(CustomPropertyName {
                    span,
                    value,
                    raw: Some(raw),
                })
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
        let span = self.input.cur_span();

        if !is!(self, Ident) {
            return Err(Error::new(span, ErrorKind::Expected("Ident")));
        }

        match bump!(self) {
            Token::Ident { value, raw, .. } => Ok(Ident {
                span,
                value,
                raw: Some(raw),
            }),
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
        let span = self.input.cur_span();

        if !is!(self, Dimension) {
            return Err(Error::new(span, ErrorKind::Expected("dimension token")));
        }

        match cur!(self) {
            Token::Dimension(dimension_token) => {
                match &dimension_token.unit {
                    // <length>
                    unit if is_length_unit(unit)
                        || (self.ctx.in_container_at_rule && is_container_lengths_unit(unit)) =>
                    {
                        Ok(Dimension::Length(self.parse()?))
                    }
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
        let span = self.input.cur_span();

        if !is!(self, Dimension) {
            return Err(Error::new(span, ErrorKind::Expected("dimension token")));
        }

        match bump!(self) {
            Token::Dimension(dimension_token) => {
                let DimensionToken {
                    value,
                    unit,
                    raw_value,
                    raw_unit,
                    ..
                } = *dimension_token;

                // TODO validate

                let unit_len = raw_unit.len() as u32;

                Ok(Length {
                    span,
                    value: Number {
                        span: Span::new(span.lo, span.hi - BytePos(unit_len)),
                        value,
                        raw: Some(raw_value),
                    },
                    unit: Ident {
                        span: Span::new(span.hi - BytePos(unit_len), span.hi),
                        value: unit,
                        raw: Some(raw_unit),
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
        let span = self.input.cur_span();

        if !is!(self, Dimension) {
            return Err(Error::new(span, ErrorKind::Expected("dimension token")));
        }

        match bump!(self) {
            Token::Dimension(dimension_token) => {
                let DimensionToken {
                    value,
                    unit,
                    raw_value,
                    raw_unit,
                    ..
                } = *dimension_token;

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
                        span: Span::new(span.lo, span.hi - BytePos(unit_len)),
                        value,
                        raw: Some(raw_value),
                    },
                    unit: Ident {
                        span: Span::new(span.hi - BytePos(unit_len), span.hi),
                        value: unit,
                        raw: Some(raw_unit),
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
        let span = self.input.cur_span();

        if !is!(self, Dimension) {
            return Err(Error::new(span, ErrorKind::Expected("dimension token")));
        }

        match bump!(self) {
            Token::Dimension(dimension_token) => {
                let DimensionToken {
                    value,
                    unit,
                    raw_value,
                    raw_unit,
                    ..
                } = *dimension_token;

                if !is_time_unit(&unit) {
                    return Err(Error::new(span, ErrorKind::Expected("'s' or 'ms' units")));
                }

                let unit_len = raw_unit.len() as u32;

                Ok(Time {
                    span,
                    value: Number {
                        span: Span::new(span.lo, span.hi - BytePos(unit_len)),
                        value,
                        raw: Some(raw_value),
                    },
                    unit: Ident {
                        span: Span::new(span.hi - BytePos(unit_len), span.hi),
                        value: unit,
                        raw: Some(raw_unit),
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
        let span = self.input.cur_span();

        if !is!(self, Dimension) {
            return Err(Error::new(span, ErrorKind::Expected("dimension token")));
        }

        match bump!(self) {
            Token::Dimension(dimension_token) => {
                let DimensionToken {
                    value,
                    unit,
                    raw_value,
                    raw_unit,
                    ..
                } = *dimension_token;

                if !is_frequency_unit(&unit) {
                    return Err(Error::new(span, ErrorKind::Expected("'Hz' or 'kHz' units")));
                }

                let unit_len = raw_unit.len() as u32;

                Ok(Frequency {
                    span,
                    value: Number {
                        span: Span::new(span.lo, span.hi - BytePos(unit_len)),
                        value,
                        raw: Some(raw_value),
                    },
                    unit: Ident {
                        span: Span::new(span.hi - BytePos(unit_len), span.hi),
                        value: unit,
                        raw: Some(raw_unit),
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
        let span = self.input.cur_span();

        if !is!(self, Dimension) {
            return Err(Error::new(span, ErrorKind::Expected("dimension token")));
        }

        match bump!(self) {
            Token::Dimension(dimension_token) => {
                let DimensionToken {
                    value,
                    unit,
                    raw_value,
                    raw_unit,
                    ..
                } = *dimension_token;

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
                        span: Span::new(span.lo, span.hi - BytePos(unit_len)),
                        value,
                        raw: Some(raw_value),
                    },
                    unit: Ident {
                        span: Span::new(span.hi - BytePos(unit_len), span.hi),
                        value: unit,
                        raw: Some(raw_unit),
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
        let span = self.input.cur_span();

        if !is!(self, Dimension) {
            return Err(Error::new(span, ErrorKind::Expected("dimension token")));
        }

        match bump!(self) {
            Token::Dimension(dimension_token) => {
                let DimensionToken {
                    value,
                    unit,
                    raw_value,
                    raw_unit,
                    ..
                } = *dimension_token;

                if !is_flex_unit(&unit) {
                    return Err(Error::new(span, ErrorKind::Expected("'fr' unit")));
                }

                let unit_len = raw_unit.len() as u32;

                Ok(Flex {
                    span,
                    value: Number {
                        span: Span::new(span.lo, span.hi - BytePos(unit_len)),
                        value,
                        raw: Some(raw_value),
                    },
                    unit: Ident {
                        span: Span::new(span.hi - BytePos(unit_len), span.hi),
                        value: unit,
                        raw: Some(raw_unit),
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
        let span = self.input.cur_span();

        if !is!(self, Dimension) {
            return Err(Error::new(span, ErrorKind::Expected("dimension token")));
        }

        match bump!(self) {
            Token::Dimension(dimension_token) => {
                let DimensionToken {
                    value,
                    unit,
                    raw_value,
                    raw_unit,
                    ..
                } = *dimension_token;

                let unit_len = raw_unit.len() as u32;

                Ok(UnknownDimension {
                    span,
                    value: Number {
                        span: Span::new(span.lo, span.hi - BytePos(unit_len)),
                        value,
                        raw: Some(raw_value),
                    },
                    unit: Ident {
                        span: Span::new(span.hi - BytePos(unit_len), span.hi),
                        value: self.input.atom(unit.to_lowercase()),
                        raw: Some(raw_unit),
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
        let span = self.input.cur_span();

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
        let span = self.input.cur_span();

        match cur!(self) {
            tok!("#") => Ok(AbsoluteColorBase::HexColor(self.parse()?)),
            Token::Ident { value, .. } => {
                if !(is_named_color(value) || value.as_ref().eq_ignore_ascii_case("transparent")) {
                    let span = self.input.cur_span();

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
        let span = self.input.cur_span();

        if !is!(self, "#") {
            return Err(Error::new(span, ErrorKind::Expected("hash token")));
        }

        match bump!(self) {
            Token::Hash { value, raw, .. } => {
                if value.chars().any(|x| !x.is_ascii_hexdigit()) {
                    return Err(Error::new(
                        span,
                        ErrorKind::Unexpected("character in hex color"),
                    ));
                }

                Ok(HexColor {
                    span,
                    value,
                    raw: Some(raw),
                })
            }
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
            let span = self.input.cur_span();

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
            let span = self.input.cur_span();

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
            let span = self.input.cur_span();

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
                    let span = self.input.cur_span();

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
        let span = self.input.cur_span();

        if !is!(self, Percentage) {
            return Err(Error::new(span, ErrorKind::Expected("percentage token")));
        }

        match bump!(self) {
            Token::Percentage { value, raw } => {
                let value = Number {
                    span: Span::new(span.lo, span.hi - BytePos(1)),
                    value,
                    raw: Some(raw),
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
        let span = self.input.cur_span();

        if !is!(self, "string") {
            return Err(Error::new(span, ErrorKind::Expected("string token")));
        }

        match bump!(self) {
            Token::String { value, raw } => Ok(Str {
                span,
                value,
                raw: Some(raw),
            }),
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
        let span = self.input.cur_span();

        if !is_one_of!(self, Url, Function) {
            return Err(Error::new(
                span,
                ErrorKind::Expected("url or function (with 'url' or 'src' name) token"),
            ));
        }

        match bump!(self) {
            Token::Url { value, raw } => {
                let name_length = raw.0.len() as u32;
                let name = Ident {
                    span: Span::new(span.lo, span.lo + BytePos(name_length)),
                    value: self.input.atom("url"),
                    raw: Some(raw.0),
                };
                let value = Some(Box::new(UrlValue::Raw(UrlValueRaw {
                    span: Span::new(span.lo + BytePos(name_length + 1), span.hi - BytePos(1)),
                    value,
                    raw: Some(raw.1),
                })));

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
                if !matches_eq_ignore_ascii_case!(function_name, "url", "src") {
                    return Err(Error::new(
                        span,
                        ErrorKind::Expected("'url' or 'src' name of a function token"),
                    ));
                }

                let name = Ident {
                    span: Span::new(span.lo, span.hi - BytePos(1)),
                    value: function_name,
                    raw: Some(raw_function_name),
                };

                self.input.skip_ws();

                let value = match cur!(self) {
                    tok!("string") => Some(Box::new(UrlValue::Str(self.parse()?))),
                    _ => None,
                };

                self.input.skip_ws();

                let mut modifiers = Vec::new();

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
                            let span = self.input.cur_span();

                            return Err(Error::new(span, ErrorKind::Expected("ident or function")));
                        }
                    }

                    self.input.skip_ws();
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
        let span = self.input.cur_span();
        let mut unicode_range = String::new();

        // should start with `u` or `U`
        match cur!(self) {
            Token::Ident { value, .. } if matches_eq_ignore_ascii_case!(value, "u") => {
                let u = match bump!(self) {
                    Token::Ident { value, .. } => value,
                    _ => {
                        unreachable!();
                    }
                };

                unicode_range.push_str(&u);
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

                if !is!(self, EOF) {
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
                            let raw = match bump!(self) {
                                Token::Dimension(dimension_token) => {
                                    (dimension_token.raw_value, dimension_token.raw_unit)
                                }
                                _ => {
                                    unreachable!();
                                }
                            };

                            unicode_range.push_str(&raw.0);
                            unicode_range.push_str(&raw.1);
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
            }
            // u <dimension-token> '?'*
            tok!("dimension") => {
                let raw = match bump!(self) {
                    Token::Dimension(dimension_token) => {
                        (dimension_token.raw_value, dimension_token.raw_unit)
                    }
                    _ => {
                        unreachable!();
                    }
                };

                unicode_range.push_str(&raw.0);
                unicode_range.push_str(&raw.1);

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
        chars.next();

        // 2. If the first character of text is U+002B PLUS SIGN, consume it. Otherwise,
        // this is an invalid <urange>, and this algorithm must exit.
        let mut next = chars.next();

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
            if next.is_some() {
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
                start: self.input.atom(start),
                end: None,
                raw: Some(self.input.atom(unicode_range)),
            });
        }

        // Otherwise, interpret the consumed code points as a hexadecimal number. This
        // is the start value.

        // 4. If there are no code points left in text, The end value is the same as the
        // start value. Exit this algorithm.
        if next.is_none() {
            return Ok(UnicodeRange {
                span: span!(self, span.lo),
                start: self.input.atom(start),
                end: None,
                raw: Some(self.input.atom(unicode_range)),
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

        if chars.next().is_some() {
            return Err(Error::new(
                span,
                ErrorKind::Expected("no characters after end in unicode range"),
            ));
        }

        return Ok(UnicodeRange {
            span: span!(self, span.lo),
            start: self.input.atom(start),
            end: Some(self.input.atom(end)),
            raw: Some(self.input.atom(unicode_range)),
        });
    }
}

impl<I> Parse<CalcSum> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<CalcSum> {
        let start = self.input.cur_span().lo;
        let mut expressions = Vec::new();
        let calc_product = CalcProductOrOperator::Product(self.parse()?);
        let mut end = match calc_product {
            CalcProductOrOperator::Product(ref calc_product) => calc_product.span.hi,
            _ => {
                unreachable!();
            }
        };

        expressions.push(calc_product);

        loop {
            self.input.skip_ws();

            if is!(self, EOF) {
                break;
            }

            match cur!(self) {
                tok!("+") | tok!("-") => {
                    let operator = CalcProductOrOperator::Operator(self.parse()?);

                    expressions.push(operator);

                    self.input.skip_ws();

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
            span: Span::new(start, end),
            expressions,
        })
    }
}

impl<I> Parse<CalcProduct> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<CalcProduct> {
        let start = self.input.cur_span().lo;
        let mut expressions = Vec::new();
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
            self.input.skip_ws();

            if is!(self, EOF) {
                break;
            }

            match cur!(self) {
                tok!("*") | tok!("/") => {
                    let operator = CalcValueOrOperator::Operator(self.parse()?);

                    expressions.push(operator);

                    self.input.skip_ws();

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
            span: Span::new(start, end),
            expressions,
        })
    }
}

impl<I> Parse<CalcOperator> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<CalcOperator> {
        let span = self.input.cur_span();

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
                let span = self.input.cur_span();

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
                        let span = self.input.cur_span();

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
                let span = self.input.cur_span();

                expect!(self, "(");

                self.input.skip_ws();

                let mut calc_sum_in_parens: CalcSum = self.parse()?;

                self.input.skip_ws();

                expect!(self, ")");

                calc_sum_in_parens.span = span!(self, span.lo);

                Ok(CalcValue::Sum(calc_sum_in_parens))
            }
            tok!("function") => Ok(CalcValue::Function(self.parse()?)),
            _ => {
                let span = self.input.cur_span();

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

impl<I> Parse<FamilyName> for Parser<I>
where
    I: ParserInput,
{
    fn parse(&mut self) -> PResult<FamilyName> {
        match cur!(self) {
            tok!("string") => Ok(FamilyName::Str(self.parse()?)),
            tok!("ident") => {
                let span = self.input.cur_span();

                let mut value = vec![self.parse()?];

                loop {
                    self.input.skip_ws();

                    if !is!(self, "ident") {
                        break;
                    }

                    value.push(self.parse()?);
                }

                Ok(FamilyName::SequenceOfCustomIdents(SequenceOfCustomIdents {
                    span: span!(self, span.lo),
                    value,
                }))
            }
            _ => {
                let span = self.input.cur_span();

                return Err(Error::new(
                    span,
                    ErrorKind::Expected("'string' or 'ident' tokens"),
                ));
            }
        }
    }
}

pub(crate) fn is_math_function(name: &JsWord) -> bool {
    matches_eq_ignore_ascii_case!(
        name,
        "calc",
        "-moz-calc",
        "-webkit-calc",
        "sin",
        "cos",
        "tan",
        "asin",
        "acos",
        "atan",
        "sqrt",
        "exp",
        "abs",
        "sign",
        "min",
        "max",
        "hypot",
        "clamp",
        "round",
        "mod",
        "rem",
        "atan2",
        "pow",
        "log"
    )
}

fn is_absolute_color_base_function(name: &JsWord) -> bool {
    matches_eq_ignore_ascii_case!(
        name,
        "rgb",
        "rgba",
        "hsl",
        "hsla",
        "hwb",
        "lab",
        "lch",
        "oklab",
        "oklch",
        "color",
        "color-mix",
        "color-contrast"
    )
}

fn is_system_color(name: &JsWord) -> bool {
    matches_eq_ignore_ascii_case!(
        name,
        "canvas",
        "canvastext",
        "linktext",
        "visitedtext",
        "activetext",
        "buttonface",
        "buttontext",
        "buttonborder",
        "field",
        "fieldtext",
        "highlight",
        "highlighttext",
        "selecteditem",
        "selecteditemtext",
        "mark",
        "marktext",
        "graytext",
        // Deprecated
        "activeborder",
        "activecaption",
        "appWorkspace",
        "background",
        "buttonhighlight",
        "buttonshadow",
        "captiontext",
        "inactiveborder",
        "inactivecaption",
        "inactivecaptiontext",
        "infobackground",
        "infotext",
        "menu",
        "menutext",
        "scrollbar",
        "threeddarkshadow",
        "threedface",
        "threedhighlight",
        "threedlightshadow",
        "threedshadow",
        "window",
        "windowframe",
        "windowtext",
        // Mozilla System Color Extensions
        "-moz-buttondefault",
        "-moz-buttonhoverface",
        "-moz-buttonhovertext",
        "-moz-cellhighlight",
        "-moz-cellhighlighttext",
        "-moz-combobox",
        "-moz-comboboxtext",
        "-moz-dialog",
        "-moz-dialogtext",
        "-moz-dragtargetzone",
        "-moz-eventreerow",
        "-moz-html-cellhighlight",
        "-moz-html-cellhighlighttext",
        "-moz-mac-accentdarkestshadow",
        "-moz-mac-accentdarkshadow",
        "-moz-mac-accentface",
        "-moz-mac-accentlightesthighlight",
        "-moz-mac-accentlightshadow",
        "-moz-mac-accentregularhighlight",
        "-moz-mac-accentregularshadow",
        "-moz-mac-chrome-active",
        "-moz-mac-chrome-inactive",
        "-moz-mac-focusring",
        "-moz-mac-menuselect",
        "-moz-mac-menushadow",
        "-moz-mac-menutextselect",
        "-moz-menuhover",
        "-moz-menuhovertext",
        "-moz-menubartext",
        "-moz-menubarhovertext",
        "-moz-nativehyperlinktext",
        "-moz-oddtreerow",
        "-moz-win-communicationstext",
        "-moz-win-mediatext",
        "-moz-win-accentcolor",
        "-moz-win-accentcolortext",
        // Mozilla Color Preference Extensions
        "-moz-activehyperlinktext",
        "-moz-default-background-color",
        "-moz-default-color",
        "-moz-hyperlinktext",
        "-moz-visitedhyperlinktext"
    )
}

fn is_named_color(name: &JsWord) -> bool {
    matches_eq_ignore_ascii_case!(
        name,
        "aliceblue",
        "antiquewhite",
        "aqua",
        "aquamarine",
        "azure",
        "beige",
        "bisque",
        "black",
        "blanchedalmond",
        "blue",
        "blueviolet",
        "brown",
        "burlywood",
        "cadetblue",
        "chartreuse",
        "chocolate",
        "coral",
        "cornflowerblue",
        "cornsilk",
        "crimson",
        "cyan",
        "darkblue",
        "darkcyan",
        "darkgoldenrod",
        "darkgray",
        "darkgreen",
        "darkgrey",
        "darkkhaki",
        "darkmagenta",
        "darkolivegreen",
        "darkorange",
        "darkorchid",
        "darkred",
        "darksalmon",
        "darkseagreen",
        "darkslateblue",
        "darkslategray",
        "darkslategrey",
        "darkturquoise",
        "darkviolet",
        "deeppink",
        "deepskyblue",
        "dimgray",
        "dimgrey",
        "dodgerblue",
        "firebrick",
        "floralwhite",
        "forestgreen",
        "fuchsia",
        "gainsboro",
        "ghostwhite",
        "gold",
        "goldenrod",
        "gray",
        "green",
        "greenyellow",
        "grey",
        "honeydew",
        "hotpink",
        "indianred",
        "indigo",
        "ivory",
        "khaki",
        "lavender",
        "lavenderblush",
        "lawngreen",
        "lemonchiffon",
        "lightblue",
        "lightcoral",
        "lightcyan",
        "lightgoldenrodyellow",
        "lightgray",
        "lightgreen",
        "lightgrey",
        "lightpink",
        "lightsalmon",
        "lightseagreen",
        "lightskyblue",
        "lightslategray",
        "lightslategrey",
        "lightsteelblue",
        "lightyellow",
        "lime",
        "limegreen",
        "linen",
        "magenta",
        "maroon",
        "mediumaquamarine",
        "mediumblue",
        "mediumorchid",
        "mediumpurple",
        "mediumseagreen",
        "mediumslateblue",
        "mediumspringgreen",
        "mediumturquoise",
        "mediumvioletred",
        "midnightblue",
        "mintcream",
        "mistyrose",
        "moccasin",
        "navajowhite",
        "navy",
        "oldlace",
        "olive",
        "olivedrab",
        "orange",
        "orangered",
        "orchid",
        "palegoldenrod",
        "palegreen",
        "paleturquoise",
        "palevioletred",
        "papayawhip",
        "peachpuff",
        "peru",
        "pink",
        "plum",
        "powderblue",
        "purple",
        "rebeccapurple",
        "red",
        "rosybrown",
        "royalblue",
        "saddlebrown",
        "salmon",
        "sandybrown",
        "seagreen",
        "seashell",
        "sienna",
        "silver",
        "skyblue",
        "slateblue",
        "slategray",
        "slategrey",
        "snow",
        "springgreen",
        "steelblue",
        "tan",
        "teal",
        "thistle",
        "tomato",
        "turquoise",
        "violet",
        "wheat",
        "white",
        "whitesmoke",
        "yellow",
        "yellowgreen"
    )
}

fn is_length_unit(unit: &JsWord) -> bool {
    matches_eq_ignore_ascii_case!(
        unit, "em", "rem", "ex", "rex", "cap", "rcap", "ch", "rch", "ic", "ric", "lh", "rlh",
        //  Viewport-percentage Lengths
        "vw", "svw", "lvw", "dvw", "vh", "svh", "lvh", "dvh", "vi", "svi", "lvi", "dvi", "vb",
        "svb", "lvb", "dvb", "vmin", "svmin", "lvmin", "dvmin", "vmax", "svmax", "lvmax", "dvmax",
        // Absolute lengths
        "cm", "mm", "q", "in", "pc", "pt", "px", "mozmm"
    )
}

fn is_container_lengths_unit(unit: &JsWord) -> bool {
    matches_eq_ignore_ascii_case!(unit, "cqw", "cqh", "cqi", "cqb", "cqmin", "cqmax")
}

fn is_angle_unit(unit: &JsWord) -> bool {
    matches_eq_ignore_ascii_case!(unit, "deg", "grad", "rad", "turn")
}

fn is_time_unit(unit: &JsWord) -> bool {
    matches_eq_ignore_ascii_case!(unit, "s", "ms")
}

fn is_frequency_unit(unit: &JsWord) -> bool {
    matches_eq_ignore_ascii_case!(unit, "hz", "khz")
}

fn is_resolution_unit(unit: &JsWord) -> bool {
    matches_eq_ignore_ascii_case!(unit, "dpi", "dpcm", "dppx", "x")
}

fn is_flex_unit(unit: &JsWord) -> bool {
    matches_eq_ignore_ascii_case!(unit, "fr")
}
