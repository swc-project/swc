extern crate swc_node_base;

use criterion::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{input::StringInput, FileName};
use swc_css_parser::lexer::Lexer;

fn bench_stylesheet(b: &mut Bencher, src: &'static str) {
    let _ = ::testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon, src.into());

        b.iter(|| {
            let lexer = Lexer::new(StringInput::from(&*fm), Default::default());

            for t in lexer {
                black_box(t);
            }
        });

        Ok(())
    });
}

fn bench_files(c: &mut Criterion) {
    c.bench_function("css/lexer/bootstrap_5_1_3", |b| {
        bench_stylesheet(b, include_str!("./files/bootstrap_5_1_3.css"))
    });

    c.bench_function("css/lexer/foundation_6_7_4", |b| {
        bench_stylesheet(b, include_str!("./files/foundation_6_7_4.css"))
    });

    c.bench_function("css/lexer/tailwind_3_1_1", |b| {
        bench_stylesheet(b, include_str!("./files/tailwind_3_1_1.css"))
    });
}

criterion_group!(benches, bench_files);
criterion_main!(benches);
