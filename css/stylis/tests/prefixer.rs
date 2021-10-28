//! Tests ported from https://github.com/thysultan/stylis.js
//!
//! License is MIT, which is original license at the time of copying.
//! Original test authors have copyright for their work.

use swc_common::FileName;
use swc_css_ast::DeclarationBlockItem;
use swc_css_codegen::{
    writer::basic::{BasicCssWriter, BasicCssWriterConfig},
    CodegenConfig, Emit,
};
use swc_css_parser::{parse_file, parser::ParserConfig};
use swc_css_visit::VisitMutWith;
use swc_stylis::prefixer::prefixer;

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
fn transform() {
    t(
        "transform:rotate(30deg);",
        "-webkit-transform:rotate(30deg);-moz-transform:rotate(30deg);-ms-transform:rotate(30deg);\
         transform:rotate(30deg);",
    );
}

#[test]
fn cursor() {
    t("cursor:none;", "cursor:none;");
    t("cursor:grab;", "cursor:-webkit-grab;cursor:grab;");
    t(
        "cursor:image-set(url(foo.jpg) 2x), pointer;",
        "cursor:-webkit-image-set(url(foo.jpg) 2x), pointer;cursor:image-set(url(foo.jpg) 2x), \
         pointer;",
    );
    t(
        "cursor:image-set(url(foo.jpg) 2x), grab;",
        "cursor:-webkit-image-set(url(foo.jpg) 2x), -webkit-grab;cursor:image-set(url(foo.jpg) \
         2x), grab;",
    );
}

#[test]
fn backface_visibility() {
    t(
        "backface-visibility:hidden;",
        "-webkit-backface-visibility:hidden;backface-visibility:hidden;",
    );
}

