//! Lookup table for byte handlers.
//!
//! Idea is taken from ratel.
//!
//! https://github.com/ratel-rust/ratel-core/blob/e55a1310ba69a3f5ce2a9a6eef643feced02ac08/ratel/src/lexer/mod.rs#L665

use either::Either;
use swc_common::input::Input;
use swc_ecma_ast::AssignOp;

use super::{LexResult, Lexer, LexerTrait};
use crate::{
    common::lexer::{char::CharExt, pos_span},
    error::SyntaxError,
    token::{BinOpToken, IdentLike, Keyword, KnownIdent, Token, Word},
};

pub(super) type ByteHandler = Option<for<'aa> fn(&mut Lexer<'aa>) -> LexResult<Token>>;

/// Lookup table mapping any incoming byte to a handler function defined below.
pub(super) static BYTE_HANDLERS: [ByteHandler; 256] = [
    //   0    1    2    3    4    5    6    7    8    9    A    B    C    D    E    F   //
    EOF, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 0
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 1
    ___, EXL, QOT, HSH, IDN, PRC, AMP, QOT, PNO, PNC, ATR, PLS, COM, MIN, PRD, SLH, // 2
    ZER, DIG, DIG, DIG, DIG, DIG, DIG, DIG, DIG, DIG, COL, SEM, LSS, EQL, MOR, QST, // 3
    AT_, IDN, IDN, IDN, IDN, IDN, IDN, IDN, IDN, IDN, IDN, IDN, IDN, IDN, IDN, IDN, // 4
    IDN, IDN, IDN, IDN, IDN, IDN, IDN, IDN, IDN, IDN, IDN, BTO, IDN, BTC, CRT, IDN, // 5
    TPL, L_A, L_B, L_C, L_D, L_E, L_F, L_G, L_H, L_I, L_J, L_K, L_L, L_M, L_N, L_O, // 6
    L_P, L_Q, L_R, L_S, L_T, L_U, L_V, L_W, L_X, L_Y, L_Z, BEO, PIP, BEC, TLD, ERR, // 7
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // 8
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // 9
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // A
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // B
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // C
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // D
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // E
    UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, UNI, // F
];

const ___: ByteHandler = None;

const EOF: ByteHandler = Some(|lexer| {
    unsafe {
        lexer.input.bump_bytes(1);
    }

    Ok(Token::Eof)
});

const ERR: ByteHandler = Some(|lexer| {
    let c = unsafe {
        // Safety: Byte handler is only called for non-last characters
        // Get the char representation for error messages
        lexer.cur_as_char().unwrap_unchecked()
    };

    let start = lexer.cur_pos();
    unsafe {
        // Safety: Byte handler is only called for non-last characters
        lexer.input.bump_bytes(c.len_utf8());
    }
    lexer.error_span(pos_span(start), SyntaxError::UnexpectedChar { c })?
});

/// Identifier and we know that this cannot be a keyword or known ident.
const IDN: ByteHandler = Some(|lexer| lexer.read_ident_unknown());

const L_A: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "abstract" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Abstract,
        )))),
        "as" => Some(Token::Word(Word::Ident(IdentLike::Known(KnownIdent::As)))),
        "await" => Some(Token::Word(Word::Keyword(Keyword::Await))),
        "async" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Async,
        )))),
        "assert" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Assert,
        )))),
        "asserts" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Asserts,
        )))),
        "any" => Some(Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Any)))),
        "accessor" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Accessor,
        )))),
        _ => None,
    })
});

const L_B: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "break" => Some(Token::Word(Word::Keyword(Keyword::Break))),
        "boolean" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Boolean,
        )))),
        "bigint" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Bigint,
        )))),
        _ => None,
    })
});

const L_C: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "case" => Some(Token::Word(Word::Keyword(Keyword::Case))),
        "catch" => Some(Token::Word(Word::Keyword(Keyword::Catch))),
        "class" => Some(Token::Word(Word::Keyword(Keyword::Class))),
        "const" => Some(Token::Word(Word::Keyword(Keyword::Const))),
        "continue" => Some(Token::Word(Word::Keyword(Keyword::Continue))),
        _ => None,
    })
});

const L_D: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "debugger" => Some(Token::Word(Word::Keyword(Keyword::Debugger))),
        "default" => Some(Token::Word(Word::Keyword(Keyword::Default_))),
        "delete" => Some(Token::Word(Word::Keyword(Keyword::Delete))),
        "do" => Some(Token::Word(Word::Keyword(Keyword::Do))),
        "declare" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Declare,
        )))),
        _ => None,
    })
});

