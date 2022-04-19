//! Ported from https://github.com/privatenumber/minification-benchmarks

extern crate swc_node_base;

use std::fs::read_to_string;

use criterion::{black_box, criterion_group, criterion_main, Criterion};
use swc_common::{sync::Lrc, FileName, Mark, SourceMap};
use swc_ecma_ast::EsVersion;
use swc_ecma_codegen::text_writer::JsWriter;
use swc_ecma_minifier::{
    optimize,
    option::{CompressOptions, ExtraOptions, MangleOptions, MinifyOptions, PureGetterOption},
};
use swc_ecma_parser::parse_file_as_module;
use swc_ecma_transforms_base::{fixer::fixer, resolver::resolver_with_mark};
use swc_ecma_visit::FoldWith;

pub fn bench_files(c: &mut Criterion) {
    let mut group = c.benchmark_group("es/minify/libraries");
    group.sample_size(10);

    let mut bench_file = |name: &str| {
        let src = read_to_string(&format!("benches/full/{}.js", name)).unwrap();

        group.bench_function(name, |b| {
            b.iter(|| {
                // We benchmark full time, including time for creating cm, handler
                run(&src)
            })
        });
    };

    bench_file("antd");
    bench_file("d3");
    bench_file("echarts");
    bench_file("jquery");
    bench_file("lodash");
    bench_file("moment");
    bench_file("react");
    bench_file("terser");
    bench_file("three");
    bench_file("typescript");
    bench_file("victory");
    bench_file("vue");
}

criterion_group!(files, bench_files);
criterion_main!(files);

fn run(src: &str) {
    testing::run_test2(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Anon, src.into());

        let top_level_mark = Mark::fresh(Mark::root());

        let program = parse_file_as_module(
            &fm,
            Default::default(),
            Default::default(),
            None,
            &mut vec![],
        )
        .map_err(|err| {
            err.into_diagnostic(&handler).emit();
        })
        .map(|module| module.fold_with(&mut resolver_with_mark(top_level_mark)))
        .unwrap();

        let output = optimize(
            program,
            cm.clone(),
            None,
            None,
            &MinifyOptions {
                rename: false,
                compress: Some(CompressOptions {
                    arguments: false,
                    arrows: true,
                    bools: true,
                    bools_as_ints: false,
                    collapse_vars: true,
                    comparisons: true,
                    computed_props: false,
                    conditionals: true,
                    dead_code: true,
                    directives: false,
                    drop_console: false,
                    drop_debugger: true,
                    ecma: EsVersion::Es2015,
                    evaluate: true,
                    expr: false,
                    global_defs: Default::default(),
                    hoist_fns: false,
                    hoist_props: true,
                    hoist_vars: false,
                    ie8: false,
                    if_return: true,
                    inline: 3,
                    join_vars: true,
                    keep_classnames: false,
                    keep_fargs: true,
                    keep_fnames: false,
                    keep_infinity: false,
                    loops: true,
                    module: false,
                    negate_iife: true,
                    passes: 0,
                    props: true,
                    pure_getters: PureGetterOption::Strict,
                    reduce_fns: false,
                    reduce_vars: false,
                    sequences: 3,
                    side_effects: true,
                    switches: false,
                    top_retain: Default::default(),
                    top_level: None,
                    typeofs: true,
                    unsafe_passes: false,
                    unsafe_arrows: false,
                    unsafe_comps: false,
                    unsafe_function: false,
                    unsafe_math: false,
                    unsafe_symbols: false,
                    unsafe_methods: false,
                    unsafe_proto: false,
                    unsafe_regexp: false,
                    unsafe_undefined: false,
                    unused: true,
                    const_to_let: true,
                }),
                mangle: Some(MangleOptions {
                    props: None,
                    top_level: true,
                    keep_class_names: false,
                    keep_fn_names: false,
                    keep_private_props: false,
                    ie8: false,
                    safari10: false,
                    reserved: Default::default(),
                }),
                wrap: false,
                enclose: false,
            },
            &ExtraOptions { top_level_mark },
        );

        let output = output.fold_with(&mut fixer(None));

        let code = print(cm, &[output], true);

        black_box(code);
        Ok(())
    })
    .unwrap();
}

fn print<N: swc_ecma_codegen::Node>(cm: Lrc<SourceMap>, nodes: &[N], minify: bool) -> String {
    let mut buf = vec![];

    {
        let mut emitter = swc_ecma_codegen::Emitter {
            cfg: swc_ecma_codegen::Config { minify },
            cm: cm.clone(),
            comments: None,
            wr: Box::new(JsWriter::new(cm, "\n", &mut buf, None)),
        };

        for n in nodes {
            n.emit_with(&mut emitter).unwrap();
        }
    }

    String::from_utf8(buf).unwrap()
}
