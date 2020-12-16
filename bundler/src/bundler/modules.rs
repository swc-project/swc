use swc_ecma_ast::ModuleItem;

#[derive(Debug)]
pub struct Modules {
    // We will change this into `Vec<Module>`.
    body: Vec<ModuleItem>,
}

impl Modules {}
