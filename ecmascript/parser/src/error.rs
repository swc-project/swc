#![allow(dead_code)]

use self::SyntaxError::*;
use crate::token::Token;
use std::{
    borrow::Cow,
    fmt::{self, Debug, Formatter},
};
use swc_atoms::JsWord;
use swc_common::{
    errors::{DiagnosticBuilder, Handler},
    Span,
};

#[derive(Copy, Clone)]
pub(crate) struct Eof<'a> {
    pub last: Span,
    pub handler: &'a Handler,
}

impl<'a> From<Eof<'a>> for DiagnosticBuilder<'a> {
    fn from(Eof { handler, last }: Eof<'a>) -> Self {
        let mut db = handler.struct_err("Unexpected eof");
        db.set_span(last);
        db
    }
}

impl<'a> Debug for Eof<'a> {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        Debug::fmt("<eof>", f)
    }
}

pub(crate) struct ErrorToDiag<'a> {
    pub handler: &'a Handler,
    pub span: Span,
    pub error: SyntaxError,
}

#[derive(Debug, Clone, PartialEq)]
pub struct Error {
    pub span: Span,
    pub error: SyntaxError,
}

#[derive(Debug, Clone, PartialEq)]
pub enum SyntaxError {
    LegacyDecimal,
    LegacyOctal,
    InvalidIdentChar,
    ExpectedDigit {
        radix: u8,
    },
    RestPatInSetter,

    UnterminatedBlockComment,
    UnterminatedStrLit,
    ExpectedUnicodeEscape,
    EscapeInReservedWord {
        word: JsWord,
    },
    UnterminatedRegxp,
    UnterminatedTpl,
    IdentAfterNum,
    UnexpectedChar {
        c: char,
    },
    InvalidStrEscape,
    InvalidUnicodeEscape,
    InvalidCodePoint,
    ExpectedHexChars {
        /// Number of expected characters.
        count: u8,
    },
    NumLitTerminatedWithExp,
    LegacyCommentInModule,

    /// "implements", "interface", "let", "package",\
    ///  "private", "protected",  "public", "static", or "yield"
    InvalidIdentInStrict,
    /// 'eval' and 'arguments' are invalid identfier in strict mode.
    EvalAndArgumentsInStrict,
    UnaryInExp {
        left: String,
        left_span: Span,
    },
    Hash,
    LineBreakInThrow,
    LineBreakBeforeArrow,

