use codspeed_criterion_compat::{
    black_box, criterion_group, criterion_main, BatchSize, BenchmarkId, Criterion,
};
use swc_common::{FileName, SourceMap};
use swc_ecma_ast::{Pass, Program};
use swc_ecma_parser::{EsSyntax, Parser, StringInput, Syntax};
use swc_ecma_transforms_proposal::export_default_from;

fn bench_export_default_from(c: &mut Criterion) {
    let cm = SourceMap::default();
    let syntax = Syntax::Es(EsSyntax {
        export_default_from: true,
        ..Default::default()
    });
    let mut group = c.benchmark_group("export_default_from");

    for size in [16, 1024] {
        let statements = "consume(() => { if (ready) return value + 1; });\n".repeat(size);
        let exports = (0..size)
            .map(|i| format!("export value{i}, * as namespace{i} from 'source{i}';\n"))
            .collect::<String>();

        for (name, source, is_module) in [
            ("script", &statements, false),
            ("module_noop", &statements, true),
            ("module_exports", &exports, true),
        ] {
            let fm = cm.new_source_file(FileName::Anon.into(), source.clone());
            let mut parser = Parser::new(syntax, StringInput::from(&*fm), None);
            let program = if is_module {
                Program::Module(parser.parse_module().unwrap())
            } else {
                Program::Script(parser.parse_script().unwrap())
            };
            assert!(parser.take_errors().is_empty());

            group.bench_with_input(BenchmarkId::new(name, size), &program, |b, program| {
                // Measure the pass without parsing, cloning, or dropping the AST.
                b.iter_batched_ref(
                    || program.clone(),
                    |program| {
                        export_default_from().process(black_box(&mut *program));
                        black_box(program);
                    },
                    BatchSize::SmallInput,
                );
            });
        }
    }

    group.finish();
}

criterion_group!(benches, bench_export_default_from);
criterion_main!(benches);
