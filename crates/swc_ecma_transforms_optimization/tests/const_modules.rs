use std::{collections::HashMap, fs::read_to_string, path::PathBuf};

use swc_ecma_ast::Pass;
use swc_ecma_transforms_optimization::const_modules;
use swc_ecma_transforms_testing::{test, test_fixture, Tester};

fn tr(t: &mut Tester<'_>, sources: &[(&str, &[(&str, &str)])]) -> impl Pass {
    let mut m = HashMap::default();

    for (src, values) in sources {
        let values = values
            .iter()
            .map(|(k, v)| ((*k).into(), v.to_string()))
            .collect();

        m.insert((*src).into(), values);
    }

    const_modules(t.cm.clone(), m)
}

test!(
    ::swc_ecma_parser::Syntax::default(),
    |tester| tr(tester, &[("@ember/env-flags", &[("DEBUG", "true")])]),
    simple_flags,
    r#"import { DEBUG } from '@ember/env-flags';
        if (DEBUG) {
            console.log('Foo!');
        }"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |tester| tr(tester, &[("@ember/env-flags", &[("DEBUG", "true")])]),
    imports_hoisted,
    r#"
        if (DEBUG) {
            console.log('Foo!');
        }
        
        import { DEBUG } from '@ember/env-flags';
        "#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |tester| tr(
        tester,
        &[
            ("@ember/env-flags", &[("DEBUG", "true")]),
            (
                "@ember/features",
                &[("FEATURE_A", "false"), ("FEATURE_B", "true")]
            )
        ]
    ),
    complex_multiple,
    "
import { DEBUG } from '@ember/env-flags';
import { FEATURE_A, FEATURE_B } from '@ember/features';
if (DEBUG) {
    console.log('Foo!');
}

let woot;
if (FEATURE_A) {
  woot = () => 'woot';
} else if (FEATURE_B) {
  woot = () => 'toow';
}
"
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |tester| tr(tester, &[("foo", &[("bar", "true")])]),
    namespace_import,
    r#"
import * as foo from 'foo';
console.log(foo.bar)
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |tester| tr(tester, &[("foo", &[("bar", "true")])]),
    namespace_import_computed,
    r#"
import * as foo from 'foo';
console.log(foo["bar"])
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |tester| tr(
        tester,
        &[("testModule", &[("testMap", "{ 'var': 'value' }")])]
    ),
    issue_7025,
    r#"
    import { testMap } from "testModule";
    testMap['var'];
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |tester| tr(tester, &[("foo", &[("bar", "true")])]),
    use_as_object_prop_shorthand,
    r#"
import { bar } from 'foo';
console.log({ bar });
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |tester| tr(tester, &[("my-mod", &[("default", "true")])]),
    default_import_issue_7601,
    r#"
import something from 'my-mod';
console.log(something);
"#
);

#[testing::fixture("tests/const-modules/**/input.js")]
fn const_modules_test(input: PathBuf) {
    let globals = input.with_file_name("globals.json");
    let output = input.with_file_name("output.js");

    test_fixture(
        ::swc_ecma_parser::Syntax::default(),
        &|t| {
            let globals = read_to_string(&globals)
                .ok()
                .and_then(|s| serde_json::from_str(&s).ok())
                .unwrap_or_default();

            const_modules(t.cm.clone(), globals)
        },
        &input,
        &output,
        Default::default(),
    );
}
