use crate::util::{cargo::cargo_metadata, CargoEditResultExt};
use anyhow::{anyhow, Context, Error};
use cargo_edit::{find, get_latest_dependency, CrateName, Dependency, LocalManifest};
use std::{
    collections::HashMap,
    env,
    path::{Path, PathBuf},
};
use url::Url;

/// A collection of manifests.
struct Manifests(Vec<(LocalManifest, cargo_metadata::Package)>);

/// Helper function to check whether a `cargo_metadata::Dependency` is a version
/// dependency.
fn is_version_dep(dependency: &cargo_metadata::Dependency) -> bool {
    match dependency.source {
        // This is the criterion cargo uses (in `SourceId::from_url`) to decide whether a
        // dependency has the 'registry' kind.
        Some(ref s) => s.splitn(2, '+').next() == Some("registry"),
        _ => false,
    }
}

impl Manifests {
    /// Get all manifests in the workspace.
    async fn get_all(manifest_path: &Option<PathBuf>) -> Result<Self, Error> {
        let cur_dir = env::current_dir().context("failed to get current directory")?;

        let mut cmd = cargo_metadata::MetadataCommand::new();
        cmd.no_deps();
        if let Some(path) = manifest_path {
            cmd.manifest_path(path);
        }
        let result = cargo_metadata(cmd, &cur_dir).await?;

        result
            .packages
            .into_iter()
            .map(|package| {
                Ok((
                    LocalManifest::try_new(Path::new(&package.manifest_path))
                        .map_err_op("create cargo_edit::LocalManifest")?,
                    package,
                ))
            })
            .collect::<Result<Vec<_>, Error>>()
            .map(Manifests)
    }

    /// Get the manifest specified by the manifest path. Try to make an educated
    /// guess if no path is provided.
    async fn get_local_one(manifest_path: &Option<PathBuf>) -> Result<Self, Error> {
        let cur_dir = env::current_dir().context("failed to get current directory")?;

        let resolved_manifest_path: String = find(manifest_path)
            .map_err_op("invoke cargo_edit::find")?
            .to_string_lossy()
            .into();

        let manifest = LocalManifest::find(manifest_path)
            .map_err_op("invoke cargo_edit::LocalManifeat::find")?;

        let mut cmd = cargo_metadata::MetadataCommand::new();
        cmd.no_deps();
        if let Some(path) = manifest_path {
            cmd.manifest_path(path);
        }
        let result = cargo_metadata(cmd, &cur_dir).await?;

        let packages = result.packages;
        let package = packages
            .iter()
            .find(|p| p.manifest_path == resolved_manifest_path)
            // If we have successfully got metadata, but our manifest path does not correspond to a
            // package, we must have been called against a virtual manifest.
            .with_context(|| {
                "Found virtual manifest, but this command requires running against an actual \
                 package in this workspace. Try adding `--workspace`."
            })?;

        Ok(Manifests(vec![(manifest, package.to_owned())]))
    }

    /// Get the the combined set of dependencies to upgrade. If the user has
    /// specified per-dependency desired versions, extract those here.
    fn get_dependencies(
        &self,
        only_update: Vec<String>,
        exclude: Vec<String>,
    ) -> Result<DesiredUpgrades, Error> {
        // Map the names of user-specified dependencies to the (optionally) requested
        // version.
        let selected_dependencies = only_update
            .into_iter()
            .map(|name| -> Result<_, Error> {
                if let Some(dependency) = CrateName::new(&name)
                    .parse_as_version()
                    .map_err_op("parse the version of dependency")?
                {
                    Ok((
                        dependency.name.clone(),
                        dependency.version().map(String::from),
                    ))
                } else {
                    Ok((name, None))
                }
            })
            .collect::<Result<HashMap<_, _>, _>>()?;

        Ok(DesiredUpgrades(
            self.0
                .iter()
                .flat_map(|&(_, ref package)| package.dependencies.clone())
                .filter(is_version_dep)
                .filter(|dependency| !exclude.contains(&dependency.name))
                // Exclude renamed dependecies aswell
                .filter(|dependency| {
                    dependency
                        .rename
                        .as_ref()
                        .map_or(true, |rename| !exclude.contains(rename))
                })
                .filter_map(|dependency| {
                    let is_prerelease = dependency.req.to_string().contains('-');
                    if selected_dependencies.is_empty() {
                        // User hasn't asked for any specific dependencies to be upgraded,
                        // so upgrade all the dependencies.
                        let mut dep = Dependency::new(&dependency.name);
                        if let Some(rename) = dependency.rename {
                            dep = dep.set_rename(&rename);
                        }
                        Some((
                            dep,
                            UpgradeMetadata {
                                registry: dependency.registry,
                                version: None,
                                is_prerelease,
                            },
                        ))
                    } else {
                        // User has asked for specific dependencies. Check if this dependency
                        // was specified, populating the registry from the lockfile metadata.
                        match selected_dependencies.get(&dependency.name) {
                            Some(version) => Some((
                                Dependency::new(&dependency.name),
                                UpgradeMetadata {
                                    registry: dependency.registry,
                                    version: version.clone(),
                                    is_prerelease,
                                },
                            )),
                            None => None,
                        }
                    }
                })
                .collect(),
        ))
    }

