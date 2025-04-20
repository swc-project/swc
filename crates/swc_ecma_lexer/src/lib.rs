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

use serde::{Deserialize, Serialize};

pub mod lexer;

use input::Tokens;
pub use lexer::*;

#[macro_use]
pub mod token;
pub mod error;
pub mod input;
mod utils;

#[derive(Debug, Clone, Copy, PartialEq, Eq, Deserialize, Serialize)]
#[serde(deny_unknown_fields, tag = "syntax")]
pub enum Syntax {
    /// Standard
    #[serde(rename = "ecmascript")]
    Es(EsSyntax),
    /// This variant requires the cargo feature `typescript` to be enabled.
    #[cfg(feature = "typescript")]
    #[cfg_attr(docsrs, doc(cfg(feature = "typescript")))]
    #[serde(rename = "typescript")]
    Typescript(TsSyntax),
}

impl Default for Syntax {
    fn default() -> Self {
        Syntax::Es(Default::default())
    }
}

impl Syntax {
    pub fn auto_accessors(self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                auto_accessors: true,
                ..
            }) => true,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(_) => true,
            _ => false,
        }
    }

    pub fn import_attributes(self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                import_attributes, ..
            }) => import_attributes,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(_) => true,
        }
    }

    /// Should we parse jsx?
    pub fn jsx(self) -> bool {
        match self {
            Syntax::Es(EsSyntax { jsx: true, .. }) => true,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(TsSyntax { tsx: true, .. }) => true,
            _ => false,
        }
    }

    pub fn fn_bind(self) -> bool {
        matches!(self, Syntax::Es(EsSyntax { fn_bind: true, .. }))
    }

    pub fn decorators(self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                decorators: true, ..
            }) => true,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(TsSyntax {
                decorators: true, ..
            }) => true,
            _ => false,
        }
    }

    pub fn decorators_before_export(self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                decorators_before_export: true,
                ..
            }) => true,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(..) => true,
            _ => false,
        }
    }

    /// Should we parse typescript?
    #[cfg(not(feature = "typescript"))]
    pub const fn typescript(self) -> bool {
        false
    }

    /// Should we parse typescript?
    #[cfg(feature = "typescript")]
    pub const fn typescript(self) -> bool {
        matches!(self, Syntax::Typescript(..))
    }

    pub fn export_default_from(self) -> bool {
        matches!(
            self,
            Syntax::Es(EsSyntax {
                export_default_from: true,
                ..
            })
        )
    }

    pub fn dts(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            Syntax::Typescript(t) => t.dts,
            _ => false,
        }
    }

    pub fn allow_super_outside_method(self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                allow_super_outside_method,
                ..
            }) => allow_super_outside_method,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(_) => true,
        }
    }

    pub fn allow_return_outside_function(self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                allow_return_outside_function,
                ..
            }) => allow_return_outside_function,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(_) => false,
        }
    }

    pub fn early_errors(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            Syntax::Typescript(t) => !t.no_early_errors,
            Syntax::Es(..) => true,
        }
    }

    pub fn disallow_ambiguous_jsx_like(self) -> bool {
        match self {
            #[cfg(feature = "typescript")]
            Syntax::Typescript(t) => t.disallow_ambiguous_jsx_like,
            _ => false,
        }
    }

    pub fn explicit_resource_management(&self) -> bool {
        match self {
            Syntax::Es(EsSyntax {
                explicit_resource_management: using_decl,
                ..
            }) => *using_decl,
            #[cfg(feature = "typescript")]
            Syntax::Typescript(_) => true,
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TsSyntax {
    #[serde(default)]
    pub tsx: bool,

    #[serde(default)]
    pub decorators: bool,

    /// `.d.ts`
    #[serde(skip, default)]
    pub dts: bool,

    #[serde(skip, default)]
    pub no_early_errors: bool,

    /// babel: `disallowAmbiguousJSXLike`
    /// Even when JSX parsing is not enabled, this option disallows using syntax
    /// that would be ambiguous with JSX (`<X> y` type assertions and
    /// `<X>()=>{}` type arguments)
    /// see: https://babeljs.io/docs/en/babel-plugin-transform-typescript#disallowambiguousjsxlike
    #[serde(skip, default)]
    pub disallow_ambiguous_jsx_like: bool,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EsSyntax {
    #[serde(default)]
    pub jsx: bool,

    /// Support function bind expression.
    #[serde(rename = "functionBind")]
    #[serde(default)]
    pub fn_bind: bool,

    /// Enable decorators.
    #[serde(default)]
    pub decorators: bool,

    /// babel: `decorators.decoratorsBeforeExport`
    ///
    /// Effective only if `decorator` is true.
    #[serde(rename = "decoratorsBeforeExport")]
    #[serde(default)]
    pub decorators_before_export: bool,

    #[serde(default)]
    pub export_default_from: bool,

    /// Stage 3.
    #[serde(default, alias = "importAssertions")]
    pub import_attributes: bool,

    #[serde(default, rename = "allowSuperOutsideMethod")]
    pub allow_super_outside_method: bool,

    #[serde(default, rename = "allowReturnOutsideFunction")]
    pub allow_return_outside_function: bool,

    #[serde(default)]
    pub auto_accessors: bool,

    #[serde(default)]
    pub explicit_resource_management: bool,
}

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
        $crate::token::TokenType::BackQuote
    };
    // (';') => { Token::Semi };
    ('@') => {
        $crate::token::TokenType::At
    };
    ('#') => {
        $crate::token::TokenType::Hash
    };

    ('&') => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::BitAnd)
    };
    ('|') => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::BitOr)
    };
    ('^') => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::BitXor)
    };
    ('+') => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::Add)
    };
    ('-') => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::Sub)
    };
    ("??") => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::NullishCoalescing)
    };
    ('~') => {
        $crate::token::TokenType::Tilde
    };
    ('!') => {
        $crate::token::TokenType::Bang
    };
    ("&&") => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::LogicalAnd)
    };
    ("||") => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::LogicalOr)
    };
    ("&&=") => {
        $crate::token::TokenType::AssignOp(swc_ecma_ast::AssignOp::AndAssign)
    };
    ("||=") => {
        $crate::token::TokenType::AssignOp(swc_ecma_ast::AssignOp::OrAssign)
    };
    ("??=") => {
        $crate::token::TokenType::AssignOp(swc_ecma_ast::AssignOp::NullishAssign)
    };

    ("==") => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::EqEq)
    };
    ("===") => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::EqEqEq)
    };
    ("!=") => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::NotEq)
    };
    ("!==") => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::NotEqEq)
    };

    (',') => {
        $crate::token::TokenType::Comma
    };
    ('?') => {
        $crate::token::TokenType::QuestionMark
    };
    (':') => {
        $crate::token::TokenType::Colon
    };
    ('.') => {
        $crate::token::TokenType::Dot
    };
    ("=>") => {
        $crate::token::TokenType::Arrow
    };
    ("...") => {
        $crate::token::TokenType::DotDotDot
    };
    ("${") => {
        $crate::token::TokenType::DollarLBrace
    };

    ('+') => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::Add)
    };
    ('-') => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::Sub)
    };
    ('*') => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::Mul)
    };
    ('/') => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::Div)
    };
    ("/=") => {
        $crate::token::TokenType::AssignOp(swc_ecma_ast::AssignOp::DivAssign)
    };
    ('%') => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::Mod)
    };
    ('~') => {
        $crate::token::TokenType::Tilde
    };
    ('<') => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::Lt)
    };
    ("<<") => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::LShift)
    };
    ("<=") => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::LtEq)
    };
    ("<<=") => {
        $crate::token::TokenType::AssignOp($crate::token::AssignOp::LShiftAssign)
    };
    ('>') => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::Gt)
    };
    (">>") => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::RShift)
    };
    (">>>") => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::ZeroFillRShift)
    };
    (">=") => {
        $crate::token::TokenType::BinOp($crate::token::BinOpToken::GtEq)
    };
    (">>=") => {
        $crate::token::TokenType::AssignOp(swc_ecma_ast::AssignOp::RShiftAssign)
    };
    (">>>=") => {
        $crate::token::TokenType::AssignOp(swc_ecma_ast::AssignOp::ZeroFillRShiftAssign)
    };

    ("++") => {
        $crate::token::TokenType::PlusPlus
    };
    ("--") => {
        $crate::token::TokenType::MinusMinus
    };

    ('=') => {
        $crate::token::TokenType::AssignOp(swc_ecma_ast::AssignOp::Assign)
    };

    ('(') => {
        $crate::token::TokenType::LParen
    };
    (')') => {
        $crate::token::TokenType::RParen
    };
    ('{') => {
        $crate::token::TokenType::LBrace
    };
    ('}') => {
        $crate::token::TokenType::RBrace
    };
    ('[') => {
        $crate::token::TokenType::LBracket
    };
    (']') => {
        $crate::token::TokenType::RBracket
    };

    ("await") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::Await))
    };
    ("break") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::Break))
    };
    ("case") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::Case))
    };
    ("catch") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::Catch))
    };
    ("class") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::Class))
    };
    ("const") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::Const))
    };
    ("continue") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword(
            $crate::token::Keyword::Continue,
        ))
    };
    ("debugger") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword(
            $crate::token::Keyword::Debugger,
        ))
    };
    ("default") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword(
            $crate::token::Keyword::Default_,
        ))
    };
    ("delete") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::Delete))
    };
    ("do") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::Do))
    };
    ("else") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::Else))
    };
    ("export") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::Export))
    };
    ("extends") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword(
            $crate::token::Keyword::Extends,
        ))
    };
    ("false") => {
        $crate::token::TokenType::Word($crate::token::Word::False)
    };
    ("finally") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword(
            $crate::token::Keyword::Finally,
        ))
    };
    ("for") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::For))
    };
    ("function") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword(
            $crate::token::Keyword::Function,
        ))
    };
    ("if") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::If))
    };
    ("in") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::In))
    };
    ("instanceof") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword(
            $crate::token::Keyword::InstanceOf,
        ))
    };
    ("import") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::Import))
    };
    ("let") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::Let))
    };
    ("new") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::New))
    };
    ("null") => {
        $crate::token::TokenType::Word($crate::token::Word::Null)
    };

    ("return") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::Return))
    };
    ("super") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::Super))
    };
    ("switch") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::Switch))
    };
    ("this") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::This))
    };
    ("throw") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::Throw))
    };
    ("true") => {
        $crate::token::TokenType::Word($crate::token::Word::True)
    };
    ("try") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::Try))
    };
    ("typeof") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::TypeOf))
    };
    ("var") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::Var))
    };
    ("void") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::Void))
    };
    ("while") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::While))
    };
    ("with") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::With))
    };
    ("yield") => {
        $crate::token::TokenType::Word($crate::token::Word::Keyword($crate::token::Keyword::Yield))
    };

    // ----------
    // JSX
    // ----------
    (JSXTagStart) => {
        $crate::token::TokenType::JSXTagStart
    };

    (JSXTagEnd) => {
        $crate::token::TokenType::JSXTagEnd
    };

    ($tt:tt) => {
        $crate::token::TokenType::Word($crate::token::Word::Ident($crate::token::IdentLike::Known(
            known_ident!($tt),
        )))
    };
}
