use swc_common::{sync::Lrc, FileName, Mark, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_codegen::{
    text_writer::{omit_trailing_semi, JsWriter, WriteJs},
    Config, Emitter,
};
use swc_ecma_minifier::{optimize, option::ExtraOptions};
use swc_ecma_parser::{parse_file_as_module, Syntax};
use testing::NormalizedOutput;

fn print(cm: Lrc<SourceMap>, m: &Module, config: Config) -> String {
    let mut buf = Vec::new();

    {
        let mut wr = Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)) as Box<dyn WriteJs>;

        if config.minify {
            wr = Box::new(omit_trailing_semi(wr));
        }

        let mut emitter = Emitter {
            cfg: config,
            cm,
            comments: None,
            wr,
        };

        emitter.emit_module(m).unwrap();
    }

    String::from_utf8(buf).unwrap()
}

fn assert_format(src: &str, expected: &str, opts: Config) {
    testing::run_test2(false, |cm, _| {
        let fm = cm.new_source_file(FileName::Anon.into(), src.into());

        let program = parse_file_as_module(
            &fm,
            Syntax::Es(Default::default()),
            Default::default(),
            None,
            &mut Vec::new(),
        )
        .unwrap();

        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        let m = optimize(
            program.into(),
            cm.clone(),
            None,
            None,
            &Default::default(),
            &ExtraOptions {
                unresolved_mark,
                top_level_mark,
                mangle_name_cache: None,
            },
        )
        .expect_module();

        let actual = print(cm, &m, opts);
        assert_eq!(
            NormalizedOutput::from(actual),
            NormalizedOutput::from(expected.to_owned())
        );
        Ok(())
    })
    .unwrap()
}

#[test]
fn inline_script() {
    let src = r#"
console.log("</sCrIpT>");
foo("/-->/");
"#;
    let expected = r#"console.log("<\/sCrIpT>");foo("/--\x3e/");"#;
    assert_format(
        src,
        expected,
        Config::default().with_inline_script(true).with_minify(true),
    )
}

#[test]
fn rspack_issue_4797() {
    let src = r#"
obj = {
    𝒩: "a",
    "𝒩": "a",
    𝒩: "𝒩"
}
"#;
    assert_format(
        src,
        r#"obj = {
    "\uD835\uDCA9": "a",
    "\uD835\uDCA9": "a",
    "\uD835\uDCA9": "\uD835\uDCA9"
};"#,
        Config::default()
            .with_ascii_only(true)
            .with_target(EsVersion::Es5),
    )
}
