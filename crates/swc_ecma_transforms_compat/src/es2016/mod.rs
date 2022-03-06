use swc_ecma_visit::Fold;

pub use self::exponentation::exponentation;

mod exponentation;

#[tracing::instrument(level = "trace", skip_all)]
pub fn es2016() -> impl Fold {
    exponentation()
}
