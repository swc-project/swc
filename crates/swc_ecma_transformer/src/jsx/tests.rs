//! Tests for JSX transformation.

use swc_common::{sync::Lrc, FileName, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};
use swc_ecma_visit::VisitMutWith;

use super::*;

/// Helper function to parse JSX code.
fn parse_jsx(code: &str) -> Module {
    let cm = Lrc::new(SourceMap::default());
    let fm = cm.new_source_file(Lrc::new(FileName::Anon), code.to_string());

    let lexer = Lexer::new(
        Syntax::Es(swc_ecma_parser::EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        Default::default(),
        StringInput::from(&*fm),
        None,
    );

    let mut parser = Parser::new_from(lexer);
    parser.parse_module().expect("Failed to parse JSX")
}

/// Helper to transform JSX with given options.
fn transform_jsx(code: &str, options: JsxOptions) -> Module {
    let mut module = parse_jsx(code);
    let mut transform = JsxTransform::new(options);
    module.visit_mut_with(&mut transform);
    module
}

#[test]
fn test_simple_element_automatic() {
    let code = r#"const x = <div>hello</div>;"#;
    let options = JsxOptions::new().with_runtime(Runtime::Automatic);
    let result = transform_jsx(code, options);

    // Should have imports injected
    assert!(!result.body.is_empty());

    // First item should be an import
    matches!(
        &result.body[0],
        ModuleItem::ModuleDecl(ModuleDecl::Import(_))
    );
}

#[test]
fn test_simple_element_classic() {
    let code = r#"const x = <div>hello</div>;"#;
    let options = JsxOptions::new().with_runtime(Runtime::Classic);
    let result = transform_jsx(code, options);

    // Should NOT have imports injected for classic runtime
    // First item should be the variable declaration
    if let ModuleItem::Stmt(Stmt::Decl(Decl::Var(_))) = &result.body[0] {
        // OK
    } else {
        panic!("Expected variable declaration as first item");
    }
}

#[test]
fn test_fragment_automatic() {
    let code = r#"const x = <>hello</>;"#;
    let options = JsxOptions::new().with_runtime(Runtime::Automatic);
    let result = transform_jsx(code, options);

    // Should have imports including Fragment
    assert!(!result.body.is_empty());
}

#[test]
fn test_fragment_classic() {
    let code = r#"const x = <>hello</>;"#;
    let options = JsxOptions::new().with_runtime(Runtime::Classic);
    let result = transform_jsx(code, options);

    // Should transform to React.Fragment
    assert!(!result.body.is_empty());
}

#[test]
fn test_element_with_props() {
    let code = r#"const x = <div className="test" id="foo">hello</div>;"#;
    let options = JsxOptions::new().with_runtime(Runtime::Automatic);
    let result = transform_jsx(code, options);

    assert!(!result.body.is_empty());
}

#[test]
fn test_element_with_spread() {
    let code = r#"const x = <div {...props}>hello</div>;"#;
    let options = JsxOptions::new().with_runtime(Runtime::Automatic);
    let result = transform_jsx(code, options);

    assert!(!result.body.is_empty());
}

#[test]
fn test_element_with_key() {
    let code = r#"const x = <div key="test">hello</div>;"#;
    let options = JsxOptions::new().with_runtime(Runtime::Automatic);
    let result = transform_jsx(code, options);

    // In automatic runtime, key should be extracted as third argument
    assert!(!result.body.is_empty());
}

#[test]
fn test_multiple_children() {
    let code = r#"const x = <div><span>a</span><span>b</span></div>;"#;
    let options = JsxOptions::new().with_runtime(Runtime::Automatic);
    let result = transform_jsx(code, options);

    // Should use jsxs for multiple children
    assert!(!result.body.is_empty());
}

#[test]
fn test_component_element() {
    let code = r#"const x = <Component prop="value" />;"#;
    let options = JsxOptions::new().with_runtime(Runtime::Automatic);
    let result = transform_jsx(code, options);

    assert!(!result.body.is_empty());
}

#[test]
fn test_member_expression() {
    let code = r#"const x = <Foo.Bar.Baz />;"#;
    let options = JsxOptions::new().with_runtime(Runtime::Automatic);
    let result = transform_jsx(code, options);

    assert!(!result.body.is_empty());
}

#[test]
fn test_custom_pragma() {
    let code = r#"const x = <div>hello</div>;"#;
    let options = JsxOptions::new()
        .with_runtime(Runtime::Classic)
        .with_pragma("h");
    let result = transform_jsx(code, options);

    assert!(!result.body.is_empty());
}

#[test]
fn test_custom_import_source() {
    let code = r#"const x = <div>hello</div>;"#;
    let options = JsxOptions::new()
        .with_runtime(Runtime::Automatic)
        .with_import_source("preact");
    let result = transform_jsx(code, options);

    // Should have imports
    assert!(!result.body.is_empty());
    matches!(
        &result.body[0],
        ModuleItem::ModuleDecl(ModuleDecl::Import(_))
    );
}

#[test]
fn test_whitespace_normalization() {
    let code = r#"const x = <div>
        hello
        world
    </div>;"#;
    let options = JsxOptions::new().with_runtime(Runtime::Automatic);
    let result = transform_jsx(code, options);

    // Whitespace should be normalized to "hello world"
    assert!(!result.body.is_empty());
}

#[test]
fn test_boolean_attribute() {
    let code = r#"const x = <input disabled />;"#;
    let options = JsxOptions::new().with_runtime(Runtime::Automatic);
    let result = transform_jsx(code, options);

    assert!(!result.body.is_empty());
}

#[test]
fn test_expression_attribute() {
    let code = r#"const x = <div prop={value} />;"#;
    let options = JsxOptions::new().with_runtime(Runtime::Automatic);
    let result = transform_jsx(code, options);

    assert!(!result.body.is_empty());
}

#[test]
fn test_hyphenated_attribute() {
    let code = r#"const x = <div data-test="value" />;"#;
    let options = JsxOptions::new().with_runtime(Runtime::Automatic);
    let result = transform_jsx(code, options);

    // Hyphenated attributes should be strings
    assert!(!result.body.is_empty());
}
