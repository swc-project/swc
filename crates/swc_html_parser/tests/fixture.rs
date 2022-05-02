#![allow(clippy::needless_update)]

use std::{fs, path::PathBuf};

use swc_common::{errors::Handler, input::SourceFileInput, Spanned};
use serde_json::{Map, Value};
use swc_common::{errors::Handler, input::SourceFileInput, Span, Spanned};
use serde_json::Value;
use swc_common::{
    errors::Handler,
    input::{SourceFileInput, StringInput},
    BytePos, Span, Spanned,
};
use swc_html_ast::*;
use swc_html_parser::{
    error::ErrorKind,
    lexer::{Lexer, State},
    parser::{input::ParserInput, PResult, Parser, ParserConfig},
};
use swc_html_visit::{Visit, VisitWith};
use testing::NormalizedOutput;

fn test_pass(input: PathBuf, config: ParserConfig) {
    testing::run_test2(false, |cm, handler| {
        let json_path = input.parent().unwrap().join("output.json");
        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm), config);
        let mut parser = Parser::new(lexer, config);
        let document: PResult<Document> = parser.parse_document();
        let errors = parser.take_errors();

        for err in &errors {
            err.to_diagnostics(&handler).emit();
        }

        if !errors.is_empty() {
            return Err(());
        }

        match document {
            Ok(document) => {
                let actual_json = serde_json::to_string_pretty(&document)
                    .map(NormalizedOutput::from)
                    .expect("failed to serialize document");

                actual_json.compare_to_file(&json_path).unwrap();

                Ok(())
            }
            Err(err) => {
                let mut d = err.to_diagnostics(&handler);

                d.note(&format!("current token = {}", parser.dump_cur()));
                d.emit();

                Err(())
            }
        }
    })
    .unwrap();
}

fn test_recovery(input: PathBuf, config: ParserConfig) {
    let stderr_path = input.parent().unwrap().join("output.stderr");
    let mut recovered = false;

    let stderr = testing::run_test2(false, |cm, handler| {
        // Type annotation
        if false {
            return Ok(());
        }

        let json_path = input.parent().unwrap().join("output.json");
        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm), config);
        let mut parser = Parser::new(lexer, config);
        let document: PResult<Document> = parser.parse_document();
        let errors = parser.take_errors();

        for err in &errors {
            err.to_diagnostics(&handler).emit();
        }

        if !errors.is_empty() {
            recovered = true;
        }

        match document {
            Ok(document) => {
                let actual_json = serde_json::to_string_pretty(&document)
                    .map(NormalizedOutput::from)
                    .expect("failed to serialize document");

                actual_json.compare_to_file(&json_path).unwrap();

                Err(())
            }
            Err(err) => {
                let mut d = err.to_diagnostics(&handler);

                d.note(&format!("current token = {}", parser.dump_cur()));
                d.emit();

                Err(())
            }
        }
    })
    .unwrap_err();

    if !recovered {
        panic!(
            "Parser should emit errors (recover mode), but parser parsed everything successfully \
             {}",
            stderr
        );
    }

    stderr.compare_to_file(&stderr_path).unwrap();
}

struct SpanVisualizer<'a> {
    handler: &'a Handler,
}

macro_rules! mtd {
    ($T:ty,$name:ident) => {
        fn $name(&mut self, n: &$T) {
            self.handler
                .struct_span_err(n.span(), stringify!($T))
                .emit();

            n.visit_children_with(self);
        }
    };
}

impl Visit for SpanVisualizer<'_> {
    mtd!(Document, visit_document);

    mtd!(DocumentFragment, visit_document_fragment);

    mtd!(Child, visit_child);

    mtd!(DocumentType, visit_document_type);

    mtd!(Element, visit_element);

    mtd!(Attribute, visit_attribute);

    mtd!(Text, visit_text);

    mtd!(Comment, visit_comment);

    fn visit_token_and_span(&mut self, n: &TokenAndSpan) {
        self.handler
            .struct_span_err(n.span, &format!("{:?}", n.token))
            .emit();
    }
}

fn test_span_visualizer(input: PathBuf, config: ParserConfig) {
    let dir = input.parent().unwrap().to_path_buf();

    let output = testing::run_test2(false, |cm, handler| {
        // Type annotation
        if false {
            return Ok(());
        }

        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm), config);
        let mut parser = Parser::new(lexer, config);

        let document: PResult<Document> = parser.parse_document();

        match document {
            Ok(document) => {
                document.visit_with(&mut SpanVisualizer { handler: &handler });

                Err(())
            }
            Err(err) => {
                let mut d = err.to_diagnostics(&handler);

                d.note(&format!("current token = {}", parser.dump_cur()));
                d.emit();

                panic!();
            }
        }
    })
    .unwrap_err();

    output
        .compare_to_file(&dir.join("span.rust-debug"))
        .unwrap();
}

#[testing::fixture("tests/fixture/**/input.html")]
fn pass(input: PathBuf) {
    test_pass(
        input,
        ParserConfig {
            ..Default::default()
        },
    )
}

