//! See [tc39][]
//!
//!
//!
//! [tc39]:https://tc39.github.io/ecma262/#sec-ecmascript-language-lexical-grammar

#![allow(unused_mut)]
#![allow(unused_variables)]

pub use self::input::Input;
use self::input::LexerInput;
use self::state::State;
use self::util::*;
use swc_atoms::JsWord;
use swc_common::{BytePos, Span};
use token::*;

pub mod input;
mod number;
mod state;
#[cfg(test)]
mod tests;
pub mod util;

#[derive(Fail, Debug, PartialEq, Eq, Hash)]
pub enum Error<InputError> {
    #[fail(display = "input error: {}", err)]
    Input { err: InputError },
    #[fail(display = "unterminated string constant: {}", start)]
    UnterminatedStrLit { start: BytePos },
    #[fail(display = "expected unicode escape sequence: {}", pos)]
    ExpectedUnicodeEscape { pos: BytePos },
    #[fail(display = "unexpected escape sequence in reserved word: {:?}", word)]
    EscapeInReservedWord { word: Word },
    #[fail(display = "unterminated regexp (regexp started at {})", start)]
    UnterminatedRegxp { start: BytePos },
    #[fail(display = "identifier directly after number at {}", pos)]
    IdentAfterNum { pos: BytePos },
    #[fail(display = "Decimals with leading zeros (at {}) are not allowed in strict mode", start)]
    DecimalStartsWithZero { start: BytePos },
    #[fail(display = "Octals with leading zeros (at {}) are not allowed in strict mode", start)]
    ImplicitOctalOnStrict { start: BytePos },
    #[fail(display = "Unexpected character '{}' on {}", c, pos)]
    UnexpectedChar { pos: BytePos, c: char },
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Default)]
pub struct Options {
    /// Support function bind expression.
    pub fn_bind: bool,

    pub strict: bool,

    /// Support numeric separator.
    pub num_sep: bool,
}

pub struct Lexer<I: Input> {
    input: LexerInput<I>,
    opts: Options,
    state: State,
}

impl<I: Input> Lexer<I> {
    pub fn new(input: I) -> Self {
        Self::new_with(Options::default(), input)
    }

    pub fn new_with(opts: Options, input: I) -> Self {
        Lexer {
            opts,
            state: State::new(),
            input: LexerInput::new(input),
        }
    }

    /// This does *not* skip comments.
    ///
    /// returns true if linebreak was skipped.
    ///
    /// See https://tc39.github.io/ecma262/#sec-white-space
    fn skip_space(&mut self) {
        debug_assert!(self.state.can_skip_space());
        let mut line_break = false;

        while let Some((pos, c)) = {
            let cur = self.input.current().into_inner();
            cur
        } {
            match c {
                // white spaces
                _ if c.is_ws() => {}

                // line breaks
                _ if c.is_line_break() => {
                    self.state.had_line_break = true;
                }

                _ => break,
            }

            self.input.bump();
        }
    }

