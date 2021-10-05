use super::{LexResult, Lexer};
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
}
