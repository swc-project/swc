//! JavaScript primary expressions.

use std::borrow::Cow;

use num_bigint::BigInt as BigIntValue;
use swc_atoms::{Atom, Wtf8Atom};
use swc_common::Span;
#[cfg(feature = "flow")]
use swc_common::Spanned;
use swc_ecma_ast::{
    BigInt, Bool, Expr, Ident, Lit, Null, Number, ParenExpr, PrivateName, Regex, Str, ThisExpr,
};

use crate::{
    error::{Error, SyntaxError},
    next::{
        lexer::{config::Config, TokenKind as Kind},
        parser::{context::Context, cursor::Parser},
    },
};

impl<C: Config> Parser<'_, C> {
    /// Parse the non-recursive primary expression layer.
    pub(crate) fn parse_primary_expression(&mut self) -> Result<Box<Expr>, Error> {
        let token = self.token();
        let span = token.span();
        match token.kind() {
            Kind::Ident
                if self.context().contains(Context::CLASS_MEMBER)
                    && self.token_source(token) == "arguments" =>
            {
                Err(Error::new(span, SyntaxError::ArgumentsInClassField))
            }
            Kind::Interface
            | Kind::Package
            | Kind::Private
            | Kind::Protected
            | Kind::Public
            | Kind::Implements
            | Kind::Static
                if self.context().intersects(Context::STRICT | Context::MODULE)
                    && !self.context().contains(Context::FLOW) =>
            {
                Err(Error::new(
                    span,
                    SyntaxError::InvalidIdentInStrict(self.identifier_atom(token)),
                ))
            }
            #[cfg(feature = "flow")]
            Kind::Ident if self.context().contains(Context::FLOW) && self.is_flow_match_start() => {
                self.parse_flow_match_expression()
            }
            Kind::Async if self.is_async_function_start() => self.parse_function_expression(),
            Kind::Class => self.parse_class_expression(),
            _ if self.at_identifier_reference() => {
                let symbol = self.identifier_atom(token);
                self.validate_identifier_reference(&Ident::new_no_ctxt(symbol.clone(), span));
                self.advance();
                Ok(Box::new(Expr::Ident(Ident::new_no_ctxt(symbol, span))))
            }
            Kind::This => {
                self.advance();
                Ok(Box::new(Expr::This(ThisExpr { span })))
            }
            Kind::Hash => {
                let start = token.start();
                self.advance();
                let name = self.token();
                if !self.at_identifier_name() {
                    return Err(self.expected_error(Kind::Ident));
                }
                if name.start() != token.end() {
                    self.emit_error(Error::new(
                        Span::new_with_checked(token.start(), name.end()),
                        SyntaxError::Unexpected {
                            got: "whitespace after #".into(),
                            expected: "private name adjacent to #",
                        },
                    ));
                }
                let private = PrivateName {
                    span: Span::new_with_checked(start, name.end()),
                    name: self.identifier_atom(name),
                };
                self.record_private_use(private.name.clone(), private.span);
                self.advance();
                if !self.at(Kind::In) {
                    self.emit_error(Error::new(
                        private.span,
                        SyntaxError::Unexpected {
                            got: "bare private name".into(),
                            expected: "private name as a member or left operand of in",
                        },
                    ));
                }
                Ok(Box::new(Expr::PrivateName(private)))
            }
            Kind::Null => {
                self.advance();
                Ok(Box::new(Expr::Lit(Lit::Null(Null { span }))))
            }
            Kind::True | Kind::False => {
                let value = token.kind() == Kind::True;
                self.advance();
                Ok(Box::new(Expr::Lit(Lit::Bool(Bool { span, value }))))
            }
            Kind::Num => {
                let raw = self.token_source(token);
                if !has_valid_numeric_separators(raw)
                    || (is_legacy_integer_literal(raw) && self.context().contains(Context::STRICT))
                {
                    return Err(Error::new(
                        span,
                        SyntaxError::Unexpected {
                            got: raw.into(),
                            expected: "a valid numeric literal",
                        },
                    ));
                }
                let Some(value) = parse_number(raw) else {
                    return Err(Error::new(
                        span,
                        SyntaxError::Unexpected {
                            got: raw.into(),
                            expected: "a valid numeric literal",
                        },
                    ));
                };
                let raw = Some(Atom::new(raw));
                self.advance();
                Ok(Box::new(Expr::Lit(Lit::Num(Number { span, value, raw }))))
            }
            Kind::BigInt => {
                let raw = self.token_source(token);
                let Some(value) = parse_bigint(raw) else {
                    return Err(Error::new(
                        span,
                        SyntaxError::Unexpected {
                            got: raw.into(),
                            expected: "a valid BigInt literal",
                        },
                    ));
                };
                let raw = Some(Atom::new(raw));
                self.advance();
                Ok(Box::new(Expr::Lit(Lit::BigInt(BigInt {
                    span,
                    value,
                    raw,
                }))))
            }
            Kind::Str => {
                let raw = self.token_source(token);
                debug_assert!(raw.len() >= 2);
                let value = if token.escaped() {
                    self.escaped_string(token)
                        .expect("escaped string token must have a decoded value")
                        .clone()
                } else {
                    Wtf8Atom::new(&raw[1..raw.len() - 1])
                };
                let raw = Some(Atom::new(raw));
                self.advance();
                Ok(Box::new(Expr::Lit(Lit::Str(Str { span, value, raw }))))
            }
            Kind::Slash | Kind::DivEq => {
                let token = self.re_lex_regex();
                let raw = self.token_source(token);
                let Some(flags_start) = raw
                    .as_bytes()
                    .iter()
                    .rposition(|byte| *byte == b'/')
                    .filter(|index| *index > 0)
                else {
                    return Err(Error::new(token.span(), SyntaxError::UnterminatedRegExp));
                };
                let expression = Atom::new(&raw[1..flags_start]);
                let flags = Atom::new(&raw[flags_start + 1..]);
                let mut seen = 0_u16;
                for flag in flags.chars() {
                    let bit = match flag {
                        'd' => 1 << 0,
                        'g' => 1 << 1,
                        'i' => 1 << 2,
                        'm' => 1 << 3,
                        's' => 1 << 4,
                        'u' => 1 << 5,
                        'v' => 1 << 6,
                        'y' => 1 << 7,
                        _ => {
                            return Err(Error::new(token.span(), SyntaxError::UnknownRegExpFlags));
                        }
                    };
                    if seen & bit != 0 {
                        return Err(Error::new(
                            token.span(),
                            SyntaxError::DuplicatedRegExpFlags(flag),
                        ));
                    }
                    seen |= bit;
                }
                self.advance();
                Ok(Box::new(Expr::Lit(Lit::Regex(Regex {
                    span: token.span(),
                    exp: expression,
                    flags,
                }))))
            }
            Kind::LParen => {
                let start = span.lo;
                self.advance();
                let expression = self.with_recursion(|parser| {
                    parser.with_context(
                        crate::next::parser::context::Context::IN,
                        crate::next::parser::context::Context::empty(),
                        Self::parse_expression,
                    )
                })?;
                #[cfg(feature = "flow")]
                let expression = if self
                    .context()
                    .contains(crate::next::parser::context::Context::FLOW)
                    && self.at(Kind::Colon)
                {
                    let type_ann = self.parse_ts_type_annotation()?;
                    Box::new(Expr::TsAs(swc_ecma_ast::TsAsExpr {
                        span: Span::new_with_checked(expression.span().lo, type_ann.span.hi),
                        expr: expression,
                        type_ann: type_ann.type_ann,
                    }))
                } else {
                    expression
                };
                if !self.expect(Kind::RParen) {
                    return Err(self.expected_error(Kind::RParen));
                }
                Ok(Box::new(Expr::Paren(ParenExpr {
                    span: Span::new_with_checked(start, self.previous_end()),
                    expr: expression,
                })))
            }
            Kind::LBracket => self.parse_array_literal(),
            Kind::LBrace => self.parse_object_literal(),
            Kind::Function => self.parse_function_expression(),
            #[cfg(feature = "typescript")]
            Kind::Lt
                if self
                    .context()
                    .contains(crate::next::parser::context::Context::TYPESCRIPT)
                    && !self
                        .context()
                        .contains(crate::next::parser::context::Context::TSX) =>
            {
                self.parse_ts_type_assertion()
            }
            Kind::Lt | Kind::JSXTagStart if self.context().contains(Context::TSX) => {
                self.parse_jsx_expression()
            }
            Kind::NoSubstitutionTemplateLiteral | Kind::TemplateHead => self
                .parse_template_literal(false)
                .map(|template| Box::new(Expr::Tpl(template))),
            _ => Err(self.expected_error(Kind::Ident)),
        }
    }

    pub(crate) fn expected_error(&self, expected: Kind) -> Error {
        Error::new(
            self.token().span(),
            SyntaxError::Expected(expected.to_string(), self.kind().to_string()),
        )
    }
}

