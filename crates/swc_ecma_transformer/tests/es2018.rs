//! Integration tests for ES2018 transformations.

use std::{io, path::PathBuf, sync::Arc};

use swc_common::{errors::Handler, sync::Lrc, FileName, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_hooks::{CompositeHook, VisitMutWithHook};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};
use swc_ecma_transformer::{
    es2018::{ES2018Options, ES2018},
    TransformCtx,
};
use swc_ecma_visit::VisitMutWith;

/// Helper function to parse JavaScript code into an AST.
fn parse_js(code: &str) -> Module {
    let source_map = Lrc::new(SourceMap::default());
    let source_file = source_map.new_source_file(Lrc::new(FileName::Anon), code.to_string());

    let lexer = Lexer::new(
        Syntax::Es(Default::default()),
        Default::default(),
        StringInput::from(&*source_file),
        None,
    );

    let mut parser = Parser::new_from(lexer);
    parser
        .parse_module()
        .expect("Failed to parse JavaScript code")
}

/// Helper function to create a test transform context.
fn create_test_ctx(code: &str) -> TransformCtx {
    let source_map_lrc = Lrc::new(SourceMap::default());
    let source_file = source_map_lrc.new_source_file(Lrc::new(FileName::Anon), code.to_string());

    let handler = Lrc::new(Handler::with_emitter_writer(
        Box::new(io::sink()),
        Some(source_map_lrc.clone()),
    ));

    TransformCtx::new(
        PathBuf::from("test.js"),
        Arc::new(source_file.src.to_string()),
        source_map_lrc.clone(),
        handler,
    )
}

#[test]
fn test_es2018_transformer_creation() {
    let options = ES2018Options::all();
    let _transformer = ES2018::new(options);

    // Should not panic - transformer is dropped automatically
}

#[test]
fn test_es2018_options_default() {
    let options = ES2018Options::default();
    assert!(!options.is_enabled());
}

#[test]
fn test_es2018_options_all() {
    let options = ES2018Options::all();
    assert!(options.is_enabled());
    assert!(options.object_rest_spread);
    assert!(options.async_generator_functions);
    assert!(options.async_iteration);
}

#[test]
fn test_object_spread_detection() {
    let code = "const obj = { ...foo, bar: 'baz' };";
    let mut module = parse_js(code);

    let options = ES2018Options {
        object_rest_spread: true,
        ..Default::default()
    };
    let ctx = create_test_ctx(code);
    let hook = ES2018::new(options);
    let mut visitor = VisitMutWithHook { hook, context: ctx };

    // Should not panic
    module.visit_mut_with(&mut visitor);
}

#[test]
fn test_for_await_of_detection() {
    let code = r#"
async function test() {
    for await (const x of asyncIterable) {
        console.log(x);
    }
}
"#;
    let mut module = parse_js(code);

    let options = ES2018Options {
        async_iteration: true,
        ..Default::default()
    };
    let ctx = create_test_ctx(code);
    let hook = ES2018::new(options);
    let mut visitor = VisitMutWithHook { hook, context: ctx };

    // Should not panic
    module.visit_mut_with(&mut visitor);
}

#[test]
fn test_async_generator_detection() {
    let code = r#"
async function* gen() {
    yield await fetch('/data');
}
"#;
    let mut module = parse_js(code);

    let options = ES2018Options {
        async_generator_functions: true,
        ..Default::default()
    };
    let ctx = create_test_ctx(code);
    let hook = ES2018::new(options);
    let mut visitor = VisitMutWithHook { hook, context: ctx };

    // Should not panic
    module.visit_mut_with(&mut visitor);
}

#[test]
fn test_object_rest_pattern_detection() {
    let code = "const { x, ...rest } = obj;";
    let mut module = parse_js(code);

    let options = ES2018Options {
        object_rest_spread: true,
        ..Default::default()
    };
    let ctx = create_test_ctx(code);
    let hook = ES2018::new(options);
    let mut visitor = VisitMutWithHook { hook, context: ctx };

    // Should not panic
    module.visit_mut_with(&mut visitor);
}

#[test]
fn test_regex_named_groups_detection() {
    let code = r#"const re = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;"#;
    let mut module = parse_js(code);

    let options = ES2018Options::all();
    let ctx = create_test_ctx(code);
    let hook = ES2018::new(options);
    let mut visitor = VisitMutWithHook { hook, context: ctx };

    // Should not panic
    module.visit_mut_with(&mut visitor);
}

#[test]
fn test_disabled_transformations() {
    let code = r#"
const obj = { ...foo };
async function* gen() { yield 1; }
for await (const x of it) {}
"#;
    let mut module = parse_js(code);

    let options = ES2018Options::default(); // All disabled
    let ctx = create_test_ctx(code);
    let hook = ES2018::new(options);
    let mut visitor = VisitMutWithHook { hook, context: ctx };

    // Should not panic, transformations are disabled
    module.visit_mut_with(&mut visitor);
}

#[test]
fn test_composite_hook_integration() {
    let code = "const obj = { ...foo, bar: 1 };";
    let mut module = parse_js(code);

    let options = ES2018Options::all();
    let ctx = create_test_ctx(code);
    let hook1 = ES2018::new(options);
    let hook2 = ES2018::new(options);

    // Test that ES2018 works with CompositeHook
    let composite = CompositeHook {
        first: hook1,
        second: hook2,
    };
    let mut visitor = VisitMutWithHook {
        hook: composite,
        context: ctx,
    };

    // Should not panic
    module.visit_mut_with(&mut visitor);
}
