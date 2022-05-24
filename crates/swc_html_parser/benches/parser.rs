extern crate swc_node_base;

use criterion::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{input::StringInput, FileName};
use swc_html_parser::{lexer::Lexer, parser::Parser};

// TODO bench document_fragment when it will be finished

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

fn bench_files(c: &mut Criterion) {
    c.bench_function("html/parser/css_2021_spec", |b| {
        bench_document(b, include_str!("./files/css_2021_spec.html"))
    });

    c.bench_function("html/parser/github_com_17_05_2022", |b| {
        bench_document(b, include_str!("./files/github_com_17_05_2022.html"))
    });

    c.bench_function("html/parser/stackoverflow_com_17_05_2022", |b| {
        bench_document(b, include_str!("./files/stackoverflow_com_17_05_2022.html"))
    });
}

criterion_group!(benches, bench_files);
criterion_main!(benches);