const L_E: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "else" => Some(Token::Word(Word::Keyword(Keyword::Else))),
        "enum" => Some(Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Enum)))),
        "export" => Some(Token::Word(Word::Keyword(Keyword::Export))),
        "extends" => Some(Token::Word(Word::Keyword(Keyword::Extends))),
        _ => None,
    })
});

const L_F: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "false" => Some(Token::Word(Word::False)),
        "finally" => Some(Token::Word(Word::Keyword(Keyword::Finally))),
        "for" => Some(Token::Word(Word::Keyword(Keyword::For))),
        "function" => Some(Token::Word(Word::Keyword(Keyword::Function))),
        "from" => Some(Token::Word(Word::Ident(IdentLike::Known(KnownIdent::From)))),
        _ => None,
    })
});

const L_G: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "global" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Global,
        )))),
        "get" => Some(Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Get)))),
        _ => None,
    })
});

const L_H: ByteHandler = IDN;

const L_I: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "if" => Some(Token::Word(Word::Keyword(Keyword::If))),
        "import" => Some(Token::Word(Word::Keyword(Keyword::Import))),
        "in" => Some(Token::Word(Word::Keyword(Keyword::In))),
        "instanceof" => Some(Token::Word(Word::Keyword(Keyword::InstanceOf))),
        "is" => Some(Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Is)))),
        "infer" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Infer,
        )))),
        "interface" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Interface,
        )))),
        "implements" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Implements,
        )))),
        "intrinsic" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Intrinsic,
        )))),
        _ => None,
    })
});

const L_J: ByteHandler = IDN;

const L_K: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "keyof" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Keyof,
        )))),
        _ => None,
    })
});

const L_L: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "let" => Some(Token::Word(Word::Keyword(Keyword::Let))),
        _ => None,
    })
});

const L_M: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "meta" => Some(Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Meta)))),
        _ => None,
    })
});

const L_N: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "new" => Some(Token::Word(Word::Keyword(Keyword::New))),
        "null" => Some(Token::Word(Word::Null)),
        "number" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Number,
        )))),
        "never" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Never,
        )))),
        "namespace" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Namespace,
        )))),
        _ => None,
    })
});

const L_O: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "of" => Some(Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Of)))),
        "object" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Object,
        )))),
        _ => None,
    })
});

const L_P: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "public" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Public,
        )))),
        "package" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Package,
        )))),
        "protected" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Protected,
        )))),
        "private" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Private,
        )))),
        _ => None,
    })
});

const L_Q: ByteHandler = IDN;

const L_R: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "return" => Some(Token::Word(Word::Keyword(Keyword::Return))),
        "readonly" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Readonly,
        )))),
        "require" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Require,
        )))),
        _ => None,
    })
});

const L_S: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "super" => Some(Token::Word(Word::Keyword(Keyword::Super))),
        "static" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Static,
        )))),
        "switch" => Some(Token::Word(Word::Keyword(Keyword::Switch))),
        "symbol" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Symbol,
        )))),
        "set" => Some(Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Set)))),
        "string" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::String,
        )))),
        "satisfies" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Satisfies,
        )))),
        _ => None,
    })
});

const L_T: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "this" => Some(Token::Word(Word::Keyword(Keyword::This))),
        "throw" => Some(Token::Word(Word::Keyword(Keyword::Throw))),
        "true" => Some(Token::Word(Word::True)),
        "typeof" => Some(Token::Word(Word::Keyword(Keyword::TypeOf))),
        "try" => Some(Token::Word(Word::Keyword(Keyword::Try))),
        "type" => Some(Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Type)))),
        "target" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Target,
        )))),
        _ => None,
    })
});

const L_U: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "using" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Using,
        )))),
        "unique" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Unique,
        )))),
        "undefined" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Undefined,
        )))),
        "unknown" => Some(Token::Word(Word::Ident(IdentLike::Known(
            KnownIdent::Unknown,
        )))),
        _ => None,
    })
});

const L_V: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "var" => Some(Token::Word(Word::Keyword(Keyword::Var))),
        "void" => Some(Token::Word(Word::Keyword(Keyword::Void))),
        _ => None,
    })
});

const L_W: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "while" => Some(Token::Word(Word::Keyword(Keyword::While))),
        "with" => Some(Token::Word(Word::Keyword(Keyword::With))),
        _ => None,
    })
});

const L_X: ByteHandler = IDN;

