#![allow(clippy::needless_update)]

use std::{
    mem::take,
    path::{Path, PathBuf},
};

use swc_common::{FileName, Span};
use swc_html_ast::*;
use swc_html_codegen::{
    writer::basic::{BasicHtmlWriter, BasicHtmlWriterConfig, IndentType, LineFeed},
    CodeGenerator, CodegenConfig, Emit,
};
use swc_html_parser::{
    parse_file_as_document, parse_file_as_document_fragment, parser::ParserConfig,
};
use swc_html_visit::{VisitMut, VisitMutWith};
use testing::{assert_eq, run_test2, NormalizedOutput};

fn print_document(
    input: &Path,
    parser_config: Option<ParserConfig>,
    writer_config: Option<BasicHtmlWriterConfig>,
    codegen_config: Option<CodegenConfig>,
) {
    let dir = input.parent().unwrap();
    let parser_config = match parser_config {
        Some(parser_config) => parser_config,
        _ => ParserConfig::default(),
    };
    let writer_config = match writer_config {
        Some(writer_config) => writer_config,
        _ => BasicHtmlWriterConfig::default(),
    };
    let codegen_config = match codegen_config {
        Some(codegen_config) => codegen_config,
        _ => CodegenConfig::default(),
    };
    let output = if codegen_config.minify {
        dir.join(format!(
            "output.min.{}",
            input.extension().unwrap().to_string_lossy()
        ))
    } else {
        dir.join(format!(
            "output.{}",
            input.extension().unwrap().to_string_lossy()
        ))
    };

    run_test2(false, |cm, handler| {
        let fm = cm.load_file(input).unwrap();
        let mut errors = vec![];
        let mut document: Document =
            parse_file_as_document(&fm, parser_config, &mut errors).unwrap();

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        let mut html_str = String::new();
        let wr = BasicHtmlWriter::new(&mut html_str, None, writer_config);
        let mut gen = CodeGenerator::new(wr, codegen_config);

        gen.emit(&document).unwrap();

        let fm_output = cm.load_file(&output).unwrap();

        NormalizedOutput::new_raw(html_str)
            .compare_to_file(output)
            .unwrap();

        let mut errors = vec![];
        let mut document_parsed_again =
            parse_file_as_document(&fm_output, parser_config, &mut errors).map_err(|err| {
                err.to_diagnostics(&handler).emit();
            })?;

        for error in take(&mut errors) {
            error.to_diagnostics(&handler).emit();
        }

        document.visit_mut_with(&mut DropSpan);
        document_parsed_again.visit_mut_with(&mut DropSpan);

        assert_eq!(document, document_parsed_again);

        Ok(())
    })
    .unwrap();
}

fn print_document_fragment(
    input: &Path,
    context_element: Element,
    parser_config: Option<ParserConfig>,
    writer_config: Option<BasicHtmlWriterConfig>,
    codegen_config: Option<CodegenConfig>,
) {
    let dir = input.parent().unwrap();
    let parser_config = match parser_config {
        Some(parser_config) => parser_config,
        _ => ParserConfig::default(),
    };
    let writer_config = match writer_config {
        Some(writer_config) => writer_config,
        _ => BasicHtmlWriterConfig::default(),
    };
    let codegen_config = match codegen_config {
        Some(codegen_config) => codegen_config,
        _ => CodegenConfig::default(),
    };
    let output = if codegen_config.minify {
        dir.join(format!(
            "output.min.{}",
            input.extension().unwrap().to_string_lossy()
        ))
    } else {
        dir.join(format!(
            "output.{}",
            input.extension().unwrap().to_string_lossy()
        ))
    };

    run_test2(false, |cm, handler| {
        let fm = cm.load_file(input).unwrap();
        let mut errors = vec![];
        let mut document_fragment = parse_file_as_document_fragment(
            &fm,
            context_element.clone(),
            parser_config,
            &mut errors,
        )
        .unwrap();

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        let mut html_str = String::new();
        let wr = BasicHtmlWriter::new(&mut html_str, None, writer_config);
        let mut gen = CodeGenerator::new(wr, codegen_config);

        gen.emit(&document_fragment).unwrap();

        let fm_output = cm.load_file(&output).unwrap();

        NormalizedOutput::new_raw(html_str)
            .compare_to_file(output)
            .unwrap();

        let mut errors = vec![];
        let mut document_fragment_parsed_again = parse_file_as_document_fragment(
            &fm_output,
            context_element.clone(),
            parser_config,
            &mut errors,
        )
        .map_err(|err| {
            err.to_diagnostics(&handler).emit();
        })?;

        for error in take(&mut errors) {
            error.to_diagnostics(&handler).emit();
        }

        document_fragment.visit_mut_with(&mut DropSpan);
        document_fragment_parsed_again.visit_mut_with(&mut DropSpan);

        assert_eq!(document_fragment, document_fragment_parsed_again);

        Ok(())
    })
    .unwrap();
}