    fn read_token(&mut self, start: BytePos, c: char) -> Result<TokenAndSpan, Error<I::Error>> {
        debug_assert_eq!(
            self.input.current().into_inner(),
            Some((start, c)),
            "read_token() is called with wrong arguments"
        );

        let token = match c {
            // Identifier or keyword. '\uXXXX' sequences are allowed in
            // identifiers, so '\' also dispatches to that.
            c if c == '\\' || c.is_ident_start() => return self.read_ident_or_keyword(),

            //
            '.' => {
                // TODO Check for eof
                let next = self.input.peek();
                if next >= '0' && next <= '9' {
                    return self.read_number(true);
                }

                let end = self.input.bump(); // 1st `.`

                // ES7 Function bind operator
                // e.g. foo::bar();
                if next == '.' && self.input.peek() == '.' {
                    self.input.bump(); // 2nd `.`
                    let end = self.input.bump(); // 3rd `.`

                    TokenAndSpan {
                        token: DotDotDot,
                        span: Span { start, end },
                    }
                } else {
                    TokenAndSpan {
                        token: Dot,
                        span: Span { start, end },
                    }
                }
            }

            '(' | ')' | ';' | ',' | '[' | ']' | '{' | '}' | '@' | '?' => {
                // These tokens are emitted directly.
                let end = self.input.bump();
                return Ok(TokenAndSpan {
                    token: match c {
                        '(' => LParen,
                        ')' => RParen,
                        ';' => Semi,
                        ',' => Comma,
                        '[' => LBracket,
                        ']' => RBracket,
                        '{' => LBrace,
                        '}' => RBrace,
                        '@' => At,
                        '?' => QuestionMark,
                        _ => unreachable!(),
                    },
                    span: Span { start, end },
                });
            }

            '`' => unimplemented!("template literal"),

            ':' => {
                let end = self.input.bump();

                if self.opts.fn_bind && self.input.current() == ':' {
                    let end = self.input.bump();
                    TokenAndSpan {
                        token: ColonColon,
                        span: Span { start, end },
                    }
                } else {
                    TokenAndSpan {
                        token: Colon,
                        span: Span { start, end: start },
                    }
                }
            }

            '0' => {
                let next = self.input.peek();

                // Hex
                let radix = if next == 'x' || next == 'X' {
                    Some(16)
                } else if next == 'o' || next == 'O' {
                    // Octal
                    Some(8)
                } else if next == 'b' || next == 'B' {
                    Some(2)
                } else {
                    None
                };

                if let Some(radix) = radix {
                    return self.read_radix_number(radix);
                } else {
                    return self.read_number(false);
                }
            }
            '1'...'9' => return self.read_number(false),

            '"' | '\'' => return self.read_str_lit(),

            '/' => return self.read_slash(),

            c @ '%' | c @ '*' => {
                let is_mul = c == '*';
                let mut end = self.input.bump();
                let mut token = if is_mul { BinOp(Mul) } else { BinOp(Mod) };

                // check for **
                if is_mul {
                    if self.input.current() == '*' {
                        end = self.input.bump();
                        token = BinOp(Exp)
                    }
                }

                if self.input.current() == '=' {
                    end = self.input.bump();
                    token = match token {
                        BinOp(Div) => AssignOp(DivAssign),
                        BinOp(Exp) => AssignOp(ExpAssign),
                        BinOp(Mod) => AssignOp(ModAssign),
                        _ => unreachable!(),
                    }
                }

                TokenAndSpan {
                    token,
                    span: Span { start, end },
                }
            }

            // Logical operators
            c @ '|' | c @ '&' => {
                let end = self.input.bump();
                let token = if c == '&' { BitAnd } else { BitOr };

                // '|=', '&='
                if self.input.current() == '=' {
                    let end = self.input.bump();
                    return Ok(TokenAndSpan {
                        token: AssignOp(match token {
                            BitAnd => BitAndAssign,
                            BitOr => BitOrAssign,
                            _ => unreachable!(),
                        }),
                        span: Span { start, end },
                    });
                }

                // '||', '&&'
                if self.input.current() == c {
                    let end = self.input.bump();
                    return Ok(TokenAndSpan {
                        token: BinOp(match token {
                            BitAnd => LogicalAnd,
                            BitOr => LogicalOr,
                            _ => unreachable!(),
                        }),
                        span: Span { start, end },
                    });
                }

                TokenAndSpan {
                    token: BinOp(token),
                    span: Span { start, end },
                }
            }
            '^' => {
                // Bitwise xor
                let end = self.input.bump();
                if self.input.current() == '=' {
                    let end = self.input.bump();
                    TokenAndSpan {
                        token: AssignOp(BitXorAssign),
                        span: Span { start, end },
                    }
                } else {
                    TokenAndSpan {
                        token: BinOp(BitXor),
                        span: Span { start, end },
                    }
                }
            }

            '+' | '-' => {
                let end = self.input.bump();

                // '++', '--'
                if self.input.current() == c {
                    let end = self.input.bump();

                    // TODO: may handle '-->' line comment?

                    TokenAndSpan {
                        token: if c == '+' { PlusPlus } else { MinusMinus },
                        span: Span { start, end },
                    }
                } else if self.input.current() == '=' {
                    let end = self.input.bump();
                    TokenAndSpan {
                        token: AssignOp(if c == '+' { AddAssign } else { SubAssign }),
                        span: Span { start, end },
                    }
                } else {
                    TokenAndSpan {
                        token: BinOp(if c == '+' { Add } else { Sub }),
                        span: Span { start, end },
                    }
                }
            }

            '<' | '>' => return self.read_token_lt_gt(),

            '!' | '=' => {
                let end = self.input.bump();

                if self.input.current() == '=' {
                    // "=="
                    let end = self.input.bump();

                    if self.input.current() == '=' {
                        let end = self.input.bump();
                        TokenAndSpan {
                            token: if c == '!' {
                                BinOp(NotEqEq)
                            } else {
                                BinOp(EqEqEq)
                            },
                            span: Span { start, end },
                        }
                    } else {
                        TokenAndSpan {
                            token: if c == '!' { BinOp(NotEq) } else { BinOp(EqEq) },
                            span: Span { start, end },
                        }
                    }
                } else if c == '=' && self.input.current() == '>' {
                    // "=>"
                    let end = self.input.bump();

                    TokenAndSpan {
                        token: Arrow,
                        span: Span { start, end },
                    }
                } else {
                    TokenAndSpan {
                        token: if c == '!' { Bang } else { AssignOp(Assign) },
                        span: Span { start, end },
                    }
                }
            }
            '~' => unimplemented!("`~`"),

            // unexpected character
            c => return Err(Error::UnexpectedChar { c, pos: start }),
        };

        Ok(token)
    }

