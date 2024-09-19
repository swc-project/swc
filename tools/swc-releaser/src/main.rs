use std::{
    collections::HashMap,
    env,
    path::{Path, PathBuf},
    process::Command,
};

use anyhow::{Context, Result};
use cargo_metadata::{semver::Version, DependencyKind};
use changesets::ChangeType;
use clap::{Parser, Subcommand};
use indexmap::IndexSet;
use petgraph::prelude::DiGraphMap;

#[derive(Debug, Parser)]
struct CliArs {
    #[clap(long)]
    pub dry_run: bool,

    #[clap(subcommand)]
    pub cmd: Cmd,
}

#[derive(Debug, Subcommand)]
enum Cmd {
    Bump,
}

fn main() -> Result<()> {
    let CliArs { dry_run, cmd } = CliArs::parse();

    let workspace_dir = env::var("CARGO_WORKSPACE_DIR")
        .map(PathBuf::from)
        .context("CARGO_WORKSPACE_DIR is not set")?;

    match cmd {
        Cmd::Bump => {
            run_bump(&workspace_dir, dry_run)?;
        }
    }

    Ok(())
}

fn run_bump(workspace_dir: &Path, dry_run: bool) -> Result<()> {
    let changeset_dir = workspace_dir.join(".changeset");

    let changeset = changesets::ChangeSet::from_directory(&changeset_dir)
        .context("failed to load changeset")?;

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
            .with_context(|| format!("failed to check if package {} is breaking", pkg_name))?;

        worker
            .bump_crate(
                pkg_name.as_str(),
                release.change_type(),
                is_breaking,
                dry_run,
            )
            .with_context(|| format!("failed to bump package {}", pkg_name))?;
    }

    {
        eprintln!("Removing changeset files... ");
        if !dry_run {
            std::fs::remove_dir_all(&changeset_dir).context("failed to remove changeset files")?;
        }
    }

    {
        // Update changelog

        update_changelog().with_context(|| "failed to update changelog")?;
    }

    commit(dry_run).context("failed to commit")?;

    Ok(())
}

fn get_swc_core_version() -> Result<String> {
    let md = cargo_metadata::MetadataCommand::new()
        .no_deps()
        .exec()
        .expect("failed to run cargo metadata");

    md.packages
        .iter()
        .find(|p| p.name == "swc_core")
        .map(|p| p.version.to_string())
        .context("failed to find swc_core")
}

fn commit(dry_run: bool) -> Result<()> {
    let core_ver = get_swc_core_version()?;

    let mut cmd = Command::new("git");
    cmd.arg("commit").arg("-am").arg(format!(
        "chore: Publish crates with `swc_core` `v{}`",
        core_ver
    ));

    eprintln!("Running {:?}", cmd);

    if dry_run {
        return Ok(());
    }

    cmd.status().context("failed to run git commit")?;

    Ok(())
}

struct Bump<'a> {
    /// Original versions
    versions: &'a VersionMap,
    /// Dependency graph
    graph: &'a InternedGraph,

    new_versions: &'a mut VersionMap,
}

impl<'a> Bump<'a> {
    fn is_breaking(&self, pkg_name: &str, change_type: Option<&ChangeType>) -> Result<bool> {
        let original_version = self
            .versions
            .get(pkg_name)
            .context(format!("failed to find original version for {}", pkg_name))?;

        Ok(match change_type {
            Some(ChangeType::Major) => true,
            Some(ChangeType::Minor) => original_version.major == 0,
            Some(ChangeType::Patch) => false,
            Some(ChangeType::Custom(label)) => {
                if label == "breaking" {
                    true
                } else {
                    panic!("unknown custom change type: {}", label)
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
        dry_run: bool,
    ) -> Result<()> {
        let original_version = self
            .versions
            .get(pkg_name)
            .context(format!("failed to find original version for {}", pkg_name))?;

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
                    panic!("unknown custom change type: {}", label)
                }
            }
            None => {
                new_version.patch += 1;
            }
        };

        let new_version = original_version.clone().max(new_version);

        self.new_versions.insert(pkg_name.to_string(), new_version);

        Ok(())
    }
}

fn update_changelog() -> Result<()> {
    // Run `yarn changelog`
    let mut cmd = Command::new("yarn");
    cmd.arg("changelog");

    eprintln!("Running {:?}", cmd);

    cmd.status().context("failed to run yarn changelog")?;

    Ok(())
}

type VersionMap = HashMap<String, Version>;

#[derive(Debug, Default)]
struct InternedGraph {
    ix: IndexSet<String>,
    g: DiGraphMap<usize, ()>,
}

impl InternedGraph {
    fn add_node(&mut self, name: String) -> usize {
        let id = self.ix.len();
        self.ix.insert(name);
        self.g.add_node(id);
        id
    }

    fn node(&self, name: &str) -> usize {
        self.ix.get_index_of(name).expect("unknown node")
    }
}

fn get_data() -> Result<(VersionMap, InternedGraph)> {
    let md = cargo_metadata::MetadataCommand::new()
        .exec()
        .expect("failed to run cargo metadata");

    let workspace_packages = md
        .workspace_packages()
        .into_iter()
        .map(|p| p.name.clone())
        .collect::<Vec<_>>();
    let mut graph = InternedGraph::default();
    let mut versions = VersionMap::new();

    for pkg in md.workspace_packages() {
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

                graph.g.add_edge(from, to, ());
            }
        }
    }

    Ok((versions, graph))
}
