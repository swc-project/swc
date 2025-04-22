use swc_atoms::{atom, Atom};
use swc_ecma_ast::AssignOp;
use swc_ecma_lexer::{
    token::{BinOpToken, Keyword},
    Context,
};

use super::LexResult;

#[derive(Debug, Clone)]
pub enum TokenValue {
    /// unknown ident, jsx name and shebang
    Word(Atom),
    Template {
        raw: Atom,
        cooked: LexResult<Atom>,
    },
    // string, jsx text
    Str {
        value: Atom,
        raw: Atom,
    },
    // regexp
    Regex {
        value: Atom,
        flags: Atom,
    },
    Num {
        value: f64,
        raw: Atom,
    },
    BigInt {
        value: Box<num_bigint::BigInt>,
        raw: Atom,
    },
    Error(swc_ecma_lexer::error::Error),
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
#[repr(u8)]
pub enum Token {
    // Single character tokens (first 33 types)
    /// `(`
    LParen,
    /// `)`
    RParen,
    /// `{`
    LBrace,
    /// `}`
    RBrace,
    /// `[`
    LBracket,
    /// `]`
    RBracket,
    /// `;`
    Semi,
    /// `,`
    Comma,
    /// `.`
    Dot,
    /// `:`
    Colon,
    /// `?`
    QuestionMark,
    /// `!`
    Bang,
    /// `~`
    Tilde,
    /// `+`
    Plus,
    /// `-`
    Minus,
    /// `*`
    Asterisk,
    /// `/`
    Slash,
    /// `%`
    Percent,
    /// `<`
    Lt,
    /// `>`
    Gt,
    /// `|`
    Pipe,
    /// `^`
    Caret,
    /// `&`
    Ampersand,
    /// `=`
    Eq,
    /// `@`
    At,
    /// `#`
    Hash,
    /// '`'
    BackQuote,
    /// `=>`
    Arrow,
    /// `...`
    DotDotDot,

    // Compound operators
    /// `++`
    PlusPlus,
    /// `--`
    MinusMinus,
    /// `+=`
    PlusEq,
    /// `-=`
    MinusEq,

    // More compound operators and keywords (starting from 33)
    /// `*=`
    MulEq,
    /// `/=`
    DivEq,
    /// `%=`
    ModEq,
    /// `<<=`
    LShiftEq,
    /// `>>=`
    RShiftEq,
    /// `>>>=`
    ZeroFillRShiftEq,
    /// `|=`
    BitOrEq,
    /// `^=`
    BitXorEq,
    /// `&=`
    BitAndEq,
    /// `**=`
    ExpEq,
    /// `||=`
    LogicalOrEq,
    /// `&&=`
    LogicalAndEq,
    /// `??=`
    NullishEq,
    /// `?.`
    OptionalChain,

    /// `==`
    EqEq,
    /// `!=`
    NotEq,
    /// `===`
    EqEqEq,
    /// `!==`
    NotEqEq,

    /// `<=`
    LtEq,
    /// `>=`
    GtEq,
    /// `<<`
    LShift,
    /// `>>`
    RShift,
    /// `>>>`
    ZeroFillRShift,

    /// `**`
    Exp,
    /// `||`
    LogicalOr,
    /// `&&`
    LogicalAnd,
    /// `??`
    NullishCoalescing,

    /// `${`
    DollarLBrace,

    // JSX-related tokens
    JSXTagStart,
    JSXTagEnd,

    // Literals
    Str,
    Num,
    BigInt,
    Regex,
    Template,
    JSXName,
    JSXText,
    // Identifiers and keyword
    Ident,
    // Reserved keyword tokens (starting from 100)
    Await,
    Break,
    Case,
    Catch,
    Class,
    Const,
    Continue,
    Debugger,
    Default,
    Delete,
    Do,
    Else,
    Export,
    Extends,
    False,
    Finally,
    For,
    Function,
    If,
    Import,
    In,
    InstanceOf,
    Let,
    New,
    Null,
    Return,
    Super,
    Switch,
    This,
    Throw,
    True,
    Try,
    TypeOf,
    Var,
    Void,
    While,
    With,
    Yield,
    Module,

