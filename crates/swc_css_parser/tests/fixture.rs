use std::path::PathBuf;
use swc_common::{errors::Handler, input::SourceFileInput, Span, Spanned, DUMMY_SP};
use swc_css_ast::*;
use swc_css_parser::{
    error::ErrorKind,
    lexer::Lexer,
    parse_tokens,
    parser::{input::ParserInput, Parser, ParserConfig},
};
use swc_css_visit::{Node, Visit, VisitWith};
use testing::NormalizedOutput;

struct AssertValid;

impl Visit for AssertValid {
    fn visit_pseudo_selector(&mut self, s: &PseudoSelector, _: &dyn Node) {
        s.visit_children_with(self);

        if s.args.tokens.is_empty() {
            return;
        }

        match &s.args.tokens[0].token {
            Token::Colon | Token::Num { .. } => return,
            _ => {}
        }

        let mut errors = vec![];

        let _selectors: SelectorList = parse_tokens(
            &s.args,
            ParserConfig {
                parse_values: true,

                ..Default::default()
            },
            &mut errors,
        )
        .unwrap_or_else(|err| panic!("failed to parse tokens: {:?}\n{:?}", err, s.args));

        for err in errors {
            panic!("{:?}", err);
        }
    }
}

#[testing::fixture("tests/fixture/**/input.css")]
fn tokens_input(input: PathBuf) {
    eprintln!("Input: {}", input.display());

    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();

        let tokens = {
            let mut lexer = Lexer::new(SourceFileInput::from(&*fm), Default::default());

            let mut tokens = vec![];

            while let Ok(t) = lexer.next() {
                tokens.push(t);
            }
            Tokens {
                span: Span::new(fm.start_pos, fm.end_pos, Default::default()),
                tokens,
            }
        };

        let mut errors = vec![];
        let ss: Stylesheet = parse_tokens(
            &tokens,
            ParserConfig {
                parse_values: true,

                ..Default::default()
            },
            &mut errors,
        )
        .expect("failed to parse tokens");

        for err in errors {
            err.to_diagnostics(&handler).emit();
        }

        ss.visit_with(&Invalid { span: DUMMY_SP }, &mut AssertValid);

        if handler.has_errors() {
            return Err(());
        }

        Ok(())
    })
    .unwrap();
}

