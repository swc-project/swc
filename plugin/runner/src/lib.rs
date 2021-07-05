use anyhow::Error;
use swc_ecma_ast::Program;

pub fn invoke_plugin(plugin_name: &str, a: &Program) -> Result<Program, Error> {}
