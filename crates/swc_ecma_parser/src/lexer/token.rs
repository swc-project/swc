use num_bigint::BigInt;
use swc_atoms::{atom, Atom};
use swc_common::Span;
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

#[derive(Clone, Copy, PartialEq, Eq)]
#[repr(u8)]
pub enum Token {
    // Single character tokens
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

    // More compound operators and keywords
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

    /// `</`
    LessSlash,
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
    NoSubstitutionTemplateLiteral,
    TemplateHead,
    TemplateMiddle,
    TemplateTail,
    JSXName,
    JSXText,
    // Identifiers and keyword
    Ident,
    // Reserved keyword tokens
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

    // TypeScript-related keywords
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
    Override,
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

impl<'a, I: Tokens> swc_ecma_lexer::common::lexer::token::TokenFactory<'a, TokenAndSpan, I>
    for Token
{
    type Buffer = crate::input::Buffer<I>;
    type Lexer = crate::Lexer<'a>;

    const ABSTRACT: Self = Token::Abstract;
    const ACCESSOR: Self = Token::Accessor;
    const ANY: Self = Token::Any;
    const ARROW: Self = Token::Arrow;
    const AS: Self = Token::As;
    const ASSERT: Self = Token::Assert;
    const ASSERTS: Self = Token::Asserts;
    const ASYNC: Self = Token::Async;
    const AT: Self = Token::At;
    const AWAIT: Self = Token::Await;
    const BACKQUOTE: Self = Token::BackQuote;
    const BANG: Self = Self::Bang;
    const BIGINT: Self = Token::Bigint;
    const BIT_AND: Self = Self::Ampersand;
    const BIT_AND_EQ: Self = Self::BitAndEq;
    const BIT_OR: Self = Self::Pipe;
    const BIT_OR_EQ: Self = Self::BitOrEq;
    const BOOLEAN: Self = Token::Boolean;
    const BREAK: Self = Token::Break;
    const CASE: Self = Token::Case;
    const CATCH: Self = Token::Catch;
    const CLASS: Self = Self::Class;
    const COLON: Self = Self::Colon;
    const COMMA: Self = Token::Comma;
    const CONST: Self = Self::Const;
    const CONTINUE: Self = Token::Continue;
    const DEBUGGER: Self = Token::Debugger;
    const DECLARE: Self = Token::Declare;
    const DEFAULT: Self = Token::Default;
    const DELETE: Self = Self::Delete;
    const DIV: Self = Token::Slash;
    const DIV_EQ: Self = Token::DivEq;
    const DO: Self = Token::Do;
    const DOLLAR_LBRACE: Self = Token::DollarLBrace;
    const DOT: Self = Self::Dot;
    const DOTDOTDOT: Self = Self::DotDotDot;
    const ELSE: Self = Self::Else;
    const ENUM: Self = Token::Enum;
    const EQUAL: Self = Token::Eq;
    const EXP: Self = Token::Exp;
    const EXPORT: Self = Token::Export;
    const EXP_EQ: Self = Token::ExpEq;
    const EXTENDS: Self = Token::Extends;
    const FALSE: Self = Token::False;
    const FINALLY: Self = Token::Finally;
    const FOR: Self = Token::For;
    const FROM: Self = Token::From;
    const FUNCTION: Self = Self::Function;
    const GET: Self = Token::Get;
    const GLOBAL: Self = Token::Global;
    const GREATER: Self = Token::Gt;
    const GREATER_EQ: Self = Token::GtEq;
    const HASH: Self = Self::Hash;
    const IF: Self = Self::If;
    const IMPLEMENTS: Self = Token::Implements;
    const IMPORT: Self = Self::Import;
    const IN: Self = Self::In;
    const INFER: Self = Token::Infer;
    const INSTANCEOF: Self = Token::InstanceOf;
    const INTERFACE: Self = Token::Interface;
    const INTRINSIC: Self = Token::Intrinsic;
    const IS: Self = Token::Is;
    const JSX_TAG_END: Self = Token::JSXTagEnd;
    const JSX_TAG_START: Self = Token::JSXTagStart;
    const KEYOF: Self = Token::Keyof;
    const LBRACE: Self = Self::LBrace;
    const LBRACKET: Self = Self::LBracket;
    const LESS: Self = Token::Lt;
    const LESS_EQ: Self = Token::LtEq;
    const LET: Self = Token::Let;
    const LOGICAL_AND: Self = Token::LogicalAnd;
    const LOGICAL_AND_EQ: Self = Self::LogicalAndEq;
    const LOGICAL_OR: Self = Token::LogicalOr;
    const LOGICAL_OR_EQ: Self = Self::LogicalOrEq;
    const LPAREN: Self = Self::LParen;
    const LSHIFT: Self = Token::LShift;
    const LSHIFT_EQ: Self = Token::LShiftEq;
    const MINUS: Self = Self::Minus;
    const MINUS_MINUS: Self = Self::MinusMinus;
    const MOD: Self = Token::Percent;
    const MOD_EQ: Self = Token::ModEq;
    const MUL: Self = Token::Asterisk;
    const MUL_EQ: Self = Token::MulEq;
    const NAMESPACE: Self = Token::Namespace;
    const NEVER: Self = Token::Never;
    const NEW: Self = Self::New;
    const NULL: Self = Token::Null;
    const NULLISH_ASSIGN: Self = Token::NullishEq;
    const NULLISH_COALESCING: Self = Token::NullishCoalescing;
    const NUMBER: Self = Token::Number;
    const OBJECT: Self = Token::Object;
    const OF: Self = Token::Of;
    const PACKAGE: Self = Token::Package;
    const PLUS: Self = Self::Plus;
    const PLUS_PLUS: Self = Self::PlusPlus;
    const PRIVATE: Self = Token::Private;
    const PROTECTED: Self = Token::Protected;
    const PUBLIC: Self = Token::Public;
    const QUESTION: Self = Token::QuestionMark;
    const RBRACE: Self = Self::RBrace;
    const RBRACKET: Self = Self::RBracket;
    const READONLY: Self = Token::Readonly;
    const REQUIRE: Self = Token::Require;
    const RETURN: Self = Token::Return;
    const RPAREN: Self = Self::RParen;
    const RSHIFT: Self = Token::RShift;
    const RSHIFT_EQ: Self = Token::RShiftEq;
    const SATISFIES: Self = Token::Satisfies;
    const SEMI: Self = Token::Semi;
    const SET: Self = Token::Set;
    const STATIC: Self = Token::Static;
    const STRING: Self = Token::String;
    const SUPER: Self = Self::Super;
    const SWITCH: Self = Token::Switch;
    const SYMBOL: Self = Token::Symbol;
    const TARGET: Self = Token::Target;
    const THIS: Self = Token::This;
    const THROW: Self = Token::Throw;
    const TILDE: Self = Self::Tilde;
    const TRUE: Self = Token::True;
    const TRY: Self = Token::Try;
    const TYPE: Self = Token::Type;
    const TYPEOF: Self = Self::TypeOf;
    const UNDEFINED: Self = Token::Undefined;
    const UNIQUE: Self = Token::Unique;
    const UNKNOWN: Self = Token::Unknown;
    const USING: Self = Self::Using;
    const VAR: Self = Self::Var;
    const VOID: Self = Self::Void;
    const WHILE: Self = Token::While;
    const WITH: Self = Token::With;
    const YIELD: Self = Token::Yield;
    const ZERO_FILL_RSHIFT: Self = Token::ZeroFillRShift;
    const ZERO_FILL_RSHIFT_EQ: Self = Token::ZeroFillRShiftEq;

    #[inline(always)]
    fn jsx_name(name: &str, lexer: &mut crate::Lexer) -> Self {
        let name = lexer.atoms.atom(name);
        lexer.set_token_value(Some(TokenValue::Word(name)));
        Token::JSXName
    }

    #[inline(always)]
    fn is_jsx_name(&self) -> bool {
        Token::JSXName.eq(self)
    }

    #[inline(always)]
    fn take_jsx_name(self, buffer: &mut Self::Buffer) -> Atom {
        buffer.expect_word_token_value()
    }

    #[inline(always)]
    fn str(value: Atom, raw: Atom, lexer: &mut crate::Lexer<'a>) -> Self {
        lexer.set_token_value(Some(TokenValue::Str { value, raw }));
        Token::Str
    }

    #[inline(always)]
    fn template(cooked: LexResult<Atom>, raw: Atom, lexer: &mut crate::Lexer<'a>) -> Self {
        lexer.set_token_value(Some(TokenValue::Template { cooked, raw }));
        Token::Template
    }

    #[inline(always)]
    fn regexp(content: Atom, flags: Atom, lexer: &mut crate::Lexer<'a>) -> Self {
        lexer.set_token_value(Some(TokenValue::Regex {
            value: content,
            flags,
        }));
        Token::Regex
    }

    #[inline(always)]
    fn num(value: f64, raw: Atom, lexer: &mut crate::Lexer<'a>) -> Self {
        lexer.set_token_value(Some(TokenValue::Num { value, raw }));
        Self::Num
    }

    #[inline(always)]
    fn bigint(value: Box<num_bigint::BigInt>, raw: Atom, lexer: &mut crate::Lexer<'a>) -> Self {
        lexer.set_token_value(Some(TokenValue::BigInt { value, raw }));
        Self::BigInt
    }

    #[inline(always)]
    fn unknown_ident(value: Atom, lexer: &mut crate::Lexer<'a>) -> Self {
        lexer.set_token_value(Some(TokenValue::Word(value)));
        Token::Ident
    }

    #[inline(always)]
    fn is_reserved(&self, ctx: swc_ecma_lexer::common::context::Context) -> bool {
        self.is_reserved(ctx)
    }

    #[inline(always)]
    fn into_atom(self, lexer: &mut crate::Lexer<'a>) -> Option<Atom> {
        let value = lexer.get_token_value();
        self.as_word_atom(value)
    }

    #[inline(always)]
    fn is_error(&self) -> bool {
        Token::Error.eq(self)
    }

    #[inline(always)]
    fn take_error(self, buffer: &mut Self::Buffer) -> swc_ecma_lexer::error::Error {
        buffer.expect_error_token_value()
    }

    #[inline(always)]
    fn is_str(&self) -> bool {
        Self::Str.eq(self)
    }

    #[inline(always)]
    fn take_str(self, buffer: &mut Self::Buffer) -> (Atom, Atom) {
        buffer.expect_string_token_value()
    }

    #[inline(always)]
    fn is_num(&self) -> bool {
        Self::Num.eq(self)
    }

    #[inline(always)]
    fn take_num(self, buffer: &mut Self::Buffer) -> (f64, Atom) {
        buffer.expect_number_token_value()
    }

    #[inline(always)]
    fn is_bigint(&self) -> bool {
        Self::BigInt.eq(self)
    }

    #[inline(always)]
    fn take_bigint(self, buffer: &mut Self::Buffer) -> (Box<BigInt>, Atom) {
        buffer.expect_bigint_token_value()
    }

    #[inline(always)]
    fn is_word(&self) -> bool {
        (*self).is_word()
    }

    #[inline]
    fn take_word(self, buffer: &Self::Buffer) -> Option<Atom> {
        self.as_word_atom(buffer.get_token_value())
    }

    #[inline(always)]
    fn is_unknown_ident(&self) -> bool {
        Token::Ident.eq(self)
    }

    #[inline(always)]
    fn take_unknown_ident(self, buffer: &mut Self::Buffer) -> Atom {
        buffer.expect_word_token_value()
    }

    #[inline(always)]
    fn is_keyword(&self) -> bool {
        Token::is_keyword(*self)
    }

    #[inline(always)]
    fn is_known_ident(&self) -> bool {
        Token::is_known_ident(*self)
    }

    #[inline(always)]
    fn take_known_ident(&self) -> Atom {
        self.as_known_ident_atom().unwrap()
    }

    #[inline(always)]
    fn is_regexp(&self) -> bool {
        Token::Regex.eq(self)
    }

    #[inline(always)]
    fn take_unknown_ident_ref<'b>(&'b self, buffer: &'b mut Self::Buffer) -> &'b Atom {
        buffer.expect_word_token_value_ref()
    }

    #[inline(always)]
    fn is_template(&self) -> bool {
        Token::Template.eq(self)
    }

    #[inline(always)]
    fn take_template(self, buffer: &mut Self::Buffer) -> (LexResult<Atom>, Atom) {
        buffer.expect_template_token_value()
    }

    #[inline(always)]
    fn jsx_text(value: Atom, raw: Atom, lexer: &mut Self::Lexer) -> Self {
        lexer.set_token_value(Some(TokenValue::Str { value, raw }));
        Token::JSXText
    }

    #[inline(always)]
    fn is_jsx_text(&self) -> bool {
        Token::JSXText.eq(self)
    }

    #[inline(always)]
    fn take_jsx_text(self, buffer: &mut Self::Buffer) -> (Atom, Atom) {
        buffer.expect_string_token_value()
    }

    #[inline(always)]
    fn starts_expr(&self) -> bool {
        (*self).starts_expr()
    }

    #[inline(always)]
    fn to_string(&self, buffer: &Self::Buffer) -> String {
        (*self).to_string(buffer.get_token_value())
    }

    #[inline(always)]
    fn is_bin_op(&self) -> bool {
        (*self).is_bin_op()
    }

    #[inline(always)]
    fn as_assign_op(&self) -> Option<AssignOp> {
        (*self).as_assign_op()
    }

    #[inline(always)]
    fn as_bin_op(&self) -> Option<swc_ecma_ast::BinaryOp> {
        (*self).as_bin_op()
    }

    #[inline(always)]
    fn follows_keyword_let(&self) -> bool {
        (*self).follows_keyword_let()
    }

    #[inline(always)]
    fn is_assign_op(&self) -> bool {
        (*self).is_assign_op()
    }

    #[inline(always)]
    fn take_regexp(self, buffer: &mut Self::Buffer) -> (Atom, Atom) {
        buffer.expect_regex_token_value()
    }

    #[inline(always)]
    fn shebang(value: Atom, lexer: &mut Self::Lexer) -> Self {
        lexer.set_token_value(Some(TokenValue::Word(value)));
        Token::Shebang
    }

    #[inline(always)]
    fn is_shebang(&self) -> bool {
        Token::Shebang.eq(self)
    }

    #[inline(always)]
    fn take_shebang(self, buffer: &mut Self::Buffer) -> Atom {
        buffer.expect_word_token_value()
    }

    #[inline(always)]
    fn is_no_substitution_template_literal(&self) -> bool {
        Token::NoSubstitutionTemplateLiteral.eq(self)
    }

    #[inline(always)]
    fn is_template_head(&self) -> bool {
        Token::TemplateHead.eq(self)
    }
}

impl std::fmt::Debug for Token {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let s = match self {
            Token::Str => "<string literal>",
            Token::Num => "<number literal>",
            Token::BigInt => "<bigint literal>",
            Token::Regex => "<regexp literal>",
            Token::Template => "<template literal>",
            Token::JSXName => "<jsx name>",
            Token::JSXText => "<jsx text>",
            Token::Ident => "<identifier>",
            _ => &self.to_string(None),
        };
        f.write_str(s)
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

