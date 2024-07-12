extern crate swc_malloc;

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{input::StringInput, FileName};
use swc_css_parser::lexer::Lexer;

fn bench_stylesheet(b: &mut Bencher, src: &'static str) {
    let _ = ::testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon.into(), src.into());

        b.iter(|| {
            let lexer = Lexer::new(StringInput::from(&*fm), None, Default::default());

            for t in lexer {
                black_box(t);
            }
        });

        Ok(())
    });
}

fn run(c: &mut Criterion, id: &str, src: &'static str) {
    c.bench_function(&format!("css/lexer/{}", id), |b| {
        bench_stylesheet(b, src);
    });
}

fn bench_files(c: &mut Criterion) {
    run(
        c,
        "bootstrap_5_1_3",
        include_str!("./files/bootstrap_5_1_3.css"),
    );

    run(
        c,
        "foundation_6_7_4",
        include_str!("./files/foundation_6_7_4.css"),
    );

    run(
        c,
        "tailwind_3_1_1",
        include_str!("./files/tailwind_3_1_1.css"),
    );
}

criterion_group!(benches, bench_files);
criterion_main!(benches);
