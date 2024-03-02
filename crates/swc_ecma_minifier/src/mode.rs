use swc_ecma_ast::*;

pub(crate) trait Mode: Send + Sync {
    fn store(&self, id: Id, value: &Expr);

    fn preserve_vars(&self) -> bool;

    fn should_be_very_correct(&self) -> bool;

    /// If this returns true, template literals with `\n` or `\r` will be
    /// converted to [Lit::Str].
    fn force_str_for_tpl(&self) -> bool;
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

    fn force_str_for_tpl(&self) -> bool {
        false
    }
}
