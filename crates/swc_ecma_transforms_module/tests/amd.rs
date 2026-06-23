use std::{fs::File, path::PathBuf, rc::Rc};

use swc_common::{comments::SingleThreadedComments, Mark};
use swc_ecma_ast::Pass;
use swc_ecma_parser::{Syntax, TsSyntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::es2015::for_of;
use swc_ecma_transforms_module::amd::{self, amd, FeatureFlag};
use swc_ecma_transforms_testing::{test, test_fixture, FixtureTestConfig};
use swc_ecma_transforms_typescript::typescript;

fn syntax() -> Syntax {
    Default::default()
}

fn ts_syntax() -> Syntax {
    Syntax::Typescript(TsSyntax::default())
}

fn tr_with_resolver(
    config: amd::Config,
    is_ts: bool,
    comments: Rc<SingleThreadedComments>,
    resolver_impl: swc_ecma_transforms_module::path::Resolver,
) -> impl Pass {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    (
        resolver(unresolved_mark, top_level_mark, is_ts),
        typescript::typescript(Default::default(), unresolved_mark, top_level_mark),
        amd(
            resolver_impl,
            unresolved_mark,
            config,
            FeatureFlag {
                support_block_scoping: true,
                support_arrow: true,
            },
            Some(comments),
        ),
    )
}

fn tr(config: amd::Config, is_ts: bool, comments: Rc<SingleThreadedComments>) -> impl Pass {
    tr_with_resolver(config, is_ts, comments, Default::default())
}

#[testing::fixture("tests/fixture/common/**/input.js")]
#[testing::fixture("tests/fixture/common/**/input.ts")]
#[testing::fixture("tests/fixture/common/**/input.cts")]
fn esm_to_amd(input: PathBuf) {
    let is_ts = input
        .file_name()
        .map(|x| x.to_string_lossy())
        .map(|x| x.ends_with(".ts") || x.ends_with(".mts") || x.ends_with(".cts"))
        .unwrap_or_default();

    let dir = input.parent().unwrap().to_path_buf();

    let output = dir
        .join("output.amd.js")
        .with_extension(if is_ts { "ts" } else { "js" });

    let amd_config_path = dir.join("module.amd.json");
    let config_path = dir.join("module.json");
    let config: amd::Config = match File::open(amd_config_path).or_else(|_| File::open(config_path))
    {
        Ok(file) => serde_json::from_reader(file).unwrap(),
        Err(..) => Default::default(),
    };

    test_fixture(
        if is_ts { ts_syntax() } else { syntax() },
        &|t| {
            let resolver_impl = swc_ecma_transforms_module::path::Resolver::Real {
                base: swc_common::FileName::Real(input.clone()),
                resolver: std::sync::Arc::new(swc_ecma_transforms_module::path::NoopImportResolver),
            };
            tr_with_resolver(config.clone(), is_ts, t.comments.clone(), resolver_impl)
        },
        &input,
        &output,
        FixtureTestConfig {
            module: Some(true),
            ..Default::default()
        },
    );
}

test!(
    module,
    syntax(),
    |t| (
        for_of(for_of::Config {
            assume_array: true,
            ..Default::default()
        }),
        tr(Default::default(), false, t.comments.clone())
    ),
    for_of_as_array_for_of_import_amd,
    r#"
    import { array } from "foo";

    for (const elm of array) {
    console.log(elm);
    }
"#
);

#[test]
fn amd_module_root_test() {
    swc_ecma_transforms_testing::test_inline_input_output(
        syntax(),
        Some(true),
        |_| {
            let unresolved_mark = Mark::new();
            let config = amd::Config {
                module_root: Some("src".into()),
                ..Default::default()
            };
            let resolver_impl = swc_ecma_transforms_module::path::Resolver::Real {
                base: swc_common::FileName::Real(PathBuf::from("src/components/button.js")),
                resolver: std::sync::Arc::new(swc_ecma_transforms_module::path::NoopImportResolver),
            };
            amd(
                resolver_impl,
                unresolved_mark,
                config,
                FeatureFlag {
                    support_block_scoping: true,
                    support_arrow: true,
                },
                None::<Rc<SingleThreadedComments>>,
            )
        },
        r#"
        export const foo = 1;
        "#,
        r#"
        define("components/button", ["require", "exports"], function(require, exports) {
            "use strict";
            Object.defineProperty(exports, "__esModule", {
                value: true
            });
            Object.defineProperty(exports, "foo", {
                enumerable: true,
                get: function() {
                    return foo;
                }
            });
            const foo = 1;
        });
        "#,
    );
}
