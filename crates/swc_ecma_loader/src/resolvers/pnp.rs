//! Yarn Plug'n'Play (PnP) resolver.
//!
//! This resolver reads the JSON variant of the PnP manifest
//! (`.pnp.data.json`), produced by Yarn when `pnpEnableInlining: false` is set
//! in `.yarnrc.yml`. We do not execute `.pnp.cjs`; running the JS resolver in
//! a Rust host would require an embedded JS runtime, so this implementation
//! intentionally targets only the data-only path.
//!
//! Only the bits needed for module resolution are parsed:
//!   - `packageRegistryData`: location + dependencies for each package.
//!   - `dependencyTreeRoots`: the workspace roots used as a fallback when the
//!     calling file is not inside any registered package.
//!
//! See the upstream issue for design notes:
//!   https://github.com/swc-project/swc/issues/3247
//!
//! This resolver is opt-in (feature `pnp`) and is meant to be composed with
//! the existing `NodeModulesResolver` so that callers can pick PnP first and
//! fall back to standard node-modules resolution.

use std::{
    fs,
    path::{Path, PathBuf},
    sync::Arc,
};

use anyhow::{anyhow, bail, Context, Error};
use rustc_hash::FxHashMap;
use serde::Deserialize;
use swc_common::FileName;

use crate::{
    resolve::{Resolution, Resolve},
    NODE_BUILTINS,
};

/// Filename of the data-only PnP manifest.
const PNP_DATA_FILENAME: &str = ".pnp.data.json";
/// Filename of the JS PnP manifest. We only use it as a marker that PnP is in
/// use; the actual data is read from [`PNP_DATA_FILENAME`].
const PNP_CJS_FILENAME: &str = ".pnp.cjs";

/// Identifier for a package inside the PnP registry: `(name, reference)`.
type PackageIdent = (String, String);

#[derive(Debug, Deserialize)]
struct RawDependencyTreeRoot {
    name: String,
    reference: String,
}

/// Raw JSON shape of `.pnp.data.json`. We only deserialize the keys we
/// actually use; unknown keys are ignored by serde defaults.
#[derive(Debug, Deserialize)]
struct RawPnpData {
    #[serde(default, rename = "dependencyTreeRoots")]
    dependency_tree_roots: Vec<RawDependencyTreeRoot>,
    /// Raw list of `[packageName, [[reference, packageInfo], ...]]` tuples.
    /// `packageName` may be `null` for the top-level workspace entry.
    #[serde(default, rename = "packageRegistryData")]
    package_registry_data: Vec<(Option<String>, Vec<(Option<String>, RawPackageInfo)>)>,
}

#[derive(Debug, Deserialize)]
struct RawPackageInfo {
    /// Path to the package contents, relative to the manifest directory.
    #[serde(rename = "packageLocation")]
    package_location: String,
    /// `[name, reference]` pairs. `reference` may be `null` when the
    /// dependency is missing/peer-not-provided in the install state.
    #[serde(default, rename = "packageDependencies")]
    package_dependencies: Vec<(String, Option<serde_json::Value>)>,
}

#[derive(Debug)]
struct PackageInfo {
    /// Absolute path to the package directory.
    location: PathBuf,
    /// Map from a dependency name (as it appears in `import` / `require`) to
    /// the resolved `(name, reference)` pair in the registry.
    dependencies: FxHashMap<String, PackageIdent>,
}

/// Parsed PnP manifest, kept as the smallest in-memory shape needed for
/// resolution.
#[derive(Debug)]
struct PnpManifest {
    /// Directory containing `.pnp.data.json`; used to resolve
    /// `packageLocation` entries.
    manifest_dir: PathBuf,
    /// Registered packages, keyed by `(name, reference)`.
    packages: FxHashMap<PackageIdent, PackageInfo>,
    /// Workspace roots, used as a fallback when the requesting file is not
    /// inside any registered package (e.g. an external script outside the
    /// workspace).
    roots: Vec<PackageIdent>,
}

