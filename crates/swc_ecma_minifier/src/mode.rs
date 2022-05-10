use swc_ecma_ast::*;

pub(crate) trait Mode: Send + Sync {
    fn store(&self, id: Id, value: &Expr);

    /// If this returns true, template literals with `\n` or `\r` will be
    /// converted to [Lit::Str].
    fn force_str_for_tpl() -> bool;
}

pub struct Minification;

impl Mode for Minification {
    fn store(&self, _: Id, _: &Expr) {}

    fn force_str_for_tpl() -> bool {
        false
    }
}
