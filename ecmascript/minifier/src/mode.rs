use swc_ecma_ast::Lit;
use swc_ecma_utils::Id;

pub(crate) trait Mode: Send + Sync {
    fn store(&self, id: Id, value: &Lit);
}

pub struct Minification;

impl Mode for Minification {
    fn store(&self, _: Id, _: &Lit) {}
}
