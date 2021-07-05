use anyhow::{Context, Error};
use std::{ffi::CString, os::raw::c_char, path::Path};
use swc_ecma_ast::Program;

type LibFn = unsafe extern "C" fn(*const c_char, *const c_char) -> CString;

pub fn invoke_plugin(plugin_name: &str, options: &str, ast: &Program) -> Result<Program, Error> {}

pub fn invoke_plugin_at(filename: &Path, options: &str, ast: &Program) -> Result<Program, Error> {
    (|| -> Result<_, Error> {
        let ast_json =
            serde_json::to_string(&ast).context("failed to serialize input ast as json")?;

        let lib = unsafe {
            libloading::Library::new(&filename).context("failed to load a shared library")?
        };
        let func: libloading::Symbol<LibFn> = unsafe {
            lib.get(b"swc_plugin")
                .context("failed to get function `swc_plugin` from a shared library")?
        };

        let output = func();
        let output = output
            .into_string()
            .context("failed to decode output from plugin as utf8 string")?;

        let output =
            serde_json::from_str(&output).context("failde to deserialize output from plugin")?;
    })()
    .with_context(|| format!("failed to invoke swc plugin at `{}`", filename.display()))?
}
