use logos::Logos;
use swc_ecma_raw_lexer::RawToken;

fn assert_str(s: &str) {
    let mut tokens = RawToken::lexer(s);

    assert_eq!(tokens.next(), Some(Ok(RawToken::Str)));
    assert_eq!(tokens.next(), None);
}

#[test]
fn test_str() {
    assert_str(r#""hello""#);
}
