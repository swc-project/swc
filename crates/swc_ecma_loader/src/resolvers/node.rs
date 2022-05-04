//! Faster version of node-resolve.
//!
//! See: https://github.com/goto-bus-stop/node-resolve

use std::{
    env::current_dir,
    fs::File,
    io::BufReader,
    path::{Component, Path, PathBuf},
};

use anyhow::{bail, Context, Error};
use dashmap::{DashMap, DashSet};
#[cfg(windows)]
use normpath::BasePath;
use once_cell::sync::Lazy;
use path_clean::PathClean;
use pathdiff::diff_paths;
use serde::Deserialize;
use swc_common::{collections::AHashMap, FileName};
use tracing::debug;

use crate::{resolve::Resolve, TargetEnv, NODE_BUILTINS};

static PACKAGE: &str = "package.json";

/// Map of cached `browser` fields from deserialized package.json
/// used to determine if we need to map to alternative paths when
/// bundling for the browser runtime environment. The key is the
/// directory containing the package.json file which is important
/// to ensure we only apply these `browser` rules to modules in
/// the owning package.
static BROWSER_CACHE: Lazy<DashMap<PathBuf, BrowserCache, ahash::RandomState>> =
    Lazy::new(Default::default);

#[derive(Debug, Default)]
struct BrowserCache {
    rewrites: DashMap<PathBuf, PathBuf, ahash::RandomState>,
    ignores: DashSet<PathBuf, ahash::RandomState>,
    module_rewrites: DashMap<String, PathBuf, ahash::RandomState>,
    module_ignores: DashSet<String, ahash::RandomState>,
}

/// Helper to find the nearest `package.json` file to get
/// the base directory for a package.
fn find_package_root(path: &Path) -> Option<PathBuf> {
    let mut parent = path.parent();
    while let Some(p) = parent {
        let pkg = p.join(PACKAGE);
        if pkg.is_file() {
            return Some(p.to_path_buf());
        }
        parent = p.parent();
    }
    None
}

pub fn to_absolute_path(path: &Path) -> Result<PathBuf, Error> {
    let absolute_path = if path.is_absolute() {
        path.to_path_buf()
    } else {
        current_dir()?.join(path)
    }
    .clean();

    Ok(absolute_path)
}

pub(crate) fn is_core_module(s: &str) -> bool {
    NODE_BUILTINS.contains(&s)
}

#[derive(Deserialize)]
struct PackageJson {
    #[serde(default)]
    main: Option<String>,
    #[serde(default)]
    browser: Option<Browser>,
    #[serde(default)]
    module: Option<String>,
}

#[derive(Deserialize)]
#[serde(untagged)]
enum Browser {
    Str(String),
    Obj(AHashMap<String, StringOrBool>),
}

#[derive(Deserialize, Clone)]
#[serde(untagged)]
enum StringOrBool {
    Str(String),
    Bool(bool),
}

#[derive(Debug, Default)]
pub struct NodeModulesResolver {
    target_env: TargetEnv,
    alias: AHashMap<String, String>,
    // if true do not resolve symlink
    preserve_symlinks: bool,
}

static EXTENSIONS: &[&str] = &["ts", "tsx", "js", "jsx", "json", "node"];

impl NodeModulesResolver {
    /// Create a node modules resolver for the target runtime environment.
    pub fn new(
        target_env: TargetEnv,
        alias: AHashMap<String, String>,
        preserve_symlinks: bool,
    ) -> Self {
        Self {
            target_env,
            alias,
            preserve_symlinks,
        }
    }

    fn wrap(&self, path: Option<PathBuf>) -> Result<FileName, Error> {
        if let Some(path) = path {
            if self.preserve_symlinks {
                return Ok(FileName::Real(path.clean()));
            } else {
                return Ok(FileName::Real(path.canonicalize()?));
            }
        }
        bail!("index not found")
    }

