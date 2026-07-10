//! Safe setup and inspection of pinned upstream repositories.

use std::{
    collections::BTreeSet,
    ffi::OsStr,
    fs,
    path::{Path, PathBuf},
    process::{Command, Output},
};

use anyhow::{bail, Context, Result};
use serde::Serialize;

use crate::config::{ProjectPaths, Revision, UpstreamId, Upstreams};

/// Controls how managed upstream repositories are synchronized.
#[derive(Clone, Copy, Debug, Default, Eq, PartialEq)]
pub struct SetupOptions {
    /// Refuse to replace an existing checkout at a different revision.
    pub locked: bool,
    /// Perform no network operation and require an exact existing checkout.
    pub offline: bool,
    /// Permit removal of dirty tracked and untracked files in managed repos.
    pub force: bool,
}

/// Current state of one managed upstream checkout.
#[derive(Clone, Copy, Debug, Eq, PartialEq, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum UpstreamState {
    /// The checkout directory does not exist.
    Missing,
    /// HEAD equals the configured revision and the worktree is clean.
    Ready,
    /// HEAD differs from the configured revision.
    RevisionMismatch,
    /// The worktree contains tracked or untracked changes.
    Dirty,
    /// The directory is not a safe, standalone Git checkout.
    InvalidRepository,
}

/// Inspection result for one configured upstream.
#[derive(Clone, Debug, Eq, PartialEq, Serialize)]
pub struct UpstreamStatus {
    /// Typed upstream identifier.
    pub id: UpstreamId,
    /// Fixed path below the managed vendor directory.
    pub path: PathBuf,
    /// Revision pinned in `upstreams.toml`.
    pub expected_revision: Revision,
    /// Current HEAD, when the directory contains a valid commit.
    pub actual_revision: Option<Revision>,
    /// Classified checkout state.
    pub state: UpstreamState,
}

/// Inspects selected upstreams without changing the filesystem.
///
/// An empty selection means all configured upstreams. Results always follow
/// [`UpstreamId::ALL`] order, regardless of the order supplied by the caller.
pub fn inspect_upstreams(
    paths: &ProjectPaths,
    upstreams: &Upstreams,
    selected: &[UpstreamId],
) -> Result<Vec<UpstreamStatus>> {
    validate_vendor_root(paths, false)?;

    selected_ids(selected)
        .into_iter()
        .map(|id| inspect_upstream(paths, upstreams, id))
        .collect()
}

/// Synchronizes selected upstreams to their pinned revisions.
///
/// All mutations are constrained to fixed direct children of
/// [`ProjectPaths::vendor_root`]. Dirty repositories are never reset unless
/// `force` is set. Offline mode is validation-only and requires a clean exact
/// checkout. Locked mode permits creating a missing checkout, but refuses to
/// move an existing checkout from a different commit.
pub fn setup_upstreams(
    paths: &ProjectPaths,
    upstreams: &Upstreams,
    selected: &[UpstreamId],
    options: SetupOptions,
) -> Result<Vec<UpstreamStatus>> {
    if options.offline && options.force {
        bail!("`offline` and `force` cannot be used together");
    }

    validate_vendor_root(paths, !options.offline)?;

    let mut statuses = Vec::new();
    for id in selected_ids(selected) {
        let status = if options.offline {
            validate_offline_checkout(paths, upstreams, id)?
        } else {
            synchronize_upstream(paths, upstreams, id, options)?
        };
        statuses.push(status);
    }
    Ok(statuses)
}

fn selected_ids(selected: &[UpstreamId]) -> Vec<UpstreamId> {
    if selected.is_empty() {
        return UpstreamId::ALL.to_vec();
    }

    let selected = selected.iter().copied().collect::<BTreeSet<_>>();
    UpstreamId::ALL
        .into_iter()
        .filter(|id| selected.contains(id))
        .collect()
}

