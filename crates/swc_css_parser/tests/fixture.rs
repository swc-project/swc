#![allow(clippy::needless_update)]

use std::path::PathBuf;

use swc_common::{errors::Handler, input::SourceFileInput, Span, Spanned};
use swc_css_ast::*;
use swc_css_parser::{
    lexer::Lexer,
    parse_tokens,
    parser::{input::ParserInput, Parser, ParserConfig},
};
use swc_css_visit::{Visit, VisitWith};
use testing::NormalizedOutput;

pub struct Invalid {
    pub span: Span,
}

#[testing::fixture("tests/fixture/**/input.css")]
fn tokens_input(input: PathBuf) {
    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();

        let tokens = {
            let mut lexer = Lexer::new(SourceFileInput::from(&*fm), Default::default());
            let mut tokens = vec![];

            while let Some(token_and_span) = lexer.next() {
                tokens.push(token_and_span);
            }

            Tokens {
                span: Span::new(fm.start_pos, fm.end_pos, Default::default()),
                tokens,
            }
        };

        let mut errors = vec![];
        let _ss: Stylesheet = parse_tokens(
            &tokens,
            ParserConfig {
                ..Default::default()
            },
            &mut errors,
        )
        .expect("failed to parse tokens");

        for err in errors {
            err.to_diagnostics(&handler).emit();
        }

        if handler.has_errors() {
            return Err(());
        }

        Ok(())
    })
    .unwrap();
}

fn test_pass(input: PathBuf, config: ParserConfig) {
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
                    let mut errors = vec![];

                    let mut lexer = Lexer::new(SourceFileInput::from(&*fm), Default::default());
                    let mut tokens = Tokens {
                        span: Span::new(fm.start_pos, fm.end_pos, Default::default()),
                        tokens: vec![],
                    };

                    while let Some(token_and_span) = lexer.next() {
                        tokens.tokens.push(token_and_span);
                    }

                    errors.extend(lexer.take_errors());

                    let ss_tok: Stylesheet = parse_tokens(
                        &tokens,
                        ParserConfig {
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
            ..Default::default()
        },
    )
}

#[testing::fixture("tests/line-comment/**/input.css")]
fn line_comments(input: PathBuf) {
    test_pass(
        input,
        ParserConfig {
            allow_wrong_line_comments: true,
            ..Default::default()
        },
    )
}