    // TypeScript-related keywords (starting from 150)
    Abstract,
    Any,
    As,
    Asserts,
    Assert,
    Async,
    Bigint,
    Boolean,
    Constructor,
    Declare,
    Enum,
    From,
    Get,
    Global,
    Implements,
    Interface,
    Intrinsic,
    Is,
    Keyof,
    Namespace,
    Never,
    Number,
    Object,
    Of,
    Package,
    Private,
    Protected,
    Public,
    Readonly,
    Require,
    Set,
    Static,
    String,
    Symbol,
    Type,
    Undefined,
    Unique,
    Unknown,
    Using,
    Accessor,
    Infer,
    Satisfies,
    Meta,
    Target,

    // Special tokens
    Shebang,
    Error,
}

impl Token {
    pub(crate) fn is_reserved(&self, ctx: Context) -> bool {
        match self {
            Token::Let => ctx.contains(Context::Strict),
            Token::Await => {
                ctx.contains(Context::InAsync)
                    || ctx.contains(Context::InStaticBlock)
                    || ctx.contains(Context::Strict)
            }
            Token::Yield => ctx.contains(Context::InGenerator) || ctx.contains(Context::Strict),

            Token::Null
            | Token::True
            | Token::False
            | Token::Break
            | Token::Case
            | Token::Catch
            | Token::Continue
            | Token::Debugger
            | Token::Default
            | Token::Do
            | Token::Export
            | Token::Else
            | Token::Finally
            | Token::For
            | Token::Function
            | Token::If
            | Token::Return
            | Token::Switch
            | Token::Throw
            | Token::Try
            | Token::Var
            | Token::Const
            | Token::While
            | Token::With
            | Token::New
            | Token::This
            | Token::Super
            | Token::Class
            | Token::Extends
            | Token::Import
            | Token::In
            | Token::InstanceOf
            | Token::TypeOf
            | Token::Void
            | Token::Delete => true,

            // Future reserved word
            Token::Enum => true,

            Token::Implements
            | Token::Package
            | Token::Protected
            | Token::Interface
            | Token::Private
            | Token::Public
                if ctx.contains(Context::Strict) =>
            {
                true
            }

            _ => false,
        }
    }

    pub(crate) fn into_atom(&self, value: Option<&TokenValue>) -> Atom {
        self.as_word_atom(value).unwrap()
    }

    pub(crate) fn as_keyword_atom(&self) -> Option<Atom> {
        let atom = match self {
            Token::Await => atom!("await"),
            Token::Break => atom!("break"),
            Token::Case => atom!("case"),
            Token::Catch => atom!("catch"),
            Token::Class => atom!("class"),
            Token::Const => atom!("const"),
            Token::Continue => atom!("continue"),
            Token::Debugger => atom!("debugger"),
            Token::Default => atom!("default"),
            Token::Delete => atom!("delete"),
            Token::Do => atom!("do"),
            Token::Else => atom!("else"),
            Token::Export => atom!("export"),
            Token::Extends => atom!("extends"),
            Token::Finally => atom!("finally"),
            Token::For => atom!("for"),
            Token::Function => atom!("function"),
            Token::If => atom!("if"),
            Token::Import => atom!("import"),
            Token::In => atom!("in"),
            Token::InstanceOf => atom!("instanceof"),
            Token::Let => atom!("let"),
            Token::New => atom!("new"),
            Token::Return => atom!("return"),
            Token::Super => atom!("super"),
            Token::Switch => atom!("switch"),
            Token::This => atom!("this"),
            Token::Throw => atom!("throw"),
            Token::Try => atom!("try"),
            Token::TypeOf => atom!("typeof"),
            Token::Var => atom!("var"),
            Token::Void => atom!("void"),
            Token::While => atom!("while"),
            Token::With => atom!("with"),
            Token::Yield => atom!("yield"),
            Token::Module => atom!("module"),
            _ => return None,
        };
        Some(atom)
    }

    pub(crate) const fn is_keyword(self) -> bool {
        let t = self as u8;
        t >= Token::Await as u8 && t <= Token::Module as u8
    }

