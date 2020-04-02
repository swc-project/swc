#![feature(box_syntax)]
#![feature(test)]
#![feature(box_patterns)]
#![feature(specialization)]

use common::Tester;
use std::collections::HashMap;
use swc_ecma_transforms::{const_modules, pass::Pass};

#[macro_use]
mod common;

fn tr(_: &mut Tester<'_>, sources: &[(&str, &[(&str, &str)])]) -> impl Pass {
    let mut m = HashMap::default();

    for (src, values) in sources {
        let values = values
            .iter()
            .map(|(k, v)| ((*k).into(), v.to_string()))
            .collect();

        m.insert((*src).into(), values);
    }

    const_modules(m)
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