fn test_pass(input: PathBuf, config: ParserConfig) {
    eprintln!("Input: {}", input.display());

    testing::run_test2(false, |cm, handler| {
        let ref_json_path = input.parent().unwrap().join("output.json");

        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm), config);
        let mut parser = Parser::new(lexer, config);

        let stylesheet = parser.parse_all();

        match stylesheet {
            Ok(stylesheet) => {
                let actual_json = serde_json::to_string_pretty(&stylesheet)
                    .map(NormalizedOutput::from)
                    .expect("failed to serialize stylesheet");

                actual_json.clone().compare_to_file(&ref_json_path).unwrap();

                if !config.allow_wrong_line_comments {
                    let mut lexer = Lexer::new(SourceFileInput::from(&*fm), Default::default());
                    let mut tokens = Tokens {
                        span: Span::new(fm.start_pos, fm.end_pos, Default::default()),
                        tokens: vec![],
                    };

                    loop {
                        let res = lexer.next();
                        match res {
                            Ok(t) => {
                                tokens.tokens.push(t);
                            }

                            Err(e) => {
                                if matches!(e.kind(), ErrorKind::Eof) {
                                    break;
                                }
                                panic!("failed to lex tokens: {:?}", e)
                            }
                        }
                    }

                    let mut errors = vec![];
                    let ss_tok: Stylesheet = parse_tokens(
                        &tokens,
                        ParserConfig {
                            parse_values: true,

                            ..Default::default()
                        },
                        &mut errors,
                    )
                    .expect("failed to parse token");

                    for err in errors {
                        err.to_diagnostics(&handler).emit();
                    }

                    let json_from_tokens = serde_json::to_string_pretty(&ss_tok)
                        .map(NormalizedOutput::from)
                        .expect("failed to serialize stylesheet from tokens");

                    assert_eq!(actual_json, json_from_tokens);
                }

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

#[testing::fixture("tests/fixture/**/input.css")]
fn pass(input: PathBuf) {
    test_pass(
        input,
        ParserConfig {
            parse_values: true,
            ..Default::default()
        },
    )
}

#[testing::fixture("tests/line-comment/**/input.css")]
fn line_commetns(input: PathBuf) {
    test_pass(
        input,
        ParserConfig {
            parse_values: true,
            allow_wrong_line_comments: true,
            ..Default::default()
        },
    )
}

#[testing::fixture("tests/recovery/**/input.css")]
fn recovery(input: PathBuf) {
    eprintln!("Input: {}", input.display());
    let stderr_path = input.parent().unwrap().join("output.swc-stderr");

    let mut errored = false;

    let stderr = testing::run_test2(false, |cm, handler| {
        if false {
            // For type inference
            return Ok(());
        }

        let ref_json_path = input.parent().unwrap().join("output.json");

        let config = ParserConfig {
            parse_values: true,
            allow_wrong_line_comments: false,
        };
        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm), config);
        let mut parser = Parser::new(lexer, config);

        let stylesheet = parser.parse_all();

        match stylesheet {
            Ok(stylesheet) => {
                let actual_json = serde_json::to_string_pretty(&stylesheet)
                    .map(NormalizedOutput::from)
                    .expect("failed to serialize stylesheet");

                actual_json.clone().compare_to_file(&ref_json_path).unwrap();

                {
                    let mut lexer = Lexer::new(SourceFileInput::from(&*fm), Default::default());
                    let mut tokens = Tokens {
                        span: Span::new(fm.start_pos, fm.end_pos, Default::default()),
                        tokens: vec![],
                    };

                    loop {
                        let res = lexer.next();
                        match res {
                            Ok(t) => {
                                tokens.tokens.push(t);
                            }

                            Err(e) => {
                                if matches!(e.kind(), ErrorKind::Eof) {
                                    break;
                                }
                                panic!("failed to lex tokens: {:?}", e)
                            }
                        }
                    }

                    let mut errors = vec![];
                    let ss_tok: Stylesheet = parse_tokens(
                        &tokens,
                        ParserConfig {
                            parse_values: true,
                            ..Default::default()
                        },
                        &mut errors,
                    )
                    .expect("failed to parse token");

                    for err in errors {
                        err.to_diagnostics(&handler).emit();
                    }

                    let json_from_tokens = serde_json::to_string_pretty(&ss_tok)
                        .map(NormalizedOutput::from)
                        .expect("failed to serialize stylesheet from tokens");

                    assert_eq!(actual_json, json_from_tokens);
                }

                Err(())
            }
            Err(err) => {
                let mut d = err.to_diagnostics(&handler);
                d.note(&format!("current token = {}", parser.dump_cur()));

                d.emit();

                errored = true;

                Err(())
            }
        }
    })
    .unwrap_err();

    if errored {
        panic!("Parser should recover, but failed with {}", stderr);
    }

    stderr.compare_to_file(&stderr_path).unwrap();
}

struct SpanVisualizer<'a> {
    handler: &'a Handler,
}

macro_rules! mtd {
    ($T:ty,$name:ident) => {
        fn $name(&mut self, n: &$T, _: &dyn swc_css_visit::Node) {
            self.handler
                .struct_span_err(n.span(), stringify!($T))
                .emit();

            n.visit_children_with(self);
        }
    };
}

