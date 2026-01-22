#![deny(warnings)]

use std::{
    path::{Path, PathBuf},
    process::{Command, Stdio},
};

use swc_atoms::atom;
use swc_common::{errors::Handler, sync::Lrc, FileName, Mark, SourceFile, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_codegen::{
    text_writer::{omit_trailing_semi, JsWriter, WriteJs},
    Emitter,
};
use swc_ecma_minifier::{
    optimize,
    option::{ExtraOptions, MangleOptions, ManglePropertiesOptions, MinifyOptions},
};
use swc_ecma_parser::parse_file_as_program;
use swc_ecma_transforms_base::{fixer::paren_remover, resolver};
use swc_ecma_utils::drop_span;
use swc_ecma_visit::VisitMutWith;
use testing::{assert_eq, NormalizedOutput};
use tracing::warn;

fn print(cm: Lrc<SourceMap>, p: &Program, minify: bool) -> String {
    let mut buf = Vec::new();

    {
        let mut wr = Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)) as Box<dyn WriteJs>;

        if minify {
            wr = Box::new(omit_trailing_semi(wr));
        }

        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config::default().with_minify(minify),
            cm,
            comments: None,
            wr,
        };

        emitter.emit_program(p).unwrap();
    }

    String::from_utf8(buf).unwrap()
}

fn parse(handler: &Handler, cm: Lrc<SourceMap>, path: &Path) -> Result<Program, ()> {
    let fm = cm.load_file(path).unwrap();
    parse_fm(handler, fm)
}

fn parse_fm(handler: &Handler, fm: Lrc<SourceFile>) -> Result<Program, ()> {
    parse_file_as_program(
        &fm,
        Default::default(),
        EsVersion::latest(),
        None,
        &mut Vec::new(),
    )
    .map_err(|err| {
        err.into_diagnostic(handler).emit();
    })
}

#[testing::fixture("tests/terser/**/input.js")]
fn snapshot_compress_fixture(input: PathBuf) {
    let output_path = input.parent().unwrap().join("output.mangleOnly.js");

    let _ = testing::run_test2(false, |cm, handler| {
        let mut m = parse(&handler, cm.clone(), &input)?;

        if option_env!("CI") != Some("1") {
            let mut c = Command::new("node");
            c.arg("scripts/mangler/charfreq.js");
            c.arg(&input);
            c.stderr(Stdio::inherit());
            let output = c.output().unwrap();

            warn!(
                "Chars of terser: {}",
                String::from_utf8_lossy(&output.stdout)
            );
        }

        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        m.visit_mut_with(&mut resolver(unresolved_mark, top_level_mark, false));

        let p = optimize(
            m,
            cm.clone(),
            None,
            None,
            &MinifyOptions {
                mangle: Some(MangleOptions {
                    top_level: Some(true),
                    ..Default::default()
                }),
                compress: None,
                ..Default::default()
            },
            &ExtraOptions {
                unresolved_mark,
                top_level_mark,
                mangle_name_cache: None,
            },
        );

        if output_path.exists() {
            // Compare AST, and mark test as a success if ast is identical.

            let mut actual = p.clone();
            actual.visit_mut_with(&mut paren_remover(None));
            actual = drop_span(actual);

            let mut expected = parse(&handler, cm.clone(), &output_path)?;
            expected.visit_mut_with(&mut paren_remover(None));
            expected = drop_span(expected);

            if actual == expected {
                return Ok(());
            }

            let actual = print(cm.clone(), &actual, false);
            let expected = print(cm.clone(), &expected, false);

            if actual == expected {
                return Ok(());
            }
        }

        let mangled = print(cm, &p, false);

        NormalizedOutput::from(mangled)
            .compare_to_file(output_path)
            .unwrap();

        Ok(())
    });
}

#[testing::fixture("tests/mangle/**/input.js")]
fn fixture(input: PathBuf) {
    testing::run_test2(false, |cm, handler| {
        let mut p = parse(&handler, cm.clone(), &input)?;

        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        p.visit_mut_with(&mut resolver(unresolved_mark, top_level_mark, false));

        let p = optimize(
            p,
            cm.clone(),
            None,
            None,
            &MinifyOptions {
                mangle: Some(MangleOptions {
                    top_level: Some(true),
                    ..Default::default()
                }),
                compress: None,
                ..Default::default()
            },
            &ExtraOptions {
                unresolved_mark,
                top_level_mark,
                mangle_name_cache: None,
            },
        );

        let mangled = print(cm, &p, false);

        NormalizedOutput::from(mangled)
            .compare_to_file(input.parent().unwrap().join("output.js"))
            .unwrap();

        Ok(())
    })
    .unwrap();
}

#[track_caller]
fn assert_mangled(src: &str, expected: &str, opts: MangleOptions) {
    testing::run_test2(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Anon.into(), src.to_string());

        let p = parse_fm(&handler, fm)?;

        let unresolved_mark = Mark::fresh(Mark::root());
        let top_level_mark = Mark::fresh(Mark::root());

        let m = optimize(
            p,
            cm.clone(),
            None,
            None,
            &MinifyOptions {
                mangle: Some(opts),
                compress: None,
                ..Default::default()
            },
            &ExtraOptions {
                unresolved_mark,
                top_level_mark,
                mangle_name_cache: None,
            },
        );

        let mangled = print(cm, &m, false);

        assert_eq!(
            NormalizedOutput::from(mangled),
            NormalizedOutput::from(expected.to_owned())
        );

        Ok(())
    })
    .unwrap()
}

