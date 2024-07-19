use std::{collections::VecDeque, mem::take};

use swc_atoms::JsWord;
use swc_common::{collections::AHashSet, input::Input, BytePos, Span};
use swc_xml_ast::{AttributeToken, Token, TokenAndSpan};

use crate::{
    error::{Error, ErrorKind},
    parser::input::ParserInput,
};

#[derive(Debug, Clone)]
pub enum State {
    Data,
    CharacterReferenceInData,
    Pi,
    PiTarget,
    PiTargetQuestion,
    PiTargetAfter,
    PiData,
    PiEnd,
    MarkupDeclaration,
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
    Cdata,
    CdataBracket,
    CdataEnd,
    TagOpen,
    EndTagOpen,
    TagName,
    EmptyTag,
    TagAttributeNameBefore,
    TagAttributeName,
    TagAttributeNameAfter,
    TagAttributeValueBefore,
    TagAttributeValueDoubleQuoted,
    TagAttributeValueSingleQuoted,
    TagAttributeValueUnquoted,
    TagAttributeValueAfter,
    CharacterReferenceInAttributeValue,
    BogusComment,
    Doctype,
    BeforeDoctypeName,
    DoctypeName,
    AfterDoctypeName,
    AfterDoctypePublicKeyword,
    AfterDoctypeSystemKeyword,
    BeforeDoctypeSystemIdentifier,
    BeforeDoctypePublicIdentifier,
    DoctypePublicIdentifierSingleQuoted,
    DoctypePublicIdentifierDoubleQuoted,
    AfterDoctypePublicIdentifier,
    BetweenDoctypePublicAndSystemIdentifiers,
    DoctypeSystemIdentifierSingleQuoted,
    DoctypeSystemIdentifierDoubleQuoted,
    AfterDoctypeSystemIdentifier,
    DoctypeTypeInternalSubSet,
    BogusDoctype,
}

// TODO implement `raw` for all tokens

#[derive(PartialEq, Eq, Clone, Debug)]
struct Doctype {
    name: Option<String>,
    public_id: Option<String>,
    system_id: Option<String>,
}

#[derive(PartialEq, Eq, Hash, Copy, Clone, Debug)]
enum TagKind {
    Start,
    End,
    Empty,
}

#[derive(PartialEq, Eq, Clone, Debug)]
struct Tag {
    kind: TagKind,
    tag_name: String,
    attributes: Vec<Attribute>,
}

#[derive(PartialEq, Eq, Clone, Debug)]
struct Attribute {
    span: Span,
    name: String,
    raw_name: Option<String>,
    value: Option<String>,
    raw_value: Option<String>,
}

#[derive(PartialEq, Eq, Clone, Debug)]
struct Comment {
    data: String,
    raw: String,
}

#[derive(PartialEq, Eq, Clone, Debug)]
struct ProcessingInstruction {
    target: String,
    data: String,
}

#[derive(PartialEq, Eq, Clone, Debug)]
struct Cdata {
    data: String,
    raw: String,
}

pub(crate) type LexResult<T> = Result<T, ErrorKind>;

pub struct Lexer<I>
where
    I: Input,
{
    input: I,
    cur: Option<char>,
    cur_pos: BytePos,
    last_token_pos: BytePos,
    finished: bool,
    state: State,
    return_state: Option<State>,
    errors: Vec<Error>,
    additional_allowed_character: Option<char>,
    pending_tokens: VecDeque<TokenAndSpan>,
    doctype_raw: Option<String>,
    current_doctype_token: Option<Doctype>,
    current_comment_token: Option<Comment>,
    current_processing_instruction: Option<ProcessingInstruction>,
    current_tag_token: Option<Tag>,
    current_cdata_token: Option<Cdata>,
    attribute_start_position: Option<BytePos>,
}

impl<I> Lexer<I>
where
    I: Input,
{
    pub fn new(input: I) -> Self {
        let start_pos = input.last_pos();

        let mut lexer = Lexer {
            input,
            cur: None,
            cur_pos: start_pos,
            last_token_pos: start_pos,
            finished: false,
            state: State::Data,
            return_state: None,
            errors: Vec::new(),
            additional_allowed_character: None,
            pending_tokens: VecDeque::new(),
            doctype_raw: None,
            current_doctype_token: None,
            current_comment_token: None,
            current_processing_instruction: None,
            current_tag_token: None,
            current_cdata_token: None,
            attribute_start_position: None,
        };

        // A leading Byte Order Mark (BOM) causes the character encoding argument to be
        // ignored and will itself be skipped.
        if lexer.input.is_at_start() && lexer.input.cur() == Some('\u{feff}') {
            unsafe {
                // Safety: cur() is Some('\u{feff}')
                lexer.input.bump();
            }
        }

        lexer
    }
}

impl<I: Input> Iterator for Lexer<I> {
    type Item = TokenAndSpan;

    fn next(&mut self) -> Option<Self::Item> {
        let token_and_span = self.read_token_and_span();

        match token_and_span {
            Ok(token_and_span) => {
                return Some(token_and_span);
            }
            Err(..) => {
                return None;
            }
        }
    }
}

impl<I> ParserInput for Lexer<I>
where
    I: Input,
{
    fn start_pos(&mut self) -> swc_common::BytePos {
        self.input.cur_pos()
    }

    fn last_pos(&mut self) -> swc_common::BytePos {
        self.input.last_pos()
    }

    fn take_errors(&mut self) -> Vec<Error> {
        take(&mut self.errors)
    }
}

