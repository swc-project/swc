use crate::error::ErrorKind;

use super::{LexResult, Lexer};
use swc_atoms::JsWord;
use swc_common::input::Input;

#[cfg(test)]
mod tests;

impl<I> Lexer<I>
where
    I: Input,
{
    pub(super) fn read_number(&mut self) -> LexResult<f64> {
        let mut is_first = true;

        let mut had_dot = false;
        let num_str = self.input.uncons_while(|c| match c {
            '0'..='9' => {
                is_first = false;
                true
            }
            '-' => {
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

        let parsed =
            lexical::parse(&num_str.as_bytes()).expect("it should success as we filtered input");

        Ok(parsed)
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

        let mut was_escape = false;
        loop {
            if !was_escape {
                let chunk = self.input.uncons_while(|peeked| match peeked {
                    '\'' | '"' => peeked != quote,
                    '\\' => false,
                    _ => true,
                });

                buf.push_str(chunk);
            }

            let c = self.input.cur().ok_or_else(|| ErrorKind::Eof)?;
            self.input.bump();

            match c {
                '\\' => {
                    if was_escape {
                        buf.push('\\');
                    } else {
                        was_escape = true;
                        continue;
                    }
                }

                _ if c == quote => {
                    if was_escape {
                        buf.push(quote);
                    } else {
                        break;
                    }
                }

                _ => {
                    if was_escape {
                        match c {
                            'n' => {
                                buf.push('\n');
                            }
                            _ => {
                                buf.push(c);
                            }
                        }
                    } else {
                        buf.push(c);
                    }
                }
            }

            was_escape = false;
        }

        Ok(buf.into())
    }
}
