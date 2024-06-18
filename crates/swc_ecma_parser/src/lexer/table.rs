//! Lookup table for byte handlers.
//!
//! Idea is taken from ratel.
//!
//! https://github.com/ratel-rust/ratel-core/blob/e55a1310ba69a3f5ce2a9a6eef643feced02ac08/ratel/src/lexer/mod.rs#L665

use either::Either;
use swc_common::input::Input;
use swc_ecma_ast::AssignOp;

use super::{pos_span, util::CharExt, LexResult, Lexer};
use crate::{
    error::SyntaxError,
    token::{BinOpToken, IdentLike, Keyword, KnownIdent, Token, Word},
};

pub(super) type ByteHandler = Option<for<'aa> fn(&mut Lexer<'aa>) -> LexResult<Option<Token>>>;

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
    lexer.input.bump_bytes(1);

    Ok(None)
});

const ERR: ByteHandler = Some(|lexer| {
    let c = unsafe {
        // Safety: Byte handler is only called for non-last chracters
        lexer.input.cur().unwrap_unchecked()
    };

    let start = lexer.cur_pos();
    unsafe {
        // Safety: Byte handler is only called for non-last chracters
        lexer.input.bump();
    }
    lexer.error_span(pos_span(start), SyntaxError::UnexpectedChar { c })?
});

/// Identifier and we know that this cannot be a keyword or known ident.
const IDN: ByteHandler = Some(|lexer| lexer.read_ident_unknown().map(Some));

const L_A: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "abstract" => Some(Word::Ident(IdentLike::Known(KnownIdent::Abstract))),
        "as" => Some(Word::Ident(IdentLike::Known(KnownIdent::As))),
        "await" => Some(Word::Keyword(Keyword::Await)),
        "async" => Some(Word::Ident(IdentLike::Known(KnownIdent::Async))),
        "assert" => Some(Word::Ident(IdentLike::Known(KnownIdent::Assert))),
        "asserts" => Some(Word::Ident(IdentLike::Known(KnownIdent::Asserts))),
        "any" => Some(Word::Ident(IdentLike::Known(KnownIdent::Any))),
        "accessor" => Some(Word::Ident(IdentLike::Known(KnownIdent::Accessor))),
        _ => None,
    })
});

const L_B: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "break" => Some(Word::Keyword(Keyword::Break)),
        "boolean" => Some(Word::Ident(IdentLike::Known(KnownIdent::Boolean))),
        "bigint" => Some(Word::Ident(IdentLike::Known(KnownIdent::Bigint))),
        _ => None,
    })
});

const L_C: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "case" => Some(Word::Keyword(Keyword::Case)),
        "catch" => Some(Word::Keyword(Keyword::Catch)),
        "class" => Some(Word::Keyword(Keyword::Class)),
        "const" => Some(Word::Keyword(Keyword::Const)),
        "continue" => Some(Word::Keyword(Keyword::Continue)),
        _ => None,
    })
});

const L_D: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "debugger" => Some(Word::Keyword(Keyword::Debugger)),
        "default" => Some(Word::Keyword(Keyword::Default_)),
        "delete" => Some(Word::Keyword(Keyword::Delete)),
        "do" => Some(Word::Keyword(Keyword::Do)),
        "declare" => Some(Word::Ident(IdentLike::Known(KnownIdent::Declare))),
        _ => None,
    })
});

const L_E: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "else" => Some(Word::Keyword(Keyword::Else)),
        "enum" => Some(Word::Ident(IdentLike::Known(KnownIdent::Enum))),
        "export" => Some(Word::Keyword(Keyword::Export)),
        "extends" => Some(Word::Keyword(Keyword::Extends)),
        _ => None,
    })
});

const L_F: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "false" => Some(Word::False),
        "finally" => Some(Word::Keyword(Keyword::Finally)),
        "for" => Some(Word::Keyword(Keyword::For)),
        "function" => Some(Word::Keyword(Keyword::Function)),
        "from" => Some(Word::Ident(IdentLike::Known(KnownIdent::From))),
        _ => None,
    })
});

const L_G: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "global" => Some(Word::Ident(IdentLike::Known(KnownIdent::Global))),
        "get" => Some(Word::Ident(IdentLike::Known(KnownIdent::Get))),
        _ => None,
    })
});