    #[cold]
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
            Token::NoSubstitutionTemplateLiteral
            | Token::TemplateHead
            | Token::TemplateMiddle
            | Token::TemplateTail => {
                let Some(TokenValue::Template { raw, .. }) = value else {
                    unreachable!("{:#?}", value)
                };
                raw
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
            Token::Override => "override",
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
            Token::LessSlash => "</",
        }
        .to_string()
    }

    pub(crate) fn as_keyword_atom(self) -> Option<Atom> {
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

    pub(crate) fn as_known_ident_atom(self) -> Option<Atom> {
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
            Token::Override => atom!("override"),
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

    pub(crate) const fn is_word(self) -> bool {
        matches!(
            self,
            Token::Null | Token::True | Token::False | Token::Ident
        ) || self.is_known_ident()
            || self.is_keyword()
    }

    pub(crate) fn as_word_atom(self, value: Option<&TokenValue>) -> Option<Atom> {
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

    pub(crate) fn as_bin_op(self) -> Option<swc_ecma_ast::BinaryOp> {
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
                | Self::TemplateHead
                | Self::NoSubstitutionTemplateLiteral
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
                | Self::BackQuote
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

    pub(crate) fn should_rescan_into_gt_in_jsx(self) -> bool {
        matches!(
            self,
            Token::GtEq
                | Token::RShift
                | Token::RShiftEq
                | Token::ZeroFillRShift
                | Token::ZeroFillRShiftEq
        )
    }
}

#[derive(Clone, Copy, Debug)]
pub struct TokenAndSpan {
    pub token: Token,
    /// Had a line break before this token?
    pub had_line_break: bool,
    pub span: Span,
}

impl swc_ecma_lexer::common::parser::token_and_span::TokenAndSpan for TokenAndSpan {
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

    #[inline]
    fn span(&self) -> Span {
        self.span
    }
}

#[derive(Clone)]
pub struct NextTokenAndSpan {
    pub token_and_span: TokenAndSpan,
    pub value: Option<TokenValue>,
}

impl swc_ecma_lexer::common::parser::buffer::NextTokenAndSpan for NextTokenAndSpan {
    type Token = Token;

    #[inline(always)]
    fn token(&self) -> &Self::Token {
        &self.token_and_span.token
    }

    #[inline(always)]
    fn span(&self) -> Span {
        self.token_and_span.span
    }

    #[inline(always)]
    fn had_line_break(&self) -> bool {
        self.token_and_span.had_line_break
    }
}
