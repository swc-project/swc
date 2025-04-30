use num_bigint::BigInt;
use swc_atoms::Atom;

use super::LexResult;
use crate::common::input::Tokens;

pub trait TokenFactory<'a, TokenAndSpan, I: Tokens<TokenAndSpan>>: Sized + PartialEq {
    type Lexer: super::Lexer<'a, TokenAndSpan>;
    type Buffer: crate::common::parser::buffer::Buffer<'a>;

    fn jsx_name(name: &'a str, lexer: &mut Self::Lexer) -> Self;
    fn is_jsx_name(&self) -> bool;
    fn take_jsx_name(self, buffer: &mut Self::Buffer) -> Atom;

    fn str(value: Atom, raw: Atom, lexer: &mut Self::Lexer) -> Self;
    fn is_str(&self) -> bool;
    fn take_str(self, buffer: &mut Self::Buffer) -> (Atom, Atom);

    fn template(cooked: LexResult<Atom>, raw: Atom, lexer: &mut Self::Lexer) -> Self;
    fn regexp(content: Atom, flags: Atom, lexer: &mut Self::Lexer) -> Self;
    fn num(value: f64, raw: Atom, lexer: &mut Self::Lexer) -> Self;
    fn is_num(&self) -> bool;
    fn take_num(self, buffer: &mut Self::Buffer) -> (f64, Atom);
    fn bigint(value: Box<BigInt>, raw: Atom, lexer: &mut Self::Lexer) -> Self;
    fn is_bigint(&self) -> bool;
    fn take_bigint(self, buffer: &mut Self::Buffer) -> (Box<BigInt>, Atom);
    fn unknown_ident(value: Atom, lexer: &mut Self::Lexer) -> Self;
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
    fn null() -> Self;
    fn r#true() -> Self;
    fn r#false() -> Self;

    fn is_error(&self) -> bool;
    fn take_error(self, buffer: &mut Self::Buffer) -> crate::error::Error;

    fn is_word(&self) -> bool;
    fn take_word(self, buffer: &mut Self::Buffer) -> Option<Atom>;

    fn is_reserved(&self, ctx: super::Context) -> bool;
    fn into_atom(self, lexer: &mut Self::Lexer) -> Option<Atom>;

    #[inline(always)]
    fn is_less(&self) -> bool {
        Self::less().eq(self)
    }

    #[inline(always)]
    fn is_less_eq(&self) -> bool {
        Self::less_eq().eq(self)
    }

    #[inline(always)]
    fn is_greater(&self) -> bool {
        Self::greater().eq(self)
    }

    #[inline(always)]
    fn is_equal(&self) -> bool {
        Self::equal().eq(self)
    }

    #[inline(always)]
    fn is_null(&self) -> bool {
        Self::null().eq(self)
    }

    #[inline(always)]
    fn is_rshift(&self) -> bool {
        Self::rshift().eq(self)
    }

    #[inline(always)]
    fn is_rshift_eq(&self) -> bool {
        Self::rshift_eq().eq(self)
    }

    #[inline(always)]
    fn is_greater_eq(&self) -> bool {
        Self::greater_eq().eq(self)
    }

    #[inline(always)]
    fn is_true(&self) -> bool {
        Self::r#true().eq(self)
    }

    #[inline(always)]
    fn is_false(&self) -> bool {
        Self::r#false().eq(self)
    }
}
