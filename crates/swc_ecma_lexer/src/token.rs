//! Ported from [babel/babylon][]
//!
//! [babel/babylon]:https://github.com/babel/babel/blob/2d378d076eb0c5fe63234a8b509886005c01d7ee/packages/babylon/src/tokenizer/types.js
use num_bigint::BigInt as BigIntValue;
use swc_atoms::{Atom, Wtf8Atom};
use swc_common::Span;
pub(crate) use swc_ecma_ast::{AssignOp, BinaryOp};
pub use swc_ecma_parser::{
    known_ident,
    token::{
        BinOpToken, IdentKind, IdentLike, Keyword, KnownIdent, Token, TokenAndSpan, TokenKind,
        Word, WordKind,
    },
};

pub(crate) use self::Token::*;
use crate::{
    common::{
        input::Tokens,
        lexer::{LexResult, Lexer},
    },
    tok,
};

impl crate::common::lexer::state::TokenKind for TokenKind {
    #[inline(always)]
    fn is_dot(self) -> bool {
        self == Self::Dot
    }

    #[inline(always)]
    fn is_bin_op(self) -> bool {
        matches!(self, Self::BinOp(_))
    }

    #[inline(always)]
    fn is_semi(self) -> bool {
        self == Self::Semi
    }

    #[inline(always)]
    fn is_template(self) -> bool {
        self == Self::Template
    }

    #[inline(always)]
    fn is_keyword(self) -> bool {
        matches!(self, Self::Word(WordKind::Keyword(_)))
    }

    #[inline(always)]
    fn is_colon(self) -> bool {
        self == Self::Colon
    }

    #[inline(always)]
    fn is_lbrace(self) -> bool {
        self == Self::LBrace
    }

    #[inline(always)]
    fn is_rbrace(self) -> bool {
        self == Self::RBrace
    }

    #[inline(always)]
    fn is_lparen(self) -> bool {
        self == Self::LParen
    }

    #[inline(always)]
    fn is_rparen(self) -> bool {
        self == Self::RParen
    }

    #[inline(always)]
    fn is_keyword_fn(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::Function))
    }

    #[inline(always)]
    fn is_keyword_return(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::Return))
    }

    #[inline(always)]
    fn is_keyword_yield(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::Yield))
    }

    #[inline(always)]
    fn is_keyword_else(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::Else))
    }

    #[inline(always)]
    fn is_keyword_class(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::Class))
    }

    #[inline(always)]
    fn is_keyword_let(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::Let))
    }

    #[inline(always)]
    fn is_keyword_var(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::Var))
    }

    #[inline(always)]
    fn is_keyword_const(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::Const))
    }

    #[inline(always)]
    fn is_keyword_if(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::If))
    }

    #[inline(always)]
    fn is_keyword_while(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::While))
    }

    #[inline(always)]
    fn is_keyword_for(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::For))
    }

    #[inline(always)]
    fn is_keyword_with(self) -> bool {
        self == Self::Word(WordKind::Keyword(Keyword::With))
    }

    #[inline(always)]
    fn is_lt(self) -> bool {
        self == Self::BinOp(BinOpToken::Lt)
    }

    #[inline(always)]
    fn is_gt(self) -> bool {
        self == Self::BinOp(BinOpToken::Gt)
    }

    #[inline(always)]
    fn is_arrow(self) -> bool {
        self == Self::Arrow
    }

    #[inline(always)]
    fn is_ident(self) -> bool {
        matches!(self, Self::Word(WordKind::Ident(_)))
    }

    #[inline(always)]
    fn is_known_ident_of(self) -> bool {
        self == Self::Word(WordKind::Ident(IdentKind::Known(KnownIdent::Of)))
    }

    #[inline(always)]
    fn is_slash(self) -> bool {
        self == Self::BinOp(BinOpToken::Div)
    }

    #[inline(always)]
    fn is_dollar_lbrace(self) -> bool {
        self == Self::DollarLBrace
    }

    #[inline(always)]
    fn is_plus_plus(self) -> bool {
        self == Self::PlusPlus
    }

    #[inline(always)]
    fn is_minus_minus(self) -> bool {
        self == Self::MinusMinus
    }

    #[inline(always)]
    fn is_back_quote(self) -> bool {
        self == Self::BackQuote
    }

    #[inline(always)]
    fn before_expr(self) -> bool {
        self.before_expr()
    }

    #[inline(always)]
    fn is_jsx_tag_start(self) -> bool {
        self == Self::JSXTagStart
    }

    #[inline(always)]
    fn is_jsx_tag_end(self) -> bool {
        self == Self::JSXTagEnd
    }
}

