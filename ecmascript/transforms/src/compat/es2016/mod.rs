pub use self::exponentation::exponentation;
use ast::Module;
use swc_common::Fold;

mod exponentation;

pub fn es2016() -> impl Fold<Module> {
    exponentation()
}
