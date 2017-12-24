#![allow(unused_mut)]
#![allow(unused_variables)]

use self::input::{Input, LexerInput};
use self::state::State;
use self::util::*;
use swc_atoms::JsIdent;
use swc_common::{gen_iter, BytePos, Span};
use token::*;

pub mod input;
mod number;
mod state;
#[cfg(test)]
mod tests;
pub mod util;

#[derive(Fail, Debug, PartialEq, Eq, Hash)]
pub enum Error<InputError> {
    #[fail(display = "input error: {}", err)] Input {
        err: InputError,
    },
    #[fail(display = "unterminated string constant: {}", start)]
    UnterminatedStrLit {
        start: BytePos,
    },
    #[fail(display = "expected unicode escape sequence: {}", pos)]
    ExpectedUnicodeEscape {
        pos: BytePos,
    },
    #[fail(display = "unexpected escape sequence in keyword: {}", keyword)]
    EscapeInKeyword {
        keyword: JsIdent,
    },
    #[fail(display = "unterminated regexp (regexp started at {})", start)]
    UnterminatedRegxp {
        start: BytePos,
    },
    #[fail(display = "identifier directly after number at {}", pos)]
    IdentAfterNum {
        pos: BytePos,
    },
    #[fail(display = "Decimals with leading zeros (at {}) are not allowed in strict mode", start)]
    DecimalStartsWithZero {
        start: BytePos,
    },
    #[fail(display = "Octals with leading zeros (at {}) are not allowed in strict mode", start)]
    ImplicitOctalOnStrict {
        start: BytePos,
    },
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Default)]
pub struct Options {
    /// Support function bind expression.
    pub fn_bind: bool,

    pub strict: bool,

    /// Support numeric separator.
    pub num_sep: bool,
}

pub fn tokenize<I>(opts: Options, input: I) -> impl Iterator<Item = TokenAndSpan>
where
    I: Input,
{
    Lexer::new_with(opts, input).tokenize()
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
    fn skip_space(&mut self) -> bool {
        debug_assert!(self.state.can_skip_space());
        let mut line_break = false;

        while let Some((pos, c)) = {
            let cur = self.input.current().into_inner();
            cur
        } {
            match c {
                // space and non breaking space
                ' ' | '\u{A0}' => {}

                // line breaks
                _ if is_line_break(c) => {
                    line_break = true;
                }

                c if (BACKSPACE < c && c < SHIFT_OUT)
                    || (c <= OGHAM_SPACE_MARK && is_non_ascii_ws(c)) => {}

                _ => break,
            }

            self.input.bump();
        }

        line_break
    }

    pub fn tokenize(mut self) -> impl Iterator<Item = TokenAndSpan> {
        gen_iter(move || {
            while let Some((had_line_break, (start, c))) = {
                // skip spaces before getting next character, if we are allowed to.
                let had_line_break = if self.state.can_skip_space() {
                    self.skip_space()
                } else {
                    false
                };

                let cur = self.input.current().into_inner();
                cur.map(move |t| (had_line_break, t))
            } {
                let token = self.read_token(start, c, had_line_break)
                    .unwrap_or_else(|err| unimplemented!("error handling: {:?}", err));

                self.state.update(&token.token, had_line_break);
                yield token;
            }
        })
    }

    fn read_token(
        &mut self,
        start: BytePos,
        c: char,
        had_line_break: bool,
    ) -> Result<TokenAndSpan, Error<I::Error>> {
        debug_assert_eq!(
            self.input.current().into_inner(),
            Some((start, c)),
            "read_token() is called with wrong arguments"
        );

        let token = match c {
            // Identifier or keyword. '\uXXXX' sequences are allowed in
            // identifiers, so '\' also dispatches to that.
            c if c == '\\' || is_ident_start(c) => return self.read_ident_or_keyword(),

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

            '(' | ')' | ';' | ',' | '[' | ']' | '{' | '}' | '@' | '`' => {
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
                        '`' => BackQuote,
                        _ => unreachable!(),
                    },
                    span: Span { start, end },
                });
            }

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
            '?' => {
                //          const next = this.input.charCodeAt(this.state.pos + 1);
                // const next2 = this.input.charCodeAt(this.state.pos + 2);
                // if (next === charCodes.questionMark) { //  '??'
                //   this.finishOp(tt.nullishCoalescing, 2);
                // } else if (
                //   next === charCodes.dot &&
                // !(next2 >= charCodes.digit0 && next2 <= charCodes.digit9)
                // // ) {   // '.' not followed by a number
                //   this.state.pos += 2;
                //   this.finishToken(tt.questionDot);
                // } else {
                //   ++this.state.pos;
                //   this.finishToken(tt.question);
                // }
                unimplemented!("?")
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
                let mut width = 1;

                // check for **
                if is_mul {
                    if self.input.peek() == '*' {
                        width += 1;
                    }
                }

                // let next = this.input.charCodeAt(this.state.pos + 1);
                // const exprAllowed = this.state.exprAllowed;

                // Exponentiation operator **
                // if (code === charCodes.asterisk && next === charCodes.asterisk) {
                //   width++;
                //   next = this.input.charCodeAt(this.state.pos +2);
                //   type = tt.exponent;
                // }

                // if (next === charCodes.equalsTo &&!exprAllowed) {
                //   width++;
                //   type = tt.assign;
                // }

                // this.finishOp(type, width);
                unimplemented!("**, *, %")
            }

            //                     // Logical operators
