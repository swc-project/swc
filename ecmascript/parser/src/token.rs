//! Ported from [babel/bablyon][]
//!
//! [babel/bablyon]:https://github.com/babel/babel/blob/2d378d076eb0c5fe63234a8b509886005c01d7ee/packages/babylon/src/tokenizer/types.js
pub(crate) use self::{AssignOpToken::*, BinOpToken::*, Keyword::*, Token::*};
use crate::error::Error;
use enum_kind::Kind;
use num_bigint::BigInt as BigIntValue;
use std::{
    borrow::Cow,
    fmt::{self, Debug, Display, Formatter},
};
use swc_atoms::{js_word, JsWord};
#[cfg(feature = "fold")]
use swc_common::Fold;
use swc_common::SpanData;
pub(crate) use swc_ecma_ast::AssignOp as AssignOpToken;
use swc_ecma_ast::BinaryOp;

#[derive(Kind, Debug, Clone, PartialEq)]
#[cfg_attr(feature = "fold", derive(Fold))]
#[kind(functions(starts_expr = "bool", before_expr = "bool"))]
pub enum Token {
    /// Identifier, "null", "true", "false".
    ///
    /// Contains `null` and ``
    #[kind(delegate)]
    Word(Word),

    /// '=>'
    #[kind(before_expr)]
    Arrow,

    /// '#'
    Hash,

    /// '@'
    At,
    /// '.'
    Dot,

    /// '...'
    #[kind(before_expr)]
    DotDotDot,
    /// '!'
    #[kind(before_expr, starts_expr)]
    Bang,

    /// '('
    #[kind(before_expr, starts_expr)]
    LParen,
    /// ')'
    RParen,
    /// `[`
    #[kind(before_expr, starts_expr)]
    LBracket,
    /// ']'
    RBracket,
    /// '{'
    #[kind(before_expr, starts_expr)]
    LBrace,
    /// '}'
    RBrace,

    /// ';'
    #[kind(before_expr)]
    Semi,
    /// ','
    #[kind(before_expr)]
    Comma,

    /// '`'
    #[kind(starts_expr)]
    BackQuote,
    Template {
        raw: JsWord,
        cooked: JsWord,
        has_escape: bool,
    },
    /// ':'
    #[kind(before_expr)]
    Colon,
    /// '::'
    #[kind(before_expr)]
    ColonColon,
    ///
    #[kind(delegate)]
    BinOp(BinOpToken),
    ///
    #[kind(before_expr)]
    AssignOp(AssignOpToken),

    /// '${'
    #[kind(before_expr, starts_expr)]
    DollarLBrace,

    /// '?'
    #[kind(before_expr)]
    QuestionMark,

    /// `++`
    #[kind(before_expr, starts_expr)]
    PlusPlus,
    /// `--`
    #[kind(before_expr, starts_expr)]
    MinusMinus,

    /// `~`
    #[kind(before_expr, starts_expr)]
    Tilde,

    /// String literal.
    #[kind(starts_expr)]
    Str {
        value: JsWord,
        /// This field exsits because 'use\x20strict' is **not** an use strict
        /// directive.
        has_escape: bool,
    },

    /// Regexp literal.
    #[kind(starts_expr)]
    Regex(JsWord, JsWord),

    /// TODO: Make Num as enum and separate decimal, binary, ..etc
    #[kind(starts_expr)]
    Num(f64),

