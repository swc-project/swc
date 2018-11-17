pub use self::exponentation::Exponentation;
use ast::Module;
use swc_common::Fold;

mod exponentation;

pub fn es2016() -> impl Fold<Module> {
    Exponentation
}