impl<'a, I: Tokens<TokenAndSpan>> crate::common::lexer::token::TokenFactory<'a, TokenAndSpan, I>
    for Token
{
    type Buffer = crate::input::Buffer<I>;
    type Lexer = crate::Lexer<'a>;

    const ABSTRACT: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Abstract)));
    const ACCESSOR: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Accessor)));
    const ANY: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Any)));
    const ARROW: Self = Self::Arrow;
    const AS: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::As)));
    const ASSERT: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Assert)));
    const ASSERTS: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Asserts)));
    const ASYNC: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Async)));
    const AT: Self = Self::At;
    const AWAIT: Self = Token::Word(Word::Keyword(Keyword::Await));
    const BACKQUOTE: Self = Self::BackQuote;
    const BANG: Self = Self::Bang;
    const BIGINT: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Bigint)));
    const BIT_AND: Self = Self::BinOp(BinOpToken::BitAnd);
    const BIT_AND_EQ: Self = Self::AssignOp(AssignOp::BitAndAssign);
    const BIT_OR: Self = Self::BinOp(BinOpToken::BitOr);
    const BIT_OR_EQ: Self = Self::AssignOp(AssignOp::BitOrAssign);
    const BOOLEAN: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Boolean)));
    const BREAK: Self = Token::Word(Word::Keyword(Keyword::Break));
    const CASE: Self = Self::Word(Word::Keyword(Keyword::Case));
    const CATCH: Self = Self::Word(Word::Keyword(Keyword::Catch));
    const CLASS: Self = Token::Word(Word::Keyword(Keyword::Class));
    const COLON: Self = Self::Colon;
    const COMMA: Self = Self::Comma;
    const CONST: Self = Token::Word(Word::Keyword(Keyword::Const));
    const CONTINUE: Self = Self::Word(Word::Keyword(Keyword::Continue));
    const DEBUGGER: Self = Self::Word(Word::Keyword(Keyword::Debugger));
    const DECLARE: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Declare)));
    const DEFAULT: Self = Self::Word(Word::Keyword(Keyword::Default_));
    const DELETE: Self = Token::Word(Word::Keyword(Keyword::Delete));
    const DIV: Self = Token::BinOp(BinOpToken::Div);
    const DIV_EQ: Self = Token::AssignOp(AssignOp::DivAssign);
    const DO: Self = Token::Word(Word::Keyword(Keyword::Do));
    const DOLLAR_LBRACE: Self = Self::DollarLBrace;
    const DOT: Self = Self::Dot;
    const DOTDOTDOT: Self = Self::DotDotDot;
    const ELSE: Self = Token::Word(Word::Keyword(Keyword::Else));
    const ENUM: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Enum)));
    const EOF: Self = Token::Eof;
    const EQUAL: Self = Token::AssignOp(AssignOp::Assign);
    const EXP: Self = Token::BinOp(BinOpToken::Exp);
    const EXPORT: Self = Token::Word(Word::Keyword(Keyword::Export));
    const EXP_EQ: Self = Token::AssignOp(AssignOp::ExpAssign);
    const EXTENDS: Self = Self::Word(Word::Keyword(Keyword::Extends));
    const FALSE: Self = Token::Word(Word::False);
    const FINALLY: Self = Self::Word(Word::Keyword(Keyword::Finally));
    const FOR: Self = Token::Word(Word::Keyword(Keyword::For));
    const FROM: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::From)));
    const FUNCTION: Self = Token::Word(Word::Keyword(Keyword::Function));
    const GET: Self = Self::Word(Word::Ident(IdentLike::Known(KnownIdent::Get)));
    const GLOBAL: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Global)));
    const GREATER: Self = Token::BinOp(BinOpToken::Gt);
    const GREATER_EQ: Self = Token::BinOp(BinOpToken::GtEq);
    const HASH: Self = Self::Hash;
    const IF: Self = Token::Word(Word::Keyword(Keyword::If));
    const IMPLEMENTS: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Implements)));
    const IMPORT: Self = Token::Word(Word::Keyword(Keyword::Import));
    const IN: Self = Token::Word(Word::Keyword(Keyword::In));
    const INFER: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Infer)));
    const INSTANCEOF: Self = Token::Word(Word::Keyword(Keyword::InstanceOf));
    const INTERFACE: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Interface)));
    const INTRINSIC: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Intrinsic)));
    const IS: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Is)));
    const JSX_TAG_END: Self = Self::JSXTagEnd;
    const JSX_TAG_START: Self = Self::JSXTagStart;
    const KEYOF: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Keyof)));
    const LBRACE: Self = Self::LBrace;
    const LBRACKET: Self = Self::LBracket;
    const LESS: Self = Token::BinOp(BinOpToken::Lt);
    const LESS_EQ: Self = Token::BinOp(BinOpToken::LtEq);
    const LET: Self = Token::Word(Word::Keyword(Keyword::Let));
    const LOGICAL_AND: Self = tok!("&&");
    const LOGICAL_AND_EQ: Self = Token::AssignOp(AssignOp::AndAssign);
    const LOGICAL_OR: Self = tok!("||");
    const LOGICAL_OR_EQ: Self = Token::AssignOp(AssignOp::OrAssign);
    const LPAREN: Self = Self::LParen;
    const LSHIFT: Self = Token::BinOp(BinOpToken::LShift);
    const LSHIFT_EQ: Self = Token::AssignOp(AssignOp::LShiftAssign);
    const MINUS: Self = Token::BinOp(BinOpToken::Sub);
    const MINUS_MINUS: Self = Self::MinusMinus;
    const MOD: Self = Token::BinOp(BinOpToken::Mod);
    const MOD_EQ: Self = Token::AssignOp(AssignOp::ModAssign);
    const MUL: Self = Token::BinOp(BinOpToken::Mul);
    const MUL_EQ: Self = Token::AssignOp(AssignOp::MulAssign);
    const NAMESPACE: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Namespace)));
    const NEVER: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Never)));
    const NEW: Self = Token::Word(Word::Keyword(Keyword::New));
    const NULL: Self = Token::Word(Word::Null);
    const NULLISH_ASSIGN: Self = tok!("??=");
    const NULLISH_COALESCING: Self = tok!("??");
    const NUMBER: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Number)));
    const OBJECT: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Object)));
    const OF: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Of)));
    const PACKAGE: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Package)));
    const PLUS: Self = Token::BinOp(BinOpToken::Add);
    const PLUS_PLUS: Self = Self::PlusPlus;
    const PRIVATE: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Private)));
    const PROTECTED: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Protected)));
    const PUBLIC: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Public)));
    const QUESTION: Self = Token::QuestionMark;
    const RBRACE: Self = Self::RBrace;
    const RBRACKET: Self = Self::RBracket;
    const READONLY: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Readonly)));
    const REQUIRE: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Require)));
    const RETURN: Self = Token::Word(Word::Keyword(Keyword::Return));
    const RPAREN: Self = Self::RParen;
    const RSHIFT: Self = Token::BinOp(BinOpToken::RShift);
    const RSHIFT_EQ: Self = Token::AssignOp(AssignOp::RShiftAssign);
    const SATISFIES: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Satisfies)));
    const SEMI: Self = Self::Semi;
    const SET: Self = Self::Word(Word::Ident(IdentLike::Known(KnownIdent::Set)));
    const STATIC: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Static)));
    const STRING: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::String)));
    const SUPER: Self = Token::Word(Word::Keyword(Keyword::Super));
    const SWITCH: Self = Self::Word(Word::Keyword(Keyword::Switch));
    const SYMBOL: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Symbol)));
    const TARGET: Self = Self::Word(Word::Ident(IdentLike::Known(KnownIdent::Target)));
    const THIS: Self = Token::Word(Word::Keyword(Keyword::This));
    const THROW: Self = Token::Word(Word::Keyword(Keyword::Throw));
    const TILDE: Self = Self::Tilde;
    const TRUE: Self = Token::Word(Word::True);
    const TRY: Self = Self::Word(Word::Keyword(Keyword::Try));
    const TYPE: Self = Self::Word(Word::Ident(IdentLike::Known(KnownIdent::Type)));
    const TYPEOF: Self = Token::Word(Word::Keyword(Keyword::TypeOf));
    const UNDEFINED: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Undefined)));
    const UNIQUE: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Unique)));
    const UNKNOWN: Self = Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Unknown)));
    const USING: Self = Self::Word(Word::Ident(IdentLike::Known(KnownIdent::Using)));
    const VAR: Self = Self::Word(Word::Keyword(Keyword::Var));
    const VOID: Self = Token::Word(Word::Keyword(Keyword::Void));
    const WHILE: Self = Token::Word(Word::Keyword(Keyword::While));
    const WITH: Self = Token::Word(Word::Keyword(Keyword::With));
    const YIELD: Self = Token::Word(Word::Keyword(Keyword::Yield));
    const ZERO_FILL_RSHIFT: Self = Token::BinOp(BinOpToken::ZeroFillRShift);
    const ZERO_FILL_RSHIFT_EQ: Self = Token::AssignOp(AssignOp::ZeroFillRShiftAssign);

    #[inline(always)]
    fn jsx_name(name: &'a str, lexer: &mut crate::Lexer<'a>) -> Self {
        let name = lexer.atom(name);
        Self::JSXName { name }
    }

    #[inline(always)]
    fn is_jsx_name(&self) -> bool {
        matches!(self, Self::JSXName { .. })
    }

    #[inline(always)]
    fn take_jsx_name(self, _: &mut Self::Buffer) -> Atom {
        match self {
            JSXName { name } => name,
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn str(value: Wtf8Atom, raw: Atom, _: &mut crate::Lexer<'a>) -> Self {
        Self::Str { value, raw }
    }

    #[inline(always)]
    fn template(cooked: LexResult<Wtf8Atom>, raw: Atom, _: &mut crate::Lexer<'a>) -> Self {
        Self::Template { cooked, raw }
    }

    #[inline(always)]
    fn regexp(content: Atom, flags: Atom, _: &mut crate::Lexer<'a>) -> Self {
        Self::Regex(content, flags)
    }

    #[inline(always)]
    fn num(value: f64, raw: Atom, _: &mut crate::Lexer<'a>) -> Self {
        Self::Num { value, raw }
    }

    #[inline(always)]
    fn bigint(value: Box<BigIntValue>, raw: Atom, _: &mut crate::Lexer<'a>) -> Self {
        Self::BigInt { value, raw }
    }

    #[inline(always)]
    fn unknown_ident(value: Atom, _: &mut crate::Lexer<'a>) -> Self {
        Token::Word(Word::Ident(IdentLike::Other(value)))
    }

    #[inline(always)]
    fn is_word(&self) -> bool {
        matches!(self, Self::Word(_))
    }

    #[inline(always)]
    fn is_reserved(&self, ctx: crate::common::context::Context) -> bool {
        if let Token::Word(word) = self {
            ctx.is_reserved(word)
        } else {
            unreachable!()
        }
    }

    #[inline(always)]
    fn into_atom(self, _: &mut crate::Lexer<'a>) -> Option<Atom> {
        match self {
            Token::Word(word) => Some(word.into()),
            _ => None,
        }
    }

    #[inline(always)]
    fn is_error(&self) -> bool {
        matches!(self, Self::Error(_))
    }

    #[inline(always)]
    fn take_error(self, _: &mut Self::Buffer) -> crate::error::Error {
        match self {
            Self::Error(e) => e,
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn is_str(&self) -> bool {
        matches!(self, Self::Str { .. })
    }

    #[inline(always)]
    fn is_str_raw_content(&self, content: &str, _: &Self::Buffer) -> bool {
        if let Self::Str { raw, .. } = self {
            raw == content
        } else {
            false
        }
    }

    #[inline(always)]
    fn take_str(self, _: &mut Self::Buffer) -> (Wtf8Atom, Atom) {
        match self {
            Self::Str { value, raw } => (value, raw),
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn is_num(&self) -> bool {
        matches!(self, Self::Num { .. })
    }

    #[inline(always)]
    fn take_num(self, _: &mut Self::Buffer) -> (f64, Atom) {
        match self {
            Self::Num { value, raw } => (value, raw),
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn is_bigint(&self) -> bool {
        matches!(self, Self::BigInt { .. })
    }

    #[inline(always)]
    fn take_bigint(self, _: &mut Self::Buffer) -> (Box<BigIntValue>, Atom) {
        match self {
            Self::BigInt { value, raw } => (value, raw),
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn take_word(self, _: &Self::Buffer) -> Option<Atom> {
        match self {
            Self::Word(word) => Some(word.into()),
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn is_unknown_ident(&self) -> bool {
        matches!(self, Self::Word(Word::Ident(IdentLike::Other(_))))
    }

    #[inline(always)]
    fn take_unknown_ident(self, _: &mut Self::Buffer) -> Atom {
        match self {
            Self::Word(Word::Ident(IdentLike::Other(ident))) => ident,
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn take_unknown_ident_ref<'b>(&'b self, _: &'b Self::Buffer) -> &'b Atom {
        match self {
            Self::Word(Word::Ident(IdentLike::Other(ref ident))) => ident,
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn is_keyword(&self) -> bool {
        matches!(self, Self::Word(Word::Keyword(_)))
    }

    #[inline(always)]
    fn is_known_ident(&self) -> bool {
        matches!(self, Self::Word(Word::Ident(IdentLike::Known(_))))
    }

    #[inline(always)]
    fn take_known_ident(&self) -> Atom {
        match self {
            Self::Word(Word::Ident(IdentLike::Known(kwd))) => (*kwd).into(),
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn is_regexp(&self) -> bool {
        matches!(self, Self::Regex(..))
    }

    #[inline(always)]
    fn is_template(&self) -> bool {
        matches!(self, Self::Template { .. })
    }

    #[inline(always)]
    fn take_template(self, _: &mut Self::Buffer) -> (LexResult<Wtf8Atom>, Atom) {
        match self {
            Self::Template { cooked, raw } => (cooked, raw),
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn jsx_text(value: Atom, raw: Atom, _: &mut Self::Lexer) -> Self {
        Self::JSXText { value, raw }
    }

    #[inline(always)]
    fn is_jsx_text(&self) -> bool {
        matches!(self, Self::JSXText { .. })
    }

    #[inline(always)]
    fn take_jsx_text(self, _: &mut Self::Buffer) -> (Atom, Atom) {
        match self {
            Self::JSXText { value, raw } => (value, raw),
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn starts_expr(&self) -> bool {
        self.kind().starts_expr()
    }

    #[inline(always)]
    fn to_string(&self, _: &Self::Buffer) -> String {
        format!("{self:?}")
    }

    #[inline(always)]
    fn is_bin_op(&self) -> bool {
        matches!(self, Self::BinOp(_))
    }

    #[inline(always)]
    fn as_assign_op(&self) -> Option<AssignOp> {
        match self {
            Self::AssignOp(op) => Some(*op),
            _ => None,
        }
    }

    #[inline(always)]
    fn as_bin_op(&self) -> Option<BinaryOp> {
        match self {
            Self::BinOp(op) => Some((*op).into()),
            _ => None,
        }
    }

    #[inline(always)]
    fn follows_keyword_let(&self) -> bool {
        self.kind().follows_keyword_let(false)
    }

    #[inline(always)]
    fn is_assign_op(&self) -> bool {
        matches!(self, Self::AssignOp(_))
    }

    #[inline(always)]
    fn take_regexp(self, _: &mut Self::Buffer) -> (Atom, Atom) {
        match self {
            Self::Regex(content, flags) => (content, flags),
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn shebang(value: Atom, _: &mut Self::Lexer) -> Self {
        Self::Shebang(value)
    }

    #[inline(always)]
    fn is_shebang(&self) -> bool {
        matches!(self, Self::Shebang(..))
    }

    #[inline(always)]
    fn take_shebang(self, _: &mut Self::Buffer) -> Atom {
        match self {
            Self::Shebang(value) => value,
            _ => unreachable!(),
        }
    }

    #[inline(always)]
    fn is_no_substitution_template_literal(&self) -> bool {
        false
    }

    #[inline(always)]
    fn is_template_head(&self) -> bool {
        false
    }
}

impl crate::common::parser::token_and_span::TokenAndSpan for TokenAndSpan {
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

    #[inline(always)]
    fn span(&self) -> Span {
        self.span
    }
}

impl crate::common::parser::buffer::NextTokenAndSpan for TokenAndSpan {
    type Token = Token;

    #[inline(always)]
    fn token(&self) -> &Self::Token {
        &self.token
    }

    #[inline(always)]
    fn span(&self) -> Span {
        self.span
    }

    #[inline(always)]
    fn had_line_break(&self) -> bool {
        self.had_line_break
    }
}
