use std::{path::Path, sync::Arc};

use criterion::{criterion_group, criterion_main, Criterion};
use swc_common::{comments::SingleThreadedComments, FilePathMapping, Mark, SourceMap, GLOBALS};
use swc_ecma_parser::{parse_file_as_program, Syntax};
use swc_ecma_transforms::{fixer::paren_remover, resolver};
use swc_typescript::fast_dts::{FastDts, FastDtsOptions};

fn mk() -> swc::Compiler {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
    swc::Compiler::new(cm)
}

fn bench_isolated_declarations(criterion: &mut Criterion) {
    criterion.bench_function("isolated-declarations", |b| {
        let c = mk();
        let fm =
            c.cm.load_file(Path::new("benches/assets/vue-id.ts"))
                .unwrap();
        b.iter(|| {
            GLOBALS.set(&Default::default(), || {
                let unresolved_mark = Mark::new();
                let top_level_mark = Mark::new();
                let comments = SingleThreadedComments::default();
                let mut program = parse_file_as_program(
                    &fm,
                    Syntax::Typescript(Default::default()),
                    Default::default(),
                    Some(&comments),
                    &mut Vec::new(),
                )
                .map(|program| program.apply(resolver(unresolved_mark, top_level_mark, true)))
                .map(|program| program.apply(paren_remover(None)))
                .unwrap();

                let internal_annotations = FastDts::get_internal_annotations(&comments);
                let mut checker = FastDts::new(
                    fm.name.clone(),
                    FastDtsOptions {
                        internal_annotations: Some(internal_annotations),
                    },
                );
                let _ = checker.transform(&mut program);
            })
        });
    });
}

criterion_group!(benches, bench_isolated_declarations);
criterion_main!(benches);