const L_Y: ByteHandler = Some(|lexer| {
    lexer.read_keyword_with(&|s| match s {
        "yield" => Some(Token::Word(Word::Keyword(Keyword::Yield))),
        _ => None,
    })
});

const L_Z: ByteHandler = IDN;

/// `0`
const ZER: ByteHandler = Some(|lexer| lexer.read_token_zero());

/// Numbers
const DIG: ByteHandler = Some(|lexer| {
    debug_assert!(lexer.cur().is_some_and(|cur| cur != b'0'));
    lexer.read_number::<false, false>().map(|v| match v {
        Either::Left((value, raw)) => Token::Num { value, raw },
        Either::Right((value, raw)) => Token::BigInt { value, raw },
    })
});

/// String literals with `'` or `"`
const QOT: ByteHandler = Some(|lexer| lexer.read_str_lit());

/// Unicode - handles multi-byte UTF-8 sequences
const UNI: ByteHandler = Some(|lexer| {
    let c = unsafe {
        // Safety: Byte handler is only called for non-last characters
        // For non-ASCII bytes, we need the full char
        lexer.cur_as_char().unwrap_unchecked()
    };

    // Identifier or keyword. '\uXXXX' sequences are allowed in
    // identifiers, so '\' also dispatches to that.
    if c == '\\' || c.is_ident_start() {
        return lexer.read_ident_unknown();
    }

    let start = lexer.cur_pos();
    unsafe {
        // Safety: Byte handler is only called for non-last characters
        lexer.input.bump_bytes(c.len_utf8());
    }
    lexer.error_span(pos_span(start), SyntaxError::UnexpectedChar { c })?
});

/// `:`
const COL: ByteHandler = Some(|lexer| lexer.read_token_colon());

/// `%`
const PRC: ByteHandler = Some(|lexer| lexer.read_token_mul_mod(false));

/// `*`
const ATR: ByteHandler = Some(|lexer| lexer.read_token_mul_mod(true));

/// `?`
const QST: ByteHandler = Some(|lexer| lexer.read_token_question_mark());

/// `&`
const AMP: ByteHandler = Some(|lexer| lexer.read_token_logical::<b'&'>());

/// `|`
const PIP: ByteHandler = Some(|lexer| lexer.read_token_logical::<b'|'>());

macro_rules! single_char {
    ($name:ident, $c:literal, $token:ident) => {
        const $name: ByteHandler = Some(|lexer| {
            unsafe {
                lexer.input.bump_bytes(1);
            }
            Ok(Token::$token)
        });
    };
}

single_char!(SEM, b';', Semi);
single_char!(COM, b',', Comma);
single_char!(TPL, b'`', BackQuote);
single_char!(TLD, b'~', Tilde);
single_char!(AT_, b'@', At);

single_char!(PNO, b'(', LParen);
single_char!(PNC, b')', RParen);

single_char!(BTO, b'[', LBracket);
single_char!(BTC, b']', RBracket);

single_char!(BEO, b'{', LBrace);
single_char!(BEC, b'}', RBrace);

/// `^`
const CRT: ByteHandler = Some(|lexer| {
    // Bitwise xor
    unsafe {
        lexer.input.bump_bytes(1);
    }
    Ok(if lexer.input.cur_as_ascii() == Some(b'=') {
        unsafe {
            lexer.input.bump_bytes(1);
        }
        Token::AssignOp(AssignOp::BitXorAssign)
    } else {
        Token::BinOp(BinOpToken::BitXor)
    })
});

/// `+`
const PLS: ByteHandler = Some(|lexer| lexer.read_token_plus_minus::<b'+'>());

/// `-`
const MIN: ByteHandler = Some(|lexer| lexer.read_token_plus_minus::<b'-'>());

/// `!`
const EXL: ByteHandler = Some(|lexer| lexer.read_token_bang_or_eq::<b'!'>());

/// `=`
const EQL: ByteHandler = Some(|lexer| lexer.read_token_bang_or_eq::<b'='>());

/// `.`
const PRD: ByteHandler = Some(|lexer| lexer.read_token_dot());

/// `<`
const LSS: ByteHandler = Some(|lexer| lexer.read_token_lt_gt::<b'<'>());

/// `>`
const MOR: ByteHandler = Some(|lexer| lexer.read_token_lt_gt::<b'>'>());

/// `/`
const SLH: ByteHandler = Some(|lexer| lexer.read_slash());

/// `#`
const HSH: ByteHandler = Some(|lexer| lexer.read_token_number_sign());
