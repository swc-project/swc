//! Faster version of node-resolve.
//!
//! See: https://github.com/goto-bus-stop/node-resolve

use crate::resolve::Resolve;
use anyhow::{bail, Context, Error};
use fxhash::FxHashMap;
#[cfg(windows)]
use normpath::BasePath;
use serde::Deserialize;
use std::{
    fs::File,
    io::BufReader,
    path::{Component, Path, PathBuf},
};
use swc_common::FileName;
use swc_ecma_ast::TargetEnv;

use dashmap::{DashMap, DashSet};
use once_cell::sync::Lazy;

static BROWSER_BUCKETS: Lazy<DashMap<PathBuf, BrowserCache>> = Lazy::new(Default::default);

#[derive(Debug, Default)]
struct BrowserCache {
    rewrites: DashMap<PathBuf, PathBuf>,
    ignores: DashSet<PathBuf>,
}

fn find_package_root(path: &PathBuf) -> Option<PathBuf> {
    let mut parent = path.parent();
    while let Some(p) = parent {
        let pkg = p.join("package.json");
        if pkg.is_file() {
            return Some(p.to_path_buf());
        }
        parent = p.parent();
    }
    None
}

// Run `node -p "require('module').builtinModules"`
pub(crate) fn is_core_module(s: &str) -> bool {
    match s {
        "_http_agent"
        | "_http_client"
        | "_http_common"
        | "_http_incoming"
        | "_http_outgoing"
        | "_http_server"
        | "_stream_duplex"
        | "_stream_passthrough"
        | "_stream_readable"
        | "_stream_transform"
        | "_stream_wrap"
        | "_stream_writable"
        | "_tls_common"
        | "_tls_wrap"
        | "assert"
        | "assert/strict"
        | "async_hooks"
        | "buffer"
        | "child_process"
        | "cluster"
        | "console"
        | "constants"
        | "crypto"
        | "dgram"
        | "diagnostics_channel"
        | "dns"
        | "dns/promises"
        | "domain"
        | "events"
        | "fs"
        | "fs/promises"
        | "http"
        | "http2"
        | "https"
        | "inspector"
        | "module"
        | "net"
        | "os"
        | "path"
        | "path/posix"
        | "path/win32"
        | "perf_hooks"
        | "process"
        | "punycode"
        | "querystring"
        | "readline"
        | "repl"
        | "stream"
        | "stream/promises"
        | "string_decoder"
        | "sys"
        | "timers"
        | "timers/promises"
        | "tls"
        | "trace_events"
        | "tty"
        | "url"
        | "util"
        | "util/types"
        | "v8"
        | "vm"
        | "wasi"
        | "worker_threads"
        | "zlib" => true,
        _ => false,
    }
}

#[derive(Deserialize)]
struct PackageJson {
    #[serde(default)]
    main: Option<String>,
    #[serde(default)]
    browser: Option<Browser>,
}

#[derive(Deserialize)]
#[serde(untagged)]
enum Browser {
    Str(String),
    Obj(FxHashMap<String, StringOrBool>),
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
    alias: FxHashMap<String, String>,
}

static EXTENSIONS: &[&str] = &["ts", "tsx", "js", "jsx", "json", "node"];

impl NodeModulesResolver {
    /// Create a node modules resolver for the target runtime environment.
    pub fn new(target_env: TargetEnv, alias: FxHashMap<String, String>) -> Self {
        Self { target_env, alias }
    }

    fn wrap(&self, path: Option<PathBuf>) -> Result<FileName, Error> {
        if let Some(path) = path {
            let path = path.canonicalize().context("failed to canonicalize")?;
            return Ok(FileName::Real(path));
        }
        bail!("index not found")
    }

    /// Resolve a path as a file. If `path` refers to a file, it is returned;
    /// otherwise the `path` + each extension is tried.
    fn resolve_as_file(&self, path: &Path) -> Result<Option<PathBuf>, Error> {
        if path.is_file() {
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
        }

        bail!("file not found")
    }

