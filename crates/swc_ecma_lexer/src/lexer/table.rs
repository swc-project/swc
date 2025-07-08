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

pub mod kw {
    const fn remove_first_char(s: &'static str) -> &'static str {
        let bytes = s.as_bytes();
        assert!(!bytes.is_empty());
        let ptr = unsafe { bytes.as_ptr().add(1) };
        let new_bytes = unsafe { std::slice::from_raw_parts(ptr, bytes.len() - 1) };
        unsafe { std::str::from_utf8_unchecked(new_bytes) }
    }
    pub const ABSTRACT: &str = remove_first_char("abstract");
    pub const AS: &str = remove_first_char("as");
    pub const AWAIT: &str = remove_first_char("await");
    pub const ASYNC: &str = remove_first_char("async");
    pub const ASSERT: &str = remove_first_char("assert");
    pub const ASSERTS: &str = remove_first_char("asserts");
    pub const ANY: &str = remove_first_char("any");
    pub const ACCESSOR: &str = remove_first_char("accessor");
    pub const BREAK: &str = remove_first_char("break");
    pub const BOOLEAN: &str = remove_first_char("boolean");
    pub const BIGINT: &str = remove_first_char("bigint");
    pub const CLASS: &str = remove_first_char("class");
    pub const CONST: &str = remove_first_char("const");
    pub const CONTINUE: &str = remove_first_char("continue");
    pub const CASE: &str = remove_first_char("case");
    pub const CATCH: &str = remove_first_char("catch");
    pub const DEBUGGER: &str = remove_first_char("debugger");
    pub const DEFAULT: &str = remove_first_char("default");
    pub const DELETE: &str = remove_first_char("delete");
    pub const DO: &str = remove_first_char("do");
    pub const DECLARE: &str = remove_first_char("declare");
    pub const ELSE: &str = remove_first_char("else");
    pub const EXPORT: &str = remove_first_char("export");
    pub const EXTENDS: &str = remove_first_char("extends");
    pub const ENUM: &str = remove_first_char("enum");
    pub const FALSE: &str = remove_first_char("false");
    pub const FOR: &str = remove_first_char("for");
    pub const FUNCTION: &str = remove_first_char("function");
    pub const FINALLY: &str = remove_first_char("finally");
    pub const FROM: &str = remove_first_char("from");
    pub const GLOBAL: &str = remove_first_char("global");
    pub const GET: &str = remove_first_char("get");
    pub const IF: &str = remove_first_char("if");
    pub const IMPORT: &str = remove_first_char("import");
    pub const IN: &str = remove_first_char("in");
    pub const INSTANCEOF: &str = remove_first_char("instanceof");
    pub const IS: &str = remove_first_char("is");
    pub const INFER: &str = remove_first_char("infer");
    pub const INTERFACE: &str = remove_first_char("interface");
    pub const IMPLEMENTS: &str = remove_first_char("implements");
    pub const INTRINSIC: &str = remove_first_char("intrinsic");
    pub const KEYOF: &str = remove_first_char("keyof");
    pub const LET: &str = remove_first_char("let");
    pub const META: &str = remove_first_char("meta");
    pub const NEW: &str = remove_first_char("new");
    pub const NULL: &str = remove_first_char("null");
    pub const NUMBER: &str = remove_first_char("number");
    pub const NEVER: &str = remove_first_char("never");
    pub const NAMESPACE: &str = remove_first_char("namespace");
    pub const OF: &str = remove_first_char("of");
    pub const OBJECT: &str = remove_first_char("object");
    pub const OUT: &str = remove_first_char("out");
    pub const OVERRIDE: &str = remove_first_char("override");
    pub const PUBLIC: &str = remove_first_char("public");
    pub const PACKAGE: &str = remove_first_char("package");
    pub const PROTECTED: &str = remove_first_char("protected");
    pub const PRIVATE: &str = remove_first_char("private");
    pub const RETURN: &str = remove_first_char("return");
    pub const REQUIRE: &str = remove_first_char("require");
    pub const READONLY: &str = remove_first_char("readonly");
    pub const SUPER: &str = remove_first_char("super");
    pub const STATIC: &str = remove_first_char("static");
    pub const SWITCH: &str = remove_first_char("switch");
    pub const SYMBOL: &str = remove_first_char("symbol");
    pub const SET: &str = remove_first_char("get");
    pub const STRING: &str = remove_first_char("string");
    pub const SATISFIES: &str = remove_first_char("satisfies");
    pub const THIS: &str = remove_first_char("this");
    pub const TRUE: &str = remove_first_char("true");
    pub const TYPE: &str = remove_first_char("type");
    pub const TYPEOF: &str = remove_first_char("typeof");
    pub const THROW: &str = remove_first_char("throw");
    pub const TRY: &str = remove_first_char("try");
    pub const TARGET: &str = remove_first_char("target");
    pub const UNDEFINED: &str = remove_first_char("undefined");
    pub const USING: &str = remove_first_char("using");
    pub const UNIQUE: &str = remove_first_char("unique");
    pub const UNKNOWN: &str = remove_first_char("unknown");
    pub const VAR: &str = remove_first_char("var");
    pub const VOID: &str = remove_first_char("void");
    pub const WHILE: &str = remove_first_char("while");
    pub const WITH: &str = remove_first_char("with");
    pub const YIELD: &str = remove_first_char("yield");
}

const L_A: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with('a'));
        match &s[1..] {
            kw::AWAIT => Some(Token::Word(Word::Keyword(Keyword::Await))),
            kw::ASYNC => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Async,
            )))),
            kw::ANY => Some(Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Any)))),
            kw::ABSTRACT => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Abstract,
            )))),
            kw::AS => Some(Token::Word(Word::Ident(IdentLike::Known(KnownIdent::As)))),
            kw::ASSERT => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Assert,
            )))),
            kw::ASSERTS => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Asserts,
            )))),
            kw::ACCESSOR => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Accessor,
            )))),
            _ => None,
        }
    })
});