    /// Upgrade the manifests on disk following the previously-determined
    /// upgrade schema.
    fn upgrade(
        self,
        upgraded_deps: &ActualUpgrades,
        dry_run: bool,
        skip_compatible: bool,
    ) -> Result<(), Error> {
        for (mut manifest, package) in self.0 {
            println!("{}:", package.name);

            for (dep, version) in &upgraded_deps.0 {
                let mut new_dep = Dependency::new(&dep.name).set_version(version);
                if let Some(rename) = dep.rename() {
                    new_dep = new_dep.set_rename(rename);
                }
                manifest
                    .upgrade(&new_dep, dry_run, skip_compatible)
                    .map_err_op("invoke cargo_edit::upgrade")?;
            }
        }

        Ok(())
    }
}

// Some metadata about the dependency
// we're trying to upgrade.
struct UpgradeMetadata {
    registry: Option<String>,
    // `Some` if the user has specified an explicit
    // version to upgrade to.
    version: Option<String>,
    is_prerelease: bool,
}

/// The set of dependencies to be upgraded, alongside the registries returned
/// from cargo metadata, and the desired versions, if specified by the user.
struct DesiredUpgrades(HashMap<Dependency, UpgradeMetadata>);

impl DesiredUpgrades {
    /// Transform the dependencies into their upgraded forms. If a version is
    /// specified, all dependencies will get that version.
    fn get_upgraded(
        self,
        allow_prerelease: bool,
        manifest_path: &Path,
    ) -> Result<ActualUpgrades, Error> {
        self.0
            .into_iter()
            .map(
                |(
                    dep,
                    UpgradeMetadata {
                        registry,
                        version,
                        is_prerelease,
                    },
                )| {
                    let name = dep.name.clone();

                    if let Some(v) = version {
                        Ok((dep, v))
                    } else {
                        let registry_url = match registry {
                            Some(x) => Some(
                                Url::parse(&x)
                                    .map_err(|err| anyhow!("invalid cargo config: {}", err))?,
                            ),
                            None => None,
                        };
                        let allow_prerelease = allow_prerelease || is_prerelease;
                        get_latest_dependency(
                            &dep.name,
                            allow_prerelease,
                            manifest_path,
                            &registry_url,
                        )
                        .map(|new_dep| {
                            (
                                dep,
                                new_dep
                                    .version()
                                    .expect("Invalid dependency type")
                                    .to_string(),
                            )
                        })
                        .map_err_op("invoke cargo_edit::get_latest_dependency")
                        .with_context(|| format!("failed to get new version of {}", name))
                    }
                },
            )
            .collect::<Result<_, _>>()
            .map(ActualUpgrades)
    }
}

/// The complete specification of the upgrades that will be performed. Map of
/// the dependency names to the new versions.
struct ActualUpgrades(HashMap<Dependency, String>);

/// `cargo upgrade`, from `cargo-edit`.
pub async fn upgrade_dep(crate_name: &str, workspace: bool) -> Result<(), Error> {
    let manifests = if workspace {
        Manifests::get_all(&None).await
    } else {
        Manifests::get_local_one(&None).await
    }
    .context("failed to fetch manifest for `cargo-edit`")?;

    let existing_dependencies =
        manifests.get_dependencies(Default::default(), Default::default())?;

    let upgraded_dependencies = existing_dependencies
        .get_upgraded(false, &find(&None).map_err_op("invoke cargo_edit::find")?)?;

    manifests
        .upgrade(&upgraded_dependencies, false, false)
        .with_context(|| format!("failed to upgrade {}", crate_name))
}
