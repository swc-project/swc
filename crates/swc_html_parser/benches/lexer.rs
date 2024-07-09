extern crate swc_malloc;

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{input::StringInput, FileName};
use swc_html_parser::lexer::Lexer;

fn bench_document(b: &mut Bencher, src: &'static str) {
    let _ = ::testing::run_test(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon.into(), src.into());

        b.iter(|| {
            let lexer = Lexer::new(StringInput::from(&*fm));

            for t in lexer {
                black_box(t);
            }
        });

        Ok(())
    });
}

fn run(c: &mut Criterion, id: &str, src: &'static str) {
    c.bench_function(&format!("html/lexer/{}", id), |b| {
        bench_document(b, src);
    });
}

fn bench_files(c: &mut Criterion) {
    run(
        c,
        "css_2021_spec",
        include_str!("./files/css_2021_spec.html"),
    );

    run(
        c,
        "github_com_17_05_2022",
        include_str!("./files/github_com_17_05_2022.html"),
    );

    run(
        c,
        "stackoverflow_com_17_05_2022",
        include_str!("./files/stackoverflow_com_17_05_2022.html"),
    );
}

criterion_group!(benches, bench_files);
criterion_main!(benches);
