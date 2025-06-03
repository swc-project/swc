use std::path::Path;
use swc_common::{sync::Lazy, SourceMap};
use swc_ecma_ast::Program;
use swc_ecma_minifier::{
    option::{MangleOptions, MinifyOptions},
    optimize,
};
use swc_ecma_parser::{EsConfig, Syntax};
use swc_ecma_transforms_testing::test_fixture;
use testing::NormalizedOutput;

#[test]
fn test_method_mangling_enabled() {
    test_fixture(
        Syntax::Es(EsConfig {
            jsx: true,
            ..Default::default()
        }),
        &|_| {
            let options = MinifyOptions {
                compress: None,
                mangle: Some(MangleOptions {
                    mangle_methods: true,
                    ..Default::default()
                }),
                ..Default::default()
            };

            optimize(options, Default::default())
        },
        "tests/method_mangling.js",
        "tests/method_mangling_enabled.expected.js",
        Default::default(),
    );
}

#[test]
fn test_method_mangling_disabled() {
    test_fixture(
        Syntax::Es(EsConfig {
            jsx: true,
            ..Default::default()
        }),
        &|_| {
            let options = MinifyOptions {
                compress: None,
                mangle: Some(MangleOptions {
                    mangle_methods: false,
                    ..Default::default()
                }),
                ..Default::default()
            };

            optimize(options, Default::default())
        },
        "tests/method_mangling.js",
        "tests/method_mangling_disabled.expected.js",
        Default::default(),
    );
} 
