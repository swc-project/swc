use swc_ecma_visit::Fold;

pub use self::exponentiation::exponentiation;

mod exponentiation;

#[tracing::instrument(level = "info", skip_all)]
pub fn es2016() -> impl Fold {
    exponentiation()
}
