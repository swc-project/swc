//! Faster version of node-resolve.
//!
//! See: https://github.com/goto-bus-stop/node-resolve

use anyhow::{bail, Context, Error};
use serde::Deserialize;
use std::{
    fs::File,
    io::BufReader,
    path::{Path, PathBuf},
};
use swc_bundler::Resolve;
use swc_common::FileName;

#[derive(Deserialize)]
struct PackageJson {
    #[serde(rename = "swc-main", default)]
    swc_main: Option<String>,
    #[serde(default)]
    esnext: Option<String>,
    #[serde(default)]
    main: Option<String>,
}

pub struct NodeResolver;

static EXTENSIONS: &[&str] = &["ts", "tsx", "js", "jsx", "json", "node"];

impl NodeResolver {
    pub fn new() -> Self {
        Self
    }

    fn wrap(&self, path: PathBuf) -> Result<FileName, Error> {
        Ok(FileName::Real(
            path.canonicalize().context("failaed to canonicalize")?,
        ))
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

        bail!("not found")
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
        // TODO how to not always initialise this here?
        let root = PathBuf::from("/");
        let pkg_dir = pkg_path.parent().unwrap_or(&root);
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
            let ext_path = path.join(format!("index{}", ext));
            if ext_path.is_file() {
                return Ok(ext_path);
            }
        }

        bail!("not found")
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
}

impl Resolve for NodeResolver {
    fn resolve(&self, base: &FileName, target: &str) -> Result<FileName, Error> {
        let base = match base {
            FileName::Real(v) => v,
            _ => bail!("node-resolver supports only files"),
        };

        // Absolute path
        if target.starts_with("/") {
            let base_dir = &Path::new("/");

            let path = base_dir.join(target);
            return self
                .resolve_as_file(&path)
                .or_else(|_| self.resolve_as_directory(&path))
                .and_then(|p| self.wrap(p));
        }

        let cwd = &Path::new(".");
        let base_dir = base.parent().unwrap_or(&cwd);

        if target.starts_with("./") || target.starts_with("../") {
            let path = base_dir.join(target);
            return self
                .resolve_as_file(&path)
                .or_else(|_| self.resolve_as_directory(&path))
                .and_then(|p| self.wrap(p));
        }

        self.resolve_node_modules(base_dir, target)
            .and_then(|p| self.wrap(p))
    }
}
