//! ECMAScript lexer.
//!
//! In future, this might use string directly.

#![allow(unused_mut)]
#![allow(unused_variables)]
pub use self::input::Input;
use self::input::LexerInput;
use self::state::State;
use self::util::*;
use Session;
use error::SyntaxError;
use parser_macros::parser;
use std::char;
use swc_atoms::JsWord;
use swc_common::{BytePos, Span};
use swc_common::errors::Diagnostic;
use token::*;

#[macro_use]
mod macros;
pub mod input;
mod number;
mod state;
#[cfg(test)]
mod tests;
pub mod util;

pub type LexResult<'a, T> = Result<T, Diagnostic<'a>>;

pub struct Lexer<'a, I: Input> {
    session: Session<'a>,
    input: LexerInput<I>,
    state: State,
}

impl<'a, I: Input> Lexer<'a, I> {
    pub fn new(session: Session<'a>, input: I) -> Self {
        Lexer {
            session,
            input: LexerInput::new(input),
            state: State::new(),
        }
    }

    fn read_token(&mut self) -> LexResult<'a, Option<Token>> {
        let c = match self.input.current() {
            Some(c) => c,
            None => return Ok(None),
        };
        let start = cur_pos!(self);

        let token = match c {
            // Identifier or keyword. '\uXXXX' sequences are allowed in
            // identifiers, so '\' also dispatches to that.
            c if c == '\\' || c.is_ident_start() => return self.read_ident_or_keyword().map(Some),

            //
            '.' => {
                // Check for eof
                let next = match self.input.peek() {
                    Some(next) => next,
                    None => {
                        self.input.bump();
                        return Ok(Some(tok!('.')));
                    }
                };
                if '0' <= next && next <= '9' {
                    return self.read_number(true).map(Token::Num).map(Some);
                }

                self.input.bump(); // 1st `.`

                if next == '.' && self.input.peek() == Some('.') {
                    self.input.bump(); // 2nd `.`
                    self.input.bump(); // 3rd `.`

                    return Ok(Some(tok!("...")));
                }

                return Ok(Some(tok!('.')));
            }

            '(' | ')' | ';' | ',' | '[' | ']' | '{' | '}' | '@' | '?' => {
                // These tokens are emitted directly.
                self.input.bump();
                return Ok(Some(match c {
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
                }));
            }

            '`' => {
                bump!(self);
                return Ok(Some(tok!('`')));
            }

            ':' => {
                self.input.bump();

                if self.session.cfg.fn_bind && self.input.current() == Some(':') {
                    self.input.bump();
                    return Ok(Some(tok!("::")));
                }

                return Ok(Some(tok!(':')));
            }

            '0' => {
                let next = self.input.peek();

                let radix = match next {
                    Some('x') | Some('X') => 16,
                    Some('o') | Some('O') => 8,
                    Some('b') | Some('B') => 2,
                    _ => return self.read_number(false).map(Num).map(Some),
                };

                return self.read_radix_number(radix).map(Num).map(Some);
            }
            '1'...'9' => return self.read_number(false).map(Num).map(Some),

            '"' | '\'' => return self.read_str_lit().map(Some),

            '/' => return self.read_slash(),

            c @ '%' | c @ '*' => {
                let is_mul = c == '*';
                self.input.bump();
                let mut token = if is_mul { BinOp(Mul) } else { BinOp(Mod) };

                // check for **
                if is_mul {
                    if self.input.current() == Some('*') {
                        self.input.bump();
                        token = BinOp(Exp)
                    }
                }

                if self.input.current() == Some('=') {
                    self.input.bump();
                    token = match token {
                        BinOp(Mul) => AssignOp(MulAssign),
                        BinOp(Mod) => AssignOp(ModAssign),
                        BinOp(Exp) => AssignOp(ExpAssign),
                        _ => unreachable!(),
                    }
                }

                token
            }

            // Logical operators
            c @ '|' | c @ '&' => {
                self.input.bump();
                let token = if c == '&' { BitAnd } else { BitOr };

                // '|=', '&='
                if self.input.current() == Some('=') {
                    self.input.bump();
                    return Ok(Some(AssignOp(match token {
                        BitAnd => BitAndAssign,
                        BitOr => BitOrAssign,
                        _ => unreachable!(),
                    })));
                }

                // '||', '&&'
                if self.input.current() == Some(c) {
                    self.input.bump();
                    return Ok(Some(BinOp(match token {
                        BitAnd => LogicalAnd,
                        BitOr => LogicalOr,
                        _ => unreachable!(),
                    })));
                }

                BinOp(token)
            }
            '^' => {
                // Bitwise xor
                self.input.bump();
                if self.input.current() == Some('=') {
                    self.input.bump();
                    AssignOp(BitXorAssign)
                } else {
                    BinOp(BitXor)
                }
            }

            '+' | '-' => {
                self.input.bump();

                // '++', '--'
                if self.input.current() == Some(c) {
                    self.input.bump();

                    // Handle -->
                    if self.state.had_line_break && c == '-' && is!(self, '>') {
                        self.skip_line_comment(1);
                        self.skip_space();
                        return self.read_token();
                    }

                    if c == '+' {
                        PlusPlus
                    } else {
                        MinusMinus
                    }
                } else if self.input.current() == Some('=') {
                    self.input.bump();
                    AssignOp(if c == '+' { AddAssign } else { SubAssign })
                } else {
                    BinOp(if c == '+' { Add } else { Sub })
                }
            }

            '<' | '>' => return self.read_token_lt_gt(),

            '!' | '=' => {
                self.input.bump();

                if self.input.current() == Some('=') {
                    // "=="
                    self.input.bump();

                    if self.input.current() == Some('=') {
                        self.input.bump();
                        if c == '!' {
                            BinOp(NotEqEq)
                        } else {
                            BinOp(EqEqEq)
                        }
                    } else {
                        if c == '!' {
                            BinOp(NotEq)
                        } else {
                            BinOp(EqEq)
                        }
                    }
                } else if c == '=' && self.input.current() == Some('>') {
                    // "=>"
                    self.input.bump();

                    Arrow
                } else {
                    if c == '!' {
                        Bang
                    } else {
                        AssignOp(Assign)
                    }
                }
            }
            '~' => {
                self.input.bump();
                tok!('~')
            }

            // unexpected character
            c => syntax_error!(self, pos_span(start), SyntaxError::UnexpectedChar { c }),
        };