    pub(crate) fn as_known_ident_atom(&self) -> Option<Atom> {
        let atom = match self {
            Token::Abstract => atom!("abstract"),
            Token::Any => atom!("any"),
            Token::As => atom!("as"),
            Token::Asserts => atom!("asserts"),
            Token::Assert => atom!("assert"),
            Token::Async => atom!("async"),
            Token::Bigint => atom!("bigint"),
            Token::Boolean => atom!("boolean"),
            Token::Constructor => atom!("constructor"),
            Token::Declare => atom!("declare"),
            Token::Enum => atom!("enum"),
            Token::From => atom!("from"),
            Token::Get => atom!("get"),
            Token::Global => atom!("global"),
            Token::Implements => atom!("implements"),
            Token::Interface => atom!("interface"),
            Token::Intrinsic => atom!("intrinsic"),
            Token::Is => atom!("is"),
            Token::Keyof => atom!("keyof"),
            Token::Namespace => atom!("namespace"),
            Token::Never => atom!("never"),
            Token::Number => atom!("number"),
            Token::Object => atom!("object"),
            Token::Of => atom!("of"),
            Token::Package => atom!("package"),
            Token::Private => atom!("private"),
            Token::Protected => atom!("protected"),
            Token::Public => atom!("public"),
            Token::Readonly => atom!("readonly"),
            Token::Require => atom!("require"),
            Token::Set => atom!("set"),
            Token::Static => atom!("static"),
            Token::String => atom!("string"),
            Token::Symbol => atom!("symbol"),
            Token::Type => atom!("type"),
            Token::Undefined => atom!("undefined"),
            Token::Unique => atom!("unique"),
            Token::Unknown => atom!("unknown"),
            Token::Using => atom!("using"),
            Token::Accessor => atom!("accessor"),
            Token::Infer => atom!("infer"),
            Token::Satisfies => atom!("satisfies"),
            Token::Meta => atom!("meta"),
            Token::Target => atom!("target"),
            _ => return None,
        };
        Some(atom)
    }

    #[inline(always)]
    pub(crate) const fn is_known_ident(self) -> bool {
        let t = self as u8;
        t >= Token::Abstract as u8 && t <= Token::Target as u8
    }

    pub(crate) const fn is_word(&self) -> bool {
        matches!(
            self,
            Token::Null | Token::True | Token::False | Token::Ident
        ) || self.is_keyword()
            || self.is_known_ident()
    }

    pub(crate) fn as_word_atom(&self, value: Option<&TokenValue>) -> Option<Atom> {
        match self {
            Token::Null => Some(atom!("null")),
            Token::True => Some(atom!("true")),
            Token::False => Some(atom!("false")),
            Token::Ident => {
                let Some(TokenValue::Word(w)) = value else {
                    unreachable!("{:#?}", value)
                };
                Some(w.clone())
            }
            _ => self
                .as_known_ident_atom()
                .or_else(|| self.as_keyword_atom()),
        }
    }

    #[inline(always)]
    pub(crate) const fn is_bin_op(self) -> bool {
        let t = self as u8;
        (t >= Token::EqEq as u8 && t <= Token::NullishCoalescing as u8)
            || (t >= Token::Plus as u8 && t <= Token::Ampersand as u8)
    }

    pub(crate) fn as_bin_op(&self) -> Option<swc_ecma_ast::BinaryOp> {
        match self {
            Token::EqEq => Some(swc_ecma_ast::BinaryOp::EqEq),
            Token::NotEq => Some(swc_ecma_ast::BinaryOp::NotEq),
            Token::EqEqEq => Some(swc_ecma_ast::BinaryOp::EqEqEq),
            Token::NotEqEq => Some(swc_ecma_ast::BinaryOp::NotEqEq),
            Token::Lt => Some(swc_ecma_ast::BinaryOp::Lt),
            Token::LtEq => Some(swc_ecma_ast::BinaryOp::LtEq),
            Token::Gt => Some(swc_ecma_ast::BinaryOp::Gt),
            Token::GtEq => Some(swc_ecma_ast::BinaryOp::GtEq),
            Token::LShift => Some(swc_ecma_ast::BinaryOp::LShift),
            Token::RShift => Some(swc_ecma_ast::BinaryOp::RShift),
            Token::ZeroFillRShift => Some(swc_ecma_ast::BinaryOp::ZeroFillRShift),
            Token::Plus => Some(swc_ecma_ast::BinaryOp::Add),
            Token::Minus => Some(swc_ecma_ast::BinaryOp::Sub),
            Token::Asterisk => Some(swc_ecma_ast::BinaryOp::Mul),
            Token::Slash => Some(swc_ecma_ast::BinaryOp::Div),
            Token::Percent => Some(swc_ecma_ast::BinaryOp::Mod),
            Token::Pipe => Some(swc_ecma_ast::BinaryOp::BitOr),
            Token::Caret => Some(swc_ecma_ast::BinaryOp::BitXor),
            Token::Ampersand => Some(swc_ecma_ast::BinaryOp::BitAnd),
            Token::LogicalOr => Some(swc_ecma_ast::BinaryOp::LogicalOr),
            Token::LogicalAnd => Some(swc_ecma_ast::BinaryOp::LogicalAnd),
            // Token::In => Some(swc_ecma_ast::BinaryOp::In),
            // Token::InstanceOf => Some(swc_ecma_ast::BinaryOp::InstanceOf),
            Token::Exp => Some(swc_ecma_ast::BinaryOp::Exp),
            Token::NullishCoalescing => Some(swc_ecma_ast::BinaryOp::NullishCoalescing),
            _ => None,
        }
    }

