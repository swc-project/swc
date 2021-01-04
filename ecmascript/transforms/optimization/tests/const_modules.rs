use std::collections::HashMap;
use swc_ecma_transforms_optimization::const_modules;
use swc_ecma_transforms_testing::test;
use swc_ecma_transforms_testing::Tester;
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
