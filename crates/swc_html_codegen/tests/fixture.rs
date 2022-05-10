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
use swc_html_parser::{parse_file, parser::ParserConfig};
use swc_html_visit::{VisitMut, VisitMutWith};
use testing::{assert_eq, run_test2, NormalizedOutput};

fn run(input: &Path, minify: bool) {
    let dir = input.parent().unwrap();
    // let map = if minify {
    //     dir.join(format!(
    //         "output.min.{}.map",
    //         input.extension().unwrap().to_string_lossy()
    //     ))
    // } else {
    //     dir.join(format!(
    //         "output.{}.map",
    //         input.extension().unwrap().to_string_lossy()
    //     ))
    // };
    let output = if minify {
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

        eprintln!("==== ==== Input ==== ====\n{}\n", fm.src);

        let mut errors = vec![];
        let mut document: Document = parse_file(
            &fm,
            ParserConfig {
                ..Default::default()
            },
            &mut errors,
        )
        .unwrap();

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        let mut html_str = String::new();
        // let mut src_map_buf = vec![];

        {
            let wr = BasicHtmlWriter::new(
                &mut html_str,
                None, // Some(&mut src_map_buf),
                BasicHtmlWriterConfig::default(),
            );

            let mut gen = CodeGenerator::new(wr, CodegenConfig { minify });

            gen.emit(&document).unwrap();
        }

        // let source_map = cm.build_source_map(&mut src_map_buf);
        // let mut source_map_output: Vec<u8> = vec![];
        // source_map.to_writer(&mut source_map_output).unwrap();
        // let str_source_map_output = String::from_utf8_lossy(&source_map_output);
        // std::fs::write(map, &*str_source_map_output).expect("Unable to write file");

        let fm_output = cm.load_file(&output).unwrap();

        NormalizedOutput::from(html_str)
            .compare_to_file(output)
            .unwrap();

        let mut errors = vec![];
        let mut document_output: Document = parse_file(
            &fm_output,
            ParserConfig {
                ..Default::default()
            },
            &mut errors,
        )
        .map_err(|err| {
            err.to_diagnostics(&handler).emit();
        })?;

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        document.visit_mut_with(&mut NormalizeTest);
        document_output.visit_mut_with(&mut NormalizeTest);

        assert_eq!(document, document_output);

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/fixture/**/input.html")]
fn html(input: PathBuf) {
    run(&input, false);
    run(&input, true);
}

#[testing::fixture("tests/options/indent_type/**/input.html")]
fn indent_type(input: PathBuf) {
    let dir = input.parent().unwrap();
    let output = dir.join(format!(
        "output.{}",
        input.extension().unwrap().to_string_lossy()
    ));

    run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();

        eprintln!("==== ==== Input ==== ====\n{}\n", fm.src);

        let mut errors = vec![];
        let mut document: Document = parse_file(
            &fm,
            ParserConfig {
                ..Default::default()
            },
            &mut errors,
        )
        .unwrap();

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        let mut html_str = String::new();

        {
            let wr = BasicHtmlWriter::new(
                &mut html_str,
                None,
                BasicHtmlWriterConfig {
                    indent_type: IndentType::Tab,
                    indent_width: 2,
                    linefeed: LineFeed::default(),
                },
            );

            let mut gen = CodeGenerator::new(wr, CodegenConfig { minify: false });

            gen.emit(&document).unwrap();
        }

        println!("{:?}", output);

        let fm_output = cm.load_file(&output).unwrap();

        NormalizedOutput::from(html_str)
            .compare_to_file(output)
            .unwrap();

        let mut errors = vec![];
        let mut document_output: Document = parse_file(
            &fm_output,
            ParserConfig {
                ..Default::default()
            },
            &mut errors,
        )
        .map_err(|err| {
            err.to_diagnostics(&handler).emit();
        })?;

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        document.visit_mut_with(&mut NormalizeTest);
        document_output.visit_mut_with(&mut NormalizeTest);

        assert_eq!(document, document_output);

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("../swc_html_parser/tests/fixture/**/*.html")]
fn parser_test(input: PathBuf) {
    eprintln!("{}", input.display());

    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();

        eprintln!("==== ==== Input ==== ====\n{}\n", fm.src);

        let fm_output = cm.load_file(&input).unwrap();
        let mut errors = vec![];
        let mut document: Document = parse_file(
            &fm_output,
            ParserConfig {
                ..Default::default()
            },
            &mut errors,
        )
        .map_err(|err| {
            err.to_diagnostics(&handler).emit();
        })?;

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        let mut html_str = String::new();

        {
            let wr = BasicHtmlWriter::new(&mut html_str, None, BasicHtmlWriterConfig::default());
            let mut gen = CodeGenerator::new(wr, CodegenConfig { minify: false });

            gen.emit(&document).unwrap();
        }

        eprintln!("==== ==== Codegen ==== ====\n{}\n", html_str);

        let new_fm = cm.new_source_file(FileName::Anon, html_str);
        let mut parsed_errors = vec![];
        let mut parsed: Document = parse_file(
            &new_fm,
            ParserConfig {
                ..Default::default()
            },
            &mut parsed_errors,
        )
        .map_err(|err| {
            err.to_diagnostics(&handler).emit();
        })?;

        for err in parsed_errors {
            err.to_diagnostics(&handler).emit();
        }

        document.visit_mut_with(&mut DropSpan);
        parsed.visit_mut_with(&mut DropSpan);

        assert_eq!(document, parsed);

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
