use std::{path::Path, sync::Arc};

use criterion::{criterion_group, criterion_main, Criterion};
use swc_common::{comments::SingleThreadedComments, FilePathMapping, Mark, SourceMap, GLOBALS};
use swc_ecma_parser::{attach_comments, Parser, SourceType};
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
                let mut result = Parser::new(&fm.src, SourceType::typescript())
                    .with_start_pos(fm.start_pos)
                    .with_tokens()
                    .parse();
                attach_comments(
                    &fm.src,
                    fm.start_pos,
                    &comments,
                    std::mem::take(&mut result.comments),
                    &result.tokens,
                    &result.program,
                );
                assert!(result.diagnostics.is_empty());
                let mut program = result
                    .program
                    .apply(resolver(unresolved_mark, top_level_mark, true))
                    .apply(paren_remover(None));

                let internal_annotations = FastDts::get_internal_annotations(&comments);
                let mut checker = FastDts::new(
                    fm.name.clone(),
                    unresolved_mark,
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
