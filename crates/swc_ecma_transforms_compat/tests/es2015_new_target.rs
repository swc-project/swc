use std::{fs::read_to_string, path::PathBuf};

use serde::Deserialize;
use swc_common::{chain, Mark};
use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_transforms_base::pass::noop;
use swc_ecma_transforms_compat::{
    es2015::{arrow, classes, new_target::new_target},
    es2022::class_properties,
};
use swc_ecma_transforms_testing::{exec_tr, parse_options, test, test_fixture, Tester};
use swc_ecma_visit::Fold;

fn get_passes(t: &Tester, plugins: &[PluginConfig]) -> Box<dyn Fold> {
    let mut pass: Box<dyn Fold> = Box::new(noop());

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
                pass = Box::new(chain!(
                    pass,
                    class_properties(
                        Some(t.comments.clone()),
                        class_properties::Config {
                            constant_super: loose,
                            set_public_fields: loose,
                            private_as_properties: loose,
                            no_document_all: loose
                        }
                    )
                ));
            }

            "transform-arrow-functions" => {
                pass = Box::new(chain!(pass, arrow(Mark::new())));
            }

            _ => {
                panic!("unknown pass: {}", name)
            }
        }
    }

    pass = Box::new(chain!(pass, new_target()));

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
        Syntax::Es(EsConfig {
            private_in_object: true,
            ..Default::default()
        }),
        &|t| get_passes(t, &options.plugins),
        &input,
        &output,
        Default::default(),
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
        const a = () => this instanceof foo ? this.constructor : void 0
    }"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| new_target(),
    issue_4193,
    r#"const v0 = Symbol("Context#bar");
    module.exports = {
        get bar() {
            if (new.target === "foo") {
                return;
            }
            return new Proxy(this, v0);
        }
    };"#,
    r#"const v0 = Symbol("Context#bar");
    module.exports = {
        get bar() {
            if (void 0 === "foo") {
                return;
            }
            return new Proxy(this, v0);
        }
    };"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |_| new_target(),
    edge_13,
    r#"
class A {
    foo() {
        return () => new.target
    }

    constructor() {
        () => new.target
    }
}
"#,
    r#"
class A {
    foo() {
        return ()=>void 0;
    }
    constructor(){
        ()=>this.constructor;
    }
}
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |t| chain!(
        classes(Some(t.comments.clone()), Default::default()),
        new_target()
    ),
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
"#,
    r#"
(()=>{
    var SomeError = function _target(Error) {
        "use strict";
        _inherits(SomeError, Error);
        var _super = _createSuper(SomeError);
        function SomeError(issues) {
            _classCallCheck(this, SomeError);
            var _this = _super.call(this);
            const actualProto = (this instanceof SomeError ? this.constructor : void 0).prototype;
            return _this;
        }
        return SomeError;
    }(_wrapNativeSuper(Error));
})();
"#
);
