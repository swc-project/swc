use anyhow::{Context, Error};
use std::path::Path;
use swc_ecma_ast::Program;

pub mod resolve;

pub fn apply_js_plugin(
    plugin_name: &str,
    path: &Path,
    _config_json: &str,
    program: Program,
) -> Result<Program, Error> {
    (|| -> Result<_, Error> {
        let _plugin_rt = swc_common::plugin::get_runtime_for_plugin(plugin_name.to_string());
        //TODO: https://github.com/swc-project/swc/issues/3167
        Ok(program)
    })()
    .with_context(|| {
        format!(
            "failed to invoke `{}` as js transform plugin",
            path.display()
        )
    })
}