impl PnpManifest {
    fn from_path(path: &Path) -> Result<Self, Error> {
        let bytes = fs::read(path)
            .with_context(|| format!("failed to read pnp manifest at {}", path.display()))?;
        let raw: RawPnpData = serde_json::from_slice(&bytes)
            .with_context(|| format!("failed to parse pnp manifest at {}", path.display()))?;

        let manifest_dir = path
            .parent()
            .ok_or_else(|| anyhow!("pnp manifest path has no parent directory"))?
            .to_path_buf();

        let mut packages: FxHashMap<PackageIdent, PackageInfo> = FxHashMap::default();
        for (raw_name, refs) in raw.package_registry_data {
            // The PnP format uses `null` as the package name for the
            // top-level workspace entry; we skip nameless variants since the
            // workspace itself is still reachable via `dependencyTreeRoots`.
            let Some(name) = raw_name else { continue };
            for (raw_ref, info) in refs {
                let Some(reference) = raw_ref else { continue };

                let location = normalize_location(&manifest_dir, &info.package_location);

                let mut deps: FxHashMap<String, PackageIdent> = FxHashMap::default();
                for (dep_name, dep_ref) in info.package_dependencies {
                    // `dep_ref` is either a string reference, or null (peer
                    // dependency not provided). We skip nulls because we
                    // cannot resolve them anyway.
                    let dep_ref = match dep_ref {
                        Some(serde_json::Value::String(s)) => s,
                        _ => continue,
                    };
                    deps.insert(dep_name.clone(), (dep_name, dep_ref));
                }

                packages.insert(
                    (name.clone(), reference),
                    PackageInfo {
                        location,
                        dependencies: deps,
                    },
                );
            }
        }

        let roots = raw
            .dependency_tree_roots
            .into_iter()
            .map(|r| (r.name, r.reference))
            .collect();

        Ok(Self {
            manifest_dir,
            packages,
            roots,
        })
    }

    /// Find the package that owns `file_path` by walking parent directories
    /// and matching against `packageLocation` values.
    fn owning_package(&self, file_path: &Path) -> Option<&PackageInfo> {
        // Walk parents, longest path first, to prefer nested packages over
        // their ancestors.
        let mut best: Option<(&PackageIdent, &PackageInfo, usize)> = None;
        for (ident, info) in &self.packages {
            if file_path.starts_with(&info.location) {
                let depth = info.location.components().count();
                match best {
                    Some((_, _, d)) if d >= depth => {}
                    _ => best = Some((ident, info, depth)),
                }
            }
        }
        best.map(|(_, info, _)| info)
    }
}

/// Strip an optional bare-specifier scope/name into `(module, subpath)`.
///
/// `"@scope/name/sub/path"` -> `("@scope/name", Some("sub/path"))`
/// `"name/sub"`             -> `("name", Some("sub"))`
/// `"name"`                 -> `("name", None)`
fn split_specifier(specifier: &str) -> (&str, Option<&str>) {
    if let Some(rest) = specifier.strip_prefix('@') {
        // Scoped package: `@scope/name[/subpath]`.
        let mut parts = rest.splitn(3, '/');
        let scope = parts.next().unwrap_or("");
        let name = parts.next().unwrap_or("");
        let sub = parts.next();
        // `len = 1 (@) + scope + 1 (/) + name`
        let head_len = 1 + scope.len() + 1 + name.len();
        if head_len > specifier.len() {
            return (specifier, None);
        }
        let head = &specifier[..head_len];
        (head, sub)
    } else {
        match specifier.split_once('/') {
            Some((name, sub)) => (name, Some(sub)),
            None => (specifier, None),
        }
    }
}

