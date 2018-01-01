macro_rules! unexpected {
    (
        $($expected:expr),*
    ) => {{
        unimplemented!("Unexpected token.")
    }};
}

macro_rules! syntax_error {
    ($s:ident) => {{
        return Err(Error::Syntax(SyntaxError::$s))
    }};
}