fn inspect_upstream(
    paths: &ProjectPaths,
    upstreams: &Upstreams,
    id: UpstreamId,
) -> Result<UpstreamStatus> {
    let path = paths.upstream_dir(id);
    let expected_revision = upstreams.get(id).revision.clone();
    if !path.exists() {
        return Ok(UpstreamStatus {
            id,
            path,
            expected_revision,
            actual_revision: None,
            state: UpstreamState::Missing,
        });
    }

    if validate_checkout_directory(paths, id).is_err() {
        return Ok(UpstreamStatus {
            id,
            path,
            expected_revision,
            actual_revision: None,
            state: UpstreamState::InvalidRepository,
        });
    }

    let Ok(actual_revision) = read_head(&path) else {
        return Ok(UpstreamStatus {
            id,
            path,
            expected_revision,
            actual_revision: None,
            state: UpstreamState::InvalidRepository,
        });
    };
    let Ok(dirty) = is_dirty(&path) else {
        return Ok(UpstreamStatus {
            id,
            path,
            expected_revision,
            actual_revision,
            state: UpstreamState::InvalidRepository,
        });
    };

    let state = if dirty {
        UpstreamState::Dirty
    } else if actual_revision.as_ref() == Some(&expected_revision) {
        UpstreamState::Ready
    } else {
        UpstreamState::RevisionMismatch
    };

    Ok(UpstreamStatus {
        id,
        path,
        expected_revision,
        actual_revision,
        state,
    })
}

fn validate_offline_checkout(
    paths: &ProjectPaths,
    upstreams: &Upstreams,
    id: UpstreamId,
) -> Result<UpstreamStatus> {
    let status = inspect_upstream(paths, upstreams, id)?;
    match status.state {
        UpstreamState::Ready => Ok(status),
        UpstreamState::Missing => bail!(
            "offline setup requires `{id}` at `{}` to exist",
            status.path.display()
        ),
        UpstreamState::RevisionMismatch => bail!(
            "offline setup requires `{id}` at revision {}, found {}",
            status.expected_revision,
            display_actual_revision(&status)
        ),
        UpstreamState::Dirty => bail!(
            "offline setup requires a clean `{id}` checkout at `{}`",
            status.path.display()
        ),
        UpstreamState::InvalidRepository => bail!(
            "offline setup found an invalid `{id}` repository at `{}`",
            status.path.display()
        ),
    }
}

fn synchronize_upstream(
    paths: &ProjectPaths,
    upstreams: &Upstreams,
    id: UpstreamId,
    options: SetupOptions,
) -> Result<UpstreamStatus> {
    let config = upstreams.get(id);
    if config.url.trim().is_empty() {
        bail!("upstream `{id}` has an empty Git URL");
    }

    let path = prepare_checkout_directory(paths, id, options.force)?;
    let repository_exists = path.join(".git").exists();
    if repository_exists {
        validate_checkout_directory(paths, id)?;
        let dirty = is_dirty(&path)?;
        if dirty && !options.force {
            bail!(
                "refusing to reset dirty `{id}` checkout at `{}`; pass `--force` to discard its \
                 changes",
                path.display()
            );
        }

        let actual_revision = read_head(&path)?;
        if options.locked
            && actual_revision.is_some()
            && actual_revision.as_ref() != Some(&config.revision)
        {
            bail!(
                "locked setup expected `{id}` at revision {}, found {}",
                config.revision,
                actual_revision
                    .as_ref()
                    .map_or_else(|| "no commit".to_string(), ToString::to_string)
            );
        }
    } else {
        run_git(&path, ["init", "--quiet"])?;
        validate_checkout_directory(paths, id)?;
    }

    configure_origin(&path, &config.url)?;
    run_git(
        &path,
        [
            "fetch",
            "--quiet",
            "--depth",
            "1",
            "origin",
            config.revision.as_str(),
        ],
    )?;
    run_git(
        &path,
        ["reset", "--quiet", "--hard", config.revision.as_str()],
    )?;
    if options.force {
        run_git(&path, ["clean", "-ffdx"])?;
    }

    let status = inspect_upstream(paths, upstreams, id)?;
    if status.state != UpstreamState::Ready {
        bail!(
            "setup of `{id}` did not produce a clean checkout at revision {}",
            config.revision
        );
    }
    Ok(status)
}

