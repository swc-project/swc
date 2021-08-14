use abi_stable::{
    library::RootModule,
    std_types::{RResult, RStr, RString},
};
use anyhow::{anyhow, Context, Error};
use std::path::Path;
use swc_ecma_ast::Program;
use swc_plugin::SwcPluginRef;

pub fn apply_js_plugin(program: &Program, path: &Path) -> Result<Program, Error> {
    (|| -> Result<_, Error> {
        let plugin = SwcPluginRef::load_from_file(path).context("failed to load plugin")?;

        let config_json = "{}";
        let ast_json =
            serde_json::to_string(&program).context("failed to serialize program as json")?;

        let plugin_fn = plugin
            .process_js()
            .ok_or_else(|| anyhow!("the plugin does not support transforming js"))?;

        let new_ast = plugin_fn(RStr::from(config_json), RString::from(ast_json));

        let new = match new_ast {
            RResult::ROk(v) => v,
            RResult::RErr(err) => return Err(anyhow!("plugin returned an errror\n{}", err)),
        };
        let new = new.into_string();

        let new = serde_json::from_str(&new)
            .with_context(|| format!("plugin generated invalid ast: `{}`", new))?;

        Ok(new)
    })()
    .with_context(|| {
        format!(
            "failed to invoke `{}` as js transform plugin",
            path.display()
        )
    })
}
