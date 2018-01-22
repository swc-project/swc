use self::SyntaxError::*;
use std::borrow::Cow;
use std::fmt::{self, Debug, Formatter};
use swc_atoms::JsWord;
use swc_common::Span;
use swc_common::errors::{Diagnostic, Handler};
use token::Token;

#[derive(Copy, Clone)]
pub(crate) struct Eof<'a> {
    pub last: Span,
    pub handler: &'a Handler,
}

impl<'a> From<Eof<'a>> for Diagnostic<'a> {
    fn from(Eof { handler, last }: Eof<'a>) -> Self {
        handler.error("expected some tokens after here").span(last)
    }
}

impl<'a> Debug for Eof<'a> {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        Debug::fmt("<eof>", f)
    }
}

pub(crate) struct Error<'a> {
    pub handler: &'a Handler,
    pub span: Span,
    pub error: SyntaxError,
}

#[derive(Debug)]
pub(crate) enum SyntaxError {
    LegacyDecimal,
    LegacyOctal,
    InvalidIdentChar,

    // #[fail(display = "unterminated string constant: {:?}", start)]
    UnterminatedStrLit,
    // #[fail(display = "expected unicode escape sequence: {:?}", pos)]
    ExpectedUnicodeEscape,
    // #[fail(display = "unexpected escape sequence in reserved word: {:?}", word)]
    EscapeInReservedWord {
        word: JsWord,
    },
    // #[fail(display = "unterminated regexp (regexp started at {:?})", start)]
    UnterminatedRegxp,
    // #[fail(display = "identifier directly after number at {:?}", pos)]
    IdentAfterNum,
    // #[fail(display = "Unexpected character '{}' at {:?}", c, pos)]
    UnexpectedChar {
        c: char,
    },
    // #[fail(display = "Invalid string escape at {:?}", start)]
    InvalidStrEscape,

    // #[fail(display = "Invalid unciode escape at {:?}", pos)]
    InvalidUnicodeEscape,

    // #[fail(display = "Invalid unciode code point at {:?}", pos)]
    InvalidCodePoint,

    /// "implements", "interface", "let", "package",\
    ///  "private", "protected",  "public", "static", or "yield"
    InvalidIdentInStrict,
    /// 'eval' and 'arguments' are invalid identfier in strict mode.
    EvalAndArgumentsInStrict,
    UnaryInExp {
        left: String,
        left_span: Span,
    },
    LineBreakInThrow,
    Expected(&'static Token),

    /// "await* has been removed from the async functions proposal. Use
    /// Promise.all() instead."
    AwaitStar,
    /// "cannot use a reserved word as a shorthand property"
    ReservedWordInObjShorthandOrPat,

    MultipleDefault,
    CommaAfterRestElement,
    NonLastRestParam,
    SpreadInParenExpr,
    /// `()`
    EmptyParenExpr,

    ExpectedIdent,
    ExpctedSemi,
    DuplicateLabel(JsWord),
    AsyncGenerator,
    NonTopLevelImportExport,
    PatVarWithoutInit,
}

impl<'a> From<Error<'a>> for Diagnostic<'a> {
    fn from(e: Error<'a>) -> Self {
        let msg: Cow<'static, _> = match e.error {
            LegacyDecimal => "Legacy decimal literal is not permitted in strict mode".into(),
            LegacyOctal => "Legacy octal literal is not permitted in strict mode".into(),
            InvalidIdentChar => "Invalid character in identifier".into(),

            UnterminatedStrLit => "Unterminated string constant".into(),
            ExpectedUnicodeEscape => "Expected unicode escape".into(),
            EscapeInReservedWord { word } => {
                format!("unexpected escape sequence in reserved word: {}", word).into()
            }
            UnterminatedRegxp => "Unterminated regexp literal".into(),
            IdentAfterNum => "Identifier cannot follow number".into(),
            UnexpectedChar { c } => format!("Unexpected character '{}'", c).into(),
            InvalidStrEscape => "Invalid string escape".into(),
            InvalidUnicodeEscape => "Invalid unciode escape".into(),
            InvalidCodePoint => "Invalid unciode code point".into(),

            InvalidIdentInStrict => "'implements', 'interface', 'let', 'package', 'private', \
                                     'protected',  'public', 'static', or 'yield' cannot be used \
                                     as an identifier in strict mode"
                .into(),
            EvalAndArgumentsInStrict => {
                r#"'eval' and 'arguments' cannot be used as a binding identifier in string mode"#.into()
            }
            UnaryInExp { .. } => "** cannot be applied to unary expression".into(),
            LineBreakInThrow => "LineBreak cannot follow 'throw'".into(),
            Expected(token) => format!("Expected {:?}", token).into(),

            AwaitStar => "await* has been removed from the async functions proposal. Use
            \
                          // Promise.all() instead."
                .into(),

            ReservedWordInObjShorthandOrPat => {
                "Cannot use a reserved word as a shorthand property".into()
            }

            MultipleDefault => "A switch block cannot have multiple defaults".into(),
            CommaAfterRestElement => "Trailing comma isn't permitted after a rest element".into(),
            NonLastRestParam => "Rest element must be final element".into(),
            SpreadInParenExpr => "Parenthesized expression cannot contain spread operator".into(),
            EmptyParenExpr => "Parenthized exprssion cannot be empty".into(),
            ExpectedIdent => "Expected ident".into(),
            ExpctedSemi => "Expected ';' or line break".into(),
            DuplicateLabel(label) => format!("Label {} is already declared", label).into(),
            AsyncGenerator => "An async function cannot be generator".into(),
            NonTopLevelImportExport => "'import', and 'export' are not permitted here".into(),

            PatVarWithoutInit => "Destructuring bindings require initializers".into(),
        };

        e.handler.error(&msg).span(e.span)
    }
}
