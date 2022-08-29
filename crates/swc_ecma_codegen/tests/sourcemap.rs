#![feature(bench_black_box)]

use std::{
    fs::read_to_string,
    path::PathBuf,
    process::{Command, Stdio},
};

use sourcemap::SourceMap;
use swc_common::comments::SingleThreadedComments;
use swc_ecma_ast::EsVersion;
use swc_ecma_codegen::{self, text_writer::WriteJs, Emitter};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};

const IGNORED_PASS_TESTS: &[&str] = &[
    // Temporally ignored
    "431ecef8c85d4d24.js",
    "8386fbff927a9e0e.js",
    "5654d4106d7025c2.js",
    // Stack size (Stupid parens)
    "6b5e7e125097d439.js",
    "714be6d28082eaa7.js",
    "882910de7dd1aef9.js",
    "dd3c63403db5c06e.js",
    // Wrong tests (variable name or value is different)
    "0339fa95c78c11bd.js",
    "0426f15dac46e92d.js",
    "0b4d61559ccce0f9.js",
    "0f88c334715d2489.js",
    "1093d98f5fc0758d.js",
    "15d9592709b947a0.js",
    "2179895ec5cc6276.js",
    "247a3a57e8176ebd.js",
    "441a92357939904a.js",
    "47f974d6fc52e3e4.js",
    "4e1a0da46ca45afe.js",
    "5829d742ab805866.js",
    "589dc8ad3b9aa28f.js",
    "598a5cedba92154d.js",
    "72d79750e81ef03d.js",
    "7788d3c1e1247da9.js",
    "7b72d7b43bedc895.js",
    "7dab6e55461806c9.js",
    "82c827ccaecbe22b.js",
    "87a9b0d1d80812cc.js",
    "8c80f7ee04352eba.js",
    "96f5d93be9a54573.js",
    "988e362ed9ddcac5.js",
    "9bcae7c7f00b4e3c.js",
    "a8a03a88237c4e8f.js",
    "ad06370e34811a6a.js",
    "b0fdc038ee292aba.js",
    "b62c6dd890bef675.js",
    "cb211fadccb029c7.js",
    "ce968fcdf3a1987c.js",
    "db3c01738aaf0b92.js",
    "e1387fe892984e2b.js",
    "e71c1d5f0b6b833c.js",
    "e8ea384458526db0.js",
    // We don't implement Annex B fully.
    "1c1e2a43fe5515b6.js",
    "3dabeca76119d501.js",
    "52aeec7b8da212a2.js",
    "59ae0289778b80cd.js",
    "a4d62a651f69d815.js",
    "c06df922631aeabc.js",
];

#[testing::fixture("../swc_ecma_parser/tests/test262-parser/pass/*.js")]
fn identity(entry: PathBuf) {
    let file_name = entry
        .file_name()
        .unwrap()
        .to_str()
        .expect("to_str() failed")
        .to_string();

    let input = read_to_string(&entry).unwrap();

    let ignore = IGNORED_PASS_TESTS.contains(&&*file_name);

    if ignore {
        return;
    }

    let module = file_name.contains("module");

    let msg = format!(
        "\n\n========== Running codegen test {}\nSource:\n{}\n",
        file_name, input
    );
    let mut wr = vec![];

    ::testing::run_test(false, |cm, handler| {
        let fm = cm.load_file(&entry).expect("failed to load file");
        eprintln!(
            "{}\nPos: {:?} ~ {:?} (L{})",
            msg,
            fm.start_pos,
            fm.end_pos,
            fm.count_lines()
        );
        let (expected_code, expected_map) = get_expected(&fm.src);
        println!("Expected code:\n{}", expected_code);

        let comments = SingleThreadedComments::default();
        let lexer = Lexer::new(
            Syntax::default(),
            Default::default(),
            (&*fm).into(),
            Some(&comments),
        );
        let mut parser: Parser<Lexer<StringInput>> = Parser::new_from(lexer);
        let mut src_map = vec![];

        {
            let mut wr = Box::new(swc_ecma_codegen::text_writer::JsWriter::new(
                cm.clone(),
                "\n",
                &mut wr,
                Some(&mut src_map),
            )) as Box<dyn WriteJs>;

            wr = Box::new(swc_ecma_codegen::text_writer::omit_trailing_semi(wr));

            let mut emitter = Emitter {
                cfg: swc_ecma_codegen::Config {
                    minify: true,
                    target: EsVersion::Es5,
                    ..Default::default()
                },
                cm: cm.clone(),
                wr,
                comments: None,
            };

            // Parse source
            if module {
                emitter
                    .emit_module(
                        &parser
                            .parse_module()
                            .map_err(|e| e.into_diagnostic(handler).emit())?,
                    )
                    .unwrap();
            } else {
                emitter
                    .emit_script(
                        &parser
                            .parse_script()
                            .map_err(|e| e.into_diagnostic(handler).emit())?,
                    )
                    .unwrap();
            }
        }
        wr.push(b';');

        let map = cm.build_source_map(&mut src_map);

        let actual_code = String::from_utf8(wr).unwrap();
        assert_eq!(actual_code, expected_code);
        assert_eq_same_map(&map, &expected_map);
        Ok(())
    })
    .expect("failed to run test");
}

fn get_expected(code: &str) -> (String, SourceMap) {
    let mut c = Command::new("node");
    c.arg("tests/babel.mjs");
    c.arg(code);
    c.stderr(Stdio::inherit());

    let output = c.output().expect("failed to get output");

    let v = serde_json::from_str::<serde_json::Map<String, serde_json::Value>>(
        &String::from_utf8_lossy(&output.stdout),
    )
    .unwrap();

    let code = v.get("code").unwrap().as_str().unwrap();
    let map = v.get("map").unwrap().as_str().unwrap();

    let map = SourceMap::from_slice(map.as_bytes()).expect("invalid sourcemap");

    (code.to_string(), map)
}

fn assert_eq_same_map(a: &SourceMap, b: &SourceMap) {
    for at in a.tokens() {
        let bt = b
            .lookup_token(at.get_dst_line(), at.get_dst_col())
            .unwrap_or_else(|| panic!("token not found: {:?}", at));

        assert_eq!(
            at.get_src_line(),
            bt.get_src_line(),
            "line mismatch at {}:{}",
            at.get_dst_line(),
            at.get_dst_col()
        );
        assert_eq!(
            at.get_src_col(),
            bt.get_src_col(),
            "col mismatch at {}:{}",
            at.get_dst_line(),
            at.get_dst_col()
        );
    }
}
