use swc_ecma_parser::TsSyntax;
use swc_ts_fast_strip::{Mode, Options, TransformConfig};
use swc_ts_fast_strip_binding::transform;

/// Helper function to create default options with a specific mode
fn opts(mode: Mode) -> Options {
    Options {
        module: None,
        filename: Some("test.ts".into()),
        parser: TsSyntax {
            decorators: true,
            ..Default::default()
        },
        mode,
        transform: Some(TransformConfig::default()),
        deprecated_ts_module_as_error: Some(true),
        ..Default::default()
    }
}

/// Helper function to create options without deprecated_ts_module_as_error
fn opts_no_filename(mode: Mode) -> Options {
    Options {
        module: None,
        filename: None,
        parser: TsSyntax {
            decorators: true,
            ..Default::default()
        },
        mode,
        transform: Some(TransformConfig::default()),
        deprecated_ts_module_as_error: Some(true),
        ..Default::default()
    }
}

#[test]
fn properly_reports_error() {
    let result = transform("Foo {}".into(), opts_no_filename(Mode::StripOnly));
    assert!(result.is_err(), "should return Err for invalid syntax");
}

#[test]
fn should_strip_types() {
    let code = r#"
        export const foo: number = 1;
        type Foo = number;
    "#;

    let result = transform(code.into(), opts_no_filename(Mode::StripOnly));
    assert!(result.is_ok(), "should succeed");

    let output = result.unwrap();
    assert!(output.code.contains("export const foo"));
    assert!(!output.code.contains(": number"));
    assert!(!output.code.contains("type Foo"));
}

mod strip_only_mode {
    use super::*;

    #[test]
    fn should_remove_declare_enum_empty() {
        let result = transform(
            "declare enum Foo {}".into(),
            opts_no_filename(Mode::StripOnly),
        );
        assert!(result.is_ok(), "should succeed");

        let output = result.unwrap();
        assert!(!output.code.contains("declare enum"));
        assert!(!output.code.contains("enum"));
    }

    #[test]
    fn should_remove_declare_enum_with_member() {
        let code = "declare enum Foo {\n    A\n}";
        let result = transform(code.into(), opts_no_filename(Mode::StripOnly));
        assert!(result.is_ok(), "should succeed");

        let output = result.unwrap();
        assert!(!output.code.contains("declare enum"));
        assert!(!output.code.contains("enum"));
    }

    #[test]
    fn should_remove_declare_enum_with_values() {
        let code = "declare enum Foo {\n    a = 2,\n    b,\n}";
        let result = transform(code.into(), opts_no_filename(Mode::StripOnly));
        assert!(result.is_ok(), "should succeed");

        let output = result.unwrap();
        assert!(!output.code.contains("declare enum"));
        assert!(!output.code.contains("enum"));
    }

    #[test]
    fn should_strip_type_declarations() {
        let code = r#"const foo = 1;
                    type Foo = number;
                    type Bar = string;
                    const bar: Bar = "bar";"#;

        let result = transform(code.into(), opts_no_filename(Mode::StripOnly));
        assert!(result.is_ok(), "should succeed");

        let output = result.unwrap();
        assert!(output.code.contains("const foo = 1"));
        assert!(output.code.contains("const bar"));
        assert!(!output.code.contains("type Foo"));
        assert!(!output.code.contains("type Bar"));
        assert!(!output.code.contains(": Bar"));
    }

    #[test]
    fn should_strip_type_annotations() {
        let code = r#"const foo = 1;
                    const bar: Bar = "bar";"#;

        let result = transform(code.into(), opts_no_filename(Mode::StripOnly));
        assert!(result.is_ok(), "should succeed");

        let output = result.unwrap();
        assert!(!output.code.contains(": Bar"));
    }

    #[test]
    fn should_strip_type_assertions() {
        let code = r#"const foo = 1 as number;
                    const bar = "bar";"#;

        let result = transform(code.into(), opts_no_filename(Mode::StripOnly));
        assert!(result.is_ok(), "should succeed");

        let output = result.unwrap();
        assert!(!output.code.contains("as number"));
        assert!(output.code.contains("const foo = 1"));
    }

    #[test]
    fn should_strip_nonnull_assertions() {
        let code = r#"const foo = 1!;
                    const bar = "bar";"#;

        let result = transform(code.into(), opts_no_filename(Mode::StripOnly));
        assert!(result.is_ok(), "should succeed");

        let output = result.unwrap();
        assert!(!output.code.contains("1!"));
        assert!(output.code.contains("const foo = 1"));
    }

    #[test]
    fn should_strip_satisfies() {
        let code = r#"const foo = 1 satisfies number;
                    const bar = "bar";"#;

        let result = transform(code.into(), opts_no_filename(Mode::StripOnly));
        assert!(result.is_ok(), "should succeed");

        let output = result.unwrap();
        assert!(!output.code.contains("satisfies"));
        assert!(output.code.contains("const foo = 1"));
    }

