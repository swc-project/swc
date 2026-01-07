use swc_ecma_ast::*;

pub(crate) trait Mode: Send + Sync {
    fn store(&self, id: Id, value: &Expr);

    fn preserve_vars(&self) -> bool;

    fn should_be_very_correct(&self) -> bool;
}

pub struct Minification;

impl Mode for Minification {
    fn store(&self, _: Id, _: &Expr) {}

    fn preserve_vars(&self) -> bool {
        false
    }

    fn should_be_very_correct(&self) -> bool {
        true
    }
}
