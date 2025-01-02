//! This package is considered internal and should not be used by external
//! crates.
//!
//! It may updated without proper semver bump.

use std::fmt::Debug;

use logos::{Lexer, Logos, Skip};
use swc_common::{input::StringInput, BytePos};

use crate::peek::{peek_nth, PeekNth};

pub mod jsx;
mod peek;
mod size_hint;

#[derive(Clone)]
pub struct RawBuffer<'a> {
    lexer: PeekNth<logos::SpannedIter<'a, RawToken>>,
    pos: BytePos,
    orig_str: &'a str,
    start_pos: BytePos,
    end_pos: BytePos,
}

impl Debug for RawBuffer<'_> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "RawBuffer {{ pos: {:?} }}", self.pos)
    }
}

#[derive(Debug, Clone, Default)]
pub struct TokenState {
    pub had_line_break: bool,
}

impl<'a> RawBuffer<'a> {
    pub fn new(input: StringInput<'a>) -> Self {
        Self {
            lexer: peek_nth(logos::Lexer::new(input.as_str()).spanned()),
            pos: input.start_pos(),
            orig_str: input.as_str(),
            start_pos: input.start_pos(),
            end_pos: input.end_pos(),
        }
    }

    pub const fn start_pos(&self) -> BytePos {
        self.start_pos
    }

    pub const fn end_pos(&self) -> BytePos {
        self.end_pos
    }

    pub fn cur_pos(&self) -> BytePos {
        self.pos
    }

    pub fn cur(&mut self) -> Result<Option<RawToken>, UnknownChar> {
        self.lexer.peek().map(|(t, _)| *t).transpose()
    }

    pub fn peek(&mut self) -> Result<Option<RawToken>, UnknownChar> {
        self.lexer.peek_nth(1).map(|(t, _)| *t).transpose()
    }

    pub fn peek_ahead(&mut self) -> Result<Option<RawToken>, UnknownChar> {
        self.lexer.peek_nth(2).map(|(t, _)| *t).transpose()
    }

    pub fn cur_char(&mut self) -> Option<char> {
        self.reset_peeked();

        self.lexer.inner_mut().remainder().chars().next()
    }

    pub fn peek_char(&mut self) -> Option<char> {
        self.reset_peeked();

        self.lexer.inner_mut().remainder().chars().nth(1)
    }

    pub fn peek_ahead_char(&mut self) -> Option<char> {
        self.reset_peeked();

        self.lexer.inner_mut().remainder().chars().nth(2)
    }

    /// # Safety
    ///
    ///  - `start` and `end` must be within the bounds of `self.orig_str`
    pub unsafe fn slice(&self, start: BytePos, end: BytePos) -> &str {
        let lo = start.0 - self.start_pos.0;
        let hi = end.0 - self.start_pos.0;

        self.orig_str.get_unchecked(lo as usize..hi as usize)
    }

    pub fn cur_slice(&mut self) -> &str {
        let Some((_, span)) = self.lexer.peek() else {
            return "";
        };
        let span = span.clone();

        unsafe {
            // Safety: `span` is within the bounds of `self.lexer` because we get it from
            // `self.lexer.next()`
            self.lexer.inner_mut().source().get_unchecked(span)
        }
    }

    /// # Safety
    ///
    /// - `n` must be equal or smaller than  lefting length of `self.orig_str`
    pub unsafe fn bump(&mut self, n: usize) {
        self.reset_peeked();

        self.lexer.inner_mut().bump(n);
        self.pos = self.pos + BytePos(n as u32);
    }

    pub fn eat(&mut self, token: RawToken) -> bool {
        let Ok(Some(cur)) = self.cur() else {
            return false;
        };

        if cur == token {
            self.next();
            true
        } else {
            false
        }
    }

    pub fn is_ascii(&mut self, c: u8) -> bool {
        self.cur_char() == Some(c as char)
    }

    pub fn eat_ascii(&mut self, c: u8) -> bool {
        let cur = self.cur_char();

        if cur == Some(c as char) {
            unsafe {
                // Safety: We already checked for the current char
                self.bump(1);
            }
            true
        } else {
            false
        }
    }

    /// # Safety
    ///
    /// - `pos` must be within the bounds of `self.orig_str`
    pub unsafe fn reset_to(&mut self, pos: BytePos) {
        let lo = pos.0 - self.start_pos.0;
        let hi = self.end_pos.0 - self.start_pos.0;

        let source = self.orig_str.get_unchecked(lo as usize..hi as usize);

        self.lexer = peek_nth(logos::Lexer::new(source).spanned());
        self.pos = pos;
    }

