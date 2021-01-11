#![allow(dead_code)]

use crate::token::Token;
use std::{borrow::Cow, fmt::Debug};
use swc_atoms::JsWord;
use swc_common::errors::DiagnosticId;
use swc_common::{
    errors::{DiagnosticBuilder, Handler},
    Span, Spanned,
};

/// Note: this struct is 8 bytes.
#[derive(Debug, Clone, PartialEq)]
pub struct Error {
    pub(crate) error: Box<(Span, SyntaxError)>,
}

impl Spanned for Error {
    fn span(&self) -> Span {
        (*self.error).0
    }
}

impl Error {
    pub fn kind(&self) -> &SyntaxError {
        &self.error.1
    }

    pub fn into_kind(self) -> SyntaxError {
        self.error.1
    }
}

#[derive(Debug, Clone, PartialEq)]
#[non_exhaustive]
pub enum SyntaxError {
    Eof,
    DeclNotAllowed,

    PrivateNameInInterface,

    InvalidSuperCall,
    InvalidSuper,

    ArrowNotAllowed,
    ExportNotAllowed,
    GetterSetterCannotBeReadonly,

    TopLevelAwait,

    LegacyDecimal,
    LegacyOctal,
    InvalidIdentChar,
    ExpectedDigit {
        radix: u8,
    },
    SetterParamRequired,
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
    /// 'eval' and 'arguments' are invalid identifier in strict mode.
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
        expected: &'static str,
    },
    ReservedWordInImport,
    AssignProperty,
    Expected(&'static Token, String),
    ExpectedBlock,
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
    ExpectedExpr,
    ExpectedExprAfterThis,
    ExpectedIdent,
    ExpectedIdentButGotKeyword,
    ExpectedIdentAfterThis,
    ExpectedSemi,
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

    TsRequiredAfterOptional,
    TsInvalidParamPropPat,

    SpaceBetweenHashAndIdent,

    AsyncConstructor,
    PropertyNamedConstructor,
    DeclarePrivateIdentifier,
    ClassProperty,
    ReadOnlyMethod,
    GeneratorConstructor,
    TsBindingPatCannotBeOptional,

    TrailingCommaInsideImport,
    DynamicImport,

    ExportDefaultWithOutFrom,
    ExportNamespaceFrom,

    DotsWithoutIdentifier,

    NumericSeparatorIsAllowedOnlyBetweenTwoDigits,

    TS1003,
    TS1005,
    TrailingCommaInVarDecl,
    TS1014,
    TS1015,
    TS1029(JsWord, JsWord),
    TS1030(JsWord),
    TS1031,
    DeclareButAlreadyInAmbientContext,
    InvalidModifier {
        modifier: &'static str,
    },
    TS1047,
    TS1048,
    TS1056,
    TS1085,
    TS1089(JsWord),
    TS1092,
    TS1096,
    TS1098,
    TS1100,
    TS1102,
    TS1105,
    TS1107,
    TS1109,
    TS1110,
    TS1114,
    TS1115,
    TS1116,
    EmptyVarDecl,
    TS1141,
    ObjectMemberCannotBeOptional,
    TS1164,
    TS1171,
    TS1172,
    TS1173,
    ExtendsAlreadySeen,
    TS1174,
    ImplementsAlreadySeen,
    ImplementationInAmbientContext,
    TS1093,
    TS1094,
    TS1196,
    TS1242,
    TS1243(JsWord, JsWord),
    TS2369,
    ParameterDefaultInAmbientContext,
    TS2406,
    TS2410,
    TS2414,
    TS2427,
    TS2452,
    TS2483,
    TS2491,
    TS2703,
    TS4112,
    TSTypeAnnotationAfterAssign,

    AbstractMemberInNonAbstractClass,
    DecoratorNotAllowed,

    GetterShouldNotHaveParam,
    SetterShouldHaveOneParam,

    GetterShouldNotHaveTypeParam,
    SetterShouldNotHaveTypeParam,

    ExtendsMustPrecedeImplements,

    IndexSignatureMustBeStringOrNunmber,
    AccessibilityModifierShouldPrecedeAbstract {
        accessibility: JsWord,
    },
    AccessibilityModifierShouldPrecedeStatic {
        accessibility: JsWord,
    },
    InvalidModifierUsedWithAbstract {
        modifier: &'static str,
    },
    ExpectedComma,
    ExpectedRSquareBracket,
    InvalidReadonly,
    ExpectedLParen,
    ExpectedRParen,
    RestElementWithInitializer,

    ExpectedPropertyName,
    YieldNotAllowed,
    GeneratorInOverloadInAmbientContext,
    GeneratorInOverloadOfClassMethod,
    ConstMustBeInitialized,
    ExpectedBindingPat,
    ExpectedRBracket,
    ExpectedStatement,
    DotAfterUpdate,
    InvalidOptional,
}

