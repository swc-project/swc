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

pub const MAX_KNOWN_IDENT_LEN: usize = 16;
pub const fn create_fn_table(list: &[&str]) -> [bool; MAX_KNOWN_IDENT_LEN] {
    let mut table = [false; MAX_KNOWN_IDENT_LEN];
    let mut index = 0;
    while index < list.len() {
        let item = list[index];
        let len = item.len();
        if len >= MAX_KNOWN_IDENT_LEN || len == 0 {
            unreachable!()
        }
        table[len] = true;
        index += 1;
    }
    table
}

#[macro_export]
macro_rules! known_ident_convert {
    ( $s:expr, $($name:literal => $variant:expr),* ) => {{
        static LEN_TABLE: [bool; MAX_KNOWN_IDENT_LEN] = create_fn_table(
            &[$($name,)*]
        );
        if $s.len() >= MAX_KNOWN_IDENT_LEN || !LEN_TABLE[$s.len()] {
            None
        } else {
            debug_assert!($s.len() > 0);
            match $s {
                $($name => Some($variant),)*
                _ => None,
            }
        }
    }};
}

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
            "abstract" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Abstract))),
            "as" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::As))),
            "await" => Token::Word(Word::Keyword(Keyword::Await)),
            "async" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Async))),
            "assert" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Assert))),
            "asserts" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Asserts))),
            "any" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Any))),
            "accessor" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Accessor)))
        );
        token
    })
});

const L_B: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "break" => Token::Word(Word::Keyword(Keyword::Break)),
            "boolean" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Boolean))),
            "bigint" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Bigint)))
        );
        token
    })
});

const L_C: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "case" => Token::Word(Word::Keyword(Keyword::Case)),
            "catch" => Token::Word(Word::Keyword(Keyword::Catch)),
            "class" => Token::Word(Word::Keyword(Keyword::Class)),
            "const" => Token::Word(Word::Keyword(Keyword::Const)),
            "continue" => Token::Word(Word::Keyword(Keyword::Continue))
        );
        token
    })
});

const L_D: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "debugger" => Token::Word(Word::Keyword(Keyword::Debugger)),
            "default" => Token::Word(Word::Keyword(Keyword::Default_)),
            "delete" => Token::Word(Word::Keyword(Keyword::Delete)),
            "do" => Token::Word(Word::Keyword(Keyword::Do)),
            "declare" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Declare)))
        );
        token
    })
});

const L_E: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "else" => Token::Word(Word::Keyword(Keyword::Else)),
            "enum" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Enum))),
            "export" => Token::Word(Word::Keyword(Keyword::Export)),
            "extends" => Token::Word(Word::Keyword(Keyword::Extends))
        );
        token
    })
});

const L_F: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "false" => Token::Word(Word::False),
            "finally" => Token::Word(Word::Keyword(Keyword::Finally)),
            "for" => Token::Word(Word::Keyword(Keyword::For)),
            "function" => Token::Word(Word::Keyword(Keyword::Function)),
            "from" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::From)))
        );
        token
    })
});

const L_G: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "global" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Global))),
            "get" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Get)))
        );
        token
    })
});

const L_H: ByteHandler = IDN;

const L_I: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "if" => Token::Word(Word::Keyword(Keyword::If)),
            "import" => Token::Word(Word::Keyword(Keyword::Import)),
            "in" => Token::Word(Word::Keyword(Keyword::In)),
            "instanceof" => Token::Word(Word::Keyword(Keyword::InstanceOf)),
            "is" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Is))),
            "infer" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Infer))),
            "interface" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Interface))),
            "implements" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Implements))),
            "intrinsic" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Intrinsic)))
        );
        token
    })
});

const L_J: ByteHandler = IDN;

const L_K: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "keyof" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Keyof)))
        );
        token
    })
});

const L_L: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "let" => Token::Word(Word::Keyword(Keyword::Let))
        );
        token
    })
});

const L_M: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "meta" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Meta)))
        );
        token
    })
});

const L_N: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "new" => Token::Word(Word::Keyword(Keyword::New)),
            "null" => Token::Word(Word::Null),
            "number" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Number))),
            "never" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Never))),
            "namespace" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Namespace)))
        );
        token
    })
});

const L_O: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "of" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Of))),
            "object" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Object)))
        );
        token
    })
});

const L_P: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "public" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Public))),
            "package" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Package))),
            "protected" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Protected))),
            "private" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Private)))
        );
        token
    })
});

const L_Q: ByteHandler = IDN;

const L_R: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "return" => Token::Word(Word::Keyword(Keyword::Return)),
            "readonly" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Readonly))),
            "require" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Require)))
        );
        token
    })
});

const L_S: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "super" => Token::Word(Word::Keyword(Keyword::Super)),
            "static" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Static))),
            "switch" => Token::Word(Word::Keyword(Keyword::Switch)),
            "symbol" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Symbol))),
            "set" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Set))),
            "string" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::String))),
            "satisfies" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Satisfies)))
        );
        token
    })
});

const L_T: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "this" => Token::Word(Word::Keyword(Keyword::This)),
            "throw" => Token::Word(Word::Keyword(Keyword::Throw)),
            "true" => Token::Word(Word::True),
            "typeof" => Token::Word(Word::Keyword(Keyword::TypeOf)),
            "try" => Token::Word(Word::Keyword(Keyword::Try)),
            "type" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Type))),
            "target" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Target)))
        );
        token
    })
});

const L_U: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "using" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Using))),
            "unique" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Unique))),
            "undefined" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Undefined))),
            "unknown" => Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Unknown)))
        );
        token
    })
});

const L_V: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "var" => Token::Word(Word::Keyword(Keyword::Var)),
            "void" => Token::Word(Word::Keyword(Keyword::Void))
        );
        token
    })
});

const L_W: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "while" => Token::Word(Word::Keyword(Keyword::While)),
            "with" => Token::Word(Word::Keyword(Keyword::With))
        );
        token
    })
});

const L_X: ByteHandler = IDN;

const L_Y: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        let token = known_ident_convert!(s,
            "yield" => Token::Word(Word::Keyword(Keyword::Yield))
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