fn has_valid_numeric_separators(raw: &str) -> bool {
    if !raw.as_bytes().contains(&b'_') {
        return true;
    }
    let bytes = raw.as_bytes();
    if bytes.first() == Some(&b'0')
        && bytes
            .get(1)
            .is_some_and(|byte| byte.is_ascii_digit() || *byte == b'_')
    {
        return false;
    }
    bytes.iter().enumerate().all(|(index, byte)| {
        if *byte != b'_' {
            return true;
        }
        index > 0
            && bytes
                .get(index - 1)
                .is_some_and(|previous| previous.is_ascii_hexdigit())
            && bytes
                .get(index + 1)
                .is_some_and(|next| next.is_ascii_hexdigit())
    })
}

pub(crate) fn is_legacy_integer_literal(raw: &str) -> bool {
    let bytes = raw.as_bytes();
    bytes.len() > 1 && bytes[0] == b'0' && bytes.iter().all(u8::is_ascii_digit)
}

fn parse_number(raw: &str) -> Option<f64> {
    let raw = if raw.contains('_') {
        Cow::Owned(raw.replace('_', ""))
    } else {
        Cow::Borrowed(raw)
    };
    let bytes = raw.as_bytes();
    if bytes.len() > 2 && bytes[0] == b'0' {
        match bytes[1] {
            b'b' | b'B' => return parse_integer::<2>(&raw[2..]),
            b'o' | b'O' => return parse_integer::<8>(&raw[2..]),
            b'x' | b'X' => return parse_integer::<16>(&raw[2..]),
            _ => {}
        }
    }
    if bytes.len() > 1 && bytes[0] == b'0' && bytes.iter().all(|byte| matches!(byte, b'0'..=b'7')) {
        return parse_integer::<8>(&raw);
    }
    raw.parse().ok()
}

