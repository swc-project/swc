use num_bigint::BigInt;
use swc_atoms::{Atom, Wtf8Atom};
use swc_ecma_ast::{AssignOp, BinaryOp};

use super::LexResult;
use crate::common::{context::Context, input::Tokens};

pub trait TokenFactory<'a, TokenAndSpan, I: Tokens<TokenAndSpan>>: Sized + PartialEq {
    type Lexer: super::Lexer<'a, TokenAndSpan>;
    type Buffer: crate::common::parser::buffer::Buffer<
        'a,
        I = I,
        Token = Self,
        TokenAndSpan = TokenAndSpan,
    >;

    const FROM: Self;
    const FOR: Self;
    const INSTANCEOF: Self;
    const SATISFIES: Self;
    const THROW: Self;
    const AS: Self;
    const NAMESPACE: Self;
    const RETURN: Self;
    const AT: Self;
    const EXPORT: Self;
    const DECLARE: Self;
    const ASSERTS: Self;
    const ASSERT: Self;
    const JSX_TAG_END: Self;
    const JSX_TAG_START: Self;
    const DOLLAR_LBRACE: Self;
    const BACKQUOTE: Self;
    const HASH: Self;
    const IN: Self;
    const IS: Self;
    const CONST: Self;
    const DOT: Self;
    const TARGET: Self;
    const GET: Self;
    const SET: Self;
    const DOTDOTDOT: Self;
    const NULLISH_ASSIGN: Self;
    const NULLISH_COALESCING: Self;
    const QUESTION: Self;
    const COLON: Self;
    const COMMA: Self;
    const BIT_AND: Self;
    const BIT_AND_EQ: Self;
    const BIT_OR: Self;
    const BIT_OR_EQ: Self;
    const LOGICAL_AND: Self;
    const LOGICAL_AND_EQ: Self;
    const LOGICAL_OR: Self;
    const LOGICAL_OR_EQ: Self;
    const MUL: Self;
    const MUL_EQ: Self;
    const MOD: Self;
    const MOD_EQ: Self;
    const EXP: Self;
    const EXP_EQ: Self;
    const DIV: Self;
    const DIV_EQ: Self;
    const EQUAL: Self;
    const LSHIFT: Self;
    const LSHIFT_EQ: Self;
    const LESS: Self;
    const GLOBAL: Self;
    const LESS_EQ: Self;
    const RSHIFT: Self;
    const RSHIFT_EQ: Self;
    const GREATER: Self;
    const GREATER_EQ: Self;
    const ZERO_FILL_RSHIFT: Self;
    const ZERO_FILL_RSHIFT_EQ: Self;
    const NULL: Self;
    const ANY: Self;
    const BOOLEAN: Self;
    const BIGINT: Self;
    const NEVER: Self;
    const NUMBER: Self;
    const OBJECT: Self;
    const STRING: Self;
    const SYMBOL: Self;
    const UNKNOWN: Self;
    const UNDEFINED: Self;
    const INTRINSIC: Self;
    const TRUE: Self;
    const TRY: Self;
    const FALSE: Self;
    const ENUM: Self;
    const YIELD: Self;
    const LET: Self;
    const VAR: Self;
    const STATIC: Self;
    const IMPLEMENTS: Self;
    const INTERFACE: Self;
    const TYPE: Self;
    const PACKAGE: Self;
    const PRIVATE: Self;
    const PROTECTED: Self;
    const PUBLIC: Self;
    const READONLY: Self;
    const ARROW: Self;
    const REQUIRE: Self;
    const AWAIT: Self;
    const BREAK: Self;
    const CONTINUE: Self;
    const THIS: Self;
    const SUPER: Self;
    const WHILE: Self;
    const DO: Self;
    const LPAREN: Self;
    const RPAREN: Self;
    const LBRACKET: Self;
    const RBRACKET: Self;
    const LBRACE: Self;
    const FINALLY: Self;
    const CATCH: Self;
    const SWITCH: Self;
    const RBRACE: Self;
    const FUNCTION: Self;
    const IF: Self;
    const ELSE: Self;
    const CLASS: Self;
    const NEW: Self;
    const ABSTRACT: Self;
    const ACCESSOR: Self;
    const IMPORT: Self;
    const PLUS: Self;
    const MINUS: Self;
    const BANG: Self;
    const TILDE: Self;
    const PLUS_PLUS: Self;
    const MINUS_MINUS: Self;
    const DELETE: Self;
    const TYPEOF: Self;
    const VOID: Self;
    const EXTENDS: Self;
    const SEMI: Self;
    const OF: Self;
    const KEYOF: Self;
    const UNIQUE: Self;
    const INFER: Self;
    const USING: Self;
    const WITH: Self;
    const ASYNC: Self;
    const CASE: Self;
    const DEFAULT: Self;
    const DEBUGGER: Self;
    const EOF: Self;

    fn jsx_name(name: &'a str, lexer: &mut Self::Lexer) -> Self;
    fn is_jsx_name(&self) -> bool;
    fn take_jsx_name(self, buffer: &mut Self::Buffer) -> Atom;

    fn str(value: Wtf8Atom, raw: Atom, lexer: &mut Self::Lexer) -> Self;
    fn is_str(&self) -> bool;
    fn is_str_raw_content(&self, content: &str, buffer: &Self::Buffer) -> bool;
    fn take_str(self, buffer: &mut Self::Buffer) -> (Wtf8Atom, Atom);

    fn template(cooked: LexResult<Wtf8Atom>, raw: Atom, lexer: &mut Self::Lexer) -> Self;
    fn is_template(&self) -> bool;
    fn take_template(self, buffer: &mut Self::Buffer) -> (LexResult<Wtf8Atom>, Atom);

    fn jsx_text(value: Atom, raw: Atom, lexer: &mut Self::Lexer) -> Self;
    fn is_jsx_text(&self) -> bool;
    fn take_jsx_text(self, buffer: &mut Self::Buffer) -> (Atom, Atom);

    fn regexp(content: Atom, flags: Atom, lexer: &mut Self::Lexer) -> Self;
    fn is_regexp(&self) -> bool;
    fn take_regexp(self, buffer: &mut Self::Buffer) -> (Atom, Atom);

    fn num(value: f64, raw: Atom, lexer: &mut Self::Lexer) -> Self;
    fn is_num(&self) -> bool;
    fn take_num(self, buffer: &mut Self::Buffer) -> (f64, Atom);

    fn bigint(value: Box<BigInt>, raw: Atom, lexer: &mut Self::Lexer) -> Self;
    fn is_bigint(&self) -> bool;
    fn take_bigint(self, buffer: &mut Self::Buffer) -> (Box<BigInt>, Atom);

    fn shebang(value: Atom, lexer: &mut Self::Lexer) -> Self;
    fn is_shebang(&self) -> bool;
    fn take_shebang(self, buffer: &mut Self::Buffer) -> Atom;

    fn unknown_ident(value: Atom, lexer: &mut Self::Lexer) -> Self;
    fn is_unknown_ident(&self) -> bool;
    fn take_unknown_ident(self, buffer: &mut Self::Buffer) -> Atom;
    fn take_unknown_ident_ref<'b>(&'b self, buffer: &'b Self::Buffer) -> &'b Atom;

    fn is_known_ident(&self) -> bool;
    fn take_known_ident(&self) -> Atom;

    fn starts_expr(&self) -> bool;
    fn to_string(&self, buffer: &Self::Buffer) -> String;

    fn is_error(&self) -> bool;
    fn take_error(self, buffer: &mut Self::Buffer) -> crate::error::Error;

    fn is_word(&self) -> bool;
    fn take_word(self, buffer: &Self::Buffer) -> Option<Atom>;
    fn is_keyword(&self) -> bool;

    fn is_reserved(&self, ctx: super::Context) -> bool;
    fn into_atom(self, lexer: &mut Self::Lexer) -> Option<Atom>;
    fn follows_keyword_let(&self) -> bool;

    fn is_bin_op(&self) -> bool;
    fn as_bin_op(&self) -> Option<BinaryOp>;

    fn is_assign_op(&self) -> bool;
    fn as_assign_op(&self) -> Option<AssignOp>;

    #[inline(always)]
    fn is_less(&self) -> bool {
        Self::LESS.eq(self)
    }
    #[inline(always)]
    fn is_less_eq(&self) -> bool {
        Self::LESS_EQ.eq(self)
    }
    #[inline(always)]
    fn is_greater(&self) -> bool {
        Self::GREATER.eq(self)
    }
    #[inline(always)]
    fn is_colon(&self) -> bool {
        Self::COLON.eq(self)
    }
    #[inline(always)]
    fn is_comma(&self) -> bool {
        Self::COMMA.eq(self)
    }
    #[inline(always)]
    fn is_equal(&self) -> bool {
        Self::EQUAL.eq(self)
    }
    #[inline(always)]
    fn is_question(&self) -> bool {
        Self::QUESTION.eq(self)
    }
    #[inline(always)]
    fn is_null(&self) -> bool {
        Self::NULL.eq(self)
    }
    #[inline(always)]
    fn is_lshift(&self) -> bool {
        Self::LSHIFT.eq(self)
    }
    #[inline(always)]
    fn is_rshift(&self) -> bool {
        Self::RSHIFT.eq(self)
    }
    #[inline(always)]
    fn is_rshift_eq(&self) -> bool {
        Self::RSHIFT_EQ.eq(self)
    }
    #[inline(always)]
    fn is_greater_eq(&self) -> bool {
        Self::GREATER_EQ.eq(self)
    }
    #[inline(always)]
    fn is_true(&self) -> bool {
        Self::TRUE.eq(self)
    }
    #[inline(always)]
    fn is_false(&self) -> bool {
        Self::FALSE.eq(self)
    }
    #[inline(always)]
    fn is_enum(&self) -> bool {
        Self::ENUM.eq(self)
    }
    #[inline(always)]
    fn is_yield(&self) -> bool {
        Self::YIELD.eq(self)
    }
    #[inline(always)]
    fn is_let(&self) -> bool {
        Self::LET.eq(self)
    }
    #[inline(always)]
    fn is_var(&self) -> bool {
        Self::VAR.eq(self)
    }
    #[inline(always)]
    fn is_static(&self) -> bool {
        Self::STATIC.eq(self)
    }
    #[inline(always)]
    fn is_extends(&self) -> bool {
        Self::EXTENDS.eq(self)
    }
    #[inline(always)]
    fn is_implements(&self) -> bool {
        Self::IMPLEMENTS.eq(self)
    }
    #[inline(always)]
    fn is_interface(&self) -> bool {
        Self::INTERFACE.eq(self)
    }
    #[inline(always)]
    fn is_type(&self) -> bool {
        Self::TYPE.eq(self)
    }
    #[inline(always)]
    fn is_package(&self) -> bool {
        Self::PACKAGE.eq(self)
    }
    #[inline(always)]
    fn is_private(&self) -> bool {
        Self::PRIVATE.eq(self)
    }
    #[inline(always)]
    fn is_protected(&self) -> bool {
        Self::PROTECTED.eq(self)
    }
    #[inline(always)]
    fn is_public(&self) -> bool {
        Self::PUBLIC.eq(self)
    }
    #[inline(always)]
    fn is_readonly(&self) -> bool {
        Self::READONLY.eq(self)
    }
    #[inline(always)]
    fn is_await(&self) -> bool {
        Self::AWAIT.eq(self)
    }
    #[inline(always)]
    fn is_break(&self) -> bool {
        Self::BREAK.eq(self)
    }
    #[inline(always)]
    fn is_continue(&self) -> bool {
        Self::CONTINUE.eq(self)
    }
    #[inline(always)]
    fn is_arrow(&self) -> bool {
        Self::ARROW.eq(self)
    }
    #[inline(always)]
    fn is_this(&self) -> bool {
        Self::THIS.eq(self)
    }
    #[inline(always)]
    fn is_super(&self) -> bool {
        Self::SUPER.eq(self)
    }
    #[inline(always)]
    fn is_using(&self) -> bool {
        Self::USING.eq(self)
    }
    #[inline(always)]
    fn is_backquote(&self) -> bool {
        Self::BACKQUOTE.eq(self)
    }
    #[inline(always)]
    fn is_lparen(&self) -> bool {
        Self::LPAREN.eq(self)
    }
    #[inline(always)]
    fn is_rparen(&self) -> bool {
        Self::RPAREN.eq(self)
    }
    #[inline(always)]
    fn is_lbracket(&self) -> bool {
        Self::LBRACKET.eq(self)
    }
    #[inline(always)]
    fn is_rbracket(&self) -> bool {
        Self::RBRACKET.eq(self)
    }
    #[inline(always)]
    fn is_lbrace(&self) -> bool {
        Self::LBRACE.eq(self)
    }
    #[inline(always)]
    fn is_rbrace(&self) -> bool {
        Self::RBRACE.eq(self)
    }
    #[inline(always)]
    fn is_function(&self) -> bool {
        Self::FUNCTION.eq(self)
    }
    #[inline(always)]
    fn is_class(&self) -> bool {
        Self::CLASS.eq(self)
    }
    #[inline(always)]
    fn is_if(&self) -> bool {
        Self::IF.eq(self)
    }
    #[inline(always)]
    fn is_return(&self) -> bool {
        Self::RETURN.eq(self)
    }
    #[inline(always)]
    fn is_switch(&self) -> bool {
        Self::SWITCH.eq(self)
    }
    #[inline(always)]
    fn is_throw(&self) -> bool {
        Self::THROW.eq(self)
    }
    #[inline(always)]
    fn is_catch(&self) -> bool {
        Self::CATCH.eq(self)
    }
    #[inline(always)]
    fn is_finally(&self) -> bool {
        Self::FINALLY.eq(self)
    }
    #[inline(always)]
    fn is_try(&self) -> bool {
        Self::TRY.eq(self)
    }
    #[inline(always)]
    fn is_with(&self) -> bool {
        Self::WITH.eq(self)
    }
    #[inline(always)]
    fn is_while(&self) -> bool {
        Self::WHILE.eq(self)
    }
    #[inline(always)]
    fn is_new(&self) -> bool {
        Self::NEW.eq(self)
    }
    #[inline(always)]
    fn is_ident_ref(&self, ctx: Context) -> bool {
        self.is_word() && !self.is_reserved(ctx)
    }
    #[inline(always)]
    fn is_import(&self) -> bool {
        Self::IMPORT.eq(self)
    }
    #[inline(always)]
    fn is_export(&self) -> bool {
        Self::EXPORT.eq(self)
    }
    #[inline(always)]
    fn is_dot(&self) -> bool {
        Self::DOT.eq(self)
    }
    #[inline(always)]
    fn is_do(&self) -> bool {
        Self::DO.eq(self)
    }
    #[inline(always)]
    fn is_for(&self) -> bool {
        Self::FOR.eq(self)
    }
    #[inline(always)]
    fn is_from(&self) -> bool {
        Self::FROM.eq(self)
    }
    #[inline(always)]
    fn is_dotdotdot(&self) -> bool {
        Self::DOTDOTDOT.eq(self)
    }
    #[inline(always)]
    fn is_plus(&self) -> bool {
        Self::PLUS.eq(self)
    }
    #[inline(always)]
    fn is_minus(&self) -> bool {
        Self::MINUS.eq(self)
    }
    #[inline(always)]
    fn is_bang(&self) -> bool {
        Self::BANG.eq(self)
    }
    #[inline(always)]
    fn is_tilde(&self) -> bool {
        Self::TILDE.eq(self)
    }
    #[inline(always)]
    fn is_plus_plus(&self) -> bool {
        Self::PLUS_PLUS.eq(self)
    }
    #[inline(always)]
    fn is_minus_minus(&self) -> bool {
        Self::MINUS_MINUS.eq(self)
    }
    #[inline(always)]
    fn is_delete(&self) -> bool {
        Self::DELETE.eq(self)
    }
    #[inline(always)]
    fn is_typeof(&self) -> bool {
        Self::TYPEOF.eq(self)
    }
    #[inline(always)]
    fn is_of(&self) -> bool {
        Self::OF.eq(self)
    }
    #[inline(always)]
    fn is_void(&self) -> bool {
        Self::VOID.eq(self)
    }
    #[inline(always)]
    fn is_hash(&self) -> bool {
        Self::HASH.eq(self)
    }
    #[inline(always)]
    fn is_in(&self) -> bool {
        Self::IN.eq(self)
    }
    #[inline(always)]
    fn is_const(&self) -> bool {
        Self::CONST.eq(self)
    }
    #[inline(always)]
    fn is_star(&self) -> bool {
        Self::MUL.eq(self)
    }
    #[inline(always)]
    fn is_mod(&self) -> bool {
        Self::MOD.eq(self)
    }
    #[inline(always)]
    fn is_semi(&self) -> bool {
        Self::SEMI.eq(self)
    }
    #[inline(always)]
    fn is_slash(&self) -> bool {
        Self::DIV.eq(self)
    }
    #[inline(always)]
    fn is_slash_eq(&self) -> bool {
        Self::DIV_EQ.eq(self)
    }
    #[inline(always)]
    fn is_jsx_tag_start(&self) -> bool {
        Self::JSX_TAG_START.eq(self)
    }
    #[inline(always)]
    fn is_jsx_tag_end(&self) -> bool {
        Self::JSX_TAG_END.eq(self)
    }
    #[inline(always)]
    fn is_asserts(&self) -> bool {
        Self::ASSERTS.eq(self)
    }
    #[inline(always)]
    fn is_is(&self) -> bool {
        Self::IS.eq(self)
    }
    #[inline(always)]
    fn is_as(&self) -> bool {
        Self::AS.eq(self)
    }
    #[inline(always)]
    fn is_satisfies(&self) -> bool {
        Self::SATISFIES.eq(self)
    }
    #[inline(always)]
    fn is_instanceof(&self) -> bool {
        Self::INSTANCEOF.eq(self)
    }
    #[inline(always)]
    fn is_async(&self) -> bool {
        Self::ASYNC.eq(self)
    }
    #[inline(always)]
    fn is_case(&self) -> bool {
        Self::CASE.eq(self)
    }
    #[inline(always)]
    fn is_default(&self) -> bool {
        Self::DEFAULT.eq(self)
    }
    #[inline(always)]
    fn is_debugger(&self) -> bool {
        Self::DEBUGGER.eq(self)
    }
    #[inline(always)]
    fn is_bit_and(&self) -> bool {
        Self::BIT_AND.eq(self)
    }
    #[inline(always)]
    fn is_bit_or(&self) -> bool {
        Self::BIT_OR.eq(self)
    }
    #[inline(always)]
    fn is_exp(&self) -> bool {
        Self::EXP.eq(self)
    }
    #[inline(always)]
    fn is_eof(&self) -> bool {
        Self::EOF.eq(self)
    }
    fn is_no_substitution_template_literal(&self) -> bool;
    fn is_template_head(&self) -> bool;
}
