// TODO avoid using in future for better AST
use std::char::REPLACEMENT_CHARACTER;

use swc_common::{input::Input, BytePos, Span};
use swc_html_ast::{Attribute, Token, TokenAndSpan};

use crate::{
    error::{Error, ErrorKind},
    parser::{input::ParserInput, PResult, ParserConfig},
};

pub(crate) type LexResult<T> = Result<T, ErrorKind>;

pub struct Lexer<I>
where
    I: Input,
{
    input: I,
    cur: Option<char>,
    cur_pos: BytePos,
    start_pos: BytePos,
    /// Used to override last_pos
    last_pos: Option<BytePos>,
    state: State,
    return_state: State,
    errors: Vec<Error>,
    in_foreign_node: bool,
    pending_tokens: Vec<TokenAndSpan>,
    cur_token: Option<Token>,
    character_reference_code: Option<u32>,
    temporary_buffer: Option<String>,
}

impl<I> Lexer<I>
where
    I: Input,
{
    pub fn new(input: I, _config: ParserConfig) -> Self {
        let start_pos = input.last_pos();

        Lexer {
            input,
            cur: None,
            cur_pos: start_pos,
            start_pos,
            last_pos: None,
            state: State::Data,
            return_state: State::Data,
            errors: vec![],
            in_foreign_node: false,
            pending_tokens: vec![],
            cur_token: None,
            character_reference_code: None,
            temporary_buffer: None,
        }
    }
}

#[derive(Clone)]
#[allow(unused)]
enum State {
    Data,
    Rcdata,
    Rawtext,
    ScriptData,
    PlainText,
    TagOpen,
    EndTagOpen,
    TagName,
    RcdataLessThanSign,
    RcdataEndTagOpen,
    RcdataEndTagName,
    RawtextLessThanSign,
    RawtextEndTagOpen,
    RawtextEndTagName,
    ScriptDataLessThanSign,
    ScriptDataEndTagOpen,
    ScriptDataEndTagName,
    ScriptDataEscapeStart,
    ScriptDataEscapeStartDash,
    ScriptDataEscaped,
    ScriptDataEscapedDash,
    ScriptDataEscapedDashDash,
    ScriptDataEscapedLessThanSign,
    ScriptDataEscapedEndTagOpen,
    ScriptDataEscapedEndTagName,
    ScriptDataDoubleEscapeStart,
    ScriptDataDoubleEscaped,
    ScriptDataDoubleEscapedDash,
    ScriptDataDoubleEscapedDashDash,
    ScriptDataDoubleEscapedLessThanSign,
    ScriptDataDoubleEscapeEnd,
    BeforeAttributeName,
    AttributeName,
    AfterAttributeName,
    BeforeAttributeValue,
    AttributeValueDoubleQuoted,
    AttributeValueSingleQuoted,
    AttributeValueUnquoted,
    AfterAttributeValueQuoted,
    SelfClosingStartTag,
    BogusComment,
    MarkupDeclarationOpen,
    CommentStart,
    CommentStartDash,
    Comment,
    CommentLessThanSign,
    CommentLessThanSignBang,
    CommentLessThanSignBangDash,
    CommentLessThanSignBangDashDash,
    CommentEndDash,
    CommentEnd,
    CommentEndBang,
    Doctype,
    BeforeDoctypeName,
    DoctypeName,
    AfterDoctypeName,
    AfterDoctypePublicKeyword,
    BeforeDoctypePublicIdentifier,
    DoctypePublicIdentifierDoubleQuoted,
    DoctypePublicIdentifierSingleQuoted,
    AfterDoctypePublicIdentifier,
    BetweenDoctypePublicAndSystemIdentifiers,
    AfterDoctypeSystemKeyword,
    BeforeDoctypeSystemIdentifier,
    DoctypeSystemIdentifierDoubleQuoted,
    DoctypeSystemIdentifierSingleQuoted,
    AfterDoctypeSystemIdentifier,
    BogusDoctype,
    CdataSection,
    CdataSectionBracket,
    CdataSectionEnd,
    CharacterReference,
    NamedCharacterReference,
    AmbiguousAmpersand,
    NumericCharacterReference,
    HexademicalCharacterReferenceStart,
    DecimalCharacterReferenceStart,
    HexademicalCharacterReference,
    DecimalCharacterReference,
    NumericCharacterReferenceEnd,
}

#[allow(unused)]
enum LexerMode {
    Data,
    Rcdata,
    Rawtext,
    ScriptData,
    PlainText,
    CdataSection,
}

#[derive(Debug, Clone, Copy)]
pub struct LexerState {
    pos: BytePos,
}

impl<I> ParserInput for Lexer<I>
where
    I: Input,
{
    type State = LexerState;

    fn next(&mut self) -> PResult<TokenAndSpan> {
        let token_and_span = self.read_token_and_span();

        match token_and_span {
            Ok(token_and_span) => {
                return Ok(token_and_span);
            }
            Err(kind) => {
                let end = self.last_pos.take().unwrap_or_else(|| self.input.cur_pos());
                let span = Span::new(self.start_pos, end, Default::default());

                return Err(Error::new(span, kind));
            }
        }
    }

    fn start_pos(&mut self) -> swc_common::BytePos {
        self.input.cur_pos()
    }

    fn state(&mut self) -> Self::State {
        LexerState {
            pos: self.input.cur_pos(),
        }
    }

    fn reset(&mut self, state: &Self::State) {
        self.input.reset_to(state.pos);
    }
}