impl<I> Lexer<I>
where
    I: Input,
{
    #[inline(always)]
    fn next(&mut self) -> Option<char> {
        self.input.cur()
    }

    // Any occurrences of surrogates are surrogate-in-input-stream parse errors. Any
    // occurrences of noncharacters are noncharacter-in-input-stream parse errors
    // and any occurrences of controls other than ASCII whitespace and U+0000 NULL
    // characters are control-character-in-input-stream parse errors.
    //
    // Postpone validation for each character for perf reasons and do it in
    // `anything else`
    #[inline(always)]
    fn validate_input_stream_character(&mut self, c: char) {
        let code = c as u32;

        if (0xd800..=0xdfff).contains(&code) {
            self.emit_error(ErrorKind::SurrogateInInputStream);
        } else if code != 0x00 && is_control(code) {
            self.emit_error(ErrorKind::ControlCharacterInInputStream);
        } else if is_noncharacter(code) {
            self.emit_error(ErrorKind::NoncharacterInInputStream);
        }
    }

    #[inline(always)]
    fn consume(&mut self) {
        self.cur = self.input.cur();
        self.cur_pos = self.input.cur_pos();

        if self.cur.is_some() {
            unsafe {
                // Safety: cur() is Some(c)
                self.input.bump();
            }
        }
    }

    #[inline(always)]
    fn reconsume(&mut self) {
        unsafe {
            // Safety: We got cur_pos from self.input
            self.input.reset_to(self.cur_pos);
        }
    }

    #[inline(always)]
    fn reconsume_in_state(&mut self, state: State) {
        self.state = state;
        self.reconsume();
    }

    #[inline(always)]
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

    #[cold]
    fn emit_error(&mut self, kind: ErrorKind) {
        self.errors.push(Error::new(
            Span::new(self.cur_pos, self.input.cur_pos()),
            kind,
        ));
    }

    #[inline(always)]
    fn emit_token(&mut self, token: Token) {
        let cur_pos = self.input.cur_pos();

        let span = Span::new(self.last_token_pos, cur_pos);

        self.last_token_pos = cur_pos;
        self.pending_tokens.push_back(TokenAndSpan { span, token });
    }

    fn consume_character_reference(&mut self) -> Option<(char, String)> {
        let cur_pos = self.input.cur_pos();
        let anything_else = |lexer: &mut Lexer<I>| {
            lexer.emit_error(ErrorKind::InvalidEntityCharacter);
            lexer.cur_pos = cur_pos;
            unsafe {
                // Safety: We got cur_post from self.input
                lexer.input.reset_to(cur_pos);
            }
        };

        // This section defines how to consume a character reference, optionally with an
        // additional allowed character, which, if specified where the algorithm is
        // invoked, adds a character to the list of characters that cause there to not
        // be a character reference.
        //
        // This definition is used when parsing character in text and in attributes.
        //
        // The behavior depends on identity of next character (the one immediately after
        // the U+0026 AMPERSAND character), as follows:
        match self.consume_next_char() {
            // The additional allowed character if there is one
            // Not a character reference. No characters are consumed and nothing is returned (This
            // is not an error, either).
            Some(c) if self.additional_allowed_character == Some(c) => {
                self.emit_error(ErrorKind::InvalidEntityCharacter);
                self.cur_pos = cur_pos;
                unsafe {
                    // Safety: We got cur_post from self.input
                    self.input.reset_to(cur_pos);
                }
            }
            Some('l') => match self.consume_next_char() {
                Some('t') => {
                    match self.consume_next_char() {
                        Some(';') => {}
                        _ => {
                            self.emit_error(ErrorKind::MissingSemicolonAfterCharacterReference);
                        }
                    }

                    return Some(('<', String::from("&lt;")));
                }
                _ => {
                    anything_else(self);
                }
            },
            Some('g') => match self.consume_next_char() {
                Some('t') => {
                    match self.consume_next_char() {
                        Some(';') => {}
                        _ => {
                            self.emit_error(ErrorKind::MissingSemicolonAfterCharacterReference);
                        }
                    }

                    return Some(('>', String::from("&gt;")));
                }
                _ => {
                    anything_else(self);
                }
            },
            Some('q') => match self.consume_next_char() {
                Some('u') => match self.consume_next_char() {
                    Some('o') => match self.consume_next_char() {
                        Some('t') => {
                            match self.consume_next_char() {
                                Some(';') => {}
                                _ => {
                                    self.emit_error(
                                        ErrorKind::MissingSemicolonAfterCharacterReference,
                                    );
                                }
                            }

                            return Some(('"', String::from("&quot;")));
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
            Some('a') => match self.consume_next_char() {
                Some('p') => match self.consume_next_char() {
                    Some('o') => match self.consume_next_char() {
                        Some('s') => {
                            match self.consume_next_char() {
                                Some(';') => {}
                                _ => {
                                    self.emit_error(
                                        ErrorKind::MissingSemicolonAfterCharacterReference,
                                    );
                                }
                            }

                            return Some(('\'', String::from("&apos;")));
                        }
                        _ => {
                            anything_else(self);
                        }
                    },
                    _ => {
                        anything_else(self);
                    }
                },
                Some('m') => match self.consume_next_char() {
                    Some('p') => {
                        match self.consume_next_char() {
                            Some(';') => {}
                            _ => {
                                self.emit_error(ErrorKind::MissingSemicolonAfterCharacterReference);
                            }
                        }

                        return Some(('&', String::from("&amp;")));
                    }
                    _ => {
                        anything_else(self);
                    }
                },
                _ => {
                    anything_else(self);
                }
            },
            Some('#') => {
                let mut base = 10;
                let mut characters = Vec::new();
                let mut has_semicolon = false;

                match self.consume_next_char() {
                    Some('x' | 'X') => {
                        base = 16;

                        while let Some(c) = &self.consume_next_char() {
                            if !c.is_ascii_hexdigit() {
                                if *c == ';' {
                                    has_semicolon = true;
                                }

                                break;
                            }

                            if c.is_ascii_digit() {
                                characters.push(*c as u32 - 0x30);
                            } else if is_upper_hex_digit(*c) {
                                characters.push(*c as u32 - 0x37);
                            } else if is_lower_hex_digit(*c) {
                                characters.push(*c as u32 - 0x57);
                            }
                        }
                    }
                    Some(c) if c.is_ascii_digit() => {
                        characters.push(c as u32 - 0x30);

                        while let Some(c) = &self.consume_next_char() {
                            if !c.is_ascii_digit() {
                                if *c == ';' {
                                    has_semicolon = true;
                                }

                                break;
                            }

                            characters.push(*c as u32 - 0x30);
                        }
                    }
                    _ => {}
                }

                if characters.is_empty() {
                    // TODO
                    self.cur_pos = cur_pos;
                    unsafe {
                        // Safety: We got cur_post from self.input
                        self.input.reset_to(cur_pos);
                    }

                    return None;
                }

                if !has_semicolon {
                    self.emit_error(ErrorKind::MissingSemicolonAfterCharacterReference);
                }

                let cr = {
                    let mut i: u32 = 0;
                    let mut overflowed = false;

                    for value in characters {
                        if !overflowed {
                            if let Some(result) = i.checked_mul(base as u32) {
                                i = result;

                                if let Some(result) = i.checked_add(value) {
                                    i = result;
                                } else {
                                    i = 0x110000;

                                    overflowed = true;
                                }
                            } else {
                                i = 0x110000;

                                overflowed = true;
                            }
                        }
                    }

                    i
                };

                if is_surrogate(cr) {
                    self.emit_error(ErrorKind::SurrogateCharacterReference);

                    return Some((char::REPLACEMENT_CHARACTER, String::from("empty")));
                }

                let c = match char::from_u32(cr) {
                    Some(c) => c,
                    _ => {
                        unreachable!();
                    }
                };

                return Some((c, String::from("empty")));
            }
            _ => {
                anything_else(self);
            }
        }

        None
    }

    fn create_doctype_token(&mut self, name_c: Option<char>) {
        let mut new_name = None;

        if let Some(name_c) = name_c {
            let mut name = String::with_capacity(4);

            name.push(name_c);
            new_name = Some(name);
        }

        self.current_doctype_token = Some(Doctype {
            name: new_name,
            public_id: None,
            system_id: None,
        });
    }

    fn append_raw_to_doctype_token(&mut self, c: char) {
        if let Some(doctype_raw) = &mut self.doctype_raw {
            let is_cr = c == '\r';

            if is_cr {
                let mut raw = String::with_capacity(2);

                raw.push(c);

                if self.input.cur() == Some('\n') {
                    unsafe {
                        // Safety: cur() is Some('\n')
                        self.input.bump();
                    }

                    raw.push('\n');
                }

                doctype_raw.push_str(&raw);
            } else {
                doctype_raw.push(c);
            }
        }
    }

    fn append_to_doctype_token(
        &mut self,
        name: Option<char>,
        public_id: Option<char>,
        system_id: Option<char>,
    ) {
        if let Some(ref mut token) = self.current_doctype_token {
            if let Some(name) = name {
                if let Doctype {
                    name: Some(old_name),
                    ..
                } = token
                {
                    old_name.push(name);
                }
            }

            if let Some(public_id) = public_id {
                if let Doctype {
                    public_id: Some(old_public_id),
                    ..
                } = token
                {
                    old_public_id.push(public_id);
                }
            }

            if let Some(system_id) = system_id {
                if let Doctype {
                    system_id: Some(old_system_id),
                    ..
                } = token
                {
                    old_system_id.push(system_id);
                }
            }
        }
    }

    fn set_doctype_token_public_id(&mut self) {
        if let Some(Doctype { public_id, .. }) = &mut self.current_doctype_token {
            // The Longest public id is `-//softquad software//dtd hotmetal pro
            // 6.0::19990601::extensions to html 4.0//`
            *public_id = Some(String::with_capacity(78));
        }
    }

    fn set_doctype_token_system_id(&mut self) {
        if let Some(Doctype { system_id, .. }) = &mut self.current_doctype_token {
            // The Longest system id is `http://www.ibm.com/data/dtd/v11/ibmxhtml1-transitional.dtd`
            *system_id = Some(String::with_capacity(58));
        }
    }

    fn emit_doctype_token(&mut self) {
        let current_doctype_token = self.current_doctype_token.take().unwrap();

        let raw = match self.doctype_raw.take() {
            Some(raw) => raw,
            _ => {
                unreachable!();
            }
        };

        let token = Token::Doctype {
            name: current_doctype_token.name.map(JsWord::from),
            public_id: current_doctype_token.public_id.map(JsWord::from),
            system_id: current_doctype_token.system_id.map(JsWord::from),
            raw: Some(JsWord::from(raw)),
        };

        self.emit_token(token);
    }

    fn create_tag_token(&mut self, kind: TagKind) {
        self.current_tag_token = Some(Tag {
            kind,
            // Maximum known html tags are `blockquote` and `figcaption`
            tag_name: String::with_capacity(10),
            attributes: Vec::with_capacity(255),
        });
    }

    fn append_to_tag_token_name(&mut self, c: char) {
        if let Some(Tag { tag_name, .. }) = &mut self.current_tag_token {
            tag_name.push(c);
        }
    }

    fn start_new_attribute(&mut self, c: Option<char>) {
        if let Some(Tag { attributes, .. }) = &mut self.current_tag_token {
            // The longest known HTML attribute is "allowpaymentrequest" for "iframe".
            let mut name = String::with_capacity(19);
            let mut raw_name = String::with_capacity(19);

            if let Some(c) = c {
                name.push(c);
                raw_name.push(c);
            };

            attributes.push(Attribute {
                span: Default::default(),
                name,
                raw_name: Some(raw_name),
                value: None,
                raw_value: None,
            });

            self.attribute_start_position = Some(self.cur_pos);
        }
    }

    fn append_to_attribute(
        &mut self,
        name: Option<(char, char)>,
        value: Option<(bool, Option<char>, Option<char>)>,
    ) {
        if let Some(Tag { attributes, .. }) = &mut self.current_tag_token {
            if let Some(attribute) = attributes.last_mut() {
                if let Some(name) = name {
                    attribute.name.push(name.0);

                    if let Some(raw_name) = &mut attribute.raw_name {
                        raw_name.push(name.1);
                    }
                }

                if let Some(value) = value {
                    if let Some(c) = value.1 {
                        if let Some(old_value) = &mut attribute.value {
                            old_value.push(c);
                        } else {
                            let mut new_value = String::with_capacity(255);

                            new_value.push(c);

                            attribute.value = Some(new_value);
                        }
                    }

                    if let Some(c) = value.2 {
                        // Quote for attribute was found, so we set empty value by default
                        if value.0 && attribute.value.is_none() {
                            attribute.value = Some(String::with_capacity(255));
                        }

                        if let Some(raw_value) = &mut attribute.raw_value {
                            raw_value.push(c);
                        } else {
                            let mut raw_new_value = String::with_capacity(255);

                            raw_new_value.push(c);

                            attribute.raw_value = Some(raw_new_value);
                        }
                    }
                }
            }
        }
    }

    fn append_to_attribute_with_entity(&mut self, value: Option<(Option<char>, Option<&str>)>) {
        if let Some(Tag { attributes, .. }) = &mut self.current_tag_token {
            if let Some(attribute) = attributes.last_mut() {
                if let Some(value) = value {
                    if let Some(c) = value.0 {
                        if let Some(old_value) = &mut attribute.value {
                            old_value.push(c);
                        } else {
                            let mut new_value = String::with_capacity(255);

                            new_value.push(c);

                            attribute.value = Some(new_value);
                        }
                    }

                    if let Some(c) = value.1 {
                        if let Some(raw_value) = &mut attribute.raw_value {
                            raw_value.push_str(c);
                        } else {
                            let mut raw_new_value = String::with_capacity(255);

                            raw_new_value.push_str(c);

                            attribute.raw_value = Some(raw_new_value);
                        }
                    }
                }
            }
        }
    }

    fn update_attribute_span(&mut self) {
        if let Some(attribute_start_position) = self.attribute_start_position {
            if let Some(Tag {
                ref mut attributes, ..
            }) = self.current_tag_token
            {
                if let Some(last) = attributes.last_mut() {
                    last.span = Span::new(attribute_start_position, self.cur_pos);
                }
            }
        }
    }

    fn set_tag_to_empty_tag(&mut self) {
        if let Some(Tag { kind, .. }) = &mut self.current_tag_token {
            *kind = TagKind::Empty;
        }
    }

    fn emit_tag_token(&mut self, kind: Option<TagKind>) {
        if let Some(mut current_tag_token) = self.current_tag_token.take() {
            if let Some(kind) = kind {
                current_tag_token.kind = kind;
            }

            let mut already_seen: AHashSet<JsWord> = Default::default();

            let attributes = current_tag_token
                .attributes
                .drain(..)
                .map(|attribute| {
                    let name = JsWord::from(attribute.name);

                    if already_seen.contains(&name) {
                        self.errors
                            .push(Error::new(attribute.span, ErrorKind::DuplicateAttribute));
                    }

                    already_seen.insert(name.clone());

                    AttributeToken {
                        span: attribute.span,
                        name,
                        raw_name: attribute.raw_name.map(JsWord::from),
                        value: attribute.value.map(JsWord::from),
                        raw_value: attribute.raw_value.map(JsWord::from),
                    }
                })
                .collect();

            match current_tag_token.kind {
                TagKind::Start => {
                    let start_tag_token = Token::StartTag {
                        tag_name: current_tag_token.tag_name.into(),
                        attributes,
                    };

                    self.emit_token(start_tag_token);
                }
                TagKind::End => {
                    if !current_tag_token.attributes.is_empty() {
                        self.emit_error(ErrorKind::EndTagWithAttributes);
                    }

                    let end_tag_token = Token::EndTag {
                        tag_name: current_tag_token.tag_name.into(),
                        attributes,
                    };

                    self.emit_token(end_tag_token);
                }
                TagKind::Empty => {
                    let empty_tag = Token::EmptyTag {
                        tag_name: current_tag_token.tag_name.into(),
                        attributes,
                    };

                    self.emit_token(empty_tag);
                }
            }
        }
    }

    fn create_comment_token(&mut self, new_data: Option<String>, raw_start: &str) {
        let mut data = String::with_capacity(32);
        let mut raw = String::with_capacity(38);

        raw.push_str(raw_start);

        if let Some(new_data) = new_data {
            data.push_str(&new_data);
            raw.push_str(&new_data);
        };

        self.current_comment_token = Some(Comment { data, raw });
    }

    fn append_to_comment_token(&mut self, c: char, raw_c: char) {
        if let Some(Comment { data, raw }) = &mut self.current_comment_token {
            data.push(c);
            raw.push(raw_c);
        }
    }

    fn handle_raw_and_append_to_comment_token(&mut self, c: char) {
        if let Some(Comment { data, raw }) = &mut self.current_comment_token {
            let is_cr = c == '\r';

            if is_cr {
                let mut raw_c = String::with_capacity(2);

                raw_c.push(c);

                if self.input.cur() == Some('\n') {
                    unsafe {
                        // Safety: cur() is Some('\n')
                        self.input.bump();
                    }

                    raw_c.push('\n');
                }

                data.push('\n');
                raw.push_str(&raw_c);
            } else {
                data.push(c);
                raw.push(c);
            }
        }
    }

    fn emit_comment_token(&mut self, raw_end: Option<&str>) {
        let mut comment = self.current_comment_token.take().unwrap();

        if let Some(raw_end) = raw_end {
            comment.raw.push_str(raw_end);
        }

        self.emit_token(Token::Comment {
            data: comment.data.into(),
            raw: comment.raw.into(),
        });
    }

    fn create_cdata_token(&mut self) {
        let data = String::new();
        let raw = String::with_capacity(12);

        self.current_cdata_token = Some(Cdata { data, raw });
    }

    fn append_to_cdata_token(&mut self, c: Option<char>, raw_c: Option<char>) {
        if let Some(Cdata { data, raw }) = &mut self.current_cdata_token {
            if let Some(c) = c {
                data.push(c);
            }

            if let Some(raw_c) = raw_c {
                raw.push(raw_c);
            }
        }
    }

    fn emit_cdata_token(&mut self) {
        let cdata = self.current_cdata_token.take().unwrap();

        self.emit_token(Token::Cdata {
            data: cdata.data.into(),
            raw: cdata.raw.into(),
        });
    }

    fn handle_raw_and_emit_character_token(&mut self, c: char) {
        let is_cr = c == '\r';

        if is_cr {
            let mut raw = String::with_capacity(2);

            raw.push(c);

            if self.input.cur() == Some('\n') {
                unsafe {
                    // Safety: cur() is Some('\n')
                    self.input.bump();
                }

                raw.push('\n');
            }

            self.emit_token(Token::Character {
                value: '\n',
                raw: Some(raw.into()),
            });
        } else {
            self.emit_token(Token::Character {
                value: c,
                raw: Some(String::from(c).into()),
            });
        }
    }

    fn create_processing_instruction_token(&mut self) {
        self.current_processing_instruction = Some(ProcessingInstruction {
            target: String::with_capacity(3),
            data: String::with_capacity(255),
        });
    }

    fn set_processing_instruction_token(&mut self, target_c: Option<char>, data_c: Option<char>) {
        if let Some(ProcessingInstruction { target, data, .. }) =
            &mut self.current_processing_instruction
        {
            if let Some(target_c) = target_c {
                target.push(target_c);
            }

            if let Some(data_c) = data_c {
                data.push(data_c);
            }
        }
    }

    fn emit_current_processing_instruction(&mut self) {
        let processing_instruction = self.current_processing_instruction.take().unwrap();

        let token = Token::ProcessingInstruction {
            target: processing_instruction.target.into(),
            data: processing_instruction.data.into(),
        };

        self.emit_token(token);
    }

    #[inline(always)]
    fn emit_character_token(&mut self, value: (char, char)) {
        self.emit_token(Token::Character {
            value: value.0,
            raw: Some(String::from(value.1).into()),
        });
    }

    #[inline(always)]
    fn emit_character_token_with_entity(&mut self, c: char, raw: &str) {
        self.emit_token(Token::Character {
            value: c,
            raw: Some(raw.into()),
        });
    }

    fn read_token_and_span(&mut self) -> LexResult<TokenAndSpan> {
        if self.finished {
            return Err(ErrorKind::Eof);
        } else {
            while self.pending_tokens.is_empty() {
                self.run()?;
            }
        }

        let token_and_span = self.pending_tokens.pop_front().unwrap();

        match token_and_span.token {
            Token::Eof => {
                self.finished = true;

                return Err(ErrorKind::Eof);
            }
            _ => {
                return Ok(token_and_span);
            }
        }
    }

    fn run(&mut self) -> LexResult<()> {
        match self.state {
            State::Data => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0026 AMPERSAND (&)
                    // Switch to character reference in data state.
                    Some('&') => {
                        self.state = State::CharacterReferenceInData;
                    }
                    // U+003C LESSER-THAN SIGN (<)
                    // Switch to the tag open state.
                    Some('<') => {
                        self.state = State::TagOpen;
                    }
                    // EOF
                    // Emit an end-of-file token.
                    None => {
                        self.emit_token(Token::Eof);

                        return Ok(());
                    }
                    // Anything else
                    // Emit the current input character as character. Stay in this state.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.handle_raw_and_emit_character_token(c);
                    }
                }
            }
            State::CharacterReferenceInData => {
                // Switch to the data state.
                // Attempt to consume a character reference.
                //
                // If nothing is returned emit a U+0026 AMPERSAND character (&) token.
                //
                // Otherwise, emit character tokens that were returned.
                self.state = State::Data;

                let character_reference = self.consume_character_reference();

                if let Some((c, raw)) = character_reference {
                    self.emit_character_token_with_entity(c, &raw);
                } else {
                    self.emit_character_token(('&', '&'));
                }
            }
            State::Pi => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0009 CHARACTER TABULATION (tab)
                    // U+000A LINE FEED (LF)
                    // U+0020 SPACE
                    // EOF
                    // Parse error.
                    // Switch to the pi target after state.
                    Some(c) if is_whitespace(c) => {
                        self.emit_error(ErrorKind::InvalidCharacterOfProcessingInstruction);
                        self.create_processing_instruction_token();
                        self.state = State::PiTargetAfter;
                    }
                    None => {
                        self.emit_error(ErrorKind::EofInProcessingInstruction);
                        self.create_processing_instruction_token();
                        self.emit_current_processing_instruction();
                        self.reconsume_in_state(State::Data);
                    }
                    // U+003F QUESTION MARK(?)
                    // Emit error
                    // Reprocess the current input character in the pi end state (recovery mode).
                    Some('?') => {
                        self.emit_error(ErrorKind::NoTargetNameInProcessingInstruction);
                        self.create_processing_instruction_token();
                        self.state = State::PiEnd;
                    }
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.create_processing_instruction_token();
                        self.set_processing_instruction_token(Some(c), None);
                        self.state = State::PiTarget;
                    }
                }
            }
            State::PiTarget => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0009 CHARACTER TABULATION (tab)
                    // U+000A LINE FEED (LF)
                    // U+0020 SPACE
                    // Switch to the pi target state.
                    Some(c) if is_whitespace(c) => {
                        self.state = State::PiTargetAfter;
                    }
                    // EOF
                    // Parse error. Emit the current processing instruction token and then reprocess
                    // the current input character in the data state.
                    None => {
                        self.emit_error(ErrorKind::EofInProcessingInstruction);
                        self.emit_current_processing_instruction();
                        self.reconsume_in_state(State::Data);
                    }
                    // U+003F QUESTION MARK(?)
                    // Switch to the pi target question.
                    Some('?') => {
                        self.state = State::PiTargetQuestion;
                    }
                    // Anything else
                    // Append the current input character to the processing instruction target and
                    // stay in the current state.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.set_processing_instruction_token(Some(c), None);
                    }
                }
            }
            State::PiTargetQuestion => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+003E GREATER-THAN SIGN (>)
                    Some('>') => {
                        self.reconsume_in_state(State::PiEnd);
                    }
                    _ => {
                        self.errors.push(Error::new(
                            Span::new(self.cur_pos - BytePos(1), self.input.cur_pos() - BytePos(1)),
                            ErrorKind::MissingWhitespaceBeforeQuestionInProcessingInstruction,
                        ));
                        self.set_processing_instruction_token(None, Some('?'));
                        self.reconsume_in_state(State::PiData);
                    }
                }
            }
            State::PiTargetAfter => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0009 CHARACTER TABULATION (Tab)
                    // U+000A LINE FEED (LF)
                    // U+0020 SPACE (Space)
                    // Stay in the current state.
                    Some(c) if is_whitespace(c) => {
                        self.skip_next_lf(c);
                    }
                    // Anything else
                    // Reprocess the current input character in the pi data state.
                    _ => {
                        self.reconsume_in_state(State::PiData);
                    }
                }
            }
            State::PiData => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+003F QUESTION MARK(?)
                    // Switch to the pi after state.
                    Some('?') => {
                        self.state = State::PiEnd;
                    }
                    // EOF
                    // Parse error. Emit the current processing instruction token and then reprocess
                    // the current input character in the data state.
                    None => {
                        self.emit_error(ErrorKind::EofInProcessingInstruction);
                        self.emit_current_processing_instruction();
                        self.reconsume_in_state(State::Data);
                    }
                    // Anything else
                    // Append the current input character to the pi’s data and stay in the current
                    // state.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.set_processing_instruction_token(None, Some(c));
                    }
                }
            }
            State::PiEnd => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+003E GREATER-THAN SIGN (>)
                    // Emit the current token and then switch to the data state.
                    Some('>') => {
                        self.emit_current_processing_instruction();
                        self.state = State::Data;
                    }
                    // EOF
                    // Parse error. Emit the current processing instruction token and then reprocess
                    // the current input character in the data state.
                    None => {
                        self.emit_error(ErrorKind::EofInProcessingInstruction);
                        self.emit_current_processing_instruction();
                        self.reconsume_in_state(State::Data);
                    }
                    // Anything else
                    // Reprocess the current input character in the pi data state.
                    _ => {
                        self.set_processing_instruction_token(None, Some('?'));
                        self.reconsume_in_state(State::PiData);
                    }
                }
            }
            State::MarkupDeclaration => {
                let cur_pos = self.input.cur_pos();
                let anything_else = |lexer: &mut Lexer<I>| {
                    lexer.emit_error(ErrorKind::IncorrectlyOpenedComment);
                    lexer.create_comment_token(None, "<!");
                    lexer.state = State::BogusComment;
                    lexer.cur_pos = cur_pos;
                    // We don't validate input here because we reset position
                    unsafe {
                        // Safety: cur_pos is in the range of input
                        lexer.input.reset_to(cur_pos);
                    }
                };

                // If the next few characters are:
                match self.consume_next_char() {
                    // Two U+002D HYPEN-MINUS characters (-)
                    // Consume those two characters, create a comment token whose data is the empty
                    // string and switch to comment start state.
                    Some('-') => match self.consume_next_char() {
                        Some('-') => {
                            self.create_comment_token(None, "<!--");
                            self.state = State::CommentStart;
                        }
                        _ => {
                            anything_else(self);
                        }
                    },
                    // ASCII case-insensitive match for word "DOCTYPE"
                    // Consume those characters and switch to Doctype state
                    Some(d @ 'd' | d @ 'D') => match self.consume_next_char() {
                        Some(o @ 'o' | o @ 'O') => match self.consume_next_char() {
                            Some(c @ 'c' | c @ 'C') => match self.consume_next_char() {
                                Some(t @ 't' | t @ 'T') => match self.consume_next_char() {
                                    Some(y @ 'y' | y @ 'Y') => match self.consume_next_char() {
                                        Some(p @ 'p' | p @ 'P') => match self.consume_next_char() {
                                            Some(e @ 'e' | e @ 'E') => {
                                                self.state = State::Doctype;

                                                let mut raw_keyword = String::with_capacity(9);

                                                raw_keyword.push('<');
                                                raw_keyword.push('!');
                                                raw_keyword.push(d);
                                                raw_keyword.push(o);
                                                raw_keyword.push(c);
                                                raw_keyword.push(t);
                                                raw_keyword.push(y);
                                                raw_keyword.push(p);
                                                raw_keyword.push(e);

                                                self.doctype_raw = Some(raw_keyword);
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
                    // Exact match for word "[CDATA[" with a (the five uppercase letters "CDATA"
                    // with a U+005B LEFT SQUARE BRACKET character before and after)
                    // Consume those characters and switch to CDATA state
                    Some('[') => match self.consume_next_char() {
                        Some(c @ 'C') => match self.consume_next_char() {
                            Some(d @ 'D') => match self.consume_next_char() {
                                Some(a1 @ 'A') => match self.consume_next_char() {
                                    Some(t @ 'T') => match self.consume_next_char() {
                                        Some(a2 @ 'A') => match self.consume_next_char() {
                                            Some('[') => {
                                                self.create_cdata_token();
                                                self.append_to_cdata_token(None, Some('<'));
                                                self.append_to_cdata_token(None, Some('!'));
                                                self.append_to_cdata_token(None, Some('['));
                                                self.append_to_cdata_token(None, Some(c));
                                                self.append_to_cdata_token(None, Some(d));
                                                self.append_to_cdata_token(None, Some(a1));
                                                self.append_to_cdata_token(None, Some(t));
                                                self.append_to_cdata_token(None, Some(a2));
                                                self.append_to_cdata_token(None, Some('['));
                                                self.state = State::Cdata;
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
                    // Emit an error. Create a comment token whose data is an empty string. Switch
                    // to bogus comment state (don’t consume any characters)
                    _ => {
                        anything_else(self);
                    }
                }
            }
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
                        self.emit_comment_token(Some(">"));
                    }
                    // Anything else
                    // Reconsume in the comment state.
                    _ => {
                        self.reconsume_in_state(State::Comment);
                    }
                }
            }
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
                        self.emit_comment_token(Some("->"));
                    }
                    // EOF
                    // This is an eof-in-comment parse error. Emit the current comment token.
                    // Emit an end-of-file token.
                    None => {
                        self.emit_error(ErrorKind::EofInComment);
                        self.emit_comment_token(None);
                        self.emit_token(Token::Eof);

                        return Ok(());
                    }
                    // Anything else
                    // Append a U+002D HYPHEN-MINUS character (-) to the comment token's data.
                    // Reconsume in the comment state.
                    _ => {
                        self.append_to_comment_token('-', '-');
                        self.reconsume_in_state(State::Comment);
                    }
                }
            }
            State::Comment => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+003C LESS-THAN SIGN (<)
                    // Append the current input character to the comment token's data. Switch to
                    // the comment less-than sign state.
                    Some(c @ '<') => {
                        self.append_to_comment_token(c, c);
                        self.state = State::CommentLessThanSign;
                    }
                    // U+002D HYPHEN-MINUS (-)
                    // Switch to the comment end dash state.
                    Some('-') => {
                        self.state = State::CommentEndDash;
                    }
                    // EOF
                    // This is an eof-in-comment parse error. Emit the current comment token.
                    // Emit an end-of-file token.
                    None => {
                        self.emit_error(ErrorKind::EofInComment);
                        self.emit_comment_token(None);
                        self.emit_token(Token::Eof);

                        return Ok(());
                    }
                    // Anything else
                    // Append the current input character to the comment token's data.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.handle_raw_and_append_to_comment_token(c);
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
                        self.append_to_comment_token(c, c);
                        self.state = State::CommentLessThanSignBang;
                    }
                    // U+003C LESS-THAN SIGN (<)
                    // Append the current input character to the comment token's data.
                    Some(c @ '<') => {
                        self.append_to_comment_token(c, c);
                    }
                    // Anything else
                    // Reconsume in the comment state.
                    _ => {
                        self.reconsume_in_state(State::Comment);
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
                        self.reconsume_in_state(State::Comment);
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
                        self.reconsume_in_state(State::CommentEndDash);
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
                        self.reconsume_in_state(State::CommentEnd);
                    }
                    // Anything else
                    // This is a nested-comment parse error. Reconsume in the comment end state.
                    _ => {
                        self.emit_error(ErrorKind::NestedComment);
                        self.reconsume_in_state(State::CommentEnd);
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
                        self.emit_comment_token(None);
                        self.emit_token(Token::Eof);

                        return Ok(());
                    }
                    // Anything else
                    // Append a U+002D HYPHEN-MINUS character (-) to the comment token's data.
                    // Reconsume in the comment state.
                    _ => {
                        self.append_to_comment_token('-', '-');
                        self.reconsume_in_state(State::Comment);
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
                        self.emit_comment_token(Some("-->"));
                    }
                    // U+0021 EXCLAMATION MARK (!)
                    // Switch to the comment end bang state.
                    Some('!') => {
                        self.state = State::CommentEndBang;
                    }
                    // U+002D HYPHEN-MINUS (-)
                    // Append a U+002D HYPHEN-MINUS character (-) to the comment token's data.
                    Some(c @ '-') => {
                        self.append_to_comment_token(c, c);
                        self.emit_error(ErrorKind::DoubleHyphenWithInComment);
                    }
                    // EOF
                    // This is an eof-in-comment parse error. Emit the current comment token.
                    // Emit an end-of-file token.
                    None => {
                        self.emit_error(ErrorKind::EofInComment);
                        self.emit_comment_token(None);
                        self.emit_token(Token::Eof);

                        return Ok(());
                    }
                    // Anything else
                    // Append two U+002D (-) characters and the current input character to the
                    // comment token’s data. Reconsume in the comment state.
                    _ => {
                        self.append_to_comment_token('-', '-');
                        self.append_to_comment_token('-', '-');
                        self.reconsume_in_state(State::Comment);
                    }
                }
            }
            // https://html.spec.whatwg.org/multipage/parsing.html#comment-end-bang-state
            State::CommentEndBang => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+002D HYPHEN-MINUS (-)
                    // Append a U+002D HYPHEN-MINUS character (-) and U+0021 EXCLAMATION MARK
                    // character(!) to the comment token’s data. Switch to the comment end dash
                    // state.
                    Some('-') => {
                        self.append_to_comment_token('-', '-');
                        self.append_to_comment_token('!', '!');
                        self.state = State::CommentEndDash;
                    }
                    // U+003E GREATER-THAN SIGN (>)
                    // Parse error. Switch to the data state.Emit the comment token.
                    Some('>') => {
                        self.emit_error(ErrorKind::IncorrectlyClosedComment);
                        self.state = State::Data;
                        self.emit_comment_token(Some(">"));
                    }
                    // EOF
                    // Parse error. Emit the comment token. Emit an end-of-file token.
                    None => {
                        self.emit_error(ErrorKind::EofInComment);
                        self.emit_comment_token(None);
                        self.emit_token(Token::Eof);

                        return Ok(());
                    }
                    // Anything else
                    // Anything else
                    // Append two U+002D (-) characters and U+0021 EXCLAMATION MARK character(!) to
                    // the comment token’s data. Reconsume in the comment state.
                    _ => {
                        self.append_to_comment_token('-', '-');
                        self.append_to_comment_token('-', '-');
                        self.append_to_comment_token('!', '!');
                        self.reconsume_in_state(State::Comment);
                    }
                }
            }
            State::Cdata => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+005D RIGHT SQUARE BRACKET (])
                    // Switch to the CDATA bracket state.
                    Some(']') => {
                        self.state = State::CdataBracket;
                    }
                    // EOF
                    // Parse error. Reprocess the current input character in the data state.
                    None => {
                        self.emit_error(ErrorKind::EofInCdata);
                        self.reconsume_in_state(State::Data);
                    }
                    // Anything else
                    // Append the current input character to the cdata dta. Stay in the current
                    // state.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.append_to_cdata_token(Some(c), Some(c));
                    }
                }
            }
            State::CdataBracket => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+005D RIGHT SQUARE BRACKET (])
                    // Switch to the CDATA end state.
                    Some(']') => {
                        self.state = State::CdataEnd;
                    }
                    // EOF
                    // Parse error. Reconsume the current input character in the data state.
                    None => {
                        self.emit_error(ErrorKind::EofInCdata);
                        self.reconsume_in_state(State::Data);
                    }
                    // Anything else
                    // Emit a U+005D RIGHT SQUARE BRACKET character token. Reconsume in the
                    // CDATA section state.
                    Some(c) => {
                        self.append_to_cdata_token(Some(']'), Some(']'));
                        self.append_to_cdata_token(Some(c), Some(c));
                        self.state = State::Cdata;
                    }
                }
            }
            State::CdataEnd => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+003E GREATER-THAN SIGN (>)
                    // Switch to the data state.
                    Some('>') => {
                        self.append_to_cdata_token(None, Some(']'));
                        self.append_to_cdata_token(None, Some(']'));
                        self.append_to_cdata_token(None, Some('>'));
                        self.emit_cdata_token();
                        self.state = State::Data;
                    }
                    // U+005D RIGHT SQUARE BRACKET (])
                    // Emit the current input character as character token. Stay in the current
                    // state.
                    Some(c @ ']') => {
                        self.append_to_cdata_token(Some(c), Some(c));
                    }
                    // EOF
                    // Parse error. Reconsume the current input character in the data state.
                    None => {
                        self.emit_error(ErrorKind::EofInCdata);
                        self.reconsume_in_state(State::Data);
                    }
                    // Anything else
                    // Emit two U+005D RIGHT SQUARE BRACKET (]) characters as character tokens and
                    // also emit the current input character as character token. Switch to the CDATA
                    // state.
                    Some(c) => {
                        self.append_to_cdata_token(Some(']'), Some(']'));
                        self.append_to_cdata_token(Some(']'), Some(']'));
                        self.append_to_cdata_token(Some(c), Some(c));
                        self.state = State::Cdata;
                    }
                }
            }
            State::TagOpen => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+002F SOLIDUS (/)
                    // Switch to the end tag open state.
                    Some('/') => {
                        self.state = State::EndTagOpen;
                    }
                    // U+0021 EXCLAMATION MARK (!)
                    // Switch to the markup declaration open state.
                    Some('!') => {
                        self.state = State::MarkupDeclaration;
                    }
                    // U+003F QUESTION MARK(?)
                    // Switch to the pi state.
                    Some('?') => {
                        self.state = State::Pi;
                    }
                    // Name start character
                    // Create a new tag token and set its name to the input character, then switch
                    // to the tag name state.
                    Some(c) if is_name_start_char(c) => {
                        self.create_tag_token(TagKind::Start);
                        self.reconsume_in_state(State::TagName);
                    }
                    // EOF
                    // This is an eof-before-tag-name parse error. Emit a U+003C LESS-THAN SIGN
                    // character token and an end-of-file token.
                    None => {
                        self.emit_error(ErrorKind::EofBeforeTagName);
                        self.emit_character_token(('<', '<'));
                        self.emit_token(Token::Eof);

                        return Ok(());
                    }
                    // Anything else
                    // This is an invalid-first-character-of-tag-name parse error. Emit a U+003C
                    // LESS-THAN SIGN character token. Reconsume in the data state.
                    _ => {
                        self.emit_error(ErrorKind::InvalidFirstCharacterOfTagName);
                        self.emit_character_token(('<', '<'));
                        self.reconsume_in_state(State::Data);
                    }
                }
            }
            State::EndTagOpen => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // ASCII alpha
                    // Create a new end tag token, set its tag name to the empty string.
                    // Reconsume in the tag name state.
                    Some(c) if is_name_char(c) => {
                        self.create_tag_token(TagKind::End);
                        self.reconsume_in_state(State::TagName);
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
                        self.emit_character_token(('<', '<'));
                        self.emit_character_token(('/', '/'));
                        self.emit_token(Token::Eof);

                        return Ok(());
                    }
                    // Anything else
                    // This is an invalid-first-character-of-tag-name parse error. Create a
                    // comment token whose data is the empty string. Reconsume in the bogus
                    // comment state.
                    _ => {
                        self.emit_error(ErrorKind::InvalidFirstCharacterOfTagName);
                        self.emit_character_token(('<', '<'));
                        self.emit_character_token(('/', '/'));
                        self.reconsume_in_state(State::BogusComment);
                    }
                }
            }
            State::TagName => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0009 CHARACTER TABULATION (Tab)
                    // U+000A LINE FEED (LF)
                    // U+0020 SPACE (Space)
                    // Switch to the before attribute name state.
                    Some(c) if is_whitespace(c) => {
                        self.skip_next_lf(c);
                        self.state = State::TagAttributeNameBefore;
                    }
                    // U+002F SOLIDUS (/)
                    // Set current tag to empty tag. Switch to the empty tag state.
                    Some('/') => {
                        self.set_tag_to_empty_tag();
                        self.state = State::EmptyTag;
                    }
                    // U+003E GREATER-THAN SIGN (>)
                    // Switch to the data state. Emit the current tag token.
                    Some('>') => {
                        self.state = State::Data;
                        self.emit_tag_token(None);
                    }
                    // EOF
                    // This is an eof-in-tag parse error. Emit an end-of-file token.
                    None => {
                        self.emit_error(ErrorKind::EofInTag);
                        self.emit_tag_token(None);

                        return Ok(());
                    }
                    // Name character
                    // Append the current input character to the tag name and stay in the current
                    // state.
                    Some(c) if is_name_char(c) => {
                        self.validate_input_stream_character(c);
                        self.append_to_tag_token_name(c);
                    }
                    // Anything else
                    // Parse error. Append the current input character to the tag name and stay in
                    // the current state.
                    Some(c) => {
                        self.emit_error(ErrorKind::InvalidCharacterInTag);
                        self.validate_input_stream_character(c);
                        self.append_to_tag_token_name(c);
                    }
                }
            }
            State::EmptyTag => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+003E GREATER-THAN SIGN (>)
                    // Emit the current tag token as empty tag token and then switch to the data
                    // state.
                    Some('>') => {
                        self.emit_tag_token(Some(TagKind::Empty));
                        self.state = State::Data;
                    }
                    // Anything else
                    // Parse error. Reprocess the current input character in the tag attribute name
                    // before state.
                    _ => {
                        self.emit_error(ErrorKind::UnexpectedSolidusInTag);
                        self.reconsume_in_state(State::TagAttributeNameBefore);
                    }
                }
            }
            State::TagAttributeNameBefore => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0009 CHARACTER TABULATION (tab)
                    // U+000A LINE FEED (LF)
                    // U+0020 SPACE
                    // Ignore the character.
                    Some(c) if is_whitespace(c) => {
                        self.skip_next_lf(c);
                    }
                    // U+003E GREATER-THAN SIGN(>)
                    // Emit the current token and then switch to the data state.
                    Some('>') => {
                        self.emit_tag_token(None);
                        self.state = State::Data;
                    }
                    // U+002F SOLIDUS (/)
                    // Set current tag to empty tag. Switch to the empty tag state.
                    Some('/') => {
                        self.set_tag_to_empty_tag();
                        self.state = State::EmptyTag;
                    }
                    // U+003A COLON (:)
                    // Parse error. Stay in the current state.
                    Some(':') => {
                        self.emit_error(ErrorKind::UnexpectedColonBeforeAttributeName);
                    }
                    // EOF
                    // Parse error. Emit the current token and then reprocess the current input
                    // character in the data state.
                    None => {
                        self.emit_error(ErrorKind::EofBeforeTagName);
                        self.emit_tag_token(None);
                        self.reconsume_in_state(State::Data);
                    }
                    // Anything else
                    // Start a new attribute in the current tag token. Set that attribute’s name to
                    // the current input character and its value to the empty string and then switch
                    // to the tag attribute name state.
                    _ => {
                        self.start_new_attribute(None);
                        self.reconsume_in_state(State::TagAttributeName);
                    }
                }
            }
            State::TagAttributeName => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+003D EQUALS SIGN (=)
                    // Switch to the before attribute value state.
                    Some('=') => {
                        self.state = State::TagAttributeValueBefore;
                    }
                    // U+003E GREATER-THEN SIGN (>)
                    // Emit the current token as start tag token. Switch to the data state.
                    Some('>') => {
                        self.emit_error(ErrorKind::MissingEqualAfterAttributeName);
                        self.emit_tag_token(None);
                        self.state = State::Data;
                    }
                    // U+0009 CHARACTER TABULATION (Tab)
                    // U+000A LINE FEED (LF)
                    // U+0020 SPACE (Space)
                    // Switch to the tag attribute name after state.
                    Some(c) if is_whitespace(c) => {
                        self.update_attribute_span();
                        self.skip_next_lf(c);
                        self.reconsume_in_state(State::TagAttributeNameAfter);
                    }
                    // U+002F SOLIDUS (/)
                    // Set current tag to empty tag. Switch to the empty tag state.
                    Some('/') => {
                        self.emit_error(ErrorKind::MissingEqualAfterAttributeName);
                        self.set_tag_to_empty_tag();
                        self.state = State::EmptyTag;
                    }
                    // EOF
                    // Parse error. Emit the current token as start tag token and then reprocess the
                    // current input character in the data state.
                    None => {
                        self.emit_error(ErrorKind::EofInTag);
                        self.emit_tag_token(Some(TagKind::Start));
                        self.reconsume_in_state(State::Data);
                    }
                    // Anything else
                    // Append the current input character to the current attribute's name.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.append_to_attribute(Some((c, c)), None);
                    }
                }

                // When the user agent leaves the attribute name state (and
                // before emitting the tag token, if appropriate), the
                // complete attribute's name must be compared to the other
                // attributes on the same token; if there is already an
                // attribute on the token with the exact same name, then
                // this is a duplicate-attribute parse error and the new
                // attribute must be removed from the token.
                //
                // We postpone it when we will emit current tag token
            }
            State::TagAttributeNameAfter => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0009 CHARACTER TABULATION (tab)
                    // U+000A LINE FEED (LF)
                    // U+0020 SPACE
                    // Ignore the character.
                    Some(c) if is_whitespace(c) => {
                        self.skip_next_lf(c);
                    }
                    // U+003D EQUALS SIGN(=)
                    // Switch to the tag attribute value before state.
                    Some('=') => {
                        self.state = State::TagAttributeValueBefore;
                    }
                    // U+003E GREATER-THEN SIGN(>)
                    // Emit the current token and then switch to the data state.
                    Some('>') => {
                        self.emit_tag_token(None);
                        self.state = State::Data;
                    }
                    // U+002F SOLIDUS (/)
                    // Set current tag to empty tag. Switch to the empty tag state.
                    Some('/') => {
                        self.set_tag_to_empty_tag();
                        self.state = State::EmptyTag;
                    }
                    // EOF
                    // Parse error. Emit the current token and then reprocess the current input
                    // character in the data state.
                    None => {
                        self.emit_error(ErrorKind::EofInTag);
                        self.emit_tag_token(None);
                        self.reconsume_in_state(State::Data);
                    }
                    // Anything else
                    // Start a new attribute in the current tag token. Set that attribute’s name to
                    // the current input character and its value to the empty string and then switch
                    // to the tag attribute name state.
                    Some(c) => {
                        self.emit_error(ErrorKind::MissingEqualAfterAttributeName);
                        self.validate_input_stream_character(c);
                        self.start_new_attribute(Some(c));
                        self.state = State::TagAttributeName;
                    }
                }
            }
            State::TagAttributeValueBefore => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0009 CHARACTER TABULATION (tab)
                    // U+000A LINE FEED (LF)
                    // U+0020 SPACE
                    // Ignore the character.
                    Some(c) if is_whitespace(c) => {
                        self.skip_next_lf(c);
                    }
                    // U+0022 QUOTATION MARK (")
                    // Switch to the attribute value (double-quoted) state.
                    Some(c @ '"') => {
                        self.append_to_attribute(None, Some((true, None, Some(c))));
                        self.state = State::TagAttributeValueDoubleQuoted;
                    }
                    // U+0027 APOSTROPHE (')
                    // Switch to the attribute value (single-quoted) state.
                    Some(c @ '\'') => {
                        self.append_to_attribute(None, Some((true, None, Some(c))));
                        self.state = State::TagAttributeValueSingleQuoted;
                    }
                    // U+003E GREATER-THAN SIGN(>)
                    // Emit the current token and then switch to the data state.
                    Some('>') => {
                        self.emit_tag_token(None);
                        self.state = State::Data;
                    }
                    // EOF
                    // Parse error. Emit the current token and then reprocess the current input
                    // character in the data state.
                    None => {
                        self.emit_error(ErrorKind::EofInTag);
                        self.emit_tag_token(None);
                        self.reconsume_in_state(State::Data);
                    }
                    // Anything else
                    // Append the current input character to the current attribute’s value and then
                    // switch to the tag attribute value unquoted state.
                    Some(c) => {
                        self.emit_error(ErrorKind::MissingQuoteBeforeAttributeValue);
                        self.validate_input_stream_character(c);
                        self.append_to_attribute(None, Some((true, Some(c), Some(c))));
                        self.state = State::TagAttributeValueUnquoted;
                    }
                }
            }
            State::TagAttributeValueDoubleQuoted => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0022 QUOTATION MARK (")
                    // Switch to the tag attribute name before state.
                    // We set value to support empty attributes (i.e. `attr=""`)
                    Some(c @ '"') => {
                        self.append_to_attribute(None, Some((false, None, Some(c))));
                        self.state = State::TagAttributeValueAfter;
                    }
                    // U+0026 AMPERSAND (&)
                    // Switch to character reference in attribute value state, with the additional
                    // allowed character being U+0022 QUOTATION MARK(").
                    Some('&') => {
                        self.return_state = Some(self.state.clone());
                        self.state = State::CharacterReferenceInAttributeValue;
                        self.additional_allowed_character = Some('"');
                    }
                    // (<)
                    Some(c @ '<') => {
                        self.emit_error(ErrorKind::UnescapedCharacterInAttributeValue('<'));
                        self.append_to_attribute(None, Some((false, Some(c), Some(c))));
                    }
                    // EOF
                    // Parse error. Emit the current token and then reprocess the current input
                    // character in the data state.
                    None => {
                        self.emit_error(ErrorKind::EofInTag);
                        self.emit_tag_token(None);
                        self.reconsume_in_state(State::Data);
                    }
                    // Anything else
                    // Append the input character to the current attribute’s value. Stay in the
                    // current state.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.append_to_attribute(None, Some((false, Some(c), Some(c))));
                    }
                }
            }
            State::TagAttributeValueSingleQuoted => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0022 APOSTROPHE (')
                    // Switch to the tag attribute name before state.
                    // We set value to support empty attributes (i.e. `attr=''`)
                    Some(c @ '\'') => {
                        self.append_to_attribute(None, Some((false, None, Some(c))));
                        self.state = State::TagAttributeValueAfter;
                    }
                    // U+0026 AMPERSAND (&)
                    // Switch to character reference in attribute value state, with the additional
                    // allowed character being APOSTROPHE (').
                    Some('&') => {
                        self.return_state = Some(self.state.clone());
                        self.state = State::CharacterReferenceInAttributeValue;
                        self.additional_allowed_character = Some('\'');
                    }
                    // (<)
                    Some(c @ '<') => {
                        self.emit_error(ErrorKind::UnescapedCharacterInAttributeValue('<'));
                        self.append_to_attribute(None, Some((false, Some(c), Some(c))));
                    }
                    // EOF
                    // Parse error. Emit the current token and then reprocess the current input
                    // character in the data state.
                    None => {
                        self.emit_error(ErrorKind::EofInTag);
                        self.emit_tag_token(None);
                        self.reconsume_in_state(State::Data);
                    }
                    // Anything else
                    // Append the current input character to the current attribute's value.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.append_to_attribute(None, Some((false, Some(c), Some(c))));
                    }
                }
            }
            State::TagAttributeValueUnquoted => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0009 CHARACTER TABULATION (Tab)
                    // U+000A LINE FEED (LF)
                    // U+0020 SPACE (Space)
                    // Switch to the before attribute name state.
                    Some(c) if is_whitespace(c) => {
                        self.update_attribute_span();
                        self.skip_next_lf(c);
                        self.state = State::TagAttributeValueAfter;
                    }
                    // U+0026 AMPERSAND (&)
                    // Set the return state to the attribute value (unquoted) state. Switch to
                    // the character reference state.
                    Some('&') => {
                        self.return_state = Some(self.state.clone());
                        self.state = State::CharacterReferenceInAttributeValue;
                        self.additional_allowed_character = Some('>');
                    }
                    // (<)
                    Some(c @ '<') => {
                        self.emit_error(ErrorKind::UnescapedCharacterInAttributeValue('<'));
                        self.append_to_attribute(None, Some((false, Some(c), Some(c))));
                    }
                    // U+003E GREATER-THAN SIGN (>)
                    // Emit the current token as start tag token and then switch to the data state.
                    Some('>') => {
                        self.update_attribute_span();
                        self.emit_tag_token(Some(TagKind::Start));
                        self.state = State::Data;
                    }
                    // EOF
                    // Parse error. Emit the current token as start tag token and then reprocess the
                    // current input character in the data state.
                    None => {
                        self.emit_error(ErrorKind::EofInTag);
                        self.update_attribute_span();
                        self.emit_tag_token(Some(TagKind::Start));
                        self.reconsume_in_state(State::Data);
                    }
                    // Anything else
                    // Append the input character to the current attribute’s value. Stay in the
                    // current state.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.append_to_attribute(None, Some((false, Some(c), Some(c))));
                    }
                }
            }
            State::TagAttributeValueAfter => match self.consume_next_char() {
                Some(c) if is_whitespace(c) => {
                    self.reconsume_in_state(State::TagAttributeNameBefore);
                }
                Some('>') | Some('/') => {
                    self.reconsume_in_state(State::TagAttributeNameBefore);
                }
                None => {
                    self.emit_error(ErrorKind::EofInTag);
                    self.update_attribute_span();
                    self.emit_tag_token(Some(TagKind::Start));
                    self.reconsume_in_state(State::Data);
                }
                _ => {
                    self.emit_error(ErrorKind::MissingSpaceBetweenAttributes);
                    self.reconsume_in_state(State::TagAttributeNameBefore);
                }
            },
            State::CharacterReferenceInAttributeValue => {
                // Attempt to consume a character reference.
                //
                // If nothing is returned, append a U+0026 AMPERSAND (&) character to current
                // attribute’s value.
                //
                // Otherwise append returned character tokens to current attribute’s value.
                //
                // Finally, switch back to attribute value state that switched to this state.

                let character_reference = self.consume_character_reference();

                if let Some((c, raw)) = character_reference {
                    self.append_to_attribute_with_entity(Some((Some(c), Some(&raw))));
                } else {
                    self.append_to_attribute(None, Some((false, Some('&'), Some('&'))));
                }

                if let Some(return_state) = &self.return_state {
                    self.state = return_state.clone();
                }
            }
            State::BogusComment => {
                // Consume every character up to the first U+003E GREATER-THAN SIGN (>) or EOF,
                // whichever comes first. Emit a comment token whose data is the concatenation
                // of all those consumed characters. Then consume the next input character and
                // switch to the data state reprocessing the EOF character if that was the
                // character consumed.
                match self.consume_next_char() {
                    // U+003E GREATER-THAN SIGN (>)
                    // Switch to the data state. Emit the current comment token.
                    Some('>') => {
                        self.emit_comment_token(Some(">"));
                        self.state = State::Data;
                    }
                    // EOF
                    // Emit the comment. Emit an end-of-file token.
                    None => {
                        self.emit_comment_token(None);
                        self.state = State::Data;
                        self.reconsume();
                    }
                    // Anything else
                    // Append the current input character to the comment token's data.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.handle_raw_and_append_to_comment_token(c);
                    }
                }
            }
            State::Doctype => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0009 CHARACTER TABULATION (tab)
                    // U+000A LINE FEED (LF)
                    // U+000C FORM FEED (FF)
                    // U+0020 SPACE
                    // Switch to the before DOCTYPE name state.
                    Some(c) if is_whitespace(c) => {
                        self.append_raw_to_doctype_token(c);
                        self.state = State::BeforeDoctypeName;
                    }
                    // EOF
                    // Parse error. Switch to data state. Create new Doctype token. Emit Doctype
                    // token. Reconsume the EOF character.
                    None => {
                        self.emit_error(ErrorKind::EofInDoctype);
                        self.state = State::Data;
                        self.create_doctype_token(None);
                        self.emit_doctype_token();
                        self.reconsume();
                    }
                    // Anything else
                    // This is a missing-whitespace-before-doctype-name parse error. Reconsume
                    // in the before DOCTYPE name state.
                    _ => {
                        self.emit_error(ErrorKind::MissingWhitespaceBeforeDoctypeName);
                        self.reconsume_in_state(State::BeforeDoctypeName);
                    }
                }
            }
            State::BeforeDoctypeName => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0009 CHARACTER TABULATION (tab)
                    // U+000A LINE FEED (LF)
                    // U+000C FORM FEED (FF)
                    // U+0020 SPACE
                    // Ignore the character.
                    Some(c) if is_whitespace(c) => {
                        self.append_raw_to_doctype_token(c);
                    }
                    // Uppercase ASCII letter
                    // Create a new DOCTYPE token. Set the token name to lowercase version of the
                    // current input character. Switch to the DOCTYPE name state.
                    Some(c) if is_ascii_upper_alpha(c) => {
                        self.append_raw_to_doctype_token(c);
                        self.create_doctype_token(Some(c.to_ascii_lowercase()));
                        self.state = State::DoctypeName;
                    }
                    // U+003E GREATER-THAN SIGN (>)
                    // This is a missing-doctype-name parse error. Create a new DOCTYPE token.
                    // Set its force-quirks flag to on. Switch to the data state. Emit the
                    // current token.
                    Some(c @ '>') => {
                        self.append_raw_to_doctype_token(c);
                        self.emit_error(ErrorKind::MissingDoctypeName);
                        self.create_doctype_token(None);
                        self.emit_doctype_token();
                        self.state = State::Data;
                    }
                    // EOF
                    // Parse error. Switch to data state. Create new Doctype token. Emit Doctype
                    // token. Reconsume the EOF character.
                    None => {
                        self.emit_error(ErrorKind::EofInDoctype);
                        self.state = State::Data;
                        self.create_doctype_token(None);
                        self.emit_doctype_token();
                        self.reconsume();
                    }
                    // Anything else
                    // Create new DOCTYPE token. Set the token’s name to current input character.
                    // Switch to DOCTYPE name state.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.append_raw_to_doctype_token(c);
                        self.create_doctype_token(Some(c));
                        self.state = State::DoctypeName;
                    }
                }
            }
            State::DoctypeName => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0009 CHARACTER TABULATION (tab)
                    // U+000A LINE FEED (LF)
                    // U+000C FORM FEED (FF)
                    // U+0020 SPACE
                    // Switch to the after DOCTYPE name state.
                    Some(c) if is_whitespace(c) => {
                        self.append_raw_to_doctype_token(c);
                        self.state = State::AfterDoctypeName;
                    }
                    // ASCII upper alpha
                    // Append the lowercase version of the current input character (add 0x0020
                    // to the character's code point) to the current DOCTYPE token's name.
                    Some(c) if is_ascii_upper_alpha(c) => {
                        self.append_raw_to_doctype_token(c);
                        self.append_to_doctype_token(Some(c.to_ascii_lowercase()), None, None);
                    }
                    // U+003E GREATER-THAN SIGN (>)
                    // Emit token. Switch to data state.
                    Some('>') => {
                        self.emit_doctype_token();
                        self.state = State::Data;
                    }
                    // EOF
                    // Parse error. Switch to the data state. Emit DOCTYPE token. Reconsume the EOF
                    // character.
                    None => {
                        self.emit_error(ErrorKind::EofInDoctype);
                        self.state = State::Data;
                        self.emit_doctype_token();
                        self.reconsume();
                    }
                    // Anything else
                    // Append the current input character to the current DOCTYPE token's name.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.append_raw_to_doctype_token(c);
                        self.append_to_doctype_token(Some(c), None, None);
                    }
                }
            }
            State::AfterDoctypeName => {
                let cur_pos = self.input.cur_pos();

                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0009 CHARACTER TABULATION (tab)
                    // U+000A LINE FEED (LF)
                    // U+000C FORM FEED (FF)
                    // U+0020 SPACE
                    // Ignore the character.
                    Some(c) if is_whitespace(c) => {
                        self.append_raw_to_doctype_token(c);
                    }
                    // U+003E GREATER-THAN SIGN (>)
                    // Switch to the data state. Emit the current DOCTYPE token.
                    Some(c @ '>') => {
                        self.append_raw_to_doctype_token(c);
                        self.state = State::Data;
                        self.emit_doctype_token();
                    }
                    // U+005B LEFT SQUARE BRACKET ([)
                    // Switch to the doctype internal subset state.
                    Some(c @ '[') => {
                        self.append_raw_to_doctype_token(c);
                        self.state = State::DoctypeTypeInternalSubSet;
                    }
                    // EOF
                    // Parse error. Switch to the data state. Emit DOCTYPE token. Reconsume the EOF
                    // character.
                    None => {
                        self.emit_error(ErrorKind::EofInDoctype);
                        self.state = State::Data;
                        self.emit_doctype_token();
                        self.reconsume();
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
                        let mut first_six_chars = String::with_capacity(6);

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

                                if let Some(doctype_raw) = &mut self.doctype_raw {
                                    doctype_raw.push_str(&first_six_chars);
                                }
                            }
                            "system" => {
                                self.state = State::AfterDoctypeSystemKeyword;

                                if let Some(doctype_raw) = &mut self.doctype_raw {
                                    doctype_raw.push_str(&first_six_chars);
                                }
                            }
                            _ => {
                                self.cur_pos = cur_pos;
                                unsafe {
                                    // Safety: We got cur_pos from self.input.cur_pos()
                                    self.input.reset_to(cur_pos);
                                }
                                self.emit_error(
                                    ErrorKind::InvalidCharacterSequenceAfterDoctypeName,
                                );
                                self.reconsume_in_state(State::BogusDoctype);
                            }
                        }
                    }
                }
            }
            State::AfterDoctypePublicKeyword => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0009 CHARACTER TABULATION (Tab)
                    // U+000A LINE FEED (LF)
                    // U+000C FORM FEED (FF)
                    // U+0020 SPACE (Space)
                    // Switch to the before DOCTYPE public identifier state.
                    Some(c) if is_whitespace(c) => {
                        self.append_raw_to_doctype_token(c);
                        self.state = State::BeforeDoctypePublicIdentifier;
                    }
                    // U+0022 QUOTATION MARK (")
                    // This is a missing-whitespace-after-doctype-public-keyword parse error.
                    // Set the current DOCTYPE token's public identifier to the empty string
                    // (not missing), then switch to the DOCTYPE public identifier
                    // (double-quoted) state.
                    Some(c @ '"') => {
                        self.append_raw_to_doctype_token(c);
                        self.emit_error(ErrorKind::MissingWhitespaceAfterDoctypePublicKeyword);
                        self.set_doctype_token_public_id();
                        self.state = State::DoctypePublicIdentifierDoubleQuoted;
                    }
                    // U+0027 APOSTROPHE (')
                    // This is a missing-whitespace-after-doctype-public-keyword parse error.
                    // Set the current DOCTYPE token's public identifier to the empty string
                    // (not missing), then switch to the DOCTYPE public identifier
                    // (single-quoted) state.
                    Some(c @ '\'') => {
                        self.append_raw_to_doctype_token(c);
                        self.emit_error(ErrorKind::MissingWhitespaceAfterDoctypePublicKeyword);
                        self.set_doctype_token_public_id();
                        self.state = State::DoctypePublicIdentifierSingleQuoted;
                    }
                    // U+003E GREATER-THAN SIGN (>)
                    // This is a missing-doctype-public-identifier parse error. Set the current
                    // DOCTYPE token's force-quirks flag to on. Switch to the data state. Emit
                    // the current DOCTYPE token.
                    Some(c @ '>') => {
                        self.append_raw_to_doctype_token(c);
                        self.emit_error(ErrorKind::MissingWhitespaceAfterDoctypePublicKeyword);
                        self.set_doctype_token_public_id();
                        self.state = State::DoctypePublicIdentifierSingleQuoted;
                    }
                    // EOF
                    // Parse error. Switch to the data state. Emit that DOCTYPE token. Reconsume the
                    // EOF character.
                    None => {
                        self.emit_error(ErrorKind::EofInDoctype);
                        self.state = State::Data;
                        self.emit_doctype_token();
                        self.reconsume()
                    }
                    // Anything else
                    // Parse error. Switch to the bogus DOCTYPE state. Emit that DOCTYPE token.
                    // Reconsume the EOF character.
                    _ => {
                        self.emit_error(ErrorKind::MissingQuoteBeforeDoctypePublicIdentifier);
                        self.reconsume_in_state(State::BogusDoctype);
                        self.emit_doctype_token();
                        self.reconsume()
                    }
                }
            }
            State::AfterDoctypeSystemKeyword => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0009 CHARACTER TABULATION (tab)
                    // U+000A LINE FEED (LF)
                    // U+000C FORM FEED (FF)
                    // U+0020 SPACE
                    // Switch to the before DOCTYPE system identifier state.
                    Some(c) if is_whitespace(c) => {
                        self.append_raw_to_doctype_token(c);
                        self.state = State::BeforeDoctypeSystemIdentifier;
                    }
                    // U+0022 QUOTATION MARK (")
                    // This is a missing-whitespace-after-doctype-system-keyword parse error.
                    // Set the current DOCTYPE token's system identifier to the empty string
                    // (not missing), then switch to the DOCTYPE system identifier
                    // (double-quoted) state.
                    Some(c @ '"') => {
                        self.append_raw_to_doctype_token(c);
                        self.emit_error(ErrorKind::MissingWhitespaceAfterDoctypeSystemKeyword);
                        self.set_doctype_token_system_id();
                        self.state = State::DoctypeSystemIdentifierDoubleQuoted;
                    }
                    // U+0027 APOSTROPHE (')
                    // This is a missing-whitespace-after-doctype-system-keyword parse error.
                    // Set the current DOCTYPE token's system identifier to the empty string
                    // (not missing), then switch to the DOCTYPE system identifier
                    // (single-quoted) state.
                    Some(c @ '\'') => {
                        self.append_raw_to_doctype_token(c);
                        self.emit_error(ErrorKind::MissingWhitespaceAfterDoctypeSystemKeyword);
                        self.set_doctype_token_system_id();
                        self.state = State::DoctypeSystemIdentifierSingleQuoted;
                    }
                    // U+003E GREATER-THAN SIGN(>)
                    // Parse error. Set the DOCTYPE token’s public identifier current DOCTYPE token
                    // to the empty string (not missing), then switch to the DOCTYPE system
                    // identifier (single-quoted) state.
                    Some(c @ '>') => {
                        self.append_raw_to_doctype_token(c);
                        self.emit_error(ErrorKind::MissingWhitespaceAfterDoctypeSystemKeyword);
                        self.set_doctype_token_system_id();
                        self.state = State::DoctypeSystemIdentifierSingleQuoted;
                    }
                    // EOF
                    // Parse error. Switch to the data state. Emit that DOCTYPE token. Reconsume the
                    // EOF character.
                    None => {
                        self.emit_error(ErrorKind::EofInDoctype);
                        self.state = State::Data;
                        self.emit_doctype_token();
                        self.reconsume()
                    }
                    // Anything else
                    // Parse error. Switch to the bogus DOCTYPE state.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.emit_error(ErrorKind::MissingQuoteBeforeDoctypeSystemIdentifier);
                        self.state = State::BogusComment
                    }
                }
            }
            State::BeforeDoctypeSystemIdentifier => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0009 CHARACTER TABULATION (tab)
                    // U+000A LINE FEED (LF)
                    // U+000C FORM FEED (FF)
                    // U+0020 SPACE
                    // Ignore the character.
                    Some(c) if is_whitespace(c) => {
                        self.append_raw_to_doctype_token(c);
                    }
                    // U+0022 QUOTATION MARK (")
                    // Set the current DOCTYPE token's system identifier to the empty string
                    // (not missing), then switch to the DOCTYPE system identifier
                    // (double-quoted) state.
                    Some(c @ '"') => {
                        self.append_raw_to_doctype_token(c);
                        self.set_doctype_token_system_id();
                        self.state = State::DoctypeSystemIdentifierDoubleQuoted;
                    }
                    // U+0027 APOSTROPHE (')
                    // Set the current DOCTYPE token's system identifier to the empty string
                    // (not missing), then switch to the DOCTYPE system identifier
                    // (single-quoted) state.
                    Some(c @ '\'') => {
                        self.append_raw_to_doctype_token(c);
                        self.set_doctype_token_system_id();
                        self.state = State::DoctypeSystemIdentifierSingleQuoted;
                    }
                    // U+003E GREATER-THAN SIGN (>)
                    // This is a missing-doctype-system-identifier parse error. Set the current
                    // DOCTYPE token's force-quirks flag to on. Switch to the data state. Emit
                    // the current DOCTYPE token.
                    Some(c @ '>') => {
                        self.append_raw_to_doctype_token(c);
                        self.emit_error(ErrorKind::EofInDoctype);
                        self.state = State::Data;
                        self.emit_doctype_token();
                    }
                    // EOF
                    // Parse error. Switch to the data state. Emit DOCTYPE token. Reconsume the EOF
                    // character.
                    None => {
                        self.emit_error(ErrorKind::EofInDoctype);
                        self.state = State::Data;
                        self.emit_doctype_token();
                        self.reconsume();
                    }
                    // Anything else
                    // Parse error. Switch to the bogus DOCTYPE state.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.emit_error(ErrorKind::MissingQuoteBeforeDoctypeSystemIdentifier);
                        self.state = State::BogusDoctype;
                    }
                }
            }
            State::BeforeDoctypePublicIdentifier => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0009 CHARACTER TABULATION (tab)
                    // U+000A LINE FEED (LF)
                    // U+000C FORM FEED (FF)
                    // U+0020 SPACE
                    // Ignore the character.
                    Some(c) if is_whitespace(c) => {
                        self.append_raw_to_doctype_token(c);
                    }
                    // U+0022 QUOTATION MARK (")
                    // Set the current DOCTYPE token's public identifier to the empty string
                    // (not missing), then switch to the DOCTYPE public identifier
                    // (double-quoted) state.
                    Some(c @ '"') => {
                        self.append_raw_to_doctype_token(c);
                        self.set_doctype_token_public_id();
                        self.state = State::DoctypePublicIdentifierDoubleQuoted;
                    }
                    // U+0027 APOSTROPHE (')
                    // Set the current DOCTYPE token's public identifier to the empty string
                    // (not missing), then switch to the DOCTYPE public identifier
                    // (single-quoted) state.
                    Some(c @ '\'') => {
                        self.append_raw_to_doctype_token(c);
                        self.set_doctype_token_public_id();
                        self.state = State::DoctypePublicIdentifierSingleQuoted;
                    }
                    // U+003E GREATER-THAN SIGN(>)
                    // Parse error. Switch to data state. Emit current DOCTYPE token.
                    Some(c @ '>') => {
                        self.append_raw_to_doctype_token(c);
                        self.emit_error(ErrorKind::MissingDoctypePublicIdentifier);
                        self.state = State::Data;
                        self.emit_doctype_token();
                    }
                    // EOF
                    // This is an eof-in-doctype parse error. Set the current DOCTYPE token's
                    // force-quirks flag to on. Emit the current DOCTYPE token. Emit an
                    // end-of-file token.
                    None => {
                        self.emit_error(ErrorKind::EofInDoctype);
                        self.state = State::Data;
                        self.emit_doctype_token();
                        self.reconsume();
                    }
                    // Anything else
                    // Parse error. Switch to the bogus DOCTYPE state.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.emit_error(ErrorKind::MissingQuoteBeforeDoctypeSystemIdentifier);
                        self.state = State::BogusDoctype;
                    }
                }
            }
            State::DoctypePublicIdentifierSingleQuoted => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0027 APOSTROPHE (')
                    // Switch to the after DOCTYPE public identifier state.
                    Some(c @ '\'') => {
                        self.append_raw_to_doctype_token(c);
                        self.state = State::AfterDoctypePublicIdentifier;
                    }
                    // U+003E GREATER-THAN SIGN(>)
                    // Parse error. Switch to data state. Emit current DOCTYPE token.
                    Some(c @ '>') => {
                        self.append_raw_to_doctype_token(c);
                        self.emit_error(ErrorKind::AbruptDoctypePublicIdentifier);
                        self.state = State::Data;
                        self.emit_doctype_token();
                    }
                    // EOF
                    // Parse error. Switch to the data state. Emit DOCTYPE token. Reconsume the EOF
                    // character.
                    None => {
                        self.emit_error(ErrorKind::EofInDoctype);
                        self.state = State::Data;
                        self.emit_doctype_token();
                        self.reconsume();
                    }
                    // Anything else
                    // Append the current input character to the current DOCTYPE token’s public
                    // identifier.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.append_raw_to_doctype_token(c);
                        self.append_to_doctype_token(None, Some(c), None);
                    }
                }
            }
            State::DoctypePublicIdentifierDoubleQuoted => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0022 QUOTATION MARK (")
                    // Switch to the after DOCTYPE public identifier state.
                    Some(c @ '"') => {
                        self.append_raw_to_doctype_token(c);
                        self.state = State::AfterDoctypePublicIdentifier;
                    }
                    // U+003E GREATER-THAN SIGN(>)
                    // Parse error. Switch to data state. Emit current DOCTYPE token.
                    Some(c @ '>') => {
                        self.append_raw_to_doctype_token(c);
                        self.emit_error(ErrorKind::AbruptDoctypePublicIdentifier);
                        self.state = State::Data;
                        self.emit_doctype_token();
                    }
                    // EOF
                    // Parse error. Switch to the data state. Emit DOCTYPE token. Reconsume the EOF
                    // character.
                    None => {
                        self.emit_error(ErrorKind::EofInDoctype);
                        self.state = State::Data;
                        self.emit_doctype_token();
                        self.reconsume();
                    }
                    // Anything else
                    // Append the current input character to the current DOCTYPE token’s public
                    // identifier.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.append_raw_to_doctype_token(c);
                        self.append_to_doctype_token(None, Some(c), None);
                    }
                }
            }
            State::AfterDoctypePublicIdentifier => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0009 CHARACTER TABULATION (tab)
                    // U+000A LINE FEED (LF)
                    // U+000C FORM FEED (FF)
                    // U+0020 SPACE
                    // Switch to the between DOCTYPE public and system identifiers state.
                    Some(c) if is_whitespace(c) => {
                        self.append_raw_to_doctype_token(c);
                        self.state = State::BetweenDoctypePublicAndSystemIdentifiers;
                    }
                    // U+0027 APOSTROPHE (')
                    // Parse error. Set the DOCTYPE token’s system identifier to the empty string
                    // (not missing) then switch to the DOCTYPE system identifier (single-quoted)
                    // state.
                    Some(c @ '\'') => {
                        self.append_raw_to_doctype_token(c);
                        self.emit_error(
                            ErrorKind::MissingWhitespaceBetweenDoctypePublicAndSystemIdentifiers,
                        );
                        self.set_doctype_token_system_id();
                        self.state = State::DoctypeSystemIdentifierSingleQuoted;
                    }
                    // U+0022 QUOTATION MARK (")
                    // Parse error. Set the DOCTYPE token’s system identifier to the empty string
                    // (not missing) then switch to the DOCTYPE system identifier (double-quoted)
                    // state.
                    Some(c @ '"') => {
                        self.append_raw_to_doctype_token(c);
                        self.emit_error(
                            ErrorKind::MissingWhitespaceBetweenDoctypePublicAndSystemIdentifiers,
                        );
                        self.set_doctype_token_system_id();
                        self.state = State::DoctypeSystemIdentifierDoubleQuoted;
                    }
                    // U+003E GREATER-THAN SIGN (>)
                    // Switch to the data state. Emit the current DOCTYPE token.
                    Some(c @ '>') => {
                        self.append_raw_to_doctype_token(c);
                        self.state = State::Data;
                        self.emit_doctype_token();
                    }
                    // EOF
                    // Parse error. Switch to the data state. Emit DOCTYPE token. Reconsume the EOF
                    // character.
                    None => {
                        self.emit_error(ErrorKind::EofInDoctype);
                        self.state = State::Data;
                        self.emit_doctype_token();
                        self.reconsume();
                    }
                    // Anything else
                    // Parse error. Switch to bogus DOCTYPE state.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.emit_error(ErrorKind::MissingQuoteBeforeDoctypeSystemIdentifier);
                        self.state = State::BogusComment;
                    }
                }
            }
            State::BetweenDoctypePublicAndSystemIdentifiers => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0009 CHARACTER TABULATION (tab)
                    // U+000A LINE FEED (LF)
                    // U+000C FORM FEED (FF)
                    // U+0020 SPACE
                    // Ignore the character.
                    Some(c) if is_whitespace(c) => {
                        self.append_raw_to_doctype_token(c);
                    }
                    // U+003E GREATER-THAN SIGN (>)
                    // Switch to the data state. Emit the current DOCTYPE token.
                    Some(c @ '>') => {
                        self.append_raw_to_doctype_token(c);
                        self.state = State::Data;
                        self.emit_doctype_token();
                    }
                    // U+0027 APOSTROPHE(')
                    // Set the DOCTYPE token’s system identifier to the empty string (not missing)
                    // then switch to the DOCTYPE system identifier (single-quoted) state.
                    Some(c @ '\'') => {
                        self.append_raw_to_doctype_token(c);
                        self.set_doctype_token_system_id();
                        self.state = State::DoctypeSystemIdentifierSingleQuoted;
                    }
                    // U+0022 QUOTATION MARK(")
                    // Set the DOCTYPE token’s system identifier to the empty string (not missing)
                    // then switch to the DOCTYPE system identifier (double-quoted) state.
                    Some(c @ '"') => {
                        self.append_raw_to_doctype_token(c);
                        self.set_doctype_token_system_id();
                        self.state = State::DoctypeSystemIdentifierDoubleQuoted;
                    }
                    // EOF
                    // This is an eof-in-doctype parse error. Set the current DOCTYPE token's
                    // force-quirks flag to on. Emit the current DOCTYPE token. Emit an
                    // end-of-file token.
                    None => {
                        self.emit_error(ErrorKind::EofInDoctype);
                        self.state = State::Data;
                        self.emit_doctype_token();
                        self.reconsume();
                    }
                    // Anything else
                    // Parse error. Switch to Bogus DOCTYPE state.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.emit_error(ErrorKind::MissingQuoteBeforeDoctypeSystemIdentifier);
                        self.state = State::BogusDoctype;
                    }
                }
            }
            State::DoctypeSystemIdentifierSingleQuoted => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0027 APOSTROPHE (')
                    // Switch to the after DOCTYPE system identifier state.
                    Some(c @ '\'') => {
                        self.append_raw_to_doctype_token(c);
                        self.state = State::AfterDoctypeSystemIdentifier;
                    }
                    // U+003E GREATER-THAN SIGN (>)
                    // Parse error. Switch to data state. Emit current DOCTYPE token.
                    Some(c @ '>') => {
                        self.append_raw_to_doctype_token(c);
                        self.emit_error(ErrorKind::AbruptDoctypeSystemIdentifier);
                        self.state = State::Data;
                        self.emit_doctype_token();
                    }
                    // EOF
                    // Parse error. Switch to the data state. Emit DOCTYPE token. Reconsume the EOF
                    // character.
                    None => {
                        self.emit_error(ErrorKind::EofInDoctype);
                        self.state = State::Data;
                        self.emit_doctype_token();
                        self.reconsume();
                    }
                    // Anything else
                    // Append the current input character to the current DOCTYPE token's system
                    // identifier.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.append_raw_to_doctype_token(c);
                        self.append_to_doctype_token(None, None, Some(c));
                    }
                }
            }
            State::DoctypeSystemIdentifierDoubleQuoted => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0027 APOSTROPHE (')
                    // Switch to the after DOCTYPE system identifier state.
                    Some(c @ '"') => {
                        self.append_raw_to_doctype_token(c);
                        self.state = State::AfterDoctypeSystemIdentifier;
                    }
                    // U+003E GREATER-THAN SIGN (>)
                    // Parse error. Switch to data state. Emit current DOCTYPE token.
                    Some(c @ '>') => {
                        self.append_raw_to_doctype_token(c);
                        self.emit_error(ErrorKind::AbruptDoctypeSystemIdentifier);
                        self.state = State::Data;
                        self.emit_doctype_token();
                    }
                    // EOF
                    // Parse error. Switch to the data state. Emit DOCTYPE token. Reconsume the EOF
                    // character.
                    None => {
                        self.emit_error(ErrorKind::EofInDoctype);
                        self.state = State::Data;
                        self.emit_doctype_token();
                        self.reconsume();
                    }
                    // Anything else
                    // Append the current input character to the current DOCTYPE token's system
                    // identifier.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.append_raw_to_doctype_token(c);
                        self.append_to_doctype_token(None, None, Some(c));
                    }
                }
            }
            State::AfterDoctypeSystemIdentifier => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+0009 CHARACTER TABULATION (tab)
                    // U+000A LINE FEED (LF)
                    // U+000C FORM FEED (FF)
                    // U+0020 SPACE
                    // Ignore the character.
                    Some(c) if is_whitespace(c) => {
                        self.append_raw_to_doctype_token(c);
                    }
                    // U+003E GREATER-THAN SIGN (>)
                    // Switch to the data state. Emit the current DOCTYPE token.
                    Some(c @ '>') => {
                        self.append_raw_to_doctype_token(c);
                        self.state = State::Data;
                        self.emit_doctype_token();
                    }
                    // U+005B LEFT SQUARE BRACKET ([)
                    // Switch to the doctype internal subset state.
                    Some(c @ '[') => {
                        self.append_raw_to_doctype_token(c);
                        self.state = State::DoctypeTypeInternalSubSet;
                    }
                    // EOF
                    // Parse error. Switch to the data state. Emit DOCTYPE token. Reconsume the EOF
                    // character.
                    None => {
                        self.emit_error(ErrorKind::EofInDoctype);
                        self.state = State::Data;
                        self.emit_doctype_token();
                        self.reconsume();
                    }
                    // Anything else
                    // Parse error. Switch to Bogus DOCTYPE state.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.emit_error(ErrorKind::UnexpectedCharacterAfterDoctypeSystemIdentifier);
                        self.state = State::BogusDoctype;
                    }
                }
            }
            State::DoctypeTypeInternalSubSet => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+005D RIGHT SQUARE BRACKET (])
                    // Switch to the CDATA bracket state.
                    Some(c @ ']') => {
                        self.append_raw_to_doctype_token(c);
                        self.state = State::AfterDoctypeName;
                    }
                    // EOF
                    // Parse error. Switch to the data state. Emit DOCTYPE token. Reconsume the EOF
                    // character.
                    None => {
                        self.emit_error(ErrorKind::EofInDoctype);
                        self.state = State::Data;
                        self.emit_doctype_token();
                        self.reconsume();
                    }
                    // Anything else
                    // Append the current input character to the current DOCTYPE token's system
                    // identifier.
                    Some(c) => {
                        // TODO improve parse legacy declarations
                        self.validate_input_stream_character(c);
                        self.append_raw_to_doctype_token(c);
                    }
                }
            }
            State::BogusDoctype => {
                // Consume the next input character:
                match self.consume_next_char() {
                    // U+003E GREATER-THAN SIGN(>)
                    // Switch to data state. Emit DOCTYPE token.
                    Some(c @ '>') => {
                        self.append_raw_to_doctype_token(c);
                        self.state = State::Data;
                        self.emit_doctype_token();
                    }
                    // EOF
                    // Switch to the data state. Emit DOCTYPE token. Reconsume the EOF character.
                    None => {
                        self.state = State::Data;
                        self.emit_doctype_token();
                        self.reconsume();
                    }
                    // Anything else
                    // Ignore the character.
                    Some(c) => {
                        self.validate_input_stream_character(c);
                        self.append_raw_to_doctype_token(c);
                    }
                }
            }
        }

        Ok(())
    }

    #[inline(always)]
    fn skip_next_lf(&mut self, c: char) {
        if c == '\r' && self.input.cur() == Some('\n') {
            unsafe {
                // Safety: cur() is Some('\n')
                self.input.bump();
            }
        }
    }
}