impl SyntaxError {
    /// Returns typescript error code.
    #[cold]
    #[inline(never)]
    fn code(&self) -> Option<usize> {
        match self {
            SyntaxError::TS1003 => Some(1003),
            SyntaxError::TS1005 => Some(1005),
            SyntaxError::TrailingCommaInVarDecl => Some(1009),
            SyntaxError::TS1014 => Some(1014),
            SyntaxError::TS1015 => Some(1015),
            SyntaxError::TS1031 => Some(1031),
            SyntaxError::DeclareButAlreadyInAmbientContext => Some(1038),
            SyntaxError::TS1047 => Some(1047),
            SyntaxError::TS1048 => Some(1048),
            SyntaxError::TS1056 => Some(1056),
            SyntaxError::TS1085 => Some(1085),
            SyntaxError::TS1089 => Some(1089),
            SyntaxError::TS1092 => Some(1092),
            SyntaxError::TS1096 => Some(1096),
            SyntaxError::TS1098 => Some(1098),
            SyntaxError::TS1100 => Some(1100),
            SyntaxError::TS1102 => Some(1102),
            SyntaxError::TS1105 => Some(1105),
            SyntaxError::TS1107 => Some(1007),
            SyntaxError::TS1109 => Some(1109),
            SyntaxError::TS1110 => Some(1110),
            SyntaxError::TS1114 => Some(1114),
            SyntaxError::TS1115 => Some(1115),
            SyntaxError::TS1116 => Some(1116),
            SyntaxError::EmptyVarDecl => Some(1123),
            SyntaxError::TS1141 => Some(1141),
            SyntaxError::ObjectMemberCannotBeOptional => Some(1162),
            SyntaxError::TS1164 => Some(1164),
            SyntaxError::TS1171 => Some(1171),
            SyntaxError::ExtendsAlreadySeen => Some(1172),
            SyntaxError::TS1174 => Some(1174),
            SyntaxError::ImplementsAlreadySeen => Some(1175),
            SyntaxError::ImplementationInAmbientContext => Some(1183),
            SyntaxError::TS1093 => Some(1093),
            SyntaxError::TS1094 => Some(1094),
            SyntaxError::TS1196 => Some(1196),
            SyntaxError::TS1242 => Some(1242),
            SyntaxError::TS2369 => Some(2369),
            SyntaxError::ParameterDefaultInAmbientContext => Some(2371),
            SyntaxError::TS2406 => Some(2406),
            SyntaxError::TS2410 => Some(2410),
            SyntaxError::TS2414 => Some(2414),
            SyntaxError::TS2427 => Some(2427),
            SyntaxError::TS2452 => Some(2452),
            SyntaxError::TS2483 => Some(2483),
            SyntaxError::TS2491 => Some(2491),
            SyntaxError::TS2703 => Some(2703),
            SyntaxError::GetterShouldNotHaveParam => Some(1054),
            SyntaxError::SetterShouldHaveOneParam => Some(1049),
            SyntaxError::GetterShouldNotHaveTypeParam => Some(1094),
            SyntaxError::SetterShouldNotHaveTypeParam => Some(1094),
            SyntaxError::InvalidModifier { .. } => Some(1042),
            SyntaxError::ExtendsMustPrecedeImplements => Some(1173),
            SyntaxError::PatVarWithoutInit => Some(1182),
            SyntaxError::TsInvalidParamPropPat => Some(1187),
            SyntaxError::IndexSignatureMustBeStringOrNunmber => Some(1023),
            SyntaxError::ExpectedBlock => Some(1005),
            SyntaxError::NonLastRestParam => Some(1014),
            SyntaxError::AccessibilityModifierShouldPrecedeAbstract { .. } => Some(1029),
            SyntaxError::AccessibilityModifierShouldPrecedeStatic { .. } => Some(1029),
            SyntaxError::InvalidModifierUsedWithAbstract { .. } => Some(1243),

            SyntaxError::ExpectedDigit { radix } => match radix {
                2 => Some(1177),
                8 => Some(1178),
                16 => Some(1125),
                _ => None,
            },

            SyntaxError::ExpectedComma => Some(1005),

            // It's not actaully ts1005, but it's better than ts1005, so we just use 1005 as a code.
            SyntaxError::ReservedWordInObjShorthandOrPat
            | SyntaxError::ExpectedRSquareBracket
            | SyntaxError::ExpectedRParen
            | SyntaxError::ExpectedLParen
            | SyntaxError::ExpectedPropertyName
            | SyntaxError::ExpectedBindingPat
            | SyntaxError::ExpectedRBracket
            | SyntaxError::ExpectedStatement
            | SyntaxError::DotAfterUpdate
            | SyntaxError::InvalidOptional => Some(1005),

            SyntaxError::InvalidReadonly => Some(1354),

            SyntaxError::ExpectedIdentButGotKeyword => Some(1359),

            SyntaxError::ReturnNotAllowed => Some(1108),

            SyntaxError::RestElementWithInitializer => Some(1186),
            SyntaxError::YieldNotAllowed => Some(1163),
            SyntaxError::GeneratorInOverloadOfClassMethod => Some(1221),
            SyntaxError::GeneratorInOverloadInAmbientContext => Some(1222),

            SyntaxError::ConstMustBeInitialized => Some(1155),
            SyntaxError::InvalidCodePoint => Some(1198),
            SyntaxError::TsRequiredAfterOptional => Some(1257),

            _ => None,
        }
    }