/// Resolve the `packageLocation` from the manifest. Yarn writes them as
/// either `"./relative/path/"` or `"/abs/path/"`; we normalise both to an
/// absolute, trailing-slash-free path.
fn normalize_location(manifest_dir: &Path, raw: &str) -> PathBuf {
    let stripped = raw.trim_end_matches('/');
    let candidate = Path::new(stripped);
    let joined = if candidate.is_absolute() {
        candidate.to_path_buf()
    } else {
        manifest_dir.join(stripped)
    };
    // Best-effort canonicalisation. If it fails (e.g. the package directory
    // does not exist on disk), fall back to the path-cleaned form so the
    // caller still gets a usable absolute path.
    joined
        .canonicalize()
        .unwrap_or_else(|_| clean_path(&joined))
}

/// Tiny path cleaner that resolves `.` / `..` components without touching the
/// filesystem. We avoid the `path-clean` crate here because the `pnp` feature
/// stays small and does not require the `node` feature's deps.
fn clean_path(path: &Path) -> PathBuf {
    let mut out = PathBuf::new();
    for c in path.components() {
        match c {
            std::path::Component::ParentDir => {
                out.pop();
            }
            std::path::Component::CurDir => {}
            other => out.push(other.as_os_str()),
        }
    }
    out
}

/// Yarn PnP-aware resolver.
///
/// This is intentionally a thin layer: it answers "given a base file and a
/// bare specifier, which file on disk does PnP point to?". Relative imports
/// (`./foo`) and absolute paths are not handled here; callers should compose
/// with [`crate::resolvers::node::NodeModulesResolver`] (or another resolver)
/// for non-PnP cases.
#[derive(Debug, Clone)]
pub struct PnpResolver {
    inner: Arc<PnpManifest>,
}

impl PnpResolver {
    /// Construct a resolver from an explicit manifest path. The path may
    /// point to either `.pnp.cjs` or `.pnp.data.json`; in both cases the
    /// JSON sibling is loaded.
    pub fn new(manifest_path: &Path) -> Result<Self, Error> {
        let json_path = if manifest_path
            .file_name()
            .and_then(|n| n.to_str())
            .map(|n| n == PNP_CJS_FILENAME)
            .unwrap_or(false)
        {
            manifest_path
                .parent()
                .map(|p| p.join(PNP_DATA_FILENAME))
                .ok_or_else(|| anyhow!("pnp manifest path has no parent directory"))?
        } else {
            manifest_path.to_path_buf()
        };

        if !json_path.is_file() {
            bail!(
                "pnp data manifest not found at {}; ensure `pnpEnableInlining: false` is set in \
                 .yarnrc.yml so Yarn writes the JSON form",
                json_path.display()
            );
        }

        let manifest = PnpManifest::from_path(&json_path)?;
        Ok(Self {
            inner: Arc::new(manifest),
        })
    }

    /// Discover a PnP manifest by walking up from `start_dir` looking for
    /// `.pnp.cjs` or `.pnp.data.json`. Returns `Ok(None)` when no manifest is
    /// found, distinguishing "not a PnP project" from real errors.
    pub fn discover(start_dir: &Path) -> Result<Option<Self>, Error> {
        let mut cur = Some(start_dir);
        while let Some(dir) = cur {
            let json = dir.join(PNP_DATA_FILENAME);
            if json.is_file() {
                return Self::new(&json).map(Some);
            }
            // Even when only `.pnp.cjs` exists we treat it as a hint, but we
            // still need the JSON variant to resolve. We surface the error so
            // users know to enable JSON output.
            let cjs = dir.join(PNP_CJS_FILENAME);
            if cjs.is_file() {
                return Self::new(&cjs).map(Some);
            }
            cur = dir.parent();
        }
        Ok(None)
    }

    fn manifest_dir(&self) -> &Path {
        &self.inner.manifest_dir
    }

