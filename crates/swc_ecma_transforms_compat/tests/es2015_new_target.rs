use std::{fs::read_to_string, path::PathBuf};

use serde::Deserialize;
use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    es2015::{arrow, classes, new_target::new_target},
    es2022::class_properties,
};
use swc_ecma_transforms_testing::{exec_tr, parse_options, test, test_fixture, Tester};

fn get_passes(_: &Tester, plugins: &[PluginConfig]) -> Box<dyn Pass> {
    let unresolved_mark = Mark::new();
    let top_level_mark = Mark::new();

    let mut pass: Box<dyn Pass> = Box::new(resolver(unresolved_mark, top_level_mark, true));

    for plugin in plugins {
        let (name, option) = match plugin {
            PluginConfig::WithOption(name, config) => (name, config.clone()),
            PluginConfig::Name(name) => (name, serde_json::Value::Null),
        };

        let loose = option
            .as_object()
            .and_then(|opt| opt.get("loose"))
            .and_then(|loose| {
                if let Some(true) = loose.as_bool() {
                    Some(())
                } else {
                    None
                }
            })
            .is_some();

        match &**name {
            "transform-new-target" => {}

            "proposal-class-properties" => {
                pass = Box::new((
                    pass,
                    class_properties(
                        class_properties::Config {
                            constant_super: loose,
                            set_public_fields: loose,
                            private_as_properties: loose,
                            no_document_all: loose,
                            pure_getter: loose,
                        },
                        unresolved_mark,
                    ),
                ));
            }

            "transform-arrow-functions" => {
                pass = Box::new((pass, arrow(Mark::new())));
            }

            _ => {
                panic!("unknown pass: {}", name)
            }
        }
    }

    pass = Box::new((pass, new_target()));

    pass
}

#[testing::fixture("tests/new-target/**/exec.js")]
fn exec(input: PathBuf) {
    let options: TestOptions = parse_options(&input);
    let input = read_to_string(&input).unwrap();
    exec_tr(
        "new-target",
        Default::default(),
        |t| get_passes(t, &options.plugins),
        &input,
    );
}

#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
struct TestOptions {
    plugins: Vec<PluginConfig>,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(untagged)]
enum PluginConfig {
    WithOption(String, #[serde(default)] serde_json::Value),
    Name(String),
}

#[testing::fixture("tests/new-target/**/input.js")]
fn fixture(input: PathBuf) {
    let options: TestOptions = parse_options(&input);

    let output = input.parent().unwrap().join("output.js");
    test_fixture(
        Default::default(),
        &|t| get_passes(t, &options.plugins),
        &input,
        &output,
        Default::default(),
    )
}

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| (classes(Default::default()), new_target()),
    issue_6259,
    r#"
(() => {
  var SomeError = class extends Error {
    constructor(issues) {
      super();
      const actualProto = new.target.prototype;
    }
  }
})();
"#
);
