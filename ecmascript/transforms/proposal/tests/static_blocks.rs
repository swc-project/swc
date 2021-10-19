use serde::Deserialize;
use std::path::PathBuf;
use swc_common::chain;
use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_transforms_base::pass::noop;
use swc_ecma_transforms_compat::{es2015::classes, es2020::class_properties};
use swc_ecma_transforms_proposal::static_blocks;
use swc_ecma_transforms_testing::{parse_options, test_fixture};
use swc_ecma_visit::Fold;

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

#[testing::fixture("tests/static-blocks/**/input.js")]
fn fixture(input: PathBuf) {
    let parent = input.parent().unwrap();

    let options: TestOptions = parse_options(&parent);

    let output = parent.join("output.js");
    test_fixture(
        Syntax::Es(EsConfig {
            static_blocks: true,
            ..Default::default()
        }),
        &|t| {
            let mut pass: Box<dyn Fold> = Box::new(chain!(noop(), static_blocks()));
            let mut class_props = false;

            for plugin in &options.plugins {
                let (name, _option) = match plugin {
                    PluginConfig::WithOption(name, config) => (name, config.clone()),
                    PluginConfig::Name(name) => (name, serde_json::Value::Null),
                };

                match &**name {
                    "proposal-class-static-block" => {}

                    "proposal-class-properties" => {
                        if !class_props {
                            class_props = true;
                            pass = Box::new(chain!(
                                pass,
                                class_properties(class_properties::Config {
                                    loose: input.to_string_lossy().contains("private-loose")
                                })
                            ));
                        }
                    }

                    "transform-classes" => {
                        pass = Box::new(chain!(pass, classes(Some(t.comments.clone()))));
                    }

                    _ => {
                        panic!("unknown pass: {}", name)
                    }
                }
            }
            pass
        },
        &input,
        &output,
    )
}
