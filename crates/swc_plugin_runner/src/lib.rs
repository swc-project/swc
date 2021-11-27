use abi_stable::{
    library::RootModule,
    std_types::{RResult, RStr},
};
use anyhow::{anyhow, Context, Error};
use rplugin::StableAst;
use std::path::Path;
use swc_ecma_ast::Program;
use swc_plugin_js_api::SwcJsPluginRef;

mod resolve;

pub fn apply_js_plugin(
    plugin_name: &str,
    path: &Path,
    config_json: &str,
    program: Program,
) -> Result<Program, Error> {
    (|| -> Result<_, Error> {
        let plugin_rt = swc_common::plugin::get_runtime_for_plugin(plugin_name.to_string());

        let plugin = SwcJsPluginRef::load_from_file(path).context("failed to load plugin")?;

        let plugin_ast = StableAst::from_unstable(program);

        let plugin_fn = plugin
            .process_js()
            .ok_or_else(|| anyhow!("the plugin does not support transforming js"))?;

        let new_ast = plugin_fn(plugin_rt, RStr::from(config_json), plugin_ast);

        let new = match new_ast {
            RResult::ROk(v) => v,
            RResult::RErr(err) => return Err(anyhow!("plugin returned an error\n{}", err)),
        };
        let new: Program = new.into_unstable();

        Ok(new)
    })()
    .with_context(|| {
        format!(
            "failed to invoke `{}` as js transform plugin",
            path.display()
        )
    })
}
