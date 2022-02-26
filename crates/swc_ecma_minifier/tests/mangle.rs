#![deny(warnings)]

use std::path::{Path, PathBuf};

use swc_common::{sync::Lrc, FileName, Mark, SourceFile, SourceMap};
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
use swc_ecma_transforms::resolver_with_mark;
use swc_ecma_visit::VisitMutWith;
use testing::NormalizedOutput;

fn print(cm: Lrc<SourceMap>, m: &Module, minify: bool) -> String {
    let mut buf = vec![];

    {
        let mut wr = Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)) as Box<dyn WriteJs>;

        if minify {
            wr = Box::new(omit_trailing_semi(wr));
        }

        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config { minify },
            cm,
            comments: None,
            wr,
        };

        emitter.emit_module(m).unwrap();
    }

    String::from_utf8(buf).unwrap()
}

fn parse(cm: Lrc<SourceMap>, path: &Path) -> Module {
    let fm = cm.load_file(path).unwrap();
    parse_fm(fm)
}

fn parse_fm(fm: Lrc<SourceFile>) -> Module {
    parse_file_as_module(
        &fm,
        Default::default(),
        EsVersion::latest(),
        None,
        &mut vec![],
    )
    .unwrap()
}

#[testing::fixture("tests/compress/fixture/**/output.js")]
fn compressed(compressed_file: PathBuf) {
    testing::run_test2(false, |cm, _handler| {
        let m = parse(cm.clone(), &compressed_file);

        let top_level_mark = Mark::fresh(Mark::root());

        let m = optimize(
            m,
            cm.clone(),
            None,
            None,
            &MinifyOptions {
                mangle: Some(MangleOptions {
                    props: Some(ManglePropertiesOptions {
                        reserved: Default::default(),
                        undeclared: false,
                        regex: Default::default(),
                    }),
                    top_level: true,
                    keep_class_names: false,
                    keep_fn_names: false,
                    keep_private_props: false,
                    ie8: false,
                    safari10: false,
                    reserved: Default::default(),
                }),
                compress: None,
                ..Default::default()
            },
            &ExtraOptions { top_level_mark },
        );

        let mangled = print(cm.clone(), &m, false);
        let minified = print(cm.clone(), &m, true);

        parse_fm(cm.new_source_file(FileName::Anon, mangled));
        parse_fm(cm.new_source_file(FileName::Anon, minified));

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/mangle/**/input.js")]
fn fixture(input: PathBuf) {
    testing::run_test2(false, |cm, _handler| {
        let mut m = parse(cm.clone(), &input);

        let top_level_mark = Mark::fresh(Mark::root());

        m.visit_mut_with(&mut resolver_with_mark(top_level_mark));

        let m = optimize(
            m,
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
            &ExtraOptions { top_level_mark },
        );

        let mangled = print(cm, &m, false);

        NormalizedOutput::from(mangled)
            .compare_to_file(input.parent().unwrap().join("output.js"))
            .unwrap();

        Ok(())
    })
    .unwrap();
}

fn assert_mangled(src: &str, expected: &str, opts: MangleOptions) {
    testing::run_test2(false, |cm, _handler| {
        let fm = cm.new_source_file(FileName::Anon, src.into());

        let m = parse_fm(fm);

        let top_level_mark = Mark::fresh(Mark::root());

        let m = optimize(
            m,
            cm.clone(),
            None,
            None,
            &MinifyOptions {
                mangle: Some(opts),
                compress: None,
                ..Default::default()
            },
            &ExtraOptions { top_level_mark },
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
function a() {
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
class a {
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

    let expected = "class a {
    a = 1;
}
class b {
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

    let expected = "class a {
    #a = 1;
}
class b {
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

    let expected = "class a {
    #hello1 = 1;
}
class b {
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
