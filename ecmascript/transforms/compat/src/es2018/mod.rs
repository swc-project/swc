pub use self::object_rest_spread::object_rest_spread;
use swc_ecma_visit::Fold;

mod object_rest_spread;

pub fn es2018() -> impl Fold {
    object_rest_spread()
}
