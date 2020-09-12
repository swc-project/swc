//! **Not for direct usage**. This is an interal utility crate to reduce compile
//! time.

use logos::{Lexer, Logos};
use swc_common::{BytePos, Span};

#[derive(Debug, Default, Clone, Copy)]
pub struct Extras {
    pub had_line_break: bool,
}

/// Interal tokens for super-fast lexing.
#[derive(Logos, Debug, Clone, Copy, PartialEq, Eq)]
#[logos(extras = Extras)]
#[logos(subpattern unicode4 = r"\\\\u[0-9a-fA-F][0-9a-fA-F][0-9a-fA-F][0-9a-fA-F]")]
#[logos(subpattern unicode = r"\\\\u[{][0-9a-fA-F]+[}]")]
#[logos(subpattern decimal = r"[0-9][_0-9]*")]
#[logos(subpattern hex = r"[0-9a-fA-F][_0-9a-fA-F]*")]
#[logos(subpattern octal = r"[0-7][_0-7]*")]
#[logos(subpattern binary = r"[0-1][_0-1]*")]
#[logos(subpattern exp = r"[eE][+-]?[0-9][_0-9]*")]
pub enum InternalToken {
    #[error]
    Error,

    #[regex("[\n\r\u{2028}\u{2029}]+")]
    NewLine,

    /// Whitespace except newlines
    #[regex("[\u{0009}\u{000b}\u{000c}\u{0020}\u{00a0}\u{feff}]+")]
    Whitespace,

    #[token("null")]
    Null,
    #[token("true")]
    True,
    #[token("false")]
    False,

    #[regex(r#"[a-zA-Z$_\p{XID_Start}][a-zA-Z0-9$_\p{XID_Continue}&unicode&unicode4]*"#)]
    #[regex(r#"&unicode[a-zA-Z0-9$_\p{XID_Continue}&unicode&unicode4]*"#)]
    #[regex(r#"&unicode4[a-zA-Z0-9$_\p{XID_Continue}&unicode&unicode4]*"#)]
    Ident,

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
    Default,
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

    #[token("=>")]
    Arrow,

    #[token("#")]
    Hash,

    #[token("@")]
    At,
    #[token(".", priority = 100)]
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

    /// ';'
    #[token(";")]
    Semi,
    /// ','
    #[token(",")]
    Comma,

    #[token("`")]
    BackQuote,

    /// ':'
    #[token(":")]
    Colon,
    ///
    /// `==`
    #[token("==")]
    EqEq,
    /// `!=`
    #[token("!=")]
    NotEq,
    /// `===`
    #[token("===")]
    EqEqEq,
    /// `!==`
    #[token("!==")]
    NotEqEq,
    /// `<`
    #[token("<")]
    Lt,
    /// `<=`
    #[token("<=")]
    LtEq,
    /// `>`
    #[token(">")]
    Gt,
    /// `>=`
    #[token(">=")]
    GtEq,
    /// `<<`
    #[token("<<")]
    LShift,
    /// `>>`
    #[token(">>")]
    RShift,
    /// `>>>`
    #[token(">>>")]
    ZeroFillRShift,

    /// `+`
    #[token("+")]
    Add,
    /// `-`
    #[token("-")]
    Sub,
    /// `*`
    #[token("*")]
    Mul,
    /// `/`
    #[token("/")]
    Div,
    /// `%`
    #[token("%")]
    Mod,

    /// `|`
    #[token("|")]
    BitOr,
    /// `^`
    #[token("^")]
    BitXor,
    /// `&`
    #[token("&")]
    BitAnd,

    // /// `in`
    // #[kind(precedence = "7")]
    // In,
    // /// `instanceof`
    // #[kind(precedence = "7")]
    // InstanceOf,
    /// `**`
    #[token("**")]
    Exp,

    /// `||`
    #[token("||")]
    LogicalOr,
    /// `&&`
    #[token("&&")]
    LogicalAnd,

    /// `??`
    #[token("??")]
    NullishCoalescing,

    ///
    /// `=`
    #[token("=")]
    Assign,
    /// `+=`
    #[token("+=")]
    AddAssign,
    /// `-=`
    #[token("-=")]
    SubAssign,
    /// `*=`
    #[token("*=")]
    MulAssign,
    /// `%=`
    #[token("%=")]
    ModAssign,
    /// `<<=`
    #[token("<<=")]
    LShiftAssign,
    /// `>>=`
    #[token(">>=")]
    RShiftAssign,
    /// `>>>=`
    #[token(">>>=")]
    ZeroFillRShiftAssign,
    /// `|=`
    #[token("|=")]
    BitOrAssign,
    /// `^=`
    #[token("^=")]
    BitXorAssign,
    /// `&=`
    #[token("&=")]
    BitAndAssign,

    /// `**=`
    #[token("**=")]
    ExpAssign,

