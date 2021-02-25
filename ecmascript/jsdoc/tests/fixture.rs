#![feature(test)]

extern crate test;

use anyhow::Error;
use dashmap::DashMap;
use std::{env, path::PathBuf};
use swc_common::{
    comments::{Comment, CommentKind, Comments},
    BytePos,
};
use swc_ecma_parser::{lexer::Lexer, EsConfig, Parser, StringInput, Syntax};
use test::{test_main, DynTestFn, ShouldPanic::No, TestDesc, TestDescAndFn, TestName, TestType};
use testing::NormalizedOutput;
use walkdir::WalkDir;

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

#[test]
fn fixture() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    add_fixture(&mut tests).unwrap();
    test_main(&args, tests, Some(test::Options::new()));
}

fn add_fixture(tests: &mut Vec<TestDescAndFn>) -> Result<(), Error> {
    for entry in WalkDir::new(
        PathBuf::from(env::var("CARGO_MANIFEST_DIR").unwrap())
            .join("tests")
            .join("fixtures"),
    ) {
        let entry = entry.expect("WalkDir failed");
        if entry.file_type().is_dir() {
            continue;
        }

        if entry.path().to_string_lossy().ends_with(".js") {
            add_test(
                tests,
                format!("jsdoc::fixture::{}", entry.path().display()),
                false,
                move || {
                    testing::run_test2(false, |cm, handler| {
                        let comments = SwcComments::default();

                        let fm = cm
                            .load_file(entry.path())
                            .expect("failed to load fixture file");

                        let lexer = Lexer::new(
                            Syntax::Es(EsConfig {
                                jsx: true,
                                ..Default::default()
                            }),
                            Default::default(),
                            StringInput::from(&*fm),
                            Some(&comments),
                        );
                        let mut p = Parser::new_from(lexer);

                        match p.parse_module() {
                            Err(err) => {
                                err.into_diagnostic(&handler).emit();
                            }
                            _ => {}
                        }
                        for err in p.take_errors() {
                            err.into_diagnostic(&handler).emit();
                        }
                        if handler.has_errors() {
                            return Err(());
                        }
                        let mut res = vec![];
                        let mut comments: Vec<_> = comments.leading.into_iter().collect();
                        comments.sort_by_key(|v| v.0);

                        for (_, comments) in comments {
                            for cmt in &comments {
                                if cmt.kind == CommentKind::Line {
                                    continue;
                                }

                                if !cmt.text.starts_with("*") {
                                    continue;
                                }

                                println!(
                                    "==================== {} ====================\n{}",
                                    entry.path().display(),
                                    cmt.text
                                );
                                let (_, parsed) = jsdoc::parse(cmt.into()).unwrap();
                                res.push(parsed);
                            }
                        }

                        let s = NormalizedOutput::from(format!("{:#?}", res));
                        s.compare_to_file(entry.path().with_extension("debug"))
                            .unwrap();
                        Ok(())
                    })
                    .unwrap();
                },
            );
        }
    }

    Ok(())
}

type CommentMap = DashMap<BytePos, Vec<Comment>>;

/// Multi-threaded implementation of [Comments]
#[derive(Clone, Default)]
pub struct SwcComments {
    leading: CommentMap,
    trailing: CommentMap,
}

impl Comments for SwcComments {
    fn add_leading(&self, pos: BytePos, cmt: Comment) {
        self.leading.entry(pos).or_default().push(cmt);
    }

    fn add_leading_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        self.leading.entry(pos).or_default().extend(comments);
    }

    fn has_leading(&self, pos: BytePos) -> bool {
        self.leading.contains_key(&pos)
    }

    fn move_leading(&self, from: BytePos, to: BytePos) {
        let cmt = self.leading.remove(&from);

        if let Some(cmt) = cmt {
            self.leading.entry(to).or_default().extend(cmt.1);
        }
    }

    fn take_leading(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.leading.remove(&pos).map(|v| v.1)
    }

    fn add_trailing(&self, pos: BytePos, cmt: Comment) {
        self.trailing.entry(pos).or_default().push(cmt)
    }

    fn add_trailing_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        self.trailing.entry(pos).or_default().extend(comments)
    }

    fn has_trailing(&self, pos: BytePos) -> bool {
        self.trailing.contains_key(&pos)
    }

    fn move_trailing(&self, from: BytePos, to: BytePos) {
        let cmt = self.trailing.remove(&from);

        if let Some(cmt) = cmt {
            self.trailing.entry(to).or_default().extend(cmt.1);
        }
    }

    fn take_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.trailing.remove(&pos).map(|v| v.1)
    }
}
