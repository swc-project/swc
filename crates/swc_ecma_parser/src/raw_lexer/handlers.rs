use super::{error::RawLexResult, RawLexer, RawTokenKind, RawTokenValue};

// TODO: using macro
// macro_rules! match_token {
//     ($lex: ident { $($match:expr => $cont:tt)*, _ => $default_token:expr })
// => {         match $lex.peek_byte() {
//             $(
//                 Some($match) => {
//                     $lex.consume_byte();
//                     match_token!($lex $cont)
//                 }
//             )*,
//             _ => $default_token,
//         }
//     };
//     ($lex: ident $cont:tt) => {
//         $cont
//     }
// }

// fork from jsparagus
/// U+000A LINE FEED, abbreviated in the spec as <LF>.
const LF: u8 = '\u{000A}' as u8;

/// U+000D CARRIAGE RETURN, abbreviated in the spec as <CR>.
const CR: u8 = '\u{000D}' as u8;

/// U+2028 LINE SEPARATOR, abbreviated <LS>.
const LS: u8 = '\u{2028}' as u8;

/// U+2029 PARAGRAPH SEPARATOR, abbreviated <PS>.
const PS: u8 = '\u{2029}' as u8;

pub type ByteHandler = for<'source> fn(&mut RawLexer<'source>) -> RawLexResult<RawTokenKind>;

pub fn handler_from_byte(byte: u8) -> ByteHandler {
    unsafe { *(&BYTE_HANDLERS as *const ByteHandler).offset(byte as isize) }
}

