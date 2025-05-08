//! Ported from [babel/babylon][]
//!
//! [babel/babylon]:https://github.com/babel/babel/blob/2d378d076eb0c5fe63234a8b509886005c01d7ee/packages/babylon/src/tokenizer/types.js
use std::{
    borrow::Cow,
    fmt::{self, Debug, Display, Formatter},
};

use num_bigint::BigInt as BigIntValue;
use swc_atoms::{atom, Atom, AtomStore};
use swc_common::{Span, Spanned};
pub(crate) use swc_ecma_ast::{AssignOp, BinaryOp};

pub(crate) use self::{Keyword::*, Token::*};
use crate::{
    common::{
        input::Tokens,
        lexer::{LexResult, Lexer},
    },
    error::Error,
    tok,
};

macro_rules! define_known_ident {
    (
        $(
            $name:ident => $value:tt,
        )*
    ) => {
        #[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
        #[non_exhaustive]
        pub enum KnownIdent {
            $(
                $name
            ),*
        }

        #[allow(unused)]
        #[macro_export]
        macro_rules! known_ident_token {
            $(
                ($value) => {
                    $crate::token::TokenKind::Word($crate::token::WordKind::Ident(
                        $crate::token::IdentKind::Known($crate::token::KnownIdent::$name),
                    ))
                };
            )*
        }

        #[allow(unused)]
        #[macro_export]
        macro_rules! known_ident {
            $(
                ($value) => {
                    $crate::token::KnownIdent::$name
                };
            )*
        }
        #[allow(unused)]
        #[macro_export]
        macro_rules! ident_like {
            $(
                ($value) => {
                    $crate::token::IdentLike::Known(
                        $crate::token::KnownIdent::$name
                    )
                };
            )*
        }

        static STR_TO_KNOWN_IDENT: phf::Map<&'static str, KnownIdent> = phf::phf_map! {
            $(
                $value => KnownIdent::$name,
            )*
        };

        impl From<KnownIdent> for swc_atoms::Atom {

            fn from(s: KnownIdent) -> Self {
                match s {
                    $(
                        KnownIdent::$name => atom!($value),
                    )*
                }
            }
        }
        impl From<KnownIdent> for &'static str {

            fn from(s: KnownIdent) -> Self {
                match s {
                    $(
                        KnownIdent::$name => $value,
                    )*
                }
            }
        }
    };
}

define_known_ident!(
    Abstract => "abstract",
    As => "as",
    Async => "async",
    From => "from",
    Of => "of",
    Type => "type",
    Global => "global",
    Static => "static",
    Using => "using",
    Readonly => "readonly",
    Unique => "unique",
    Keyof => "keyof",
    Declare => "declare",
    Enum => "enum",
    Is => "is",
    Infer => "infer",
    Symbol => "symbol",
    Undefined => "undefined",
    Interface => "interface",
    Implements => "implements",
    Asserts => "asserts",
    Require => "require",
    Get => "get",
    Set => "set",
    Any => "any",
    Intrinsic => "intrinsic",
    Unknown => "unknown",
    String => "string",
    Object => "object",
    Number => "number",
    Bigint => "bigint",
    Boolean => "boolean",
    Never => "never",
    Assert => "assert",
    Namespace => "namespace",
    Accessor => "accessor",
    Meta => "meta",
    Target => "target",
    Satisfies => "satisfies",
    Package => "package",
    Protected => "protected",
    Private => "private",
    Public => "public",
);

impl std::str::FromStr for KnownIdent {
    type Err = ();

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        STR_TO_KNOWN_IDENT.get(s).cloned().ok_or(())
    }
}

#[derive(Debug, Copy, Clone, PartialEq, Eq, Hash)]
pub enum WordKind {
    Keyword(Keyword),

    Null,
    True,
    False,

    Ident(IdentKind),
}

impl From<Keyword> for WordKind {
    #[inline(always)]
    fn from(kwd: Keyword) -> Self {
        Self::Keyword(kwd)
    }
}

#[derive(Debug, Copy, Clone, PartialEq, Eq, Hash)]
pub enum IdentKind {
    Known(KnownIdent),
    Other,
}

#[derive(Debug, Copy, Clone, PartialEq, Eq, Hash)]
pub enum TokenKind {
    Word(WordKind),
    Arrow,
    Hash,
    At,
    Dot,
    DotDotDot,
    Bang,
    LParen,
    RParen,
    LBracket,
    RBracket,
    LBrace,
    RBrace,
    Semi,
    Comma,
    BackQuote,
    Template,
    Colon,
    BinOp(BinOpToken),
    AssignOp(AssignOp),
    DollarLBrace,
    QuestionMark,
    PlusPlus,
    MinusMinus,
    Tilde,
    Str,
    /// We abuse `token.raw` for flags
    Regex,
    Num,
    BigInt,

    JSXName,
    JSXText,
    JSXTagStart,
    JSXTagEnd,

    Shebang,
    Error,
}

impl crate::common::lexer::state::TokenKind for TokenKind {
    #[inline(always)]
    fn is_dot(self) -> bool {
        self == Self::Dot
    }