fn validate_vendor_root(paths: &ProjectPaths, create: bool) -> Result<()> {
    let vendor_root = paths.vendor_root();
    if !vendor_root.exists() {
        if create {
            fs::create_dir(vendor_root).with_context(|| {
                format!(
                    "failed to create managed vendor directory `{}`",
                    vendor_root.display()
                )
            })?;
        }
        return Ok(());
    }

    let metadata = fs::symlink_metadata(vendor_root).with_context(|| {
        format!(
            "failed to inspect managed vendor directory `{}`",
            vendor_root.display()
        )
    })?;
    if metadata.file_type().is_symlink() || !metadata.is_dir() {
        bail!(
            "managed vendor path `{}` must be a real directory, not a symlink or file",
            vendor_root.display()
        );
    }

    let canonical_vendor = vendor_root.canonicalize().with_context(|| {
        format!(
            "failed to resolve managed vendor directory `{}`",
            vendor_root.display()
        )
    })?;
    if canonical_vendor.parent() != Some(paths.tool_root()) {
        bail!(
            "managed vendor directory `{}` escapes the Test262 tool root",
            vendor_root.display()
        );
    }
    Ok(())
}

fn prepare_checkout_directory(
    paths: &ProjectPaths,
    id: UpstreamId,
    force: bool,
) -> Result<PathBuf> {
    let path = paths.upstream_dir(id);
    if !path.exists() {
        fs::create_dir(&path)
            .with_context(|| format!("failed to create managed checkout `{}`", path.display()))?;
        return Ok(path);
    }

    let metadata = fs::symlink_metadata(&path)
        .with_context(|| format!("failed to inspect managed checkout `{}`", path.display()))?;
    if metadata.file_type().is_symlink() || !metadata.is_dir() {
        bail!(
            "managed checkout `{}` must be a real directory, not a symlink or file",
            path.display()
        );
    }

    let git_directory = path.join(".git");
    if !git_directory.exists() && directory_has_entries(&path)? && !force {
        bail!(
            "refusing to initialize non-empty managed checkout `{}`; pass `--force` to discard \
             its contents",
            path.display()
        );
    }
    Ok(path)
}

fn validate_checkout_directory(paths: &ProjectPaths, id: UpstreamId) -> Result<()> {
    let path = paths.upstream_dir(id);
    let metadata = fs::symlink_metadata(&path)
        .with_context(|| format!("failed to inspect managed checkout `{}`", path.display()))?;
    if metadata.file_type().is_symlink() || !metadata.is_dir() {
        bail!(
            "managed checkout `{}` is not a real directory",
            path.display()
        );
    }

    let canonical_path = path
        .canonicalize()
        .with_context(|| format!("failed to resolve managed checkout `{}`", path.display()))?;
    if canonical_path.parent() != Some(paths.vendor_root()) {
        bail!(
            "managed checkout `{}` escapes the vendor directory",
            path.display()
        );
    }

    let git_directory = path.join(".git");
    let git_metadata = fs::symlink_metadata(&git_directory).with_context(|| {
        format!(
            "managed checkout `{}` does not contain a standalone Git repository",
            path.display()
        )
    })?;
    if git_metadata.file_type().is_symlink() || !git_metadata.is_dir() {
        bail!(
            "managed checkout `{}` must use an internal .git directory",
            path.display()
        );
    }

    let top_level = git_stdout(&path, ["rev-parse", "--show-toplevel"])?;
    let top_level = Path::new(&top_level).canonicalize().with_context(|| {
        format!(
            "failed to resolve Git worktree root `{top_level}` for `{}`",
            path.display()
        )
    })?;
    if top_level != canonical_path {
        bail!(
            "Git worktree for `{}` resolves outside its managed checkout",
            path.display()
        );
    }
    Ok(())
}

fn directory_has_entries(path: &Path) -> Result<bool> {
    let mut entries = fs::read_dir(path)
        .with_context(|| format!("failed to read managed checkout `{}`", path.display()))?;
    Ok(entries.next().transpose()?.is_some())
}

fn configure_origin(path: &Path, url: &str) -> Result<()> {
    let remotes = git_stdout(path, ["remote"])?;
    if remotes.lines().any(|remote| remote == "origin") {
        run_git(path, ["remote", "set-url", "origin", url])?;
    } else {
        run_git(path, ["remote", "add", "origin", url])?;
    }
    Ok(())
}

fn read_head(path: &Path) -> Result<Option<Revision>> {
    let output = git_command(path, ["rev-parse", "--verify", "HEAD"])?;
    if !output.status.success() {
        return Ok(None);
    }

    let value = String::from_utf8(output.stdout).context("Git returned a non-UTF-8 revision")?;
    let revision = Revision::new(value.trim()).context("Git HEAD is not a full SHA-1 object ID")?;
    Ok(Some(revision))
}