/// Lookup table mapping any incoming byte to a handler function defined below.
static BYTE_HANDLERS: [ByteHandler; 256] = [
    //  0    1    2    3    4    5    6    7    8    9    A    B    C    D    E    F   //
    EOF, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 0
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 1
    SPA, EXL, QOD, HAS, IDT, PRC, AMP, QOS, PNO, PNC, ATR, PLS, COM, MIN, PRD, SLH, // 2
    ZER, DIG, DIG, DIG, DIG, DIG, DIG, DIG, DIG, DIG, COL, SEM, LSS, EQL, MOR, QST, // 3
    ERR, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, // 4
    IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, BTO, IDT, BTC, CRT, IDT, // 5
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

const ___: ByteHandler = |lex| {
    lex.consume_byte();

    Ok(RawTokenKind::default())
};

const EOF: ByteHandler = |_| Ok(RawTokenKind::Eof);

/// <SPA>
const SPA: ByteHandler = |lex| {
    lex.consume_byte();

    Ok(RawTokenKind::WhiteSpace)
};

/// '!'
const EXL: ByteHandler = |lex| {
    lex.consume_byte();

    if let Some(b'=') = lex.peek_byte() {
        lex.consume_byte();
        if let Some(b'=') = lex.peek_byte() {
            lex.consume_byte();
            Ok(RawTokenKind::NotEqEqOp)
        } else {
            Ok(RawTokenKind::NotEqOp)
        }
    } else {
        Ok(RawTokenKind::Bang)
    }
};

// "
const QOD: ByteHandler = |lex| {
    lex.consume_byte();
    let string_literal = lex.read_string_literal(b'"')?;
    lex.token_value = Some(RawTokenValue::String(string_literal.into()));

    Ok(RawTokenKind::Str)
};

// '
const QOS: ByteHandler = |lex| {
    lex.consume_byte();
    let string_literal = lex.read_string_literal(b'\'')?;
    lex.token_value = Some(RawTokenValue::String(string_literal.into()));

    Ok(RawTokenKind::Str)
};

// #
const HAS: ByteHandler = |lex| {
    // it is a hashbang comment
    if lex.offset() == 0 {
        lex.consume_byte();
        if lex.peek_byte() == Some(b'!') {
            lex.consume_byte();
            let hashbang_comment = lex.consume_until(|next_byte: u8| {
                next_byte == LF || next_byte == CR || next_byte == LS || next_byte == PS
            });
            lex.token_value = Some(RawTokenValue::String(hashbang_comment.into()));
            // consume LineTerminator
            lex.consume_byte();
            Ok(RawTokenKind::HashbangComment)
        } else {
            Ok(RawTokenKind::Hash)
        }
    } else {
        lex.consume_byte();
        Ok(RawTokenKind::Hash)
    }
};

// Identifier
const IDT: ByteHandler = |lex| todo!();

// %
const PRC: ByteHandler = |lex| {
    lex.consume_byte();
    if lex.peek_byte() == Some(b'=') {
        lex.consume_byte();
        Ok(RawTokenKind::ModAssignOp)
    } else {
        Ok(RawTokenKind::ModOp)
    }
};

/// '&'
const AMP: ByteHandler = |lex| {
    lex.consume_byte();

    if lex.peek_byte() == Some(b'&') {
        lex.consume_byte();
        if lex.peek_byte() == Some(b'=') {
            lex.consume_byte();
            Ok(RawTokenKind::AndAssignOp)
        } else {
            Ok(RawTokenKind::LogicalAndOp)
        }
    } else if lex.peek_byte() == Some(b'=') {
        lex.consume_byte();
        Ok(RawTokenKind::BitAndAssignOp)
    } else {
        Ok(RawTokenKind::BitAndOp)
    }
};

/// '('
const PNO: ByteHandler = |lex| {
    lex.consume_byte();

    Ok(RawTokenKind::LParen)
};

/// ')'
const PNC: ByteHandler = |lex| {
    lex.consume_byte();

    Ok(RawTokenKind::RParen)
};

/// '*'
const ATR: ByteHandler = |lex| {
    lex.consume_byte();

    match lex.peek_byte() {
        Some(b'=') => {
            lex.consume_byte();
            Ok(RawTokenKind::MulAssign)
        }
        Some(b'*') => {
            lex.consume_byte();
            match lex.peek_byte() {
                Some(b'=') => Ok(RawTokenKind::ExpAssign),
                _ => Ok(RawTokenKind::Exp),
            }
        }
        _ => Ok(RawTokenKind::Mul),
    }
};

/// `+`
const PLS: ByteHandler = |lex| {
    lex.consume_byte();

    match lex.peek_byte() {
        Some(b'+') => {
            // consume '+'
            lex.consume_byte();
            Ok(RawTokenKind::PlusPlus)
        }
        Some(b'=') => {
            lex.consume_byte();
            Ok(RawTokenKind::AddAssignOp)
        }
        _ => Ok(RawTokenKind::AddOp),
    }
};

/// `-`
const MIN: ByteHandler = |lex| {
    lex.consume_byte();

    match lex.peek_byte() {
        Some(b'-') => {
            // consume '+'
            lex.consume_byte();
            Ok(RawTokenKind::MinusMinus)
        }
        Some(b'=') => {
            lex.consume_byte();
            Ok(RawTokenKind::SubAssignOp)
        }
        _ => Ok(RawTokenKind::SubOp),
    }
};

/// ','
const COM: ByteHandler = |lex| {
    lex.consume_byte();
    Ok(RawTokenKind::Comma)
};

/// `.`
const PRD: ByteHandler = |lex| {
    lex.consume_byte();

    if lex.peek_byte() == Some(b'.') && lex.peek_2_byte() == Some(b'.') {
        // consume twice dot
        lex.consume_byte();
        lex.consume_byte();
        Ok(RawTokenKind::DotDotDot)
    } else {
        Ok(RawTokenKind::Dot)
    }
};

/// `/`
const SLH: ByteHandler = |lex| {
    lex.consume_byte();

    match lex.peek_byte() {
        Some(b'=') => {
            lex.consume_byte();
            Ok(RawTokenKind::DivAssignOp)
        }
        _ => Ok(RawTokenKind::DivOp),
    }
};

/// '0'
const ZER: ByteHandler = |lex| todo!();

/// digit
const DIG: ByteHandler = |lex| todo!();

/// ':'
const COL: ByteHandler = |lex| {
    lex.consume_byte();

    Ok(RawTokenKind::Colon)
};

/// ';'
const SEM: ByteHandler = |lex| {
    lex.consume_byte();

    Ok(RawTokenKind::Semi)
};

/// '<'
const LSS: ByteHandler = |lex| todo!();

/// '='
const EQL: ByteHandler = |lex| {
    lex.consume_byte();

    match lex.peek_byte() {
        Some(b'=') => {
            todo!("implement ==, ===, =======");
            lex.consume_byte();
            Ok(RawTokenKind::EqEqOp)
        }
        Some(b'>') => {
            lex.consume_byte();
            Ok(RawTokenKind::Arrow)
        }
        _ => Ok(RawTokenKind::AssignOp),
    }
};

/// '>'
const MOR: ByteHandler = |lex| todo!();

/// '?'
const QST: ByteHandler = |lex| todo!();

/// '@'
const ERR: ByteHandler = |lex| {
    lex.consume_byte();

    Ok(RawTokenKind::At)
};

/// '['
const BTO: ByteHandler = |lex| todo!();

/// ']'
const BTC: ByteHandler = |lex| todo!();

/// `^`
const CRT: ByteHandler = |lex| todo!();

/// '`'
const TPL: ByteHandler = |lex| {
    lex.consume_byte();

    Ok(RawTokenKind::BackQuote)
};

/// 'a'
const L_A: ByteHandler = |lex| todo!();

/// 'b'
const L_B: ByteHandler = |lex| todo!();

/// 'c'
const L_C: ByteHandler = |lex| todo!();

/// 'd'
const L_D: ByteHandler = |lex| todo!();

/// 'e'
const L_E: ByteHandler = |lex| todo!();

/// 'f'
const L_F: ByteHandler = |lex| todo!();

/// 'g'
const L_G: ByteHandler = |lex| todo!();

/// 'h'
const L_H: ByteHandler = |lex| todo!();

/// 'i'
const L_I: ByteHandler = |lex| todo!();

/// 'j'
const L_J: ByteHandler = |lex| todo!();

/// 'k'
const L_K: ByteHandler = |lex| todo!();

/// 'l'
const L_L: ByteHandler = |lex| todo!();

/// 'm'
const L_M: ByteHandler = |lex| todo!();

/// 'n'
const L_N: ByteHandler = |lex| todo!();

/// 'o'
const L_O: ByteHandler = |lex| todo!();

/// 'p'
const L_P: ByteHandler = |lex| todo!();

/// 'q'
const L_Q: ByteHandler = |lex| todo!();

/// 'r'
const L_R: ByteHandler = |lex| todo!();

/// 's'
const L_S: ByteHandler = |lex| todo!();

/// 't'
const L_T: ByteHandler = |lex| todo!();

/// 'u'
const L_U: ByteHandler = |lex| todo!();

/// 'v'
const L_V: ByteHandler = |lex| todo!();

/// 'w'
const L_W: ByteHandler = |lex| todo!();

/// 'x'
const L_X: ByteHandler = |lex| todo!();

/// 'y'
const L_Y: ByteHandler = |lex| todo!();

/// 'z'
const L_Z: ByteHandler = |lex| todo!();

/// '{'
const BEO: ByteHandler = |lex| {
    lex.consume_byte();

    Ok(RawTokenKind::LBracket)
};

/// '|'
const PIP: ByteHandler = |lex| todo!();

/// '}'
const BEC: ByteHandler = |lex| {
    lex.consume_byte();

    Ok(RawTokenKind::RBracket)
};

/// '~'
const TLD: ByteHandler = |lex| todo!();

/// Unicode
const UNI: ByteHandler = |lex| todo!();