    fn read_slash(&mut self) -> Result<TokenAndSpan, Error<I::Error>> {
        debug_assert_eq!(self.input.current(), '/');
        let start = self.input.current().pos();

        // Line comment
        if self.input.peek() == '/' {
            self.input.bump();
            self.input.bump();
            unimplemented!("LineComment")
        }

        // Block comment
        if self.input.peek() == '*' {
            unimplemented!("BlockComment")
        }

        // Regex
        if self.state.is_expr_allowed {
            return self.read_regexp();
        }

        // Divide operator
        let end = self.input.bump();

        Ok(if self.input.current() == '=' {
            let end = self.input.bump();
            TokenAndSpan {
                token: AssignOp(DivAssign),
                span: Span { start, end },
            }
        } else {
            TokenAndSpan {
                token: BinOp(Div),
                span: Span { start, end: start },
            }
        })
    }

    fn read_token_lt_gt(&mut self) -> Result<TokenAndSpan, Error<I::Error>> {
        debug_assert!(self.input.current() == '<' || self.input.current() == '>');

        let start = self.input.current().pos();
        let c = self.input.current().as_char();
        let mut end = self.input.bump();
        let mut op = if c == '<' { Lt } else { Gt };

        // '<<', '>>'
        if self.input.current() == c {
            end = self.input.bump();
            op = if c == '<' { LShift } else { RShift };

            //'>>>'
            if c == '>' && self.input.current() == c {
                end = self.input.bump();
                op = ZeroFillRShift;
            }
        }

        let token = if self.input.current() == '=' {
            end = self.input.bump();
            match op {
                Lt => BinOp(LtEq),
                Gt => BinOp(GtEq),
                LShift => AssignOp(LShiftAssign),
                RShift => AssignOp(RShiftAssign),
                ZeroFillRShift => AssignOp(ZeroFillRShiftAssign),
                _ => unreachable!(),
            }
        } else {
            BinOp(op)
        };

        Ok(TokenAndSpan {
            token,
            span: Span { start, end },
        })
    }

    /// See https://tc39.github.io/ecma262/#sec-names-and-keywords
    fn read_ident_or_keyword(&mut self) -> Result<TokenAndSpan, Error<I::Error>> {
        debug_assert!(self.input.current().is_some());

        let (word, span, has_escape) = self.read_word_as_str()?;

        let word = Word::from(word);
        if has_escape && word.is_reserved_word(self.opts.strict) {
            return Err(Error::EscapeInReservedWord { word });
        }

        Ok(TokenAndSpan {
            token: Word(word),
            span,
        })
    }

