use super::{LexResult, Lexer};
use crate::error::ErrorKind;
use swc_atoms::JsWord;
use swc_common::input::Input;
use swc_css_ast::{NumToken, Token};

impl<I> Lexer<I>
where
    I: Input,
{
    pub(super) fn read_number(&mut self) -> LexResult<Token> {
        let mut is_first = true;

        let mut had_dot = false;
        let start = self.input.cur_pos();
        self.input.uncons_while(|c| match c {
            '0'..='9' => {
                is_first = false;
                true
            }
            '-' | '+' => {
                if is_first {
                    is_first = false;
                    true
                } else {
                    false
                }
            }
            '.' => {
                is_first = false;

                if had_dot {
                    false
                } else {
                    had_dot = true;
                    true
                }
            }
            _ => {
                is_first = false;
                false
            }
        });
        let end = self.input.last_pos();

        let num_str = self.input.slice(start, end);

        let parsed = lexical::parse(&num_str.as_bytes()).unwrap_or_else(|err| {
            unreachable!("failed to parse `{}` using lexical: {:?}", num_str, err)
        });

        Ok(Token::Num(NumToken { value: parsed }))
    }

    pub(super) fn read_str(&mut self) -> LexResult<JsWord> {
        assert!(
            self.input.cur().is_some(),
            "read_str() should be called only is cur is `'` or `\"`"
        );
        let quote = self.input.cur().unwrap();
        assert!(
            quote == '\'' || quote == '"',
            "read_str() should be called only with `'` or `\"`"
        );

        let mut buf = String::new();

        self.input.bump(); // ' or "

        loop {
            match self.input.cur().unwrap() {
                // Ending code point
                c if c == quote => {
                    self.input.bump();
                    self.last_pos = Some(self.input.cur_pos());

                    break;
                }

                // EOF
                // case charCodeCategory.Eof:
                // This is a parse error. Return the <string-token>.

                // Newline
                c if c == '\n' || c == '\r' || c == '\x0C' => {
                    self.input.bump();
                
                    return Err(ErrorKind::BadString);
                }

                // // U+005C REVERSE SOLIDUS (\)
                '\\' => {
                    // If the next input code point is EOF, do nothing.
                    if self.input.peek().is_none() {
                        break;
                    }

                    // Otherwise, if the next input code point is a newline, consume it.
                    if self.input.peek() == Some('\n') || self.input.peek() == Some('\r') || self.input.peek() == Some('\x0C') {
                        self.input.bump();
                        self.input.bump();
                    } 
                    // Otherwise, (the stream starts with a valid escape) consume an escaped code point and append the returned code point to the <string-token>’s value.
                    else if self.is_valid_escape()? {
                        buf.push(self.read_escape()?);
                    }
                }

                // Anything else
                // Append the current input code point to the <string-token>’s value.
                c => {
                    buf.push(c);

                    self.input.bump();
                }
            }
        }

        Ok(buf.into())
    }
}