        Ok(Some(token))
    }

    /// Read an escaped charater for string literal.
    fn read_escaped_char(&mut self, in_template: bool) -> LexResult<'a, Option<char>> {
        assert_eq!(cur!(self), Some('\\'));
        let start = cur_pos!(self);
        bump!(self); // '\'

        let c = match cur!(self) {
            Some(c) => c,
            None => syntax_error!(self, pos_span(start), SyntaxError::InvalidStrEscape),
        };
        let c = match c {
            'n' => '\n',
            'r' => '\r',
            't' => '\t',
            'b' => '\u{0008}',
            'v' => '\u{000b}',
            'f' => '\u{000c}',
            '\r' => {
                bump!(self); // remove '\r'

                if cur!(self) == Some('\n') {
                    bump!(self);
                }
                return Ok(None);
            }
            '\n' | '\u{2028}' | '\u{2029}' => {
                bump!(self);
                return Ok(None);
            }

            // read hexadecimal escape sequences
            'x' => {
                bump!(self); // 'x'
                return self.read_hex_char(2).map(Some);
            }

            // read unicode escape sequences
            'u' => {
                return self.read_unicode_escape(start).map(Some);
            }
            // octal escape sequences
            '0'...'7' => {
                bump!(self);
                let first_c = if c == '0' {
                    match cur!(self) {
                        Some(next) if next.is_digit(8) => c,
                        _ => return Ok(Some('\u{0000}')),
                    }
                } else {
                    c
                };
                let mut value: u8 = first_c.to_digit(8).unwrap() as u8;
                macro_rules! one {
                    ($check:expr) => {{
                        match cur!(self).and_then(|c| c.to_digit(8)) {
                            Some(v) => {
                                value = if $check {
                                    let new_val = value
                                        .checked_mul(8)
                                        .and_then(|value| value.checked_add(v as u8));
                                    match new_val {
                                        Some(val) => val,
                                        None => return Ok(Some(value as char)),
                                    }
                                } else {
                                    value * 8 + v as u8
                                };
                                bump!(self);
                            }
                            _ => {
                                return Ok(Some(value as char))
                            },
                        }
                    }};
                }
                one!(false);
                one!(true);

                return Ok(Some(value as char));
            }
            _ => c,
        };
        self.input.bump();

        Ok(Some(c))
    }
}

