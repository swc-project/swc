use std::borrow::Cow;

use swc_atoms::JsWord;
use swc_common::{
    errors::{DiagnosticBuilder, Handler},
    Span,
};

/// Size is same as a size of a pointer.
#[derive(Debug, Clone, PartialEq)]
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
            ErrorKind::AbsenceOfDigitsInNumericCharacterReference => {
                "Absence of digits in numeric character reference".into()
            }
            ErrorKind::CdataInHtmlContent => "Cdata in html content".into(),
            ErrorKind::CharacterReferenceOutsideUnicodeRange => {
                "Character reference outside unicode range".into()
            }
            ErrorKind::ControlCharacterInInputStream => "Control character in input stream".into(),
            ErrorKind::ControlCharacterReference => "Control character reference".into(),
            ErrorKind::EndTagWithAttributes => "End tag with attributes".into(),
            ErrorKind::DuplicateAttribute => "Duplicate attribute".into(),
            ErrorKind::EndTagWithTrailingSolidus => "End tag with trailing solidus".into(),
            ErrorKind::EofBeforeTagName => "Eof before tag name".into(),
            ErrorKind::EofInCdata => "Eof in cdata".into(),
            ErrorKind::EofInComment => "Eof in comment".into(),
            ErrorKind::EofInDoctype => "Eof in doctype".into(),
            ErrorKind::EofInScriptHtmlCommentLikeText => {
                "Eof in script html comment like text".into()
            }
            ErrorKind::EofInTag => "Eof in tag".into(),
            ErrorKind::IncorrectlyClosedComment => "Incorrectly closed comment".into(),
            ErrorKind::IncorrectlyOpenedComment => "Incorrectly opened comment".into(),
            ErrorKind::InvalidCharacterSequenceAfterDoctypeName => {
                "Invalid character sequence after doctype name".into()
            }
            ErrorKind::InvalidFirstCharacterOfTagName => {
                "Invalid first character of tag name".into()
            }
            ErrorKind::MissingAttributeValue => "Missing attribute value".into(),
            ErrorKind::MissingDoctypeName => "Missing doctype name".into(),
            ErrorKind::MissingDoctypePublicIdentifier => "Missing doctype public identifier".into(),
            ErrorKind::MissingDoctypeSystemIdentifier => "Missing doctype system identifier".into(),
            ErrorKind::MissingEndTagName => "Missing end tag name".into(),
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
            ErrorKind::MissingWhitespaceBetweenAttributes => {
                "Missing whitespace between attributes".into()
            }
            ErrorKind::MissingWhitespaceBetweenDoctypePublicAndSystemIdentifiers => {
                "Missing whitespace between doctype public and system identifiers".into()
            }
            ErrorKind::NestedComment => "Nested comment".into(),
            ErrorKind::NoncharacterCharacterReference => "Noncharacter character reference".into(),
            ErrorKind::NoncharacterInInputStream => "Noncharacter in input stream".into(),
            ErrorKind::NonVoidHtmlElementStartTagWithTrailingSolidus => {
                "Non void html element start tag with trailing solidus".into()
            }
            ErrorKind::NullCharacterReference => "Null character reference".into(),
            ErrorKind::SurrogateCharacterReference => "Surrogate character reference".into(),
            ErrorKind::SurrogateInInputStream => "Surrogate in input stream".into(),
            ErrorKind::UnexpectedCharacterAfterDoctypeSystemIdentifier => {
                "Unexpected character after doctype system identifier".into()
            }
            ErrorKind::UnexpectedCharacterInAttributeName => {
                "Unexpected character in attribute name".into()
            }
            ErrorKind::UnexpectedCharacterInUnquotedAttributeValue => {
                "Unexpected character in unquoted attribute value".into()
            }
            ErrorKind::UnexpectedEqualsSignBeforeAttributeName => {
                "Unexpected equals sign before attribute name".into()
            }
            ErrorKind::UnexpectedNullCharacter => "Unexpected null character".into(),
            ErrorKind::UnexpectedQuestionMarkInsteadOfTagName => {
                "Unexpected question mark instead of tag name".into()
            }
            ErrorKind::UnexpectedSolidusInTag => "Unexpected solidus in tag".into(),
            ErrorKind::UnknownNamedCharacterReference => "Unknown named character reference".into(),

            // Parser errors
            ErrorKind::StrayStartTag(tag_name) => {
                format!("Stray start tag \"{}\"", tag_name).into()
            }
            ErrorKind::StrayEndTag(tag_name) => format!("Stray end tag \"{}\"", tag_name).into(),
            ErrorKind::UnclosedElements(tag_name) => format!(
                "End tag \"{}\" seen, but there were open elements",
                tag_name
            )
            .into(),
            ErrorKind::UnclosedElementsImplied(tag_name) => format!(
                "End tag \"{}\" implied, but there were open elements",
                tag_name
            )
            .into(),
            ErrorKind::UnclosedElementsCell => {
                "A table cell was implicitly closed, but there were open elements".into()
            }
            ErrorKind::StrayDoctype => "Stray doctype".into(),
            ErrorKind::NonConformingDoctype => "Non conforming doctype".into(),
            ErrorKind::NonSpaceCharacterInTrailer => "Non-space character in page trailer".into(),
            ErrorKind::NonSpaceCharacterAfterFrameset => {
                "Non-space character after \"frameset\"".into()
            }
            ErrorKind::NonSpaceCharacterInFrameset => "Non-space character in \"frameset\"".into(),
            ErrorKind::NonSpaceCharacterAfterBody => "Non-space character after body".into(),
            ErrorKind::NonSpaceCharacterInColumnGroup => {
                "Non-space character in \"colgroup\" element".into()
            }
            ErrorKind::NonSpaceCharacterInNoscriptInHead => {
                "Non-space character inside \"noscript\" inside \"head\"".into()
            }
            ErrorKind::SomethingBetweenHeadAndBody(tag_name) => {
                format!("\"{}\" element between \"head\" and \"body\"", tag_name).into()
            }
            ErrorKind::StartTagWithoutDoctype => {
                "Start tag seen without seeing a doctype firs, expected \"<!DOCTYPE html>\"".into()
            }
            ErrorKind::StartSelectWhereEndSelectExpected => {
                "\"select\" start tag where end tag expected".into()
            }
            ErrorKind::StartTagWithSelectOpen(tag_name) => {
                format!("\"{}\" start tag with \"select\" open", tag_name).into()
            }
            ErrorKind::BadStartTagInNoscriptInHead(tag_name) => format!(
                "Bad start tag in \"{}\" in \"noscript\" in \"head\"",
                tag_name
            )
            .into(),
            ErrorKind::UnexpectedImageStartTag => {
                "Saw a start tag \"image\", \"img\" element is outdated".into()
            }
            ErrorKind::SomethingSeenWhenSomethingOpen(tag_name) => format!(
                "Start tag \"{}\" seen but an element of the same type was already open",
                tag_name
            )
            .into(),
            ErrorKind::HeadingWhenHeadingOpen => {
                "Heading cannot be a child of another heading".into()
            }
            ErrorKind::NoCellToClose => "No cell to close".into(),
            ErrorKind::StartTagInTable(tag_name) => {
                format!("Start tag \"{}\" seen in \"table\"", tag_name).into()
            }
            ErrorKind::FormWhenFormOpen => "Saw a \"form\" start tag, but there was already an \
                                            active \"form\" element, nested forms are not allowed"
                .into(),
            ErrorKind::TableSeenWhileTableOpen => {
                "Start tag for \"table\" seen but the previous \"table\" is still open".into()
            }
            ErrorKind::StartTagInTableBody(tag_name) => {
                format!("Start tag \"{}\" seen in \"table\" body", tag_name).into()
            }
            ErrorKind::EndTagSeenWithoutDoctype => {
                "End tag seen without seeing a doctype first, expected \"<!DOCTYPE html>\"".into()
            }
            ErrorKind::EndTagAfterBody => "Saw an end tag after \"body\" had been closed".into(),
            ErrorKind::EndTagSeenWithSelectOpen(tag_name) => {
                format!("\"{}\" end tag with \"select\" open", tag_name).into()
            }
            ErrorKind::GarbageInColumnGroup => "Garbage in \"colgroup\" element".into(),
            ErrorKind::EndTagBr => "End tag \"br\"".into(),
            ErrorKind::NoElementToCloseButEndTagSeen(tag_name) => format!(
                "No \"{}\" element in scope but a \"{}\" end tag seen",
                tag_name, tag_name
            )
            .into(),
            ErrorKind::HtmlStartTagInForeignContext(tag_name) => format!(
                "HTML start tag \"{}\" in a foreign namespace context",
                tag_name
            )
            .into(),
            ErrorKind::HtmlEndTagInForeignContext(tag_name) => format!(
                "HTML end tag \"{}\" in a foreign namespace context",
                tag_name
            )
            .into(),
            ErrorKind::NoTableRowToClose => "No table row to close".into(),
            ErrorKind::NonSpaceCharacterInTable => {
                "Misplaced non-space characters inside a table".into()
            }
            ErrorKind::UnexpectedStartTagInRuby(tag_name) => format!(
                "Unexpected start tag \"<{}>\" with \"<ruby>\" open",
                tag_name
            )
            .into(),
            ErrorKind::UnclosedElementsOnStack => "Unclosed elements on stack".into(),
            ErrorKind::EndTagDidNotMatchCurrentOpenElement(
                end_tag_name,
                current_element_tag_name,
            ) => format!(
                "End tag \"{}\" did not match the name of the current open element (\"{}\")",
                end_tag_name, current_element_tag_name
            )
            .into(),
            ErrorKind::EndTagViolatesNestingRules(tag_name) => {
                format!("End tag \"{}\" violates nesting rules", tag_name).into()
            }
            ErrorKind::EofWithUnclosedElements => {
                "End of file seen and there were open elements".into()
            }
            ErrorKind::EndTagWithUnclosedElements(tag_name) => format!(
                "Unexpected end tag for \"{}\", but there were unclosed elements",
                tag_name
            )
            .into(),
            ErrorKind::NonSpaceCharacterWithoutDoctype => "Non-space characters found without \
                                                           seeing a doctype first, expected \
                                                           \"<!DOCTYPE html>\""
                .into(),
            ErrorKind::EofWithoutDoctype => "End of file seen without seeing a doctype first, \
                                             expected \"<!DOCTYPE html>\""
                .into(),
            ErrorKind::UnexpectedEof => "Unexpected end of file".into(),
        }
    }

    pub fn to_diagnostics<'a>(&self, handler: &'a Handler) -> DiagnosticBuilder<'a> {
        handler.struct_span_err(self.inner.0, &self.message())
    }
}

