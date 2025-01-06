extern crate swc_malloc;

use std::fs::read_to_string;

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Criterion};
use swc_common::{
    errors::{Handler, HANDLER},
    sync::Lrc,
    FileName, Globals, Mark, SourceMap, SyntaxContext, GLOBALS,
};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_lints::{
    config::LintConfig,
    rules::{lint_pass, LintParams},
};
use swc_ecma_parser::parse_file_as_module;
use swc_ecma_transforms_base::resolver;

pub fn bench_files(c: &mut Criterion) {
    let mut group = c.benchmark_group("es/lints/libs");
    group.sample_size(10);

    let mut bench_file = |name: &str| {
        group.bench_function(format!("es/lints/libs/{}", name), |b| {
            let src =
                read_to_string(format!("../swc_ecma_minifier/benches/full/{}.js", name)).unwrap();

            let globals = Globals::default();
            GLOBALS.set(&globals, || {
                let cm = Lrc::new(SourceMap::default());
                let handler = Handler::with_tty_emitter(
                    swc_common::errors::ColorConfig::Always,
                    true,
                    false,
                    Some(cm.clone()),
                );

                let fm = cm.new_source_file(FileName::Anon.into(), src);

                let unresolved_mark = Mark::new();
                let top_level_mark = Mark::new();

                let program = parse_file_as_module(
                    &fm,
                    Default::default(),
                    Default::default(),
                    None,
                    &mut Vec::new(),
                )
                .map_err(|err| {
                    err.into_diagnostic(&handler).emit();
                })
                .map(Program::Module)
                .map(|module| module.apply(resolver(unresolved_mark, top_level_mark, false)))
                .unwrap();

                b.iter(|| {
                    GLOBALS.set(&globals, || {
                        HANDLER.set(&handler, || {
                            run(
                                cm.clone(),
                                &mut program.clone(),
                                unresolved_mark,
                                top_level_mark,
                            )
                        });
                    });
                });
            });
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

fn run(cm: Lrc<SourceMap>, program: &mut Program, unresolved_mark: Mark, top_level_mark: Mark) {
    let rules = swc_ecma_lints::rules::all(LintParams {
        program,
        lint_config: &LintConfig::default(),
        unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
        top_level_ctxt: SyntaxContext::empty().apply_mark(top_level_mark),
        es_version: EsVersion::EsNext,
        source_map: cm.clone(),
    });

    let pass = black_box(lint_pass(rules));

    program.mutate(pass)
}