#[testing::fixture("tests/recovery/**/input.css")]
fn recovery(input: PathBuf) {
    let stderr_path = input.parent().unwrap().join("output.swc-stderr");

    let mut errored = false;

    let stderr = testing::run_test2(false, |cm, handler| {
        if false {
            // For type inference
            return Ok(());
        }

        let ref_json_path = input.parent().unwrap().join("output.json");

        let config = ParserConfig {
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
                    let mut errors = vec![];

                    let mut lexer = Lexer::new(SourceFileInput::from(&*fm), Default::default());
                    let mut tokens = Tokens {
                        span: Span::new(fm.start_pos, fm.end_pos, Default::default()),
                        tokens: vec![],
                    };

                    while let Some(token_and_span) = lexer.next() {
                        tokens.tokens.push(token_and_span);
                    }

                    errors.extend(lexer.take_errors());

                    let ss_tok: Stylesheet = parse_tokens(
                        &tokens,
                        ParserConfig {
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
        fn $name(&mut self, n: &$T) {
            self.handler
                .struct_span_err(n.span(), stringify!($T))
                .emit();

            n.visit_children_with(self);
        }
    };
}

impl Visit for SpanVisualizer<'_> {
    mtd!(Stylesheet, visit_stylesheet);

    mtd!(AtRule, visit_at_rule);

    mtd!(AtRuleName, visit_at_rule_name);

    mtd!(QualifiedRule, visit_qualified_rule);

    mtd!(StyleBlock, visit_style_block);

    mtd!(SelectorList, visit_selector_list);

    mtd!(CompoundSelectorList, visit_compound_selector_list);

    mtd!(RelativeSelectorList, visit_relative_selector_list);

    mtd!(ComplexSelector, visit_complex_selector);

    mtd!(Combinator, visit_combinator);

    mtd!(RelativeSelector, visit_relative_selector);

    mtd!(CompoundSelector, visit_compound_selector);

    mtd!(TypeSelector, visit_type_selector);

    mtd!(TagNameSelector, visit_tag_name_selector);

    mtd!(NsPrefix, visit_ns_prefix);

    mtd!(WqName, visit_wq_name);

    mtd!(UniversalSelector, visit_universal_selector);

    mtd!(IdSelector, visit_id_selector);

    mtd!(ClassSelector, visit_class_selector);

    mtd!(AttributeSelector, visit_attribute_selector);

    mtd!(AttributeSelectorMatcher, visit_attribute_selector_matcher);

    mtd!(AttributeSelectorValue, visit_attribute_selector_value);

    mtd!(AttributeSelectorModifier, visit_attribute_selector_modifier);

    mtd!(SubclassSelector, visit_subclass_selector);

    mtd!(NestingSelector, visit_nesting_selector);

    mtd!(PseudoClassSelector, visit_pseudo_class_selector);

    mtd!(
        PseudoClassSelectorChildren,
        visit_pseudo_class_selector_children
    );

    mtd!(AnPlusB, visit_an_plus_b);

    mtd!(AnPlusBNotation, visit_an_plus_b_notation);

    mtd!(PseudoElementSelector, visit_pseudo_element_selector);

    mtd!(
        PseudoElementSelectorChildren,
        visit_pseudo_element_selector_children
    );

    mtd!(Delimiter, visit_delimiter);

    mtd!(SimpleBlock, visit_simple_block);

    mtd!(ComponentValue, visit_component_value);

    mtd!(Function, visit_function);

    mtd!(Color, visit_color);

    mtd!(HexColor, visit_hex_color);

    mtd!(AlphaValue, visit_alpha_value);

    mtd!(Hue, visit_hue);

    mtd!(CmykComponent, visit_cmyk_component);

    mtd!(Integer, visit_integer);

    mtd!(Number, visit_number);

    mtd!(Ratio, visit_ratio);

    mtd!(Percentage, visit_percentage);

    mtd!(Declaration, visit_declaration);

    mtd!(DeclarationName, visit_declaration_name);

    mtd!(ImportantFlag, visit_important_flag);

    mtd!(Rule, visit_rule);

    mtd!(Str, visit_str);

    mtd!(Ident, visit_ident);

    mtd!(CustomIdent, visit_custom_ident);

    mtd!(DashedIdent, visit_dashed_ident);

    mtd!(Tokens, visit_tokens);

    mtd!(Dimension, visit_dimension);

    mtd!(Length, visit_length);

    mtd!(Angle, visit_angle);

    mtd!(Time, visit_time);

    mtd!(Frequency, visit_frequency);

    mtd!(Resolution, visit_resolution);

    mtd!(Flex, visit_flex);

    mtd!(UnknownDimension, visit_unknown_dimension);

    mtd!(Url, visit_url);

    mtd!(UrlValue, visit_url_value);

    mtd!(UrlValueRaw, visit_url_value_raw);

    mtd!(UrlModifier, visit_url_modifier);

    mtd!(UnicodeRange, visit_unicode_range);

    mtd!(CalcSum, visit_calc_sum);

    mtd!(CalcProductOrOperator, visit_calc_product_or_operator);

    mtd!(CalcProduct, visit_calc_product);

    mtd!(CalcOperator, visit_calc_operator);

    mtd!(CalcValueOrOperator, visit_calc_value_or_operator);

    mtd!(CalcValue, visit_calc_value);

    mtd!(LayerName, visit_layer_name);

    mtd!(LayerNameList, visit_layer_name_list);

    mtd!(LayerPrelude, visit_layer_prelude);

    mtd!(MediaQueryList, visit_media_query_list);

    mtd!(MediaQuery, visit_media_query);

    mtd!(MediaCondition, visit_media_condition);

    mtd!(MediaConditionWithoutOr, visit_media_condition_without_or);

    mtd!(MediaConditionAllType, visit_media_condition_all_type);

    mtd!(
        MediaConditionWithoutOrType,
        visit_media_condition_without_or_type
    );

    mtd!(MediaNot, visit_media_not);

    mtd!(MediaAnd, visit_media_and);

    mtd!(MediaOr, visit_media_or);

    mtd!(MediaInParens, visit_media_in_parens);

    mtd!(MediaFeatureName, visit_media_feature_name);

    mtd!(MediaFeatureValue, visit_media_feature_value);

    mtd!(MediaFeature, visit_media_feature);

    mtd!(MediaFeaturePlain, visit_media_feature_plain);

    mtd!(MediaFeatureBoolean, visit_media_feature_boolean);

    mtd!(MediaFeatureRange, visit_media_feature_range);

    mtd!(
        MediaFeatureRangeInterval,
        visit_media_feature_range_interval
    );

    mtd!(SupportsCondition, visit_supports_condition);

    mtd!(SupportsConditionType, visit_supports_condition_type);

    mtd!(SupportsNot, visit_supports_not);

    mtd!(SupportsAnd, visit_supports_and);

    mtd!(SupportsOr, visit_supports_or);

    mtd!(SupportsInParens, visit_supports_in_parens);

    mtd!(SupportsFeature, visit_supports_feature);

    mtd!(PageSelectorList, visit_page_selector_list);

    mtd!(PageSelector, visit_page_selector);

    mtd!(PageSelectorType, visit_page_selector_type);

    mtd!(PageSelectorPseudo, visit_page_selector_pseudo);

    fn visit_token_and_span(&mut self, n: &TokenAndSpan) {
        self.handler
            .struct_span_err(n.span, &format!("{:?}", n.token))
            .emit();
    }
}

#[testing::fixture("tests/fixture/**/input.css")]
fn span(input: PathBuf) {
    let dir = input.parent().unwrap().to_path_buf();

    let output = testing::run_test2(false, |cm, handler| {
        // Type annotation
        if false {
            return Ok(());
        }

        let config = ParserConfig {
            ..Default::default()
        };

        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm), config);
        let mut parser = Parser::new(lexer, config);

        let stylesheet = parser.parse_all();

        match stylesheet {
            Ok(stylesheet) => {
                stylesheet.visit_with(&mut SpanVisualizer { handler: &handler });

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