#[derive(Debug, Clone, PartialEq)]
#[non_exhaustive]
pub enum ErrorKind {
    Eof,

    // Lexer errors
    AbruptClosingOfEmptyComment,
    AbruptDoctypePublicIdentifier,
    AbruptDoctypeSystemIdentifier,
    AbsenceOfDigitsInNumericCharacterReference,
    CdataInHtmlContent,
    CharacterReferenceOutsideUnicodeRange,
    ControlCharacterInInputStream,
    ControlCharacterReference,
    EndTagWithAttributes,
    DuplicateAttribute,
    EndTagWithTrailingSolidus,
    EofBeforeTagName,
    EofInCdata,
    EofInComment,
    EofInDoctype,
    EofInScriptHtmlCommentLikeText,
    EofInTag,
    IncorrectlyClosedComment,
    IncorrectlyOpenedComment,
    InvalidCharacterSequenceAfterDoctypeName,
    InvalidFirstCharacterOfTagName,
    MissingAttributeValue,
    MissingDoctypeName,
    MissingDoctypePublicIdentifier,
    MissingDoctypeSystemIdentifier,
    MissingEndTagName,
    MissingQuoteBeforeDoctypePublicIdentifier,
    MissingQuoteBeforeDoctypeSystemIdentifier,
    MissingSemicolonAfterCharacterReference,
    MissingWhitespaceAfterDoctypePublicKeyword,
    MissingWhitespaceAfterDoctypeSystemKeyword,
    MissingWhitespaceBeforeDoctypeName,
    MissingWhitespaceBetweenAttributes,
    MissingWhitespaceBetweenDoctypePublicAndSystemIdentifiers,
    NestedComment,
    NoncharacterCharacterReference,
    NoncharacterInInputStream,
    NonVoidHtmlElementStartTagWithTrailingSolidus,
    NullCharacterReference,
    SurrogateCharacterReference,
    SurrogateInInputStream,
    UnexpectedCharacterAfterDoctypeSystemIdentifier,
    UnexpectedCharacterInAttributeName,
    UnexpectedCharacterInUnquotedAttributeValue,
    UnexpectedEqualsSignBeforeAttributeName,
    UnexpectedNullCharacter,
    UnexpectedQuestionMarkInsteadOfTagName,
    UnexpectedSolidusInTag,
    UnknownNamedCharacterReference,