    #[inline(always)]
    fn is_bin_op(self) -> bool {
        matches!(self, Self::BinOp(_))
    }

    #[inline(always)]
    fn is_semi(self) -> bool {
        self == Self::Semi
    }

    #[inline(always)]
    fn is_template(self) -> bool {
        self == Self::Template
    }

    #[inline(always)]
    fn is_keyword(self) -> bool {
        matches!(self, Self::Word(WordKind::Keyword(_)))
    }

    #[inline(always)]
    fn is_colon(self) -> bool {
        self == Self::Colon
    }

    #[inline(always)]
    fn is_lbrace(self) -> bool {
        self == Self::LBrace
    }

    #[inline(always)]
    fn is_rbrace(self) -> bool {
        self == Self::RBrace
    }

    #[inline(always)]
    fn is_lparen(self) -> bool {
        self == Self::LParen
    }

    #[inline(always)]
    fn is_rparen(self) -> bool {
        self == Self::RParen
    }

    #[inline(always)]
    fn is_keyword_fn(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::Function))
    }

    #[inline(always)]
    fn is_keyword_return(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::Return))
    }

    #[inline(always)]
    fn is_keyword_yield(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::Yield))
    }

    #[inline(always)]
    fn is_keyword_else(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::Else))
    }

    #[inline(always)]
    fn is_keyword_class(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::Class))
    }

    #[inline(always)]
    fn is_keyword_let(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::Let))
    }

    #[inline(always)]
    fn is_keyword_var(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::Var))
    }

    #[inline(always)]
    fn is_keyword_const(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::Const))
    }

    #[inline(always)]
    fn is_keyword_if(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::If))
    }

    #[inline(always)]
    fn is_keyword_while(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::While))
    }

    #[inline(always)]
    fn is_keyword_for(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::For))
    }

    #[inline(always)]
    fn is_keyword_with(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::With))
    }

    #[inline(always)]
    fn is_lt(self) -> bool {
        self == Self::BinOp(BinOpToken::Lt)
    }

    #[inline(always)]
    fn is_gt(self) -> bool {
        self == Self::BinOp(BinOpToken::Gt)
    }

    #[inline(always)]
    fn is_arrow(self) -> bool {
        self == Self::Arrow
    }

    #[inline(always)]
    fn is_ident(self) -> bool {
        matches!(self, Self::Word(WordKind::Ident(_)))
    }

    #[inline(always)]
    fn is_known_ident_of(self) -> bool {
        self == Self::Word(WordKind::Ident(IdentKind::Known(KnownIdent::Of)))
    }

    #[inline(always)]
    fn is_slash(self) -> bool {
        self == Self::BinOp(BinOpToken::Div)
    }

    #[inline(always)]
    fn is_dollar_lbrace(self) -> bool {
        self == Self::DollarLBrace
    }

    #[inline(always)]
    fn is_plus_plus(self) -> bool {
        self == Self::PlusPlus
    }

    #[inline(always)]
    fn is_minus_minus(self) -> bool {
        self == Self::MinusMinus
    }

    #[inline(always)]
    fn is_back_quote(self) -> bool {
        self == Self::BackQuote
    }

    #[inline(always)]
    fn before_expr(self) -> bool {
        self.before_expr()
    }

    #[inline(always)]
    fn is_jsx_tag_start(self) -> bool {
        self == Self::JSXTagStart
    }

    #[inline(always)]
    fn is_jsx_tag_end(self) -> bool {
        self == Self::JSXTagEnd
    }
}

#[derive(Clone, PartialEq)]
pub enum Token {
    /// Identifier, "null", "true", "false".
    ///
    /// Contains `null` and ``
    Word(Word),

    /// '=>'
    Arrow,

    /// '#'
    Hash,

    /// '@'
    At,
    /// '.'
    Dot,

    /// '...'
    DotDotDot,
    /// '!'
    Bang,

    /// '('
    LParen,
    /// ')'
    RParen,
    /// `[`
    LBracket,
    /// ']'
    RBracket,
    /// '{'
    LBrace,
    /// '}'
    RBrace,

    /// ';'
    Semi,
    /// ','
    Comma,

    /// '`'
    BackQuote,
    Template {
        raw: Atom,
        cooked: LexResult<Atom>,
    },
    /// ':'
    Colon,
    BinOp(BinOpToken),
    AssignOp(AssignOp),

    /// '${'
    DollarLBrace,

    /// '?'
    QuestionMark,

    /// `++`
    PlusPlus,
    /// `--`
    MinusMinus,

    /// `~`
    Tilde,

    /// String literal. Span of this token contains quote.
    Str {
        value: Atom,
        raw: Atom,
    },

    /// Regexp literal.
    Regex(Atom, Atom),

    /// TODO: Make Num as enum and separate decimal, binary, ..etc
    Num {
        value: f64,
        raw: Atom,
    },

    BigInt {
        value: Box<BigIntValue>,
        raw: Atom,
    },

    JSXName {
        name: Atom,
    },
    JSXText {
        value: Atom,
        raw: Atom,
    },
    JSXTagStart,
    JSXTagEnd,

