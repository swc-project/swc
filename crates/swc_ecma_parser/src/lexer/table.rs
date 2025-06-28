//! Lookup table for byte handlers.
//!
//! Idea is taken from ratel.
//!
//! https://github.com/ratel-rust/ratel-core/blob/e55a1310ba69a3f5ce2a9a6eef643feced02ac08/ratel/src/lexer/mod.rs#L665

use either::Either;
use swc_common::input::Input;
use swc_ecma_lexer::{
    common::lexer::char::CharExt,
    known_ident_convert,
    lexer::{create_fn_table, MAX_KNOWN_IDENT_LEN},
};

use super::{pos_span, LexResult, Lexer, LexerTrait};
use crate::{
    error::SyntaxError,
    lexer::token::{Token, TokenValue},
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
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "abstract" => Token::Abstract,
            "as" => Token::As,
            "await" => Token::Await,
            "async" => Token::Async,
            "assert" => Token::Assert,
            "asserts" => Token::Asserts,
            "any" => Token::Any,
            "accessor" => Token::Accessor
        );
        token
    })
});

const L_B: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "break" => Token::Break,
            "boolean" => Token::Boolean,
            "bigint" => Token::Bigint
        );
        token
    })
});

const L_C: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "case" => Token::Case,
            "catch" => Token::Catch,
            "class" => Token::Class,
            "const" => Token::Const,
            "continue" => Token::Continue
        );
        token
    })
});

const L_D: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "debugger" => Token::Debugger,
            "default" => Token::Default,
            "delete" => Token::Delete,
            "do" => Token::Do,
            "declare" => Token::Declare
        );
        token
    })
});

const L_E: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "else" => Token::Else,
            "enum" => Token::Enum,
            "export" => Token::Export,
            "extends" => Token::Extends
        );
        token
    })
});

const L_F: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "false" => Token::False,
            "finally" => Token::Finally,
            "for" => Token::For,
            "function" => Token::Function,
            "from" => Token::From
        );
        token
    })
});

const L_G: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "global" => Token::Global,
            "get" => Token::Get
        );
        token
    })
});

const L_H: ByteHandler = IDN;

const L_I: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "if" => Token::If,
            "import" => Token::Import,
            "in" => Token::In,
            "instanceof" => Token::InstanceOf,
            "is" => Token::Is,
            "infer" => Token::Infer,
            "interface" => Token::Interface,
            "implements" => Token::Implements,
            "intrinsic" => Token::Intrinsic
        );
        token
    })
});

const L_J: ByteHandler = IDN;

const L_K: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "keyof" => Token::Keyof
        );
        token
    })
});

const L_L: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "let" => Token::Let
        );
        token
    })
});

const L_M: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "meta" => Token::Meta
        );
        token
    })
});

const L_N: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "new" => Token::New,
            "null" => Token::Null,
            "number" => Token::Number,
            "never" => Token::Never,
            "namespace" => Token::Namespace
        );
        token
    })
});

const L_O: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "of" => Token::Of,
            "object" => Token::Object,
            "out" => Token::Out,
            "override" => Token::Override
        );
        token
    })
});

const L_P: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "public" => Token::Public,
            "package" => Token::Package,
            "protected" => Token::Protected,
            "private" => Token::Private
        );
        token
    })
});

const L_Q: ByteHandler = IDN;

const L_R: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "return" => Token::Return,
            "readonly" => Token::Readonly,
            "require" => Token::Require
        );
        token
    })
});

const L_S: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "super" => Token::Super,
            "static" => Token::Static,
            "switch" => Token::Switch,
            "symbol" => Token::Symbol,
            "set" => Token::Set,
            "string" => Token::String,
            "satisfies" => Token::Satisfies
        );
        token
    })
});

const L_T: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "this" => Token::This,
            "throw" => Token::Throw,
            "true" => Token::True,
            "typeof" => Token::TypeOf,
            "try" => Token::Try,
            "type" => Token::Type,
            "target" => Token::Target
        );
        token
    })
});

const L_U: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "using" => Token::Using,
            "unique" => Token::Unique,
            "undefined" => Token::Undefined,
            "unknown" => Token::Unknown
        );
        token
    })
});

const L_V: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "var" => Token::Var,
            "void" => Token::Void
        );
        token
    })
});

const L_W: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "while" => Token::While,
            "with" => Token::With
        );
        token
    })
});

const L_X: ByteHandler = IDN;

const L_Y: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "yield" => Token::Yield
        );
        token
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
            Either::Left((value, raw)) => {
                lexer.state.set_token_value(TokenValue::Num { value, raw });
                Token::Num
            }
            Either::Right((value, raw)) => {
                lexer
                    .state
                    .set_token_value(TokenValue::BigInt { value, raw });
                Token::BigInt
            }
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
const PRC: ByteHandler = Some(|lexer| lexer.read_token_mul_mod(false).map(Some));

/// `*`
const ATR: ByteHandler = Some(|lexer| lexer.read_token_mul_mod(true).map(Some));

/// `?`
const QST: ByteHandler = Some(|lexer| lexer.read_token_question_mark().map(Some));

/// `&`
const AMP: ByteHandler = Some(|lexer| lexer.read_token_logical::<b'&'>().map(Some));

/// `|`
const PIP: ByteHandler = Some(|lexer| lexer.read_token_logical::<b'|'>().map(Some));

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

/// `\``
const TPL: ByteHandler = Some(|lexer| lexer.read_token_back_quote());

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
        Token::BitXorEq
    } else {
        Token::Caret
    }))
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
const PRD: ByteHandler = Some(|lexer| lexer.read_token_dot().map(Some));

/// `<`
const LSS: ByteHandler = Some(|lexer| lexer.read_token_lt_gt::<b'<'>());

/// `>`
const MOR: ByteHandler = Some(|lexer| lexer.read_token_lt_gt::<b'>'>());

/// `/`
const SLH: ByteHandler = Some(|lexer| lexer.read_slash());

/// `#`
const HSH: ByteHandler = Some(|lexer| lexer.read_token_number_sign());
