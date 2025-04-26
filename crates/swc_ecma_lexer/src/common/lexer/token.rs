use swc_atoms::Atom;

pub trait TokenFactory<'a, TokenAndSpan, Lexer: super::Lexer<'a, TokenAndSpan>> {
    fn create_jsx_name(name: &'a str, lexer: &mut Lexer) -> Self;
    fn create_str(value: Atom, raw: Atom, lexer: &mut Lexer) -> Self;
}