    #[inline(always)]
    pub(crate) const fn is_assign_op(self) -> bool {
        let t = self as u8;
        matches!(self, Token::Eq) || (t >= Token::PlusEq as u8 && t <= Token::NullishEq as u8)
    }

    pub(crate) fn as_assign_op(self) -> Option<swc_ecma_ast::AssignOp> {
        match self {
            Self::Eq => Some(AssignOp::Assign),
            Self::PlusEq => Some(AssignOp::AddAssign),
            Self::MinusEq => Some(AssignOp::SubAssign),
            Self::MulEq => Some(AssignOp::MulAssign),
            Self::DivEq => Some(AssignOp::DivAssign),
            Self::ModEq => Some(AssignOp::ModAssign),
            Self::LShiftEq => Some(AssignOp::LShiftAssign),
            Self::RShiftEq => Some(AssignOp::RShiftAssign),
            Self::ZeroFillRShiftEq => Some(AssignOp::ZeroFillRShiftAssign),
            Self::BitOrEq => Some(AssignOp::BitOrAssign),
            Self::BitXorEq => Some(AssignOp::BitXorAssign),
            Self::BitAndEq => Some(AssignOp::BitAndAssign),
            Self::ExpEq => Some(AssignOp::ExpAssign),
            Self::LogicalAndEq => Some(AssignOp::AndAssign),
            Self::LogicalOrEq => Some(AssignOp::OrAssign),
            Self::NullishEq => Some(AssignOp::NullishAssign),
            _ => None,
        }
    }

    #[inline(always)]
    pub(crate) const fn before_expr(self) -> bool {
        match self {
            Self::Await
            | Self::Case
            | Self::Default
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
            | Self::Arrow
            | Self::DotDotDot
            | Self::Bang
            | Self::LParen
            | Self::LBrace
            | Self::LBracket
            | Self::Semi
            | Self::Comma
            | Self::Colon
            | Self::DollarLBrace
            | Self::QuestionMark
            | Self::PlusPlus
            | Self::MinusMinus
            | Self::Tilde
            | Self::JSXText => true,
            _ => self.is_bin_op() || self.is_assign_op(),
        }
    }

    #[inline(always)]
    pub(crate) const fn starts_expr(self) -> bool {
        matches!(
            self,
            Self::Ident
                | Self::JSXName
                | Self::Plus
                | Self::Minus
                | Self::Bang
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
                | Self::JSXTagStart
                | Self::Await
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
        ) || self.is_known_ident()
    }

    pub(crate) fn follows_keyword_let(self) -> bool {
        match self {
            Token::Let
            | Token::LBrace
            | Token::LBracket
            | Token::Ident
            | Token::Yield
            | Token::Await => true,
            _ if self.is_known_ident() => true,
            _ => false,
        }
    }

