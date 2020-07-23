#![feature(box_syntax)]
#![feature(specialization)]
#![feature(test)]
#![feature(unboxed_closures)]

pub use self::output::{NormalizedOutput, StdErr, StdOut, TestOutput};
use difference::Changeset;
use once_cell::sync::Lazy;
use regex::Regex;
use std::{
    fmt,
    fmt::Debug,
    fs::{create_dir_all, File},
    io::Write,
    path::Path,
    sync::Arc,
    thread,
};
use swc_common::{
    errors::{Diagnostic, Handler},
    FilePathMapping, SourceMap, Span, DUMMY_SP,
};

#[macro_use]
mod macros;
mod diag_errors;
mod output;
mod paths;
mod string_errors;

/// Configures logger
pub fn init() {
    use ansi_term::Color;

    struct Padded<T> {
        value: T,
        width: usize,
    }

    impl<T: fmt::Display> fmt::Display for Padded<T> {
        fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
            write!(f, "{: <width$}", self.value, width = self.width)
        }
    }

    fn colored_level<'a>(level: log::Level) -> String {
        match level {
            log::Level::Trace => Color::Cyan.paint("TRACE").to_string(),
            log::Level::Debug => Color::Blue.paint("DEBUG").to_string(),
            log::Level::Info => Color::Green.paint("INFO ").to_string(),
            log::Level::Warn => Color::Yellow.paint("WARN ").to_string(),
            log::Level::Error => Color::Red.paint("ERROR").to_string(),
        }
    }

    let _ = env_logger::Builder::from_default_env()
        .is_test(true)
        .format(|f, record| {
            let level = colored_level(record.level());

            writeln!(f, " {} > {}", level, record.args(),)
        })
        .try_init();
}

/// Run test and print errors.
pub fn run_test<F, Ret>(treat_err_as_bug: bool, op: F) -> Result<Ret, StdErr>
where
    F: FnOnce(Arc<SourceMap>, &Handler) -> Result<Ret, ()>,
{
    init();

    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
    let (handler, errors) = self::string_errors::new_handler(cm.clone(), treat_err_as_bug);
    let result = swc_common::GLOBALS.set(&swc_common::Globals::new(), || op(cm, &handler));

    match result {
        Ok(res) => Ok(res),
        Err(()) => Err(errors.into()),
    }
}

/// Run test and print errors.
pub fn run_test2<F, Ret>(treat_err_as_bug: bool, op: F) -> Result<Ret, StdErr>
where
    F: FnOnce(Arc<SourceMap>, Handler) -> Result<Ret, ()>,
{
    init();

    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));
    let (handler, errors) = self::string_errors::new_handler(cm.clone(), treat_err_as_bug);
    let result = swc_common::GLOBALS.set(&swc_common::Globals::new(), || op(cm, handler));

    match result {
        Ok(res) => Ok(res),
        Err(()) => Err(errors.into()),
    }
}

pub struct Tester {
    pub cm: Arc<SourceMap>,
    pub globals: swc_common::Globals,
    treat_err_as_bug: bool,
}

impl Tester {
    pub fn new() -> Self {
        init();

        Tester {
            cm: Arc::new(SourceMap::new(FilePathMapping::empty())),
            globals: swc_common::Globals::new(),
            treat_err_as_bug: false,
        }
    }

    pub fn no_error(mut self) -> Self {
        self.treat_err_as_bug = true;
        self
    }

    /// Run test and print errors.
    pub fn print_errors<F, Ret>(&self, op: F) -> Result<Ret, StdErr>
    where
        F: FnOnce(Arc<SourceMap>, Handler) -> Result<Ret, ()>,
    {
        let (handler, errors) =
            self::string_errors::new_handler(self.cm.clone(), self.treat_err_as_bug);
        let result = swc_common::GLOBALS.set(&self.globals, || op(self.cm.clone(), handler));

        match result {
            Ok(res) => Ok(res),
            Err(()) => Err(errors.into()),
        }
    }

    /// Run test and collect errors.
    pub fn errors<F, Ret>(&self, op: F) -> Result<Ret, Vec<Diagnostic>>
    where
        F: FnOnce(Arc<SourceMap>, Handler) -> Result<Ret, ()>,
    {
        let (handler, errors) =
            self::diag_errors::new_handler(self.cm.clone(), self.treat_err_as_bug);
        let result = swc_common::GLOBALS.set(&self.globals, || op(self.cm.clone(), handler));

        let mut errs: Vec<_> = errors.into();
        errs.sort_by_key(|d| {
            let span = d.span.primary_span().unwrap();
            let cp = self.cm.lookup_char_pos(span.lo());

            let line = cp.line;
            let column = cp.col.0 + 1;

            line * 10000 + column
        });

        match result {
            Ok(res) => Ok(res),
            Err(()) => Err(errs),
        }
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

pub fn print_left_right(left: &dyn Debug, right: &dyn Debug) -> String {
    fn print(t: &dyn Debug) -> String {
        let s = format!("{:#?}", t);

        // Replace 'Span { lo: BytePos(0), hi: BytePos(0), ctxt: #0 }' with '_'
        let s = {
            static RE: Lazy<Regex> =
                Lazy::new(|| Regex::new("Span \\{[\\a-zA-Z0#:\\(\\)]*\\}").unwrap());

            &RE
        }
        .replace_all(&s, "_");
        // Remove 'span: _,'
        let s = {
            static RE: Lazy<Regex> = Lazy::new(|| Regex::new("span: _[,]?\\s*").unwrap());

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

pub fn diff(l: &str, r: &str) -> String {
    let cs = Changeset::new(l, r, "\n");

    format!("{}", cs)
}
