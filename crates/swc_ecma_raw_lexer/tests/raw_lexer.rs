use logos::Logos;
use swc_ecma_raw_lexer::RawToken;

fn assert_str(s: &str) {
    println!("String input: `{s}`");

    let mut tokens = RawToken::lexer(s);

    assert_eq!(tokens.next(), Some(Ok(RawToken::Str)));
    assert_eq!(tokens.next(), None);

    println!("Done")
}

fn assert_strs(s: &str) {
    println!("String input: `{s}`");

    let mut tokens = RawToken::lexer(s);

    while let Some(Ok(token)) = tokens.next() {
        assert_eq!(token, RawToken::Str);
        assert_eq!(tokens.next(), Some(Ok(RawToken::Semi)));
    }

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
    assert_str(r#""use\x20strict""#);
}

#[test]
fn test_str_escape_zero_octal() {
    assert_str(r#""use\0strict""#);
}

#[test]
fn test_str_escape_unicode() {
    assert_str(r#""use\u2028strict""#);
}

#[test]
fn test_str_escape_escape() {
    assert_str(r#"'\\\\'"#);
    assert_str(r#""\\\\""#);

    assert_strs(r#"'\\\\';"\\\\";"#);
}
