use std::{
    collections::BTreeMap,
    fs,
    path::{Path, PathBuf},
    process::{Command, Output},
};

use regex::Regex;
use serde::Deserialize;
use testing::NormalizedOutput;

#[cfg(unix)]
mod bump;

#[derive(Deserialize)]
struct Scenario {
    steps: Vec<Step>,
}

#[derive(Deserialize)]
struct Step {
    #[serde(default)]
    files: BTreeMap<String, String>,
    #[serde(default)]
    remove: Vec<String>,
    message: Option<String>,
    #[serde(default)]
    tags: Vec<String>,
    snapshot: Option<String>,
    error: Option<String>,
}

struct Repo {
    directory: tempfile::TempDir,
}

impl Repo {
    fn new() -> Self {
        let repo = Self {
            directory: tempfile::tempdir().unwrap(),
        };
        repo.git(&["init", "-b", "main"]);
        repo.git(&["config", "user.name", "Release Test"]);
        repo.git(&["config", "user.email", "release@example.invalid"]);
        repo.git(&["config", "commit.gpgsign", "false"]);
        repo.git(&["config", "tag.gpgsign", "false"]);
        // Tests must not inherit a developer's repository hooks.
        repo.git(&["config", "core.hooksPath", ".git/test-hooks"]);
        let root = Path::new(env!("CARGO_MANIFEST_DIR")).join("../..");
        for name in ["cliff.toml", "cliff-core.toml"] {
            fs::copy(root.join(name), repo.path().join(name)).unwrap();
        }
        fs::create_dir(repo.path().join(".changeset")).unwrap();
        repo.commit("chore: Initialize repository", 0);
        repo.git(&["tag", "v1.0.0"]);
        repo.git(&["tag", "swc_core@v1.0.0"]);
        repo
    }

    fn path(&self) -> &Path {
        self.directory.path()
    }

    fn git(&self, args: &[&str]) -> String {
        let output = Command::new("git")
            .current_dir(self.path())
            .args(args)
            .output()
            .unwrap();
        success(&output);
        String::from_utf8(output.stdout).unwrap()
    }

    fn commit(&self, message: &str, index: usize) {
        self.git(&["add", "-A"]);
        let date = format!("2026-01-{:02}T00:00:00Z", index + 1);
        let output = Command::new("git")
            .current_dir(self.path())
            .env("GIT_AUTHOR_DATE", &date)
            .env("GIT_COMMITTER_DATE", &date)
            .args(["commit", "--allow-empty", "-m", message])
            .output()
            .unwrap();
        success(&output);
    }

    fn command(&self) -> Command {
        let mut command = Command::new(env!("CARGO_BIN_EXE_swc-releaser"));
        command
            .current_dir(self.path())
            .env("CARGO_WORKSPACE_DIR", self.path());
        command
    }

    fn generate(&self) {
        success(&self.command().arg("changelog").output().unwrap());
    }

    fn snapshot(&self, fixture: &Path, name: &str) {
        self.generate();
        let hashes = Regex::new(r"\b(?:[0-9a-f]{40}|[0-9a-f]{7})\b").unwrap();
        for (file, suffix) in [("CHANGELOG.md", "npm"), ("CHANGELOG-CORE.md", "core")] {
            let contents = fs::read_to_string(self.path().join(file)).unwrap();
            NormalizedOutput::new_raw(hashes.replace_all(&contents, "COMMIT").into_owned())
                .compare_to_file(fixture.join(format!("{name}.{suffix}.md")))
                .unwrap();
        }
        let before = files(self.path());
        self.generate();
        assert_eq!(
            files(self.path()),
            before,
            "regeneration must be deterministic"
        );
        let head = self.git(&["rev-parse", "HEAD"]);
        let tags = self.git(&["tag", "--list"]);
        let preview = self
            .command()
            .args(["--dry-run", "changelog"])
            .output()
            .unwrap();
        success(&preview);
        assert!(String::from_utf8(preview.stdout)
            .unwrap()
            .contains("--- CHANGELOG-CORE.md ---"));
        assert_eq!(files(self.path()), before, "dry-run changed files");
        assert_eq!(self.git(&["rev-parse", "HEAD"]), head);
        assert_eq!(self.git(&["tag", "--list"]), tags);
    }
}

#[testing::fixture("tests/fixtures/*/scenario.json")]
fn changelog_fixture(input: PathBuf) {
    let fixture = input.parent().unwrap();
    let scenario: Scenario = serde_json::from_str(&fs::read_to_string(&input).unwrap()).unwrap();
    let repo = Repo::new();
    for (index, step) in scenario.steps.into_iter().enumerate() {
        for (destination, source) in step.files {
            let destination = repo.path().join(destination);
            fs::create_dir_all(destination.parent().unwrap()).unwrap();
            fs::copy(fixture.join(source), destination).unwrap();
        }
        for path in step.remove {
            fs::remove_file(repo.path().join(path)).unwrap();
        }
        if let Some(message) = step.message {
            repo.commit(&message, index + 1);
        }
        for tag in step.tags {
            repo.git(&["tag", &tag]);
        }
        if let Some(name) = step.snapshot {
            repo.snapshot(fixture, &name);
        }
        if let Some(error) = step.error {
            let before = files(repo.path());
            let output = repo.command().arg("changelog").output().unwrap();
            assert!(!output.status.success());
            assert!(
                String::from_utf8_lossy(&output.stderr).contains(&error),
                "{}",
                String::from_utf8_lossy(&output.stderr)
            );
            assert_eq!(files(repo.path()), before);
        }
    }
}

/// Compare file bytes as well as Git state: an untracked file can be rewritten
/// without changing `git status --porcelain`.
fn files(root: &Path) -> BTreeMap<PathBuf, Vec<u8>> {
    fn visit(root: &Path, path: &Path, result: &mut BTreeMap<PathBuf, Vec<u8>>) {
        for entry in fs::read_dir(path).unwrap() {
            let entry = entry.unwrap();
            if entry.file_name() == ".git" {
                continue;
            }
            if entry.file_type().unwrap().is_dir() {
                visit(root, &entry.path(), result);
            } else {
                result.insert(
                    entry.path().strip_prefix(root).unwrap().to_owned(),
                    fs::read(entry.path()).unwrap(),
                );
            }
        }
    }
    let mut result = BTreeMap::new();
    visit(root, root, &mut result);
    result
}

fn success(output: &Output) {
    assert!(
        output.status.success(),
        "{}\n{}",
        String::from_utf8_lossy(&output.stdout),
        String::from_utf8_lossy(&output.stderr)
    );
}
