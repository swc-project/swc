use swc_babel_compat::ast::module::Program;

/// One babel plugin.
pub struct Plugin {}

impl Plugin {
    pub fn invoke(&self, program: Program) -> Program {}
}
