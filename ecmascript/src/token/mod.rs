//! Ported from [babel/bablyon][]
//!
//! [babel/bablyon]:https://github.com/babel/babel/blob/2d378d076eb0c5fe63234a8b509886005c01d7ee/packages/babylon/src/tokenizer/types.js

pub use self::AssignOpToken::*;
pub use self::BinOpToken::*;
pub use self::Keyword::*;
pub use self::Number::*;
pub use self::Token::*;
pub use self::Word::*;
use std::fmt::{self, Debug, Display, Formatter};
use swc_atoms::JsWord;
use swc_common::Span;
use swc_common::fold::FoldWith;
use swc_macros::{Deserialize, Serialize};
use swc_macros::ast_node;

#[derive(Kind, Debug, Clone, PartialEq)]
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
    /// ':'
    #[kind(before_expr)]
    Colon,
    /// '::'
    #[kind(before_expr)]
    ColonColon,
    ///
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
    /// bool field is true if it's enclosed by '"' ( double quote).
    #[kind(starts_expr)]
    Str(String, bool),

    /// Regexp literal.
    #[kind(starts_expr)]
    Regex(String, JsWord),

    /// TODO: Make Num as enum and separate decimal, binary, ..etc
    #[kind(starts_expr)]
    Num(Number),

    #[kind(before_expr)]
    BlockComment(String),

    #[kind(before_expr)]
    LineComment(String),
}

#[ast_node]
pub enum Number {
    Float(f64),
    Decimal(i64),
    ImplicitOctal(i64),
}
impl Display for Number {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        match *self {
            Float(ref fl) => Display::fmt(fl, f),
            Decimal(ref dec) => Display::fmt(dec, f),
            ImplicitOctal(ref v) => Display::fmt(v, f),
        }
    }
}

#[derive(Debug, Clone, Copy, Eq, EqIgnoreSpan, PartialEq, Hash, Serialize, Deserialize)]
#[repr(u8)]
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
}

#[derive(Debug, Clone, Copy, Eq, EqIgnoreSpan, PartialEq, Hash, Serialize, Deserialize)]
#[repr(u8)]
pub enum AssignOpToken {
    /// `=`
    Assign,
    /// `+=`
    AddAssign,
    /// `-=`
    SubAssign,
    /// `*=`
    MulAssign,
    /// `/=`
    DivAssign,
    /// `%=`
    ModAssign,
    /// `<<=`
    LShiftAssign,
    /// `>>=`
    RShiftAssign,
    /// `>>>=`
    ZeroFillRShiftAssign,
    /// `|=`
    BitOrAssign,
    /// `^=`
    BitXorAssign,
    /// `&=`
    BitAndAssign,

    /// `**=`
    ExpAssign,
}

impl<F> FoldWith<F> for AssignOpToken {
    fn fold_children(self, _: &mut F) -> Self {
        self
    }
}

#[derive(Debug, Clone, PartialEq)]
pub struct TokenAndSpan {
    pub token: Token,
    pub span: Span,
}

#[derive(Kind, Clone, PartialEq, Eq, Hash)]
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

    Ident(JsWord),
}

impl From<JsWord> for Word {
    fn from(i: JsWord) -> Self {
        match i {
            js_word!("null") => Null,
            js_word!("true") => True,
            js_word!("false") => False,
            js_word!("await") => Await.into(),
            js_word!("break") => Break.into(),
            js_word!("case") => Case.into(),
            js_word!("catch") => Catch.into(),
            js_word!("continue") => Continue.into(),
            js_word!("debugger") => Debugger.into(),
            js_word!("default") => Default_.into(),
            js_word!("do") => Do.into(),
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
            _ => Ident(i),
        }
    }
}
impl From<Keyword> for Word {
    fn from(kwd: Keyword) -> Self {
        Keyword(kwd)
    }
}

impl From<Word> for JsWord {
    fn from(w: Word) -> Self {
        match w {
            Keyword(k) => match k {
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

            Null => js_word!("null"),
            True => js_word!("true"),
            False => js_word!("false"),

            Ident(w) => w,
        }
    }
}
impl Debug for Word {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        match *self {
            Word::Ident(ref s) => Display::fmt(s, f),
            _ => {
                let s: JsWord = self.clone().into();
                Display::fmt(&s, f)
            }
        }
    }
}

impl Word {
    pub fn is_reserved_word(&self, strict: bool) -> bool {
        match *self {
            Keyword(Await) | Keyword(Yield) if !strict => false,
            Keyword(_) => true,

            Null | True | False => true,
            Ident(ref name) => {
                if name == "enum" {
                    return true;
                }
                if strict {
                    match &**name {
                        "implements" | "package" | "protected" | "interface" | "private"
                        | "public" => return true,
                        _ => {}
                    }
                }
                false
            }
        }
    }
}

/// Keywords
#[derive(Kind, Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[kind(function(before_expr = "bool", starts_expr = "bool"))]
#[repr(u8)]
pub enum Keyword {
    /// Spec says this might be identifier.
    #[kind(before_expr)]
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
