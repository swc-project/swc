extern crate swc_node_base;

use std::{fs::read_to_string, path::Path};

use criterion::{black_box, criterion_group, criterion_main, Criterion};
use swc_common::{errors::HANDLER, sync::Lrc, FileName, Mark, SourceMap};
use swc_css_ast::Stylesheet;
use swc_css_parser::{parse_file, parser::ParserConfig};

pub fn bench_files(c: &mut Criterion) {
    let mut group = c.benchmark_group("es/minify/libraries");
    group.sample_size(10);

    let mut bench_file = |name: &str, path: &Path| {
        let src = read_to_string(path).unwrap();

        group.bench_function(name, |b| {
            b.iter(|| {
                // We benchmark full time, including time for creating cm, handler
                run(&src)
            })
        });
    };

    bench_file(
        "bootstrap",
        Path::new("../../node_modules/bootstrap/dist/css/bootstrap.css"),
    );
}

criterion_group!(files, bench_files);
criterion_main!(files);

fn run(src: &str) {
    testing::run_test2(false, |cm, handler| {
        HANDLER.set(&handler, || {
            let fm = cm.new_source_file(FileName::Anon, src.into());

            let mut errors = vec![];
            let ss: Stylesheet = parse_file(&fm, ParserConfig {}, &mut errors).unwrap();

            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

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
            .map(|module| module.fold_with(&mut resolver(unresolved_mark, top_level_mark, false)))
            .unwrap();

            let output = optimize(
                program.into(),
                cm.clone(),
                None,
                None,
                &MinifyOptions {
                    rename: false,
                    compress: Some(CompressOptions {
                        ..Default::default()
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
                &ExtraOptions {
                    unresolved_mark,
                    top_level_mark,
                },
            )
            .expect_module();

            let output = output.fold_with(&mut fixer(None));

            let code = print(cm, &[output], true);

            black_box(code);
            Ok(())
        })
    })
    .unwrap();
}

fn print<N: swc_ecma_codegen::Node>(cm: Lrc<SourceMap>, nodes: &[N], minify: bool) -> String {
    let mut buf = vec![];

    {
        let mut emitter = swc_ecma_codegen::Emitter {
            cfg: swc_ecma_codegen::Config {
                minify,
                ..Default::default()
            },
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
