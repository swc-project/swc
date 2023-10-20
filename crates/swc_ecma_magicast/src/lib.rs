pub struct ModuleNode<'a> {
    pub exports: ModuleExports<'a>,
}

pub struct ModuleExports<'a> {
    pub default: OptionalNode<ExportItemNode<'a>>,
}

pub struct OptionalNode<T> {
    node: Option<T>,
}

pub struct ExportItemNode<'a> {}

fn usage() {
    let m: ModuleNode;
}
