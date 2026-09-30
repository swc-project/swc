use std::{
    fs,
    os::unix::fs::PermissionsExt,
    path::{Path, PathBuf},
};

use serde::Deserialize;

use super::{files, success, Repo};

#[derive(Deserialize)]
#[serde(rename_all = "snake_case")]
enum Outcome {
    Success,
    GenerationFailure,
    VersionFailure,
    PartialVersionFailure,
    CommitFailure,
    Uncommitted,
    TagExists,
}

#[derive(Deserialize)]
struct Case {
    outcome: Outcome,
    #[serde(default)]
    preexisting: bool,
}

#[testing::fixture("tests/bump/fixtures/*/case.json")]
fn bump_fixture(input: PathBuf) {
    let case: Case = serde_json::from_str(&fs::read_to_string(input).unwrap()).unwrap();
    let repo = Repo::new();
    let fixture = Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/bump");
    fs::copy(
        fixture.join("Cargo.input.toml"),
        repo.path().join("Cargo.toml"),
    )
    .unwrap();
    fs::create_dir(repo.path().join("src")).unwrap();
    fs::write(repo.path().join("src/lib.rs"), "").unwrap();
    let note = repo.path().join(".changeset/release.md");
    fs::copy(fixture.join("input.md"), &note).unwrap();
    if case.preexisting {
        fs::write(repo.path().join("local.txt"), "original\n").unwrap();
        fs::write(repo.path().join("CHANGELOG.md"), "Previous npm notes\n").unwrap();
        fs::write(
            repo.path().join("CHANGELOG-CORE.md"),
            "Previous core notes\n",
        )
        .unwrap();
    }
    repo.commit("fix(core): Preserve detailed release notes (#123)", 1);
    let original = fs::read(&note).unwrap();

    // Fake only cargo-edit, whose invocation and exit status are the boundary
    // being tested. cargo metadata still reads a real, minimal Rust workspace.
    let bin = repo.path().join(".git/test-bin");
    fs::create_dir(&bin).unwrap();
    let cargo = std::env::var("CARGO").unwrap();
    let cargo = format!("'{}'", cargo.replace('\'', "'\\''"));
    let set_version = match case.outcome {
        Outcome::VersionFailure => "exit 42",
        Outcome::PartialVersionFailure => {
            r#"sed "s/version = \"1.0.0\"/version = \"$4\"/" Cargo.toml > Cargo.next
mv Cargo.next Cargo.toml
printf 'partial lockfile update' > Cargo.lock
exit 42"#
        }
        _ => {
            r#"sed "s/version = \"1.0.0\"/version = \"$4\"/" Cargo.toml > Cargo.next
mv Cargo.next Cargo.toml"#
        }
    };
    executable(
        &bin.join("cargo"),
        &format!(
            r#"#!/bin/sh
set -eu
if [ "$1" = set-version ]; then
    printf 'called' > .git/set-version-called
    {set_version}
else
    exec {cargo} "$@"
fi
"#
        ),
    );
    let mut paths = vec![bin];
    paths.extend(std::env::split_paths(&std::env::var_os("PATH").unwrap()));
    let path = std::env::join_paths(paths).unwrap();
    let command = || {
        let mut command = repo.command();
        command.env("PATH", &path);
        command
    };
    match case.outcome {
        Outcome::GenerationFailure => {
            fs::write(repo.path().join("cliff-core.toml"), "invalid = [").unwrap()
        }
        Outcome::CommitFailure => {
            let hooks = repo.path().join(".git/test-hooks");
            fs::create_dir(&hooks).unwrap();
            executable(&hooks.join("pre-commit"), "#!/bin/sh\nexit 1\n");
        }
        Outcome::Uncommitted => fs::write(
            &note,
            format!(
                "{}\nUncommitted explanation.\n",
                String::from_utf8_lossy(&original)
            ),
        )
        .unwrap(),
        Outcome::TagExists => {
            repo.git(&["tag", "swc_core@v1.0.1"]);
        }
        _ => {}
    }

    if case.preexisting {
        // Preserve the distinction between staged and unstaged user edits.
        fs::write(repo.path().join("local.txt"), "staged\n").unwrap();
        repo.git(&["add", "--", "local.txt"]);
        fs::write(repo.path().join("local.txt"), "unstaged\n").unwrap();
        fs::write(repo.path().join("CHANGELOG.md"), "Local npm notes\n").unwrap();
    }

    let head = repo.git(&["rev-parse", "HEAD"]);
    let tags = repo.git(&["tag", "--list"]);
    let index = repo.git(&["ls-files", "--stage"]);
    let status = repo.git(&["status", "--porcelain"]);
    let before = files(repo.path());
    if !matches!(
        case.outcome,
        Outcome::GenerationFailure | Outcome::TagExists
    ) {
        let preview = command().args(["--dry-run", "bump"]).output().unwrap();
        success(&preview);
        assert!(String::from_utf8_lossy(&preview.stdout).contains("[swc_core@v1.0.1]"));
        assert_eq!(
            files(repo.path()),
            before,
            "dry-run changed workspace files"
        );
        assert!(!repo.path().join(".git/set-version-called").exists());
        assert_eq!(repo.git(&["rev-parse", "HEAD"]), head);
        assert_eq!(repo.git(&["tag", "--list"]), tags);
    }
    let output = command().arg("bump").output().unwrap();
    if matches!(case.outcome, Outcome::Success) {
        success(&output);
        assert!(!note.exists());
        assert!(fs::read_to_string(repo.path().join("Cargo.toml"))
            .unwrap()
            .contains("version = \"1.0.1\""));
        assert_eq!(
            repo.git(&["rev-parse", "swc_core@v1.0.1"]),
            repo.git(&["rev-parse", "HEAD"])
        );
        let generated = files(repo.path());
        repo.generate();
        assert_eq!(
            files(repo.path()),
            generated,
            "regeneration lost consumed release notes"
        );
        assert!(repo.git(&["status", "--porcelain"]).is_empty());
    } else {
        assert!(!output.status.success(), "expected release failure");
        let stderr = String::from_utf8_lossy(&output.stderr);
        let expected = match case.outcome {
            Outcome::GenerationFailure => "cliff",
            Outcome::VersionFailure | Outcome::PartialVersionFailure => "set-version",
            Outcome::CommitFailure => "failed to commit",
            Outcome::Uncommitted => "commit pending changesets",
            Outcome::TagExists => "already exists",
            Outcome::Success => unreachable!(),
        };
        assert!(stderr.contains(expected), "{stderr}");
        assert_eq!(repo.git(&["rev-parse", "HEAD"]), head);
        assert_eq!(repo.git(&["tag", "--list"]), tags);
        assert_eq!(
            fs::read(&note).unwrap(),
            before[Path::new(".changeset/release.md")]
        );
        assert_eq!(files(repo.path()), before, "failed release changed files");
        assert_eq!(repo.git(&["ls-files", "--stage"]), index);
        assert_eq!(repo.git(&["status", "--porcelain"]), status);
        if matches!(case.outcome, Outcome::CommitFailure) {
            fs::remove_file(repo.path().join(".git/test-hooks/pre-commit")).unwrap();
            success(&command().arg("bump").output().unwrap());
            assert!(fs::read_to_string(repo.path().join("Cargo.toml"))
                .unwrap()
                .contains("version = \"1.0.1\""));
            assert!(!note.exists(), "retry did not consume the changeset");
            assert_eq!(
                repo.git(&["rev-parse", "swc_core@v1.0.1"]),
                repo.git(&["rev-parse", "HEAD"])
            );
        }
    }
}

fn executable(path: &Path, contents: &str) {
    fs::write(path, contents).unwrap();
    fs::set_permissions(path, fs::Permissions::from_mode(0o755)).unwrap();
}