    /// Return the package that contains `file_path`, falling back to the
    /// first dependency-tree root when the file is outside any registered
    /// package (typical for ad-hoc scripts run inside the workspace).
    fn locate_owner(&self, file_path: &Path) -> Option<&PackageInfo> {
        if let Some(owner) = self.inner.owning_package(file_path) {
            return Some(owner);
        }
        // Fallback: pick any root that contains the file, then any root.
        for ident in &self.inner.roots {
            if let Some(info) = self.inner.packages.get(ident) {
                if file_path.starts_with(&info.location) {
                    return Some(info);
                }
            }
        }
        self.inner
            .roots
            .first()
            .and_then(|ident| self.inner.packages.get(ident))
    }

    /// Resolve a bare specifier against `from_file`. Returns `Ok(None)` if
    /// the specifier is not handled by PnP (relative path, absolute path,
    /// node builtin, or unknown dependency); the caller should then defer to
    /// a fallback resolver.
    pub fn resolve_bare(
        &self,
        from_file: &Path,
        specifier: &str,
    ) -> Result<Option<PathBuf>, Error> {
        // Anything that is not a bare specifier is out of scope for PnP.
        if specifier.is_empty()
            || specifier.starts_with('.')
            || specifier.starts_with('/')
            || NODE_BUILTINS.contains(&specifier)
        {
            return Ok(None);
        }

        let (module_name, subpath) = split_specifier(specifier);
        if module_name.is_empty() {
            return Ok(None);
        }

        let owner = match self.locate_owner(from_file) {
            Some(o) => o,
            None => return Ok(None),
        };

        let dep_ident = match owner.dependencies.get(module_name) {
            Some(ident) => ident,
            None => return Ok(None),
        };

        let dep_pkg = match self.inner.packages.get(dep_ident) {
            Some(p) => p,
            None => return Ok(None),
        };

        // We deliberately stop at the package directory + optional subpath
        // and let the caller's existing file-extension resolution kick in.
        // Doing the full `package.json["main"]` / `exports` walk here would
        // duplicate `NodeModulesResolver` logic; tests treat the returned
        // path as "the directory PnP points at".
        let target = match subpath {
            Some(sub) => dep_pkg.location.join(sub),
            None => dep_pkg.location.clone(),
        };
        Ok(Some(target))
    }
}

impl Resolve for PnpResolver {
    fn resolve(&self, base: &FileName, module_specifier: &str) -> Result<Resolution, Error> {
        let base_path = match base {
            FileName::Real(p) => p.clone(),
            // PnP needs a real, on-disk anchor to know which package the
            // import is coming from. For synthetic file names we fall back to
            // the manifest directory so workspace roots are still reachable.
            _ => self.manifest_dir().to_path_buf(),
        };

        match self.resolve_bare(&base_path, module_specifier)? {
            Some(path) => Ok(Resolution {
                filename: FileName::Real(path),
                slug: None,
            }),
            None => bail!(
                "pnp could not resolve `{}` from `{}`",
                module_specifier,
                base_path.display()
            ),
        }
    }
}

#[cfg(test)]
mod tests {
    use std::fs;

    use tempfile::tempdir;

    use super::*;

    fn write_manifest(dir: &Path, contents: &str) -> PathBuf {
        let path = dir.join(PNP_DATA_FILENAME);
        fs::write(&path, contents).unwrap();
        path
    }

    #[test]
    fn split_specifier_handles_scoped_and_plain() {
        assert_eq!(split_specifier("react"), ("react", None));
        assert_eq!(
            split_specifier("react/jsx-runtime"),
            ("react", Some("jsx-runtime"))
        );
        assert_eq!(split_specifier("@swc/core"), ("@swc/core", None));
        assert_eq!(
            split_specifier("@swc/core/lib/index.js"),
            ("@swc/core", Some("lib/index.js"))
        );
    }

