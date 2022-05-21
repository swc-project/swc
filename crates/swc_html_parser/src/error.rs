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
            ErrorKind::ControlCharacterInInputStream => "Control character in input stream".into(),
            ErrorKind::NoncharacterInInputStream => "Noncharacter in input stream".into(),
            ErrorKind::SurrogateInInputStream => "Surrogate in input stream".into(),
            ErrorKind::NonVoidHtmlElementStartTagWithTrailingSolidus => {
                "Non void html element start tag with trailing solidus".into()
            }
            ErrorKind::EndTagWithAttributes => "End tag with attributes".into(),
            ErrorKind::EndTagWithTrailingSolidus => "End tag with trailing solidus".into(),
            ErrorKind::UnexpectedSolidusInTag => "Unexpected solidus in tag".into(),
            ErrorKind::UnexpectedNullCharacter => "Unexpected null character".into(),
            ErrorKind::UnexpectedQuestionMarkInsteadOfTagName => {
                "Unexpected question mark instead of tag name".into()
            }
            ErrorKind::InvalidFirstCharacterOfTagName => {
                "Invalid first character of tag name".into()
            }
            ErrorKind::UnexpectedEqualsSignBeforeAttributeName => {
                "Unexpected equals sign before attribute name".into()
            }
            ErrorKind::MissingEndTagName => "Missing end tag name".into(),
            ErrorKind::UnexpectedCharacterInAttributeName => {
                "Unexpected character in attribute name".into()
            }
            ErrorKind::UnknownNamedCharacterReference => "Unknown named character reference".into(),
            ErrorKind::MissingSemicolonAfterCharacterReference => {
                "Missing semicolon after character reference".into()
            }
            ErrorKind::UnexpectedCharacterAfterDoctypeSystemIdentifier => {
                "Unexpected character after doctype system identifier".into()
            }
            ErrorKind::UnexpectedCharacterInUnquotedAttributeValue => {
                "Unexpected character in unquoted attribute value".into()
            }
            ErrorKind::EofBeforeTagName => "Eof before tag name".into(),
            ErrorKind::EofInTag => "Eof in tag".into(),
            ErrorKind::MissingAttributeValue => "Missing attribute value".into(),
            ErrorKind::MissingWhitespaceBetweenAttributes => {
                "Missing whitespace between attributes".into()
            }
            ErrorKind::MissingWhitespaceAfterDoctypePublicKeyword => {
                "Missing whitespace after doctype public keyword".into()
            }
            ErrorKind::MissingWhitespaceBetweenDoctypePublicAndSystemIdentifiers => {
                "Missing whitespace between doctype public and system identifiers".into()
            }
            ErrorKind::MissingWhitespaceAfterDoctypeSystemKeyword => {
                "Missing whitespace after doctype system keyword".into()
            }
            ErrorKind::MissingQuoteBeforeDoctypePublicIdentifier => {
                "Missing quote before doctype public identifier".into()
            }
            ErrorKind::MissingQuoteBeforeDoctypeSystemIdentifier => {
                "Missing quote before doctype system identifier".into()
            }
            ErrorKind::MissingDoctypePublicIdentifier => "Missing doctype public identifier".into(),
            ErrorKind::MissingDoctypeSystemIdentifier => "Missing doctype system identifier".into(),
            ErrorKind::AbruptDoctypePublicIdentifier => "Abrupt doctype public identifier".into(),
            ErrorKind::AbruptDoctypeSystemIdentifier => "Abrupt doctype system identifier".into(),
            ErrorKind::CdataInHtmlContent => "Cdata in html content".into(),
            ErrorKind::IncorrectlyOpenedComment => "Incorrectly opened comment".into(),
            ErrorKind::EofInScriptHtmlCommentLikeText => {
                "Eof in script html comment like text".into()
            }
            ErrorKind::EofInDoctype => "Eof in doctype".into(),
            ErrorKind::NestedComment => "Nested comment".into(),
            ErrorKind::AbruptClosingOfEmptyComment => "Abrupt closing of empty comment".into(),
            ErrorKind::EofInComment => "Eof in comment".into(),
            ErrorKind::IncorrectlyClosedComment => "Incorrectly closed comment".into(),
            ErrorKind::EofInCdata => "Eof in cdata".into(),
            ErrorKind::AbsenceOfDigitsInNumericCharacterReference => {
                "Absence of digits in numeric character reference".into()
            }
            ErrorKind::NullCharacterReference => "Null character reference".into(),
            ErrorKind::SurrogateCharacterReference => "Surrogate character reference".into(),
            ErrorKind::CharacterReferenceOutsideUnicodeRange => {
                "Character reference outside unicode range".into()
            }
            ErrorKind::ControlCharacterReference => "Control character reference".into(),
            ErrorKind::NoncharacterCharacterReference => "Noncharacter character reference".into(),
            ErrorKind::MissingWhitespaceBeforeDoctypeName => {
                "Missing whitespace before doctype name".into()
            }
            ErrorKind::MissingDoctypeName => "Missing doctype name".into(),
            ErrorKind::InvalidCharacterSequenceAfterDoctypeName => {
                "Invalid character sequence after doctype name".into()
            }
            ErrorKind::DuplicateAttribute => "Duplicate attribute".into(),
            ErrorKind::NonConformingDoctype => "Non conforming doctype".into(),
            ErrorKind::MissingDoctype => "Missing doctype".into(),
            ErrorKind::MisplacedDoctype => "Misplaced doctype".into(),
            ErrorKind::EndTagWithoutMatchingOpenElement => {
                "End tag without matching open element".into()
            }
            ErrorKind::ClosingOfElementWithOpenChildElements => {
                "Closing of element with open child elements".into()
            }
            ErrorKind::DisallowedContentInNoscriptInHead => {
                "Disallowed content in noscript in head".into()
            }
            ErrorKind::OpenElementsLeftAfterEof => "Open elements left after eof".into(),
            ErrorKind::AbandonedHeadElementChild => "Abandoned head element child".into(),
            ErrorKind::MisplacedStartTagForHeadElement => {
                "Misplaced start tag for head element".into()
            }
            ErrorKind::NestedNoscriptInHead => "Nested noscript in head".into(),
            ErrorKind::EofInElementThatCanContainOnlyText => {
                "Eof in element that can contain only text".into()
            }
            ErrorKind::UnexpectedToken => "Unexpected token".into(),
            ErrorKind::NestedHeadingTags => "Heading cannot be a child of another heading".into(),
            ErrorKind::UnexpectedStartSelectWhereEndSelectExpected => {
                "Unexpected \"<select>\" start tag where end tag expected".into()
            }
            ErrorKind::NoTableRowToClose => "No table row to close".into(),
            ErrorKind::UnexpectedHtmlStartTagInForeignContext(tag_name) => format!(
                "Unexpected HTML start tag \"<{}>\" in a foreign namespace context",
                tag_name
            )
            .into(),
            ErrorKind::UnexpectedHtmlEndTagInForeignContext(tag_name) => format!(
                "Unexpected HTML end tag \"</{}>\" in a foreign namespace context",
                tag_name
            )
            .into(),
            ErrorKind::UnexpectedStartTagBetweenHeadAndBody(tag_name) => format!(
                "Unexpected HTML start tag \"<{}>\" between \"</head>\" and \"<body>\"",
                tag_name
            )
            .into(),
            ErrorKind::StrayDoctype => "Stray doctype".into(),
            ErrorKind::StrayStartTag(tag_name) => {
                format!("Stray start tag \"<{}>\"", tag_name).into()
            }
            ErrorKind::StrayEndTag(tag_name) => format!("Stray end tag \"</{}>\"", tag_name).into(),
            ErrorKind::UnclosedElementsImplied(tag_name) => format!(
                "End tag \"</{}>\" implied, but there were open elements",
                tag_name
            )
            .into(),
            ErrorKind::UnclosedElements(tag_name) => format!(
                "End tag \"</{}>\" seen, but there were open elements",
                tag_name
            )
            .into(),
            ErrorKind::UnexpectedEndTag(tag_name) => {
                format!("Unexpected end tag \"</{}>\"", tag_name).into()
            }
            ErrorKind::StartTagSeenWhenAlreadyOpen(tag_name) => format!(
                "Start tag \"<{}>\" seen but an element of the same type was already open",
                tag_name
            )
            .into(),
            ErrorKind::TableSeenWhileTableOpen => {
                "Start tag for \"<table>\" seen but the previous \"<table>\" is still open".into()
            }
            ErrorKind::UnexpectedStartTagInTable(tag_name) => format!(
                "Unexpected start tag \"<{}>\" seen in \"<table>\"",
                tag_name
            )
            .into(),
            ErrorKind::NoElementToCloseButEndTagSeen(tag_name) => format!(
                "No \"{}\" element in scope but a \"</{}>\" end tag seen",
                tag_name, tag_name
            )
            .into(),
            ErrorKind::UnclosedElementsOnStack => "Unclosed elements on stack".into(),
            ErrorKind::FormWhenFormOpen => "Saw a \"<form>\" start tag, but there was already an \
                                            active \"<form>\" element, nested forms are not \
                                            allowed."
                .into(),
            ErrorKind::UnexpectedImageStartTag => {
                "Unexpected \"<image>\" start tag, only \"<img>\" tag exists in HTML".into()
            }
            ErrorKind::UnexpectedStartTagWithSelectOpen(tag_name) => format!(
                "Unexpected start tag \"<{}>\" with \"<select>\" open",
                tag_name
            )
            .into(),
            ErrorKind::UnexpectedEndTagWithSelectOpen(tag_name) => format!(
                "Unexpected end tag \"</{}>\" with \"<select>\" open",
                tag_name
            )
            .into(),
            ErrorKind::UnexpectedStartTagInRuby(tag_name) => format!(
                "Unexpected start tag \"<{}>\" with \"<ruby>\" open",
                tag_name
            )
            .into(),
            ErrorKind::NoCellToClose => "No cell to close".into(),
            ErrorKind::UnexpectedEndTagWithUnclosedElements(tag_name) => format!(
                "Unexpected end tag for \"</{}>\", but there were unclosed elements",
                tag_name
            )
            .into(),
            ErrorKind::UnexpectedEof => "Unexpected end of file".into(),
            ErrorKind::NonSpaceCharacterInFrameset => {
                "Non-space character in \"<frameset>\"".into()
            }
            ErrorKind::NonSpaceCharacterAfterFrameset => {
                "Non-space character after \"<frameset>\"".into()
            }
            ErrorKind::EndTagDidNotMatchCurrentOpenElement(
                end_tag_name,
                current_element_tag_name,
            ) => format!(
                "End tag \"{}\" did not match the name of the current open element (\"{:}\")",
                end_tag_name, current_element_tag_name
            )
            .into(),
            ErrorKind::UnclosedElementsCell => {
                "A table cell was implicitly closed, but there were open elements".into()
            }
        }
    }

    pub fn to_diagnostics<'a>(&self, handler: &'a Handler) -> DiagnosticBuilder<'a> {
        handler.struct_span_err(self.inner.0, &self.message())
    }
}