#[test]
fn reserved_func_names() {
    let src = "function func1() {
    console.log(1);
}
function func2() {
    console.log(2);
}";

    let expected = "function func1() {
    console.log(1);
}
function n() {
    console.log(2);
}";

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            reserved: vec![atom!("func1")],
            ..Default::default()
        },
    )
}

#[test]
fn reserved_class_names() {
    let src = "class Class1 {
    hello1 = 1;
}
class Class2 {
    hello2 = 2;
}";

    let expected = "class Class1 {
    hello1 = 1;
}
class l {
    hello2 = 2;
}";

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            reserved: vec![atom!("Class1")],
            ..Default::default()
        },
    )
}

#[test]
fn reserved_class_props() {
    let src = "class Class1 {
    hello1 = 1;
}
class Class2 {
    hello2 = 2;
}";

    let expected = "class l {
    l = 1;
}
class s {
    hello2 = 2;
}";

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            reserved: vec![atom!("hello1")],
            props: Some(ManglePropertiesOptions {
                reserved: vec![atom!("hello2")],
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

#[test]
fn reserved_private_props() {
    let src = "class Class1 {
    #hello1 = 1;
}
class Class2 {
    #hello2 = 2;
}";

    let expected = "class l {
    #l = 1;
}
class s {
    #s = 2;
}";

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            reserved: vec![atom!("hello1")],
            ..Default::default()
        },
    )
}

#[test]
fn reserved_all_private_props() {
    let src = "class Class1 {
    #hello1 = 1;
}
class Class2 {
    #hello2 = 2;
}";

    let expected = "class l {
    #hello1 = 1;
}
class s {
    #hello2 = 2;
}";

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            keep_private_props: true,
            ..Default::default()
        },
    )
}

/// Test basic property mangling - all properties should be mangled when there's
/// no dynamic access
#[test]
fn basic_property_mangling() {
    let src = r#"const obj = { foo: 1, bar: 2 };
console.log(obj.foo, obj.bar);"#;

    let expected = r#"const o = {
    o: 1,
    a: 2
};
console.log(o.o, o.a);
"#;

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test nested property mangling - nested properties should be mangled
#[test]
fn nested_property_mangling() {
    let src = r#"const obj = { nested: { foo: 1, bar: 2 } };
console.log(obj.nested.foo, obj.nested.bar);"#;

    let expected = r#"const e = {
    e: {
        o: 1,
        n: 2
    }
};
console.log(e.e.o, e.e.n);
"#;

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test that dynamically accessed properties are NOT mangled
#[test]
fn dynamic_access_no_mangle() {
    // When obj[key] is accessed with a dynamic key, the direct properties should
    // NOT be mangled
    let src = r#"const obj = { foo: 1, bar: 2 };
function get(key) {
    return obj[key];
}"#;

    // foo and bar should NOT be mangled because they're accessed dynamically
    let expected = r#"const n = {
    foo: 1,
    bar: 2
};
function o(o) {
    return n[o];
}
"#;

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Simpler test: nested properties should be mangled when accessed statically
/// Using "xval" instead of "inner" because "inner" is a reserved DOM property
#[test]
fn nested_props_static_access_mangled() {
    let src = r#"const obj = {
    foo: { xval: 1 }
};
console.log(obj.foo.xval);"#;

    // Both foo and xval should be mangled
    let expected = r#"const o = {
    o: {
        l: 1
    }
};
console.log(o.o.l);
"#;

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test: only top-level props should be protected with dynamic access
#[test]
fn dynamic_access_only_top_level_protected() {
    // When obj[key] is accessed with a dynamic key, only the TOP-LEVEL
    // properties should NOT be mangled. Nested properties remain mangleable.
    // Using "xval" instead of "inner" because "inner" is a reserved DOM property
    let src = r#"const obj = {
    foo: { xval: 1 }
};
function get(key) {
    return obj[key].xval;
}"#;

    // foo should NOT be mangled (dynamic access)
    // xval SHOULD be mangled (static access)
    let expected = r#"const n = {
    foo: {
        n: 1
    }
};
function o(o) {
    return n[o].n;
}
"#;

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}

/// Test for issue #10332: Safe property mangling for local objects
/// Nested properties accessed with static keys should be mangled
/// even when parent is accessed with dynamic keys
#[test]
fn safe_property_mangling_nested_static() {
    // The top-level properties A4 and Letter are accessed dynamically via
    // sizes[paper], so they should NOT be mangled
    // However, xwidth and xheight are always accessed statically via
    // sizes[paper].xwidth, so they SHOULD be mangled
    // Using xwidth/xheight instead of width/height because the latter are
    // reserved DOM properties
    let src = r#"const sizes = {
    A4: { xwidth: '21cm', xheight: '29.7cm' },
    Letter: { xwidth: '8.5in', xheight: '11in' }
};
function printSize(paper) {
    return sizes[paper].xwidth + sizes[paper].xheight;
}"#;

    // xwidth and xheight should be mangled
    // A4 and Letter should NOT be mangled
    let expected = r#"const t = {
    A4: {
        t: '21cm',
        h: '29.7cm'
    },
    Letter: {
        t: '8.5in',
        h: '11in'
    }
};
function h(h) {
    return t[h].t + t[h].h;
}
"#;

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: Some(true),
            props: Some(ManglePropertiesOptions {
                ..Default::default()
            }),
            ..Default::default()
        },
    )
}
