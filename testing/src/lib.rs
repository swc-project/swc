#![feature(box_syntax)]
#![feature(specialization)]
#![feature(test)]
#![feature(unboxed_closures)]

#[macro_use]
extern crate lazy_static;
extern crate regex;
extern crate relative_path;
extern crate swc_common;
extern crate test;

pub use self::output::{NormalizedOutput, StdErr, StdOut, TestOutput};
use regex::Regex;
use std::{
    fmt::Debug,
    fs::{create_dir_all, File},
    io::Write,
    path::Path,
    sync::Arc,
    thread,
};
use swc_common::{errors::Handler, FilePathMapping, Fold, FoldWith, SourceMap, Span, DUMMY_SP};

#[macro_use]
mod macros;
mod errors;
mod output;
mod paths;

pub fn run_test<F, Ret>(treat_err_as_bug: bool, op: F) -> Result<Ret, StdErr>
where
    F: FnOnce(Arc<SourceMap>, &Handler) -> Result<Ret, ()>,
{
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
    let (handler, errors) = self::errors::new_handler(cm.clone(), treat_err_as_bug);
    let result = swc_common::GLOBALS.set(&swc_common::Globals::new(), || op(cm, &handler));

    match result {
        Ok(res) => Ok(res),
        Err(()) => Err(errors.into()),
    }
}

pub fn run_test2<F, Ret>(treat_err_as_bug: bool, op: F) -> Result<Ret, StdErr>
where
    F: FnOnce(Arc<SourceMap>, Handler) -> Result<Ret, ()>,
{
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
    let (handler, errors) = self::errors::new_handler(cm.clone(), treat_err_as_bug);
    let result = swc_common::GLOBALS.set(&swc_common::Globals::new(), || op(cm, handler));

    match result {
        Ok(res) => Ok(res),
        Err(()) => Err(errors.into()),
    }
}

/// Remove all span from `t`.
pub fn drop_span<T>(t: T) -> T
where
    T: FoldWith<DropSpan>,
{
    Fold::<T>::fold(&mut DropSpan, t)
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct DropSpan;
impl Fold<Span> for DropSpan {
    fn fold(&mut self, span: Span) -> Span {
        DUMMY_SP.with_ctxt(span.ctxt())
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
        }
        .replace_all(&s, "_");
        // Remove 'span: _,'
        let s = {
            lazy_static! {
                static ref RE: Regex = { Regex::new("span: _[,]?\\s*").unwrap() };
            }

            &RE
        }
        .replace_all(&s, "");

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
