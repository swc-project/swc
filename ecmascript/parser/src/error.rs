use swc_atoms::JsWord;
use swc_common::Span;
use token::Token;

#[derive(Debug)]
pub enum SyntaxError {
    /// "implements", "interface", "let", "package",\
    ///  "private", "protected",  "public", "static", or "yield"
    InvalidIdentInStrict,
    /// 'eval' and 'arguments' are invalid identfier in strict mode.
    EvalAndArgumentsInStrict,
    UnaryInExp,
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
    /// Destructuring bindings require initializers.
    PatVarWithoutInit {
        span: Span,
    },
}
