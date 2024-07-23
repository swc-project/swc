#![allow(clippy::redundant_clone)]
#![allow(clippy::while_let_on_iterator)]

use std::{fs, mem::take, path::PathBuf};

use common::{document_span_visualizer, DomVisualizer};
use serde_json::Value;
use swc_atoms::JsWord;
use swc_common::{
    collections::AHashSet,
    input::{SourceFileInput, StringInput},
    BytePos,
};
use swc_html_ast::*;
use swc_html_parser::{
    error::ErrorKind,
    lexer::{Lexer, State},
    parser::{input::ParserInput, PResult, Parser, ParserConfig},
};
use swc_html_visit::VisitMutWith;
use testing::NormalizedOutput;

#[path = "common/mod.rs"]
mod common;

#[testing::fixture("tests/html5lib-tests-fixture/**/*.html")]
fn span_visualizer(input: PathBuf) {
    document_span_visualizer(input, Default::default(), true)
}

fn unescape(s: &str) -> Option<String> {
    let mut out = String::with_capacity(s.len());
    let mut it = s.chars().peekable();

    loop {
        match it.next() {
            None => return Some(out),
            Some('\\') => {
                if it.peek() != Some(&'u') {
                    panic!("can't understand escape");
                }

                let hex: String = it.by_ref().take(4).collect();

                match u32::from_str_radix(&hex, 16).ok().and_then(char::from_u32) {
                    // TODO fix me surrogate paris
                    // Some of the tests use lone surrogates, but we have no
                    // way to represent them in the UTF-8 input to our parser.
                    // Since these can only come from script, we will catch
                    // them there.
                    None => return None,
                    Some(c) => out.push(c),
                }
            }
            Some(c) => out.push(c),
        }
    }
}