    #[test]
    fn discover_finds_manifest_in_parent() {
        let dir = tempdir().unwrap();
        let pkg_dir = dir.path().join("workspace/packages/app");
        fs::create_dir_all(&pkg_dir).unwrap();
        write_manifest(
            dir.path(),
            r#"{"dependencyTreeRoots":[],"packageRegistryData":[]}"#,
        );

        let resolver = PnpResolver::discover(&pkg_dir).unwrap();
        assert!(resolver.is_some());
    }

    #[test]
    fn discover_returns_none_when_no_manifest() {
        let dir = tempdir().unwrap();
        let resolver = PnpResolver::discover(dir.path()).unwrap();
        assert!(resolver.is_none());
    }

    #[test]
    fn resolve_bare_returns_dependency_location() {
        let dir = tempdir().unwrap();
        // Lay out a fake workspace with one package and one dependency.
        let app_dir = dir.path().join("packages/app");
        let dep_dir = dir.path().join(".yarn/cache/left-pad");
        fs::create_dir_all(&app_dir).unwrap();
        fs::create_dir_all(&dep_dir).unwrap();

        let manifest = r#"{
          "dependencyTreeRoots": [{"name": "app", "reference": "workspace:packages/app"}],
          "packageRegistryData": [
            ["app", [["workspace:packages/app", {
              "packageLocation": "./packages/app/",
              "packageDependencies": [["left-pad", "npm:1.3.0"]],
              "linkType": "SOFT"
            }]]],
            ["left-pad", [["npm:1.3.0", {
              "packageLocation": "./.yarn/cache/left-pad/",
              "packageDependencies": [],
              "linkType": "HARD"
            }]]]
          ]
        }"#;
        write_manifest(dir.path(), manifest);

        let resolver = PnpResolver::discover(dir.path()).unwrap().unwrap();

        let from = app_dir.join("src/index.ts");
        let resolved = resolver.resolve_bare(&from, "left-pad").unwrap().unwrap();
        // `canonicalize` is applied during manifest load, so compare against
        // the canonicalised dep dir to stay platform-portable.
        let expected = dep_dir.canonicalize().unwrap();
        assert_eq!(resolved, expected);

        // Subpath imports preserve the trailing path segments.
        let resolved_sub = resolver
            .resolve_bare(&from, "left-pad/lib/index.js")
            .unwrap()
            .unwrap();
        assert_eq!(resolved_sub, expected.join("lib/index.js"));
    }

    #[test]
    fn resolve_bare_skips_relative_and_builtin() {
        let dir = tempdir().unwrap();
        write_manifest(
            dir.path(),
            r#"{"dependencyTreeRoots":[],"packageRegistryData":[]}"#,
        );
        let resolver = PnpResolver::discover(dir.path()).unwrap().unwrap();
        let from = dir.path().join("src/index.ts");

        assert!(resolver.resolve_bare(&from, "./local").unwrap().is_none());
        assert!(resolver.resolve_bare(&from, "/abs/path").unwrap().is_none());
        assert!(resolver.resolve_bare(&from, "fs").unwrap().is_none());
        assert!(resolver.resolve_bare(&from, "events").unwrap().is_none());
    }

    #[test]
    fn resolve_bare_unknown_module_returns_none() {
        let dir = tempdir().unwrap();
        let app_dir = dir.path().join("packages/app");
        fs::create_dir_all(&app_dir).unwrap();
        let manifest = r#"{
          "dependencyTreeRoots": [{"name": "app", "reference": "workspace:packages/app"}],
          "packageRegistryData": [
            ["app", [["workspace:packages/app", {
              "packageLocation": "./packages/app/",
              "packageDependencies": [],
              "linkType": "SOFT"
            }]]]
          ]
        }"#;
        write_manifest(dir.path(), manifest);

        let resolver = PnpResolver::discover(dir.path()).unwrap().unwrap();
        let from = app_dir.join("src/index.ts");
        assert!(resolver.resolve_bare(&from, "not-a-dep").unwrap().is_none());
    }
}
