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
    lex.bump(consumed);
}

#[derive(Logos, Debug, Clone, Copy, PartialEq, Eq)]
enum StrContent {
    #[token("\\n")]
    #[regex(r#"\\["'\\bfnrtv]"#, priority = 100)]
    Escape,

    #[regex(r#"[^'"]+"#)]
    Normal,

    #[regex(r#"'"#)]
    SingleQuote,

    #[regex(r#"""#)]
    DoubleQuote,
}

#[cfg(test)]
mod tests {
    use logos::Lexer;

    use super::StrContent;

    fn assert_str(text: &str, expected: &[StrContent]) {
        dbg!(text);
        dbg!(expected);

        let actual = Lexer::<StrContent>::new(text)
            .map(|v| v.unwrap())
            .collect::<Vec<_>>();

        assert_eq!(expected.len(), actual.len() - 1);
        assert_eq!(expected, &actual[..expected.len()]);

        assert!(matches!(
            actual.last(),
            Some(StrContent::SingleQuote | StrContent::DoubleQuote)
        ));
    }

    #[test]
    fn escape_newline() {
        assert_str(
            "hello\\nworld",
            &[StrContent::Normal, StrContent::Escape, StrContent::Normal],
        );
    }
}
