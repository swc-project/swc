extern crate swc_node_base;

use criterion::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{input::StringInput, FileName};
use swc_css_parser::{lexer::Lexer, parser::Parser};

fn bench_stylesheet(b: &mut Bencher, src: &'static str) {
    let _ = ::testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon, src.into());

        b.iter(|| {
            let _ = black_box({
                let lexer = Lexer::new(StringInput::from(&*fm), Default::default());
                let mut parser = Parser::new(lexer, Default::default());

                parser.parse_all()
            });
        });

        Ok(())
    });
}

fn bench_files(c: &mut Criterion) {
    c.bench_function("css/parser/bootstrap_5_1_3", |b| {
        bench_stylesheet(b, include_str!("./files/bootstrap_5_1_3.css"))
    });

    c.bench_function("css/parser/foundation_6_7_4", |b| {
        bench_stylesheet(b, include_str!("./files/foundation_6_7_4.css"))
    });

    c.bench_function("css/parser/tailwind_3_1_1", |b| {
        bench_stylesheet(b, include_str!("./files/tailwind_3_1_1.css"))
    });
}

criterion_group!(benches, bench_files);
criterion_main!(benches);
