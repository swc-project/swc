use logos::Logos;

#[derive(Logos, Debug)]
#[logos(subpattern decimal = r"[0-9][_0-9]*")]
#[logos(subpattern hex = r"[0-9a-fA-F][_0-9a-fA-F]*")]
#[logos(subpattern octal = r"[0-7][_0-7]*")]
#[logos(subpattern binary = r"[0-1][_0-1]*")]
#[logos(subpattern exp = r"[eE][+-]?[0-9][_0-9]*")]
pub(crate) enum InternalToken {
    #[error]
    #[regex(r"[\s]+", logos::skip)]
    Error,

    #[token("null")]
    Null,
    #[token("true")]
    True,
    #[token("false")]
    False,

    #[regex(r#"[a-zA-Z$_\p{XID_Start}][a-zA-Z0-9$_\p{XID_Continue}]*"#)]
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
    /// '::'
    #[token("::")]
    ColonColon,
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
    /// `/=`
    #[token("/=")]
    DivAssign,
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

    /// '${'
    #[token("${")]
    DollarLBrace,

    /// Content of template literal
    #[regex(r#"`(?:[^`]|\\`)*`"#)]
    Template,

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
    #[regex(r#""(?:[^"]|\\")*""#)]
    #[regex(r#"'(?:[^']|\\')*'"#)]
    Str,

    /// TODO: Make Num as enum and separate decimal, binary, ..etc
    #[regex("(?&decimal)")]
    #[regex("0[xX](?&hex)")]
    #[regex("0[oO](?&octal)")]
    #[regex("0[bB](?&binary)")]
    Num,

    #[regex("[0-9]+n")]
    BigInt,

    #[token("#!")]
    Shebang,
}
