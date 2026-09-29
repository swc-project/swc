use std::{
    collections::{hash_map::Entry, HashMap},
    env,
    path::{Path, PathBuf},
    process::Command,
};

use anyhow::{ensure, Context, Result};
use cargo_metadata::{semver::Version, DependencyKind};
use changesets::ChangeType;
use clap::{Parser, Subcommand};
use indexmap::IndexSet;
use petgraph::{prelude::DiGraphMap, Direction};

mod changelog;
mod changeset;
mod history;
mod notes;
mod process;

#[derive(Debug, Parser)]
struct CliArgs {
    #[clap(long, global = true)]
    pub dry_run: bool,

    #[clap(subcommand)]
    pub cmd: Cmd,
}

#[derive(Debug, Subcommand)]
enum Cmd {
    /// Bump Rust crates and record their release notes.
    Bump,
    /// Rebuild both changelogs, including historical changeset bodies.
    Changelog,
}

fn main() -> Result<()> {
    let CliArgs { dry_run, cmd } = CliArgs::parse();

    let workspace_dir = env::var("CARGO_WORKSPACE_DIR")
        .map(PathBuf::from)
        .context("CARGO_WORKSPACE_DIR is not set")?;

    env::set_current_dir(&workspace_dir).context("failed to enter workspace")?;

    match cmd {
        Cmd::Bump => {
            run_bump(&workspace_dir, dry_run)?;
        }
        Cmd::Changelog => {
            let pending = changeset::load(&workspace_dir)?;
            changelog::Changelogs::generate(&workspace_dir, &pending, None)?
                .write(&workspace_dir, dry_run)?;
        }
    }

    Ok(())
}

fn run_bump(workspace_dir: &Path, dry_run: bool) -> Result<()> {
    let pending = changeset::load(workspace_dir)?;
    let changeset: changesets::ChangeSet =
        pending.iter().map(|entry| entry.change.clone()).collect();

    if changeset.releases.is_empty() {
        eprintln!("No changeset found");
        return Ok(());
    }

    let (versions, graph) = get_data()?;
    let mut new_versions = VersionMap::new();

    let mut worker = Bump {
        versions: &versions,
        graph: &graph,
        new_versions: &mut new_versions,
    };

    for (pkg_name, release) in changeset.releases {
        let is_breaking = worker
            .is_breaking(pkg_name.as_str(), release.change_type())
            .with_context(|| format!("failed to check if package {pkg_name} is breaking"))?;

        worker
            .bump_crate(pkg_name.as_str(), release.change_type(), is_breaking)
            .with_context(|| format!("failed to bump package {pkg_name}"))?;
    }

    let core_version = new_versions
        .get("swc_core")
        .context("release does not bump swc_core")?
        .to_string();
    let tag = format!("swc_core@v{core_version}");
    let existing = process::output(Command::new("git").args(["tag", "--list", &tag]), None)?;
    ensure!(existing.is_empty(), "release tag {tag} already exists");

    // Render before version updates or consuming any files. Both calendars must
    // succeed so a failed generator cannot discard the source release notes.
    let changelogs = changelog::Changelogs::generate(workspace_dir, &pending, Some(&core_version))?;
    if !dry_run {
        changelogs.ensure_committed()?;
    }
    let mut new_versions = new_versions.into_iter().collect::<Vec<_>>();
    new_versions.sort_by(|a, b| a.0.cmp(&b.0));
    for (pkg_name, version) in new_versions {
        run_cargo_set_version(&pkg_name, &version, dry_run)
            .with_context(|| format!("failed to set version for {pkg_name}"))?;
    }
    changelogs.write(workspace_dir, dry_run)?;

    if !dry_run {
        for entry in &pending {
            let path = workspace_dir.join(&entry.path);
            // Do not consume edits made while the changelog was being rendered.
            ensure!(
                std::fs::read_to_string(&path)? == entry.content,
                "changeset {} changed during release; refusing to remove it",
                entry.path.display()
            );
        }
        for entry in &pending {
            std::fs::remove_file(workspace_dir.join(&entry.path))?;
        }
    }
    if let Err(error) = git_commit(&core_version, dry_run) {
        // A rejected commit must not make the pending notes disappear. Avoid
        // overwriting a concurrently recreated file while restoring our inputs.
        for entry in &pending {
            use std::io::Write;
            let path = workspace_dir.join(&entry.path);
            match std::fs::OpenOptions::new()
                .write(true)
                .create_new(true)
                .open(&path)
            {
                Ok(mut file) => file.write_all(entry.content.as_bytes())?,
                Err(error) if error.kind() == std::io::ErrorKind::AlreadyExists => {}
                Err(error) => return Err(error).context("failed to restore pending changeset"),
            }
        }
        return Err(error).context("failed to commit");
    }
    git_tag_core(&core_version, dry_run).context("failed to tag core")?;

    Ok(())
}

fn run_cargo_set_version(pkg_name: &str, version: &Version, dry_run: bool) -> Result<()> {
    let mut cmd = Command::new("cargo");
    cmd.arg("set-version")
        .arg("-p")
        .arg(pkg_name)
        .arg(version.to_string());

    eprintln!("Running {cmd:?}");

    if dry_run {
        return Ok(());
    }

    process::run(&mut cmd)?;

    Ok(())
}

