use logos::Logos;
use swc_ecma_raw_lexer::RawToken;

fn assert_str(s: &str) {
    let mut tokens = RawToken::lexer(s);

    assert_eq!(tokens.next(), Some(Ok(RawToken::Str)));
    assert_eq!(tokens.next(), None);
}

#[test]
fn test_str_1() {
    assert_str(r#""hello""#);
    assert_str(r#"'hello'"#);
}

#[test]
fn test_str_escape_single_char() {
    assert_str(r#""hello\nworld""#);
    assert_str(r#"'hello\nworld'"#);
}

#[test]
fn test_str_escape_hex() {
    assert_str(r#"'use\x20strict'"#);
}
