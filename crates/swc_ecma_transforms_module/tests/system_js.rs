#![deny(warnings)]

use std::path::PathBuf;

use swc_common::{chain, Mark};
use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_module::system_js::{system_js, Config};
use swc_ecma_transforms_testing::{test, test_fixture, Tester};
use swc_ecma_visit::Fold;

fn syntax() -> Syntax {
    Syntax::Es(EsConfig {
        ..Default::default()
    })
}

fn tr(_tester: &mut Tester<'_>, config: Config) -> impl Fold {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();
    chain!(
        resolver(unresolved_mark, top_level_mark, false),
        system_js(top_level_mark, config)
    )
}

test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            allow_top_level_this: true
        }
    ),
    allow_top_level_this_true,
    r#"export var v = this;"#,
    r#"System.register([], function(_export, _context) {
        "use strict";
        var v;
        return {
            setters: [],
            execute: function() {
                _export("v", v = this);
            }
        };
    });"#
);

test!(
    syntax(),
    |tester| tr(
        tester,
        Config {
            allow_top_level_this: false
        }
    ),
    allow_top_level_this_false,
    r#"export var v = this;
    function a() {
        function d () {}
        var b = this; 
    } "#,
    r#"System.register([], function(_export, _context) {
        "use strict";
        var v;
        function a() {
            function d() {}
            var b = this;
        }
        return {
            setters: [],
            execute: function() {
                _export("v", v = void 0);
            }
        };
    });"#
);

// TODO: test get-module-name-option, tla

#[testing::fixture("tests/fixture/systemjs/**/input.mjs")]
fn fixture(input: PathBuf) {
    let dir = input.parent().unwrap().to_path_buf();

    let output = dir.join("output.mjs");

    test_fixture(
        syntax(),
        &|tester| {
            tr(
                tester,
                Config {
                    ..Default::default()
                },
            )
        },
        &input,
        &output,
    );
}