    Shebang(Atom),
    Error(Error),
}

impl<'a, I: Tokens<TokenAndSpan>> crate::common::lexer::token::TokenFactory<'a, TokenAndSpan, I>
    for Token
{
    type Buffer = crate::input::Buffer<I>;
    type Lexer = crate::Lexer<'a>;

    const AS: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::As)));
    const ASSERTS: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Asserts)));
    const AT: Self = Self::At;
    const AWAIT: Self = Token::Word(Word::Keyword(Keyword::Await));
    const BACKQUOTE: Self = Self::BackQuote;
    const BANG: Self = Self::Bang;
    const BIT_AND: Self = Self::BinOp(BinOpToken::BitAnd);
    const BIT_AND_EQ: Self = Self::AssignOp(AssignOp::BitAndAssign);
    const BIT_OR: Self = Self::BinOp(BinOpToken::BitOr);
    const BIT_OR_EQ: Self = Self::AssignOp(AssignOp::BitOrAssign);
    const CLASS: Self = Token::Word(Word::Keyword(Keyword::Class));
    const COLON: Self = Self::Colon;
    const COMMA: Self = Self::Comma;
    const CONST: Self = Token::Word(Word::Keyword(Keyword::Const));
    const DELETE: Self = Token::Word(Word::Keyword(Keyword::Delete));
    const DIV: Self = Token::BinOp(BinOpToken::Div);
    const DIV_EQ: Self = Token::AssignOp(AssignOp::DivAssign);
    const DOLLAR_LBRACE: Self = Self::DollarLBrace;
    const DOT: Self = Self::Dot;
    const DOTDOTDOT: Self = Self::DotDotDot;
    const ENUM: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Enum)));
    const EQUAL: Self = Token::AssignOp(AssignOp::Assign);
    const EXP: Self = Token::BinOp(BinOpToken::Exp);
    const EXPORT: Self = Token::Word(Word::Keyword(Keyword::Export));
    const EXP_EQ: Self = Token::AssignOp(AssignOp::ExpAssign);
    const EXTENDS: Self = Self::Word(Word::Keyword(Keyword::Extends));
    const FALSE: Self = Token::Word(Word::False);
    const FUNCTION: Self = Token::Word(Word::Keyword(Keyword::Function));
    const GREATER: Self = Token::BinOp(BinOpToken::Gt);
    const GREATER_EQ: Self = Token::BinOp(BinOpToken::GtEq);
    const HASH: Self = Self::Hash;
    const IMPLEMENTS: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Implements)));
    const IMPORT: Self = Token::Word(Word::Keyword(Keyword::Import));
    const IN: Self = Token::Word(Word::Keyword(Keyword::In));
    const INTERFACE: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Interface)));
    const IS: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Is)));
    const JSX_TAG_END: Self = Self::JSXTagEnd;
    const JSX_TAG_START: Self = Self::JSXTagStart;
    const KW_SUPER: Self = Token::Word(Word::Keyword(Keyword::Super));
    const LBRACE: Self = Self::LBrace;
    const LBRACKET: Self = Self::LBracket;
    const LESS: Self = Token::BinOp(BinOpToken::Lt);
    const LESS_EQ: Self = Token::BinOp(BinOpToken::LtEq);
    const LET: Self = Token::Word(Word::Keyword(Keyword::Let));
    const LOGICAL_AND: Self = tok!("&&");
    const LOGICAL_AND_EQ: Self = Token::AssignOp(AssignOp::AddAssign);
    const LOGICAL_OR: Self = tok!("||");
    const LOGICAL_OR_EQ: Self = Token::AssignOp(AssignOp::OrAssign);
    const LPAREN: Self = Self::LParen;
    const LSHIFT: Self = Token::BinOp(BinOpToken::LShift);
    const LSHIFT_EQ: Self = Token::AssignOp(AssignOp::LShiftAssign);
    const MINUS: Self = Token::BinOp(BinOpToken::Sub);
    const MINUS_MINUS: Self = Self::MinusMinus;
    const MOD: Self = Token::BinOp(BinOpToken::Mod);
    const MOD_EQ: Self = Token::AssignOp(AssignOp::ModAssign);
    const MUL: Self = Token::BinOp(BinOpToken::Mul);
    const MUL_EQ: Self = Token::AssignOp(AssignOp::MulAssign);
    const NEW: Self = Token::Word(Word::Keyword(Keyword::New));
    const NULL: Self = Token::Word(Word::Null);
    const NULLISH_ASSIGN: Self = tok!("??=");
    const NULLISH_COALESCING: Self = tok!("??");
    const PACKAGE: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Package)));
    const PLUS: Self = Token::BinOp(BinOpToken::Add);
    const PLUS_PLUS: Self = Self::PlusPlus;
    const PRIVATE: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Private)));
    const PROTECTED: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Protected)));
    const PUBLIC: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Public)));
    const QUESTION: Self = Token::QuestionMark;
    const RBRACE: Self = Self::RBrace;
    const RBRACKET: Self = Self::RBracket;
    const READONLY: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Readonly)));
    const RPAREN: Self = Self::RParen;
    const RSHIFT: Self = Token::BinOp(BinOpToken::RShift);
    const RSHIFT_EQ: Self = Token::AssignOp(AssignOp::RShiftAssign);
    const SATISFIES: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Satisfies)));
    const SEMI: Self = Self::Semi;
    const STATIC: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Static)));
    const THIS: Self = Token::Word(Word::Keyword(Keyword::This));
    const TILDE: Self = Self::Tilde;
    const TRUE: Self = Token::Word(Word::True);
    const TYPEOF: Self = Token::Word(Word::Keyword(Keyword::TypeOf));
    const VOID: Self = Token::Word(Word::Keyword(Keyword::Void));
    const YIELD: Self = Token::Word(Word::Keyword(Keyword::Yield));
    const ZERO_FILL_RSHIFT: Self = Token::BinOp(BinOpToken::ZeroFillRShift);
    const ZERO_FILL_RSHIFT_EQ: Self = Token::AssignOp(AssignOp::ZeroFillRShiftAssign);

    #[inline(always)]
    fn jsx_name(name: &'a str, lexer: &mut crate::Lexer<'a>) -> Self {
        let name = lexer.atom(name);
        Self::JSXName { name }
    }

    #[inline(always)]
    fn is_jsx_name(&self) -> bool {
        matches!(self, Self::JSXName { .. })
    }

    #[inline(always)]
    fn take_jsx_name(self, _: &mut Self::Buffer) -> Atom {
        match self {
            JSXName { name } => name,
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn str(value: Atom, raw: Atom, _: &mut crate::Lexer<'a>) -> Self {
        Self::Str { value, raw }
    }

    #[inline(always)]
    fn template(cooked: LexResult<Atom>, raw: Atom, _: &mut crate::Lexer<'a>) -> Self {
        Self::Template { cooked, raw }
    }

    #[inline(always)]
    fn regexp(content: Atom, flags: Atom, _: &mut crate::Lexer<'a>) -> Self {
        Self::Regex(content, flags)
    }

    #[inline(always)]
    fn num(value: f64, raw: Atom, _: &mut crate::Lexer<'a>) -> Self {
        Self::Num { value, raw }
    }

    #[inline(always)]
    fn bigint(value: Box<BigIntValue>, raw: Atom, _: &mut crate::Lexer<'a>) -> Self {
        Self::BigInt { value, raw }
    }

    #[inline(always)]
    fn unknown_ident(value: Atom, _: &mut crate::Lexer<'a>) -> Self {
        Token::Word(Word::Ident(IdentLike::Other(value)))
    }

    #[inline(always)]
    fn is_word(&self) -> bool {
        matches!(self, Self::Word(_))
    }

    #[inline(always)]
    fn is_reserved(&self, ctx: crate::common::context::Context) -> bool {
        if let Token::Word(word) = self {
            ctx.is_reserved(word)
        } else {
            unreachable!()
        }
    }

    #[inline(always)]
    fn into_atom(self, _: &mut crate::Lexer<'a>) -> Option<Atom> {
        match self {
            Token::Word(word) => Some(word.into()),
            _ => None,
        }
    }

    #[inline(always)]
    fn is_error(&self) -> bool {
        matches!(self, Self::Error(_))
    }

    #[inline(always)]
    fn take_error(self, _: &mut Self::Buffer) -> crate::error::Error {
        match self {
            Self::Error(e) => e,
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn is_str(&self) -> bool {
        matches!(self, Self::Str { .. })
    }

    #[inline(always)]
    fn take_str(self, _: &mut Self::Buffer) -> (Atom, Atom) {
        match self {
            Self::Str { value, raw } => (value, raw),
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn is_num(&self) -> bool {
        matches!(self, Self::Num { .. })
    }

    #[inline(always)]
    fn take_num(self, _: &mut Self::Buffer) -> (f64, Atom) {
        match self {
            Self::Num { value, raw } => (value, raw),
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn is_bigint(&self) -> bool {
        matches!(self, Self::BigInt { .. })
    }

    #[inline(always)]
    fn take_bigint(self, _: &mut Self::Buffer) -> (Box<BigIntValue>, Atom) {
        match self {
            Self::BigInt { value, raw } => (value, raw),
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn take_word(self, _: &mut Self::Buffer) -> Option<Atom> {
        match self {
            Self::Word(word) => Some(word.into()),
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn is_unknown_ident(&self) -> bool {
        matches!(self, Self::Word(Word::Ident(IdentLike::Other(_))))
    }

    #[inline(always)]
    fn take_unknown_ident(self, _: &mut Self::Buffer) -> Atom {
        match self {
            Self::Word(Word::Ident(IdentLike::Other(ident))) => ident,
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn take_unknown_ident_ref<'b>(&'b self, _: &'b mut Self::Buffer) -> &'b Atom {
        match self {
            Self::Word(Word::Ident(IdentLike::Other(ref ident))) => ident,
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn is_keyword(&self) -> bool {
        matches!(self, Self::Word(Word::Keyword(_)))
    }

    #[inline(always)]
    fn is_known_ident(&self) -> bool {
        matches!(self, Self::Word(Word::Ident(IdentLike::Known(_))))
    }

    #[inline(always)]
    fn take_known_ident(&self) -> Atom {
        match self {
            Self::Word(Word::Ident(IdentLike::Known(kwd))) => (*kwd).into(),
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn is_regexp(&self) -> bool {
        matches!(self, Self::Regex(..))
    }

    #[inline(always)]
    fn is_template(&self) -> bool {
        matches!(self, Self::Template { .. })
    }

    #[inline(always)]
    fn take_template(self, _: &mut Self::Buffer) -> (LexResult<Atom>, Atom) {
        match self {
            Self::Template { cooked, raw } => (cooked, raw),
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn jsx_text(value: Atom, raw: Atom, _: &mut Self::Lexer) -> Self {
        Self::JSXText { value, raw }
    }

    #[inline(always)]
    fn is_jsx_text(&self) -> bool {
        matches!(self, Self::JSXText { .. })
    }

    #[inline(always)]
    fn take_jsx_text(self, _: &mut Self::Buffer) -> (Atom, Atom) {
        match self {
            Self::JSXText { value, raw } => (value, raw),
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn starts_expr(&self) -> bool {
        self.kind().starts_expr()
    }

    #[inline(always)]
    fn to_string(&self, _: &Self::Buffer) -> String {
        format!("{self:?}")
    }

    #[inline(always)]
    fn is_bin_op(&self) -> bool {
        matches!(self, Self::BinOp(_))
    }

    #[inline(always)]
    fn as_assign_op(&self) -> Option<AssignOp> {
        match self {
            Self::AssignOp(op) => Some(*op),
            _ => None,
        }
    }
}

impl Token {
    pub fn kind(&self) -> TokenKind {
        match self {
            Self::Arrow => TokenKind::Arrow,
            Self::Hash => TokenKind::Hash,
            Self::At => TokenKind::At,
            Self::Dot => TokenKind::Dot,
            Self::DotDotDot => TokenKind::DotDotDot,
            Self::Bang => TokenKind::Bang,
            Self::LParen => TokenKind::LParen,
            Self::RParen => TokenKind::RParen,
            Self::LBracket => TokenKind::LBracket,
            Self::RBracket => TokenKind::RBracket,
            Self::LBrace => TokenKind::LBrace,
            Self::RBrace => TokenKind::RBrace,
            Self::Semi => TokenKind::Semi,
            Self::Comma => TokenKind::Comma,
            Self::BackQuote => TokenKind::BackQuote,
            Self::Template { .. } => TokenKind::Template,
            Self::Colon => TokenKind::Colon,
            Self::BinOp(op) => TokenKind::BinOp(*op),
            Self::AssignOp(op) => TokenKind::AssignOp(*op),
            Self::DollarLBrace => TokenKind::DollarLBrace,
            Self::QuestionMark => TokenKind::QuestionMark,
            Self::PlusPlus => TokenKind::PlusPlus,
            Self::MinusMinus => TokenKind::MinusMinus,
            Self::Tilde => TokenKind::Tilde,
            Self::Str { .. } => TokenKind::Str,
            Self::Regex(..) => TokenKind::Regex,
            Self::Num { .. } => TokenKind::Num,
            Self::BigInt { .. } => TokenKind::BigInt,
            Self::JSXName { .. } => TokenKind::JSXName,
            Self::JSXText { .. } => TokenKind::JSXText,
            Self::JSXTagStart => TokenKind::JSXTagStart,
            Self::JSXTagEnd => TokenKind::JSXTagEnd,
            Self::Shebang(..) => TokenKind::Shebang,
            Self::Error(..) => TokenKind::Error,
            Self::Word(w) => TokenKind::Word(w.kind()),
        }
    }
}

impl TokenKind {
    pub const fn before_expr(self) -> bool {
        match self {
            Self::Word(w) => w.before_expr(),
            Self::BinOp(w) => w.before_expr(),
            Self::Arrow
            | Self::DotDotDot
            | Self::Bang
            | Self::LParen
            | Self::LBrace
            | Self::LBracket
            | Self::Semi
            | Self::Comma
            | Self::Colon
            | Self::AssignOp(..)
            | Self::DollarLBrace
            | Self::QuestionMark
            | Self::PlusPlus
            | Self::MinusMinus
            | Self::Tilde
            | Self::JSXText { .. } => true,
            _ => false,
        }
    }

    pub const fn starts_expr(self) -> bool {
        match self {
            Self::Word(w) => w.starts_expr(),
            Self::BinOp(w) => w.starts_expr(),
            Self::Bang
            | Self::LParen
            | Self::LBrace
            | Self::LBracket
            | Self::BackQuote
            | Self::DollarLBrace
            | Self::PlusPlus
            | Self::MinusMinus
            | Self::Tilde
            | Self::Str
            | Self::Regex
            | Self::Num
            | Self::BigInt
            | Self::JSXTagStart => true,
            _ => false,
        }
    }
}

#[derive(Debug, Clone, Copy, Eq, PartialEq, Hash)]
pub enum BinOpToken {
    /// `==`
    EqEq,
    /// `!=`
    NotEq,
    /// `===`
    EqEqEq,
    /// `!==`
    NotEqEq,
    /// `<`
    Lt,
    /// `<=`
    LtEq,
    /// `>`
    Gt,
    /// `>=`
    GtEq,
    /// `<<`
    LShift,
    /// `>>`
    RShift,
    /// `>>>`
    ZeroFillRShift,

    /// `+`
    Add,
    /// `-`
    Sub,
    /// `*`
    Mul,
    /// `/`
    Div,
    /// `%`
    Mod,

    /// `|`
    BitOr,
    /// `^`
    BitXor,
    /// `&`
    BitAnd,

    // /// `in`
    // #[kind(precedence = "7")]
    // In,
    // /// `instanceof`
    // #[kind(precedence = "7")]
    // InstanceOf,
    /// `**`
    Exp,

    /// `||`
    LogicalOr,
    /// `&&`
    LogicalAnd,

    /// `??`
    NullishCoalescing,
}

impl BinOpToken {
    pub(crate) const fn starts_expr(self) -> bool {
        matches!(self, Self::Add | Self::Sub)
    }

    pub const fn before_expr(self) -> bool {
        true
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct TokenAndSpan {
    pub token: Token,
    /// Had a line break before this token?
    pub had_line_break: bool,
    pub span: Span,
}

impl crate::common::parser::token_and_span::TokenAndSpan for TokenAndSpan {
    type Token = Token;

    #[inline(always)]
    fn new(token: Token, span: Span, had_line_break: bool) -> Self {
        Self {
            token,
            had_line_break,
            span,
        }
    }

    #[inline(always)]
    fn token(&self) -> &Token {
        &self.token
    }

    #[inline(always)]
    fn take_token(self) -> Token {
        self.token
    }

    #[inline(always)]
    fn had_line_break(&self) -> bool {
        self.had_line_break
    }

    #[inline(always)]
    fn span(&self) -> Span {
        self.span
    }
}

impl crate::common::parser::buffer::NextTokenAndSpan for TokenAndSpan {
    type Token = Token;

    #[inline(always)]
    fn token(&self) -> &Self::Token {
        &self.token
    }

    #[inline(always)]
    fn span(&self) -> Span {
        self.span
    }

    #[inline(always)]
    fn had_line_break(&self) -> bool {
        self.had_line_break
    }
}

impl Spanned for TokenAndSpan {
    #[inline]
    fn span(&self) -> Span {
        self.span
    }
}

#[derive(Clone, PartialEq, Eq, Hash)]
pub enum Word {
    Keyword(Keyword),

    Null,
    True,
    False,

    Ident(IdentLike),
}

#[derive(Clone, PartialEq, Eq, Hash)]
pub enum IdentLike {
    Known(KnownIdent),
    Other(Atom),
}

impl From<&'_ str> for IdentLike {
    fn from(s: &str) -> Self {
        s.parse::<KnownIdent>()
            .map(Self::Known)
            .unwrap_or_else(|_| Self::Other(s.into()))
    }
}

impl IdentLike {
    pub(crate) fn from_str(atoms: &mut AtomStore, s: &str) -> IdentLike {
        s.parse::<KnownIdent>()
            .map(Self::Known)
            .unwrap_or_else(|_| Self::Other(atoms.atom(s)))
    }
}

impl Word {
    pub fn from_str(atoms: &mut AtomStore, s: &str) -> Self {
        match s {
            "null" => Word::Null,
            "true" => Word::True,
            "false" => Word::False,
            "await" => Await.into(),
            "break" => Break.into(),
            "case" => Case.into(),
            "catch" => Catch.into(),
            "continue" => Continue.into(),
            "debugger" => Debugger.into(),
            "default" => Default_.into(),
            "do" => Do.into(),
            "export" => Export.into(),
            "else" => Else.into(),
            "finally" => Finally.into(),
            "for" => For.into(),
            "function" => Function.into(),
            "if" => If.into(),
            "return" => Return.into(),
            "switch" => Switch.into(),
            "throw" => Throw.into(),
            "try" => Try.into(),
            "var" => Var.into(),
            "let" => Let.into(),
            "const" => Const.into(),
            "while" => While.into(),
            "with" => With.into(),
            "new" => New.into(),
            "this" => This.into(),
            "super" => Super.into(),
            "class" => Class.into(),
            "extends" => Extends.into(),
            "import" => Import.into(),
            "yield" => Yield.into(),
            "in" => In.into(),
            "instanceof" => InstanceOf.into(),
            "typeof" => TypeOf.into(),
            "void" => Void.into(),
            "delete" => Delete.into(),
            _ => Word::Ident(IdentLike::from_str(atoms, s)),
        }
    }

    pub(crate) fn kind(&self) -> WordKind {
        match self {
            Word::Keyword(k) => WordKind::Keyword(*k),
            Word::Null => WordKind::Null,
            Word::True => WordKind::True,
            Word::False => WordKind::False,
            Word::Ident(IdentLike::Known(i)) => WordKind::Ident(IdentKind::Known(*i)),
            Word::Ident(IdentLike::Other(..)) => WordKind::Ident(IdentKind::Other),
        }
    }
}

impl WordKind {
    pub(crate) const fn before_expr(self) -> bool {
        match self {
            Self::Keyword(k) => k.before_expr(),
            _ => false,
        }
    }

    pub(crate) const fn starts_expr(self) -> bool {
        match self {
            Self::Keyword(k) => k.starts_expr(),
            _ => true,
        }
    }
}

impl AsRef<str> for IdentLike {
    fn as_ref(&self) -> &str {
        match self {
            IdentLike::Known(k) => (*k).into(),
            IdentLike::Other(s) => s.as_ref(),
        }
    }
}

impl From<Keyword> for Word {
    fn from(kwd: Keyword) -> Self {
        Word::Keyword(kwd)
    }
}

impl From<Word> for Atom {
    fn from(w: Word) -> Self {
        match w {
            Word::Keyword(k) => match k {
                Await => "await",
                Break => "break",
                Case => "case",
                Catch => "catch",
                Continue => "continue",
                Debugger => "debugger",
                Default_ => "default",
                Do => "do",
                Else => "else",

                Finally => "finally",
                For => "for",

                Function => "function",

                If => "if",

                Return => "return",

                Switch => "switch",

                Throw => "throw",

                Try => "try",
                Var => "var",
                Let => "let",
                Const => "const",
                While => "while",
                With => "with",

                New => "new",
                This => "this",
                Super => "super",

                Class => "class",

                Extends => "extends",

                Export => "export",
                Import => "import",

                Yield => "yield",

                In => "in",
                InstanceOf => "instanceof",

                TypeOf => "typeof",

                Void => "void",

                Delete => "delete",
            }
            .into(),

            Word::Null => "null".into(),
            Word::True => "true".into(),
            Word::False => "false".into(),

            Word::Ident(w) => w.into(),
        }
    }
}

impl From<IdentLike> for Atom {
    fn from(i: IdentLike) -> Self {
        match i {
            IdentLike::Known(i) => i.into(),
            IdentLike::Other(i) => i,
        }
    }
}

impl Debug for Word {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        match *self {
            Word::Ident(ref s) => Display::fmt(s, f),
            _ => {
                let s: Atom = self.clone().into();
                Display::fmt(&s, f)
            }
        }
    }
}

impl Display for IdentLike {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        match *self {
            IdentLike::Known(ref s) => Display::fmt(s, f),
            IdentLike::Other(ref s) => Display::fmt(s, f),
        }
    }
}

impl Display for KnownIdent {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        let s: &'static str = (*self).into();

        Display::fmt(s, f)
    }
}

#[macro_export]
macro_rules! declare_keyword {
    ($(
        $name:ident => $value:tt,
    )*) => {
        impl Keyword {
            pub fn into_atom(self) -> Atom {
                match self {
                    $(Keyword::$name => atom!($value),)*
                }
            }
        }
    };
}

declare_keyword!(
    Await => "await",
    Break => "break",
    Case => "case",
    Catch => "catch",
    Continue => "continue",
    Debugger => "debugger",
    Default_ => "default",
    Do => "do",
    Else => "else",

    Finally => "finally",
    For => "for",

    Function => "function",

    If => "if",

    Return => "return",

    Switch => "switch",

    Throw => "throw",

    Try => "try",
    Var => "var",
    Let => "let",
    Const => "const",
    While => "while",
    With => "with",

    New => "new",
    This => "this",
    Super => "super",

    Class => "class",

    Extends => "extends",

    Export => "export",
    Import => "import",

    Yield => "yield",

    In => "in",
    InstanceOf => "instanceof",

    TypeOf => "typeof",

    Void => "void",

    Delete => "delete",
);

/// Keywords
#[derive(Clone, Copy, PartialEq, Eq, Hash)]
pub enum Keyword {
    /// Spec says this might be identifier.
    Await,
    Break,
    Case,
    Catch,
    Continue,
    Debugger,
    Default_,
    Do,
    Else,

    Finally,
    For,

    Function,

    If,

    Return,

    Switch,

    Throw,

    Try,
    Var,
    Let,
    Const,
    While,
    With,

    New,
    This,
    Super,

    Class,

    Extends,

    Export,
    Import,

    /// Spec says this might be identifier.
    Yield,

    In,
    InstanceOf,
    TypeOf,
    Void,
    Delete,
}

impl Keyword {
    pub const fn before_expr(self) -> bool {
        matches!(
            self,
            Self::Await
                | Self::Case
                | Self::Default_
                | Self::Do
                | Self::Else
                | Self::Return
                | Self::Throw
                | Self::New
                | Self::Extends
                | Self::Yield
                | Self::In
                | Self::InstanceOf
                | Self::TypeOf
                | Self::Void
                | Self::Delete
        )
    }

    pub(crate) const fn starts_expr(self) -> bool {
        matches!(
            self,
            Self::Await
                | Self::Function
                | Self::Throw
                | Self::New
                | Self::This
                | Self::Super
                | Self::Class
                | Self::Import
                | Self::Yield
                | Self::TypeOf
                | Self::Void
                | Self::Delete
        )
    }
}

impl Debug for Keyword {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        write!(f, "keyword '{}'", self.into_atom())?;

        Ok(())
    }
}

impl From<BinOpToken> for BinaryOp {
    fn from(t: BinOpToken) -> Self {
        use self::BinaryOp::*;
        match t {
            BinOpToken::EqEq => EqEq,
            BinOpToken::NotEq => NotEq,
            BinOpToken::EqEqEq => EqEqEq,
            BinOpToken::NotEqEq => NotEqEq,
            BinOpToken::Lt => Lt,
            BinOpToken::LtEq => LtEq,
            BinOpToken::Gt => Gt,
            BinOpToken::GtEq => GtEq,
            BinOpToken::LShift => LShift,
            BinOpToken::RShift => RShift,
            BinOpToken::ZeroFillRShift => ZeroFillRShift,
            BinOpToken::Add => Add,
            BinOpToken::Sub => Sub,
            BinOpToken::Mul => Mul,
            BinOpToken::Div => Div,
            BinOpToken::Mod => Mod,
            BinOpToken::BitOr => BitOr,
            BinOpToken::BitXor => BitXor,
            BinOpToken::BitAnd => BitAnd,
            BinOpToken::LogicalOr => LogicalOr,
            BinOpToken::LogicalAnd => LogicalAnd,
            BinOpToken::Exp => Exp,
            BinOpToken::NullishCoalescing => NullishCoalescing,
        }
    }
}

impl TokenKind {
    /// Returns true if `self` can follow keyword let.
    ///
    /// e.g. `let a = xx;`, `let {a:{}} = 1`
    pub fn follows_keyword_let(self, _strict: bool) -> bool {
        match self {
            Self::Word(WordKind::Keyword(Keyword::Let))
            | TokenKind::LBrace
            | TokenKind::LBracket
            | Self::Word(WordKind::Ident(..))
            | TokenKind::Word(WordKind::Keyword(Keyword::Yield))
            | TokenKind::Word(WordKind::Keyword(Keyword::Await)) => true,
            _ => false,
        }
    }
}

impl Word {
    pub fn cow(&self) -> Cow<Atom> {
        match self {
            Word::Keyword(k) => Cow::Owned(k.into_atom()),
            Word::Ident(IdentLike::Known(w)) => Cow::Owned((*w).into()),
            Word::Ident(IdentLike::Other(w)) => Cow::Borrowed(w),
            Word::False => Cow::Owned(atom!("false")),
            Word::True => Cow::Owned(atom!("true")),
            Word::Null => Cow::Owned(atom!("null")),
        }
    }
}

impl Debug for Token {
    /// This method is called only in the case of parsing failure.
    #[cold]
    #[inline(never)]
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        match self {
            Token::Word(w) => write!(f, "{w:?}")?,
            Arrow => write!(f, "=>")?,
            Hash => write!(f, "#")?,
            At => write!(f, "@")?,
            Dot => write!(f, ".")?,
            DotDotDot => write!(f, "...")?,
            Bang => write!(f, "!")?,
            LParen => write!(f, "(")?,
            RParen => write!(f, ")")?,
            LBracket => write!(f, "[")?,
            RBracket => write!(f, "]")?,
            LBrace => write!(f, "{{")?,
            RBrace => write!(f, "}}")?,
            Semi => write!(f, ";")?,
            Comma => write!(f, ",")?,
            BackQuote => write!(f, "`")?,
            Template { raw, .. } => write!(f, "template token ({raw})")?,
            Colon => write!(f, ":")?,
            BinOp(op) => write!(f, "{}", BinaryOp::from(*op).as_str())?,
            AssignOp(op) => write!(f, "{}", op.as_str())?,
            DollarLBrace => write!(f, "${{")?,
            QuestionMark => write!(f, "?")?,
            PlusPlus => write!(f, "++")?,
            MinusMinus => write!(f, "--")?,
            Tilde => write!(f, "~")?,
            Str { value, raw } => write!(f, "string literal ({value}, {raw})")?,
            Regex(exp, flags) => write!(f, "regexp literal ({exp}, {flags})")?,
            Num { value, raw, .. } => write!(f, "numeric literal ({value}, {raw})")?,
            BigInt { value, raw } => write!(f, "bigint literal ({value}, {raw})")?,
            JSXName { name } => write!(f, "jsx name ({name})")?,
            JSXText { raw, .. } => write!(f, "jsx text ({raw})")?,
            JSXTagStart => write!(f, "< (jsx tag start)")?,
            JSXTagEnd => write!(f, "> (jsx tag end)")?,
            Shebang(_) => write!(f, "#!")?,
            Token::Error(e) => write!(f, "<lexing error: {e:?}>")?,
        }

        Ok(())
    }
}
