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

#[test]
fn issue_11027_inherited_class_property_collision() {
    // The property mangler must not produce a name that collides with a
    // property already used in the program. In particular, `someField`
    // must not be mangled to `e`, since `e` is already a property on the
    // base class.
    let src = "class Class1 {
    e = 1;
}
class Class2 extends Class1 {
    someField = 2;
}
console.log(new Class2().e);";
    let expected = "class e {
    e = 1;
}
class s extends e {
    s = 2;
}
console.log(new s().e);";
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

#[test]
fn issue_11027_deep_inheritance_chain() {
    // Multi-level inheritance with multiple potentially-colliding fields.
    // None of the mangled names for `len`, `fieldA`, `fieldB`, `fieldC` may
    // collide with the inherited `e`, `len`, or with each other.
    let src = "class Class1 {
    e = 1;
}
class Class2 extends Class1 {
    len = 2;
}
class Class3 extends Class2 {
    fieldA = 3;
    fieldB = 4;
    fieldC = 5;
}
console.log(new Class3().e, new Class3().len, new Class3().fieldA, new Class3().fieldB, new \
               Class3().fieldC);";
    let expected = "class e {
    e = 1;
}
class l extends e {
    l = 2;
}
class n extends l {
    n = 3;
    d = 4;
    s = 5;
}
console.log(new n().e, new n().l, new n().n, new n().d, new n().s);";
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

#[test]
fn issue_11027_object_literal_and_class_share_names() {
    // Object literal properties go through the same mangler as class fields.
    // Mangled names for `someField`, `otherField`, `thirdField` must not
    // collide with `e` or `valueOf` already used in the program.
    let src = "const cfg = { e: 1, valueOf: 2 };
class Wrapper {
    someField = 10;
    otherField = 20;
    thirdField = 30;
}
console.log(cfg.e, cfg.valueOf, new Wrapper().someField, new Wrapper().otherField, new \
               Wrapper().thirdField);";
    let expected = "const e = {
    e: 1,
    valueOf: 2
};
class l {
    l = 10;
    d = 20;
    i = 30;
}
console.log(e.e, e.valueOf, new l().l, new l().d, new l().i);";
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

#[test]
fn issue_11027_methods_and_getters_do_not_collide() {
    // Mix of getter on the base, field on the derived, plus methods on both.
    // The mangled names for `aField`, `bField`, `extra` must not collide
    // with the inherited `e` (getter) or `method`.
    let src = "class Base {
    get e() { return 1; }
    method() { return 2; }
}
class Derived extends Base {
    aField = 3;
    bField = 4;
    extra() { return 5; }
}
console.log(new Derived().e, new Derived().method(), new Derived().extra(), new Derived().aField, \
               new Derived().bField);";
    let expected = "class e {
    get e() {
        return 1;
    }
    method() {
        return 2;
    }
}
class n extends e {
    n = 3;
    t = 4;
    r() {
        return 5;
    }
}
console.log(new n().e, new n().method(), new n().r(), new n().n, new n().t);";
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
