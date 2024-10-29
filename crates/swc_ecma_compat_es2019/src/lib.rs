use swc_ecma_ast::Pass;

pub use self::optional_catch_binding::optional_catch_binding;

mod optional_catch_binding;

pub fn es2019() -> impl Pass {
    optional_catch_binding()
}
