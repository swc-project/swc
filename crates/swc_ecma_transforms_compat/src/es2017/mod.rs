use swc_ecma_visit::Fold;

pub use self::async_to_generator::async_to_generator;

mod async_to_generator;

pub fn es2017() -> impl Fold {
    async_to_generator()
}
