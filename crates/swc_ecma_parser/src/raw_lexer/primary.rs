use super::{
    context::RawLexerContext, error::RawLexResult, unicode::LF, ByteHandler, RawLexer,
    RawTokenKind, RawTokenValue,
};
use crate::{error::SyntaxError, lexer::util::CharExt};

// TODO: using macro to match token
// ## For example
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
// ## Usage
// match_token!(lexer {
//   b'*' {
//      b'=' => RawToken::MulAssign,
//      b'*' => RawToken::Exp,
//      _    => RawToken::Mul
//   }
// })

impl RawLexer<'_> {
    fn match_identifier_or_keyword(
        &mut self,
        matches: impl FnOnce(&str) -> RawTokenKind,
    ) -> RawLexResult<RawTokenKind> {
        let mut identifier_or_keyword = String::new();
        let identifier_start =
            self.next_byte()
                .expect("Should have a char as identifier start") as char;
        identifier_or_keyword.push(identifier_start);
        self.identifier_part(&mut identifier_or_keyword)?;

        match matches(&identifier_or_keyword) {
            ident @ RawTokenKind::Identifier => {
                self.token.value = Some(RawTokenValue::String(identifier_or_keyword.into()));
                Ok(ident)
            }
            other => Ok(other),
        }
    }
}

pub(super) fn handler_from_byte(byte: u8) -> ByteHandler {
    unsafe { BYTE_HANDLERS[byte as usize] }
}

