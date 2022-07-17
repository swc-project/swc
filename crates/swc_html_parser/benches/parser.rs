extern crate swc_node_base;

use criterion::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{input::StringInput, FileName};
use swc_html_ast::{DocumentMode, Element, Namespace};
use swc_html_parser::{lexer::Lexer, parser::Parser};

fn bench_document(b: &mut Bencher, src: &'static str) {
    let _ = ::testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon, src.into());

        b.iter(|| {
            let _ = black_box({
                let lexer = Lexer::new(StringInput::from(&*fm));
                let mut parser = Parser::new(lexer, Default::default());

                parser.parse_document()
            });
        });

        Ok(())
    });
}

fn bench_document_fragment(b: &mut Bencher, src: &'static str) {
    let _ = ::testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon, src.into());

        b.iter(|| {
            let _ = black_box({
                let lexer = Lexer::new(StringInput::from(&*fm));
                let mut parser = Parser::new(lexer, Default::default());

                parser.parse_document_fragment(
                    Element {
                        span: Default::default(),
                        tag_name: "template".into(),
                        namespace: Namespace::HTML,
                        attributes: vec![],
                        is_self_closing: false,
                        children: vec![],
                        content: None,
                    },
                    DocumentMode::NoQuirks,
                    None,
                )
            });
        });

        Ok(())
    });
}

fn bench_files(c: &mut Criterion) {
    c.bench_function("html/parser_document/css_2021_spec", |b| {
        bench_document(b, include_str!("./files/css_2021_spec.html"))
    });

    c.bench_function("html/parser_document/github_com_17_05_2022", |b| {
        bench_document(b, include_str!("./files/github_com_17_05_2022.html"))
    });

    c.bench_function("html/parser_document/stackoverflow_com_17_05_2022", |b| {
        bench_document(b, include_str!("./files/stackoverflow_com_17_05_2022.html"))
    });

    c.bench_function("html/parser_document_fragment/css_2021_spec", |b| {
        bench_document_fragment(b, include_str!("./files/css_2021_spec.html"))
    });

    c.bench_function("html/parser_document_fragment/github_com_17_05_2022", |b| {
        bench_document_fragment(b, include_str!("./files/github_com_17_05_2022.html"))
    });

    c.bench_function(
        "html/parser_document_fragment/stackoverflow_com_17_05_2022",
        |b| bench_document_fragment(b, include_str!("./files/stackoverflow_com_17_05_2022.html")),
    );
}

criterion_group!(benches, bench_files);
criterion_main!(benches);
