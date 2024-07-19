#![deny(warnings)]
#![allow(clippy::needless_update)]

use std::{path::PathBuf, rc::Rc};

use swc_common::{
    comments::SingleThreadedComments, errors::Handler, input::SourceFileInput, Span, Spanned,
};
use swc_css_ast::*;
use swc_css_parser::{
    lexer::Lexer,
    parse_input,
    parser::{
        input::{InputType, ParserInput, Tokens},
        PResult, Parser, ParserConfig,
    },
};
use swc_css_visit::{Visit, VisitWith};
use testing::NormalizedOutput;

fn stylesheet_test(input: PathBuf, config: ParserConfig) {
    let ref_json_path = input.parent().unwrap().join("output.json");

    testing::run_test2(false, |cm, handler| {
        let comments = SingleThreadedComments::default();

        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm), Some(&comments), config);
        let mut parser = Parser::new(lexer, config);
        let stylesheet = parser.parse_all();
        let errors = parser.take_errors();

        for err in &errors {
            err.to_diagnostics(&handler).emit();
        }

        if !errors.is_empty() {
            return Err(());
        }

        match stylesheet {
            Ok(stylesheet) => {
                let actual_json = serde_json::to_string_pretty(&stylesheet)
                    .map(NormalizedOutput::from)
                    .expect("failed to serialize stylesheet");

                actual_json.compare_to_file(&ref_json_path).unwrap();

                let (leading, trailing) = comments.take_all();
                let leading = Rc::try_unwrap(leading).unwrap().into_inner();
                let trailing = Rc::try_unwrap(trailing).unwrap().into_inner();

                serde_json::to_string_pretty(&leading)
                    .map(NormalizedOutput::from)
                    .expect("failed to serialize comments")
                    .compare_to_file(input.parent().unwrap().join("leading-comments.json"))
                    .unwrap();

                serde_json::to_string_pretty(&trailing)
                    .map(NormalizedOutput::from)
                    .expect("failed to serialize comments")
                    .compare_to_file(input.parent().unwrap().join("trailing-comments.json"))
                    .unwrap();

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

fn stylesheet_test_tokens(input: PathBuf, config: ParserConfig) {
    let ref_json_path = input.parent().unwrap().join("output.json");

    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();
        let mut errors = Vec::new();
        let tokens = {
            let mut lexer = Lexer::new(SourceFileInput::from(&*fm), None, Default::default());
            let mut tokens = Vec::new();

            for token_and_span in lexer.by_ref() {
                tokens.push(token_and_span);
            }

            errors.extend(lexer.take_errors());

            Tokens {
                span: Span::new(fm.start_pos, fm.end_pos),
                tokens,
            }
        };

        let stylesheet: PResult<Stylesheet> =
            parse_input(InputType::Tokens(&tokens), config, &mut errors);

        for err in &errors {
            err.to_diagnostics(&handler).emit();
        }

        if !errors.is_empty() {
            return Err(());
        }

        match stylesheet {
            Ok(stylesheet) => {
                let actual_json = serde_json::to_string_pretty(&stylesheet)
                    .map(NormalizedOutput::from)
                    .expect("failed to serialize stylesheet");

                actual_json.compare_to_file(&ref_json_path).unwrap();

                Ok(())
            }
            Err(err) => {
                let mut d = err.to_diagnostics(&handler);

                d.emit();

                Err(())
            }
        }
    })
    .unwrap();
}

fn stylesheet_recovery_test(input: PathBuf, config: ParserConfig) {
    let stderr_path = input.parent().unwrap().join("output.swc-stderr");
    let ref_json_path = input.parent().unwrap().join("output.json");

    let mut recovered = false;

    let stderr = testing::run_test2(false, |cm, handler| {
        if false {
            // For type inference
            return Ok(());
        }

        let comments = SingleThreadedComments::default();

        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm), Some(&comments), config);
        let mut parser = Parser::new(lexer, config);
        let stylesheet = parser.parse_all();
        let mut errors = parser.take_errors();

        errors.sort_by(|a, b| a.message().cmp(&b.message()));

        for err in &errors {
            err.to_diagnostics(&handler).emit();
        }

        if !errors.is_empty() {
            recovered = true;
        }

        match stylesheet {
            Ok(stylesheet) => {
                let actual_json = serde_json::to_string_pretty(&stylesheet)
                    .map(NormalizedOutput::from)
                    .expect("failed to serialize stylesheet");

                actual_json.compare_to_file(&ref_json_path).unwrap();

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

    stderr.compare_to_file(stderr_path).unwrap();
}

fn stylesheet_recovery_test_tokens(input: PathBuf, config: ParserConfig) {
    let stderr_path = input.parent().unwrap().join("output.swc-stderr");
    let ref_json_path = input.parent().unwrap().join("output.json");

    let mut recovered = false;

    let stderr = testing::run_test2(false, |cm, handler| {
        if false {
            // For type inference
            return Ok(());
        }

        let fm = cm.load_file(&input).unwrap();
        let mut lexer_errors = Vec::new();
        let tokens = {
            let mut lexer = Lexer::new(SourceFileInput::from(&*fm), None, Default::default());
            let mut tokens = Vec::new();

            for token_and_span in lexer.by_ref() {
                tokens.push(token_and_span);
            }

            lexer_errors.extend(lexer.take_errors());

            Tokens {
                span: Span::new(fm.start_pos, fm.end_pos),
                tokens,
            }
        };

        let mut parser_errors = Vec::new();

        let stylesheet: PResult<Stylesheet> =
            parse_input(InputType::Tokens(&tokens), config, &mut parser_errors);

        parser_errors.extend(lexer_errors);
        parser_errors.sort_by(|a, b| a.message().cmp(&b.message()));

        for err in &parser_errors {
            err.to_diagnostics(&handler).emit();
        }

        if !parser_errors.is_empty() {
            recovered = true;
        }

        match stylesheet {
            Ok(stylesheet) => {
                let actual_json = serde_json::to_string_pretty(&stylesheet)
                    .map(NormalizedOutput::from)
                    .expect("failed to serialize stylesheet");

                actual_json.compare_to_file(&ref_json_path).unwrap();

                Err(())
            }
            Err(err) => {
                let mut d = err.to_diagnostics(&handler);

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

    stderr.compare_to_file(stderr_path).unwrap();
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

    mtd!(ForgivingSelectorList, visit_forgiving_selector_list);

    mtd!(CompoundSelectorList, visit_compound_selector_list);

    mtd!(RelativeSelectorList, visit_relative_selector_list);

    mtd!(
        ForgivingRelativeSelectorList,
        visit_forgiving_relative_selector_list
    );

    mtd!(ComplexSelector, visit_complex_selector);

    mtd!(Combinator, visit_combinator);

    mtd!(RelativeSelector, visit_relative_selector);

    mtd!(CompoundSelector, visit_compound_selector);

    mtd!(TypeSelector, visit_type_selector);

    mtd!(TagNameSelector, visit_tag_name_selector);

    mtd!(NamespacePrefix, visit_namespace_prefix);

    mtd!(Namespace, visit_namespace);

    mtd!(NamedNamespace, visit_named_namespace);

    mtd!(AnyNamespace, visit_any_namespace);

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

    mtd!(MediaType, visit_media_type);

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

fn stylesheet_span_visualizer(input: PathBuf, config: Option<ParserConfig>) {
    let dir = input.parent().unwrap().to_path_buf();

    let output = testing::run_test2(false, |cm, handler| {
        // Type annotation
        if false {
            return Ok(());
        }

        let config = match config {
            Some(config) => config,
            _ => ParserConfig {
                legacy_ie: true,
                ..Default::default()
            },
        };

        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm), None, config);
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

    output.compare_to_file(dir.join("span.swc-stderr")).unwrap();
}

#[testing::fixture("tests/fixture/**/input.css")]
fn pass(input: PathBuf) {
    stylesheet_test(
        input.clone(),
        ParserConfig {
            legacy_ie: true,
            ..Default::default()
        },
    );
    stylesheet_test_tokens(
        input,
        ParserConfig {
            legacy_ie: true,
            ..Default::default()
        },
    );
}

#[testing::fixture("tests/line-comment/**/input.css")]
fn line_comments_pass(input: PathBuf) {
    stylesheet_test(
        input,
        ParserConfig {
            allow_wrong_line_comments: true,
            ..Default::default()
        },
    )
}

#[testing::fixture("tests/line-comment/**/input.css")]
fn span_visualizer_line_comment(input: PathBuf) {
    stylesheet_span_visualizer(
        input,
        Some(ParserConfig {
            allow_wrong_line_comments: true,
            ..Default::default()
        }),
    )
}

// TODO fix exclude
#[testing::fixture(
    "tests/recovery/**/input.css",
    exclude(
        "at-rule/page/invalid-nesting/input.css",
        "at-rule/page/without-page/input.css",
        "function/calc/division/input.css",
        "function/var/input.css",
        "whitespaces/input.css",
    )
)]
fn recovery(input: PathBuf) {
    stylesheet_recovery_test(input.clone(), Default::default());
    stylesheet_recovery_test_tokens(input, Default::default());
}

#[testing::fixture("tests/recovery-cssmodules/**/input.css")]
fn recovery_2(input: PathBuf) {
    stylesheet_recovery_test(
        input.clone(),
        ParserConfig {
            css_modules: true,
            ..Default::default()
        },
    );
    stylesheet_recovery_test_tokens(
        input,
        ParserConfig {
            css_modules: true,
            ..Default::default()
        },
    );
}

#[testing::fixture("tests/fixture/**/input.css")]
#[testing::fixture("tests/recovery/**/input.css")]
fn span_visualizer(input: PathBuf) {
    stylesheet_span_visualizer(input, None)
}
