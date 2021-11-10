pub use self::optional_catch_binding::optional_catch_binding;
use swc_ecma_visit::Fold;

mod optional_catch_binding;

pub fn es2019() -> impl Fold {
    optional_catch_binding()
}