// S ::=
// 	(#x20 | #x9 | #xD | #xA)+

#[inline(always)]
fn is_whitespace(c: char) -> bool {
    matches!(c, '\x20' | '\x09' | '\x0d' | '\x0a')
}

#[inline(always)]
fn is_control(c: u32) -> bool {
    matches!(c, c @ 0x00..=0x1f | c @ 0x7f..=0x9f if !matches!(c, 0x09 | 0x0a | 0x0c | 0x0d | 0x20))
}

#[inline(always)]
fn is_surrogate(c: u32) -> bool {
    matches!(c, 0xd800..=0xdfff)
}

// A noncharacter is a code point that is in the range U+FDD0 to U+FDEF,
// inclusive, or U+FFFE, U+FFFF, U+1FFFE, U+1FFFF, U+2FFFE, U+2FFFF, U+3FFFE,
// U+3FFFF, U+4FFFE, U+4FFFF, U+5FFFE, U+5FFFF, U+6FFFE, U+6FFFF, U+7FFFE,
// U+7FFFF, U+8FFFE, U+8FFFF, U+9FFFE, U+9FFFF, U+AFFFE, U+AFFFF, U+BFFFE,
// U+BFFFF, U+CFFFE, U+CFFFF, U+DFFFE, U+DFFFF, U+EFFFE, U+EFFFF, U+FFFFE,
// U+FFFFF, U+10FFFE, or U+10FFFF.
#[inline(always)]
fn is_noncharacter(c: u32) -> bool {
    matches!(
        c,
        0xfdd0
            ..=0xfdef
                | 0xfffe
                | 0xffff
                | 0x1fffe
                | 0x1ffff
                | 0x2fffe
                | 0x2ffff
                | 0x3fffe
                | 0x3ffff
                | 0x4fffe
                | 0x4ffff
                | 0x5fffe
                | 0x5ffff
                | 0x6fffe
                | 0x6ffff
                | 0x7fffe
                | 0x7ffff
                | 0x8fffe
                | 0x8ffff
                | 0x9fffe
                | 0x9ffff
                | 0xafffe
                | 0xaffff
                | 0xbfffe
                | 0xbffff
                | 0xcfffe
                | 0xcffff
                | 0xdfffe
                | 0xdffff
                | 0xefffe
                | 0xeffff
                | 0xffffe
                | 0xfffff
                | 0x10fffe
                | 0x10ffff,
    )
}