const L_B: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("b"));
        match &s[1..] {
            kw::BREAK => Some(Token::Word(Word::Keyword(Keyword::Break))),
            kw::BOOLEAN => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Boolean,
            )))),
            kw::BIGINT => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Bigint,
            )))),
            _ => None,
        }
    })
});

const L_C: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("c"));
        match &s[1..] {
            kw::CLASS => Some(Token::Word(Word::Keyword(Keyword::Class))),
            kw::CONST => Some(Token::Word(Word::Keyword(Keyword::Const))),
            kw::CONTINUE => Some(Token::Word(Word::Keyword(Keyword::Continue))),
            kw::CASE => Some(Token::Word(Word::Keyword(Keyword::Case))),
            kw::CATCH => Some(Token::Word(Word::Keyword(Keyword::Catch))),
            _ => None,
        }
    })
});

const L_D: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("d"));
        match &s[1..] {
            kw::DEFAULT => Some(Token::Word(Word::Keyword(Keyword::Default_))),
            kw::DELETE => Some(Token::Word(Word::Keyword(Keyword::Delete))),
            kw::DEBUGGER => Some(Token::Word(Word::Keyword(Keyword::Debugger))),
            kw::DO => Some(Token::Word(Word::Keyword(Keyword::Do))),
            kw::DECLARE => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Declare,
            )))),
            _ => None,
        }
    })
});

const L_E: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("e"));
        match &s[1..] {
            kw::ELSE => Some(Token::Word(Word::Keyword(Keyword::Else))),
            kw::EXPORT => Some(Token::Word(Word::Keyword(Keyword::Export))),
            kw::ENUM => Some(Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Enum)))),
            kw::EXTENDS => Some(Token::Word(Word::Keyword(Keyword::Extends))),
            _ => None,
        }
    })
});

const L_F: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("f"));
        match &s[1..] {
            kw::FALSE => Some(Token::Word(Word::False)),
            kw::FOR => Some(Token::Word(Word::Keyword(Keyword::For))),
            kw::FUNCTION => Some(Token::Word(Word::Keyword(Keyword::Function))),
            kw::FROM => Some(Token::Word(Word::Ident(IdentLike::Known(KnownIdent::From)))),
            kw::FINALLY => Some(Token::Word(Word::Keyword(Keyword::Finally))),
            _ => None,
        }
    })
});

const L_G: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("g"));
        match &s[1..] {
            kw::GLOBAL => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Global,
            )))),
            kw::GET => Some(Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Get)))),
            _ => None,
        }
    })
});

const L_H: ByteHandler = IDN;

const L_I: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("i"));
        match &s[1..] {
            kw::IF => Some(Token::Word(Word::Keyword(Keyword::If))),
            kw::IMPORT => Some(Token::Word(Word::Keyword(Keyword::Import))),
            kw::IN => Some(Token::Word(Word::Keyword(Keyword::In))),
            kw::INSTANCEOF => Some(Token::Word(Word::Keyword(Keyword::InstanceOf))),
            kw::IS => Some(Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Is)))),
            kw::INFER => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Infer,
            )))),
            kw::INTERFACE => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Interface,
            )))),
            kw::IMPLEMENTS => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Implements,
            )))),
            kw::INTRINSIC => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Intrinsic,
            )))),
            _ => None,
        }
    })
});

