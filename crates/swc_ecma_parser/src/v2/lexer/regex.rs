use oxc_syntax::identifier::is_line_terminator;

use super::{Kind, Lexer, RegExpFlags, Token};
use crate::diagnostics;

impl<'a> Lexer<'a> {
    /// Re-tokenize the current `/` or `/=` and return `RegExp`
    /// See Section 12:
    ///   The `InputElementRegExp` goal symbol is used in all syntactic grammar
    /// contexts   where a `RegularExpressionLiteral` is permitted
    /// Which means the parser needs to re-tokenize on `PrimaryExpression`,
    /// `RegularExpressionLiteral` only appear on the right hand side of
    /// `PrimaryExpression`
    pub(crate) fn next_regex(&mut self, kind: Kind) -> (Token, u32, RegExpFlags) {
        self.token.start = self.offset()
            - match kind {
                Kind::Slash => 1,
                Kind::SlashEq => 2,
                _ => unreachable!(),
            };
        let (pattern_end, flags) = self.read_regex();
        self.lookahead.clear();
        let token = self.finish_next(Kind::RegExp);
        (token, pattern_end, flags)
    }

    /// 12.9.5 Regular Expression Literals
    fn read_regex(&mut self) -> (u32, RegExpFlags) {
        let mut in_escape = false;
        let mut in_character_class = false;
        loop {
            match self.next_char() {
                None => {
                    self.error(diagnostics::unterminated_reg_exp(self.unterminated_range()));
                    return (self.offset(), RegExpFlags::empty());
                }
                Some(c) if is_line_terminator(c) => {
                    self.error(diagnostics::unterminated_reg_exp(self.unterminated_range()));
                    #[allow(clippy::cast_possible_truncation)]
                    let pattern_end = self.offset() - c.len_utf8() as u32;
                    return (pattern_end, RegExpFlags::empty());
                }
                Some(c) => {
                    if in_escape {
                        in_escape = false;
                    } else if c == '/' && !in_character_class {
                        break;
                    } else if c == '[' {
                        in_character_class = true;
                    } else if c == '\\' {
                        in_escape = true;
                    } else if c == ']' {
                        in_character_class = false;
                    }
                }
            }
        }

        let pattern_end = self.offset() - 1; // -1 to exclude `/`
        let mut flags = RegExpFlags::empty();

        while let Some(ch @ ('$' | '_' | 'a'..='z' | 'A'..='Z' | '0'..='9')) = self.peek() {
            self.consume_char();
            let Ok(flag) = RegExpFlags::try_from(ch) else {
                self.error(diagnostics::reg_exp_flag(ch, self.current_offset()));
                continue;
            };
            if flags.contains(flag) {
                self.error(diagnostics::reg_exp_flag_twice(ch, self.current_offset()));
                continue;
            }
            flags |= flag;
        }

        (pattern_end, flags)
    }
}