fn is_dirty(path: &Path) -> Result<bool> {
    let status = git_stdout(path, ["status", "--porcelain=v1", "--untracked-files=all"])?;
    Ok(!status.is_empty())
}

fn display_actual_revision(status: &UpstreamStatus) -> String {
    status
        .actual_revision
        .as_ref()
        .map_or_else(|| "no commit".to_string(), ToString::to_string)
}

fn git_stdout<I, S>(path: &Path, arguments: I) -> Result<String>
where
    I: IntoIterator<Item = S>,
    S: AsRef<OsStr>,
{
    let output = git_command(path, arguments)?;
    ensure_git_success(path, &output)?;
    let stdout = String::from_utf8(output.stdout).context("Git returned non-UTF-8 output")?;
    Ok(stdout.trim().to_string())
}

fn run_git<I, S>(path: &Path, arguments: I) -> Result<()>
where
    I: IntoIterator<Item = S>,
    S: AsRef<OsStr>,
{
    let output = git_command(path, arguments)?;
    ensure_git_success(path, &output)
}

fn git_command<I, S>(path: &Path, arguments: I) -> Result<Output>
where
    I: IntoIterator<Item = S>,
    S: AsRef<OsStr>,
{
    Command::new("git")
        .args(arguments)
        .current_dir(path)
        .output()
        .with_context(|| format!("failed to execute Git in `{}`", path.display()))
}

fn ensure_git_success(path: &Path, output: &Output) -> Result<()> {
    if output.status.success() {
        return Ok(());
    }

    let stderr = String::from_utf8_lossy(&output.stderr);
    let stdout = String::from_utf8_lossy(&output.stdout);
    bail!(
        "Git command failed in `{}` with status {}\nstdout: {}\nstderr: {}",
        path.display(),
        output.status,
        stdout.trim(),
        stderr.trim()
    )
}

#[cfg(test)]
mod tests {
    use std::{
        fs,
        path::Path,
        process::{Command, Output},
    };

    use tempfile::TempDir;

    use super::{inspect_upstreams, setup_upstreams, SetupOptions, UpstreamState};
    use crate::config::{ProjectPaths, Revision, UpstreamConfig, UpstreamId, Upstreams};

    #[test]
    fn clones_and_inspects_a_pinned_revision() {
        let fixture = Fixture::new();
        let revision = fixture.commit("initial");
        let upstreams = fixture.upstreams(revision.clone());

        let statuses = setup_upstreams(
            &fixture.paths,
            &upstreams,
            &[UpstreamId::Test262],
            SetupOptions {
                locked: true,
                ..SetupOptions::default()
            },
        )
        .unwrap();
        assert_eq!(statuses[0].state, UpstreamState::Ready);
        assert_eq!(statuses[0].actual_revision.as_ref(), Some(&revision));

        let statuses =
            inspect_upstreams(&fixture.paths, &upstreams, &[UpstreamId::Test262]).unwrap();
        assert_eq!(statuses[0].state, UpstreamState::Ready);
    }

    #[test]
    fn refuses_dirty_checkouts_unless_forced() {
        let fixture = Fixture::new();
        let revision = fixture.commit("initial");
        let upstreams = fixture.upstreams(revision);
        setup_upstreams(
            &fixture.paths,
            &upstreams,
            &[UpstreamId::Test262],
            SetupOptions::default(),
        )
        .unwrap();

        let checkout = fixture.paths.upstream_dir(UpstreamId::Test262);
        fs::write(checkout.join("fixture.js"), "dirty").unwrap();
        assert!(setup_upstreams(
            &fixture.paths,
            &upstreams,
            &[UpstreamId::Test262],
            SetupOptions::default(),
        )
        .is_err());

        let statuses = setup_upstreams(
            &fixture.paths,
            &upstreams,
            &[UpstreamId::Test262],
            SetupOptions {
                force: true,
                ..SetupOptions::default()
            },
        )
        .unwrap();
        assert_eq!(statuses[0].state, UpstreamState::Ready);
    }

