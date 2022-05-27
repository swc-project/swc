use std::{
    env, fmt,
    fs::{create_dir_all, File},
    io::Read,
    ops::Deref,
    path::Path,
};

use tracing::{debug, error};

use crate::paths;

#[must_use]
pub struct TestOutput<R> {
    /// Errors produced by `swc_common::error::Handler`.
    pub errors: StdErr,
    pub result: R,
}

pub type StdErr = NormalizedOutput;

#[derive(Debug, Clone, Hash)]
pub struct Diff {
    pub actual: NormalizedOutput,
    /// Output stored in file.
    pub expected: NormalizedOutput,
}

/// Normalized stdout/stderr.
///
/// # Normalization
///
/// See https://github.com/rust-lang/rust/blob/b224fc84e3/src/test/COMPILER_TESTS.md#normalization
///
/// - The `CARGO_MANIFEST_DIR` directory is replaced with `$DIR`.
/// - All backslashes (\) within same line as `$DIR` are converted to forward
/// slashes (/) (for Windows) - All CR LF newlines are converted to LF
///
/// - `normalize-stdout` is not implemented (yet?).
#[derive(Clone, Ord, PartialOrd, PartialEq, Eq, Default, Hash)]
pub struct NormalizedOutput(String);

impl fmt::Display for NormalizedOutput {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        fmt::Display::fmt(&self.0, f)
    }
}

impl fmt::Debug for NormalizedOutput {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        fmt::Display::fmt(&self.0, f)
    }
}

fn normalize_input(input: String, skip_last_newline: bool) -> String {
    let manifest_dirs = vec![
        adjust_canonicalization(paths::manifest_dir()),
        paths::manifest_dir().to_string_lossy().to_string(),
        adjust_canonicalization(paths::manifest_dir()).replace('\\', "\\\\"),
        paths::manifest_dir()
            .to_string_lossy()
            .replace('\\', "\\\\"),
    ];

    let input = input.replace("\r\n", "\n");

    let mut buf = String::new();

    for line in input.lines() {
        if manifest_dirs.iter().any(|dir| line.contains(&**dir)) {
            let mut s = line.to_string();

            for dir in &manifest_dirs {
                s = s.replace(&**dir, "$DIR");
            }
            s = s.replace("\\\\", "\\").replace('\\', "/");
            let s = if cfg!(target_os = "windows") {
                s.replace("//?/$DIR", "$DIR").replace("/?/$DIR", "$DIR")
            } else {
                s
            };
            buf.push_str(&s)
        } else {
            buf.push_str(line);
        }

        buf.push('\n');
    }

    if skip_last_newline && !matches!(input.chars().last(), Some('\n')) {
        buf.truncate(buf.len() - 1);
    }

    buf
}

impl NormalizedOutput {
    pub fn new_raw(s: String) -> Self {
        if s.is_empty() {
            return NormalizedOutput(s);
        }

        NormalizedOutput(normalize_input(s, true))
    }

    /// If output differs, prints actual stdout/stderr to
    /// `CARGO_MANIFEST_DIR/target/swc-test-results/ui/$rel_path` where
    /// `$rel_path`: `path.strip_prefix(CARGO_MANIFEST_DIR)`
    pub fn compare_to_file<P>(self, path: P) -> Result<(), Diff>
    where
        P: AsRef<Path>,
    {
        let path = path.as_ref();
        let path = path.canonicalize().unwrap_or_else(|err| {
            debug!(
                "compare_to_file: failed to canonicalize outfile path `{}`: {:?}",
                path.display(),
                err
            );
            path.to_path_buf()
        });

        let expected: NormalizedOutput = NormalizedOutput(
            File::open(&path)
                .map(|mut file| {
                    let mut buf = String::new();
                    file.read_to_string(&mut buf).unwrap();
                    buf
                })
                .unwrap_or_else(|_| {
                    // If xxx.stderr file does not exist, stderr should be empty.
                    String::new()
                })
                .replace("\r\n", "\n"),
        );

        if expected == self {
            return Ok(());
        }

        debug!("Comparing output to {}", path.display());
        create_dir_all(path.parent().unwrap()).expect("failed to run `mkdir -p`");

        if std::env::var("UPDATE").unwrap_or_default() == "1" {
            crate::write_to_file(&path, &self.0);

            error!(
                "Assertion failed: \nActual file printed to {}",
                path.display()
            );
        }

        if self.0.lines().count() <= 5 {
            assert_eq!(expected, self, "Actual:\n{}", self);
        }

        let diff = Diff {
            expected,
            actual: self,
        };

        if env::var("DIFF").unwrap_or_default() == "0" {
            assert_eq!(diff.expected, diff.actual, "Actual:\n{}", diff.actual);
        } else {
            pretty_assertions::assert_eq!(diff.expected, diff.actual, "Actual:\n{}", diff.actual);
        }

        // Actually unreachable.
        Err(diff)
    }
}

impl From<String> for NormalizedOutput {
    fn from(s: String) -> Self {
        if s.is_empty() {
            return NormalizedOutput(s);
        }

        NormalizedOutput(normalize_input(s, false))
    }
}

impl Deref for NormalizedOutput {
    type Target = str;

    fn deref(&self) -> &str {
        &self.0
    }
}

///
pub type StdOut = NormalizedOutput;

impl<R> TestOutput<Option<R>> {
    /// Expects **`result`** to be `None` and **`errors`** to be match content
    /// of `${path}.stderr`.
    pub fn expect_err(self, _path: &Path) {}
}

#[cfg(not(target_os = "windows"))]
fn adjust_canonicalization<P: AsRef<Path>>(p: P) -> String {
    p.as_ref().display().to_string()
}

#[cfg(target_os = "windows")]
fn adjust_canonicalization<P: AsRef<Path>>(p: P) -> String {
    const VERBATIM_PREFIX: &str = r#"\\?\"#;
    let p = p.as_ref().display().to_string();
    if let Some(stripped) = p.strip_prefix(VERBATIM_PREFIX) {
        stripped.to_string()
    } else {
        p
    }
}
