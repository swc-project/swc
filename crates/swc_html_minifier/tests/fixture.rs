#![deny(warnings)]

use std::path::PathBuf;

use swc_html_ast::Document;
use swc_html_codegen::{
    writer::basic::{BasicHtmlWriter, BasicHtmlWriterConfig},
    CodeGenerator, CodegenConfig, Emit,
};
use swc_html_minifier::minify;
use swc_html_parser::parse_file_as_document;
use testing::NormalizedOutput;

#[testing::fixture("tests/fixture/**/input.html")]
fn minify_fixtures(input: PathBuf) {
    let dir = input.parent().unwrap();
    let output = dir.join(format!(
        "output.min.{}",
        input.extension().unwrap().to_string_lossy()
    ));

    testing::run_test(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();

        let mut errors = vec![];
        let result: Result<Document, _> =
            parse_file_as_document(&fm, Default::default(), &mut errors);

        for err in errors {
            err.to_diagnostics(handler).emit();
        }

        if handler.has_errors() {
            return Err(());
        }

        let mut ss = result.unwrap();

        // Apply transforms
        minify(&mut ss);

        let mut html_str = String::new();
        {
            let wr = BasicHtmlWriter::new(&mut html_str, None, BasicHtmlWriterConfig::default());
            let mut gen = CodeGenerator::new(
                wr,
                CodegenConfig {
                    scripting_enabled: false,
                    minify: true,
                    ..Default::default()
                },
            );

            gen.emit(&ss).unwrap();
        }

        NormalizedOutput::from(html_str)
            .compare_to_file(&output)
            .unwrap();

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/recovery/**/input.html")]
fn minify_recovery(input: PathBuf) {
    let dir = input.parent().unwrap();
    let output = dir.join(format!(
        "output.min.{}",
        input.extension().unwrap().to_string_lossy()
    ));
    let mut recovered = false;

    testing::run_test(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();

        let mut errors = vec![];
        let result: Result<Document, _> =
            parse_file_as_document(&fm, Default::default(), &mut errors);

        for err in errors {
            err.to_diagnostics(handler).emit();
        }

        if handler.has_errors() {
            recovered = true;
        }

        let mut ss = result.unwrap();

        // Apply transforms
        minify(&mut ss);

        let mut html_str = String::new();
        {
            let wr = BasicHtmlWriter::new(&mut html_str, None, BasicHtmlWriterConfig::default());
            let mut gen = CodeGenerator::new(
                wr,
                CodegenConfig {
                    scripting_enabled: false,
                    minify: true,
                    ..Default::default()
                },
            );

            gen.emit(&ss).unwrap();
        }

        NormalizedOutput::from(html_str)
            .compare_to_file(&output)
            .unwrap();

        Ok(())
    })
    .unwrap();

    if !recovered {
        panic!(
            "Parser should emit errors (recover mode), but parser parsed everything successfully"
        );
    }
}