// TODO we need to enable `preserve_order` for serde, but we can't https://github.com/tkaitchuck/aHash/issues/95, so we sort attributes
#[testing::fixture("tests/html5lib-tests/tokenizer/**/*.test")]
fn html5lib_test_tokenizer(input: PathBuf) {
    let filename = input.to_str().expect("failed to parse path");
    let contents = fs::read_to_string(filename).expect("Something went wrong reading the file");
    let obj: Value = serde_json::from_str(&contents).expect("json parse error");
    let tests = match obj.get("tests".to_string()) {
        Some(Value::Array(tests)) => tests,
        _ => return,
    };

    for test in tests.iter() {
        let description = test
            .get("description")
            .expect("failed to get input in test");

        let states = if let Some(initial_states) = test.get("initialStates") {
            let mut states = Vec::new();
            let json_states: Vec<String> = serde_json::from_value(initial_states.clone())
                .expect("failed to get input in test");

            for json_state in json_states {
                match &*json_state {
                    "Data state" => {
                        states.push(State::Data);
                    }
                    "PLAINTEXT state" => {
                        states.push(State::PlainText);
                    }
                    "RCDATA state" => {
                        states.push(State::Rcdata);
                    }
                    "RAWTEXT state" => {
                        states.push(State::Rawtext);
                    }
                    "Script data state" => {
                        states.push(State::ScriptData);
                    }
                    "CDATA section state" => {
                        states.push(State::CdataSection);
                    }
                    _ => {
                        unreachable!()
                    }
                }
            }

            states
        } else {
            vec![State::Data]
        };

        for state in states.iter() {
            eprintln!("==== ==== Description ==== ====\n{}\n", description);

            let json_input = test["input"].clone();
            let mut input: String =
                serde_json::from_value(json_input).expect("failed to get input in test");

            let need_double_escaped = test.get("doubleEscaped").is_some();

            if need_double_escaped {
                input = match unescape(&input) {
                    Some(unescaped) => unescaped,
                    _ => {
                        continue;
                    }
                };
            }

            eprintln!("==== ==== Input ==== ====\n{}\n", input);

            let json_output = test["output"].clone();
            let output = json_output.to_string();

            eprintln!("==== ==== Output ==== ====\n{}\n", output);

            let lexer_str_input = StringInput::new(&input, BytePos(0), BytePos(input.len() as u32));
            let mut lexer = Lexer::new(lexer_str_input);

            lexer.set_input_state(state.clone());

            if let Some(last_start_tag) = test.get("lastStartTag") {
                let last_start_tag: JsWord = serde_json::from_value(last_start_tag.clone())
                    .expect("failed to get lastStartTag in test");

                lexer.set_last_start_tag_name(&last_start_tag);
            }

            let mut actual_tokens = Vec::new();

            loop {
                let token_and_span = lexer.next();

                if token_and_span.is_none() {
                    break;
                }

                let mut new_token = token_and_span.unwrap().token.clone();

                match new_token {
                    Token::Doctype { ref mut raw, .. } => {
                        *raw = None;
                    }
                    Token::StartTag {
                        ref mut raw_tag_name,
                        ref mut attributes,
                        ..
                    } => {
                        *raw_tag_name = None;

                        let mut new_attributes = Vec::new();
                        let mut already_seen: AHashSet<JsWord> = Default::default();

                        for mut attribute in take(attributes) {
                            if already_seen.contains(&attribute.name) {
                                continue;
                            }

                            already_seen.insert(attribute.name.clone());

                            if attribute.value.is_none() {
                                attribute.value = Some("".into());
                            }

                            attribute.span = Default::default();
                            attribute.raw_name = None;
                            attribute.raw_value = None;

                            new_attributes.push(attribute);
                        }

                        new_attributes.sort_by(|a, b| a.name.partial_cmp(&b.name).unwrap());

                        *attributes = new_attributes;
                    }
                    Token::EndTag {
                        ref mut raw_tag_name,
                        ref mut attributes,
                        ref mut is_self_closing,
                        ..
                    } => {
                        *raw_tag_name = None;
                        *is_self_closing = false;
                        *attributes = Vec::new();
                    }
                    Token::Character { ref mut raw, .. } => {
                        *raw = None;
                    }
                    Token::Comment { ref mut raw, .. } => {
                        *raw = None;
                    }
                    _ => {}
                }

                actual_tokens.push(new_token);
            }

            let mut expected_tokens: Vec<Token> = Vec::new();

            if let Some(output_tokens) = json_output.as_array() {
                for output_token in output_tokens {
                    match output_token {
                        Value::Array(token_parts) => {
                            let tokens = match token_parts[0].as_str().expect("failed") {
                                "DOCTYPE" => {
                                    let name: Option<String> =
                                        serde_json::from_value(token_parts[1].clone())
                                            .expect("failed to deserialize");
                                    let public_id: Option<String> =
                                        serde_json::from_value(token_parts[2].clone())
                                            .expect("failed to deserialize");
                                    let system_id: Option<String> =
                                        serde_json::from_value(token_parts[3].clone())
                                            .expect("failed to deserialize");
                                    let correctness: bool =
                                        serde_json::from_value(token_parts[4].clone())
                                            .expect("failed to deserialize");

                                    vec![Token::Doctype {
                                        name: name.map(|v| v.into()),
                                        force_quirks: !correctness,
                                        public_id: public_id.map(|v| v.into()),
                                        system_id: system_id.map(|v| v.into()),
                                        raw: None,
                                    }]
                                }
                                "StartTag" => {
                                    let tag_name: String =
                                        serde_json::from_value(token_parts[1].clone())
                                            .expect("failed to deserialize");
                                    let mut attributes = Vec::new();

                                    if let Some(json_attributes) = token_parts.get(2) {
                                        let obj_attributes: Value =
                                            serde_json::from_value(json_attributes.clone())
                                                .expect("failed to deserialize");

                                        match obj_attributes {
                                            Value::Object(obj) => {
                                                for key in obj.keys() {
                                                    let json_value = obj.get(key).expect(
                                                        "failed to get value for  attribute",
                                                    );
                                                    let value: Option<String> =
                                                        serde_json::from_value(json_value.clone())
                                                            .expect("failed to deserialize");

                                                    attributes.push(AttributeToken {
                                                        span: Default::default(),
                                                        name: key.clone().into(),
                                                        raw_name: None,
                                                        value: value.map(|v| v.into()),
                                                        raw_value: None,
                                                    })
                                                }
                                            }
                                            _ => {
                                                unreachable!();
                                            }
                                        }
                                    }

                                    let mut is_self_closing = false;

                                    if let Some(json_is_self_closing) = token_parts.get(3) {
                                        let value: bool =
                                            serde_json::from_value(json_is_self_closing.clone())
                                                .expect("failed to deserialize");

                                        is_self_closing = value;
                                    }

                                    attributes.sort_by(|a, b| a.name.partial_cmp(&b.name).unwrap());

                                    vec![Token::StartTag {
                                        tag_name: tag_name.into(),
                                        raw_tag_name: None,
                                        is_self_closing,
                                        attributes,
                                    }]
                                }
                                "EndTag" => {
                                    let tag_name: String =
                                        serde_json::from_value(token_parts[1].clone())
                                            .expect("failed to deserialize");

                                    vec![Token::EndTag {
                                        tag_name: tag_name.into(),
                                        raw_tag_name: None,
                                        is_self_closing: false,
                                        attributes: Vec::new(),
                                    }]
                                }
                                "Character" => {
                                    let mut data: String =
                                        serde_json::from_value(token_parts[1].clone())
                                            .expect("failed to deserialize");

                                    if need_double_escaped {
                                        data = match unescape(&data) {
                                            Some(v) => v,
                                            _ => {
                                                continue;
                                            }
                                        };
                                    }

                                    let mut tokens = Vec::new();

                                    for c in data.chars() {
                                        tokens.push(Token::Character {
                                            value: c,
                                            raw: None,
                                        })
                                    }

                                    tokens
                                }
                                "Comment" => {
                                    let mut data: String =
                                        serde_json::from_value(token_parts[1].clone())
                                            .expect("failed to deserialize");

                                    if need_double_escaped {
                                        data = match unescape(&data) {
                                            Some(v) => v,
                                            _ => {
                                                continue;
                                            }
                                        };
                                    }

                                    vec![Token::Comment {
                                        data: data.into(),
                                        raw: None,
                                    }]
                                }
                                _ => {
                                    unreachable!("unknown token {}", token_parts[0])
                                }
                            };

                            expected_tokens.extend(tokens);
                        }
                        _ => {
                            unreachable!();
                        }
                    }
                }
            }

            let actual =
                serde_json::to_string(&actual_tokens).expect("failed to serialize actual tokens");
            let expected = serde_json::to_string(&expected_tokens)
                .expect("failed to serialize expected tokens");

            if let Some(json_errors) = test.get("errors") {
                let expected_errors = json_errors.as_array().expect("failed to deserialize error");
                let actual_errors = lexer.take_errors();

                eprintln!("==== ==== Errors ==== ====\n{:?}\n", actual_errors);

                assert_eq!(actual_errors.len(), expected_errors.len());

                for expected_error in expected_errors.iter() {
                    let obj_expected_code =
                        expected_error.as_object().expect("failed to get error");
                    let expected_code = match obj_expected_code.get("code") {
                        Some(expected_code) => match expected_code.as_str() {
                            Some("eof-in-doctype") => ErrorKind::EofInDoctype,
                            Some("eof-in-comment") => ErrorKind::EofInComment,
                            Some("eof-in-cdata") => ErrorKind::EofInCdata,
                            Some("eof-in-tag") => ErrorKind::EofInTag,
                            Some("eof-before-tag-name") => ErrorKind::EofBeforeTagName,
                            Some("eof-in-script-html-comment-like-text") => {
                                ErrorKind::EofInScriptHtmlCommentLikeText
                            }
                            Some("unknown-named-character-reference") => {
                                ErrorKind::UnknownNamedCharacterReference
                            }
                            Some("incorrectly-opened-comment") => {
                                ErrorKind::IncorrectlyOpenedComment
                            }
                            Some("abrupt-closing-of-empty-comment") => {
                                ErrorKind::AbruptClosingOfEmptyComment
                            }
                            Some("abrupt-doctype-public-identifier") => {
                                ErrorKind::AbruptDoctypePublicIdentifier
                            }
                            Some("abrupt-doctype-system-identifier") => {
                                ErrorKind::AbruptDoctypeSystemIdentifier
                            }
                            Some("absence-of-digits-in-numeric-character-reference") => {
                                ErrorKind::AbsenceOfDigitsInNumericCharacterReference
                            }
                            Some("surrogate-character-reference") => {
                                ErrorKind::SurrogateCharacterReference
                            }
                            Some("nested-comment") => ErrorKind::NestedComment,
                            Some("end-tag-with-trailing-solidus") => {
                                ErrorKind::EndTagWithTrailingSolidus
                            }
                            Some("null-character-reference") => ErrorKind::NullCharacterReference,
                            Some("cdata-in-html-content") => ErrorKind::CdataInHtmlContent,
                            Some("character-reference-outside-unicode-range") => {
                                ErrorKind::CharacterReferenceOutsideUnicodeRange
                            }
                            Some("control-character-in-input-stream") => {
                                ErrorKind::ControlCharacterInInputStream
                            }
                            Some("control-character-reference") => {
                                ErrorKind::ControlCharacterReference
                            }
                            Some("noncharacter-in-input-stream") => {
                                ErrorKind::NoncharacterInInputStream
                            }
                            Some("noncharacter-character-reference") => {
                                ErrorKind::NoncharacterCharacterReference
                            }
                            Some("unexpected-equals-sign-before-attribute-name") => {
                                ErrorKind::UnexpectedEqualsSignBeforeAttributeName
                            }
                            Some("unexpected-question-mark-instead-of-tag-name") => {
                                ErrorKind::UnexpectedQuestionMarkInsteadOfTagName
                            }
                            Some("unexpected-character-after-doctype-system-identifier") => {
                                ErrorKind::UnexpectedCharacterAfterDoctypeSystemIdentifier
                            }
                            Some("unexpected-null-character") => ErrorKind::UnexpectedNullCharacter,
                            Some("unexpected-solidus-in-tag") => ErrorKind::UnexpectedSolidusInTag,
                            Some("unexpected-character-in-attribute-name") => {
                                ErrorKind::UnexpectedCharacterInAttributeName
                            }
                            Some("unexpected-character-in-unquoted-attribute-value") => {
                                ErrorKind::UnexpectedCharacterInUnquotedAttributeValue
                            }
                            Some("duplicate-attribute") => ErrorKind::DuplicateAttribute,
                            Some("end-tag-with-attributes") => ErrorKind::EndTagWithAttributes,
                            Some("missing-whitespace-before-doctype-name") => {
                                ErrorKind::MissingWhitespaceBeforeDoctypeName
                            }
                            Some("missing-attribute-value") => ErrorKind::MissingAttributeValue,
                            Some("missing-doctype-public-identifier") => {
                                ErrorKind::MissingDoctypePublicIdentifier
                            }
                            Some("missing-end-tag-name") => ErrorKind::MissingEndTagName,
                            Some("missing-doctype-name") => ErrorKind::MissingDoctypeName,
                            Some("missing-doctype-system-identifier") => {
                                ErrorKind::MissingDoctypeSystemIdentifier
                            }
                            Some("missing-whitespace-after-doctype-system-keyword") => {
                                ErrorKind::MissingWhitespaceAfterDoctypeSystemKeyword
                            }
                            Some("missing-whitespace-after-doctype-public-keyword") => {
                                ErrorKind::MissingWhitespaceAfterDoctypePublicKeyword
                            }
                            Some("missing-quote-before-doctype-public-identifier") => {
                                ErrorKind::MissingQuoteBeforeDoctypePublicIdentifier
                            }
                            Some("missing-quote-before-doctype-system-identifier") => {
                                ErrorKind::MissingQuoteBeforeDoctypeSystemIdentifier
                            }
                            Some("incorrectly-closed-comment") => {
                                ErrorKind::IncorrectlyClosedComment
                            }
                            Some("invalid-character-sequence-after-doctype-name") => {
                                ErrorKind::InvalidCharacterSequenceAfterDoctypeName
                            }
                            Some(
                                "missing-whitespace-between-doctype-public-and-system-identifiers",
                            ) => {
                                ErrorKind::MissingWhitespaceBetweenDoctypePublicAndSystemIdentifiers
                            }
                            Some("missing-whitespace-between-attributes") => {
                                ErrorKind::MissingWhitespaceBetweenAttributes
                            }
                            Some("missing-semicolon-after-character-reference") => {
                                ErrorKind::MissingSemicolonAfterCharacterReference
                            }
                            Some("invalid-first-character-of-tag-name") => {
                                ErrorKind::InvalidFirstCharacterOfTagName
                            }
                            _ => {
                                unreachable!("unknown error {:?}", expected_code);
                            }
                        },
                        _ => {
                            unreachable!();
                        }
                    };

                    assert!(actual_errors
                        .iter()
                        .any(|error| *error.kind() == expected_code));
                }
            } else {
                let errors = lexer.take_errors();

                assert_eq!(errors.len(), 0);
            }

            assert_eq!(actual, expected);
        }
    }
}