/// Lookup table mapping any incoming byte to a handler function defined below.
static BYTE_HANDLERS: [ByteHandler; 256] = [
    //  0    1    2    3    4    5    6    7    8    9    A    B    C    D    E    F
    EOF, ERR, ERR, ERR, ERR, ERR, ERR, ERR, ERR, SPA, LIN, ERR, ERR, LIN, ERR, ERR, // 0
    ERR, ERR, ERR, ERR, ERR, ERR, ERR, ERR, ERR, ERR, ERR, ERR, ERR, ERR, ERR, ERR, // 1
    SPA, EXL, QOD, HAS, IDT, PRC, AMP, QOS, PNO, PNC, ATR, PLS, COM, MIN, PRD, SLH, // 2
    ZER, DIG, DIG, DIG, DIG, DIG, DIG, DIG, DIG, DIG, COL, SEM, LSS, EQL, MOR, QST, // 3
    AT_, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, // 4
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

const EOF: ByteHandler = |_| Ok(RawTokenKind::Eof);

const LIN: ByteHandler = |lex| {
    lex.consume_byte();

    // check lexer meet `LineTerminator` or `LineTerminatorSequence`
    lex.token.is_on_new_line = true;

    Ok(RawTokenKind::Skip)
};

/// `\0` or '\1'
const ERR: ByteHandler = |lex| {
    let start = lex.offset();
    // SAFETY: xx
    let ch = lex.next_char().unwrap();

    lex.error(start, lex.offset(), SyntaxError::UnexpectedChar { c: ch })
};

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

// `"`
const QOD: ByteHandler = |lex| {
    let string_literal = lex.read_string_literal('"')?;
    lex.token.value = Some(RawTokenValue::String(string_literal.into()));

    Ok(RawTokenKind::Str)
};

// `'`
const QOS: ByteHandler = |lex| {
    let string_literal = lex.read_string_literal('\'')?;
    lex.token.value = Some(RawTokenValue::String(string_literal.into()));

    Ok(RawTokenKind::Str)
};

// `#`
const HAS: ByteHandler = |lex| {
    // it is a hashbang comment
    if lex.offset() == 0 {
        lex.consume_byte();
        if lex.peek_byte() == Some(b'!') {
            lex.consume_byte();
            let hashbang_comment = lex.consume_single_line();
            lex.token.value = Some(RawTokenValue::String(hashbang_comment.into()));
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
const IDT: ByteHandler = |lex| {
    let identifier_name = lex.read_identifier_name()?;
    lex.token.value = Some(RawTokenValue::String(identifier_name.into()));

    Ok(RawTokenKind::Identifier)
};

// `%`
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

/// '+'
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

/// '-'
const MIN: ByteHandler = |lex| {
    let start = lex.offset();
    lex.consume_byte();

    match lex.peek_byte() {
        Some(b'-') => {
            // consume '-'
            lex.consume_byte();
            // -->
            if matches!(lex.peek_byte(), Some(b'>')) {
                lex.consume_byte();
                lex.add_error(start, lex.offset(), SyntaxError::LegacyCommentInModule);
                Ok(RawTokenKind::Skip)
            } else {
                Ok(RawTokenKind::MinusMinus)
            }
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

/// '.'
const PRD: ByteHandler = |lex| {
    lex.consume_byte();

    if lex.peek_byte() == Some(b'.') && lex.peek_2_byte() == Some(b'.') {
        lex.consume_byte();
        lex.consume_byte();
        Ok(RawTokenKind::DotDotDot)
    } else {
        Ok(RawTokenKind::Dot)
    }
};

/// '/'
const SLH: ByteHandler = |lex| {
    lex.consume_byte();

    match lex.peek_byte() {
        Some(b'=') => {
            lex.consume_byte();
            Ok(RawTokenKind::DivAssignOp)
        }
        Some(b'/') => {
            lex.consume_single_line();
            Ok(RawTokenKind::Skip)
        }
        _ => Ok(RawTokenKind::DivOp),
    }
};

/// '0'
const ZER: ByteHandler = |lex| {
    // peek_byte must be '0';
    let value = match lex.peek_2_byte() {
        Some(b'b' | b'B') => {
            lex.consume_n_byte(2);

            lex.read_binary()
        }
        Some(b'o' | b'O') => {
            lex.consume_n_byte(2);

            lex.read_octal()
        }
        Some(b'x' | b'X') => {
            lex.consume_n_byte(2);

            lex.read_hex()
        }
        Some(b'.') => lex.decimal_literal(),
        _ => {
            lex.consume_byte();
            Ok(0.0)
        }
    }?;

    lex.token.value = Some(RawTokenValue::Number(value));

    if matches!(lex.peek_byte(), Some(b'n')) {
        lex.consume_byte();
        Ok(RawTokenKind::BigIntLiteral)
    } else {
        Ok(RawTokenKind::Num)
    }
};

/// digit
const DIG: ByteHandler = |lex| {
    let value = lex.decimal_literal()?;

    lex.token.value = Some(RawTokenValue::Number(value));

    if matches!(lex.peek_byte(), Some(b'n')) {
        lex.consume_byte();
        Ok(RawTokenKind::BigIntLiteral)
    } else {
        Ok(RawTokenKind::Num)
    }
};

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
const LSS: ByteHandler = |lex| {
    let start = lex.offset();
    lex.consume_byte();

    match lex.peek_byte() {
        Some(b'=') => {
            lex.consume_byte();
            Ok(RawTokenKind::LtEqOp)
        }
        // check whether is `<!--`
        Some(b'!') if (1..3).all(|n| lex.peek_n_byte(n) == Some(b'-')) => {
            lex.consume_single_line();

            lex.add_error(start, lex.offset(), SyntaxError::LegacyCommentInModule);

            // skip LegacyCommentInModule, return next token
            lex.read_next_token_kind()
        }
        Some(b'<') => {
            lex.consume_byte();

            match lex.peek_byte() {
                Some(b'=') => {
                    lex.consume_byte();
                    Ok(RawTokenKind::LShiftAssignOp)
                }
                Some(b'<') if (1..=4).all(|n| lex.peek_n_byte(n) == Some(b'<')) => {
                    lex.consume_n_byte(5);
                    Ok(RawTokenKind::ConflictMarker)
                }
                _ => Ok(RawTokenKind::LShiftOp),
            }
        }
        _ => Ok(RawTokenKind::LtOp),
    }
};

/// '='
const EQL: ByteHandler = |lex| {
    lex.consume_byte();

    match lex.peek_byte() {
        Some(b'=') => {
            lex.consume_byte();

            if lex.peek_byte() == Some(b'=') {
                lex.consume_byte();

                // check whether is `=======`(ConflictMarker)
                if (0..4).all(|n| lex.peek_n_byte(n) == Some(b'=')) {
                    lex.consume_n_byte(4);
                    Ok(RawTokenKind::ConflictMarker)
                } else {
                    Ok(RawTokenKind::EqEqEqOp)
                }
            } else {
                Ok(RawTokenKind::EqEqOp)
            }
        }
        Some(b'>') => {
            lex.consume_byte();
            Ok(RawTokenKind::Arrow)
        }
        _ => Ok(RawTokenKind::AssignOp),
    }
};

/// '>'
const MOR: ByteHandler = |lex| {
    lex.consume_byte();

    match lex.peek_byte() {
        Some(b'=') => {
            lex.consume_byte();

            Ok(RawTokenKind::GtEqOp)
        }
        Some(b'>') => {
            lex.consume_byte();

            match lex.peek_byte() {
                Some(b'=') => {
                    lex.consume_byte();
                    Ok(RawTokenKind::RShiftAssignOp)
                }
                Some(b'>') => {
                    lex.consume_byte();

                    match lex.peek_byte() {
                        Some(b'=') => {
                            lex.consume_byte();
                            Ok(RawTokenKind::ZeroFillRShiftAssignOp)
                        }
                        Some(b'>') if (0..4).all(|n| lex.peek_n_byte(n) == Some(b'>')) => {
                            lex.consume_n_byte(4);
                            Ok(RawTokenKind::ConflictMarker)
                        }
                        _ => Ok(RawTokenKind::ZeroFillRShiftOp),
                    }
                }
                _ => Ok(RawTokenKind::RShiftOp),
            }
        }
        _ => Ok(RawTokenKind::GtOp),
    }
};

/// '?'
const QST: ByteHandler = |lex| {
    lex.consume_byte();

    match lex.peek_byte() {
        Some(b'?') => {
            lex.consume_byte();

            if lex.peek_byte() == Some(b'=') {
                lex.consume_byte();
                Ok(RawTokenKind::NullishAssignOp)
            } else {
                Ok(RawTokenKind::NullishCoalescingOp)
            }
        }
        _ => Ok(RawTokenKind::QuestionMark),
    }
};

/// '@'
const AT_: ByteHandler = |lex| {
    lex.consume_byte();

    Ok(RawTokenKind::At)
};

/// '['
const BTO: ByteHandler = |lex| {
    lex.consume_byte();

    Ok(RawTokenKind::LBracket)
};

/// ']'
const BTC: ByteHandler = |lex| {
    lex.consume_byte();

    Ok(RawTokenKind::RBracket)
};

/// '^'
const CRT: ByteHandler = |lex| {
    lex.consume_byte();

    if lex.peek_byte() == Some(b'=') {
        lex.consume_byte();
        Ok(RawTokenKind::BitXorAssignOp)
    } else {
        Ok(RawTokenKind::BitXorOp)
    }
};

/// '`'
const TPL: ByteHandler = |lex| {
    lex.consume_byte();

    // Switch to template literal mode to parse the template string contents
    lex.set_context(RawLexerContext::JsTemplateLiteral);

    Ok(RawTokenKind::BackQuote)
};

/// 'a'
const L_A: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "as" => RawTokenKind::As,
        "any" => RawTokenKind::Any,
        "await" => RawTokenKind::Await,
        "async" => RawTokenKind::Async,
        "assert" => RawTokenKind::Assert,
        "asserts" => RawTokenKind::Asserts,
        "accessor" => RawTokenKind::Accessor,
        "abstract" => RawTokenKind::Abstract,
        _ => RawTokenKind::Identifier,
    })
};

/// 'b'
const L_B: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "break" => RawTokenKind::Break,
        "boolean" => RawTokenKind::Boolean,
        "bigint" => RawTokenKind::BigInt,
        _ => RawTokenKind::Identifier,
    })
};

/// 'c'
const L_C: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "case" => RawTokenKind::Case,
        "catch" => RawTokenKind::Catch,
        "class" => RawTokenKind::Class,
        "const" => RawTokenKind::Const,
        "continue" => RawTokenKind::Continue,
        _ => RawTokenKind::Identifier,
    })
};

