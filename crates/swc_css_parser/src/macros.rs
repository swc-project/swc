macro_rules! tok {
    ("number") => {
        swc_css_ast::Token::Number { .. }
    };

    ("dimension") => {
        swc_css_ast::Token::Dimension { .. }
    };

    ("percentage") => {
        swc_css_ast::Token::Percentage { .. }
    };

    ("function") => {
        swc_css_ast::Token::Function { .. }
    };

    ("ident") => {
        swc_css_ast::Token::Ident { .. }
    };

    ("string") => {
        swc_css_ast::Token::String { .. }
    };

    ("bad-string") => {
        swc_css_ast::Token::BadString { .. }
    };

    ("url") => {
        swc_css_ast::Token::Url { .. }
    };

    ("bad-url") => {
        swc_css_ast::Token::BadUrl { .. }
    };

    ("{") => {
        swc_css_ast::Token::LBrace
    };

    ("}") => {
        swc_css_ast::Token::RBrace
    };

    ("(") => {
        swc_css_ast::Token::LParen
    };

    (")") => {
        swc_css_ast::Token::RParen
    };

    ("[") => {
        swc_css_ast::Token::LBracket
    };

    ("]") => {
        swc_css_ast::Token::RBracket
    };

    (",") => {
        swc_css_ast::Token::Comma
    };

    (";") => {
        swc_css_ast::Token::Semi
    };

    ("?") => {
       swc_css_ast::Token::Delim { value: '?' }
    };

    (":") => {
        swc_css_ast::Token::Colon
    };

    ("*") => {
       swc_css_ast::Token::Delim { value: '*' }
    };

    ("@") => {
        swc_css_ast::Token::AtKeyword { .. }
    };

    ("#") => {
        swc_css_ast::Token::Hash { .. }
    };

    ("&") => {
        swc_css_ast::Token::Delim { value: '&' }
    };

    ("|") => {
        swc_css_ast::Token::Delim { value: '|' }
    };

    ("$") => {
       swc_css_ast::Token::Delim { value: '$' }
    };

    ("^") => {
       swc_css_ast::Token::Delim { value: '^' }
    };

    ("~") => {
        swc_css_ast::Token::Delim { value: '~' }
    };

    ("=") => {
        swc_css_ast::Token::Delim { value: '=' }
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
        swc_css_ast::Token::Delim { value: '+' }
    };

    ("-") => {
        swc_css_ast::Token::Delim { value: '-' }
    };

    (".") => {
        swc_css_ast::Token::Delim { value: '.' }
    };

    ("/") => {
        swc_css_ast::Token::Delim { value: '/' }
    };

    ("<") => {
        swc_css_ast::Token::Delim { value: '<' }
    };

    (">") => {
        swc_css_ast::Token::Delim { value: '>' }
    };
}
