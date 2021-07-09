#![feature(test)]

extern crate test;

use std::{
    env,
    fs::{read_dir, File},
    io::{self, Read, Write},
    path::Path,
    sync::{Arc, RwLock},
};
use swc_common::comments::SingleThreadedComments;
use swc_ecma_codegen::{self, Emitter};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};
use test::{
    test_main, DynTestFn, Options, ShouldPanic::No, TestDesc, TestDescAndFn, TestName, TestType,
};
use testing::NormalizedOutput;

const IGNORED_PASS_TESTS: &[&str] = &[
    // Temporalily ignored
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

fn add_test<F: FnOnce() + Send + 'static>(
    tests: &mut Vec<TestDescAndFn>,
    name: String,
    ignore: bool,
    f: F,
) {
    tests.push(TestDescAndFn {
        desc: TestDesc {
            test_type: TestType::UnitTest,
            name: TestName::DynTestName(name),
            ignore,
            should_panic: No,
            allow_fail: false,
        },
        testfn: DynTestFn(Box::new(f)),
    });
}

fn error_tests(tests: &mut Vec<TestDescAndFn>) -> Result<(), io::Error> {
    let ref_dir = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("tests")
        .join("references");
    let dir = Path::new(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .unwrap()
        .join("parser")
        .join("tests")
        .join("test262-parser")
        .join("pass");

    eprintln!("Loading tests from {}", dir.display());

    for entry in read_dir(&dir).expect("failed to read directory") {
        let entry = entry?;
        let file_name = entry
            .path()
            .strip_prefix(&dir)
            .expect("failed to strip prefix")
            .to_str()
            .expect("to_str() failed")
            .to_string();

        let input = {
            let mut buf = String::new();
            File::open(entry.path())?.read_to_string(&mut buf)?;
            buf
        };

        let ignore = IGNORED_PASS_TESTS.contains(&&*file_name);

        let module = file_name.contains("module");

        let ref_dir = ref_dir.clone();
        let name = format!("test262::golden::{}", file_name);

        add_test(tests, name, ignore, move || {
            let msg = format!(
                "\n\n========== Running codegen test {}\nSource:\n{}\n",
                file_name, input
            );
            let mut wr = Buf(Arc::new(RwLock::new(vec![])));

            ::testing::run_test(false, |cm, handler| {
                let src = cm.load_file(&entry.path()).expect("failed to load file");
                eprintln!(
                    "{}\nPos: {:?} ~ {:?} (L{})",
                    msg,
                    src.start_pos,
                    src.end_pos,
                    src.count_lines()
                );

                let comments = SingleThreadedComments::default();
                let lexer = Lexer::new(
                    Syntax::default(),
                    Default::default(),
                    (&*src).into(),
                    Some(&comments),
                );
                let mut parser: Parser<Lexer<StringInput>> = Parser::new_from(lexer);

                {
                    let mut emitter = Emitter {
                        cfg: Default::default(),
                        cm: cm.clone(),
                        wr: Box::new(swc_ecma_codegen::text_writer::JsWriter::new(
                            cm, "\n", &mut wr, None,
                        )),
                        comments: Some(&comments),
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
                let ref_file = format!("{}", ref_dir.join(&file_name).display());

                let code_output = wr.0.read().unwrap();
                let with_srcmap =
                    NormalizedOutput::from(String::from_utf8_lossy(&code_output).into_owned());
                with_srcmap.compare_to_file(ref_file).unwrap();
                Ok(())
            })
            .expect("failed to run test");
        });
    }

    Ok(())
}

#[test]
fn identity() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    error_tests(&mut tests).expect("failed to load testss");
    test_main(&args, tests, Some(Options::new()));
}

#[derive(Debug, Clone)]
struct Buf(Arc<RwLock<Vec<u8>>>);
impl Write for Buf {
    fn write(&mut self, data: &[u8]) -> io::Result<usize> {
        self.0.write().unwrap().write(data)
    }

    fn flush(&mut self) -> io::Result<()> {
        self.0.write().unwrap().flush()
    }
}
