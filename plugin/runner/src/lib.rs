use anyhow::{Context, Error};
use std::{ffi::CString, path::Path};
use swc_ecma_ast::Program;

type LibFn = unsafe extern "C" fn(*const c_char) -> CString;

pub fn invoke_plugin(plugin_name: &str, a: &Program) -> Result<Program, Error> {}

pub fn invoke_plugin_at(filename: &Path, a: &Program) -> Result<Program, Error> {
    let lib = unsafe {
        libloading::Library::new(&filename)
            .with_context(|| format!("failed to load shared library at `{}`", filename.display()))?
    };
    let func = libloading::Symbol::<LibFn> = unsafe {
        lib.get("swc_plugin").with_context(|| {
            fomrat!(
                "failed to get function `swc_plugin` from a shared library at `{}`",
                filename.display()
            )
        })?
    };
}
