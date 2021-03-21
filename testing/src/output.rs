use crate::paths;
use pretty_assertions::assert_eq;
use std::{
    fmt,
    fs::{create_dir_all, remove_file, File},
    io::Read,
    ops::Deref,
    path::Path,
};

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

impl NormalizedOutput {
    /// If output differs, prints actual stdout/stderr to
    /// `CARGO_MANIFEST_DIR/target/swc-test-results/ui/$rel_path` where
    /// `$rel_path`: `path.strip_prefix(CARGO_MANIFEST_DIR)`
    pub fn compare_to_file<P>(self, path: P) -> Result<(), Diff>
    where
        P: AsRef<Path>,
    {
        let path = path.as_ref();
        let path = path.canonicalize().unwrap_or_else(|err| {
            eprintln!(
                "compare_to_file: failed to canonicalize outfile path `{}`: {:?}",
                path.display(),
                err
            );
            path.to_path_buf()
        });

        let expected = File::open(&path)
            .map(|mut file| {
                let mut buf = String::new();
                file.read_to_string(&mut buf).unwrap();
                buf
            })
            .unwrap_or_else(|_| {
                // If xxx.stderr file does not exist, stderr should be empty.
                String::new()
            });

        let path_for_actual = paths::test_results_dir().join("ui").join(
            path.strip_prefix(&paths::manifest_dir())
                .unwrap_or_else(|_| {
                    unreachable!(
                        "failed to strip prefix: CARGO_MANIFEST_DIR\nPath: {}\nManifest dir: {}",
                        path.display(),
                        paths::manifest_dir().display()
                    )
                }),
        );
        eprintln!("{}:{}", path.display(), path_for_actual.display());
        if self.0 == expected {
            let _ = remove_file(path_for_actual);
            return Ok(());
        }
        create_dir_all(path_for_actual.parent().unwrap()).expect("failed to run `mkdir -p`");

        let diff = Diff {
            expected: NormalizedOutput(expected),
            actual: self.clone(),
        };
        if std::env::var("UPDATE").unwrap_or(String::from("0")) == "0" {
            assert_eq!(diff.expected, diff.actual, "Actual:\n{}", diff.actual);
            return Err(diff);
        }

        // ::write_to_file(&path_for_actual, &self.0);
        crate::write_to_file(&path, &self.0);

        eprintln!(
            "Assertion failed: \nActual file printed to {}",
            path_for_actual.display()
        );

        Err(diff)
    }
}

impl From<String> for NormalizedOutput {
    fn from(s: String) -> Self {
        if s.is_empty() {
            return NormalizedOutput(s);
        }

        let manifest_dirs = vec![
            adjust_canonicalization(paths::manifest_dir()),
            paths::manifest_dir().to_string_lossy().to_string(),
            adjust_canonicalization(paths::manifest_dir()).replace("\\", "\\\\"),
            paths::manifest_dir()
                .to_string_lossy()
                .replace("\\", "\\\\"),
        ];

        let s = s.replace("\r\n", "\n");

        let mut buf = String::new();
        for line in s.lines() {
            if manifest_dirs.iter().any(|dir| line.contains(&**dir)) {
                let mut s = line.to_string();

                for dir in &manifest_dirs {
                    s = s.replace(&**dir, "$DIR");
                }
                s = s.replace("\\\\", "\\").replace("\\", "/");
                let s = if cfg!(target_os = "windows") {
                    s.replace("//?/$DIR", "$DIR").replace("/?/$DIR", "$DIR")
                } else {
                    s
                };
                buf.push_str(&s)
            } else {
                buf.push_str(&line);
            }
            buf.push('\n')
        }

        NormalizedOutput(buf)
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
    if p.starts_with(VERBATIM_PREFIX) {
        p[VERBATIM_PREFIX.len()..].to_string()
    } else {
        p
    }
}
