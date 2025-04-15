macro_rules! token_including_semi {
    (';') => {
        Token::Semi
    };
    ($t:tt) => {
        swc_ecma_lexer::tok!($t)
    };
}
