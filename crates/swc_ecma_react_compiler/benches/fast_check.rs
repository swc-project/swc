use std::fmt::Write;

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Criterion};
use swc_common::{sync::Lrc, FileName, SourceMap};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_parser::{parse_file_as_program, Syntax, TsSyntax};
use swc_ecma_react_compiler::fast_check::may_require;

fn parse(source: String) -> Program {
    let cm = Lrc::new(SourceMap::default());
    let fm = cm.new_source_file(Lrc::new(FileName::Anon), source);
    parse_file_as_program(
        &fm,
        Syntax::Typescript(TsSyntax {
            tsx: true,
            ..Default::default()
        }),
        EsVersion::latest(),
        None,
        &mut Vec::new(),
    )
    .unwrap()
}

fn plain_module() -> String {
    let mut source = String::new();
    for index in 0..512 {
        writeln!(
            source,
            "export function value{index}(input: number) {{ return input + {index}; }}"
        )
        .unwrap();
    }
    source
}

fn bench_fast_check(c: &mut Criterion) {
    let plain = parse(plain_module());

    let mut late_component_source = plain_module();
    late_component_source.push_str("export const App = () => <main>Hello</main>;");
    let late_component = parse(late_component_source);

    let wrapped_component = parse(
        "export const Button = React.forwardRef((props, ref) => <button ref={ref} {...props} />);"
            .to_string(),
    );

    assert!(!may_require(&plain));
    assert!(may_require(&late_component));
    assert!(may_require(&wrapped_component));

    c.bench_function("react-compiler/fast-check/plain", |b| {
        b.iter(|| black_box(may_require(black_box(&plain))));
    });
    c.bench_function("react-compiler/fast-check/late-component", |b| {
        b.iter(|| black_box(may_require(black_box(&late_component))));
    });
    c.bench_function("react-compiler/fast-check/wrapped-component", |b| {
        b.iter(|| black_box(may_require(black_box(&wrapped_component))));
    });
}

criterion_group!(benches, bench_fast_check);
criterion_main!(benches);