#[derive(Debug, Clone, PartialEq)]
#[non_exhaustive]
pub enum ErrorKind {
    // Lexer errors
    Eof,
    ControlCharacterInInputStream,
    NoncharacterInInputStream,
    SurrogateInInputStream,
    NonVoidHtmlElementStartTagWithTrailingSolidus,
    EndTagWithAttributes,
    EndTagWithTrailingSolidus,
    UnexpectedSolidusInTag,
    UnexpectedNullCharacter,
    UnexpectedQuestionMarkInsteadOfTagName,
    InvalidFirstCharacterOfTagName,
    UnexpectedEqualsSignBeforeAttributeName,
    MissingEndTagName,
    UnexpectedCharacterInAttributeName,
    UnknownNamedCharacterReference,
    MissingSemicolonAfterCharacterReference,
    UnexpectedCharacterAfterDoctypeSystemIdentifier,
    UnexpectedCharacterInUnquotedAttributeValue,
    EofBeforeTagName,
    EofInTag,
    MissingAttributeValue,
    MissingWhitespaceBetweenAttributes,
    MissingWhitespaceAfterDoctypePublicKeyword,
    MissingWhitespaceBetweenDoctypePublicAndSystemIdentifiers,
    MissingWhitespaceAfterDoctypeSystemKeyword,
    MissingQuoteBeforeDoctypePublicIdentifier,
    MissingQuoteBeforeDoctypeSystemIdentifier,
    MissingDoctypePublicIdentifier,
    MissingDoctypeSystemIdentifier,
    AbruptDoctypePublicIdentifier,
    AbruptDoctypeSystemIdentifier,
    CdataInHtmlContent,
    IncorrectlyOpenedComment,
    EofInScriptHtmlCommentLikeText,
    EofInDoctype,
    NestedComment,
    AbruptClosingOfEmptyComment,
    EofInComment,
    IncorrectlyClosedComment,
    EofInCdata,
    AbsenceOfDigitsInNumericCharacterReference,
    NullCharacterReference,
    SurrogateCharacterReference,
    CharacterReferenceOutsideUnicodeRange,
    ControlCharacterReference,
    NoncharacterCharacterReference,
    MissingWhitespaceBeforeDoctypeName,
    MissingDoctypeName,
    InvalidCharacterSequenceAfterDoctypeName,
    DuplicateAttribute,
    NonConformingDoctype,
    MissingDoctype,
    MisplacedDoctype,
    EndTagWithoutMatchingOpenElement,
    ClosingOfElementWithOpenChildElements,
    DisallowedContentInNoscriptInHead,
    OpenElementsLeftAfterEof,
    AbandonedHeadElementChild,
    MisplacedStartTagForHeadElement,
    NestedNoscriptInHead,
    EofInElementThatCanContainOnlyText,

