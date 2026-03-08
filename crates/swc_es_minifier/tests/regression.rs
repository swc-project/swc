use swc_common::{comments::SingleThreadedComments, FileName, SourceMap};
use swc_es_codegen::{emit_program, Config};
use swc_es_minifier::{minify_program, CompressOptions, MangleOptions, MinifyOptions};
use swc_es_parser::{parse_file_as_program, EsSyntax, Syntax};

fn minify_source(source: &str, options: MinifyOptions) -> String {
    let cm = SourceMap::default();
    let fm = cm.new_source_file(FileName::Anon.into(), source.to_string());

    let comments = SingleThreadedComments::default();
    let mut recovered = Vec::new();
    let parsed = parse_file_as_program(
        &fm,
        Syntax::Es(EsSyntax {
            decorators: true,
            import_attributes: true,
            explicit_resource_management: true,
            ..Default::default()
        }),
        Some(&comments),
        &mut recovered,
    )
    .expect("source should parse");
    assert!(recovered.is_empty());

    let mut store = parsed.store;
    let result = minify_program(&mut store, parsed.program, &options);
    emit_program(&store, result.program, Config { minify: true }).expect("emit should succeed")
}

#[test]
fn mangle_skips_dynamic_scope_symbols() {
    let output = minify_source(
        "with (obj) { let foo = 1; foo; }",
        MinifyOptions {
            compress: CompressOptions::default(),
            mangle: MangleOptions {
                enabled: true,
                top_level: true,
                keep_fn_names: false,
                keep_class_names: false,
                reserved: Vec::new(),
            },
        },
    );

    assert!(output.contains("foo"));
}

#[test]
fn mangle_skips_exported_names() {
    let output = minify_source(
        "export const foo = 1; console.log(foo);",
        MinifyOptions {
            compress: CompressOptions::default(),
            mangle: MangleOptions {
                enabled: true,
                top_level: true,
                keep_fn_names: false,
                keep_class_names: false,
                reserved: Vec::new(),
            },
        },
    );

    assert!(output.contains("foo"));
}

#[test]
fn keep_fn_and_class_names_are_respected() {
    let output = minify_source(
        "function KeepFn(){} class KeepClass{}; KeepFn(); new KeepClass();",
        MinifyOptions {
            compress: CompressOptions::default(),
            mangle: MangleOptions {
                enabled: true,
                top_level: true,
                keep_fn_names: true,
                keep_class_names: true,
                reserved: Vec::new(),
            },
        },
    );

    assert!(output.contains("KeepFn"));
    assert!(output.contains("KeepClass"));
}
