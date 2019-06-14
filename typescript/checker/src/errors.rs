use std::{ops::RangeInclusive, path::PathBuf};
use swc_atoms::JsWord;
use swc_common::{errors::Handler, Span, Spanned};
use swc_ecma_ast::{TsType, TsTypeElement};

#[derive(Debug, Clone, PartialEq, Spanned)]
pub enum Error {
    ShouldIncludeUndefinedType {
        /// Span of the variable
        span: Span,
    },

    Unimplemented {
        span: Span,
        msg: String,
    },

    ResolvedFailed {
        span: Span,
        base: PathBuf,
        src: JsWord,
    },

    MissingFields {
        span: Span,
        fields: Vec<TsTypeElement>,
    },

    AssignFailed {
        #[span(lo)]
        left: TsType,
        #[span(hi)]
        right: TsType,
        cause: Vec<Error>,
    },

    /// a or b or c
    UnionError {
        span: Span,
        errors: Vec<Error>,
    },

    IntersectionError {
        span: Span,
        error: Box<Error>,
    },

    CannotAssingToThis {
        span: Span,
    },

    MayBeUndefined {
        /// Span of the variable
        span: Span,
    },

    UndefinedSymbol {
        span: Span,
    },

    ModuleLoadFailed {
        /// Span of the import statement.
        span: Span,
        errors: Vec<Error>,
    },

    NoSuchExport {
        span: Span,
        items: Vec<(JsWord, Span)>,
    },

    NoNewSignature {
        span: Span,
    },

    NoCallSignature {
        span: Span,
    },

    WrongTypeParams {
        /// Span of caller.
        span: Span,
        /// Span of callee.
        callee: Span,
        expected: RangeInclusive<usize>,
        actual: usize,
    },

    WrongParams {
        /// Span of caller.
        span: Span,
        /// Span of callee.
        callee: Span,
        expected: RangeInclusive<usize>,
        actual: usize,
    },
}

impl Error {
    pub fn emit(self, h: &Handler) {
        let span = self.span();

        let mut err = match self {
            Error::Unimplemented { ref msg, .. } => {
                h.struct_err(&format!("unimplemented\n{}", msg))
            }
            _ => h.struct_err(&format!("{:#?}", self)),
        };

        err.set_span(span).emit();
    }
}