impl Visit for SpanVisualizer<'_> {
    mtd!(AtRule, visit_at_rule);
    mtd!(AtSelector, visit_at_selector);
    mtd!(AtTextValue, visit_at_text_value);
    mtd!(AttrSelector, visit_attr_selector);
    mtd!(BinValue, visit_bin_value);
    mtd!(BraceValue, visit_brace_value);
    mtd!(ClassSelector, visit_class_selector);
    mtd!(SpaceValues, visit_space_values);
    mtd!(ComplexSelector, visit_complex_selector);
    mtd!(Combinator, visit_combinator);
    mtd!(CompoundSelector, visit_compound_selector);
    mtd!(Block, visit_block);
    mtd!(RoundBracketBlock, visit_round_bracket_block);
    mtd!(SquareBracketBlock, visit_square_bracket_block);
    mtd!(FnValue, visit_fn_value);
    mtd!(HashValue, visit_hash_value);
    mtd!(NestingSelector, visit_nesting_selector);
    mtd!(IdSelector, visit_id_selector);
    mtd!(TypeSelector, visit_type_selector);
    mtd!(Num, visit_num);
    mtd!(PercentValue, visit_percent_value);
    mtd!(Declaration, visit_declaration);
    mtd!(PseudoSelector, visit_pseudo_selector);
    mtd!(Rule, visit_rule);
    mtd!(Str, visit_str);
    mtd!(StyleRule, visit_style_rule);
    mtd!(Stylesheet, visit_stylesheet);
    mtd!(SelectorList, visit_selector_list);
    mtd!(SubclassSelector, visit_subclass_selector);
    mtd!(TagSelector, visit_tag_selector);
    mtd!(Ident, visit_ident);
    mtd!(Tokens, visit_tokens);
    mtd!(Unit, visit_unit);
    mtd!(UnitValue, visit_unit_value);
    mtd!(UrlValue, visit_url_value);
    mtd!(Value, visit_value);

    mtd!(AndMediaQuery, visit_and_media_query);
    mtd!(AndSupportQuery, visit_and_support_query);
    mtd!(CharsetRule, visit_charset_rule);
    mtd!(CommaMediaQuery, visit_comma_media_query);
    mtd!(DocumentRule, visit_document_rule);
    mtd!(FontFaceRule, visit_font_face_rule);
    mtd!(ImportSource, visit_import_source);
    mtd!(ImportRule, visit_import_rule);
    mtd!(KeyframeBlock, visit_keyframe_block);
    mtd!(KeyframeBlockRule, visit_keyframe_block_rule);
    mtd!(KeyframeSelector, visit_keyframe_selector);
    mtd!(KeyframesRule, visit_keyframes_rule);
    mtd!(MediaQuery, visit_media_query);
    mtd!(MediaRule, visit_media_rule);
    mtd!(NamespaceValue, visit_namespace_value);
    mtd!(NamespaceRule, visit_namespace_rule);
    mtd!(NestedPageRule, visit_nested_page_rule);
    mtd!(NotMediaQuery, visit_not_media_query);
    mtd!(NotSupportQuery, visit_not_support_query);
    mtd!(OnlyMediaQuery, visit_only_media_query);
    mtd!(OrMediaQuery, visit_or_media_query);
    mtd!(OrSupportQuery, visit_or_support_query);
    mtd!(PageRule, visit_page_rule);
    mtd!(PageRuleBlock, visit_page_rule_block);
    mtd!(PageRuleBlockItem, visit_page_rule_block_item);
    mtd!(PageSelector, visit_page_selector);
    mtd!(ParenSupportQuery, visit_paren_support_query);
    mtd!(SupportQuery, visit_support_query);
    mtd!(SupportsRule, visit_supports_rule);
    mtd!(UnknownAtRule, visit_unknown_at_rule);
    mtd!(ViewportRule, visit_viewport_rule);

    fn visit_token_and_span(&mut self, n: &TokenAndSpan, _parent: &dyn swc_css_visit::Node) {
        self.handler
            .struct_span_err(n.span, &format!("{:?}", n.token))
            .emit();
    }
}

#[testing::fixture("tests/fixture/**/input.css")]
fn span(input: PathBuf) {
    eprintln!("Input: {}", input.display());
    let dir = input.parent().unwrap().to_path_buf();

    let output = testing::run_test2(false, |cm, handler| {
        // Type annotation
        if false {
            return Ok(());
        }

        let config = ParserConfig {
            parse_values: true,
            ..Default::default()
        };

        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm), config);
        let mut parser = Parser::new(lexer, config);

        let stylesheet = parser.parse_all();

        match stylesheet {
            Ok(stylesheet) => {
                stylesheet.visit_with(
                    &Invalid { span: DUMMY_SP },
                    &mut SpanVisualizer { handler: &handler },
                );

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

#[testing::fixture("tests/errors/**/input.css")]
fn fail(input: PathBuf) {
    eprintln!("Input: {}", input.display());
    let stderr_path = input.parent().unwrap().join("output.stderr");

    let stderr = testing::run_test2(false, |cm, handler| -> Result<(), _> {
        let config = ParserConfig {
            parse_values: true,

            ..Default::default()
        };

        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm), config);
        let mut parser = Parser::new(lexer, config);

        let stylesheet = parser.parse_all();

        match stylesheet {
            Ok(..) => {}
            Err(err) => {
                err.to_diagnostics(&handler).emit();
            }
        }

        for err in parser.take_errors() {
            err.to_diagnostics(&handler).emit();
        }

        if !handler.has_errors() {
            panic!("should error")
        }

        Err(())
    })
    .unwrap_err();

    stderr.compare_to_file(&stderr_path).unwrap();
}