impl<I> Lexer<I>
where
    I: Input,
{
    #[inline]
    fn next(&mut self) -> Option<char> {
        self.input.cur()
    }

    #[inline]
    fn consume(&mut self) {
        self.cur = self.input.cur();
        self.cur_pos = self.input.cur_pos();

        if self.cur.is_some() {
            self.input.bump();
        }
    }

    #[inline]
    fn reconsume(&mut self) {
        self.input.reset_to(self.cur_pos);
    }

    #[inline]
    fn consume_next_char(&mut self) -> Option<char> {
        // The next input character is the first character in the input stream that has
        // not yet been consumed or explicitly ignored by the requirements in this
        // section. Initially, the next input character is the first character in the
        // input. The current input character is the last character to have been
        // consumed.
        let c = self.next();

        self.consume();

        c
    }

    fn emit_error(&mut self, kind: ErrorKind) {
        let end = self.last_pos.take().unwrap_or_else(|| self.input.cur_pos());
        let span = Span::new(self.start_pos, end, Default::default());

        self.errors.push(Error::new(span, kind));
    }

    fn emit_token(&mut self, token: Token) {
        let end = self.last_pos.take().unwrap_or_else(|| self.input.cur_pos());
        let span = Span::new(self.start_pos, end, Default::default());

        self.start_pos = end;

        let token_and_span = TokenAndSpan { span, token };

        self.pending_tokens.push(token_and_span);
    }

    fn emit_cur_token(&mut self) {
        let token = self.cur_token.clone();

        match token {
            Some(token) => {
                self.emit_token(token);
            }
            _ => {
                unreachable!();
            }
        }
    }

    fn is_consumed_as_part_of_an_attribute(&mut self) -> bool {
        matches!(
            self.return_state,
            State::AttributeValueSingleQuoted
                | State::AttributeValueDoubleQuoted
                | State::AttributeValueUnquoted
        )
    }

    fn current_end_tag_token_is_an_appropriate_end_tag_token(&mut self) -> bool {
        // TODO fix me

        false
    }

    fn read_token_and_span(&mut self) -> LexResult<TokenAndSpan> {
        loop {
            if !self.pending_tokens.is_empty() {
                let token_and_span = self.pending_tokens.remove(0);

                match token_and_span.token {
                    Token::Eof => {
                        return Err(ErrorKind::Eof);
                    }
                    _ => {
                        return Ok(token_and_span);
                    }
                }
            }

            match self.state {
                // https://html.spec.whatwg.org/multipage/parsing.html#data-state
                State::Data => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0026 AMPERSAND (&)
                        // Set the return state to the data state. Switch to the character reference
                        // state.
                        Some('&') => {
                            self.return_state = State::Data;
                            self.state = State::CharacterReference;
                        }
                        // U+003C LESS-THAN SIGN (<)
                        // Switch to the tag open state.
                        Some('<') => {
                            self.state = State::TagOpen;
                        }
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Emit the current input
                        // character as a character token.
                        Some(c @ '\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);
                            self.emit_token(Token::Character { value: c });
                        }
                        // EOF
                        // Emit an end-of-file token.
                        None => {
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Emit the current input character as a character token.
                        Some(c) => {
                            self.emit_token(Token::Character { value: c });
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#rcdata-state
                State::Rcdata => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0026 AMPERSAND (&)
                        // Set the return state to the RCDATA state. Switch to the character
                        // reference state.
                        Some('&') => {
                            self.return_state = State::Rcdata;
                            self.state = State::CharacterReference;
                        }
                        // U+003C LESS-THAN SIGN (<)
                        // Switch to the RCDATA less-than sign state.
                        Some('<') => {
                            self.state = State::RcdataLessThanSign;
                        }
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Emit a U+FFFD
                        // REPLACEMENT CHARACTER character token.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);
                            self.emit_token(Token::Character {
                                value: REPLACEMENT_CHARACTER,
                            });
                        }
                        // EOF
                        // Emit an end-of-file token.
                        None => {
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Emit the current input character as a character token.
                        Some(c) => {
                            self.emit_token(Token::Character { value: c });
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#rawtext-state
                State::Rawtext => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+003C LESS-THAN SIGN (<)
                        // Switch to the RAWTEXT less-than sign state.
                        Some('<') => self.state = State::RawtextLessThanSign,
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Emit a U+FFFD
                        // REPLACEMENT CHARACTER character token.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);
                            self.emit_token(Token::Character {
                                value: REPLACEMENT_CHARACTER,
                            });
                        }
                        // EOF
                        // Emit an end-of-file token.
                        None => {
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Emit the current input character as a character token.
                        Some(c) => {
                            self.emit_token(Token::Character { value: c });
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#script-data-state
                State::ScriptData => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+003C LESS-THAN SIGN (<)
                        // Switch to the script data less-than sign state.
                        Some('<') => self.state = State::ScriptDataLessThanSign,
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Emit a U+FFFD
                        // REPLACEMENT CHARACTER character token.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);
                            self.emit_token(Token::Character {
                                value: REPLACEMENT_CHARACTER,
                            });
                        }
                        // EOF
                        // Emit an end-of-file token.
                        None => {
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Emit the current input character as a character token.
                        Some(c) => {
                            self.emit_token(Token::Character { value: c });
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#plaintext-state
                State::PlainText => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Emit a U+FFFD
                        // REPLACEMENT CHARACTER character token.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);
                            self.emit_token(Token::Character {
                                value: REPLACEMENT_CHARACTER,
                            });
                        }
                        // EOF
                        // Emit an end-of-file token.
                        None => {
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Emit the current input character as a character token.
                        Some(c) => {
                            self.emit_token(Token::Character { value: c });
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#tag-open-state
                State::TagOpen => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0021 EXCLAMATION MARK (!)
                        // Switch to the markup declaration open state.
                        Some('!') => {
                            self.state = State::MarkupDeclarationOpen;
                        }
                        // U+002F SOLIDUS (/)
                        // Switch to the end tag open state.
                        Some('/') => {
                            self.state = State::EndTagOpen;
                        }
                        // ASCII alpha
                        // Create a new start tag token, set its tag name to the empty string.
                        // Reconsume in the tag name state.
                        Some(c) if is_ascii_alpha(c) => {
                            self.cur_token = Some(Token::StartTag {
                                tag_name: "".into(),
                                self_closing: false,
                                attributes: vec![],
                            });

                            self.state = State::TagName;
                            self.reconsume();
                        }
                        // U+003F QUESTION MARK (?)
                        // This is an unexpected-question-mark-instead-of-tag-name parse error.
                        // Create a comment token whose data is the empty string. Reconsume in the
                        // bogus comment state.
                        Some('?') => {
                            self.emit_error(ErrorKind::UnexpectedQuestionMarkInsteadOfTagName);
                            self.cur_token = Some(Token::Comment { data: "".into() });

                            self.state = State::BogusComment;
                            self.reconsume();
                        }
                        // EOF
                        // This is an eof-before-tag-name parse error. Emit a U+003C LESS-THAN SIGN
                        // character token and an end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofBeforeTagName);
                            self.emit_token(Token::Character { value: '<' });
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // This is an invalid-first-character-of-tag-name parse error. Emit a U+003C
                        // LESS-THAN SIGN character token. Reconsume in the data state.
                        _ => {
                            self.emit_error(ErrorKind::InvalidFirstCharacterOfTagName);
                            self.emit_token(Token::Character { value: '<' });
                            self.state = State::Data;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#end-tag-open-state
                State::EndTagOpen => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // ASCII alpha
                        // Create a new end tag token, set its tag name to the empty string.
                        // Reconsume in the tag name state.
                        Some(c) if is_ascii_alpha(c) => {
                            self.cur_token = Some(Token::EndTag {
                                tag_name: "".into(),
                                self_closing: false,
                                attributes: vec![],
                            });

                            self.state = State::TagName;
                            self.reconsume();
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // This is a missing-end-tag-name parse error. Switch to the data state.
                        Some('>') => {
                            self.emit_error(ErrorKind::MissingEndTagName);
                            self.state = State::Data;
                        }
                        // EOF
                        // This is an eof-before-tag-name parse error. Emit a U+003C LESS-THAN SIGN
                        // character token, a U+002F SOLIDUS character token and an end-of-file
                        // token.
                        None => {
                            self.emit_error(ErrorKind::EofBeforeTagName);
                            self.emit_token(Token::Character { value: '<' });
                            self.emit_token(Token::Character { value: '/' });
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // This is an invalid-first-character-of-tag-name parse error. Create a
                        // comment token whose data is the empty string. Reconsume in the bogus
                        // comment state.
                        _ => {
                            self.emit_error(ErrorKind::InvalidFirstCharacterOfTagName);
                            self.cur_token = Some(Token::Comment { data: "".into() });
                            self.state = State::BogusComment;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#tag-name-state
                State::TagName => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // Switch to the before attribute name state.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {
                            self.state = State::BeforeAttributeName;
                        }
                        // U+002F SOLIDUS (/)
                        // Switch to the self-closing start tag state.
                        Some('/') => {
                            self.state = State::SelfClosingStartTag;
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // Switch to the data state. Emit the current tag token.
                        Some('>') => {
                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // ASCII upper alpha
                        // Append the lowercase version of the current input character (add 0x0020
                        // to the character's code point) to the current tag token's tag name.
                        Some(c) if is_ascii_upper_alpha(c) => match &mut self.cur_token {
                            Some(Token::StartTag { tag_name, .. }) => {
                                let mut new_tag_name = String::new();

                                new_tag_name.push_str(tag_name);
                                new_tag_name.push(c.to_ascii_lowercase());

                                *tag_name = new_tag_name.into();
                            }
                            Some(Token::EndTag { tag_name, .. }) => {
                                let mut new_tag_name = String::new();

                                new_tag_name.push_str(tag_name);
                                new_tag_name.push(c.to_ascii_lowercase());

                                *tag_name = new_tag_name.into();
                            }
                            _ => {
                                unreachable!();
                            }
                        },
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Append a U+FFFD
                        // REPLACEMENT CHARACTER character to the current tag token's tag name.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);

                            match &mut self.cur_token {
                                Some(Token::StartTag { tag_name, .. }) => {
                                    let mut new_tag_name = String::new();

                                    new_tag_name.push_str(tag_name);
                                    new_tag_name.push(REPLACEMENT_CHARACTER);

                                    *tag_name = new_tag_name.into();
                                }
                                Some(Token::EndTag { tag_name, .. }) => {
                                    let mut new_tag_name = String::new();

                                    new_tag_name.push_str(tag_name);
                                    new_tag_name.push(REPLACEMENT_CHARACTER);

                                    *tag_name = new_tag_name.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            }
                        }
                        // EOF
                        // This is an eof-in-tag parse error. Emit an end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInTag);
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Append the current input character to the current tag token's tag name.
                        Some(c) => match &mut self.cur_token {
                            Some(Token::StartTag { tag_name, .. }) => {
                                let mut new_tag_name = String::new();

                                new_tag_name.push_str(tag_name);
                                new_tag_name.push(c);

                                *tag_name = new_tag_name.into();
                            }
                            Some(Token::EndTag { tag_name, .. }) => {
                                let mut new_tag_name = String::new();

                                new_tag_name.push_str(tag_name);
                                new_tag_name.push(c);

                                *tag_name = new_tag_name.into();
                            }
                            _ => {
                                unreachable!();
                            }
                        },
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#rcdata-less-than-sign-state
                State::RcdataLessThanSign => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+002F SOLIDUS (/)
                        // Set the temporary buffer to the empty string. Switch to the RCDATA end
                        // tag open state.
                        Some('/') => {
                            self.temporary_buffer = Some("".into());
                            self.state = State::RcdataEndTagOpen;
                        }
                        // Anything else
                        // Emit a U+003C LESS-THAN SIGN character token. Reconsume in the RCDATA
                        // state.
                        _ => {
                            self.emit_token(Token::Character { value: '<' });
                            self.state = State::Rcdata;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#rcdata-end-tag-open-state
                State::RcdataEndTagOpen => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // ASCII alpha
                        // Create a new end tag token, set its tag name to the empty string.
                        // Reconsume in the RCDATA end tag name state.
                        Some(c) if is_ascii_alpha(c) => {
                            self.cur_token = Some(Token::EndTag {
                                tag_name: "".into(),
                                self_closing: false,
                                attributes: vec![],
                            });

                            self.state = State::RcdataEndTagName;
                            self.reconsume();
                        }
                        // Anything else
                        // Emit a U+003C LESS-THAN SIGN character token and a U+002F SOLIDUS
                        // character token. Reconsume in the RCDATA state.
                        _ => {
                            self.emit_token(Token::Character { value: '<' });
                            self.emit_token(Token::Character { value: '/' });
                            self.state = State::Rcdata;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#rcdata-end-tag-name-state
                State::RcdataEndTagName => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // If the current end tag token is an appropriate end tag token, then switch
                        // to the before attribute name state. Otherwise, treat it as per the
                        // "anything else" entry below.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {
                            if self.current_end_tag_token_is_an_appropriate_end_tag_token() {
                                self.state = State::BeforeAttributeName;
                            }
                        }
                        // U+002F SOLIDUS (/)
                        // If the current end tag token is an appropriate end tag token, then switch
                        // to the self-closing start tag state. Otherwise, treat it as per the
                        // "anything else" entry below.
                        Some('/') => {
                            if self.current_end_tag_token_is_an_appropriate_end_tag_token() {
                                self.state = State::SelfClosingStartTag;
                            }
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // If the current end tag token is an appropriate end tag token, then switch
                        // to the data state and emit the current tag token. Otherwise, treat it as
                        // per the "anything else" entry below.
                        Some('>') => {
                            if self.current_end_tag_token_is_an_appropriate_end_tag_token() {
                                self.state = State::Data;
                                self.emit_cur_token();
                            }
                        }
                        // ASCII upper alpha
                        // Append the lowercase version of the current input character (add 0x0020
                        // to the character's code point) to the current tag token's tag name.
                        // Append the current input character to the temporary buffer.
                        Some(c) if is_ascii_upper_alpha(c) => {
                            match &mut self.cur_token {
                                Some(Token::StartTag { tag_name, .. }) => {
                                    let mut new_tag_name = String::new();

                                    new_tag_name.push_str(tag_name);
                                    new_tag_name.push(c.to_ascii_lowercase());

                                    *tag_name = new_tag_name.into();
                                }
                                Some(Token::EndTag { tag_name, .. }) => {
                                    let mut new_tag_name = String::new();

                                    new_tag_name.push_str(tag_name);
                                    new_tag_name.push(c.to_ascii_lowercase());

                                    *tag_name = new_tag_name.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            };

                            if let Some(ref mut temporary_buffer) = self.temporary_buffer {
                                temporary_buffer.push(c);
                            }
                        }
                        // ASCII lower alpha
                        // Append the current input character to the current tag token's tag name.
                        // Append the current input character to the temporary buffer.
                        Some(c) if is_ascii_upper_alpha(c) => {
                            match &mut self.cur_token {
                                Some(Token::StartTag { tag_name, .. }) => {
                                    let mut new_tag_name = String::new();

                                    new_tag_name.push_str(tag_name);
                                    new_tag_name.push(c);

                                    *tag_name = new_tag_name.into();
                                }
                                Some(Token::EndTag { tag_name, .. }) => {
                                    let mut new_tag_name = String::new();

                                    new_tag_name.push_str(tag_name);
                                    new_tag_name.push(c);

                                    *tag_name = new_tag_name.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            };

                            if let Some(ref mut temporary_buffer) = self.temporary_buffer {
                                temporary_buffer.push(c);
                            }
                        }
                        // Anything else
                        // Emit a U+003C LESS-THAN SIGN character token, a U+002F SOLIDUS character
                        // token, and a character token for each of the characters in the temporary
                        // buffer (in the order they were added to the buffer). Reconsume in the
                        // RCDATA state.
                        _ => {
                            self.emit_token(Token::Character { value: '<' });
                            self.emit_token(Token::Character { value: '/' });
                            self.state = State::Rcdata;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#rawtext-less-than-sign-state
                State::RawtextLessThanSign => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+002F SOLIDUS (/)
                        // Set the temporary buffer to the empty string. Switch to the RAWTEXT end
                        // tag open state.
                        Some('/') => {
                            self.temporary_buffer = Some("".into());
                            self.state = State::RawtextEndTagOpen;
                        }
                        // Anything else
                        // Emit a U+003C LESS-THAN SIGN character token. Reconsume in the RAWTEXT
                        // state.
                        _ => {
                            self.emit_token(Token::Character { value: '<' });
                            self.state = State::Rawtext;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#rawtext-end-tag-open-state
                State::RawtextEndTagOpen => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // ASCII alpha
                        // Create a new end tag token, set its tag name to the empty string.
                        // Reconsume in the RAWTEXT end tag name state.
                        Some(c) if is_ascii_alpha(c) => {
                            self.cur_token = Some(Token::EndTag {
                                tag_name: "".into(),
                                self_closing: false,
                                attributes: vec![],
                            });

                            self.state = State::RawtextEndTagName;
                        }
                        // Anything else
                        // Emit a U+003C LESS-THAN SIGN character token and a U+002F SOLIDUS
                        // character token. Reconsume in the RAWTEXT state.
                        _ => {
                            self.emit_token(Token::Character { value: '<' });
                            self.emit_token(Token::Character { value: '/' });
                            self.state = State::Rawtext;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#rawtext-end-tag-name-state
                State::RawtextEndTagName => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // If the current end tag token is an appropriate end tag token, then switch
                        // to the before attribute name state. Otherwise, treat it as per the
                        // "anything else" entry below.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {
                            if self.current_end_tag_token_is_an_appropriate_end_tag_token() {
                                self.state = State::BeforeAttributeName;
                            }
                        }
                        // U+002F SOLIDUS (/)
                        // If the current end tag token is an appropriate end tag token, then switch
                        // to the self-closing start tag state. Otherwise, treat it as per the
                        // "anything else" entry below.
                        Some('/') => {
                            if self.current_end_tag_token_is_an_appropriate_end_tag_token() {
                                self.state = State::SelfClosingStartTag;
                            }
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // If the current end tag token is an appropriate end tag token, then switch
                        // to the data state and emit the current tag token. Otherwise, treat it as
                        // per the "anything else" entry below.
                        Some('>') => {
                            if self.current_end_tag_token_is_an_appropriate_end_tag_token() {
                                self.state = State::Data;
                                self.emit_cur_token();
                            }
                        }
                        // ASCII upper alpha
                        // Append the lowercase version of the current input character (add 0x0020
                        // to the character's code point) to the current tag token's tag name.
                        // Append the current input character to the temporary buffer.
                        Some(c) if is_ascii_upper_alpha(c) => {
                            match &mut self.cur_token {
                                Some(Token::StartTag { tag_name, .. }) => {
                                    let mut new_tag_name = String::new();

                                    new_tag_name.push_str(tag_name);
                                    new_tag_name.push(c.to_ascii_lowercase());

                                    *tag_name = new_tag_name.into();
                                }
                                Some(Token::EndTag { tag_name, .. }) => {
                                    let mut new_tag_name = String::new();

                                    new_tag_name.push_str(tag_name);
                                    new_tag_name.push(c.to_ascii_lowercase());

                                    *tag_name = new_tag_name.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            };

                            if let Some(ref mut temporary_buffer) = self.temporary_buffer {
                                temporary_buffer.push(c);
                            }
                        }
                        // ASCII lower alpha
                        // Append the current input character to the current tag token's tag name.
                        // Append the current input character to the temporary buffer.
                        Some(c) if is_ascii_lower_alpha(c) => {
                            match &mut self.cur_token {
                                Some(Token::StartTag { tag_name, .. }) => {
                                    let mut new_tag_name = String::new();

                                    new_tag_name.push_str(tag_name);
                                    new_tag_name.push(c);

                                    *tag_name = new_tag_name.into();
                                }
                                Some(Token::EndTag { tag_name, .. }) => {
                                    let mut new_tag_name = String::new();

                                    new_tag_name.push_str(tag_name);
                                    new_tag_name.push(c);

                                    *tag_name = new_tag_name.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            };

                            if let Some(ref mut temporary_buffer) = self.temporary_buffer {
                                temporary_buffer.push(c);
                            }
                        }
                        // Anything else
                        // Emit a U+003C LESS-THAN SIGN character token, a U+002F SOLIDUS character
                        // token, and a character token for each of the characters in the temporary
                        // buffer (in the order they were added to the buffer). Reconsume in the
                        // RAWTEXT state.
                        _ => {
                            self.emit_token(Token::Character { value: '<' });
                            self.emit_token(Token::Character { value: '/' });
                            self.state = State::Rawtext;
                            self.reconsume()
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#script-data-less-than-sign-state
                State::ScriptDataLessThanSign => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+002F SOLIDUS (/)
                        // Set the temporary buffer to the empty string. Switch to the script data
                        // end tag open state.
                        Some('/') => {
                            self.temporary_buffer = Some("".into());
                            self.state = State::ScriptDataEndTagOpen;
                        }
                        // U+0021 EXCLAMATION MARK (!)
                        // Switch to the script data escape start state. Emit a U+003C LESS-THAN
                        // SIGN character token and a U+0021 EXCLAMATION MARK character token.
                        Some('!') => {
                            self.state = State::ScriptDataEscapeStart;
                            self.emit_token(Token::Character { value: '<' });
                            self.emit_token(Token::Character { value: '!' });
                        }
                        // Anything else
                        // Emit a U+003C LESS-THAN SIGN character token. Reconsume in the script
                        // data state.
                        _ => {
                            self.emit_token(Token::Character { value: '<' });
                            self.state = State::ScriptData;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#script-data-end-tag-open-state
                State::ScriptDataEndTagOpen => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // ASCII alpha
                        // Create a new end tag token, set its tag name to the empty string.
                        // Reconsume in the script data end tag name state.
                        Some(c) if is_ascii_alpha(c) => {
                            self.cur_token = Some(Token::EndTag {
                                tag_name: "".into(),
                                self_closing: false,
                                attributes: vec![],
                            });

                            self.state = State::ScriptDataEndTagName;
                            self.reconsume();
                        }
                        // Anything else
                        // Emit a U+003C LESS-THAN SIGN character token and a U+002F SOLIDUS
                        // character token. Reconsume in the script data state.
                        _ => {
                            self.emit_token(Token::Character { value: '<' });
                            self.emit_token(Token::Character { value: '/' });
                            self.state = State::ScriptData;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#script-data-end-tag-name-state
                State::ScriptDataEndTagName => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // If the current end tag token is an appropriate end tag token, then switch
                        // to the before attribute name state. Otherwise, treat it as per the
                        // "anything else" entry below.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {
                            if self.current_end_tag_token_is_an_appropriate_end_tag_token() {
                                self.state = State::BeforeAttributeName;
                            }
                        }
                        // U+002F SOLIDUS (/)
                        // If the current end tag token is an appropriate end tag token, then switch
                        // to the self-closing start tag state. Otherwise, treat it as per the
                        // "anything else" entry below.
                        Some('/') => {
                            if self.current_end_tag_token_is_an_appropriate_end_tag_token() {
                                self.state = State::SelfClosingStartTag;
                            }
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // If the current end tag token is an appropriate end tag token, then switch
                        // to the data state and emit the current tag token. Otherwise, treat it as
                        // per the "anything else" entry below.
                        Some('>') => {
                            if self.current_end_tag_token_is_an_appropriate_end_tag_token() {
                                self.state = State::Data;
                                self.emit_cur_token();
                            }
                        }
                        // ASCII upper alpha
                        // Append the lowercase version of the current input character (add 0x0020
                        // to the character's code point) to the current tag token's tag name.
                        // Append the current input character to the temporary buffer.
                        Some(c) if is_ascii_upper_alpha(c) => {
                            match &mut self.cur_token {
                                Some(Token::StartTag { tag_name, .. }) => {
                                    let mut new_tag_name = String::new();

                                    new_tag_name.push_str(tag_name);
                                    new_tag_name.push(c.to_ascii_lowercase());

                                    *tag_name = new_tag_name.into();
                                }
                                Some(Token::EndTag { tag_name, .. }) => {
                                    let mut new_tag_name = String::new();

                                    new_tag_name.push_str(tag_name);
                                    new_tag_name.push(c.to_ascii_lowercase());

                                    *tag_name = new_tag_name.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            };

                            if let Some(ref mut temporary_buffer) = self.temporary_buffer {
                                temporary_buffer.push(c);
                            }
                        }
                        // ASCII lower alpha
                        // Append the current input character to the current tag token's tag name.
                        // Append the current input character to the temporary buffer.
                        Some(c) if is_ascii_lower_alpha(c) => {
                            match &mut self.cur_token {
                                Some(Token::StartTag { tag_name, .. }) => {
                                    let mut new_tag_name = String::new();

                                    new_tag_name.push_str(tag_name);
                                    new_tag_name.push(c.to_ascii_lowercase());

                                    *tag_name = new_tag_name.into();
                                }
                                Some(Token::EndTag { tag_name, .. }) => {
                                    let mut new_tag_name = String::new();

                                    new_tag_name.push_str(tag_name);
                                    new_tag_name.push(c.to_ascii_lowercase());

                                    *tag_name = new_tag_name.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            };

                            if let Some(ref mut temporary_buffer) = self.temporary_buffer {
                                temporary_buffer.push(c);
                            }
                        }
                        // Anything else
                        // Emit a U+003C LESS-THAN SIGN character token, a U+002F SOLIDUS character
                        // token, and a character token for each of the characters in the temporary
                        // buffer (in the order they were added to the buffer). Reconsume in the
                        // script data state.
                        _ => {
                            self.emit_token(Token::Character { value: '<' });
                            self.emit_token(Token::Character { value: '/' });
                            self.state = State::ScriptData;
                            self.reconsume()
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#script-data-escape-start-state
                State::ScriptDataEscapeStart => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+002D HYPHEN-MINUS (-)
                        // Switch to the script data escape start dash state. Emit a U+002D
                        // HYPHEN-MINUS character token.
                        Some(c @ '-') => {
                            self.state = State::ScriptDataEscapeStartDash;
                            self.emit_token(Token::Character { value: c });
                        }
                        // Anything else
                        // Reconsume in the script data state.
                        _ => {
                            self.state = State::ScriptData;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#script-data-escape-start-dash-state
                State::ScriptDataEscapeStartDash => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+002D HYPHEN-MINUS (-)
                        // Switch to the script data escaped dash dash state. Emit a U+002D
                        // HYPHEN-MINUS character token.
                        Some(c @ '-') => {
                            self.state = State::ScriptDataEscapedDashDash;
                            self.emit_token(Token::Character { value: c });
                        }
                        // Anything else
                        // Reconsume in the script data state.
                        _ => {
                            self.state = State::ScriptData;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-state
                State::ScriptDataEscaped => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+002D HYPHEN-MINUS (-)
                        // Switch to the script data escaped dash state. Emit a U+002D HYPHEN-MINUS
                        // character token.
                        Some(c @ '-') => {
                            self.state = State::ScriptDataEscapedDash;
                            self.emit_token(Token::Character { value: c });
                        }
                        // U+003C LESS-THAN SIGN (<)
                        // Switch to the script data escaped less-than sign state.
                        Some('<') => {
                            self.state = State::ScriptDataEscapedLessThanSign;
                        }
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Emit a U+FFFD
                        // REPLACEMENT CHARACTER character token.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);
                            self.emit_token(Token::Character {
                                value: REPLACEMENT_CHARACTER,
                            });
                        }
                        // EOF
                        // This is an eof-in-script-html-comment-like-text parse error. Emit an
                        // end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInScriptHtmlCommentLikeText);
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Emit the current input character as a character token.
                        Some(c) => {
                            self.emit_token(Token::Character { value: c });
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-dash-state
                State::ScriptDataEscapedDash => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+002D HYPHEN-MINUS (-)
                        // Switch to the script data escaped dash dash state. Emit a U+002D
                        // HYPHEN-MINUS character token.
                        Some(c @ '-') => {
                            self.state = State::ScriptDataEscapedDashDash;
                            self.emit_token(Token::Character { value: c });
                        }
                        // U+003C LESS-THAN SIGN (<)
                        // Switch to the script data escaped less-than sign state.
                        Some('<') => {
                            self.state = State::ScriptDataEscapedLessThanSign;
                        }
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Switch to the script
                        // data escaped state. Emit a U+FFFD REPLACEMENT CHARACTER character token.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);
                            self.state = State::ScriptDataEscaped;
                            self.emit_token(Token::Character {
                                value: REPLACEMENT_CHARACTER,
                            });
                        }
                        // EOF
                        // This is an eof-in-script-html-comment-like-text parse error. Emit an
                        // end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInScriptHtmlCommentLikeText);
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Switch to the script data escaped state. Emit the current input character
                        // as a character token.
                        Some(c) => {
                            self.state = State::ScriptDataEscaped;
                            self.emit_token(Token::Character { value: c });
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-dash-dash-state
                State::ScriptDataEscapedDashDash => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+002D HYPHEN-MINUS (-)
                        // Emit a U+002D HYPHEN-MINUS character token.
                        Some(c @ '-') => {
                            self.emit_token(Token::Character { value: c });
                        }
                        // U+003C LESS-THAN SIGN (<)
                        // Switch to the script data escaped less-than sign state.
                        Some('<') => {
                            self.state = State::ScriptDataEscapedLessThanSign;
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // Switch to the script data state. Emit a U+003E GREATER-THAN SIGN
                        // character token.
                        Some(c @ '>') => {
                            self.state = State::ScriptData;
                            self.emit_token(Token::Character { value: c });
                        }
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Switch to the script
                        // data escaped state. Emit a U+FFFD REPLACEMENT CHARACTER character token.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);
                            self.state = State::ScriptDataEscaped;
                            self.emit_token(Token::Character {
                                value: REPLACEMENT_CHARACTER,
                            });
                        }
                        // EOF
                        // This is an eof-in-script-html-comment-like-text parse error. Emit an
                        // end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInScriptHtmlCommentLikeText);
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Switch to the script data escaped state. Emit the current input character
                        // as a character token.
                        Some(c) => {
                            self.state = State::ScriptDataEscaped;
                            self.emit_token(Token::Character { value: c });
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-less-than-sign-state
                State::ScriptDataEscapedLessThanSign => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+002F SOLIDUS (/)
                        // Set the temporary buffer to the empty string. Switch to the script data
                        // escaped end tag open state.
                        Some('/') => {
                            self.temporary_buffer = Some("".into());
                            self.state = State::ScriptDataEscapedEndTagOpen;
                        }
                        // ASCII alpha
                        // Set the temporary buffer to the empty string. Emit a U+003C LESS-THAN
                        // SIGN character token. Reconsume in the script data double escape start
                        // state.
                        Some(c) if is_ascii_alpha(c) => {
                            self.temporary_buffer = Some("".into());
                            self.emit_token(Token::Character { value: '<' });
                            self.state = State::ScriptDataDoubleEscapeStart;
                            self.reconsume();
                        }
                        // Anything else
                        // Emit a U+003C LESS-THAN SIGN character token. Reconsume in the script
                        // data escaped state.
                        _ => {
                            self.emit_token(Token::Character { value: '<' });
                            self.state = State::ScriptDataEscaped;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-end-tag-open-state
                State::ScriptDataEscapedEndTagOpen => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // ASCII alpha
                        // Create a new end tag token, set its tag name to the empty string.
                        // Reconsume in the script data escaped end tag name state.
                        Some(c) if is_ascii_alpha(c) => {
                            self.cur_token = Some(Token::EndTag {
                                tag_name: "".into(),
                                self_closing: false,
                                attributes: vec![],
                            });

                            self.state = State::ScriptDataEscapedEndTagName;
                            self.reconsume();
                        }
                        // Anything else
                        // Emit a U+003C LESS-THAN SIGN character token and a U+002F SOLIDUS
                        // character token. Reconsume in the script data escaped state.
                        _ => {
                            self.emit_token(Token::Character { value: '<' });
                            self.emit_token(Token::Character { value: '/' });
                            self.state = State::ScriptDataEscaped;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#script-data-escaped-end-tag-name-state
                State::ScriptDataEscapedEndTagName => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // If the current end tag token is an appropriate end tag token, then switch
                        // to the before attribute name state. Otherwise, treat it as per the
                        // "anything else" entry below.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {
                            if self.current_end_tag_token_is_an_appropriate_end_tag_token() {
                                self.state = State::BeforeAttributeName;
                            }
                        }
                        // U+002F SOLIDUS (/)
                        // If the current end tag token is an appropriate end tag token, then switch
                        // to the self-closing start tag state. Otherwise, treat it as per the
                        // "anything else" entry below.
                        Some('/') => {
                            if self.current_end_tag_token_is_an_appropriate_end_tag_token() {
                                self.state = State::SelfClosingStartTag;
                            }
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // If the current end tag token is an appropriate end tag token, then switch
                        // to the data state and emit the current tag token. Otherwise, treat it as
                        // per the "anything else" entry below.
                        Some('>') => {
                            if self.current_end_tag_token_is_an_appropriate_end_tag_token() {
                                self.state = State::Data;
                                self.emit_cur_token();
                            }
                        }
                        // ASCII upper alpha
                        // Append the lowercase version of the current input character (add 0x0020
                        // to the character's code point) to the current tag token's tag name.
                        // Append the current input character to the temporary buffer.
                        Some(c) if is_ascii_upper_alpha(c) => {
                            match &mut self.cur_token {
                                Some(Token::StartTag { tag_name, .. }) => {
                                    let mut new_tag_name = String::new();

                                    new_tag_name.push_str(tag_name);
                                    new_tag_name.push(c.to_ascii_lowercase());

                                    *tag_name = new_tag_name.into();
                                }
                                Some(Token::EndTag { tag_name, .. }) => {
                                    let mut new_tag_name = String::new();

                                    new_tag_name.push_str(tag_name);
                                    new_tag_name.push(c.to_ascii_lowercase());

                                    *tag_name = new_tag_name.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            };

                            if let Some(ref mut temporary_buffer) = self.temporary_buffer {
                                temporary_buffer.push(c);
                            }
                        }
                        // ASCII lower alpha
                        // Append the current input character to the current tag token's tag name.
                        // Append the current input character to the temporary buffer.
                        Some(c) if is_ascii_lower_alpha(c) => {
                            match &mut self.cur_token {
                                Some(Token::StartTag { tag_name, .. }) => {
                                    let mut new_tag_name = String::new();

                                    new_tag_name.push_str(tag_name);
                                    new_tag_name.push(c.to_ascii_lowercase());

                                    *tag_name = new_tag_name.into();
                                }
                                Some(Token::EndTag { tag_name, .. }) => {
                                    let mut new_tag_name = String::new();

                                    new_tag_name.push_str(tag_name);
                                    new_tag_name.push(c.to_ascii_lowercase());

                                    *tag_name = new_tag_name.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            };

                            if let Some(ref mut temporary_buffer) = self.temporary_buffer {
                                temporary_buffer.push(c);
                            }
                        }
                        // Anything else
                        // Emit a U+003C LESS-THAN SIGN character token, a U+002F SOLIDUS character
                        // token, and a character token for each of the characters in the temporary
                        // buffer (in the order they were added to the buffer). Reconsume in the
                        // script data escaped state.
                        _ => {
                            self.emit_token(Token::Character { value: '<' });
                            self.emit_token(Token::Character { value: '/' });
                            self.state = State::ScriptDataEscaped;
                            self.reconsume()
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escape-start-state
                State::ScriptDataDoubleEscapeStart => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // U+002F SOLIDUS (/)
                        // U+003E GREATER-THAN SIGN (>)
                        // If the temporary buffer is the string "script", then switch to the script
                        // data double escaped state. Otherwise, switch to the script data escaped
                        // state. Emit the current input character as a character token.
                        Some(
                            c @ '\x09' | c @ '\x0a' | c @ '\x0c' | c @ '\x20' | c @ '/' | c @ '>',
                        ) => {
                            let is_script =
                                matches!(&self.temporary_buffer, Some(tmp) if tmp == "script");

                            if is_script {
                                self.state = State::ScriptDataDoubleEscaped;
                            } else {
                                self.state = State::ScriptDataEscaped;
                                self.emit_token(Token::Character { value: c });
                            }
                        }
                        // ASCII upper alpha
                        // Append the lowercase version of the current input character (add 0x0020
                        // to the character's code point) to the temporary buffer. Emit the current
                        // input character as a character token.
                        Some(c) if is_ascii_upper_alpha(c) => {
                            if let Some(ref mut temporary_buffer) = self.temporary_buffer {
                                temporary_buffer.push(c.to_ascii_lowercase());
                            }

                            self.emit_token(Token::Character { value: c });
                        }
                        // ASCII lower alpha
                        // Append the current input character to the temporary buffer. Emit the
                        // current input character as a character token.
                        Some(c) if is_ascii_lower_alpha(c) => {
                            if let Some(ref mut temporary_buffer) = self.temporary_buffer {
                                temporary_buffer.push(c);
                            }

                            self.emit_token(Token::Character { value: c });
                        }
                        // Anything else
                        // Reconsume in the script data escaped state.
                        _ => {
                            self.state = State::ScriptDataEscaped;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-state
                State::ScriptDataDoubleEscaped => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+002D HYPHEN-MINUS (-)
                        // Switch to the script data double escaped dash state. Emit a U+002D
                        // HYPHEN-MINUS character token.
                        Some(c @ '-') => {
                            self.state = State::ScriptDataDoubleEscapedDash;
                            self.emit_token(Token::Character { value: c });
                        }
                        // U+003C LESS-THAN SIGN (<)
                        // Switch to the script data double escaped less-than sign state. Emit a
                        // U+003C LESS-THAN SIGN character token.
                        Some(c @ '<') => {
                            self.state = State::ScriptDataEscapedLessThanSign;
                            self.emit_token(Token::Character { value: c });
                        }
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Emit a U+FFFD
                        // REPLACEMENT CHARACTER character token.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);
                            self.emit_token(Token::Character {
                                value: REPLACEMENT_CHARACTER,
                            });
                        }
                        // EOF
                        // This is an eof-in-script-html-comment-like-text parse error. Emit an
                        None => {
                            self.emit_error(ErrorKind::EofInScriptHtmlCommentLikeText);
                            self.emit_token(Token::Eof);
                        }
                        // end-of-file token. Anything else
                        // Emit the current input character as a character token.
                        Some(c) => {
                            self.emit_token(Token::Character { value: c });
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-dash-state
                State::ScriptDataDoubleEscapedDash => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+002D HYPHEN-MINUS (-)
                        // Switch to the script data double escaped dash dash state. Emit a U+002D
                        // HYPHEN-MINUS character token.
                        Some(c @ '-') => {
                            self.state = State::ScriptDataDoubleEscapedDashDash;
                            self.emit_token(Token::Character { value: c });
                        }
                        // U+003C LESS-THAN SIGN (<)
                        // Switch to the script data double escaped less-than sign state. Emit a
                        // U+003C LESS-THAN SIGN character token.
                        Some(c @ '<') => {
                            self.state = State::ScriptDataDoubleEscapedLessThanSign;
                            self.emit_token(Token::Character { value: c });
                        }
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Switch to the script
                        // data double escaped state. Emit a U+FFFD REPLACEMENT CHARACTER character
                        // token.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);
                            self.state = State::ScriptDataDoubleEscaped;
                            self.emit_token(Token::Character {
                                value: REPLACEMENT_CHARACTER,
                            });
                        }
                        // EOF
                        // This is an eof-in-script-html-comment-like-text parse error. Emit an
                        // end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInScriptHtmlCommentLikeText);
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Switch to the script data double escaped state. Emit the current input
                        // character as a character token.
                        Some(c) => {
                            self.state = State::ScriptDataDoubleEscaped;
                            self.emit_token(Token::Character { value: c });
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-dash-dash-state
                State::ScriptDataDoubleEscapedDashDash => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+002D HYPHEN-MINUS (-)
                        // Emit a U+002D HYPHEN-MINUS character token.
                        Some(c @ '-') => {
                            self.emit_token(Token::Character { value: c });
                        }
                        // U+003C LESS-THAN SIGN (<)
                        // Switch to the script data double escaped less-than sign state. Emit a
                        // U+003C LESS-THAN SIGN character token.
                        Some(c @ '<') => {
                            self.state = State::ScriptDataDoubleEscapedLessThanSign;
                            self.emit_token(Token::Character { value: c });
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // Switch to the script data state. Emit a U+003E GREATER-THAN SIGN
                        // character token.
                        Some(c @ '>') => {
                            self.state = State::ScriptData;
                            self.emit_token(Token::Character { value: c });
                        }
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Switch to the script
                        // data double escaped state. Emit a U+FFFD REPLACEMENT CHARACTER character
                        // token.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);
                            self.state = State::ScriptDataDoubleEscaped;
                            self.emit_token(Token::Character {
                                value: REPLACEMENT_CHARACTER,
                            });
                        }
                        // EOF
                        // This is an eof-in-script-html-comment-like-text parse error. Emit an
                        // end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInScriptHtmlCommentLikeText);
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Switch to the script data double escaped state. Emit the current input
                        // character as a character token.
                        Some(c) => {
                            self.state = State::ScriptDataDoubleEscaped;
                            self.emit_token(Token::Character { value: c });
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escaped-less-than-sign-state
                State::ScriptDataDoubleEscapedLessThanSign => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+002F SOLIDUS (/)
                        // Set the temporary buffer to the empty string. Switch to the script data
                        // double escape end state. Emit a U+002F SOLIDUS character token.
                        Some(c @ '/') => {
                            self.temporary_buffer = Some("".into());
                            self.state = State::ScriptDataDoubleEscapeEnd;
                            self.emit_token(Token::Character { value: c });
                        }
                        // Anything else
                        // Reconsume in the script data double escaped state.
                        _ => {
                            self.state = State::ScriptDataDoubleEscaped;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#script-data-double-escape-end-state
                State::ScriptDataDoubleEscapeEnd => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // U+002F SOLIDUS (/)
                        // U+003E GREATER-THAN SIGN (>)
                        // If the temporary buffer is the string "script", then switch to the script
                        // data escaped state. Otherwise, switch to the script data double escaped
                        // state. Emit the current input character as a character token.
                        Some(
                            c @ '\x09' | c @ '\x0a' | c @ '\x0c' | c @ '\x20' | c @ '/' | c @ '>',
                        ) => {
                            let is_script =
                                matches!(&self.temporary_buffer, Some(tmp) if tmp == "script");

                            if is_script {
                                self.state = State::ScriptDataEscaped;
                            } else {
                                self.state = State::ScriptDataDoubleEscaped;
                                self.emit_token(Token::Character { value: c });
                            }
                        }
                        // ASCII upper alpha
                        // Append the lowercase version of the current input character (add 0x0020
                        // to the character's code point) to the temporary buffer. Emit the current
                        // input character as a character token.
                        Some(c) if is_ascii_upper_alpha(c) => {
                            if let Some(ref mut temporary_buffer) = self.temporary_buffer {
                                temporary_buffer.push(c.to_ascii_lowercase());
                            }

                            self.emit_token(Token::Character { value: c });
                        }
                        // ASCII lower alpha
                        // Append the current input character to the temporary buffer. Emit the
                        // current input character as a character token.
                        Some(c) if is_ascii_lower_alpha(c) => {
                            if let Some(ref mut temporary_buffer) = self.temporary_buffer {
                                temporary_buffer.push(c);
                            }

                            self.emit_token(Token::Character { value: c });
                        }
                        // Anything else
                        // Reconsume in the script data double escaped state.
                        _ => {
                            self.state = State::ScriptDataDoubleEscaped;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-name-state
                State::BeforeAttributeName => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // Ignore the character.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {}
                        // U+002F SOLIDUS (/)
                        // U+003E GREATER-THAN SIGN (>)
                        // EOF
                        // Reconsume in the after attribute name state.
                        Some('/') | Some('>') | None => {
                            self.state = State::AfterAttributeName;
                            self.reconsume();
                        }
                        // U+003D EQUALS SIGN (=)
                        // This is an unexpected-equals-sign-before-attribute-name parse error.
                        // Start a new attribute in the current tag token. Set that attribute's name
                        // to the current input character, and its value to the empty string. Switch
                        // to the attribute name state.
                        Some(c @ '=') => {
                            self.emit_error(ErrorKind::UnexpectedEqualsSignBeforeAttributeName);
                            if let Some(ref mut token) = self.cur_token {
                                match token {
                                    Token::StartTag { attributes, .. } => {
                                        attributes.push(Attribute {
                                            name: c.to_string().into(),
                                            value: "".into(),
                                        });
                                    }
                                    Token::EndTag { attributes, .. } => {
                                        attributes.push(Attribute {
                                            name: c.to_string().into(),
                                            value: "".into(),
                                        });
                                    }
                                    _ => {}
                                }
                            }
                            self.state = State::AttributeName;
                        }
                        // Anything else
                        // Start a new attribute in the current tag token. Set that attribute name
                        // and value to the empty string. Reconsume in the attribute name state.
                        _ => {
                            if let Some(ref mut token) = self.cur_token {
                                match token {
                                    Token::StartTag { attributes, .. } => {
                                        attributes.push(Attribute {
                                            name: "".into(),
                                            value: "".into(),
                                        });
                                    }
                                    Token::EndTag { attributes, .. } => {
                                        attributes.push(Attribute {
                                            name: "".into(),
                                            value: "".into(),
                                        });
                                    }
                                    _ => {}
                                }
                            }

                            self.state = State::AttributeName;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#attribute-name-state
                State::AttributeName => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // U+002F SOLIDUS (/)
                        // U+003E GREATER-THAN SIGN (>)
                        // EOF
                        // Reconsume in the after attribute name state.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20' | '/' | '>') | None => {
                            self.state = State::AfterAttributeName;
                            self.reconsume();
                        }
                        // U+003D EQUALS SIGN (=)
                        // Switch to the before attribute value state.
                        Some('=') => {
                            self.state = State::BeforeAttributeValue;
                        }
                        // ASCII upper alpha
                        // Append the lowercase version of the current input character (add 0x0020
                        // to the character's code point) to the current attribute's name.
                        Some(c) if is_ascii_upper_alpha(c) => {
                            if let Some(ref mut token) = self.cur_token {
                                match token {
                                    Token::StartTag { attributes, .. }
                                    | Token::EndTag { attributes, .. } => {
                                        if let Some(attribute) = attributes.last_mut() {
                                            let mut new_name = String::new();

                                            new_name.push_str(&attribute.name);
                                            new_name.push(c.to_ascii_lowercase());

                                            attribute.name = new_name.into();
                                        }
                                    }
                                    _ => {}
                                }
                            }
                        }
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Append a U+FFFD
                        // REPLACEMENT CHARACTER character to the current attribute's name.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);

                            if let Some(ref mut token) = self.cur_token {
                                match token {
                                    Token::StartTag { attributes, .. }
                                    | Token::EndTag { attributes, .. } => {
                                        if let Some(attribute) = attributes.last_mut() {
                                            let mut new_name = String::new();

                                            new_name.push_str(&attribute.name);
                                            new_name.push(REPLACEMENT_CHARACTER);

                                            attribute.name = new_name.into();
                                        }
                                    }
                                    _ => {}
                                }
                            }
                        }
                        // U+0022 QUOTATION MARK (")
                        // U+0027 APOSTROPHE (')
                        // U+003C LESS-THAN SIGN (<)
                        // This is an unexpected-character-in-attribute-name parse error. Treat it
                        // as per the "anything else" entry below.
                        Some('"') | Some('\'') | Some('<') => {
                            self.emit_error(ErrorKind::UnexpectedCharacterInAttributeName);
                        }
                        // Anything else
                        // Append the current input character to the current attribute's name.
                        Some(c) => {
                            if let Some(ref mut token) = self.cur_token {
                                match token {
                                    Token::StartTag { attributes, .. }
                                    | Token::EndTag { attributes, .. } => {
                                        if let Some(attribute) = attributes.last_mut() {
                                            let mut new_name = String::new();

                                            new_name.push_str(&attribute.name);
                                            new_name.push(c);

                                            attribute.name = new_name.into();
                                        }
                                    }
                                    _ => {}
                                }
                            }
                        }
                    }

                    // When the user agent leaves the attribute name state (and
                    // before emitting the tag token, if appropriate), the
                    // complete attribute's name must be compared to the other
                    // attributes on the same token; if there is already an
                    // attribute on the token with the exact same name, then
                    // this is a duplicate-attribute parse error and the new
                    // attribute must be removed from the token.
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#after-attribute-name-state
                State::AfterAttributeName => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // Ignore the character.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {}
                        // U+002F SOLIDUS (/)
                        // Switch to the self-closing start tag state.
                        Some('/') => {
                            self.state = State::SelfClosingStartTag;
                        }
                        // U+003D EQUALS SIGN (=)
                        // Switch to the before attribute value state.
                        Some('=') => {
                            self.state = State::BeforeAttributeValue;
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // Switch to the data state. Emit the current tag token.
                        Some('>') => {
                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // EOF
                        // This is an eof-in-tag parse error. Emit an end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInTag);
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Start a new attribute in the current tag token. Set that attribute name
                        // and value to the empty string. Reconsume in the attribute name state.
                        _ => {
                            if let Some(ref mut token) = self.cur_token {
                                match token {
                                    Token::StartTag { attributes, .. }
                                    | Token::EndTag { attributes, .. } => {
                                        attributes.push(Attribute {
                                            name: "".into(),
                                            value: "".into(),
                                        });
                                    }
                                    _ => {}
                                }
                            }
                            self.state = State::AttributeName;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#before-attribute-value-state
                State::BeforeAttributeValue => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // Ignore the character.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {
                            self.state = State::BeforeAttributeName;
                        }
                        // U+0022 QUOTATION MARK (")
                        // Switch to the attribute value (double-quoted) state.
                        Some('"') => {
                            self.state = State::AttributeValueDoubleQuoted;
                        }
                        // U+0027 APOSTROPHE (')
                        // Switch to the attribute value (single-quoted) state.
                        Some('\'') => {
                            self.state = State::AttributeValueSingleQuoted;
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // This is a missing-attribute-value parse error. Switch to the data state.
                        // Emit the current tag token.
                        Some('>') => {
                            self.emit_error(ErrorKind::MissingEndTagName);
                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // Anything else
                        // Reconsume in the attribute value (unquoted) state.
                        _ => {
                            self.state = State::AttributeValueUnquoted;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(double-quoted)-state
                State::AttributeValueDoubleQuoted => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0022 QUOTATION MARK (")
                        // Switch to the after attribute value (quoted) state.
                        Some('"') => {
                            self.state = State::AfterAttributeValueQuoted;
                        }
                        // U+0026 AMPERSAND (&)
                        // Set the return state to the attribute value (double-quoted) state. Switch
                        // to the character reference state.
                        Some('&') => {
                            self.return_state = State::AttributeValueDoubleQuoted;
                            self.state = State::CharacterReference;
                        }
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Append a U+FFFD
                        // REPLACEMENT CHARACTER character to the current attribute's value.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);

                            if let Some(ref mut token) = self.cur_token {
                                match token {
                                    Token::StartTag { attributes, .. }
                                    | Token::EndTag { attributes, .. } => {
                                        if let Some(attribute) = attributes.last_mut() {
                                            let mut new_value = String::new();

                                            new_value.push_str(&attribute.value);
                                            new_value.push(REPLACEMENT_CHARACTER);

                                            attribute.value = new_value.into();
                                        }
                                    }
                                    _ => {}
                                }
                            }
                        }
                        // EOF
                        // This is an eof-in-tag parse error. Emit an end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInTag);
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Append the current input character to the current attribute's value.
                        Some(c) => {
                            if let Some(ref mut token) = self.cur_token {
                                match token {
                                    Token::StartTag { attributes, .. }
                                    | Token::EndTag { attributes, .. } => {
                                        if let Some(attribute) = attributes.last_mut() {
                                            let mut new_value = String::new();

                                            new_value.push_str(&attribute.value);
                                            new_value.push(c);

                                            attribute.value = new_value.into();
                                        }
                                    }
                                    _ => {}
                                }
                            }
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(single-quoted)-state
                State::AttributeValueSingleQuoted => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0027 APOSTROPHE (')
                        // Switch to the after attribute value (quoted) state.
                        Some('\'') => {
                            self.state = State::AfterAttributeValueQuoted;
                        }
                        // U+0026 AMPERSAND (&)
                        // Set the return state to the attribute value (single-quoted) state. Switch
                        // to the character reference state.
                        Some('&') => {
                            self.return_state = State::AttributeValueSingleQuoted;
                            self.state = State::CharacterReference;
                        }
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Append a U+FFFD
                        // REPLACEMENT CHARACTER character to the current attribute's value.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);

                            if let Some(ref mut token) = self.cur_token {
                                match token {
                                    Token::StartTag { attributes, .. }
                                    | Token::EndTag { attributes, .. } => {
                                        if let Some(attribute) = attributes.last_mut() {
                                            let mut new_value = String::new();

                                            new_value.push_str(&attribute.value);
                                            new_value.push(REPLACEMENT_CHARACTER);

                                            attribute.value = new_value.into();
                                        }
                                    }
                                    _ => {}
                                }
                            }
                        }
                        // EOF
                        // This is an eof-in-tag parse error. Emit an end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInTag);
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Append the current input character to the current attribute's value.
                        Some(c) => {
                            if let Some(ref mut token) = self.cur_token {
                                match token {
                                    Token::StartTag { attributes, .. }
                                    | Token::EndTag { attributes, .. } => {
                                        if let Some(attribute) = attributes.last_mut() {
                                            let mut new_value = String::new();

                                            new_value.push_str(&attribute.value);
                                            new_value.push(c);

                                            attribute.value = new_value.into();
                                        }
                                    }
                                    _ => {}
                                }
                            }
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#attribute-value-(unquoted)-state
                State::AttributeValueUnquoted => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // Switch to the before attribute name state.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {
                            self.state = State::BeforeAttributeName;
                        }
                        // U+0026 AMPERSAND (&)
                        // Set the return state to the attribute value (unquoted) state. Switch to
                        // the character reference state.
                        Some('&') => {
                            self.return_state = State::AttributeValueUnquoted;
                            self.state = State::CharacterReference;
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // Switch to the data state. Emit the current tag token.
                        Some('>') => {
                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Append a U+FFFD
                        // REPLACEMENT CHARACTER character to the current attribute's value.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);

                            if let Some(ref mut token) = self.cur_token {
                                match token {
                                    Token::StartTag { attributes, .. }
                                    | Token::EndTag { attributes, .. } => {
                                        if let Some(attribute) = attributes.last_mut() {
                                            let mut new_value = String::new();

                                            new_value.push_str(&attribute.value);
                                            new_value.push(REPLACEMENT_CHARACTER);

                                            attribute.value = new_value.into();
                                        }
                                    }
                                    _ => {}
                                }
                            }
                        }
                        // U+0022 QUOTATION MARK (")
                        // U+0027 APOSTROPHE (')
                        // U+003C LESS-THAN SIGN (<)
                        // U+003D EQUALS SIGN (=)
                        // U+0060 GRAVE ACCENT (`)
                        // This is an unexpected-character-in-unquoted-attribute-value parse error.
                        // Treat it as per the "anything else" entry below.
                        Some('"') | Some('\'') | Some('<') | Some('=') | Some('`') => {
                            self.emit_error(ErrorKind::UnexpectedCharacterInUnquotedAttributeValue);
                        }
                        // EOF
                        // This is an eof-in-tag parse error. Emit an end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInTag);
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Append the current input character to the current attribute's value.
                        Some(c) => {
                            if let Some(ref mut token) = self.cur_token {
                                match token {
                                    Token::StartTag { attributes, .. }
                                    | Token::EndTag { attributes, .. } => {
                                        if let Some(attribute) = attributes.last_mut() {
                                            let mut new_value = String::new();

                                            new_value.push_str(&attribute.value);
                                            new_value.push(c);

                                            attribute.value = new_value.into();
                                        }
                                    }
                                    _ => {}
                                }
                            }
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#after-attribute-value-(quoted)-state
                State::AfterAttributeValueQuoted => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // Switch to the before attribute name state.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {
                            self.state = State::BeforeAttributeName;
                        }
                        // U+002F SOLIDUS (/)
                        // Switch to the self-closing start tag state.
                        Some('/') => {
                            self.state = State::SelfClosingStartTag;
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // Switch to the data state. Emit the current tag token.
                        Some('>') => {
                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // EOF
                        // This is an eof-in-tag parse error. Emit an end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInTag);
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // This is a missing-whitespace-between-attributes parse error. Reconsume in
                        // the before attribute name state.
                        _ => {
                            self.emit_error(ErrorKind::MissingWhitespaceBetweenAttributes);
                            self.state = State::BeforeAttributeName;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#self-closing-start-tag-state
                State::SelfClosingStartTag => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+003E GREATER-THAN SIGN (>)
                        // Set the self-closing flag of the current tag token. Switch to the data
                        // state. Emit the current tag token.
                        Some('>') => {
                            match &mut self.cur_token {
                                Some(Token::StartTag { self_closing, .. }) => {
                                    *self_closing = true;
                                }
                                Some(Token::EndTag { self_closing, .. }) => {
                                    *self_closing = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // EOF
                        // This is an eof-in-tag parse error. Emit an end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInTag);
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // This is an unexpected-solidus-in-tag parse error. Reconsume in the before
                        // attribute name state.
                        _ => {
                            self.emit_error(ErrorKind::UnexpectedSolidusInTag);
                            self.state = State::BeforeAttributeName;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#bogus-comment-state
                State::BogusComment => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+003E GREATER-THAN SIGN (>)
                        // Switch to the data state. Emit the current comment token.
                        Some('>') => {
                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // EOF
                        // Emit the comment. Emit an end-of-file token.
                        None => {
                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Append a U+FFFD
                        // REPLACEMENT CHARACTER character to the comment token's data.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);

                            match &mut self.cur_token {
                                Some(Token::Comment { data, .. }) => {
                                    let mut new_data = String::new();

                                    new_data.push_str(data);
                                    new_data.push(REPLACEMENT_CHARACTER);

                                    *data = new_data.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            }
                        }
                        // Anything else
                        // Append the current input character to the comment token's data.
                        Some(c) => match &mut self.cur_token {
                            Some(Token::Comment { data, .. }) => {
                                let mut new_data = String::new();

                                new_data.push_str(data);
                                new_data.push(c);

                                *data = new_data.into();
                            }
                            _ => {
                                unreachable!();
                            }
                        },
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#markup-declaration-open-state
                State::MarkupDeclarationOpen => {
                    let cur_pos = self.input.cur_pos();
                    let anything_else = |lexer: &mut Lexer<I>| {
                        lexer.emit_error(ErrorKind::IncorrectlyOpenedComment);
                        lexer.cur_token = Some(Token::Comment { data: "".into() });
                        lexer.state = State::BogusComment;

                        lexer.input.reset_to(cur_pos);
                    };

                    // If the next few characters are:
                    match self.consume_next_char() {
                        // Two U+002D HYPHEN-MINUS characters (-)
                        // Consume those two characters, create a comment token whose data
                        // is the empty string, and switch to the comment start state.
                        Some('-') => match self.consume_next_char() {
                            Some('-') => {
                                self.cur_token = Some(Token::Comment { data: "".into() });
                                self.state = State::CommentStart;
                            }
                            _ => {
                                anything_else(self);
                            }
                        },
                        // ASCII case-insensitive match for the word "DOCTYPE"
                        // Consume those characters and switch to the DOCTYPE state.
                        Some('d' | 'D') => match self.consume_next_char() {
                            Some('o' | 'O') => match self.consume_next_char() {
                                Some('c' | 'C') => match self.consume_next_char() {
                                    Some('t' | 'T') => match self.consume_next_char() {
                                        Some('y' | 'Y') => match self.consume_next_char() {
                                            Some('p' | 'P') => match self.consume_next_char() {
                                                Some('e' | 'E') => {
                                                    self.state = State::Doctype;
                                                }
                                                _ => {
                                                    anything_else(self);
                                                }
                                            },
                                            _ => {
                                                anything_else(self);
                                            }
                                        },
                                        _ => {
                                            anything_else(self);
                                        }
                                    },
                                    _ => {
                                        anything_else(self);
                                    }
                                },
                                _ => {
                                    anything_else(self);
                                }
                            },
                            _ => {
                                anything_else(self);
                            }
                        },
                        // The string "[CDATA[" (the five uppercase letters "CDATA" with a
                        // U+005B LEFT SQUARE BRACKET character before and after)
                        // Consume those characters. If there is an adjusted current node and it
                        // is not an element in the HTML namespace, then switch to the CDATA
                        // section state. Otherwise, this is a cdata-in-html-content parse
                        // error. Create a comment token whose data is the "[CDATA[" string.
                        // Switch to the bogus comment state.
                        Some('[') => match self.consume_next_char() {
                            Some('c' | 'C') => match self.consume_next_char() {
                                Some('d' | 'D') => match self.consume_next_char() {
                                    Some('a' | 'A') => match self.consume_next_char() {
                                        Some('t' | 'T') => match self.consume_next_char() {
                                            Some('a' | 'A') => match self.consume_next_char() {
                                                Some('[') => {
                                                    if self.in_foreign_node {
                                                        self.state = State::CdataSection;
                                                    } else {
                                                        self.emit_error(
                                                            ErrorKind::CdataInHtmlContent,
                                                        );
                                                        // TODO fix me
                                                        self.cur_token = Some(Token::Comment {
                                                            data: "[CDATA[".into(),
                                                        });
                                                        self.state = State::BogusComment;
                                                    }
                                                }
                                                _ => {
                                                    anything_else(self);
                                                }
                                            },
                                            _ => {
                                                anything_else(self);
                                            }
                                        },
                                        _ => {
                                            anything_else(self);
                                        }
                                    },
                                    _ => {
                                        anything_else(self);
                                    }
                                },
                                _ => {
                                    anything_else(self);
                                }
                            },
                            _ => {
                                anything_else(self);
                            }
                        },
                        // Anything else
                        // This is an incorrectly-opened-comment parse error. Create a comment token
                        // whose data is the empty string. Switch to the bogus comment state (don't
                        // consume anything in the current state).
                        _ => {
                            anything_else(self);
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#comment-start-state
                State::CommentStart => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+002D HYPHEN-MINUS (-)
                        // Switch to the comment start dash state.
                        Some('-') => {
                            self.state = State::CommentStartDash;
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // This is an abrupt-closing-of-empty-comment parse error. Switch to the
                        // data state. Emit the current comment token.
                        Some('>') => {
                            self.emit_error(ErrorKind::AbruptClosingOfEmptyComment);
                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // Anything else
                        // Reconsume in the comment state.
                        _ => {
                            self.state = State::Comment;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#comment-start-dash-state
                State::CommentStartDash => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+002D HYPHEN-MINUS (-)
                        // Switch to the comment end state.
                        Some('-') => {
                            self.state = State::CommentEnd;
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // This is an abrupt-closing-of-empty-comment parse error. Switch to the
                        // data state. Emit the current comment token.
                        Some('>') => {
                            self.emit_error(ErrorKind::AbruptClosingOfEmptyComment);
                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // EOF
                        // This is an eof-in-comment parse error. Emit the current comment token.
                        // Emit an end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInComment);
                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Append a U+002D HYPHEN-MINUS character (-) to the comment token's data.
                        // Reconsume in the comment state.
                        _ => {
                            match &mut self.cur_token {
                                Some(Token::Comment { data, .. }) => {
                                    let mut new_data = String::new();

                                    new_data.push_str(data);
                                    new_data.push('-');

                                    *data = new_data.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            };

                            self.state = State::Comment;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#comment-state
                State::Comment => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+003C LESS-THAN SIGN (<)
                        // Append the current input character to the comment token's data. Switch to
                        // the comment less-than sign state.
                        Some(c @ '<') => {
                            match &mut self.cur_token {
                                Some(Token::Comment { data, .. }) => {
                                    let mut new_data = String::new();

                                    new_data.push_str(data);
                                    new_data.push(c);

                                    *data = new_data.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            };

                            self.state = State::CommentLessThanSign;
                        }
                        // U+002D HYPHEN-MINUS (-)
                        // Switch to the comment end dash state.
                        Some('-') => {
                            self.state = State::CommentEndDash;
                        }
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Append a U+FFFD
                        // REPLACEMENT CHARACTER character to the comment token's data.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);

                            match &mut self.cur_token {
                                Some(Token::Comment { data, .. }) => {
                                    let mut new_data = String::new();

                                    new_data.push_str(data);
                                    new_data.push(REPLACEMENT_CHARACTER);

                                    *data = new_data.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            }
                        }
                        // EOF
                        // This is an eof-in-comment parse error. Emit the current comment token.
                        // Emit an end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInComment);
                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Append the current input character to the comment token's data.
                        Some(c) => {
                            match &mut self.cur_token {
                                Some(Token::Comment { data, .. }) => {
                                    let mut new_data = String::new();

                                    new_data.push_str(data);
                                    new_data.push(c);

                                    *data = new_data.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            };
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#comment-less-than-sign-state
                State::CommentLessThanSign => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0021 EXCLAMATION MARK (!)
                        // Append the current input character to the comment token's data. Switch to
                        // the comment less-than sign bang state.
                        Some(c @ '!') => {
                            match &mut self.cur_token {
                                Some(Token::Comment { data, .. }) => {
                                    let mut new_data = String::new();

                                    new_data.push_str(data);
                                    new_data.push(c);

                                    *data = new_data.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            };

                            self.state = State::CommentLessThanSignBang;
                        }
                        // U+003C LESS-THAN SIGN (<)
                        // Append the current input character to the comment token's data.
                        Some(c @ '<') => {
                            match &mut self.cur_token {
                                Some(Token::Comment { data, .. }) => {
                                    let mut new_data = String::new();

                                    new_data.push_str(data);
                                    new_data.push(c);

                                    *data = new_data.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            };
                        }
                        // Anything else
                        // Reconsume in the comment state.
                        _ => {
                            self.state = State::Comment;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#comment-less-than-sign-bang-state
                State::CommentLessThanSignBang => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+002D HYPHEN-MINUS (-)
                        // Switch to the comment less-than sign bang dash state.
                        Some('-') => {
                            self.state = State::CommentLessThanSignBangDash;
                        }
                        // Anything else
                        // Reconsume in the comment state.
                        _ => {
                            self.state = State::Comment;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#comment-less-than-sign-bang-dash-state
                State::CommentLessThanSignBangDash => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+002D HYPHEN-MINUS (-)
                        // Switch to the comment less-than sign bang dash dash state.
                        Some('-') => {
                            self.state = State::CommentLessThanSignBangDashDash;
                        }
                        // Anything else
                        // Reconsume in the comment end dash state.
                        _ => {
                            self.state = State::CommentEndDash;
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#comment-less-than-sign-bang-dash-dash-state
                State::CommentLessThanSignBangDashDash => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+003E GREATER-THAN SIGN (>)
                        // EOF
                        // Reconsume in the comment end state.
                        Some('>') | None => {
                            self.state = State::CommentEnd;
                            self.reconsume();
                        }
                        // Anything else
                        // This is a nested-comment parse error. Reconsume in the comment end state.
                        _ => {
                            self.emit_error(ErrorKind::NestedComment);
                            self.state = State::CommentEnd;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#comment-end-dash-state
                State::CommentEndDash => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+002D HYPHEN-MINUS (-)
                        // Switch to the comment end state.
                        Some('-') => {
                            self.state = State::CommentEnd;
                        }
                        // EOF
                        // This is an eof-in-comment parse error. Emit the current comment token.
                        // Emit an end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInComment);
                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Append a U+002D HYPHEN-MINUS character (-) to the comment token's data.
                        // Reconsume in the comment state.
                        _ => {
                            match &mut self.cur_token {
                                Some(Token::Comment { data, .. }) => {
                                    let mut new_data = String::new();

                                    new_data.push_str(data);
                                    new_data.push('-');

                                    *data = new_data.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            };

                            self.state = State::Comment;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#comment-end-state
                State::CommentEnd => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+003E GREATER-THAN SIGN (>)
                        // Switch to the data state. Emit the current comment token.
                        Some('>') => {
                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // U+0021 EXCLAMATION MARK (!)
                        // Switch to the comment end bang state.
                        Some('!') => {
                            self.state = State::CommentEndDash;
                        }
                        // U+002D HYPHEN-MINUS (-)
                        // Append a U+002D HYPHEN-MINUS character (-) to the comment token's data.
                        Some(c @ '-') => match &mut self.cur_token {
                            Some(Token::Comment { data }) => {
                                let mut new_data = String::new();

                                new_data.push_str(data);
                                new_data.push(c);

                                *data = new_data.into();
                            }
                            _ => {
                                unreachable!();
                            }
                        },
                        // EOF
                        // This is an eof-in-comment parse error. Emit the current comment token.
                        // Emit an end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInComment);
                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Append two U+002D HYPHEN-MINUS characters (-) to the comment token's
                        // data. Reconsume in the comment state.
                        _ => {
                            match &mut self.cur_token {
                                Some(Token::Comment { data }) => {
                                    let mut new_data = String::new();

                                    new_data.push_str(data);
                                    new_data.push('-');

                                    *data = new_data.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::Comment;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#comment-end-bang-state
                State::CommentEndBang => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+002D HYPHEN-MINUS (-)
                        // Append two U+002D HYPHEN-MINUS characters (-) and a U+0021 EXCLAMATION
                        // MARK character (!) to the comment token's data. Switch to the comment end
                        // dash state.
                        Some('-') => {
                            match &mut self.cur_token {
                                Some(Token::Comment { data, .. }) => {
                                    let mut new_data = String::new();

                                    new_data.push_str(data);
                                    new_data.push('-');
                                    new_data.push('!');

                                    *data = new_data.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::CommentEndDash;
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // This is an incorrectly-closed-comment parse error. Switch to the data
                        // state. Emit the current comment token.
                        Some('>') => {
                            self.emit_error(ErrorKind::IncorrectlyClosedComment);
                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // EOF
                        // This is an eof-in-comment parse error. Emit the current comment token.
                        // Emit an end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInComment);
                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Append two U+002D HYPHEN-MINUS characters (-) and a U+0021 EXCLAMATION
                        // MARK character (!) to the comment token's data. Reconsume in the comment
                        // state.
                        _ => {
                            match &mut self.cur_token {
                                Some(Token::Comment { data, .. }) => {
                                    let mut new_data = String::new();

                                    new_data.push_str(data);
                                    new_data.push('-');
                                    new_data.push('!');

                                    *data = new_data.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::Comment;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#doctype-state
                State::Doctype => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // Switch to the before DOCTYPE name state.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {
                            self.state = State::BeforeDoctypeName;
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // Reconsume in the before DOCTYPE name state.
                        Some('>') => {
                            self.state = State::BeforeDoctypeName;
                            self.reconsume();
                        }
                        // EOF
                        // This is an eof-in-doctype parse error. Create a new DOCTYPE token. Set
                        // its force-quirks flag to on. Emit the current token. Emit an end-of-file
                        // token.
                        None => {
                            self.emit_error(ErrorKind::EofInDoctype);
                            self.cur_token = Some(Token::Doctype {
                                name: None,
                                force_quirks: true,
                                public_id: None,
                                system_id: None,
                            });
                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // This is a missing-whitespace-before-doctype-name parse error. Reconsume
                        // in the before DOCTYPE name state.
                        _ => {
                            self.emit_error(ErrorKind::MissingWhitespaceBeforeDoctypeName);
                            self.state = State::BeforeDoctypeName;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#before-doctype-name-state
                State::BeforeDoctypeName => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // Ignore the character.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {}
                        // ASCII upper alpha
                        // Create a new DOCTYPE token. Set the token's name to the lowercase version
                        // of the current input character (add 0x0020 to the character's code
                        // point). Switch to the DOCTYPE name state.
                        Some(c) if is_ascii_upper_alpha(c) => {
                            self.cur_token = Some(Token::Doctype {
                                name: Some(c.to_ascii_lowercase().to_string().into()),
                                force_quirks: false,
                                public_id: None,
                                system_id: None,
                            });
                            self.state = State::DoctypeName;
                        }
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Create a new DOCTYPE
                        // token. Set the token's name to a U+FFFD REPLACEMENT CHARACTER character.
                        // Switch to the DOCTYPE name state.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);
                            self.cur_token = Some(Token::Doctype {
                                name: Some(REPLACEMENT_CHARACTER.to_string().into()),
                                force_quirks: true,
                                public_id: None,
                                system_id: None,
                            });
                            self.state = State::DoctypeName;
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // This is a missing-doctype-name parse error. Create a new DOCTYPE token.
                        // Set its force-quirks flag to on. Switch to the data state. Emit the
                        // current token.
                        Some('>') => {
                            self.emit_error(ErrorKind::MissingDoctypeName);
                            self.cur_token = Some(Token::Doctype {
                                name: Some(REPLACEMENT_CHARACTER.to_string().into()),
                                force_quirks: true,
                                public_id: None,
                                system_id: None,
                            });
                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // EOF
                        // This is an eof-in-doctype parse error. Create a new DOCTYPE token. Set
                        // its force-quirks flag to on. Emit the current token. Emit an end-of-file
                        // token.
                        None => {
                            self.emit_error(ErrorKind::EofInDoctype);
                            self.cur_token = Some(Token::Doctype {
                                name: Some(REPLACEMENT_CHARACTER.to_string().into()),
                                force_quirks: true,
                                public_id: None,
                                system_id: None,
                            });
                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Create a new DOCTYPE token. Set the token's name to the current input
                        // character. Switch to the DOCTYPE name state.
                        Some(c) => {
                            self.cur_token = Some(Token::Doctype {
                                name: Some(c.to_string().into()),
                                force_quirks: false,
                                public_id: None,
                                system_id: None,
                            });
                            self.state = State::DoctypeName;
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#doctype-name-state
                State::DoctypeName => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // Switch to the after DOCTYPE name state.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {
                            self.state = State::AfterDoctypeName;
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // Switch to the data state. Emit the current DOCTYPE token.
                        Some('>') => {
                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // ASCII upper alpha
                        // Append the lowercase version of the current input character (add 0x0020
                        // to the character's code point) to the current DOCTYPE token's name.
                        Some(c) if is_ascii_upper_alpha(c) => match &mut self.cur_token {
                            Some(Token::Doctype {
                                name: Some(name), ..
                            }) => {
                                let mut new_name = String::new();

                                new_name.push_str(name);
                                new_name.push(c.to_ascii_lowercase());

                                *name = new_name.into();
                            }
                            _ => {
                                unreachable!();
                            }
                        },
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Append a U+FFFD
                        // REPLACEMENT CHARACTER character to the current DOCTYPE token's name.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);

                            match &mut self.cur_token {
                                Some(Token::Doctype {
                                    name: Some(name), ..
                                }) => {
                                    let mut new_name = String::new();

                                    new_name.push_str(name);
                                    new_name.push(REPLACEMENT_CHARACTER);

                                    *name = new_name.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            }
                        }
                        // EOF
                        // This is an eof-in-doctype parse error. Set the current DOCTYPE token's
                        // force-quirks flag to on. Emit the current DOCTYPE token. Emit an
                        // end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInDoctype);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Append the current input character to the current DOCTYPE token's name.
                        Some(c) => match &mut self.cur_token {
                            Some(Token::Doctype {
                                name: Some(name), ..
                            }) => {
                                let mut new_name = String::new();

                                new_name.push_str(name);
                                new_name.push(c);

                                *name = new_name.into();
                            }
                            _ => {
                                unreachable!();
                            }
                        },
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#after-doctype-name-state
                State::AfterDoctypeName => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // Ignore the character.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {}
                        // U+003E GREATER-THAN SIGN (>)
                        // Switch to the data state. Emit the current DOCTYPE token.
                        Some('>') => {
                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // EOF
                        // This is an eof-in-doctype parse error. Set the current DOCTYPE token's
                        // force-quirks flag to on. Emit the current DOCTYPE token. Emit an
                        // end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInDoctype);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // If the six characters starting from the current input character are an
                        // ASCII case-insensitive match for the word "PUBLIC", then consume those
                        // characters and switch to the after DOCTYPE public keyword state.
                        //
                        // Otherwise, if the six characters starting from the current input
                        // character are an ASCII case-insensitive match for the word "SYSTEM", then
                        // consume those characters and switch to the after DOCTYPE system keyword
                        // state.
                        //
                        // Otherwise, this is an invalid-character-sequence-after-doctype-name parse
                        // error. Set the current DOCTYPE token's force-quirks flag to on. Reconsume
                        // in the bogus DOCTYPE state.
                        Some(c) => {
                            let cur_pos = self.input.cur_pos();
                            let mut first_six_chars = String::new();

                            first_six_chars.push(c);

                            for _ in 0..5 {
                                match self.consume_next_char() {
                                    Some(c) => {
                                        first_six_chars.push(c);
                                    }
                                    _ => {
                                        break;
                                    }
                                }
                            }

                            match &*first_six_chars.to_lowercase() {
                                "public" => {
                                    self.state = State::AfterDoctypePublicKeyword;
                                }
                                "system" => {
                                    self.state = State::AfterDoctypeSystemKeyword;
                                }
                                _ => {
                                    self.input.reset_to(cur_pos);

                                    self.emit_error(
                                        ErrorKind::InvalidCharacterSequenceAfterDoctypeName,
                                    );

                                    match &mut self.cur_token {
                                        Some(Token::Doctype { force_quirks, .. }) => {
                                            *force_quirks = true;
                                        }
                                        _ => {
                                            unreachable!();
                                        }
                                    }

                                    self.state = State::BogusDoctype;
                                    self.reconsume();
                                }
                            }
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#after-doctype-public-keyword-state
                State::AfterDoctypePublicKeyword => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // Switch to the before DOCTYPE public identifier state.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {
                            self.state = State::BeforeDoctypePublicIdentifier;
                        }
                        // U+0022 QUOTATION MARK (")
                        // This is a missing-whitespace-after-doctype-public-keyword parse error.
                        // Set the current DOCTYPE token's public identifier to the empty string
                        // (not missing), then switch to the DOCTYPE public identifier
                        // (double-quoted) state.
                        Some('"') => {
                            self.emit_error(ErrorKind::MissingWhitespaceAfterDoctypePublicKeyword);

                            match &mut self.cur_token {
                                Some(Token::Doctype { public_id, .. }) => {
                                    *public_id = Some("".into());
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::DoctypePublicIdentifierDoubleQuoted;
                        }
                        // U+0027 APOSTROPHE (')
                        // This is a missing-whitespace-after-doctype-public-keyword parse error.
                        // Set the current DOCTYPE token's public identifier to the empty string
                        // (not missing), then switch to the DOCTYPE public identifier
                        // (single-quoted) state.
                        Some('\'') => {
                            self.emit_error(ErrorKind::MissingWhitespaceAfterDoctypePublicKeyword);

                            match &mut self.cur_token {
                                Some(Token::Doctype { public_id, .. }) => {
                                    *public_id = Some("".into());
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::DoctypePublicIdentifierSingleQuoted;
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // This is a missing-doctype-public-identifier parse error. Set the current
                        // DOCTYPE token's force-quirks flag to on. Switch to the data state. Emit
                        // the current DOCTYPE token.
                        Some('>') => {
                            self.emit_error(ErrorKind::MissingDoctypePublicIdentifier);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // EOF
                        // This is an eof-in-doctype parse error. Set the current DOCTYPE token's
                        // force-quirks flag to on. Emit the current DOCTYPE token. Emit an
                        // end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInDoctype);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // This is a missing-quote-before-doctype-public-identifier parse error. Set
                        // the current DOCTYPE token's force-quirks flag to on. Reconsume in the
                        // bogus DOCTYPE state.
                        _ => {
                            self.emit_error(ErrorKind::MissingQuoteBeforeDoctypePublicIdentifier);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::BogusDoctype;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#before-doctype-public-identifier-state
                State::BeforeDoctypePublicIdentifier => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // Ignore the character.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {}
                        // U+0022 QUOTATION MARK (")
                        // Set the current DOCTYPE token's public identifier to the empty string
                        // (not missing), then switch to the DOCTYPE public identifier
                        // (double-quoted) state.
                        Some('"') => {
                            match &mut self.cur_token {
                                Some(Token::Doctype { public_id, .. }) => {
                                    *public_id = Some("".into());
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::DoctypePublicIdentifierDoubleQuoted;
                        }
                        // U+0027 APOSTROPHE (')
                        // Set the current DOCTYPE token's public identifier to the empty string
                        // (not missing), then switch to the DOCTYPE public identifier
                        // (single-quoted) state.
                        Some('\'') => {
                            match &mut self.cur_token {
                                Some(Token::Doctype { public_id, .. }) => {
                                    *public_id = Some("".into());
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::DoctypePublicIdentifierSingleQuoted;
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // This is a missing-doctype-public-identifier parse error. Set the current
                        // DOCTYPE token's force-quirks flag to on. Switch to the data state. Emit
                        // the current DOCTYPE token.
                        Some('>') => {
                            self.emit_error(ErrorKind::MissingDoctypePublicIdentifier);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::Data;

                            self.emit_cur_token();
                        }
                        // EOF
                        // This is an eof-in-doctype parse error. Set the current DOCTYPE token's
                        // force-quirks flag to on. Emit the current DOCTYPE token. Emit an
                        // end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInDoctype);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // This is a missing-quote-before-doctype-public-identifier parse error. Set
                        // the current DOCTYPE token's force-quirks flag to on. Reconsume in the
                        // bogus DOCTYPE state.
                        _ => {
                            self.emit_error(ErrorKind::MissingQuoteBeforeDoctypePublicIdentifier);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::BogusDoctype;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#doctype-public-identifier-(double-quoted)-state
                State::DoctypePublicIdentifierDoubleQuoted => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0022 QUOTATION MARK (")
                        // Switch to the after DOCTYPE public identifier state.
                        Some('"') => {
                            self.state = State::AfterDoctypePublicIdentifier;
                        }
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Append a U+FFFD
                        // REPLACEMENT CHARACTER character to the current DOCTYPE token's public
                        // identifier.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);

                            match &mut self.cur_token {
                                Some(Token::Doctype {
                                    public_id: Some(public_id),
                                    ..
                                }) => {
                                    let mut new_public_id = String::new();

                                    new_public_id.push_str(public_id);
                                    new_public_id.push(REPLACEMENT_CHARACTER);

                                    *public_id = new_public_id.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            }
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // This is an abrupt-doctype-public-identifier parse error. Set the current
                        // DOCTYPE token's force-quirks flag to on. Switch to the data state. Emit
                        // the current DOCTYPE token.
                        Some('>') => {
                            self.emit_error(ErrorKind::AbruptDoctypePublicIdentifier);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // EOF
                        // This is an eof-in-doctype parse error. Set the current DOCTYPE token's
                        // force-quirks flag to on. Emit the current DOCTYPE token. Emit an
                        // end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInDoctype);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Append the current input character to the current DOCTYPE token's public
                        // identifier.
                        Some(c) => match &mut self.cur_token {
                            Some(Token::Doctype {
                                public_id: Some(public_id),
                                ..
                            }) => {
                                let mut new_public_id = String::new();

                                new_public_id.push_str(public_id);
                                new_public_id.push(c);

                                *public_id = new_public_id.into();
                            }
                            _ => {
                                unreachable!();
                            }
                        },
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#doctype-public-identifier-(single-quoted)-state
                State::DoctypePublicIdentifierSingleQuoted => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0027 APOSTROPHE (')
                        // Switch to the after DOCTYPE public identifier state.
                        Some('\'') => {
                            self.state = State::AfterDoctypePublicIdentifier;
                        }
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Append a U+FFFD
                        // REPLACEMENT CHARACTER character to the current DOCTYPE token's public
                        // identifier.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);

                            match &mut self.cur_token {
                                Some(Token::Doctype {
                                    public_id: Some(public_id),
                                    ..
                                }) => {
                                    let mut new_public_id = String::new();

                                    new_public_id.push_str(public_id);
                                    new_public_id.push(REPLACEMENT_CHARACTER);

                                    *public_id = new_public_id.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            }
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // This is an abrupt-doctype-public-identifier parse error. Set the current
                        // DOCTYPE token's force-quirks flag to on. Switch to the data state. Emit
                        // the current DOCTYPE token.
                        Some('>') => {
                            self.emit_error(ErrorKind::AbruptDoctypePublicIdentifier);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // EOF
                        // This is an eof-in-doctype parse error. Set the current DOCTYPE token's
                        // force-quirks flag to on. Emit the current DOCTYPE token. Emit an
                        // end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInDoctype);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Append the current input character to the current DOCTYPE token's public
                        // identifier.
                        Some(c) => match &mut self.cur_token {
                            Some(Token::Doctype {
                                public_id: Some(public_id),
                                ..
                            }) => {
                                let mut new_public_id = String::new();

                                new_public_id.push_str(public_id);
                                new_public_id.push(c);

                                *public_id = new_public_id.into();
                            }
                            _ => {
                                unreachable!();
                            }
                        },
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#after-doctype-public-identifier-state
                State::AfterDoctypePublicIdentifier => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // Switch to the between DOCTYPE public and system identifiers state.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {
                            self.state = State::BetweenDoctypePublicAndSystemIdentifiers;
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // Switch to the data state. Emit the current DOCTYPE token.
                        Some('>') => {
                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // U+0022 QUOTATION MARK (")
                        // This is a missing-whitespace-between-doctype-public-and-system-identifiers parse error.
                        // Set the current DOCTYPE token's system identifier to the empty string
                        // (not missing), then switch to the DOCTYPE system identifier
                        // (double-quoted) state.
                        Some('"') => {
                            self.emit_error(ErrorKind::MissingWhitespaceBetweenDoctypePublicAndSystemIdentifiers);

                            match &mut self.cur_token {
                                Some(Token::Doctype { system_id, .. }) => {
                                    *system_id = Some("".into());
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::DoctypeSystemIdentifierDoubleQuoted;
                        }
                        // U+0027 APOSTROPHE (')
                        // This is a missing-whitespace-between-doctype-public-and-system-identifiers parse error.
                        // Set the current DOCTYPE token's system identifier to the empty string
                        // (not missing), then switch to the DOCTYPE system identifier
                        // (single-quoted) state.
                        Some('\'') => {
                            self.emit_error(ErrorKind::MissingWhitespaceBetweenDoctypePublicAndSystemIdentifiers);

                            match &mut self.cur_token {
                                Some(Token::Doctype { system_id, .. }) => {
                                    *system_id = Some("".into());
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::DoctypeSystemIdentifierSingleQuoted;
                        }
                        // EOF
                        // This is an eof-in-doctype parse error. Set the current DOCTYPE token's
                        // force-quirks flag to on. Emit the current DOCTYPE token. Emit an
                        // end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInDoctype);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // This is a missing-quote-before-doctype-system-identifier parse error. Set
                        // the current DOCTYPE token's force-quirks flag to on. Reconsume in the
                        // bogus DOCTYPE state.
                        _ => {
                            self.emit_error(ErrorKind::MissingQuoteBeforeDoctypeSystemIdentifier);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::BogusDoctype;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#between-doctype-public-and-system-identifiers-state
                State::BetweenDoctypePublicAndSystemIdentifiers => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // Ignore the character.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {}
                        // U+003E GREATER-THAN SIGN (>)
                        // Switch to the data state. Emit the current DOCTYPE token.
                        Some('>') => {
                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // U+0022 QUOTATION MARK (")
                        // Set the current DOCTYPE token's system identifier to the empty string
                        // (not missing), then switch to the DOCTYPE system identifier
                        // (double-quoted) state.
                        Some('"') => {
                            match &mut self.cur_token {
                                Some(Token::Doctype { system_id, .. }) => {
                                    *system_id = Some("".into());
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::DoctypeSystemIdentifierDoubleQuoted;
                        }
                        // U+0027 APOSTROPHE (')
                        // Set the current DOCTYPE token's system identifier to the empty string
                        // (not missing), then switch to the DOCTYPE system identifier
                        // (single-quoted) state.
                        Some('\'') => {
                            match &mut self.cur_token {
                                Some(Token::Doctype { system_id, .. }) => {
                                    *system_id = Some("".into());
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::DoctypeSystemIdentifierSingleQuoted;
                        }
                        // EOF
                        // This is an eof-in-doctype parse error. Set the current DOCTYPE token's
                        // force-quirks flag to on. Emit the current DOCTYPE token. Emit an
                        // end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInDoctype);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // This is a missing-quote-before-doctype-system-identifier parse error. Set
                        // the current DOCTYPE token's force-quirks flag to on. Reconsume in the
                        // bogus DOCTYPE state
                        _ => {
                            self.emit_error(ErrorKind::MissingQuoteBeforeDoctypeSystemIdentifier);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::BogusComment;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#after-doctype-system-keyword-state
                State::AfterDoctypeSystemKeyword => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // Switch to the before DOCTYPE system identifier state.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {
                            self.state = State::BeforeDoctypeSystemIdentifier;
                        }
                        // U+0022 QUOTATION MARK (")
                        // This is a missing-whitespace-after-doctype-system-keyword parse error.
                        // Set the current DOCTYPE token's system identifier to the empty string
                        // (not missing), then switch to the DOCTYPE system identifier
                        // (double-quoted) state.
                        Some('"') => {
                            self.emit_error(ErrorKind::MissingWhitespaceAfterDoctypeSystemKeyword);

                            match &mut self.cur_token {
                                Some(Token::Doctype { system_id, .. }) => {
                                    *system_id = Some("".into());
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::DoctypeSystemIdentifierDoubleQuoted;
                        }
                        // U+0027 APOSTROPHE (')
                        // This is a missing-whitespace-after-doctype-system-keyword parse error.
                        // Set the current DOCTYPE token's system identifier to the empty string
                        // (not missing), then switch to the DOCTYPE system identifier
                        // (single-quoted) state.
                        Some('\'') => {
                            self.emit_error(ErrorKind::MissingWhitespaceAfterDoctypeSystemKeyword);

                            match &mut self.cur_token {
                                Some(Token::Doctype { system_id, .. }) => {
                                    *system_id = Some("".into());
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::DoctypeSystemIdentifierSingleQuoted;
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // This is a missing-doctype-system-identifier parse error. Set the current
                        // DOCTYPE token's force-quirks flag to on. Switch to the data state. Emit
                        // the current DOCTYPE token.
                        Some('>') => {
                            self.emit_error(ErrorKind::MissingDoctypeSystemIdentifier);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // EOF
                        // This is an eof-in-doctype parse error. Set the current DOCTYPE token's
                        // force-quirks flag to on. Emit the current DOCTYPE token. Emit an
                        // end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInDoctype);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // This is a missing-quote-before-doctype-system-identifier parse error. Set
                        // the current DOCTYPE token's force-quirks flag to on. Reconsume in the
                        // bogus DOCTYPE state.
                        _ => {
                            self.emit_error(ErrorKind::MissingQuoteBeforeDoctypeSystemIdentifier);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::BogusComment;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#before-doctype-system-identifier-state
                State::BeforeDoctypeSystemIdentifier => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // Ignore the character.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {}
                        // U+0022 QUOTATION MARK (")
                        // Set the current DOCTYPE token's system identifier to the empty string
                        // (not missing), then switch to the DOCTYPE system identifier
                        // (double-quoted) state.
                        Some('"') => match &mut self.cur_token {
                            Some(Token::Doctype { system_id, .. }) => {
                                *system_id = Some("".into());
                            }
                            _ => {
                                unreachable!();
                            }
                        },
                        // U+0027 APOSTROPHE (')
                        // Set the current DOCTYPE token's system identifier to the empty string
                        // (not missing), then switch to the DOCTYPE system identifier
                        // (single-quoted) state.
                        Some('\'') => match &mut self.cur_token {
                            Some(Token::Doctype { system_id, .. }) => {
                                *system_id = Some("".into());
                            }
                            _ => {
                                unreachable!();
                            }
                        },
                        // U+003E GREATER-THAN SIGN (>)
                        // This is a missing-doctype-system-identifier parse error. Set the current
                        // DOCTYPE token's force-quirks flag to on. Switch to the data state. Emit
                        // the current DOCTYPE token.
                        Some('>') => {
                            self.emit_error(ErrorKind::EofInDoctype);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // EOF
                        // This is an eof-in-doctype parse error. Set the current DOCTYPE token's
                        // force-quirks flag to on. Emit the current DOCTYPE token. Emit an
                        // end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInDoctype);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // This is a missing-quote-before-doctype-system-identifier parse error. Set
                        // the current DOCTYPE token's force-quirks flag to on. Reconsume in the
                        // bogus DOCTYPE state.
                        _ => {
                            self.emit_error(ErrorKind::MissingQuoteBeforeDoctypeSystemIdentifier);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::BogusDoctype;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#doctype-system-identifier-(double-quoted)-state
                State::DoctypeSystemIdentifierDoubleQuoted => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0027 APOSTROPHE (')
                        // Switch to the after DOCTYPE system identifier state.
                        Some('"') => {
                            self.state = State::AfterDoctypeSystemIdentifier;
                        }
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Append a U+FFFD
                        // REPLACEMENT CHARACTER character to the current DOCTYPE token's system
                        // identifier.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);

                            match &mut self.cur_token {
                                Some(Token::Doctype {
                                    system_id: Some(system_id),
                                    ..
                                }) => {
                                    let mut new_system_id = String::new();

                                    new_system_id.push_str(system_id);
                                    new_system_id.push(REPLACEMENT_CHARACTER);

                                    *system_id = new_system_id.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            }
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // This is an abrupt-doctype-system-identifier parse error. Set the current
                        // DOCTYPE token's force-quirks flag to on. Switch to the data state. Emit
                        // the current DOCTYPE token.
                        Some('>') => {
                            self.emit_error(ErrorKind::AbruptDoctypeSystemIdentifier);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // EOF
                        // This is an eof-in-doctype parse error. Set the current DOCTYPE token's
                        // force-quirks flag to on. Emit the current DOCTYPE token. Emit an
                        // end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInDoctype);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Append the current input character to the current DOCTYPE token's system
                        // identifier.
                        Some(c) => match &mut self.cur_token {
                            Some(Token::Doctype {
                                system_id: Some(system_id),
                                ..
                            }) => {
                                let mut new_system_id = String::new();

                                new_system_id.push_str(system_id);
                                new_system_id.push(c);

                                *system_id = new_system_id.into();
                            }
                            _ => {
                                unreachable!();
                            }
                        },
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#doctype-system-identifier-(single-quoted)-state
                State::DoctypeSystemIdentifierSingleQuoted => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0027 APOSTROPHE (')
                        // Switch to the after DOCTYPE system identifier state.
                        Some('\'') => {
                            self.state = State::AfterDoctypeSystemIdentifier;
                        }
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Append a U+FFFD
                        // REPLACEMENT CHARACTER character to the current DOCTYPE token's system
                        // identifier.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);

                            match &mut self.cur_token {
                                Some(Token::Doctype {
                                    system_id: Some(system_id),
                                    ..
                                }) => {
                                    let mut new_system_id = String::new();

                                    new_system_id.push_str(system_id);
                                    new_system_id.push(REPLACEMENT_CHARACTER);

                                    *system_id = new_system_id.into();
                                }
                                _ => {
                                    unreachable!();
                                }
                            }
                        }
                        // U+003E GREATER-THAN SIGN (>)
                        // This is an abrupt-doctype-system-identifier parse error. Set the current
                        // DOCTYPE token's force-quirks flag to on. Switch to the data state. Emit
                        // the current DOCTYPE token.
                        Some('>') => {
                            self.emit_error(ErrorKind::AbruptDoctypeSystemIdentifier);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // EOF
                        // This is an eof-in-doctype parse error. Set the current DOCTYPE token's
                        // force-quirks flag to on. Emit the current DOCTYPE token. Emit an
                        // end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInDoctype);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Append the current input character to the current DOCTYPE token's system
                        // identifier.
                        Some(c) => match &mut self.cur_token {
                            Some(Token::Doctype {
                                system_id: Some(system_id),
                                ..
                            }) => {
                                let mut new_system_id = String::new();

                                new_system_id.push_str(system_id);
                                new_system_id.push(c);

                                *system_id = new_system_id.into();
                            }
                            _ => {
                                unreachable!();
                            }
                        },
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#after-doctype-system-identifier-state
                State::AfterDoctypeSystemIdentifier => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0009 CHARACTER TABULATION (tab)
                        // U+000A LINE FEED (LF)
                        // U+000C FORM FEED (FF)
                        // U+0020 SPACE
                        // Ignore the character.
                        Some('\x09' | '\x0a' | '\x0c' | '\x20') => {}
                        // U+003E GREATER-THAN SIGN (>)
                        // Switch to the data state. Emit the current DOCTYPE token.
                        Some('>') => {
                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // EOF
                        // This is an eof-in-doctype parse error. Set the current DOCTYPE token's
                        // force-quirks flag to on. Emit the current DOCTYPE token. Emit an
                        // end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInDoctype);

                            match &mut self.cur_token {
                                Some(Token::Doctype { force_quirks, .. }) => {
                                    *force_quirks = true;
                                }
                                _ => {
                                    unreachable!();
                                }
                            }

                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // This is an unexpected-character-after-doctype-system-identifier parse
                        // error. Reconsume in the bogus DOCTYPE state. (This does not set the
                        // current DOCTYPE token's force-quirks flag to on.)
                        _ => {
                            self.emit_error(
                                ErrorKind::UnexpectedCharacterAfterDoctypeSystemIdentifier,
                            );

                            self.state = State::BogusDoctype;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#bogus-doctype-state
                State::BogusDoctype => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+003E GREATER-THAN SIGN (>)
                        // Switch to the data state. Emit the DOCTYPE token.
                        Some('>') => {
                            self.state = State::Data;
                            self.emit_cur_token();
                        }
                        // U+0000 NULL
                        // This is an unexpected-null-character parse error. Ignore the character.
                        Some('\x00') => {
                            self.emit_error(ErrorKind::UnexpectedNullCharacter);
                        }
                        // EOF
                        // Emit the DOCTYPE token. Emit an end-of-file token.
                        None => {
                            self.emit_cur_token();
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Ignore the character.
                        _ => {}
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#cdata-section-state
                State::CdataSection => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+005D RIGHT SQUARE BRACKET (])
                        // Switch to the CDATA section bracket state.
                        Some(']') => {
                            self.state = State::CdataSectionBracket;
                        }
                        // EOF
                        // This is an eof-in-cdata parse error. Emit an end-of-file token.
                        None => {
                            self.emit_error(ErrorKind::EofInCdata);
                            self.emit_token(Token::Eof);
                        }
                        // Anything else
                        // Emit the current input character as a character token.
                        Some(c) => {
                            self.emit_token(Token::Character { value: c });
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#cdata-section-bracket-state
                State::CdataSectionBracket => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+005D RIGHT SQUARE BRACKET (])
                        // Switch to the CDATA section end state.
                        Some(']') => {
                            self.state = State::CdataSectionEnd;
                        }
                        // Anything else
                        // Emit a U+005D RIGHT SQUARE BRACKET character token. Reconsume in the
                        // CDATA section state.
                        _ => {
                            self.emit_token(Token::Character { value: ']' });
                            self.state = State::CdataSection;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#cdata-section-end-state
                State::CdataSectionEnd => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+005D RIGHT SQUARE BRACKET (])
                        // Emit a U+005D RIGHT SQUARE BRACKET character token.
                        Some(c @ ']') => {
                            self.emit_token(Token::Character { value: c });
                        }
                        // U+003E GREATER-THAN SIGN character
                        // Switch to the data state.
                        Some('>') => {
                            self.state = State::Data;
                        }
                        // Anything else
                        // Emit two U+005D RIGHT SQUARE BRACKET character tokens. Reconsume in the
                        // CDATA section state.
                        _ => {
                            self.emit_token(Token::Character { value: ']' });
                            self.state = State::CdataSection;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#character-reference-state
                State::CharacterReference => {
                    // Set the temporary buffer to the empty string. Append a U+0026 AMPERSAND (&)
                    // character to the temporary buffer.
                    self.temporary_buffer = Some("&".into());

                    // Consume the next input character:
                    match self.consume_next_char() {
                        // ASCII alphanumeric
                        // Reconsume in the named character reference state.
                        Some(c) if c.is_ascii_alphanumeric() => {
                            self.state = State::NamedCharacterReference;
                            self.reconsume();
                        }
                        // U+0023 NUMBER SIGN (#)
                        // Append the current input character to the temporary buffer. Switch to the
                        // numeric character reference state.
                        Some(c @ '#') => {
                            if let Some(ref mut temporary_buffer) = self.temporary_buffer {
                                temporary_buffer.push(c);
                            }

                            self.state = State::NumericCharacterReference;
                        }
                        // Anything else
                        // Flush code points consumed as a character reference. Reconsume in the
                        // return state.
                        _ => {
                            // TODO fix me

                            self.state = self.return_state.clone();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#named-character-reference-state
                State::NamedCharacterReference => {
                    // TODO fix me
                    let is_matched = true;

                    // If there is a match
                    match is_matched {
                        true => {
                            // If the character reference was consumed as part of an attribute, and
                            // the last character matched is not a
                            // U+003B SEMICOLON character (;), and the next input
                            // character is either a U+003D EQUALS SIGN character (=) or an ASCII
                            // alphanumeric, then, for historical reasons, flush code points
                            // consumed as a character reference and
                            // switch to the return state.
                            if self.is_consumed_as_part_of_an_attribute() {
                                self.state = self.return_state.clone();
                            }
                            // Otherwise:
                            //
                            // If the last character matched is not a U+003B SEMICOLON character
                            // (;), then this is a missing-semicolon-after-character-reference parse
                            // error.
                            //
                            // Set the temporary buffer to the empty string. Append one or two
                            // characters corresponding to the character reference name (as given by
                            // the second column of the named character references table) to the
                            // temporary buffer.
                            //
                            // Flush code points consumed as a character reference. Switch to the
                            // return state.
                            else {
                                // TODO fix me
                                let is_last_semicolon = false;

                                if is_last_semicolon {
                                    self.emit_error(
                                        ErrorKind::MissingSemicolonAfterCharacterReference,
                                    );
                                }

                                self.temporary_buffer = Some("".into());

                                // TODO fix me

                                self.state = self.return_state.clone();
                            }
                        }
                        // Otherwise
                        // Flush code points consumed as a character reference. Switch to the
                        // ambiguous ampersand state.
                        false => {
                            self.state = State::AmbiguousAmpersand;
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#ambiguous-ampersand-state
                State::AmbiguousAmpersand => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // ASCII alphanumeric
                        // If the character reference was consumed as part of an attribute, then
                        // append the current input character to the current attribute's value.
                        // Otherwise, emit the current input character as a character token.
                        Some(c) if c.is_ascii_alphanumeric() => {
                            if self.is_consumed_as_part_of_an_attribute() {
                                if let Some(ref mut token) = self.cur_token {
                                    match token {
                                        Token::StartTag { attributes, .. }
                                        | Token::EndTag { attributes, .. } => {
                                            if let Some(attribute) = attributes.last_mut() {
                                                let mut new_value = String::new();

                                                new_value.push_str(&attribute.value);
                                                new_value.push(c);

                                                attribute.value = new_value.into();
                                            }
                                        }
                                        _ => {}
                                    }
                                }
                            } else {
                                self.emit_token(Token::Character { value: c });
                            }
                        }
                        // U+003B SEMICOLON (;)
                        // This is an unknown-named-character-reference parse error. Reconsume in
                        // the return state.
                        Some(';') => {
                            self.emit_error(ErrorKind::UnknownNamedCharacterReference);
                            self.state = self.return_state.clone();
                            self.reconsume();
                        }
                        // Anything else
                        // Reconsume in the return state.
                        _ => {
                            self.state = self.return_state.clone();
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#numeric-character-reference-state
                State::NumericCharacterReference => {
                    self.character_reference_code = Some(0);

                    // Consume the next input character:
                    match self.consume_next_char() {
                        // U+0078 LATIN SMALL LETTER X
                        // U+0058 LATIN CAPITAL LETTER X
                        // Append the current input character to the temporary buffer. Switch to the
                        // hexadecimal character reference start state.
                        Some(c @ 'x' | c @ 'X') => {
                            if let Some(ref mut temporary_buffer) = self.temporary_buffer {
                                temporary_buffer.push(c);
                            }

                            self.state = State::HexademicalCharacterReferenceStart;
                        }
                        // Anything else
                        // Reconsume in the decimal character reference start state.
                        _ => {
                            self.state = State::DecimalCharacterReferenceStart;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#hexadecimal-character-reference-start-state
                State::HexademicalCharacterReferenceStart => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // ASCII hex digit
                        // Reconsume in the hexadecimal character reference state.
                        Some(c) if c.is_ascii_hexdigit() => {
                            self.state = State::HexademicalCharacterReference;
                            self.reconsume();
                        }
                        // Anything else
                        // This is an absence-of-digits-in-numeric-character-reference parse error.
                        // Flush code points consumed as a character reference. Reconsume in the
                        // return state.
                        _ => {
                            self.emit_error(ErrorKind::AbsenceOfDigitsInNumericCharacterReference);

                            // TODO fix me

                            self.state = self.return_state.clone();
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#decimal-character-reference-start-state
                State::DecimalCharacterReferenceStart => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // ASCII digit
                        // Reconsume in the decimal character reference state.
                        Some(c) if c.is_ascii_digit() => {
                            self.state = State::DecimalCharacterReference;
                            self.reconsume();
                        }
                        // Anything else
                        // This is an absence-of-digits-in-numeric-character-reference parse error.
                        // Flush code points consumed as a character reference. Reconsume in the
                        // return state.
                        _ => {
                            self.emit_error(ErrorKind::AbsenceOfDigitsInNumericCharacterReference);

                            // TODO fix me

                            self.state = self.return_state.clone();
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#hexadecimal-character-reference-state
                State::HexademicalCharacterReference => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // ASCII digit
                        // Multiply the character reference code by 16. Add a numeric version of the
                        // current input character (subtract 0x0030 from the character's code point)
                        // to the character reference code.
                        Some(c) if c.is_ascii_digit() => match self.character_reference_code {
                            Some(character_reference_code) => {
                                self.character_reference_code =
                                    Some(character_reference_code * 16 + (c as u32 - 0x30));
                            }
                            _ => {
                                unreachable!();
                            }
                        },
                        // ASCII upper hex digit
                        // Multiply the character reference code by 16. Add a numeric version of the
                        // current input character as a hexadecimal digit (subtract 0x0037 from the
                        // character's code point) to the character reference code.
                        Some(c) if is_upper_hex_digit(c) => match self.character_reference_code {
                            Some(character_reference_code) => {
                                self.character_reference_code =
                                    Some(character_reference_code * 16 + (c as u32 - 0x37));
                            }
                            _ => {
                                unreachable!();
                            }
                        },
                        // ASCII lower hex digit
                        // Multiply the character reference code by 16. Add a numeric version of the
                        // current input character as a hexadecimal digit (subtract 0x0057 from the
                        // character's code point) to the character reference code.
                        Some(c) if is_lower_hex_digit(c) => match self.character_reference_code {
                            Some(character_reference_code) => {
                                self.character_reference_code =
                                    Some(character_reference_code * 16 + (c as u32 - 0x57));
                            }
                            _ => {
                                unreachable!();
                            }
                        },
                        // U+003B SEMICOLON
                        // Switch to the numeric character reference end state.
                        Some(';') => {
                            self.state = State::NumericCharacterReferenceEnd;
                        }
                        // Anything else
                        // This is a missing-semicolon-after-character-reference parse error.
                        // Reconsume in the numeric character reference end state.
                        _ => {
                            self.emit_error(ErrorKind::MissingSemicolonAfterCharacterReference);
                            self.state = State::NumericCharacterReferenceEnd;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#decimal-character-reference-state
                State::DecimalCharacterReference => {
                    // Consume the next input character:
                    match self.consume_next_char() {
                        // ASCII digit
                        // Multiply the character reference code by 10. Add a numeric version of the
                        // current input character (subtract 0x0030 from the character's code point)
                        // to the character reference code.
                        Some(c) if c.is_ascii_digit() => match self.character_reference_code {
                            Some(character_reference_code) => {
                                self.character_reference_code =
                                    Some(character_reference_code * 10 + (c as u32 - 0x30));
                            }
                            _ => {
                                unreachable!();
                            }
                        },
                        // U+003B SEMICOLON
                        // Switch to the numeric character reference end state.
                        Some(';') => self.state = State::NumericCharacterReferenceEnd,
                        // Anything else
                        // This is a missing-semicolon-after-character-reference parse error.
                        // Reconsume in the numeric character reference end state.
                        _ => {
                            self.emit_error(ErrorKind::MissingSemicolonAfterCharacterReference);
                            self.state = State::NumericCharacterReferenceEnd;
                            self.reconsume();
                        }
                    }
                }
                // https://html.spec.whatwg.org/multipage/parsing.html#numeric-character-reference-end-state
                State::NumericCharacterReferenceEnd => {
                    // Check the character reference code:
                    match self.character_reference_code {
                        // If the number is 0x00, then this is a null-character-reference parse
                        // error. Set the character reference code to 0xFFFD.
                        Some(0) => {
                            self.emit_error(ErrorKind::NullCharacterReference);

                            self.character_reference_code = Some('\u{FFFD}' as u32);
                        }
                        // If the number is greater than 0x10FFFF, then this is a
                        // character-reference-outside-unicode-range parse error. Set the character
                        // reference code to 0xFFFD.
                        Some(c) if c > '\u{10FFFF}' as u32 => {
                            self.emit_error(ErrorKind::CharacterReferenceOutsideUnicodeRange);

                            self.character_reference_code = Some('\u{FFFD}' as u32);
                        }
                        // TODO fix me
                        // If the number is a surrogate, then this is a
                        // surrogate-character-reference parse error. Set the character reference
                        // code to 0xFFFD.
                        // If the number is a noncharacter, then this is a
                        // noncharacter-character-reference parse error.
                        Some(c) if is_noncharacter(c) => {
                            self.emit_error(ErrorKind::NoncharacterCharacterReference);
                        }
                        // TODO fix me
                        // If the number is 0x0D, or a control that's not ASCII whitespace, then
                        // this is a control-character-reference parse error. If the number is one
                        // of the numbers in the first column of the following table, then find the
                        // row with that number in the first column, and set the character reference
                        // code to the number in the second column of that row.
                        _ => {}
                    }
                }
            }
        }
    }
}

// A noncharacter is a code point that is in the range U+FDD0 to U+FDEF,
// inclusive, or U+FFFE, U+FFFF, U+1FFFE, U+1FFFF, U+2FFFE, U+2FFFF, U+3FFFE,
// U+3FFFF, U+4FFFE, U+4FFFF, U+5FFFE, U+5FFFF, U+6FFFE, U+6FFFF, U+7FFFE,
// U+7FFFF, U+8FFFE, U+8FFFF, U+9FFFE, U+9FFFF, U+AFFFE, U+AFFFF, U+BFFFE,
// U+BFFFF, U+CFFFE, U+CFFFF, U+DFFFE, U+DFFFF, U+EFFFE, U+EFFFF, U+FFFFE,
// U+FFFFF, U+10FFFE, or U+10FFFF.
fn is_noncharacter(c: u32) -> bool {
    let c = char::from_u32(c);

    matches!(
        c,
        Some(
            '\u{FDD0}'
                ..='\u{FDEF}'
                    | '\u{FFFE}'
                    | '\u{FFFF}'
                    | '\u{1FFFF}'
                    | '\u{2FFFE}'
                    | '\u{2FFFF}'
                    | '\u{3FFFE}'
                    | '\u{3FFFF}'
                    | '\u{4FFFE}'
                    | '\u{4FFFF}'
                    | '\u{5FFFE}'
                    | '\u{5FFFF}'
                    | '\u{6FFFE}'
                    | '\u{6FFFF}'
                    | '\u{7FFFE}'
                    | '\u{7FFFF}'
                    | '\u{8FFFE}'
                    | '\u{8FFFF}'
                    | '\u{9FFFE}'
                    | '\u{9FFFF}'
                    | '\u{AFFFE}'
                    | '\u{AFFFF}'
                    | '\u{BFFFE}'
                    | '\u{BFFFF}'
                    | '\u{CFFFE}'
                    | '\u{CFFFF}'
                    | '\u{DFFFE}'
                    | '\u{DFFFF}'
                    | '\u{EFFFE}'
                    | '\u{EFFFF}'
                    | '\u{FFFFE}'
                    | '\u{FFFFF}'
                    | '\u{10FFFE}'
                    | '\u{10FFFF}',
        )
    )
}

#[inline(always)]
fn is_upper_hex_digit(c: char) -> bool {
    matches!(c, '0'..='9' | 'A'..='Z')
}

#[inline(always)]
fn is_lower_hex_digit(c: char) -> bool {
    matches!(c, '0'..='9' | 'a'..='z')
}

#[inline(always)]
fn is_ascii_upper_alpha(c: char) -> bool {
    matches!(c, 'A'..='Z')
}

#[inline(always)]
fn is_ascii_lower_alpha(c: char) -> bool {
    matches!(c, 'a'..='z')
}

#[inline(always)]
fn is_ascii_alpha(c: char) -> bool {
    is_ascii_upper_alpha(c) || is_ascii_lower_alpha(c)
}
