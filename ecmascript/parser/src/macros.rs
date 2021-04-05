macro_rules! tok {
    ('`') => {
        crate::token::Token::BackQuote
    };
    // (';') => { Token::Semi };
    ('@') => {
        crate::token::Token::At
    };
    ('#') => {
        crate::token::Token::Hash
    };

    ('&') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::BitAnd)
    };
    ('+') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::Add)
    };
    ('-') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::Sub)
    };
    ("??") => {
        crate::token::Token::BinOp(crate::token::BinOpToken::NullishCoalescing)
    };
    ('~') => {
        crate::token::Token::Tilde
    };
    ('!') => {
        crate::token::Token::Bang
    };
    ("&&=") => {
        crate::token::Token::AssignOp(crate::token::AssignOpToken::AndAssign)
    };
    ("||=") => {
        crate::token::Token::AssignOp(crate::token::AssignOpToken::OrAssign)
    };
    ("??=") => {
        crate::token::Token::AssignOp(crate::token::AssignOpToken::NullishAssign)
    };

    ('|') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::BitOr)
    };

    (',') => {
        crate::token::Token::Comma
    };
    ('?') => {
        crate::token::Token::QuestionMark
    };
    (':') => {
        crate::token::Token::Colon
    };
    ("::") => {
        crate::token::Token::ColonColon
    };
    ('.') => {
        crate::token::Token::Dot
    };
    ("=>") => {
        crate::token::Token::Arrow
    };
    ("...") => {
        crate::token::Token::DotDotDot
    };
    ("${") => {
        crate::token::Token::DollarLBrace
    };

    ('+') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::Add)
    };
    ('-') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::Sub)
    };
    ('*') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::Mul)
    };
    ('/') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::Div)
    };
    ("/=") => {
        crate::token::Token::AssignOp(DivAssign)
    };
    ('%') => {
        crate::token::Token::BinOp(Mod)
    };
    ('~') => {
        crate::token::Token::Tilde
    };
    ('<') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::Lt)
    };
    ('>') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::Gt)
    };

    ("++") => {
        crate::token::Token::PlusPlus
    };
    ("--") => {
        crate::token::Token::MinusMinus
    };

    ('=') => {
        crate::token::Token::AssignOp(crate::token::AssignOpToken::Assign)
    };

    ('(') => {
        crate::token::Token::LParen
    };
    (')') => {
        crate::token::Token::RParen
    };
    ('{') => {
        crate::token::Token::LBrace
    };
    ('}') => {
        crate::token::Token::RBrace
    };
    ('[') => {
        crate::token::Token::LBracket
    };
    (']') => {
        crate::token::Token::RBracket
    };

    ("async") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("async")))
    };
    ("as") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("as")))
    };
    ("await") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Await))
    };
    ("break") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Break))
    };
    ("case") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Case))
    };
    ("catch") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Catch))
    };
    ("class") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Class))
    };
    ("const") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Const))
    };
    ("continue") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Continue))
    };
    ("debugger") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Debugger))
    };
    ("default") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Default_))
    };
    ("delete") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Delete))
    };
    ("do") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Do))
    };
    ("else") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Else))
    };
    ("export") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Export))
    };
    ("extends") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Extends))
    };
    ("false") => {
        crate::token::Token::Word(crate::token::Word::False)
    };
    ("finally") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Finally))
    };
    ("for") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::For))
    };
    ("from") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("from")))
    };
    ("function") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Function))
    };
    ("if") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::If))
    };
    ("in") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::In))
    };
    ("import") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Import))
    };
    ("let") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Let))
    };
    ("new") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::New))
    };
    ("null") => {
        crate::token::Token::Word(crate::token::Word::Null)
    };
    ("of") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("of")))
    };
    ("return") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Return))
    };
    ("super") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Super))
    };
    ("static") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("static")))
    };
    ("switch") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Switch))
    };
    ("target") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("target")))
    };
    ("this") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::This))
    };
    ("throw") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Throw))
    };
    ("true") => {
        crate::token::Token::Word(crate::token::Word::True)
    };
    ("try") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Try))
    };
    ("typeof") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::TypeOf))
    };
    ("var") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Var))
    };
    ("void") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Void))
    };
    ("while") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::While))
    };
    ("with") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::With))
    };
    ("yield") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Yield))
    };

    // ----------
    // JSX
    // ----------
    (JSXTagStart) => {
        crate::token::Token::JSXTagStart
    };

    (JSXTagEnd) => {
        crate::token::Token::JSXTagEnd
    };

    // ----------
    // Typescript
    // ----------
    ("asserts") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("asserts")))
    };
    ("implements") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("implements")))
    };
    ("is") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("is")))
    };
    ("new") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("new")))
    };
    ("keyof") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("keyof")))
    };
    ("unique") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("unique")))
    };
    ("object") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("object")))
    };
    ("global") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("global")))
    };
    ("require") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("require")))
    };
    ("enum") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("enum")))
    };
    ("readonly") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("readonly")))
    };
    ("as") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("as")))
    };
    ("namespace") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("namespace")))
    };
    ("abstract") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("abstract")))
    };
    ("infer") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("infer")))
    };
    ("any") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("any")))
    };
    ("boolean") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("boolean")))
    };
    ("bigint") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("bigint")))
    };
    ("intrinsic") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("intrinsic")))
    };
    ("never") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("never")))
    };
    ("number") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("number")))
    };
    ("string") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("string")))
    };
    ("symbol") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("symbol")))
    };
    ("unknown") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("unknown")))
    };
    ("require") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("require")))
    };
    ("interface") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("interface")))
    };
    ("declare") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("declare")))
    };
    ("override") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("override")))
    };
    ("undefined") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("undefined")))
    };
    ("meta") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("meta")))
    };
    ("type") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("type")))
    };
    ("assert") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("assert")))
    };
    ("get") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("get")))
    };
    ("set") => {
        crate::token::Token::Word(crate::token::Word::Ident(swc_atoms::js_word!("set")))
    };
}

macro_rules! token_including_semi {
    (';') => {
        Token::Semi
    };
    ($t:tt) => {
        tok!($t)
    };
}