/// 'd'
const L_D: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "debugger" => RawTokenKind::Debugger,
        "default" => RawTokenKind::Default,
        "delete" => RawTokenKind::Delete,
        "do" => RawTokenKind::Do,
        "declare" => RawTokenKind::Declare,
        _ => RawTokenKind::Identifier,
    })
};

/// 'e'
const L_E: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "else" => RawTokenKind::Else,
        "enum" => RawTokenKind::Enum,
        "export" => RawTokenKind::Export,
        "extends" => RawTokenKind::Extends,
        _ => RawTokenKind::Identifier,
    })
};

/// 'f'
const L_F: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "for" => RawTokenKind::For,
        "from" => RawTokenKind::From,
        "false" => RawTokenKind::False,
        "finally" => RawTokenKind::Finally,
        "function" => RawTokenKind::Function,
        _ => RawTokenKind::Identifier,
    })
};

/// 'g'
const L_G: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "get" => RawTokenKind::Get,
        "global" => RawTokenKind::Global,
        _ => RawTokenKind::Identifier,
    })
};

/// 'h'
const L_H: ByteHandler = IDT;

/// 'i'
const L_I: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "if" => RawTokenKind::If,
        "in" => RawTokenKind::In,
        "is" => RawTokenKind::Is,
        "infer" => RawTokenKind::Infer,
        "import" => RawTokenKind::Import,
        "interface" => RawTokenKind::Interface,
        "intrinsic" => RawTokenKind::Intrinsic,
        "instanceof" => RawTokenKind::Instanceof,
        "implements" => RawTokenKind::Implements,
        _ => RawTokenKind::Identifier,
    })
};