const L_H: ByteHandler = IDN;

const L_I: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "if" => Some(Word::Keyword(Keyword::If)),
        "import" => Some(Word::Keyword(Keyword::Import)),
        "in" => Some(Word::Keyword(Keyword::In)),
        "instanceof" => Some(Word::Keyword(Keyword::InstanceOf)),
        "is" => Some(Word::Ident(IdentLike::Known(KnownIdent::Is))),
        "infer" => Some(Word::Ident(IdentLike::Known(KnownIdent::Infer))),
        "interface" => Some(Word::Ident(IdentLike::Known(KnownIdent::Interface))),
        "implements" => Some(Word::Ident(IdentLike::Known(KnownIdent::Implements))),
        "intrinsic" => Some(Word::Ident(IdentLike::Known(KnownIdent::Intrinsic))),
        _ => None,
    })
});

const L_J: ByteHandler = IDN;

const L_K: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "keyof" => Some(Word::Ident(IdentLike::Known(KnownIdent::Keyof))),
        _ => None,
    })
});

const L_L: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "let" => Some(Word::Keyword(Keyword::Let)),
        _ => None,
    })
});

const L_M: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "meta" => Some(Word::Ident(IdentLike::Known(KnownIdent::Meta))),
        _ => None,
    })
});

const L_N: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "new" => Some(Word::Keyword(Keyword::New)),
        "null" => Some(Word::Null),
        "number" => Some(Word::Ident(IdentLike::Known(KnownIdent::Number))),
        "never" => Some(Word::Ident(IdentLike::Known(KnownIdent::Never))),
        "namespace" => Some(Word::Ident(IdentLike::Known(KnownIdent::Namespace))),
        _ => None,
    })
});

const L_O: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "of" => Some(Word::Ident(IdentLike::Known(KnownIdent::Of))),
        "object" => Some(Word::Ident(IdentLike::Known(KnownIdent::Object))),
        _ => None,
    })
});

const L_P: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "public" => Some(Word::Ident(IdentLike::Known(KnownIdent::Public))),
        "package" => Some(Word::Ident(IdentLike::Known(KnownIdent::Package))),
        "protected" => Some(Word::Ident(IdentLike::Known(KnownIdent::Protected))),
        "private" => Some(Word::Ident(IdentLike::Known(KnownIdent::Private))),
        _ => None,
    })
});

const L_Q: ByteHandler = IDN;

const L_R: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "return" => Some(Word::Keyword(Keyword::Return)),
        "readonly" => Some(Word::Ident(IdentLike::Known(KnownIdent::Readonly))),
        "require" => Some(Word::Ident(IdentLike::Known(KnownIdent::Require))),
        _ => None,
    })
});

const L_S: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "super" => Some(Word::Keyword(Keyword::Super)),
        "static" => Some(Word::Ident(IdentLike::Known(KnownIdent::Static))),
        "switch" => Some(Word::Keyword(Keyword::Switch)),
        "symbol" => Some(Word::Ident(IdentLike::Known(KnownIdent::Symbol))),
        "set" => Some(Word::Ident(IdentLike::Known(KnownIdent::Set))),
        "string" => Some(Word::Ident(IdentLike::Known(KnownIdent::String))),
        "satisfies" => Some(Word::Ident(IdentLike::Known(KnownIdent::Satisfies))),
        _ => None,
    })
});

const L_T: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "this" => Some(Word::Keyword(Keyword::This)),
        "throw" => Some(Word::Keyword(Keyword::Throw)),
        "true" => Some(Word::True),
        "typeof" => Some(Word::Keyword(Keyword::TypeOf)),
        "try" => Some(Word::Keyword(Keyword::Try)),
        "type" => Some(Word::Ident(IdentLike::Known(KnownIdent::Type))),
        "target" => Some(Word::Ident(IdentLike::Known(KnownIdent::Target))),
        _ => None,
    })
});

const L_U: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "using" => Some(Word::Ident(IdentLike::Known(KnownIdent::Using))),
        "unique" => Some(Word::Ident(IdentLike::Known(KnownIdent::Unique))),
        "undefined" => Some(Word::Ident(IdentLike::Known(KnownIdent::Undefined))),
        "unknown" => Some(Word::Ident(IdentLike::Known(KnownIdent::Unknown))),
        _ => None,
    })
});

