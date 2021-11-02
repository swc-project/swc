use abi_stable::{
    library::RootModule,
    std_types::{RResult, RStr},
};
use anyhow::{anyhow, Context, Error};
use std::path::Path;
use swc_common::plugin::{deserialize_for_plugin, serialize_for_plugin};
use anyhow::{anyhow, bail, Context, Error};
use std::{
    env::current_dir,
    fs::read_to_string,
    path::{Path, PathBuf},
};
use swc_ecma_ast::Program;
use swc_plugin_api::{deserialize_ast, serialize_ast, SwcPluginRef};

pub fn apply_js_plugin(
    plugin_name: &str,
    path: &Path,
    config_json: &str,
    program: &Program,
) -> Result<Program, Error> {
    (|| -> Result<_, Error> {
        let plugin_rt = swc_common::plugin::get_runtime_for_plugin(plugin_name.to_string());

        let plugin = SwcPluginRef::load_from_file(path).context("failed to load plugin")?;

        let ast_serde = serialize_ast(&program).context("failed to serialize ast")?;

        let plugin_fn = plugin
            .process_js()
            .ok_or_else(|| anyhow!("the plugin does not support transforming js"))?;

        let new_ast = plugin_fn(plugin_rt, RStr::from(config_json), ast_serde.into());

        let new = match new_ast {
            RResult::ROk(v) => v,
            RResult::RErr(err) => return Err(anyhow!("plugin returned an error\n{}", err)),
        };
        let new: Program = deserialize_ast(new.as_slice())
            .with_context(|| format!("plugin generated invalid ast`"))?;

        Ok(new)
    })()
    .with_context(|| {
        format!(
            "failed to invoke `{}` as js transform plugin",
            path.display()
        )
    })
}

pub fn resolve(name: &str) -> Result<PathBuf, Error> {
    fn resolve_using_package_json(dir: &Path) -> Result<PathBuf, Error> {
        let pkg_json = dir.join("package.json");
        let json =
            read_to_string(&pkg_json).context("failed to read package.json of main package")?;

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
                return Ok(Some(resolve_using_package_json(&swc_plugin_dir)?));
            }
        }

        todo!("resolve: Non-official plugins: {}", name)
    }

    let cwd = current_dir().context("failed to get current directory")?;
    let mut dir = Some(&*cwd);

    while let Some(base_dir) = dir {
        if let Ok(Some(path)) = check_node_modules(&base_dir, name) {
            return Ok(path);
        }

        dir = cwd.parent();
    }

    bail!("failed to resolve plugin `{}`", name)
}