/// 'j'
const L_J: ByteHandler = IDT;

/// 'k'
const L_K: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "keyof" => RawTokenKind::Keyof,
        _ => RawTokenKind::Identifier,
    })
};

/// 'l'
const L_L: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "let" => RawTokenKind::Let,
        _ => RawTokenKind::Identifier,
    })
};

/// 'm'
const L_M: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "meta" => RawTokenKind::Meta,
        _ => RawTokenKind::Identifier,
    })
};

/// 'n'
const L_N: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "new" => RawTokenKind::New,
        "null" => RawTokenKind::Null,
        "never" => RawTokenKind::Never,
        "number" => RawTokenKind::Number,
        "namespace" => RawTokenKind::Namespace,
        _ => RawTokenKind::Identifier,
    })
};

/// 'o'
const L_O: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "of" => RawTokenKind::Of,
        "object" => RawTokenKind::Object,
        _ => RawTokenKind::Identifier,
    })
};

/// 'p'
const L_P: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "public" => RawTokenKind::Public,
        "package" => RawTokenKind::Package,
        "private" => RawTokenKind::Private,
        "protected" => RawTokenKind::Protected,
        _ => RawTokenKind::Identifier,
    })
};

/// 'q'
const L_Q: ByteHandler = IDT;

/// 'r'
const L_R: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "return" => RawTokenKind::Return,
        "require" => RawTokenKind::Require,
        "readonly" => RawTokenKind::Readonly,
        _ => RawTokenKind::Identifier,
    })
};

