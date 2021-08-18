use std::borrow::Cow;
use swc_common::pass::CompilerPass;
use swc_ecma_transforms_base::pass::JsPass;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, VisitMut};

/// https://github.com/tc39/proposal-private-fields-in-in
pub fn private_in_object() -> impl JsPass {
    as_folder(PrivateInObject {})
}

struct PrivateInObject {}

impl CompilerPass for PrivateInObject {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("private-in-object")
    }
}

impl VisitMut for PrivateInObject {
    noop_visit_mut_type!();
}

#[cfg(test)]
mod tests {
    use super::private_in_object;
    use serde::Deserialize;
    use std::path::PathBuf;
    use swc_common::chain;
    use swc_ecma_parser::{EsConfig, Syntax};
    use swc_ecma_transforms_base::pass::noop;
    use swc_ecma_transforms_compat::{es2015::classes, es2020::class_properties};
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

    #[testing::fixture("tests/private-in-object/**/input.js")]
    fn fixture(input: PathBuf) {
        let parent = input.parent().unwrap();

        let options: TestOptions = parse_options(&parent);

        let output = parent.join("output.js");
        test_fixture(
            Syntax::Es(EsConfig {
                private_in_object: true,
                ..Default::default()
            }),
            &|t| {
                let mut pass: Box<dyn Fold> = Box::new(noop());

                for plugin in &options.plugins {
                    let (name, _option) = match plugin {
                        PluginConfig::WithOption(name, config) => (name, config.clone()),
                        PluginConfig::Name(name) => (name, serde_json::Value::Null),
                    };

                    match &**name {
                        "proposal-private-property-in-object" => {
                            pass = Box::new(chain!(pass, private_in_object()));
                        }

                        "proposal-class-properties" => {
                            pass = Box::new(chain!(pass, class_properties()));
                        }

                        "proposal-private-methods" => {}

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

    #[testing::fixture("tests/private-in-object/**/exec.js")]
    fn exec(input: PathBuf) {}
}
