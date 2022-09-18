use swc_core::{
    ecma::ast::*,
    plugin::{metadata::TransformPluginProgramMetadata, plugin_transform},
};

#[plugin_transform]
pub fn process(program: Program, metadata: TransformPluginProgramMetadata) -> Program {
    program
}