    fn may_read_word_as_str(&mut self) -> Result<Option<(JsWord, Span, bool)>, Error<I::Error>> {
        if self.input.current().is_none() {
            return Ok(None);
        }

        if self.input.current().is_ident_start() {
            self.read_word_as_str().map(Some)
        } else {
            Ok(None)
        }
    }

    /// returns (word, span, has_secape)
    fn read_word_as_str(&mut self) -> Result<(JsWord, Span, bool), Error<I::Error>> {
        debug_assert!(self.input.current().is_some());

        let start = self.input.current().pos();
        let mut end = start;

        let mut has_escape = false;
        let mut word = String::new();
        let mut first = true;

        while let Some((pos, c)) = self.input.current().into_inner() {
            // TODO: optimize (cow / chunk)
            match c {
                c if c.is_ident_part() => {
                    self.input.bump();
                    word.push(c);
                }
                // unicode escape
                '\\' => {
                    self.input.bump();
                    if self.input.current() != 'u' {
                        return Err(Error::ExpectedUnicodeEscape { pos });
                    }

                    // ++this.state.pos;
                    // const esc = this.readCodePoint(true);
                    // // $FlowFixMe (thinks esc may be null, but throwOnInvalid is true)
                    // if (!(first ? isIdentifierStart : isIdentifierChar)(esc, true)) {
                    //   this.raise(escStart, "Invalid Unicode escape");

                    // end=pos;
                    unimplemented!("read unicode escape char")
                }

                _ => {
                    break;
                }
            }
            end = pos;
            first = false;
        }
        Ok((word.into(), Span { start, end }, has_escape))
    }

    /// See https://tc39.github.io/ecma262/#sec-literals-string-literals
    fn read_str_lit(&mut self) -> Result<TokenAndSpan, Error<I::Error>> {
        unimplemented!("string literal")
    }

    fn read_regexp(&mut self) -> Result<TokenAndSpan, Error<I::Error>> {
        debug_assert!(self.input.current().is_some());
        debug_assert_eq!(
            self.input.current(),
            '/',
            "read_regexp expects current char to be '/'"
        );
        let start = self.input.bump();

        let (mut escaped, mut in_class) = (false, false);
        // TODO: Optimize (chunk, cow)
        let mut content = String::new();

        while let Some((pos, c)) = self.input.current().into_inner() {
            // This is ported from babel.
            // Seems like regexp literal cannot contain linebreak.
            if c.is_line_break() {
                return Err(Error::UnterminatedRegxp { start: start });
            }

            if escaped {
                escaped = false;
            } else {
                match c {
                    '[' => in_class = true,
                    ']' if in_class => in_class = false,
                    // Termniates content part of regex literal
                    '/' if !in_class => break,
                    _ => {}
                }
                escaped = c == '\\';
            }
            self.input.bump();
            content.push(c);
        }

        // input is terminated without following `/`
        if self.input.current() != '/' {
            return Err(Error::UnterminatedRegxp { start });
        }

        let end = self.input.bump();

        // Spec says "It is a Syntax Error if IdentifierPart contains a Unicode escape
        // sequence." TODO: check for escape

        // Need to use `read_word` because '\uXXXX' sequences are allowed
        // here (don't ask).
        let (flags, end) = self.may_read_word_as_str()?
            .map(|(f, s, _)| (f, s.end))
            .unwrap_or_else(|| ("".into(), end));

        Ok(TokenAndSpan {
            token: Regex(content, flags),
            span: Span { start, end },
        })
    }
}

impl<I: Input> Iterator for Lexer<I> {
    type Item = TokenAndSpan;
    fn next(&mut self) -> Option<Self::Item> {
        self.state.had_line_break = false;

        while let Some((start, c)) = {
            // skip spaces before getting next character, if we are allowed to.
            if self.state.can_skip_space() {
                self.skip_space()
            };

            let cur = self.input.current().into_inner();
            cur
        } {
            let token = self.read_token(start, c)
                .unwrap_or_else(|err| unimplemented!("error handling: {:?}", err));

            self.state.update(&token.token);
            return Some(token);
        }

        None
    }
}

impl<I: Input> ::parser::Input for Lexer<I> {
    fn had_line_break_after_last(&self) -> bool {
        self.state.had_line_break
    }
}
