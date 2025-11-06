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
        transform: Some(TransformConfig {
            typescript: swc_ecma_transforms_typescript::Config {
                native_class_properties: true,
                ..Default::default()
            },
        }),
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
        transform: Some(TransformConfig {
            typescript: swc_ecma_transforms_typescript::Config {
                native_class_properties: true,
                ..Default::default()
            },
        }),
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
        let error_messages: Vec<String> = err.iter().map(|d| d.message.clone()).collect();
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
        assert!(err[0].message.len() > 0, "should have error message");
    }

    #[test]
    fn should_report_correct_error_for_unsupported_syntax() {
        let code = "enum Foo {\n    a, b    \n}";
        let result = transform(code.into(), opts(Mode::StripOnly));
        assert!(result.is_err(), "should return Err for unsupported enum");

        let err = result.unwrap_err();
        assert!(!err.is_empty(), "should have error diagnostics");
    }

    #[test]
    fn should_not_panic_memory_access_out_of_bounds() {
        let code = r#"
                var data = ""
if(!(((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((((data === "AED") || (data === "AFN")) || (data === "ALL")) || (data === "AMD")) || (data === "ANG")) || (data === "AOA")) || (data === "ARS")) || (data === "AUD")) || (data === "AWG")) || (data === "AZN")) || (data === "BAM")) || (data === "BBD")) || (data === "BDT")) || (data === "BGN")) || (data === "BHD")) || (data === "BIF")) || (data === "BMD")) || (data === "BND")) || (data === "BOB")) || (data === "BOV")) || (data === "BRL")) || (data === "BSD")) || (data === "BTN")) || (data === "BWP")) || (data === "BYN")) || (data === "BZD")) || (data === "CAD")) || (data === "CDF")) || (data === "CHE")) || (data === "CHF")) || (data === "CHW")) || (data === "CLF")) || (data === "CLP")) || (data === "CNY")) || (data === "COP")) || (data === "COU")) || (data === "CRC")) || (data === "CUC")) || (data === "CUP")) || (data === "CVE")) || (data === "CZK")) || (data === "DJF")) || (data === "DKK")) || (data === "DOP")) || (data === "DZD")) || (data === "EGP")) || (data === "ERN")) || (data === "ETB")) || (data === "EUR")) || (data === "FJD")) || (data === "FKP")) || (data === "GBP")) || (data === "GEL")) || (data === "GHS")) || (data === "GIP")) || (data === "GMD")) || (data === "GNF")) || (data === "GTQ")) || (data === "GYD")) || (data === "HKD")) || (data === "HNL")) || (data === "HRK")) || (data === "HTG")) || (data === "HUF")) || (data === "IDR")) || (data === "ILS")) || (data === "INR")) || (data === "IQD")) || (data === "IRR")) || (data === "ISK")) || (data === "JMD")) || (data === "JOD")) || (data === "JPY")) || (data === "KES")) || (data === "KGS")) || (data === "KHR")) || (data === "KMF")) || (data === "KPW")) || (data === "KRW")) || (data === "KWD")) || (data === "KYD")) || (data === "KZT")) || (data === "LAK")) || (data === "LBP")) || (data === "LKR")) || (data === "LRD")) || (data === "LSL")) || (data === "LYD")) || (data === "MAD")) || (data === "MDL")) || (data === "MGA")) || (data === "MKD")) || (data === "MMK")) || (data === "MNT")) || (data === "MOP")) || (data === "MRU")) || (data === "MUR")) || (data === "MVR")) || (data === "MWK")) || (data === "MXN")) || (data === "MXV")) || (data === "MYR")) || (data === "MZN")) || (data === "NAD")) || (data === "NGN")) || (data === "NIO")) || (data === "NOK")) || (data === "NPR")) || (data === "NZD")) || (data === "OMR")) || (data === "PAB")) || (data === "PEN")) || (data === "PGK")) || (data === "PHP")) || (data === "PKR")) || (data === "PLN")) || (data === "PYG")) || (data === "QAR")) || (data === "RON")) || (data === "RSD")) || (data === "RUB")) || (data === "RWF")) || (data === "SAR")) || (data === "SBD")) || (data === "SCR")) || (data === "SDG")) || (data === "SEK")) || (data === "SGD")) || (data === "SHP")) || (data === "SLL")) || (data === "SOS")) || (data === "SRD")) || (data === "SSP")) || (data === "STN")) || (data === "SVC")) || (data === "SYP")) || (data === "SZL")) || (data === "THB")) || (data === "TJS")) || (data === "TMT")) || (data === "TND")) || (data === "TOP")) || (data === "TRY")) || (data === "TTD")) || (data === "TWD")) || (data === "TZS")) || (data === "UAH")) || (data === "UGX")) || (data === "USD")) || (data === "USN")) || (data === "UYI")) || (data === "UYU")) || (data === "UYW")) || (data === "UZS")) || (data === "VES")) || (data === "VND")) || (data === "VUV")) || (data === "WST")) || (data === "XAF")) || (data === "XAG")) || (data === "XAU")) || (data === "XBA")) || (data === "XBB")) || (data === "XBC")) || (data === "XBD")) || (data === "XCD")) || (data === "XDR")) || (data === "XOF")) || (data === "XPD")) || (data === "XPF")) || (data === "XPT")) || (data === "XSU")) || (data === "XTS")) || (data === "XUA")) || (data === "XXX")) || (data === "YER")) || (data === "ZAR")) || (data === "ZMW")) || (data === "ZWL"))) {
  console.log("Hello");
}
            "#;

        let result = transform(code.into(), opts_no_filename(Mode::StripOnly));
        // Should not panic - either succeed or return an error
        assert!(
            result.is_ok() || result.is_err(),
            "should not panic on deeply nested expression"
        );
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
