pub use self::exponentation::exponentation;
use swc_ecma_visit::Fold;

mod exponentation;

pub fn es2016() -> impl Fold {
    exponentation()
}