const L_J: ByteHandler = IDN;

const L_K: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("k"));
        match &s[1..] {
            kw::KEYOF => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Keyof,
            )))),
            _ => None,
        }
    })
});

const L_L: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("l"));
        match &s[1..] {
            kw::LET => Some(Token::Word(Word::Keyword(Keyword::Let))),
            _ => None,
        }
    })
});

const L_M: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("m"));
        match &s[1..] {
            kw::META => Some(Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Meta)))),
            _ => None,
        }
    })
});

const L_N: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("n"));
        match &s[1..] {
            kw::NEW => Some(Token::Word(Word::Keyword(Keyword::New))),
            kw::NULL => Some(Token::Word(Word::Null)),
            kw::NUMBER => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Number,
            )))),
            kw::NEVER => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Never,
            )))),
            kw::NAMESPACE => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Namespace,
            )))),
            _ => None,
        }
    })
});

const L_O: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("o"));
        match &s[1..] {
            kw::OF => Some(Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Of)))),
            kw::OBJECT => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Object,
            )))),
            _ => None,
        }
    })
});

const L_P: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("p"));
        match &s[1..] {
            kw::PUBLIC => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Public,
            )))),
            kw::PACKAGE => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Package,
            )))),
            kw::PROTECTED => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Protected,
            )))),
            kw::PRIVATE => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Private,
            )))),
            _ => None,
        }
    })
});

const L_Q: ByteHandler = IDN;

const L_R: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("r"));
        match &s[1..] {
            kw::RETURN => Some(Token::Word(Word::Keyword(Keyword::Return))),
            kw::READONLY => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Readonly,
            )))),
            kw::REQUIRE => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Require,
            )))),
            _ => None,
        }
    })
});

const L_S: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("s"));
        match &s[1..] {
            kw::SUPER => Some(Token::Word(Word::Keyword(Keyword::Super))),
            kw::STATIC => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Static,
            )))),
            kw::SWITCH => Some(Token::Word(Word::Keyword(Keyword::Switch))),
            kw::SYMBOL => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Symbol,
            )))),
            kw::SET => Some(Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Set)))),
            kw::STRING => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::String,
            )))),
            kw::SATISFIES => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Satisfies,
            )))),
            _ => None,
        }
    })
});

const L_T: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("t"));
        match &s[1..] {
            kw::THIS => Some(Token::Word(Word::Keyword(Keyword::This))),
            kw::THROW => Some(Token::Word(Word::Keyword(Keyword::Throw))),
            kw::TRUE => Some(Token::Word(Word::True)),
            kw::TYPEOF => Some(Token::Word(Word::Keyword(Keyword::TypeOf))),
            kw::TRY => Some(Token::Word(Word::Keyword(Keyword::Try))),
            kw::TYPE => Some(Token::Word(Word::Ident(IdentLike::Known(KnownIdent::Type)))),
            kw::TARGET => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Target,
            )))),
            _ => None,
        }
    })
});

const L_U: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("u"));
        match &s[1..] {
            kw::UNDEFINED => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Undefined,
            )))),
            kw::USING => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Using,
            )))),
            kw::UNIQUE => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Unique,
            )))),

            kw::UNKNOWN => Some(Token::Word(Word::Ident(IdentLike::Known(
                KnownIdent::Unknown,
            )))),
            _ => None,
        }
    })
});

const L_V: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("v"));
        match &s[1..] {
            kw::VAR => Some(Token::Word(Word::Keyword(Keyword::Var))),
            kw::VOID => Some(Token::Word(Word::Keyword(Keyword::Void))),
            _ => None,
        }
    })
});

const L_W: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("w"));
        match &s[1..] {
            kw::WHILE => Some(Token::Word(Word::Keyword(Keyword::While))),
            kw::WITH => Some(Token::Word(Word::Keyword(Keyword::With))),
            _ => None,
        }
    })
});

const L_X: ByteHandler = IDN;

const L_Y: ByteHandler = Some(|lexer| {
    lexer.read_word_with(&|s| {
        debug_assert!(s.starts_with("y"));
        match &s[1..] {
            kw::YIELD => Some(Token::Word(Word::Keyword(Keyword::Yield))),
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
