use logos::Logos;

use crate::{LogosError, RawLexer};

impl<'a> RawLexer<'a> {
    /// Current token must be [`RawToken::DivOp`]
    pub fn read_regexp(&mut self) -> Result<&'a str, LogosError> {
        self.reset_peeked();

        let s = self.lexer.inner().remainder();
        let remainder_len = s.len();

        let mut lexer = RegexpContent::lexer(s);

        for token in lexer.by_ref().flatten() {
            if token == RegexpContent::Terminate {
                break;
            }
        }

        let consumed = remainder_len - lexer.remainder().len();

        self.lexer.inner_mut().bump(consumed);

        Ok(s.get(..consumed).unwrap())
    }
}

#[derive(Logos, Debug, Clone, Copy, PartialEq, Eq)]
#[logos(error = LogosError)]
enum RegexpContent {
    #[regex(r#"\[[^\]]+\]"#)]
    Class,

    #[regex(r#"\\."#)]
    Escape,

    #[token(r"/")]
    Terminate,

    #[regex(r#"[^\\\[/]+"#)]
    Normal,
}