fn parse_integer<const RADIX: u8>(raw: &str) -> Option<f64> {
    debug_assert!(matches!(RADIX, 2 | 8 | 16));
    if raw.is_empty() {
        return None;
    }
    raw.bytes().try_fold(0.0_f64, |value, byte| {
        let digit = match byte {
            b'0'..=b'9' => byte - b'0',
            b'a'..=b'f' => byte - b'a' + 10,
            b'A'..=b'F' => byte - b'A' + 10,
            _ => return None,
        };
        (digit < RADIX).then(|| value.mul_add(f64::from(RADIX), f64::from(digit)))
    })
}

fn parse_bigint(raw: &str) -> Option<Box<BigIntValue>> {
    let digits = raw.strip_suffix('n')?;
    let (radix, digits) = if digits.len() > 2 && digits.as_bytes()[0] == b'0' {
        match digits.as_bytes()[1] {
            b'b' | b'B' => (2, &digits[2..]),
            b'o' | b'O' => (8, &digits[2..]),
            b'x' | b'X' => (16, &digits[2..]),
            _ => (10, digits),
        }
    } else {
        (10, digits)
    };
    let digits = if digits.contains('_') {
        Cow::Owned(digits.replace('_', ""))
    } else {
        Cow::Borrowed(digits)
    };
    BigIntValue::parse_bytes(digits.as_bytes(), radix).map(Box::new)
}

#[cfg(test)]
mod tests {
    use swc_common::{BytePos, Spanned};
    use swc_ecma_ast::{Expr, Lit};

    use crate::next::{
        lexer::{config::NoTokens, core::Lexer},
        parser::{context::Context, cursor::Parser},
    };

    fn parse(source: &str) -> Box<Expr> {
        let lexer = Lexer::new(source, BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        parser.parse_primary_expression().unwrap()
    }

    #[test]
    fn builds_identifier_and_literal_nodes_directly() {
        let identifier = parse("value");
        assert_eq!(identifier.as_ident().unwrap().sym, "value");

        let number = parse("0xff");
        let Expr::Lit(Lit::Num(number)) = &*number else {
            panic!("expected number")
        };
        assert_eq!(number.value, 255.0);
        assert_eq!(number.raw.as_deref(), Some("0xff"));

        let legacy_octal = parse("0012");
        let Expr::Lit(Lit::Num(number)) = &*legacy_octal else {
            panic!("expected number")
        };
        assert_eq!(number.value, 10.0);

        let string = parse("'hello'");
        let Expr::Lit(Lit::Str(string)) = &*string else {
            panic!("expected string")
        };
        assert_eq!(&*string.value, "hello");
    }

    #[test]
    fn preserves_parenthesis_node_and_absolute_span() {
        let expression = parse("(true)");
        let Expr::Paren(parenthesis) = &*expression else {
            panic!("expected parenthesis")
        };
        assert_eq!(parenthesis.span().lo, BytePos(1));
        assert_eq!(parenthesis.span().hi, BytePos(7));
        assert!(matches!(&*parenthesis.expr, Expr::Lit(Lit::Bool(_))));
    }

    #[test]
    fn parser_directed_regex_keeps_division_separate() {
        let lexer = Lexer::new("/a[b/]c/gi.test(value)", BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let expression = parser.parse_expression().unwrap();
        let Expr::Call(call) = &*expression else {
            panic!("expected regex method call")
        };
        let swc_ecma_ast::Callee::Expr(callee) = &call.callee else {
            panic!("expected expression callee")
        };
        let Expr::Member(member) = &**callee else {
            panic!("expected regex member")
        };
        let Expr::Lit(Lit::Regex(regex)) = &*member.obj else {
            panic!("expected regex literal")
        };
        assert_eq!(regex.exp, "a[b/]c");
        assert_eq!(regex.flags, "gi");

        let lexer = Lexer::new("value / 2", BytePos(1), NoTokens).unwrap();
        let mut parser = Parser::new(lexer, Context::default());
        let expression = parser.parse_expression().unwrap();
        assert!(matches!(
            &*expression,
            Expr::Bin(binary) if binary.op == swc_ecma_ast::BinaryOp::Div
        ));
    }
}