    /// Resolve a path as a file. If `path` refers to a file, it is returned;
    /// otherwise the `path` + each extension is tried.
    fn resolve_as_file(&self, path: &Path) -> Result<Option<PathBuf>, Error> {
        let try_exact = path.extension().is_some();
        if try_exact {
            if path.is_file() {
                return Ok(Some(path.to_path_buf()));
            }
        } else {
            // We try `.js` first.
            let mut path = path.to_path_buf();
            path.set_extension("js");
            if path.is_file() {
                return Ok(Some(path));
            }
        }

        // Try exact file after checking .js, for performance
        if !try_exact && path.is_file() {
            return Ok(Some(path.to_path_buf()));
        }

        if let Some(name) = path.file_name() {
            let mut ext_path = path.to_path_buf();
            let name = name.to_string_lossy();
            for ext in EXTENSIONS {
                ext_path.set_file_name(format!("{}.{}", name, ext));
                if ext_path.is_file() {
                    return Ok(Some(ext_path));
                }
            }

            // TypeScript-specific behavior: if the extension is ".js" or ".jsx",
            // try replacing it with ".ts" or ".tsx".
            ext_path.set_file_name(name.into_owned());
            let old_ext = path.extension().and_then(|ext| ext.to_str());

            if let Some(old_ext) = old_ext {
                let extensions: &[&str] = match old_ext {
                    // Note that the official compiler code always tries ".ts" before
                    // ".tsx" even if the original extension was ".jsx".
                    "js" => &["ts", "tsx"],
                    "jsx" => &["ts", "tsx"],
                    "mjs" => &["mts"],
                    "cjs" => &["cts"],
                    _ => &[],
                };

                for ext in extensions {
                    ext_path.set_extension(ext);

                    if ext_path.is_file() {
                        return Ok(Some(ext_path));
                    }
                }
            }
        }

        bail!("file not found: {}", path.display())
    }

    /// Resolve a path as a directory, using the "main" key from a package.json
    /// file if it exists, or resolving to the index.EXT file if it exists.
    fn resolve_as_directory(&self, path: &Path) -> Result<Option<PathBuf>, Error> {
        let pkg_path = path.join(PACKAGE);
        if pkg_path.is_file() {
            if let Some(main) = self.resolve_package_entry(path, &pkg_path)? {
                return Ok(Some(main));
            }
        }

        // Try to resolve to an index file.
        for ext in EXTENSIONS {
            let ext_path = path.join(format!("index.{}", ext));
            if ext_path.is_file() {
                return Ok(Some(ext_path));
            }
        }
        Ok(None)
    }

    /// Resolve using the package.json "main" or "browser" keys.
    fn resolve_package_entry(
        &self,
        pkg_dir: &Path,
        pkg_path: &Path,
    ) -> Result<Option<PathBuf>, Error> {
        let file = File::open(pkg_path)?;
        let reader = BufReader::new(file);
        let pkg: PackageJson = serde_json::from_reader(reader)
            .context(format!("failed to deserialize {}", pkg_path.display()))?;

        let main_fields = match self.target_env {
            TargetEnv::Node => {
                vec![pkg.module.as_ref(), pkg.main.as_ref()]
            }
            TargetEnv::Browser => {
                if let Some(browser) = &pkg.browser {
                    match browser {
                        Browser::Str(path) => {
                            vec![Some(path), pkg.module.as_ref(), pkg.main.as_ref()]
                        }
                        Browser::Obj(map) => {
                            let bucket = BROWSER_CACHE.entry(pkg_dir.to_path_buf()).or_default();

                            for (k, v) in map {
                                let target_key = Path::new(k);
                                let mut components = target_key.components();

                                // Relative file paths are sources for this package
                                let source = if let Some(Component::CurDir) = components.next() {
                                    let path = pkg_dir.join(k);
                                    if let Ok(file) = self
                                        .resolve_as_file(&path)
                                        .or_else(|_| self.resolve_as_directory(&path))
                                    {
                                        file
                                    } else {
                                        None
                                    }
                                } else {
                                    None
                                };

                                match v {
                                    StringOrBool::Str(dest) => {
                                        let path = pkg_dir.join(dest);
                                        let file = self
                                            .resolve_as_file(&path)
                                            .or_else(|_| self.resolve_as_directory(&path))?;
                                        if let Some(file) = file {
                                            let target = file.clean();

                                            if let Some(source) = source {
                                                bucket.rewrites.insert(source, target);
                                            } else {
                                                bucket.module_rewrites.insert(k.clone(), target);
                                            }
                                        }
                                    }
                                    StringOrBool::Bool(flag) => {
                                        // If somebody set boolean `true` which is an
                                        // invalid value we will just ignore it
                                        if !flag {
                                            if let Some(source) = source {
                                                bucket.ignores.insert(source);
                                            } else {
                                                bucket.module_ignores.insert(k.clone());
                                            }
                                        }
                                    }
                                }
                            }
                            vec![pkg.module.as_ref(), pkg.main.as_ref()]
                        }
                    }
                } else {
                    vec![pkg.module.as_ref(), pkg.main.as_ref()]
                }
            }
        };

        if let Some(Some(target)) = main_fields.iter().find(|x| x.is_some()) {
            let path = pkg_dir.join(target);
            return self
                .resolve_as_file(&path)
                .or_else(|_| self.resolve_as_directory(&path));
        }

        Ok(None)
    }

