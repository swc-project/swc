//! Tests ported from https://github.com/thysultan/stylis.js
//!
//! License is MIT, which is original license at the time of copying.
//! Original test authors have copyright for their work.
#![deny(warnings)]
#![allow(clippy::needless_update)]

use std::path::PathBuf;

use swc_common::{FileName, DUMMY_SP};
use swc_css_ast::{
    ComponentValue, DeclarationOrAtRule, QualifiedRule, QualifiedRulePrelude, SelectorList,
    SimpleBlock, Stylesheet,
};
use swc_css_codegen::{
    writer::basic::{BasicCssWriter, BasicCssWriterConfig},
    CodegenConfig, Emit,
};
use swc_css_parser::{parse_file, parser::ParserConfig};
use swc_css_visit::VisitMutWith;
use swc_stylis::prefixer::prefixer;
use testing::NormalizedOutput;

#[test]
fn mask() {
    t("mask:none;", "-webkit-mask:none;mask:none;");
    t(
        "mask-image:none;",
        "-webkit-mask-image:none;mask-image:none;",
    );
    t(
        "mask-image:linear-gradient(#fff);",
        "-webkit-mask-image:linear-gradient(#fff);mask-image:linear-gradient(#fff);",
    );
    t("mask-mode:none;", "-webkit-mask-mode:none;mask-mode:none;");
    t("mask-clip:none;", "-webkit-mask-clip:none;mask-clip:none;");
    t("mask-size:none;", "-webkit-mask-size:none;mask-size:none;");
    t(
        "mask-repeat:none;",
        "-webkit-mask-repeat:none;mask-repeat:none;",
    );
    t(
        "mask-origin:none;",
        "-webkit-mask-origin:none;mask-origin:none;",
    );
    t(
        "mask-position:none;",
        "-webkit-mask-position:none;mask-position:none;",
    );
    t(
        "mask-composite:none;",
        "-webkit-mask-composite:none;mask-composite:none;",
    );
}

#[test]
fn filter() {
    t(
        "filter:grayscale(100%);",
        "-webkit-filter:grayscale(100%);filter:grayscale(100%);",
    );
    t("fill:red;", "fill:red;");
}

#[test]
fn background() {
    t("background:none;", "background:none;");
    t(
        "background:image-set(url(foo.jpg) 2x);",
        "background:-webkit-image-set(url(foo.jpg)2x);background:image-set(url(foo.jpg)2x);",
    );
    t(
        "background-image:image-set(url(foo.jpg) 2x);",
        "background-image:-webkit-image-set(url(foo.jpg)2x);background-image:image-set(url(foo.\
         jpg)2x);",
    );
}

/// Test
fn t(src: &str, expected: &str) {
    testing::run_test2(false, |cm, handler| {
        //
        let fm = cm.new_source_file(FileName::Anon, src.to_string());
        let mut errors = vec![];
        let props: Vec<DeclarationOrAtRule> = parse_file(
            &fm,
            ParserConfig {
                ..Default::default()
            },
            &mut errors,
        )
        .unwrap();

        for err in errors {
            err.to_diagnostics(&handler).emit();
        }

        let mut node = QualifiedRule {
            span: DUMMY_SP,
            prelude: QualifiedRulePrelude::SelectorList(SelectorList {
                span: DUMMY_SP,
                children: Default::default(),
            }),
            block: SimpleBlock {
                span: DUMMY_SP,
                name: '{',
                value: props
                    .into_iter()
                    .map(ComponentValue::DeclarationOrAtRule)
                    .collect(),
            },
        };
        node.visit_mut_with(&mut prefixer());

        let mut wr = String::new();

        {
            for p in &node.block.value {
                let mut s = String::new();
                {
                    let mut wr = BasicCssWriter::new(&mut s, BasicCssWriterConfig { indent: "  " });
                    let mut gen = swc_css_codegen::CodeGenerator::new(
                        &mut wr,
                        CodegenConfig { minify: true },
                    );

                    gen.emit(p).unwrap();
                }

                wr.push_str(&s);

                let need_semi = !matches!(
                    p,
                    ComponentValue::DeclarationOrAtRule(DeclarationOrAtRule::Invalid(_))
                );

                if need_semi {
                    wr.push(';');
                }
            }
        }

        assert_eq!(wr, expected);

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/fixture/**/input.css")]
fn fixture(input: PathBuf) {
    let output = input.parent().unwrap().join("output.css");

    testing::run_test2(false, |cm, handler| {
        //
        let fm = cm.load_file(&input).unwrap();
        let mut errors = vec![];
        let mut ss: Stylesheet = parse_file(
            &fm,
            ParserConfig {
                allow_wrong_line_comments: true,
                ..Default::default()
            },
            &mut errors,
        )
        .unwrap();
        for err in errors {
            err.to_diagnostics(&handler).emit();
        }

        ss.visit_mut_with(&mut prefixer());

        let mut s = String::new();
        {
            let mut wr = BasicCssWriter::new(&mut s, BasicCssWriterConfig { indent: "  " });
            let mut gen =
                swc_css_codegen::CodeGenerator::new(&mut wr, CodegenConfig { minify: false });

            gen.emit(&ss).unwrap();
        }

        NormalizedOutput::from(s).compare_to_file(&output).unwrap();

        Ok(())
    })
    .unwrap();
}
