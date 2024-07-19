extern crate swc_malloc;

use std::{fs::read_to_string, path::Path};

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Criterion};
use swc_common::{errors::HANDLER, FileName};
use swc_html_ast::{Document, DocumentFragment, DocumentMode, Element, Namespace};
use swc_html_codegen::{writer::basic::BasicHtmlWriter, Emit};
use swc_html_minifier::{minify_document, minify_document_fragment, option::MinifyOptions};
use swc_html_parser::{parse_file_as_document, parse_file_as_document_fragment};

pub fn bench_files_document(c: &mut Criterion) {
    let mut group = c.benchmark_group("html/minify/document");
    group.sample_size(10);

    let mut bench_file = |name: &str, path: &Path| {
        let src = read_to_string(path).unwrap();

        group.bench_function(name, |b| {
            b.iter(|| {
                // We benchmark full time, including time for creating cm, handler
                run_document(&src)
            })
        });
    };

    bench_file(
        "css_spec",
        Path::new("../swc_html_parser/benches/files/css_2021_spec.html"),
    );
    bench_file(
        "github",
        Path::new("../swc_html_parser/benches/files/github_com_17_05_2022.html"),
    );
    bench_file(
        "stackoverflow",
        Path::new("../swc_html_parser/benches/files/stackoverflow_com_17_05_2022.html"),
    );
}

pub fn bench_files_document_fragment(c: &mut Criterion) {
    let mut group = c.benchmark_group("html/minify/document_fragment");
    group.sample_size(10);

    let mut bench_file = |name: &str, path: &Path| {
        let src = read_to_string(path).unwrap();

        group.bench_function(name, |b| {
            b.iter(|| {
                // We benchmark full time, including time for creating cm, handler
                run_document_fragment(&src)
            })
        });
    };

    bench_file(
        "css_spec",
        Path::new("../swc_html_parser/benches/files/css_2021_spec.html"),
    );
    bench_file(
        "github",
        Path::new("../swc_html_parser/benches/files/github_com_17_05_2022.html"),
    );
    bench_file(
        "stackoverflow",
        Path::new("../swc_html_parser/benches/files/stackoverflow_com_17_05_2022.html"),
    );
}

criterion_group!(files_document, bench_files_document);
criterion_group!(files_document_fragment, bench_files_document_fragment);
criterion_main!(files_document, files_document_fragment);

fn run_document(src: &str) {
    testing::run_test2(false, |cm, handler| {
        HANDLER.set(&handler, || {
            let fm = cm.new_source_file(FileName::Anon.into(), src.into());

            let mut errors = Vec::new();
            let mut document: Document =
                parse_file_as_document(&fm, Default::default(), &mut errors).unwrap();

            for err in errors {
                err.to_diagnostics(&handler).emit();
            }

            minify_document(&mut document, &MinifyOptions::default());

            let mut buf = String::new();
            {
                let wr = BasicHtmlWriter::new(&mut buf, None, Default::default());
                let mut generator = swc_html_codegen::CodeGenerator::new(
                    wr,
                    swc_html_codegen::CodegenConfig {
                        minify: true,
                        ..Default::default()
                    },
                );

                generator.emit(&document).unwrap();
            }

            black_box(buf);

            Ok(())
        })
    })
    .unwrap();
}

fn run_document_fragment(src: &str) {
    testing::run_test2(false, |cm, handler| {
        HANDLER.set(&handler, || {
            let fm = cm.new_source_file(FileName::Anon.into(), src.into());

            let mut errors = Vec::new();
            let context_element_namespace = Namespace::HTML;
            let context_element_tag_name = "template";
            let context_element = Element {
                span: Default::default(),
                namespace: context_element_namespace,
                tag_name: context_element_tag_name.into(),
                attributes: Vec::new(),
                is_self_closing: false,
                children: Vec::new(),
                content: None,
            };
            let mut document: DocumentFragment = parse_file_as_document_fragment(
                &fm,
                &context_element,
                DocumentMode::NoQuirks,
                None,
                Default::default(),
                &mut errors,
            )
            .unwrap();

            for err in errors {
                err.to_diagnostics(&handler).emit();
            }

            minify_document_fragment(&mut document, &context_element, &MinifyOptions::default());

            let mut buf = String::new();
            {
                let wr = BasicHtmlWriter::new(&mut buf, None, Default::default());
                let mut generator = swc_html_codegen::CodeGenerator::new(
                    wr,
                    swc_html_codegen::CodegenConfig {
                        minify: true,
                        ..Default::default()
                    },
                );

                generator.emit(&document).unwrap();
            }

            black_box(buf);

            Ok(())
        })
    })
    .unwrap();
}
