extern crate swc_node_base;

use criterion::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{comments::SingleThreadedComments, FileName};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};

fn bench_module(b: &mut Bencher, syntax: Syntax, src: &'static str) {
    let _ = ::testing::run_test(false, |cm, _| {
        let comments = SingleThreadedComments::default();
        let fm = cm.new_source_file(FileName::Anon, src.into());

        b.iter(|| {
            let _ = black_box({
                let lexer = Lexer::new(
                    syntax,
                    Default::default(),
                    StringInput::from(&*fm),
                    Some(&comments),
                );
                let mut parser = Parser::new_from(lexer);
                parser.parse_module()
            });
        });
        Ok(())
    });
}

fn bench_files(c: &mut Criterion) {
    let mut bench_file = |name: &str, src: &'static str| {
        c.bench_function(name, |b| {
            // Copied from ratel-rust
            bench_module(b, Default::default(), src)
        });
    };

    bench_file("es/parser/colors", include_str!("../colors.js"));
    bench_file(
        "es/parser/angular",
        include_str!("./files/angular-1.2.5.js"),
    );
    bench_file(
        "es/parser/backbone",
        include_str!("./files/backbone-1.1.0.js"),
    );
    bench_file("es/parser/jquery", include_str!("./files/jquery-1.9.1.js"));
    bench_file(
        "es/parser/jquery mobile",
        include_str!("./files/jquery.mobile-1.4.2.js"),
    );

    bench_file(
        "es/parser/mootools",
        include_str!("./files/mootools-1.4.5.js"),
    );

    bench_file(
        "es/parser/underscore",
        include_str!("./files/underscore-1.5.2.js"),
    );

    bench_file("es/parser/three", include_str!("./files/three-0.138.3.js"));

    bench_file("es/parser/yui", include_str!("./files/yui-3.12.0.js"));
}

criterion_group!(benches, bench_files);
criterion_main!(benches);
