use std::path::{Path, PathBuf};

use serde::Deserialize;
use swc_common::{pass::Optional, Mark};
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms_base::{assumptions::Assumptions, resolver};
use swc_ecma_transforms_compat::class_fields_use_set::class_fields_use_set;
use swc_ecma_transforms_testing::{parse_swcrc_options, test_fixture};
use swc_ecma_transforms_typescript::{typescript, Config};

#[derive(Default, Deserialize)]
#[serde(default)]
struct Swcrc {
    jsc: Jsc,
}
#[derive(Default, Deserialize)]
#[serde(default)]
struct Jsc {
    transform: Transform,
    assumptions: Option<Assumptions>,
}

#[derive(Deserialize)]
#[serde(default, rename_all = "camelCase")]
struct Transform {
    #[serde(flatten)]
    typescript: Config,
    use_define_for_class_fields: bool,
}

impl Default for Transform {
    fn default() -> Self {
        Self {
            typescript: Config::default(),
            use_define_for_class_fields: true,
        }
    }
}

/// Runs a TypeScript fixture using the TypeScript transform options.
#[testing::fixture("tests/preset/**/input.ts")]
fn fixture(input: PathBuf) {
    let root = Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/preset");
    let options: Swcrc = parse_swcrc_options(input.parent().unwrap(), &root, 2);
    let assumptions = options.jsc.assumptions.unwrap_or_default();
    // SWC applies set semantics after stripping types and before compat lowering.
    let use_set =
        !options.jsc.transform.use_define_for_class_fields || assumptions.set_public_class_fields;
    let options = options.jsc.transform.typescript;
    test_fixture(
        Syntax::Typescript(TsSyntax::default()),
        &|_| {
            let unresolved = Mark::new();
            let top_level = Mark::new();
            (
                resolver(unresolved, top_level, true),
                typescript(options, unresolved, top_level),
                Optional::new(class_fields_use_set(assumptions.pure_getters), use_set),
            )
        },
        &input,
        &input.with_file_name("output.js"),
        Default::default(),
    );
}
