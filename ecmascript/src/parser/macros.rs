macro_rules! syntax_error {
    ($s:expr) => {{
        unimplemented!("Syntax Error: {}", $s)
    }};
}
