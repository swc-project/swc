use std::{
    env,
    fmt::{self, Debug, Display, Formatter},
    fs::{create_dir_all, rename, File},
    io::Write,
    path::{Component, Path, PathBuf},
    process::Command,
    str::FromStr,
    sync::RwLock,
    thread,
};

use difference::Changeset;
use once_cell::sync::Lazy;
pub use pretty_assertions::{assert_eq, assert_ne};
use regex::Regex;
use swc_common::{
    collections::AHashMap,
    errors::{Diagnostic, Handler, HANDLER},
    sync::Lrc,
    FilePathMapping, SourceMap,
};
pub use testing_macros::fixture;
use tracing_subscriber::EnvFilter;

pub use self::output::{NormalizedOutput, StdErr, StdOut, TestOutput};

mod errors;
pub mod json;
#[macro_use]
mod macros;
mod diag_errors;
mod output;
mod paths;
mod string_errors;

/// Configures logger
#[must_use]
pub fn init() -> tracing::subscriber::DefaultGuard {
    let log_env = env::var("RUST_LOG").unwrap_or_else(|_| "debug".to_string());

    let logger = tracing_subscriber::FmtSubscriber::builder()
        .without_time()
        .with_target(false)
        .with_ansi(true)
        .with_env_filter(EnvFilter::from_str(&log_env).unwrap())
        .with_test_writer()
        .pretty()
        .finish();

    tracing::subscriber::set_default(logger)
}

pub fn find_executable(name: &str) -> Option<PathBuf> {
    static CACHE: Lazy<RwLock<AHashMap<String, PathBuf>>> = Lazy::new(Default::default);

    {
        let locked = CACHE.read().unwrap();
        if let Some(cached) = locked.get(name) {
            return Some(cached.clone());
        }
    }

    let mut path = env::var_os("PATH").and_then(|paths| {
        env::split_paths(&paths)
            .filter_map(|dir| {
                let full_path = dir.join(name);
                if full_path.is_file() {
                    Some(full_path)
                } else {
                    None
                }
            })
            .next()
    });

    if path.is_none() {
        // Run yarn bin $name

        path = Command::new("yarn")
            .arg("bin")
            .arg(name)
            .output()
            .ok()
            .and_then(|output| {
                if output.status.success() {
                    let path = String::from_utf8(output.stdout).ok()?;
                    let path = path.trim();
                    let path = PathBuf::from(path);
                    if path.is_file() {
                        return Some(path);
                    }
                }

                None
            });
    }

    if let Some(path) = path.clone() {
        let mut locked = CACHE.write().unwrap();
        locked.insert(name.to_string(), path);
    }

    path
}

/// Run test and print errors.
pub fn run_test<F, Ret>(treat_err_as_bug: bool, op: F) -> Result<Ret, StdErr>
where
    F: FnOnce(Lrc<SourceMap>, &Handler) -> Result<Ret, ()>,
{
    let _log = init();

    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
    let (handler, errors) = self::string_errors::new_handler(cm.clone(), treat_err_as_bug);
    let result = swc_common::GLOBALS.set(&swc_common::Globals::new(), || {
        HANDLER.set(&handler, || op(cm, &handler))
    });

    match result {
        Ok(res) => Ok(res),
        Err(()) => Err(errors.into()),
    }
}

/// Run test and print errors.
pub fn run_test2<F, Ret>(treat_err_as_bug: bool, op: F) -> Result<Ret, StdErr>
where
    F: FnOnce(Lrc<SourceMap>, Handler) -> Result<Ret, ()>,
{
    let _log = init();

    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
    let (handler, errors) = self::string_errors::new_handler(cm.clone(), treat_err_as_bug);
    let result = swc_common::GLOBALS.set(&swc_common::Globals::new(), || op(cm, handler));

    match result {
        Ok(res) => Ok(res),
        Err(()) => Err(errors.into()),
    }
}

pub struct Tester {
    pub cm: Lrc<SourceMap>,
    pub globals: swc_common::Globals,
    treat_err_as_bug: bool,
}

impl Tester {
    #[allow(clippy::new_without_default)]
    pub fn new() -> Self {
        Tester {
            cm: Lrc::new(SourceMap::new(FilePathMapping::empty())),
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
        F: FnOnce(Lrc<SourceMap>, Handler) -> Result<Ret, ()>,
    {
        let _log = init();

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
        F: FnOnce(Lrc<SourceMap>, Handler) -> Result<Ret, ()>,
    {
        let _log = init();

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

/// Used for assertions.
///
/// Prints string without escaping special characters on failure.
#[derive(PartialEq, Eq)]
pub struct DebugUsingDisplay<'a>(pub &'a str);

impl Debug for DebugUsingDisplay<'_> {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        Display::fmt(self.0, f)
    }
}

/// Rename `foo/.bar/exec.js` => `foo/bar/exec.js`
pub fn unignore_fixture(fixture_path: &Path) {
    if fixture_path.components().all(|c| {
        !matches!(c, Component::Normal(..)) || !c.as_os_str().to_string_lossy().starts_with('.')
    }) {
        return;
    }
    //

    let mut new_path = PathBuf::new();

    for c in fixture_path.components() {
        if let Component::Normal(s) = c {
            if let Some(s) = s.to_string_lossy().strip_prefix('.') {
                new_path.push(s);

                continue;
            }
        }
        new_path.push(c);
    }

    create_dir_all(new_path.parent().unwrap()).expect("failed to create parent dir");

    rename(fixture_path, &new_path).expect("failed to rename");
}

pub static CARGO_TARGET_DIR: Lazy<PathBuf> = Lazy::new(|| {
    cargo_metadata::MetadataCommand::new()
        .no_deps()
        .exec()
        .unwrap()
        .target_directory
        .into()
});

pub static CARGO_WORKSPACE_ROOT: Lazy<PathBuf> = Lazy::new(|| {
    cargo_metadata::MetadataCommand::new()
        .no_deps()
        .exec()
        .unwrap()
        .workspace_root
        .into()
});
