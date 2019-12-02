#![feature(test)]

use swc_common::FileName;
use swc_ecma_parser::{Parser, Session, SourceFileInput, Syntax};
use test::Bencher;

#[bench]
fn colors(b: &mut Bencher) {
    // Copied from ratel-rust
    bench_module(b, Default::default(), include_str!("../colors.js"))
}

#[bench]
fn angular(b: &mut Bencher) {
    bench_module(
        b,
        Default::default(),
        include_str!("./files/angular-1.2.5.js"),
    )
}

#[bench]
fn backbone(b: &mut Bencher) {
    bench_module(
        b,
        Default::default(),
        include_str!("./files/backbone-1.1.0.js"),
    )
}

#[bench]
fn jquery(b: &mut Bencher) {
    bench_module(
        b,
        Default::default(),
        include_str!("./files/jquery-1.9.1.js"),
    )
}

#[bench]
fn jquery_mobile(b: &mut Bencher) {
    bench_module(
        b,
        Default::default(),
        include_str!("./files/jquery.mobile-1.4.2.js"),
    )
}

#[bench]
fn mootools(b: &mut Bencher) {
    bench_module(
        b,
        Default::default(),
        include_str!("./files/mootools-1.4.5.js"),
    )
}

#[bench]
fn underscore(b: &mut Bencher) {
    bench_module(
        b,
        Default::default(),
        include_str!("./files/underscore-1.5.2.js"),
    )
}

#[bench]
fn yui(b: &mut Bencher) {
    bench_module(b, Default::default(), include_str!("./files/yui-3.12.0.js"))
}

#[bench]
fn colors_ts(b: &mut Bencher) {
    // Copied from ratel-rust
    bench_module(
        b,
        Syntax::Typescript(Default::default()),
        include_str!("../colors.js"),
    )
}

#[bench]
fn angular_ts(b: &mut Bencher) {
    bench_module(
        b,
        Syntax::Typescript(Default::default()),
        include_str!("./files/angular-1.2.5.js"),
    )
}

#[bench]
fn backbone_ts(b: &mut Bencher) {
    bench_module(
        b,
        Syntax::Typescript(Default::default()),
        include_str!("./files/backbone-1.1.0.js"),
    )
}

#[bench]
fn jquery_ts(b: &mut Bencher) {
    bench_module(
        b,
        Syntax::Typescript(Default::default()),
        include_str!("./files/jquery-1.9.1.js"),
    )
}

#[bench]
fn jquery_mobile_ts(b: &mut Bencher) {
    bench_module(
        b,
        Syntax::Typescript(Default::default()),
        include_str!("./files/jquery.mobile-1.4.2.js"),
    )
}

#[bench]
fn mootools_ts(b: &mut Bencher) {
    bench_module(
        b,
        Syntax::Typescript(Default::default()),
        include_str!("./files/mootools-1.4.5.js"),
    )
}

#[bench]
fn underscore_ts(b: &mut Bencher) {
    bench_module(
        b,
        Syntax::Typescript(Default::default()),
        include_str!("./files/underscore-1.5.2.js"),
    )
}

#[bench]
fn yui_ts(b: &mut Bencher) {
    bench_module(
        b,
        Syntax::Typescript(Default::default()),
        include_str!("./files/yui-3.12.0.js"),
    )
}

fn bench_module(b: &mut Bencher, syntax: Syntax, src: &'static str) {
    b.bytes = src.len() as _;

    let _ = ::testing::run_test(false, |cm, handler| {
        let session = Session { handler: &handler };
        let fm = cm.new_source_file(FileName::Anon, src.into());

        b.iter(|| {
            let _ = test::black_box({
                let mut parser = Parser::new(session, syntax, SourceFileInput::from(&*fm), None);
                parser.parse_module()
            });
        });
        Ok(())
    });
}