    // Parser errors
    StrayStartTag(JsWord),
    StrayEndTag(JsWord),
    UnclosedElements(JsWord),
    UnclosedElementsImplied(JsWord),
    UnclosedElementsCell,
    StrayDoctype,
    // TODO fix me
    NonConformingDoctype,
    // TODO more doctypes errors
    NonSpaceCharacterInTrailer,
    NonSpaceCharacterAfterFrameset,
    NonSpaceCharacterInFrameset,
    NonSpaceCharacterAfterBody,
    NonSpaceCharacterInColumnGroup,
    NonSpaceCharacterInNoscriptInHead,
    SomethingBetweenHeadAndBody(JsWord),
    StartTagWithoutDoctype,
    StartSelectWhereEndSelectExpected,
    StartTagWithSelectOpen(JsWord),
    BadStartTagInNoscriptInHead(JsWord),
    UnexpectedImageStartTag,
    SomethingSeenWhenSomethingOpen(JsWord),
    HeadingWhenHeadingOpen,
    NoCellToClose,
    StartTagInTable(JsWord),
    FormWhenFormOpen,
    TableSeenWhileTableOpen,
    StartTagInTableBody(JsWord),
    EndTagSeenWithoutDoctype,
    EndTagAfterBody,
    EndTagSeenWithSelectOpen(JsWord),
    GarbageInColumnGroup,
    EndTagBr,
    NoElementToCloseButEndTagSeen(JsWord),
    HtmlStartTagInForeignContext(JsWord),
    // TODO Do we need it?
    HtmlEndTagInForeignContext(JsWord),
    NoTableRowToClose,
    NonSpaceCharacterInTable,
    // TODO fix me
    // TODO errUnclosedChildrenInRuby
    // TODO errStartTagSeenWithoutRuby
    UnexpectedStartTagInRuby(JsWord),
    UnclosedElementsOnStack,
    EndTagDidNotMatchCurrentOpenElement(JsWord, JsWord),
    EndTagViolatesNestingRules(JsWord),
    EofWithUnclosedElements,
    EndTagWithUnclosedElements(JsWord),
    NonSpaceCharacterWithoutDoctype,
    // Todo improve me
    EofWithoutDoctype,
    UnexpectedEof,
}
