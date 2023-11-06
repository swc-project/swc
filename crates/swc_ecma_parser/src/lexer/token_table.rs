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
    token::{BinOpToken, Token},
};

pub(super) type ByteHandler = Option<for<'aa> fn(&mut Lexer<'aa>) -> LexResult<Option<Token>>>;

/// Lookup table mapping any incoming byte to a handler function defined below.
pub(super) static BYTE_HANDLERS: [ByteHandler; 256] = [
    //   0    1    2    3    4    5    6    7    8    9    A    B    C    D    E    F   //
    EOF, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 0
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 1
    ___, EXL, QOT, HSH, IDT, PRC, AMP, QOT, PNO, PNC, ATR, PLS, COM, MIN, PRD, SLH, // 2
    ZER, DIG, DIG, DIG, DIG, DIG, DIG, DIG, DIG, DIG, COL, SEM, LSS, EQL, MOR, QST, // 3
    AT_, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, // 4
    IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, BTO, IDT, BTC, CRT, IDT, // 5
    TPL, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, // 6
    IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, BEO, PIP, BEC, TLD, ERR, // 7
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

/// Identifier
const IDT: ByteHandler = Some(|lexer| lexer.read_ident_or_keyword().map(Some));

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
        return lexer.read_ident_or_keyword().map(Some);
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
