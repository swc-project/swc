use swc_atoms::{atom, Atom};
use swc_ecma_ast::AssignOp;
use swc_ecma_lexer::common::context::Context;

use super::LexResult;
use crate::input::Tokens;

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

impl swc_ecma_lexer::common::lexer::state::TokenKind for Token {
    #[inline(always)]
    fn is_dot(self) -> bool {
        self == Token::Dot
    }

    #[inline(always)]
    fn is_bin_op(self) -> bool {
        Token::is_bin_op(self)
    }

    #[inline(always)]
    fn is_semi(self) -> bool {
        self == Token::Semi
    }

    #[inline(always)]
    fn is_template(self) -> bool {
        self == Token::Template
    }

    #[inline(always)]
    fn is_keyword(self) -> bool {
        Token::is_keyword(self)
    }

    #[inline(always)]
    fn is_colon(self) -> bool {
        self == Token::Colon
    }

    #[inline(always)]
    fn is_lbrace(self) -> bool {
        self == Token::LBrace
    }

    #[inline(always)]
    fn is_rbrace(self) -> bool {
        self == Token::RBrace
    }

    #[inline(always)]
    fn is_lparen(self) -> bool {
        self == Token::LParen
    }

    #[inline(always)]
    fn is_rparen(self) -> bool {
        self == Token::RParen
    }

    #[inline(always)]
    fn is_keyword_fn(self) -> bool {
        self == Token::Function
    }

    #[inline(always)]
    fn is_keyword_return(self) -> bool {
        self == Token::Return
    }

    #[inline(always)]
    fn is_keyword_yield(self) -> bool {
        self == Token::Yield
    }

    #[inline(always)]
    fn is_keyword_else(self) -> bool {
        self == Token::Else
    }

    #[inline(always)]
    fn is_keyword_class(self) -> bool {
        self == Token::Class
    }

    #[inline(always)]
    fn is_keyword_let(self) -> bool {
        self == Token::Let
    }

    #[inline(always)]
    fn is_keyword_var(self) -> bool {
        self == Token::Var
    }

    #[inline(always)]
    fn is_keyword_const(self) -> bool {
        self == Token::Const
    }

    #[inline(always)]
    fn is_keyword_if(self) -> bool {
        self == Token::If
    }

    #[inline(always)]
    fn is_keyword_while(self) -> bool {
        self == Token::While
    }

    #[inline(always)]
    fn is_keyword_for(self) -> bool {
        self == Token::For
    }

    #[inline(always)]
    fn is_keyword_with(self) -> bool {
        self == Token::With
    }

    #[inline(always)]
    fn is_lt(self) -> bool {
        self == Token::Lt
    }

    #[inline(always)]
    fn is_gt(self) -> bool {
        self == Token::Gt
    }

    #[inline(always)]
    fn is_arrow(self) -> bool {
        self == Token::Arrow
    }

    #[inline(always)]
    fn is_ident(self) -> bool {
        self == Token::Ident || self.is_known_ident()
    }

    #[inline(always)]
    fn is_known_ident_of(self) -> bool {
        self == Token::Of
    }

    #[inline(always)]
    fn is_slash(self) -> bool {
        self == Token::Slash
    }

    #[inline(always)]
    fn is_dollar_lbrace(self) -> bool {
        self == Token::DollarLBrace
    }

    #[inline(always)]
    fn is_plus_plus(self) -> bool {
        self == Token::PlusPlus
    }

    #[inline(always)]
    fn is_minus_minus(self) -> bool {
        self == Token::MinusMinus
    }

    #[inline(always)]
    fn is_back_quote(self) -> bool {
        self == Token::BackQuote
    }

    #[inline(always)]
    fn is_jsx_tag_start(self) -> bool {
        self == Token::JSXTagStart
    }

    #[inline(always)]
    fn is_jsx_tag_end(self) -> bool {
        self == Token::JSXTagEnd
    }

    #[inline(always)]
    fn before_expr(self) -> bool {
        self.before_expr()
    }
}