    #[test]
    fn locked_refuses_to_move_an_existing_checkout() {
        let fixture = Fixture::new();
        let first = fixture.commit("first");
        let first_upstreams = fixture.upstreams(first);
        setup_upstreams(
            &fixture.paths,
            &first_upstreams,
            &[UpstreamId::Test262],
            SetupOptions::default(),
        )
        .unwrap();

        let second = fixture.commit("second");
        let second_upstreams = fixture.upstreams(second.clone());
        assert!(setup_upstreams(
            &fixture.paths,
            &second_upstreams,
            &[UpstreamId::Test262],
            SetupOptions {
                locked: true,
                ..SetupOptions::default()
            },
        )
        .is_err());

        let statuses = setup_upstreams(
            &fixture.paths,
            &second_upstreams,
            &[UpstreamId::Test262],
            SetupOptions::default(),
        )
        .unwrap();
        assert_eq!(statuses[0].actual_revision.as_ref(), Some(&second));
    }

    #[test]
    fn offline_requires_an_existing_exact_checkout() {
        let fixture = Fixture::new();
        let revision = fixture.commit("initial");
        let upstreams = fixture.upstreams(revision);

        assert!(setup_upstreams(
            &fixture.paths,
            &upstreams,
            &[UpstreamId::Test262],
            SetupOptions {
                offline: true,
                ..SetupOptions::default()
            },
        )
        .is_err());
        assert!(!fixture.paths.vendor_root().exists());

        setup_upstreams(
            &fixture.paths,
            &upstreams,
            &[UpstreamId::Test262],
            SetupOptions::default(),
        )
        .unwrap();
        let statuses = setup_upstreams(
            &fixture.paths,
            &upstreams,
            &[UpstreamId::Test262],
            SetupOptions {
                offline: true,
                ..SetupOptions::default()
            },
        )
        .unwrap();
        assert_eq!(statuses[0].state, UpstreamState::Ready);
    }

    #[cfg(unix)]
    #[test]
    fn refuses_checkout_symlinks_that_escape_vendor() {
        use std::os::unix::fs::symlink;

        let fixture = Fixture::new();
        let revision = fixture.commit("initial");
        let upstreams = fixture.upstreams(revision);
        fs::create_dir(fixture.paths.vendor_root()).unwrap();
        let outside = fixture.directory.path().join("outside");
        fs::create_dir(&outside).unwrap();
        let marker = outside.join("marker");
        fs::write(&marker, "unchanged").unwrap();
        symlink(&outside, fixture.paths.upstream_dir(UpstreamId::Test262)).unwrap();

        assert!(setup_upstreams(
            &fixture.paths,
            &upstreams,
            &[UpstreamId::Test262],
            SetupOptions {
                force: true,
                ..SetupOptions::default()
            },
        )
        .is_err());
        assert_eq!(fs::read_to_string(marker).unwrap(), "unchanged");
    }

    struct Fixture {
        directory: TempDir,
        source: TempDir,
        paths: ProjectPaths,
    }

    impl Fixture {
        fn new() -> Self {
            let directory = TempDir::new().unwrap();
            fs::write(directory.path().join("Cargo.toml"), "[workspace]\n").unwrap();
            let tool_root = directory.path().join("tools/test262");
            fs::create_dir_all(&tool_root).unwrap();
            let paths = ProjectPaths::from_tool_root(&tool_root).unwrap();

            let source = TempDir::new().unwrap();
            git(source.path(), ["init", "--quiet"]);
            git(source.path(), ["config", "user.name", "Test"]);
            git(source.path(), ["config", "user.email", "test@example.com"]);

            Self {
                directory,
                source,
                paths,
            }
        }

        fn commit(&self, contents: &str) -> Revision {
            fs::write(self.source.path().join("fixture.js"), contents).unwrap();
            git(self.source.path(), ["add", "fixture.js"]);
            git(self.source.path(), ["commit", "--quiet", "-m", contents]);
            let output = git(self.source.path(), ["rev-parse", "HEAD"]);
            Revision::new(String::from_utf8(output.stdout).unwrap().trim()).unwrap()
        }

        fn upstreams(&self, revision: Revision) -> Upstreams {
            let config = UpstreamConfig {
                url: self.source.path().to_string_lossy().into_owned(),
                revision,
            };
            Upstreams { test262: config }
        }
    }

    fn git<I, S>(path: &Path, arguments: I) -> Output
    where
        I: IntoIterator<Item = S>,
        S: AsRef<std::ffi::OsStr>,
    {
        let output = Command::new("git")
            .args(arguments)
            .current_dir(path)
            .output()
            .unwrap();
        assert!(
            output.status.success(),
            "Git failed: {}",
            String::from_utf8_lossy(&output.stderr)
        );
        output
    }
}
