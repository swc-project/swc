use std::borrow::Cow;

use swc_common::{
    errors::{DiagnosticBuilder, Handler},
    Span,
};

/// Size is same as a size of a pointer.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Error {
    inner: Box<(Span, ErrorKind)>,
}

impl Error {
    pub fn kind(&self) -> &ErrorKind {
        &self.inner.1
    }

    pub fn into_inner(self) -> Box<(Span, ErrorKind)> {
        self.inner
    }

    pub fn new(span: Span, kind: ErrorKind) -> Self {
        Error {
            inner: Box::new((span, kind)),
        }
    }

    pub fn message(&self) -> Cow<'static, str> {
        match &self.inner.1 {
            ErrorKind::Eof => "Unexpected end of file".into(),

            // Lexer errors
            ErrorKind::AbruptClosingOfEmptyComment => "Abrupt closing of empty comment".into(),
            ErrorKind::AbruptDoctypePublicIdentifier => "Abrupt doctype public identifier".into(),
            ErrorKind::AbruptDoctypeSystemIdentifier => "Abrupt doctype system identifier".into(),
            ErrorKind::ControlCharacterInInputStream => "Control character in input stream".into(),
            ErrorKind::EndTagWithAttributes => "End tag with attributes".into(),
            ErrorKind::ShortTagWithAttributes => "Short tag with attributes".into(),
            ErrorKind::DuplicateAttribute => "Duplicate attribute".into(),
            ErrorKind::EndTagWithTrailingSolidus => "End tag with trailing solidus".into(),
            ErrorKind::EofBeforeTagName => "Eof before tag name".into(),
            ErrorKind::EofInCdata => "Eof in cdata".into(),
            ErrorKind::EofInComment => "Eof in comment".into(),
            ErrorKind::EofInDoctype => "Eof in doctype".into(),
            ErrorKind::EofInTag => "Eof in tag".into(),
            ErrorKind::EofInProcessingInstruction => "Eof in processing instruction".into(),
            ErrorKind::IncorrectlyClosedComment => "Incorrectly closed comment".into(),
            ErrorKind::IncorrectlyOpenedComment => "Incorrectly opened comment".into(),
            ErrorKind::InvalidCharacterSequenceAfterDoctypeName => {
                "Invalid character sequence after doctype name".into()
            }
            ErrorKind::InvalidFirstCharacterOfTagName => {
                "Invalid first character of tag name".into()
            }
            ErrorKind::InvalidCharacterOfProcessingInstruction => {
                "Invalid character of processing instruction".into()
            }
            ErrorKind::InvalidCharacterInTag => "Invalid character in tag".into(),
            ErrorKind::MissingDoctypeName => "Missing doctype name".into(),
            ErrorKind::MissingDoctypePublicIdentifier => "Missing doctype public identifier".into(),
            ErrorKind::MissingQuoteBeforeDoctypePublicIdentifier => {
                "Missing quote before doctype public identifier".into()
            }
            ErrorKind::MissingQuoteBeforeDoctypeSystemIdentifier => {
                "Missing quote before doctype system identifier".into()
            }
            ErrorKind::MissingSemicolonAfterCharacterReference => {
                "Missing semicolon after character reference".into()
            }
            ErrorKind::MissingWhitespaceAfterDoctypePublicKeyword => {
                "Missing whitespace after doctype public keyword".into()
            }
            ErrorKind::MissingWhitespaceAfterDoctypeSystemKeyword => {
                "Missing whitespace after doctype system keyword".into()
            }
            ErrorKind::MissingWhitespaceBeforeDoctypeName => {
                "Missing whitespace before doctype name".into()
            }
            ErrorKind::MissingWhitespaceBetweenDoctypePublicAndSystemIdentifiers => {
                "Missing whitespace between doctype public and system identifiers".into()
            }
            ErrorKind::NestedComment => "Nested comment".into(),
            ErrorKind::DoubleHyphenWithInComment => "Double hyper within comment".into(),
            ErrorKind::NoncharacterInInputStream => "Noncharacter in input stream".into(),
            ErrorKind::SurrogateInInputStream => "Surrogate in input stream".into(),
            ErrorKind::SurrogateCharacterReference => "Surrogate character reference".into(),
            ErrorKind::UnexpectedCharacterAfterDoctypeSystemIdentifier => {
                "Unexpected character after doctype system identifier".into()
            }
            ErrorKind::UnexpectedColonBeforeAttributeName => {
                "Unexpected colon before attribute name".into()
            }
            ErrorKind::UnexpectedSolidusInTag => "Unexpected solidus in tag".into(),
            ErrorKind::NoTargetNameInProcessingInstruction => "No target name".into(),
            ErrorKind::MissingWhitespaceBeforeQuestionInProcessingInstruction => {
                "Missing whitespace before '?'".into()
            }

            // Parser errors
            ErrorKind::UnexpectedTokenInStartPhase => "Unexpected token in start phase".into(),
            ErrorKind::UnexpectedTokenInMainPhase => "Unexpected token in main phase".into(),
            ErrorKind::UnexpectedTokenInEndPhase => "Unexpected token in end phase".into(),
            ErrorKind::UnexpectedEofInStartPhase => "Unexpected end of file in start phase".into(),
            ErrorKind::UnexpectedEofInMainPhase => "Unexpected end of file in main phase".into(),
            ErrorKind::OpeningAndEndingTagMismatch => "Opening and ending tag mismatch".into(),
            ErrorKind::UnexpectedCharacter => {
                "Unexpected character, only whitespace character allowed".into()
            }
        }
    }

    pub fn to_diagnostics<'a>(&self, handler: &'a Handler) -> DiagnosticBuilder<'a> {
        handler.struct_span_err(self.inner.0, &self.message())
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
#[non_exhaustive]
pub enum ErrorKind {
    Eof,

