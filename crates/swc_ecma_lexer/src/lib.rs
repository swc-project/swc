//! # swc_ecma_lexer
//!
//! This crate provides a lexer for ECMAScript and TypeScript. It can ensure
//! these tokens are correctly parsed.

#![cfg_attr(docsrs, feature(doc_cfg))]
#![cfg_attr(test, feature(test))]
#![deny(clippy::all)]
#![deny(unused)]
#![allow(clippy::nonminimal_bool)]
#![allow(clippy::too_many_arguments)]
#![allow(clippy::unnecessary_unwrap)]
#![allow(clippy::vec_box)]
#![allow(clippy::wrong_self_convention)]
#![allow(clippy::match_like_matches_macro)]

use parser::PResult;

pub mod common;
pub mod lexer;
mod parser;

pub use input::Capturing;
use input::Tokens;
pub use lexer::{Lexer, TokenContext, TokenContexts, TokenType};
pub use parser::Parser;
pub use swc_common::input::StringInput;

#[macro_use]
pub mod token;
pub mod error;
pub mod input;
mod utils;

pub use common::syntax::{EsSyntax, Syntax, TsSyntax};

bitflags::bitflags! {
    #[derive(Debug, Clone, Copy, Default)]
    pub struct Context: u32 {

        /// `true` while backtracking
        const IgnoreError = 1 << 0;

        /// Is in module code?
        const Module = 1 << 1;
        const CanBeModule = 1 << 2;
        const Strict = 1 << 3;

        const ForLoopInit = 1 << 4;
        const ForAwaitLoopInit = 1 << 5;

        const IncludeInExpr = 1 << 6;
        /// If true, await expression is parsed, and "await" is treated as a
        /// keyword.
        const InAsync = 1 << 7;
        /// If true, yield expression is parsed, and "yield" is treated as a
        /// keyword.
        const InGenerator = 1 << 8;

        /// If true, await is treated as a keyword.
        const InStaticBlock = 1 << 9;

        const IsContinueAllowed = 1 << 10;
        const IsBreakAllowed = 1 << 11;

        const InType = 1 << 12;
        /// Typescript extension.
        const ShouldNotLexLtOrGtAsType = 1 << 13;
        /// Typescript extension.
        const InDeclare = 1 << 14;

        /// If true, `:` should not be treated as a type annotation.
        const InCondExpr = 1 << 15;
        const WillExpectColonForCond = 1 << 16;

        const InClass = 1 << 17;

        const InClassField = 1 << 18;

        const InFunction = 1 << 19;

        /// This indicates current scope or the scope out of arrow function is
        /// function declaration or function expression or not.
        const InsideNonArrowFunctionScope = 1 << 20;

        const InParameters = 1 << 21;

        const HasSuperClass = 1 << 22;

        const InPropertyName = 1 << 23;

        const InForcedJsxContext = 1 << 24;

        // If true, allow super.x and super[x]
        const AllowDirectSuper = 1 << 25;

        const IgnoreElseClause = 1 << 26;

        const DisallowConditionalTypes = 1 << 27;

        const AllowUsingDecl = 1 << 28;

        const TopLevel = 1 << 29;
    }
}

#[cfg(test)]
fn with_test_sess<F, Ret>(src: &str, f: F) -> Result<Ret, ::testing::StdErr>
where
    F: FnOnce(&swc_common::errors::Handler, swc_common::input::StringInput<'_>) -> Result<Ret, ()>,
{
    use swc_common::FileName;

    ::testing::run_test(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Real("testing".into()).into(), src.into());

        f(handler, (&*fm).into())
    })
}

