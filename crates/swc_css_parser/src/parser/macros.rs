macro_rules! span {
    ($parser:expr, $start:expr) => {{
        let last_pos = $parser.input.last_pos()?;
        swc_common::Span::new($start, last_pos, Default::default())
    }};
}

macro_rules! tok_pat {
    (Ident) => {
        swc_css_ast::Token::Ident { .. }
    };

    (Percentage) => {
        swc_css_ast::Token::Percentage { .. }
    };

    (Dimension) => {
        swc_css_ast::Token::Dimension { .. }
    };

    (AtKeyword) => {
        swc_css_ast::Token::AtKeyword { .. }
    };

    (Function) => {
        swc_css_ast::Token::Function { .. }
    };

    (Str) => {
        swc_css_ast::Token::Str { .. }
    };

    (Number) => {
        swc_css_ast::Token::Number { .. }
    };

    (Url) => {
        swc_css_ast::Token::Url { .. }
    };

    ($t:tt) => {
        tok!($t)
    };
}

macro_rules! can_ignore_ws {
    ("{") => {
        true
    };
    ("}") => {
        true
    };
    ("(") => {
        true
    };
    (")") => {
        true
    };
    (":") => {
        true
    };

    ($tt:tt) => {
        false
    };
}

macro_rules! cur {
    ($parser:expr) => {
        match $parser.input.cur()? {
            Some(v) => v,
            None => {
                let last_pos = $parser.input.last_pos()?;
                let span = swc_common::Span::new(last_pos, last_pos, Default::default());
                return Err(crate::error::Error::new(span, crate::error::ErrorKind::Eof));
            }
        }
    };
}

macro_rules! bump {
    ($parser:expr) => {
        $parser.input.bump()?.unwrap().token
    };
}

macro_rules! is_case_insensitive_ident {
    ($parser:expr, $tt:tt) => {{
        match $parser.input.cur()? {
            Some(swc_css_ast::Token::Ident { value, .. })
                if &*value.to_ascii_lowercase() == $tt =>
            {
                true
            }
            _ => false,
        }
    }};
}

macro_rules! expect_case_insensitive_ident {
    ($parser:expr, $tt:tt) => {
        if is_case_insensitive_ident!($parser, $tt) {
            bump!($parser);
        } else {
            let span = $parser.input.cur_span()?;

            return Err(crate::error::Error::new(
                span,
                crate::error::ErrorKind::ExpectedButGot(stringify!($tt)),
            ));
        }
    };
}

macro_rules! is_one_of_case_insensitive_ident {
    ($parser:expr, $($tt:tt),+) => {
        match $parser.input.cur()? {
            Some(swc_css_ast::Token::Ident { value, .. }) => {
                let lowercased = &*value.to_ascii_lowercase();

                if $(lowercased == $tt)||* {
                    true
                } else {
                    false
                }
            }
            _ => false,
        }
    };
}

macro_rules! is {
    ($parser:expr, EOF) => {{
        $parser.input.cur()?.is_none()
    }};

    ($parser:expr, $tt:tt) => {{
        match $parser.input.cur()? {
            Some(tok_pat!($tt)) => true,
            _ => false,
        }
    }};
}

macro_rules! is_one_of {
    ($parser:expr, $($tt:tt),+) => {
        $(
            is!($parser, $tt)
        )||*
    };
}

macro_rules! peeked_is {
    ($parser:expr, $tt:tt) => {{
        match $parser.input.peek()? {
            Some(tok_pat!($tt)) => true,
            _ => false,
        }
    }};
}

macro_rules! peeked_is_one_of {
    ($parser:expr, $($tt:tt),+) => {
        $(
            peeked_is!($parser, $tt)
        )||*
    };
}

macro_rules! eat {
    ($parser:expr, $tt:tt) => {
        if is!($parser, $tt) {
            bump!($parser);
            true
        } else {
            false
        }
    };
}

macro_rules! expect {
    ($parser:expr, $tt:tt) => {
        if can_ignore_ws!($tt) {
            $parser.input.skip_ws()?
        }

        if !eat!($parser, $tt) {
            let span = $parser.input.cur_span()?;
            return Err(crate::error::Error::new(
                span,
                crate::error::ErrorKind::ExpectedButGot(stringify!($tt)),
            ));
        }
    };
}
