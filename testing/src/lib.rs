#![feature(box_syntax)]
#![feature(specialization)]
#![feature(test)]
#![feature(unboxed_closures)]

#[macro_use]
extern crate lazy_static;
extern crate regex;
extern crate rustc_data_structures;
extern crate syntax_pos;
#[macro_use]
extern crate slog;
extern crate slog_envlogger;
extern crate slog_term;
extern crate swc_common;
extern crate test;

pub use self::output::{NormalizedOutput, StdErr, StdOut, TestOutput};
use regex::Regex;
use rustc_data_structures::sync::Lrc;
use slog::Drain;
use slog::Logger;
use std::fmt::Debug;
use std::fs::{create_dir_all, File};
use std::io;
use std::io::Write;
use std::path::Path;
use std::thread;
use swc_common::errors::{CodeMap, FilePathMapping, Handler};
use swc_common::{FoldWith, Folder, Span};

#[macro_use]
mod macros;
mod errors;
mod output;
mod paths;

pub fn run_test<F, Ret>(op: F) -> TestOutput<Ret>
where
    F: FnOnce(Logger, Lrc<CodeMap>, &Handler) -> Ret,
{
    let cm = Lrc::new(CodeMap::new(FilePathMapping::empty()));
    let (handler, errors) = self::errors::new_handler(cm.clone());
    let result =
        syntax_pos::GLOBALS.set(&syntax_pos::Globals::new(), || op(logger(), cm, &handler));

    TestOutput {
        errors: errors.into(),
        result,
    }
}

/// Remove all span from `t`.
pub fn drop_span<T>(t: T) -> T
where
    T: FoldWith<DropSpan>,
{
    Folder::<T>::fold(&mut DropSpan, t)
}
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct DropSpan;
impl Folder<Span> for DropSpan {
    fn fold(&mut self, _: Span) -> Span {
        Span::default()
    }
}

fn write_to_file(path: &Path, content: &str) {
    File::create(path)
        .unwrap_or_else(|err| {
            panic!(
                "failed to create file ({}) for writing data of the failed assertion: {}",
                path.display(),
                err
            )
        })
        .write_all(content.as_bytes())
        .expect("failed to write data of the failed assertion")
}

pub fn print_left_right(left: &Debug, right: &Debug) -> String {
    fn print(t: &Debug) -> String {
        let s = format!("{:#?}", t);

        // Replace 'Span { lo: BytePos(0), hi: BytePos(0), ctxt: #0 }' with '_'
        let s = {
            lazy_static! {
                static ref RE: Regex = { Regex::new("Span \\{[\\a-zA-Z0#:\\(\\)]*\\}").unwrap() };
            }

            &RE
        }.replace_all(&s, "_");
        // Remove 'span: _,'
        let s = {
            lazy_static! {
                static ref RE: Regex = { Regex::new("span: _[,]?\\s*").unwrap() };
            }

            &RE
        }.replace_all(&s, "");

        s.into()
    }

    let (left, right) = (print(left), print(right));

    let cur = thread::current();
    let test_name = cur
        .name()
        .expect("rustc sets test name as the name of thread");

    // ./target/debug/tests/${test_name}/
    let target_dir = {
        let mut buf = paths::test_results_dir().to_path_buf();
        for m in test_name.split("::") {
            buf.push(m)
        }

        create_dir_all(&buf).unwrap_or_else(|err| {
            panic!(
                "failed to create directory ({}) for writing data of the failed assertion: {}",
                buf.display(),
                err
            )
        });

        buf
    };

    write_to_file(&target_dir.join("left"), &left);
    write_to_file(&target_dir.join("right"), &right);

    format!(
        "----- {}\n    left:\n{}\n    right:\n{}",
        test_name, left, right
    )
}

#[macro_export]
macro_rules! assert_eq_ignore_span {
    ($l:expr, $r:expr) => {{
        println!("{}", module_path!());
        let (l, r) = ($crate::drop_span($l), $crate::drop_span($r));
        if l != r {
            panic!("assertion failed\n{}", $crate::print_left_right(&l, &r));
        }
    }};
}

pub fn logger() -> Logger {
    fn no_timestamp(_: &mut Write) -> io::Result<()> {
        Ok(())
    }
    fn root() -> Logger {
        use std::sync::Mutex;
        use {slog_envlogger, slog_term};

        let dec = slog_term::TermDecorator::new()
            .force_color()
            .stderr()
            .build();
        let drain = slog_term::FullFormat::new(dec)
            .use_custom_timestamp(no_timestamp)
            .build();
        let drain = slog_envlogger::new(drain);
        let drain = Mutex::new(drain).fuse();
        let logger = Logger::root(drain, o!());

        logger
    }

    // lazy_static! {
    //     static ref ROOT: Logger = { root() };
    // };

    // hack for cargo test
    println!("");
    root()
    // ROOT.new(o!())
}
