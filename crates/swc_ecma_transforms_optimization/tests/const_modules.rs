use std::collections::HashMap;

use swc_ecma_transforms_optimization::const_modules;
use swc_ecma_transforms_testing::{test, Tester};
use swc_ecma_visit::Fold;

fn tr(t: &mut Tester<'_>, sources: &[(&str, &[(&str, &str)])]) -> impl Fold {
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
        }"#,
    r#"
        if (true) {
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
        "#,
    r#"
        if (true) {
            console.log('Foo!');
        }"#
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
",
    "
if (true) {
    console.log('Foo!');
}

let woot;
if (false) {
  woot = () => 'woot';
} else if (true) {
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
"#,
    r#"
console.log(true);
"#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |tester| tr(tester, &[("foo", &[("bar", "true")])]),
    namespace_import_computed,
    r#"
import * as foo from 'foo';
console.log(foo["bar"])
"#,
    r#"
console.log(true);
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
"#,
    r#"
    ({
        'var': 'value'
    })['var'];
    "#
);

test!(
    ::swc_ecma_parser::Syntax::default(),
    |tester| tr(tester, &[("foo", &[("bar", "true")])]),
    use_as_object_prop_shorthand,
    r#"
import { bar } from 'foo';
console.log({ bar });
"#,
    r#"
console.log({ bar: true });
"#
);