    // Parser errors
    UnexpectedToken,
    StrayDoctype,
    StrayStartTag(JsWord),
    StrayEndTag(JsWord),
    NestedHeadingTags,
    NoTableRowToClose,
    NoCellToClose,
    FormWhenFormOpen,
    TableSeenWhileTableOpen,
    StartTagSeenWhenAlreadyOpen(JsWord),
    NoElementToCloseButEndTagSeen(JsWord),
    UnexpectedImageStartTag,
    UnexpectedStartSelectWhereEndSelectExpected,
    UnexpectedHtmlStartTagInForeignContext(JsWord),
    UnexpectedHtmlEndTagInForeignContext(JsWord),
    UnexpectedStartTagBetweenHeadAndBody(JsWord),
    UnexpectedEndTag(JsWord),
    UnexpectedStartTagInTable(JsWord),
    UnexpectedStartTagWithSelectOpen(JsWord),
    UnexpectedEndTagWithSelectOpen(JsWord),
    UnexpectedStartTagInRuby(JsWord),
    UnexpectedEndTagWithUnclosedElements(JsWord),
    UnexpectedEof,
    UnclosedElementsImplied(JsWord),
    UnclosedElements(JsWord),
    UnclosedElementsOnStack,
    UnclosedElementsCell,
    NonSpaceCharacterInFrameset,
    EndTagDidNotMatchCurrentOpenElement(JsWord, JsWord),
    NonSpaceCharacterAfterFrameset,
}