    /// Unexpected token
    Unexpected {
        got: String,
    },
    ReservedWordInImport,
    AssignProperty,
    Expected(&'static Token, String),
    ExpectedSemiForExprStmt {
        expr: Span,
    },

    AwaitStar,
    ReservedWordInObjShorthandOrPat,

    NullishCoalescingWithLogicalOp,
    NullishCoalescingNotEnabled,

    MultipleDefault {
        /// Span of the previous default case
        previous: Span,
    },
    CommaAfterRestElement,
    NonLastRestParam,
    SpreadInParenExpr,
    /// `()`
    EmptyParenExpr,
    InvalidPat,
    InvalidExpr,
    NotSimpleAssign,
    ExpectedIdent,
    ExpctedSemi,
    DuplicateLabel(JsWord),
    AsyncGenerator,
    NonTopLevelImportExport,
    ImportExportInScript,
    PatVarWithoutInit,
    WithInStrict,
    ReturnNotAllowed,
    TooManyVarInForInHead,
    VarInitializerInForInHead,
    LabelledGenerator,
    YieldParamInGen,

    AwaitForStmt,

    UnterminatedJSXContents,
    EmptyJSXAttr,
    InvalidJSXValue,
    JSXExpectedClosingTagForLtGt,
    JSXExpectedClosingTag {
        tag: JsWord,
    },
    InvalidLeadingDecorator,
    DecoratorOnExport,

    TsNonLastRest,
    TsRequiredAfterOptional,
    TsInvalidParamPropPat,

    SpaceBetweenHashAndIdent,

    AsyncConstructor,
    PropertyNamedConstructor,
    ClassProperty,
    ReadOnlyMethod,
    TsBindingPatCannotBeOptional,

    TrailingCommaInsideImport,
    DynamicImport,

    ExportDefaultWithOutFrom,
    ExportNamespaceFrom,

    DotsWithoutIdentifier,

    NumericSeparatorIsAllowedOnlyBetweenTwoDigits,

    TS1003,
    TS1005,
    TS1009,
    TS1014,
    TS1015,
    TS1031,
    TS1038,
    TS1042,
    TS1047,
    TS1048,
    TS1056,
    TS1085,
    TS1092,
    TS1096,
    TS1098,
    TS1102,
    TS1105,
    TS1107,
    TS1109,
    TS1114,
    TS1115,
    TS1116,
    TS1123,
    TS1141,
    TS1162,
    TS1164,
    TS1171,
    TS1172,
    TS1174,
    TS1175,
    TS1183,
    TS1093,
    TS1094,
    TS1196,
    TS2369,
    TS2371,
    TS2406,
    TS2410,
    TS2414,
    TS2427,
    TS2452,
    TS2483,
    TS2491,
    TS2703,
}

impl<'a> From<ErrorToDiag<'a>> for Error {
    #[cold]
    fn from(e: ErrorToDiag<'a>) -> Self {
        Error {
            span: e.span,
            error: e.error,
        }
    }
}

impl<'a> From<ErrorToDiag<'a>> for DiagnosticBuilder<'a> {
    #[cold]
    fn from(e: ErrorToDiag<'a>) -> Self {
        let msg: Cow<'static, _> = match e.error {
            LegacyDecimal => "Legacy decimal escape is not permitted in strict mode".into(),
            LegacyOctal => "Legacy octal escape is not permitted in strict mode".into(),
            InvalidIdentChar => "Invalid character in identifier".into(),
            ExpectedDigit { radix } => format!(
                "Expected {} digit",
                match radix {
                    2 => "a binary",
                    8 => "an octal",
                    10 => "a decimal",
                    16 => "a hexadecimal",
                    _ => unreachable!(),
                }
            )
            .into(),
            UnterminatedBlockComment => "Unterminated block comment".into(),
            UnterminatedStrLit => "Unterminated string constant".into(),
            ExpectedUnicodeEscape => "Expected unicode escape".into(),
            EscapeInReservedWord { ref word } => {
                format!("Unexpected escape sequence in reserved word: {}", word).into()
            }
            UnterminatedRegxp => "Unterminated regexp literal".into(),
            UnterminatedTpl => "Unterminated template".into(),
            IdentAfterNum => "Identifier cannot follow number".into(),
            UnexpectedChar { c } => format!("Unexpected character {:?}", c).into(),
            InvalidStrEscape => "Invalid string escape".into(),
            InvalidUnicodeEscape => "Invalid unciode escape".into(),
            InvalidCodePoint => "Invalid unciode code point".into(),
            ExpectedHexChars { count } => format!("Expected {} hex characters", count).into(),
            LegacyCommentInModule => "Legacy comments cannot be used in module code".into(),
            NumLitTerminatedWithExp => "Expected +, - or decimal digit after e".into(),

            InvalidIdentInStrict => "'implements', 'interface', 'let', 'package', 'private', \
                                     'protected',  'public', 'static', or 'yield' cannot be used \
                                     as an identifier in strict mode"
                .into(),
            EvalAndArgumentsInStrict => "'eval' and 'arguments' cannot be used as a binding \
                                         identifier in strict mode"
                .into(),
            UnaryInExp { .. } => "** cannot be applied to unary expression".into(),
            Hash => "Unexpected token '#'".into(),
            LineBreakInThrow => "LineBreak cannot follow 'throw'".into(),
            LineBreakBeforeArrow => "Unexpected line break between arrow head and arrow".into(),
            Unexpected { ref got } => format!("Unexpected token {}", got).into(),

            ReservedWordInImport => "cannot import as reserved word".into(),
            AssignProperty => "assignment property is invalid syntax".into(),
            Expected(token, ref got) => format!("Expected {:?}, got {}", token, got).into(),
            ExpectedSemiForExprStmt { .. } => "Expected ';', '}' or <eof>".into(),

            AwaitStar => "await* has been removed from the async functions proposal. Use \
                          Promise.all() instead."
                .into(),

            ReservedWordInObjShorthandOrPat => {
                "Cannot use a reserved word as a shorthand property".into()
            }

            MultipleDefault { .. } => "A switch block cannot have multiple defaults".into(),
            CommaAfterRestElement => "Trailing comma isn't permitted after a rest element".into(),
            NonLastRestParam => "Rest element must be final element".into(),
            SpreadInParenExpr => "Parenthesized expression cannot contain spread operator".into(),
            EmptyParenExpr => "Parenthized expression cannot be empty".into(),
            InvalidPat => "Not a pattern".into(),
            InvalidExpr => "Not an expression".into(),
            // TODO
            NotSimpleAssign => "Cannot assign to this".into(),
            ExpectedIdent => "Expected ident".into(),
            ExpctedSemi => "Expected ';' or line break".into(),
            DuplicateLabel(ref label) => format!("Label {} is already declared", label).into(),
            AsyncGenerator => "An async function cannot be generator".into(),
            NonTopLevelImportExport => "'import', and 'export' are not permitted here".into(),
            ImportExportInScript => {
                "'import', and 'export' cannot be used outside of module code".into()
            }

            PatVarWithoutInit => "Destructuring bindings require initializers".into(),
            WithInStrict => "With statement are not allowed in strict mode".into(),
            ReturnNotAllowed => "Return statement is not allowed here".into(),
            TooManyVarInForInHead => "Expected one variable binding".into(),
            VarInitializerInForInHead => "Unexpected initializer in for in/of loop".into(),
            LabelledGenerator => "Generator cannot be labelled".into(),
            YieldParamInGen => "'yield' cannot be used as a parameter within generator".into(),
            AwaitForStmt => "for await syntax is valid only for for-of statement".into(),

            UnterminatedJSXContents => "Unterminated JSX contents".into(),
            EmptyJSXAttr => "JSX attributes must only be assigned a non-empty expression".into(),
            InvalidJSXValue => {
                "JSX value should be either an expression or a quoted JSX text".into()
            }
            JSXExpectedClosingTagForLtGt => "Expected corresponding JSX closing tag for <>".into(),
            JSXExpectedClosingTag { ref tag } => {
                format!("Expected corresponding JSX closing tag for <{}>", tag).into()
            }
            InvalidLeadingDecorator => {
                "Leading decorators must be attached to a class declaration".into()
            }
            DecoratorOnExport => "Using the export keyword between a decorator and a class is not \
                                  allowed. Please use `export @dec class` instead."
                .into(),
            TsNonLastRest => "A rest element must be last in a tuple type.".into(),
            TsRequiredAfterOptional => {
                "A required element cannot follow an optional element.".into()
            }
            TsInvalidParamPropPat => {
                "Typescript parameter property must be identifer or assignment pattern".into()
            }
            SpaceBetweenHashAndIdent => "Unexpected space between # and identifier".into(),
            AsyncConstructor => "Constructor can't be an async function".into(),
            PropertyNamedConstructor => {
                "Classes may not have a non-static field named 'constructor'".into()
            }
            ClassProperty => "Class property requires `jsc.parser.classProperty` to be true".into(),
            ReadOnlyMethod => "A method cannot be readonly".into(),
            TsBindingPatCannotBeOptional => "A binding pattern parameter cannot be optional in an \
                                             implementation signature."
                .into(),

            TrailingCommaInsideImport => {
                "Trailing comma is disallowed inside import(...) arguments".into()
            }
            DynamicImport => {
                "import(...) expressions requires `jsc.parser.dynamicImport` to be true".into()
            }
            ExportDefaultWithOutFrom => "export default statements required from '...';".into(),
            ExportNamespaceFrom => "export * as Foo from 'foo'; requires \
                                    `jsc.parser.exportNamespaceFrom` to be true"
                .into(),

            DotsWithoutIdentifier => {
                "`...` must be followed by an identifier in declaration contexts".into()
            }

            NumericSeparatorIsAllowedOnlyBetweenTwoDigits => {
                "A numeric separator is only allowed between two digits".into()
            }

            NullishCoalescingWithLogicalOp => "Nullish coalescing operator(??) requires parens \
                                               when mixing with logical operators"
                .into(),
            NullishCoalescingNotEnabled => {
                "Nullish coalescing operator(??) requires jsc.parser.Coalescing".into()
            }

            TS1056 => "jsc.taraget should be es5 or upper to use getter / setter".into(),
            TS1141 => "literal in an import type should be string literal".into(),

            // TODO:
            _ => format!("{:?}", e.error).into(),
        };

        let mut db = e.handler.struct_err(&msg);
        db.set_span(e.span);

        match e.error {
            ExpectedSemiForExprStmt { expr } => {
                db.span_note(
                    expr,
                    "This is the expression part of an expression statement",
                );
            }
            MultipleDefault { previous } => {
                db.span_note(previous, "previous default case is declared at here");
            }
            _ => {}
        }

        db
    }
}