    /// Resolve by walking up node_modules folders.
    fn resolve_node_modules(
        &self,
        base_dir: &Path,
        target: &str,
    ) -> Result<Option<PathBuf>, Error> {
        let absolute_path = to_absolute_path(base_dir)?;
        let mut path = Some(&*absolute_path);
        while let Some(dir) = path {
            let node_modules = dir.join("node_modules");
            if node_modules.is_dir() {
                let path = node_modules.join(target);
                if let Some(result) = self
                    .resolve_as_file(&path)
                    .ok()
                    .or_else(|| self.resolve_as_directory(&path).ok())
                    .flatten()
                {
                    return Ok(Some(result));
                }
            }
            path = dir.parent();
        }

        Ok(None)
    }
}

impl Resolve for NodeModulesResolver {
    fn resolve(&self, base: &FileName, target: &str) -> Result<FileName, Error> {
        debug!(
            "Resolve {} from {:#?} for {:#?}",
            target, base, self.target_env
        );

        let base = match base {
            FileName::Real(v) => v,
            _ => bail!("node-resolver supports only files"),
        };

        let base_dir = if base.is_file() {
            let cwd = &Path::new(".");
            base.parent().unwrap_or(cwd)
        } else {
            base
        };

        // Handle module references for the `browser` package config
        // before we map aliases.
        if let TargetEnv::Browser = self.target_env {
            if let Some(pkg_base) = find_package_root(base) {
                if let Some(item) = BROWSER_CACHE.get(&pkg_base) {
                    let value = item.value();
                    if value.module_ignores.contains(target) {
                        return Ok(FileName::Custom(target.into()));
                    }
                    if let Some(rewrite) = value.module_rewrites.get(target) {
                        return self.wrap(Some(rewrite.to_path_buf()));
                    }
                }
            }
        }

        // Handle builtin modules for nodejs
        if let TargetEnv::Node = self.target_env {
            if is_core_module(target) {
                return Ok(FileName::Custom(format!("node:{}", target)));
            }
        }

        // Aliases allow browser shims to be renamed so we can
        // map `stream` to `stream-browserify` for example
        let target = if let Some(alias) = self.alias.get(target) {
            &alias[..]
        } else {
            target
        };

        let target_path = Path::new(target);

        let file_name = {
            if target_path.is_absolute() {
                let path = PathBuf::from(target_path);
                self.resolve_as_file(&path)
                    .or_else(|_| self.resolve_as_directory(&path))
                    .and_then(|p| self.wrap(p))
            } else {
                let mut components = target_path.components();

                if let Some(Component::CurDir | Component::ParentDir) = components.next() {
                    #[cfg(windows)]
                    let path = {
                        let base_dir = BasePath::new(base_dir).unwrap();
                        base_dir
                            .join(target.replace('/', "\\"))
                            .normalize_virtually()
                            .unwrap()
                            .into_path_buf()
                    };
                    #[cfg(not(windows))]
                    let path = base_dir.join(target);
                    self.resolve_as_file(&path)
                        .or_else(|_| self.resolve_as_directory(&path))
                        .and_then(|p| self.wrap(p))
                } else {
                    self.resolve_node_modules(base_dir, target)
                        .and_then(|path| {
                            let file_path = path.context("Impossible to get the node_modules path");
                            let current_directory = current_dir()?;
                            let relative_path = diff_paths(file_path?, current_directory);
                            self.wrap(relative_path)
                        })
                }
            }
        }
        .and_then(|v| {
            // Handle path references for the `browser` package config
            if let TargetEnv::Browser = self.target_env {
                if let FileName::Real(path) = &v {
                    if let Some(pkg_base) = find_package_root(base) {
                        if let Some(item) = BROWSER_CACHE.get(&pkg_base) {
                            let value = item.value();
                            if value.ignores.contains(path) {
                                return Ok(FileName::Custom(path.display().to_string()));
                            }
                            if let Some(rewrite) = value.rewrites.get(path) {
                                return self.wrap(Some(rewrite.to_path_buf()));
                            }
                        }
                    }
                }
            }
            Ok(v)
        });

        file_name
    }
}