fn git_commit(core_ver: &str, dry_run: bool) -> Result<()> {
    if dry_run {
        eprintln!("Would commit release swc_core@v{core_ver}");
        return Ok(());
    }
    process::run(Command::new("git").args(["add", "--update"]))?;
    process::run(Command::new("git").args(["add", "--", "CHANGELOG.md", "CHANGELOG-CORE.md"]))?;
    process::run(Command::new("git").args([
        "commit",
        "-m",
        &format!("chore: Publish crates with `swc_core` `v{core_ver}`"),
    ]))
}

fn git_tag_core(core_ver: &str, dry_run: bool) -> Result<()> {
    if dry_run {
        eprintln!("Would tag swc_core@v{core_ver}");
        return Ok(());
    }
    process::run(Command::new("git").args(["tag", &format!("swc_core@v{core_ver}")]))
}

struct Bump<'a> {
    /// Original versions
    versions: &'a VersionMap,
    /// Dependency graph
    graph: &'a InternedGraph,

    new_versions: &'a mut VersionMap,
}

impl Bump<'_> {
    fn is_breaking(&self, pkg_name: &str, change_type: Option<&ChangeType>) -> Result<bool> {
        let original_version = self
            .versions
            .get(pkg_name)
            .context(format!("failed to find original version for {pkg_name}"))?;

        Ok(match change_type {
            Some(ChangeType::Major) => true,
            Some(ChangeType::Minor) => original_version.major == 0,
            Some(ChangeType::Patch) => false,
            Some(ChangeType::Custom(label)) => {
                if label == "breaking" {
                    true
                } else {
                    panic!("unknown custom change type: {label}")
                }
            }
            None => false,
        })
    }

    fn bump_crate(
        &mut self,
        pkg_name: &str,
        change_type: Option<&ChangeType>,
        is_breaking: bool,
    ) -> Result<()> {
        eprintln!("Bumping crate: {pkg_name}");

        let Some(original_version) = self.versions.get(pkg_name) else {
            eprintln!("No original version found for {pkg_name}, skipping bump");
            return Ok(());
        };

        let mut new_version = original_version.clone();

        match change_type {
            Some(ChangeType::Patch) => {
                new_version.patch += 1;
            }
            Some(ChangeType::Minor) => {
                new_version.minor += 1;
                new_version.patch = 0;
            }
            Some(ChangeType::Major) => {
                new_version.major += 1;
                new_version.minor = 0;
                new_version.patch = 0;
            }
            Some(ChangeType::Custom(label)) => {
                if label == "breaking" {
                    if original_version.major == 0 {
                        new_version.minor += 1;
                        new_version.patch = 0;
                    } else {
                        new_version.major += 1;
                        new_version.minor = 0;
                        new_version.patch = 0;
                    }
                } else {
                    panic!("unknown custom change type: {label}")
                }
            }
            None => {
                if is_breaking {
                    if original_version.major == 0 {
                        new_version.minor += 1;
                        new_version.patch = 0;
                    } else {
                        new_version.major += 1;
                        new_version.minor = 0;
                        new_version.patch = 0;
                    }
                } else {
                    new_version.patch += 1;
                }
            }
        };

        match self.new_versions.entry(pkg_name.to_string()) {
            Entry::Vacant(v) => {
                v.insert(new_version);
            }
            Entry::Occupied(mut o) => {
                o.insert(new_version.max(o.get().clone()));
            }
        }

        if is_breaking {
            // Iterate over dependants

            let a = self.graph.node(pkg_name);
            for dep in self.graph.g.neighbors_directed(a, Direction::Incoming) {
                let dep_name = &*self.graph.ix[dep];
                eprintln!("Bumping dependant crate: {dep_name}");
                self.bump_crate(dep_name, None, true)?;
            }
        }

        Ok(())
    }
}

type VersionMap = HashMap<String, Version>;

#[derive(Debug, Default)]
struct InternedGraph {
    ix: IndexSet<String>,
    g: DiGraphMap<usize, ()>,
}

impl InternedGraph {
    fn add_node(&mut self, name: String) -> usize {
        self.ix.get_index_of(&name).unwrap_or_else(|| {
            let ix = self.ix.len();
            self.ix.insert_full(name);
            ix
        }) as _
    }

    fn node(&self, name: &str) -> usize {
        self.ix.get_index_of(name).unwrap_or_else(|| {
            panic!("unknown node: {name}");
        })
    }
}

fn get_data() -> Result<(VersionMap, InternedGraph)> {
    let md = cargo_metadata::MetadataCommand::new()
        .no_deps()
        .exec()
        .context("failed to run cargo metadata")?;

    let workspace_packages = md
        .workspace_packages()
        .into_iter()
        .filter(|p| p.publish != Some(vec![]))
        .map(|p| p.name.clone())
        .collect::<Vec<_>>();
    let mut graph = InternedGraph::default();
    let mut versions = VersionMap::new();

    for pkg in md.workspace_packages() {
        if pkg.publish == Some(vec![]) {
            continue;
        }

        versions.insert(pkg.name.clone(), pkg.version.clone());
    }

    for pkg in md.workspace_packages() {
        for dep in &pkg.dependencies {
            if dep.kind != DependencyKind::Normal {
                continue;
            }

            if workspace_packages.contains(&dep.name) {
                let from = graph.add_node(pkg.name.clone());
                let to = graph.add_node(dep.name.clone());

                if from == to {
                    continue;
                }

                graph.g.add_edge(from, to, ());
            }
        }
    }

    Ok((versions, graph))
}