fn verify_document(
    input: &Path,
    parser_config: Option<ParserConfig>,
    writer_config: Option<BasicHtmlWriterConfig>,
    codegen_config: Option<CodegenConfig>,
    ignore_errors: bool,
) {
    let parser_config = match parser_config {
        Some(parser_config) => parser_config,
        _ => ParserConfig::default(),
    };
    let writer_config = match writer_config {
        Some(writer_config) => writer_config,
        _ => BasicHtmlWriterConfig::default(),
    };
    let codegen_config = match codegen_config {
        Some(codegen_config) => codegen_config,
        _ => CodegenConfig::default(),
    };

    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(input).unwrap();
        let mut errors = vec![];

        let mut document =
            parse_file_as_document(&fm, parser_config, &mut errors).map_err(|err| {
                err.to_diagnostics(&handler).emit();
            })?;

        if !ignore_errors {
            for err in take(&mut errors) {
                err.to_diagnostics(&handler).emit();
            }
        }

        let mut html_str = String::new();
        let wr = BasicHtmlWriter::new(&mut html_str, None, writer_config);
        let mut gen = CodeGenerator::new(wr, codegen_config);

        gen.emit(&document).unwrap();

        let new_fm = cm.new_source_file(FileName::Anon, html_str);
        let mut parsed_errors = vec![];
        let mut document_parsed_again =
            parse_file_as_document(&new_fm, parser_config, &mut parsed_errors).map_err(|err| {
                err.to_diagnostics(&handler).emit();
            })?;

        if !ignore_errors {
            for err in parsed_errors {
                err.to_diagnostics(&handler).emit();
            }
        }

        document.visit_mut_with(&mut DropSpan);
        document_parsed_again.visit_mut_with(&mut DropSpan);

        assert_eq!(document, document_parsed_again);

        Ok(())
    })
    .unwrap();
}

fn verify_document_fragment(
    input: &Path,
    context_element: Element,
    parser_config: Option<ParserConfig>,
    writer_config: Option<BasicHtmlWriterConfig>,
    codegen_config: Option<CodegenConfig>,
    ignore_errors: bool,
) {
    let parser_config = match parser_config {
        Some(parser_config) => parser_config,
        _ => ParserConfig::default(),
    };
    let writer_config = match writer_config {
        Some(writer_config) => writer_config,
        _ => BasicHtmlWriterConfig::default(),
    };
    let mut codegen_config = match codegen_config {
        Some(codegen_config) => codegen_config,
        _ => CodegenConfig::default(),
    };

    codegen_config.context_element = Some(context_element.clone());

    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(input).unwrap();
        let mut errors = vec![];

        let mut document_fragment = parse_file_as_document_fragment(
            &fm,
            context_element.clone(),
            parser_config,
            &mut errors,
        )
        .map_err(|err| {
            err.to_diagnostics(&handler).emit();
        })?;

        if !ignore_errors {
            for err in take(&mut errors) {
                err.to_diagnostics(&handler).emit();
            }
        }

        let mut html_str = String::new();
        let wr = BasicHtmlWriter::new(&mut html_str, None, writer_config);
        let mut gen = CodeGenerator::new(wr, codegen_config);

        gen.emit(&document_fragment).unwrap();

        let new_fm = cm.new_source_file(FileName::Anon, html_str);
        let mut parsed_errors = vec![];
        let mut document_fragment_parsed_again = parse_file_as_document_fragment(
            &new_fm,
            context_element.clone(),
            parser_config,
            &mut parsed_errors,
        )
        .map_err(|err| {
            err.to_diagnostics(&handler).emit();
        })?;

        if !ignore_errors {
            for err in parsed_errors {
                err.to_diagnostics(&handler).emit();
            }
        }

        document_fragment.visit_mut_with(&mut DropSpan);
        document_fragment_parsed_again.visit_mut_with(&mut DropSpan);

        assert_eq!(document_fragment, document_fragment_parsed_again);

        Ok(())
    })
    .unwrap();
}

