#![deny(warnings)]

use std::{
    fs::read_to_string,
    path::{Path, PathBuf},
};

use swc_html_ast::{Document, DocumentFragment, DocumentMode, Element, Namespace};
use swc_html_codegen::{
    writer::basic::{BasicHtmlWriter, BasicHtmlWriterConfig},
    CodeGenerator, CodegenConfig, Emit,
};
use swc_html_minifier::{minify_document, minify_document_fragment, option::MinifyOptions};
use swc_html_parser::{parse_file_as_document, parse_file_as_document_fragment};
use testing::NormalizedOutput;

fn find_config(dir: &Path) -> Option<String> {
    let config = dir.join("config.json");

    if config.exists() {
        let config = read_to_string(&config).expect("failed to read config.json");

        return Some(config);
    }

    None
}

#[testing::fixture("tests/fixture/**/input.html")]
fn test_minify_document(input: PathBuf) {
    let dir = input.parent().unwrap();
    let output = dir.join(format!(
        "output.min.{}",
        input.extension().unwrap().to_string_lossy()
    ));

    testing::run_test(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();

        let mut errors = Vec::new();
        let result: Result<Document, _> =
            parse_file_as_document(&fm, Default::default(), &mut errors);

        for err in errors {
            err.to_diagnostics(handler).emit();
        }

        if handler.has_errors() {
            return Err(());
        }

        let mut document = result.unwrap();
        let config = match find_config(dir) {
            Some(config) => serde_json::from_str(&config).unwrap(),
            None => MinifyOptions::default(),
        };

        // Apply transforms
        minify_document(&mut document, &config);

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

            gen.emit(&document).unwrap();
        }

        NormalizedOutput::new_raw(html_str)
            .compare_to_file(&output)
            .unwrap();

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/document_fragment/**/input.html")]
fn test_minify_document_fragment(input: PathBuf) {
    let dir = input.parent().unwrap();
    let output = dir.join(format!(
        "output.min.{}",
        input.extension().unwrap().to_string_lossy()
    ));

    testing::run_test(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();

        let parent = input.parent().unwrap();
        let parent_str = parent
            .components()
            .last()
            .unwrap()
            .as_os_str()
            .to_string_lossy();

        let mut context_element_namespace = Namespace::HTML;
        let mut context_element_tag_name = "template";

        let context_element = parent_str
            .split('.')
            .last()
            .expect("failed to get context element from filename");

        if context_element.contains('_') {
            let mut splited = context_element.split('_');

            if let Some(namespace) = splited.next() {
                context_element_namespace = match namespace {
                    "math" => Namespace::MATHML,
                    "svg" => Namespace::SVG,
                    _ => Namespace::HTML,
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
            attributes: Vec::new(),
            is_self_closing: false,
            children: Vec::new(),
            content: None,
        };

        let mut errors = Vec::new();
        let result: Result<DocumentFragment, _> = parse_file_as_document_fragment(
            &fm,
            &context_element,
            DocumentMode::NoQuirks,
            None,
            Default::default(),
            &mut errors,
        );

        for err in errors {
            err.to_diagnostics(handler).emit();
        }

        if handler.has_errors() {
            return Err(());
        }

        let mut document_fragment = result.unwrap();
        let config = match find_config(dir) {
            Some(config) => serde_json::from_str(&config).unwrap(),
            None => MinifyOptions::default(),
        };

        // Apply transforms
        minify_document_fragment(&mut document_fragment, &context_element, &config);

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

            gen.emit(&document_fragment).unwrap();
        }

        NormalizedOutput::new_raw(html_str)
            .compare_to_file(&output)
            .unwrap();

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/recovery/**/input.html")]
fn test_minify_recovery(input: PathBuf) {
    let dir = input.parent().unwrap();
    let output = dir.join(format!(
        "output.min.{}",
        input.extension().unwrap().to_string_lossy()
    ));
    let mut recovered = false;

    testing::run_test(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();

        let mut errors = Vec::new();
        let result: Result<Document, _> =
            parse_file_as_document(&fm, Default::default(), &mut errors);

        for err in errors {
            err.to_diagnostics(handler).emit();
        }

        if handler.has_errors() {
            recovered = true;
        }

        let mut document = result.unwrap();

        let config = match find_config(dir) {
            Some(config) => serde_json::from_str(&config).unwrap(),
            None => MinifyOptions::default(),
        };

        // Apply transforms
        minify_document(&mut document, &config);

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

            gen.emit(&document).unwrap();
        }

        NormalizedOutput::new_raw(html_str)
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