impl swc_ecma_lexer::common::lexer::state::TokenType for Token {
    fn is_other_and_before_expr_is_false(self) -> bool {
        !self.is_keyword()
            && !self.is_bin_op()
            && !self.before_expr()
            && !matches!(
                self,
                Token::Template
                    | Token::Dot
                    | Token::Colon
                    | Token::LBrace
                    | Token::RParen
                    | Token::Semi
                    | Token::JSXName
                    | Token::JSXText
                    | Token::JSXTagStart
                    | Token::JSXTagEnd
                    | Token::Arrow
            )
    }

    fn is_other_and_can_have_trailing_comment(self) -> bool {
        matches!(
            self,
            Token::Num
                | Token::Str
                | Token::Ident
                | Token::DollarLBrace
                | Token::Regex
                | Token::BigInt
                | Token::JSXText
                | Token::RBrace
        ) || self.is_known_ident()
    }
}

impl<'a> swc_ecma_lexer::common::lexer::token::TokenFactory<'a, TokenAndSpan, crate::Lexer<'a>>
    for Token
{
    #[inline(always)]
    fn create_jsx_name(name: &str, lexer: &mut crate::Lexer) -> Self {
        let name = lexer.atoms.atom(name);
        lexer.set_token_value(Some(TokenValue::Word(name)));
        Token::JSXName
    }
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

    pub(crate) fn to_string(self, value: Option<&TokenValue>) -> String {
        match self {
            Token::LParen => "(",
            Token::RParen => ")",
            Token::LBrace => "{",
            Token::RBrace => "}",
            Token::LBracket => "[",
            Token::RBracket => "]",
            Token::Semi => ";",
            Token::Comma => ",",
            Token::Dot => ".",
            Token::Colon => ":",
            Token::QuestionMark => "?",
            Token::Bang => "!",
            Token::Tilde => "~",
            Token::Plus => "+",
            Token::Minus => "-",
            Token::Asterisk => "*",
            Token::Slash => "/",
            Token::Percent => "%",
            Token::Lt => "<",
            Token::Gt => ">",
            Token::Pipe => "|",
            Token::Caret => "^",
            Token::Ampersand => "&",
            Token::Eq => "=",
            Token::At => "@",
            Token::Hash => "#",
            Token::BackQuote => "`",
            Token::Arrow => "=>",
            Token::DotDotDot => "...",
            Token::PlusPlus => "++",
            Token::MinusMinus => "--",
            Token::PlusEq => "+",
            Token::MinusEq => "-",
            Token::MulEq => "*",
            Token::DivEq => "/=",
            Token::ModEq => "%=",
            Token::LShiftEq => "<<=",
            Token::RShiftEq => ">>=",
            Token::ZeroFillRShiftEq => ">>>=",
            Token::BitOrEq => "|=",
            Token::BitXorEq => "^=",
            Token::BitAndEq => "&=",
            Token::ExpEq => "**=",
            Token::LogicalOrEq => "||=",
            Token::LogicalAndEq => "&&=",
            Token::NullishEq => "??=",
            Token::OptionalChain => "?.",
            Token::EqEq => "==",
            Token::NotEq => "!=",
            Token::EqEqEq => "===",
            Token::NotEqEq => "!==",
            Token::LtEq => "<=",
            Token::GtEq => ">=",
            Token::LShift => "<<",
            Token::RShift => ">>",
            Token::ZeroFillRShift => ">>>",
            Token::Exp => "**",
            Token::LogicalOr => "||",
            Token::LogicalAnd => "&&",
            Token::NullishCoalescing => "??",
            Token::DollarLBrace => "${",
            Token::JSXTagStart => "jsx tag start",
            Token::JSXTagEnd => "jsx tag end",
            Token::JSXText => {
                let Some(TokenValue::Str { raw, .. }) = value else {
                    unreachable!("{:#?}", value)
                };
                return format!("jsx text ({raw})");
            }
            Token::Str => {
                let Some(TokenValue::Str { value, raw, .. }) = value else {
                    unreachable!("{:#?}", value)
                };
                return format!("string literal ({value}, {raw})");
            }
            Token::Num => {
                let Some(TokenValue::Num { value, raw, .. }) = value else {
                    unreachable!("{:#?}", value)
                };
                return format!("numeric literal ({value}, {raw})");
            }
            Token::BigInt => {
                let Some(TokenValue::BigInt { value, raw, .. }) = value else {
                    unreachable!("{:#?}", value)
                };
                return format!("bigint literal ({value}, {raw})");
            }
            Token::Regex => {
                let Some(TokenValue::Regex { value, flags, .. }) = value else {
                    unreachable!("{:#?}", value)
                };
                return format!("regexp literal ({value}, {flags})");
            }
            Token::Template => {
                let Some(TokenValue::Template { raw, .. }) = value else {
                    unreachable!("{:#?}", value)
                };
                return format!("template token ({raw})");
            }
            Token::JSXName => {
                let Some(TokenValue::Word(w)) = value else {
                    unreachable!("{:#?}", value)
                };
                return format!("jsx name ({w})");
            }
            Token::Error => {
                let Some(TokenValue::Error(e)) = value else {
                    unreachable!("{:#?}", value)
                };
                return format!("<lexing error: {e:?}>");
            }
            Token::Ident => {
                let Some(TokenValue::Word(w)) = value else {
                    unreachable!("{:#?}", value)
                };
                w.as_ref()
            }
            Token::Await => "await",
            Token::Break => "break",
            Token::Case => "case",
            Token::Catch => "catch",
            Token::Class => "class",
            Token::Const => "const",
            Token::Continue => "continue",
            Token::Debugger => "debugger",
            Token::Default => "default",
            Token::Delete => "delete",
            Token::Do => "do",
            Token::Else => "else",
            Token::Export => "export",
            Token::Extends => "extends",
            Token::False => "false",
            Token::Finally => "finally",
            Token::For => "for",
            Token::Function => "function",
            Token::If => "if",
            Token::Import => "import",
            Token::In => "in",
            Token::InstanceOf => "instanceOf",
            Token::Let => "let",
            Token::New => "new",
            Token::Null => "null",
            Token::Return => "return",
            Token::Super => "super",
            Token::Switch => "switch",
            Token::This => "this",
            Token::Throw => "throw",
            Token::True => "true",
            Token::Try => "try",
            Token::TypeOf => "typeOf",
            Token::Var => "var",
            Token::Void => "void",
            Token::While => "while",
            Token::With => "with",
            Token::Yield => "yield",
            Token::Module => "module",
            Token::Abstract => "abstract",
            Token::Any => "any",
            Token::As => "as",
            Token::Asserts => "asserts",
            Token::Assert => "assert",
            Token::Async => "async",
            Token::Bigint => "bigint",
            Token::Boolean => "boolean",
            Token::Constructor => "constructor",
            Token::Declare => "declare",
            Token::Enum => "enum",
            Token::From => "from",
            Token::Get => "get",
            Token::Global => "global",
            Token::Implements => "implements",
            Token::Interface => "interface",
            Token::Intrinsic => "intrinsic",
            Token::Is => "is",
            Token::Keyof => "keyof",
            Token::Namespace => "namespace",
            Token::Never => "never",
            Token::Number => "number",
            Token::Object => "object",
            Token::Of => "of",
            Token::Package => "package",
            Token::Private => "private",
            Token::Protected => "protected",
            Token::Public => "public",
            Token::Readonly => "readonly",
            Token::Require => "require",
            Token::Set => "set",
            Token::Static => "static",
            Token::String => "string",
            Token::Symbol => "symbol",
            Token::Type => "type",
            Token::Undefined => "undefined",
            Token::Unique => "unique",
            Token::Unknown => "unknown",
            Token::Using => "using",
            Token::Accessor => "accessor",
            Token::Infer => "infer",
            Token::Satisfies => "satisfies",
            Token::Meta => "meta",
            Token::Target => "target",
            Token::Shebang => "#!",
        }
        .to_string()
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
                | Self::Null
                | Self::True
                | Self::False
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

#[derive(Clone, Copy)]
pub struct TokenAndSpan {
    pub token: Token,
    /// Had a line break before this token?
    pub had_line_break: bool,
    pub span: swc_common::Span,
}