const L_V: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "var" => Some(Word::Keyword(Keyword::Var)),
        "void" => Some(Word::Keyword(Keyword::Void)),
        _ => None,
    })
});

const L_W: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "while" => Some(Word::Keyword(Keyword::While)),
        "with" => Some(Word::Keyword(Keyword::With)),
        _ => None,
    })
});

const L_X: ByteHandler = IDN;

const L_Y: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| match s {
        "yield" => Some(Word::Keyword(Keyword::Yield)),
        _ => None,
    })
});

const L_Z: ByteHandler = IDN;

/// `0`
const ZER: ByteHandler = Some(|lexer| lexer.read_token_zero().map(Some));

/// Numbers
const DIG: ByteHandler = Some(|lexer| {
    lexer
        .read_number(false)
        .map(|v| match v {
            Either::Left((value, raw)) => Token::Num { value, raw },
            Either::Right((value, raw)) => Token::BigInt { value, raw },
        })
        .map(Some)
});

/// String literals with `'` or `"`
const QOT: ByteHandler = Some(|lexer| lexer.read_str_lit().map(Some));

/// Unicode
const UNI: ByteHandler = Some(|lexer| {
    let c = unsafe {
        // Safety: Byte handler is only called for non-last chracters
        lexer.input.cur().unwrap_unchecked()
    };

    // Identifier or keyword. '\uXXXX' sequences are allowed in
    // identifiers, so '\' also dispatches to that.
    if c == '\\' || c.is_ident_start() {
        return lexer.read_ident_unknown().map(Some);
    }

    let start = lexer.cur_pos();
    unsafe {
        // Safety: Byte handler is only called for non-last chracters
        lexer.input.bump();
    }
    lexer.error_span(pos_span(start), SyntaxError::UnexpectedChar { c })?
});

/// `:`
const COL: ByteHandler = Some(|lexer| lexer.read_token_colon().map(Some));

/// `%`
const PRC: ByteHandler = Some(|lexer| lexer.read_token_mul_mod(b'%').map(Some));

/// `*`
const ATR: ByteHandler = Some(|lexer| lexer.read_token_mul_mod(b'*').map(Some));

/// `?`
const QST: ByteHandler = Some(|lexer| lexer.read_token_question_mark().map(Some));

/// `&`
const AMP: ByteHandler = Some(|lexer| lexer.read_token_logical(b'&').map(Some));

/// `|`
const PIP: ByteHandler = Some(|lexer| lexer.read_token_logical(b'|').map(Some));

macro_rules! single_char {
    ($name:ident, $c:literal, $token:ident) => {
        const $name: ByteHandler = Some(|lexer| {
            lexer.input.bump_bytes(1);
            Ok(Some(Token::$token))
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
    lexer.input.bump_bytes(1);
    Ok(Some(if lexer.input.cur_as_ascii() == Some(b'=') {
        lexer.input.bump_bytes(1);
        Token::AssignOp(AssignOp::BitXorAssign)
    } else {
        Token::BinOp(BinOpToken::BitXor)
    }))
});

/// `+`
const PLS: ByteHandler = Some(|lexer| lexer.read_token_plus_minus(b'+'));

/// `-`
const MIN: ByteHandler = Some(|lexer| lexer.read_token_plus_minus(b'-'));

/// `!`
const EXL: ByteHandler = Some(|lexer| lexer.read_token_bang_or_eq(b'!'));

/// `=`
const EQL: ByteHandler = Some(|lexer| lexer.read_token_bang_or_eq(b'='));

/// `.`
const PRD: ByteHandler = Some(|lexer| lexer.read_token_dot().map(Some));

/// `<`
const LSS: ByteHandler = Some(|lexer| lexer.read_token_lt_gt());

/// `>`
const MOR: ByteHandler = Some(|lexer| lexer.read_token_lt_gt());

/// `/`
const SLH: ByteHandler = Some(|lexer| lexer.read_slash());

/// `#`
const HSH: ByteHandler = Some(|lexer| lexer.read_token_number_sign());
