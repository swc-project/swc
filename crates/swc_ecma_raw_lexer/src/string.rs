use logos::{Lexer, Logos};

use crate::RawToken;

pub fn consume_str_single_quote(lex: &mut Lexer<RawToken>) {
    consume_str(lex, StrContent::SingleQuote);
}

pub fn consume_str_double_quote(lex: &mut Lexer<RawToken>) {
    consume_str(lex, StrContent::DoubleQuote);
}

fn consume_str(lex: &mut Lexer<RawToken>, stop_token: StrContent) {
    let text = lex.remainder();
    let total_len = text.len();

    let mut str_lexer = Lexer::<StrContent>::new(&text[1..]);

    while let Some(Ok(token)) = str_lexer.next() {
        if token == stop_token {
            break;
        }
    }

    let left_len = str_lexer.remainder().len();
    let consumed = total_len - left_len;
    dbg!(consumed);
    lex.bump(consumed);
}

#[derive(Logos, Debug, Clone, Copy, PartialEq, Eq)]
enum StrContent {
    #[regex(r#"[^'"]"#)]
    Normal,

    #[regex(r#"'"#)]
    SingleQuote,

    #[regex(r#"""#)]
    DoubleQuote,
}
