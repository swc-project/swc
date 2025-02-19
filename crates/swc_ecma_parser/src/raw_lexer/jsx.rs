use super::{primary, ByteHandler, RawLexer, RawLexerContext, RawTokenKind};
use crate::{EsSyntax, Syntax, TsSyntax};

pub(super) fn handler_from_byte(byte: u8) -> ByteHandler {
    unsafe { *(&BYTE_HANDLERS as *const ByteHandler).offset(byte as isize) }
}

/// Lookup table mapping any incoming byte to a handler function defined below.
static BYTE_HANDLERS: [ByteHandler; 256] = [
    //  0    1    2    3    4    5    6    7    8    9    A    B    C    D    E    F
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 0
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 1
    ___, ___, ___, ___, IDT, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 2
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, LSS, ___, MOR, ___, // 3
    ___, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, // 4
    IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, ___, IDT, ___, ___, IDT, // 5
    ___, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, // 6
    IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, IDT, ___, ___, ___, ___, ___, // 7
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 8
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // 9
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // A
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // B
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // C
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // D
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // E
    ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, ___, // F
];

const IDT: ByteHandler = |lex| {
    let byte = lex.peek_byte().unwrap();

    let primary_handler = primary::handler_from_byte(byte);

    primary_handler(lex).map(|r| match lex.context {
        RawLexerContext::Jsx => RawTokenKind::JsxText,
        RawLexerContext::JsxTag => RawTokenKind::JSXName,
        _ => r,
    })
};

const ___: ByteHandler = |lex| {
    let byte = lex.peek_byte().unwrap();

    let primary_handler = primary::handler_from_byte(byte);

    primary_handler(lex)
};

// '<'
const LSS: ByteHandler = |lex| {
    let byte = lex.peek_byte().unwrap();

    let primary_handler = primary::handler_from_byte(byte);

    primary_handler(lex).map(|token| {
        if matches!(token, RawTokenKind::LtOp) {
            lex.set_context(RawLexerContext::JsxTag);

            RawTokenKind::JsxTagStart
        } else {
            token
        }
    })
};

// '>'
const MOR: ByteHandler = |lex| {
    let byte = lex.peek_byte().unwrap();

    let primary_handler = primary::handler_from_byte(byte);

    primary_handler(lex).map(|token| {
        if matches!(token, RawTokenKind::GtOp) {
            lex.set_context(RawLexerContext::Jsx);
            RawTokenKind::JsxTagEnd
        } else {
            token
        }
    })
};

impl RawLexer<'_> {
    pub(super) fn is_jsx(&self) -> bool {
        is_jsx(&self.syntax)
    }
}

pub(super) fn is_jsx(syntax: &Syntax) -> bool {
    matches!(
        syntax,
        Syntax::Es(EsSyntax { jsx: true, .. }) | Syntax::Typescript(TsSyntax { tsx: true, .. })
    )
}
