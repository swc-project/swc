macro_rules! ident_tok {
    ($tt:tt) => {
        swc_css_ast::Token::Ident(swc_atoms::js_word!($tt))
    };
}

macro_rules! tok {
    ("(") => {
        swc_css_ast::Token::LParen
    };

    (")") => {
        swc_css_ast::Token::RParen
    };

    ("%") => {
        swc_css_ast::Token::Percent
    };

    ("--") => {
        swc_css_ast::Token::MinusMinus
    };

    (",") => {
        swc_css_ast::Token::Comma
    };

    (";") => {
        swc_css_ast::Token::Semi
    };

    ("!") => {
        swc_css_ast::Token::Bang
    };

    ("{") => {
        swc_css_ast::Token::LBrace
    };

    ("}") => {
        swc_css_ast::Token::RBrace
    };

    ("[") => {
        swc_css_ast::Token::LBracket
    };

    ("]") => {
        swc_css_ast::Token::RBracket
    };

    (":") => {
        swc_css_ast::Token::Colon
    };

    ("*") => {
        swc_css_ast::Token::Asterisk
    };

    (".") => {
        swc_css_ast::Token::Dot
    };

    ("#") => {
        swc_css_ast::Token::Hash
    };

    ("&") => {
        swc_css_ast::Token::Ampersand
    };

    ("|") => {
        swc_css_ast::Token::Bar
    };

    ("$") => {
        swc_css_ast::Token::Dollar
    };

    ("^") => {
        swc_css_ast::Token::Caret
    };

    ("~") => {
        swc_css_ast::Token::Tilde
    };

    ("=") => {
        swc_css_ast::Token::Equals
    };

    (" ") => {
        swc_css_ast::Token::WhiteSpace
    };

    ("<!--") => {
        swc_css_ast::Token::CDO
    };

    ("-->") => {
        swc_css_ast::Token::CDC
    };

    ("+") => {
        swc_css_ast::Token::Plus
    };

    ("-") => {
        swc_css_ast::Token::Minus
    };

    ("/") => {
        swc_css_ast::Token::Div
    };

    ("~") => {
        swc_css_ast::Token::Tilde
    };

    (">") => {
        swc_css_ast::Token::GreaterThan
    };

    ("important") => {
        ident_tok!("important")
    };

    ("not") => {
        ident_tok!("not")
    };

    ("or") => {
        ident_tok!("or")
    };

    ("and") => {
        ident_tok!("and")
    };

    ("only") => {
        ident_tok!("only")
    };
}
