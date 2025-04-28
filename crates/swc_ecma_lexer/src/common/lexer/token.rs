use num_bigint::BigInt;
use swc_atoms::Atom;

use super::LexResult;

pub trait TokenFactory<'a, TokenAndSpan, Lexer: super::Lexer<'a, TokenAndSpan>> {
    fn jsx_name(name: &'a str, lexer: &mut Lexer) -> Self;
    fn str(value: Atom, raw: Atom, lexer: &mut Lexer) -> Self;
    fn template(cooked: LexResult<Atom>, raw: Atom, lexer: &mut Lexer) -> Self;
    fn regexp(content: Atom, flags: Atom, lexer: &mut Lexer) -> Self;
    fn num(value: f64, raw: Atom, lexer: &mut Lexer) -> Self;
    fn bigint(value: Box<BigInt>, raw: Atom, lexer: &mut Lexer) -> Self;
    fn unknown_ident(value: Atom, lexer: &mut Lexer) -> Self;
    fn dollar_lbrace() -> Self;
    fn backquote() -> Self;
    fn hash() -> Self;
    fn dot() -> Self;
    fn dotdotdot() -> Self;
    fn nullish_assign() -> Self;
    fn nullish_coalescing() -> Self;
    fn question() -> Self;
    fn colon() -> Self;
    fn bit_and() -> Self;
    fn bit_and_eq() -> Self;
    fn bit_or() -> Self;
    fn bit_or_eq() -> Self;
    fn logical_and() -> Self;
    fn logical_and_eq() -> Self;
    fn logical_or() -> Self;
    fn logical_or_eq() -> Self;
    fn mul() -> Self;
    fn mul_eq() -> Self;
    fn r#mod() -> Self;
    fn mod_eq() -> Self;
    fn exp() -> Self;
    fn exp_eq() -> Self;
    fn div() -> Self;
    fn div_eq() -> Self;
    fn equal() -> Self;
    fn lshift() -> Self;
    fn lshift_eq() -> Self;
    fn less() -> Self;
    fn less_eq() -> Self;
    fn rshift() -> Self;
    fn rshift_eq() -> Self;
    fn greater() -> Self;
    fn greater_eq() -> Self;
    fn zero_fill_rshift() -> Self;
    fn zero_fill_rshift_eq() -> Self;

    fn is_reserved(&self, ctx: super::Context) -> bool;
    fn into_atom(self, lexer: &mut Lexer) -> Option<Atom>;
}