#[test]
fn transition() {
    t(
        "transition:transform 1s,transform all 400ms,text-transform;",
        "-webkit-transition:-webkit-transform 1s, -webkit-transform all 400ms, \
         text-transform;transition:transform 1s, transform all 400ms, text-transform;",
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
fn columns() {
    t("columns:auto;", "-webkit-columns:auto;columns:auto;");
    t(
        "column-count:auto;",
        "-webkit-column-count:auto;column-count:auto;",
    );
    t(
        "column-fill:auto;",
        "-webkit-column-fill:auto;column-fill:auto;",
    );
    t(
        "column-gap:auto;",
        "-webkit-column-gap:auto;column-gap:auto;",
    );
    t(
        "column-rule:auto;",
        "-webkit-column-rule:auto;column-rule:auto;",
    );
    t(
        "column-rule-color:auto;",
        "-webkit-column-rule-color:auto;column-rule-color:auto;",
    );
    t(
        "column-rule-style:auto;",
        "-webkit-column-rule-style:auto;column-rule-style:auto;",
    );
    t(
        "column-rule-width:auto;",
        "-webkit-column-rule-width:auto;column-rule-width:auto;",
    );
    t(
        "column-span:auto;",
        "-webkit-column-span:auto;column-span:auto;",
    );
    t(
        "column-width:auto;",
        "-webkit-column-width:auto;column-width:auto;",
    );
}

#[test]
fn text() {
    t("text-align:left;", "text-align:left;");
    t("text-transform:none;", "text-transform:none;");
    t("text-shadow:none;", "text-shadow:none;");
    t(
        "text-size-adjust:none;",
        "-webkit-text-size-adjust:none;-moz-text-size-adjust:none;-ms-text-size-adjust:none;\
         text-size-adjust:none;",
    );
    t(
        "text-decoration:none;",
        "-webkit-text-decoration:none;text-decoration:none;",
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
fn position() {
    t("position:relative;", "position:relative;");
    t(
        "position:sticky;",
        "position:-webkit-sticky;position:sticky;",
    );
}

#[test]
fn color_adjust() {
    t("color:none;", "color:none;");
    t(
        "color-adjust:none;",
        "-webkit-print-color-adjust:none;color-adjust:none;",
    );
}

#[test]
fn boxed() {
    t(
        "box-decoration-break:slice;",
        "-webkit-box-decoration-break:slice;box-decoration-break:slice;",
    );
    t("box-sizing:border-box;", "box-sizing:border-box;");
}

#[test]
fn clip() {
    t("clip-path:none;", "-webkit-clip-path:none;clip-path:none;");
}

#[test]
fn size() {
    t("width:auto;", "width:auto;");
    t("width:unset;", "width:unset;");
    t("width:initial;", "width:initial;");
    t("width:inherit;", "width:inherit;");
    t("width:10;", "width:10;");
    t("width:min();", "width:min();");
    t("width:var(--foo-content);", "width:var(--foo-content);");
    t("width:var(-content);", "width:var(-content);");
    t("width:var(--max-content);", "width:var(--max-content);");
    t("width:--max-content;", "width:--max-content;");
    t(
        "width:fit-content;",
        "width:-webkit-fit-content;width:-moz-fit-content;width:fit-content;",
    );
    t("width:stackWidth;", "width:stackWidth;");
    t(
        "min-width:max-content;",
        "min-width:-webkit-max-content;min-width:-moz-max-content;min-width:max-content;",
    );
    t(
        "max-width:min-content;",
        "max-width:-webkit-min-content;max-width:-moz-min-content;max-width:min-content;",
    );
    t(
        "height:fill-available;",
        "height:-webkit-fill-available;height:-moz-available;height:fill-available;",
    );
    t(
        "max-height:fit-content;",
        "max-height:-webkit-fit-content;max-height:-moz-fit-content;max-height:fit-content;",
    );
    t(
        "width:stretch;",
        "width:-webkit-fill-available;width:-moz-available;width:fill-available;width:stretch;",
    );
    t(
        "width:stretch!important;",
        "width:-webkit-fill-available!important;width:-moz-available!important;width:\
         fill-available!important;width:stretch!important;",
    );
    t(
        "min-block-size:max-content;",
        "min-block-size:-webkit-max-content;min-block-size:-moz-max-content;min-block-size:\
         max-content;",
    );
    t(
        "min-inline-size:max-content;",
        "min-inline-size:-webkit-max-content;min-inline-size:-moz-max-content;min-inline-size:\
         max-content;",
    );
    t("width:max(250px, 100px);", "width:max(250px, 100px);");
    t("height:min(150px, 200px);", "height:min(150px, 200px);");
    t("min-width:min(100px, 50px);", "min-width:min(100px, 50px);");
    t(
        "max-width:max(150px, 200px);",
        "max-width:max(150px, 200px);",
    );
    t(
        "min-height:max(100px, 50px);",
        "min-height:max(100px, 50px);",
    );
    t(
        "max-height:min(150px, 200px);",
        "max-height:min(150px, 200px);",
    );
}

#[test]
fn zoom() {
    t("min-zoom:0;", "min-zoom:0;");
}

#[test]
fn background() {
    t("background:none;", "background:none;");
    t(
        "background:image-set(url(foo.jpg) 2x);",
        "background:-webkit-image-set(url(foo.jpg) 2x);background:image-set(url(foo.jpg) 2x);",
    );
    t(
        "background-image:image-set(url(foo.jpg) 2x);",
        "background-image:-webkit-image-set(url(foo.jpg) \
         2x);background-image:image-set(url(foo.jpg) 2x);",
    );
}

#[test]
fn background_clip() {
    t(
        "background-clip:text;",
        "-webkit-background-clip:text;background-clip:text;",
    );
}

#[test]
fn margin_inline() {
    t(
        "margin-inline-start:20px;",
        "-webkit-margin-start:20px;margin-inline-start:20px;",
    );
    t(
        "margin-inline-end:20px;",
        "-webkit-margin-end:20px;margin-inline-end:20px;",
    );
}

#[test]
fn user_select() {
    t(
        "user-select:none;",
        "-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;",
    );
}

#[test]
fn appearance() {
    t(
        "appearance:none;",
        "-webkit-appearance:none;-moz-appearance:none;-ms-appearance:none;appearance:none;",
    );

    t(
        "animation:inherit;",
        "-webkit-animation:inherit;animation:inherit;",
    );
    t(
        "animation-duration:0.6s;",
        "-webkit-animation-duration:0.6s;animation-duration:0.6s;",
    );
    t(
        "animation-name:slidein;",
        "-webkit-animation-name:slidein;animation-name:slidein;",
    );
    t(
        "animation-iteration-count:infinite;",
        "-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite;",
    );
    t(
        "animation-timing-function:cubic-bezier(0.1,0.7,1.0,0.1);",
        "-webkit-animation-timing-function:cubic-bezier(0.1, 0.7, 1.0, \
         0.1);animation-timing-function:cubic-bezier(0.1, 0.7, 1.0, 0.1);",
    );
}

#[test]
fn error_recovery_1() {
    // This behavior is wrong, but it's what `stylis@3` does.
    t(
        "__styled-jsx-placeholder__1
            animation: slide 3s ease infinite;
        ",
        "__styled-jsx-placeholder__1
            animation: slide 3s ease infinite;",
    );

    t(
        "animation: slide 3s ease infinite;
            __styled-jsx-placeholder__1
        ",
        "-webkit-animation:slide 3s ease infinite;animation:slide 3s ease \
         infinite;__styled-jsx-placeholder__1\n        ;",
    );
}

/// Test
fn t(src: &str, expected: &str) {
    testing::run_test2(false, |cm, handler| {
        //
        let fm = cm.new_source_file(FileName::Anon, src.to_string());
        let mut errors = vec![];
        let mut props: Vec<DeclarationBlockItem> = parse_file(
            &fm,
            ParserConfig {
                parse_values: true,
                ..Default::default()
            },
            &mut errors,
        )
        .unwrap();
        for err in errors {
            err.to_diagnostics(&handler).emit();
        }

        props.visit_mut_with(&mut prefixer());

        let mut wr = String::new();

        {
            for p in &props {
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
                wr.push(';');
            }
        }

        assert_eq!(wr, expected);

        Ok(())
    })
    .unwrap();
}