    pub(crate) fn into_token_type(self) -> swc_ecma_lexer::TokenType {
        use swc_ecma_lexer::TokenType;
        match self {
            Self::Template => TokenType::Template,
            Self::Dot => TokenType::Dot,
            Self::Colon => TokenType::Colon,
            Self::LBrace => TokenType::LBrace,
            Self::RParen => TokenType::RParen,
            Self::Semi => TokenType::Semi,
            Self::JSXTagEnd => TokenType::JSXTagEnd,
            Self::JSXTagStart => TokenType::JSXTagStart,
            Self::JSXText => TokenType::JSXText,
            Self::JSXName => TokenType::JSXName,
            Self::Arrow => TokenType::Arrow,
            Self::EqEq => TokenType::BinOp(BinOpToken::EqEq),
            Self::NotEq => TokenType::BinOp(BinOpToken::NotEq),
            Self::EqEqEq => TokenType::BinOp(BinOpToken::EqEqEq),
            Self::NotEqEq => TokenType::BinOp(BinOpToken::NotEqEq),
            Self::Lt => TokenType::BinOp(BinOpToken::Lt),
            Self::LtEq => TokenType::BinOp(BinOpToken::LtEq),
            Self::Gt => TokenType::BinOp(BinOpToken::Gt),
            Self::GtEq => TokenType::BinOp(BinOpToken::GtEq),
            Self::LShift => TokenType::BinOp(BinOpToken::LShift),
            Self::RShift => TokenType::BinOp(BinOpToken::RShift),
            Self::ZeroFillRShift => TokenType::BinOp(BinOpToken::ZeroFillRShift),
            Self::Plus => TokenType::BinOp(BinOpToken::Add),
            Self::Minus => TokenType::BinOp(BinOpToken::Sub),
            Self::Asterisk => TokenType::BinOp(BinOpToken::Mul),
            Self::Slash => TokenType::BinOp(BinOpToken::Div),
            Self::Percent => TokenType::BinOp(BinOpToken::Mod),
            Self::Pipe => TokenType::BinOp(BinOpToken::BitOr),
            Self::Caret => TokenType::BinOp(BinOpToken::BitXor),
            Self::Ampersand => TokenType::BinOp(BinOpToken::BitAnd),
            Self::Exp => TokenType::BinOp(BinOpToken::Exp),
            Self::LogicalOr => TokenType::BinOp(BinOpToken::LogicalOr),
            Self::LogicalAnd => TokenType::BinOp(BinOpToken::LogicalAnd),
            Self::Await => TokenType::Keyword(Keyword::Await),
            Self::Break => TokenType::Keyword(Keyword::Break),
            Self::Case => TokenType::Keyword(Keyword::Case),
            Self::Catch => TokenType::Keyword(Keyword::Catch),
            Self::Class => TokenType::Keyword(Keyword::Class),
            Self::Const => TokenType::Keyword(Keyword::Const),
            Self::Continue => TokenType::Keyword(Keyword::Continue),
            Self::Debugger => TokenType::Keyword(Keyword::Debugger),
            Self::Default => TokenType::Keyword(Keyword::Default_),
            Self::Delete => TokenType::Keyword(Keyword::Delete),
            Self::Do => TokenType::Keyword(Keyword::Do),
            Self::Else => TokenType::Keyword(Keyword::Else),
            Self::Export => TokenType::Keyword(Keyword::Export),
            Self::Extends => TokenType::Keyword(Keyword::Extends),
            Self::Finally => TokenType::Keyword(Keyword::Finally),
            Self::For => TokenType::Keyword(Keyword::For),
            Self::Function => TokenType::Keyword(Keyword::Function),
            Self::If => TokenType::Keyword(Keyword::If),
            Self::Import => TokenType::Keyword(Keyword::Import),
            Self::In => TokenType::Keyword(Keyword::In),
            Self::InstanceOf => TokenType::Keyword(Keyword::InstanceOf),
            Self::Let => TokenType::Keyword(Keyword::Let),
            Self::New => TokenType::Keyword(Keyword::New),
            Self::Return => TokenType::Keyword(Keyword::Return),
            Self::Super => TokenType::Keyword(Keyword::Super),
            Self::Switch => TokenType::Keyword(Keyword::Switch),
            Self::This => TokenType::Keyword(Keyword::This),
            Self::Throw => TokenType::Keyword(Keyword::Throw),
            Self::Try => TokenType::Keyword(Keyword::Try),
            Self::TypeOf => TokenType::Keyword(Keyword::TypeOf),
            Self::Var => TokenType::Keyword(Keyword::Var),
            Self::Void => TokenType::Keyword(Keyword::Void),
            Self::While => TokenType::Keyword(Keyword::While),
            Self::With => TokenType::Keyword(Keyword::With),
            Self::Yield => TokenType::Keyword(Keyword::Yield),
            _ => TokenType::Other {
                before_expr: self.before_expr(),
                can_have_trailing_comment: matches!(
                    self,
                    Self::Num
                        | Self::Str
                        | Self::Ident
                        | Self::DollarLBrace
                        | Self::Regex
                        | Self::BigInt
                        | Self::JSXText
                        | Self::RBrace
                ) || self.is_known_ident(),
            },
        }
    }
}

#[derive(Debug, Clone, Copy)]
pub struct TokenAndSpan {
    pub token: Token,
    /// Had a line break before this token?
    pub had_line_break: bool,
    pub span: swc_common::Span,
}