    // Lexer errors
    AbruptClosingOfEmptyComment,
    AbruptDoctypePublicIdentifier,
    AbruptDoctypeSystemIdentifier,
    ControlCharacterInInputStream,
    EndTagWithAttributes,
    ShortTagWithAttributes,
    DuplicateAttribute,
    EndTagWithTrailingSolidus,
    EofBeforeTagName,
    EofInCdata,
    EofInComment,
    EofInDoctype,
    EofInTag,
    EofInProcessingInstruction,
    IncorrectlyClosedComment,
    IncorrectlyOpenedComment,
    InvalidCharacterSequenceAfterDoctypeName,
    InvalidFirstCharacterOfTagName,
    InvalidCharacterOfProcessingInstruction,
    InvalidCharacterInTag,
    MissingDoctypeName,
    MissingDoctypePublicIdentifier,
    MissingQuoteBeforeDoctypePublicIdentifier,
    MissingQuoteBeforeDoctypeSystemIdentifier,
    MissingSemicolonAfterCharacterReference,
    MissingWhitespaceAfterDoctypePublicKeyword,
    MissingWhitespaceAfterDoctypeSystemKeyword,
    MissingWhitespaceBeforeDoctypeName,
    MissingWhitespaceBetweenDoctypePublicAndSystemIdentifiers,
    NestedComment,
    DoubleHyphenWithInComment,
    NoncharacterInInputStream,
    SurrogateInInputStream,
    SurrogateCharacterReference,
    UnexpectedCharacterAfterDoctypeSystemIdentifier,
    UnexpectedColonBeforeAttributeName,
    UnexpectedSolidusInTag,
    NoTargetNameInProcessingInstruction,
    MissingWhitespaceBeforeQuestionInProcessingInstruction,

    // Parser errors
    UnexpectedTokenInStartPhase,
    UnexpectedTokenInMainPhase,
    UnexpectedTokenInEndPhase,
    UnexpectedEofInStartPhase,
    UnexpectedEofInMainPhase,
    OpeningAndEndingTagMismatch,
    UnexpectedCharacter,
}
