use num_bigint::BigInt;
use swc_atoms::Atom;

use super::LexResult;
use crate::common::{context::Context, input::Tokens};

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
    fn is_regexp(&self) -> bool;

    fn num(value: f64, raw: Atom, lexer: &mut Self::Lexer) -> Self;
    fn is_num(&self) -> bool;
    fn take_num(self, buffer: &mut Self::Buffer) -> (f64, Atom);

    fn bigint(value: Box<BigInt>, raw: Atom, lexer: &mut Self::Lexer) -> Self;
    fn is_bigint(&self) -> bool;
    fn take_bigint(self, buffer: &mut Self::Buffer) -> (Box<BigInt>, Atom);

    fn unknown_ident(value: Atom, lexer: &mut Self::Lexer) -> Self;
    fn is_unknown_ident(&self) -> bool;
    fn take_unknown_ident(self, buffer: &mut Self::Buffer) -> Atom;
    fn is_known_ident(&self) -> bool;
    fn take_known_ident(&self) -> Atom;

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
    fn r#enum() -> Self;
    fn r#yield() -> Self;
    fn r#let() -> Self;
    fn r#static() -> Self;
    fn implements() -> Self;
    fn interface() -> Self;
    fn package() -> Self;
    fn private() -> Self;
    fn protected() -> Self;
    fn public() -> Self;
    fn r#await() -> Self;
    fn this() -> Self;
    fn kw_super() -> Self;
    fn lparen() -> Self;
    fn rparen() -> Self;
    fn lbracket() -> Self;
    fn rbracket() -> Self;
    fn lbrace() -> Self;
    fn rbrace() -> Self;
    fn function() -> Self;
    fn class() -> Self;
    fn new() -> Self;
    fn import() -> Self;
    fn plus() -> Self;
    fn minus() -> Self;
    fn bang() -> Self;
    fn tilde() -> Self;
    fn plus_plus() -> Self;
    fn minus_minus() -> Self;
    fn delete() -> Self;
    fn r#typeof() -> Self;
    fn void() -> Self;

    fn is_error(&self) -> bool;
    fn take_error(self, buffer: &mut Self::Buffer) -> crate::error::Error;

    fn is_word(&self) -> bool;
    fn take_word(self, buffer: &mut Self::Buffer) -> Option<Atom>;
    fn is_keyword(&self) -> bool;

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
    #[inline(always)]
    fn is_enum(&self) -> bool {
        Self::r#enum().eq(self)
    }
    #[inline(always)]
    fn is_yield(&self) -> bool {
        Self::r#yield().eq(self)
    }
    #[inline(always)]
    fn is_let(&self) -> bool {
        Self::r#let().eq(self)
    }
    #[inline(always)]
    fn is_static(&self) -> bool {
        Self::r#static().eq(self)
    }
    #[inline(always)]
    fn is_implements(&self) -> bool {
        Self::implements().eq(self)
    }
    #[inline(always)]
    fn is_interface(&self) -> bool {
        Self::interface().eq(self)
    }
    #[inline(always)]
    fn is_package(&self) -> bool {
        Self::package().eq(self)
    }
    #[inline(always)]
    fn is_private(&self) -> bool {
        Self::private().eq(self)
    }
    #[inline(always)]
    fn is_protected(&self) -> bool {
        Self::protected().eq(self)
    }
    #[inline(always)]
    fn is_public(&self) -> bool {
        Self::public().eq(self)
    }
    #[inline(always)]
    fn is_await(&self) -> bool {
        Self::r#await().eq(self)
    }
    #[inline(always)]
    fn is_this(&self) -> bool {
        Self::this().eq(self)
    }
    #[inline(always)]
    fn is_super(&self) -> bool {
        Self::kw_super().eq(self)
    }
    #[inline(always)]
    fn is_backquote(&self) -> bool {
        Self::backquote().eq(self)
    }
    #[inline(always)]
    fn is_lparen(&self) -> bool {
        Self::lparen().eq(self)
    }
    #[inline(always)]
    fn is_rparen(&self) -> bool {
        Self::rparen().eq(self)
    }
    #[inline(always)]
    fn is_lbracket(&self) -> bool {
        Self::lbracket().eq(self)
    }
    #[inline(always)]
    fn is_rbracket(&self) -> bool {
        Self::rbracket().eq(self)
    }
    #[inline(always)]
    fn is_lbrace(&self) -> bool {
        Self::lbrace().eq(self)
    }
    #[inline(always)]
    fn is_rbrace(&self) -> bool {
        Self::rbrace().eq(self)
    }
    #[inline(always)]
    fn is_function(&self) -> bool {
        Self::function().eq(self)
    }
    #[inline(always)]
    fn is_class(&self) -> bool {
        Self::class().eq(self)
    }
    #[inline(always)]
    fn is_new(&self) -> bool {
        Self::new().eq(self)
    }
    #[inline(always)]
    fn is_ident_ref(&self, ctx: Context) -> bool {
        self.is_word() && !self.is_reserved(ctx)
    }
    #[inline(always)]
    fn is_import(&self) -> bool {
        Self::import().eq(self)
    }
    #[inline(always)]
    fn is_dot(&self) -> bool {
        Self::dot().eq(self)
    }
    #[inline(always)]
    fn is_plus(&self) -> bool {
        Self::plus().eq(self)
    }
    #[inline(always)]
    fn is_minus(&self) -> bool {
        Self::minus().eq(self)
    }
    #[inline(always)]
    fn is_bang(&self) -> bool {
        Self::bang().eq(self)
    }
    #[inline(always)]
    fn is_tilde(&self) -> bool {
        Self::tilde().eq(self)
    }
    #[inline(always)]
    fn is_plus_plus(&self) -> bool {
        Self::plus_plus().eq(self)
    }
    #[inline(always)]
    fn is_minus_minus(&self) -> bool {
        Self::minus_minus().eq(self)
    }
    #[inline(always)]
    fn is_delete(&self) -> bool {
        Self::delete().eq(self)
    }
    #[inline(always)]
    fn is_typeof(&self) -> bool {
        Self::r#typeof().eq(self)
    }
    #[inline(always)]
    fn is_void(&self) -> bool {
        Self::void().eq(self)
    }
    #[inline(always)]
    fn is_hash(&self) -> bool {
        Self::hash().eq(self)
    }
}
