use std::path::PathBuf;

use serde::Deserialize;
use swc_common::Mark;
use swc_ecma_ast::Pass;
use swc_ecma_transforms_base::resolver;
use swc_ecma_transforms_compat::{
    es2015::classes,
    es2022::{class_properties, private_in_object},
};
use swc_ecma_transforms_testing::{parse_options, test_fixture};

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

#[testing::fixture("tests/private-in-object/**/input.js")]
fn fixture(input: PathBuf) {
    let parent = input.parent().unwrap();

    let options: TestOptions = parse_options(parent);

    let output = parent.join("output.js");
    test_fixture(
        Default::default(),
        &|_| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            let mut pass: Box<dyn Pass> =
                Box::new(resolver(unresolved_mark, top_level_mark, false));

            let mut class_props = false;

            for plugin in &options.plugins {
                let (name, _option) = match plugin {
                    PluginConfig::WithOption(name, config) => (name, config.clone()),
                    PluginConfig::Name(name) => (name, serde_json::Value::Null),
                };

                let loose = input.to_string_lossy().contains("private-loose");

                match &**name {
                    "proposal-private-property-in-object" => {}

                    "proposal-class-properties" => {
                        if !class_props {
                            class_props = true;
                            pass = Box::new((
                                pass,
                                class_properties(
                                    class_properties::Config {
                                        set_public_fields: loose,
                                        constant_super: loose,
                                        no_document_all: loose,
                                        private_as_properties: loose,
                                        pure_getter: loose,
                                    },
                                    unresolved_mark,
                                ),
                            ));
                        }
                    }

                    "proposal-private-methods" => {
                        if !class_props {
                            class_props = true;
                            pass = Box::new((
                                pass,
                                class_properties(
                                    class_properties::Config {
                                        set_public_fields: loose,
                                        constant_super: loose,
                                        no_document_all: loose,
                                        private_as_properties: loose,
                                        pure_getter: loose,
                                    },
                                    unresolved_mark,
                                ),
                            ));
                        }
                    }

                    "transform-classes" => {
                        pass = Box::new((pass, classes(Default::default())));
                    }

                    _ => {
                        panic!("unknown pass: {}", name)
                    }
                }
            }

            pass = Box::new((pass, private_in_object()));

            pass
        },
        &input,
        &output,
        Default::default(),
    )
}
