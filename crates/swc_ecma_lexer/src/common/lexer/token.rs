use swc_atoms::Atom;

use super::LexResult;

pub trait TokenFactory<'a, TokenAndSpan, Lexer: super::Lexer<'a, TokenAndSpan>> {
    fn create_jsx_name(name: &'a str, lexer: &mut Lexer) -> Self;
    fn create_str(value: Atom, raw: Atom, lexer: &mut Lexer) -> Self;
    fn create_template(cooked: LexResult<Atom>, raw: Atom, lexer: &mut Lexer) -> Self;
    fn create_regexp(content: Atom, flags: Atom, lexer: &mut Lexer) -> Self;
    fn create_dollar_lbrace() -> Self;
    fn create_backquote() -> Self;
}