struct DropSpan;

impl VisitMut for DropSpan {
    fn visit_mut_element(&mut self, n: &mut Element) {
        n.visit_mut_children_with(self);

        // In normal output we respect `is_self_closing`
        // In minified output we always avoid end tag for SVG and MathML namespace
        n.is_self_closing = Default::default();
    }

    fn visit_mut_span(&mut self, n: &mut Span) {
        *n = Default::default()
    }
}

#[testing::fixture("tests/fixture/**/input.html")]
fn test_document(input: PathBuf) {
    print_document(
        &input,
        None,
        None,
        Some(CodegenConfig {
            scripting_enabled: false,
            minify: false,
            ..Default::default()
        }),
    );
    print_document(
        &input,
        None,
        None,
        Some(CodegenConfig {
            scripting_enabled: false,
            minify: true,
            tag_omission: true,
            ..Default::default()
        }),
    );
}

#[testing::fixture("tests/document_fragment/**/input.html")]
fn test_document_fragment(input: PathBuf) {
    let context_element = Element {
        span: Default::default(),
        tag_name: "template".into(),
        namespace: Namespace::HTML,
        attributes: vec![],
        is_self_closing: false,
        children: vec![],
        content: None,
    };

    print_document_fragment(
        &input,
        context_element.clone(),
        None,
        None,
        Some(CodegenConfig {
            scripting_enabled: false,
            minify: false,
            ..Default::default()
        }),
    );
    print_document_fragment(
        &input,
        context_element,
        None,
        None,
        Some(CodegenConfig {
            scripting_enabled: false,
            minify: true,
            tag_omission: true,
            ..Default::default()
        }),
    );
}

#[testing::fixture("tests/options/indent_type/**/input.html")]
fn test_indent_type_option(input: PathBuf) {
    print_document(
        &input,
        None,
        Some(BasicHtmlWriterConfig {
            indent_type: IndentType::Tab,
            indent_width: 2,
            linefeed: LineFeed::default(),
        }),
        None,
    );
}

#[testing::fixture("../swc_html_parser/tests/fixture/**/*.html")]
fn parser_verify(input: PathBuf) {
    verify_document(&input, None, None, None, false);
    verify_document(
        &input,
        None,
        None,
        Some(CodegenConfig {
            scripting_enabled: false,
            minify: true,
            tag_omission: false,
            ..Default::default()
        }),
        false,
    );
    verify_document(
        &input,
        None,
        None,
        Some(CodegenConfig {
            scripting_enabled: false,
            minify: true,
            tag_omission: true,
            ..Default::default()
        }),
        false,
    );
}

#[testing::fixture(
    "../swc_html_parser/tests/recovery/**/*.html",
    exclude(
        "document_type/bogus/input.html",
        "document_type/wrong-name/input.html",
        "text/cr-charref-novalid/input.html",
        "element/foreign-context/input.html",
        "element/a-4/input.html",
        "element/b-3/input.html",
    )
)]
fn parser_recovery_verify(input: PathBuf) {
    verify_document(
        &input,
        None,
        None,
        Some(CodegenConfig {
            scripting_enabled: false,
            minify: true,
            tag_omission: false,
            ..Default::default()
        }),
        true,
    );
    verify_document(
        &input,
        None,
        None,
        Some(CodegenConfig {
            scripting_enabled: false,
            minify: true,
            tag_omission: true,
            ..Default::default()
        }),
        true,
    );
}

