use swc_core::{
    css::ast::Stylesheet,
    plugin::{css_plugin_transform, metadata::TransformPluginProgramMetadata},
};

#[css_plugin_transform]
pub fn process(program: Stylesheet, metadata: TransformPluginProgramMetadata) -> Stylesheet {
    program
}
