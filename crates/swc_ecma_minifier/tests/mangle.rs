#![deny(warnings)]

use std::{
    path::{Path, PathBuf},
    process::{Command, Stdio},
};

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
use swc_ecma_parser::parse_file_as_module;
use swc_ecma_transforms_base::{fixer::paren_remover, resolver};
use swc_ecma_utils::drop_span;
use swc_ecma_visit::VisitMutWith;
use testing::{assert_eq, NormalizedOutput};
use tracing::warn;

fn print(cm: Lrc<SourceMap>, m: &Module, minify: bool) -> String {
    let mut buf = vec![];

    {
        let mut wr = Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)) as Box<dyn WriteJs>;

        if minify {
            wr = Box::new(omit_trailing_semi(wr));
        }

        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config {
                minify,
                ..Default::default()
            },
            cm,
            comments: None,
            wr,
        };

        emitter.emit_module(m).unwrap();
    }

    String::from_utf8(buf).unwrap()
}

fn parse(handler: &Handler, cm: Lrc<SourceMap>, path: &Path) -> Result<Module, ()> {
    let fm = cm.load_file(path).unwrap();
    parse_fm(handler, fm)
}

fn parse_fm(handler: &Handler, fm: Lrc<SourceFile>) -> Result<Module, ()> {
    parse_file_as_module(
        &fm,
        Default::default(),
        EsVersion::latest(),
        None,
        &mut vec![],
    )
    .map_err(|err| {
        err.into_diagnostic(handler).emit();
    })
}

#[testing::fixture("tests/fixture/**/input.js")]
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

        let m = optimize(
            m.into(),
            cm.clone(),
            None,
            None,
            &MinifyOptions {
                mangle: Some(MangleOptions {
                    top_level: true,
                    ..Default::default()
                }),
                compress: None,
                ..Default::default()
            },
            &ExtraOptions {
                unresolved_mark,
                top_level_mark,
            },
        )
        .expect_module();

        {
            // Compare AST, and mark test as a success if ast is identical.

            let mut m = m.clone();
            m.visit_mut_with(&mut paren_remover(None));
            m = drop_span(m);

            let mut expected = parse(&handler, cm.clone(), &input)?;
            expected.visit_mut_with(&mut paren_remover(None));
            expected = drop_span(expected);

            if m == expected {
                return Ok(());
            }

            assert_eq!(m, expected);
        }

        let mangled = print(cm, &m, false);

        NormalizedOutput::from(mangled)
            .compare_to_file(output_path)
            .unwrap();

        Ok(())
    });
}

#[testing::fixture("tests/mangle/**/input.js")]
fn fixture(input: PathBuf) {
    testing::run_test2(false, |cm, handler| {
        let mut m = parse(&handler, cm.clone(), &input)?;

        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        m.visit_mut_with(&mut resolver(unresolved_mark, top_level_mark, false));

        let m = optimize(
            m.into(),
            cm.clone(),
            None,
            None,
            &MinifyOptions {
                mangle: Some(MangleOptions {
                    top_level: true,
                    ..Default::default()
                }),
                compress: None,
                ..Default::default()
            },
            &ExtraOptions {
                unresolved_mark,
                top_level_mark,
            },
        )
        .expect_module();

        let mangled = print(cm, &m, false);

        NormalizedOutput::from(mangled)
            .compare_to_file(input.parent().unwrap().join("output.js"))
            .unwrap();

        Ok(())
    })
    .unwrap();
}

fn assert_mangled(src: &str, expected: &str, opts: MangleOptions) {
    testing::run_test2(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Anon, src.into());

        let m = parse_fm(&handler, fm)?;

        let unresolved_mark = Mark::fresh(Mark::root());
        let top_level_mark = Mark::fresh(Mark::root());

        let m = optimize(
            m.into(),
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
            },
        )
        .expect_module();

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
            top_level: true,
            reserved: vec!["func1".into()],
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
            top_level: true,
            reserved: vec!["Class1".into()],
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
    a = 1;
}
class s {
    hello2 = 2;
}";

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: true,
            reserved: vec!["hello1".into()],
            props: Some(ManglePropertiesOptions {
                reserved: vec!["hello2".into()],
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

    let expected = "class s {
    #a = 1;
}
class a {
    #b = 2;
}";

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: true,
            reserved: vec!["hello1".into()],
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

    let expected = "class s {
    #hello1 = 1;
}
class a {
    #hello2 = 2;
}";

    assert_mangled(
        src,
        expected,
        MangleOptions {
            top_level: true,
            keep_private_props: true,
            ..Default::default()
        },
    )
}