#[macro_export]
macro_rules! tok {
    ('`') => {
        $crate::token::Token::BackQuote
    };
    // (';') => { Token::Semi };
    ('@') => {
        $crate::token::Token::At
    };
    ('#') => {
        $crate::token::Token::Hash
    };

    ('&') => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::BitAnd)
    };
    ('|') => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::BitOr)
    };
    ('^') => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::BitXor)
    };
    ('+') => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::Add)
    };
    ('-') => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::Sub)
    };
    ("??") => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::NullishCoalescing)
    };
    ('~') => {
        $crate::token::Token::Tilde
    };
    ('!') => {
        $crate::token::Token::Bang
    };
    ("&&") => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::LogicalAnd)
    };
    ("||") => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::LogicalOr)
    };
    ("&&=") => {
        $crate::token::Token::AssignOp(swc_ecma_ast::AssignOp::AndAssign)
    };
    ("||=") => {
        $crate::token::Token::AssignOp(swc_ecma_ast::AssignOp::OrAssign)
    };
    ("??=") => {
        $crate::token::Token::AssignOp(swc_ecma_ast::AssignOp::NullishAssign)
    };

    ("==") => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::EqEq)
    };
    ("===") => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::EqEqEq)
    };
    ("!=") => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::NotEq)
    };
    ("!==") => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::NotEqEq)
    };

    (',') => {
        $crate::token::Token::Comma
    };
    ('?') => {
        $crate::token::Token::QuestionMark
    };
    (':') => {
        $crate::token::Token::Colon
    };
    ('.') => {
        $crate::token::Token::Dot
    };
    ("=>") => {
        $crate::token::Token::Arrow
    };
    ("...") => {
        $crate::token::Token::DotDotDot
    };
    ("${") => {
        $crate::token::Token::DollarLBrace
    };

    ('+') => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::Add)
    };
    ('-') => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::Sub)
    };
    ('*') => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::Mul)
    };
    ('/') => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::Div)
    };
    ("/=") => {
        $crate::token::Token::AssignOp(swc_ecma_ast::AssignOp::DivAssign)
    };
    ('%') => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::Mod)
    };
    ('~') => {
        $crate::token::Token::Tilde
    };
    ('<') => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::Lt)
    };
    ("<<") => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::LShift)
    };
    ("<=") => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::LtEq)
    };
    ("<<=") => {
        $crate::token::Token::AssignOp($crate::token::AssignOp::LShiftAssign)
    };
    ('>') => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::Gt)
    };
    (">>") => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::RShift)
    };
    (">>>") => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::ZeroFillRShift)
    };
    (">=") => {
        $crate::token::Token::BinOp($crate::token::BinOpToken::GtEq)
    };
    (">>=") => {
        $crate::token::Token::AssignOp(swc_ecma_ast::AssignOp::RShiftAssign)
    };
    (">>>=") => {
        $crate::token::Token::AssignOp(swc_ecma_ast::AssignOp::ZeroFillRShiftAssign)
    };

    ("++") => {
        $crate::token::Token::PlusPlus
    };
    ("--") => {
        $crate::token::Token::MinusMinus
    };

    ('=') => {
        $crate::token::Token::AssignOp(swc_ecma_ast::AssignOp::Assign)
    };

    ('(') => {
        $crate::token::Token::LParen
    };
    (')') => {
        $crate::token::Token::RParen
    };
    ('{') => {
        $crate::token::Token::LBrace
    };
    ('}') => {
        $crate::token::Token::RBrace
    };
    ('[') => {
        $crate::token::Token::LBracket
    };
    (']') => {
        $crate::token::Token::RBracket
    };

    ("await") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::Await))
    };
    ("break") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::Break))
    };
    ("case") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::Case))
    };
    ("catch") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::Catch))
    };
    ("class") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::Class))
    };
    ("const") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::Const))
    };
    ("continue") => {
        $crate::token::Token::Word($crate::token::Word::Keyword(
            $crate::token::Keyword::Continue,
        ))
    };
    ("debugger") => {
        $crate::token::Token::Word($crate::token::Word::Keyword(
            $crate::token::Keyword::Debugger,
        ))
    };
    ("default") => {
        $crate::token::Token::Word($crate::token::Word::Keyword(
            $crate::token::Keyword::Default_,
        ))
    };
    ("delete") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::Delete))
    };
    ("do") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::Do))
    };
    ("else") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::Else))
    };
    ("export") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::Export))
    };
    ("extends") => {
        $crate::token::Token::Word($crate::token::Word::Keyword(
            $crate::token::Keyword::Extends,
        ))
    };
    ("false") => {
        $crate::token::Token::Word($crate::token::Word::False)
    };
    ("finally") => {
        $crate::token::Token::Word($crate::token::Word::Keyword(
            $crate::token::Keyword::Finally,
        ))
    };
    ("for") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::For))
    };
    ("function") => {
        $crate::token::Token::Word($crate::token::Word::Keyword(
            $crate::token::Keyword::Function,
        ))
    };
    ("if") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::If))
    };
    ("in") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::In))
    };
    ("instanceof") => {
        $crate::token::Token::Word($crate::token::Word::Keyword(
            $crate::token::Keyword::InstanceOf,
        ))
    };
    ("import") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::Import))
    };
    ("let") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::Let))
    };
    ("new") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::New))
    };
    ("null") => {
        $crate::token::Token::Word($crate::token::Word::Null)
    };

    ("return") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::Return))
    };
    ("super") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::Super))
    };
    ("switch") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::Switch))
    };
    ("this") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::This))
    };
    ("throw") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::Throw))
    };
    ("true") => {
        $crate::token::Token::Word($crate::token::Word::True)
    };
    ("try") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::Try))
    };
    ("typeof") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::TypeOf))
    };
    ("var") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::Var))
    };
    ("void") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::Void))
    };
    ("while") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::While))
    };
    ("with") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::With))
    };
    ("yield") => {
        $crate::token::Token::Word($crate::token::Word::Keyword($crate::token::Keyword::Yield))
    };

    // ----------
    // JSX
    // ----------
    (JSXTagStart) => {
        $crate::token::Token::JSXTagStart
    };

    (JSXTagEnd) => {
        $crate::token::Token::JSXTagEnd
    };

    ($tt:tt) => {
        $crate::token::Token::Word($crate::token::Word::Ident($crate::token::IdentLike::Known(
            known_ident!($tt),
        )))
    };
}

#[inline(always)]
#[cfg(any(
    target_arch = "wasm32",
    target_arch = "arm",
    not(feature = "stacker"),
    // miri does not work with stacker
    miri
))]
fn maybe_grow<R, F: FnOnce() -> R>(_red_zone: usize, _stack_size: usize, callback: F) -> R {
    callback()
}

#[inline(always)]
#[cfg(all(
    not(any(target_arch = "wasm32", target_arch = "arm", miri)),
    feature = "stacker"
))]
fn maybe_grow<R, F: FnOnce() -> R>(red_zone: usize, stack_size: usize, callback: F) -> R {
    stacker::maybe_grow(red_zone, stack_size, callback)
}

#[macro_export]
macro_rules! token_including_semi {
    (';') => {
        Token::Semi
    };
    ($t:tt) => {
        $crate::tok!($t)
    };
}

pub fn lexer(input: Lexer) -> PResult<Vec<token::TokenAndSpan>> {
    let capturing = input::Capturing::new(input);
    let mut parser = parser::Parser::new_from(capturing);
    let _ = parser.parse_module()?;
    Ok(parser.input().take())
}