//                     c @ '|' | c @ '&' => {
//                         if peek!() == c {
//                             match c {
//                                 '|' => BinOp(LogicalOr),
//                                 '&' => BinOp(LogicalAnd),
//                                 _ => unreachable!(),
//                             }
//                         } else {
//                             unimplemented!()
//                         }
//                         //           if (code === charCodes.verticalBar) {
//                         //   // '|>'
//                         //   if (next === charCodes.greaterThan) {
//                         //     this.finishOp(tt.pipeline, 2);
//                         //     return;
//                         // } else if (next === charCodes.rightCurlyBrace&&
//                         // this.hasPlugin("flow")) {     // '|}'
//                         //     this.finishOp(tt.braceBarR, 2);
//                         //     return;
//                         //   }
//                         // }

//                         // if (next === charCodes.equalsTo) {
//                         //   this.finishOp(tt.assign, 2);
//                         //   return;
//                         // }

//                         // this.finishOp(
// //   code === charCodes.verticalBar ? tt.bitwiseOR :
// tt.bitwiseAND,                         //   1,
//                         // );
//                     }
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

            //                     '+' | '-' => {
// //         const next =
// this.input.charCodeAt(this.state.pos + 1);

//                         // if (next === code) {
//                         //   if (
//                         //     next === charCodes.dash &&
//                         //     !this.inModule &&
// // this.input.charCodeAt(this.state.pos + 2) ===
// charCodes.greaterThan // &&
// lineBreak.test(this.input.slice(this. //
// state.lastTokEnd, this.state.pos))   ) { //     // A
// `-->` line comment                         //     this.skipLineComment(3);
//                         //     this.skipSpace();
//                         //     this.nextToken();
//                         //     return;
//                         //   }
//                         //   this.finishOp(tt.incDec, 2);
//                         //   return;
//                         // }

//                         // if (next === charCodes.equalsTo) {
//                         //   this.finishOp(tt.assign, 2);
//                         // } else {
//                         //   this.finishOp(tt.plusMin, 1);
//                         // }
//                         unimplemented!("+,-")
//                     }

//                     '<' | '>' => {
// //          const next =
// this.input.charCodeAt(this.state.pos + 1); // let
// size = 1;

//                         // if (next === code) {
//                         //   size =
//                         //     code === charCodes.greaterThan &&
// //     this.input.charCodeAt(this.state.pos + 2) ===
// charCodes.greaterThan                         //       ? 3
//                         //       : 2;
// // if (this.input.charCodeAt(this.state.pos + size)
// ===                         // charCodes.equalsTo) { this.finishOp(tt.
//                         // assign, size + 1);     return;
//                         //   }
//                         //   this.finishOp(tt.bitShift, size);
//                         //   return;
//                         // }

//                         // if (
//                         //   next === charCodes.exclamationMark &&
//                         //   code === charCodes.lessThan &&
//                         //   !this.inModule &&
// //   this.input.charCodeAt(this.state.pos + 2) ===
// charCodes.dash && //
// this.input.charCodeAt(this.state.pos + 3) === charCodes.dash
// // ) { // // `<!--`, an XML-style comment that
// should be interpreted as a line // comment
// this.skipLineComment(4);                         //   this.skipSpace();
//                         //   this.nextToken();
//                         //   return;
//                         // }

//                         // if (next === charCodes.equalsTo) {
//                         //   // <= | >=
//                         //   size = 2;
//                         // }

//                         // this.finishOp(tt.relational, size);
//                         unimplemented!("<>")
//                     }
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
            c => unimplemented!("error reporting for unexpected character '{}'", c),
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

    fn read_ident_or_keyword(&mut self) -> Result<TokenAndSpan, Error<I::Error>> {
        debug_assert!(self.input.current().is_some());

        let (word, span, has_escape) = self.read_word()?;

        if let Some(kwd) = Keyword::try_from(&word) {
            if has_escape {
                return Err(Error::EscapeInKeyword { keyword: word });
            } else {
                Ok(TokenAndSpan {
                    token: Keyword(kwd),
                    span,
                })
            }
        } else {
            Ok(TokenAndSpan {
                token: Ident(word),
                span,
            })
        }
    }

    fn may_read_word(&mut self) -> Result<Option<(JsIdent, Span, bool)>, Error<I::Error>> {
        if self.input.current().is_none() {
            return Ok(None);
        }

        if is_ident_start(self.input.current().as_char()) {
            self.read_word().map(Some)
        } else {
            Ok(None)
        }
    }

    /// returns (word, span, has_secape)
    fn read_word(&mut self) -> Result<(JsIdent, Span, bool), Error<I::Error>> {
        debug_assert!(self.input.current().is_some());

        let start = self.input.current().pos();
        let mut end = start;

        let mut has_escape = false;
        let mut word = String::new();
        let mut first = true;

        while let Some((pos, c)) = self.input.current().into_inner() {
            // TODO: optimize (cow / chunk)
            match c {
                c if is_ident_char(c) => {
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

    fn read_str_lit(&mut self) -> Result<TokenAndSpan, Error<I::Error>> {
        unimplemented!("string literal")
    }

    fn read_regexp(&mut self) -> Result<TokenAndSpan, Error<I::Error>> {
        debug_assert!(self.input.current().is_some());
        debug_assert_eq!(self.input.current(), '/');
        let start = self.input.bump();

        let (mut escaped, mut in_class) = (false, false);
        // TODO: Optimize (chunk, cow)
        let mut content = String::new();

        while let Some((pos, c)) = self.input.current().into_inner() {
            // This is ported from babel.
            // Seems like regexp literal cannot contain linebreak.
            if is_line_break(c) {
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

        // Need to use `read_word` because '\uXXXX' sequences are allowed
        // here (don't ask).
        let (flags, end) = self.may_read_word()?
            .map(|(f, s, _)| (f, s.end))
            .unwrap_or_else(|| ("".into(), end));

        Ok(TokenAndSpan {
            token: Regex(content, flags),
            span: Span { start, end },
        })
    }
}