    fn reset_peeked(&mut self) {
        unsafe {
            // Safety: We already checked for the current char
            self.reset_to(self.pos);
        }
    }
}

impl Iterator for RawBuffer<'_> {
    type Item = Result<RawToken, UnknownChar>;

    fn next(&mut self) -> Option<Self::Item> {
        let (previous_token, span) = self.lexer.next()?;
        self.pos = self.pos + BytePos(span.len() as u32);

        let item = match previous_token {
            Ok(item) => item,
            Err(e) => return Some(Err(e)),
        };

        Some(Ok(item))
    }
}

#[derive(Logos, Debug, Clone, Copy, PartialEq, Eq)]
#[logos(error = UnknownChar, extras = TokenState)]
pub enum RawToken {
    #[token("=>")]
    Arrow,

    #[token("#")]
    Hash,

    #[token("@")]
    At,

    #[token(".")]
    Dot,

    #[token("...")]
    DotDotDot,

    #[token("!")]
    Bang,

    #[token("(")]
    LParen,

    #[token(")")]
    RParen,

    #[token("[")]
    LBracket,

    #[token("]")]
    RBracket,

    #[token("{")]
    LBrace,

    #[token("}")]
    RBrace,

    #[token(";")]
    Semi,

    #[token(",")]
    Comma,

    #[token(":")]
    Colon,

    #[token("`")]
    BackQuote,

    #[token("${")]
    DollarLBrace,

    #[token("?")]
    QuestionMark,

    #[token("++")]
    PlusPlus,

    #[token("--")]
    MinusMinus,

    #[token("~")]
    Tilde,

    #[regex(r#""([^"\\]|\\["\\bnfrt]|u[a-fA-F0-9]{4}|[xX][a-fA-F0-9]+|[oO][0-7]+|[bB][01]+)*""#)]
    #[regex(r#"'([^'\\]|\\['\\bnfrt]|u[a-fA-F0-9]{4}|[xX][a-fA-F0-9]+|[oO][0-7]+|[bB][01]+)*'"#)]
    Str,

    #[regex(r"(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?")]
    #[regex(r"0[xX][a-fA-F0-9]+")]
    #[regex(r"0[oO][0-7]+")]
    #[regex(r"0[bB][01]+")]
    Num,

    #[regex(r#"0[0-7]+"#)]
    LegacyOctalNum,

    #[regex(r#"[0-9]+n"#)]
    BigInt,

    #[token("#![^ \n\r\t]*")]
    Shebang,

    #[token("null")]
    Null,

    #[token("true")]
    True,

    #[token("false")]
    False,

    #[token("==")]
    EqEqOp,

    #[token("!=")]
    NotEqOp,

    #[token("===")]
    EqEqEqOp,

    #[token("!==")]
    NotEqEqOp,

    #[token("<")]
    LtOp,

    #[token("<=")]
    LtEqOp,

    #[token(">")]
    GtOp,

    #[token(">=")]
    GtEqOp,

    #[token("<<")]
    LShiftOp,

    #[token(">>")]
    RShiftOp,

    #[token(">>>")]
    ZeroFillRShiftOp,

    #[token("+")]
    AddOp,

    #[token("-")]
    SubOp,

    #[token("*")]
    MulOp,

    #[token("/")]
    DivOp,

    #[token("%")]
    ModOp,

    #[token("|")]
    BitOrOp,

    #[token("^")]
    BitXorOp,

    #[token("&")]
    BitAndOp,

    #[token("**")]
    ExpOp,

    #[token("||")]
    LogicalOrOp,

    #[token("&&")]
    LogicalAndOp,

    #[token("??")]
    NullishCoalescingOp,

    #[token("=")]
    AssignOp,

    #[token("+=")]
    AddAssignOp,

    #[token("-=")]
    SubAssignOp,

    #[token("*=")]
    MulAssignOp,

    #[token("/=")]
    DivAssignOp,

    #[token("%=")]
    ModAssignOp,

    #[token("<<=")]
    LShiftAssignOp,

    #[token(">>=")]
    RShiftAssignOp,

    #[token(">>>=")]
    ZeroFillRShiftAssignOp,

    #[token("|=")]
    BitOrAssignOp,