// Tag omission only works for valid HTML documents (i.e. without errors)
static IGNORE_TAG_OMISSION: &[&str] = &[
    "adoption01_dat/5/input.html",
    "adoption01_dat/6/input.html",
    "adoption01_dat/7/input.html",
    "adoption01_dat/8/input.html",
    "adoption02_dat/0/input.html",
    "tests1_dat/68/input.html",
    "tests1_dat/69/input.html",
    "tests1_dat/70/input.html",
    "tests1_dat/71/input.html",
    "tests15_dat/0/input.html",
    "tests15_dat/1/input.html",
    "template_dat/68/input.html",
    "tricky01_dat/6/input.html",
];

#[testing::fixture(
    "../swc_html_parser/tests/html5lib-tests-fixture/**/*.html",
    exclude(
        "tests1_dat/30/input.html",
        "tests1_dat/77/input.html",
        "tests1_dat/90/input.html",
        "tests1_dat/103/input.html",
        "tests2_dat/12/input.html",
        "tests16_dat/31/input.html",
        "tests16_dat/32/input.html",
        "tests16_dat/33/input.html",
        "tests16_dat/34/input.html",
        "tests16_dat/35/input.html",
        "tests16_dat/36/input.html",
        "tests16_dat/37/input.html",
        "tests16_dat/48/input.html",
        "tests16_dat/49/input.html",
        "tests16_dat/50/input.html",
        "tests16_dat/51/input.html",
        "tests16_dat/52/input.html",
        "tests16_dat/53/input.html",
        "tests16_dat/130/input.html",
        "tests16_dat/131/input.html",
        "tests16_dat/132/input.html",
        "tests16_dat/133/input.html",
        "tests16_dat/134/input.html",
        "tests16_dat/135/input.html",
        "tests16_dat/136/input.html",
        "tests16_dat/147/input.html",
        "tests16_dat/148/input.html",
        "tests16_dat/149/input.html",
        "tests16_dat/150/input.html",
        "tests16_dat/196/input.html",
        "tests18_dat/7/input.html",
        "tests18_dat/8/input.html",
        "tests18_dat/9/input.html",
        "tests18_dat/12/input.html",
        "tests18_dat/21/input.html",
        "tests19_dat/103/input.html",
        "tests20_dat/41/input.html",
        "tests26_dat/2/input.html",
        "plain-text-unsafe_dat/0/input.html",
        "template_dat/107/input.html",
    )
)]
fn html5lib_tests_verify(input: PathBuf) {
    let parent = input.parent().unwrap().to_string_lossy();
    let scripting_enabled = parent.contains("script_on");
    let parser_config = ParserConfig {
        scripting_enabled,
        iframe_srcdoc: false,
    };
    let codegen_config = CodegenConfig {
        minify: false,
        scripting_enabled,
        ..Default::default()
    };
    let minified_codegen_config = CodegenConfig {
        minify: true,
        tag_omission: true,
        scripting_enabled,
        ..Default::default()
    };
    let minified_codegen_config_no_tag_omission = CodegenConfig {
        minify: true,
        tag_omission: false,
        scripting_enabled,
        ..Default::default()
    };

    if parent.contains("fragment") {
        let mut context_element_namespace = Namespace::HTML;
        let mut context_element_tag_name = "";
        let context_element = parent
            .split('.')
            .last()
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
            attributes: vec![],
            is_self_closing: false,
            children: vec![],
            content: None,
        };

        verify_document_fragment(
            &input,
            context_element.clone(),
            Some(parser_config),
            None,
            Some(codegen_config),
            true,
        );
        verify_document_fragment(
            &input,
            context_element.clone(),
            Some(parser_config),
            None,
            Some(minified_codegen_config),
            true,
        );
        verify_document_fragment(
            &input,
            context_element,
            Some(parser_config),
            None,
            Some(minified_codegen_config_no_tag_omission),
            true,
        );
    } else {
        verify_document(
            &input,
            Some(parser_config),
            None,
            Some(codegen_config),
            true,
        );

        verify_document(
            &input,
            Some(parser_config),
            None,
            Some(minified_codegen_config_no_tag_omission),
            true,
        );

        let relative_path = input.to_string_lossy().replace('-', "_").replace('\\', "/");

        if !IGNORE_TAG_OMISSION
            .iter()
            .any(|ignored| relative_path.contains(&**ignored))
        {
            verify_document(
                &input,
                Some(parser_config),
                None,
                Some(minified_codegen_config),
                true,
            );
        }
    }
}