#[testing::fixture("tests/recovery/**/input.html")]
fn recovery(input: PathBuf) {
    test_recovery(
        input,
        ParserConfig {
            ..Default::default()
        },
    )
}

#[testing::fixture("tests/fixture/**/input.html")]
#[testing::fixture("tests/recovery/**/input.html")]
fn span_visualizer(input: PathBuf) {
    test_span_visualizer(
        input,
        ParserConfig {
            ..Default::default()
        },
    )
// fn make_test(input: String, expect: Value, opts: TokenizerOpts) ->
// TestDescAndFn {     let splitted = splits(&input, 3);
//
//     for input in splitted.into_iter() {
//         let output = tokenize(input.clone(), opts.clone());
//         let expect_toks = json_to_tokens(&expect, opts.exact_errors);
//
//         if output != expect_toks {
//             panic!(
//                 "\ninput: {:?}\ngot: {:?}\nexpected: {:?}",
//                 input, output, expect
//             );
//         }
//     }
// }
static IGNORED_TOKENIZER_TESTS: &[&str] = &[
    "Repeated attr",
    "Start tag in script HTML comment",
    "End tag in script HTML comment",
    "- in script HTML comment double escaped",
    "-- in script HTML comment double escaped",
    "--- in script HTML comment double escaped",
    "- spaced in script HTML comment double escaped",
    "-- spaced in script HTML comment double escaped",
    "--- spaced in script HTML comment double escaped",
    "Entity without trailing semicolon (1)",
    "Entity without trailing semicolon (2)",
    "Entity in attribute without semicolon ending in x",
    "Entity in attribute without semicolon ending in 1",
    "Entity in attribute without semicolon ending in i",
    "Duplicate different-case attributes",
    "Doctype html x>text",
    "EOF in script HTML comment double escaped after dash",
    "EOF in script HTML comment double escaped after dash dash",
    "EOF in script HTML comment - double escaped",
    "</script> in script HTML comment - double escaped",
    "</script> in script HTML comment - double escaped with nested <script>",
    "</script> in script HTML comment - double escaped with abrupt end",
    "Incomplete end tag in script HTML comment double escaped",
    "Unclosed end tag in script HTML comment double escaped",
    "<a a A>",
    "<a a a>",
    "<a a=''A>",
    "<a a=''a>",
    "Undefined named entity in a double-quoted attribute value ending in semicolon and whose name \
     starts with a known entity name.",
    "Undefined named entity in a single-quoted attribute value ending in semicolon and whose name \
     starts with a known entity name.",
    "Undefined named entity in an unquoted attribute value ending in semicolon and whose name \
     starts with a known entity name.",
];

#[testing::fixture("tests/html5lib-tests/tokenizer/**/*.test")]
fn html5lib_test_tokenizer(input: PathBuf) {
    let filename = input.to_str().expect("failed to parse path");
    let contents = fs::read_to_string(filename).expect("Something went wrong reading the file");
    let obj: Value = serde_json::from_str(&contents)
        .ok()
        .expect("json parse error");

    match obj.get(&"tests".to_string()) {
        Some(&Value::Array(ref list)) => {
            for test in list.iter() {
                let description = test
                    .get("description")
                    .expect("failed to get input in test");

                if IGNORED_TOKENIZER_TESTS
                    .contains(&description.as_str().expect("failed to convert to str"))
                {
                    continue;
                }

                let states = if let Some(initial_states) = test.get("initialStates") {
                    let mut states = vec![];
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
                    let input: String =
                        serde_json::from_value(json_input).expect("failed to get input in test");

                    if let Some(double_escaped) = test.get("doubleEscaped") {
                        // TODO handle `doubleEscaped`
                        continue;
                    }

                    eprintln!("==== ==== Input ==== ====\n{}\n", input);

                    let json_output = test["output"].clone();
                    let output = json_output.to_string();

                    eprintln!("==== ==== Output ==== ====\n{}\n", output);

                    // TODO keep `\r` in raw when we implement it
                    let lexer_input = input.replace("\r\n", "\n").replace('\r', "\n");
                    let mut lexer = Lexer::new(
                        StringInput::new(&lexer_input, BytePos(0), BytePos(input.len() as u32)),
                        ParserConfig {
                            ..Default::default()
                        },
                    );

                    lexer.set_input_state(state.clone());

                    if let Some(last_start_tag) = test.get("lastStartTag") {
                        let last_start_tag: String = serde_json::from_value(last_start_tag.clone())
                            .expect("failed to get lastStartTag in test");

                        lexer.last_start_tag_token = Some(Token::StartTag {
                            tag_name: last_start_tag.into(),
                            raw_tag_name: None,
                            self_closing: false,
                            attributes: vec![],
                        });
                    }

                    let mut actual_tokens = vec![];

                    loop {
                        match lexer.next() {
                            Ok(TokenAndSpan { token, .. }) => {
                                let mut new_token = token.clone();

                                match new_token {
                                    Token::Doctype {
                                        ref mut raw_keyword,
                                        ref mut raw_name,
                                        ref mut public_quote,
                                        ref mut raw_public_keyword,
                                        ref mut system_quote,
                                        ref mut raw_system_keyword,
                                        ..
                                    } => {
                                        *raw_keyword = None;
                                        *raw_name = None;
                                        *public_quote = None;
                                        *raw_public_keyword = None;
                                        *system_quote = None;
                                        *raw_system_keyword = None;
                                    }
                                    Token::StartTag {
                                        ref mut raw_tag_name,
                                        ref mut attributes,
                                        ..
                                    } => {
                                        *raw_tag_name = None;

                                        // TODO we need to enable `preserve_order` for serde,
                                        // but we can't https://github.com/tkaitchuck/aHash/issues/95
                                        attributes
                                            .sort_by(|a, b| a.name.partial_cmp(&b.name).unwrap());

                                        for attribute in attributes {
                                            if attribute.value.is_none() {
                                                attribute.value = Some("".into());
                                            }

                                            attribute.raw_name = None;
                                            attribute.raw_value = None;
                                        }
                                    }
                                    Token::EndTag {
                                        ref mut raw_tag_name,
                                        ref mut attributes,
                                        ref mut self_closing,
                                        ..
                                    } => {
                                        *raw_tag_name = None;
                                        *self_closing = false;
                                        *attributes = vec![];
                                    }
                                    Token::Character { ref mut raw, .. } => {
                                        *raw = None;
                                    }
                                    _ => {}
                                }

                                actual_tokens.push(new_token);
                            }
                            Err(error) => match error.kind() {
                                ErrorKind::Eof => {
                                    break;
                                }
                                _ => {
                                    unreachable!();
                                }
                            },
                        };
                    }

                    let mut expected_tokens: Vec<Token> = vec![];

                    for output_tokens in json_output.as_array() {
                        for output_token in output_tokens {
                            match output_token {
                                Value::Array(token_parts) => {
                                    let tokens = match &*token_parts[0].as_str().expect("failed") {
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
                                                raw_keyword: None,
                                                name: name.map(|v| v.into()),
                                                raw_name: None,
                                                force_quirks: !correctness,
                                                raw_public_keyword: None,
                                                public_quote: None,
                                                public_id: public_id.map(|v| v.into()),
                                                raw_system_keyword: None,
                                                system_quote: None,
                                                system_id: system_id.map(|v| v.into()),
                                            }]
                                        }
                                        "StartTag" => {
                                            let tag_name: String =
                                                serde_json::from_value(token_parts[1].clone())
                                                    .expect("failed to deserialize");
                                            let mut attributes = vec![];

                                            if let Some(json_attributes) =
                                                token_parts.get(2).clone()
                                            {
                                                let obj_attributes: Value =
                                                    serde_json::from_value(json_attributes.clone())
                                                        .expect("failed to deserialize");

                                                match obj_attributes {
                                                    Value::Object(obj) => {
                                                        for key in obj.keys() {
                                                            let json_value = obj.get(key).expect(
                                                                "failed to get value for  \
                                                                 attribute",
                                                            );
                                                            let value: Option<String> =
                                                                serde_json::from_value(
                                                                    json_value.clone(),
                                                                )
                                                                .expect("failed to deserialize");

                                                            attributes.push(AttributeToken {
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

                                            let mut self_closing = false;

                                            if let Some(json_self_closing) =
                                                token_parts.get(3).clone()
                                            {
                                                let value: bool = serde_json::from_value(
                                                    json_self_closing.clone(),
                                                )
                                                .expect("failed to deserialize");

                                                self_closing = value;
                                            }

                                            // TODO we need to enable `preserve_order` for serde,
                                            // but we can't https://github.com/tkaitchuck/aHash/issues/95
                                            attributes.sort_by(|a, b| {
                                                a.name.partial_cmp(&b.name).unwrap()
                                            });

                                            vec![Token::StartTag {
                                                tag_name: tag_name.into(),
                                                raw_tag_name: None,
                                                self_closing,
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
                                                self_closing: false,
                                                attributes: vec![],
                                            }]
                                        }
                                        "Character" => {
                                            let characters: String =
                                                serde_json::from_value(token_parts[1].clone())
                                                    .expect("failed to deserialize");

                                            let mut value = vec![];

                                            for c in characters.chars() {
                                                value.push(Token::Character {
                                                    value: c,
                                                    raw: None,
                                                })
                                            }

                                            value
                                        }
                                        "Comment" => {
                                            let data: String =
                                                serde_json::from_value(token_parts[1].clone())
                                                    .expect("failed to deserialize");

                                            vec![Token::Comment { data: data.into() }]
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

                    let expected = serde_json::to_string(&expected_tokens)
                        .expect("failed to serialize expected tokens");
                    let actual = serde_json::to_string(&actual_tokens)
                        .expect("failed to serialize actual tokens");

                    if let Some(_errors) = test.get("errors") {
                        // TODO test errors
                    }

                    assert_eq!(expected, actual);
                }
            }
        }

        _ => {}
    }
}
