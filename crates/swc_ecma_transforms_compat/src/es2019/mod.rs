use swc_ecma_visit::Fold;

pub use self::optional_catch_binding::optional_catch_binding;

mod optional_catch_binding;

pub fn es2019() -> impl Fold {
    optional_catch_binding()
}
