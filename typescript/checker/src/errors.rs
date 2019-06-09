use std::{ops::Range, path::PathBuf};
use swc_atoms::JsWord;
use swc_common::{errors::Handler, Span};
use swc_ecma_ast::{TsType, TsTypeElement};

#[derive(Debug, Clone, PartialEq)]
pub enum Error {
    ShouldIncludeUndefinedType {
        /// Span of the variable
        span: Span,
    },

    ResolvedFailed {
        base: PathBuf,
        src: JsWord,
    },

    MissingFields {
        span: Span,
        fields: Vec<TsTypeElement>,
    },

    AssignFailed {
        left: TsType,
        right: TsType,
        cause: Option<Box<Error>>,
    },

    /// a or b or c
    UnionError {
        errors: Vec<Error>,
    },

    IntersectionError {
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

    NoSuchExport {
        items: Vec<(JsWord, Span)>,
    },

    NoNewSignature {
        span: Span,
    },

    NoCallSignature {
        span: Span,
    },

    WrongTypeParams {
        expected: Range<usize>,
        actual: usize,
    },

    WrongParams {
        expected: Range<usize>,
        actual: usize,
    },
}

impl Error {
    pub fn emit(self, h: &Handler) {
        h.struct_err(&format!("{:?}", self)).emit();
    }
}
