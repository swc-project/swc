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
fn flex_box() {
    t("display:block;", "display:block;");
    t(
        "display:flex!important;",
        "display:-webkit-box!important;display:-webkit-flex!important;display:-ms-flexbox!\
         important;display:flex!important;",
    );
    t(
        "display:inline-flex;",
        "display:-webkit-inline-box;display:-webkit-inline-flex;display:-ms-inline-flexbox;\
         display:inline-flex;",
    );
    t(
        "flex:inherit;",
        "-webkit-flex:inherit;-ms-flex:inherit;flex:inherit;",
    );
    t(
        "flex-grow:none;",
        "-webkit-box-flex:none;-webkit-flex-grow:none;-ms-flex-positive:none;flex-grow:none;",
    );
    t(
        "flex-shrink:none;",
        "-webkit-flex-shrink:none;-ms-flex-negative:none;flex-shrink:none;",
    );
    t(
        "flex-basis:none;",
        "-webkit-flex-basis:none;-ms-flex-preferred-size:none;flex-basis:none;",
    );
    t(
        "align-self:value;",
        "-webkit-align-self:value;-ms-flex-item-align:value;align-self:value;",
    );
    t(
        "align-self:flex-start;",
        "-webkit-align-self:flex-start;-ms-flex-item-align:flex-start;align-self:flex-start;",
    );
    t(
        "align-self:flex-end;",
        "-webkit-align-self:flex-end;-ms-flex-item-align:flex-end;align-self:flex-end;",
    );
    t(
        "align-content:value;",
        "-webkit-align-content:value;-ms-flex-line-pack:value;align-content:value;",
    );
    t(
        "align-content:flex-start;",
        "-webkit-align-content:flex-start;-ms-flex-line-pack:flex-start;align-content:flex-start;",
    );
    t(
        "align-content:flex-end;",
        "-webkit-align-content:flex-end;-ms-flex-line-pack:flex-end;align-content:flex-end;",
    );
    t(
        "align-items:value;",
        "-webkit-align-items:value;-webkit-box-align:value;-ms-flex-align:value;align-items:value;",
    );
    t(
        "justify-content:flex-end;",
        "-webkit-box-pack:end;-ms-flex-pack:end;-webkit-justify-content:flex-end;justify-content:\
         flex-end;",
    );
    t(
        "justify-content:flex-start;",
        "-webkit-box-pack:start;-ms-flex-pack:start;-webkit-justify-content:flex-start;\
         justify-content:flex-start;",
    );
    t(
        "justify-content:justify;",
        "-webkit-box-pack:justify;-ms-flex-pack:justify;-webkit-justify-content:justify;\
         justify-content:justify;",
    );
    t(
        "justify-content:space-between;",
        "-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:\
         space-between;",
    );
    t("justify-items:center;", "justify-items:center;");
    t(
        "order:flex;",
        "-webkit-order:flex;-ms-flex-order:flex;order:flex;",
    );
    t(
        "flex-direction:column;",
        "-webkit-flex-direction:column;-ms-flex-direction:column;flex-direction:column;",
    );
}

#[test]
fn writing_mode() {
    t(
        "writing-mode:none;",
        "-webkit-writing-mode:none;-ms-writing-mode:none;writing-mode:none;",
    );
    t(
        "writing-mode:vertical-lr;",
        "-webkit-writing-mode:vertical-lr;-ms-writing-mode:tb;writing-mode:vertical-lr;",
    );
    t(
        "writing-mode:vertical-rl;",
        "-webkit-writing-mode:vertical-rl;-ms-writing-mode:tb-rl;writing-mode:vertical-rl;",
    );
    t(
        "writing-mode:horizontal-tb;",
        "-webkit-writing-mode:horizontal-tb;-ms-writing-mode:lr;writing-mode:horizontal-tb;",
    );
    t(
        "writing-mode:sideways-rl;",
        "-webkit-writing-mode:sideways-rl;-ms-writing-mode:tb-rl;writing-mode:sideways-rl;",
    );
    t(
        "writing-mode:sideways-lr;",
        "-webkit-writing-mode:sideways-lr;-ms-writing-mode:tb;writing-mode:sideways-lr;",
    );
}

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