enum TestState {
    Data,
    Document,
    DocumentFragment,
    Errors,
    NewErrors,
}

enum DocumentOrDocumentFragment {
    Document(PResult<Document>),
    DocumentFragment(PResult<DocumentFragment>),
}

#[testing::fixture("tests/html5lib-tests/tree-construction/**/*.dat")]
#[testing::fixture("tests/html5lib-tests-fixture/**/*.html")]
fn html5lib_test_tree_construction(input: PathBuf) {
    if input.extension().unwrap() == "dat" {
        let mut tree_construction_base = None;
        let mut tests_base = None;
        let mut path_buf = input.to_path_buf();

        while path_buf.pop() {
            if path_buf.ends_with("tree-construction") {
                tree_construction_base = Some(path_buf.clone());
            }

            if path_buf.ends_with("tests") {
                tests_base = Some(path_buf.clone());

                break;
            }
        }

        let tree_construction_base = tree_construction_base.unwrap();
        let relative_path_to_test = input
            .strip_prefix(tree_construction_base)
            .expect("failed to get relative filename")
            .to_str()
            .unwrap()
            .replace(['/', '\\', '.'], "_");
        let tests_base = tests_base.unwrap();

        let dir = tests_base.join("html5lib-tests-fixture");

        fs::create_dir_all(dir.clone()).expect("failed to create directory for fixtures");

        let tests_file = fs::read_to_string(input).expect("Something went wrong reading the file");
        let mut tests = tests_file.split("#data\n");

        tests.next();

        let mut counter = 0;

        while let Some(test) = tests.next() {
            let mut data: Vec<&str> = Vec::new();
            let mut document: Vec<&str> = Vec::new();
            let mut document_fragment: Vec<&str> = Vec::new();
            let mut errors: Vec<&str> = Vec::new();
            let mut new_errors: Vec<&str> = Vec::new();
            let mut scripting_enabled = false;

            let mut state = Some(TestState::Data);
            let lines = test.lines();

            for line in lines {
                match line {
                    "#data" => {
                        state = Some(TestState::Data);

                        continue;
                    }
                    "#errors" => {
                        state = Some(TestState::Errors);

                        continue;
                    }
                    "#new-errors" => {
                        state = Some(TestState::NewErrors);

                        continue;
                    }
                    "#document" => {
                        state = Some(TestState::Document);

                        continue;
                    }
                    "#document-fragment" => {
                        state = Some(TestState::DocumentFragment);

                        continue;
                    }
                    "#script-on" => {
                        scripting_enabled = true;

                        state = None;

                        continue;
                    }
                    "#script-off" => {
                        scripting_enabled = false;

                        state = None;

                        continue;
                    }
                    _ => {}
                }

                match &state {
                    Some(TestState::Data) => {
                        data.push(line);
                    }
                    Some(TestState::Document) => {
                        document.push(line);
                    }
                    Some(TestState::DocumentFragment) => {
                        document_fragment.push(line);
                    }
                    Some(TestState::Errors) => {
                        errors.push(line);
                    }
                    Some(TestState::NewErrors) => {
                        new_errors.push(line);
                    }
                    _ => {
                        unreachable!();
                    }
                }
            }

            let mut file_stem = relative_path_to_test.to_string();

            file_stem.push('.');
            file_stem.push_str(&counter.to_string());

            // TODO workaround, fix - https://github.com/html5lib/html5lib-tests/pull/151
            let need_skip_fragment =
                relative_path_to_test.contains("template_dat") && matches!(counter, 109..=111);

            if !need_skip_fragment && !document_fragment.is_empty() {
                file_stem += ".fragment_";
                file_stem += &document_fragment.join("").replace(' ', "_");
            }

            if scripting_enabled {
                file_stem += ".script_on";
            }

            let mut html_path = dir.clone();

            html_path.push(file_stem.clone() + ".html");

            fs::write(html_path, data.join("\n"))
                .expect("Something went wrong when writing to the file {:?}");

            let mut dom_snapshot_path = dir.clone();

            dom_snapshot_path.push(file_stem.clone() + ".dom.rust-debug");

            let mut dom = document.join("\n");

            if !dom.ends_with('\n') {
                dom.push('\n');
            }

            fs::write(dom_snapshot_path, dom)
                .expect("Something went wrong when writing to the file");

            let errors = errors.join("\n");
            let mut errors_snapshot_path = dir.clone();

            errors_snapshot_path.push(file_stem.clone() + ".output.stderr");

            fs::write(errors_snapshot_path, errors)
                .expect("Something went wrong when writing to the file");

            counter += 1;
        }

        return;
    }

    testing::run_test2(false, |cm, handler| {
        // Type annotation
        if false {
            return Ok(());
        }

        let fm = cm.load_file(&input).unwrap();

        let file_name = input.file_name().unwrap().to_string_lossy();
        let scripting_enabled = file_name.contains("script_on");

        let lexer = Lexer::new(SourceFileInput::from(&*fm));
        let config = ParserConfig {
            scripting_enabled,
            iframe_srcdoc: false,
            allow_self_closing: false,
        };
        let mut parser = Parser::new(lexer, config);

        let document_or_document_fragment = if file_name.contains("fragment") {
            let mut context_element_namespace = Namespace::HTML;
            let mut context_element_tag_name = "unknown";
            let mut splitted = file_name.split('.');
            let index = splitted.clone().count() - 2;

            let context_element = splitted
                .nth(index)
                .expect("failed to get context element from filename")
                .replace("fragment_", "");

            if context_element.contains('_') {
                let mut splited = context_element.split('_');

                if let Some(namespace) = splited.next() {
                    context_element_namespace = match namespace {
                        "math" => Namespace::MATHML,
                        "svg" => Namespace::SVG,
                        _ => {
                            unreachable!();
                        }
                    };
                }

                if let Some(tag_name) = splited.next() {
                    context_element_tag_name = tag_name;
                }
            } else {
                context_element_tag_name = &context_element;
            }

            let context_element = Element {
                span: Default::default(),
                namespace: context_element_namespace,
                tag_name: context_element_tag_name.into(),
                attributes: Vec::new(),
                is_self_closing: false,
                children: Vec::new(),
                content: None,
            };

            DocumentOrDocumentFragment::DocumentFragment(parser.parse_document_fragment(
                context_element,
                DocumentMode::NoQuirks,
                None,
            ))
        } else {
            DocumentOrDocumentFragment::Document(parser.parse_document())
        };

        // `scripted` for browser tests with JS
        // `search` proposed, but not merged in spec
        let need_skip_tests = file_name.contains("scripted") || file_name.contains("search");

        if !need_skip_tests {
            let errors = parser.take_errors();
            let errors_path = input.with_extension("output.stderr");

            let contents =
                fs::read_to_string(errors_path).expect("Something went wrong reading the file");

            // TODO bug in tests - https://github.com/html5lib/html5lib-tests/issues/138
            let actual_number_of_errors = if file_name.contains("tests19_dat.84") {
                errors.len() + 1
            } else if file_name.contains("math_dat.5.fragment_tbody")
                || file_name.contains("math_dat.6.fragment_tbody")
                || file_name.contains("math_dat.7.fragment_tbody")
                || file_name.contains("svg_dat.5.fragment_tbody")
                || file_name.contains("svg_dat.6.fragment_tbody")
                || file_name.contains("svg_dat.7.fragment_tbody")
                || file_name.contains("foreign-fragment_dat.3.fragment_svg_path")
            {
                errors.len() - 1
            } else {
                errors.len()
            };

            let expected_number_of_errors = contents.lines().count();

            assert_eq!(actual_number_of_errors, expected_number_of_errors);
        }

        let json_path = input.with_extension("output.json");

        match document_or_document_fragment {
            DocumentOrDocumentFragment::Document(Ok(mut document)) => {
                let actual_json = serde_json::to_string_pretty(&document)
                    .map(NormalizedOutput::from)
                    .expect("failed to serialize document");

                actual_json.compare_to_file(&json_path).unwrap();

                if file_name.contains("scripted") || file_name.contains("search") {
                    return Ok(());
                }

                let mut dom_buf = String::new();

                document.visit_mut_with(&mut DomVisualizer {
                    dom_buf: &mut dom_buf,
                    indent: 0,
                });

                NormalizedOutput::from(dom_buf)
                    .compare_to_file(input.with_extension("dom.rust-debug"))
                    .unwrap();

                Ok(())
            }
            DocumentOrDocumentFragment::DocumentFragment(Ok(mut document_fragment)) => {
                let actual_json = serde_json::to_string_pretty(&document_fragment)
                    .map(NormalizedOutput::from)
                    .expect("failed to serialize document");

                actual_json.compare_to_file(&json_path).unwrap();

                if need_skip_tests {
                    return Ok(());
                }

                let mut dom_buf = String::new();

                document_fragment.visit_mut_with(&mut DomVisualizer {
                    dom_buf: &mut dom_buf,
                    indent: 0,
                });

                NormalizedOutput::from(dom_buf)
                    .compare_to_file(input.with_extension("dom.rust-debug"))
                    .unwrap();

                Ok(())
            }
            DocumentOrDocumentFragment::Document(Err(err))
            | DocumentOrDocumentFragment::DocumentFragment(Err(err)) => {
                let mut d = err.to_diagnostics(&handler);

                d.note(&format!("current token = {}", parser.dump_cur()));
                d.emit();

                panic!();
            }
        }
    })
    .unwrap();
}