    #[kind(starts_expr)]
    BigInt(#[cfg_attr(feature = "fold", fold(ignore))] BigIntValue),

    JSXName {
        name: JsWord,
    },
    #[kind(before_expr)]
    JSXText {
        raw: JsWord,
    },
    #[kind(starts_expr)]
    JSXTagStart,
    JSXTagEnd,

    Shebang(JsWord),
    Error(#[cfg_attr(feature = "fold", fold(ignore))] Error),
}

#[derive(Kind, Debug, Clone, Copy, Eq, PartialEq, Hash)]
#[cfg_attr(feature = "fold", derive(Fold))]
#[kind(functions(starts_expr = "bool"))]
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
    #[kind(starts_expr)]
    Add,
    /// `-`
    #[kind(starts_expr)]
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
    pub const fn before_expr(self) -> bool {
        true
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct TokenAndSpan {
    pub token: Token,
    /// Had a line break before this token?
    pub had_line_break: bool,
    pub span: SpanData,
}

#[derive(Kind, Clone, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "fold", derive(Fold))]
#[kind(functions(starts_expr = "bool", before_expr = "bool"))]
pub enum Word {
    #[kind(delegate)]
    Keyword(Keyword),

    #[kind(starts_expr)]
    Null,
    #[kind(starts_expr)]
    True,
    #[kind(starts_expr)]
    False,

    #[kind(starts_expr)]
    Ident(JsWord),
}

impl From<JsWord> for Word {
    fn from(i: JsWord) -> Self {
        match i {
            js_word!("null") => Word::Null,
            js_word!("true") => Word::True,
            js_word!("false") => Word::False,
            js_word!("await") => Await.into(),
            js_word!("break") => Break.into(),
            js_word!("case") => Case.into(),
            js_word!("catch") => Catch.into(),
            js_word!("continue") => Continue.into(),
            js_word!("debugger") => Debugger.into(),
            js_word!("default") => Default_.into(),
            js_word!("do") => Do.into(),
            js_word!("export") => Export.into(),
            js_word!("else") => Else.into(),
            js_word!("finally") => Finally.into(),
            js_word!("for") => For.into(),
            js_word!("function") => Function.into(),
            js_word!("if") => If.into(),
            js_word!("return") => Return.into(),
            js_word!("switch") => Switch.into(),
            js_word!("throw") => Throw.into(),
            js_word!("try") => Try.into(),
            js_word!("var") => Var.into(),
            js_word!("let") => Let.into(),
            js_word!("const") => Const.into(),
            js_word!("while") => While.into(),
            js_word!("with") => With.into(),
            js_word!("new") => New.into(),
            js_word!("this") => This.into(),
            js_word!("super") => Super.into(),
            js_word!("class") => Class.into(),
            js_word!("extends") => Extends.into(),
            js_word!("import") => Import.into(),
            js_word!("yield") => Yield.into(),
            js_word!("in") => In.into(),
            js_word!("instanceof") => InstanceOf.into(),
            js_word!("typeof") => TypeOf.into(),
            js_word!("void") => Void.into(),
            js_word!("delete") => Delete.into(),
            _ => Word::Ident(i),
        }
    }
}
impl From<Keyword> for Word {
    fn from(kwd: Keyword) -> Self {
        Word::Keyword(kwd)
    }
}

impl From<Word> for JsWord {
    fn from(w: Word) -> Self {
        match w {
            Word::Keyword(k) => match k {
                Await => js_word!("await"),
                Break => js_word!("break"),
                Case => js_word!("case"),
                Catch => js_word!("catch"),
                Continue => js_word!("continue"),
                Debugger => js_word!("debugger"),
                Default_ => js_word!("default"),
                Do => js_word!("do"),
                Else => js_word!("else"),

                Finally => js_word!("finally"),
                For => js_word!("for"),

                Function => js_word!("function"),

                If => js_word!("if"),

                Return => js_word!("return"),

                Switch => js_word!("switch"),

                Throw => js_word!("throw"),

                Try => js_word!("try"),
                Var => js_word!("var"),
                Let => js_word!("let"),
                Const => js_word!("const"),
                While => js_word!("while"),
                With => js_word!("with"),

                New => js_word!("new"),
                This => js_word!("this"),
                Super => js_word!("super"),

                Class => js_word!("class"),

                Extends => js_word!("extends"),

                Export => js_word!("export"),
                Import => js_word!("import"),

                Yield => js_word!("yield"),

                In => js_word!("in"),
                InstanceOf => js_word!("instanceof"),

                TypeOf => js_word!("typeof"),

                Void => js_word!("void"),

                Delete => js_word!("delete"),
            },

            Word::Null => js_word!("null"),
            Word::True => js_word!("true"),
            Word::False => js_word!("false"),

            Word::Ident(w) => w,
        }
    }
}

impl Debug for Word {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        match *self {
            Word::Ident(ref s) => Display::fmt(s, f),
            _ => {
                let s: JsWord = self.clone().into();
                Display::fmt(&s, f)
            }
        }
    }
}

/// Keywords
#[derive(Kind, Clone, Copy, PartialEq, Eq, Hash)]
#[cfg_attr(feature = "fold", derive(Fold))]
#[kind(function(before_expr = "bool", starts_expr = "bool"))]
pub enum Keyword {
    /// Spec says this might be identifier.
    #[kind(before_expr, starts_expr)]
    Await,

    Break,
    #[kind(before_expr)]
    Case,
    Catch,
    Continue,
    Debugger,
    #[kind(before_expr)]
    Default_,
    #[kind(before_expr)]
    Do,
    #[kind(before_expr)]
    Else,

    Finally,
    For,

    #[kind(starts_expr)]
    Function,

    If,

    #[kind(before_expr)]
    Return,

    Switch,

    #[kind(before_expr, starts_expr)]
    Throw,

    Try,
    Var,
    Let,
    Const,
    While,
    With,

    #[kind(before_expr, starts_expr)]
    New,
    #[kind(starts_expr)]
    This,
    #[kind(starts_expr)]
    Super,

    #[kind(starts_expr)]
    Class,

    #[kind(before_expr)]
    Extends,

    Export,
    #[kind(starts_expr)]
    Import,

    /// Spec says this might be identifier.
    #[kind(before_expr, starts_expr)]
    Yield,

    #[kind(before_expr)]
    In,
    #[kind(before_expr)]
    InstanceOf,

    #[kind(before_expr, starts_expr)]
    TypeOf,

    #[kind(before_expr, starts_expr)]
    Void,

    #[kind(before_expr, starts_expr)]
    Delete,
}

impl Keyword {
    fn into_js_word(self) -> JsWord {
        match self {
            Await => js_word!("await"),
            Break => js_word!("break"),
            Case => js_word!("case"),
            Catch => js_word!("catch"),
            Continue => js_word!("continue"),
            Debugger => js_word!("debugger"),
            Default_ => js_word!("default"),
            Do => js_word!("do"),
            Else => js_word!("else"),

            Finally => js_word!("finally"),
            For => js_word!("for"),

            Function => js_word!("function"),

            If => js_word!("if"),

            Return => js_word!("return"),

            Switch => js_word!("switch"),

            Throw => js_word!("throw"),

            Try => js_word!("try"),
            Var => js_word!("var"),
            Let => js_word!("let"),
            Const => js_word!("const"),
            While => js_word!("while"),
            With => js_word!("with"),

            New => js_word!("new"),
            This => js_word!("this"),
            Super => js_word!("super"),

            Class => js_word!("class"),

            Extends => js_word!("extends"),

            Export => js_word!("export"),
            Import => js_word!("import"),

            Yield => js_word!("yield"),

            In => js_word!("in"),
            InstanceOf => js_word!("instanceof"),

            TypeOf => js_word!("typeof"),

            Void => js_word!("void"),

            Delete => js_word!("delete"),
        }
    }
}

impl Debug for Keyword {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        write!(f, "keyword '{}'", self.into_js_word())?;

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

impl Token {
    /// Returns true if `self` can follow keyword let.
    ///
    /// e.g. `let a = xx;`, `let {a:{}} = 1`
    pub(crate) fn follows_keyword_let(&self, _strict: bool) -> bool {
        match *self {
            // This is required to recognize `let let` in strict mode.
            tok!("let") => true,

            tok!('{') | tok!('[') | Word(Word::Ident(..)) | tok!("yield") | tok!("await") => true,

            _ => false,
        }
    }
}

impl Word {
    pub(crate) fn cow(&self) -> Cow<JsWord> {
        match *self {
            Word::Keyword(k) => Cow::Owned(k.into_js_word()),
            Word::Ident(ref w) => Cow::Borrowed(&w),
            Word::False => Cow::Owned(js_word!("false")),
            Word::True => Cow::Owned(js_word!("true")),
            Word::Null => Cow::Owned(js_word!("null")),
        }
    }
}