    #[test]
    fn should_strip_complex_expressions() {
        let code = r#"const foo = {
                        foo: 1 as number,
                        bar: "bar" as any as number,
                    } satisfies number;
                    const bar = "bar";"#;

        let result = transform(code.into(), opts_no_filename(Mode::StripOnly));
        assert!(result.is_ok(), "should succeed");

        let output = result.unwrap();
        assert!(!output.code.contains("as number"));
        assert!(!output.code.contains("as any"));
        assert!(!output.code.contains("satisfies"));
    }

    #[test]
    fn should_throw_error_on_enum() {
        let result = transform("enum Foo {}".into(), opts(Mode::StripOnly));
        assert!(result.is_err(), "should return Err for enum");

        let err = result.unwrap_err();
        assert!(!err.is_empty(), "should have error diagnostics");
    }

    #[test]
    fn should_throw_error_on_namespace() {
        let result = transform(
            "namespace Foo { export const m = 1; }".into(),
            opts(Mode::StripOnly),
        );
        assert!(result.is_err(), "should return Err for namespace");

        let err = result.unwrap_err();
        assert!(!err.is_empty(), "should have error diagnostics");
    }

    #[test]
    fn should_throw_error_on_module() {
        let mut options = opts(Mode::StripOnly);
        options.deprecated_ts_module_as_error = Some(true);

        let result = transform("module foo { }".into(), options);
        assert!(result.is_err(), "should return Err for module");

        let err = result.unwrap_err();
        assert!(!err.is_empty(), "should have error diagnostics");
    }

    #[test]
    fn should_throw_error_on_declare_module() {
        let mut options = opts(Mode::StripOnly);
        options.deprecated_ts_module_as_error = Some(true);

        let result = transform("declare module foo { }".into(), options);
        assert!(result.is_err(), "should return Err for declare module");

        let err = result.unwrap_err();
        assert!(!err.is_empty(), "should have error diagnostics");
    }

    #[test]
    fn should_not_emit_caused_by_failed_to_parse() {
        let result = transform(
            "function foo() { await Promise.resolve(1); }".into(),
            opts(Mode::StripOnly),
        );
        assert!(result.is_err(), "should return Err for await outside async");

        let err = result.unwrap_err();
        assert!(!err.is_empty(), "should have error diagnostics");

        // Check that the error message doesn't contain "Caused by: failed to parse"
        let error_messages: Vec<String> = err
            .iter()
            .map(|d| serde_json::to_string(d).unwrap())
            .collect();
        for msg in error_messages {
            assert!(
                !msg.contains("Caused by: failed to parse"),
                "should not contain 'Caused by: failed to parse'"
            );
        }
    }

    #[test]
    fn should_report_correct_error_for_syntax_error() {
        let result = transform(
            "function foo() { invalid syntax }".into(),
            opts(Mode::StripOnly),
        );
        assert!(result.is_err(), "should return Err for syntax error");

        let err = result.unwrap_err();
        assert!(!err.is_empty(), "should have error diagnostics");
        assert!(
            !serde_json::to_string(&err[0]).unwrap().is_empty(),
            "should have error message"
        );
    }

    #[test]
    fn should_report_correct_error_for_unsupported_syntax() {
        let code = "enum Foo {\n    a, b    \n}";
        let result = transform(code.into(), opts(Mode::StripOnly));
        assert!(result.is_err(), "should return Err for unsupported enum");

        let err = result.unwrap_err();
        assert!(!err.is_empty(), "should have error diagnostics");
    }
}

mod transform_mode {
    use super::*;

    #[test]
    fn should_throw_error_on_module() {
        let mut options = opts(Mode::Transform);
        options.deprecated_ts_module_as_error = Some(true);

        let result = transform("module foo { }".into(), options);
        assert!(result.is_err(), "should return Err for module");

        let err = result.unwrap_err();
        assert!(!err.is_empty(), "should have error diagnostics");
    }

    #[test]
    fn should_throw_error_on_declared_module() {
        let mut options = opts(Mode::Transform);
        options.deprecated_ts_module_as_error = Some(true);

        let result = transform("declare module foo { }".into(), options);
        assert!(result.is_err(), "should return Err for declare module");

        let err = result.unwrap_err();
        assert!(!err.is_empty(), "should have error diagnostics");
    }

    #[test]
    fn should_throw_object_even_with_deprecated_ts_module_as_error() {
        let mut options = opts_no_filename(Mode::Transform);
        options.deprecated_ts_module_as_error = Some(true);

        let result = transform("module F { export type x = number }".into(), options);
        assert!(result.is_err(), "should return Err for module");

        let err = result.unwrap_err();
        assert!(!err.is_empty(), "should have error diagnostics");
    }
}
