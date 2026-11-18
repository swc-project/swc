/// Derives ECMAScript grammatical parameters and returns their previous values.
/// `+` enables a parameter, `~` disables it, and `?` explicitly inherits it.
/// Unlisted parameters are unchanged. Restoration belongs to the caller.
/// https://tc39.es/ecma262/#sec-grammatical-parameters
macro_rules! enter_grammar_context {
    (@flag $parameter:ident) => {
        $crate::parser::context::GrammarContext::$parameter
    };
    (@set $context:ident, + $parameter:ident) => {
        $context.insert(enter_grammar_context!(@flag $parameter));
    };
    (@set $context:ident, ~ $parameter:ident) => {
        $context.remove(enter_grammar_context!(@flag $parameter));
    };
    (@set $context:ident, ? $parameter:ident) => {
        // Validate inherited parameter names without changing their values.
        let _ = enter_grammar_context!(@flag $parameter);
    };
    ($context:expr, $($modifier:tt $parameter:ident),+ $(,)?) => {{
        let context = $context;
        let previous = *context;
        $(enter_grammar_context!(@set context, $modifier $parameter);)+
        previous
    }};
}

/// Parses within explicit grammatical arguments, restoring them on success or
/// error. Only GrammarContext is scoped; lexical and other parser contexts are
/// unaffected.
macro_rules! with_grammar_context {
    ($parser:expr, [$($modifier:tt $parameter:ident),+ $(,)?], $parse:expr $(,)?) => {{
        let parser = &mut *$parser;
        let mut context = parser.grammar_ctx();
        enter_grammar_context!(&mut context, $($modifier $parameter),+);
        parser.with_grammar_context(context, $parse)
    }};
}

macro_rules! trace_cur {
    ($p:expr, $name:ident) => {{
        if cfg!(feature = "debug") {
            #[cfg(debug_assertions)]
            tracing::debug!("{}: {:?}", stringify!($name), $p.input.cur());
        }
    }};
}

macro_rules! syntax_error {
    ($p:expr, $err:expr) => {
        syntax_error!($p, $p.input().cur_span(), $err)
    };
    ($p:expr, $span:expr, $err:expr) => {{
        let err = $crate::error::Error::new($span, $err);
        {
            let cur = $p.input().cur();
            if cur == Token::Error {
                let error = $p.input_mut().expect_error_token_and_bump();
                $p.emit_error(error);
            }
        }
        if cfg!(feature = "debug") {
            #[cfg(debug_assertions)]
            tracing::error!(
                "Syntax error called from {}:{}:{}\nCurrent token = {:?}",
                file!(),
                line!(),
                column!(),
                $p.input().cur()
            );
        }
        return Err(err.into());
    }};
}

macro_rules! expect {
    ($p:expr, $t:expr) => {{
        if !$p.input_mut().eat($t) {
            let span = $p.input().cur_span();
            let cur = $p.input_mut().dump_cur();
            syntax_error!(
                $p,
                span,
                $crate::error::SyntaxError::Expected(format!("{:?}", $t), cur)
            )
        }
    }};
}

macro_rules! unexpected {
    ($p:expr, $expected:literal) => {{
        let got = $p.input_mut().dump_cur();
        syntax_error!(
            $p,
            $p.input().cur_span(),
            $crate::error::SyntaxError::Unexpected {
                got,
                expected: $expected
            }
        )
    }};
}

macro_rules! debug_tracing {
    ($p:expr, $name:tt) => {{
        #[cfg(all(debug_assertions, feature = "debug"))]
        {
            let _ = tracing::span!(
                tracing::Level::ERROR,
                $name,
                cur = tracing::field::debug(&$p.input.cur())
            )
            .entered();
        }
    }};
}

macro_rules! peek {
    ($p:expr) => {{
        debug_assert!(
            $p.input().cur() != Token::Eof,
            "parser should not call peek() without knowing current token.
Current token is {:?}",
            $p.input().cur(),
        );
        $p.input_mut().peek()
    }};
}

macro_rules! return_if_arrow {
    ($p:expr, $expr:expr) => {{
        // FIXME:
        //
        //

        // let is_cur = match $p.state.potential_arrow_start {
        //     Some(start) => $expr.span.lo() == start,
        //     None => false
        // };
        // if is_cur {
        if let Expr::Arrow { .. } = *$expr {
            return Ok($expr);
        }
        // }
    }};
}
