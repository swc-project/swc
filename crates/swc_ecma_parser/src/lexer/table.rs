//! Lookup table for byte handlers.
//!
//! Idea is taken from ratel.
//!
//! https://github.com/ratel-rust/ratel-core/blob/e55a1310ba69a3f5ce2a9a6eef643feced02ac08/ratel/src/lexer/mod.rs#L665

use either::Either;
use swc_common::input::Input;
use swc_ecma_lexer::{common::lexer::char::CharExt, lexer::table::kw};

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
        debug_assert!(s.starts_with("a"));
        match &s[1..] {
            kw::AWAIT => Some(Token::Await),
            kw::ASYNC => Some(Token::Async),
            kw::ANY => Some(Token::Any),
            kw::ABSTRACT => Some(Token::Abstract),
            kw::AS => Some(Token::As),
            kw::ASSERT => Some(Token::Assert),
            kw::ASSERTS => Some(Token::Asserts),
            kw::ACCESSOR => Some(Token::Accessor),
            _ => None,
        }
    })
});

const L_B: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("b"));
        match &s[1..] {
            kw::BREAK => Some(Token::Break),
            kw::BOOLEAN => Some(Token::Boolean),
            kw::BIGINT => Some(Token::Bigint),
            _ => None,
        }
    })
});

const L_C: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("c"));
        match &s[1..] {
            kw::CLASS => Some(Token::Class),
            kw::CONST => Some(Token::Const),
            kw::CONTINUE => Some(Token::Continue),
            kw::CASE => Some(Token::Case),
            kw::CATCH => Some(Token::Catch),
            _ => None,
        }
    })
});

const L_D: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("d"));
        match &s[1..] {
            kw::DEFAULT => Some(Token::Default),
            kw::DECLARE => Some(Token::Declare),
            kw::DEBUGGER => Some(Token::Debugger),
            kw::DO => Some(Token::Do),
            kw::DELETE => Some(Token::Delete),
            _ => None,
        }
    })
});

const L_E: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("e"));
        match &s[1..] {
            kw::ELSE => Some(Token::Else),
            kw::EXPORT => Some(Token::Export),
            kw::ENUM => Some(Token::Enum),
            kw::EXTENDS => Some(Token::Extends),
            _ => None,
        }
    })
});

const L_F: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("f"));
        match &s[1..] {
            kw::FALSE => Some(Token::False),
            kw::FOR => Some(Token::For),
            kw::FUNCTION => Some(Token::Function),
            kw::FROM => Some(Token::From),
            kw::FINALLY => Some(Token::Finally),
            _ => None,
        }
    })
});

const L_G: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("g"));
        match &s[1..] {
            kw::GLOBAL => Some(Token::Global),
            kw::GET => Some(Token::Get),
            _ => None,
        }
    })
});

const L_H: ByteHandler = IDN;

const L_I: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("i"));
        match &s[1..] {
            kw::IF => Some(Token::If),
            kw::IMPORT => Some(Token::Import),
            kw::IN => Some(Token::In),
            kw::INSTANCEOF => Some(Token::InstanceOf),
            kw::IS => Some(Token::Is),
            kw::INFER => Some(Token::Infer),
            kw::INTERFACE => Some(Token::Interface),
            kw::IMPLEMENTS => Some(Token::Implements),
            kw::INTRINSIC => Some(Token::Intrinsic),
            _ => None,
        }
    })
});

const L_J: ByteHandler = IDN;

const L_K: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("k"));
        match &s[1..] {
            kw::KEYOF => Some(Token::Keyof),
            _ => None,
        }
    })
});

const L_L: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("l"));
        match &s[1..] {
            kw::LET => Some(Token::Let),
            _ => None,
        }
    })
});

const L_M: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("m"));
        match &s[1..] {
            kw::META => Some(Token::Meta),
            _ => None,
        }
    })
});

const L_N: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("n"));
        match &s[1..] {
            kw::NEW => Some(Token::New),
            kw::NULL => Some(Token::Null),
            kw::NUMBER => Some(Token::Number),
            kw::NEVER => Some(Token::Never),
            kw::NAMESPACE => Some(Token::Namespace),
            _ => None,
        }
    })
});

const L_O: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("o"));
        match &s[1..] {
            kw::OF => Some(Token::Of),
            kw::OBJECT => Some(Token::Object),
            kw::OUT => Some(Token::Out),
            kw::OVERRIDE => Some(Token::Override),
            _ => None,
        }
    })
});

const L_P: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("p"));
        match &s[1..] {
            kw::PUBLIC => Some(Token::Public),
            kw::PRIVATE => Some(Token::Private),
            kw::PROTECTED => Some(Token::Protected),
            kw::PACKAGE => Some(Token::Package),
            _ => None,
        }
    })
});

const L_Q: ByteHandler = IDN;

const L_R: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("r"));
        match &s[1..] {
            kw::RETURN => Some(Token::Return),
            kw::REQUIRE => Some(Token::Require),
            kw::READONLY => Some(Token::Readonly),
            _ => None,
        }
    })
});

const L_S: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("s"));
        match &s[1..] {
            kw::SUPER => Some(Token::Super),
            kw::STATIC => Some(Token::Static),
            kw::SWITCH => Some(Token::Switch),
            kw::SYMBOL => Some(Token::Symbol),
            kw::SET => Some(Token::Set),
            kw::STRING => Some(Token::String),
            kw::SATISFIES => Some(Token::Satisfies),
            _ => None,
        }
    })
});

const L_T: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("t"));
        match &s[1..] {
            kw::THIS => Some(Token::This),
            kw::TRUE => Some(Token::True),
            kw::TYPE => Some(Token::Type),
            kw::TYPEOF => Some(Token::TypeOf),
            kw::THROW => Some(Token::Throw),
            kw::TRY => Some(Token::Try),
            kw::TARGET => Some(Token::Target),
            _ => None,
        }
    })
});

const L_U: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("u"));
        match &s[1..] {
            kw::UNDEFINED => Some(Token::Undefined),
            kw::USING => Some(Token::Using),
            kw::UNIQUE => Some(Token::Unique),
            kw::UNKNOWN => Some(Token::Unknown),
            _ => None,
        }
    })
});

const L_V: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("v"));
        match &s[1..] {
            kw::VAR => Some(Token::Var),
            kw::VOID => Some(Token::Void),
            _ => None,
        }
    })
});

const L_W: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("w"));
        match &s[1..] {
            kw::WHILE => Some(Token::While),
            kw::WITH => Some(Token::With),
            _ => None,
        }
    })
});

const L_X: ByteHandler = IDN;

const L_Y: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("y"));
        match &s[1..] {
            kw::YIELD => Some(Token::Yield),
            _ => None,
        }
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
