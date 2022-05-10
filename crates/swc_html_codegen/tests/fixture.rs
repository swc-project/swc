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

        NormalizedOutput::from(html_str)
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

        document.visit_mut_with(&mut NormalizeTest);
        document_parsed_again.visit_mut_with(&mut NormalizeTest);

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

        NormalizedOutput::from(html_str)
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

        document_fragment.visit_mut_with(&mut NormalizeTest);
        document_fragment_parsed_again.visit_mut_with(&mut NormalizeTest);

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
        let fm = cm.load_file(&input).unwrap();
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
    let codegen_config = match codegen_config {
        Some(codegen_config) => codegen_config,
        _ => CodegenConfig::default(),
    };

    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();
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
    fn visit_mut_span(&mut self, n: &mut Span) {
        *n = Default::default()
    }
}

struct NormalizeTest;

impl VisitMut for NormalizeTest {
    fn visit_mut_element(&mut self, n: &mut Element) {
        n.visit_mut_children_with(self);

        if &*n.tag_name == "body" {
            if let Some(last) = n.children.last_mut() {
                match last {
                    Child::Text(text) => {
                        // Drop value from the last `Text` node because characters after `</body>`
                        // moved to body tag
                        text.value = "".into();
                    }
                    _ => {
                        unreachable!();
                    }
                }
            }
        }
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
        }),
    );
    print_document(
        &input,
        None,
        None,
        Some(CodegenConfig {
            scripting_enabled: false,
            minify: true,
        }),
    );
}

#[testing::fixture("tests/document_fragment/**/input.html")]
fn test_document_fragment(input: PathBuf) {
    print_document_fragment(
        &input,
        Element {
            span: Default::default(),
            tag_name: "template".into(),
            namespace: Namespace::HTML,
            attributes: vec![],
            children: vec![],
            content: None,
        },
        None,
        None,
        Some(CodegenConfig {
            scripting_enabled: false,
            minify: false,
        }),
    );
    print_document_fragment(
        &input,
        Element {
            span: Default::default(),
            tag_name: "template".into(),
            namespace: Namespace::HTML,
            attributes: vec![],
            children: vec![],
            content: None,
        },
        None,
        None,
        Some(CodegenConfig {
            scripting_enabled: false,
            minify: true,
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
}

#[testing::fixture("../swc_html_parser/tests/recovery/**/*.html")]
fn parser_recovery_verify(input: PathBuf) {
    verify_document(&input, None, None, None, true);
}

#[testing::fixture("../swc_html_parser/tests/html5lib-tests-fixture/**/*.html")]
fn html5lib_tests_verify(input: PathBuf) {
    let file_stem = input.file_stem().unwrap().to_str().unwrap().to_owned();
    let scripting_enabled = file_stem.contains("script_on");
    let parser_config = ParserConfig { scripting_enabled };
    let codegen_config = CodegenConfig {
        minify: false,
        scripting_enabled,
    };

    if file_stem.contains("fragment") {
        let mut context_element_namespace = Namespace::HTML;
        let mut context_element_tag_name = "";
        let context_element = file_stem
            .split('.')
            .last()
            .expect("failed to get context element from filename");

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
            context_element_tag_name = context_element;
        }

        let context_element = Element {
            span: Default::default(),
            namespace: context_element_namespace,
            tag_name: context_element_tag_name.into(),
            attributes: vec![],
            children: vec![],
            content: None,
        };

        verify_document_fragment(
            &input,
            context_element,
            Some(parser_config),
            None,
            Some(codegen_config),
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
    }
}
