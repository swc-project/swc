use swc_atoms::{atom, Atom};
use swc_ecma_ast::AssignOp;
use swc_ecma_lexer::{
    token::{BinOpToken, IdentKind, Keyword, KnownIdent, TokenKind, WordKind},
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
    pub(crate) fn kind(&self, value: Option<&TokenValue>) -> TokenKind {
        // TODO: dont use `token_kind` anymore

        const fn known_ident(ident: KnownIdent) -> TokenKind {
            TokenKind::Word(WordKind::Ident(IdentKind::Known(ident)))
        }

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
            Self::Template => TokenKind::Template,
            Self::Colon => TokenKind::Colon,
            Self::EqEq => TokenKind::BinOp(BinOpToken::EqEq),
            Self::NotEq => TokenKind::BinOp(BinOpToken::NotEq),
            Self::EqEqEq => TokenKind::BinOp(BinOpToken::EqEqEq),
            Self::NotEqEq => TokenKind::BinOp(BinOpToken::NotEqEq),
            Self::Lt => TokenKind::BinOp(BinOpToken::Lt),
            Self::LtEq => TokenKind::BinOp(BinOpToken::LtEq),
            Self::Gt => TokenKind::BinOp(BinOpToken::Gt),
            Self::GtEq => TokenKind::BinOp(BinOpToken::GtEq),
            Self::LShift => TokenKind::BinOp(BinOpToken::LShift),
            Self::RShift => TokenKind::BinOp(BinOpToken::RShift),
            Self::ZeroFillRShift => TokenKind::BinOp(BinOpToken::ZeroFillRShift),
            Self::Plus => TokenKind::BinOp(BinOpToken::Add),
            Self::Minus => TokenKind::BinOp(BinOpToken::Sub),
            Self::Asterisk => TokenKind::BinOp(BinOpToken::Mul),
            Self::Slash => TokenKind::BinOp(BinOpToken::Div),
            Self::Percent => TokenKind::BinOp(BinOpToken::Mod),
            Self::Pipe => TokenKind::BinOp(BinOpToken::BitOr),
            Self::Caret => TokenKind::BinOp(BinOpToken::BitXor),
            Self::Ampersand => TokenKind::BinOp(BinOpToken::BitAnd),
            Self::Exp => TokenKind::BinOp(BinOpToken::Exp),
            Self::LogicalOr => TokenKind::BinOp(BinOpToken::LogicalOr),
            Self::LogicalAnd => TokenKind::BinOp(BinOpToken::LogicalAnd),
            Self::NullishCoalescing => TokenKind::BinOp(BinOpToken::NullishCoalescing),
            Self::Eq => TokenKind::AssignOp(AssignOp::Assign),
            Self::PlusEq => TokenKind::AssignOp(AssignOp::AddAssign),
            Self::MinusEq => TokenKind::AssignOp(AssignOp::SubAssign),
            Self::MulEq => TokenKind::AssignOp(AssignOp::MulAssign),
            Self::DivEq => TokenKind::AssignOp(AssignOp::DivAssign),
            Self::ModEq => TokenKind::AssignOp(AssignOp::ModAssign),
            Self::LShiftEq => TokenKind::AssignOp(AssignOp::LShiftAssign),
            Self::RShiftEq => TokenKind::AssignOp(AssignOp::RShiftAssign),
            Self::ZeroFillRShiftEq => TokenKind::AssignOp(AssignOp::ZeroFillRShiftAssign),
            Self::BitOrEq => TokenKind::AssignOp(AssignOp::BitOrAssign),
            Self::BitXorEq => TokenKind::AssignOp(AssignOp::BitXorAssign),
            Self::BitAndEq => TokenKind::AssignOp(AssignOp::BitAndAssign),
            Self::ExpEq => TokenKind::AssignOp(AssignOp::ExpAssign),
            Self::LogicalAndEq => TokenKind::AssignOp(AssignOp::AndAssign),
            Self::LogicalOrEq => TokenKind::AssignOp(AssignOp::OrAssign),
            Self::NullishEq => TokenKind::AssignOp(AssignOp::NullishAssign),
            Self::DollarLBrace => TokenKind::DollarLBrace,
            Self::QuestionMark => TokenKind::QuestionMark,
            Self::PlusPlus => TokenKind::PlusPlus,
            Self::MinusMinus => TokenKind::MinusMinus,
            Self::Tilde => TokenKind::Tilde,
            Self::Str => TokenKind::Str,
            Self::Regex => TokenKind::Regex,
            Self::Num => TokenKind::Num,
            Self::BigInt => TokenKind::BigInt,
            Self::JSXName => TokenKind::JSXName,
            Self::JSXText => TokenKind::JSXText,
            Self::JSXTagStart => TokenKind::JSXTagStart,
            Self::JSXTagEnd => TokenKind::JSXTagEnd,
            Self::Shebang => TokenKind::Shebang,
            Self::Error => TokenKind::Error,
            Self::Null => TokenKind::Word(WordKind::Null),
            Self::True => TokenKind::Word(WordKind::True),
            Self::False => TokenKind::Word(WordKind::False),
            Self::Await => TokenKind::Word(WordKind::Keyword(Keyword::Await)),
            Self::Break => TokenKind::Word(WordKind::Keyword(Keyword::Break)),
            Self::Case => TokenKind::Word(WordKind::Keyword(Keyword::Case)),
            Self::Catch => TokenKind::Word(WordKind::Keyword(Keyword::Catch)),
            Self::Class => TokenKind::Word(WordKind::Keyword(Keyword::Class)),
            Self::Const => TokenKind::Word(WordKind::Keyword(Keyword::Const)),
            Self::Continue => TokenKind::Word(WordKind::Keyword(Keyword::Continue)),
            Self::Debugger => TokenKind::Word(WordKind::Keyword(Keyword::Debugger)),
            Self::Default => TokenKind::Word(WordKind::Keyword(Keyword::Default_)),
            Self::Delete => TokenKind::Word(WordKind::Keyword(Keyword::Delete)),
            Self::Do => TokenKind::Word(WordKind::Keyword(Keyword::Do)),
            Self::Else => TokenKind::Word(WordKind::Keyword(Keyword::Else)),
            Self::Export => TokenKind::Word(WordKind::Keyword(Keyword::Export)),
            Self::Extends => TokenKind::Word(WordKind::Keyword(Keyword::Extends)),
            Self::Finally => TokenKind::Word(WordKind::Keyword(Keyword::Finally)),
            Self::For => TokenKind::Word(WordKind::Keyword(Keyword::For)),
            Self::Function => TokenKind::Word(WordKind::Keyword(Keyword::Function)),
            Self::If => TokenKind::Word(WordKind::Keyword(Keyword::If)),
            Self::Import => TokenKind::Word(WordKind::Keyword(Keyword::Import)),
            Self::In => TokenKind::Word(WordKind::Keyword(Keyword::In)),
            Self::InstanceOf => TokenKind::Word(WordKind::Keyword(Keyword::InstanceOf)),
            Self::Let => TokenKind::Word(WordKind::Keyword(Keyword::Let)),
            Self::New => TokenKind::Word(WordKind::Keyword(Keyword::New)),
            Self::Return => TokenKind::Word(WordKind::Keyword(Keyword::Return)),
            Self::Super => TokenKind::Word(WordKind::Keyword(Keyword::Super)),
            Self::Switch => TokenKind::Word(WordKind::Keyword(Keyword::Switch)),
            Self::This => TokenKind::Word(WordKind::Keyword(Keyword::This)),
            Self::Throw => TokenKind::Word(WordKind::Keyword(Keyword::Throw)),
            Self::Try => TokenKind::Word(WordKind::Keyword(Keyword::Try)),
            Self::TypeOf => TokenKind::Word(WordKind::Keyword(Keyword::TypeOf)),
            Self::Var => TokenKind::Word(WordKind::Keyword(Keyword::Var)),
            Self::Void => TokenKind::Word(WordKind::Keyword(Keyword::Void)),
            Self::While => TokenKind::Word(WordKind::Keyword(Keyword::While)),
            Self::With => TokenKind::Word(WordKind::Keyword(Keyword::With)),
            Self::Yield => TokenKind::Word(WordKind::Keyword(Keyword::Yield)),
            Self::Ident | Self::Module | Self::Constructor => {
                // `Self::Module | Self::Constructor` is actually a keyword/reserver word, but
                // we treat it as an identifier, because `TokenKind` is expected
                // to be removed.
                debug_assert!(matches!(value, Some(TokenValue::Word(_))));
                let kind = swc_ecma_lexer::token::IdentKind::Other;
                TokenKind::Word(WordKind::Ident(kind))
            }
            Self::Abstract => known_ident(KnownIdent::Abstract),
            Self::Any => known_ident(KnownIdent::Any),
            Self::As => known_ident(KnownIdent::As),
            Self::Asserts => known_ident(KnownIdent::Asserts),
            Self::Assert => known_ident(KnownIdent::Assert),
            Self::Async => known_ident(KnownIdent::Async),
            Self::Bigint => known_ident(KnownIdent::Bigint),
            Self::Boolean => known_ident(KnownIdent::Boolean),
            Self::Declare => known_ident(KnownIdent::Declare),
            Self::Enum => known_ident(KnownIdent::Enum),
            Self::From => known_ident(KnownIdent::From),
            Self::Get => known_ident(KnownIdent::Get),
            Self::Global => known_ident(KnownIdent::Global),
            Self::Implements => known_ident(KnownIdent::Implements),
            Self::Interface => known_ident(KnownIdent::Interface),
            Self::Intrinsic => known_ident(KnownIdent::Intrinsic),
            Self::Is => known_ident(KnownIdent::Is),
            Self::Keyof => known_ident(KnownIdent::Keyof),
            Self::Namespace => known_ident(KnownIdent::Namespace),
            Self::Never => known_ident(KnownIdent::Never),
            Self::Number => known_ident(KnownIdent::Number),
            Self::Object => known_ident(KnownIdent::Object),
            Self::Of => known_ident(KnownIdent::Of),
            Self::Package => known_ident(KnownIdent::Package),
            Self::Private => known_ident(KnownIdent::Private),
            Self::Protected => known_ident(KnownIdent::Protected),
            Self::Public => known_ident(KnownIdent::Public),
            Self::Readonly => known_ident(KnownIdent::Readonly),
            Self::Require => known_ident(KnownIdent::Require),
            Self::Set => known_ident(KnownIdent::Set),
            Self::Static => known_ident(KnownIdent::Static),
            Self::String => known_ident(KnownIdent::String),
            Self::Symbol => known_ident(KnownIdent::Symbol),
            Self::Type => known_ident(KnownIdent::Type),
            Self::Undefined => known_ident(KnownIdent::Undefined),
            Self::Unique => known_ident(KnownIdent::Unique),
            Self::Unknown => known_ident(KnownIdent::Unknown),
            Self::Using => known_ident(KnownIdent::Using),
            Self::Accessor => known_ident(KnownIdent::Accessor),
            Self::Infer => known_ident(KnownIdent::Infer),
            Self::Meta => known_ident(KnownIdent::Meta),
            Self::Target => known_ident(KnownIdent::Target),
            Self::Satisfies => known_ident(KnownIdent::Satisfies),
            Self::OptionalChain => unreachable!(),
        }
    }

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

    pub(crate) fn is_assign_op(self) -> bool {
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
}

#[derive(Debug, Clone, Copy)]
pub struct TokenAndSpan {
    pub token: Token,
    /// Had a line break before this token?
    pub had_line_break: bool,
    pub span: swc_common::Span,
}