    /// Resolve a path as a directory, using the "main" key from a package.json
    /// file if it exists, or resolving to the index.EXT file if it exists.
    fn resolve_as_directory(&self, path: &PathBuf) -> Result<Option<PathBuf>, Error> {
        let pkg_path = path.join("package.json");
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
        pkg_dir: &PathBuf,
        pkg_path: &PathBuf,
    ) -> Result<Option<PathBuf>, Error> {
        let file = File::open(pkg_path)?;
        let reader = BufReader::new(file);
        let pkg: PackageJson = serde_json::from_reader(reader)
            .context(format!("failed to deserialize {}", pkg_path.display()))?;

        let main_fields = match self.target_env {
            TargetEnv::Node => {
                vec![pkg.main.as_ref().clone()]
            }
            TargetEnv::Browser => {
                if let Some(browser) = &pkg.browser {
                    match browser {
                        Browser::Str(path) => {
                            vec![Some(path), pkg.main.as_ref().clone()]
                        }
                        Browser::Obj(map) => {
                            let bucket = BROWSER_BUCKETS
                                .entry(pkg_dir.to_path_buf())
                                .or_insert(Default::default());

                            for (k, v) in map {
                                let target_key = Path::new(k);
                                let mut components = target_key.components();

                                // Relative file paths are sources for this package
                                let source = if let Some(Component::CurDir) = components.next() {
                                    pkg_dir.join(k).canonicalize().ok()
                                } else {
                                    // FIXME: handle this
                                    pkg_dir.join(k).canonicalize().ok()
                                };

                                if let Some(source) = source {
                                    match v {
                                        StringOrBool::Str(dest) => {
                                            let target = pkg_dir
                                                .join(dest)
                                                .canonicalize()
                                                .context(format!(
                                                    "failed to canonicalize browser value {} for \
                                                     key {} in {}",
                                                    dest,
                                                    k,
                                                    pkg_dir.display()
                                                ))?;

                                            bucket.rewrites.insert(source, target);
                                        }
                                        StringOrBool::Bool(flag) => {
                                            // If somebody set boolean `true` which is an
                                            // invalid value we will just ignore it
                                            if !flag {
                                                bucket.ignores.insert(source);
                                            }
                                        }
                                    }
                                }
                            }
                            vec![pkg.main.as_ref().clone()]
                        }
                    }
                } else {
                    vec![pkg.main.as_ref().clone()]
                }
            }
        };

        for main in main_fields {
            if let Some(target) = main {
                let path = pkg_dir.join(target);
                return self
                    .resolve_as_file(&path)
                    .or_else(|_| self.resolve_as_directory(&path));
            }
        }

        Ok(None)
    }

    /// Resolve by walking up node_modules folders.
    fn resolve_node_modules(
        &self,
        base_dir: &Path,
        target: &str,
    ) -> Result<Option<PathBuf>, Error> {
        let mut path = Some(base_dir);
        while let Some(dir) = path {
            let node_modules = dir.join("node_modules");
            if node_modules.is_dir() {
                let path = node_modules.join(target);
                if let Some(result) = self
                    .resolve_as_file(&path)
                    .or_else(|_| self.resolve_as_directory(&path))?
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
        log::debug!(
            "Resolve {} from {:#?} for {:#?}",
            target,
            base,
            self.target_env
        );

        let target = if let Some(alias) = self.alias.get(target) {
            &alias[..]
        } else {
            target
        };

        let base = match base {
            FileName::Real(v) => v,
            _ => bail!("node-resolver supports only files"),
        };

        let cwd = &Path::new(".");
        let base_dir = base.parent().unwrap_or(&cwd);

        let target_path = Path::new(target);

        let file_name = {
            if let TargetEnv::Node = self.target_env {
                if is_core_module(target) {
                    return Ok(FileName::Custom(target.to_string()));
                }
            }

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
                        .and_then(|p| self.wrap(p))
                }
            }
        }
        .and_then(|v| {
            if let TargetEnv::Browser = self.target_env {
                if let FileName::Real(path) = &v {
                    if let Some(pkg_base) = find_package_root(base) {
                        if let Some(item) = BROWSER_BUCKETS.get(&pkg_base) {
                            let value = item.value();
                            if value.ignores.contains(path) {
                                return Ok(FileName::Custom("ignored path".into()));
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
