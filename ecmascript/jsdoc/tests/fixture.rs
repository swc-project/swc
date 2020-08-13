#![feature(test)]

extern crate test;

use anyhow::Error;
use dashmap::DashMap;
use std::{env, path::PathBuf};
use swc_common::{
    comments::{Comment, Comments},
    BytePos,
};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput};
use test::{test_main, DynTestFn, ShouldPanic::No, TestDesc, TestDescAndFn, TestName, TestType};
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
                    testing::run_test2(true, |cm, handler| {
                        let comments = SwcComments::default();

                        let fm = cm
                            .load_file(entry.path())
                            .expect("failed to load fixtue file");

                        let lexer = Lexer::new(
                            Default::default(),
                            Default::default(),
                            StringInput::from(&*fm),
                            Some(&comments),
                        );
                        let mut p = Parser::new_from(lexer);
                        p.parse_module().expect("should parse");
                        for err in p.take_errors() {
                            err.into_diagnostic(&handler).emit();
                        }
                        if handler.has_errors() {
                            return Err(());
                        }

                        for (_, comments) in comments.leading.into_iter() {
                            for cmt in &comments {
                                println!(
                                    "==================== {} ====================\n{}",
                                    entry.path().display(),
                                    cmt.text
                                );
                                let (i, parsed) = jsdoc::parse(cmt.into()).unwrap();
                                println!("{:?}", parsed);
                            }
                        }

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
