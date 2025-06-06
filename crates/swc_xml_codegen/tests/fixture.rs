#![allow(clippy::needless_update)]

use std::{
    mem::take,
    path::{Path, PathBuf},
};

use swc_common::{FileName, Span};
use swc_xml_ast::*;
use swc_xml_codegen::{
    writer::basic::{BasicXmlWriter, BasicXmlWriterConfig, IndentType, LineFeed},
    CodeGenerator, CodegenConfig, Emit,
};
use swc_xml_parser::{parse_file_as_document, parser::ParserConfig};
use swc_xml_visit::{VisitMut, VisitMutWith};
use testing::{assert_eq, run_test2, NormalizedOutput};

fn print_document(
    input: &Path,
    parser_config: Option<ParserConfig>,
    writer_config: Option<BasicXmlWriterConfig>,
    codegen_config: Option<CodegenConfig>,
) {
    let dir = input.parent().unwrap();
    let parser_config = parser_config.unwrap_or_default();
    let writer_config = writer_config.unwrap_or_default();
    let codegen_config = codegen_config.unwrap_or_default();
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
        let mut errors = Vec::new();
        let mut document: Document =
            parse_file_as_document(&fm, parser_config, &mut errors).unwrap();

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        let mut xml_str = String::new();
        let wr = BasicXmlWriter::new(&mut xml_str, None, writer_config);
        let mut gen = CodeGenerator::new(wr, codegen_config);

        gen.emit(&document).unwrap();

        let fm_output = cm.load_file(&output).unwrap();

        NormalizedOutput::new_raw(xml_str)
            .compare_to_file(output)
            .unwrap();

        let mut errors = Vec::new();
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

fn verify_document(
    input: &Path,
    parser_config: Option<ParserConfig>,
    writer_config: Option<BasicXmlWriterConfig>,
    codegen_config: Option<CodegenConfig>,
    ignore_errors: bool,
) {
    let parser_config = parser_config.unwrap_or_default();
    let writer_config = writer_config.unwrap_or_default();
    let codegen_config = codegen_config.unwrap_or_default();

    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(input).unwrap();
        let mut errors = Vec::new();

        let mut document =
            parse_file_as_document(&fm, parser_config, &mut errors).map_err(|err| {
                err.to_diagnostics(&handler).emit();
            })?;

        if !ignore_errors {
            for err in take(&mut errors) {
                err.to_diagnostics(&handler).emit();
            }
        }

        let mut xml_str = String::new();
        let wr = BasicXmlWriter::new(&mut xml_str, None, writer_config);
        let mut gen = CodeGenerator::new(wr, codegen_config);

        gen.emit(&document).unwrap();

        let new_fm = cm.new_source_file(FileName::Anon.into(), xml_str);
        let mut parsed_errors = Vec::new();
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

struct DropSpan;

impl VisitMut for DropSpan {
    fn visit_mut_document_type(&mut self, n: &mut DocumentType) {
        n.visit_mut_children_with(self);

        n.raw = None;
    }

    fn visit_mut_comment(&mut self, n: &mut Comment) {
        n.visit_mut_children_with(self);

        n.raw = None;
    }

    fn visit_mut_text(&mut self, n: &mut Text) {
        n.visit_mut_children_with(self);

        n.raw = None;
    }

    fn visit_mut_attribute(&mut self, n: &mut Attribute) {
        n.visit_mut_children_with(self);

        n.raw_name = None;
        n.raw_value = None;
    }

    fn visit_mut_span(&mut self, n: &mut Span) {
        *n = Default::default()
    }
}

#[testing::fixture("tests/fixture/**/input.xml")]
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
            ..Default::default()
        }),
    );
}

#[testing::fixture("tests/options/indent_type/**/input.xml")]
fn test_indent_type_option(input: PathBuf) {
    print_document(
        &input,
        None,
        Some(BasicXmlWriterConfig {
            indent_type: IndentType::Tab,
            indent_width: 2,
            linefeed: LineFeed::default(),
        }),
        None,
    );
}

#[testing::fixture("../swc_xml_parser/tests/fixture/**/*.xml")]
fn parser_verify(input: PathBuf) {
    verify_document(&input, None, None, None, false);
    verify_document(
        &input,
        None,
        None,
        Some(CodegenConfig {
            scripting_enabled: false,
            minify: true,
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
            ..Default::default()
        }),
        false,
    );
}

#[testing::fixture("../swc_xml_parser/tests/recovery/**/*.xml")]
fn parser_recovery_verify(input: PathBuf) {
    verify_document(
        &input,
        None,
        None,
        Some(CodegenConfig {
            scripting_enabled: false,
            minify: true,
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
            ..Default::default()
        }),
        true,
    );
}