#[parser]
impl<'a, I: Input> Lexer<'a, I> {
    fn read_slash(&mut self) -> LexResult<'a, Option<Token>> {
        debug_assert_eq!(cur!(), Some('/'));
        let start = cur_pos!();

        // Regex
        if self.state.is_expr_allowed {
            return self.read_regexp().map(Some);
        }

        // Divide operator
        bump!();

        Ok(Some(if cur!() == Some('=') {
            bump!();
            tok!("/=")
        } else {
            tok!('/')
        }))
    }

    fn read_token_lt_gt(&mut self) -> LexResult<'a, Option<Token>> {
        assert!(cur!() == Some('<') || cur!() == Some('>'));

        let c = cur!().unwrap();
        bump!();

        // XML style comment. `<!--`
        if !self.session.cfg.module && c == '<' && is!('!') && peek!() == Some('-')
            && peek_ahead!() == Some('-')
        {
            self.skip_line_comment(3);
            self.skip_space();
            return self.read_token();
        }

        let mut op = if c == '<' { Lt } else { Gt };

        // '<<', '>>'
        if cur!() == Some(c) {
            bump!();
            op = if c == '<' { LShift } else { RShift };

            //'>>>'
            if c == '>' && cur!() == Some(c) {
                bump!();
                op = ZeroFillRShift;
            }
        }

        let token = if eat!('=') {
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

        Ok(Some(token))
    }

    /// See https://tc39.github.io/ecma262/#sec-names-and-keywords
    fn read_ident_or_keyword(&mut self) -> LexResult<'a, Token> {
        assert!(cur!().is_some());
        let start = cur_pos!();

        let (word, has_escape) = self.read_word_as_str()?;

        // TODO: Use extension trait instead of into/from
        let word = Word::from(word);
        if has_escape && word.is_reserved_word(self.session.cfg.strict) {
            syntax_error!(
                span!(start),
                SyntaxError::EscapeInReservedWord { word: word.into() }
            );
        } else {
            Ok(Word(word))
        }
    }

    fn may_read_word_as_str(&mut self) -> LexResult<'a, Option<(JsWord, bool)>> {
        match cur!() {
            Some(c) if c.is_ident_start() => self.read_word_as_str().map(Some),
            _ => Ok(None),
        }
    }

    /// returns (word, has_escape)
    fn read_word_as_str(&mut self) -> LexResult<'a, (JsWord, bool)> {
        assert!(cur!().is_some());

        let mut has_escape = false;
        let mut word = String::new();
        let mut first = true;

        while let Some(c) = cur!() {
            let start = cur_pos!();
            // TODO: optimize (cow / chunk)
            match c {
                c if c.is_ident_part() => {
                    bump!();
                    word.push(c);
                }
                // unicode escape
                '\\' => {
                    bump!();
                    if !is!('u') {
                        syntax_error!(pos_span(start), SyntaxError::ExpectedUnicodeEscape);
                    }
                    let c = self.read_unicode_escape(start)?;
                    let valid = if first {
                        c.is_ident_start()
                    } else {
                        c.is_ident_part()
                    };

                    if !valid {
                        syntax_error!(span!(start), SyntaxError::InvalidIdentChar);
                    }
                    word.push(c);
                }

                _ => {
                    break;
                }
            }
            first = false;
        }
        Ok((word.into(), has_escape))
    }

    fn read_unicode_escape(&mut self, start: BytePos) -> LexResult<'a, char> {
        assert_eq!(cur!(), Some('u'));
        bump!();

        if eat!('{') {
            let cp_start = cur_pos!();
            let c = self.read_code_point()?;

            if !eat!('}') {
                syntax_error!(span!(start), SyntaxError::InvalidUnicodeEscape);
            }

            Ok(c)
        } else {
            self.read_hex_char(4)
        }
    }

    fn read_hex_char(&mut self, count: u8) -> LexResult<'a, char> {
        debug_assert!(count == 2 || count == 4);

        let pos = cur_pos!();
        match self.read_int(16, count)? {
            Some(val) => match char::from_u32(val) {
                Some(c) => Ok(c),
                None => unimplemented!("Syntax Error: not char? val = {}", val),
            },
            None => unimplemented!("Syntax Error: expected {} hex chars", count),
        }
    }

    /// Read `CodePoint`.
    fn read_code_point(&mut self) -> LexResult<'a, char> {
        let start = cur_pos!();
        let val = self.read_int(16, 0)?;
        match val {
            Some(val) if 0x10FFFF >= val => match char::from_u32(val) {
                Some(c) => Ok(c),
                None => syntax_error!(span!(start), SyntaxError::InvalidCodePoint),
            },
            _ => syntax_error!(span!(start), SyntaxError::InvalidCodePoint),
        }
    }

    /// See https://tc39.github.io/ecma262/#sec-literals-string-literals
    fn read_str_lit(&mut self) -> LexResult<'a, Token> {
        assert!(cur!() == Some('\'') || cur!() == Some('"'));
        let start = cur_pos!();
        let quote = cur!().unwrap();
        bump!(); // '"'

        let mut out = String::new();

        //TODO: Optimize (Cow, Chunk)

        while let Some(c) = cur!() {
            match c {
                c if c == quote => {
                    bump!();
                    return Ok(Str(out, c == '"'));
                }
                '\\' => out.extend(self.read_escaped_char(false)?),
                c if c.is_line_break() => {
                    syntax_error!(span!(start), SyntaxError::UnterminatedStrLit)
                }
                _ => {
                    out.push(c);
                    bump!();
                }
            }
        }

        syntax_error!(span!(start), SyntaxError::UnterminatedStrLit)
    }

    /// Expects current char to be '/'
    fn read_regexp(&mut self) -> LexResult<'a, Token> {
        assert_eq!(cur!(), Some('/'));
        let start = cur_pos!();
        bump!();

        let (mut escaped, mut in_class) = (false, false);
        // TODO: Optimize (chunk, cow)
        let mut content = String::new();

        while let Some(c) = cur!() {
            // This is ported from babel.
            // Seems like regexp literal cannot contain linebreak.
            if c.is_line_break() {
                syntax_error!(span!(start), SyntaxError::UnterminatedRegxp);
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
            bump!();
            content.push(c);
        }

        // input is terminated without following `/`
        if cur!() != Some('/') {
            syntax_error!(span!(start), SyntaxError::UnterminatedRegxp);
        }

        bump!(); // '/'

        // Spec says "It is a Syntax Error if IdentifierPart contains a Unicode escape
        // sequence." TODO: check for escape

        // Need to use `read_word` because '\uXXXX' sequences are allowed
        // here (don't ask).
        let flags = self.may_read_word_as_str()?
            .map(|(f, _)| f)
            .unwrap_or_else(|| "".into());

        Ok(Regex(content, flags))
    }

    fn read_tmpl_token(&mut self) -> LexResult<'a, Token> {
        let start = cur_pos!();

        // TODO: Optimize
        let mut out = String::new();

        while let Some(c) = cur!() {
            if c == '`' || (c == '$' && peek!() == Some('{')) {
                if start == cur_pos!() && self.state.last_was_tpl_element() {
                    if c == '$' {
                        bump!();
                        bump!();
                        return Ok(tok!("${"));
                    } else {
                        bump!();
                        return Ok(tok!('`'));
                    }
                }

                // TODO: Handle error
                return Ok(Template(out));
            }

            if c == '\\' {
                let ch = self.read_escaped_char(true)?;
                out.extend(ch);
            } else if c.is_line_break() {
                self.state.had_line_break = true;
                let c = if c == '\r' && peek!() == Some('\n') {
                    bump!(); // '\r'
                    '\n'
                } else {
                    c
                };
                bump!();
                out.push(c);
            } else {
                bump!();
                out.push(c);
            }
        }

        unimplemented!("error: unterminated template");
    }

    pub fn had_line_break_before_last(&self) -> bool {
        self.state.had_line_break
    }
}

fn pos_span(p: BytePos) -> Span {
    Span::new(p, p, Default::default())
}
