use num_bigint::BigInt;
use swc_atoms::Atom;

use super::LexResult;

pub trait TokenFactory<'a, TokenAndSpan, Lexer: super::Lexer<'a, TokenAndSpan>> {
    fn create_jsx_name(name: &'a str, lexer: &mut Lexer) -> Self;
    fn create_str(value: Atom, raw: Atom, lexer: &mut Lexer) -> Self;
    fn create_template(cooked: LexResult<Atom>, raw: Atom, lexer: &mut Lexer) -> Self;
    fn create_regexp(content: Atom, flags: Atom, lexer: &mut Lexer) -> Self;
    fn create_num(value: f64, raw: Atom, lexer: &mut Lexer) -> Self;
    fn create_bigint(value: Box<BigInt>, raw: Atom, lexer: &mut Lexer) -> Self;
    fn create_dollar_lbrace() -> Self;
    fn create_backquote() -> Self;
    fn create_hash() -> Self;
    fn create_dot() -> Self;
    fn create_dotdotdot() -> Self;
    fn create_nullish_assign() -> Self;
    fn create_nullish_coalescing() -> Self;
    fn create_question() -> Self;
    fn create_colon() -> Self;
    fn create_bit_and() -> Self;
    fn create_bit_and_eq() -> Self;
    fn create_bit_or() -> Self;
    fn create_bit_or_eq() -> Self;
    fn create_logical_and() -> Self;
    fn create_logical_and_eq() -> Self;
    fn create_logical_or() -> Self;
    fn create_logical_or_eq() -> Self;

    fn create_mul() -> Self;
    fn create_mul_eq() -> Self;
    fn create_mod() -> Self;
    fn create_mod_eq() -> Self;
    fn create_exp() -> Self;
    fn create_exp_eq() -> Self;
    fn create_div() -> Self;
    fn create_div_eq() -> Self;
}
