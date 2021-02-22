//! Faster version of node-resolve.
//!
//! See: https://github.com/goto-bus-stop/node-resolve

use anyhow::{bail, Context, Error};
use lru::LruCache;
#[cfg(windows)]
use normpath::BasePath;
// use path_slash::{PathBufExt, PathExt};
use serde::Deserialize;
use std::{
    fs::File,
    io::BufReader,
    path::{Component, Path, PathBuf},
    sync::Mutex,
};

use swc_bundler::Resolve;
use swc_common::FileName;

pub(crate) fn is_core_module(s: &str) -> bool {
    match s {
        "assert" | "buffer" | "child_process" | "console" | "cluster" | "crypto" | "dgram"
        | "dns" | "events" | "fs" | "http" | "http2" | "https" | "net" | "os" | "path"
        | "perf_hooks" | "process" | "querystring" | "readline" | "repl" | "stream"
        | "string_decoder" | "timers" | "tls" | "tty" | "url" | "util" | "v8" | "vm" | "wasi"
        | "worker" | "zlib" => true,
        _ => false,
    }
}

#[derive(Deserialize)]
struct PackageJson {
    #[serde(rename = "swc-main", default)]
    swc_main: Option<String>,
    #[serde(default)]
    esnext: Option<String>,
    #[serde(default)]
    main: Option<String>,
}

pub struct NodeResolver {
    cache: Mutex<LruCache<(PathBuf, String), PathBuf>>,
}

static EXTENSIONS: &[&str] = &["ts", "tsx", "js", "jsx", "json", "node"];

impl NodeResolver {
    pub fn new() -> Self {
        Self {
            cache: Mutex::new(LruCache::new(40)),
        }
    }

    fn wrap(&self, base: &PathBuf, target: &str, path: PathBuf) -> Result<FileName, Error> {
        let path = path.canonicalize().context("failed to canonicalize")?;
        self.store(base, target, path.clone());
        Ok(FileName::Real(path))
    }

    /// Resolve a path as a file. If `path` refers to a file, it is returned;
    /// otherwise the `path` + each extension is tried.
    fn resolve_as_file(&self, path: &Path) -> Result<PathBuf, Error> {
        // 1. If X is a file, load X as JavaScript text.
        if path.is_file() {
            return Ok(path.to_path_buf());
        }

        for ext in EXTENSIONS {
            let ext_path = path.with_extension(ext);
            if ext_path.is_file() {
                return Ok(ext_path);
            }
        }

        bail!("file not found: {}", path.display())
    }

    /// Resolve a path as a directory, using the "main" key from a package.json
    /// file if it exists, or resolving to the index.EXT file if it exists.
    fn resolve_as_directory(&self, path: &PathBuf) -> Result<PathBuf, Error> {
        // 1. If X/package.json is a file, use it.
        let pkg_path = path.join("package.json");
        if pkg_path.is_file() {
            let main = self.resolve_package_main(&pkg_path);
            if main.is_ok() {
                return main;
            }
        }

        // 2. LOAD_INDEX(X)
        self.resolve_index(path)
    }

    /// Resolve using the package.json "main" key.
    fn resolve_package_main(&self, pkg_path: &PathBuf) -> Result<PathBuf, Error> {
        let pkg_dir = pkg_path.parent().unwrap_or_else(|| Path::new("/"));
        let file = File::open(pkg_path)?;
        let reader = BufReader::new(file);
        let pkg: PackageJson =
            serde_json::from_reader(reader).context("failed to deserialize package.json")?;

        for main in &[&pkg.swc_main, &pkg.esnext, &pkg.main] {
            if let Some(target) = main {
                let path = pkg_dir.join(target);
                return self
                    .resolve_as_file(&path)
                    .or_else(|_| self.resolve_as_directory(&path));
            }
        }

        bail!("package.json does not contain a \"main\" string")
    }

    /// Resolve a directory to its index.EXT.
    fn resolve_index(&self, path: &PathBuf) -> Result<PathBuf, Error> {
        // 1. If X/index.js is a file, load X/index.js as JavaScript text.
        // 2. If X/index.json is a file, parse X/index.json to a JavaScript object.
        // 3. If X/index.node is a file, load X/index.node as binary addon.
        for ext in EXTENSIONS {
            let ext_path = path.join(format!("index.{}", ext));
            if ext_path.is_file() {
                return Ok(ext_path);
            }
        }

        bail!("index not found: {}", path.display())
    }

    /// Resolve by walking up node_modules folders.
    fn resolve_node_modules(&self, base_dir: &Path, target: &str) -> Result<PathBuf, Error> {
        let node_modules = base_dir.join("node_modules");
        if node_modules.is_dir() {
            let path = node_modules.join(target);
            let result = self
                .resolve_as_file(&path)
                .or_else(|_| self.resolve_as_directory(&path));
            if result.is_ok() {
                return result;
            }
        }

        match base_dir.parent() {
            Some(parent) => self.resolve_node_modules(parent, target),
            None => bail!("not found"),
        }
    }

    fn store(&self, base: &PathBuf, target: &str, result: PathBuf) {
        let lock = self.cache.lock();
        match lock {
            Ok(mut lock) => {
                lock.put((base.clone(), target.to_string()), result.to_path_buf());
            }
            Err(_) => {}
        }
    }
}

impl Resolve for NodeResolver {
    fn resolve(&self, base: &FileName, target: &str) -> Result<FileName, Error> {
        if is_core_module(target) {
            return Ok(FileName::Custom(target.to_string()));
        }

        let base = match base {
            FileName::Real(v) => v,
            _ => bail!("node-resolver supports only files"),
        };

        {
            let lock = self.cache.lock();
            match lock {
                Ok(mut lock) => {
                    //
                    if let Some(v) = lock.get(&(base.clone(), target.to_string())) {
                        return Ok(FileName::Real(v.clone()));
                    }
                }
                Err(_) => {}
            }
        }
        let target_path = Path::new(target);

        if target_path.is_absolute() {
            let path = PathBuf::from(target_path);
            return self
                .resolve_as_file(&path)
                .or_else(|_| self.resolve_as_directory(&path))
                .and_then(|p| self.wrap(base, target, p));
        }

        let cwd = &Path::new(".");
        let base_dir = base.parent().unwrap_or(&cwd);
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
            return self
                .resolve_as_file(&path)
                .or_else(|_| self.resolve_as_directory(&path))
                .and_then(|p| self.wrap(base, target, p));
        }

        self.resolve_node_modules(base_dir, target)
            .and_then(|p| self.wrap(base, target, p))
    }
}
