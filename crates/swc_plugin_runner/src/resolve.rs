use anyhow::{anyhow, bail, Context, Error};
use serde::Deserialize;
use std::{
    env::current_dir,
    fs::read_to_string,
    path::{Path, PathBuf},
    sync::Arc,
};

/// TODO: Cache
pub fn resolve(name: &str) -> Result<Arc<PathBuf>, Error> {
    let cwd = current_dir().context("failed to get current directory")?;
    let mut dir = Some(&*cwd);

    while let Some(base_dir) = dir {
        if let Ok(Some(path)) = check_node_modules(&base_dir, name) {
            return Ok(Arc::new(path));
        }

        dir = cwd.parent();
    }

    bail!("failed to resolve plugin `{}`", name)
}

#[derive(Deserialize)]
struct PkgJson {
    main: String,
}

fn read_main_field(dir: &Path, json_path: &Path) -> Result<PathBuf, Error> {
    let json_str = read_to_string(&json_path)?;
    let json: PkgJson = serde_json::from_str(&json_str)?;

    Ok(dir.join(&json.main))
}

fn pkg_name_without_scope(pkg_name: &str) -> &str {
    if pkg_name.contains("/") {
        pkg_name.split("/").nth(1).unwrap()
    } else {
        pkg_name
    }
}

const fn is_musl() -> bool {
    cfg!(target_env = "musl")
}

fn resolve_using_package_json(dir: &Path, pkg_name: &str) -> Result<PathBuf, Error> {
    let node_modules = dir
        .parent()
        .ok_or_else(|| anyhow!("cannot resolve plugin in root directory"))?;

    let pkg_json = dir.join("package.json");
    let json = read_to_string(&pkg_json).context("failed to read package.json of main package")?;

    let pkg: serde_json::Value =
        serde_json::from_str(&json).context("failed to parse package.json of main package")?;

    let pkg_obj = pkg
        .as_object()
        .ok_or_else(|| anyhow!("package.json is not an object"))?;

    let opt_deps = pkg_obj
        .get("optionalDependencies")
        .ok_or_else(|| anyhow!("package.json does not contain optionalDependencies"))?
        .as_object()
        .ok_or_else(|| anyhow!("`optionalDependencies` of main package.json is not an object"))?;

    for dep_pkg_name in opt_deps.keys() {
        if dep_pkg_name.starts_with(&pkg_name) {
            if is_musl() && !dep_pkg_name.contains("musl") {
                continue;
            }

            let dep_pkg_dir_name = pkg_name_without_scope(&dep_pkg_name);

            let dep_pkg = node_modules.join(dep_pkg_dir_name);

            if dep_pkg.exists() {
                return read_main_field(&dep_pkg, &dep_pkg.join("package.json"));
            }
        }
    }

    todo!("JSON: {}", json)
}

fn check_node_modules(base_dir: &Path, name: &str) -> Result<Option<PathBuf>, Error> {
    let modules_dir = base_dir.join("node_modules");
    if !modules_dir.is_dir() {
        return Ok(None);
    }

    if !name.contains("@") {
        let swc_plugin_dir = modules_dir.join("@swc").join(format!("plugin-{}", name));
        if swc_plugin_dir.is_dir() {
            return Ok(Some(resolve_using_package_json(
                &swc_plugin_dir,
                &format!("@swc/plugin-{}", name),
            )?));
        }
    }

    todo!("resolve: Non-official plugins: {}", name)
}
