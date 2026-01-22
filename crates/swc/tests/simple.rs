use swc::{
    config::{Config, IsModule, JscConfig, Options},
    Compiler,
};
use swc_common::FileName;
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{Syntax, TsSyntax};
use testing::Tester;

fn compile(src: &str, options: Options) -> String {
    Tester::new()
        .print_errors(|cm, handler| {
            let c = Compiler::new(cm.clone());

            let fm = cm.new_source_file(FileName::Real("input.js".into()).into(), src.to_string());
            let s = c.process_js_file(fm, &handler, &options);

            match s {
                Ok(v) => {
                    if handler.has_errors() {
                        Err(())
                    } else {
                        Ok(v.code)
                    }
                }
                Err(..) => Err(()),
            }
        })
        .unwrap()
}

#[test]
fn issue_834_1() {
    compile(
        "var foo =  2n + 7n;",
        Options {
            swcrc: false,
            ..Default::default()
        },
    );
}

#[test]
fn issue_834_2() {
    compile(
        "var ano = { some: {
	ne:  {

	}
}};
var foo = ano.some.ne?.sdf?.snop;
const someValue = 'test' ?? 'default value';",
        Options {
            config: Config {
                jsc: JscConfig {
                    syntax: Some(Syntax::Es(Default::default())),
                    ..Default::default()
                },
                ..Default::default()
            },
            swcrc: false,
            ..Default::default()
        },
    );
}

#[test]
fn issue_834_3() {
    compile(
        "const someValue = 'test'  ?? 'default value';",
        Options {
            config: Config {
                jsc: JscConfig {
                    syntax: Some(Syntax::Es(Default::default())),
                    ..Default::default()
                },
                ..Default::default()
            },
            swcrc: false,
            ..Default::default()
        },
    );
}

#[test]
fn test_tsx_escape_xhtml() {
    let source = r#"<div id="abc&gt;" />"#;

    let expected = r#"/*#__PURE__*/ React.createElement("div", {
    id: "abc>"
});
"#;

    let compiled_es5 = compile(
        source,
        Options {
            config: Config {
                jsc: JscConfig {
                    syntax: Some(Syntax::Typescript(TsSyntax {
                        tsx: true,
                        ..Default::default()
                    })),
                    target: Some(EsVersion::Es5),
                    ..Default::default()
                },
                ..Default::default()
            },
            swcrc: false,
            ..Default::default()
        },
    );

    assert_eq!(compiled_es5, expected);

    let compiled_es2020 = compile(
        source,
        Options {
            config: Config {
                jsc: JscConfig {
                    syntax: Some(Syntax::Typescript(TsSyntax {
                        tsx: true,
                        ..Default::default()
                    })),
                    target: Some(EsVersion::Es2020),
                    ..Default::default()
                },
                ..Default::default()
            },
            swcrc: false,
            ..Default::default()
        },
    );

    assert_eq!(compiled_es2020, expected);
}

#[test]
fn is_module_unknown_script() {
    let source = "module.exports = foo =  2n + 7n;";
    let expected = "module.exports = foo = 2n + 7n;\n";

    let compiled = compile(
        source,
        Options {
            swcrc: false,
            config: Config {
                is_module: Some(IsModule::Unknown),
                ..Default::default()
            },
            ..Default::default()
        },
    );

    assert_eq!(compiled, expected);
}

#[test]
fn is_module_unknown_module() {
    let source = "export var foo =  2n + 7n;";
    let expected = "export var foo = 2n + 7n;\n";

    let compiled = compile(
        source,
        Options {
            swcrc: false,
            config: Config {
                is_module: Some(IsModule::Unknown),
                ..Default::default()
            },
            ..Default::default()
        },
    );

    assert_eq!(compiled, expected);
}

#[test]
fn test_unicode_property_regex_transform() {
    // Test that unicode property escapes are expanded to character classes
    let source = r#"const re = /\p{ASCII}/u;"#;

    let compiled = compile(
        source,
        Options {
            swcrc: false,
            config: Config {
                jsc: JscConfig {
                    target: Some(EsVersion::Es2017),
                    ..Default::default()
                },
                ..Default::default()
            },
            ..Default::default()
        },
    );

    // Should be transformed to RegExp with expanded character class
    assert!(compiled.contains("RegExp"));
    // Should contain the ASCII range (double backslash because it's in a string,
    // not regex literal)
    assert!(compiled.contains("[\\\\u0000-\\\\u007F]"));
    // Should NOT contain the original \p{ASCII} escape (also double backslash in
    // string)
    assert!(!compiled.contains("\\\\p{ASCII}"));
}

#[test]
fn test_unicode_property_regex_letter() {
    // Test that Letter property is expanded
    let source = r#"const re = /\p{L}/u;"#;

    let compiled = compile(
        source,
        Options {
            swcrc: false,
            config: Config {
                jsc: JscConfig {
                    target: Some(EsVersion::Es2017),
                    ..Default::default()
                },
                ..Default::default()
            },
            ..Default::default()
        },
    );

    // Print for debugging
    eprintln!("Letter compiled output: {compiled}");

    // Should be transformed to RegExp with character classes
    assert!(compiled.contains("RegExp"));
    // Should NOT contain the original \p{L} escape
    assert!(!compiled.contains("\\p{L}"));
}