/// 's'
const L_S: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "set" => RawTokenKind::Set,
        "super" => RawTokenKind::Super,
        "symbol" => RawTokenKind::Symbol,
        "switch" => RawTokenKind::Switch,
        "string" => RawTokenKind::String,
        "static" => RawTokenKind::Static,
        "satisfies" => RawTokenKind::Satisfies,
        _ => RawTokenKind::Identifier,
    })
};

/// 't'
const L_T: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "try" => RawTokenKind::Try,
        "this" => RawTokenKind::This,
        "true" => RawTokenKind::True,
        "type" => RawTokenKind::Type,
        "throw" => RawTokenKind::Throw,
        "typeof" => RawTokenKind::Typeof,
        "target" => RawTokenKind::Target,
        _ => RawTokenKind::Identifier,
    })
};

/// 'u'
const L_U: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "using" => RawTokenKind::Using,
        "unique" => RawTokenKind::Unique,
        "unknown" => RawTokenKind::Unknown,
        "undefined" => RawTokenKind::Undefined,
        _ => RawTokenKind::Identifier,
    })
};

/// 'v'
const L_V: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "var" => RawTokenKind::Var,
        "void" => RawTokenKind::Void,
        _ => RawTokenKind::Identifier,
    })
};

/// 'w'
const L_W: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "while" => RawTokenKind::While,
        "with" => RawTokenKind::With,
        _ => RawTokenKind::Identifier,
    })
};

/// 'x'
const L_X: ByteHandler = IDT;

/// 'y'
const L_Y: ByteHandler = |lex| {
    lex.match_identifier_or_keyword(|word| match word {
        "yield" => RawTokenKind::Yield,
        _ => RawTokenKind::Identifier,
    })
};

/// 'z'
const L_Z: ByteHandler = IDT;

/// '{'
const BEO: ByteHandler = |lex| {
    lex.consume_byte();

    Ok(RawTokenKind::LBrace)
};

/// '|'
const PIP: ByteHandler = |lex| {
    lex.consume_byte();

    match lex.peek_byte() {
        Some(b'|') => {
            lex.consume_byte();
            match lex.peek_byte() {
                Some(b'=') => {
                    lex.consume_byte();

                    Ok(RawTokenKind::OrAssignOp)
                }
                // check whether is `|||||||`(ConflictMarker)
                Some(b'|') if (1..4).all(|n| lex.peek_n_byte(n) == Some(b'|')) => {
                    lex.consume_n_byte(4);

                    Ok(RawTokenKind::ConflictMarker)
                }
                _ => Ok(RawTokenKind::LogicalOrOp),
            }
        }
        Some(b'=') => {
            lex.consume_byte();
            Ok(RawTokenKind::BitOrAssignOp)
        }
        _ => Ok(RawTokenKind::BitOrOp),
    }
};

/// '}'
const BEC: ByteHandler = |lex| {
    lex.consume_byte();

    // If we're in a template quasi literal (${...}), switch back to template
    // literal mode after encountering the closing brace. This allows us to
    // continue parsing the rest of the template string.
    if lex.context == RawLexerContext::JsTemplateQuasiLiteral {
        lex.set_context(RawLexerContext::JsTemplateLiteral);
    }

    Ok(RawTokenKind::RBrace)
};

/// '~'
const TLD: ByteHandler = |lex| {
    lex.consume_byte();

    Ok(RawTokenKind::Tilde)
};

/// Unicode
const UNI: ByteHandler = |lex| {
    let start = lex.offset();

    // SAFETY: xx
    let ch = lex.peek_char().unwrap();

    if ch.is_ident_start() {
        let identifier_name = lex.read_identifier_name()?;
        lex.token.value = Some(RawTokenValue::String(identifier_name.into()));

        Ok(RawTokenKind::Identifier)
    } else {
        lex.consume_char();
        lex.error(start, lex.offset(), SyntaxError::UnexpectedChar { c: ch })
    }
};
