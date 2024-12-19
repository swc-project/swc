use logos::Logos;
use swc_common::{input::StringInput, BytePos};

#[derive(Debug, Clone)]
pub struct RawBuffer<'a> {
    lexer: logos::Lexer<'a, RawToken>,
    pos: BytePos,
    orig_str: &'a str,
    start_pos: BytePos,
}

impl<'a> RawBuffer<'a> {
    pub fn new(input: StringInput<'a>) -> Self {
        Self {
            lexer: logos::Lexer::new(input.as_str()),
            pos: input.start_pos(),
            orig_str: input.as_str(),
            start_pos: input.start_pos(),
        }
    }

    pub fn cur_pos(&self) -> BytePos {
        self.pos
    }

    pub fn cur(&self) -> Result<Option<RawToken>, LexError> {
        self.lexer.clone().next().transpose()
    }

    pub fn peek(&self) -> Result<Option<RawToken>, LexError> {
        self.lexer.clone().nth(1).transpose()
    }

    pub fn peek_ahead(&self) -> Result<Option<RawToken>, LexError> {
        self.lexer.clone().nth(2).transpose()
    }

    /// # Safety
    ///
    ///  - `start` and `end` must be within the bounds of `self.orig_str`
    pub unsafe fn slice(&self, start: BytePos, end: BytePos) -> &str {
        let lo = start.0 - self.start_pos.0;
        let hi = end.0 - self.start_pos.0;

        self.orig_str.get_unchecked(lo as usize..hi as usize)
    }

    /// # Safety
    ///
    /// - `n` must be equal or smaller than  lefting length of `self.orig_str`
    pub unsafe fn bump(&mut self, n: usize) {
        self.lexer.bump(n);
        self.pos = self.pos + BytePos(n as u32);
    }

    pub fn eat(&mut self, token: RawToken) -> Result<bool, LexError> {
        let cur = self.cur()?;

        if cur == Some(token) {
            let len = self.lexer.span().len();
            unsafe {
                // Safety: cur() was Some(token)
                self.bump(len);
            }
            Ok(true)
        } else {
            Ok(false)
        }
    }
}

impl Iterator for RawBuffer<'_> {
    type Item = Result<RawToken, LexError>;

    fn next(&mut self) -> Option<Self::Item> {
        self.lexer.next()
    }
}

#[derive(Logos, Debug, Clone, Copy, PartialEq, Eq)]
#[logos(error = LexError)]
pub enum RawToken {
    #[token("=>", priority = 3)]
    Arrow,

    #[token("#", priority = 3)]
    Hash,

    #[token("@", priority = 3)]
    At,

    #[token(".", priority = 3)]
    Dot,

    #[token("...", priority = 3)]
    DotDotDot,

    #[token("!", priority = 3)]
    Bang,

    #[token("(", priority = 3)]
    LParen,

    #[token(")", priority = 3)]
    RParen,

    #[token("[", priority = 3)]
    LBracket,

    #[token("]", priority = 3)]
    RBracket,

    #[token("{", priority = 3)]
    LBrace,

    #[token("}", priority = 3)]
    RBrace,

    #[token(";", priority = 3)]
    Semi,

    #[token(",", priority = 3)]
    Comma,

    #[token(":", priority = 3)]
    Colon,

    #[token("`", priority = 3)]
    BackQuote,

    #[token("${", priority = 3)]
    DollarLBrace,

    #[token("?", priority = 3)]
    QuestionMark,

    #[token("++", priority = 3)]
    PlusPlus,

    #[token("--", priority = 3)]
    MinusMinus,

    #[token("~", priority = 3)]
    Tilde,

    Str,
    Regex,
    Num,
    BigInt,

    #[token("#!", priority = 3)]
    Shebang,

    #[token("null", priority = 3)]
    Null,

    #[token("true", priority = 3)]
    True,

    #[token("false", priority = 3)]
    False,

    #[token("==", priority = 3)]
    EqEqOp,

    #[token("!=", priority = 3)]
    NotEqOp,

    #[token("===", priority = 3)]
    EqEqEqOp,

    #[token("!==", priority = 3)]
    NotEqEqOp,

    #[token("<", priority = 3)]
    LtOp,

    #[token("<=", priority = 3)]
    LtEqOp,

    #[token(">", priority = 3)]
    GtOp,

    #[token(">=", priority = 3)]
    GtEqOp,

    #[token("<<", priority = 3)]
    LShiftOp,

    #[token(">>", priority = 3)]
    RShiftOp,

    #[token(">>>", priority = 3)]
    ZeroFillRShiftOp,

    #[token("+", priority = 3)]
    AddOp,

    #[token("-", priority = 3)]
    SubOp,

    #[token("*", priority = 3)]
    MulOp,

    #[token("/", priority = 3)]
    DivOp,

    #[token("%", priority = 3)]
    ModOp,

    #[token("|", priority = 3)]
    BitOrOp,

    #[token("^", priority = 3)]
    BitXorOp,

    #[token("&", priority = 3)]
    BitAndOp,

    #[token("in", priority = 3)]
    In,

    #[token("instanceof", priority = 3)]
    InstanceOf,

    #[token("**", priority = 3)]
    ExpOp,

    #[token("||", priority = 3)]
    LogicalOrOp,

    #[token("&&", priority = 3)]
    LogicalAndOp,

    #[token("??")]
    NullishCoalescingOp,

    #[token("=", priority = 3)]
    AssignOp,

    #[token("+=", priority = 3)]
    AddAssignOp,

    #[token("-=", priority = 3)]
    SubAssignOp,

    #[token("*=", priority = 3)]
    MulAssignOp,

    #[token("/=", priority = 3)]
    DivAssignOp,

    #[token("%=", priority = 3)]
    ModAssignOp,

    #[token("<<=", priority = 3)]
    LShiftAssignOp,

    #[token(">>=", priority = 3)]
    RShiftAssignOp,

    #[token(">>>=", priority = 3)]
    ZeroFillRShiftAssignOp,

    #[token("|=", priority = 3)]
    BitOrAssignOp,

    #[token("^=", priority = 3)]
    BitXorAssignOp,

    #[token("&=", priority = 3)]
    BitAndAssignOp,

    #[token("**=", priority = 3)]
    ExpAssignOp,

    #[token("&&=", priority = 3)]
    AndAssignOp,

    #[token("||=", priority = 3)]
    OrAssignOp,

    #[token("??=", priority = 3)]
    NullishAssignOp,

    #[regex(r"\P{ID_Start}\P{ID_Continue}*")]
    Ident,

    #[token("\r", priority = 3)]
    #[token("\n", priority = 3)]
    NewLine,

    #[token("<!--", priority = 3)]
    LegacyCommentOpen,

    #[token("-->", priority = 3)]
    LegacyCommentClose,

    #[token("<<<<<", priority = 3)]
    LConflictMarker,

    #[token(">>>>>", priority = 3)]
    RConflictMarker,
}

#[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]
pub enum LexError {
    #[default]
    UnexpectedEof,
}
