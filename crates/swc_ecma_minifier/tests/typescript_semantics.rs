//! Runtime checks for TypeScript `namespace` and `enum` lowering followed by
//! the minifier.
//!
//! The fixtures belong to `swc_ecma_transforms_typescript`, but the test lives
//! here because a dev-dependency from `swc_ecma_transforms_typescript` on
//! `swc_ecma_minifier` creates a dependency cycle through
//! `swc_ecma_transforms_optimization`, which breaks crate publishing.

use std::path::PathBuf;

use swc_common::{sync::Lrc, util::take::Take, Mark, SourceMap};
use swc_ecma_ast::{Pass, Program};
use swc_ecma_minifier::{
    optimize,
    option::{ExtraOptions, MinifyOptions},
};
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_testing::exec_tr;
use swc_ecma_transforms_typescript::{typescript, Config};

#[testing::fixture(
    "../swc_ecma_transforms_typescript/tests/fixture/namespace-bindings/emission-identities/exec.\
     ts"
)]
#[testing::fixture(
    "../swc_ecma_transforms_typescript/tests/fixture/enum-semantics/folded-reference-retention/\
     exec.ts"
)]
#[testing::fixture(
    "../swc_ecma_transforms_typescript/tests/fixture/enum-semantics/computed-write-reads/exec.ts"
)]
fn runtime_minified(input: PathBuf) {
    let code = std::fs::read_to_string(input).expect("semantic execution fixture must be readable");
    exec_tr(
        "typescript_semantics_minified",
        Syntax::Typescript(TsSyntax::default()),
        |tester| {
            let unresolved = Mark::new();
            let top_level = Mark::new();
            (
                resolver(unresolved, top_level, true),
                typescript(
                    Config {
                        no_empty_export: true,
                        ..Default::default()
                    },
                    unresolved,
                    top_level,
                ),
                Minifier {
                    cm: tester.cm.clone(),
                    unresolved,
                    top_level,
                },
            )
        },
        &code,
    );
}

struct Minifier {
    cm: Lrc<SourceMap>,
    unresolved: Mark,
    top_level: Mark,
}

impl Pass for Minifier {
    fn process(&mut self, program: &mut Program) {
        *program = optimize(
            program.take(),
            self.cm.clone(),
            None,
            None,
            &MinifyOptions {
                compress: Some(Default::default()),
                mangle: Some(Default::default()),
                ..Default::default()
            },
            &ExtraOptions {
                unresolved_mark: self.unresolved,
                top_level_mark: self.top_level,
                mangle_name_cache: None,
            },
        );
    }
}