#[inline(always)]
fn is_ascii_upper_alpha(c: char) -> bool {
    c.is_ascii_uppercase()
}

#[inline(always)]
fn is_upper_hex_digit(c: char) -> bool {
    matches!(c, '0'..='9' | 'A'..='F')
}

#[inline(always)]
fn is_lower_hex_digit(c: char) -> bool {
    matches!(c, '0'..='9' | 'a'..='f')
}

// NameStartChar ::=
// ":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] |
// [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] |
// [#x2070-#x218F] | [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] |
// [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
#[inline(always)]
fn is_name_start_char(c: char) -> bool {
    match c {
        ':' | 'A'..='Z' | '_' | 'a'..='z' => true,
        _ if matches!(c as u32, 0xc0..=0xd6 | 0xd8..=0x2ff | 0x370..=0x37d | 0x37f..=0x1fff | 0x200c..=0x200d | 0x2070..=0x218f | 0x2c00..=0x2fef | 0x3001..=0xd7ff | 0xf900..=0xfdcf | 0xfdf0..=0xfffd | 0x10000..=0xeffff) => {
            true
        }
        _ => false,
    }
}

// NameChar	::=
// NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] |
// [#x203F-#x2040]
#[inline(always)]
fn is_name_char(c: char) -> bool {
    match c {
        '-' | '.' | '0'..='9' => true,
        _ if matches!(c as u32, 0xb7 | 0x0300..=0x036f | 0x203f..=0x2040) => true,
        _ if is_name_start_char(c) => true,
        _ => false,
    }
}