    /// `&&=`
    #[token("&&=")]
    AndAssign,

    /// `||=`
    #[token("||=")]
    OrAssign,

    /// `??=`
    #[token("??=")]
    NullishAssign,

    /// '?'
    #[token("?")]
    QuestionMark,

    /// `++`
    #[token("++")]
    PlusPlus,
    /// `--`
    #[token("--")]
    MinusMinus,

    /// `~`
    #[token("~")]
    Tilde,

    /// String literal.
    #[regex(r#""(?:[^"]|\\\\|\\")*""#)]
    #[regex(r#"'(?:[^']|\\\\|\\')*'"#)]
    Str,

    #[regex("[0-9]*([eE][+-]?[0-9_]+)?|[0f9]+[eE][+-]?[0-9_]+")]
    #[regex("[0-9]*\\.[0-9_]*([eE][+-]?[0-9_]+)?|[0f9]+[eE][+-]?[0-9_]+")]
    FloatNum,

    #[regex("0[bB](?&binary)")]
    BinNum,

    #[regex("(?&decimal)")]
    DecNum,

    #[regex("0[xX](?&hex)")]
    HexNum,

    #[regex("0[oO](?&octal)")]
    OctalNum,

    #[regex("[0-9][0-9_]+n")]
    BigInt,

    #[token("#![.]*[\n\r\u{8232}\u{8233}]")]
    Interpreter,

    #[token("\\")]
    BackSlash,

    #[regex(r"//[^\n]*")]
    LineComment,

    #[regex(r"/\*(?:[^*]|\*[^/])*\*/")]
    BlockComment,

    #[token("${")]
    DollarLBrace,

    #[regex("<!--[^\n]*")]
    XmlComment,

    #[regex("-->[^\n]*")]
    XmlCommentEnd,
}

/// Supper-fast but dumb lexer, as it does not know how to handle slash. It just
/// returns `Div`.
#[derive(Clone)]
pub struct DumbLexer<'a> {
    start: BytePos,
    cur: Option<(InternalToken, logos::Span, &'a str)>,
    inner: Lexer<'a, InternalToken>,
    prev_hi: BytePos,
}

impl<'a> DumbLexer<'a> {
    #[inline]
    pub fn advance(&mut self) {
        let _ = self.cur();

        self.cur.take();

        self.prev_hi = self.prev_hi + BytePos(self.inner.slice().len() as _);
    }

    #[inline]
    pub fn new(start: BytePos, s: &'a str) -> Self {
        DumbLexer {
            start,
            cur: None,
            inner: InternalToken::lexer(s),
            prev_hi: start,
        }
    }

    #[inline]
    pub fn cur_pos(&mut self) -> BytePos {
        let _ = self.cur();

        let span = self.span();

        span.lo
    }

    #[inline]
    pub fn span(&mut self) -> Span {
        let _ = self.cur();

        let s = match self.cur.as_ref() {
            Some(v) => v.1.clone(),
            _ => return Span::new(self.prev_hi, self.prev_hi, Default::default()),
        };

        Span::new(
            BytePos(s.start as _),
            BytePos(s.end as _),
            Default::default(),
        )
    }

    pub const fn prev_hi(&self) -> BytePos {
        self.prev_hi
    }

    #[inline]
    pub fn cur(&mut self) -> Option<InternalToken> {
        match self.cur {
            Some(_) => {}
            None => {
                self.prev_hi = self.start + BytePos(self.inner.span().end as u32);
                let token = self.inner.next()?;
                self.cur = Some((token, self.inner.span(), self.inner.slice()));
            }
        }

        self.cur.as_ref().map(|v| v.0)
    }

    #[inline]
    pub fn peek(&mut self) -> Option<InternalToken> {
        let _cur = self.cur()?;

        self.inner.clone().next()
    }

    #[inline]
    pub fn peek_ahead(&mut self) -> Option<InternalToken> {
        let _cur = self.cur()?;

        self.inner.clone().skip(1).next()
    }

    pub fn slice(&mut self) -> &'a str {
        let _cur = self.cur();

        match self.cur {
            Some(ref v) => v.2,
            None => "",
        }
    }

    #[inline]
    pub fn is_at_start(&self) -> bool {
        self.inner.span().start == 0
    }

    #[inline]
    pub fn reset_to(&mut self, pos: BytePos) {
        self.cur = None;
        let new_idx = pos.0 - self.start.0;
        let source = self.inner.source();

        self.inner = InternalToken::lexer(source);
        self.inner.bump(new_idx as _);
    }

    pub fn bump_bytes(&mut self, n: usize) {
        assert_eq!(self.cur, None);

        self.inner.bump(n);
    }

    pub fn remainder(&self) -> &str {
        assert_eq!(self.cur, None);

        self.inner.remainder()
    }
}