    #[token("^=")]
    BitXorAssignOp,

    #[token("&=")]
    BitAndAssignOp,

    #[token("**=")]
    ExpAssignOp,

    #[token("&&=")]
    AndAssignOp,

    #[token("||=")]
    OrAssignOp,

    #[token("??=")]
    NullishAssignOp,

    #[regex(r"([\p{ID_Start}_$]|\\u[a-fA-F0-9]{4})([\p{ID_Continue}_$]|\\u[a-fA-F0-9]{4})*")]
    Ident,

    #[token("\r", priority = 5, callback = newline_callback)]
    #[token("\n", priority = 5, callback = newline_callback)]
    NewLine,

    #[regex(r"[ \t]+")]
    Whitespace,

    #[regex(r"//[^\n]*")]
    LineComment,

    #[regex(r"/\*(?:[^*]|\*[^/])*\*/")]
    BlockComment,

    #[token("<!--")]
    LegacyCommentOpen,

    #[token("-->")]
    LegacyCommentClose,

    #[token("<<<<<<<")]
    #[token(">>>>>>>")]
    #[token("=======")]
    #[token("|||||||")]
    ConflictMarker,

    #[token("await")]
    Await,

    #[token("break")]
    Break,

    #[token("case")]
    Case,

    #[token("catch")]
    Catch,

    #[token("continue")]
    Continue,

    #[token("debugger")]
    Debugger,

    #[token("default")]
    Default_,

    #[token("do")]
    Do,

    #[token("else")]
    Else,

    #[token("finally")]
    Finally,

    #[token("for")]
    For,

    #[token("function")]
    Function,

    #[token("if")]
    If,

    #[token("return")]
    Return,

    #[token("switch")]
    Switch,

    #[token("throw")]
    Throw,

    #[token("try")]
    Try,

    #[token("var")]
    Var,

    #[token("let")]
    Let,

    #[token("const")]
    Const,

    #[token("while")]
    While,

    #[token("with")]
    With,

    #[token("new")]
    New,

    #[token("this")]
    This,

    #[token("super")]
    Super,

    #[token("class")]
    Class,

    #[token("extends")]
    Extends,

    #[token("export")]
    Export,

    #[token("import")]
    Import,

    #[token("yield")]
    Yield,

    #[token("in")]
    In,

    #[token("instanceof")]
    InstanceOf,

    #[token("typeof")]
    TypeOf,

    #[token("void")]
    Void,

    #[token("delete")]
    Delete,

    #[token("abstract")]
    Abstract,

    #[token("as")]
    As,

    #[token("async")]
    Async,

    #[token("from")]
    From,

    #[token("of")]
    Of,

    #[token("type")]
    Type,

    #[token("global")]
    Global,

    #[token("static")]
    Static,

    #[token("using")]
    Using,

    #[token("readonly")]
    Readonly,

    #[token("unique")]
    Unique,

    #[token("keyof")]
    Keyof,

    #[token("declare")]
    Declare,

    #[token("enum")]
    Enum,

    #[token("is")]
    Is,

    #[token("infer")]
    Infer,

    Symbol,

    #[token("undefined")]
    Undefined,

    #[token("interface")]
    Interface,

    #[token("implements")]
    Implements,

    #[token("asserts")]
    Asserts,

    #[token("require")]
    Require,

    #[token("get")]
    Get,

    #[token("set")]
    Set,

    #[token("any")]
    Any,

    #[token("intrinsic")]
    Intrinsic,

    #[token("unknown")]
    Unknown,

    #[token("string")]
    String,

    #[token("object")]
    Object,

    #[token("number")]
    Number,

    #[token("bigint")]
    Bigint,

    #[token("boolean")]
    Boolean,

    #[token("never")]
    Never,

    #[token("assert")]
    Assert,

    #[token("namespace")]
    Namespace,

    #[token("accessor")]
    Accessor,

    #[token("meta")]
    Meta,

    #[token("target")]
    Target,

    #[token("satisfies")]
    Satisfies,

    #[token("package")]
    Package,

    #[token("protected")]
    Protected,

    #[token("private")]
    Private,

    #[token("public")]
    Public,
}

fn newline_callback(l: &mut Lexer<RawToken>) {
    l.extras.had_line_break = true;
}

impl RawToken {
    pub fn is_line_terminator(&self) -> bool {
        matches!(self, RawToken::NewLine)
    }
}

#[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]
pub struct UnknownChar;
