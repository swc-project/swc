macro_rules! ident_tok {
    ($tt:tt) => {
        swc_css_ast::Token::Ident {
            value: swc_atoms::js_word!($tt),
            ..
        }
    };
}

macro_rules! tok {
    ("function") => {
        swc_css_ast::Token::Function { .. }
    };

    ("[") => {
        swc_css_ast::Token::LBracket
    };

    ("]") => {
        swc_css_ast::Token::RBracket
    };

    ("(") => {
        swc_css_ast::Token::LParen
    };

    (")") => {
        swc_css_ast::Token::RParen
    };

    ("%") => {
        swc_css_ast::Token::Delim { value: '%', .. }
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
       swc_css_ast::Token::Delim { value: '!', .. }
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
       swc_css_ast::Token::Delim { value: '*', .. }
    };

    ("#") => {
        swc_css_ast::Token::Hash
    };

    ("&") => {
        swc_css_ast::Token::Delim { value: '&', .. }
    };

    ("|") => {
        swc_css_ast::Token::Delim { value: '|', .. }
    };

    ("$") => {
       swc_css_ast::Token::Delim { value: '$', .. }
    };

    ("^") => {
       swc_css_ast::Token::Delim { value: '^', .. }
    };

    ("~") => {
        swc_css_ast::Token::Delim { value: '~', .. }
    };

    ("=") => {
       swc_css_ast::Token::Delim { value: '=', .. }
    };

    (" ") => {
        swc_css_ast::Token::WhiteSpace { .. }
    };

    ("<!--") => {
        swc_css_ast::Token::CDO
    };

    ("-->") => {
        swc_css_ast::Token::CDC
    };

    ("+") => {
        swc_css_ast::Token::Delim { value: '+', .. }
    };

    ("-") => {
        swc_css_ast::Token::Delim { value: '-', .. }
    };

    (".") => {
        swc_css_ast::Token::Delim { value: '.', .. }
    };

    ("/") => {
       swc_css_ast::Token::Delim { value: '/', .. }
    };

    (">") => {
        swc_css_ast::Token::Delim { value: '>', .. }
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
