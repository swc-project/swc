use std::{fs::read_to_string, path::PathBuf};

use serde::Deserialize;
use swc_common::chain;
use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_transforms_base::pass::noop;
use swc_ecma_transforms_compat::{
    es2015::{arrow, new_target::new_target},
    es2022::class_properties,
};
use swc_ecma_transforms_testing::{exec_tr, parse_options, test, test_fixture};
use swc_ecma_visit::Fold;

#[testing::fixture("tests/fixture/new-target/**/exec.js")]
fn exec(input: PathBuf) {
    let input = read_to_string(&input).unwrap();
    exec_tr("new-target", Default::default(), |_| new_target(), &input);
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

#[testing::fixture("tests/fixture/new-target/**/input.js")]
fn fixture(input: PathBuf) {
    let options: TestOptions = parse_options(&input);

    let output = input.parent().unwrap().join("output.js");
    test_fixture(
        Syntax::Es(EsConfig {
            private_in_object: true,
            ..Default::default()
        }),
        &|_| {
            let mut pass: Box<dyn Fold> = Box::new(noop());

            for plugin in &options.plugins {
                let (name, _option) = match plugin {
                    PluginConfig::WithOption(name, config) => (name, config.clone()),
                    PluginConfig::Name(name) => (name, serde_json::Value::Null),
                };

                match &**name {
                    "transform-new-target" => {}

                    "proposal-class-properties" => {
                        pass = Box::new(chain!(
                            pass,
                            class_properties(class_properties::Config { loose: false })
                        ));
                    }

                    "transform-arrow-functions" => {
                        pass = Box::new(chain!(pass, arrow()));
                    }

                    _ => {
                        panic!("unknown pass: {}", name)
                    }
                }
            }

            pass = Box::new(chain!(pass, new_target()));

            pass
        },
        &input,
        &output,
    )
}

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| new_target(),
    edge_12,
    r#"function foo() {
        const a = () => new.target
    }"#,
    r#"function foo() {
        var _newtarget = this instanceof foo ? this.constructor : void 0;
        const a = () => _newtarget
    }"#
);