    #[cold]
    #[inline(never)]
    pub fn msg(&self) -> Cow<'static, str> {
        match self {
            SyntaxError::ExpectedExpr => "Expected an expression".into(),
            SyntaxError::ExpectedExprAfterThis => "Expected an expression after this".into(),
            SyntaxError::ExpectedIdentAfterThis => "Expected identifier after this token".into(),

            SyntaxError::PrivateNameInInterface => {
                "private names are not allowed in interface".into()
            }
            SyntaxError::TopLevelAwait => "top level await requires target to es2017 or higher \
                                           and topLevelAwait:true for ecmascript"
                .into(),
            SyntaxError::LegacyDecimal => {
                "Legacy decimal escape is not permitted in strict mode".into()
            }
            SyntaxError::LegacyOctal => {
                "Legacy octal escape is not permitted in strict mode".into()
            }
            SyntaxError::InvalidIdentChar => "Invalid character in identifier".into(),
            SyntaxError::ExpectedDigit { radix } => format!(
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
            SyntaxError::UnterminatedBlockComment => "Unterminated block comment".into(),
            SyntaxError::UnterminatedStrLit => "Unterminated string constant".into(),
            SyntaxError::ExpectedUnicodeEscape => "Expected unicode escape".into(),
            SyntaxError::EscapeInReservedWord { ref word } => {
                format!("Unexpected escape sequence in reserved word: {}", word).into()
            }
            SyntaxError::UnterminatedRegxp => "Unterminated regexp literal".into(),
            SyntaxError::UnterminatedTpl => "Unterminated template".into(),
            SyntaxError::IdentAfterNum => "Identifier cannot follow number".into(),
            SyntaxError::UnexpectedChar { c } => format!("Unexpected character {:?}", c).into(),
            SyntaxError::InvalidStrEscape => "Invalid string escape".into(),
            SyntaxError::InvalidUnicodeEscape => "Invalid unicode escape".into(),
            SyntaxError::InvalidCodePoint => "Invalid unicode code point".into(),
            SyntaxError::InvalidUnicodeEscape => "Invalid unciode escape".into(),
            SyntaxError::InvalidCodePoint => "An extended Unicode escape value must be between \
                                              0x0 and 0x10FFFF inclusive."
                .into(),
            SyntaxError::ExpectedHexChars { count } => {
                format!("Expected {} hex characters", count).into()
            }
            SyntaxError::LegacyCommentInModule => {
                "Legacy comments cannot be used in module code".into()
            }
            SyntaxError::NumLitTerminatedWithExp => "Expected +, - or decimal digit after e".into(),

            SyntaxError::InvalidIdentInStrict => {
                "'implements', 'interface', 'let', 'package', 'private', 'protected',  'public', \
                 'static', or 'yield' cannot be used as an identifier in strict mode"
                    .into()
            }
            SyntaxError::EvalAndArgumentsInStrict => "'eval' and 'arguments' cannot be used as a \
                                                      binding identifier in strict mode"
                .into(),
            SyntaxError::UnaryInExp { .. } => "** cannot be applied to unary expression".into(),
            SyntaxError::Hash => "Unexpected token '#'".into(),
            SyntaxError::LineBreakInThrow => "LineBreak cannot follow 'throw'".into(),
            SyntaxError::LineBreakBeforeArrow => {
                "Unexpected line break between arrow head and arrow".into()
            }
            SyntaxError::Unexpected {
                ref got,
                ref expected,
            } => format!("Unexpected token `{}`. Expected {}", got, expected).into(),

            SyntaxError::ReservedWordInImport => "cannot import as reserved word".into(),
            SyntaxError::AssignProperty => "assignment property is invalid syntax".into(),
            SyntaxError::Expected(token, ref got) => {
                format!("Expected {:?}, got {}", token, got).into()
            }
            SyntaxError::ExpectedSemiForExprStmt { .. } => "Expected ';', '}' or <eof>".into(),

            SyntaxError::AwaitStar => "await* has been removed from the async functions proposal. \
                                       Use Promise.all() instead."
                .into(),

            SyntaxError::ReservedWordInObjShorthandOrPat => {
                "Cannot use a reserved word as a shorthand property".into()
            }

            SyntaxError::MultipleDefault { .. } => {
                "A switch block cannot have multiple defaults".into()
            }
            SyntaxError::CommaAfterRestElement => {
                "Trailing comma isn't permitted after a rest element".into()
            }
            SyntaxError::NonLastRestParam => {
                "A rest parameter must be last in a parameter list".into()
            }
            SyntaxError::SpreadInParenExpr => {
                "Parenthesized expression cannot contain spread operator".into()
            }
            SyntaxError::EmptyParenExpr => "Parenthesized expression cannot be empty".into(),
            SyntaxError::InvalidPat => "Not a pattern".into(),
            SyntaxError::InvalidExpr => "Not an expression".into(),
            // TODO
            SyntaxError::NotSimpleAssign => "Cannot assign to this".into(),
            SyntaxError::ExpectedIdent => "Expected ident".into(),
            SyntaxError::ExpectedSemi => "Expected ';' or line break".into(),
            SyntaxError::DuplicateLabel(ref label) => {
                format!("Label {} is already declared", label).into()
            }
            SyntaxError::AsyncGenerator => "An async function cannot be generator".into(),
            SyntaxError::NonTopLevelImportExport => {
                "'import', and 'export' are not permitted here".into()
            }
            SyntaxError::ImportExportInScript => {
                "'import', and 'export' cannot be used outside of module code".into()
            }

            SyntaxError::PatVarWithoutInit => "Destructuring bindings require initializers".into(),
            SyntaxError::WithInStrict => "With statement are not allowed in strict mode".into(),
            SyntaxError::ReturnNotAllowed => {
                "A 'return' statement can only be used within a function body.".into()
            }
            SyntaxError::TooManyVarInForInHead => "Expected one variable binding".into(),
            SyntaxError::VarInitializerInForInHead => {
                "Unexpected initializer in for in/of loop".into()
            }
            SyntaxError::LabelledGenerator => "Generator cannot be labelled".into(),
            SyntaxError::YieldParamInGen => {
                "'yield' cannot be used as a parameter within generator".into()
            }
            SyntaxError::AwaitForStmt => {
                "for await syntax is valid only for for-of statement".into()
            }

            SyntaxError::UnterminatedJSXContents => "Unterminated JSX contents".into(),
            SyntaxError::EmptyJSXAttr => {
                "JSX attributes must only be assigned a non-empty expression".into()
            }
            SyntaxError::InvalidJSXValue => {
                "JSX value should be either an expression or a quoted JSX text".into()
            }
            SyntaxError::JSXExpectedClosingTagForLtGt => {
                "Expected corresponding JSX closing tag for <>".into()
            }
            SyntaxError::JSXExpectedClosingTag { ref tag } => {
                format!("Expected corresponding JSX closing tag for <{}>", tag).into()
            }
            SyntaxError::InvalidLeadingDecorator => {
                "Leading decorators must be attached to a class declaration".into()
            }
            SyntaxError::DecoratorOnExport => "Using the export keyword between a decorator and a \
                                               class is not allowed. Please use `export @dec \
                                               class` instead."
                .into(),
            SyntaxError::TsRequiredAfterOptional => {
                "A required element cannot follow an optional element.".into()
            }
            SyntaxError::SpaceBetweenHashAndIdent => {
                "Unexpected space between # and identifier".into()
            }
            SyntaxError::AsyncConstructor => "Constructor can't be an async function".into(),
            SyntaxError::PropertyNamedConstructor => {
                "Classes may not have a non-static field named 'constructor'".into()
            }
            SyntaxError::DeclarePrivateIdentifier => {
                "'declare' modifier cannot be used with a private identifier".into()
            }
            SyntaxError::ClassProperty => {
                "Class property requires `jsc.parser.classProperty` to be true".into()
            }
            SyntaxError::ReadOnlyMethod => "A method cannot be readonly".into(),
            SyntaxError::TsBindingPatCannotBeOptional => "A binding pattern parameter cannot be \
                                                          optional in an implementation signature."
                .into(),

            SyntaxError::TrailingCommaInsideImport => {
                "Trailing comma is disallowed inside import(...) arguments".into()
            }
            SyntaxError::DynamicImport => {
                "import(...) expressions requires `jsc.parser.dynamicImport` to be true".into()
            }
            SyntaxError::ExportDefaultWithOutFrom => {
                "export default statements required from '...';".into()
            }
            SyntaxError::ExportNamespaceFrom => "export * as Foo from 'foo'; requires \
                                                 `jsc.parser.exportNamespaceFrom` to be true"
                .into(),

            SyntaxError::DotsWithoutIdentifier => {
                "`...` must be followed by an identifier in declaration contexts".into()
            }

            SyntaxError::NumericSeparatorIsAllowedOnlyBetweenTwoDigits => {
                "A numeric separator is only allowed between two digits".into()
            }

            SyntaxError::NullishCoalescingWithLogicalOp => {
                "Nullish coalescing operator(??) requires parens when mixing with logical operators"
                    .into()
            }
            SyntaxError::NullishCoalescingNotEnabled => {
                "Nullish coalescing operator(??) requires jsc.parser.nullishCoalescing".into()
            }

            SyntaxError::TS1056 => {
                "jsc.target should be es5 or upper to use getter / setter".into()
            }
            SyntaxError::TS1110 => "type expected".into(),
            SyntaxError::TS1141 => "literal in an import type should be string literal".into(),

            SyntaxError::Eof => "Unexpected eof".into(),

            SyntaxError::TS2703 => {
                "The operand of a delete operator must be a property reference.".into()
            }
            SyntaxError::DeclNotAllowed => "Declaration is now allowed".into(),
            SyntaxError::DeclNotAllowed => "Declatation is not allowed".into(),
            SyntaxError::InvalidSuperCall => "Invalid `super()`".into(),
            SyntaxError::InvalidSuper => "Invalid access to super".into(),
            SyntaxError::ArrowNotAllowed => "An arrow function is not allowed here".into(),
            SyntaxError::ExportNotAllowed => "`export` is not allowed here".into(),
            SyntaxError::GetterSetterCannotBeReadonly => {
                "A getter or a setter cannot be readonly".into()
            }
            SyntaxError::RestPatInSetter => "Rest pattern is not allowed in setter".into(),

            SyntaxError::GeneratorConstructor => "A constructor cannot be generator".into(),

            SyntaxError::TS1003 => "Expected an identifier".into(),
            SyntaxError::TS1005 => "Expected a semicolon".into(),
            SyntaxError::TrailingCommaInVarDecl => "Trailing comma is not allowed".into(),
            SyntaxError::TS1014 => "A rest parameter must be last in a parameter list".into(),
            SyntaxError::TS1015 => "Parameter cannot have question mark and initializer".into(),
            SyntaxError::TS1029(left, right) => {
                format!("'{}' modifier must precede '{}' modifier.", left, right).into()
            }
            SyntaxError::TS1030(word) => format!("'{}' modifier already seen.", word).into(),
            SyntaxError::TS1031 => "`declare` modifier cannot appear on a class element".into(),
            SyntaxError::DeclareButAlreadyInAmbientContext => {
                "`declare` modifier not allowed for code already in an ambient context".into()
            }
            SyntaxError::InvalidModifier { modifier } => {
                format!("`{}` modifier cannot be used here.", modifier).into()
            }
            SyntaxError::TS1047 => "A rest parameter cannot be optional".into(),
            SyntaxError::TS1048 => "A rest parameter cannot have an initializer".into(),
            SyntaxError::TS1085 => "Legacy octal literals are not available when targeting \
                                    ECMAScript 5 and higher"
                .into(),
            SyntaxError::TS1089(word) => format!(
                "'{}' modifier cannot appear on a constructor declaration",
                word
            )
            .into(),
            SyntaxError::TS1092 => {
                "Type parameters cannot appear on a constructor declaration".into()
            }
            SyntaxError::TS1096 => "An index signature must have exactly one parameter".into(),
            SyntaxError::TS1098 => "Type parameter list cannot be empty".into(),
            SyntaxError::TS1100 => "Invalid use of 'arguments' in strict mode".into(),
            SyntaxError::TS1102 => {
                "'delete' cannot be called on an identifier in strict mode".into()
            }
            SyntaxError::TS1105 => "A 'break' statement can only be used within an enclosing \
                                    iteration or switch statement"
                .into(),
            SyntaxError::TS1107 => "Jump target cannot cross function boundary".into(),
            SyntaxError::TS1109 => "Expression expected".into(),
            SyntaxError::TS1114 => "Duplicate label".into(),
            SyntaxError::TS1115 => "A 'continue' statement can only jump to a label of an \
                                    enclosing iteration statement"
                .into(),
            SyntaxError::TS1116 => {
                "A 'break' statement can only jump to a label of an enclosing statement".into()
            }
            SyntaxError::EmptyVarDecl => "Variable declaration list cannot be empty".into(),
            SyntaxError::ObjectMemberCannotBeOptional => {
                "An object member cannot be declared optional".into()
            }
            SyntaxError::TS1164 => "Computed property names are not allowed in enums".into(),
            SyntaxError::TS1171 => {
                "A comma expression is not allowed in a computed property name".into()
            }
            SyntaxError::TS1172 => "`extends` clause already seen.".into(),
            SyntaxError::TS1173 => "'extends' clause must precede 'implements' clause.".into(),
            SyntaxError::ExtendsAlreadySeen => "`extends` clause already seen.".into(),
            SyntaxError::TS1174 => "Classes can only extend a single class".into(),
            SyntaxError::ImplementsAlreadySeen => "`implements` clause already seen".into(),
            SyntaxError::ImplementationInAmbientContext => {
                "An implementation cannot be declared in ambient contexts".into()
            }
            SyntaxError::TS1093 => {
                "Type annotation cannot appear on a constructor declaration".into()
            }
            SyntaxError::TS1094 => {
                "A `set` accessor must have a corresponding `get` accessor".into()
            }
            SyntaxError::TS1196 => "Catch clause variable cannot have a type annotation".into(),
            SyntaxError::TS1242 => {
                "`abstract` modifier can only appear on a class or method declaration".into()
            }
            SyntaxError::TS1243(left, right) => format!(
                "'{}' modifier cannot be used with '{}' modifier.",
                left, right
            )
            .into(),
            SyntaxError::TS2369 => {
                "A parameter property is only allowed in a constructor implementation".into()
            }
            SyntaxError::ParameterDefaultInAmbientContext => "A parameter initializer is only \
                                                              allowed in a function or \
                                                              constructor implementation"
                .into(),
            SyntaxError::TS2406 => "Not a variable".into(),
            SyntaxError::TS2410 => "The 'with' statement is not supported. All symbols in a \
                                    'with' block will have type 'any'."
                .into(),
            SyntaxError::TS2414 => "Invalid class name".into(),
            SyntaxError::TS2427 => "interface name is invalid".into(),
            SyntaxError::TS2452 => "An enum member cannot have a numeric name".into(),
            SyntaxError::TS2483 => {
                "The left-hand side of a 'for...of' statement cannot use a type annotation".into()
            }
            SyntaxError::TS2491 => "The left-hand side of a 'for...in' statement cannot be a \
                                    destructuring pattern"
                .into(),
            SyntaxError::TS4112 => "This member cannot have an 'override' modifier because its \
                                    containing class does not extend another class."
                .into(),
            SyntaxError::TSTypeAnnotationAfterAssign => {
                "Type annotations must come before default assignments".into()

            SyntaxError::AbstractMemberInNonAbstractClass => {
                "Abstract methods can only appear within an abstract class".into()
            }
            SyntaxError::SetterParamRequired => "Setter should have exactly one parameter".into(),
            SyntaxError::StaticWithAbstract => {
                "'static' modifier cannot be used with 'abstract' modifier".into()
            }
            SyntaxError::DecoratorNotAllowed => "Decorators are not valid here".into(),
            SyntaxError::GetterShouldNotHaveParam => {
                "A 'get' accessor cannot have parameters".into()
            }
            SyntaxError::SetterShouldHaveOneParam => {
                "A 'set' accessor must have exactly one parameter".into()
            }
            SyntaxError::GetterShouldNotHaveTypeParam => {
                "An accessor cannot have type parameters".into()
            }
            SyntaxError::SetterShouldNotHaveTypeParam => {
                "An accessor cannot have type parameters".into()
            }
            SyntaxError::ExtendsMustPrecedeImplements => {
                "'extends' clause must precede 'implements' clause".into()
            }

            SyntaxError::TsInvalidParamPropPat => {
                "A parameter property may not be declared using a binding pattern".into()
            }
            SyntaxError::IndexSignatureMustBeStringOrNunmber => {
                "An index signature parameter type must be either 'string' or 'number'".into()
            }
            SyntaxError::ExpectedBlock => "Expected '{'".into(),
            SyntaxError::AccessibilityModifierShouldPrecedeAbstract { accessibility } => format!(
                "'{}' modifier must precede 'abstract' modifier",
                accessibility
            )
            .into(),
            SyntaxError::InvalidModifierUsedWithAbstract { modifier } => format!(
                "'{}' modifier cannot be used with 'abstract' modifier",
                modifier
            )
            .into(),
            SyntaxError::ExpectedComma => "Expected ','".into(),
            SyntaxError::AccessibilityModifierShouldPrecedeStatic { accessibility } => format!(
                "'{}' modifier must precede 'static' modifier",
                accessibility
            )
            .into(),
            SyntaxError::ExpectedRSquareBracket => "Expected ']'".into(),
            SyntaxError::InvalidReadonly => {
                "'readonly' type modifier is only permitted on array and tuple literal types".into()
            }
            SyntaxError::ExpectedLParen => "Expected '('".into(),
            SyntaxError::ExpectedRParen => "Expected ')'".into(),
            SyntaxError::ExpectedIdentButGotKeyword => {
                "Expected an identifier, but found keyword".into()
            }
            SyntaxError::RestElementWithInitializer => {
                "A rest element cannot have an initializer".into()
            }
            SyntaxError::ExpectedPropertyName => "Expected a property name".into(),
            SyntaxError::YieldNotAllowed => {
                "A 'yield' expression is only allowed in a generator body".into()
            }
            SyntaxError::GeneratorInOverloadOfClassMethod => {
                "An overload signature cannot be declared as a generator".into()
            }
            SyntaxError::GeneratorInOverloadInAmbientContext => {
                "Generators are not allowed in an ambient context".into()
            }
            SyntaxError::ConstMustBeInitialized => {
                "'const' declarations must be initialized".into()
            }
            SyntaxError::ExpectedBindingPat => "Expected a binding pattern".into(),
            SyntaxError::ExpectedRBracket => "Expected '}'".into(),
            SyntaxError::ExpectedStatement => "Expected a statement".into(),
            SyntaxError::DotAfterUpdate => "'.' cannot follow an update expression".into(),
            SyntaxError::InvalidOptional => "Unexpected '?'".into(),
        }
    }
}

impl Error {
    #[cold]
    #[inline(never)]
    pub fn into_diagnostic(self, handler: &Handler) -> DiagnosticBuilder {
        let span = self.span();

        let kind = self.into_kind();
        let msg = kind.msg();

        let code = kind.code().map(|v| v.to_string()).map(DiagnosticId::Error);

        let mut db = if let Some(code) = code {
            handler.struct_err_with_code(&msg, code)
        } else {
            handler.struct_err(&msg)
        };
        db.set_span(span);

        match kind {
            SyntaxError::ExpectedSemiForExprStmt { expr } => {
                db.span_note(
                    expr,
                    "This is the expression part of an expression statement",
                );
            }
            SyntaxError::MultipleDefault { previous } => {
                db.span_note(previous, "previous default case is declared at here");
            }
            _ => {}
        }

        db
    }
}

#[test]
fn size_of_error() {
    assert_eq!(std::mem::size_of::<Error>(), 8);
}
